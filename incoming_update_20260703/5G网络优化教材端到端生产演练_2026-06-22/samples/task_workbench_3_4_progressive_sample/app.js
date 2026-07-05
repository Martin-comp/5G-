(function () {
  const data = window.P4T2_PROGRESSIVE;
  const storageKey = "p4t2_progressive_3_4_state";
  const state = readState();

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function readState() {
    try {
      return {
        view: "student",
        mode: "class",
        caseIndex: 0,
        answers: {},
        selectedEvidence: {},
        ...JSON.parse(localStorage.getItem(storageKey) || "{}")
      };
    } catch {
      return { view: "student", mode: "class", caseIndex: 0, answers: {}, selectedEvidence: {} };
    }
  }

  function save() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function currentCase() {
    return data.cases[state.caseIndex] || data.cases[0];
  }

  function render() {
    renderStudent();
    renderTeacher();
    renderResources();
    renderMap();
    bindTabs();
  }

  function bindTabs() {
    $$(".top-tab").forEach((button) => {
      button.onclick = () => {
        state.view = button.dataset.view;
        save();
        $$(".top-tab").forEach((tab) => tab.classList.toggle("active", tab === button));
        $$(".view").forEach((view) => view.classList.remove("active"));
        $(`#${state.view}View`)?.classList.add("active");
      };
    });
    $$(".top-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === state.view));
    $$(".view").forEach((view) => view.classList.toggle("active", view.id === `${state.view}View`));
  }

  function renderStudent() {
    const item = currentCase();
    $("#studentView").innerHTML = `
      <div class="student-shell">
        <section class="hero">
          <div>
            <p class="eyebrow">${esc(data.meta.subtitle)}</p>
            <h2>${esc(data.meta.bigQuestion)}</h2>
            <p>${esc(data.meta.promise)}</p>
            <strong class="simulation-note">${esc(data.meta.simulationNote)}</strong>
          </div>
          <div class="hero-actions">
            <div class="mode-toggle" aria-label="学习模式">
              <button type="button" class="mode-button ${state.mode === "class" ? "active" : ""}" data-mode="class">${esc(data.meta.modes.class)}</button>
              <button type="button" class="mode-button ${state.mode === "self" ? "active" : ""}" data-mode="self">${esc(data.meta.modes.self)}</button>
            </div>
            <button id="openMap" type="button" class="secondary-button">能力地图</button>
          </div>
        </section>

        <section class="lesson-board" aria-label="课堂流程">
          ${data.lessonFlow.map((step) => `
            <article class="lesson-step">
              <span>${esc(step.label)}</span>
              <strong>${esc(step.minutes)}</strong>
              <p>${esc(step.text)}</p>
            </article>
          `).join("")}
        </section>

        <section class="case-rail" aria-label="案例递进轴">
          ${data.cases.map((caseItem, index) => `
            <button type="button" class="case-tab ${index === state.caseIndex ? "active" : ""} ${isDone(caseItem.id) ? "done" : ""}" data-case-index="${index}">
              <small>${esc(caseItem.stage)}</small>
              <strong>${esc(caseItem.shortTitle)}</strong>
            </button>
          `).join("")}
        </section>

        <section class="learning-layout">
          <article class="case-card" aria-label="当前案例">
            <div class="case-head">
              <div>
                <p class="eyebrow">${esc(item.stage)} / ${state.caseIndex + 1} of ${data.cases.length}</p>
                <h3>${esc(item.title)}</h3>
                <p class="task-line">${esc(item.task)}</p>
              </div>
              <div class="focus-tags">
                ${item.focus.map((tag) => `<span>${esc(tag)}</span>`).join("")}
              </div>
            </div>

            <div class="guide-line ${esc(state.mode)}">
              <strong>${state.mode === "class" ? "课堂带学" : "自学跟练"}</strong>
              <p>${esc(item.guidance[state.mode])}</p>
            </div>

            <div class="scenario">
              ${item.scenario.map((text) => `<p>${esc(text)}</p>`).join("")}
            </div>

            ${renderMetrics(item)}
            ${renderAction(item)}
            ${renderConclusion(item)}

            <div class="case-nav">
              <button id="prevCase" type="button" class="ghost-button" ${state.caseIndex === 0 ? "disabled" : ""}>上一例</button>
              <button id="nextCase" type="button" class="primary-button">${state.caseIndex === data.cases.length - 1 ? "回到入门样例" : "下一例"}</button>
            </div>
          </article>

          <aside class="side-panel" aria-label="学习侧栏">
            ${renderProgress()}
            ${renderCasePurpose(item)}
            ${renderSourceNote()}
          </aside>
        </section>
      </div>
    `;
    bindStudent();
  }

  function renderMetrics(item) {
    const groups = Array.from(new Set(item.metrics.map((metric) => metric.group)));
    return `
      <section class="metric-zone" aria-label="案例指标">
        <div class="metric-summary">
          ${groups.map((group) => {
            const metrics = item.metrics.filter((metric) => metric.group === group);
            const ok = metrics.filter((metric) => metric.result === "达标").length;
            return `
              <article class="group-card">
                <span>${esc(group)}</span>
                <strong>${ok}/${metrics.length}</strong>
                <p>${ok === metrics.length ? "本组达标" : "本组存在边界"}</p>
              </article>
            `;
          }).join("")}
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>类别</th><th>指标</th><th>本课目标</th><th>优化前</th><th>优化后</th><th>判断</th><th>读法</th></tr>
            </thead>
            <tbody>
              ${item.metrics.map((metric) => `
                <tr>
                  <td>${esc(metric.group)}</td>
                  <td>${esc(metric.name)}</td>
                  <td>${esc(metric.target)}</td>
                  <td>${esc(metric.before)}</td>
                  <td>${esc(metric.after)}</td>
                  <td><span class="status ${metric.result === "达标" ? "ok" : "warn"}">${esc(metric.result)}</span></td>
                  <td>${esc(metric.reading)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <div class="metric-bars">
          ${item.metrics.map((metric) => renderMetricBar(metric)).join("")}
        </div>
      </section>
    `;
  }

  function renderMetricBar(metric) {
    const pass = metric.result === "达标";
    return `
      <div class="metric-bar ${pass ? "ok" : "warn"}">
        <div>
          <strong>${esc(metric.name)}</strong>
          <span>${esc(metric.after)} / 目标 ${esc(metric.target)}</span>
        </div>
        <i><b style="width:${pass ? "86" : "56"}%"></b></i>
        <em>${pass ? "可作依据" : "必须写边界"}</em>
      </div>
    `;
  }

  function renderAction(item) {
    const action = item.action;
    const saved = state.answers[item.id];
    const selected = state.selectedEvidence[item.id] || [];
    if (action.multi) {
      return `
        <section class="action-box" aria-label="依据选择">
          <strong>${esc(action.prompt)}</strong>
          <div class="choice-list">
            ${action.options.map((option) => `
              <button type="button" class="choice-button ${selected.includes(option.id) ? "selected" : ""}" data-evidence="${esc(option.id)}">
                ${esc(option.label)}
              </button>
            `).join("")}
          </div>
          <button id="checkEvidence" type="button" class="primary-button small">检查我的选择</button>
          ${renderFeedback(item)}
        </section>
      `;
    }
    return `
      <section class="action-box" aria-label="判断题">
        <strong>${esc(action.prompt)}</strong>
        <div class="choice-list">
          ${action.options.map((option) => `
            <button type="button" class="choice-button ${saved === option.id ? "selected" : ""}" data-answer="${esc(option.id)}">${esc(option.label)}</button>
          `).join("")}
        </div>
        ${renderFeedback(item)}
      </section>
    `;
  }

  function renderFeedback(item) {
    const action = item.action;
    if (action.multi) {
      const selected = state.selectedEvidence[item.id] || [];
      if (!state.answers[item.id]) {
        return `<p class="hint">先选择三条依据或边界，再检查。</p>`;
      }
      const correct = action.options.filter((option) => option.correct).map((option) => option.id).sort().join(",");
      const current = selected.slice().sort().join(",");
      return `<p class="feedback ${correct === current ? "good" : "bad"}">${correct === current ? "选择完整。你已经抓住了通过依据和必须写出的边界。" : "还不完整。请同时选择能支持通过的依据和必须保留的边界。"}</p>`;
    }
    const saved = state.answers[item.id];
    if (!saved) return `<p class="hint">先做判断，系统会给出反馈。</p>`;
    const option = action.options.find((entry) => entry.id === saved);
    return `<p class="feedback ${option?.correct ? "good" : "bad"}">${esc(option?.feedback || "")}</p>`;
  }

  function renderConclusion(item) {
    const conclusion = item.conclusion;
    const answered = Boolean(state.answers[item.id]);
    const text = [
      conclusion.judgement,
      conclusion.evidence.join(""),
      conclusion.boundary,
      conclusion.next
    ].join("");
    return `
      <section class="conclusion-box" aria-label="结论结构">
        <h4>把案例写成职业结论</h4>
        <div class="conclusion-grid">
          <article><span>判断</span><p>${esc(conclusion.judgement)}</p></article>
          <article><span>依据</span><p>${conclusion.evidence.map((line) => esc(line)).join("<br>")}</p></article>
          <article><span>边界</span><p>${esc(conclusion.boundary)}</p></article>
          <article><span>建议</span><p>${esc(conclusion.next)}</p></article>
        </div>
        <div class="generated-answer ${answered ? "show" : ""}">
          <strong>${answered ? "当前可提交参考结论" : "做完互动后显示参考结论"}</strong>
          <p>${answered ? esc(text) : "先完成上面的判断或依据选择。"}</p>
        </div>
      </section>
    `;
  }

  function renderProgress() {
    const done = data.cases.filter((item) => isDone(item.id)).length;
    return `
      <section class="side-card">
        <p class="eyebrow">学习记录</p>
        <h4>已完成 ${done}/${data.cases.length} 个案例</h4>
        <ol class="record-list">
          ${data.cases.map((item) => `<li class="${isDone(item.id) ? "done" : ""}">${esc(item.stage)}：${esc(item.shortTitle)}</li>`).join("")}
        </ol>
      </section>
    `;
  }

  function renderCasePurpose(item) {
    return `
      <section class="side-card">
        <p class="eyebrow">这一例训练什么</p>
        <h4>${esc(item.task)}</h4>
        <ul>
          ${item.ability.map((ability) => `<li>${esc(ability)}</li>`).join("")}
        </ul>
      </section>
    `;
  }

  function renderSourceNote() {
    return `
      <section class="side-card subtle">
        <p class="eyebrow">来源边界</p>
        <p>案例为教学模拟。指标组织参考公开规范方向和本任务已有材料，正式教材需专业教师复核阈值。</p>
      </section>
    `;
  }

  function renderTeacher() {
    $("#teacherView").innerHTML = `
      <section class="teacher-shell">
        <div class="section-head">
          <p class="eyebrow">教师带教</p>
          <h2>用5个案例完成一节课，而不是一个案例讲到底</h2>
          <p>教师页用于组织课堂、观察误区和讲评独立实践，不进入学生主学习路径。</p>
        </div>
        <div class="teacher-grid">
          <article class="teacher-card wide">
            <h3>课堂流程</h3>
            <ol>${data.teacher.flow.map((line) => `<li>${esc(line)}</li>`).join("")}</ol>
          </article>
          <article class="teacher-card">
            <h3>小组分工</h3>
            <ul>${data.teacher.groupWork.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
          </article>
          <article class="teacher-card">
            <h3>讲评问题</h3>
            <ul>${data.teacher.reviewQuestions.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
          </article>
          <article class="teacher-card wide">
            <h3>专业复核风险</h3>
            <ul>${data.teacher.risks.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
          </article>
        </div>
      </section>
    `;
  }

  function renderResources() {
    $("#resourcesView").innerHTML = `
      <section class="resources-shell">
        <div class="section-head">
          <p class="eyebrow">资源转化</p>
          <h2>把每个案例转成表、图、动画、互动和小游戏</h2>
          <p>本页只标出转化方向。正式资源要逐项制作和审核。</p>
        </div>
        <div class="resource-grid">
          ${data.cases.map((item) => `
            <article class="resource-card">
              <span>${esc(item.stage)}</span>
              <h3>${esc(item.shortTitle)}</h3>
              <p>${esc(item.task)}</p>
              <div>${item.conversions.map((entry) => `<b>${esc(entry)}</b>`).join("")}</div>
            </article>
          `).join("")}
        </div>
        <section class="source-panel">
          <h3>依据与边界</h3>
          <div class="source-list">
            ${data.sources.map((source) => `
              <article>
                <strong>${esc(source.name)}</strong>
                <p>${esc(source.desc)}</p>
                <small>${esc(source.url)}</small>
              </article>
            `).join("")}
          </div>
        </section>
      </section>
    `;
  }

  function renderMap() {
    $("#mapBody").innerHTML = data.abilityMap.map((node, index) => `
      <button type="button" class="map-item" data-case-id="${esc(node.caseId)}">
        <span>${index + 1}</span>
        <strong>${esc(node.label)}</strong>
        <p>${esc(node.desc)}</p>
      </button>
    `).join("");
  }

  function bindStudent() {
    $$(".mode-button").forEach((button) => {
      button.onclick = () => {
        state.mode = button.dataset.mode;
        save();
        render();
      };
    });
    $$(".case-tab").forEach((button) => {
      button.onclick = () => {
        state.caseIndex = Number(button.dataset.caseIndex);
        save();
        render();
      };
    });
    $$(".choice-button[data-answer]").forEach((button) => {
      button.onclick = () => {
        state.answers[currentCase().id] = button.dataset.answer;
        save();
        render();
      };
    });
    $$(".choice-button[data-evidence]").forEach((button) => {
      button.onclick = () => {
        const item = currentCase();
        const list = state.selectedEvidence[item.id] || [];
        const id = button.dataset.evidence;
        state.selectedEvidence[item.id] = list.includes(id) ? list.filter((entry) => entry !== id) : [...list, id];
        save();
        render();
      };
    });
    $("#checkEvidence")?.addEventListener("click", () => {
      state.answers[currentCase().id] = "checked";
      save();
      render();
    });
    $("#prevCase")?.addEventListener("click", () => {
      state.caseIndex = Math.max(0, state.caseIndex - 1);
      save();
      render();
    });
    $("#nextCase")?.addEventListener("click", () => {
      state.caseIndex = state.caseIndex === data.cases.length - 1 ? 0 : state.caseIndex + 1;
      save();
      render();
    });
    $("#openMap")?.addEventListener("click", () => $("#mapDialog").showModal());
  }

  function isDone(caseId) {
    return Boolean(state.answers[caseId]);
  }

  $("#closeMap").addEventListener("click", () => $("#mapDialog").close());
  $("#mapBody").addEventListener("click", (event) => {
    const target = event.target.closest(".map-item");
    if (!target) return;
    const index = data.cases.findIndex((item) => item.id === target.dataset.caseId);
    if (index >= 0) {
      state.caseIndex = index;
      state.view = "student";
      save();
      $("#mapDialog").close();
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  render();
})();
