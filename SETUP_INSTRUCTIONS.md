# Admin & Staff User Setup Guide

## What I've Created

I've updated the **System Setup** page to create the following users:

### Admin User
- **Email**: `care@aashamedix.com`
- **Password**: `Care@123456`
- **Role**: Admin
- **Permissions**: Can change password ✓

### Staff Users
1. **General Staff**
   - Email: `staff@aashamedix.com`
   - Password: `Staff@123456`
   - Role: Staff

2. **Lab Technician**
   - Email: `staff1@aashamedix.com`
   - Password: `Staff@123456`
   - Role: Lab

3. **Phlebotomist**
   - Email: `staff2@aashamedix.com`
   - Password: `Staff@123456`
   - Role: Phlebotomist

### Test Patient Users
- **patient1@aashamedix.com** / `Patient@123456`
- **patient2@aashamedix.com** / `Patient@123456`

## How to Initialize

1. Navigate to the **Setup page** in the web app:
   - Go to `http://localhost:3000/setup` (when dev server is running)

2. Click the **"Initialize System Users"** button

3. The system will:
   - Create accounts in Supabase Auth
   - Store password hashes in the database
   - Set permissions and roles

4. Once complete, you can:
   - Copy credentials to clipboard
   - Download PDF with all credentials

## Login URLs

- **Admin**: http://localhost:3000/admin/login
- **Staff**: http://localhost:3000/staff-login
- **Patient**: http://localhost:3000/patient-login

## Database Tables Created

- `admin_users` - Admin accounts with `can_change_password` flag
- `staff` - Staff members with role-based access
- `patients` - Patient accounts

## Notes

- The admin user (care@aashamedix.com) has full permission to change passwords
- All passwords are hashed using bcrypt (10 salt rounds)
- Status is set to "Active" for all created users
- If users already exist, the system will skip duplicates
