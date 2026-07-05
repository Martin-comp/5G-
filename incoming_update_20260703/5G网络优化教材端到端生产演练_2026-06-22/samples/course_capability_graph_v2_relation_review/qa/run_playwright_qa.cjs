const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const fileUrl = `file://${path.join(root, "index.html")}`;
const localHeadlessShell = "/Users/ny/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell";

async function checkViewport(page, name, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(fileUrl, { waitUntil: "load" });
  await page.waitForSelector(".task-columns");
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

  const desktop = await checkViewport(page, "desktop", 1440, 980);
  const mobile = await checkViewport(page, "mobile", 390, 844);

  await page.setViewportSize({ width: 1360, height: 920 });
  await page.goto(fileUrl, { waitUntil: "load" });
  await page.waitForSelector(".task-columns");

  const checks = [];
  async function check(name, fn) {
    try {
      checks.push({ name, pass: Boolean(await fn()) });
    } catch (err) {
      checks.push({ name, pass: false, error: err.message });
    }
  }

  await check("显示4个任务列", async () => await page.locator(".task-column").count() === 4);
  await check("显示30个详细节点", async () => await page.locator(".node-card").count() === 30);
  await check("默认显示核心关系筛选", async () => {
    const text = await page.locator(".filter-row .is-active").innerText();
    return text.includes("核心关系");
  });
  await check("默认进入节点邻域视图", async () => {
    const text = await page.locator("#modeControls .is-active").innerText();
    return text.includes("节点邻域");
  });
  await check("默认只绘制少量当前节点关系线", async () => {
    const count = await page.locator(".edge-path").count();
    return count > 0 && count <= 8;
  });
  await check("箭头使用固定小尺寸", async () => await page.evaluate(() => {
    const markers = Array.from(document.querySelectorAll("marker"));
    return markers.length >= 6 &&
      markers.every((marker) => marker.getAttribute("markerUnits") === "userSpaceOnUse") &&
      markers.every((marker) => Number(marker.getAttribute("markerWidth")) <= 8) &&
      markers.every((marker) => marker.querySelector("path")?.getAttribute("fill") === "none");
  }));
  await check("默认图谱说明给出可见线数量", async () => {
    const text = await page.locator("#graphHint").innerText();
    return text.includes("图中可见") && text.includes("完整清单");
  });
  await check("点击P5T3-N06显示进入AU-10的回流关系", async () => {
    await page.locator('[data-node="P5T3-N06"]').click();
    const text = await page.locator("#nodeDetail").innerText();
    return text.includes("AU-10") && text.includes("复杂复盘");
  });
  await check("节点邻域视图被激活", async () => {
    const text = await page.locator("#modeControls .is-active").innerText();
    return text.includes("节点邻域");
  });
  await check("点击问题回流筛选显示关系清单", async () => {
    await page.locator('[data-relation="问题回流"]').click();
    const table = await page.locator("#edgeTable").innerText();
    return table.includes("问题回流") && table.includes("P6");
  });
  await check("点击P6T2-N07显示AU-10评价关系", async () => {
    await page.locator('[data-node="P6T2-N07"]').click();
    const text = await page.locator("#nodeDetail").innerText();
    return text.includes("AU-10") && text.includes("评价");
  });
  await check("关系清单包含复核状态", async () => {
    await page.locator('[data-relation="核心关系"]').click();
    const text = await page.locator("#edgeTable").innerText();
    return text.includes("待专业复核") || text.includes("内部试拆") || text.includes("待媒体审查");
  });

  await page.screenshot({ path: path.join(__dirname, "neighborhood_desktop.png"), fullPage: true });
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
