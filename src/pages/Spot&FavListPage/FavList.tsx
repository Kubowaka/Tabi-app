import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { SpotCard } from "./components/SpotBox/SpotCard";
import { getPhotoUrl } from "../../API/places";
import { getFavorites, deleteFavorite } from "../../services/favorieteService";

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

  const planId = location.state?.planId;

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

  return (
    <div css={pageStyle}>
      {/* =========================
          検索・絞り込み
      ========================= */}

      <div css={searchAreaStyle}>
        {/* カテゴリー */}

        <div css={selectWrapperStyle}>
          <select css={categorySelectStyle}>
            <option value="">カテゴリー</option>

            <option value="tour">観光</option>

            <option value="gourmet">グルメ</option>

            <option value="experience">体験</option>
          </select>

          <span css={arrowStyle}>▼</span>
        </div>

        {/* 都道府県・エリア */}

        <div css={filterRowStyle}>
          <div css={smallSelectWrapperStyle}>
            <select css={smallSelectStyle}>
              <option value="">都道府県</option>
            </select>

            <span css={smallArrowStyle}>▼</span>
          </div>

          <div css={areaStyle}>エリア：札幌</div>
        </div>
      </div>

      {/* =========================
          お気に入り一覧
      ========================= */}

      <main css={listAreaStyle}>
        {favoriteSpots.length > 0 ? (
          <div css={gridStyle}>
            {favoriteSpots.map((spot: any) => (
              <div key={spot.id}>
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
                          planId: planId,
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
  min-height: 100vh;
  background-color: #ffffff;
`;

/* ========================================
   検索エリア
======================================== */

const searchAreaStyle = css`
  padding: 26px 20px 10px;
`;

/* ========================================
   カテゴリー
======================================== */

const selectWrapperStyle = css`
  position: relative;
  width: 100%;
`;

const categorySelectStyle = css`
  width: 100%;
  height: 48px;

  padding: 0 40px 0 15px;

  border: 1px solid #e1e5e8;
  border-radius: 5px;

  background-color: #ffffff;

  color: #d5d9dd;
  font-size: 14px;

  appearance: none;
`;

const arrowStyle = css`
  position: absolute;

  top: 50%;
  right: 15px;

  transform: translateY(-50%);

  color: #222222;
  font-size: 14px;

  pointer-events: none;
`;

/* ========================================
   都道府県・エリア
======================================== */

const filterRowStyle = css`
  display: flex;
  gap: 8px;

  margin-top: 16px;
`;

const smallSelectWrapperStyle = css`
  position: relative;
  flex: 1;
`;

const smallSelectStyle = css`
  width: 100%;
  height: 34px;

  padding: 0 30px 0 12px;

  border: 1px solid #e1e5e8;
  border-radius: 5px;

  background-color: #ffffff;

  color: #d5d9dd;
  font-size: 13px;

  appearance: none;
`;

const smallArrowStyle = css`
  position: absolute;

  top: 50%;
  right: 10px;

  transform: translateY(-50%);

  color: #222222;
  font-size: 11px;

  pointer-events: none;
`;

const areaStyle = css`
  flex: 1;

  height: 34px;

  display: flex;
  align-items: center;

  padding: 0 10px;

  border: 1px solid #e1e5e8;
  border-radius: 5px;

  background-color: #ffffff;

  color: #333333;
  font-size: 13px;
  font-weight: bold;
`;

/* ========================================
   お気に入り一覧
======================================== */

const listAreaStyle = css`
  padding: 10px 20px 30px;
`;

const gridStyle = css`
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 10px;
`;

const emptyStyle = css`
  margin: 50px 0;

  text-align: center;

  color: #999999;
  font-size: 14px;
`;
