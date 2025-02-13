import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploader } from "./ImageUploader";
import { updateMetaTags } from "@/utils/metaTagsUtils";

interface ImageUploadSectionProps {
  label: string;
  currentImage: string;
  type: 'favicon' | 'cover';
  onImageUpdate: (url: string) => void;
}

export const ImageUploadSection = ({ 
  label, 
  currentImage, 
  type,
  onImageUpdate 
}: ImageUploadSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImage);

  useEffect(() => {
    setImageUrl(currentImage);
  }, [currentImage]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Por favor selecciona un archivo de imagen");
      return;
    }

    try {
      setIsUploading(true);
      const fileName = type === 'favicon' ? 'favicon.ico' : 'og-image.png';
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', fileName);
      formData.append('timestamp', Date.now().toString());

      // First, try to delete the existing file
      if (type === 'favicon') {
        const { data: existingFiles, error: listError } = await supabase.storage
          .from('public_assets')
          .list();

        if (listError) {
          console.error('Error listing files:', listError);
          throw listError;
        }

        const faviconFile = existingFiles?.find(f => f.name === 'favicon.ico');
        if (faviconFile) {
          const { error: deleteError } = await supabase.storage
            .from('public_assets')
            .remove(['favicon.ico']);
            
          if (deleteError) {
            console.error('Error deleting existing favicon:', deleteError);
            throw deleteError;
          }
          
          // Wait for deletion to complete
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      const { data, error } = await supabase.functions.invoke('update-public-file', {
        body: formData
      });

      if (error) throw error;

      const newUrl = data.url;
      console.log('New image URL:', newUrl);
      
      // Update local state and UI with cache busting
      const timestamp = new Date().getTime();
      const urlWithTimestamp = `${newUrl}?t=${timestamp}`;
      
      setImageUrl(urlWithTimestamp);
      onImageUpdate(urlWithTimestamp);
      
      // Update meta tags
      await updateMetaTags(urlWithTimestamp, type);

      // Force favicon refresh if updating favicon
      if (type === 'favicon') {
        const links = document.querySelectorAll("link[rel*='icon']");
        links.forEach(link => {
          link.remove();
        });
        
        // Add empty favicon to clear cache
        const emptyFavicon = document.createElement('link');
        emptyFavicon.rel = 'icon';
        emptyFavicon.href = 'data:,';
        document.head.appendChild(emptyFavicon);
        
        // Add new favicon
        const newLink = document.createElement('link');
        newLink.type = 'image/x-icon';
        newLink.rel = 'icon';
        newLink.href = urlWithTimestamp;
        document.head.appendChild(newLink);
        
        // Remove empty favicon after a short delay
        setTimeout(() => {
          emptyFavicon.remove();
        }, 100);
      }

      toast.success(`${label} actualizado correctamente`);
      
      // Force page reload after a brief delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(`Error al actualizar ${label.toLowerCase()}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsUploading(true);
      const defaultUrl = type === 'favicon' ? "/favicon.ico" : "/og-image.png";
      
      // Add timestamp for cache busting
      const timestamp = new Date().getTime();
      const urlWithTimestamp = `${defaultUrl}?t=${timestamp}`;
      
      setImageUrl(urlWithTimestamp);
      onImageUpdate(urlWithTimestamp);
      
      await updateMetaTags(urlWithTimestamp, type);
      
      // Force favicon refresh if resetting favicon
      if (type === 'favicon') {
        const links = document.querySelectorAll("link[rel*='icon']");
        links.forEach(link => {
          link.remove();
        });
        
        // Add empty favicon to clear cache
        const emptyFavicon = document.createElement('link');
        emptyFavicon.rel = 'icon';
        emptyFavicon.href = 'data:,';
        document.head.appendChild(emptyFavicon);
        
        // Add new favicon
        const newLink = document.createElement('link');
        newLink.type = 'image/x-icon';
        newLink.rel = 'icon';
        newLink.href = urlWithTimestamp;
        document.head.appendChild(newLink);
        
        // Remove empty favicon after a short delay
        setTimeout(() => {
          emptyFavicon.remove();
        }, 100);
      }
      
      toast.success(`${label} restablecido`);
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error resetting image:', error);
      toast.error(`Error al restablecer ${label.toLowerCase()}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <ImageUploader
        isUploading={isUploading}
        onFileChange={handleImageChange}
        onReset={handleReset}
        currentImage={imageUrl}
        type={type}
      />
    </div>
  );
};