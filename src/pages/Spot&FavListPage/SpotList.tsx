import { useState } from "react";
import AleaSelect from "./components/AleaSelectBox/AleaSelect";
import { SpotGrid } from "./components/SpotBox/SpotGrid";
import { SpotBackground } from "./components/SpotBox/SpotBackground";

export const SpotList = () => {
  const [spots] = useState<any[]>([]);

  return (
    <>
      <AleaSelect></AleaSelect>
      <SpotBackground>
        <SpotGrid>
          <>
            {/* Google Places APIの処理実装予定 */}
            {spots.length === 0 && <p>検索結果がまだ表示されていません</p>}
          </>
        </SpotGrid>
      </SpotBackground>
    </>
  );
};
