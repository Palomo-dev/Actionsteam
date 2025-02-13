import { supabase } from "@/integrations/supabase/client";

export const uploadProfileImage = async (file: File, userId: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // First, delete any existing profile images for this user
    const { data: existingFiles } = await supabase.storage
      .from('profile_images')
      .list();

    const userExistingFiles = existingFiles?.filter(file => 
      file.name.startsWith(userId)
    );

    for (const file of userExistingFiles || []) {
      await supabase.storage
        .from('profile_images')
        .remove([file.name]);
    }

    // Upload the new image
    const { error: uploadError, data } = await supabase.storage
      .from('profile_images')
      .upload(filePath, file, {
        upsert: true,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile_images')
      .getPublicUrl(filePath);

    // Update the user's profile with the new image URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ instructor_image: publicUrl })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      throw updateError;
    }

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadProfileImage:', error);
    throw error;
  }
};

// Primary export for file uploads
export const uploadFile = async (file: File, folder: string) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('course_files')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('course_files')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};