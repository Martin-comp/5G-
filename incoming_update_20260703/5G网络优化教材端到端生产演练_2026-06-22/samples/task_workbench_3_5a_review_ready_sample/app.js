(function () {
  const data = window.P4T2_GRAPH_DRIVEN;
  const storageKey = "p4t2_graph_driven_3_5a_state";
  const state = readState();

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function readState() {
    try {
      return {
        view: "student",
        mode: "class",
        caseIndex: 0,
        selectedGraphNodeId: "P4T2-N01",
        glossaryQuery: "",
        activities: {},
        ...JSON.parse(localStorage.getItem(storageKey) || "{}")
      };
    } catch {
      return { view: "student", mode: "class", caseIndex: 0, selectedGraphNodeId: "P4T2-N01", glossaryQuery: "", activities: {} };
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

  function currentActivityState(item = currentCase()) {
    if (!state.activities[item.id]) state.activities[item.id] = {};
    return state.activities[item.id];
  }

  function taskNodeById(id) {
    return data.courseGraph.taskNodes.find((node) => node.id === id);
  }

  function graphNodeById(id) {
    return taskNodeById(id) || data.courseGraph.courseChain.find((node) => node.id === id);
  }

  function scrollToElement(selector) {
    window.requestAnimationFrame(() => {
      document.querySelector(selector)?.scrollIntoView({ block: "start" });
    });
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
            <button id="openMap" type="button" class="secondary-button">课程能力图谱</button>
          </div>
        </section>

        ${renderLearningEntry()}

        <section class="lesson-board" aria-label="学习流程">
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
            <button type="button" class="case-tab ${index === state.caseIndex ? "active" : ""} ${isDone(caseItem) ? "done" : ""}" data-case-index="${index}">
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
                <p class="completion-standard"><b>完成标准：</b>${esc(item.completionStandard)}</p>
              </div>
              <div class="focus-tags">
                ${item.focus.map((tag) => `<span>${esc(tag)}</span>`).join("")}
              </div>
            </div>

            ${renderGraphContext(item)}
            ${renderModeSupport(item)}

            <div class="scenario">
              ${item.scenario.map((text) => `<p>${esc(text)}</p>`).join("")}
            </div>

            ${renderMetrics(item)}
            ${renderActivity(item)}
            ${renderConclusion(item)}
            ${renderLearningSheet(item)}

            <div class="case-nav">
              <button id="prevCase" type="button" class="ghost-button" ${state.caseIndex === 0 ? "disabled" : ""}>上一例</button>
              <button id="nextCase" type="button" class="primary-button">${state.caseIndex === data.cases.length - 1 ? "回到入门样例" : "下一例"}</button>
            </div>
          </article>

          <aside class="side-panel" aria-label="学习侧栏">
            ${renderProgress()}
            ${renderCasePurpose(item)}
            ${renderGlossary()}
            ${renderSourceNote()}
          </aside>
        </section>
      </div>
    `;
    bindStudent();
  }

  function renderLearningEntry() {
    const entry = data.learningEntry;
    return `
      <section class="learning-entry" aria-label="学习入口">
        <article>
          <span>第一步</span>
          <strong>${esc(entry.firstStep)}</strong>
        </article>
        <article>
          <span>本节产出</span>
          <strong>${esc(entry.output)}</strong>
        </article>
        <article>
          <span>完成标准</span>
          <strong>${esc(entry.standard)}</strong>
        </article>
        <article>
          <span>最终提交</span>
          <strong>${esc(entry.finalOutput)}</strong>
        </article>
      </section>
    `;
  }

  function renderGraphContext(item) {
    const nodes = item.graphNodeIds.map(taskNodeById).filter(Boolean);
    return `
      <section class="graph-context">
        <div>
          <p class="eyebrow">当前课程能力图谱位置</p>
          <h4>${nodes.map((node) => `我正在练：${esc(node.label)}`).join(" / ")}</h4>
          <p>这些不是后台标签，而是在告诉你本例为什么这样练、练完后能做什么。点击图谱可查看学习前后关系和相关材料。</p>
        </div>
        <button type="button" class="secondary-button small-map" id="openMapInline">查看节点</button>
      </section>
    `;
  }

  function renderModeSupport(item) {
    const support = item.modeSupport[state.mode];
    const isClass = state.mode === "class";
    return `
      <section class="mode-panel ${isClass ? "class-mode" : "self-mode"}">
        <div>
          <strong>${esc(support.title)}</strong>
          <p>${esc(support.callout || "")}</p>
        </div>
        <ol>${support.steps.map((line) => `<li>${esc(line)}</li>`).join("")}</ol>
        ${isClass ? "" : `
          <div class="self-support-grid">
            <article>
              <span>术语小卡</span>
              <ul>${support.terms.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
            </article>
            <article>
              <span>提交前自查</span>
              <ul>${support.checklist.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
            </article>
          </div>
        `}
      </section>
    `;
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
                <tr data-metric-row="${esc(metric.id)}">
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

  function renderActivity(item) {
    const activity = item.activity;
    const body = {
      "complaint-sort": renderComplaintSort,
      sequence: renderSequence,
      "metric-mark": renderMetricMark,
      "evidence-sort": renderEvidenceSort,
      compose: renderCompose
    }[activity.type](item);

    return `
      <section class="activity-box" aria-label="学习活动">
        <p class="eyebrow">学习活动：${esc(activity.title)}</p>
        <h4>${esc(activity.instruction)}</h4>
        ${body}
      </section>
    `;
  }

  function renderComplaintSort(item) {
    const store = currentActivityState(item);
    const sorts = store.sorts || {};
    return `
      <div class="activity-list">
        ${item.activity.items.map((entry) => `
          <article class="activity-item">
            <strong>${esc(entry.text)}</strong>
            <div class="mini-actions">
              ${item.activity.categories.map((cat) => `
                <button type="button" class="mini-button ${sorts[entry.id] === cat.id ? "selected" : ""}" data-sort-id="${esc(entry.id)}" data-sort-category="${esc(cat.id)}">${esc(cat.label)}</button>
              `).join("")}
            </div>
          </article>
        `).join("")}
      </div>
      <button id="checkActivity" type="button" class="primary-button small">检查归类</button>
      ${renderActivityFeedback(item)}
    `;
  }

  function renderSequence(item) {
    const store = currentActivityState(item);
    const order = store.order || [];
    const selected = new Set(order);
    return `
      <div class="sequence-board">
        <div>
          <span>待选择步骤</span>
          ${item.activity.steps.map((step) => `
            <button type="button" class="sequence-step" data-step-id="${esc(step.id)}" ${selected.has(step.id) ? "disabled" : ""}>${esc(step.text)}</button>
          `).join("")}
        </div>
        <div>
          <span>我的验证顺序</span>
          <ol class="sequence-result">
            ${order.map((id) => {
              const step = item.activity.steps.find((entry) => entry.id === id);
              return `<li>${esc(step?.text || id)}</li>`;
            }).join("") || "<li>还未选择步骤</li>"}
          </ol>
        </div>
      </div>
      <div class="activity-buttons">
        <button id="resetSequence" type="button" class="ghost-button">重排</button>
        <button id="checkActivity" type="button" class="primary-button small">检查流程</button>
      </div>
      ${renderActivityFeedback(item)}
    `;
  }

  function renderMetricMark(item) {
    const store = currentActivityState(item);
    const marks = store.marks || {};
    return `
      <div class="mark-grid">
        ${item.activity.marks.map((mark) => {
          const metric = item.metrics.find((entry) => entry.id === mark.metricId);
          return `
            <article class="activity-item">
              <strong>${esc(metric?.name || mark.metricId)}</strong>
              <p>${esc(metric?.reading || "")}</p>
              <div class="mini-actions">
                ${item.activity.categories.map((cat) => `
                  <button type="button" class="mini-button ${marks[mark.metricId] === cat.id ? "selected" : ""}" data-mark-metric="${esc(mark.metricId)}" data-mark-value="${esc(cat.id)}">${esc(cat.label)}</button>
                `).join("")}
              </div>
            </article>
          `;
        }).join("")}
      </div>
      <button id="checkActivity" type="button" class="primary-button small">检查标注</button>
      ${renderActivityFeedback(item)}
    `;
  }

  function renderEvidenceSort(item) {
    const store = currentActivityState(item);
    const sorts = store.sorts || {};
    return `
      <div class="activity-list">
        ${item.activity.items.map((entry) => `
          <article class="activity-item">
            <strong>${esc(entry.text)}</strong>
            <div class="mini-actions">
              ${item.activity.categories.map((cat) => `
                <button type="button" class="mini-button ${sorts[entry.id] === cat.id ? "selected" : ""}" data-evidence-id="${esc(entry.id)}" data-evidence-category="${esc(cat.id)}">${esc(cat.label)}</button>
              `).join("")}
            </div>
          </article>
        `).join("")}
      </div>
      <button id="checkActivity" type="button" class="primary-button small">检查依据链</button>
      ${renderActivityFeedback(item)}
    `;
  }

  function renderCompose(item) {
    const store = currentActivityState(item);
    const choices = store.compose || {};
    const submitted = Boolean(store.submitted);
    return `
      <div class="compose-grid">
        ${item.activity.slots.map((slot) => `
          <article class="compose-slot">
            <span>${esc(slot.label)}</span>
            ${slot.options.map((option) => `
              <button type="button" class="compose-option ${choices[slot.id] === option.id ? "selected" : ""}" data-compose-slot="${esc(slot.id)}" data-compose-option="${esc(option.id)}">${esc(option.text)}</button>
            `).join("")}
          </article>
        `).join("")}
      </div>
      <button id="submitCompose" type="button" class="primary-button small">提交结论</button>
      ${submitted ? renderComposedConclusion(item) : `<p class="hint">四个位置都选择后再提交。提交不是为了给分，而是为了检查这段话能否用于岗位验收表达。</p>`}
    `;
  }

  function renderComposedConclusion(item) {
    const store = currentActivityState(item);
    const choices = store.compose || {};
    const complete = item.activity.slots.every((slot) => choices[slot.id] === slot.correct);
    const text = item.activity.slots.map((slot) => {
      const option = slot.options.find((entry) => entry.id === choices[slot.id]);
      return option?.text || "";
    }).filter(Boolean).join("");
    return `
      <div class="generated-answer show">
        <strong>${complete ? "这段结论具备提交基础" : "这段结论还需要修改"}</strong>
        <p>${esc(text || "还没有形成完整结论。")}</p>
        <p>${complete ? "它包含判断、依据、边界和建议四部分。" : "请重点检查是否缺少边界，或是否把背景信息当成了验收依据。"}</p>
      </div>
    `;
  }

  function renderActivityFeedback(item) {
    const store = currentActivityState(item);
    if (!store.checked) return `<p class="hint">完成活动后再检查。反馈会说明这一步与验收结论有什么关系。</p>`;
    const result = activityResult(item);
    const lines = result.details.map((line) => `<li>${esc(line)}</li>`).join("");
    return `
      <div class="feedback ${result.complete ? "good" : "bad"}">
        <strong>${result.complete ? "这一步已经形成有效学习产出。" : "这一步还没有完全形成可靠依据。"}</strong>
        <ul>${lines}</ul>
        <div class="repair-path">
          <span>下一步怎么改</span>
          <p>${esc(item.repairHint)}</p>
          <button type="button" class="ghost-button" data-retry-activity="${esc(item.id)}">再试一次</button>
          <button type="button" class="secondary-button" data-scroll-conclusion="${esc(item.id)}">形成更好结论</button>
        </div>
      </div>
    `;
  }

  function activityResult(item) {
    const store = currentActivityState(item);
    const activity = item.activity;
    if (activity.type === "complaint-sort" || activity.type === "evidence-sort") {
      const sorts = store.sorts || {};
      const details = activity.items.map((entry) => {
        const ok = sorts[entry.id] === entry.target;
        return `${ok ? "已对应" : "需修正"}：${entry.feedback}`;
      });
      return { complete: activity.items.every((entry) => sorts[entry.id] === entry.target), details };
    }
    if (activity.type === "sequence") {
      const order = store.order || [];
      const complete = activity.correctOrder.join(",") === order.join(",");
      return {
        complete,
        details: complete
          ? ["验证流程成立：先判断场景，再看覆盖，之后补看移动性，最后写结论。"]
          : ["流程还不稳。移动路径投诉必须包含切换、重建和掉线日志，不能停在覆盖数据。"]
      };
    }
    if (activity.type === "metric-mark") {
      const marks = store.marks || {};
      const details = activity.marks.map((mark) => {
        const ok = marks[mark.metricId] === mark.target;
        return `${ok ? "标注合理" : "标注需修正"}：${mark.feedback}`;
      });
      return { complete: activity.marks.every((mark) => marks[mark.metricId] === mark.target), details };
    }
    return { complete: false, details: ["该活动暂未生成检查结果。"] };
  }

  function renderConclusion(item) {
    const conclusion = item.conclusion;
    const complete = activityComplete(item);
    const text = [
      conclusion.judgement,
      conclusion.evidence.join(""),
      conclusion.boundary,
      conclusion.next
    ].join("");
    return `
      <section class="conclusion-box" aria-label="结论结构">
        <h4>把学习活动转成职业结论</h4>
        <div class="conclusion-grid">
          <article><span>判断</span><p>${esc(conclusion.judgement)}</p></article>
          <article><span>依据</span><p>${conclusion.evidence.map((line) => esc(line)).join("<br>")}</p></article>
          <article><span>边界</span><p>${esc(conclusion.boundary)}</p></article>
          <article><span>建议</span><p>${esc(conclusion.next)}</p></article>
        </div>
        <div class="generated-answer ${complete ? "show" : ""}">
          <strong>${complete ? "当前可提交参考结论" : "完成学习活动后显示参考结论"}</strong>
          <p>${complete ? esc(text) : "先完成本案例的归类、排序、标注、分类或拼装活动。"}</p>
        </div>
      </section>
    `;
  }

  function renderLearningSheet(item) {
    const done = activityComplete(item);
    return `
      <section class="learning-sheet" aria-label="结构化学习单">
        <div>
          <p class="eyebrow">本例学习单</p>
          <h4>${done ? "已具备提交基础" : "完成活动后补全这张学习单"}</h4>
          <p>这张表把本例活动结果整理成教师可讲评、学生可复盘的提交物。</p>
        </div>
        <div class="sheet-grid">
          <article><span>我判断</span><p>${esc(item.conclusion.judgement)}</p></article>
          <article><span>我依据</span><p>${item.conclusion.evidence.map((line) => esc(line)).join("<br>")}</p></article>
          <article><span>我保留的边界</span><p>${esc(item.conclusion.boundary)}</p></article>
          <article><span>我建议</span><p>${esc(item.conclusion.next)}</p></article>
        </div>
      </section>
    `;
  }

  function renderProgress() {
    const done = data.cases.filter((item) => isDone(item)).length;
    return `
      <section class="side-card">
        <p class="eyebrow">学习记录</p>
        <h4>已完成 ${done}/${data.cases.length} 个学习动作</h4>
        <ol class="record-list">
          ${data.cases.map((item) => `<li class="${isDone(item) ? "done" : ""}">${esc(item.stage)}：${esc(item.activity.title)}</li>`).join("")}
        </ol>
      </section>
    `;
  }

  function renderCasePurpose(item) {
    const nodes = item.graphNodeIds.map(taskNodeById).filter(Boolean);
    return `
      <section class="side-card">
        <p class="eyebrow">这一例训练什么</p>
        <h4>${esc(item.task)}</h4>
        <ul>
          ${item.ability.map((ability) => `<li>${esc(ability)}</li>`).join("")}
        </ul>
        <div class="node-chips">
          ${nodes.map((node) => `<button type="button" class="node-chip" data-side-node="${esc(node.id)}">${esc(node.label)}</button>`).join("")}
        </div>
      </section>
    `;
  }

  function renderGlossary() {
    const query = (state.glossaryQuery || "").trim().toLowerCase();
    const terms = data.glossary.filter((entry) => {
      if (!query) return true;
      return [entry.term, entry.explain, entry.howToRead, entry.misconception, ...(entry.relatedCases || [])]
        .join(" ")
        .toLowerCase()
        .includes(query);
    }).slice(0, query ? 6 : 4);
    return `
      <section class="side-card glossary-card">
        <p class="eyebrow">术语字典</p>
        <h4>看不懂的指标先查这里</h4>
        <label class="glossary-search">
          <span>输入术语或关键词</span>
          <input id="glossarySearch" type="search" value="${esc(state.glossaryQuery || "")}" placeholder="例如：95分位、切换、边界">
        </label>
        <div class="term-quick">
          ${["SS-RSRP", "95分位时延", "切换成功率", "边界"].map((term) => `<button type="button" data-term-query="${esc(term)}">${esc(term)}</button>`).join("")}
        </div>
        <div class="term-list">
          ${terms.map((entry) => `
            <article>
              <strong>${esc(entry.term)}</strong>
              <p>${esc(entry.explain)}</p>
              <small><b>本课怎么看：</b>${esc(entry.howToRead)}</small>
              <small><b>常见误解：</b>${esc(entry.misconception)}</small>
              <small><b>相关案例：</b>${esc(entry.relatedCases.join("、"))}</small>
            </article>
          `).join("") || `<p class="hint">没有找到匹配词条。可以换一个关键词。</p>`}
        </div>
        <p class="dictionary-note">当前为配置化词条，不是真实AI助手。</p>
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
          <h2>45分钟课堂组织与讲评工具</h2>
          <p>教师页用于组织课堂节奏、投屏板书、观察模拟学情和讲评学生产出，不进入学生主学习路径。</p>
        </div>
        <div class="teacher-grid">
          <article class="teacher-card wide">
            <h3>45分钟课时安排</h3>
            <div class="schedule-list">
              ${data.teacher.schedule.map((entry) => `
                <article>
                  <strong>${esc(entry.time)}</strong>
                  <p>${esc(entry.action)}</p>
                  <small>${esc(entry.output)}</small>
                </article>
              `).join("")}
            </div>
          </article>
          <article class="teacher-card">
            <h3>投屏 / 板书建议</h3>
            <ul>${data.teacher.boardAdvice.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
          </article>
          <article class="teacher-card">
            <h3>关键提问脚本</h3>
            <ul>${data.teacher.questionScripts.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
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
            <h3>典型答案入口</h3>
            <div class="answer-grid">
              ${data.teacher.exemplarAnswers.map((entry) => {
                const caseItem = data.cases.find((item) => item.id === entry.caseId);
                return `
                  <article>
                    <strong>${esc(caseItem?.shortTitle || entry.caseId)}</strong>
                    <p>${esc(entry.answer)}</p>
                  </article>
                `;
              }).join("")}
            </div>
          </article>
          <article class="teacher-card wide analytics-card">
            <h3>模拟学情看板</h3>
            <p class="simulation-note">${esc(data.teacher.simulatedAnalytics.note)}</p>
            <div class="analytics-grid">
              ${data.teacher.simulatedAnalytics.completion.map((entry) => `
                <article>
                  <span>${esc(entry.label)}</span>
                  <strong>${esc(entry.rate)}</strong>
                  <em>讲评优先级：${esc(entry.priority)}</em>
                </article>
              `).join("")}
            </div>
            <div class="teacher-columns">
              <div>
                <h4>高频误区</h4>
                <ul>${data.teacher.simulatedAnalytics.misconceptions.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
              </div>
              <div>
                <h4>讲评优先级</h4>
                <ul>${data.teacher.simulatedAnalytics.reviewPriority.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
              </div>
            </div>
          </article>
          <article class="teacher-card">
            <h3>课堂模式控节奏</h3>
            <ul>${data.teacher.modeGuide.class.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
          </article>
          <article class="teacher-card">
            <h3>自学布置与验收</h3>
            <ul>${data.teacher.modeGuide.self.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
          </article>
          <article class="teacher-card wide">
            <h3>专业复核清单</h3>
            <ul>${data.teacher.reviewChecklist.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>
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
          <h2>卡片、图谱节点和学习活动的映射</h2>
          <p>本页说明哪些内容可以转成表、图、动画、互动或小游戏。正式资源要逐项制作和审核。</p>
        </div>
        <div class="resource-grid">
          ${data.cases.map((item) => `
            <article class="resource-card">
              <span>${esc(item.stage)}</span>
              <h3>${esc(item.shortTitle)}</h3>
              <p>${esc(item.activity.title)}</p>
              <div>${item.conversions.map((entry) => `<b>${esc(entry)}</b>`).join("")}</div>
            </article>
          `).join("")}
        </div>
        <section class="source-panel">
          <h3>课程能力图谱节点清单</h3>
          <div class="node-table">
            ${data.courseGraph.taskNodes.map((node) => `
              <article>
                <strong>${esc(node.id)} ${esc(node.label)}</strong>
                <p>${esc(node.goal)}</p>
                <small>卡片：${node.cards.map((card) => esc(card)).join("、")}；评价：${esc(node.evaluation)}</small>
              </article>
            `).join("")}
          </div>
        </section>
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
    const selected = graphNodeById(state.selectedGraphNodeId) || data.courseGraph.taskNodes[0];
    const caseItem = selected.caseId ? data.cases.find((item) => item.id === selected.caseId) : null;
    $("#mapBody").innerHTML = `
      <div class="course-chain">
        <p class="eyebrow">全课程工作过程主链</p>
        ${data.courseGraph.courseChain.map((node) => `
          <button type="button" class="chain-node ${node.status} ${state.selectedGraphNodeId === node.id ? "selected" : ""}" data-node-id="${esc(node.id)}">
            <strong>${esc(node.label)}</strong>
            <span>${esc(node.desc)}</span>
          </button>
        `).join("")}
      </div>
      <div class="task-graph">
        <p class="eyebrow">项目四任务2详细子图谱</p>
        ${data.courseGraph.taskNodes.map((node) => `
          <button type="button" class="graph-node ${state.selectedGraphNodeId === node.id ? "selected" : ""}" data-node-id="${esc(node.id)}">
            <small>${esc(node.id)}</small>
            <strong>${esc(node.label)}</strong>
            <span>${esc(node.activity)}</span>
          </button>
        `).join("")}
      </div>
      <aside class="node-detail">
        <p class="eyebrow">节点详情</p>
        <h3>我正在练：${esc(selected.label)}</h3>
        <p>${esc(selected.summary || selected.desc)}</p>
        ${selected.goal ? `
          <dl>
            <dt>练什么</dt><dd>${esc(selected.goal)}</dd>
            <dt>先会什么</dt><dd>${esc((selected.prerequisites || []).join("、") || "无明确前置")}</dd>
            <dt>接着练什么</dt><dd>${esc((selected.next || []).join("、") || "本任务到此收束")}</dd>
            <dt>用哪些材料</dt><dd>${selected.cards.map((card) => esc(card)).join("、")}</dd>
            <dt>怎么练</dt><dd>${esc(selected.activity)}</dd>
            <dt>怎么算掌握</dt><dd>${esc(selected.evaluation)}</dd>
            <dt>可转资源</dt><dd>${selected.resourceTypes.map((type) => esc(type)).join("、")}</dd>
            <dt>完成状态</dt><dd>${caseItem && isDone(caseItem) ? "你已经在当前样章中完成这个节点" : "完成关联案例后会点亮这个节点"}</dd>
          </dl>
          ${renderRelatedTask(selected, caseItem)}
        ` : `
          <p class="node-note">这是全课程主链节点。当前样章只细化“结果验证”能力群，其他节点后续需由全书结构化和专家复核补齐。</p>
        `}
      </aside>
    `;
  }

  function renderRelatedTask(node, caseItem) {
    if (!caseItem) {
      return `<p class="node-note">本节点尚未挂接到当前样章的学习任务，后续全书图谱补齐时需要补充。</p>`;
    }
    return `
      <div class="related-task">
        <p class="eyebrow">关联学习任务</p>
        <strong>${esc(caseItem.stage)} · ${esc(caseItem.shortTitle)}</strong>
        <p>${esc(caseItem.activity.title)}：${esc(caseItem.activity.instruction)}</p>
        <button type="button" class="primary-button" data-focus-case="${esc(caseItem.id)}" data-focus-node="${esc(node.id)}">定位到学习活动</button>
      </div>
    `;
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
        setSelectedNodeFromCase();
        save();
        render();
        scrollToElement(".case-card");
      };
    });
    $$("[data-side-node]").forEach((button) => {
      button.onclick = () => {
        state.selectedGraphNodeId = button.dataset.sideNode;
        save();
        renderMap();
        $("#mapDialog").showModal();
      };
    });
    $("#openMap")?.addEventListener("click", () => $("#mapDialog").showModal());
    $("#openMapInline")?.addEventListener("click", () => $("#mapDialog").showModal());
    $("#glossarySearch")?.addEventListener("input", (event) => {
      state.glossaryQuery = event.target.value;
      save();
      render();
      window.requestAnimationFrame(() => {
        const input = $("#glossarySearch");
        input?.focus();
        input?.setSelectionRange(input.value.length, input.value.length);
      });
    });
    $$("[data-term-query]").forEach((button) => {
      button.onclick = () => {
        state.glossaryQuery = button.dataset.termQuery;
        save();
        render();
      };
    });

    $("[data-sort-id]") && $$("[data-sort-id]").forEach((button) => {
      button.onclick = () => {
        const store = currentActivityState();
        store.sorts = { ...(store.sorts || {}), [button.dataset.sortId]: button.dataset.sortCategory };
        store.checked = false;
        save();
        render();
      };
    });
    $("[data-evidence-id]") && $$("[data-evidence-id]").forEach((button) => {
      button.onclick = () => {
        const store = currentActivityState();
        store.sorts = { ...(store.sorts || {}), [button.dataset.evidenceId]: button.dataset.evidenceCategory };
        store.checked = false;
        save();
        render();
      };
    });
    $("[data-mark-metric]") && $$("[data-mark-metric]").forEach((button) => {
      button.onclick = () => {
        const store = currentActivityState();
        store.marks = { ...(store.marks || {}), [button.dataset.markMetric]: button.dataset.markValue };
        store.checked = false;
        save();
        render();
      };
    });
    $("[data-step-id]") && $$("[data-step-id]").forEach((button) => {
      button.onclick = () => {
        const store = currentActivityState();
        const order = store.order || [];
        store.order = order.includes(button.dataset.stepId) ? order : [...order, button.dataset.stepId];
        store.checked = false;
        save();
        render();
      };
    });
    $("[data-compose-slot]") && $$("[data-compose-slot]").forEach((button) => {
      button.onclick = () => {
        const store = currentActivityState();
        store.compose = { ...(store.compose || {}), [button.dataset.composeSlot]: button.dataset.composeOption };
        store.submitted = false;
        save();
        render();
      };
    });
    $("#checkActivity")?.addEventListener("click", () => {
      const store = currentActivityState();
      store.checked = true;
      save();
      render();
    });
    $("[data-retry-activity]")?.addEventListener("click", () => {
      resetActivity();
      save();
      render();
      scrollToElement(".activity-box");
    });
    $("[data-scroll-conclusion]")?.addEventListener("click", () => {
      scrollToElement(".conclusion-box");
    });
    $("#resetSequence")?.addEventListener("click", () => {
      const store = currentActivityState();
      store.order = [];
      store.checked = false;
      save();
      render();
    });
    $("#submitCompose")?.addEventListener("click", () => {
      const store = currentActivityState();
      store.submitted = true;
      save();
      render();
    });
    $("#prevCase")?.addEventListener("click", () => {
      state.caseIndex = Math.max(0, state.caseIndex - 1);
      setSelectedNodeFromCase();
      save();
      render();
      scrollToElement(".case-card");
    });
    $("#nextCase")?.addEventListener("click", () => {
      state.caseIndex = state.caseIndex === data.cases.length - 1 ? 0 : state.caseIndex + 1;
      setSelectedNodeFromCase();
      save();
      render();
      scrollToElement(".case-card");
    });
  }

  function setSelectedNodeFromCase() {
    state.selectedGraphNodeId = currentCase().graphNodeIds[0] || "P4T2-N01";
  }

  function resetActivity(item = currentCase()) {
    state.activities[item.id] = {};
  }

  function isDone(item) {
    return activityComplete(item);
  }

  function activityComplete(item) {
    const store = currentActivityState(item);
    const activity = item.activity;
    if (activity.type === "complaint-sort" || activity.type === "evidence-sort") {
      const sorts = store.sorts || {};
      return activity.items.every((entry) => sorts[entry.id] === entry.target);
    }
    if (activity.type === "sequence") {
      return activity.correctOrder.join(",") === (store.order || []).join(",");
    }
    if (activity.type === "metric-mark") {
      const marks = store.marks || {};
      return activity.marks.every((mark) => marks[mark.metricId] === mark.target);
    }
    if (activity.type === "compose") {
      const choices = store.compose || {};
      return Boolean(store.submitted) && activity.slots.every((slot) => choices[slot.id] === slot.correct);
    }
    return false;
  }

  $("#closeMap").addEventListener("click", () => $("#mapDialog").close());
  $("#mapBody").addEventListener("click", (event) => {
    const nodeTarget = event.target.closest("[data-node-id]");
    if (nodeTarget) {
      state.selectedGraphNodeId = nodeTarget.dataset.nodeId;
      save();
      renderMap();
      return;
    }
    const focusTarget = event.target.closest("[data-focus-case]");
    if (focusTarget) {
      const index = data.cases.findIndex((item) => item.id === focusTarget.dataset.focusCase);
      if (index >= 0) {
        state.caseIndex = index;
        state.view = "student";
        state.selectedGraphNodeId = focusTarget.dataset.focusNode || data.cases[index].graphNodeIds[0] || "P4T2-N01";
        save();
        $("#mapDialog").close();
        render();
        scrollToElement(".activity-box");
      }
      return;
    }
    const jumpTarget = event.target.closest("[data-jump-case]");
    if (jumpTarget) {
      const index = data.cases.findIndex((item) => item.id === jumpTarget.dataset.jumpCase);
      if (index >= 0) {
        state.caseIndex = index;
        state.view = "student";
        setSelectedNodeFromCase();
        save();
        $("#mapDialog").close();
        render();
        scrollToElement(".case-card");
      }
    }
  });

  render();
})();
