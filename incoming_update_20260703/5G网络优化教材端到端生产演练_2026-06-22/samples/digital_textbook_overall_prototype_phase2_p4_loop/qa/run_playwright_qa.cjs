const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const fileUrl = `file://${path.join(root, "index.html")}`;
const deepSamplePath = path.resolve(root, "../task_workbench_3_5a1_two_period_sample/index.html");
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

  await check("页面标题包含阶段2项目四闭环原型", async () => (await page.locator("body").innerText()).includes("阶段2项目四闭环原型"));
  await check("课程首页显示项目四闭环状态", async () => {
    const text = await page.locator(".workspace").innerText();
    return text.includes("项目四闭环任务") && text.includes("20") && text.includes("轻量样稿");
  });
  await check("项目视图显示项目四三任务闭环和深样章入口", async () => {
    await page.locator('[data-view="project"]').click();
    const text = await page.locator(".workspace").innerText();
    const href = await page.locator(".deep-link").first().getAttribute("href");
    return text.includes("P4-T1")
      && text.includes("P4-T2")
      && text.includes("P4-T3")
      && text.includes("项目四小范围内容闭环")
      && href.includes("task_workbench_3_5a1_two_period_sample");
  });
  await check("项目视图显示P4-T1和P4-T3轻量教材样稿", async () => {
    await page.locator('[data-view="project"]').click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("宿舍区晚高峰视频卡顿")
      && text.includes("学生不能只套模板")
      && text.includes("优化实施记录与复测验证交接清单")
      && text.includes("优化报告样稿与沟通提纲");
  });
  await check("课程能力图谱节点可点击并显示关联任务", async () => {
    await page.locator('[data-view="graph"]').click();
    await page.locator('[data-graph-task="P4-T2"]').click();
    await page.locator('[data-graph="P4T2-N07"]').first().click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("形成验收结论") && text.includes("关联任务") && text.includes("P4-T2");
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
  await check("课程能力图谱显示项目四20个详细节点", async () => {
    await page.locator('[data-view="graph"]').click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("项目四闭环节点")
      && text.includes("P4T1-N01")
      && text.includes("P4T2-N08")
      && text.includes("P4T3-N06");
  });
  await check("课程能力图谱节点邻域显示关系类型和评价产出", async () => {
    await page.locator('[data-view="graph"]').click();
    await page.locator('[data-graph-task="P5-T3"]').click();
    await page.locator('[data-graph="P5T3-N03"]').click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("节点邻域")
      && text.includes("直接递进")
      && text.includes("支撑判断")
      && text.includes("优化前后KPI对比表");
  });
  await check("教师视图显示外部门禁", async () => {
    await page.locator('[data-view="teacher"]').click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("任务1课堂组织") && text.includes("任务3课堂组织") && text.includes("通信专业复核");
  });
  await check("资源中心显示项目四三任务资源和审核状态", async () => {
    await page.locator('[data-view="resources"]').click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("R-P4T1-01")
      && text.includes("R-01")
      && text.includes("R-P4T3-01")
      && text.includes("不可默认发布");
  });
  await check("出版视图显示平台接口未接入", async () => {
    await page.locator('[data-view="publish"]').click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("平台接口") && text.includes("暂不接入真实出版社平台接口");
  });
  await check("深样章目标文件存在", async () => fs.existsSync(deepSamplePath));

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
