import supabase from '@/utils/supabase/server'

export const uploadImage = async (file: File, path: string) => {
  try {
    const { data, error } = await supabase.storage.from('images').upload(path, file)

    if (error) {
      throw new Error('Error uploading image: ' + error.message)
    }

    const publicUrlData = supabase.storage.from('images').getPublicUrl(path)

    if (!publicUrlData.data) {
      throw new Error('Error getting public URL')
    }

    console.log('Imagen subida con éxito:', publicUrlData.data.publicUrl)
    return publicUrlData.data.publicUrl 

  } catch (error) {
    if (error instanceof Error) {
      console.error('Error al subir la imagen:', error.message)
    } else {
      console.error('Error al subir la imagen:', error)
    }
    return null
  }
  
};
