import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51Qwxk52U9133PASOCyMo8wn8xwc2rWHWO7vgDEQrt81myHRDARDzHgIfDgPKGYndgHCl6q77YvPCvqEiMi62WqBx000Xq6mBTa', {
  apiVersion: '2023-10-16',
});

export async function createCheckoutSession(items: any[], deliveryFee: number) {
  const lineItems = items.map(item => ({
    price_data: {
      currency: 'brl',
      product_data: {
        name: item.product.nome,
        images: [item.product.imagem_url || 'https://via.placeholder.com/400'],
      },
      unit_amount: Math.round(item.product.preco * 100), // Stripe works with cents
    },
    quantity: item.quantity,
  }));

  // Add delivery fee as a separate line item
  if (deliveryFee > 0) {
    lineItems.push({
      price_data: {
        currency: 'brl',
        product_data: {
          name: 'Taxa de Entrega',
        },
        unit_amount: Math.round(deliveryFee * 100),
      },
      quantity: 1,
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/cart`,
      shipping_address_collection: {
        allowed_countries: ['BR'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'brl',
            },
            display_name: 'Entrega Padrão',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 5,
              },
            },
          },
        },
      ],
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
} 