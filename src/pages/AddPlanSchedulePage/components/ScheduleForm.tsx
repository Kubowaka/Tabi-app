/// しおり 予定追加ページ ///

import { css } from "@emotion/react";

// Addplanscheduleからの情報入手 //
type ScheduleFormProps = {
  day: string;
  startDate?: string;
  endDate?: string;
  title: string;
  startTime: string;
  endTime: string;
  memo: string;
  onDayChange: (day: string) => void;
  onTitleChange: (title: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onMemoChange: (memo: string) => void;
  onAddFavorite: () => void;
};

export const ScheduleForm = ({
  day,
  startDate,
  endDate,
  title,
  startTime,
  endTime,
  memo,
  onDayChange,
  onTitleChange,
  onStartTimeChange,
  onEndTimeChange,
  onMemoChange,
  onAddFavorite,
}: ScheduleFormProps) => {
  return (
    ////// 日程 //////
    <div css={containerStyle}>
      <div css={fieldStyle}>
        <label css={labelStyle}>日程</label>

        <select
          css={selectStyle}
          value={day}
          onChange={(e) => onDayChange(e.target.value)}
        >
          <option value="">選択してください</option>

          {/*  入力日程から何泊を計算 */}
          {Array.from(
            {
              length:
                startDate && endDate
                  ? Math.floor(
                      (new Date(endDate).getTime() -
                        new Date(startDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                    ) + 1
                  : 5,
            },
            (_, index) => {
              const dayNumber = index + 1;

              return (
                <option key={dayNumber} value={`${dayNumber}日目`}>
                  {dayNumber}日目
                </option>
              );
            },
          )}
        </select>
      </div>

      {/* ////// タイトル ////// */}
      <div css={fieldStyle}>
        <label css={labelStyle}>タイトル</label>
        <input
          css={titleInputStyle}
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="タイトルを入力してください"
        />
      </div>
      {/* ////// 時間 ////// */}

      <div css={fieldStyle}>
        <label css={labelStyle}>時間</label>

        <div css={timeRowStyle}>
          <div css={timeGroupStyle}>
            <select
              css={timeSelectStyle}
              value={startTime ? startTime.split(":")[0] : ""}
              onChange={(e) => {
                const minute = startTime ? startTime.split(":")[1] : "00";
                onStartTimeChange(`${e.target.value}:${minute}`);
              }}
            >
              <option value="">時</option>
              {Array.from({ length: 24 }, (_, index) =>
                String(index).padStart(2, "0"),
              ).map((hour) => (
                <option key={hour} value={hour}>
                  {hour}時
                </option>
              ))}
            </select>

            <select
              css={timeSelectStyle}
              value={startTime ? startTime.split(":")[1] : ""}
              onChange={(e) => {
                const hour = startTime ? startTime.split(":")[0] : "00";
                onStartTimeChange(`${hour}:${e.target.value}`);
              }}
            >
              <option value="">分</option>
              {Array.from({ length: 12 }, (_, index) =>
                String(index * 5).padStart(2, "0"),
              ).map((minute) => (
                <option key={minute} value={minute}>
                  {minute}分
                </option>
              ))}
            </select>
          </div>

          <span css={separatorStyle}>～</span>

          <div css={timeGroupStyle}>
            <select
              css={timeSelectStyle}
              value={endTime ? endTime.split(":")[0] : ""}
              onChange={(e) => {
                const minute = endTime ? endTime.split(":")[1] : "00";
                onEndTimeChange(`${e.target.value}:${minute}`);
              }}
            >
              <option value="">時</option>
              {Array.from({ length: 24 }, (_, index) =>
                String(index).padStart(2, "0"),
              ).map((hour) => (
                <option key={hour} value={hour}>
                  {hour}時
                </option>
              ))}
            </select>

            <select
              css={timeSelectStyle}
              value={endTime ? endTime.split(":")[1] : ""}
              onChange={(e) => {
                const hour = endTime ? endTime.split(":")[0] : "00";
                onEndTimeChange(`${hour}:${e.target.value}`);
              }}
            >
              <option value="">分</option>
              {Array.from({ length: 12 }, (_, index) =>
                String(index * 5).padStart(2, "0"),
              ).map((minute) => (
                <option key={minute} value={minute}>
                  {minute}分
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ////// メモ ////// */}
      <div css={fieldStyle}>
        <label css={labelStyle}>メモ</label>

        <textarea
          css={memoInputStyle}
          value={memo}
          onChange={(e) => onMemoChange(e.target.value)}
          placeholder="メモを入力してください"
        />
      </div>
      {/* ////// お気に入り追加ボタン ////// */}
      <button type="button" css={favoriteButtonStyle} onClick={onAddFavorite}>
        ☆ お気に入りから追加
      </button>
    </div>
  );
};



const containerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

//// 日程CSS ////
const fieldStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const labelStyle = css`
  color: #222222;
  font-size: 14px;
  font-weight: bold;
`;

const selectStyle = css`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #91d9e6;
  border-radius: 8px;
  background-color: #ffffff;
  color: #222222;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #5fc4d5;
  }
`;

//// タイトルCSS ////
const titleInputStyle = css`
  width: 100%;
  height: 42px;
  padding: 10px 12px;
  box-sizing: border-box;

  border: 1px solid #91d9e6;
  border-radius: 8px;

  background-color: #ffffff;
  color: #222222;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #5fc4d5;
  }

  &::placeholder {
    color: #aaaaaa;
  }
`;

//// メモCSS ////
const memoInputStyle = css`
  width: 100%;
  min-height: 100px;
  padding: 10px 12px;
  box-sizing: border-box;
  border: 1px solid #91d9e6;
  border-radius: 8px;
  background-color: #ffffff;
  color: #222222;
  font-size: 14px;
  resize: vertical;

  &::placeholder {
    color: #aaaaaa;
  }

  &:focus {
    outline: none;
    border-color: #5fc4d5;
  }
`;

//// 時間CSS ////
const timeRowStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const timeGroupStyle = css`
  display: flex;
  gap: 6px;
  flex: 1;
`;

const timeSelectStyle = css`
  flex: 1;
  min-width: 0;
  padding: 10px 8px;
  box-sizing: border-box;
  border: 1px solid #91d9e6;
  border-radius: 8px;
  background-color: #ffffff;
  color: #222222;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: #5fc4d5;
  }
`;

const separatorStyle = css`
  color: #222222;
  font-size: 18px;
  font-weight: bold;
`;

//// お気に入り追加ボタンCSS ////
const favoriteButtonStyle = css`
  display: block;
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #91d9e6;
  border-radius: 8px;
  background-color: #ffffff;
  color: #222222;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #f5fcfd;
  }
`;
