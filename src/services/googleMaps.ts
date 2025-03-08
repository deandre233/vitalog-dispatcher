
// Replace the implementation to fix the error
let isInitialized = false;

export async function initGoogleMaps(): Promise<{ google: typeof google }> {
  if (isInitialized) {
    return { google: window.google };
  }

  return new Promise((resolve, reject) => {
    try {
      const existingScript = document.getElementById('googleMapsScript');
      if (existingScript && window.google) {
        isInitialized = true;
        resolve({ google: window.google });
        return;
      }

      const script = document.createElement('script');
      script.id = 'googleMapsScript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        isInitialized = true;
        resolve({ google: window.google });
      };

      script.onerror = () => {
        reject(new Error('Google Maps script failed to load'));
      };

      document.head.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
}
