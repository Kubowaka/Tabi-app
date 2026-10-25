import { css } from "@emotion/react";
import { useState, useEffect, useRef } from "react";
import { getPrefectures, getCities, getTowns } from "../../../../API/area";
import { toHiragana } from "wanakana";

type City = {
  city: string;
  city_kana?: string;
};

const prefectureReadings: Record<string, string> = {
  北海道: "ほっかいどう",
  青森県: "あおもりけん",
  岩手県: "いわてけん",
  宮城県: "みやぎけん",
  秋田県: "あきたけん",
  山形県: "やまがたけん",
  福島県: "ふくしまけん",
  茨城県: "いばらきけん",
  栃木県: "とちぎけん",
  群馬県: "ぐんまけん",
  埼玉県: "さいたまけん",
  千葉県: "ちばけん",
  東京都: "とうきょうと",
  神奈川県: "かながわけん",
  新潟県: "にいがたけん",
  富山県: "とやまけん",
  石川県: "いしかわけん",
  福井県: "ふくいけん",
  山梨県: "やまなしけん",
  長野県: "ながのけん",
  岐阜県: "ぎふけん",
  静岡県: "しずおかけん",
  愛知県: "あいちけん",
  三重県: "みえけん",
  滋賀県: "しがけん",
  京都府: "きょうとふ",
  大阪府: "おおさかふ",
  兵庫県: "ひょうごけん",
  奈良県: "ならけん",
  和歌山県: "わかやまけん",
  鳥取県: "とっとりけん",
  島根県: "しまねけん",
  岡山県: "おかやまけん",
  広島県: "ひろしまけん",
  山口県: "やまぐちけん",
  徳島県: "とくしまけん",
  香川県: "かがわけん",
  愛媛県: "えひめけん",
  高知県: "こうちけん",
  福岡県: "ふくおかけん",
  佐賀県: "さがけん",
  長崎県: "ながさきけん",
  熊本県: "くまもとけん",
  大分県: "おおいたけん",
  宮崎県: "みやざきけん",
  鹿児島県: "かごしまけん",
  沖縄県: "おきなわけん",
};

type AleaSelectProps = {
  onCoordinatesChange: (lat: number, lng: number) => void;
  onAreaChange?: (prefecture: string, city: string) => void;
  resetOnMount?: boolean;
};

export default function AleaSelect({
  onCoordinatesChange,
  onAreaChange,
  resetOnMount = false,
}: AleaSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefectures, setPrefectures] = useState<string[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedPrefecture, setSelectedPrefecture] = useState(
    resetOnMount ? "" : localStorage.getItem("selectedPrefecture") || "",
  );

  const [selectedCity, setSelectedCity] = useState(
    resetOnMount ? "" : localStorage.getItem("selectedCity") || "",
  );

  const [prefectureInput, setPrefectureInput] = useState(
    resetOnMount ? "" : localStorage.getItem("selectedPrefecture") || "",
  );

  const [cityInput, setCityInput] = useState(
    resetOnMount ? "" : localStorage.getItem("selectedCity") || "",
  );
  const [showPrefectures, setShowPrefectures] = useState(false);
  const [showCities, setShowCities] = useState(false);
  const [loadingPrefectures, setLoadingPrefectures] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    onAreaChange?.(selectedPrefecture, selectedCity);
  }, [selectedPrefecture, selectedCity, onAreaChange]);

  // 都道府県一覧を取得
  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        setLoadingPrefectures(true);
        const data = await getPrefectures();

        if (data.response?.prefecture) {
          setPrefectures(data.response.prefecture);
        }
      } catch (error) {
        console.error("都道府県の取得に失敗しました:", error);
      } finally {
        setLoadingPrefectures(false);
      }
    };

    fetchPrefectures();
  }, []);

  // 都道府県に応じて市区町村一覧を取得
  useEffect(() => {
    const fetchCitiesByPrefecture = async () => {
      if (!selectedPrefecture) {
        setCities([]);
        return;
      }

      try {
        setLoadingCities(true);
        const data = await getCities(selectedPrefecture);
        setCities(data.response?.location ?? []);
      } catch (error) {
        console.error("市区町村の取得に失敗しました:", error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCitiesByPrefecture();
  }, [selectedPrefecture]);

  // 市区町村から座標を取得
  useEffect(() => {
    if (!selectedCity) return;

    const fetchCoordinates = async () => {
      try {
        const data = await getTowns(selectedCity);
        const location = data.response?.location?.[0];

        if (!location) {
          throw new Error("座標が見つかりません");
        }

        const lat = Number(location.y);
        const lng = Number(location.x);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          onCoordinatesChange(lat, lng);
        }
      } catch (error) {
        console.error("座標の取得に失敗しました:", error);
      }
    };

    fetchCoordinates();
  }, [selectedCity, onCoordinatesChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowPrefectures(false);
        setShowCities(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 入力文字で都道府県を絞り込む
  const normalizedPrefectureInput = toHiragana(prefectureInput.trim());

  const filteredPrefectures = prefectures.filter((prefecture) => {
    // 入力欄が空なら47都道府県をすべて表示
    if (!prefectureInput.trim()) return true;

    const reading = prefectureReadings[prefecture] ?? "";

    return (
      prefecture.includes(prefectureInput.trim()) ||
      reading.includes(normalizedPrefectureInput)
    );
  });

  // 入力文字で市区町村を絞り込む
  const normalizedCityInput = toHiragana(cityInput.trim());

  const filteredCities = cities.filter((city) => {
    // 入力欄が空なら市区町村をすべて表示
    if (!cityInput.trim()) return true;

    const nameMatches = city.city.includes(cityInput.trim());
    const readingMatches = toHiragana(city.city_kana ?? "").includes(
      normalizedCityInput,
    );

    return nameMatches || readingMatches;
  });

  const handlePrefectureSelect = (prefecture: string) => {
    setSelectedPrefecture(prefecture);
    setPrefectureInput(prefecture);
    localStorage.setItem("selectedPrefecture", prefecture);

    setSelectedCity("");
    setCityInput("");
    localStorage.removeItem("selectedCity");

    setShowPrefectures(false);
    setShowCities(false);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCityInput(city);
    localStorage.setItem("selectedCity", city);
    setShowCities(false);
  };

  return (
    <div css={containerStyle} ref={containerRef}>
      {/* 都道府県検索 */}
      <div css={fieldStyle}>
        <input
          css={inputStyle}
          type="text"
          value={prefectureInput}
          placeholder="都道府県を入力"
          disabled={loadingPrefectures}
          onFocus={() => {
            setPrefectureInput("");
            setShowPrefectures(true);
          }}
          onChange={(event) => {
            const value = event.target.value;
            setPrefectureInput(value);
            setShowPrefectures(true);

            if (value !== selectedPrefecture) {
              setSelectedPrefecture("");
              setSelectedCity("");
              setCityInput("");
              localStorage.removeItem("selectedPrefecture");
              localStorage.removeItem("selectedCity");
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setShowPrefectures(false);

            if (event.key === "Enter" && filteredPrefectures.length > 0) {
              event.preventDefault();
              handlePrefectureSelect(filteredPrefectures[0]);
            }
          }}
          autoComplete="off"
          aria-label="都道府県を検索"
        />

        {showPrefectures && (
          <ul css={suggestionsStyle}>
            {filteredPrefectures.length > 0 ? (
              filteredPrefectures.map((prefecture) => (
                <li key={prefecture}>
                  <button
                    type="button"
                    css={suggestionButtonStyle}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handlePrefectureSelect(prefecture)}
                  >
                    {prefecture}
                  </button>
                </li>
              ))
            ) : (
              <li css={noResultStyle}>候補がありません</li>
            )}
          </ul>
        )}
      </div>

      {/* 市区町村検索 */}
      <div css={fieldStyle}>
        <input
          css={inputStyle}
          type="text"
          value={cityInput}
          placeholder={
            !selectedPrefecture ? "先に都道府県を選択" : "市区町村を入力"
          }
          disabled={!selectedPrefecture || loadingCities}
          onFocus={() => {
            setCityInput("");
            setShowCities(true);
          }}
          onChange={(event) => {
            const value = event.target.value;
            setCityInput(value);
            setShowCities(true);

            if (value !== selectedCity) {
              setSelectedCity("");
              localStorage.removeItem("selectedCity");
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setShowCities(false);

            if (event.key === "Enter" && filteredCities.length > 0) {
              event.preventDefault();
              handleCitySelect(filteredCities[0].city);
            }
          }}
          autoComplete="off"
          aria-label="市区町村を検索"
        />

        {showCities && selectedPrefecture && (
          <ul css={suggestionsStyle}>
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <li key={city.city}>
                  <button
                    type="button"
                    css={suggestionButtonStyle}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleCitySelect(city.city)}
                  >
                    {city.city}
                  </button>
                </li>
              ))
            ) : (
              <li css={noResultStyle}>候補がありません</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

const containerStyle = css`
  display: flex;
  gap: 16px;
  padding: 16px;

  @media (min-width: 1024px) {
    width: 90%;
    margin: 0 auto;
  }
`;

const fieldStyle = css`
  position: relative;
  flex: 1;
  min-width: 0;
`;

const inputStyle = css`
  width: 100%;
  height: 44px;
  padding: 0 12px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  color: #222;
  font-size: 16px;

  &:focus {
    outline: 2px solid #91d9e6;
    outline-offset: 1px;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: #f5f5f5;
    opacity: 0.6;
  }
`;

const suggestionsStyle = css`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 1000;
  max-height: 240px;
  overflow-y: auto;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
`;

const suggestionButtonStyle = css`
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: #fff;
  color: #222;
  text-align: left;
  font-size: 15px;
  cursor: pointer;

  &:hover,
  &:focus {
    background: #eaf8fb;
    outline: none;
  }
`;

const noResultStyle = css`
  padding: 12px;
  color: #888;
  font-size: 14px;
`;
