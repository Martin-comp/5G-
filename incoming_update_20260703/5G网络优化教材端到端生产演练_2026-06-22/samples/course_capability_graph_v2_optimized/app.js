(function () {
  const data = window.COURSE_CAPABILITY_GRAPH_V2;
  const state = { type: "process", id: "JP-06", drawerOpen: false };

  const basisLayer = document.getElementById("basisLayer");
  const jobChain = document.getElementById("jobChain");
  const taskChain = document.getElementById("taskChain");
  const abilityUnits = document.getElementById("abilityUnits");
  const deepNodes = document.getElementById("deepNodes");
  const detailPanel = document.getElementById("detailPanel");

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function select(type, id) {
    state.type = type;
    state.id = id;
    state.drawerOpen = true;
    render();
  }

  function closeDrawer() {
    state.drawerOpen = false;
    renderDetail();
  }

  function renderBasis() {
    basisLayer.innerHTML = data.basis.map((item) => `
      <article class="basis-card">
        <div class="badge-row"><span class="badge">${escapeHtml(item.id)}</span></div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
      </article>
    `).join("");
  }

  function renderJobChain() {
    jobChain.innerHTML = data.jobProcesses.map((item) => `
      <button class="job-node ${state.id === item.id ? "is-active" : ""}" data-process="${escapeHtml(item.id)}" type="button">
        <div class="badge-row"><span class="badge">${escapeHtml(item.id)}</span></div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.desc)}</p>
      </button>
    `).join("");
    jobChain.querySelectorAll("[data-process]").forEach((button) => {
      button.addEventListener("click", () => select("process", button.dataset.process));
    });
  }

  function renderTaskChain() {
    taskChain.innerHTML = data.taskChain.map((item) => `
      <article class="task-step">
        <div class="badge-row">
          <span class="badge deep">${escapeHtml(item.id)}</span>
          <span class="badge">${escapeHtml(item.unit)}</span>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.desc)}</p>
        <span>${escapeHtml(item.status)}</span>
      </article>
    `).join("");
  }

  function renderAbilities() {
    abilityUnits.innerHTML = data.abilityUnits.map((item) => `
      <article class="ability-card ${state.id === item.id ? "is-active" : ""}" data-ability="${escapeHtml(item.id)}">
        <div class="badge-row">
          <span class="badge">${escapeHtml(item.id)}</span>
          <span class="badge">${escapeHtml(item.process)}</span>
          ${item.deep ? '<span class="badge deep">已深展开</span>' : ''}
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.goal)}</p>
        <div class="task-list">${escapeHtml(item.tasks.join("、"))}</div>
      </article>
    `).join("");
    abilityUnits.querySelectorAll("[data-ability]").forEach((card) => {
      card.addEventListener("click", () => select("ability", card.dataset.ability));
    });
  }

  function renderDeepNodes() {
    deepNodes.innerHTML = data.deepNodes.map((item) => `
      <button class="deep-card ${state.id === item.id ? "is-active" : ""}" data-deep="${escapeHtml(item.id)}" type="button">
        <div class="badge-row">
          <span class="badge deep">${escapeHtml(item.id)}</span>
          <span class="badge">${escapeHtml(item.unit)}</span>
          ${item.task ? `<span class="badge">${escapeHtml(item.task)}</span>` : ""}
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.activity)}</p>
      </button>
    `).join("");
    deepNodes.querySelectorAll("[data-deep]").forEach((button) => {
      button.addEventListener("click", () => select("deep", button.dataset.deep));
    });
  }

  function renderDetail() {
    let title = "";
    let rows = [];
    if (state.type === "process") {
      const item = data.jobProcesses.find((node) => node.id === state.id);
      title = `${item.id} ${item.title}`;
      rows = [
        ["定位", "岗位工作过程节点"],
        ["说明", item.desc],
        ["关联任务", item.tasks.join("、")],
        ["依据", item.basis.join("、")]
      ];
    } else if (state.type === "ability") {
      const item = data.abilityUnits.find((node) => node.id === state.id);
      title = `${item.id} ${item.title}`;
      rows = [
        ["所属过程", item.process],
        ["关联任务", item.tasks.join("、")],
        ["能力目标", item.goal],
        ["资源类型", item.resources],
        ["学习活动", item.activities],
        ["评价产出", item.assessment],
        ["审核状态", item.audit]
      ];
    } else {
      const item = data.deepNodes.find((node) => node.id === state.id);
      title = `${item.id} ${item.title}`;
      rows = [
        ["所属能力单元", item.unit],
        ["任务卡片", item.task || "P4-T2"],
        ["资源类型", item.resources],
        ["学习活动", item.activity],
        ["评价产出", item.assessment],
        ["节点状态", item.nodeStatus || "深样章已实现"],
        ["复核状态", item.reviewStatus || item.audit || "待通信专业复核"],
        ["媒体状态", item.mediaStatus || "待按资源逐项审查"],
        ["资源状态", item.resourceStatus || "资源卡片待正式制作"]
      ];
    }

    detailPanel.innerHTML = `
      <div class="drawer-header">
        <div>
          <p class="eyebrow">节点详情</p>
          <h2>${escapeHtml(title)}</h2>
        </div>
        <button class="drawer-close" type="button" aria-label="关闭节点详情">×</button>
      </div>
      <div class="detail-list">
        ${rows.map(([key, value]) => `
          <div><strong>${escapeHtml(key)}</strong><span>${escapeHtml(value)}</span></div>
        `).join("")}
      </div>
    `;
    detailPanel.classList.toggle("is-open", state.drawerOpen);
    detailPanel.setAttribute("aria-hidden", String(!state.drawerOpen));
    document.body.classList.toggle("drawer-open", state.drawerOpen);
    const closeButton = detailPanel.querySelector(".drawer-close");
    if (closeButton) closeButton.addEventListener("click", closeDrawer);
  }

  function render() {
    renderBasis();
    renderJobChain();
    renderTaskChain();
    renderAbilities();
    renderDeepNodes();
    renderDetail();
  }

  render();

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.drawerOpen) closeDrawer();
  });
})();
