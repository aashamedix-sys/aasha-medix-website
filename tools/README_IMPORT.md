# AASHA MEDIX — Price List Data Import

Use this guide to update Supabase `tests` and `health_packages` tables from your PDF source.

## Option A — Quick Manual Import (Recommended)
1. Open the provided PDF: `AASHA-MEDIX-PRICE-LIST-final.pdf`.
2. Fill `data/tests_import_template.csv` with columns:
   - `code,name,category,mrp,sample_type,tat,is_active,description`
3. Fill `data/packages_import_template.csv` for health packages:
   - `code,name,mrp,tests_included,description,is_active`
4. In Supabase Dashboard → Table Editor:
   - Import `tests_import_template.csv` into `public.tests`
   - Import `packages_import_template.csv` into `public.health_packages`
5. Verify records are active (`is_active = true`).
6. Visit `/test-price-list` — the page reads live data from `public.tests`.

## Option B — Automated Parsing (Advanced)
If you prefer automation, create a CSV by parsing the PDF
using Node with `pdf-parse` and then import to Supabase.

```bash
# from repo root (e:\aasha\HORIZONS)
npm i pdf-parse @supabase/supabase-js
node tools/pdf_to_csv.js "C:\\Users\\aasha\\OneDrive\\Desktop\\AASHA-MEDIX-PRICE-LIST-final.pdf" data/tests_import.csv
```

Then import `data/tests_import.csv` via Supabase Dashboard.

## Notes
- The app’s `/test-price-list` page is the single source of truth.
- The legacy `PriceList.jsx` now redirects to `/test-price-list` to avoid duplication.
- Keep categories consistent (Blood, Urine, Thyroid, Diabetes, Vitamin, Liver, Kidney, Cardiac, Infection).
