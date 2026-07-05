const fs = require("fs");
const http = require("http");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const samplesRoot = path.resolve(root, "..");
const fileUrl = pathToFileURL(path.join(root, "index.html")).href;
const deepSamplePath = path.resolve(root, "../task_workbench_3_5a1_two_period_sample/index.html");
const stage2Path = path.resolve(root, "../digital_textbook_overall_prototype_phase2_p4_loop/index.html");
const stage3Path = path.resolve(root, "../digital_textbook_overall_prototype_phase3_p2_loop/index.html");
const relationReviewPath = path.resolve(root, "../course_capability_graph_v2_relation_review/index.html");
const deepSampleMirrorPath = path.join(root, "task_workbench_3_5a1_two_period_sample/index.html");
const relationReviewMirrorPath = path.join(root, "course_capability_graph_v2_relation_review/index.html");
const deepSampleUrl = pathToFileURL(deepSamplePath).href;
const relationReviewUrl = pathToFileURL(relationReviewPath).href;
const deepSampleMirrorUrl = pathToFileURL(deepSampleMirrorPath).href;
const relationReviewMirrorUrl = pathToFileURL(relationReviewMirrorPath).href;
const previewServerBase = "http://127.0.0.1:8765";
const deepSamplePreviewUrl = `${previewServerBase}/task_workbench_3_5a1_two_period_sample/index.html`;
const relationReviewPreviewUrl = `${previewServerBase}/course_capability_graph_v2_relation_review/index.html`;
const outDir = __dirname;
const localHeadlessShell = "/Users/ny/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell";

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

function startPreviewServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const parsed = new URL(req.url, previewServerBase);
      const decodedPath = decodeURIComponent(parsed.pathname);
      const normalized = path.normalize(decodedPath).replace(/^[/\\]+/, "");
      const target = path.join(samplesRoot, normalized);
      if (!target.startsWith(samplesRoot)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      fs.readFile(target, (err, body) => {
        if (err) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        res.writeHead(200, { "content-type": contentType(target) });
        res.end(body);
      });
    });
    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") resolve(null);
      else reject(err);
    });
    server.listen(8765, "127.0.0.1", () => resolve(server));
  });
}

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
  const previewServer = await startPreviewServer();
  const launchOptions = fs.existsSync(localHeadlessShell)
    ? { headless: true, executablePath: localHeadlessShell }
    : { headless: true };
  const browser = await chromium.launch(launchOptions);

  function attachPageLogging(nextPage) {
    nextPage.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    nextPage.on("pageerror", (err) => consoleErrors.push(err.message));
  }

  async function openOverallPage(width = 1280, height = 900) {
    const nextPage = await browser.newPage({ viewport: { width, height } });
    attachPageLogging(nextPage);
    await nextPage.goto(fileUrl);
    await nextPage.waitForSelector(".workspace");
    return nextPage;
  }

  const page = await browser.newPage();
  attachPageLogging(page);

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

  async function checkClickNavigation(name, setup, locator, expectedUrls, expectedText) {
    await check(name, async () => {
      const navPage = await openOverallPage();
      await setup(navPage);
      await navPage.locator(locator).first().click();
      await navPage.waitForLoadState("load");
      await navPage.waitForTimeout(250);
      const text = await navPage.locator("body").innerText();
      const acceptedUrls = Array.isArray(expectedUrls) ? expectedUrls : [expectedUrls];
      const ok = acceptedUrls.includes(navPage.url()) && text.includes(expectedText);
      await navPage.close();
      return ok;
    });
  }

  await check("页面显示overall-0.5整书综合母版定位", async () => {
    const text = await page.locator("body").innerText();
    return text.includes("整书综合母版 overall-0.5")
      && text.includes("项目二闭环")
      && text.includes("项目四闭环")
      && text.includes("P4-T2深样章");
  });

  await check("课程首页显示两个已接入闭环和深样章状态", async () => {
    const text = await page.locator(".workspace").innerText();
    const directDeepLink = await page.locator('[data-link="deep-sample-course"]').getAttribute("href");
    return text.includes("已接入闭环")
      && text.includes("项目二")
      && text.includes("项目四")
      && text.includes("任务级深样章")
      && text.includes("深样章候选")
      && directDeepLink.includes("task_workbench_3_5a1_two_period_sample");
  });

  await check("Safari file预览下深样章入口改走同目录镜像路径", async () => {
    const directDeepLink = await page.locator('[data-link="deep-sample-course"]').getAttribute("href");
    return directDeepLink === "./task_workbench_3_5a1_two_period_sample/index.html";
  });

  await checkClickNavigation(
    "课程首页深样章入口可点击打开",
    async () => {},
    '[data-link="deep-sample-course"]',
    [deepSampleUrl, deepSampleMirrorUrl, deepSamplePreviewUrl],
    "5G网络优化结果验证样章3.5A-1"
  );

  await check("项目二视图显示正常主线和异常分支", async () => {
    await page.locator('[data-view="project"]').click();
    const text = await page.locator(".workspace").innerText();
    const deepLinks = await page.locator(".workspace .deep-link").count();
    return text.includes("P2-T1")
      && text.includes("P2-T2")
      && text.includes("P2-T3")
      && text.includes("异常处理分支")
      && text.includes("P2-T3任务级深样章候选")
      && deepLinks === 0;
  });

  await check("项目四视图显示P4-T2深样章入口", async () => {
    await page.locator('[data-project="P4"]').click();
    const text = await page.locator(".workspace").innerText();
    const href = await page.locator(".workspace .deep-link").first().getAttribute("href");
    return text.includes("P4-T1")
      && text.includes("P4-T2")
      && text.includes("P4-T3")
      && text.includes("任务级深样章")
      && href.includes("task_workbench_3_5a1_two_period_sample");
  });

  await checkClickNavigation(
    "项目四任务链深样章入口可点击打开",
    async (navPage) => {
      await navPage.locator('[data-project="P4"]').click();
      await navPage.waitForSelector('[data-link="deep-sample-task"]');
    },
    '[data-link="deep-sample-task"]',
    [deepSampleUrl, deepSampleMirrorUrl, deepSamplePreviewUrl],
    "5G网络优化结果验证样章3.5A-1"
  );

  await check("版本入口链接到旧原型和深样章", async () => {
    const hrefs = await page.locator(".version-link").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    return hrefs.some((href) => href.includes("digital_textbook_overall_prototype/index.html"))
      && hrefs.some((href) => href.includes("digital_textbook_overall_prototype_phase2_p4_loop"))
      && hrefs.some((href) => href.includes("digital_textbook_overall_prototype_phase3_p2_loop"))
      && hrefs.some((href) => href.includes("task_workbench_3_5a1_two_period_sample"));
  });

  await checkClickNavigation(
    "版本入口深样章可点击打开",
    async (navPage) => {
      await navPage.locator('[data-project="P4"]').click();
      await navPage.waitForSelector('[data-link="deep-sample-version"]');
    },
    '[data-link="deep-sample-version"]',
    [deepSampleUrl, deepSampleMirrorUrl, deepSamplePreviewUrl],
    "5G网络优化结果验证样章3.5A-1"
  );

  await check("图谱页显示项目二19节点和项目四20节点", async () => {
    await page.locator('[data-view="graph"]').click();
    const text = await page.locator(".workspace").innerText();
    const href = await page.locator('[data-link="relation-review"]').getAttribute("href");
    return text.includes("项目二节点")
      && text.includes("项目四节点")
      && text.includes("P2T1-N01")
      && text.includes("P2T3-N08")
      && text.includes("P4T1-N01")
      && text.includes("P4T3-N06")
      && text.includes("19个节点")
      && text.includes("20个节点")
      && href.includes("course_capability_graph_v2_relation_review");
  });

  await checkClickNavigation(
    "V2.1关系评审入口可点击打开",
    async (navPage) => {
      await navPage.locator('[data-view="graph"]').click();
      await navPage.waitForSelector('[data-link="relation-review"]');
    },
    '[data-link="relation-review"]',
    [relationReviewUrl, relationReviewMirrorUrl, relationReviewPreviewUrl],
    "课程能力图谱V2.1关系可视化评审版"
  );

  await check("图谱节点可点击并显示评价产出", async () => {
    await page.locator('[data-view="graph"]').click();
    await page.locator('[data-graph="P4T2-N07"]').first().click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("形成验收结论")
      && text.includes("四段式验收结论")
      && text.includes("P4-T2");
  });

  await check("教师视图说明两个课堂入口", async () => {
    await page.locator('[data-view="teacher"]').click();
    const text = await page.locator(".workspace").innerText();
    const href = await page.locator('[data-link="deep-sample-teacher"]').getAttribute("href");
    return text.includes("学测试分析")
      && text.includes("学结果验证")
      && text.includes("P4-T2")
      && text.includes("P2-T3")
      && href.includes("task_workbench_3_5a1_two_period_sample");
  });

  await checkClickNavigation(
    "教师视图深样章入口可点击打开",
    async (navPage) => {
      await navPage.locator('[data-view="teacher"]').click();
      await navPage.waitForSelector('[data-link="deep-sample-teacher"]');
    },
    '[data-link="deep-sample-teacher"]',
    [deepSampleUrl, deepSampleMirrorUrl, deepSamplePreviewUrl],
    "5G网络优化结果验证样章3.5A-1"
  );

  await check("资源中心合并项目二和项目四资源", async () => {
    await page.locator('[data-view="resources"]').click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("R-P2T1-01")
      && text.includes("R-P2T3-02")
      && text.includes("R-P4T1-01")
      && text.includes("R-P4T2-01")
      && text.includes("不可默认发布");
  });

  await check("出版视图显示平台接口和候选深样章边界", async () => {
    await page.locator('[data-view="publish"]').click();
    const text = await page.locator(".workspace").innerText();
    return text.includes("overall-0.5只能称为整书综合母版原型")
      && text.includes("P2-T3只能称为任务级深样章候选")
      && text.includes("出版社平台接口未接入");
  });

  await check("被挂接的旧原型和深样章文件存在", async () => {
    return fs.existsSync(deepSamplePath) && fs.existsSync(deepSampleMirrorPath) && fs.existsSync(stage2Path) && fs.existsSync(stage3Path) && fs.existsSync(relationReviewPath) && fs.existsSync(relationReviewMirrorPath);
  });

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(fileUrl);
  await page.waitForSelector(".workspace");
  await page.locator('[data-view="project"]').click();
  await page.screenshot({ path: path.join(outDir, "project_desktop.png"), fullPage: true });
  await page.locator('[data-project="P4"]').click();
  await page.screenshot({ path: path.join(outDir, "project_p4_desktop.png"), fullPage: true });
  await page.locator('[data-view="graph"]').click();
  await page.screenshot({ path: path.join(outDir, "graph_desktop.png"), fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(fileUrl);
  await page.waitForSelector(".workspace");
  await page.locator('[data-view="graph"]').click();
  await page.screenshot({ path: path.join(outDir, "graph_mobile.png"), fullPage: true });

  await browser.close();
  if (previewServer) await new Promise((resolve) => previewServer.close(resolve));

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
