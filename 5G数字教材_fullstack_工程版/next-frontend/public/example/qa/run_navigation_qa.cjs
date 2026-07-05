const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { loadPlaywright } = require("./playwright_loader.cjs");
const { chromium } = loadPlaywright();

const root = path.resolve(__dirname, "..");
const outDir = path.join(__dirname, "navigation_qa_2026-06-29_expert_absorption");
fs.mkdirSync(outDir, { recursive: true });

const executablePath = "/Users/ny/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell";
const url = pathToFileURL(path.join(root, "index.html")).href;

const checks = [];
const consoleErrors = [];

function record(name, pass, details = "") {
  checks.push({ name, pass, details });
}

async function hasText(page, text) {
  return (await page.locator(`text=${text}`).count()) > 0;
}

async function clickTab(page, label) {
  await page.locator(".view-tabs").getByRole("button", { name: label, exact: true }).click();
  await page.waitForTimeout(120);
}

async function assertVisibleText(page, name, text) {
  record(name, await hasText(page, text), text);
}

async function assertNotInLeftRail(page, name, text) {
  const left = page.locator("#leftRail");
  const visible = await left.isVisible().catch(() => false);
  const found = visible ? await left.locator(`text=${text}`).count() : 0;
  record(name, found === 0, `${text} in left rail: ${found}`);
}

(async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 980 } });

  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      consoleErrors.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => consoleErrors.push(`pageerror: ${error.message}`));

  await page.goto(url, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(outDir, "01-course-home.png"), fullPage: true });
  const mainTabs = await page.locator(".view-tabs .tab").allTextContents();
  record("顶部主导航只保留四项", JSON.stringify(mainTabs) === JSON.stringify(["课程", "项目", "图谱", "教师"]), mainTabs.join(", "));
  record("顶部主导航不显示资源", !mainTabs.includes("资源"), mainTabs.join(", "));
  record("顶部主导航不显示交付", !mainTabs.includes("交付"), mainTabs.join(", "));
  await assertVisibleText(page, "存在平台支持辅助入口", "平台支持");
  record("课程页左侧栏隐藏", !(await page.locator("#leftRail").isVisible().catch(() => false)));
  await assertVisibleText(page, "课程页右侧为学习入口", "学习入口");
  await assertNotInLeftRail(page, "课程页左侧不显示项目目录", "项目目录");

  await clickTab(page, "项目");
  await page.screenshot({ path: path.join(outDir, "02-project-view.png"), fullPage: true });
  await assertVisibleText(page, "项目页显示项目目录", "项目目录");
  await assertVisibleText(page, "项目页右侧为项目上下文", "项目上下文");
  await assertVisibleText(page, "项目页包含P1项目按钮", "P1 5G网络信息采集");
  await assertVisibleText(page, "项目页包含P6项目按钮", "P6 5G信令分析");

  await clickTab(page, "图谱");
  await page.screenshot({ path: path.join(outDir, "03-graph-view.png"), fullPage: true });
  await assertVisibleText(page, "图谱页左侧为图谱导航", "图谱导航");
  record("图谱页不显示右侧上下文栏", !(await page.locator("#contextPanel").isVisible().catch(() => false)));
  await assertNotInLeftRail(page, "图谱页左侧不显示项目目录", "项目目录");
  await page.locator("#leftRail").getByRole("button", { name: /CG-04/ }).click();
  await page.waitForTimeout(120);
  await assertVisibleText(page, "图谱左侧节点点击可更新图谱主体", "CG-04 优化实施");

  await clickTab(page, "教师");
  await page.screenshot({ path: path.join(outDir, "04-teacher-view.png"), fullPage: true });
  await assertVisibleText(page, "教师页左侧为教师工作流", "教师工作流");
  await assertVisibleText(page, "教师页右侧为教师上下文", "教师上下文");
  await assertVisibleText(page, "教师页主标题为任务组织讲评复核", "任务组织、讲评与复核");
  await assertVisibleText(page, "教师页出现AI预生成口径", "AI预生成");
  record("教师页不以教师带教为标题", !(await hasText(page, "教师带教视图")));
  await page.locator("#leftRail").getByRole("button", { name: /讲评反馈建议/ }).click();
  await page.waitForTimeout(120);
  await assertVisibleText(page, "教师工作流点击可更新上下文", "讲评反馈建议");

  await page.getByRole("button", { name: "平台支持", exact: true }).click();
  await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(outDir, "05-platform-support-resource.png"), fullPage: true });
  await assertVisibleText(page, "平台支持默认显示任务资源映射", "任务资源映射");
  await assertVisibleText(page, "平台支持显示资源到评价产出", "评价产出");
  await page.locator(".support-tabs").getByRole("button", { name: /素材子平台说明/ }).click();
  await page.waitForTimeout(120);
  await assertVisibleText(page, "平台支持可切换素材子平台说明", "素材入库");
  await page.locator(".support-tabs").getByRole("button", { name: /交付说明/ }).click();
  await page.waitForTimeout(120);
  await assertVisibleText(page, "平台支持可切换交付说明", "资源包输出");

  await page.goto(url, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: /进入P4-T2优化结果验证/ }).click();
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: path.join(outDir, "06-task-student.png"), fullPage: true });
  await assertVisibleText(page, "任务页返回入口明确", "返回整书首页");
  await assertVisibleText(page, "任务页第三页签为任务资源", "任务资源");
  await assertVisibleText(page, "任务页第二页签为任务组织", "任务组织");
  record("任务页不显示教师带教页签", !(await hasText(page, "教师带教")));
  record("任务页不再使用资源清单页签", !(await hasText(page, "资源清单")));
  await assertVisibleText(page, "任务页图谱按钮为局部图谱", "本任务图谱");
  await page.getByRole("button", { name: "本任务图谱" }).click();
  await page.waitForTimeout(120);
  await assertVisibleText(page, "任务图谱弹窗标明局部图谱", "本任务局部图谱");

  await browser.close();

  record("控制台无错误", consoleErrors.length === 0, consoleErrors.join("\n"));

  const summary = {
    checkedAt: new Date().toISOString(),
    url,
    executablePath,
    checks,
    consoleErrors,
    screenshots: fs.readdirSync(outDir).filter((name) => name.endsWith(".png")).sort(),
    pass: checks.every((item) => item.pass)
  };
  fs.writeFileSync(path.join(outDir, "navigation_qa_summary.json"), JSON.stringify(summary, null, 2));

  if (!summary.pass) {
    console.error(JSON.stringify(summary, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify(summary, null, 2));
})();
