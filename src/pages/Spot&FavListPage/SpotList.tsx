import { useState, useEffect, useCallback } from "react";
import AleaSelect from "./components/AleaSelectBox/AleaSelect";
import { SpotCard } from "./components/SpotBox/SpotCard";
import { SpotGrid } from "./components/SpotBox/SpotGrid";
import { SpotBackground } from "./components/SpotBox/SpotBackground";
import CategoryTabs, { type CategoryKey } from "./components/CategoryTabs";
import { searchPlaces, getPhotoUrl } from "../../API/places";
import {
  getFavorites,
  addFavorite,
  deleteFavorite,
} from "../../services/favorieteService";

const typeName: Record<string, string> = {
  tourist_attraction: "観光スポット",
  historical_landmark: "歴史的名所",
  cultural_landmark: "文化的名所",
  park: "公園",
  museum: "博物館",
  nature_preserve: "自然保護区",
};

export const SpotList = () => {
  const [spots, setSpots] = useState<any[]>([]);
  const [favoriteSpots, setFavoriteSpots] = useState<any[]>([]);

  const [category, setCategory] = useState<CategoryKey>(
    (localStorage.getItem("category") as CategoryKey) || "tour",
  );

  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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

    loadFavorites();

    return () => {
      active = false;
    };
  }, []);

  // お気に入り登録・解除
  const toggleFavorite = async (spot: any) => {
    const favorite = favoriteSpots.find((item) => item.spotId === spot.id);

    try {
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
      alert("お気に入りの変更に失敗しました");
    }
  };

  // スポット検索
  useEffect(() => {
    if (!coordinates) return;

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

      try {
        const allPlaces: any[] = [];

        // APIを同時ではなく順番に呼び出す
        for (const placeType of placeTypes) {
          if (!active) return;

          const result = await searchPlaces(
            placeType,
            coordinates.lat,
            coordinates.lng,
          );

          allPlaces.push(...(result.places ?? []));
        }

        if (!active) return;

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

    fetchData();

    return () => {
      active = false;
    };
  }, [coordinates, category]);

  return (
    <>
      <AleaSelect onCoordinatesChange={handleCoordinatesChange} />

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
