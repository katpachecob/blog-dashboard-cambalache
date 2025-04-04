import { IBlog } from '@/app/db/models/Blog';
import supabase from '@/utils/supabase/server'

export class Repository{
    static async getAll(){
        return await supabase.from("blog").select("*");
    }
    static async getById(id: number){
        return await supabase.from("blog").select("*").eq("id", id).single();
    }
    static async post(data: IBlog){
        return await supabase.from("blog").insert(data).select().single();
    }
    static async delete(id: number){
        return await supabase.from("blog").delete().eq("id", id).select().single();
    }
    static async update(data: IBlog){
        return await supabase.from("blog").update(data).eq("id", data.id).select().single();
    }
}