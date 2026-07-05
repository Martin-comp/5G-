(function () {
  const data = window.COURSE_CAPABILITY_GRAPH_REVIEW;
  const state = {
    selectedType: "chain",
    selectedId: "CG-05"
  };

  const courseChain = document.getElementById("courseChain");
  const projectColumns = document.getElementById("projectColumns");
  const detailPanel = document.getElementById("detailPanel");
  const deepNodes = document.getElementById("deepNodes");
  const crossLinks = document.getElementById("crossLinks");

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function select(type, id) {
    state.selectedType = type;
    state.selectedId = id;
    render();
    detailPanel.scrollIntoView({ block: "nearest" });
  }

  function findChain(id) {
    return data.chain.find((node) => node.id === id);
  }

  function findTask(id) {
    for (const project of data.projects) {
      const task = project.tasks.find((item) => item.id === id);
      if (task) return { ...task, project };
    }
    return null;
  }

  function findDeep(id) {
    return data.deepNodes.find((node) => node.id === id);
  }

  function renderChain() {
    courseChain.innerHTML = data.chain.map((node) => `
      <button class="chain-node ${state.selectedId === node.id ? "is-active" : ""}" data-chain="${escapeHtml(node.id)}" type="button">
        <strong>${escapeHtml(node.id)} ${escapeHtml(node.label)}</strong>
        <span>${escapeHtml(node.desc)}</span>
      </button>
    `).join("");

    courseChain.querySelectorAll("[data-chain]").forEach((button) => {
      button.addEventListener("click", () => select("chain", button.dataset.chain));
    });
  }

  function renderProjects() {
    const selectedChain = state.selectedType === "chain" ? state.selectedId : "";
    projectColumns.innerHTML = data.projects.map((project) => {
      const focus = selectedChain && project.chainId.includes(selectedChain);
      return `
        <section class="project-column" data-focus="${focus}">
          <div class="project-title">
            <span class="badge">${escapeHtml(project.id)}</span>
            <span class="badge">${escapeHtml(project.chainId)}</span>
          </div>
          <h3>${escapeHtml(project.title)}</h3>
          <div class="task-list">
            ${project.tasks.map((task) => `
              <button class="task-button ${state.selectedId === task.id ? "is-active" : ""}" data-task="${escapeHtml(task.id)}" data-deep="${task.deep ? "true" : "false"}" type="button">
                <strong>${escapeHtml(task.id)} ${escapeHtml(task.title)}</strong>
                <span>${escapeHtml(task.capability)} · ${escapeHtml(task.status)}</span>
              </button>
            `).join("")}
          </div>
        </section>
      `;
    }).join("");

    projectColumns.querySelectorAll("[data-task]").forEach((button) => {
      button.addEventListener("click", () => select("task", button.dataset.task));
    });
  }

  function renderDeepNodes() {
    deepNodes.innerHTML = data.deepNodes.map((node) => `
      <button class="deep-button ${state.selectedId === node.id ? "is-active" : ""}" data-deep-node="${escapeHtml(node.id)}" type="button">
        <span class="badge deep">${escapeHtml(node.id)}</span>
        <strong>${escapeHtml(node.label)}</strong>
        <span>${escapeHtml(node.activity)}</span>
      </button>
    `).join("");

    deepNodes.querySelectorAll("[data-deep-node]").forEach((button) => {
      button.addEventListener("click", () => select("deep", button.dataset.deepNode));
    });
  }

  function renderCrossLinks() {
    crossLinks.innerHTML = data.crossLinks.map((link) => `
      <article class="cross-card">
        <strong>${escapeHtml(link.from)} → ${escapeHtml(link.to)}</strong>
        <p>${escapeHtml(link.why)}</p>
      </article>
    `).join("");
  }

  function renderDetail() {
    if (state.selectedType === "chain") {
      const node = findChain(state.selectedId);
      const projects = data.projects.filter((project) => project.chainId.includes(node.id));
      detailPanel.innerHTML = `
        <h2>${escapeHtml(node.id)} ${escapeHtml(node.label)}</h2>
        <p>${escapeHtml(node.desc)}</p>
        <div class="detail-kv">
          <div><strong>关联项目</strong><span>${projects.map((project) => project.title).join("；")}</span></div>
          <div><strong>关联任务</strong><span>${projects.flatMap((project) => project.tasks.map((task) => `${task.id} ${task.title}`)).join("；")}</span></div>
          <div><strong>评审问题</strong><span>${escapeHtml(node.reviewQuestion)}</span></div>
        </div>
      `;
      return;
    }

    if (state.selectedType === "task") {
      const task = findTask(state.selectedId);
      detailPanel.innerHTML = `
        <h2>${escapeHtml(task.id)} ${escapeHtml(task.title)}</h2>
        <p>${escapeHtml(task.project.title)}</p>
        <div class="detail-kv">
          <div><strong>所属主链</strong><span>${escapeHtml(task.project.chainId)}</span></div>
          <div><strong>状态</strong><span>${escapeHtml(task.status)}</span></div>
          <div><strong>能力方向</strong><span>${escapeHtml(task.capability)}</span></div>
          <div><strong>学习产出</strong><span>${escapeHtml(task.output)}</span></div>
          <div><strong>关联深节点</strong><span>${escapeHtml([...(task.feeds || []), ...(task.receives || [])].join("、") || "待后续细化")}</span></div>
        </div>
      `;
      return;
    }

    const node = findDeep(state.selectedId);
    detailPanel.innerHTML = `
      <h2>${escapeHtml(node.id)} ${escapeHtml(node.label)}</h2>
      <p>项目四任务2的详细能力节点。</p>
      <div class="detail-kv">
        <div><strong>训练动作</strong><span>${escapeHtml(node.activity)}</span></div>
        <div><strong>学习产出</strong><span>${escapeHtml(node.output)}</span></div>
        <div><strong>前置来源</strong><span>${escapeHtml((node.source || []).join("、") || "无")}</span></div>
        <div><strong>后续去向</strong><span>${escapeHtml((node.target || []).join("、") || "继续本任务后续节点")}</span></div>
      </div>
    `;
  }

  function render() {
    renderChain();
    renderProjects();
    renderDeepNodes();
    renderCrossLinks();
    renderDetail();
  }

  document.getElementById("resetGraph").addEventListener("click", () => select("chain", "CG-05"));
  render();
})();
