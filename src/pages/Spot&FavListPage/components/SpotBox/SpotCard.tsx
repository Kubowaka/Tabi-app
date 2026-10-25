import { css } from "@emotion/react";

type SpotCardProps = {
  name: string;
  image: string;
  title: string;
  description: string;
  favorite?: boolean;
  onFavoriteClick?: () => void;
};

export const SpotCard = ({
  image,
  title,
  description,
  favorite = false,
  onFavoriteClick,
}: SpotCardProps) => {
  return (
    <article css={cardStyle}>
      <div css={imageArea}>
        {image ? (
          <img src={image} css={imageStyle} />
        ) : (
          <div css={noImageStyle}>No image</div>
        )}

        <button css={favoriteButton} onClick={onFavoriteClick} type="button">
          {favorite ? "⭐" : "☆"}
        </button>
      </div>

      <div css={contentStyle}>
        <h3 css={titleStyle}>{title}</h3>

        <p css={descriptionStyle}>{description}</p>
      </div>
    </article>
  );
};

///CSS

const cardStyle = css`
  width: 180px;
  height: 280px;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  /* アイパッド＆PC版カードを広げる */
  @media (min-width: 768px) {
    width: 90%;
    height: 280px;
    border-radius: 16px;
  }
`;

const imageArea = css`
  height: 150px;
  position: relative;
`;

const imageStyle = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const noImageStyle = css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eeeeee;
  color: #888888;
  font-size: 14px;
`;

const favoriteButton = css`
  position: absolute;
  top: 8px;
  right: 8px;

  width: 36px;
  height: 36px;

  border: none;
  border-radius: 50%;
  background: white;
  cursor: pointer;

  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

const contentStyle = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px;
`;

const titleStyle = css`
  color: #f08d2d;
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 10px;
`;

const descriptionStyle = css`
  color: #666;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
`;
