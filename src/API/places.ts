const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const getPhotoUrl = (photoName: string) => {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${API_KEY}`;
};

export const searchPlaces = async (
  /*データ投げてる？ 13~15*/
  keyword: string,
  lat: number,
  lng: number,
) => {
  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchNearby",
    {
      method: "POST" /*ここでデータ返されてる?*/,
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.photos,places.location",
      },
      body: JSON.stringify({
        includedTypes: [keyword],
        maxResultCount: 30 /*max*/,
        locationRestriction: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng,
            },
            radius: 3000 /*半径*/,
          },
        },
      }),
    },
  );

  return await response.json();
};

export const searchPlacesText = async (
  query: string,
  keyword: string,
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
          "places.id,places.displayName,places.formattedAddress,places.photos,places.location",
      },
      body: JSON.stringify({
        textQuery: query,
        ...(keyword && { includedType: keyword }),
        pageSize: 30,
        languageCode: "ja",

        // ★ここを変更
        locationRestriction: {
          rectangle: {
            low: {
              latitude: Number(lat) - 0.027,
              longitude: Number(lng) - 0.034,
            },
            high: {
              latitude: Number(lat) + 0.027,
              longitude: Number(lng) + 0.034,
            },
          },
        },
      }),
    },
  );

  return await response.json();
};
