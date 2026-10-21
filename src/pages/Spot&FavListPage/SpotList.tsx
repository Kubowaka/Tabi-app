import { useState, useEffect } from "react";
import AleaSelect from "./components/AleaSelectBox/AleaSelect";
import { SpotCard } from "./components/SpotBox/SpotCard";
import { SpotGrid } from "./components/SpotBox/SpotGrid";
import { SpotBackground } from "./components/SpotBox/SpotBackground";
import CategoryTabs, { type CategoryKey } from "./components/CategoryTabs";
import { searchPlaces, getPhotoUrl } from "../../API/places";
import { searchKeyword } from "../../API/searchKeywords";
import {
  getFavorites,
  addFavorite,
  deleteFavorite,
} from "../../services/favorieteService";

// import { useAuth } from "../../auth/AuthContext";

const typeName: Record<string, string> = {
  tourist_attraction: "観光スポット",
  historical_landmark: "歴史的名所",
  cultural_landmark: "文化的名所",
  park: "公園",
  museum: "博物館",
  nature_preserve: "自然保護区",
};

export const SpotList = () => {
  // const { user } = useAuth();

  const [spots, setSpots] = useState<any[]>([]);

  // お気に入り一覧
  const [favoriteSpots, setFavoriteSpots] = useState<any[]>([]);

  const [category, setCategory] = useState<CategoryKey>(
    (localStorage.getItem("category") as CategoryKey) || "tour",
  );

  console.log("現在のカテゴリ:", category);

  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // ========================================
  // localStorageからお気に入りを読み込む
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
  // お気に入り登録・解除
  // ========================================

  const toggleFavorite = async (spot: any) => {
    const favorite = favoriteSpots.find(
      (favorite) => favorite.spotId === spot.id,
    );

    try {
      if (favorite) {
        // お気に入り解除
        await deleteFavorite(favorite.id);

        setFavoriteSpots((currentFavorites) =>
          currentFavorites.filter(
            (currentFavorite) => currentFavorite.id !== favorite.id,
          ),
        );
      } else {
        // お気に入り登録
        await addFavorite(spot);

        const updatedFavorites = await getFavorites();
        setFavoriteSpots(updatedFavorites);
      }
    } catch (error) {
      console.error("お気に入りの変更に失敗しました:", error);
      alert("お気に入りの変更に失敗しました");
    }
  };

  // ========================================
  // スポット検索
  // ========================================

  useEffect(() => {
    const fetchData = async () => {
      // まだ座標を受け取っていなければ何もしない
      if (!coordinates) {
        return;
      }

      const queries = searchKeyword[category];

      console.log("現在のカテゴリ:", category);
      console.log("Text Searchの検索文:", queries);

      let placeTypes: string[] = [];

      if (category === "tour") {
        placeTypes = [
          "tourist_attraction",
          "historical_landmark",
          "cultural_landmark",
        ];
      } else if (category === "gourmet") {
        placeTypes = ["restaurant", "cafe", "dessert_restaurant"];
      } else if (category === "experience") {
        placeTypes = [
          "adventure_sports_center",
          "amusement_center",
          "historical_landmark",
        ];
      }

      //↓3種類帰ってきたらまとめて結果を表示する
      const results = await Promise.all(
        placeTypes.map((placeType) =>
          searchPlaces(placeType, coordinates.lat, coordinates.lng),
        ),
      );

      // console.log("★ Text Searchの全結果 ★");
      console.log(results);

      const allPlaces = results.flatMap((result) => result.places ?? []);

      console.log(
        "★ editorialSummaryがある施設 ★",
        allPlaces.filter((place) => place.editorialSummary),
      );

      console.log(
        "★ types ★",
        allPlaces.map((place) => ({
          name: place.displayName?.text,
          types: place.types,
          primaryType: place.primaryType,
        })),
      );

      console.log("★ 全検索結果をまとめたもの ★");
      console.log(allPlaces);

      const uniquePlaces = Array.from(
        new Map(allPlaces.map((place) => [place.id, place])).values(),
      );

      console.log("★ 重複削除後 ★");
      console.log(uniquePlaces);

      setSpots(uniquePlaces);
    };

    fetchData();
  }, [coordinates, category]);

  return (
    <>
      <AleaSelect
        onCoordinatesChange={(lat, lng) => {
          console.log("SpotListが受け取った緯度:", lat);
          console.log("SpotListが受け取った経度:", lng);

          setCoordinates({
            lat,
            lng,
          });
        }}
      />

      <CategoryTabs
        category={category}
        onChange={(newCategory) => {
          setCategory(newCategory);

          localStorage.setItem("category", newCategory);
        }}
      />

      <SpotBackground>
        <SpotGrid>
          <>
            {spots.length === 0 && <p>検索結果がまだ表示されていません</p>}

            {spots.map((spot: any) => (
              <SpotCard
                key={spot.id}
                name={spot.displayName?.text ?? ""}
                image={
                  spot.photos?.[0]?.name ? getPhotoUrl(spot.photos[0].name) : ""
                }
                title={spot.displayName?.text ?? ""}
                description={
                  spot.editorialSummary?.text ??
                  typeName[spot.primaryType] ??
                  spot.formattedAddress ??
                  ""
                }
                // ★ お気に入り関係
                favorite={favoriteSpots.some(
                  (favorite) => favorite.spotId === spot.id,
                )}
                onFavoriteClick={() => toggleFavorite(spot)}
              />
            ))}
          </>
        </SpotGrid>
      </SpotBackground>
    </>
  );
};
