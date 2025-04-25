import { IBlog } from "@/app/db/models/Blog";
import { Repository } from "./repository";
import { uploadImage } from "@/utils/supabase/uploadImage";

export class Service {
  static async getAll() {
    const { data, error } = await Repository.getAll();
    if (error) {
      return { error: error };
    }
    return data;
  }

  static async getById(id: number) {
    const { data, error } = await Repository.getById(id);
    if (error) {
      return { error: error };
    }
    return data;
  }

  static async post(data: IBlog & { featuredImage: any }) {
    let imageUrl = '';
    
    if (data.featuredImage) {
      const fileName = `blog-${Date.now()}-${data.title}`;
      imageUrl = await uploadImage(data.featuredImage, fileName); 
    }
  
    const blogData: IBlog = {
      id: data.id,
      title: data.title,
      content: data.content,
      category: data.category,
      date: data.date,
      isPublished: data.isPublished,
      featuredImage: imageUrl, 
    };
  
    const { data: newData, error } = await Repository.post(blogData);
    
    if (error) {
      return { error: error }; 
    }
  
    return newData; 
  }

  static async delete(id: number) {
    const { data, error } = await Repository.delete(id);
    if (error) {
      return { error: error };
    }
    return data;
  }

  static async update(data: IBlog & { featuredImage?: File }) {
    let imageUrl = "";

    if (data.featuredImage) {
      const fileName = `blog-${Date.now()}-${data.title}`;
      imageUrl = await uploadImage(data.featuredImage, fileName);
    }

    if (!data.id) return { error: "ID is required" };
    const { data: existingBlog, error } = await Repository.getById(data.id);
    if (error || !existingBlog) return { error: "Blog no encontrado" };

    const blogData: IBlog = {
      id: data.id,
      title: data.title,
      content: data.content,
      category: data.category,
      date: data.date,
      isPublished: data.isPublished,
      featuredImage: imageUrl || existingBlog.featuredImage,
    };

    const { data: updated, error: updateError } = await Repository.update(
      blogData
    );
    if (updateError) return { error: updateError };
    return updated;
  }
}
