import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { getPrefectures, getCities, getTowns } from "../../../../API/area";

export default function AleaSelect({
  onCoordinatesChange,
}: {
  onCoordinatesChange: (lat: number, lng: number) => void;
}) {
  const [prefectures, setPrefectures] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedPrefecture, setSelectedPrefecture] = useState(
    localStorage.getItem("selectedPrefecture") || "",
  );
  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem("selectedCity") || "",
  );

  const [loading, setLoading] = useState(false);

  // 都道府県を取得
  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        setLoading(true);
        const data = await getPrefectures();
        console.log("都道府県データ:", data);
        if (data.response && data.response.prefecture) {
          setPrefectures(data.response.prefecture);
        }
      } catch (error) {
        console.error("都道府県の取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrefectures();
  }, []);

  // 選択された都道府県に基づいて市区町村を取得
  useEffect(() => {
    const fetchCitiesByPrefecture = async () => {
      if (!selectedPrefecture) {
        setCities([]);
        return;
      }

      try {
        // API通信中
        setLoading(true);

        // 選択された都道府県をHeartRailsに渡す
        const cities = await getCities(selectedPrefecture);

        // APIから返ってきたデータを確認
        console.log("response:", cities.response);
        console.log("city:", cities.response?.city);
        console.log("location:", cities.response?.location);

        setCities(cities.response.location);

        console.log("市区町村データ:", cities.response.city);
      } catch (error) {
        console.error("市区町村の取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCitiesByPrefecture();
  }, [selectedPrefecture]);

  // 市区町村が選択されたら座標を取得
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!selectedCity) {
        return;
      }

      try {
        // 選択した市区町村をHeartRailsに渡す
        const data = await getTowns(selectedCity);

        // 取得したデータを確認
        console.log("★ getTownsの結果 ★");
        console.log(data);
        const lat = Number(data.response.location[0].y);
        const lng = Number(data.response.location[0].x);

        //★SpotListに座標を渡す
        onCoordinatesChange(lat, lng);
      } catch (error) {
        console.error("座標の取得に失敗しました:", error);
      }
    };

    fetchCoordinates();
  }, [selectedCity]);

  return (
    <div css={containerStyle}>
      {/* 県ドロップダウン */}
      <div css={fieldStyle}>
        <select
          value={selectedPrefecture}
          onChange={(e) => {
            const prefecture = e.target.value;
            setSelectedPrefecture(prefecture);
            localStorage.setItem("selectedPrefecture", prefecture);

            setSelectedCity("");
            localStorage.removeItem("selectedCity");
          }}
          disabled={loading}
          css={[selectStyle, loading && disabledStyle]}
        >
          <option value="">県</option>
          {prefectures.map((pref: any) => (
            <option key={pref} value={pref}>
              {pref}
            </option>
          ))}
        </select>
      </div>

      {/* 市区町村ドロップダウン */}
      <div css={fieldStyle}>
        <select
          value={selectedCity}
          onChange={(e) => {
            const city = e.target.value;
            setSelectedCity(city);
            localStorage.setItem("selectedCity", city);
          }}
          disabled={!selectedPrefecture || loading}
          css={[selectStyle, (!selectedPrefecture || loading) && disabledStyle]}
        >
          <option value="">市区町村</option>
          {cities?.map((city) => (
            <option key={city.city} value={city.city}>
              {city.city}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/////css/////

const containerStyle = css({
  display: "flex",
  gap: "16px",
  padding: "16px",
});

const fieldStyle = css({
  flex: 1,
});

const selectStyle = css({
  width: "100%",
  padding: "12px",
  fontSize: "16px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: "36px",
  cursor: "pointer",
  opacity: 1,
});

const disabledStyle = css({
  cursor: "not-allowed",
  opacity: 0.5,
});
