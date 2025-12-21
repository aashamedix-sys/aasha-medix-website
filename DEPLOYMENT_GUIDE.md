# 🚀 Deployment Guide - Booking Management System

## Step 1: Database Setup ✅

Run these SQL migrations in your Supabase SQL Editor **in order**:

### Migration 1: Approval System
```sql
-- Copy content from: migrations/002_phase2_approval_system.sql
-- Run in Supabase SQL Editor
```

### Migration 2: Chat System
```sql
-- Copy content from: migrations/003_phase3_chat_system.sql
-- Run in Supabase SQL Editor
```

### Migration 3: Payment System
```sql
-- Copy content from: migrations/004_phase4_payment_system.sql
-- Run in Supabase SQL Editor
```

---

## Step 2: Verify Database Tables

After running migrations, verify these tables exist in Supabase:

✅ `notifications`
✅ `booking_status_history`
✅ `staff_approvals`
✅ `chat_messages`
✅ `chat_participants`
✅ `payments`
✅ `payment_history`
✅ `refunds`

---

## Step 3: Storage Bucket Setup

1. Go to Supabase Dashboard → Storage
2. Create a new bucket: `chat-attachments`
3. Set as **Public bucket**
4. Verify the bucket policies are created (migrations should handle this)

---

## Step 4: Test the Features

### Staff Dashboard
1. Login as staff user
2. Navigate to **Approvals** tab
3. Test approve/reject/reschedule functions
4. Check **Messages** tab for chat

### Patient Dashboard
1. Login as patient
2. Check **My Bookings** tab - should show BookingTracker
3. Check **Payments** tab - should show PaymentDashboard
4. Check **Messages** tab - should show ChatList

---

## Step 5: Environment Variables (Optional)

If you plan to add payment gateway integration:

```env
# .env file
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Payment Gateway (Future)
VITE_RAZORPAY_KEY_ID=your_razorpay_key
# OR
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

---

## Component Integration Status

### ✅ Staff Dashboard (`src/pages/staff/StaffDashboard.jsx`)
- [x] ApprovalQueue integrated in "Approvals" tab
- [x] ChatList integrated in "Messages" tab
- [x] Icons updated (CheckSquare, MessageSquare)

### ✅ Patient Dashboard (`src/pages/patient/PatientDashboard.jsx`)
- [x] Imports added (BookingTracker, PaymentDashboard, ChatList)
- [ ] **TODO**: Update return statement to use tabs (see below)

---

## 🔧 Patient Dashboard Integration (Manual Step Required)

The **PatientDashboard.jsx** already has all the necessary imports. You need to replace the existing return statement with a tabbed layout.

### Current Structure:
```jsx
return (
  <DashboardLayout>
    <WelcomeSection />
    <StatsCards />
    <TwoColumnGrid /> {/* Recent Appointments & Reports */}
  </DashboardLayout>
);
```

### Recommended New Structure:
```jsx
return (
  <DashboardLayout>
    <WelcomeSection />
    <StatsCards />
    
    <Tabs defaultValue="overview">
      <TabsList grid-cols-5>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        {/* Existing Recent Appointments & Reports cards */}
      </TabsContent>
      
      <TabsContent value="bookings">
        <BookingTracker userId={user?.id} />
      </TabsContent>
      
      <TabsContent value="payments">
        <PaymentDashboard userId={user?.id} />
      </TabsContent>
      
      <TabsContent value="messages">
        <ChatList />
      </TabsContent>
      
      <TabsContent value="reports">
        {/* Your existing reports content */}
      </TabsContent>
    </Tabs>
  </DashboardLayout>
);
```

---

## Testing Checklist

### Phase 1: BookingTracker
- [ ] Displays all booking statuses correctly
- [ ] Timeline visualization works
- [ ] Rejection reasons shown
- [ ] Mobile responsive
- [ ] Refresh button works

### Phase 2: Approval Queue
- [ ] Staff can see pending bookings
- [ ] Approve button works
- [ ] Reject with reason works
- [ ] Reschedule works
- [ ] Notifications sent to patients
- [ ] Status badges display correctly

### Phase 3: Chat System
- [ ] Can send messages
- [ ] Messages appear in real-time
- [ ] File upload works
- [ ] Read receipts update
- [ ] Unread badge shows count
- [ ] Search conversations works

### Phase 4: Payment System
- [ ] Payment list displays
- [ ] Status badges show correctly
- [ ] Invoice generation works
- [ ] PDF downloads
- [ ] Summary cards show correct counts
- [ ] Failed payment retry works

---

## Known Issues & Solutions

### Issue: Chat messages not appearing
**Solution**: Verify `chat-attachments` storage bucket exists and is public

### Issue: Notifications not working
**Solution**: Check RLS policies on `notifications` table, ensure triggers are created

### Issue: Invoice won't download
**Solution**: Verify `jspdf` package is installed: `npm install jspdf`

### Issue: Real-time subscriptions not working
**Solution**: Check Supabase Realtime is enabled in Project Settings → API

---

## Performance Tips

1. **Pagination**: For large datasets, implement pagination in booking/payment lists
2. **Caching**: Use React Query for better data caching
3. **Indexes**: All required indexes are created in migrations
4. **Image Optimization**: Compress chat attachments before upload

---

## Security Checklist

- [x] RLS enabled on all tables
- [x] Users can only see their own data
- [x] Staff policies implemented
- [x] Storage bucket policies active
- [x] Audit trails in place
- [x] Payment data encrypted

---

## Next Enhancements

### Priority 1
1. **Payment Gateway**: Integrate Razorpay or Stripe
2. **Email Notifications**: SendGrid/AWS SES integration
3. **SMS Notifications**: Twilio integration

### Priority 2
1. **Push Notifications**: Firebase Cloud Messaging
2. **Video Consultations**: WebRTC or Zoom API
3. **Analytics Dashboard**: Staff performance metrics

### Priority 3
1. **Mobile App**: React Native version
2. **Offline Support**: PWA capabilities
3. **Calendar Sync**: Google Calendar integration

---

## Support

If you encounter any issues:

1. Check Supabase logs in Dashboard → Logs
2. Check browser console for errors
3. Verify all migrations ran successfully
4. Test with `npm run dev` locally first

---

## 🎉 Success Criteria

Your system is ready when:

✅ All 3 migrations run without errors
✅ Staff can approve/reject bookings
✅ Patients receive notifications
✅ Chat messages send/receive in real-time
✅ Invoices generate and download
✅ All RLS policies active

---

**Ready to deploy!** 🚀

Last Updated: December 21, 2025
