const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { loadPlaywright } = require("./playwright_loader.cjs");
const { chromium } = loadPlaywright();

const root = path.resolve(__dirname, "..");
const outDir = path.join(__dirname, "graph_resource_qa_2026-06-27");
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

async function assertVisibleText(page, name, text) {
  record(name, await hasText(page, text), text);
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
  await page.locator(".view-tabs").getByRole("button", { name: "图谱", exact: true }).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, "01-layered-graph-default.png"), fullPage: true });

  record("图谱页出现分层关系图容器", await page.locator(".graph-stage").isVisible());
  record("图谱页不显示右侧上下文栏", !(await page.locator("#contextPanel").isVisible().catch(() => false)));
  await assertVisibleText(page, "出现课程主链层", "课程主链");
  await assertVisibleText(page, "出现重点项目路径层", "重点项目路径");
  await assertVisibleText(page, "出现能力节点层", "P2能力节点");
  await assertVisibleText(page, "出现资源卡片层", "资源卡片与评价产出");
  await assertVisibleText(page, "P2T3-N03默认挂接关键指标资源", "关键指标读法与边界表");

  const p2Resource = page.getByRole("button", { name: /关键指标读法与边界表/ });
  await p2Resource.click();
  await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(outDir, "02-resource-to-p2-node.png"), fullPage: true });
  await assertVisibleText(page, "点击P2资源后仍定位P2T3-N03", "P2T3-N03");
  const p2ActiveNode = await page.locator(".capability-node.is-active", { hasText: "P2T3-N03" }).count();
  record("P2资源反向高亮P2T3-N03能力节点", p2ActiveNode === 1, `active count: ${p2ActiveNode}`);

  await page.getByRole("button", { name: /端到端优化路径/ }).click();
  await page.waitForTimeout(120);
  await page.locator(".capability-node", { hasText: "P4T2-N01" }).click();
  await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(outDir, "03-p4t2-node-resource.png"), fullPage: true });
  await assertVisibleText(page, "P4T2-N01显示P4-T2学习任务页资源", "P4-T2学习任务页");

  await page.getByRole("button", { name: /报告证据链清单/ }).click();
  await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(outDir, "04-resource-to-p4t3-node.png"), fullPage: true });
  await assertVisibleText(page, "点击P4-T3资源后显示P4T3-N02", "P4T3-N02");
  const p4ActiveNode = await page.locator(".capability-node.is-active", { hasText: "P4T3-N02" }).count();
  record("P4资源反向高亮P4T3-N02能力节点", p4ActiveNode === 1, `active count: ${p4ActiveNode}`);

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
  fs.writeFileSync(path.join(outDir, "graph_resource_qa_summary.json"), JSON.stringify(summary, null, 2));

  if (!summary.pass) {
    console.error(JSON.stringify(summary, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify(summary, null, 2));
})();
