import { useEffect } from "react";

export default function LoadGoogleMapsScript() {
  useEffect(() => {
    const loadScript = (url: string) => {
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      document.head.appendChild(script);
    };

    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyCUa2HZ94Us1drPt-7bdpWaEB-Eaa4lzlg&libraries=places`
    );
  }, []);

  return null;
}

//Proceed to Stripe Payment Page
// const stripe = await stripePromise;

// if (stripe) {
//   const response = await fetch("/api/create-checkout-session", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       price: totalPrice,
//       rideData: formData,
//     }),
//   });

//   const session = await response.json();
//   await stripe.redirectToCheckout({ sessionId: session.id });
// }
