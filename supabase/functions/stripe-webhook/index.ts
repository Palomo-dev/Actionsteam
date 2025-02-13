import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')!;
    const body = await req.text();
    
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || '',
    );

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, courseId, paymentType } = session.metadata!;

        if (paymentType === 'subscription') {
          // Handle subscription payment
          await supabase.from('subscriptions').insert({
            user_id: userId,
            stripe_subscription_id: session.subscription,
            status: 'active',
            current_period_start: new Date(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          });

          await supabase.from('profiles').update({
            is_subscribed: true,
          }).eq('id', userId);

          console.log('Subscription activated for user:', userId);
        } else {
          // Handle one-time course purchase
          if (courseId) {
            await supabase.from('payments').insert({
              user_id: userId,
              course_id: courseId,
              amount: session.amount_total! / 100,
              currency: session.currency?.toUpperCase(),
              status: 'completed',
              stripe_payment_id: session.payment_intent as string,
              payment_type: 'one_time',
            });

            await supabase.from('user_courses').insert({
              user_id: userId,
              course_id: courseId,
              status: 'not_started',
            });

            console.log('Course purchase completed for user:', userId, 'course:', courseId);
          }
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const { customer } = subscription;
        
        const { data: customerData } = await stripe.customers.retrieve(customer as string);
        
        const { data: userData } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', (customerData as any).email)
          .single();

        if (userData) {
          await supabase.from('profiles').update({
            is_subscribed: false,
          }).eq('id', userData.id);

          await supabase.from('subscriptions')
            .update({ status: 'cancelled' })
            .eq('user_id', userData.id);

          console.log('Subscription cancelled for user:', userData.id);
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }
});