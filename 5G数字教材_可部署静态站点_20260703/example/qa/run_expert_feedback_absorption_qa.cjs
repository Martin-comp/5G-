const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { loadPlaywright } = require("./playwright_loader.cjs");
const { chromium } = loadPlaywright();

const root = path.resolve(__dirname, "..");
const outDir = path.join(__dirname, "expert_feedback_absorption_qa_2026-06-29");
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

async function clickMainTab(page, label) {
  await page.locator(".view-tabs").getByRole("button", { name: label, exact: true }).click();
  await page.waitForTimeout(120);
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
  await page.screenshot({ path: path.join(outDir, "01-clean-preview-home.png"), fullPage: true });

  const tabs = await page.locator(".view-tabs .tab").allTextContents();
  record("一级导航精简为课程项目图谱教师", JSON.stringify(tabs) === JSON.stringify(["课程", "项目", "图谱", "教师"]), tabs.join(","));
  record("一级导航没有资源", !tabs.includes("资源"), tabs.join(","));
  record("一级导航没有交付", !tabs.includes("交付"), tabs.join(","));
  record("平台支持辅助入口可见", await hasText(page, "平台支持"));

  await page.getByRole("button", { name: "平台支持", exact: true }).click();
  await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(outDir, "02-platform-support.png"), fullPage: true });
  record("平台支持包含任务资源映射", await hasText(page, "任务资源映射"));
  record("平台支持包含素材子平台说明", await hasText(page, "素材子平台说明"));
  record("平台支持包含交付说明", await hasText(page, "交付说明"));
  await page.locator(".support-tabs").getByRole("button", { name: /素材子平台说明/ }).click();
  await page.waitForTimeout(120);
  record("平台支持说明素材子平台未真实开发", await hasText(page, "不表示后台系统已经真实开发完成"));

  await clickMainTab(page, "教师");
  await page.screenshot({ path: path.join(outDir, "03-ai-teacher.png"), fullPage: true });
  record("教师页标题为任务组织讲评复核", await hasText(page, "任务组织、讲评与复核"));
  record("教师页说明AI预生成", await hasText(page, "AI预生成"));
  record("教师页说明教师审核确认", await hasText(page, "教师审核确认"));
  record("教师页出现AI建议状态", await hasText(page, "AI已生成，待教师确认"));
  record("主教师页不显示教师带教视图", !(await hasText(page, "教师带教视图")));
  record("主教师页不显示课前准备一级流程", !(await hasText(page, "课前准备")));

  await clickMainTab(page, "图谱");
  await page.getByRole("button", { name: /端到端优化路径/ }).click();
  await page.waitForTimeout(120);
  await page.getByRole("button", { name: /P4-T2学习任务页/ }).click();
  await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(outDir, "04-graph-resource-link.png"), fullPage: true });
  record("图谱节点能显示资源挂接", await hasText(page, "资源挂接"));
  record("资源卡片能显示学习活动", await hasText(page, "学习活动"));
  record("资源卡片能显示评价产出", await hasText(page, "评价产出"));

  await page.goto(url, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: /进入P4-T2优化结果验证/ }).click();
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: path.join(outDir, "05-task-student.png"), fullPage: true });
  record("P4-T2任务页有任务组织页签", await hasText(page, "任务组织"));
  record("P4-T2任务页不显示教师带教", !(await hasText(page, "教师带教")));
  await page.getByRole("button", { name: "任务组织", exact: true }).click();
  await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(outDir, "06-task-teacher-ai.png"), fullPage: true });
  record("P4-T2教师页显示AI教学组织", await hasText(page, "AI教学组织"));
  record("P4-T2教师页显示AI建议与教师确认", await hasText(page, "AI建议与教师确认"));
  record("P4-T2教师页显示复核建议", await hasText(page, "复核建议"));

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
  fs.writeFileSync(path.join(outDir, "expert_feedback_absorption_qa_summary.json"), JSON.stringify(summary, null, 2));

  if (!summary.pass) {
    console.error(JSON.stringify(summary, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify(summary, null, 2));
})();
