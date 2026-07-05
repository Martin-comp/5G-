const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const root = "/Users/ny/Downloads/5G网络优化教材端到端生产演练_2026-06-22";
const previewDir = path.join(root, "samples/digital_textbook_overall_prototype_overall_0_5_clean_preview");
const outDir = path.join(root, "reports/专家评审使用说明材料_2026-06-27/figures/screenshots_v0_2");
const executablePath = "/Users/ny/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell";
const { loadPlaywright } = require(path.join(previewDir, "qa/playwright_loader.cjs"));
const { chromium } = loadPlaywright();

fs.mkdirSync(outDir, { recursive: true });

async function clickTopTab(page, name) {
  await page.locator(".view-tabs").getByRole("button", { name, exact: true }).click();
  await page.waitForTimeout(250);
}

async function capture(page, fileName, fullPage = false) {
  await page.screenshot({
    path: path.join(outDir, fileName),
    fullPage
  });
}

(async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, deviceScaleFactor: 1 });
  const url = pathToFileURL(path.join(previewDir, "index.html")).href;

  await page.goto(url, { waitUntil: "networkidle" });
  await capture(page, "01_课程首页_整书入口.png");

  await clickTopTab(page, "项目");
  await capture(page, "02_项目页_项目链与学习路径.png");

  await page.locator("#leftRail").getByRole("button", { name: /P4/ }).click();
  await page.waitForTimeout(250);
  await capture(page, "03_项目页_项目四路径.png");

  await clickTopTab(page, "图谱");
  await capture(page, "04_图谱页_课程能力图谱分层关系.png", true);

  await page.getByRole("button", { name: /端到端优化路径/ }).click();
  await page.waitForTimeout(250);
  await capture(page, "05_图谱页_项目四能力节点与资源挂接.png", true);

  await clickTopTab(page, "教师");
  await capture(page, "06_教师页_整书教学组织入口.png");

  await page.getByRole("button", { name: "平台支持", exact: true }).click();
  await page.waitForTimeout(250);
  await capture(page, "07_平台支持_任务资源映射.png", true);

  await page.locator(".support-tabs").getByRole("button", { name: /素材子平台说明/ }).click();
  await page.waitForTimeout(250);
  await capture(page, "08_平台支持_素材子平台说明.png", true);

  await page.locator(".support-tabs").getByRole("button", { name: /交付说明/ }).click();
  await page.waitForTimeout(250);
  await capture(page, "09_平台支持_交付说明.png", true);

  await page.goto(url, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: /进入P4-T2优化结果验证/ }).click();
  await page.waitForLoadState("networkidle");
  await capture(page, "10_P4T2学生学习页_任务闭环.png");

  await page.getByRole("button", { name: "任务组织" }).click();
  await page.waitForTimeout(250);
  await capture(page, "11_P4T2任务组织页_课堂组织.png", true);

  await page.getByRole("button", { name: "任务资源" }).click();
  await page.waitForTimeout(250);
  await capture(page, "12_P4T2任务资源页_资源转化.png", true);

  await browser.close();
  console.log(JSON.stringify({
    outDir,
    screenshots: fs.readdirSync(outDir).filter((name) => name.endsWith(".png")).sort()
  }, null, 2));
})();
