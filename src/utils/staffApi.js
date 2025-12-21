
import { supabase } from '@/lib/customSupabaseClient';

export async function createStaffAccount(staffData) {
  const { data, error } = await supabase.functions.invoke('create-staff', {
    body: JSON.stringify(staffData)
  });

  if (error) {
    console.error('Error invoking create-staff function:', error);
    throw error;
  }
  
  if (data?.error) {
      throw new Error(data.error);
  }

  return data;
}
