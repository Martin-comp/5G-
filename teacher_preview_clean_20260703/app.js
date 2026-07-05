(function () {
  const data = window.DIGITAL_TEXTBOOK_OVERALL;
  const state = {
    view: "course",
    projectId: "P2",
    graphId: "CG-02",
    resourceId: "",
    teacherFocus: "organization",
    resourceFilter: "all",
    publishStep: 0,
    supportOpen: false,
    supportTab: "task-resource-mapping"
  };

  const layout = document.getElementById("pageLayout");
  const workspace = document.getElementById("workspace");
  const contextPanel = document.getElementById("contextPanel");
  const leftRail = document.getElementById("leftRail");
  const platformSupportPanel = document.getElementById("platformSupportPanel");
  const platformSupportToggle = document.getElementById("platformSupportToggle");

  const teacherFlows = [
    { id: "organization", label: "任务组织建议", note: "AI生成任务链、资源调用和课堂节奏，教师审核确认" },
    { id: "classroom", label: "课堂推进建议", note: "AI给出提问脚本和活动顺序，教师按班级情况调整" },
    { id: "review", label: "讲评反馈建议", note: "基于模拟或真实学情生成讲评重点和二次学习路径" },
    { id: "verification", label: "复核验收建议", note: "整理专业复核点、作业验收规则和补交要求" }
  ];

  const resourceFilters = [
    { id: "all", label: "全部资源", note: "查看整书资源清单" },
    { id: "P2", label: "项目二资源", note: "测试、异常处理和数据分析" },
    { id: "P4", label: "项目四资源", note: "优化实施、结果验证和报告输出" },
    { id: "P4-T2", label: "P4-T2任务资源", note: "结果验证任务页和配套材料" },
    { id: "graph", label: "图谱数据", note: "课程能力图谱与节点映射" }
  ];

  function relationReviewData() {
    return window.COURSE_CAPABILITY_RELATION_REVIEW || { tasks: [], nodes: [], edges: [] };
  }

  function linkedPageHref(href) {
    const value = String(href || "");
    if (/^(https?:|mailto:|#)/.test(value)) return value;
    if (window.location.protocol !== "file:") return value;
    const filePreviewMirrors = {
      "../task_workbench_3_5a1_two_period_sample/index.html": "./task_workbench_3_5a1_two_period_sample/index.html",
      "../course_capability_graph_v2_relation_review/index.html": "./course_capability_graph_v2_relation_review/index.html",
      "../digital_textbook_overall_prototype/index.html": "./digital_textbook_overall_prototype/index.html",
      "../digital_textbook_overall_prototype_phase2_p4_loop/index.html": "./digital_textbook_overall_prototype_phase2_p4_loop/index.html",
      "../digital_textbook_overall_prototype_phase3_p2_loop/index.html": "./digital_textbook_overall_prototype_phase3_p2_loop/index.html"
    };
    return filePreviewMirrors[value] || value;
  }

  function relationReviewHref() {
    return linkedPageHref(data.graph.relationReviewHref || "../course_capability_graph_v2_relation_review/index.html");
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function publicStatus(status) {
    const value = String(status || "");
    if (!value) return "学习内容";
    if (value.includes("结构占位")) return "课程项目";
    if (value.includes("候选")) return "拓展任务";
    if (value.includes("深样章")) return "重点学习任务";
    if (value.includes("阶段")) return "学习路径";
    if (value.includes("样稿")) return "学习任务";
    if (value.includes("待") || value.includes("需") || value.includes("不可")) return "教学资源";
    return value;
  }

  function aiStatusLabel(status) {
    const labels = {
      not_generated: "待生成",
      generated_pending_confirm: "AI已生成，待教师确认",
      teacher_adjusted: "教师已调整",
      confirmed: "已确认",
      used_in_class: "已用于课堂",
      reviewed: "已复核"
    };
    return labels[status] || "待教师确认";
  }

  function graphNodeById(id) {
    return allGraphNodes().find((node) => node.id === id) || null;
  }

  function resourceActivity(resource) {
    const ids = resourceNodeIds(resource);
    const node = ids.map(graphNodeById).find(Boolean);
    return resource.activity || node?.activity || `${resource.type}支撑${resource.project} ${resource.task}学习`;
  }

  function resourceOutput(resource) {
    const ids = resourceNodeIds(resource);
    const node = ids.map(graphNodeById).find(Boolean);
    return resource.output || node?.output || "学习产出和评价记录";
  }

  function resourcePlatformRole(resource) {
    if (resource.platformRole) return resource.platformRole;
    if (resource.project === "全书" || resource.type.includes("结构化")) return "material_backend";
    if (resource.type.includes("报告") || resource.type.includes("页面")) return "textbook_resource";
    return "textbook_resource";
  }

  function platformRoleLabel(role) {
    const labels = {
      textbook_resource: "教材呈现端资源",
      material_backend: "素材子平台资源",
      delivery_support: "交付支撑资源"
    };
    return labels[role] || "教材资源";
  }

  function deepSampleLink(label, dataLink = "deep-sample") {
    return `<a class="deep-link" data-link="${escapeHtml(dataLink)}" href="${escapeHtml(linkedPageHref(data.meta.deepSampleHref))}">${escapeHtml(label)}</a>`;
  }

  function selectedProject() {
    return data.projects.find((project) => project.id === state.projectId) || data.projects[1];
  }

  function selectedLoop() {
    return data.loops[state.projectId] || null;
  }

  function allGraphNodes() {
    return [...data.graph.courseChain, ...data.graph.detailNodes];
  }

  function selectedGraphNode() {
    return allGraphNodes().find((node) => node.id === state.graphId) || data.graph.courseChain[1];
  }

  function nodesForProject(projectId) {
    return data.graph.detailNodes.filter((node) => node.project === projectId);
  }

  function graphNodeIds() {
    return new Set(allGraphNodes().map((node) => node.id));
  }

  function expandNodeReference(reference) {
    const known = graphNodeIds();
    const parts = String(reference || "")
      .split(/[;；,，/]/)
      .map((item) => item.trim())
      .filter(Boolean);
    const ids = [];

    parts.forEach((part) => {
      const detailRange = part.match(/^([A-Z0-9]+)-N(\d{2})-\1-N(\d{2})$/);
      if (detailRange) {
        const prefix = detailRange[1];
        const start = Number(detailRange[2]);
        const end = Number(detailRange[3]);
        for (let index = start; index <= end; index += 1) {
          const id = `${prefix}-N${String(index).padStart(2, "0")}`;
          if (known.has(id)) ids.push(id);
        }
        return;
      }

      const courseRange = part.match(/^CG-(\d{2})-CG-(\d{2})$/);
      if (courseRange) {
        const start = Number(courseRange[1]);
        const end = Number(courseRange[2]);
        for (let index = start; index <= end; index += 1) {
          const id = `CG-${String(index).padStart(2, "0")}`;
          if (known.has(id)) ids.push(id);
        }
        return;
      }

      if (known.has(part)) ids.push(part);
    });

    return Array.from(new Set(ids));
  }

  function resourceNodeIds(resource) {
    return expandNodeReference(resource.node);
  }

  function nodeMatchesResource(node, resource) {
    const ids = resourceNodeIds(resource);
    if (ids.includes(node.id)) return true;
    if (node.task && resource.task === node.task) return true;
    if (!node.task && node.project && resource.project === node.project && resource.title.includes("图谱")) return true;
    return false;
  }

  function resourcesForGraphNode(node) {
    return data.resources.filter((resource) => nodeMatchesResource(node, resource));
  }

  function selectedResourceForNode(node) {
    const resources = resourcesForGraphNode(node);
    return resources.find((resource) => resource.id === state.resourceId) || resources[0] || null;
  }

  function selectedTeacherFlow() {
    return teacherFlows.find((item) => item.id === state.teacherFocus) || teacherFlows[0];
  }

  function selectedResourceFilter() {
    return resourceFilters.find((item) => item.id === state.resourceFilter) || resourceFilters[0];
  }

  function selectedPublishItem() {
    return data.publication[state.publishStep] || data.publication[0];
  }

  function selectedSupportItem() {
    return (data.platformSupport || []).find((item) => item.id === state.supportTab) || data.platformSupport?.[0];
  }

  function syncTabs() {
    document.querySelectorAll(".tab").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === state.view);
    });
  }

  function setView(view) {
    state.view = view;
    if (view === "graph" && state.graphId.startsWith("CG-")) {
      state.graphId = state.projectId === "P4" ? "P4T2-N07" : "P2T3-N03";
    }
    syncTabs();
    render();
    workspace.scrollIntoView({ block: "start" });
  }

  function setProject(projectId) {
    state.projectId = projectId;
    state.view = "project";
    const firstNode = projectId === "P4" ? "P4T2-N07" : projectId === "P2" ? "P2T3-N03" : data.projects.find((item) => item.id === projectId)?.capabilityNode || "CG-02";
    state.graphId = firstNode;
    syncTabs();
    render();
    workspace.scrollIntoView({ block: "start" });
  }

  function setGraphNode(graphId) {
    state.graphId = graphId;
    const node = allGraphNodes().find((item) => item.id === graphId);
    if (node?.project) state.projectId = node.project;
    const resources = node ? resourcesForGraphNode(node) : [];
    if (!resources.some((resource) => resource.id === state.resourceId)) {
      state.resourceId = "";
    }
    render();
  }

  function setGraphResource(resourceId) {
    const resource = data.resources.find((item) => item.id === resourceId);
    if (!resource) return;
    state.resourceId = resource.id;
    const ids = resourceNodeIds(resource);
    const currentId = selectedGraphNode().id;
    const nextId = ids.includes(currentId) ? currentId : ids[0];
    if (nextId) {
      state.graphId = nextId;
      const node = allGraphNodes().find((item) => item.id === nextId);
      if (node?.project) state.projectId = node.project;
    } else if (resource.project && data.projects.some((item) => item.id === resource.project)) {
      state.projectId = resource.project;
    }
    render();
  }

  function railButton(label, note, active, attr) {
    return `
      <button class="project-button ${active ? "is-active" : ""}" ${attr} type="button">
        <strong>${escapeHtml(label)}</strong>
        <span>${escapeHtml(note)}</span>
      </button>
    `;
  }

  function renderLeftRail() {
    if (state.view === "course") {
      leftRail.hidden = true;
      leftRail.innerHTML = "";
      return;
    }

    leftRail.hidden = false;

    if (state.view === "project") {
      leftRail.innerHTML = `
        <div class="rail-title">项目目录</div>
        <div class="project-buttons">
          ${data.projects.map((project) => railButton(
            `${project.id} ${project.title.replace(/^项目[一二三四五六][：、]/, "")}`,
            `${project.abilityGroup} · ${publicStatus(project.status)}`,
            project.id === state.projectId,
            `data-project="${escapeHtml(project.id)}"`
          )).join("")}
        </div>
        <div class="boundary-note">
          <strong>当前场景</strong>
          <span>这里是“项目学习”页。左侧只用于选择课程项目。</span>
        </div>
      `;
      leftRail.querySelectorAll("[data-project]").forEach((button) => {
        button.addEventListener("click", () => setProject(button.dataset.project));
      });
      return;
    }

    if (state.view === "graph") {
      leftRail.innerHTML = `
        <div class="rail-title">图谱导航</div>
        <div class="project-buttons">
          ${data.graph.courseChain.map((node) => railButton(
            `${node.id} ${node.label}`,
            node.desc,
            node.id === state.graphId,
            `data-rail-graph="${escapeHtml(node.id)}"`
          )).join("")}
        </div>
        <div class="boundary-note">
          <strong>当前场景</strong>
          <span>这里选择课程能力图谱节点，不切换课程项目。</span>
        </div>
      `;
      leftRail.querySelectorAll("[data-rail-graph]").forEach((button) => {
        button.addEventListener("click", () => setGraphNode(button.dataset.railGraph));
      });
      return;
    }

    if (state.view === "teacher") {
      leftRail.innerHTML = `
        <div class="rail-title">教师工作流</div>
        <div class="project-buttons">
          ${teacherFlows.map((item) => railButton(
            item.label,
            item.note,
            item.id === state.teacherFocus,
            `data-teacher-focus="${escapeHtml(item.id)}"`
          )).join("")}
        </div>
        <div class="boundary-note">
          <strong>当前场景</strong>
          <span>这里按AI建议、教师确认、课堂讲评和复核验收组织，不切换学生学习项目。</span>
        </div>
      `;
      leftRail.querySelectorAll("[data-teacher-focus]").forEach((button) => {
        button.addEventListener("click", () => {
          state.teacherFocus = button.dataset.teacherFocus;
          render();
        });
      });
      return;
    }

    if (state.view === "resources") {
      leftRail.innerHTML = `
        <div class="rail-title">资源筛选</div>
        <div class="project-buttons">
          ${resourceFilters.map((item) => railButton(
            item.label,
            item.note,
            item.id === state.resourceFilter,
            `data-resource-filter="${escapeHtml(item.id)}"`
          )).join("")}
        </div>
        <div class="boundary-note">
          <strong>当前场景</strong>
          <span>这里筛选资源包和学习材料，不作为学习路径入口。</span>
        </div>
      `;
      leftRail.querySelectorAll("[data-resource-filter]").forEach((button) => {
        button.addEventListener("click", () => {
          state.resourceFilter = button.dataset.resourceFilter;
          render();
        });
      });
      return;
    }

    leftRail.innerHTML = `
      <div class="rail-title">交付路径</div>
      <div class="project-buttons">
        ${data.publication.map((item, index) => railButton(
          item.title,
          item.state,
          index === state.publishStep,
          `data-publish-step="${index}"`
        )).join("")}
      </div>
      <div class="boundary-note">
        <strong>当前场景</strong>
        <span>这里说明教材如何交付到出版社平台，不承担学生学习导航。</span>
      </div>
    `;
    leftRail.querySelectorAll("[data-publish-step]").forEach((button) => {
      button.addEventListener("click", () => {
        state.publishStep = Number(button.dataset.publishStep || 0);
        render();
      });
    });
  }

  function renderContextPanel() {
    const project = selectedProject();
    const node = selectedGraphNode();
    const teacherFlow = selectedTeacherFlow();
    const resourceFilter = selectedResourceFilter();
    const publishItem = selectedPublishItem();

    if (state.view === "graph") {
      contextPanel.hidden = true;
      contextPanel.innerHTML = "";
      return;
    }

    contextPanel.hidden = false;

    if (state.view === "course") {
      contextPanel.innerHTML = `
        <div class="panel-title">学习入口</div>
        <div class="panel-stack">
          <div class="panel-item">
            <strong>当前页面：课程总览</strong>
            <span>先理解整书从信息采集、网络测试到优化验证的工作过程。</span>
          </div>
          <div class="panel-item">
            <strong>推荐路径</strong>
            <span>从项目四进入 P4-T2“5G网络优化结果验证”，完成一次完整任务学习。</span>
          </div>
          <div class="panel-item">
            <strong>图谱作用</strong>
            <span>图谱用于解释课程、项目、任务、资源和评价之间的关系，不替代教材正文。</span>
          </div>
        </div>
      `;
      return;
    }

    if (state.view === "project") {
      contextPanel.innerHTML = `
        <div class="panel-title">项目上下文</div>
        <div class="panel-stack">
          <div class="panel-item">
            <strong>${escapeHtml(project.title)}</strong>
            <span>${escapeHtml(project.goal)}</span>
          </div>
          <div class="panel-item">
            <strong>当前选择</strong>
            <span>左侧项目目录控制本页内容；进入任务后再切换学生、教师或资源视图。</span>
          </div>
          <div class="panel-item">
            <strong>继续学习</strong>
            <span>${project.id === "P4" ? "可进入 P4-T2 完整学习任务。" : "先看任务链和学习产出，再回到重点路径继续。"}</span>
          </div>
        </div>
      `;
      return;
    }

    if (state.view === "teacher") {
      contextPanel.innerHTML = `
        <div class="panel-title">教师上下文</div>
        <div class="panel-stack">
          <div class="panel-item">
            <strong>${escapeHtml(teacherFlow.label)}</strong>
            <span>${escapeHtml(teacherFlow.note)}</span>
          </div>
          <div class="panel-item">
            <strong>建议入口</strong>
            <span>教师先查看AI生成的任务组织、课堂推进、讲评和复核建议，再确认本次课堂使用方案。</span>
          </div>
          <div class="panel-item">
            <strong>验收重点</strong>
            <span>重点看学生能否从投诉、指标和依据形成可讲评的验收结论。</span>
          </div>
        </div>
      `;
      return;
    }

    if (state.view === "resources") {
      contextPanel.innerHTML = `
        <div class="panel-title">资源上下文</div>
        <div class="panel-stack">
          <div class="panel-item">
            <strong>${escapeHtml(resourceFilter.label)}</strong>
            <span>${escapeHtml(resourceFilter.note)}</span>
          </div>
          <div class="panel-item">
            <strong>使用方式</strong>
            <span>资源应服务具体学习任务，不能只作为好看的素材堆放。</span>
          </div>
          <div class="panel-item">
            <strong>挂接关系</strong>
            <span>每项资源都应能对应项目、任务、图谱节点和学习用途。</span>
          </div>
        </div>
      `;
      return;
    }

    contextPanel.innerHTML = `
      <div class="panel-title">交付上下文</div>
      <div class="panel-stack">
        <div class="panel-item">
          <strong>${escapeHtml(publishItem.title)}</strong>
          <span>${escapeHtml(publishItem.state)}</span>
        </div>
        <div class="panel-item">
          <strong>交付边界</strong>
          <span>交付页说明进入出版社平台的方式，不作为学生学习或教师授课入口。</span>
        </div>
        <div class="panel-item">
          <strong>质量检查</strong>
          <span>检查内容正确性、媒体合规性、数据脱敏、页面可访问性和学习闭环。</span>
        </div>
      </div>
    `;
  }

  function openPlatformSupport(tabId = state.supportTab) {
    state.supportOpen = true;
    state.supportTab = tabId;
    renderPlatformSupport();
    platformSupportPanel?.scrollIntoView({ block: "start" });
  }

  function closePlatformSupport() {
    state.supportOpen = false;
    renderPlatformSupport();
  }

  function renderSupportTaskResources() {
    const focusResources = data.resources.filter((resource) => ["P4", "P2"].includes(resource.project) || resource.project === "全书");
    return `
      <div class="support-resource-grid">
        ${focusResources.map((resource) => {
          const role = resourcePlatformRole(resource);
          return `
            <article class="support-resource-card">
              <div class="badge-row">
                <span class="badge media">${escapeHtml(resource.id)}</span>
                <span class="badge">${escapeHtml(platformRoleLabel(role))}</span>
              </div>
              <h3>${escapeHtml(resource.title)}</h3>
              <p><strong>挂接位置：</strong>${escapeHtml(resource.project)} / ${escapeHtml(resource.task)}</p>
              <p><strong>能力节点：</strong>${escapeHtml(resource.node)}</p>
              <p><strong>学习活动：</strong>${escapeHtml(resourceActivity(resource))}</p>
              <p><strong>评价产出：</strong>${escapeHtml(resourceOutput(resource))}</p>
              ${role === "textbook_resource" ? `<button class="small-button secondary" data-support-resource="${escapeHtml(resource.id)}" type="button">在图谱中查看</button>` : ""}
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderSupportMaterialPlatform() {
    return `
      <div class="support-explain-grid">
        <article class="quality-card">
          <h3>素材入库</h3>
          <p>原始图片、网管截图、仿真界面、表格和脚本先进入素材子平台，绑定原始素材ID和来源说明。</p>
        </article>
        <article class="quality-card">
          <h3>媒体审查</h3>
          <p>软件截图、真实LOG、GPS轨迹、设备照片和网管界面需要完成脱敏、版权和教学化重绘判断。</p>
        </article>
        <article class="quality-card">
          <h3>资源包封装</h3>
          <p>通过审查的文字、表格、互动、图谱数据和教师材料再形成可上传到出版社平台的资源包。</p>
        </article>
        <article class="quality-card">
          <h3>版本追溯</h3>
          <p>素材、资源卡片、能力节点、学习活动和评价产出保留ID关系，便于后续更新和回滚。</p>
        </article>
      </div>
      <p class="support-boundary">当前页面只说明素材子平台边界，不表示后台系统已经真实开发完成。</p>
    `;
  }

  function renderSupportDelivery() {
    return `
      <div class="support-explain-grid">
        ${data.publication.map((item) => `
          <article class="quality-card">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.state)}</p>
          </article>
        `).join("")}
      </div>
      <p class="support-boundary">交付说明用于保留资源输出和直接呈现两条路线，不进入学生学习路径。</p>
    `;
  }

  function renderPlatformSupport() {
    if (!platformSupportPanel) return;
    if (!state.supportOpen) {
      platformSupportPanel.hidden = true;
      platformSupportPanel.innerHTML = "";
      platformSupportToggle?.classList.remove("is-open");
      return;
    }

    const selected = selectedSupportItem();
    platformSupportPanel.hidden = false;
    platformSupportToggle?.classList.add("is-open");
    const body = {
      "task-resource-mapping": renderSupportTaskResources,
      "material-platform": renderSupportMaterialPlatform,
      "delivery-note": renderSupportDelivery
    }[state.supportTab]?.() || "";

    platformSupportPanel.innerHTML = `
      <div class="support-head">
        <div>
          <p class="eyebrow">平台支持</p>
          <h2>${escapeHtml(selected?.title || "平台支持")}</h2>
          <p>${escapeHtml(selected?.summary || "")}</p>
        </div>
        <button class="small-button secondary" data-close-support type="button">收起</button>
      </div>
      <div class="support-tabs">
        ${(data.platformSupport || []).map((item) => `
          <button class="support-tab ${item.id === state.supportTab ? "is-active" : ""}" data-support-tab="${escapeHtml(item.id)}" type="button">
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.role)}</span>
          </button>
        `).join("")}
      </div>
      <div class="support-body">
        <div class="support-note">
          <strong>边界</strong>
          <span>${escapeHtml(selected?.boundary || "")}</span>
        </div>
        ${body}
      </div>
    `;

    platformSupportPanel.querySelector("[data-close-support]")?.addEventListener("click", closePlatformSupport);
    platformSupportPanel.querySelectorAll("[data-support-tab]").forEach((button) => {
      button.addEventListener("click", () => openPlatformSupport(button.dataset.supportTab));
    });
    platformSupportPanel.querySelectorAll("[data-support-resource]").forEach((button) => {
      button.addEventListener("click", () => {
        closePlatformSupport();
        setView("graph");
        setGraphResource(button.dataset.supportResource);
      });
    });
  }

  function renderCourse() {
    const activeProjects = data.projects.filter((project) => ["P2", "P4"].includes(project.id));
    workspace.innerHTML = `
      <section class="section">
        <h2>${escapeHtml(data.meta.subtitle)}</h2>
        <p class="lead">${escapeHtml(data.meta.boundary)}</p>
        <div class="status-grid">
          ${data.courseStatus.map((item) => `
            <div class="status-card">
              <b>${escapeHtml(item.value)}</b>
              <strong>${escapeHtml(item.label)}</strong>
              <span>${escapeHtml(item.note)}</span>
            </div>
          `).join("")}
        </div>
        <div class="entry-actions">
          ${deepSampleLink("进入P4-T2优化结果验证", "deep-sample-course")}
          <button class="small-button secondary" data-project-card="P4" type="button">查看项目四学习路径</button>
          <button class="small-button secondary" data-project-card="P2" type="button">查看项目二网络测试</button>
        </div>
      </section>
      <section class="section">
        <h2>整书项目链</h2>
        <div class="project-grid">
          ${data.projects.map((project) => `
            <article class="project-card" data-current="${project.status === "重点项目"}">
              <div class="badge-row">
                <span class="badge">${escapeHtml(project.id)}</span>
                <span class="badge ${project.status === "重点项目" ? "deep" : ""}">${escapeHtml(publicStatus(project.status))}</span>
              </div>
              <h3>${escapeHtml(project.title)}</h3>
              <p>${escapeHtml(project.goal)}</p>
              <button class="small-button secondary" data-project-card="${project.id}" type="button">查看项目</button>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="section">
        <h2>重点学习路径</h2>
        <div class="flow-grid">
          ${activeProjects.map((project) => `
            <article class="flow-card">
              <div class="badge-row">
                <span class="badge deep">${escapeHtml(project.id)}</span>
                <span class="badge">${escapeHtml(project.loopStatus)}</span>
              </div>
              <h3>${escapeHtml(project.title)}</h3>
              <p>${escapeHtml(data.loops[project.id]?.boundary || project.goal)}</p>
              <button class="small-button secondary" data-project-card="${project.id}" type="button">进入学习路径</button>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="section">
        <h2>学习路径怎么走</h2>
        <div class="flow-grid">
          <article class="flow-card"><h3>先看课程</h3><p>确认整书从信息采集、网络测试到优化验证的工作过程。</p></article>
          <article class="flow-card"><h3>再进项目</h3><p>在项目二和项目四之间切换，理解测试数据如何成为优化验证证据。</p></article>
          <article class="flow-card"><h3>下钻任务</h3><p>进入P4-T2完成投诉归类、指标判断、依据分类和结论表达。</p></article>
          <article class="flow-card"><h3>回看图谱</h3><p>用课程能力图谱理解项目、任务、资源、活动和评价之间的关系。</p></article>
        </div>
      </section>
    `;
    workspace.querySelectorAll("[data-project-card]").forEach((button) => {
      button.addEventListener("click", () => setProject(button.dataset.projectCard));
    });
  }

  function renderProjectLoop(project) {
    const loop = selectedLoop();
    if (!loop) {
      return `
        <section class="section">
          <h2>学习安排</h2>
          <div class="quality-card">
            <p>该项目是整书工作过程的一部分。阅读时可先把握项目目标、任务顺序和学习产出，再回到重点学习路径继续深入。</p>
          </div>
        </section>
      `;
    }

    return `
      <section class="section">
        <h2>${escapeHtml(loop.title)}</h2>
        <p class="lead">${escapeHtml(loop.boundary)}</p>
        <div class="loop-route">
          ${loop.route.map((item) => `
            <article class="route-card">
              <div class="badge-row">
                <span class="badge deep">${escapeHtml(item.id)}</span>
                <span class="badge">${escapeHtml(item.role)}</span>
              </div>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.focus)}</p>
              <strong>产出：${escapeHtml(item.output)}</strong>
              ${item.deepSample ? deepSampleLink("进入P4-T2学习任务", "deep-sample-loop") : ""}
              ${item.deepCandidate ? `<span class="badge deep">拓展学习任务</span>` : ""}
            </article>
          `).join("")}
        </div>
      </section>
      <section class="section">
        <h2>证据如何流转</h2>
        <div class="evidence-grid">
          ${loop.evidenceChain.map((item) => `
            <article class="evidence-card">
              <strong>${escapeHtml(item.from)} -> ${escapeHtml(item.to)}</strong>
              <p>${escapeHtml(item.text)}</p>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderProject() {
    const project = selectedProject();
    workspace.innerHTML = `
      <section class="section">
        <div class="badge-row">
          <span class="badge">${escapeHtml(project.id)}</span>
          <span class="badge ${project.status === "重点项目" ? "deep" : ""}">${escapeHtml(publicStatus(project.status))}</span>
          <span class="badge">${escapeHtml(project.abilityGroup)}</span>
        </div>
        <h2>${escapeHtml(project.title)}</h2>
        <p class="lead">${escapeHtml(project.goal)}</p>
      </section>
      <section class="section">
        <h2>任务链</h2>
        <div class="task-list">
          ${project.tasks.map((task) => `
            <article class="task-row">
              <div>
                <strong>${escapeHtml(task.id)} ${escapeHtml(task.title)}</strong>
                <span>${escapeHtml(publicStatus(task.status))}</span>
              </div>
              <div>
                <strong>学习活动</strong>
                <span>${escapeHtml(task.activity)}</span>
              </div>
              <div>
                ${task.deepSample ? deepSampleLink("进入学习任务", "deep-sample-task") : task.deepCandidate ? `<span class="badge deep">拓展任务</span>` : `<span class="badge ${task.status.includes("重点") ? "deep" : ""}">${escapeHtml(publicStatus(task.status))}</span>`}
              </div>
            </article>
          `).join("")}
        </div>
      </section>
      ${renderProjectLoop(project)}
      <section class="section">
        <h2>继续学习</h2>
        <div class="flow-grid">
          <article class="flow-card"><h3>学习前置</h3><p>回到项目二，理解测试数据如何采集、处理和分析。</p></article>
          <article class="flow-card"><h3>课堂学习</h3><p>进入项目四任务2，完成一次优化结果验证。</p></article>
          <article class="flow-card"><h3>课后延伸</h3><p>把验收结论继续整理为项目四任务3中的报告表达。</p></article>
          <a class="flow-card version-link" data-link="deep-sample-version" href="${escapeHtml(linkedPageHref(data.meta.deepSampleHref))}"><h3>进入P4-T2</h3><p>开始“5G网络优化结果验证”学习任务。</p></a>
        </div>
      </section>
    `;
  }

  function renderGraph() {
    const node = selectedGraphNode();
    const project = selectedProject();
    const projectNodes = nodesForProject(project.id);
    const nodeResources = resourcesForGraphNode(node);
    const projectResources = data.resources.filter((resource) => resource.project === project.id);
    const activeResource = selectedResourceForNode(node);
    workspace.innerHTML = `
      <section class="section">
        <h2>课程能力图谱</h2>
        <p class="lead">课程能力图谱用于说明课程主链、项目任务、能力节点、资源卡片、学习活动和评价产出之间的承接关系。先看分层关系，再点击节点查看资源挂接。</p>
        <div class="graph-callout">
          <div>
            <strong>怎么看</strong>
            <span>从上到下读：课程主链决定学习方向，项目路径承接任务，能力节点组织学习动作，资源卡片支撑完成产出。</span>
          </div>
          <button class="small-button secondary" data-project-graph="P4" type="button">查看项目四路径</button>
        </div>

        <div class="graph-stage" aria-label="课程能力图谱分层关系图">
          <div class="graph-layer">
            <div class="layer-label">
              <span>第一层</span>
              <strong>课程主链</strong>
            </div>
            <div class="graph-flow-row course-flow">
              ${data.graph.courseChain.map((item) => `
                <button class="flow-node ${item.id === node.id ? "is-active" : ""} ${item.project === project.id ? "is-related" : ""}" data-graph="${item.id}" type="button">
                  <small>${escapeHtml(item.id)}</small>
                  <strong>${escapeHtml(item.label)}</strong>
                  <span>${escapeHtml(item.desc)}</span>
                </button>
              `).join("")}
            </div>
          </div>

          <div class="layer-connector"><span>进入项目任务</span></div>

          <div class="graph-layer">
            <div class="layer-label">
              <span>第二层</span>
              <strong>重点项目路径</strong>
            </div>
            <div class="project-path-row">
              <button class="path-node ${state.projectId === "P2" ? "is-active" : ""}" data-project-graph="P2" type="button">
                <small>P2</small>
                <strong>网络测试路径</strong>
                <span>测试采集主线 + 异常处理分支 + 数据分析输出</span>
                <em>19个能力节点</em>
              </button>
              <div class="path-bridge">数据证据<br>支撑验证</div>
              <button class="path-node ${state.projectId === "P4" ? "is-active" : ""}" data-project-graph="P4" type="button">
                <small>P4</small>
                <strong>端到端优化路径</strong>
                <span>优化实施 + 结果验证 + 报告输出</span>
                <em>20个能力节点</em>
              </button>
            </div>
          </div>

          <div class="layer-connector"><span>拆到能力节点</span></div>

          <div class="graph-layer">
            <div class="layer-label">
              <span>第三层</span>
              <strong>${escapeHtml(project.id)}能力节点</strong>
            </div>
            <div class="capability-node-grid">
              ${projectNodes.length ? projectNodes.map((item) => `
                <button class="capability-node ${item.id === node.id ? "is-active" : ""}" data-graph="${item.id}" type="button">
                  <small>${escapeHtml(item.id)}</small>
                  <strong>${escapeHtml(item.label)}</strong>
                  <span>${escapeHtml(item.activity || item.desc || item.output)}</span>
                </button>
              `).join("") : `
                <div class="resource-empty">
                  <strong>${escapeHtml(project.title)}</strong>
                  <span>当前预览版尚未展开该项目的详细能力节点，可先查看P2和P4重点路径。</span>
                </div>
              `}
            </div>
          </div>

          <div class="layer-connector"><span>挂接资源与评价</span></div>

          <div class="graph-layer resource-layer">
            <div class="layer-label">
              <span>第四层</span>
              <strong>资源卡片与评价产出</strong>
            </div>
            <div class="resource-card-grid" aria-label="本项目资源卡片">
              ${projectResources.length ? projectResources.map((resource) => `
                <button class="resource-link-card ${resource.id === activeResource?.id ? "is-active" : ""} ${nodeMatchesResource(node, resource) ? "is-related" : ""}" data-resource-card="${escapeHtml(resource.id)}" type="button">
                  <small>${escapeHtml(resource.id)} · ${escapeHtml(resource.type)}</small>
                  <strong>${escapeHtml(resource.title)}</strong>
                  <span>${escapeHtml(resource.project)} / ${escapeHtml(resource.task)}</span>
                  <em>挂接节点：${escapeHtml(resource.node)}</em>
                </button>
              `).join("") : `
                <div class="resource-empty">
                  <strong>暂无本项目资源卡片</strong>
                  <span>${escapeHtml(project.title)} 当前没有可直接追踪的资源卡片。后续资源生产时应补齐节点挂接。</span>
                </div>
              `}
            </div>
          </div>
        </div>

        <div class="graph-layout graph-analysis-layout">
          <div class="graph-detail">
            <div class="badge-row">
              <span class="badge deep">${escapeHtml(node.id)}</span>
              <span class="badge">${escapeHtml(publicStatus(node.status || "课程主链"))}</span>
            </div>
            <h3>${escapeHtml(node.label)}</h3>
            <p>${escapeHtml(node.desc || node.activity || node.output)}</p>
            <p><strong>关联项目：</strong>${escapeHtml(node.project || project.title)}</p>
            <p><strong>关联任务：</strong>${escapeHtml(node.task || "课程主链")}</p>
            <p><strong>学习活动：</strong>${escapeHtml(node.activity || "见项目任务安排")}</p>
            <p><strong>评价产出：</strong>${escapeHtml(node.output || "任务完成记录、学习产出和后续学习建议")}</p>
            <div class="relation-panel">
              <h4>节点如何进入教材</h4>
              <p>本节点先确定学习动作，再挂接资源卡片，最后形成可评价产出。资源卡片不是附件，而是服务该节点训练的学习材料。</p>
            </div>
          </div>

          <div class="graph-detail">
            <div class="badge-row">
              <span class="badge media">资源挂接</span>
              <span class="badge">${nodeResources.length}项资源</span>
            </div>
            <h3>${activeResource ? escapeHtml(activeResource.title) : "未挂接资源卡片"}</h3>
            ${activeResource ? `
              <p><strong>资源类型：</strong>${escapeHtml(activeResource.type)}</p>
              <p><strong>所在位置：</strong>${escapeHtml(activeResource.project)} / ${escapeHtml(activeResource.task)}</p>
              <p><strong>挂接节点：</strong>${escapeHtml(activeResource.node)}</p>
              <p><strong>学习用途：</strong>${escapeHtml(activeResource.type)}支撑${escapeHtml(activeResource.project)} ${escapeHtml(activeResource.task)}学习。</p>
            ` : `
              <p>当前节点没有可直接追踪的资源卡片。正式资源生产时需要补齐资源ID、资源类型、学习动作、评价产出和审核状态。</p>
            `}
            <div class="relation-panel">
              <h4>资源到评价</h4>
              <p>${activeResource ? `学生使用“${escapeHtml(activeResource.title)}”后，应形成“${escapeHtml(node.output || "学习产出")}”。` : "没有资源挂接时，不能宣称该节点已经具备完整数字教材资源支撑。"}</p>
            </div>
          </div>
        </div>
      </section>
    `;
    workspace.querySelectorAll("[data-graph]").forEach((button) => {
      button.addEventListener("click", () => setGraphNode(button.dataset.graph));
    });
    workspace.querySelectorAll("[data-project-graph]").forEach((button) => {
      setProjectGraphButton(button);
    });
    workspace.querySelectorAll("[data-resource-card]").forEach((button) => {
      button.addEventListener("click", () => setGraphResource(button.dataset.resourceCard));
    });
  }

  function setProjectGraphButton(button) {
    button.addEventListener("click", () => {
      state.projectId = button.dataset.projectGraph;
      state.graphId = state.projectId === "P4" ? "P4T2-N07" : "P2T3-N03";
      state.resourceId = "";
      render();
    });
  }

  function renderTeacher() {
    const teacherFlow = selectedTeacherFlow();
    workspace.innerHTML = `
      <section class="section">
        <h2>任务组织、讲评与复核</h2>
        <p class="lead">AI预生成任务组织、课堂讲评和复核建议，教师审核确认后形成可执行教学安排。</p>
        <div class="graph-callout">
          <div>
            <strong>当前环节：${escapeHtml(teacherFlow.label)}</strong>
            <span>${escapeHtml(teacherFlow.note)}</span>
          </div>
          <button class="small-button secondary" data-open-support="task-resource-mapping" type="button">查看任务资源映射</button>
        </div>
        <div class="entry-actions">
          ${deepSampleLink("进入P4-T2学习任务", "deep-sample-teacher")}
          <button class="small-button secondary" data-project-card="P4" type="button">查看项目四学习路径</button>
          <button class="small-button secondary" data-project-card="P2" type="button">查看项目二网络测试</button>
        </div>
        <div class="ai-suggestion-grid">
          ${(data.aiTeacherSuggestions || []).map((item) => `
            <article class="teacher-card ai-card">
              <div class="badge-row">
                <span class="badge deep">${escapeHtml(item.taskId)}</span>
                <span class="badge warn">${escapeHtml(aiStatusLabel(item.status))}</span>
              </div>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.suggestion)}</p>
              <p><strong>教师动作：</strong>${escapeHtml(item.teacherAction)}</p>
              <p><strong>形成产出：</strong>${escapeHtml(item.output)}</p>
              <small>输入依据：${item.sourceInputs.map((source) => escapeHtml(source)).join("、")}</small>
            </article>
          `).join("")}
        </div>
        <div class="teacher-grid">
          ${data.teacherSupport.map((item) => `
            <article class="teacher-card">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.body)}</p>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="section">
        <h2>课堂入口判断</h2>
        <div class="flow-grid">
          <article class="flow-card"><h3>学测试分析</h3><p>进入项目二，先看P2-T1数据交付，再判断是否需要P2-T2异常分支，最后进入P2-T3数据分析。</p></article>
          <article class="flow-card"><h3>学结果验证</h3><p>进入项目四，直接打开P4-T2完成两课时学习任务。</p></article>
          <article class="flow-card"><h3>看整书路径</h3><p>使用图谱页确认项目二和项目四在整书能力链中的位置。</p></article>
          <article class="flow-card"><h3>看任务资源映射</h3><p>打开平台支持，查看资源卡片如何挂接能力节点、学习活动和评价产出。</p><button class="small-button secondary" data-open-support="task-resource-mapping" type="button">查看映射</button></article>
        </div>
      </section>
    `;
    workspace.querySelectorAll("[data-project-card]").forEach((button) => {
      button.addEventListener("click", () => setProject(button.dataset.projectCard));
    });
    workspace.querySelectorAll("[data-open-support]").forEach((button) => {
      button.addEventListener("click", () => openPlatformSupport(button.dataset.openSupport));
    });
  }

  function renderResources() {
    const filter = selectedResourceFilter();
    const resources = data.resources.filter((resource) => {
      if (state.resourceFilter === "all") return true;
      if (state.resourceFilter === "graph") return resource.type.includes("结构化") || resource.title.includes("图谱");
      if (state.resourceFilter === "P4-T2") return resource.task === "P4-T2" || resource.node.includes("P4T2");
      return resource.project === state.resourceFilter;
    });
    workspace.innerHTML = `
      <section class="section">
        <h2>资源中心</h2>
        <p class="lead">资源中心把学习内容拆成可复用的文字、表格、互动、图谱节点和教师材料，便于课堂教学和平台挂接。</p>
        <div class="graph-callout">
          <div>
            <strong>当前筛选：${escapeHtml(filter.label)}</strong>
            <span>${escapeHtml(filter.note)}。共 ${resources.length} 项。</span>
          </div>
          <button class="small-button secondary" data-resource-filter-inline="all" type="button">查看全部资源</button>
        </div>
        <div class="resource-table-wrap">
          <table class="resource-table">
            <thead>
              <tr>
                <th>资源</th>
                <th>类型</th>
                <th>位置</th>
                <th>图谱节点</th>
                <th>学习用途</th>
              </tr>
            </thead>
            <tbody>
              ${resources.map((resource) => `
                <tr>
                  <td><strong>${escapeHtml(resource.title)}</strong><br><span>${escapeHtml(resource.id)}</span></td>
                  <td>${escapeHtml(resource.type)}</td>
                  <td>${escapeHtml(resource.project)} / ${escapeHtml(resource.task)}</td>
                  <td>${escapeHtml(resource.node)}</td>
                  <td>${escapeHtml(resource.type)}支撑${escapeHtml(resource.project)} ${escapeHtml(resource.task)}学习。</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;
    workspace.querySelectorAll("[data-resource-filter-inline]").forEach((button) => {
      button.addEventListener("click", () => {
        state.resourceFilter = button.dataset.resourceFilterInline;
        render();
      });
    });
  }

  function renderPublish() {
    const publishItem = selectedPublishItem();
    workspace.innerHTML = `
      <section class="section">
        <h2>教材交付视图</h2>
        <p class="lead">交付视图说明数字教材可以如何进入出版社平台：既可以作为资源包输出，也可以作为完整学习页挂接到教材目录。</p>
        <div class="graph-callout">
          <div>
            <strong>当前交付项：${escapeHtml(publishItem.title)}</strong>
            <span>${escapeHtml(publishItem.state)}</span>
          </div>
          <button class="small-button secondary" data-publish-reset type="button">回到资源包输出</button>
        </div>
        <div class="publication-grid">
          ${data.publication.map((item, index) => `
            <article class="publication-card ${index === state.publishStep ? "is-active" : ""}">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.state)}</p>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="section">
        <h2>交付前检查项</h2>
        <ol class="quality-list">
          <li>教材正文、学习活动、评价产出和教师材料应形成一致的学习闭环。</li>
          <li>课程能力图谱节点应能映射到项目、任务、资源、活动和评价。</li>
          <li>表格、图片、动画、互动和小游戏应服务于具体学习任务，不作为装饰资源。</li>
          <li>真实LOG、GPS轨迹、设备照片、软件截图和网管截图应完成脱敏和版权审查。</li>
          <li>平台发布前检查页面可访问性、移动端适配、资源链接和版本追溯。</li>
        </ol>
      </section>
    `;
    workspace.querySelectorAll("[data-publish-reset]").forEach((button) => {
      button.addEventListener("click", () => {
        state.publishStep = 0;
        render();
      });
    });
  }

  function render() {
    layout.dataset.view = state.view;
    renderLeftRail();
    renderContextPanel();
    renderPlatformSupport();
    if (state.view === "course") renderCourse();
    if (state.view === "project") renderProject();
    if (state.view === "graph") renderGraph();
    if (state.view === "teacher") renderTeacher();
    if (state.view === "resources") renderResources();
    if (state.view === "publish") renderPublish();
  }

  function init() {
    document.querySelectorAll("[data-view]").forEach((button) => {
      button.addEventListener("click", () => setView(button.dataset.view));
    });
    platformSupportToggle?.addEventListener("click", () => {
      if (state.supportOpen) closePlatformSupport();
      else openPlatformSupport("task-resource-mapping");
    });
    syncTabs();
    render();
  }

  window.addEventListener("DOMContentLoaded", init);
})();
