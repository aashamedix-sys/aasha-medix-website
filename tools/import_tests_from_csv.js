#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from '../src/lib/customSupabaseClient.js';

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
        // handle escaped quote
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

async function upsertTests(rows) {
  const payload = rows.map(r => {
    // Support multiple header conventions (case-insensitive)
    const get = (obj, keys) => {
      for (const k of keys) {
        if (obj[k] != null && String(obj[k]).length) return obj[k];
      }
      return null;
    };
    const code = get(r, ['code','Code']);
    const name = get(r, ['name','Name','Test Name']);
    const category = get(r, ['category','Category']) || null; // optional
    const mrpRaw = get(r, ['mrp','MRP']);
    const sample = get(r, ['sample_type','Sample','sample']);
    const tat = get(r, ['tat','TAT']);
    const desc = get(r, ['description','Description']);
    const active = get(r, ['is_active','active']) ?? 'true';

    return {
      code: code || null,
      name: name || null,
      category,
      mrp: mrpRaw ? Number(String(mrpRaw).replace(/[^0-9.]/g,'')) : null,
      sample_type: sample || null,
      tat: tat || null,
      is_active: String(active).toLowerCase() === 'true',
      description: desc || null,
    };
  }).filter(x => x && x.name);

  const { error, count } = await supabase.from('tests').upsert(payload, { onConflict: 'code' });
  if (error) throw error;
  return payload.length;
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error('Usage: node tools/import_tests_from_csv.js <path-to-csv>');
    process.exit(1);
  }
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found:', csvPath);
    process.exit(1);
  }
  const text = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCSV(text);
  console.log(`Parsed ${rows.length} rows. Importing to Supabase...`);
  const imported = await upsertTests(rows);
  console.log(`Successfully upserted ${imported} tests.`);
}

main().catch(err => { console.error('Import failed:', err); process.exit(1); });
