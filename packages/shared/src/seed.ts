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
  ProjectTask,
  Quotation,
  RenderingVersion,
  RequirementSheet,
  Space,
  User,
  WorkflowPhase,
  WorkItem,
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
  },
  {
    id: "cust-2",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "王先生",
    phone: "13800000002",
    email: "wang@example.com",
    preferredStyle: ["现代极简", "灰白木"],
    householdProfile: "新婚夫妻，计划一年内入住，重视预算控制",
    budgetMin: 220000,
    budgetMax: 300000,
    city: "上海",
    notes: "已预约量房，重点关注老房采光和卫生间干湿分离。"
  },
  {
    id: "cust-3",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "陈女士",
    phone: "13800000003",
    preferredStyle: ["奶油风", "亲子收纳"],
    householdProfile: "四口之家，二孩家庭，需要儿童活动区",
    budgetMin: 350000,
    budgetMax: 460000,
    city: "苏州",
    notes: "小红书咨询后两周未跟进，需要销售重新激活。"
  }
];

export const users: User[] = [
  {
    id: "user-sales-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "周敏",
    role: "sales",
    status: "active",
    avatarInitials: "ZM"
  },
  {
    id: "user-designer-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "许言",
    role: "designer",
    status: "active",
    avatarInitials: "XY"
  },
  {
    id: "user-detailer-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "沈工",
    role: "detailer",
    status: "active",
    avatarInitials: "SG"
  },
  {
    id: "user-pm-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "赵磊",
    role: "project_manager",
    status: "active",
    avatarInitials: "ZL"
  },
  {
    id: "user-admin-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "运营管理员",
    role: "admin",
    status: "active",
    avatarInitials: "AD"
  }
];

export const leads: Lead[] = [
  {
    id: "lead-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    customerId: "cust-1",
    source: "referral",
    stage: "won",
    intentLevel: "high",
    ownerId: "user-sales-1",
    budgetRange: "28-36 万",
    houseInfo: "浦东 128 平三房，旧房局改",
    requirementSummary: "开放厨房、岛台动线、高频收纳和暖木风格。",
    nextFollowUpAt: "2026-04-20",
    lastContactedAt: "2026-04-18",
    lastContactSummary: "客户已确认效果图方向，待确认蒸烤箱升级报价。",
    expectedSignDate: "2026-04-10",
    summary: "客户已完成初步方案确认，进入深化阶段。",
    painPoints: ["旧房采光一般", "厨房收纳不足", "担心施工返工"],
    projectId: "proj-1"
  },
  {
    id: "lead-2",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    customerId: "cust-2",
    source: "walk_in",
    stage: "measured",
    intentLevel: "high",
    ownerId: "user-sales-1",
    budgetRange: "22-30 万",
    houseInfo: "杨浦 88 平老房整装，已预约量房",
    requirementSummary: "希望提升采光，控制预算，并解决卫生间干湿分离。",
    nextFollowUpAt: "2026-04-19",
    lastContactedAt: "2026-04-18",
    lastContactSummary: "已约周末量房，客户关注预算是否可控。",
    expectedSignDate: "2026-05-02",
    summary: "到店咨询后进入量房阶段，成交意愿较强。",
    painPoints: ["采光不足", "卫生间布局局促", "预算敏感"]
  },
  {
    id: "lead-3",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    customerId: "cust-3",
    source: "xiaohongshu",
    stage: "contacted",
    intentLevel: "medium",
    ownerId: "user-sales-1",
    budgetRange: "35-46 万",
    houseInfo: "苏州 140 平四房，亲子家庭改善",
    requirementSummary: "亲子活动区、全屋收纳、奶油风和环保材料。",
    nextFollowUpAt: "2026-04-16",
    lastContactedAt: "2026-04-04",
    lastContactSummary: "客户收藏案例较多，但尚未确认量房时间。",
    summary: "小红书来源线索，需求匹配度较高但已较久未跟进。",
    painPoints: ["儿童收纳不足", "担心环保材料", "决策周期较长"]
  }
];

export const workflowPhases: WorkflowPhase[] = [
  {
    id: "phase-requirement",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "需求确认",
    order: 10,
    category: "design",
    description: "沉淀客户需求、生活方式、预算边界和待确认问题。"
  },
  {
    id: "phase-layout",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "平面方案",
    order: 20,
    category: "design",
    description: "完成空间布局、动线和基础功能分区。"
  },
  {
    id: "phase-su",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "SU 模型",
    order: 30,
    category: "design",
    description: "推敲空间体量、柜体关系和主要材质方向。"
  },
  {
    id: "phase-rendering",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "效果图",
    order: 40,
    category: "design",
    description: "输出客户可确认的视觉方向和关键空间效果。"
  },
  {
    id: "phase-drawing",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "施工图",
    order: 50,
    category: "detailing",
    description: "完成施工依据、柜体深化、点位和节点图。"
  },
  {
    id: "phase-quotation",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "报价",
    order: 60,
    category: "quotation",
    description: "生成并确认方案对应报价和增减项。"
  },
  {
    id: "phase-handoff",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "交底",
    order: 70,
    category: "delivery",
    description: "交接施工依据、现场条件和待确认事项。"
  },
  {
    id: "phase-construction",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "施工",
    order: 80,
    category: "delivery",
    description: "跟进现场施工节点、巡检问题和变更闭环。"
  },
  {
    id: "phase-acceptance",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    name: "验收",
    order: 90,
    category: "acceptance",
    description: "完成收尾检查、客户验收和交付归档。"
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
  },
  {
    id: "space-3",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    name: "卫生间",
    type: "bathroom",
    areaSqm: 7,
    constraints: ["原排水位置尽量不移位", "需确认壁龛尺寸"]
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

export const projectTasks: ProjectTask[] = [
  {
    id: "ptask-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    spaceId: "space-1",
    phaseId: "phase-quotation",
    title: "确认蒸烤箱升级增项",
    description: "销售需要联系林女士确认蒸烤一体机升级，并同步报价变化。",
    status: "waiting_client",
    priority: "high",
    assigneeId: "user-sales-1",
    ownerRole: "sales",
    reporterId: "user-sales-1",
    dueDate: "2026-04-20",
    blockedReason: "等待客户确认 change-1 增减项。",
    linkedEntities: [
      { type: "change_order", entityId: "change-1", label: "增减项 change-1" },
      { type: "confirmation_record", entityId: "conf-2", label: "客户确认 conf-2" },
      { type: "quotation", entityId: "quote-1", label: "报价 quote-1" }
    ]
  },
  {
    id: "ptask-2",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    spaceId: "space-1",
    phaseId: "phase-su",
    title: "输出客餐厨 SU V3 调整建议",
    description: "围绕岛台动线、高柜电器位和材质说明准备新一轮方案调整。",
    status: "todo",
    priority: "high",
    assigneeId: "user-designer-1",
    ownerRole: "designer",
    reporterId: "user-sales-1",
    dueDate: "2026-04-20",
    linkedEntities: [
      { type: "design_version", entityId: "design-2", label: "设计版本 V2" },
      { type: "requirement_sheet", entityId: "req-1", label: "需求单 req-1" }
    ]
  },
  {
    id: "ptask-3",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    spaceId: "space-2",
    phaseId: "phase-requirement",
    title: "确认主卧梳妆位需求",
    description: "补齐主卧梳妆位、衣柜比例和飘窗使用方式。",
    status: "waiting_internal",
    priority: "medium",
    assigneeId: "user-designer-1",
    ownerRole: "designer",
    reporterId: "user-sales-1",
    dueDate: "2026-04-21",
    blockedReason: "销售需要补充客户对主卧功能的反馈。",
    linkedEntities: [{ type: "requirement_sheet", entityId: "req-1", label: "需求单 req-1" }]
  },
  {
    id: "ptask-4",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    spaceId: "space-1",
    phaseId: "phase-drawing",
    title: "补齐高柜电源位施工图标注",
    description: "深化设计需要在交底前补齐高柜蒸烤箱电源位和散热尺寸。",
    status: "blocked",
    priority: "urgent",
    assigneeId: "user-detailer-1",
    ownerRole: "detailer",
    reporterId: "user-pm-1",
    dueDate: "2026-04-20",
    blockedReason: "现场复尺后发现图纸中电源位标注不完整。",
    linkedEntities: [
      { type: "construction_drawing_version", entityId: "drawing-1", label: "施工图 CD1" },
      { type: "inspection_record", entityId: "insp-1", label: "巡检记录 insp-1" }
    ]
  },
  {
    id: "ptask-5",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    spaceId: "space-3",
    phaseId: "phase-drawing",
    title: "复核卫生间排水和壁龛尺寸",
    description: "交底前确认卫生间排水位置、壁龛尺寸和防水节点。",
    status: "in_progress",
    priority: "medium",
    assigneeId: "user-detailer-1",
    ownerRole: "detailer",
    reporterId: "user-pm-1",
    dueDate: "2026-04-22",
    linkedEntities: [{ type: "construction_drawing_version", entityId: "drawing-1", label: "施工图 CD1" }]
  },
  {
    id: "ptask-6",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    projectId: "proj-1",
    phaseId: "phase-handoff",
    title: "准备施工图交底检查清单",
    description: "项目经理汇总图纸、报价、确认记录和现场复尺问题，准备交底。",
    status: "in_progress",
    priority: "high",
    assigneeId: "user-pm-1",
    ownerRole: "project_manager",
    reporterId: "user-pm-1",
    dueDate: "2026-04-22",
    linkedEntities: [
      { type: "construction_drawing_version", entityId: "drawing-1", label: "施工图 CD1" },
      { type: "quotation", entityId: "quote-1", label: "报价 quote-1" },
      { type: "confirmation_record", entityId: "conf-1", label: "客户确认 conf-1" }
    ]
  }
];

export const workItems: WorkItem[] = [
  {
    id: "task-1",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    role: "sales",
    type: "client_confirmation",
    status: "todo",
    priority: "high",
    title: "跟进客户确认增项",
    summary: "联系林女士确认蒸烤一体机升级，补充报价说明后推进闭环。",
    dueDate: "2026-04-20",
    targetPath: "/client/proj-1",
    projectId: "proj-1",
    leadId: "lead-1"
  },
  {
    id: "task-2",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    role: "sales",
    type: "lead_follow_up",
    status: "in_progress",
    priority: "medium",
    title: "补齐客户需求结构化记录",
    summary: "把开放厨房、岛台动线和卧室梳妆位需求补录到项目主档。",
    dueDate: "2026-04-21",
    targetPath: "/projects/proj-1",
    projectId: "proj-1",
    leadId: "lead-1"
  },
  {
    id: "task-3",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    role: "designer",
    type: "design_output",
    status: "todo",
    priority: "high",
    title: "输出 SU V3 调整建议",
    summary: "围绕岛台动线、高柜电器位和材质说明准备新一轮方案调整。",
    dueDate: "2026-04-20",
    targetPath: "/projects/proj-1",
    projectId: "proj-1"
  },
  {
    id: "task-4",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    role: "designer",
    type: "client_confirmation",
    status: "blocked",
    priority: "medium",
    title: "整理待客户确认的材质说明",
    summary: "局部材质还未冻结，需结合客户反馈整理下一版说明。",
    dueDate: "2026-04-22",
    targetPath: "/client/proj-1",
    projectId: "proj-1"
  },
  {
    id: "task-5",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    role: "project_manager",
    type: "milestone",
    status: "in_progress",
    priority: "high",
    title: "推进施工图交底",
    summary: "交底前核对施工图、点位说明和现场复尺结果，确保 4 月 22 日顺利推进。",
    dueDate: "2026-04-22",
    targetPath: "/projects/proj-1",
    projectId: "proj-1"
  },
  {
    id: "task-6",
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy,
    role: "project_manager",
    type: "inspection_issue",
    status: "todo",
    priority: "high",
    title: "关闭高柜电源位问题",
    summary: "推动深化补齐图纸中的高柜电源位标注，避免交底后返工。",
    dueDate: "2026-04-20",
    targetPath: "/projects/proj-1",
    projectId: "proj-1"
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
        nextAction: "确认增项并同步报价说明",
        customerName: "林女士",
        targetPath: "/projects/proj-1"
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
        nextAction: "完成动线优化建议",
        customerName: "林女士",
        targetPath: "/projects/proj-1"
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
        nextAction: "完成施工图交底检查",
        customerName: "林女士",
        targetPath: "/projects/proj-1"
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
        nextAction: "确认 change-1",
        customerName: "林女士",
        targetPath: "/projects/proj-1"
      }
    ]
  }
];
