import { css } from "@emotion/react";

export type CategoryKey =
  | "tour"
  | "gourmet"
  | "experience";

type Props = {
  category: CategoryKey;
  onChange: (category: CategoryKey) => void;
};

const tabs: { key: CategoryKey; label: string }[] = [
  { key: "tour", label: "観光" },
  { key: "gourmet", label: "グルメ" },
  { key: "experience", label: "体験" },
];

const CategoryTabs = ({ category, onChange }: Props) => {
  return (
    <div css={containerStyle}>
      <div
        css={tabsStyle}
        role="tablist"
        aria-label="カテゴリ選択"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={category === tab.key}
            css={[
              tabStyle,
              category === tab.key && activeStyle,
            ]}
            onClick={() => onChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const containerStyle = css`
  display: flex;
  /* justify-content: center; */
  padding-top: 8px;
`;

const tabsStyle = css`
  display: flex;
  gap: 10px;
  background: transparent;
  padding: 6px 8px 0 8px;
`;

const tabStyle = css`
  appearance: none;
  -webkit-appearance: none;
  border: none;
  background: #e9eef3;
  color: #6b7280;
  font-weight: 700;
  padding: 10px 26px;
  border-radius: 12px 12px 0 0;
  box-shadow: none;
  cursor: pointer;

  transition:
    transform 120ms ease,
    box-shadow 120ms ease,
    background 120ms ease;

  &:focus {
    background-color: #FFAE00;
    color: white;
  }

  @media (max-width: 420px) {
    padding: 8px 14px;
    font-size: 14px;
  }
`;

const activeStyle = css`
  background: #ffb400;
  color: #ffffff;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-4px);
`;

export default CategoryTabs;