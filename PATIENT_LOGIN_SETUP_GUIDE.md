# Patient Login Enhancement Guide

## Features Added

### 1. **Phone Number + OTP Login**
- Patients can login using their 10-digit phone number (Indian format)
- OTP is sent via SMS
- Secure 6-digit OTP verification

### 2. **Google Account Login**
- One-click login with Google account
- Automatic patient profile creation
- Seamless OAuth integration

### 3. **Email + Password Login** (Existing)
- Traditional email/password authentication still available

---

## Implementation Details

### Patient Login Page
**Location**: [src/pages/PatientLogin.jsx](src/pages/PatientLogin.jsx)

**Features:**
- Three login mode tabs: Email, Phone, Google
- Phone mode with Indian format (+91) prefix
- OTP input with 6-digit verification
- Google OAuth button
- Error handling and loading states

### Auth Context Updates
**Location**: [src/contexts/SupabaseAuthContext.jsx](src/contexts/SupabaseAuthContext.jsx)

**New Methods:**
```javascript
signInWithPhone(phone)      // Send OTP to phone
verifyPhoneOtp(phone, otp)  // Verify OTP
signInWithGoogle(redirectUrl) // Google OAuth
```

---

## Supabase Configuration Required

### 1. Enable Phone Authentication

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Providers**
3. Find **Phone** provider
4. Click **Enable**
5. Choose SMS provider:
   - **Twilio** (recommended for India)
   - **AWS SNS**
   - **MessageBird**

**For Twilio (India):**
- Sign up at [twilio.com](https://twilio.com)
- Get Account SID and Auth Token
- Get a phone number (supports India +91)
- Add credentials in Supabase:
  ```
  Twilio Account SID: <your-sid>
  Twilio Auth Token: <your-token>
  Twilio Message Service SID: <your-service-sid>
  ```

### 2. Enable Google OAuth

1. Go to **Supabase Dashboard** → **Authentication** → **Providers**
2. Find **Google** provider
3. Click **Enable**
4. You'll see the Supabase Callback URL (copy it)
5. Go to [Google Cloud Console](https://console.cloud.google.com)
6. Create a new project or select existing
7. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
8. Choose **Web application**
9. Add **Authorized redirect URIs**:
   ```
   https://eybtqyuodacnlisbjzrw.supabase.co/auth/v1/callback
   http://localhost:3000/patient
   ```
10. Copy **Client ID** and **Client Secret**
11. Paste in Supabase Google provider settings
12. Save

---

## Testing the Features

### Phone + OTP Login
```
1. Navigate to: http://localhost:3000/patient-login
2. Click "Phone" tab
3. Enter phone: 9876543210 (or any valid format)
4. Click "Send OTP"
5. Check SMS (in test, Supabase shows OTP in dashboard)
6. Enter 6-digit OTP
7. Click "Verify OTP"
8. Redirected to /patient dashboard
```

### Google Login
```
1. Click "Google Account" button
2. Select your Google account
3. Grant permissions
4. Auto-redirected to /patient dashboard
5. Patient profile auto-created if new user
```

### Email + Password Login (Existing)
```
1. Click "Email" tab
2. Use existing credentials:
   - Email: patient1@aashamedix.com
   - Password: Patient@123456
3. Click "Sign In"
4. Redirected to /patient dashboard
```

---

## Database Schema Updates

### Phone Authentication Handling
When a patient signs in via phone:
1. Supabase creates auth user with phone identifier
2. Auth context detects phone-based user
3. Patient record auto-created if doesn't exist
4. User redirected to dashboard

### Google OAuth Handling
When a patient signs in via Google:
1. Supabase creates auth user with Google provider
2. Email from Google account used
3. Patient record auto-created if doesn't exist
4. First name/last name from Google profile (optional)
5. User redirected to dashboard

---

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  Patient Login Page                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    EMAIL     │  │    PHONE     │  │   GOOGLE     │  │
│  │              │  │              │  │              │  │
│  │ Email Input  │  │ Phone Input  │  │ Google Btn   │  │
│  │ Password     │  │ Send OTP     │  │              │  │
│  │              │  │ Verify OTP   │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│        │                  │                  │          │
│        └──────────────────┼──────────────────┘          │
│                           ▼                             │
│                  Supabase Auth                          │
│                           │                             │
│                           ▼                             │
│              Patient Profile Created                    │
│                           │                             │
│                           ▼                             │
│           /patient Dashboard (Protected)                │
└─────────────────────────────────────────────────────────┘
```

---

## Security Notes

✅ **Phone OTP:**
- OTP sent via secure SMS
- 6-digit codes (configurable length)
- Time-limited validity (default 5 minutes)
- Rate limited to prevent brute force

✅ **Google OAuth:**
- OAuth 2.0 flow with PKCE
- Credentials not stored locally
- Automatic token refresh
- Secure redirect URI validation

✅ **Email + Password:**
- Password hashed with bcrypt
- Email confirmation required
- Session tokens expire automatically

---

## Troubleshooting

### Phone OTP Not Received
1. Check SMS provider credentials in Supabase
2. Verify phone number format (+91 + 10 digits)
3. Check SMS provider quotas/balance
4. Ensure SMS provider region supports India

### Google Login Showing Error
1. Verify Client ID and Secret in Supabase
2. Check redirect URLs in Google Console
3. Clear browser cache/cookies
4. Ensure Google account has verified email

### User Profile Not Created
1. Check `patients` table RLS policies
2. Ensure `user_id` foreign key exists
3. Check auth.users table for user entry
4. Verify patient creation trigger (if any)

---

## Future Enhancements

- [ ] WhatsApp OTP delivery
- [ ] Biometric login (fingerprint/face recognition)
- [ ] Social login (Facebook, Apple)
- [ ] Multi-factor authentication (MFA)
- [ ] Magic links instead of passwords
- [ ] SMS-based patient notifications
