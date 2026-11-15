import { auth } from "../../firebase";
import { useState, useEffect, useCallback } from "react";
import AleaSelect from "./components/AleaSelectBox/AleaSelect";
import { SpotCard } from "./components/SpotBox/SpotCard";
import { SpotGrid } from "./components/SpotBox/SpotGrid";
import { SpotBackground } from "./components/SpotBox/SpotBackground";
import CategoryTabs, { type CategoryKey } from "./components/CategoryTabs";
import { searchPlaces, searchPlacesText, getPhotoUrl } from "../../API/places";
import {
  getFavorites,
  addFavorite,
  deleteFavorite,
} from "../../services/favorieteService";

// スポット情報の型
type Place = {
  id: string;
  displayName?: {
    text?: string;
  };
  photos?: {
    name?: string;
  }[];

  editorialSummary?: {
    text?: string;
  };
  primaryType?: string;
  formattedAddress?: string;
};

// お気に入り情報の型
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

// localStorageのカテゴリ値を確認
const getInitialCategory = (): CategoryKey => {
  const savedCategory = localStorage.getItem("category");

  if (
    savedCategory === "tour" ||
    savedCategory === "gourmet" ||
    savedCategory === "experience"
  ) {
    return savedCategory;
  }

  return "tour";
};

export const SpotList = () => {
  const [spots, setSpots] = useState<Place[]>([]);
  const [favoriteSpots, setFavoriteSpots] = useState<Favorite[]>([]);
  const [processingFavoriteIds, setProcessingFavoriteIds] = useState<string[]>(
    [],
  );

  const [category, setCategory] = useState<CategoryKey>(getInitialCategory);

  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [selectedArea, setSelectedArea] = useState({
    prefecture: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // 座標が同じなら状態を更新しない
  const handleCoordinatesChange = useCallback((lat: number, lng: number) => {
    setCoordinates((current) => {
      if (current?.lat === lat && current?.lng === lng) {
        return current;
      }

      return { lat, lng };
    });
  }, []);

  // 都道府県・市区町村の変更を受け取る
  const handleAreaChange = useCallback((prefecture: string, city: string) => {
    setSelectedArea({ prefecture, city });
    setCoordinates(null);
  }, []);

  // お気に入り一覧を取得
  useEffect(() => {
    let active = true;

    const loadFavorites = async () => {
      try {
        const data = await getFavorites();

        if (active) {
          setFavoriteSpots(data);
        }
      } catch (error) {
        console.error("お気に入りの取得に失敗しました:", error);
      }
    };

    void loadFavorites();

    return () => {
      active = false;
    };
  }, []);

  // お気に入り登録・解除
  const toggleFavorite = async (spot: Place) => {
    if (processingFavoriteIds.includes(spot.id)) return;

    const favorite = favoriteSpots.find((item) => item.spotId === spot.id);

    try {
      setProcessingFavoriteIds((currentIds) => [...currentIds, spot.id]);

      if (favorite) {
        await deleteFavorite(favorite.id);

        setFavoriteSpots((current) =>
          current.filter((item) => item.id !== favorite.id),
        );
      } else {
        await addFavorite(spot);

        const updatedFavorites = await getFavorites();
        setFavoriteSpots(updatedFavorites);
      }
    } catch (error) {
      console.error("お気に入りの変更に失敗しました:", error);

      if (!auth.currentUser) {
        alert("お気に入り機能はログイン後にご使用いただけます");
      } else {
        alert("お気に入りの変更に失敗しました。もう一度お試しください。");
      }
    } finally {
      setProcessingFavoriteIds((currentIds) =>
        currentIds.filter((id) => id !== spot.id),
      );
    }
  };

  // スポット検索
  useEffect(() => {
    if (!selectedArea.prefecture) {
      setSpots([]);
      setSearchError("");
      setLoading(false);
      return;
    }

    // 市区町村が選択されている場合は座標取得を待つ
    if (selectedArea.city && !coordinates) {
      setLoading(false);
      return;
    }

    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setSearchError("");

      let placeTypes: string[];

      if (category === "tour") {
        placeTypes = [
          "tourist_attraction",
          "historical_landmark",
          "cultural_landmark",
        ];
      } else if (category === "gourmet") {
        placeTypes = ["restaurant", "cafe", "dessert_restaurant"];
      } else {
        placeTypes = [
          "adventure_sports_center",
          "amusement_center",
          "historical_landmark",
        ];
      }

      const typeNames: Record<string, string> = {
        tourist_attraction: "観光スポット",
        historical_landmark: "歴史的名所",
        cultural_landmark: "文化的名所",
        restaurant: "レストラン",
        cafe: "カフェ",
        dessert_restaurant: "スイーツ",
        adventure_sports_center: "アクティビティ",
        amusement_center: "レジャー施設",
      };

      try {
        const allPlaces: Place[] = [];

        for (const placeType of placeTypes) {
          if (!active) return;

          let result;

          if (selectedArea.city && coordinates) {
            // 市区町村がある場合：周辺検索
            result = await searchPlaces(
              placeType,
              coordinates.lat,
              coordinates.lng,
            );
          } else {
            // 県だけの場合：テキスト検索
            const query = `${selectedArea.prefecture} ${typeNames[placeType]}`;

            result = await searchPlacesText(query, placeType);
          }

          const placesWithId = (result.places ?? []).filter(
            (place): place is typeof place & { id: string } =>
              typeof place.id === "string" && place.id.length > 0,
          );

          allPlaces.push(...placesWithId);
        }

        if (!active) return;

        // 重複するスポットを除外
        const uniquePlaces = Array.from(
          new Map(allPlaces.map((place) => [place.id, place])).values(),
        );

        setSpots(uniquePlaces);
      } catch (error) {
        console.error("スポット検索に失敗しました:", error);

        if (active) {
          setSearchError(
            "スポットを取得できませんでした。時間をおいて再度お試しください。",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      active = false;
    };
  }, [coordinates, category, selectedArea]);

  return (
    <>
      <AleaSelect
        onCoordinatesChange={handleCoordinatesChange}
        onAreaChange={handleAreaChange}
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
            {loading && <p>スポットを検索しています...</p>}

            {!loading && searchError && <p>{searchError}</p>}

            {!loading && !searchError && spots.length === 0 && (
              <p>検索結果がまだ表示されていません</p>
            )}

            {spots.map((spot) => (
              <SpotCard
                key={spot.id}
                name={spot.displayName?.text ?? ""}
                image={
                  spot.photos?.[0]?.name ? getPhotoUrl(spot.photos[0].name) : ""
                }
                title={spot.displayName?.text ?? ""}
                description={
                  spot.editorialSummary?.text ??
                  typeName[spot.primaryType ?? ""] ??
                  spot.formattedAddress ??
                  ""
                }
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
