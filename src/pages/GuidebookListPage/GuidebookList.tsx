/// 旅のしおりの一覧表示ページ ///

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
} from "../../services/planService";
import type { Plan } from "../../services/planService";

export const GuidebookList = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // しおり一覧を取得
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await getPlans();
        setPlans(data);
      } catch (error) {
        console.error("しおりの取得に失敗しました:", error);
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
    try {
      const planId = await createPlan(title, startDate, endDate);

      setIsModalOpen(false);

      navigate("/plan-make", {
        state: {
          title: title,
          planId: planId,
          startDate: startDate,
          endDate: endDate,
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

      await navigator.clipboard.writeText(shareUrl);

      alert("共有リンクをコピーしました！\n" + "LINEなどで相手に送ってね。");

      setOpenMenuId(null);
    } catch (error) {
      console.error("共有リンクの発行に失敗しました:", error);
      alert(
        "共有リンクを発行できませんでした。Consoleのエラーを確認してください。",
      );
    }
  };

  return (
    <div css={pageStyle}>
      {/* 新しいしおりを作成 */}
      <AddPlanbutton onClick={handleCreatePlan} />

      {/* しおり一覧 */}
      <div css={listStyle}>
        {plans.map((plan) => (
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
                setOpenMenuId(openMenuId === plan.id ? null : plan.id);
              }}
            />

            {openMenuId === plan.id && (
              <div css={menuStyle}>
                {/* 共有 */}
                <button
                  css={menuItemStyle}
                  type="button"
                  onClick={() => handleSharePlan(plan.id)}
                >
                  共有
                </button>

                {/* 削除 */}
                <button
                  css={menuItemStyle}
                  type="button"
                  onClick={async () => {
                    if (!window.confirm("このしおりを削除しますか？")) {
                      return;
                    }

                    try {
                      await deletePlan(plan.id);

                      setPlans((currentPlans) =>
                        currentPlans.filter(
                          (currentPlan) => currentPlan.id !== plan.id,
                        ),
                      );

                      setOpenMenuId(null);
                    } catch (error) {
                      console.error("しおりの削除に失敗しました:", error);
                      alert("しおりの削除に失敗しました");
                    }
                  }}
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

/* =========================
   ページ
========================= */

const pageStyle = css`
  min-height: calc(100vh - 124px);

  padding: 16px 20px 90px;

  background-color: #ffffff;
`;

/* =========================
   しおり一覧
========================= */

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
