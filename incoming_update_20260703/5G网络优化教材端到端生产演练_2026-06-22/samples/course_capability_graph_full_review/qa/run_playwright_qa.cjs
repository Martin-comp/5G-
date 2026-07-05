const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const fileUrl = `file://${path.join(root, "index.html")}`;
const localHeadlessShell = "/Users/ny/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell";

async function checkViewport(page, name, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(fileUrl, { waitUntil: "load" });
  await page.waitForSelector(".course-chain");
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
  await page.waitForSelector(".course-chain");

  const checks = [];
  async function check(name, fn) {
    try {
      checks.push({ name, pass: Boolean(await fn()) });
    } catch (err) {
      checks.push({ name, pass: false, error: err.message });
    }
  }

  await check("显示7个课程主链节点", async () => await page.locator(".chain-node").count() === 7);
  await check("显示6个项目列", async () => await page.locator(".project-column").count() === 6);
  await check("显示18个任务节点", async () => await page.locator(".task-button").count() === 18);
  await check("显示8个P4-T2详细能力节点", async () => await page.locator(".deep-button").count() === 8);
  await check("点击P4T2-N07显示验收结论", async () => {
    await page.locator('[data-deep-node="P4T2-N07"]').click();
    return (await page.locator("#detailPanel").innerText()).includes("形成验收结论");
  });
  await check("点击CG-02显示网络测试评审问题", async () => {
    await page.locator('[data-chain="CG-02"]').click();
    const text = await page.locator("#detailPanel").innerText();
    return text.includes("网络测试") && text.includes("评审问题");
  });
  await check("关键跨层关系不少于6条", async () => await page.locator(".cross-card").count() >= 6);

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
