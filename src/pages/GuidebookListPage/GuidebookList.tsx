/// 旅のしおりの一覧表示ページ ///

import { auth } from "../../firebase";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddPlanbutton } from "./components/AddGuidebookButton";
import { PlanBox } from "./components/GuidebookBox";
import CreateScheduleModal from "../CreateSchedulePage/components/CreateScheduleModal";
import {
  createPlan,
  getPlans,
  deletePlan,
  createPlanShare,
  disablePlanShare,
} from "../../services/planService";
import type { Plan } from "../../services/planService";

export const GuidebookList = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // しおり一覧を取得
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await getPlans();
        setPlans(data);
      } catch (error) {
        console.error("しおりの取得に失敗しました:", error);
        setError("しおりの取得に失敗しました。再度お試しください。");
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  // 新しいしおりを作成
  const handleCreatePlan = () => {
    setIsModalOpen(true);
  };

  // しおりを保存
  const handleSavePlan = async (
    title: string,
    startDate: string,
    endDate: string,
  ) => {
    if (!auth.currentUser) {
      alert("しおり機能はログイン後にご使用いただけます");
      return;
    }

    try {
      const planId = await createPlan(title, startDate, endDate);

      setIsModalOpen(false);

      navigate("/plan-make", {
        state: {
          title,
          planId,
          startDate,
          endDate,
        },
      });
    } catch (error) {
      console.error("しおりの保存に失敗しました:", error);
      alert("しおりの保存に失敗しました");
    }
  };

  // 共有リンクを発行してコピー
  const handleSharePlan = async (planId: string) => {
    try {
      const token = await createPlanShare(planId);
      const shareUrl = `${window.location.origin}/shared/${token}`;

      setOpenMenuId(null);

      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("共有リンクをコピーしました！\nLINEなどで相手に送ってね。");
      } catch (clipboardError) {
        console.error("共有リンクのコピーに失敗しました:", clipboardError);

        window.prompt("共有リンクをコピーしてください。", shareUrl);
      }
    } catch (error) {
      console.error("共有リンクの発行に失敗しました:", error);
      alert(
        "共有リンクを発行できませんでした。時間をおいて再度お試しください。",
      );
    }
  };

  // 共有リンクを停止
  const handleDisableShare = async (planId: string) => {
    if (!window.confirm("このしおりの共有を停止しますか？")) {
      return;
    }

    try {
      await disablePlanShare(planId);

      setOpenMenuId(null);

      alert("共有を停止しました。以前の共有リンクは使用できなくなります。");
    } catch (error) {
      console.error("共有の停止に失敗しました:", error);
      alert("共有を停止できませんでした");
    }
  };

  // しおりを削除
  const handleDeletePlan = async (planId: string) => {
    if (!window.confirm("このしおりを削除しますか？")) {
      return;
    }

    try {
      await deletePlan(planId);

      setPlans((currentPlans) =>
        currentPlans.filter((plan) => plan.id !== planId),
      );

      setOpenMenuId(null);
    } catch (error) {
      console.error("しおりの削除に失敗しました:", error);
      alert("しおりの削除に失敗しました");
    }
  };

  return (
    <div css={pageStyle}>
      {/* 新しいしおりを作成 */}
      <AddPlanbutton onClick={handleCreatePlan} />

      {/* しおり一覧 */}
      <div css={listStyle}>
        {loading && <p css={messageStyle}>読み込み中...</p>}

        {!loading && error && <p css={errorStyle}>{error}</p>}

        {!loading && !error && plans.length === 0 && (
          <p css={messageStyle}>
            まだしおりがありません。新しく作成してみよう！
          </p>
        )}

        {!loading &&
          plans.map((plan) => (
            <div key={plan.id} css={planItemStyle}>
              <PlanBox
                id={plan.id}
                title={plan.title}
                date={`${plan.startDate} ～ ${plan.endDate}`}
                onClick={() => {
                  navigate("/plan-make", {
                    state: {
                      planId: plan.id,
                      title: plan.title,
                      startDate: plan.startDate,
                      endDate: plan.endDate,
                    },
                  });
                }}
                onMenuClick={() => {
                  setOpenMenuId((currentId) =>
                    currentId === plan.id ? null : plan.id,
                  );
                }}
              />

              {openMenuId === plan.id && (
                <div css={menuStyle}>
                  <button
                    css={menuItemStyle}
                    type="button"
                    onClick={() => handleSharePlan(plan.id)}
                  >
                    共有
                  </button>

                  <button
                    css={menuItemStyle}
                    type="button"
                    onClick={() => handleDisableShare(plan.id)}
                  >
                    共有を停止
                  </button>

                  <button
                    css={menuItemStyle}
                    type="button"
                    onClick={() => handleDeletePlan(plan.id)}
                  >
                    削除
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* 新しいしおり作成モーダル */}
      {isModalOpen && (
        <CreateScheduleModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePlan}
        />
      )}
    </div>
  );
};

/* ページ */
const pageStyle = css`
  min-height: calc(100vh - 124px);
  padding: 16px 20px 90px;
  background-color: #ffffff;
`;

/* しおり一覧 */
const listStyle = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const planItemStyle = css`
  position: relative;
`;

const menuStyle = css`
  position: absolute;
  top: 50px;
  right: 8px;
  min-width: 80px;
  padding: 4px;
  border: 1px solid #dddddd;
  border-radius: 6px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 10;
`;

const menuItemStyle = css`
  width: 100%;
  padding: 8px 12px;
  border: none;
  background-color: #ffffff;
  color: #333333;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const messageStyle = css`
  color: #777777;
  font-size: 14px;
  text-align: center;
`;

const errorStyle = css`
  color: #e53935;
  font-size: 14px;
  text-align: center;
`;
