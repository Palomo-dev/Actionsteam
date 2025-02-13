import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const fileName = formData.get('fileName')

    if (!file || !fileName) {
      console.error('No file or filename provided')
      return new Response(
        JSON.stringify({ error: 'No file uploaded or filename missing' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Processing file upload:', fileName)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Primero eliminamos TODOS los archivos existentes con el mismo nombre
    const { data: existingFiles, error: listError } = await supabase.storage
      .from('public_assets')
      .list()

    if (listError) {
      console.error('Error listing files:', listError)
      throw listError
    }

    const filesToRemove = existingFiles?.filter(f => f.name === fileName.toString())
    
    if (filesToRemove && filesToRemove.length > 0) {
      console.log('Found files to remove:', filesToRemove)
      
      const { error: removeError } = await supabase.storage
        .from('public_assets')
        .remove(filesToRemove.map(f => f.name))

      if (removeError) {
        console.error('Error removing files:', removeError)
        throw removeError
      }
      
      console.log('Successfully removed existing files')
      
      // Esperamos un momento para asegurar que la eliminación se complete
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    // Subimos el nuevo archivo con control de caché estricto
    const { error: uploadError } = await supabase.storage
      .from('public_assets')
      .upload(fileName.toString(), file, {
        cacheControl: 'no-store',
        upsert: true
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    // Obtenemos la URL pública con timestamp para forzar actualización
    const timestamp = Date.now()
    const { data: { publicUrl } } = supabase.storage
      .from('public_assets')
      .getPublicUrl(fileName.toString())

    const urlWithTimestamp = `${publicUrl}?t=${timestamp}`

    // Actualizamos la configuración del sitio
    const settingKey = fileName === 'favicon.ico' ? 'favicon_url' : 'cover_url'
    const { error: dbError } = await supabase
      .from('site_settings')
      .upsert({
        key: settingKey,
        value: urlWithTimestamp,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'key'
      })

    if (dbError) {
      console.error('Database error:', dbError)
      throw dbError
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        url: urlWithTimestamp,
        message: 'File uploaded and settings updated successfully'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})