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
