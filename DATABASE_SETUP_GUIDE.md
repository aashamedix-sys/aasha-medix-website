# AASHA MEDIX BACKEND DATABASE SETUP

**Migration:** 1004_create_production_tables.sql  
**Status:** Ready to Execute  
**Date:** December 25, 2025

---

## 🚀 QUICK START

### Step 1: Execute SQL Migration

1. Open **Supabase Dashboard**: https://supabase.com/dashboard/project/wyytvrukflhphukmltvn
2. Go to **SQL Editor** (left sidebar)
3. Click **"+ New Query"**
4. Copy the **ENTIRE contents** of `migrations/1004_create_production_tables.sql`
5. Paste into SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. Wait for success message: ✅ "Success. No rows returned"

### Step 2: Verify Tables Created

Run this verification query:

```sql
SELECT tablename, schemaname 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('doctors', 'tests', 'bookings', 'doctor_bookings', 'leads', 'analytics', 'reports')
ORDER BY tablename;
```

**Expected Output:** 7 rows showing all tables

### Step 3: Verify Sample Data

```sql
SELECT COUNT(*) as doctor_count FROM public.doctors;
SELECT COUNT(*) as test_count FROM public.tests;
```

**Expected Output:**  
- doctors: 3 rows  
- tests: 5 rows

### Step 4: Verify RLS Policies

```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('doctors', 'tests', 'bookings', 'doctor_bookings', 'leads', 'analytics', 'reports')
ORDER BY tablename, policyname;
```

**Expected Output:** Multiple policies per table (admin, staff, patient access)

---

## 📊 TABLES CREATED

### 1️⃣ doctors
- **Purpose:** Store doctor profiles for booking consultations
- **Columns:** id, full_name, specialty, qualification, experience_years, fee, phone, email, is_available, rating
- **Sample Data:** 3 doctors (Dr. Rajesh Kumar, Dr. Priya Sharma, Dr. Amit Patel)
- **RLS:** Admin (full), Staff (full), Patients (read available only), Public (read available)

### 2️⃣ tests
- **Purpose:** Diagnostic test catalog with pricing
- **Columns:** id (text), test_name, category, price, mrp, description, status
- **Sample Data:** 5 tests (CBC, LFT, KFT, XRAY, ECG)
- **RLS:** Admin (full), Staff (full), Patients (read active), Public (read active)

### 3️⃣ bookings
- **Purpose:** Diagnostic test booking orders
- **Columns:** id, patient_id, patient_name, patient_email, patient_phone, test_ids[], address, city, pincode, booking_date, time_slot, total_amount, payment_status, booking_status
- **RLS:** Admin (full), Staff (full), Patients (own bookings only)

### 4️⃣ doctor_bookings
- **Purpose:** Doctor consultation appointments
- **Columns:** id, patient_id, doctor_id, patient_name, patient_email, patient_phone, appointment_date, time_slot, consultation_fee, symptoms, status, payment_status
- **RLS:** Admin (full), Staff (full), Patients (own bookings only)

### 5️⃣ leads
- **Purpose:** CRM - Customer inquiry tracking
- **Columns:** id, name, phone, email, service, source, status, notes, assigned_to
- **RLS:** Admin (full), Staff (full), Patients (none)

### 6️⃣ analytics
- **Purpose:** Dashboard metrics and KPIs
- **Columns:** id, metric, value, date, metadata (jsonb)
- **RLS:** Admin (full), Staff (read only), Patients (none)

### 7️⃣ reports
- **Purpose:** Patient medical reports storage
- **Columns:** id, patient_id, booking_id, report_type, report_name, file_url, status
- **RLS:** Admin (full), Staff (full), Patients (own reports only)

---

## 🔐 RLS POLICIES SUMMARY

### Access Matrix:

| Table | Admin | Staff | Patient | Public |
|-------|-------|-------|---------|--------|
| doctors | ✅ Full | ✅ Full | 👁️ Read (available) | 👁️ Read (available) |
| tests | ✅ Full | ✅ Full | 👁️ Read (active) | 👁️ Read (active) |
| bookings | ✅ Full | ✅ Full | 🔒 Own only | ❌ None |
| doctor_bookings | ✅ Full | ✅ Full | 🔒 Own only | ❌ None |
| leads | ✅ Full | ✅ Full | ❌ None | ❌ None |
| analytics | ✅ Full | 👁️ Read | ❌ None | ❌ None |
| reports | ✅ Full | ✅ Full | 🔒 Own only | ❌ None |

**Legend:**
- ✅ Full = SELECT, INSERT, UPDATE, DELETE
- 👁️ Read = SELECT only
- 🔒 Own only = Can only access their own records
- ❌ None = No access

---

## 🛠️ HELPER FUNCTIONS

### `get_user_role()`
Returns the current user's role: 'admin', 'staff', 'patient', or 'guest'

**Usage:**
```sql
SELECT public.get_user_role();
```

### Auto-Update Triggers
All tables have `updated_at` triggers that automatically update on row modification.

---

## 🧪 TESTING CHECKLIST

After running migration, test in admin portal:

### Manage Doctors (`/admin/doctors`)
- [ ] Click "+ Add Doctor" button
- [ ] Fill form: Name, Specialty, Qualification, Experience, Fee, Email, Phone
- [ ] Click "Save Doctor"
- [ ] Verify doctor appears in cards list
- [ ] Click Edit icon → modify doctor → Save
- [ ] Click Delete icon → confirm deletion
- [ ] Search by name works
- [ ] Filter by specialty works

### Manage Tests (`/admin/tests`)
- [ ] Click "+ Add Test" button
- [ ] Fill form: ID (code), Name, Category, MRP, Description
- [ ] Click "Save"
- [ ] Verify test appears in table
- [ ] Click Edit → modify → Save
- [ ] Click Delete → confirm
- [ ] Search works
- [ ] Category filter works
- [ ] Refresh button reloads data

### View Bookings (`/admin/bookings`)
- [ ] Page loads without errors
- [ ] Shows tabs: All, Test Bookings, Doctor Consultations
- [ ] Shows "No bookings found" if empty (correct behavior)
- [ ] Search field functional
- [ ] Status filter works

### Staff Directory (`/admin/staff`)
- [ ] Shows existing staff from setup
- [ ] Can view staff details

### Leads CRM (`/admin/leads`)
- [ ] Page loads
- [ ] Can create new lead
- [ ] Can update lead status

### Analytics (`/admin/analytics`)
- [ ] Charts load
- [ ] Shows metrics from analytics table

---

## 🔄 ROLLBACK (If Needed)

If something goes wrong, rollback with:

```sql
-- Drop tables (cascades to policies automatically)
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.analytics CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.doctor_bookings CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.tests CASCADE;
DROP TABLE IF EXISTS public.doctors CASCADE;

-- Drop helper functions
DROP FUNCTION IF EXISTS public.get_user_role();
DROP FUNCTION IF EXISTS public.update_updated_at_column();
```

Then re-run the migration SQL.

---

## 🐛 TROUBLESHOOTING

### Error: "table already exists"
**Solution:** Tables won't be recreated if they exist. This is safe. The migration uses `CREATE TABLE IF NOT EXISTS`.

### Error: "policy already exists"
**Solution:** Drop existing policies first:
```sql
DROP POLICY IF EXISTS "Admin full access to doctors" ON public.doctors;
-- Repeat for other tables
```

### Error: "permission denied for table"
**Solution:** Check if RLS is enabled:
```sql
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
```

### Error: "insert violates foreign key"
**Solution:** Verify referenced tables exist:
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('admin_users', 'staff', 'patients');
```

### Sample data not inserting
**Solution:** Tables might already have data. This is intentional - sample data only inserts if tables are empty.

---

## ✅ SUCCESS CONFIRMATION

After completing all steps, you should see:

1. **Supabase SQL Editor:** ✅ "Success. No rows returned"
2. **Admin Doctors Page:** Sample doctors visible in cards
3. **Admin Tests Page:** Sample tests in table
4. **Console Logs:** No "table does not exist" errors
5. **Add/Edit Forms:** Submit successfully without errors
6. **Toast Notifications:** "Success" messages appear

---

## 📞 SUPPORT

If issues persist after migration:

1. Check Supabase logs: Dashboard → Logs → All logs
2. Check browser console (F12) for errors
3. Verify Supabase project ID is correct: `wyytvrukflhphukmltvn`
4. Ensure service role key is set in `.env.local` (if using)

---

**Migration Status:** ✅ READY TO EXECUTE  
**Estimated Time:** 30 seconds  
**Destructive:** No (uses IF NOT EXISTS)  
**Reversible:** Yes (see Rollback section)
