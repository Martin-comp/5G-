const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const fileUrl = `file://${path.join(root, "index.html")}`;
const contentSamplePath = path.resolve(root, "../../reports/项目二内容闭环样稿V0.1.md");
const internalReviewPath = path.resolve(root, "../../reports/项目二内容闭环样稿内部评审报告V0.1.md");
const outDir = __dirname;
const localHeadlessShell = "/Users/ny/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell";

async function checkViewport(page, name, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(fileUrl);
  await page.waitForSelector(".workspace");

  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth + 1;
  });

  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
  return { name, width, height, overflow };
}

async function main() {
  const consoleErrors = [];
  const launchOptions = fs.existsSync(localHeadlessShell)
    ? { headless: true, executablePath: localHeadlessShell }
    : { headless: true };
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  const desktop = await checkViewport(page, "desktop", 1440, 960);
  const mobile = await checkViewport(page, "mobile", 390, 844);

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(fileUrl);
  await page.waitForSelector(".workspace");

  const checks = [];
  async function check(name, fn) {
    try {
      const value = await fn();
      checks.push({ name, pass: Boolean(value) });
    } catch (err) {
      checks.push({ name, pass: false, error: err.message });
    }
  }

  await check("页面标题包含阶段3项目二闭环复制验证原型", async () => {
    const text = await page.locator("body").innerText();
    return text.includes("阶段3项目二闭环复制验证原型");
  });

  await check("课程首页显示项目二闭环状态", async () => {
    const text = await page.locator(".workspace").innerText();
    return text.includes("项目二闭环任务")
      && text.includes("19")
      && text.includes("异常处理分支")
      && text.includes("P2-T3");
  });

  await check("项目视图显示项目二三任务闭环", async () => {
    await page.locator('[data-view="project"]').click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("P2-T1")
      && text.includes("P2-T2")
      && text.includes("P2-T3")
      && text.includes("项目二闭环复制验证")
      && text.includes("P2-T2不得设计成所有学生固定必经");
  });

  await check("项目视图显示正常主线和异常分支", async () => {
    await page.locator('[data-view="project"]').click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("测试数据交付包")
      && text.includes("GPS轨迹突然跳到校外")
      && text.includes("继续、补测、重测或升级")
      && text.includes("测试数据分析报告");
  });

  await check("项目视图不伪造P2-T3深样章入口", async () => {
    await page.locator('[data-view="project"]').click();
    const text = await page.locator(".workspace").innerText();
    const links = await page.locator(".deep-link").count();
    return text.includes("深样章候选") && links === 0;
  });

  await check("课程能力图谱显示项目二19个详细节点", async () => {
    await page.locator('[data-view="graph"]').click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("项目二闭环节点")
      && text.includes("P2T1-N01")
      && text.includes("P2T2-N04")
      && text.includes("P2T3-N08")
      && text.includes("19个详细节点");
  });

  await check("课程能力图谱节点可点击并显示关联任务", async () => {
    await page.locator('[data-view="graph"]').click();
    await page.locator('[data-graph="P2T1-N07"]').first().click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("整理LOG与测试数据交付包")
      && text.includes("关联任务")
      && text.includes("P2-T1")
      && text.includes("测试数据交付包");
  });

  await check("课程能力图谱显示四任务关系层和V2.1入口", async () => {
    await page.locator('[data-view="graph"]').click();
    const text = await page.locator(".workspace").innerText();
    const href = await page.locator('[data-link="relation-review"]').getAttribute("href");
    return text.includes("四任务关系层")
      && text.includes("P2-T3")
      && text.includes("P5-T3")
      && text.includes("P6-T2")
      && text.includes("不是完整定稿图谱")
      && href.includes("course_capability_graph_v2_relation_review");
  });

  await check("课程能力图谱节点邻域显示关系类型和评价产出", async () => {
    await page.locator('[data-view="graph"]').click();
    await page.locator('[data-graph-task="P2-T3"]').click();
    await page.locator('[data-graph="P2T3-N03"]').first().click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("节点邻域")
      && text.includes("识读关键指标")
      && text.includes("指标读法与边界表");
  });

  await check("教师视图显示P2-T2进入条件和P2-T3直达条件", async () => {
    await page.locator('[data-view="teacher"]').click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("何时直接进入P2-T3")
      && text.includes("何时进入P2-T2")
      && text.includes("通信专业复核")
      && text.includes("数据可用后进入P2-T3");
  });

  await check("资源中心显示项目二三任务资源和审核状态", async () => {
    await page.locator('[data-view="resources"]').click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("R-P2T1-01")
      && text.includes("R-P2T2-03")
      && text.includes("R-P2T3-04")
      && text.includes("LOG和GPS数据需脱敏")
      && text.includes("软件界面需教学化重绘");
  });

  await check("出版视图显示平台接口未接入和数据门禁", async () => {
    await page.locator('[data-view="publish"]').click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("平台接口")
      && text.includes("暂不接入真实出版社平台接口")
      && text.includes("真实LOG、GPS轨迹、设备照片和软件截图不得默认发布");
  });

  await check("项目二内容样稿和内部评审文件存在", async () => {
    return fs.existsSync(contentSamplePath) && fs.existsSync(internalReviewPath);
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(fileUrl);
  await page.waitForSelector(".workspace");
  await page.locator('[data-view="project"]').click();
  await page.screenshot({ path: path.join(outDir, "project_desktop.png"), fullPage: true });
  await page.locator('[data-view="graph"]').click();
  await page.screenshot({ path: path.join(outDir, "graph_desktop.png"), fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(fileUrl);
  await page.waitForSelector(".workspace");
  await page.locator('[data-view="graph"]').click();
  await page.screenshot({ path: path.join(outDir, "graph_mobile.png"), fullPage: true });

  await browser.close();

  const summary = {
    generatedAt: new Date().toISOString(),
    fileUrl,
    viewports: [desktop, mobile],
    consoleErrors,
    checks,
    pass: [desktop, mobile].every((item) => !item.overflow) && consoleErrors.length === 0 && checks.every((item) => item.pass)
  };

  fs.writeFileSync(path.join(outDir, "playwright_qa_summary.json"), JSON.stringify(summary, null, 2));

  if (!summary.pass) {
    console.error(JSON.stringify(summary, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
