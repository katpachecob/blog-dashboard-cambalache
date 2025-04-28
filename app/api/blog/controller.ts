import { NextRequest, NextResponse } from "next/server";
import { Service } from "./service";
import { IBlog } from "@/app/db/models/Blog";



export class Controller {
  static async get(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");
      if (id) {
        return NextResponse.json(await Service.getById(Number(id)));
      } else {
        return NextResponse.json(await Service.getAll());
      }
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }

  static async post(request: NextRequest) {
    try {
    
      const formData = await request.formData()
      const title = formData.get('title')?.toString() || ''
      const content = formData.get('content')?.toString() || ''
      const category = formData.get('category')?.toString() || ''
      const isPublished = formData.get('isPublished') === 'true'
      const featuredImage = formData.get('featuredImage') as File
      const blogData: IBlog = {
        title,
        content,
        category,
        isPublished,
        featuredImage: '',
      }
  
      const hasImage = featuredImage ? featuredImage : null; 
      const newBlog = await Service.post(blogData, hasImage )
  
      
      return NextResponse.json(newBlog, { status: 201 })
    } catch (error) {
      return NextResponse.json(
        { message: error instanceof Error ? error.message : 'An unknown error occurred' },
        { status: 400 }
      )
    }
  
  }
  
  static async patch(request: NextRequest) {
    try {
      const data = await request.json();
  
      const title = data.title || '';
      const content = data.content || '';
      const category = data.category || '';
      const isPublished = data.isPublished;
      const featuredImage = data.featuredImage || '';
  

      const blogData: IBlog = {
        id: data.id,  
        title,
        content,
        category,
        isPublished,
        featuredImage,
      };
  
      const hasImage = featuredImage ? featuredImage : null;
  
      const updatedBlog = await Service.update(blogData, hasImage);
  
      return NextResponse.json(updatedBlog, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: error instanceof Error ? error.message : 'An unknown error occurred' },
        { status: 400 }
      );
    }
  }

      
  static async delete(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");
      return NextResponse.json(await Service.delete(Number(id)));
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
  }
}
