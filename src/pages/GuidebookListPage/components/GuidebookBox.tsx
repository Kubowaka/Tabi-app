import { css } from "@emotion/react";

type PlanBoxProps = {
  id: string;
  title: string;
  date: string;
  onClick: () => void;
  onMenuClick?: () => void;
};

export const PlanBox = ({
  id,
  title,
  date,
  onClick,
  onMenuClick,
}: PlanBoxProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      id={id}
      css={planBoxStyle}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${title}の旅行プランを開く`}
    >
      {/* アイコン */}
      <div css={iconStyle}>✈</div>

      {/* しおり情報 */}
      <div css={infoStyle}>
        <h2>{title}</h2>

        <div css={lineStyle} />

        <p>{date}</p>
      </div>

      {/* メニューボタン */}
      <button
        css={menuButtonStyle}
        onClick={(event) => {
          event.stopPropagation();
          onMenuClick?.();
        }}
        type="button"
        aria-label={`${title}のメニューを開く`}
      >
        ⋮
      </button>
    </div>
  );
};

/* しおりカード */
const planBoxStyle = css`
  width: 100%;
  min-height: 98px;

  display: flex;
  align-items: center;

  padding: 14px 18px;
  box-sizing: border-box;

  border: 2px solid #91d9e6;
  border-radius: 8px;

  background-color: #fffaf0;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid #4d90a0;
    outline-offset: 3px;
  }
`;

/* メニューボタン */
const menuButtonStyle = css`
  width: 32px;
  height: 50px;
  margin-left: 8px;
  padding: 0;

  border: none;
  background-color: transparent;

  color: #555555;
  font-size: 24px;
  font-weight: bold;

  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
`;

/* アイコン */
const iconStyle = css`
  width: 65px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 42px;
`;

/* しおり情報 */
const infoStyle = css`
  flex: 1;

  h2 {
    margin: 0;
    color: #111111;
    font-size: 20px;
    font-weight: bold;
  }

  p {
    margin: 7px 0 0;
    color: #111111;
    font-size: 12px;
    font-weight: bold;
  }
`;

/* 区切り線 */
const lineStyle = css`
  width: 100%;
  height: 2px;
  margin-top: 5px;
  background-color: #91d9e6;
`;
