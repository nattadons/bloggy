// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; 
import { cloudinary } from '@/lib/cloudinary';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    
    // ดึงข้อมูลโพสต์ตาม ID พร้อมข้อมูลผู้เขียน
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          }
        }
      }
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    // แยกแท็กจากโพสต์ปัจจุบัน
    const currentPostTags = post.tags ? post.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [];
    
    let relatedPosts: any[] = [];
    
    // ถ้าโพสต์มีแท็ก ค้นหาโพสต์ที่มีแท็กคล้ายกัน
    if (currentPostTags.length > 0) {
      relatedPosts = await prisma.post.findMany({
        where: {
          id: { not: postId },
          published: true,
          OR: currentPostTags.map(tag => ({
            tags: { contains: tag }
          }))
        },
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            }
          }
        },
        take: 2,
      });
    }
    
    // ถ้ายังไม่ได้โพสต์ที่เกี่ยวข้องเพียงพอ ให้เสริมด้วยโพสต์ล่าสุด
    if (relatedPosts.length < 2) {
      const existingPostIds = relatedPosts.map(post => post.id);
      
      const recentPosts = await prisma.post.findMany({
        where: {
          published: true,
          id: {
            not: postId,
            notIn: existingPostIds.length > 0 ? existingPostIds : undefined,
          }
        },
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              name: true,
              image: true,
            }
          }
        },
        take: 2 - relatedPosts.length,
      });
      
      relatedPosts = [...relatedPosts, ...recentPosts];
    }
    
    return NextResponse.json({ post, relatedPosts });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}


/**
 * DELETE post by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to delete a post' },
        { status: 401 }
      );
    }

    // Find the post
    const post = await prisma.post.findUnique({
      where: { id: params.id }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user is the author of the post
    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this post' },
        { status: 403 }
      );
    }

    // Delete image from Cloudinary if exists
    if (post.image) {
      try {
        // Extract public_id from the Cloudinary URL
        const urlParts = post.image.split('/');
        const filenameWithExt = urlParts[urlParts.length - 1];
        const filename = filenameWithExt.split('.')[0];
        const folder = 'blog_posts'; // The folder you specified during upload
        const public_id = `${folder}/${filename}`;
        
        await new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(public_id, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        });
        
        console.log('Image deleted from Cloudinary');
      } catch (deleteError) {
        // Log error but continue with post deletion
        console.error('Error deleting image from Cloudinary:', deleteError);
      }
    }

    // Delete the post from the database
    await prisma.post.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}

/**
 * PATCH (update) post by ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to update a post' },
        { status: 401 }
      );
    }

    // Find the post
    const post = await prisma.post.findUnique({
      where: { id: params.id }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user is the author of the post
    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to update this post' },
        { status: 403 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const tags = formData.get('tags') as string;
    const imageFile = formData.get('image') as File | null;
    
    // Validate form data
    if (!title || !content) {
      return NextResponse.json(
        { error: "Please enter the article title and content." },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      title,
      excerpt,
      content,
      tags,
      updatedAt: new Date(),
    };

    // Handle image upload if a new image is provided
    if (imageFile) {
      try {
        // Convert file to buffer and upload to Cloudinary
        const buffer = await imageFile.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        const dataURI = `data:${imageFile.type};base64,${base64Image}`;
        
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            dataURI,
            {
              folder: 'blog_posts',
              resource_type: 'image',
              transformation: [
                { width: 1200, height: 630, crop: 'fill' },
                { quality: 'auto:good' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
        });
        
        // Save image URL
        updateData.image = (uploadResult as any).secure_url;
        
        // Delete old image if it exists
        if (post.image) {
          try {
            const urlParts = post.image.split('/');
            const filenameWithExt = urlParts[urlParts.length - 1];
            const filename = filenameWithExt.split('.')[0];
            const folder = 'blog_posts';
            const public_id = `${folder}/${filename}`;
            
            await new Promise((resolve, reject) => {
              cloudinary.uploader.destroy(public_id, (error, result) => {
                if (error) reject(error);
                else resolve(result);
              });
            });
          } catch (deleteError) {
            console.error('Error deleting old image:', deleteError);
          }
        }
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
      }
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}