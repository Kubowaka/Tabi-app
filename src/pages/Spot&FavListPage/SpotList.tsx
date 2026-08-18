import { useState, useEffect } from "react";
import AleaSelect from "./components/AleaSelectBox/AleaSelect";
import { SpotCard } from "./components/SpotBox/SpotCard";
import { SpotGrid } from "./components/SpotBox/SpotGrid";
import { SpotBackground } from "./components/SpotBox/SpotBackground";
import CategoryTabs, { type CategoryKey } from "./components/CategoryTabs";
import { searchPlaces, searchPlacesText, getPhotoUrl } from "../../API/places";
import { searchKeyword } from "../../API/searchKeywords";

export const SpotList = () => {
  const [spots, setSpots] = useState<any[]>([]);
  const [category, setCategory] = useState<CategoryKey>("tour");
  console.log("現在のカテゴリ:", category);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // まだ座標を受け取っていなければ何もしない
      if (!coordinates) {
        return;
      }

      const queries = searchKeyword[category];

      console.log("現在のカテゴリ:", category);
      console.log("Text Searchの検索文:", queries);

      let keyword = "";

      if (category === "tour") {
        keyword = "tourist_attraction";
      } else if (category === "gourmet") {
        keyword = "restaurant";
      }

      const results = await Promise.all(
        queries.map((query) =>
          searchPlacesText(query, keyword, coordinates.lat, coordinates.lng),
        ),
      );
      console.log("★ Text Searchの全結果 ★");
      console.log(results);

      const allPlaces = results.flatMap((result) => result.places ?? []);

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
      <CategoryTabs category={category} onChange={setCategory} />
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
                area={spot.formattedAddress ?? ""}
                category={category}
                title={spot.displayName?.text ?? ""}
                description={spot.formattedAddress ?? ""}
              />
            ))}
          </>
        </SpotGrid>
      </SpotBackground>
    </>
  );
};
