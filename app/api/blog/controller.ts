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
  
      const title = formData.get("title") as string
      const content = formData.get("content") as string
      const category = formData.get("category") as string
      const isPublished = formData.get("isPublished") === "true"
  
      const featuredImage = formData.get("featuredImage") as File | null
  
      if (!title || !content) {
        return NextResponse.json({ error: "Título y contenido son obligatorios" }, { status: 400 })
      }
  
      const blogData: IBlog & { featuredImage: any } = {
        id: undefined, 
        title,
        content,
        category,
        date: undefined,
        isPublished,
        featuredImage: featuredImage ? featuredImage.name : "",
      }
  
      const result = await Service.post(blogData)
  
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }
  
      return NextResponse.json({ success: true, data: result }, { status: 201 })
    } catch (error) {
      console.error("Error al procesar la solicitud:", error)
      return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
  }
  

  static async patch(request: NextRequest) {
    try {
      const data = await request.json();
      return NextResponse.json(await Service.update(data));
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
  }
  static async delete(request: NextRequest) {
    try {
      const data = await request.json();
      return NextResponse.json(await Service.delete(data.id));
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }
  }
}
