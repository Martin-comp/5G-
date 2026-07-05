(function () {
  const data = window.DIGITAL_TEXTBOOK_OVERALL;
  const state = {
    view: "course",
    projectId: "P2",
    graphId: "CG-02"
  };

  const workspace = document.getElementById("workspace");
  const contextPanel = document.getElementById("contextPanel");
  const projectButtons = document.getElementById("projectButtons");

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

  function setView(view) {
    state.view = view;
    if (view === "graph" && state.graphId.startsWith("CG-")) {
      state.graphId = state.projectId === "P4" ? "P4T2-N07" : "P2T3-N03";
    }
    document.querySelectorAll(".tab").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === view);
    });
    render();
    workspace.scrollIntoView({ block: "start" });
  }

  function setProject(projectId) {
    state.projectId = projectId;
    state.view = "project";
    const firstNode = projectId === "P4" ? "P4T2-N07" : projectId === "P2" ? "P2T3-N03" : data.projects.find((item) => item.id === projectId)?.capabilityNode || "CG-02";
    state.graphId = firstNode;
    document.querySelectorAll(".tab").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === "project");
    });
    render();
    workspace.scrollIntoView({ block: "start" });
  }

  function setGraphNode(graphId) {
    state.graphId = graphId;
    const node = allGraphNodes().find((item) => item.id === graphId);
    if (node?.project) state.projectId = node.project;
    render();
  }

  function renderProjectButtons() {
    projectButtons.innerHTML = data.projects.map((project) => `
      <button class="project-button ${project.id === state.projectId ? "is-active" : ""}" data-project="${project.id}" type="button">
        <strong>${escapeHtml(project.id)} ${escapeHtml(project.title.replace(/^项目[一二三四五六][：、]/, ""))}</strong>
        <span>${escapeHtml(project.abilityGroup)} · ${escapeHtml(project.status)}</span>
      </button>
    `).join("");

    projectButtons.querySelectorAll("[data-project]").forEach((button) => {
      button.addEventListener("click", () => setProject(button.dataset.project));
    });
  }

  function renderContextPanel() {
    const project = selectedProject();
    const node = selectedGraphNode();
    contextPanel.innerHTML = `
      <div class="panel-title">当前上下文</div>
      <div class="panel-stack">
        <div class="panel-item">
          <strong>${escapeHtml(project.title)}</strong>
          <span>${escapeHtml(project.goal)}</span>
        </div>
        <div class="panel-item">
          <strong>${escapeHtml(node.id)} ${escapeHtml(node.label)}</strong>
          <span>${escapeHtml(node.desc || node.activity || node.output)}</span>
        </div>
        <div class="panel-item">
          <strong>当前母版</strong>
          <span>overall-0.5把项目二、项目四、P4-T2深样章和课程能力图谱统一到一个整书入口。</span>
        </div>
        <div class="panel-item">
          <strong>下一步</strong>
          <span>制作P2-T3任务级深样章实施计划，验证第二个任务级深样章。</span>
        </div>
      </div>
    `;
  }

  function renderCourse() {
    const activeProjects = data.projects.filter((project) => project.status === "已接入闭环");
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
          ${deepSampleLink("直接打开P4-T2任务级深样章", "deep-sample-course")}
          <button class="small-button secondary" data-project-card="P4" type="button">进入项目四闭环</button>
          <button class="small-button secondary" data-project-card="P2" type="button">查看P2-T3候选位置</button>
        </div>
      </section>
      <section class="section">
        <h2>整书项目链</h2>
        <div class="project-grid">
          ${data.projects.map((project) => `
            <article class="project-card" data-current="${project.status === "已接入闭环"}">
              <div class="badge-row">
                <span class="badge">${escapeHtml(project.id)}</span>
                <span class="badge ${project.status === "已接入闭环" ? "deep" : ""}">${escapeHtml(project.status)}</span>
              </div>
              <h3>${escapeHtml(project.title)}</h3>
              <p>${escapeHtml(project.goal)}</p>
              <button class="small-button secondary" data-project-card="${project.id}" type="button">查看项目</button>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="section">
        <h2>已接入的项目级闭环</h2>
        <div class="flow-grid">
          ${activeProjects.map((project) => `
            <article class="flow-card">
              <div class="badge-row">
                <span class="badge deep">${escapeHtml(project.id)}</span>
                <span class="badge">${escapeHtml(project.loopStatus)}</span>
              </div>
              <h3>${escapeHtml(project.title)}</h3>
              <p>${escapeHtml(data.loops[project.id]?.boundary || project.goal)}</p>
              <button class="small-button secondary" data-project-card="${project.id}" type="button">进入闭环</button>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="section">
        <h2>当前总入口怎么读</h2>
        <div class="flow-grid">
          <article class="flow-card"><h3>先看课程</h3><p>确认整书项目链、已接入闭环、深样章和候选深样章的位置。</p></article>
          <article class="flow-card"><h3>再进项目</h3><p>在项目二和项目四之间切换，理解任务链如何形成项目闭环。</p></article>
          <article class="flow-card"><h3>下钻任务</h3><p>P4-T2可以进入任务级深样章；P2-T3目前只作为下一步候选。</p></article>
          <article class="flow-card"><h3>回看图谱</h3><p>图谱不是目录，而是连接项目、任务、资源、活动和评价的暗线。</p></article>
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
          <h2>项目状态</h2>
          <div class="quality-card">
            <p>该项目目前仍为结构占位。它保留在整书项目链中，但尚未进入项目级闭环样本制作。</p>
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
              ${item.deepSample ? deepSampleLink("打开P4-T2深样章", "deep-sample-loop") : ""}
              ${item.deepCandidate ? `<span class="badge deep">P2-T3任务级深样章候选</span>` : ""}
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
          <span class="badge ${project.status === "已接入闭环" ? "deep" : "warn"}">${escapeHtml(project.status)}</span>
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
                <span>${escapeHtml(task.status)}</span>
              </div>
              <div>
                <strong>学习活动</strong>
                <span>${escapeHtml(task.activity)}</span>
              </div>
              <div>
                ${task.deepSample ? deepSampleLink("打开深样章", "deep-sample-task") : task.deepCandidate ? `<span class="badge deep">深样章候选</span>` : `<span class="badge ${task.status.includes("样稿") ? "deep" : "warn"}">${escapeHtml(task.status)}</span>`}
              </div>
            </article>
          `).join("")}
        </div>
      </section>
      ${renderProjectLoop(project)}
      <section class="section">
        <h2>版本入口</h2>
        <div class="flow-grid">
          <a class="flow-card version-link" href="${escapeHtml(linkedPageHref(data.meta.baselineHref))}"><h3>overall-0.2</h3><p>早期整书框架基线。</p></a>
          <a class="flow-card version-link" href="${escapeHtml(linkedPageHref(data.meta.stage2Href))}"><h3>阶段2项目四</h3><p>第一个项目级闭环样本。</p></a>
          <a class="flow-card version-link" href="${escapeHtml(linkedPageHref(data.meta.stage3Href))}"><h3>阶段3项目二</h3><p>第二个项目级闭环复制验证样本。</p></a>
          <a class="flow-card version-link" data-link="deep-sample-version" href="${escapeHtml(linkedPageHref(data.meta.deepSampleHref))}"><h3>P4-T2深样章</h3><p>当前唯一任务级深样章。</p></a>
        </div>
      </section>
    `;
  }

  function renderGraph() {
    const node = selectedGraphNode();
    const p2Nodes = nodesForProject("P2");
    const p4Nodes = nodesForProject("P4");
    const relationTasks = relationReviewData().tasks || [];
    workspace.innerHTML = `
      <section class="section">
        <h2>课程能力图谱</h2>
        <p class="lead">overall-0.5中的图谱页用于把项目二和项目四放回同一条整书能力暗线。学生端后续仍应使用局部路径，不把完整评审图作为第一学习界面。</p>
        <div class="graph-callout">
          <div>
            <strong>呈现边界</strong>
            <span>这里是整书母版中的综合图谱入口。完整关系线仍到V2.1关系评审版查看。</span>
          </div>
          <a class="deep-link secondary" data-link="relation-review" href="${escapeHtml(relationReviewHref())}">打开V2.1完整关系评审版</a>
        </div>
        <div class="graph-layout">
          <div>
            <h3>课程主链</h3>
            <div class="chain">
              ${data.graph.courseChain.map((item) => `
                <button class="graph-node ${item.id === state.graphId ? "is-active" : ""}" data-graph="${item.id}" type="button">
                  <strong>${escapeHtml(item.id)} ${escapeHtml(item.label)}</strong>
                  <span>${escapeHtml(item.desc)}</span>
                </button>
              `).join("")}
            </div>
            <h3 class="detail-heading">两个已接入项目闭环</h3>
            <div class="task-graph-grid">
              <button class="task-graph-card ${state.projectId === "P2" ? "is-active" : ""}" data-project-graph="P2" type="button">
                <span class="badge">P2</span>
                <strong>网络测试闭环</strong>
                <span>测试采集主线 + 异常处理分支 + 数据分析输出</span>
                <em>19个节点</em>
              </button>
              <button class="task-graph-card ${state.projectId === "P4" ? "is-active" : ""}" data-project-graph="P4" type="button">
                <span class="badge">P4</span>
                <strong>端到端优化闭环</strong>
                <span>优化实施 + 结果验证 + 报告输出</span>
                <em>20个节点</em>
              </button>
            </div>
            <h3 class="detail-heading">项目二节点</h3>
            <div class="detail-chain p4-loop-chain">
              ${p2Nodes.map((item) => `
                <button class="graph-node ${item.id === state.graphId ? "is-active" : ""}" data-graph="${item.id}" type="button">
                  <strong>${escapeHtml(item.id)} ${escapeHtml(item.label)}</strong>
                  <span>${escapeHtml(item.activity)}</span>
                </button>
              `).join("")}
            </div>
            <h3 class="detail-heading">项目四节点</h3>
            <div class="detail-chain p4-loop-chain">
              ${p4Nodes.map((item) => `
                <button class="graph-node ${item.id === state.graphId ? "is-active" : ""}" data-graph="${item.id}" type="button">
                  <strong>${escapeHtml(item.id)} ${escapeHtml(item.label)}</strong>
                  <span>${escapeHtml(item.activity)}</span>
                </button>
              `).join("")}
            </div>
          </div>
          <div class="graph-detail">
            <div class="badge-row">
              <span class="badge deep">${escapeHtml(node.id)}</span>
              <span class="badge">${escapeHtml(node.status || "课程主链")}</span>
            </div>
            <h3>${escapeHtml(node.label)}</h3>
            <p>${escapeHtml(node.desc || node.activity || node.output)}</p>
            <p><strong>关联项目：</strong>${escapeHtml(node.project || selectedProject().title)}</p>
            <p><strong>关联任务：</strong>${escapeHtml(node.task || "课程主链")}</p>
            <p><strong>学习活动：</strong>${escapeHtml(node.activity || "见项目任务结构")}</p>
            <p><strong>评价产出：</strong>${escapeHtml(node.output || "任务完成记录、资源审核状态和后续学习建议")}</p>
            <div class="relation-panel">
              <h4>V2.1关系层</h4>
              <p>当前关系评审版包含${escapeHtml(String(relationTasks.length))}个重点任务链条。完整关系线不压到本页，避免学生学习界面过载。</p>
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
  }

  function setProjectGraphButton(button) {
    button.addEventListener("click", () => {
      state.projectId = button.dataset.projectGraph;
      state.graphId = state.projectId === "P4" ? "P4T2-N07" : "P2T3-N03";
      render();
    });
  }

  function renderTeacher() {
    workspace.innerHTML = `
      <section class="section">
        <h2>教师带教视图</h2>
        <p class="lead">教师视图用于解释整书综合母版如何进入课堂。它不是学生学习路径，也不是完整教案系统。</p>
        <div class="entry-actions">
          ${deepSampleLink("打开P4-T2任务级深样章", "deep-sample-teacher")}
          <button class="small-button secondary" data-project-card="P4" type="button">查看项目四闭环</button>
          <button class="small-button secondary" data-project-card="P2" type="button">查看项目二候选</button>
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
          <article class="flow-card"><h3>学测试分析</h3><p>进入项目二，先看P2-T1数据交付，再判断是否需要P2-T2异常分支，最后进入P2-T3候选深样章。</p></article>
          <article class="flow-card"><h3>学结果验证</h3><p>进入项目四，P4-T2可以直接打开3.5A-1任务级深样章。</p></article>
          <article class="flow-card"><h3>看整书路径</h3><p>使用图谱页确认项目二和项目四在整书能力链中的位置。</p></article>
          <article class="flow-card"><h3>看发布风险</h3><p>进入资源和出版视图，确认哪些内容仍需复核、重绘、脱敏或平台接口处理。</p></article>
        </div>
      </section>
    `;
    workspace.querySelectorAll("[data-project-card]").forEach((button) => {
      button.addEventListener("click", () => setProject(button.dataset.projectCard));
    });
  }

  function renderResources() {
    workspace.innerHTML = `
      <section class="section">
        <h2>资源中心</h2>
        <p class="lead">资源中心合并项目二和项目四的资源治理状态。它不是素材仓库，而是资源、图谱节点、任务位置和审核状态的共同入口。</p>
        <div class="resource-table-wrap">
          <table class="resource-table">
            <thead>
              <tr>
                <th>资源</th>
                <th>类型</th>
                <th>位置</th>
                <th>图谱节点</th>
                <th>状态</th>
                <th>审核</th>
              </tr>
            </thead>
            <tbody>
              ${data.resources.map((resource) => `
                <tr>
                  <td><strong>${escapeHtml(resource.title)}</strong><br><span>${escapeHtml(resource.id)}</span></td>
                  <td>${escapeHtml(resource.type)}</td>
                  <td>${escapeHtml(resource.project)} / ${escapeHtml(resource.task)}</td>
                  <td>${escapeHtml(resource.node)}</td>
                  <td>${escapeHtml(resource.status)}</td>
                  <td>${escapeHtml(resource.audit)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function renderPublish() {
    workspace.innerHTML = `
      <section class="section">
        <h2>出版/编辑视图</h2>
        <p class="lead">本视图只验证整书母版里的资源输出和直接呈现挂接位置，不接入真实出版社平台接口。</p>
        <div class="publication-grid">
          ${data.publication.map((item) => `
            <article class="publication-card">
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.state)}</p>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="section">
        <h2>发布前质量门禁</h2>
        <ol class="quality-list">
          <li>overall-0.5只能称为整书综合母版原型，不能称为完整数字教材定稿。</li>
          <li>P4-T2可作为任务级深样章入口，仍需一线试看和专业复核。</li>
          <li>P2-T3只能称为任务级深样章候选，不得伪造已完成页面。</li>
          <li>真实LOG、GPS轨迹、设备照片、软件截图和网管截图不得默认发布。</li>
          <li>出版社平台接口未接入前，只能称为挂接位置原型。</li>
        </ol>
      </section>
    `;
  }

  function render() {
    renderProjectButtons();
    renderContextPanel();
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
    render();
  }

  window.addEventListener("DOMContentLoaded", init);
})();
