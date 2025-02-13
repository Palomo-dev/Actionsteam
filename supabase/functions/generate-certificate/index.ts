import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as PDFLib from 'https://esm.sh/pdf-lib@1.17.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { certificateId } = await req.json()
    console.log('Generating certificate for ID:', certificateId)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Obtener datos del certificado
    const { data: certificate, error: certError } = await supabase
      .from('certificates')
      .select(`
        *,
        courses (
          title
        ),
        profiles (
          first_name
        )
      `)
      .eq('id', certificateId)
      .single()

    if (certError || !certificate) {
      console.error('Error fetching certificate:', certError)
      throw new Error('Certificado no encontrado')
    }

    console.log('Certificate data:', certificate)

    // Crear PDF
    const pdfDoc = await PDFLib.PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4
    const { height } = page.getSize()

    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica)
    const fontSize = 30

    // Agregar contenido al PDF
    page.drawText('Certificado de Finalización', {
      x: 50,
      y: height - 100,
      size: fontSize,
      font,
    })

    page.drawText(`Otorgado a: ${certificate.profiles.first_name}`, {
      x: 50,
      y: height - 200,
      size: 20,
      font,
    })

    page.drawText(`Por completar el curso:`, {
      x: 50,
      y: height - 250,
      size: 20,
      font,
    })

    page.drawText(certificate.courses.title, {
      x: 50,
      y: height - 300,
      size: 25,
      font,
    })

    page.drawText(`Con una calificación de: ${certificate.score}%`, {
      x: 50,
      y: height - 350,
      size: 20,
      font,
    })

    const pdfBytes = await pdfDoc.save()

    return new Response(
      pdfBytes,
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="certificado-${certificateId}.pdf"`,
        }
      }
    )

  } catch (error) {
    console.error('Error generating certificate:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})