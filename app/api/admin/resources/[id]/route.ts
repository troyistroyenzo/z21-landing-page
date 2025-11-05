import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// PATCH - Update resource
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, url, type, category, tags, featured, thumbnail } = body;

    const supabase = supabaseAdmin();
    
    // Build update object (only include provided fields)
    const updates: any = { updated_at: new Date().toISOString() };
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (url !== undefined) updates.url = url;
    if (type !== undefined) updates.type = type;
    if (category !== undefined) updates.category = category;
    if (tags !== undefined) updates.tags = tags;
    if (featured !== undefined) updates.featured = featured;
    if (thumbnail !== undefined) updates.thumbnail = thumbnail;

    const { data, error } = await supabase
      .from('ai_resources')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[admin/resources/id] Update error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      resource: data,
      message: 'Resource updated successfully'
    });
  } catch (error: any) {
    const message = error?.message || 'Failed to update resource';
    console.error('[admin/resources/id] Handler error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE - Delete resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = supabaseAdmin();
    const { error } = await supabase
      .from('ai_resources')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[admin/resources/id] Delete error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error: any) {
    const message = error?.message || 'Failed to delete resource';
    console.error('[admin/resources/id] Handler error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
