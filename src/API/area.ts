type AreaApiResponse = {
  response?: {
    prefecture?: string[];
    location?: {
      city?: string;
      town?: string;
      x?: number;
      y?: number;
    }[];
  };
  [key: string]: unknown;
};

// APIレスポンスを取得・処理
const fetchAreaData = async (url: string): Promise<AreaApiResponse> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HeartRails Geo API Error: HTTP ${response.status}`);
  }

  try {
    return (await response.json()) as AreaApiResponse;
  } catch {
    throw new Error("HeartRails Geo APIから不正なJSONが返されました");
  }
};

// 都道府県一覧
export const getPrefectures = async () => {
  return fetchAreaData(
    "https://geoapi.heartrails.com/api/json?method=getPrefectures",
  );
};

// 市区町村一覧
export const getCities = async (prefecture: string) => {
  return fetchAreaData(
    `https://geoapi.heartrails.com/api/json?method=getCities&prefecture=${encodeURIComponent(prefecture)}`,
  );
};

// 市区町村から座標を取得
export const getTowns = async (city: string) => {
  return fetchAreaData(
    `https://geoapi.heartrails.com/api/json?method=getTowns&city=${encodeURIComponent(city)}`,
  );
};
