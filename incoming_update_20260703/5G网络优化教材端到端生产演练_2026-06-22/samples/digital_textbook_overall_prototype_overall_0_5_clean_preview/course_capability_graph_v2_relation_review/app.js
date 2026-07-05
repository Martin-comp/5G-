(function () {
  const data = window.COURSE_CAPABILITY_RELATION_REVIEW;
  const state = {
    mode: "neighborhood",
    relationType: "核心关系",
    selectedId: "P5T3-N06"
  };

  const taskColumns = document.getElementById("taskColumns");
  const edgeLayer = document.getElementById("edgeLayer");
  const nodeDetail = document.getElementById("nodeDetail");
  const relationFilters = document.getElementById("relationFilters");
  const modeControls = document.getElementById("modeControls");
  const edgeTable = document.getElementById("edgeTable");
  const graphStage = document.getElementById("graphStage");
  const graphHint = document.getElementById("graphHint");

  const nodeMap = new Map(data.nodes.map((node) => [node.id, node]));
  const typeOrder = ["核心关系", ...data.relationTypes.map((item) => item.type)];
  const typeCount = new Map(data.relationTypes.map((item) => [item.type, item.count]));
  const relationMarkers = {
    "直接递进": { id: "arrow-direct", color: "#2c609b" },
    "前置基础": { id: "arrow-prereq", color: "#176b6b" },
    "支撑判断": { id: "arrow-support", color: "#8a4b18" },
    "问题回流": { id: "arrow-return", color: "#9d3f3f" },
    "能力挂接": { id: "arrow-ability", color: "#687b92" },
    "资源证据": { id: "arrow-resource", color: "#8d6aa8" }
  };

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function getNodeLabel(id) {
    return nodeMap.get(id)?.title || id;
  }

  function isCoreEdge(edge) {
    return ["直接递进", "问题回流"].includes(edge.relation_type);
  }

  function matchesType(edge) {
    if (state.relationType === "核心关系") return isCoreEdge(edge);
    return edge.relation_type === state.relationType;
  }

  function visibleEdgesForTable() {
    if (state.mode === "neighborhood") {
      return data.edges.filter((edge) =>
        matchesType(edge) && (edge.source_node_id === state.selectedId || edge.target_node_id === state.selectedId)
      );
    }
    return data.edges.filter(matchesType);
  }

  function visibleEdgesForLines() {
    return visibleEdgesForTable().filter((edge) =>
      document.querySelector(`[data-node="${CSS.escape(edge.source_node_id)}"]`) &&
      document.querySelector(`[data-node="${CSS.escape(edge.target_node_id)}"]`)
    );
  }

  function relatedNodeIds() {
    const ids = new Set([state.selectedId]);
    visibleEdgesForTable().forEach((edge) => {
      if (edge.source_node_id === state.selectedId) ids.add(edge.target_node_id);
      if (edge.target_node_id === state.selectedId) ids.add(edge.source_node_id);
    });
    return ids;
  }

  function renderModes() {
    const modes = [
      ["overview", "总览视图"],
      ["neighborhood", "节点邻域"]
    ];
    modeControls.innerHTML = modes.map(([id, label]) => `
      <button type="button" class="${state.mode === id ? "is-active" : ""}" data-mode="${id}">${label}</button>
    `).join("");
    modeControls.querySelectorAll("[data-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        state.mode = button.dataset.mode;
        render();
      });
    });
  }

  function renderFilters() {
    relationFilters.innerHTML = typeOrder.map((type) => {
      const count = type === "核心关系" ? data.edges.filter(isCoreEdge).length : typeCount.get(type);
      return `<button type="button" class="${state.relationType === type ? "is-active" : ""}" data-relation="${escapeHtml(type)}">${escapeHtml(type)} ${count}</button>`;
    }).join("");
    relationFilters.querySelectorAll("[data-relation]").forEach((button) => {
      button.addEventListener("click", () => {
        state.relationType = button.dataset.relation;
        render();
      });
    });
  }

  function renderColumns() {
    const related = relatedNodeIds();
    taskColumns.innerHTML = data.tasks.map((task) => {
      const nodes = task.nodeIds.map((id) => nodeMap.get(id)).filter(Boolean);
      return `
        <section class="task-column">
          <div class="task-head">
            <div class="badge-row"><span class="badge warn">${escapeHtml(task.id)}</span></div>
            <h3>${escapeHtml(task.title)}</h3>
            <p>${escapeHtml(task.desc)}</p>
          </div>
          ${nodes.map((node) => `
            <button type="button" class="node-card ${state.selectedId === node.id ? "is-active" : ""} ${related.has(node.id) ? "is-related" : ""} ${state.mode === "neighborhood" && !related.has(node.id) ? "is-muted" : ""}" data-node="${escapeHtml(node.id)}">
              <div class="badge-row">
                <span class="badge warn">${escapeHtml(node.id)}</span>
                <span class="badge">${escapeHtml(node.unit)}</span>
              </div>
              <h3>${escapeHtml(node.title)}</h3>
              <p>${escapeHtml(node.assessment)}</p>
            </button>
          `).join("")}
        </section>
      `;
    }).join("");
    taskColumns.querySelectorAll("[data-node]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedId = button.dataset.node;
        state.mode = "neighborhood";
        render();
      });
    });
  }

  function renderLines() {
    const rect = graphStage.getBoundingClientRect();
    const scrollLeft = graphStage.scrollLeft;
    const scrollTop = graphStage.scrollTop;
    const width = Math.max(graphStage.scrollWidth, graphStage.clientWidth);
    const height = Math.max(graphStage.scrollHeight, graphStage.clientHeight);
    edgeLayer.setAttribute("viewBox", `0 0 ${width} ${height}`);
    edgeLayer.setAttribute("width", width);
    edgeLayer.setAttribute("height", height);

    const defs = `
      <defs>
        ${Object.values(relationMarkers).map((marker) => `
          <marker id="${marker.id}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M1,1 L7,4 L1,7" fill="none" stroke="${marker.color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
          </marker>
        `).join("")}
      </defs>
    `;

    const paths = visibleEdgesForLines().map((edge) => {
      const source = document.querySelector(`[data-node="${CSS.escape(edge.source_node_id)}"]`);
      const target = document.querySelector(`[data-node="${CSS.escape(edge.target_node_id)}"]`);
      const a = source.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      const sourceCenterX = a.left + a.width / 2;
      const targetCenterX = b.left + b.width / 2;
      const sourceCenterY = a.top + a.height / 2;
      const targetCenterY = b.top + b.height / 2;
      const sameColumn = Math.abs(sourceCenterX - targetCenterX) < Math.min(a.width, b.width) * 0.72;
      let x1;
      let x2;
      let y1 = sourceCenterY - rect.top + scrollTop;
      let y2 = targetCenterY - rect.top + scrollTop;
      let d;

      if (sameColumn) {
        const sideOffset = edge.relation_type === "前置基础" ? -44 : 44;
        const useRightSide = sideOffset > 0;
        x1 = (useRightSide ? a.right : a.left) - rect.left + scrollLeft;
        x2 = (useRightSide ? b.right : b.left) - rect.left + scrollLeft;
        d = `M ${x1} ${y1} C ${x1 + sideOffset} ${y1}, ${x2 + sideOffset} ${y2}, ${x2} ${y2}`;
      } else if (targetCenterX > sourceCenterX) {
        x1 = a.right - rect.left + scrollLeft;
        x2 = b.left - rect.left + scrollLeft;
        const mid = Math.max(36, Math.abs(x2 - x1) / 2);
        d = `M ${x1} ${y1} C ${x1 + mid} ${y1}, ${x2 - mid} ${y2}, ${x2} ${y2}`;
      } else {
        x1 = a.left - rect.left + scrollLeft;
        x2 = b.right - rect.left + scrollLeft;
        const mid = Math.max(44, Math.abs(x2 - x1) / 2);
        d = `M ${x1} ${y1} C ${x1 - mid} ${y1}, ${x2 + mid} ${y2}, ${x2} ${y2}`;
      }

      const focus = edge.source_node_id === state.selectedId || edge.target_node_id === state.selectedId;
      const markerId = relationMarkers[edge.relation_type]?.id || relationMarkers["能力挂接"].id;
      return `<path class="edge-path edge-${edge.relation_type} ${focus ? "is-focus" : ""}" d="${d}" marker-end="url(#${markerId})"><title>${escapeHtml(edge.relation_type)}：${escapeHtml(edge.relation_summary)}</title></path>`;
    }).join("");

    edgeLayer.innerHTML = defs + paths;
  }

  function renderDetail() {
    const node = nodeMap.get(state.selectedId);
    const connected = data.edges.filter((edge) => edge.source_node_id === state.selectedId || edge.target_node_id === state.selectedId);
    const incoming = connected.filter((edge) => edge.target_node_id === state.selectedId);
    const outgoing = connected.filter((edge) => edge.source_node_id === state.selectedId);

    function edgeCards(edges, empty) {
      if (!edges.length) return `<p>${escapeHtml(empty)}</p>`;
      return edges.slice(0, 10).map((edge) => `
        <article class="edge-card">
          <div class="badge-row">
            <span class="badge warn">${escapeHtml(edge.relation_type)}</span>
            <span class="badge">${escapeHtml(edge.review_status)}</span>
          </div>
          <strong>${escapeHtml(edge.source_node_id)} -> ${escapeHtml(edge.target_node_id)}</strong>
          <p>${escapeHtml(edge.relation_summary)}</p>
        </article>
      `).join("");
    }

    nodeDetail.innerHTML = `
      <div class="detail-list">
        <div><strong>当前节点</strong><span>${escapeHtml(node.id)} ${escapeHtml(node.title)}</span></div>
        <div><strong>所属任务</strong><span>${escapeHtml(node.task)}</span></div>
        <div><strong>能力单元</strong><span>${escapeHtml(node.unit)}</span></div>
        <div><strong>评价产出</strong><span>${escapeHtml(node.assessment)}</span></div>
        <div><strong>审核状态</strong><span>${escapeHtml(node.audit)}</span></div>
      </div>
      <div class="edge-groups">
        <h3>进入本节点的关系 ${incoming.length}</h3>
        ${edgeCards(incoming, "暂无入边。")}
        <h3>从本节点发出的关系 ${outgoing.length}</h3>
        ${edgeCards(outgoing, "暂无出边。")}
      </div>
    `;
  }

  function renderTable() {
    const rows = visibleEdgesForTable();
    edgeTable.innerHTML = `
      <div class="edge-row header">
        <span>类型</span><span>起点</span><span>终点</span><span>状态</span><span>关系说明</span>
      </div>
      ${rows.length ? rows.map((edge) => `
        <div class="edge-row">
          <span>${escapeHtml(edge.relation_type)}</span>
          <span>${escapeHtml(edge.source_node_id)} ${escapeHtml(getNodeLabel(edge.source_node_id))}</span>
          <span>${escapeHtml(edge.target_node_id)} ${escapeHtml(getNodeLabel(edge.target_node_id))}</span>
          <span>${escapeHtml(edge.review_status)}</span>
          <span>${escapeHtml(edge.relation_summary)}</span>
        </div>
      `).join("") : `
        <div class="edge-row empty">
          <span>无匹配关系</span>
          <span>当前节点</span>
          <span>${escapeHtml(state.selectedId)}</span>
          <span>${escapeHtml(state.relationType)}</span>
          <span>该节点在当前筛选下没有可显示关系。可切换核心关系、前置基础或总览视图继续查看。</span>
        </div>
      `}
    `;
  }

  function renderHint() {
    const visibleCount = visibleEdgesForLines().length;
    const tableCount = visibleEdgesForTable().length;
    if (state.mode === "neighborhood") {
      graphStage.classList.add("is-neighborhood");
      graphHint.textContent = `当前只显示 ${state.selectedId} 的“${state.relationType}”邻域关系：图中可见 ${visibleCount} 条线，完整清单 ${tableCount} 条。切换“总览视图”可查看同类关系的全局分布。`;
      return;
    }
    graphStage.classList.remove("is-neighborhood");
    graphHint.textContent = `当前为“${state.relationType}”总览，图中可见 ${visibleCount} 条线。若线条变密，请点击任一节点进入节点邻域。`;
  }

  function render() {
    renderModes();
    renderFilters();
    renderColumns();
    renderDetail();
    renderTable();
    renderHint();
    requestAnimationFrame(renderLines);
  }

  window.addEventListener("resize", () => requestAnimationFrame(renderLines));
  graphStage.addEventListener("scroll", () => requestAnimationFrame(renderLines));
  render();
})();
