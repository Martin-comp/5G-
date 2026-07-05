const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const fileUrl = `file://${path.join(root, "index.html")}`;
const localHeadlessShell = "/Users/ny/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell";

async function checkViewport(page, name, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(fileUrl, { waitUntil: "load" });
  await page.waitForSelector(".job-chain");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  await page.screenshot({ path: path.join(__dirname, `${name}.png`), fullPage: true });
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
  await page.goto(fileUrl, { waitUntil: "load" });
  await page.waitForSelector(".job-chain");

  const checks = [];
  async function check(name, fn) {
    try {
      checks.push({ name, pass: Boolean(await fn()) });
    } catch (err) {
      checks.push({ name, pass: false, error: err.message });
    }
  }

  await check("显示4个依据层节点", async () => await page.locator(".basis-card").count() === 4);
  await check("显示7个岗位工作过程节点", async () => await page.locator(".job-node").count() === 7);
  await check("显示4个四任务链条节点", async () => await page.locator(".task-step").count() === 4);
  await check("显示10个能力单元", async () => await page.locator(".ability-card").count() === 10);
  await check("显示30个详细能力节点", async () => await page.locator(".deep-card").count() === 30);
  await check("显示8个P2-T3试拆节点", async () => await page.locator('[data-deep^="P2T3-"]').count() === 8);
  await check("显示8个P4-T2深节点", async () => await page.locator('[data-deep^="P4T2-"]').count() === 8);
  await check("显示7个P5-T3试拆节点", async () => await page.locator('[data-deep^="P5T3-"]').count() === 7);
  await check("显示7个P6-T2试拆节点", async () => await page.locator('[data-deep^="P6T2-"]').count() === 7);
  await check("四任务链条显示信令复盘", async () => {
    const text = await page.locator("#taskChain").innerText();
    return text.includes("P2-T3") && text.includes("P4-T2") && text.includes("P5-T3") && text.includes("P6-T2") && text.includes("信令复盘");
  });
  await check("点击AU-03显示P2-T3已试拆", async () => {
    await page.locator('[data-ability="AU-03"]').click();
    const text = await page.locator("#detailPanel").innerText();
    return text.includes("P2-T3已试拆") && text.includes("测试数据分析结论");
  });
  await check("节点详情以固定右侧抽屉打开", async () => {
    const detail = page.locator("#detailPanel");
    const css = await detail.evaluate((node) => {
      const style = window.getComputedStyle(node);
      return { position: style.position, right: style.right, open: node.classList.contains("is-open") };
    });
    return css.position === "fixed" && css.right === "0px" && css.open;
  });
  await check("抽屉打开时可直接切换其他节点", async () => {
    await page.locator('[data-process="JP-04"]').click();
    const text = await page.locator("#detailPanel").innerText();
    return text.includes("岗位工作过程") && text.includes("定位问题");
  });
  await check("右侧抽屉可关闭", async () => {
    await page.locator(".drawer-close").click();
    const state = await page.evaluate(() => ({
      open: document.querySelector("#detailPanel").classList.contains("is-open"),
      bodyLocked: document.body.classList.contains("drawer-open")
    }));
    return !state.open && !state.bodyLocked;
  });
  await check("点击AU-07显示资源活动评价审核", async () => {
    await page.locator('[data-ability="AU-07"]').click();
    const text = await page.locator("#detailPanel").innerText();
    return text.includes("资源类型") && text.includes("学习活动") && text.includes("评价产出") && text.includes("审核状态");
  });
  await check("点击AU-09显示有条件成立和待复核", async () => {
    await page.locator('[data-ability="AU-09"]').click();
    const text = await page.locator("#detailPanel").innerText();
    return text.includes("P5-T3已试拆") && text.includes("有条件成立") && text.includes("待专业复核");
  });
  await check("点击AU-10显示有条件成立和待复核", async () => {
    await page.locator('[data-ability="AU-10"]').click();
    const text = await page.locator("#detailPanel").innerText();
    return text.includes("P6-T2已试拆") && text.includes("有条件成立") && text.includes("待专业复核");
  });
  await check("点击JP-04显示岗位工作过程", async () => {
    await page.locator('[data-process="JP-04"]').click();
    const text = await page.locator("#detailPanel").innerText();
    return text.includes("岗位工作过程") && text.includes("定位问题");
  });
  await check("点击P4T2-N08显示职业表达评价", async () => {
    await page.locator('[data-deep="P4T2-N08"]').click();
    const text = await page.locator("#detailPanel").innerText();
    return text.includes("修正职业表达") && text.includes("修正后的职业表达");
  });
  await check("点击P2T3-N08显示分析报告评价", async () => {
    await page.locator('[data-deep="P2T3-N08"]').click();
    const text = await page.locator("#detailPanel").innerText();
    return text.includes("输出分析报告") && text.includes("测试数据分析报告");
  });
  await check("点击P5T3-N07显示全网性能提升验证报告", async () => {
    await page.locator('[data-deep="P5T3-N07"]').click();
    const text = await page.locator("#detailPanel").innerText();
    return text.includes("全网性能提升验证报告") && text.includes("资源状态");
  });
  await check("点击P6T2-N07显示信令分析报告和高风险", async () => {
    await page.locator('[data-deep="P6T2-N07"]').click();
    const text = await page.locator("#detailPanel").innerText();
    return text.includes("信令问题分析报告") && text.includes("高风险") && text.includes("待专业复核");
  });

  await page.screenshot({ path: path.join(__dirname, "drawer_desktop.png"), fullPage: true });

  await browser.close();

  const summary = {
    generatedAt: new Date().toISOString(),
    fileUrl,
    viewports: [desktop, mobile],
    consoleErrors,
    checks,
    pass: [desktop, mobile].every((item) => !item.overflow) && consoleErrors.length === 0 && checks.every((item) => item.pass)
  };

  fs.writeFileSync(path.join(__dirname, "playwright_qa_summary.json"), JSON.stringify(summary, null, 2));
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
