(function () {
  const data = window.DIGITAL_TEXTBOOK_OVERALL;
  const state = {
    view: "course",
    projectId: "P4",
    graphId: "CG-05",
    graphTaskId: "P4-T2"
  };

  const workspace = document.getElementById("workspace");
  const contextPanel = document.getElementById("contextPanel");
  const projectButtons = document.getElementById("projectButtons");

  function setView(view) {
    state.view = view;
    if (view === "graph" && state.graphId.startsWith("CG-")) {
      state.graphTaskId = "P5-T3";
      state.graphId = "P5T3-N03";
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
    document.querySelectorAll(".tab").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.view === "project");
    });
    render();
    workspace.scrollIntoView({ block: "start" });
  }

  function selectedProject() {
    return data.projects.find((project) => project.id === state.projectId) || data.projects[3];
  }

  function relationReviewData() {
    return window.COURSE_CAPABILITY_RELATION_REVIEW || { tasks: [], nodes: [], edges: [] };
  }

  function relationTasks() {
    return relationReviewData().tasks || [];
  }

  function relationNodes() {
    return relationReviewData().nodes || [];
  }

  function relationEdges() {
    return relationReviewData().edges || [];
  }

  function relationReviewHref() {
    return data.graph.relationReviewHref || "../course_capability_graph_v2_relation_review/index.html";
  }

  function normalizeGraphNode(node) {
    if (!node) return {};
    const task = node.task || (node.id && node.id.startsWith("P4T2") ? "P4-T2" : "");
    const project = node.project || (task ? task.split("-")[0] : "");
    return {
      ...node,
      label: node.label || node.title || node.id,
      desc: node.desc || node.goal || node.output || node.assessment || "",
      project,
      task,
      activity: node.activity || "见项目任务结构占位",
      output: node.output || node.assessment || "任务完成记录、资源审核状态和后续学习建议",
      status: node.status || node.audit || "关系层试拆"
    };
  }

  function allGraphNodes() {
    const nodesById = new Map();
    [...data.graph.courseChain, ...data.graph.detailNodes, ...relationNodes()].forEach((node) => {
      nodesById.set(node.id, normalizeGraphNode(node));
    });
    return Array.from(nodesById.values());
  }

  function selectedGraphNode() {
    return allGraphNodes().find((node) => node.id === state.graphId) || normalizeGraphNode(data.graph.courseChain[4]);
  }

  function selectedRelationTask() {
    return relationTasks().find((task) => task.id === state.graphTaskId) || relationTasks()[1] || relationTasks()[0] || null;
  }

  function nodesForTask(taskId) {
    const task = relationTasks().find((item) => item.id === taskId);
    if (!task) return [];
    return task.nodeIds
      .map((id) => relationNodes().find((node) => node.id === id))
      .filter(Boolean)
      .map(normalizeGraphNode);
  }

  function setGraphNode(graphId) {
    state.graphId = graphId;
    const node = normalizeGraphNode(allGraphNodes().find((item) => item.id === graphId));
    if (node.task) state.graphTaskId = node.task;
    render();
  }

  function setGraphTask(taskId) {
    state.graphTaskId = taskId;
    const task = relationTasks().find((item) => item.id === taskId);
    if (task && !task.nodeIds.includes(state.graphId)) {
      state.graphId = task.nodeIds.includes("P5T3-N03") ? "P5T3-N03" : task.nodeIds[0];
    }
    render();
  }

  function edgesForNode(nodeId) {
    return relationEdges()
      .filter((edge) => edge.source_node_id === nodeId || edge.target_node_id === nodeId)
      .sort((a, b) => {
        const priority = (a.display_priority || 9) - (b.display_priority || 9);
        if (priority !== 0) return priority;
        return a.edge_id.localeCompare(b.edge_id);
      });
  }

  function nodeTitleById(nodeId) {
    const node = normalizeGraphNode(allGraphNodes().find((item) => item.id === nodeId));
    return node.label || nodeId;
  }

  function relationTypeClass(type) {
    if (type === "直接递进") return "deep";
    if (type === "问题回流") return "warn";
    if (type === "资源证据") return "media";
    return "";
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
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
    const node = normalizeGraphNode(selectedGraphNode());
    contextPanel.innerHTML = `
      <div class="panel-title">当前上下文</div>
      <div class="panel-stack">
        <div class="panel-item">
          <strong>${escapeHtml(project.title)}</strong>
          <span>${escapeHtml(project.goal)}</span>
        </div>
        <div class="panel-item">
          <strong>${escapeHtml(node.id)} ${escapeHtml(node.label)}</strong>
          <span>${escapeHtml(node.desc)}</span>
        </div>
        <div class="panel-item">
          <strong>下一步产物</strong>
          <span>samples/digital_textbook_overall_prototype/ 完成后进入浏览器QA和治理更新。</span>
        </div>
        <div class="panel-item">
          <strong>外部门禁</strong>
          <span>真实一线试看、通信专业复核、出版社平台接口仍未完成。</span>
        </div>
      </div>
    `;
  }

  function renderCourse() {
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
      </section>
      <section class="section">
        <h2>整书项目链</h2>
        <div class="project-grid">
          ${data.projects.map((project) => `
            <article class="project-card" data-current="${project.id === "P4"}">
              <div class="badge-row">
                <span class="badge">${escapeHtml(project.id)}</span>
                <span class="badge ${project.id === "P4" ? "deep" : ""}">${escapeHtml(project.status)}</span>
              </div>
              <h3>${escapeHtml(project.title)}</h3>
              <p>${escapeHtml(project.goal)}</p>
              <button class="small-button secondary" data-project-card="${project.id}" type="button">查看项目</button>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="section">
        <h2>当前可演示主线</h2>
        <div class="flow-grid">
          <article class="flow-card"><h3>课程首页</h3><p>展示整本教材项目链、课程能力图谱入口和当前学习建议。</p></article>
          <article class="flow-card"><h3>项目四</h3><p>展示方案实施、结果验证、报告输出三项任务的前后关系。</p></article>
          <article class="flow-card"><h3>任务2深样章</h3><p>链接3.5A-1，验证一个任务的教材正文、案例递进、学习单和教师材料。</p></article>
          <article class="flow-card"><h3>状态回写</h3><p>学习产出回到课程能力图谱，形成能力节点、资源和评价的闭环。</p></article>
        </div>
      </section>
    `;

    workspace.querySelectorAll("[data-project-card]").forEach((button) => {
      button.addEventListener("click", () => setProject(button.dataset.projectCard));
    });
  }

  function renderProject() {
    const project = selectedProject();
    workspace.innerHTML = `
      <section class="section">
        <div class="badge-row">
          <span class="badge">${escapeHtml(project.id)}</span>
          <span class="badge ${project.id === "P4" ? "deep" : "warn"}">${escapeHtml(project.status)}</span>
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
                ${task.deepSample ? `<a class="deep-link" href="${escapeHtml(data.meta.deepSampleHref)}">打开深样章</a>` : `<span class="badge warn">结构占位</span>`}
              </div>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="section">
        <h2>项目层判断</h2>
        <div class="quality-card">
          <p>当前项目页不是完整教学内容页。它的任务是说明项目目标、任务链、能力群和开发状态，并把P4-T2深样章放到整书上下文中。</p>
        </div>
      </section>
    `;
  }

  function renderGraph() {
    const node = normalizeGraphNode(selectedGraphNode());
    const selectedTask = selectedRelationTask();
    const taskNodes = selectedTask ? nodesForTask(selectedTask.id) : [];
    const visibleRelations = node.id && !node.id.startsWith("CG-") ? edgesForNode(node.id).slice(0, 8) : [];
    const relatedProject = data.projects.find((project) => project.id === node.project) || data.projects[3];
    workspace.innerHTML = `
      <section class="section">
        <h2>课程能力图谱</h2>
        <p class="lead">图谱是整本数字教材的暗线。它连接项目、任务、资源、学习活动和评价产出，不作为单纯目录跳转。</p>
        <div class="graph-callout">
          <div>
            <strong>呈现边界</strong>
            <span>这里是整体原型中的可导航图谱，不是完整定稿图谱。学生端只应看到与当前学习任务相关的局部路径；完整关系评审面向教师、编辑和专家。</span>
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
            <h3 class="detail-heading">四任务关系层</h3>
            <p class="helper-text">本层用于把已试拆的关键任务放入同一条能力暗线，观察测试数据分析、结果验证、持续提升和信令复盘之间如何递进、支撑和回流。</p>
            <div class="task-graph-grid">
              ${relationTasks().map((task) => `
                <button class="task-graph-card ${task.id === state.graphTaskId ? "is-active" : ""}" data-graph-task="${task.id}" type="button">
                  <span class="badge">${escapeHtml(task.id)}</span>
                  <strong>${escapeHtml(task.title)}</strong>
                  <span>${escapeHtml(task.desc)}</span>
                  <em>${escapeHtml(String(task.nodeIds.length))}个节点</em>
                </button>
              `).join("")}
            </div>
            <h3 class="detail-heading">任务节点</h3>
            <div class="detail-chain">
              ${taskNodes.map((item) => `
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
              <span class="badge">${escapeHtml(node.status || "深样章节点")}</span>
            </div>
            <h3>${escapeHtml(node.label)}</h3>
            <p>${escapeHtml(node.desc)}</p>
            <p><strong>关联项目：</strong>${escapeHtml(relatedProject.title)}</p>
            <p><strong>关联任务：</strong>${escapeHtml(node.task || relatedProject.tasks.map((task) => task.id).join("、"))}</p>
            <p><strong>学习活动：</strong>${escapeHtml(node.activity)}</p>
            <p><strong>评价产出：</strong>${escapeHtml(node.output)}</p>
            <div class="relation-panel">
              <h4>节点邻域</h4>
              <p>${visibleRelations.length ? "只展示当前节点最相关的局部关系，避免把完整评审图直接压到学生学习界面。" : "点击四任务关系层中的详细节点，可查看它的前置、递进、支撑和回流关系。"}</p>
              <div class="relation-cards">
                ${visibleRelations.map((edge) => `
                  <article class="relation-card">
                    <div class="badge-row">
                      <span class="badge ${relationTypeClass(edge.relation_type)}">${escapeHtml(edge.relation_type)}</span>
                      <span class="badge">${escapeHtml(edge.review_status)}</span>
                    </div>
                    <strong>${escapeHtml(edge.source_node_id)} ${escapeHtml(edge.source_node_name || nodeTitleById(edge.source_node_id))} -> ${escapeHtml(edge.target_node_id)} ${escapeHtml(edge.target_node_name || nodeTitleById(edge.target_node_id))}</strong>
                    <p>${escapeHtml(edge.relation_summary)}</p>
                  </article>
                `).join("")}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    workspace.querySelectorAll("[data-graph]").forEach((button) => {
      button.addEventListener("click", () => setGraphNode(button.dataset.graph));
    });

    workspace.querySelectorAll("[data-graph-task]").forEach((button) => {
      button.addEventListener("click", () => setGraphTask(button.dataset.graphTask));
    });
  }

  function renderTeacher() {
    workspace.innerHTML = `
      <section class="section">
        <h2>教师带教视图</h2>
        <p class="lead">教师视图说明整本教材如何组织课堂，不进入学生学习路径。当前可复用3.5A-1的2课时教师材料。</p>
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
        <h2>项目四任务2教师入口</h2>
        <div class="quality-card">
          <p>教师可从项目四进入任务2深样章，查看2课时安排、关键提问、典型答案、模拟学情和专业复核表。模拟学情不得写成真实学生数据。</p>
          <a class="deep-link" href="${escapeHtml(data.meta.deepSampleHref)}">打开3.5A-1</a>
        </div>
      </section>
    `;
  }

  function renderResources() {
    workspace.innerHTML = `
      <section class="section">
        <h2>资源中心</h2>
        <p class="lead">资源中心展示资源类型、图谱节点、任务位置和审核状态。它不是素材仓库列表，而是出版和教学共同使用的资源治理入口。</p>
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
        <p class="lead">本视图只验证资源输出和直接呈现的挂接位置，不接入真实出版社平台接口。</p>
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
          <li>整体原型完成桌面端和移动端浏览器QA。</li>
          <li>P4-T2教学模拟案例继续标注待专业复核。</li>
          <li>原教材媒体资源不得默认发布。</li>
          <li>真实一线教师/学生试看未完成前，不写成教学验证通过。</li>
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
