#!/usr/bin/env node
// Service-role import for Supabase with RLS enabled.
// Usage:
//   SUPABASE_URL="https://<project>.supabase.co" \
//   SUPABASE_SERVICE_ROLE_KEY="<service-role-key>" \
//   node tools/import_tests_service_role.js path/to/tests.csv
// Notes:
// - Uses service role key (do NOT expose to client). Keep in .env.local or CI secrets.
// - Upserts into public.tests on conflict code.
// - Expects headers: Code, Test Name, Sample, Report Time, MRP
// - Ignores AQF entirely.

import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (!lines.length) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim()) continue;
    const values = [];
    let cur = '';
    let inQuotes = false;
    for (let j = 0; j < raw.length; j++) {
      const ch = raw[j];
      if (ch === '"') {
        if (inQuotes && raw[j+1] === '"') { cur += '"'; j++; continue; }
        inQuotes = !inQuotes; continue;
      }
      if (ch === ',' && !inQuotes) { values.push(cur); cur = ''; }
      else { cur += ch; }
    }
    values.push(cur);
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (values[idx] ?? '').trim(); });
    rows.push(obj);
  }
  return rows;
}

function mapCsvRows(rows) {
  return rows.map(r => {
    const get = (obj, keys) => {
      for (const k of keys) { if (obj[k] != null && String(obj[k]).length) return obj[k]; }
      return null;
    };
    const code = get(r, ['Code','code']);
    const name = get(r, ['Test Name','name']);
    const sample = get(r, ['Sample','sample','sample_type']);
    const tat = get(r, ['Report Time','report_time','TAT','tat']);
    const mrpRaw = get(r, ['MRP','mrp']);
    const mrp = mrpRaw ? Number(String(mrpRaw).replace(/[^0-9.]/g,'')) : null;
    const category = 'General';
    return {
      code: code || null,
      name: name || null,
      category,
      description: null,
      mrp,
      sample_type: sample,
      tat,
      is_active: true,
    };
  }).filter(t => t.name);
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error('Usage: node tools/import_tests_service_role.js <path-to-csv>');
    process.exit(1);
  }
  if (!fs.existsSync(csvPath)) {
    console.error('CSV not found:', csvPath);
    process.exit(1);
  }
  const text = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(text);
  const payload = mapCsvRows(rows);
  console.log(`Parsed ${payload.length} tests. Upserting into public.tests...`);
  const { error } = await supabase.from('tests').upsert(payload, { onConflict: 'code' });
  if (error) {
    console.error('Upsert failed:', error);
    process.exit(1);
  }
  console.log('Import complete.');
}

main().catch(err => { console.error(err); process.exit(1); });
