(function () {
  const data = window.P4T2_WORKBENCH;
  const storage = {
    mode: "p4t2_3_2_mode",
    activeGroup: "p4t2_3_2_active_group",
    evidence: "p4t2_3_2_selected_data",
    initial: "p4t2_3_2_initial_judgment",
    conclusion: "p4t2_3_2_conclusion"
  };

  const state = {
    mode: localStorage.getItem(storage.mode) || "classroom",
    activeGroupId: localStorage.getItem(storage.activeGroup) || "coverage",
    selectedEvidence: readJson(storage.evidence, []),
    initial: readJson(storage.initial, {}),
    conclusion: readJson(storage.conclusion, {}),
    activeResourceId: null,
    activeNodeId: "scene",
    activeSegmentId: "seg-scenario"
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  function save() {
    localStorage.setItem(storage.mode, state.mode);
    localStorage.setItem(storage.activeGroup, state.activeGroupId);
    localStorage.setItem(storage.evidence, JSON.stringify(state.selectedEvidence));
    localStorage.setItem(storage.initial, JSON.stringify(state.initial));
    localStorage.setItem(storage.conclusion, JSON.stringify(state.conclusion));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function groupById(id) {
    return data.evidenceGroups.find((group) => group.id === id);
  }

  function activeGroup() {
    return groupById(state.activeGroupId) || data.evidenceGroups[0];
  }

  function nodeById(id) {
    return data.abilityNodes.find((node) => node.id === id);
  }

  function segmentById(id) {
    return data.lessonSegments.find((segment) => segment.id === id);
  }

  function resourceById(id) {
    return data.resources.find((resource) => resource.id === id);
  }

  function evidenceById(id) {
    for (const group of data.evidenceGroups) {
      const item = group.items.find((entry) => entry.id === id);
      if (item) return { group, item };
    }
    return null;
  }

  function selectedGroups() {
    return Array.from(new Set(state.selectedEvidence.map((id) => evidenceById(id)?.group.id).filter(Boolean)));
  }

  function currentModeGuide() {
    return data.task.modeGuidance[state.mode] || data.task.modeGuidance.classroom;
  }

  function render() {
    renderStudentView();
    renderTeacherView();
    renderAuditView();
    bindViewTabs();
  }

  function bindViewTabs() {
    $$(".tab").forEach((button) => {
      button.onclick = () => {
        $$(".tab").forEach((tab) => tab.classList.toggle("active", tab === button));
        $$(".view").forEach((view) => view.classList.remove("active"));
        $(`#${button.dataset.view}View`)?.classList.add("active");
      };
    });
  }

  function renderStudentView() {
    const view = $("#studentView");
    const modeText = state.mode === "self" ? data.task.selfStudyIntro : data.task.classroomIntro;
    view.innerHTML = `
      <div class="student-shell mode-${escapeHtml(state.mode)}">
        <section class="task-band task-hero" aria-labelledby="taskTitle">
          <div class="task-copy">
            <p class="eyebrow">${escapeHtml(data.task.subtitle)}</p>
            <h2 id="taskTitle">${escapeHtml(data.task.focusTitle)}</h2>
            <p class="role-line">角色：${escapeHtml(data.task.role)}</p>
            <p class="task-question">${escapeHtml(data.task.question)}</p>
            <p class="task-output">最终任务：${escapeHtml(data.task.finalOutput)}</p>
          </div>
          <div class="task-actions">
            <div class="mode-switch" aria-label="学习模式">
              <button id="classroomMode" type="button" class="mode-button ${state.mode === "classroom" ? "active" : ""}">课堂模式</button>
              <button id="selfStudyMode" type="button" class="mode-button ${state.mode === "self" ? "active" : ""}">自学模式</button>
            </div>
            <button type="button" class="secondary-action open-resource" data-resource-id="R-SCENE-01">查看任务说明</button>
            <button id="openAbilityMap" type="button" class="primary-action">打开能力地图</button>
          </div>
        </section>

        <p id="modePanel" class="mode-panel ${escapeHtml(state.mode)}">${escapeHtml(modeText)}</p>
        ${renderInitialJudgment()}
        ${renderModeGuide()}

        <div class="workbench-grid">
          <aside class="ability-rail" aria-label="能力路径">
            <div class="section-head">
              <p class="eyebrow">学习路径</p>
              <h3>这一步学什么</h3>
            </div>
            <ol class="ability-list">
              ${data.abilityNodes.map(renderAbilityListItem).join("")}
            </ol>
          </aside>

          <section class="main-work" aria-label="教材正文与任务材料">
            <div class="section-head">
              <p class="eyebrow">教材正文</p>
              <h3>先读懂问题，再查看材料</h3>
            </div>
            ${renderLessonFlow()}
            ${renderMaterialWorkbench()}
            ${renderConclusionEditor()}
          </section>

          <aside class="learning-record" aria-label="学习记录">
            ${renderLearningRecord()}
          </aside>
        </div>
      </div>
    `;

    bindStudentEvents();
  }

  function renderInitialJudgment() {
    const initial = state.initial;
    return `
      <section id="initialJudgmentPanel" class="initial-judgment" aria-label="初步判断">
        <div>
          <p class="eyebrow">先判断</p>
          <h3>本次优化结果为：达标 / 部分达标 / 未达标 / 暂时无法判断</h3>
          <p>这个判断可以先不正确。岗位工作中，先判断、再找依据、再修正，比等老师讲完再抄答案更重要。</p>
        </div>
        <div class="initial-form">
          <label>
            我的初步判断
            <select id="initialStatus">
              <option value="">请选择</option>
              ${data.task.judgmentOptions.map((item) => `<option value="${escapeHtml(item)}" ${initial.status === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
            </select>
          </label>
          <label>
            我的第一理由
            <textarea id="firstReason" rows="2" placeholder="例如：网页好了，但视频和直播仍异常，可能只能算部分达标。">${escapeHtml(initial.firstReason || "")}</textarea>
          </label>
          <label>
            我最想先查看的数据
            <textarea id="firstDataToCheck" rows="2" placeholder="例如：视频通话时延、直播上行95分位时延、切换日志。">${escapeHtml(initial.firstDataToCheck || "")}</textarea>
          </label>
        </div>
      </section>
    `;
  }

  function renderModeGuide() {
    const guide = currentModeGuide();
    return `
      <section id="modeGuide" class="mode-guide ${escapeHtml(state.mode)}" aria-label="${escapeHtml(guide.title)}">
        <div>
          <p class="eyebrow">${state.mode === "self" ? "独立学习" : "课堂学习"}</p>
          <h3>${escapeHtml(guide.title)}</h3>
          <p>${escapeHtml(guide.subtitle)}</p>
        </div>
        <ol class="mode-steps">
          ${guide.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
        </ol>
      </section>
    `;
  }

  function renderAbilityListItem(node, index) {
    const relatedEvidence = node.evidenceGroups.flatMap((groupId) => {
      const group = groupById(groupId);
      return group ? group.items.map((item) => item.id) : [];
    });
    const done = relatedEvidence.length > 0 && relatedEvidence.some((id) => state.selectedEvidence.includes(id));
    const current = state.activeNodeId === node.id;
    return `
      <li>
        <button type="button" class="ability-step ${current ? "active" : ""}" data-node-id="${escapeHtml(node.id)}">
          <span class="step-index">${index + 1}</span>
          <span>
            <strong>${escapeHtml(node.studentLabel)}</strong>
            <em>${done ? "已有数据" : "待学习"}</em>
          </span>
        </button>
      </li>
    `;
  }

  function renderLessonFlow() {
    const active = segmentById(state.activeSegmentId) || data.lessonSegments[0];
    return `
      <div id="lessonFlow" class="lesson-flow">
        <div class="lesson-tabs" aria-label="教材正文段落">
          ${data.lessonSegments.map((segment, index) => `
            <button type="button" class="lesson-tab ${active.id === segment.id ? "active" : ""}" data-segment-id="${escapeHtml(segment.id)}">
              <span>${index + 1}</span>
              <strong>${escapeHtml(segment.title)}</strong>
            </button>
          `).join("")}
        </div>
        ${renderLessonSegment(active)}
      </div>
    `;
  }

  function renderLessonSegment(segment) {
    const segmentType = segment.groupId ? groupById(segment.groupId)?.studentTitle : "教材正文";
    return `
      <article id="${escapeHtml(segment.id)}" class="lesson-segment active" data-segment-id="${escapeHtml(segment.id)}">
        <div class="segment-head">
          <div>
            <p class="eyebrow">${escapeHtml(segmentType)}</p>
            <h4>${escapeHtml(segment.title)}</h4>
          </div>
          <span class="audit-line">${escapeHtml(segment.auditStatus || "")}</span>
        </div>
        <div class="segment-body">
          ${(segment.body || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          ${segment.table ? renderDataTable(segment.table) : ""}
          ${renderSegmentSupport(segment)}
          <div class="segment-action">
            <strong>你现在要做</strong>
            <p>${escapeHtml(segment.studentAction || "")}</p>
          </div>
          <div class="segment-mode-help ${escapeHtml(state.mode)}">
            <strong>${state.mode === "self" ? "自学提示" : "课堂停顿点"}</strong>
            <p>${escapeHtml(state.mode === "self" ? segment.selfStudySupport : segment.classroomPause)}</p>
          </div>
        </div>
        <div class="card-actions">
          ${segment.groupId ? `<button type="button" class="ghost-button jump-group" data-group-id="${escapeHtml(segment.groupId)}">查看这组材料</button>` : ""}
          ${segment.nodeId ? `<button type="button" class="ghost-button focus-node" data-node-id="${escapeHtml(segment.nodeId)}">看它在能力地图中的位置</button>` : ""}
        </div>
      </article>
    `;
  }

  function renderDataTable(table) {
    return `
      <div class="learning-table-wrap">
        <table class="learning-table">
          <thead>
            <tr>${table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderSegmentSupport(segment) {
    const supports = segment.supports || [];
    const limits = segment.limits || [];
    if (!supports.length && !limits.length && !segment.modelSentence) return "";
    return `
      <div class="support-limit-grid">
        ${supports.length ? `<div><strong>能支持什么</strong><ul>${supports.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>` : ""}
        ${limits.length ? `<div><strong>不能说明什么</strong><ul>${limits.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>` : ""}
      </div>
      ${segment.modelSentence ? `<blockquote class="model-sentence">${escapeHtml(segment.modelSentence)}</blockquote>` : ""}
    `;
  }

  function renderMaterialWorkbench() {
    const group = activeGroup();
    return `
      <section id="materialWorkbench" class="material-workbench" aria-label="材料聚焦看板">
        <div class="section-head">
          <p class="eyebrow">任务材料</p>
          <h3>查看数据，再修正判断</h3>
        </div>
        ${renderModeWorkflow()}
        <div class="material-switcher" aria-label="选择任务材料">
          ${data.evidenceGroups.map(renderMaterialChoice).join("")}
        </div>
        ${renderActiveMaterial(group)}
      </section>
    `;
  }

  function renderModeWorkflow() {
    const classroom = state.mode === "classroom";
    const title = classroom ? "课堂流程" : "自学流程";
    const text = classroom
      ? "个人先判断，小组分工查看一类材料，再把各组发现合并为课堂汇报，最后根据教师讲评修正结论。"
      : "先读任务，再按材料逐项阅读；每完成一类材料就自检一次，最后用句式支架完成独立作答。";
    return `
      <div id="modeWorkflow" class="mode-workflow ${escapeHtml(state.mode)}">
        <strong>${title}</strong>
        <p>${escapeHtml(text)}</p>
      </div>
    `;
  }

  function renderMaterialChoice(group, index) {
    const selectedCount = group.items.filter((item) => state.selectedEvidence.includes(item.id)).length;
    const active = activeGroup().id === group.id;
    const modeLabel = state.mode === "self" ? `自学第${index + 1}步` : `第${index + 1}组材料`;
    return `
      <button type="button" class="material-choice ${active ? "active" : ""}" data-group-id="${escapeHtml(group.id)}">
        <span>${escapeHtml(modeLabel)}</span>
        <strong>${escapeHtml(group.studentTitle)}</strong>
        <em>${selectedCount}/${group.items.length} 已加入</em>
      </button>
    `;
  }

  function renderActiveMaterial(group) {
    const selectedCount = group.items.filter((item) => state.selectedEvidence.includes(item.id)).length;
    const modeTaskTitle = state.mode === "self" ? "自学读法" : "课堂任务";
    const modeTask = state.mode === "self" ? group.selfStudyTask : group.classroomTask;
    const segment = segmentById(group.segmentId);
    return `
      <article class="material-detail" data-group="${escapeHtml(group.id)}">
        <div class="active-material-head">
          <div>
            <p class="eyebrow">${escapeHtml(group.title)}</p>
            <h4 id="activeMaterialTitle">${escapeHtml(group.studentTitle)}</h4>
            <p>${escapeHtml(group.summary)}</p>
          </div>
          <span class="count">${selectedCount}/${group.items.length} 已加入</span>
        </div>
        <div class="reading-steps">
          <strong>读数据顺序</strong>
          <ol>${group.readingSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        </div>
        <div id="activeMaterialModeTask" class="mode-task ${escapeHtml(state.mode)}">
          <strong>${modeTaskTitle}</strong>
          <p>${escapeHtml(modeTask)}</p>
        </div>
        ${segment?.table ? renderDataTable(segment.table) : ""}
        <div class="data-points">
          ${group.items.map((item) => renderEvidenceItem(item)).join("")}
        </div>
        ${segment?.modelSentence ? `<blockquote class="model-sentence">${escapeHtml(segment.modelSentence)}</blockquote>` : ""}
        <div class="card-actions">
          <button type="button" class="ghost-button open-resource" data-resource-id="${escapeHtml(group.resourceId)}">查看相关知识</button>
          <button type="button" class="ghost-button focus-node" data-node-id="${escapeHtml(group.node)}">看它在哪一步</button>
        </div>
      </article>
    `;
  }

  function renderEvidenceItem(item) {
    const selected = state.selectedEvidence.includes(item.id);
    return `
      <div class="data-point ${selected ? "selected" : ""}">
        <strong>${escapeHtml(item.label)}</strong>
        <p><span>能支持：</span>${escapeHtml(item.supports)}</p>
        <p><span>不能说明：</span>${escapeHtml(item.limits)}</p>
        <p class="audit-line">${escapeHtml(item.auditStatus)}</p>
        <button type="button" class="small-button add-evidence" data-evidence-id="${escapeHtml(item.id)}">
          ${selected ? "已加入我的判断依据" : "加入我的判断依据"}
        </button>
      </div>
    `;
  }

  function renderLearningRecord() {
    const records = state.selectedEvidence.map(evidenceById).filter(Boolean);
    const groups = selectedGroups();
    const missing = data.evidenceGroups.filter((group) => !groups.includes(group.id));
    const status = buildConclusionStatus(groups);
    return `
      <div class="section-head">
        <p class="eyebrow">学习记录</p>
        <h3>我的判断依据</h3>
      </div>
      <section class="record-block">
        <h4>我的初步判断</h4>
        <p>${escapeHtml(state.initial.status || "尚未选择")}</p>
        <p>${escapeHtml(state.initial.firstReason || "还没有写第一理由。")}</p>
      </section>
      <section class="record-block">
        <h4>我已查看的数据</h4>
        <ul id="selectedEvidenceList" class="record-list">
          ${records.length ? records.map(({ group, item }) => `<li><span>${escapeHtml(group.title)}</span>${escapeHtml(item.label)}</li>`).join("") : "<li>还没有加入数据。</li>"}
        </ul>
      </section>
      <section class="record-block">
        <h4>还缺少的数据</h4>
        <ul class="record-list missing-list">
          ${missing.length ? missing.map((group) => `<li>${escapeHtml(group.studentTitle)}</li>`).join("") : "<li>四类材料都已查看。</li>"}
        </ul>
      </section>
      <section class="record-block status-block ${status.kind}">
        <h4>结论准备状态</h4>
        <p id="conclusionState">${escapeHtml(status.text)}</p>
      </section>
      ${renderModeRecord()}
      <button id="openFeedbackResource" type="button" class="secondary-action" data-resource-id="R-FEEDBACK">提交前检查</button>
    `;
  }

  function renderModeRecord() {
    const guide = currentModeGuide();
    return `
      <section id="modeRecord" class="record-block mode-record ${escapeHtml(state.mode)}">
        <h4>${escapeHtml(guide.recordTitle)}</h4>
        <ul class="record-list">
          ${guide.recordChecks.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </section>
    `;
  }

  function buildConclusionStatus(groups) {
    if (groups.length === 0) {
      return { kind: "waiting", text: "先查看材料，再写结论。" };
    }
    if (groups.length === 1 && groups.includes("coverage")) {
      return { kind: "warn", text: "你的判断还缺少业务体验或移动保持材料，不能只凭覆盖数据下最终结论。" };
    }
    if (groups.length < data.conclusionTemplate.minimumEvidenceCount) {
      return { kind: "warn", text: "至少还需要补充一类材料，结论才更稳。" };
    }
    if (!groups.includes("performance")) {
      return { kind: "warn", text: "还需要查看业务体验数据，才能判断用户感知是否恢复。" };
    }
    return { kind: "ready", text: "可以开始写结论，但仍要说明数据边界和后续建议。" };
  }

  function renderConclusionEditor() {
    const conclusion = state.conclusion;
    return `
      <section id="conclusionPanel" class="conclusion-panel" aria-label="结论编辑器">
        <div class="section-head">
          <p class="eyebrow">结论任务</p>
          <h3>完成一份短结论</h3>
        </div>
        ${renderWritingGuide()}
        <div class="form-grid">
          <label>
            判断状态
            <select id="resultStatus">
              <option value="">请选择</option>
              ${data.conclusionTemplate.statusOptions.map((item) => `<option value="${escapeHtml(item)}" ${conclusion.status === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}
            </select>
          </label>
          <label>
            还需补充查看
            <textarea id="missingData" rows="2" placeholder="例如：晚高峰路测日志、直播上行业务日志、切换成功率。">${escapeHtml(conclusion.missingData || "")}</textarea>
          </label>
        </div>
        <div class="form-grid">
          <label>
            依据1
            <textarea id="evidenceOne" rows="2">${escapeHtml(conclusion.evidenceOne || "")}</textarea>
          </label>
          <label>
            依据1不能说明
            <textarea id="evidenceOneLimit" rows="2">${escapeHtml(conclusion.evidenceOneLimit || "")}</textarea>
          </label>
          <label>
            依据2
            <textarea id="evidenceTwo" rows="2">${escapeHtml(conclusion.evidenceTwo || "")}</textarea>
          </label>
          <label>
            依据2不能说明
            <textarea id="evidenceTwoLimit" rows="2">${escapeHtml(conclusion.evidenceTwoLimit || "")}</textarea>
          </label>
        </div>
        <label>
          最终职业表达
          <textarea id="professionalExpression" rows="5" placeholder="${escapeHtml(data.conclusionTemplate.scaffold)}">${escapeHtml(conclusion.professionalExpression || "")}</textarea>
        </label>
        <div class="conclusion-actions">
          <button id="saveConclusion" type="button" class="secondary-action">保存草稿</button>
          <button id="checkConclusion" type="button" class="primary-action">检查我的结论</button>
        </div>
        <div id="conclusionFeedback" class="feedback-box" hidden></div>
      </section>
    `;
  }

  function renderWritingGuide() {
    const guide = currentModeGuide();
    return `
      <div id="writingGuide" class="writing-guide ${escapeHtml(state.mode)}">
        <strong>${escapeHtml(guide.editorTitle)}</strong>
        <ul>${guide.editorTips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}</ul>
        <p class="scaffold">${escapeHtml(data.conclusionTemplate.scaffold)}</p>
      </div>
    `;
  }

  function bindStudentEvents() {
    $("#classroomMode")?.addEventListener("click", () => setMode("classroom"));
    $("#selfStudyMode")?.addEventListener("click", () => setMode("self"));
    $("#openAbilityMap")?.addEventListener("click", openAbilityMap);

    ["initialStatus", "firstReason", "firstDataToCheck"].forEach((id) => {
      $(`#${id}`)?.addEventListener("input", () => {
        captureInitial();
        save();
      });
    });

    $$(".ability-step").forEach((button) => {
      button.addEventListener("click", () => setActiveNode(button.dataset.nodeId));
    });
    $$(".lesson-tab").forEach((button) => {
      button.addEventListener("click", () => setActiveSegment(button.dataset.segmentId));
    });
    $$(".material-choice, .jump-group").forEach((button) => {
      button.addEventListener("click", () => setActiveGroup(button.dataset.groupId));
    });
    $$(".focus-node").forEach((button) => {
      button.addEventListener("click", () => {
        state.activeNodeId = button.dataset.nodeId;
        openAbilityMap();
      });
    });
    $$(".open-resource, #openFeedbackResource").forEach((button) => {
      button.addEventListener("click", () => openResource(button.dataset.resourceId));
    });
    $$(".add-evidence").forEach((button) => {
      button.addEventListener("click", () => toggleEvidence(button.dataset.evidenceId));
    });
    $("#saveConclusion")?.addEventListener("click", () => {
      captureConclusion();
      showFeedback(["草稿已保存。你可以继续补充判断依据或修改职业表达。"], "ready");
    });
    $("#checkConclusion")?.addEventListener("click", checkConclusion);
    ["resultStatus", "missingData", "evidenceOne", "evidenceOneLimit", "evidenceTwo", "evidenceTwoLimit", "professionalExpression"].forEach((id) => {
      $(`#${id}`)?.addEventListener("input", () => {
        captureConclusion();
        save();
      });
    });
  }

  function captureInitial() {
    state.initial = {
      status: $("#initialStatus")?.value || "",
      firstReason: $("#firstReason")?.value.trim() || "",
      firstDataToCheck: $("#firstDataToCheck")?.value.trim() || ""
    };
  }

  function setMode(mode) {
    state.mode = mode;
    save();
    renderStudentView();
  }

  function setActiveNode(id) {
    const node = nodeById(id);
    if (!node) return;
    state.activeNodeId = id;
    state.activeSegmentId = node.segmentId || state.activeSegmentId;
    if (node.evidenceGroups?.length) {
      state.activeGroupId = node.evidenceGroups[0];
    }
    save();
    renderStudentView();
    requestAnimationFrame(() => {
      const target = id === "conclusion" ? $("#conclusionPanel") : $(`#${node.segmentId}`) || $("#materialWorkbench");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function setActiveGroup(id) {
    const group = groupById(id);
    if (!group) return;
    state.activeGroupId = id;
    state.activeNodeId = group.node;
    state.activeSegmentId = group.segmentId || state.activeSegmentId;
    save();
    renderStudentView();
    requestAnimationFrame(() => {
      $("#materialWorkbench")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function setActiveSegment(id) {
    const segment = segmentById(id);
    if (!segment) return;
    state.activeSegmentId = id;
    if (segment.nodeId) state.activeNodeId = segment.nodeId;
    if (segment.groupId) state.activeGroupId = segment.groupId;
    save();
    renderStudentView();
    requestAnimationFrame(() => {
      $("#lessonFlow")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function toggleEvidence(id) {
    if (state.selectedEvidence.includes(id)) {
      state.selectedEvidence = state.selectedEvidence.filter((entry) => entry !== id);
    } else {
      state.selectedEvidence.push(id);
    }
    save();
    renderStudentView();
  }

  function captureConclusion() {
    state.conclusion = {
      status: $("#resultStatus")?.value || "",
      missingData: $("#missingData")?.value.trim() || "",
      evidenceOne: $("#evidenceOne")?.value.trim() || "",
      evidenceOneLimit: $("#evidenceOneLimit")?.value.trim() || "",
      evidenceTwo: $("#evidenceTwo")?.value.trim() || "",
      evidenceTwoLimit: $("#evidenceTwoLimit")?.value.trim() || "",
      professionalExpression: $("#professionalExpression")?.value.trim() || ""
    };
  }

  function checkConclusion() {
    captureConclusion();
    const groups = selectedGroups();
    const messages = [];
    if (!state.initial.status) {
      messages.push("请先完成初步判断。这样才能看出你是否根据数据修正了原来的想法。");
    }
    if (groups.length < data.conclusionTemplate.minimumEvidenceCount) {
      messages.push("请至少加入两类数据。只看一类材料，结论还不够稳。");
    }
    if (groups.length === 1 && groups.includes("coverage")) {
      messages.push("不能只凭覆盖数据判断最终达标，还需要查看业务体验或移动保持材料。");
    }
    if (!groups.includes("performance")) {
      messages.push("请补充业务体验数据。用户是否恢复，不能只由无线覆盖指标决定。");
    }
    if (state.conclusion.status === "达标") {
      messages.push("当前材料中仍有直播上行95分位时延、卡顿次数或阈值口径待复核，直接写达标风险较高。");
    }
    if (!state.conclusion.evidenceOne || !state.conclusion.evidenceTwo) {
      messages.push("请写出两条依据，不能只写一条总判断。");
    }
    if (!state.conclusion.evidenceOneLimit || !state.conclusion.evidenceTwoLimit) {
      messages.push("每条依据后都要写清它还不能说明什么。");
    }
    if (!state.conclusion.missingData) {
      messages.push("请写至少一条还需补充查看的数据，例如真实路测日志、晚高峰负荷或直播上行指标。");
    }
    if ((state.conclusion.professionalExpression || "").length < 60) {
      messages.push("最终职业表达还偏短。请把判断状态、依据、边界和后续建议写成完整句子。");
    }
    if (messages.length === 0) {
      messages.push("这份结论已经包含初判、两类以上数据、判断边界和后续建议。提交前仍需确认专业阈值和运营商口径是否已由教师或行业专家复核。");
    }
    save();
    showFeedback(messages, messages.length === 1 ? "ready" : "warn");
  }

  function showFeedback(messages, kind) {
    const box = $("#conclusionFeedback");
    if (!box) return;
    box.hidden = false;
    box.className = `feedback-box ${kind}`;
    box.innerHTML = `<strong>检查结果</strong><ul>${messages.map((message) => `<li>${escapeHtml(message)}</li>`).join("")}</ul>`;
  }

  function openResource(id) {
    const resource = resourceById(id);
    if (!resource) return;
    state.activeResourceId = id;
    const support = state.mode === "self" ? resource.selfStudySupport : resource.classroomSupport;
    const modeTitle = state.mode === "self" ? "自学帮助" : "课堂提示";
    const drawer = $("#resourceDrawer");
    drawer.hidden = false;
    drawer.innerHTML = `
      <div class="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawerTitle">
        <button type="button" class="icon-button close-drawer" aria-label="关闭资源抽屉">×</button>
        <p class="eyebrow">${escapeHtml(resource.type)}</p>
        <h2 id="drawerTitle">${escapeHtml(resource.title)}</h2>
        <div class="support-box">
          <strong>${modeTitle}</strong>
          <p>${escapeHtml(support)}</p>
        </div>
        <div class="resource-body">
          ${(resource.studentBlocks || []).map((block) => `<p>${escapeHtml(block)}</p>`).join("")}
        </div>
        <p class="drawer-note">${escapeHtml(resource.auditStatus)}。正式发布前需复核专业口径和适用边界。</p>
      </div>
    `;
    $(".close-drawer", drawer)?.addEventListener("click", closeDrawer);
  }

  function closeDrawer() {
    const drawer = $("#resourceDrawer");
    if (!drawer) return;
    drawer.hidden = true;
    drawer.innerHTML = "";
    state.activeResourceId = null;
  }

  function openAbilityMap() {
    const dialog = $("#abilityMapDialog");
    dialog.hidden = false;
    renderAbilityMap();
  }

  function closeAbilityMap() {
    const dialog = $("#abilityMapDialog");
    if (!dialog) return;
    dialog.hidden = true;
    dialog.innerHTML = "";
  }

  function renderAbilityMap() {
    const dialog = $("#abilityMapDialog");
    const active = nodeById(state.activeNodeId) || data.abilityNodes[0];
    dialog.innerHTML = `
      <div class="map-panel" role="dialog" aria-modal="true" aria-labelledby="mapTitle">
        <div class="map-header">
          <div>
            <p class="eyebrow">能力地图</p>
            <h2 id="mapTitle">从任务看能力关系</h2>
          </div>
          <button type="button" class="icon-button close-map" aria-label="关闭能力地图">×</button>
        </div>
        <div class="map-layout">
          <div class="node-grid">
            ${data.abilityNodes.map((node, index) => renderMapNode(node, index)).join("")}
          </div>
          <aside id="nodeDetail" class="node-detail">
            ${renderNodeDetail(active)}
          </aside>
        </div>
      </div>
    `;
    $(".close-map", dialog)?.addEventListener("click", closeAbilityMap);
    $$(".map-node", dialog).forEach((button) => {
      button.addEventListener("click", () => {
        const node = nodeById(button.dataset.nodeId);
        if (!node) return;
        state.activeNodeId = node.id;
        state.activeSegmentId = node.segmentId || state.activeSegmentId;
        if (node.evidenceGroups?.length) state.activeGroupId = node.evidenceGroups[0];
        save();
        renderAbilityMap();
        renderStudentView();
      });
    });
    $$(".node-resource", dialog).forEach((button) => {
      button.addEventListener("click", () => openResource(button.dataset.resourceId));
    });
    $(".node-jump", dialog)?.addEventListener("click", () => {
      const node = nodeById(state.activeNodeId);
      closeAbilityMap();
      requestAnimationFrame(() => {
        const target = node?.segmentId ? $(`#${node.segmentId}`) : $("#materialWorkbench");
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function renderMapNode(node, index) {
    const selected = state.activeNodeId === node.id;
    const relatedCount = node.resources.length + node.evidenceGroups.length;
    return `
      <button type="button" class="map-node ${selected ? "active" : ""}" data-node-id="${escapeHtml(node.id)}">
        <span class="step-index">${index + 1}</span>
        <span>
          <strong>${escapeHtml(node.studentLabel)}</strong>
          <em>${relatedCount}项相关内容</em>
        </span>
      </button>
    `;
  }

  function renderNodeDetail(node) {
    const previous = node.previous.map((id) => nodeById(id)?.studentLabel).filter(Boolean).join("、") || "无";
    const next = node.next.map((id) => nodeById(id)?.studentLabel).filter(Boolean).join("、") || "无";
    const groupLinks = node.evidenceGroups.map(groupById).filter(Boolean);
    const segment = segmentById(node.segmentId);
    return `
      <h3>${escapeHtml(node.studentLabel)}</h3>
      <dl>
        <dt>这个知识点解决什么问题</dt>
        <dd>${escapeHtml(node.purpose)}</dd>
        <dt>学完后你应该能做什么</dt>
        <dd>${escapeHtml(node.outcome)}</dd>
        <dt>对应正文</dt>
        <dd>${escapeHtml(segment?.title || "任务正文")}</dd>
        <dt>前一步</dt>
        <dd>${escapeHtml(previous)}</dd>
        <dt>下一步</dt>
        <dd>${escapeHtml(next)}</dd>
      </dl>
      <div class="node-section">
        <h4>相关材料</h4>
        ${groupLinks.length ? groupLinks.map((group) => `<p>${escapeHtml(group.studentTitle)}：${escapeHtml(group.summary)}</p>`).join("") : "<p>本节点主要用于理解任务。</p>"}
      </div>
      <div class="node-section">
        <h4>相关知识资源</h4>
        ${node.resources.map((id) => {
          const resource = resourceById(id);
          return resource ? `<button type="button" class="link-button node-resource" data-resource-id="${escapeHtml(id)}">${escapeHtml(resource.title)}</button>` : "";
        }).join("")}
      </div>
      <button type="button" class="primary-action node-jump">跳到对应正文</button>
    `;
  }

  function renderTeacherView() {
    const teacher = data.teacherPanel;
    $("#teacherView").innerHTML = `
      <div class="teacher-shell">
        <section class="task-band compact">
          <div>
            <p class="eyebrow">教师讲评</p>
            <h2>课堂组织与学情观察</h2>
            <p>${escapeHtml(teacher.notice)}</p>
          </div>
        </section>
        <div class="teacher-grid">
          ${renderTeacherBlock("教学目标", teacher.goals)}
          ${renderTeacherBlock("课堂停顿点", teacher.pausePoints)}
          ${renderTeacherBlock("小组分工", teacher.groups)}
          ${renderTeacherBlock("常见错误", teacher.mistakes)}
          ${renderTeacherBlock("讲评追问", teacher.questions)}
        </div>
      </div>
    `;
  }

  function renderTeacherBlock(title, items) {
    return `
      <article class="teacher-block">
        <h3>${escapeHtml(title)}</h3>
        <ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </article>
    `;
  }

  function renderAuditView() {
    $("#auditView").innerHTML = `
      <div class="audit-shell">
        <section class="task-band compact">
          <div>
            <p class="eyebrow">编辑审核</p>
            <h2>来源、复核与媒体处理状态</h2>
            <p>学生端不直接暴露来源层级和后台字段；教师/编辑层负责确认来源、审核状态和发布风险。</p>
          </div>
        </section>
        <section class="audit-section">
          <h3>来源层级</h3>
          <div class="source-grid">
            ${data.sourceLayers.map((layer) => `
              <article>
                <strong>${escapeHtml(layer.code)}. ${escapeHtml(layer.title)}</strong>
                <p>${escapeHtml(layer.note)}</p>
              </article>
            `).join("")}
          </div>
        </section>
        <section class="audit-section">
          <h3>专业复核清单</h3>
          <ul>${data.reviewChecklists.professional.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </section>
        <section class="audit-section">
          <h3>发布前风险清单</h3>
          <ul>${data.reviewChecklists.publish.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </section>
        <div class="audit-table-wrap">
          <table class="audit-table">
            <thead>
              <tr>
                <th>文件</th>
                <th>原用途</th>
                <th>当前问题</th>
                <th>处理建议</th>
                <th>学生主学习区</th>
                <th>审核状态</th>
              </tr>
            </thead>
            <tbody>
              ${data.mediaAudit.map((item) => `
                <tr>
                  <td>${escapeHtml(item.file)}</td>
                  <td>${escapeHtml(item.originalUse)}</td>
                  <td>${escapeHtml(item.currentIssue)}</td>
                  <td>${escapeHtml(item.recommendation)}</td>
                  <td>${escapeHtml(item.studentMainUse)}</td>
                  <td>${escapeHtml(item.auditStatus)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const drawer = $("#resourceDrawer");
    const map = $("#abilityMapDialog");
    if (drawer && drawer.hidden === false) {
      closeDrawer();
    } else if (map && map.hidden === false) {
      closeAbilityMap();
    }
  });

  render();
})();
