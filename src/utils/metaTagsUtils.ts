import { supabase } from "@/integrations/supabase/client";

export const updateMetaTags = async (url: string, type: 'favicon' | 'cover') => {
  try {
    if (type === 'favicon') {
      // Remove all existing favicons
      const existingFavicons = document.querySelectorAll("link[rel*='icon']");
      existingFavicons.forEach(favicon => favicon.remove());

      // Create and append new favicon link
      const link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = url;
      document.head.appendChild(link);

      // Force browser to clear favicon cache
      const clearCacheLink = document.createElement('link');
      clearCacheLink.rel = 'icon';
      clearCacheLink.href = 'data:,';  // Empty favicon
      document.head.appendChild(clearCacheLink);
      clearCacheLink.remove();

      // Update manifest if it exists
      const manifest = document.querySelector("link[rel='manifest']");
      if (manifest) {
        manifest.setAttribute('href', `data:application/json,{"icons":[{"src":"${url}"}]}`);
      }

      console.log('Favicon updated with cache clearing:', url);

    } else if (type === 'cover') {
      // Update og:image meta tags
      let ogImage = document.querySelector("meta[property='og:image']");
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', url);
      console.log('Cover image updated:', url);
    }

    // Update site settings in database
    const { error: updateError } = await supabase
      .from('site_settings')
      .upsert({
        key: type === 'favicon' ? 'favicon_url' : 'cover_url',
        value: url,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      });

    if (updateError) throw updateError;

    // Force favicon refresh in all tabs
    if (type === 'favicon') {
      localStorage.setItem('favicon_update', new Date().toISOString());
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'favicon_update',
        newValue: url
      }));
    }

    console.log(`Meta tags and settings updated for ${type}:`, url);

  } catch (error) {
    console.error('Error updating meta tags:', error);
    throw error;
  }
};