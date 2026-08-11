import { css } from "@emotion/react";

type SpotCardProps = {
  name: string;
  image: string;
  area: string;
  category: string;
  title: string;
  description: string;
  favorite?: boolean;
};

export const SpotCard = ({
  image,
  area,
  category,
  title,
  description,
  favorite = false,
}: SpotCardProps) => {
  return (
    <article css={cardStyle}>
      <div css={imageArea}>
       <img src={image}  css={imageStyle} />

        <button css={favoriteButton}>{favorite ? "⭐" : "☆"}</button>
      </div>

      <div css={contentStyle}>
        <div css={tagArea}>
          <span css={areaTag}>📍 {area}</span>
          <span css={categoryTag}>{category}</span>
        </div>

        <h3 css={titleStyle}>{title}</h3>

        <p css={descriptionStyle}>{description}</p>
      </div>
    </article>
  );
};

const cardStyle = css`
  width: 180px;
  height: 280px;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const imageArea = css`
  flex: 1;
  position: relative;
`;

const imageStyle = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
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

const tagArea = css`
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
`;

const areaTag = css`
  background: #dff6f7;
  color: #2b7c8a;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
`;

const categoryTag = css`
  background: #e6f5dc;
  color: #4f7d3a;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
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
