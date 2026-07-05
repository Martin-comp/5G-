const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const sampleDir = path.resolve(__dirname, "..");
const qaDir = __dirname;
const url = `file://${path.join(sampleDir, "index.html")}`;
const localHeadlessShell = "/Users/ny/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell";

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
    lessonSteps: document.querySelectorAll(".lesson-step").length,
    caseTabs: document.querySelectorAll(".case-tab").length,
    activeCase: document.querySelector(".case-card h3")?.textContent || "",
    tables: document.querySelectorAll("table").length,
    metricBars: document.querySelectorAll(".metric-bar").length,
    simulationNote: document.querySelector(".simulation-note")?.textContent || "",
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
  }));

  await page.click('.choice-button[data-answer="partial"]');
  await page.waitForTimeout(100);
  const demoFeedback = await page.textContent(".feedback");

  await page.click('.case-tab[data-case-index="1"]');
  await page.waitForTimeout(100);
  const contrastA = await page.evaluate(() => ({
    activeCase: document.querySelector(".case-card h3")?.textContent || "",
    text: document.querySelector(".case-card")?.textContent || "",
    metricBars: document.querySelectorAll(".metric-bar").length
  }));
  await page.click('.choice-button[data-answer="mobility"]');
  await page.waitForTimeout(100);
  const contrastAFeedback = await page.textContent(".feedback");

  await page.click('.case-tab[data-case-index="2"]');
  await page.waitForTimeout(100);
  await page.click('.choice-button[data-answer="tail"]');
  await page.waitForTimeout(100);
  const contrastB = await page.evaluate(() => ({
    activeCase: document.querySelector(".case-card h3")?.textContent || "",
    feedback: document.querySelector(".feedback")?.textContent || "",
    text: document.querySelector(".case-card")?.textContent || ""
  }));

  await page.click('.case-tab[data-case-index="3"]');
  await page.waitForTimeout(100);
  for (const id of ["coverage", "pay", "handover"]) {
    await page.click(`.choice-button[data-evidence="${id}"]`);
  }
  await page.click("#checkEvidence");
  await page.waitForTimeout(100);
  const guided = await page.evaluate(() => ({
    activeCase: document.querySelector(".case-card h3")?.textContent || "",
    feedback: document.querySelector(".feedback")?.textContent || "",
    answer: document.querySelector(".generated-answer")?.textContent || ""
  }));

  await page.click('.case-tab[data-case-index="4"]');
  await page.waitForTimeout(100);
  await page.click('.choice-button[data-answer="partial"]');
  await page.waitForTimeout(100);
  const mission = await page.evaluate(() => ({
    activeCase: document.querySelector(".case-card h3")?.textContent || "",
    feedback: document.querySelector(".feedback")?.textContent || "",
    answer: document.querySelector(".generated-answer")?.textContent || ""
  }));

  await page.click("#openMap");
  await page.waitForTimeout(100);
  const mapBefore = await page.evaluate(() => ({
    visible: document.querySelector("#mapDialog")?.open || false,
    count: document.querySelectorAll(".map-item").length,
    text: document.querySelector("#mapDialog")?.textContent || ""
  }));
  await page.click('.map-item[data-case-id="contrast-canteen"]');
  await page.waitForTimeout(150);
  const mapJump = await page.evaluate(() => ({
    activeCase: document.querySelector(".case-card h3")?.textContent || "",
    dialogOpen: document.querySelector("#mapDialog")?.open || false
  }));

  await page.click('[data-view="teacher"]');
  await page.waitForTimeout(100);
  const teacher = await page.evaluate(() => ({
    active: document.querySelector("#teacherView")?.classList.contains("active"),
    text: document.querySelector("#teacherView")?.textContent || ""
  }));

  await page.click('[data-view="resources"]');
  await page.waitForTimeout(100);
  const resources = await page.evaluate(() => ({
    active: document.querySelector("#resourcesView")?.classList.contains("active"),
    cards: document.querySelectorAll(".resource-card").length,
    text: document.querySelector("#resourcesView")?.textContent || ""
  }));

  await page.click('[data-view="student"]');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(qaDir, `${name}.png`), fullPage: true });
  await page.close();

  return {
    viewport: name,
    screenshot: path.join(qaDir, `${name}.png`),
    first,
    demoFeedback,
    contrastA,
    contrastAFeedback,
    contrastB,
    guided,
    mission,
    mapBefore,
    mapJump,
    teacher,
    resources,
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
      item.first.title.includes("样章3.4") &&
      item.first.hero.includes("多案例递进式课堂任务版") &&
      item.first.hero.includes("5个教学模拟案例") &&
      item.first.lessonSteps === 5 &&
      item.first.caseTabs === 5 &&
      item.first.activeCase.includes("宿舍区") &&
      item.first.tables >= 1 &&
      item.first.metricBars >= 4 &&
      item.first.simulationNote.includes("教学模拟案例") &&
      item.first.overflowX === false &&
      item.demoFeedback.includes("正确") &&
      item.contrastA.activeCase.includes("地下食堂") &&
      item.contrastA.text.includes("切换成功率") &&
      item.contrastAFeedback.includes("移动性和保持") &&
      item.contrastB.activeCase.includes("实训楼") &&
      item.contrastB.feedback.includes("平均值不能替代") &&
      item.guided.activeCase.includes("体育馆") &&
      item.guided.feedback.includes("选择完整") &&
      item.guided.answer.includes("部分达标") &&
      item.mission.activeCase.includes("招聘会") &&
      item.mission.feedback.includes("正确") &&
      item.mission.answer.includes("简历上传95分位") &&
      item.mapBefore.visible === true &&
      item.mapBefore.count === 6 &&
      item.mapBefore.text.includes("形成验收结论") &&
      item.mapJump.activeCase.includes("地下食堂") &&
      item.mapJump.dialogOpen === false &&
      item.teacher.active === true &&
      item.teacher.text.includes("小组分工") &&
      item.teacher.text.includes("专业复核风险") &&
      item.resources.active === true &&
      item.resources.cards === 5 &&
      item.resources.text.includes("小游戏") &&
      item.resources.text.includes("3GPP TS 28.552") &&
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
