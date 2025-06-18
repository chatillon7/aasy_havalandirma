import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Detaylı debug bilgisi
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const projectId = projectUrl ? projectUrl.split('.')[0].replace('https://', '') : 'unknown';
    
    // Supabase bağlantısını test et
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        errorCode: error.code,
        projectId,
        envCheck: {
          url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 50) + '...'
        }
      });
    }
    
    const requiredBuckets = ['gallery', 'settings', 'homepage', 'backups'];
    const existingBuckets = data ? data.map(b => b.name) : [];
    const missingBuckets = requiredBuckets.filter(b => !existingBuckets.includes(b));
    
    return NextResponse.json({ 
      success: true,
      projectId,
      buckets: existingBuckets,
      bucketCount: existingBuckets.length,
      missingBuckets,
      allBucketsExist: missingBuckets.length === 0,
      rawData: data,
      envCheck: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 50) + '...'
      }
    });
  } catch (e) {
    return NextResponse.json({ 
      success: false, 
      error: e.message,
      stack: e.stack,
      envCheck: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 50) + '...'
      }
    });
  }
}
