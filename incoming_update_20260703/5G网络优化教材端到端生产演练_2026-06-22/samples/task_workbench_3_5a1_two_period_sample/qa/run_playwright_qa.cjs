const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const sampleDir = path.resolve(__dirname, "..");
const qaDir = __dirname;
const url = `file://${path.join(sampleDir, "index.html")}`;
const localHeadlessShell = "/Users/ny/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell";

async function click(page, selector) {
  await page.click(selector);
  await page.waitForTimeout(80);
}

async function checkViewport(browser, name, viewport) {
  const page = await browser.newPage({ viewport });
  await page.addInitScript(() => localStorage.clear());
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));

  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(200);

  const first = await page.evaluate(() => ({
    title: document.title,
    hero: document.querySelector(".hero")?.textContent || "",
    learningEntry: document.querySelector(".learning-entry")?.textContent || "",
    lessonSteps: document.querySelectorAll(".lesson-step").length,
    caseTabs: document.querySelectorAll(".case-tab").length,
    activeCase: document.querySelector(".case-card h3")?.textContent || "",
    completionStandard: document.querySelector(".completion-standard")?.textContent || "",
    modeText: document.querySelector(".mode-panel")?.textContent || "",
    activityText: document.querySelector(".activity-box")?.textContent || "",
    graphContext: document.querySelector(".graph-context")?.textContent || "",
    glossary: document.querySelector(".glossary-card")?.textContent || "",
    backHref: document.querySelector(".back-link")?.getAttribute("href") || "",
    resetText: document.querySelector("#resetLearning")?.textContent || "",
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
  }));

  await page.fill("#glossarySearch", "95");
  await page.waitForTimeout(100);
  const glossarySearch = await page.evaluate(() => ({
    text: document.querySelector(".glossary-card")?.textContent || "",
    value: document.querySelector("#glossarySearch")?.value || ""
  }));

  await click(page, '[data-mode="self"]');
  const selfMode = await page.evaluate(() => ({
    text: document.querySelector(".mode-panel")?.textContent || "",
    supportCards: document.querySelectorAll(".self-support-grid article").length
  }));
  await click(page, '[data-mode="class"]');

  await click(page, '[data-side-node="P4T2-N02"]');
  const sideNode = await page.evaluate(() => ({
    dialogOpen: document.querySelector("#mapDialog")?.open || false,
    text: document.querySelector(".node-detail")?.textContent || ""
  }));
  if (sideNode.dialogOpen) await page.keyboard.press("Escape");
  await page.waitForTimeout(80);

  const sortSelections = [
    ['web', 'experience'],
    ['video', 'experience'],
    ['live', 'experience'],
    ['peak', 'capacity']
  ];
  for (const [id, category] of sortSelections) {
    await click(page, `[data-sort-id="${id}"][data-sort-category="${category}"]`);
  }
  await click(page, "#checkActivity");
  await click(page, "[data-scroll-revision]");
  await page.fill('[data-revision-input="demo-dorm"]', "网页打开顺畅只能说明网页业务改善，还要补看直播上行、视频卡顿和晚高峰容量。");
  await page.waitForTimeout(80);
  const complaint = await page.evaluate(() => ({
    feedback: document.querySelector(".feedback")?.textContent || "",
    repair: document.querySelector(".repair-path")?.textContent || "",
    answer: document.querySelector(".generated-answer")?.textContent || "",
    revision: document.querySelector(".revision-box")?.textContent || "",
    sheet: document.querySelector(".learning-sheet")?.textContent || "",
    revisionValue: document.querySelector('[data-revision-input="demo-dorm"]')?.value || ""
  }));

  await click(page, '.case-tab[data-case-index="1"]');
  for (const id of ["scene", "coverage", "mobility", "conclusion"]) {
    await click(page, `[data-step-id="${id}"]`);
  }
  await click(page, "#checkActivity");
  const sequence = await page.evaluate(() => ({
    activeCase: document.querySelector(".case-card h3")?.textContent || "",
    feedback: document.querySelector(".feedback")?.textContent || ""
  }));

  await click(page, '.case-tab[data-case-index="2"]');
  const markSelections = [
    ['avgRate', 'support'],
    ['p95', 'boundary'],
    ['prb', 'boundary'],
    ['stuck', 'boundary']
  ];
  for (const [metric, value] of markSelections) {
    await click(page, `[data-mark-metric="${metric}"][data-mark-value="${value}"]`);
  }
  await click(page, "#checkActivity");
  const mark = await page.evaluate(() => ({
    activeCase: document.querySelector(".case-card h3")?.textContent || "",
    feedback: document.querySelector(".feedback")?.textContent || ""
  }));

  await click(page, '.case-tab[data-case-index="3"]');
  const evidenceSelections = [
    ['stand', 'support'],
    ['pay', 'support'],
    ['handover', 'boundary'],
    ['before', 'background']
  ];
  for (const [id, category] of evidenceSelections) {
    await click(page, `[data-evidence-id="${id}"][data-evidence-category="${category}"]`);
  }
  await click(page, "#checkActivity");
  const evidence = await page.evaluate(() => ({
    activeCase: document.querySelector(".case-card h3")?.textContent || "",
    feedback: document.querySelector(".feedback")?.textContent || ""
  }));

  await click(page, '.case-tab[data-case-index="4"]');
  const composeSelections = [
    ['judgement', 'partial'],
    ['evidence', 'evidence'],
    ['boundary', 'upload'],
    ['next', 'retest']
  ];
  for (const [slot, option] of composeSelections) {
    await click(page, `[data-compose-slot="${slot}"][data-compose-option="${option}"]`);
  }
  await click(page, "#submitCompose");
  const compose = await page.evaluate(() => ({
    activeCase: document.querySelector(".case-card h3")?.textContent || "",
    answer: document.querySelector(".generated-answer")?.textContent || ""
  }));

  await click(page, "#openMap");
  const mapBefore = await page.evaluate(() => ({
    visible: document.querySelector("#mapDialog")?.open || false,
    chainCount: document.querySelectorAll(".chain-node").length,
    nodeCount: document.querySelectorAll(".graph-node").length,
    text: document.querySelector("#mapDialog")?.textContent || ""
  }));
  await click(page, '[data-node-id="P4T2-N04"]');
  const mapDetail = await page.evaluate(() => ({
    text: document.querySelector(".node-detail")?.textContent || "",
    focusLinks: document.querySelectorAll("[data-focus-case]").length
  }));
  if (mapDetail.focusLinks > 0) {
    await click(page, '[data-focus-case="contrast-canteen"]');
  }
  const mapTaskJump = await page.evaluate(() => ({
    activeCase: document.querySelector(".case-card h3")?.textContent || "",
    dialogOpen: document.querySelector("#mapDialog")?.open || false,
    activityTop: Math.round(document.querySelector(".activity-box")?.getBoundingClientRect().top || -999),
    activityText: document.querySelector(".activity-box")?.textContent || ""
  }));
  if (mapTaskJump.dialogOpen) await page.keyboard.press("Escape");
  await page.waitForTimeout(80);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(80);
  await click(page, "#nextCase");
  const nextCaseScroll = await page.evaluate(() => ({
    activeCase: document.querySelector(".case-card h3")?.textContent || "",
    caseTop: Math.round(document.querySelector(".case-card")?.getBoundingClientRect().top || -999)
  }));

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(80);
  await click(page, '[data-view="teacher"]');
  const teacher = await page.evaluate(() => ({
    active: document.querySelector("#teacherView")?.classList.contains("active"),
    scrollY: Math.round(window.scrollY),
    text: document.querySelector("#teacherView")?.textContent || ""
  }));

  await click(page, '[data-view="resources"]');
  const resources = await page.evaluate(() => ({
    active: document.querySelector("#resourcesView")?.classList.contains("active"),
    cards: document.querySelectorAll(".resource-card").length,
    nodes: document.querySelectorAll(".node-table article").length,
    text: document.querySelector("#resourcesView")?.textContent || ""
  }));

  await click(page, '[data-view="student"]');
  await click(page, "#resetLearning");
  const reset = await page.evaluate(() => ({
    activeCase: document.querySelector(".case-card h3")?.textContent || "",
    progress: document.querySelector(".record-list")?.textContent || "",
    modeText: document.querySelector(".mode-panel")?.textContent || "",
    scrollY: Math.round(window.scrollY)
  }));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(qaDir, `${name}.png`), fullPage: true });

  const finalLayout = await page.evaluate(() => ({
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
  }));

  await page.close();

  return {
    viewport: name,
    screenshot: path.join(qaDir, `${name}.png`),
    first,
    glossarySearch,
    selfMode,
    sideNode,
    complaint,
    sequence,
    mark,
    evidence,
    compose,
    mapBefore,
    mapDetail,
    mapTaskJump,
    nextCaseScroll,
    teacher,
    resources,
    reset,
    finalLayout,
    consoleErrors
  };
}

(async () => {
  const launchOptions = fs.existsSync(localHeadlessShell)
    ? { headless: true, executablePath: localHeadlessShell }
    : { headless: true };
  const browser = await chromium.launch(launchOptions);
  try {
    const results = [];
    results.push(await checkViewport(browser, "desktop", { width: 1360, height: 940 }));
    results.push(await checkViewport(browser, "mobile", { width: 390, height: 900 }));

    const pass = results.every((item) =>
      item.first.title.includes("样章3.5A-1") &&
      item.first.hero.includes("课程能力图谱") &&
      !item.first.hero.includes("2课时") &&
      !item.first.hero.includes("两课时") &&
      item.first.learningEntry.includes("先做第1例") &&
      !item.first.learningEntry.includes("课时安排") &&
      !item.first.learningEntry.includes("90分钟") &&
      item.first.learningEntry.includes("最终要形成") &&
      item.first.lessonSteps === 0 &&
      item.first.caseTabs === 5 &&
      item.first.activeCase.includes("宿舍区") &&
      item.first.completionStandard.includes("完成标准") &&
      item.first.modeText.includes("课堂组织") &&
      item.first.activityText.includes("投诉线索归类") &&
      item.first.graphContext.includes("我正在练") &&
      item.first.graphContext.includes("当前课程能力图谱位置") &&
      item.first.glossary.includes("术语字典") &&
      item.first.backHref.includes("digital_textbook_overall_prototype_overall_0_5") &&
      item.first.resetText.includes("重新开始") &&
      item.glossarySearch.value === "95" &&
      item.glossarySearch.text.includes("95分位时延") &&
      item.first.overflowX === false &&
      item.selfMode.text.includes("术语小卡") &&
      item.selfMode.supportCards === 2 &&
      item.sideNode.dialogOpen === true &&
      item.sideNode.text.includes("区分改善与达标") &&
      item.complaint.feedback.includes("有效学习产出") &&
      item.complaint.repair.includes("再试一次") &&
      item.complaint.repair.includes("写修正句") &&
      item.complaint.revision.includes("二次修正") &&
      item.complaint.revisionValue.includes("网页打开顺畅") &&
      item.complaint.sheet.includes("我的填写") &&
      item.complaint.sheet.includes("参考表达") &&
      item.complaint.sheet.includes("网页打开顺畅") &&
      item.complaint.answer.includes("部分达标") &&
      item.sequence.activeCase.includes("地下食堂") &&
      item.sequence.feedback.includes("验证流程成立") &&
      item.mark.activeCase.includes("实训楼") &&
      item.mark.feedback.includes("有效学习产出") &&
      item.evidence.activeCase.includes("体育馆") &&
      item.evidence.feedback.includes("有效学习产出") &&
      item.compose.activeCase.includes("招聘会") &&
      item.compose.answer.includes("具备提交基础") &&
      item.mapBefore.visible === true &&
      item.mapBefore.chainCount === 7 &&
      item.mapBefore.nodeCount === 8 &&
      item.mapBefore.text.includes("全课程工作过程主链") &&
      item.mapDetail.text.includes("读移动性指标") &&
      item.mapDetail.text.includes("怎么算掌握") &&
      item.mapDetail.text.includes("关联学习任务") &&
      !item.mapDetail.text.includes("P4T2-N04") &&
      item.mapDetail.focusLinks >= 1 &&
      item.mapTaskJump.activeCase.includes("地下食堂") &&
      item.mapTaskJump.dialogOpen === false &&
      item.mapTaskJump.activityTop >= 0 &&
      item.mapTaskJump.activityTop < 240 &&
      item.mapTaskJump.activityText.includes("排出移动性验证流程") &&
      item.nextCaseScroll.activeCase.includes("实训楼") &&
      item.nextCaseScroll.caseTop >= 0 &&
      item.nextCaseScroll.caseTop < 240 &&
      item.teacher.active === true &&
      item.teacher.scrollY < 40 &&
      item.teacher.text.includes("课程能力图谱") &&
      item.teacher.text.includes("2课时安排") &&
      item.teacher.text.includes("教师试看说明") &&
      item.teacher.text.includes("学生观察记录点") &&
      item.teacher.text.includes("专业复核表") &&
      item.teacher.text.includes("模拟学情") &&
      item.teacher.text.includes("自学布置与验收") &&
      item.resources.active === true &&
      item.resources.cards === 5 &&
      item.resources.nodes === 8 &&
      item.resources.text.includes("卡片、图谱节点和学习活动的映射") &&
      item.reset.activeCase.includes("宿舍区") &&
      item.reset.progress.includes("入门样例") &&
      item.reset.modeText.includes("课堂组织") &&
      item.reset.scrollY < 40 &&
      item.finalLayout.overflowX === false &&
      item.consoleErrors.length === 0
    );

    const summary = { url, generatedAt: new Date().toISOString(), pass, results };
    fs.writeFileSync(path.join(qaDir, "playwright_qa_summary.json"), JSON.stringify(summary, null, 2), "utf8");
    console.log(JSON.stringify(summary, null, 2));
    process.exit(pass ? 0 : 1);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
