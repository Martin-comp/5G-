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
  await page.waitForTimeout(250);

  const first = await page.evaluate(() => {
    const text = document.querySelector("#studentView")?.textContent || "";
    return {
      title: document.title,
      hero: document.querySelector(".hero")?.textContent || "",
      activeTitle: document.querySelector(".guide-card h3")?.textContent || "",
      visibleTables: document.querySelectorAll("table").length,
      progressCount: document.querySelectorAll(".progress-step").length,
      studentText: text,
      backendWords: ["EV-", "证据X", "来源层级"].filter((word) => text.includes(word)),
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
    };
  });

  await page.click('.choice-button[data-answer="partial"]');
  await page.waitForTimeout(80);
  const step1 = await page.evaluate(() => ({
    feedback: document.querySelector(".feedback")?.textContent || "",
    done: document.querySelectorAll(".progress-step.done").length
  }));

  await page.click("#nextStep");
  await page.waitForTimeout(80);
  await page.click('.choice-button[data-answer="coverage"]');
  await page.click('.choice-button[data-answer="experience"]');
  await page.waitForTimeout(80);
  const step2 = await page.evaluate(() => ({
    title: document.querySelector(".guide-card h3")?.textContent || "",
    feedback: document.querySelector(".feedback")?.textContent || "",
    tableText: document.querySelector("table")?.textContent || ""
  }));

  await page.click("#nextStep");
  await page.waitForTimeout(80);
  const step3Before = await page.evaluate(() => ({
    title: document.querySelector(".guide-card h3")?.textContent || "",
    tableCount: document.querySelectorAll("table").length,
    barCount: document.querySelectorAll(".bar-row").length,
    look: document.querySelector(".look-box")?.textContent || ""
  }));
  await page.click('.choice-button[data-answer="coverageBetter"]');
  await page.waitForTimeout(80);
  const step3 = await page.textContent(".feedback");

  await page.click("#nextStep");
  await page.waitForTimeout(80);
  const step4Before = await page.evaluate(() => ({
    title: document.querySelector(".guide-card h3")?.textContent || "",
    chartText: document.querySelector(".experience-chart")?.textContent || "",
    tableText: document.querySelector("table")?.textContent || ""
  }));
  await page.click('.choice-button[data-answer="improvedNotFull"]');
  await page.waitForTimeout(80);
  const step4 = await page.textContent(".feedback");

  await page.click("#nextStep");
  await page.waitForTimeout(80);
  for (const id of ["status", "e1", "e2", "limit", "next"]) {
    await page.click(`.builder-card[data-card-id="${id}"]`);
  }
  await page.waitForTimeout(100);
  const step5 = await page.evaluate(() => ({
    title: document.querySelector(".guide-card h3")?.textContent || "",
    sentence: document.querySelector("#builtSentence")?.textContent || "",
    feedback: document.querySelector(".feedback")?.textContent || ""
  }));

  await page.click("#openMap");
  await page.waitForTimeout(80);
  const map = await page.evaluate(() => ({
    visible: document.querySelector("#mapDialog")?.hidden === false,
    count: document.querySelectorAll(".map-item").length,
    text: document.querySelector("#mapDialog")?.textContent || ""
  }));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(80);

  await page.click('[data-view="teacher"]');
  await page.waitForTimeout(80);
  const teacher = await page.evaluate(() => ({
    active: document.querySelector("#teacherView")?.classList.contains("active"),
    text: document.querySelector("#teacherView")?.textContent || ""
  }));

  await page.click('[data-view="resources"]');
  await page.waitForTimeout(80);
  const resources = await page.evaluate(() => ({
    active: document.querySelector("#resourcesView")?.classList.contains("active"),
    cards: document.querySelectorAll(".resource-card").length,
    text: document.querySelector("#resourcesView")?.textContent || ""
  }));

  await page.click('[data-view="student"]');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(80);
  await page.screenshot({ path: path.join(qaDir, `${name}.png`), fullPage: true });
  await page.close();

  return {
    viewport: name,
    screenshot: path.join(qaDir, `${name}.png`),
    first,
    step1,
    step2,
    step3Before,
    step3,
    step4Before,
    step4,
    step5,
    map,
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
      item.first.title.includes("样章3.3") &&
      item.first.hero.includes("网页好了，本次优化能不能验收通过") &&
      item.first.activeTitle.includes("看懂投诉") &&
      item.first.visibleTables === 0 &&
      item.first.progressCount === 5 &&
      item.first.backendWords.length === 0 &&
      item.first.overflowX === false &&
      item.step1.feedback.includes("这个初判更稳") &&
      item.step2.title.includes("找对数据") &&
      item.step2.feedback.includes("覆盖能说明") &&
      item.step2.tableText.includes("投诉现象") &&
      item.step3Before.title.includes("看覆盖") &&
      item.step3Before.tableCount >= 1 &&
      item.step3Before.barCount >= 3 &&
      item.step3Before.look.includes("能说明覆盖改善") &&
      item.step3.includes("覆盖数据只能解决一部分判断") &&
      item.step4Before.title.includes("看体验") &&
      item.step4Before.chartText.includes("95") &&
      item.step4.includes("改善和达标不是同一件事") &&
      item.step5.title.includes("拼结论") &&
      item.step5.sentence.includes("部分达标") &&
      item.step5.sentence.includes("建议补充晚高峰路测") &&
      item.step5.feedback.includes("结论结构完整") &&
      item.map.visible === true &&
      item.map.count === 5 &&
      item.map.text.includes("形成优化结果验证结论") &&
      item.teacher.active === true &&
      item.teacher.text.includes("先让学生做判断") &&
      item.resources.active === true &&
      item.resources.cards === 5 &&
      item.resources.text.includes("动画") &&
      item.resources.text.includes("小游戏") &&
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
