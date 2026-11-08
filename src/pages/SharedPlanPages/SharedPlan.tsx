import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlanShareByToken } from "../../services/planService";
import { PlanDayTabs } from "../PlanPage/components/PlanDayTabs";
import { PlanSchedule } from "../PlanPage/components/PlanSchedule";

type SharedSchedule = {
  id: string;
  day: string;
  title: string;
  startTime: string;
  endTime: string;
  memo: string;
};

type SharedPlanData = {
  plan: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
  };
  schedules: SharedSchedule[];
};

export const SharedPlan = () => {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<SharedPlanData | null>(null);
  const [selectedDate, setSelectedDate] = useState("すべて");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadPlan = async () => {
      if (!token) {
        setError("共有リンクが正しくありません。");
        setLoading(false);
        return;
      }

      try {
        const result = await getPlanShareByToken(token);

        if (cancelled) return;

        if (!result) {
          setError("共有リンクが無効か、共有が停止されています。");
          return;
        }

        setData(result as SharedPlanData);
      } catch (err) {
        console.error("共有プランの読み込みに失敗しました:", err);
        if (!cancelled) setError("旅行プランを読み込めませんでした。");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadPlan();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return <div css={pageStyle}>旅行プランを読み込んでいます...</div>;
  }

  if (error || !data) {
    return (
      <div css={pageStyle}>
        <header css={headerStyle}>旅のしおり</header>
        <p css={messageStyle}>{error || "旅行プランが見つかりません。"}</p>
      </div>
    );
  }

  const getDayCount = () => {
    if (!data.plan.startDate || !data.plan.endDate) return 1;

    const start = new Date(data.plan.startDate);
    const end = new Date(data.plan.endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 1;
    }

    const startDay = Date.UTC(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
    );
    const endDay = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

    return Math.max(1, Math.floor((endDay - startDay) / 86400000) + 1);
  };

  const dates = [
    "すべて",
    ...Array.from({ length: getDayCount() }, (_, i) => `${i + 1}日目`),
  ];

  const filteredSchedules = data.schedules
    .filter(
      (schedule) => selectedDate === "すべて" || schedule.day === selectedDate,
    )
    .sort((a, b) => {
      const dayA = Number.parseInt(a.day, 10);
      const dayB = Number.parseInt(b.day, 10);

      if (dayA !== dayB) return dayA - dayB;
      return a.startTime.localeCompare(b.startTime);
    });

  return (
    <div css={pageStyle}>
      <header css={headerStyle}>旅のしおり</header>

      <main css={contentStyle}>
        <section css={planHeaderStyle}>
          <h1 css={titleStyle}>{data.plan.title}</h1>
          <p css={dateStyle}>
            {data.plan.startDate} ～ {data.plan.endDate}
          </p>
        </section>

        <PlanDayTabs
          dates={dates}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <div css={scheduleAreaStyle}>
          {filteredSchedules.length === 0 ? (
            <p css={emptyMessageStyle}>予定はまだありません</p>
          ) : (
            filteredSchedules.map((schedule) => (
              <div key={schedule.id} css={scheduleItemStyle}>
                <PlanSchedule
                  dayLabel={schedule.day}
                  time={`${schedule.startTime || ""} ～ ${schedule.endTime || ""}`}
                  title={schedule.title || "予定"}
                />
                {schedule.memo && <p css={memoStyle}>{schedule.memo}</p>}
              </div>
            ))
          )}
        </div>

        <p css={footerStyle}>このページは閲覧専用です。</p>
      </main>
    </div>
  );
};

const pageStyle = css`
  min-height: 100dvh;
  background: #f7f8fa;
  color: #222;
  font-family: sans-serif;
`;

const headerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 42px;
  background: #9dd8e3;
  color: white;
  font-size: 15px;
  font-weight: bold;
`;

const contentStyle = css`
  display: flex;
  flex-direction: column;
  min-height: calc(100dvh - 42px);
  margin: 7px 6px 0;
  padding: 16px 10px 24px;
  box-sizing: border-box;
  background: white;
  border: 1px solid #9dd8e3;
  border-radius: 6px;
`;

const planHeaderStyle = css`
  text-align: center;
`;

const titleStyle = css`
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  overflow-wrap: anywhere;
`;

const dateStyle = css`
  margin: 8px 0 0;
  font-size: 12px;
`;

const scheduleAreaStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 18px;
`;

const scheduleItemStyle = css`
  position: relative;
  padding: 0;
  border: 1px solid #91d9e6;
  border-radius: 6px;
  background: #fff;
  overflow-wrap: anywhere;
`;

const memoStyle = css`
  margin: 0;
  padding: 0 12px 12px;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const emptyMessageStyle = css`
  margin: 40px 0;
  text-align: center;
  color: #999;
  font-size: 14px;
`;

const footerStyle = css`
  margin: 24px 0 0;
  text-align: center;
  color: #888;
  font-size: 12px;
`;

const messageStyle = css`
  padding: 20px;
  text-align: center;
`;
