import { Controller } from './controller';
import { NextRequest } from 'next/server';




export async function GET(request: NextRequest) {
  return await Controller.get(request);
}

export async function POST(request: NextRequest) {
    return await Controller.post(request);
  }
  
  export async function PATCH(request: NextRequest) {
    return await Controller.patch(request);
  }
  
  export async function DELETE(request: NextRequest) {
    return await Controller.delete(request);
  }