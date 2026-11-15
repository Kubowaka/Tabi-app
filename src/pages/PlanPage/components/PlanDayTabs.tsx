import { css } from "@emotion/react";
import { useEffect, useRef, useState } from "react";

type PlanDayTabsProps = {
  dates: string[];
  selectedDate: string;
  onDateChange: (date: string) => void;
};

export const PlanDayTabs = ({
  dates,
  selectedDate,
  onDateChange,
}: PlanDayTabsProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [scrollInfo, setScrollInfo] = useState({
    scrollWidth: 0,
    clientWidth: 0,
    scrollLeft: 0,
  });

  const updateScrollInfo = () => {
    const element = listRef.current;
    if (!element) return;

    setScrollInfo({
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
      scrollLeft: element.scrollLeft,
    });
  };

  useEffect(() => {
    const element = listRef.current;
    if (!element) return;

    updateScrollInfo();

    element.addEventListener("scroll", updateScrollInfo);
    window.addEventListener("resize", updateScrollInfo);

    const observer = new ResizeObserver(updateScrollInfo);
    observer.observe(element);

    return () => {
      element.removeEventListener("scroll", updateScrollInfo);
      window.removeEventListener("resize", updateScrollInfo);
      observer.disconnect();
    };
  }, [dates]);

  const hasOverflow = scrollInfo.scrollWidth > scrollInfo.clientWidth;

  const thumbWidth = hasOverflow
    ? Math.max(20, (scrollInfo.clientWidth / scrollInfo.scrollWidth) * 100)
    : 100;

  const maxScroll = Math.max(
    1,
    scrollInfo.scrollWidth - scrollInfo.clientWidth,
  );

  const thumbPosition = hasOverflow
    ? (scrollInfo.scrollLeft / maxScroll) * (100 - thumbWidth)
    : 0;

  const handleThumbPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const track = event.currentTarget.parentElement;
    const list = listRef.current;

    if (!track || !list || !hasOverflow) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const startX = event.clientX;
    const startScroll = list.scrollLeft;
    const trackWidth = track.clientWidth;
    const thumbWidthPx = (thumbWidth / 100) * trackWidth;

    const handleMove = (moveEvent: PointerEvent) => {
      const distance = moveEvent.clientX - startX;
      const availableTrack = trackWidth - thumbWidthPx;

      if (availableTrack <= 0) return;

      list.scrollLeft = startScroll + (distance / availableTrack) * maxScroll;
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  return (
    <div css={containerStyle}>
      <div ref={listRef} css={listStyle}>
        {dates.map((date) => (
          <button
            key={date}
            type="button"
            css={[buttonStyle, selectedDate === date && activeButtonStyle]}
            onClick={() => onDateChange(date)}
          >
            {date}
          </button>
        ))}
      </div>

      {hasOverflow && (
        <div css={trackStyle}>
          <div
            css={thumbStyle}
            style={{
              width: `${thumbWidth}%`,
              left: `${thumbPosition}%`,
            }}
            onPointerDown={handleThumbPointerDown}
          />
        </div>
      )}
    </div>
  );
};

const containerStyle = css`
  width: 100%;
  min-width: 0;
  margin-top: 20px;
`;

const listStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  width: 100%;
  max-width: 100%;
  padding: 0;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 600px) {
    justify-content: flex-start;
  }
`;

const buttonStyle = css`
  flex: 0 0 auto;
  min-width: 0;
  padding: 8px 12px;
  border: 1px solid #91d9e6;
  border-radius: 20px;
  background-color: #ffffff;
  color: #222222;
  font-size: 13px;
  font-weight: bold;
  white-space: nowrap;
  cursor: pointer;
`;

const activeButtonStyle = css`
  background-color: #91d9e6;
  color: #ffffff;
`;

const trackStyle = css`
  position: relative;
  width: 100%;
  height: 6px;
  margin-top: 8px;
  border-radius: 10px;
  background: #eeeeee;
  overflow: hidden;
`;

const thumbStyle = css`
  position: absolute;
  top: 0;
  height: 6px;
  min-width: 20px;
  border-radius: 10px;
  background: #91d9e6;
  cursor: grab;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
`;
