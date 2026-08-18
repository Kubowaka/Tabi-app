import type { CategoryKey } from "../pages/Spot&FavListPage/components/CategoryTabs";

export const searchKeyword: Record<CategoryKey, string[]> = {
  tour: ["観光スポット", "名所", "観光地"],
  gourmet: ["ご当地グルメ", "百名店"],
  experience: ["アクティビティ", "体験", "ワークショップ", "観光体験"],
};