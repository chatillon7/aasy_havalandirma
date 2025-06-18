import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Supabase bağlantısını test et
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        envCheck: {
          url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      });
    }
    
    const requiredBuckets = ['gallery', 'settings', 'homepage', 'backups'];
    const existingBuckets = data.map(b => b.name);
    const missingBuckets = requiredBuckets.filter(b => !existingBuckets.includes(b));
    
    return NextResponse.json({ 
      success: true,
      buckets: existingBuckets,
      missingBuckets,
      allBucketsExist: missingBuckets.length === 0,
      envCheck: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });
  } catch (e) {
    return NextResponse.json({ 
      success: false, 
      error: e.message,
      envCheck: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });
  }
}
