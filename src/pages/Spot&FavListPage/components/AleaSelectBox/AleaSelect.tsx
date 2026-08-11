import { useState, useEffect } from "react";
import { getPrefectures, getCities } from "../../../../API/area";

export default function AleaSelect() {
  const [prefectures, setPrefectures] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedPrefecture, setSelectedPrefecture] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
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
      // 都道府県がまだ選択されていない場合
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

        // ★ locationの中身をcitiesに保存
        setCities(cities.response.location);

        // 都道府県が変わったら、
        // 以前選択していた市区町村をリセット
        setSelectedCity("");

        // 確認用
        console.log("市区町村データ:", cities.response.city);

        // 都道府県が変わったら、
        // 以前選択していた市区町村をリセット
        setSelectedCity("");
      } catch (error) {
        console.error("市区町村の取得に失敗しました:", error);
      } finally {
        // API通信終了
        setLoading(false);
      }
    };

    // 市区町村取得処理を実行
    fetchCitiesByPrefecture();
  }, [selectedPrefecture]);

  return (
    <div style={{ display: "flex", gap: "16px", padding: "16px" }}>
      {/* 県ドロップダウン */}
      <div style={{ flex: 1 }}>
        <select
          value={selectedPrefecture}
          onChange={(e) => setSelectedPrefecture(e.target.value)}
          disabled={loading}
          style={{
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
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
          }}
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
      <div style={{ flex: 1 }}>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedPrefecture || loading}
          style={{
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
            cursor: selectedPrefecture && !loading ? "pointer" : "not-allowed",
            opacity: selectedPrefecture && !loading ? 1 : 0.5,
          }}
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
