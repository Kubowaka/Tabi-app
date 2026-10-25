// 都道府県一覧
export const getPrefectures = async () => {
  const response = await fetch(
    "https://geoapi.heartrails.com/api/json?method=getPrefectures",
  );

  const data = await response.json();

  return data;
};

// 市区町村一覧
export const getCities = async (prefecture: string) => {
  const response = await fetch(
    `https://geoapi.heartrails.com/api/json?method=getCities&prefecture=${encodeURIComponent(prefecture)}`,
  );

  const data = await response.json();
  
  return data;
};

// 市区町村から座標を取得
export const getTowns = async (city: string) => {
  const response = await fetch(
    `https://geoapi.heartrails.com/api/json?method=getTowns&city=${encodeURIComponent(city)}`,
  );

  const data = await response.json();

  return data;
};