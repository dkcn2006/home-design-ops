import {
  Attachment,
  ChangeOrder,
  ConfirmationRecord,
  ConstructionDrawingVersion,
  Customer,
  DashboardSummary,
  DesignVersion,
  InspectionRecord,
  Lead,
  Project,
  ProjectArchive,
  ProjectMilestone,
  Quotation,
  RenderingVersion,
  RequirementSheet,
  Space,
} from "./types";

const timestamp = "2026-04-19T08:00:00.000Z";
const createdBy = "system";

export const customers: Customer[] = [
  {
    id: "cust-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "林女士",
    phone: "13800000001",
    email: "lin@example.com",
    preferredStyle: ["现代木质", "温暖简约"],
    householdProfile: "三口之家，重视收纳和餐厨互动",
    budgetMin: 280000,
    budgetMax: 360000,
    city: "上海",
    notes: "希望签约前先确认开放厨房与岛台动线是否合理。"
  }
];

export const leads: Lead[] = [
  {
    id: "lead-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    customerId: "cust-1",
    source: "朋友转介绍",
    stage: "signed",
    expectedSignDate: "2026-04-10",
    summary: "客户已完成初步方案确认，进入深化阶段。",
    painPoints: ["旧房采光一般", "厨房收纳不足", "担心施工返工"]
  }
];

export const requirementSheets: RequirementSheet[] = [
  {
    id: "req-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    summary: "围绕家庭互动、岛台场景和高频收纳设计厨房与公共空间。",
    goals: ["增加高效收纳", "形成餐厨互动", "保持暖色系氛围"],
    risks: ["岛台与高柜间距不足", "蒸烤箱点位待确认"],
    pendingQuestions: ["岛台是否保留第二水槽", "主卧是否需要梳妆位"],
    lifestyleTags: ["三口之家", "重收纳", "周末聚餐", "开放厨房"]
  }
];

export const projects: Project[] = [
  {
    id: "proj-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    customerId: "cust-1",
    leadId: "lead-1",
    code: "HDO-001",
    name: "林女士浦东住宅改造",
    location: "上海市浦东新区",
    areaSqm: 128,
    status: "detailing",
    currentRequirementSheetId: "req-1",
    currentDesignVersionId: "design-2",
    currentRenderingVersionId: "render-1",
    currentConstructionDrawingVersionId: "drawing-1"
  }
];

export const spaces: Space[] = [
  {
    id: "space-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    name: "客餐厨一体",
    type: "kitchen",
    areaSqm: 38,
    constraints: ["承重柱不可拆", "窗边需保留水槽"]
  },
  {
    id: "space-2",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    name: "主卧",
    type: "bedroom",
    areaSqm: 18,
    constraints: ["保留原飘窗结构"]
  }
];

export const attachments: Attachment[] = [
  {
    id: "att-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    filename: "kitchen-su-v2.skp",
    category: "layout_model",
    url: "https://example.com/files/kitchen-su-v2.skp",
    linkedEntityId: "design-2"
  },
  {
    id: "att-2",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    filename: "living-render-v1.png",
    category: "rendering",
    url: "https://example.com/files/living-render-v1.png",
    linkedEntityId: "render-1"
  },
  {
    id: "att-3",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    filename: "cabinet-drawing-v1.pdf",
    category: "construction_drawing",
    url: "https://example.com/files/cabinet-drawing-v1.pdf",
    linkedEntityId: "drawing-1"
  }
];

export const designVersions: DesignVersion[] = [
  {
    id: "design-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    version: "V1",
    summary: "首版开放式厨房与岛台关系验证。",
    changeLog: ["打通原厨房与餐厅", "新增中岛"], 
    status: "archived",
    fileAttachmentIds: ["att-1"]
  },
  {
    id: "design-2",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    version: "V2",
    summary: "优化高柜与岛台距离，调整蒸烤箱位置。",
    changeLog: ["岛台缩短 200mm", "高柜改为嵌入蒸烤箱"],
    status: "current",
    fileAttachmentIds: ["att-1"]
  }
];

export const renderingVersions: RenderingVersion[] = [
  {
    id: "render-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    version: "R1",
    styleDirection: "暖木 + 奶油白 + 黑色金属点缀",
    highlights: ["整体灯光层次明确", "客餐厨视觉统一"],
    status: "current",
    fileAttachmentIds: ["att-2"]
  }
];

export const constructionDrawingVersions: ConstructionDrawingVersion[] = [
  {
    id: "drawing-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    version: "CD1",
    summary: "厨房柜体深化与岛台节点图。",
    checks: ["蒸烤箱散热尺寸待复核", "岛台双水槽点位待客户最终确认"],
    status: "current",
    fileAttachmentIds: ["att-3"]
  }
];

export const quotations: Quotation[] = [
  {
    id: "quote-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    linkedVersionId: "design-2",
    amount: 328000,
    currency: "CNY",
    summary: "方案 V2 对应的主材 + 柜体 + 施工综合报价",
    lineItems: [
      { name: "定制柜体", amount: 92000, category: "cabinetry" },
      { name: "硬装施工", amount: 168000, category: "construction" },
      { name: "灯光与电气", amount: 26000, category: "lighting" },
      { name: "主材与软装预留", amount: 42000, category: "material" }
    ],
    status: "submitted"
  }
];

export const changeOrders: ChangeOrder[] = [
  {
    id: "change-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    linkedVersionId: "drawing-1",
    title: "高柜蒸烤一体机升级",
    reason: "客户更换为更高规格设备",
    amountDelta: 6800,
    confirmationStatus: "pending"
  }
];

export const milestones: ProjectMilestone[] = [
  {
    id: "mile-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    name: "施工图交底",
    plannedDate: "2026-04-22",
    status: "in_progress",
    ownerRole: "project_manager"
  },
  {
    id: "mile-2",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    name: "橱柜下单",
    plannedDate: "2026-04-25",
    status: "not_started",
    ownerRole: "detailer"
  }
];

export const inspections: InspectionRecord[] = [
  {
    id: "insp-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    milestoneId: "mile-1",
    summary: "现场复尺已完成，需在交底前补充蒸烤箱回路说明。",
    issues: [
      {
        title: "高柜电源位尚未在图中明确标注",
        severity: "high",
        assigneeRole: "detailer",
        resolved: false
      },
      {
        title: "岛台净通道已满足 980mm，建议保持不变",
        severity: "low",
        assigneeRole: "designer",
        resolved: true
      }
    ]
  }
];

export const confirmations: ConfirmationRecord[] = [
  {
    id: "conf-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    targetId: "render-1",
    type: "proposal",
    status: "confirmed",
    clientName: "林女士",
    note: "整体风格确认通过，局部材质待深化。"
  },
  {
    id: "conf-2",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    targetId: "change-1",
    type: "change_order",
    status: "pending",
    clientName: "林女士"
  }
];

export function getProjectArchive(projectId: string): ProjectArchive | undefined {
  const project = projects.find((item) => item.id === projectId);
  if (!project) {
    return undefined;
  }

  const customer = customers.find((item) => item.id === project.customerId)!;
  const lead = leads.find((item) => item.id === project.leadId)!;
  const requirementSheet = requirementSheets.find((item) => item.id === project.currentRequirementSheetId)!;

  return {
    project,
    customer,
    lead,
    spaces: spaces.filter((item) => item.projectId === projectId),
    requirementSheet,
    designVersions: designVersions.filter((item) => item.projectId === projectId),
    renderingVersions: renderingVersions.filter((item) => item.projectId === projectId),
    constructionDrawingVersions: constructionDrawingVersions.filter((item) => item.projectId === projectId),
    quotations: quotations.filter((item) => item.projectId === projectId),
    changeOrders: changeOrders.filter((item) => item.projectId === projectId),
    milestones: milestones.filter((item) => item.projectId === projectId),
    inspections: inspections.filter((item) => item.projectId === projectId),
    confirmations: confirmations.filter((item) => item.projectId === projectId),
    attachments: attachments.filter((item) => item.projectId === projectId)
  };
}

export const dashboards: DashboardSummary[] = [
  {
    role: "sales",
    metrics: {
      activeProjects: 4,
      pendingConfirmations: 2,
      quotationValue: 328000,
      openIssues: 1
    },
    focus: ["补齐客户需求结构化记录", "跟进待确认增项"],
    projects: [
      {
        id: "proj-1",
        name: "林女士浦东住宅改造",
        status: "detailing",
        nextAction: "确认增项并同步报价说明"
      }
    ]
  },
  {
    role: "designer",
    metrics: {
      activeProjects: 3,
      pendingConfirmations: 1,
      quotationValue: 0,
      openIssues: 1
    },
    focus: ["准备 SU V3 调整建议", "确认厨房材质说明"],
    projects: [
      {
        id: "proj-1",
        name: "林女士浦东住宅改造",
        status: "detailing",
        nextAction: "完成动线优化建议"
      }
    ]
  },
  {
    role: "project_manager",
    metrics: {
      activeProjects: 5,
      pendingConfirmations: 1,
      quotationValue: 0,
      openIssues: 2
    },
    focus: ["交底前冻结当前有效版本", "推动高优先级问题关闭"],
    projects: [
      {
        id: "proj-1",
        name: "林女士浦东住宅改造",
        status: "detailing",
        nextAction: "完成施工图交底检查"
      }
    ]
  },
  {
    role: "client",
    metrics: {
      activeProjects: 1,
      pendingConfirmations: 1,
      quotationValue: 334800,
      openIssues: 1
    },
    focus: ["确认蒸烤箱升级增项", "查看最新施工图交底说明"],
    projects: [
      {
        id: "proj-1",
        name: "林女士浦东住宅改造",
        status: "detailing",
        nextAction: "确认 change-1"
      }
    ]
  }
];

