import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
export const stripePromise = loadStripe('pk_test_51Qwxk52U9133PASOEmdpMa7kYWQDU3NOzlVsyCe9EZDAQElzXjYumcI5ifZYs4BhI4cqBs1zUlywzIn9j82ulNtG00qIEpc9sF'); 