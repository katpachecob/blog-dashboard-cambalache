import { IBlog } from "@/app/db/models/Blog";
import { Repository } from "./repository";

export class Service {
    static async getAll() {
        const { data, error } = await Repository.getAll();
        if (error) {
            return { error: error };
        }
        return data
    }
    
    static async getById(id: number) {
        const { data, error } = await Repository.getById(id);
        if (error) {
            return { error: error };
        }
        return data
    }
    
    static async post(data: IBlog) {
        const { data: newData, error } = await Repository.post(data);
        if (error) {
            return { error: error };
        }
        return newData
    }
    
    static async delete(id: number) {
        const { data, error } = await Repository.delete(id);
        if (error) {
            return { error: error };
        }
        return data
    }
    
    static async update(data: IBlog) {
        const { data: updatedData, error } = await Repository.update(data);
        if (error) {
            return { error: error };
        }
        return updatedData
    }
}