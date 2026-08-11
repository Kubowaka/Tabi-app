const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const getPhotoUrl = (photoName: string) => {
  return `
https://places.googleapis.com/v1/${photoName}/media
?maxWidthPx=400
&key=${API_KEY}
`;
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
      method: "POST",/*ここでデータ返されてる?*/
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.photos",
      },
      body: JSON.stringify({
        includedTypes: [keyword],
        maxResultCount: 10,/*max*/
        locationRestriction: {
          circle: {
            center: {
              latitude: lat,
              longitude: lng,
            },
            radius: 5000,/*半径5k*/
          },
        },
      }),
    },
  );

  return await response.json();
};
