import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { SpotCard } from "./components/SpotBox/SpotCard";
import { getPhotoUrl } from "../../API/places";
import { getFavorites, deleteFavorite } from "../../services/favorieteService";
import AleaSelect from "./components/AleaSelectBox/AleaSelect";

type Favorite = {
  id: string;
  userId: string;
  spotId: string;
  name: string;
  address: string;
  imageName: string;
  description: string;
  primaryType: string;
};

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

  const [favoriteSpots, setFavoriteSpots] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const isAddingToSchedule = location.state?.from === "add-plan-schedule";

  const [selectedPrefecture, setSelectedPrefecture] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // お気に入り取得
  useEffect(() => {
    let cancelled = false;

    const loadFavorites = async () => {
      try {
        const data = await getFavorites();

        if (!cancelled) {
          setFavoriteSpots(data);
        }
      } catch (error) {
        console.error("お気に入りの取得に失敗しました:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadFavorites();

    return () => {
      cancelled = true;
    };
  }, []);

  // お気に入り解除
  const removeFavorite = async (favorite: Favorite) => {
    if (deletingIds.includes(favorite.id)) return;

    try {
      setDeletingIds((currentIds) => [...currentIds, favorite.id]);

      await deleteFavorite(favorite.id);

      setFavoriteSpots((currentFavorites) =>
        currentFavorites.filter(
          (currentFavorite) => currentFavorite.id !== favorite.id,
        ),
      );
    } catch (error) {
      console.error("お気に入りの解除に失敗しました:", error);
      alert("お気に入りの解除に失敗しました");
    } finally {
      setDeletingIds((currentIds) =>
        currentIds.filter((id) => id !== favorite.id),
      );
    }
  };

  // 予定に追加
  const handleAddToSchedule = (spot: Favorite) => {
    navigate("/add-plan-schedule", {
      state: {
        from: "favorite-selection",
        planId: location.state?.planId,
        planTitle: location.state?.planTitle,
        startDate: location.state?.startDate || "",
        endDate: location.state?.endDate || "",
        scheduleId: location.state?.scheduleId,
        favorite: spot,
        title: spot.name,
        day: location.state?.day || "",
        startTime: location.state?.startTime || "",
        endTime: location.state?.endTime || "",
        memo: location.state?.memo || "",
      },
    });
  };

  // お気に入りからの追加をキャンセル
  const handleCancelFavorite = () => {
    navigate("/add-plan-schedule", {
      state: {
        planId: location.state?.planId,
        planTitle: location.state?.planTitle,
        startDate: location.state?.startDate || "",
        endDate: location.state?.endDate || "",
        scheduleId: location.state?.scheduleId,
        day: location.state?.day || "",
        title: location.state?.title || "",
        startTime: location.state?.startTime || "",
        endTime: location.state?.endTime || "",
        memo: location.state?.memo || "",
      },
    });
  };

  // お気に入りの絞り込み
  const filteredFavorites = favoriteSpots.filter((spot) => {
    const address = spot.address;

    if (!selectedPrefecture) return true;

    if (!address.includes(selectedPrefecture)) return false;

    if (!selectedCity) return true;

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
        {loading ? (
          <p css={emptyStyle}>お気に入りを読み込んでいます...</p>
        ) : filteredFavorites.length > 0 ? (
          <div css={gridStyle}>
            {filteredFavorites.map((spot) => (
              <div key={spot.id} css={cardWrapperStyle}>
                <SpotCard
                  name={spot.name}
                  image={spot.imageName ? getPhotoUrl(spot.imageName) : ""}
                  title={spot.name}
                  description={
                    spot.description ||
                    typeName[spot.primaryType] ||
                    spot.address
                  }
                  favorite={true}
                  onFavoriteClick={() => removeFavorite(spot)}
                />

                {isAddingToSchedule && (
                  <button
                    type="button"
                    css={addToScheduleButtonStyle}
                    onClick={() => handleAddToSchedule(spot)}
                  >
                    予定に追加
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p css={emptyStyle}>
            {favoriteSpots.length === 0
              ? "お気に入り登録したスポットはありません"
              : "条件に一致するスポットはありません"}
          </p>
        )}
      </main>

      {/* お気に入りからの追加キャンセルボタン */}
      {isAddingToSchedule && (
        <button
          type="button"
          css={favoriteCancelButtonStyle}
          onClick={handleCancelFavorite}
        >
          追加をキャンセル
        </button>
      )}
    </div>
  );
};

/* ページ全体 */

const pageStyle = css`
  width: 100%;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  background-color: #ffffff;
`;

/* お気に入り一覧 */

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
  display: flex;
  flex-direction: column;
  align-items: stretch;

  & > * {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }
`;

const gridStyle = css`
  display: grid;
  grid-template-columns: repeat(2, 180px);
  gap: 16px;
  justify-content: center;
  justify-items: center;
  align-content: start;

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

const addToScheduleButtonStyle = css`
  display: block;
  width: calc(100% - 30px);
  margin: 8px auto;
  padding: 10px 8px;
  border: 1px solid #f6c5d2;
  border-radius: 20px;
  background: linear-gradient(135deg, #fff0f4 0%, #ffe0e9 100%);
  color: #b85d78;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
  box-shadow: 0 3px 8px rgba(219, 139, 164, 0.18);
  cursor: pointer;
  transition:
    background 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #ffe5ed 0%, #ffd3e0 100%);
    box-shadow: 0 5px 12px rgba(219, 139, 164, 0.28);
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 5px rgba(219, 139, 164, 0.18);
  }

  &:focus-visible {
    outline: 2px solid #e89bb3;
    outline-offset: 3px;
  }
`;

/* お気に入り追加キャンセルボタン */

const favoriteCancelButtonStyle = css`
  position: fixed;
  right: 24px;
  bottom: 90px;
  z-index: 200;

  padding: 13px 20px;
  border: 1px solid #f6c5d2;
  border-radius: 25px;
  background: linear-gradient(135deg, #fff0f4 0%, #ffe0e9 100%);
  color: #b85d78;
  font-size: 13px;
  font-weight: bold;
  box-shadow: 0 3px 10px rgba(219, 139, 164, 0.25);
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: #ffe5ed;
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.97);
  }

  &:focus-visible {
    outline: 2px solid #e89bb3;
    outline-offset: 3px;
  }
`;
