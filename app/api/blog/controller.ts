import { NextRequest, NextResponse } from "next/server";
import { Service } from "./service";

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
      const body = await request.json();
      return NextResponse.json(await Service.post(body));
    } catch (error) {
      return NextResponse.json({ error: error }, { status: 500 });
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
