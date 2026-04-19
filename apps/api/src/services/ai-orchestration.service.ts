import { Injectable } from "@nestjs/common";
import {
  AiDrawingReview,
  AiInspectionDigest,
  AiLayoutSuggestion,
  AiRenderingSuggestion,
  AiRequirementSuggestion
} from "@home-design-ops/shared";

@Injectable()
export class AiOrchestrationService {
  buildRequirementSuggestion(content: string): AiRequirementSuggestion {
    const normalized = content.trim() || "客户强调功能动线、预算控制和风格统一。";

    return {
      summary: `基于当前沟通，建议将需求整理为：${normalized.slice(0, 60)}。`,
      goals: ["优先明确功能分区", "锁定预算区间", "提前确认高频收纳需求"],
      risks: ["可能存在效果期待与预算不匹配", "厨房设备点位尚未完全确认"],
      pendingQuestions: ["是否保留开放厨房方案", "高柜电器配置是否已最终确定"],
      lifestyleTags: ["重收纳", "家庭互动", "注重厨房效率"]
    };
  }

  buildLayoutSuggestion(brief: string, budget?: number): AiLayoutSuggestion {
    return {
      layoutDirection: `建议以“动线优先 + 收纳集中”的布局逻辑推进，结合 ${budget ? `约 ${budget} 预算` : "当前预算"} 做适配。`,
      storageIdeas: ["高柜与岛台分工明确", "餐边柜兼顾展示与收纳", "优先利用转角和高位柜体"],
      circulationAlerts: ["保持岛台主通道不低于 900mm", "高柜开门半径与冰箱门扇需复核"]
    };
  }

  buildRenderingSuggestion(content: string): AiRenderingSuggestion {
    return {
      narrative: `建议先输出方向型效果图，用来验证氛围而不是先投入高精渲染。当前偏好可概括为：${content || "暖木、柔和灯光、统一材质语言"}`,
      preferredVisuals: ["暖木饰面", "奶油白主色", "层次照明", "弱对比金属点缀"],
      avoidVisuals: ["冷白强光", "过度复杂背景", "与预算不匹配的奢华材质"],
      recommendedOutputLevel: "directional"
    };
  }

  buildDrawingReview(content: string): AiDrawingReview {
    return {
      headline: "建议在交底前完成一轮施工图交叉校核。",
      issues: [
        `需要核查尺寸与设备点位是否完整：${content || "重点关注蒸烤箱、高柜、岛台关系"}`,
        "检查报价版本与当前施工图版本是否一致",
        "确认柜门开启和现场净距是否满足安装条件"
      ],
      handoffChecklist: ["冻结当前有效版本", "补齐电气和设备说明", "输出交底摘要给项目经理"]
    };
  }

  buildInspectionDigest(content: string): AiInspectionDigest {
    return {
      dailyReport: `今日巡检摘要：${content || "现场复尺完成，关键问题已标记，待深化与交底同步。"}。`,
      followUps: ["跟进高优先级未解决问题", "同步给设计与项目经理", "在下个节点前确认整改结果"]
    };
  }
}

