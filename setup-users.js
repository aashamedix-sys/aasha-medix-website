import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createUsers() {
  console.log('Starting user creation...\n');

  const usersToCreate = [
    // Admin
    { 
      email: 'care@aashamedix.com', 
      password: 'Care@123456', 
      role: 'admin', 
      name: 'AASHA MEDIX Care Admin', 
      type: 'admin',
      canChangePassword: true
    },
    // Staff
    { 
      email: 'staff@aashamedix.com', 
      password: 'Staff@123456', 
      role: 'staff', 
      name: 'AASHA MEDIX Staff', 
      type: 'staff',
      canChangePassword: true
    },
  ];

  const credentials = [];

  for (const user of usersToCreate) {
    console.log(`\n📝 Processing: ${user.email} (${user.type})...`);
    
    try {
      // 1. Create Auth User via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            full_name: user.name,
            role: user.role,
          }
        }
      });

      if (authError && !authError.message.includes('already registered')) {
        console.error(`❌ Auth Error: ${authError.message}`);
        continue;
      }

      let userId = authData?.user?.id;
      
      if (!userId) {
        console.log(`⚠️  User might already exist. Attempting to fetch ID...`);
        // For existing users, we'd need admin access to get the ID
        // This is a limitation - we'll try to insert and see what happens
        userId = `temp-${user.email}`;
      }

      console.log(`✅ Auth user created/exists: ${user.email}`);

      // 2. Generate password hash
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(user.password, salt);

      // 3. Insert into appropriate table
      if (user.type === 'admin') {
        const { error: adminError } = await supabase
          .from('admin_users')
          .upsert({
            user_id: userId,
            email: user.email,
            password_hash: passwordHash,
            full_name: user.name,
            role: user.role,
            status: 'Active',
            can_change_password: user.canChangePassword,
            created_at: new Date().toISOString()
          }, { onConflict: 'email' });

        if (adminError) {
          console.error(`❌ Admin table error: ${adminError.message}`);
        } else {
          console.log(`✅ Admin user inserted: ${user.email}`);
          credentials.push({
            email: user.email,
            password: user.password,
            role: user.role,
            type: user.type,
            status: 'Active'
          });
        }
      } else if (user.type === 'staff') {
        const { error: staffError } = await supabase
          .from('staff')
          .upsert({
            user_id: userId,
            email: user.email,
            password_hash: passwordHash,
            full_name: user.name,
            role: user.role,
            status: 'Active',
            can_change_password: user.canChangePassword,
            created_at: new Date().toISOString()
          }, { onConflict: 'email' });

        if (staffError) {
          console.error(`❌ Staff table error: ${staffError.message}`);
        } else {
          console.log(`✅ Staff user inserted: ${user.email}`);
          credentials.push({
            email: user.email,
            password: user.password,
            role: user.role,
            type: user.type,
            status: 'Active'
          });
        }
      }

    } catch (error) {
      console.error(`❌ Unexpected error for ${user.email}:`, error.message);
    }
  }

  // Display credentials
  console.log('\n\n📋 ================= CREATED CREDENTIALS =================');
  credentials.forEach(cred => {
    console.log(`\n${cred.type.toUpperCase()}`);
    console.log(`Email:    ${cred.email}`);
    console.log(`Password: ${cred.password}`);
    console.log(`Role:     ${cred.role}`);
    console.log(`Status:   ${cred.status}`);
  });
  console.log('\n========================================================\n');

  console.log('✅ User creation complete!');
}

createUsers().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
