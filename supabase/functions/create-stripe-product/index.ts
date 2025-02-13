import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const { title, description, price_cop } = await req.json();

    // Validación mejorada
    if (!title?.trim()) {
      console.error('Título inválido:', title);
      throw new Error('El título del curso es requerido y no puede estar vacío');
    }

    console.log('Creando producto en Stripe:', { 
      title: title.trim(), 
      description: description?.trim() || title.trim(),
      price_cop 
    });

    // Crear el producto en Stripe usando el título validado
    const product = await stripe.products.create({
      name: title.trim(),
      description: description?.trim() || title.trim(),
      metadata: {
        course_title: title.trim(),
      },
      default_price_data: {
        currency: 'cop',
        unit_amount: (price_cop || 0) * 100, // Stripe espera el precio en centavos
      },
    });

    console.log('Producto Stripe creado:', product.id);

    return new Response(
      JSON.stringify({ 
        productId: product.id,
        priceId: product.default_price,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creando producto en Stripe:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Error al crear el producto en Stripe. Por favor, verifica los datos ingresados.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});