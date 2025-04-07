import supabase from '@/utils/supabase/server'

export const uploadImage = async (file: File, path: string): Promise<string> => {
  const { error } = await supabase.storage
    .from("images")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("images").getPublicUrl(path);
  return data.publicUrl;
};
