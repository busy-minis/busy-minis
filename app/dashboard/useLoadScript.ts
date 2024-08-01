// import { useEffect, useState } from "react";

// const useLoadScript = (apiKey) => {
//   const [scriptLoaded, setScriptLoaded] = useState(false);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
//     script.async = true;
//     script.onload = () => setScriptLoaded(true);
//     document.head.appendChild(script);

//     return () => {
//       document.head.removeChild(script);
//     };
//   }, [apiKey]);

//   return scriptLoaded;
// };

// export default useLoadScript;
