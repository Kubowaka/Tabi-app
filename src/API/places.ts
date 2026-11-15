const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Google Places APIのレスポンス型
type PlacesApiResponse = {
  places?: {
    id?: string;
    displayName?: {
      text?: string;
    };
    formattedAddress?: string;
    photos?: {
      name?: string;
    }[];
    location?: {
      latitude?: number;
      longitude?: number;
    };
    editorialSummary?: {
      text?: string;
    };
    types?: string[];
    primaryType?: string;
  }[];
};

// APIキーの確認
const checkApiKey = () => {
  if (!API_KEY) {
    throw new Error("Google Maps APIキーが設定されていません");
  }
};

// Google Places APIのレスポンスとエラーを処理
const parsePlacesResponse = async (
  response: Response,
): Promise<PlacesApiResponse> => {
  const text = await response.text();

  let data: unknown;

  try {
    data = JSON.parse(text);
  } catch {
    console.error("Places APIからJSON以外の応答が返りました:", response.status);
    throw new Error(
      `Places API Error: JSON以外の応答 (HTTP ${response.status})`,
    );
  }

  if (!response.ok) {
    console.error("Places API Error:", response.status, data);
    throw new Error(`Places API Error: ${response.status}`);
  }

  return data as PlacesApiResponse;
};

// 写真URLを取得
export const getPhotoUrl = (photoName: string) => {
  checkApiKey();

  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=400&key=${API_KEY}`;
};

// 周辺スポットを検索
export const searchPlaces = async (
  placeType: string,
  lat: number,
  lng: number,
) => {
  checkApiKey();

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

  return parsePlacesResponse(response);
};

// キーワードでスポットを検索
export const searchPlacesText = async (
  query: string,
  placeType: string,
  lat?: number,
  lng?: number,
) => {
  checkApiKey();

  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.photos,places.location,places.editorialSummary,places.types,places.primaryType",
      },
      body: JSON.stringify({
        textQuery: query,
        ...(placeType && { includedType: placeType }),
        pageSize: 20,
        languageCode: "ja",
        ...(lat !== undefined &&
          lng !== undefined && {
            locationBias: {
              circle: {
                center: {
                  latitude: lat,
                  longitude: lng,
                },
                radius: 30000,
              },
            },
          }),
      }),
    },
  );

  return parsePlacesResponse(response);
};
