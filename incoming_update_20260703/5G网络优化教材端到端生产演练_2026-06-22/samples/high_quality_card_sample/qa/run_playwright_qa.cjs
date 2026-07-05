const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const sampleDir = path.resolve(__dirname, "..");
const qaDir = __dirname;
const url = `file://${path.join(sampleDir, "index.html")}`;

async function checkViewport(browser, name, viewport) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (["error", "warning"].includes(msg.type())) {
      consoleErrors.push(`${msg.type()}: ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(400);

  const initial = await page.evaluate(() => ({
    title: document.title,
    cardTitle: document.querySelector("#cardTitle")?.textContent?.trim(),
    navCount: document.querySelectorAll("#cardNav li").length,
    progressText: document.querySelector("#progressText")?.textContent?.trim(),
    evidenceTitle: document.querySelector(".evidence-panel h2")?.textContent?.trim(),
    missionTitle: document.querySelector("#missionTitle")?.textContent?.trim(),
    imageCount: document.images.length,
    badImages: Array.from(document.images).filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.getAttribute("src")),
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    studentActive: document.querySelector("#studentView")?.classList.contains("active"),
  }));

  const screenshotPath = path.join(qaDir, `${name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  await page.click("#selfStudyMode");
  await page.waitForTimeout(100);
  const selfStudyMode = await page.evaluate(() => ({
    active: document.querySelector("#selfStudyMode")?.classList.contains("active"),
    panelText: document.querySelector("#modePanel")?.textContent || "",
  }));

  await page.click('[data-index="8"]');
  await page.waitForTimeout(300);
  const imageCard = await page.evaluate(() => ({
    cardTitle: document.querySelector("#cardTitle")?.textContent?.trim(),
    imageCount: document.images.length,
    badImages: Array.from(document.images).filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.getAttribute("src")),
  }));

  await page.click('[data-index="0"]');
  await page.waitForTimeout(100);
  await page.click("#nextCard");
  await page.waitForTimeout(100);
  const secondTitle = await page.textContent("#cardTitle");

  await page.click("#completeCard");
  await page.waitForTimeout(100);
  const feedbackVisible = await page.evaluate(() => !document.querySelector("#feedbackBox")?.hidden);

  await page.click('[data-view="teacher"]');
  await page.waitForTimeout(100);
  const teacherVisible = await page.evaluate(() => document.querySelector("#teacherView")?.classList.contains("active"));

  await page.click('[data-view="trace"]');
  await page.waitForTimeout(100);
  const traceRows = await page.evaluate(() => document.querySelectorAll(".trace-table tbody tr").length);

  await page.close();

  return {
    viewport: name,
    screenshot: screenshotPath,
    ...initial,
    selfStudyMode,
    imageCard,
    secondTitle: secondTitle?.trim(),
    feedbackVisible,
    teacherVisible,
    traceRows,
    consoleErrors,
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [];
    results.push(await checkViewport(browser, "desktop", { width: 1440, height: 1000 }));
    results.push(await checkViewport(browser, "mobile", { width: 390, height: 900 }));
    const summary = {
      url,
      generatedAt: new Date().toISOString(),
      results,
      pass: results.every((item) =>
        item.cardTitle &&
        item.navCount === 11 &&
        item.progressText?.includes("/ 11") &&
        item.evidenceTitle === "我的证据链" &&
        item.missionTitle?.includes("模式") &&
        item.badImages.length === 0 &&
        item.selfStudyMode.active === true &&
        item.selfStudyMode.panelText.includes("自学模式补充") &&
        item.imageCard.cardTitle === "仿真截图能说明什么" &&
        item.imageCard.imageCount === 7 &&
        item.imageCard.badImages.length === 0 &&
        item.overflowX === false &&
        item.feedbackVisible === true &&
        item.teacherVisible === true &&
        item.traceRows === 12 &&
        item.consoleErrors.length === 0
      ),
    };
    fs.writeFileSync(path.join(qaDir, "playwright_qa_summary.json"), JSON.stringify(summary, null, 2), "utf8");
    console.log(JSON.stringify(summary, null, 2));
    process.exit(summary.pass ? 0 : 1);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
