import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { SpotCard } from "./components/SpotBox/SpotCard";
import { getPhotoUrl } from "../../API/places";
import { getFavorites, deleteFavorite } from "../../services/favorieteService";
import AleaSelect from "./components/AleaSelectBox/AleaSelect";

const typeName: Record<string, string> = {
  tourist_attraction: "観光スポット",
  historical_landmark: "歴史的名所",
  cultural_landmark: "文化的名所",
  park: "公園",
  museum: "博物館",
  nature_preserve: "自然保護区",
};

export const FavList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [favoriteSpots, setFavoriteSpots] = useState<any[]>([]);
  const isAddingToSchedule = location.state?.from === "add-plan-schedule";
  const [selectedPrefecture, setSelectedPrefecture] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // ========================================
  // お気に入り取得
  // ========================================

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await getFavorites();
        setFavoriteSpots(data);
      } catch (error) {
        console.error("お気に入りの取得に失敗しました:", error);
      }
    };

    loadFavorites();
  }, []);

  // ========================================
  // お気に入り解除
  // ========================================
  const removeFavorite = async (favorite: any) => {
    try {
      await deleteFavorite(favorite.id);

      setFavoriteSpots((currentFavorites) =>
        currentFavorites.filter(
          (currentFavorite) => currentFavorite.id !== favorite.id,
        ),
      );
    } catch (error) {
      console.error("お気に入りの解除に失敗しました:", error);
      alert("お気に入りの解除に失敗しました");
    }
  };

  // 選択された都道府県・市区町村でお気に入りを絞り込む
  const filteredFavorites = favoriteSpots.filter((spot: any) => {
    const address = spot.address ?? spot.formattedAddress ?? "";

    // 県が未選択なら、すべて表示
    if (!selectedPrefecture) return true;

    // 住所に選択した都道府県が含まれているか確認
    if (!address.includes(selectedPrefecture)) return false;

    // 市区町村が未選択なら、県だけで絞り込む
    if (!selectedCity) return true;

    // 住所に選択した市区町村が含まれているか確認
    return address.includes(selectedCity);
  });

  return (
    <div css={pageStyle}>
      <AleaSelect
        resetOnMount
        onCoordinatesChange={() => {}}
        onAreaChange={(prefecture, city) => {
          setSelectedPrefecture(prefecture);
          setSelectedCity(city);
        }}
      />

      <main css={listAreaStyle}>
        {filteredFavorites.length > 0 ? (
          <div css={gridStyle}>
            {filteredFavorites.map((spot: any) => (
              <div key={spot.id} css={cardWrapperStyle}>
                <SpotCard
                  name={spot.name ?? ""}
                  image={spot.imageName ? getPhotoUrl(spot.imageName) : ""}
                  title={spot.name ?? ""}
                  description={
                    spot.description ??
                    typeName[spot.primaryType] ??
                    spot.address ??
                    ""
                  }
                  favorite={true}
                  onFavoriteClick={() => removeFavorite(spot)}
                />

                {isAddingToSchedule && (
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/add-plan-schedule", {
                        state: {
                          planId: location.state?.planId,
                          planTitle: location.state?.planTitle,
                          startDate: location.state?.startDate || "",
                          endDate: location.state?.endDate || "",
                          scheduleId: location.state?.scheduleId,
                          favorite: spot,
                          title: spot.name ?? "",
                          day: location.state?.day || "",
                          startTime: location.state?.startTime || "",
                          endTime: location.state?.endTime || "",
                          memo: location.state?.memo || "",
                        },
                      });
                    }}
                  >
                    このスポットを予定に追加
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p css={emptyStyle}>お気に入り登録した スポットはありません</p>
        )}
      </main>
    </div>
  );
};

/* ========================================
   ページ全体
======================================== */

const pageStyle = css`
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  background-color: #ffffff;
`;

/* ========================================
   お気に入り一覧
======================================== */

const listAreaStyle = css`
  margin: 0 12px 20px;
  padding: 16px 12px 24px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 6px;

  @media (min-width: 768px) {
    height: 700px;
    margin: 0 20px 20px;
    padding: 16px;
    background-color: #f8f8f883;
    overflow-y: auto;
  }
`;

const cardWrapperStyle = css`
  width: 100%;
  min-width: 0;

  & > * {
    width: 100%;
    min-width: 0;
  }
`;

const gridStyle = css`
  display: grid;
  grid-template-columns: repeat(2, 180px);
  gap: 16px;
  justify-content: center;
  justify-items: center;
  align-content: start;

  /* アイパッド＆PC 3列 */
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px 5px;
    align-content: start;
    padding-inline: 12px;
  }
`;

const emptyStyle = css`
  margin: 50px 0;

  text-align: center;

  color: #999999;
  font-size: 14px;
`;
