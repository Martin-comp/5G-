(function () {
  const data = window.P4T2_GUIDED;
  const storageKey = "p4t2_guided_3_3_state";
  const state = readState();

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function readState() {
    try {
      return {
        mode: "self",
        step: 0,
        answers: {},
        builder: [],
        ...JSON.parse(localStorage.getItem(storageKey) || "{}")
      };
    } catch {
      return { mode: "self", step: 0, answers: {}, builder: [] };
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

  function current() {
    return data.checkpoints[state.step] || data.checkpoints[0];
  }

  function render() {
    renderStudent();
    renderTeacher();
    renderResources();
    bindTabs();
  }

  function bindTabs() {
    $$(".top-tab").forEach((button) => {
      button.onclick = () => {
        $$(".top-tab").forEach((tab) => tab.classList.toggle("active", tab === button));
        $$(".view").forEach((view) => view.classList.remove("active"));
        $(`#${button.dataset.view}View`)?.classList.add("active");
      };
    });
  }

  function renderStudent() {
    const step = current();
    $("#studentView").innerHTML = `
      <div class="student-shell">
        <section class="hero">
          <div>
            <p class="eyebrow">${esc(data.meta.subtitle)}</p>
            <h2>${esc(data.meta.bigQuestion)}</h2>
            <p>${esc(data.meta.promise)}</p>
          </div>
          <div class="hero-actions">
            <div class="mode-toggle" aria-label="学习模式">
              <button type="button" class="mode-button ${state.mode === "class" ? "active" : ""}" data-mode="class">${esc(data.meta.modes.class)}</button>
              <button type="button" class="mode-button ${state.mode === "self" ? "active" : ""}" data-mode="self">${esc(data.meta.modes.self)}</button>
            </div>
            <button id="openMap" type="button" class="secondary-button">能力地图</button>
          </div>
        </section>

        <section class="progress-panel" aria-label="学习进度">
          ${data.checkpoints.map((item, index) => `
            <button type="button" class="progress-step ${index === state.step ? "active" : ""} ${isComplete(item.id) ? "done" : ""}" data-step="${index}">
              <span>${index + 1}</span>
              <strong>${esc(item.shortTitle)}</strong>
            </button>
          `).join("")}
        </section>

        <section class="learning-layout">
          <article class="guide-card" aria-label="当前学习关卡">
            <p class="eyebrow">第${state.step + 1}关 / ${data.checkpoints.length}</p>
            <h3>${esc(step.title)}</h3>
            <p class="big-question">${esc(step.question)}</p>
            <div class="teacher-line ${esc(state.mode)}">
              <strong>${state.mode === "self" ? "自学跟练" : "教师带学"}</strong>
              <p>${state.mode === "self" ? "按绿色提示一步步完成，不需要先懂全部术语。" : "建议教师先提问，再让学生操作，不要先讲完整理论。"}</p>
            </div>
            <div class="plain-text">
              ${step.plainText.map((text) => `<p>${esc(text)}</p>`).join("")}
            </div>
            ${renderVisual(step)}
            <div class="look-box">
              <strong>先看哪里</strong>
              <p>${esc(step.lookAt)}</p>
            </div>
            ${renderAction(step)}
            <div class="takeaway">
              <strong>这一关你要带走的结论</strong>
              <p>${esc(step.takeaway)}</p>
            </div>
            <div class="nav-row">
              <button id="prevStep" type="button" class="ghost-button" ${state.step === 0 ? "disabled" : ""}>上一关</button>
              <button id="nextStep" type="button" class="primary-button">${state.step === data.checkpoints.length - 1 ? "回到第1关" : "下一关"}</button>
            </div>
          </article>

          <aside class="side-panel" aria-label="学习记录">
            ${renderRecord()}
            ${renderConversion(step)}
          </aside>
        </section>
      </div>
    `;

    bindStudent();
  }

  function renderVisual(step) {
    const visual = step.visual;
    if (visual.type === "complaint-cards") {
      return `
        <div class="complaint-grid" aria-label="投诉现象卡">
          ${visual.items.map((item) => `
            <article class="complaint-card ${esc(item.tone)}">
              <span>${esc(item.label)}</span>
              <strong>${esc(item.value)}</strong>
            </article>
          `).join("")}
        </div>
      `;
    }
    if (visual.type === "match-table") {
      return renderTable(visual.columns, visual.rows, "match-table");
    }
    if (visual.type === "metric-bars") {
      return `
        ${renderTable(visual.columns, visual.rows.map((row) => [row[0], `${row[1]}%`, `${row[2]}%`, row[3]]), "metric-table")}
        <div class="bar-chart" aria-label="覆盖指标前后对比图">
          ${visual.rows.map((row) => renderBarRow(row[0], row[1], row[2], row[0].includes("占比") ? "lower" : "higher")).join("")}
        </div>
      `;
    }
    if (visual.type === "experience-chart") {
      return `
        ${renderTable(visual.columns, visual.rows.map((row) => [row[0], row[1], row[2], row[3]]), "metric-table")}
        <div class="experience-chart" aria-label="业务体验指标对比图">
          ${visual.rows.map((row) => renderExperienceRow(row)).join("")}
        </div>
      `;
    }
    if (visual.type === "sentence-builder") {
      return `
        <div class="builder-cards" aria-label="结论拼句卡片">
          ${visual.cards.map((card) => `
            <button type="button" class="builder-card ${state.builder.includes(card.id) ? "selected" : ""}" data-card-id="${esc(card.id)}">
              <span>${esc(card.group)}</span>
              <strong>${esc(card.text)}</strong>
            </button>
          `).join("")}
        </div>
        <div class="built-sentence">
          <strong>当前拼出的结论</strong>
          <p id="builtSentence">${esc(buildSentence()) || "还没有选择卡片。"}</p>
        </div>
      `;
    }
    return "";
  }

  function renderTable(columns, rows, className) {
    return `
      <div class="table-wrap">
        <table class="${esc(className)}">
          <thead><tr>${columns.map((column) => `<th>${esc(column)}</th>`).join("")}</tr></thead>
          <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>
    `;
  }

  function renderBarRow(label, before, after, direction) {
    const beforeWidth = Math.max(8, before);
    const afterWidth = Math.max(8, after);
    const better = direction === "lower" ? after < before : after > before;
    return `
      <div class="bar-row ${better ? "better" : "warn"}">
        <span>${esc(label)}</span>
        <div class="bar-pair">
          <i style="width:${beforeWidth}%">优化前 ${esc(before)}</i>
          <b style="width:${afterWidth}%">优化后 ${esc(after)}</b>
        </div>
      </div>
    `;
  }

  function renderExperienceRow(row) {
    const [label, before, after, reading] = row;
    const max = Math.max(before, after, 10);
    const beforeWidth = Math.max(8, (before / max) * 100);
    const afterWidth = Math.max(8, (after / max) * 100);
    return `
      <div class="bar-row better">
        <span>${esc(label)}</span>
        <div class="bar-pair reverse">
          <i style="width:${beforeWidth}%">优化前 ${esc(before)}</i>
          <b style="width:${afterWidth}%">优化后 ${esc(after)}</b>
        </div>
        <em>${esc(reading)}</em>
      </div>
    `;
  }

  function renderAction(step) {
    const action = step.action;
    const saved = state.answers[step.id];
    if (action.type === "choice") {
      return `
        <div class="action-box" aria-label="判断题">
          <strong>${esc(action.prompt)}</strong>
          <div class="choice-list">
            ${action.options.map((option) => `
              <button type="button" class="choice-button ${saved === option.id ? "selected" : ""}" data-answer="${esc(option.id)}">${esc(option.label)}</button>
            `).join("")}
          </div>
          ${renderFeedback(step)}
        </div>
      `;
    }
    if (action.type === "multi") {
      const selected = Array.isArray(saved) ? saved : [];
      return `
        <div class="action-box" aria-label="多选题">
          <strong>${esc(action.prompt)}</strong>
          <div class="choice-list">
            ${action.options.map((option) => `
              <button type="button" class="choice-button ${selected.includes(option.id) ? "selected" : ""}" data-answer="${esc(option.id)}">${esc(option.label)}</button>
            `).join("")}
          </div>
          ${renderFeedback(step)}
        </div>
      `;
    }
    if (action.type === "builder") {
      return `
        <div class="action-box" aria-label="结论拼句任务">
          <strong>${esc(action.prompt)}</strong>
          ${renderFeedback(step)}
        </div>
      `;
    }
    return "";
  }

  function renderFeedback(step) {
    const saved = state.answers[step.id];
    if (!saved && step.action.type !== "builder") return `<p class="feedback muted">先做一个判断，系统会马上反馈。</p>`;
    if (step.action.type === "choice") {
      const option = step.action.options.find((item) => item.id === saved);
      return `<p class="feedback ${option?.correct ? "ok" : "warn"}">${esc(option?.feedback || "")}</p>`;
    }
    if (step.action.type === "multi") {
      const selected = Array.isArray(saved) ? saved : [];
      const correctIds = step.action.options.filter((item) => item.correct).map((item) => item.id);
      const ok = correctIds.every((id) => selected.includes(id)) && selected.every((id) => correctIds.includes(id));
      return `<p class="feedback ${ok ? "ok" : "warn"}">${esc(ok ? step.action.feedbackGood : step.action.feedbackBad)}</p>`;
    }
    if (step.action.type === "builder") {
      const hasAll = ["status", "e1", "e2", "limit", "next"].every((id) => state.builder.includes(id));
      return `<p class="feedback ${hasAll ? "ok" : "warn"}">${hasAll ? "结论结构完整：判断、依据、边界、建议都具备。" : "还需要补齐判断、两条依据、边界和建议。"}</p>`;
    }
    return "";
  }

  function renderRecord() {
    const completed = data.checkpoints.filter((item) => isComplete(item.id)).length;
    return `
      <section class="record-card">
        <p class="eyebrow">学习记录</p>
        <h3>现在只看一关</h3>
        <p>已完成 ${completed}/${data.checkpoints.length} 关。</p>
        <ol>
          ${data.checkpoints.map((item, index) => `<li class="${isComplete(item.id) ? "done" : ""}">${index + 1}. ${esc(item.takeaway)}</li>`).join("")}
        </ol>
      </section>
    `;
  }

  function renderConversion(step) {
    return `
      <section class="conversion-card">
        <p class="eyebrow">资源转化位</p>
        <h3>这一关后续可做成</h3>
        <ul>
          ${step.conversion.map((item) => `<li>${esc(item)}</li>`).join("")}
        </ul>
      </section>
    `;
  }

  function isComplete(id) {
    if (id === "conclusion") return ["status", "e1", "e2", "limit", "next"].every((cardId) => state.builder.includes(cardId));
    const checkpoint = data.checkpoints.find((item) => item.id === id);
    if (!checkpoint) return false;
    const saved = state.answers[id];
    if (!saved) return false;
    if (checkpoint.action.type === "choice") {
      return checkpoint.action.options.some((option) => option.id === saved && option.correct);
    }
    if (checkpoint.action.type === "multi") {
      const selected = Array.isArray(saved) ? saved : [];
      const correctIds = checkpoint.action.options.filter((item) => item.correct).map((item) => item.id);
      return correctIds.every((item) => selected.includes(item)) && selected.every((item) => correctIds.includes(item));
    }
    return false;
  }

  function buildSentence() {
    const cards = data.checkpoints.find((item) => item.id === "conclusion").visual.cards;
    return state.builder
      .map((id) => cards.find((card) => card.id === id)?.text)
      .filter(Boolean)
      .join("");
  }

  function bindStudent() {
    $$(".mode-button").forEach((button) => {
      button.onclick = () => {
        state.mode = button.dataset.mode;
        save();
        renderStudent();
      };
    });
    $$(".progress-step").forEach((button) => {
      button.onclick = () => {
        state.step = Number(button.dataset.step);
        save();
        renderStudent();
      };
    });
    $$(".choice-button").forEach((button) => {
      button.onclick = () => {
        const step = current();
        if (step.action.type === "multi") {
          const selected = Array.isArray(state.answers[step.id]) ? [...state.answers[step.id]] : [];
          if (selected.includes(button.dataset.answer)) {
            state.answers[step.id] = selected.filter((id) => id !== button.dataset.answer);
          } else {
            state.answers[step.id] = [...selected, button.dataset.answer];
          }
        } else {
          state.answers[step.id] = button.dataset.answer;
        }
        save();
        renderStudent();
      };
    });
    $$(".builder-card").forEach((button) => {
      button.onclick = () => {
        const id = button.dataset.cardId;
        if (state.builder.includes(id)) {
          state.builder = state.builder.filter((item) => item !== id);
        } else {
          state.builder = [...state.builder, id];
        }
        save();
        renderStudent();
      };
    });
    $("#prevStep")?.addEventListener("click", () => {
      state.step = Math.max(0, state.step - 1);
      save();
      renderStudent();
    });
    $("#nextStep")?.addEventListener("click", () => {
      state.step = state.step === data.checkpoints.length - 1 ? 0 : state.step + 1;
      save();
      renderStudent();
    });
    $("#openMap")?.addEventListener("click", openMap);
  }

  function openMap() {
    const dialog = $("#mapDialog");
    dialog.hidden = false;
    dialog.innerHTML = `
      <div class="map-panel" role="dialog" aria-modal="true" aria-labelledby="mapTitle">
        <div class="map-head">
          <div>
            <p class="eyebrow">能力地图</p>
            <h2 id="mapTitle">这5关分别对应什么能力</h2>
          </div>
          <button type="button" class="icon-button" id="closeMap" aria-label="关闭能力地图">×</button>
        </div>
        <div class="map-list">
          ${data.abilityMap.map((row, index) => `
            <button type="button" class="map-item" data-step="${index}">
              <span>${index + 1}</span>
              <strong>${esc(row[0])}</strong>
              <em>${esc(row[1])}</em>
            </button>
          `).join("")}
        </div>
      </div>
    `;
    $("#closeMap").onclick = closeMap;
    $$(".map-item", dialog).forEach((button) => {
      button.onclick = () => {
        state.step = Number(button.dataset.step);
        save();
        closeMap();
        renderStudent();
      };
    });
  }

  function closeMap() {
    const dialog = $("#mapDialog");
    dialog.hidden = true;
    dialog.innerHTML = "";
  }

  function renderTeacher() {
    $("#teacherView").innerHTML = `
      <div class="support-shell">
        <section class="support-hero">
          <p class="eyebrow">教师带教</p>
          <h2>先让学生做判断，再讲指标</h2>
          <p>3.3的课堂使用重点是控制信息密度：一次只解决一个小问题。</p>
        </section>
        ${renderListBlock("建议流程", data.teacher.flow)}
        ${renderListBlock("评审问题", data.teacher.reviewQuestions)}
        ${renderListBlock("当前风险", data.teacher.risks)}
      </div>
    `;
  }

  function renderResources() {
    $("#resourcesView").innerHTML = `
      <div class="support-shell">
        <section class="support-hero">
          <p class="eyebrow">资源转化</p>
          <h2>表、图、动画、互动、小游戏的转化位</h2>
          <p>3.3先把资源类型放到正确教学位置，后续再逐步生产动画、互动和小游戏。</p>
        </section>
        <div class="resource-grid">
          ${data.checkpoints.map((step, index) => `
            <article class="resource-card">
              <span>第${index + 1}关</span>
              <h3>${esc(step.shortTitle)}</h3>
              <p>${esc(step.question)}</p>
              <ul>${step.conversion.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
            </article>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderListBlock(title, items) {
    return `
      <section class="list-block">
        <h3>${esc(title)}</h3>
        <ol>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ol>
      </section>
    `;
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMap();
  });

  render();
})();
