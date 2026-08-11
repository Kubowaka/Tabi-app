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

  console.log("getCitiesの結果", data);

  console.log("prefecture:", prefecture);
  console.log(
    "API URL:",
    `https://geoapi.heartrails.com/api/json?method=getCities&prefecture=${encodeURIComponent(prefecture)}`,
  );
  console.log("response:", data.response);
  console.log("city:", data.response?.city);
  console.log("location:", data.response?.location);

  return data;
};
