# ⚡ QUICK START - 5 MINUTE ACTIVATION

## 🎯 YOU ARE HERE: Ready to Go Live

---

## 📌 STEP 1: Execute SQL (2 min)

### Location: Supabase Dashboard
1. Click: **SQL Editor**
2. Click: **New Query**
3. Copy everything from below:

```sql
-- COMPLETE DATABASE SETUP SCRIPT
CREATE TABLE IF NOT EXISTS public.patients (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  password_hash TEXT,
  full_name TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS phone TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);

CREATE TABLE IF NOT EXISTS public.staff (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  password_hash TEXT,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'Active',
  can_change_password BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_users (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  status TEXT DEFAULT 'Active',
  can_change_password BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own patient record" ON public.patients;
DROP POLICY IF EXISTS "Users can create their own patient record" ON public.patients;
DROP POLICY IF EXISTS "Users can update their own patient record" ON public.patients;
DROP POLICY IF EXISTS "Admins can view all patient records" ON public.patients;
DROP POLICY IF EXISTS "Staff can view all patient records" ON public.patients;

CREATE POLICY "Patients can view their own record"
  ON public.patients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Patients can create their own record"
  ON public.patients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Patients can update their own record"
  ON public.patients FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all patient records"
  ON public.patients FOR SELECT USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Staff can view all patient records"
  ON public.patients FOR SELECT USING (EXISTS (SELECT 1 FROM staff WHERE user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.handle_new_patient_auth()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM staff WHERE user_id = NEW.id) THEN RETURN NEW; END IF;
  IF EXISTS (SELECT 1 FROM admin_users WHERE user_id = NEW.id) THEN RETURN NEW; END IF;
  INSERT INTO public.patients (user_id, email, phone, full_name)
  VALUES (NEW.id, NEW.email, NEW.phone, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (user_id) DO UPDATE SET email = COALESCE(EXCLUDED.email, patients.email),
    phone = COALESCE(EXCLUDED.phone, patients.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW
  EXECUTE FUNCTION handle_new_patient_auth();
```

4. Click: **Run**
5. ✅ Result: "Successfully executed" (no errors)

---

## 📌 STEP 2: Enable Phone Provider (10 min)

1. Go to: **Supabase Dashboard**
2. Click: **Authentication** → **Providers**
3. Find: **Phone**
4. Click: **Enable**
5. Choose SMS provider:
   - **Twilio** (recommended)
     - Sign up: twilio.com
     - Account SID: [copy from console]
     - Auth Token: [copy from console]
     - Message Service SID: [create new service]
   
   OR
   
   - **AWS SNS** / **MessageBird** (alternative)
6. Save ✅

---

## 📌 STEP 3: Configure Google OAuth (10 min)

### Part A: Supabase
1. **Authentication** → **Providers** → **Google**
2. Click: **Enable**
3. Copy: **Callback URL**

### Part B: Google Cloud
1. Go to: [Google Cloud Console](https://console.cloud.google.com)
2. Create: **New Project** → Name: "AASHA MEDIX"
3. Search: **"Google+ API"** → **Enable**
4. Click: **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose: **Web application**
6. Add **Authorized Redirect URIs**:
   ```
   https://eybtqyuodacnlisbjzrw.supabase.co/auth/v1/callback
   http://localhost:3000/patient
   http://localhost:3000
   ```
7. Copy: **Client ID** and **Client Secret**

### Part C: Back to Supabase
1. Paste **Client ID**
2. Paste **Client Secret**
3. Save ✅

---

## 🧪 STEP 4: Quick Test (5 min)

### Test 1: Email Login
```
1. Go: http://localhost:3000/patient-login
2. Email: patient1@aashamedix.com
3. Password: Patient@123456
4. Click: Sign In
5. ✅ Should go to /patient dashboard
```

### Test 2: Phone OTP
```
1. Go: http://localhost:3000/patient-login
2. Click: Phone tab
3. Phone: 9876543210
4. Click: Send OTP
5. Check Supabase → Authentication → Users (see OTP)
6. Enter OTP in form
7. ✅ Should create patient record & login
```

### Test 3: Google
```
1. Go: http://localhost:3000/patient-login
2. Click: Google Account button
3. Select your Google account
4. Grant permissions
5. ✅ Should auto-create patient & login
```

---

## 📋 VERIFICATION CHECKLIST

- [ ] SQL executed without errors
- [ ] Can see patients table in Table Editor
- [ ] Phone column exists in patients table
- [ ] RLS policies show as "Enabled"
- [ ] Phone provider working (SMS received)
- [ ] Google credentials configured
- [ ] Email login works ✅
- [ ] Phone login works ✅
- [ ] Google login works ✅

---

## 🎉 DONE! You're Live!

```
Database:   ✅ READY
Auth:       ✅ READY
SMS:        ✅ READY
OAuth:      ✅ READY
System:     ✅ READY
```

### Share these login URLs:
- **Patient**: http://localhost:3000/patient-login
- **Admin**: http://localhost:3000/admin/login
- **Staff**: http://localhost:3000/staff-login

---

## 🆘 QUICK TROUBLESHOOTING

| Issue | Fix |
|-------|-----|
| SQL error | Copy from [DATABASE_READY_EXECUTE.md](DATABASE_READY_EXECUTE.md) and retry |
| SMS not received | Check SMS provider balance, verify phone format |
| Google auth fails | Verify redirect URLs in Google Console |
| Phone column missing | Re-run the ALTER TABLE command |
| RLS blocking access | Verify auth.uid() matches user_id |

---

## 📞 FULL DOCS

- **Detailed Setup**: [ACTIVATION_CHECKLIST.md](ACTIVATION_CHECKLIST.md)
- **Complete Verification**: [FINAL_VERIFICATION_REPORT.md](FINAL_VERIFICATION_REPORT.md)
- **System Preview**: [FINAL_SYSTEM_PREVIEW.md](FINAL_SYSTEM_PREVIEW.md)
- **Execute SQL**: [DATABASE_READY_EXECUTE.md](DATABASE_READY_EXECUTE.md)

---

**Time Estimate**: 30 minutes  
**Difficulty**: Easy  
**Status**: 🟢 READY TO LAUNCH

---

# 🚀 LET'S GO LIVE!
