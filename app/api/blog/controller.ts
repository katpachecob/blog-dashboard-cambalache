import { NextRequest, NextResponse } from "next/server";
import { Service } from "./service";
import formidable from 'formidable';


const form = formidable({
  uploadDir: '../../../public/uploads',
  keepExtensions: true,   

});


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
      const body = await request.blob();  
      const buffer = await body.arrayBuffer();

      const stream = Buffer.from(buffer);

      const data = await new Promise<any>((resolve, reject) => {
        form.parse(stream, (err: any, fields: any, files: any) => {
          if (err) {
            reject(err);
          }
          resolve({ fields, files });
        });
      });

      const { fields, files } = data;
      const { title, content, category, isPublished, date } = fields;
      const featuredImage = files.featuredImage;

      if (!featuredImage) {
        return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
      }

      const blogData = {
        id: 0,
        title,
        content,
        category,
        isPublished,
        date,
        featuredImage: featuredImage[0],
      };

      const result = await Service.post(blogData);
      return NextResponse.json(result, { status: 201 });

    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
