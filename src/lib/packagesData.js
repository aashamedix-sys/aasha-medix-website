// Data loader for Health Packages from CSV files
// Design decisions: keep parsing lightweight, support flexible headers,
// and merge Top-20 with full list, prioritizing Top-20 for highlighting.

export async function fetchPackages() {
  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/);
    if (!lines.length) return [];
    const headers = lines[0].split(',').map((h) => h.trim());
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
          if (inQuotes && raw[j + 1] === '"') { cur += '"'; j++; continue; }
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
  };

  const mapRow = (r) => {
    const get = (obj, keys) => {
      for (const k of keys) { if (obj[k] != null && String(obj[k]).length) return obj[k]; }
      return null;
    };
    const name = get(r, ['Package Name','Name','Package']);
    const testsSummary = get(r, ['Included Tests','Tests','Summary']);
    const sample = get(r, ['Sample Type','Sample','Specimen']);
    const tat = get(r, ['Report Time','TAT','Turnaround']);
    const mrpRaw = get(r, ['MRP','Price']);
    const mrp = mrpRaw ? Number(String(mrpRaw).replace(/[^0-9.]/g,'')) : null;
    return {
      id: name,
      name,
      testsSummary,
      sample,
      tat,
      mrp,
    };
  };

  const safeFetchText = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.text();
    } catch {
      return null;
    }
  };

  const top20Text = await safeFetchText('/assets/packages/top20_packages.csv');
  const profilesText = await safeFetchText('/assets/packages/profiles_packages.csv');

  const top20Rows = top20Text ? parseCSV(top20Text) : [];
  const profilesRows = profilesText ? parseCSV(profilesText) : [];

  const top20 = top20Rows.map(mapRow).filter(p => p.name);
  const profiles = profilesRows.map(mapRow).filter(p => p.name);

  const byName = new Map();
  for (const p of profiles) byName.set(p.name, { ...p, popular: false });
  for (const p of top20) byName.set(p.name, { ...p, popular: true });

  const merged = Array.from(byName.values()).sort((a,b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return (a.name || '').localeCompare(b.name || '');
  });

  return merged;
}
