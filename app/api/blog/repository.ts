import { IBlog } from '@/app/db/models/Blog';
import supabase from '@/utils/supabase/server'

export class Repository{
    static async getAll(){
        const { data, error } = await supabase.from("blog").select("*");
        if (error) throw error;
        return data;
    }
    static async getById(id: number){
        const { data, error } = await supabase.from("blog").select("*").eq("id", id).single();
        if (error) throw error;
        return data;
    }
    static async post(data: IBlog){
        const { error } = await supabase.from("blog").insert(data);
        if (error) throw error;
        return data;
    }
    static async delete(id: number){
        const { error } = await supabase.from("blog").delete().eq("id", id);
        if (error) throw error;
        return id;
    }
    static async update(data: IBlog){
        const { error } = await supabase.from("blog").update(data).eq("id", data.id);
        if (error) throw error;
        return data;
    }
}