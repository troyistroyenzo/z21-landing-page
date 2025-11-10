import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Fetch all resources with optional filtering, search, pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const supabase = supabaseAdmin();
    let query = supabase.from('ai_resources').select('*', { count: 'exact' });

    // Apply filters
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    if (featured === 'true') {
      query = query.eq('featured', true);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Pagination and ordering
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('[admin/resources] Error:', error);
      throw error;
    }

    return NextResponse.json({
      resources: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    });
  } catch (error: any) {
    const message = error?.message || 'Failed to fetch resources';
    console.error('[admin/resources] Handler error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST - Create new resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, url, type, category, tags, featured, thumbnail, rich_content } = body;

    if (!id || !title || !description || !url || !type || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: id, title, description, url, type, category' },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from('ai_resources')
      .insert({
        id,
        title,
        description,
        url,
        type,
        category,
        tags: tags || [],
        featured: featured || false,
        thumbnail: thumbnail || null,
        rich_content: rich_content || null
      })
      .select()
      .single();

    if (error) {
      console.error('[admin/resources] Insert error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      resource: data,
      message: 'Resource created successfully'
    });
  } catch (error: any) {
    const message = error?.message || 'Failed to create resource';
    console.error('[admin/resources] Handler error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
