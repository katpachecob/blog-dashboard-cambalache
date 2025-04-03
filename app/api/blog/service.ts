import { IBlog } from "@/app/db/models/Blog";
import { Repository } from "./repository";

export class Service {
    static async getAll() {
        return await Repository.getAll();
    }
    
    static async getById(id: number) {
        return await Repository.getById(id);
    }
    
    static async post(data: IBlog) {
        return await Repository.post(data);
    }
    
    static async delete(id: number) {
        return await Repository.delete(id);
    }
    
    static async update(data: IBlog) {
        return await Repository.update(data);
    }
}