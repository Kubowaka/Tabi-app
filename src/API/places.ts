const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const getPhotoUrl = (photoName: string) => {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${API_KEY}`;
};

export const searchPlaces = async (
  placeType: string,
  lat: number,
  lng: number,
) => {
  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchNearby",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.photos,places.location,places.editorialSummary,places.types,places.primaryType",
      },
      body: JSON.stringify({
        includedTypes: [placeType],
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng,
            },
            radius: 3000,
          },
        },
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Nearby Search API Error:", data);
    throw new Error(`Places API Error: ${response.status}`);
  }

  return data;
};

export const searchPlacesText = async (
  query: string,
  placeType: string,
  lat: number,
  lng: number,
) => {
  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask":
          // "places.id,places.displayName,places.formattedAddress,places.photos,places.location",
          "places.id,places.displayName,places.formattedAddress,places.photos,places.location,places.editorialSummary,places.types,places.primaryType",
      },
      body: JSON.stringify({
        textQuery: query,

        ...(placeType && {
          includedType: placeType,
        }),

        pageSize: 20,
        languageCode: "ja",

        locationRestriction: {
          rectangle: {
            low: {
              latitude: lat - 0.027,
              longitude: lng - 0.034,
            },
            high: {
              latitude: lat + 0.027,
              longitude: lng + 0.034,
            },
          },
        },
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Text Search API Error:", data);
    throw new Error(`Places API Error: ${response.status}`);
  }

  return data;
};
