const fs = require("fs");
const http = require("http");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

const overallDir = path.resolve(__dirname, "..");
const samplesDir = path.resolve(overallDir, "..");
const sampleDir = path.join(samplesDir, "task_workbench_3_5a1_two_period_sample");
const overallUrl = pathToFileURL(path.join(overallDir, "index.html")).href;
const sampleUrl = pathToFileURL(path.join(sampleDir, "index.html")).href;
const sampleMirrorUrl = pathToFileURL(path.join(overallDir, "task_workbench_3_5a1_two_period_sample/index.html")).href;
const previewServerBase = "http://127.0.0.1:8765";
const samplePreviewUrl = `${previewServerBase}/task_workbench_3_5a1_two_period_sample/index.html`;
const outDir = path.join(__dirname, "role_flow_audit_2026-06-27");
const localHeadlessShell = "/Users/ny/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell";

fs.mkdirSync(outDir, { recursive: true });

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
      const target = path.join(samplesDir, normalized);
      if (!target.startsWith(samplesDir)) {
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

function launchOptions() {
  return fs.existsSync(localHeadlessShell)
    ? { headless: true, executablePath: localHeadlessShell }
    : { headless: true };
}

function attachLogging(page, bucket) {
  page.on("console", (msg) => {
    if (msg.type() === "error") bucket.push(msg.text());
  });
  page.on("pageerror", (err) => bucket.push(err.message));
}

async function click(page, selector) {
  await page.locator(selector).first().click();
  await page.waitForTimeout(80);
}

async function screenshot(page, name) {
  const target = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: target, fullPage: true });
  return target;
}

function assertion(name, pass, detail = "") {
  return { name, pass: Boolean(pass), detail };
}

async function readBody(page) {
  return page.locator("body").innerText();
}

async function openOverall(browser, consoleErrors, viewport = { width: 1440, height: 960 }) {
  const page = await browser.newPage({ viewport });
  attachLogging(page, consoleErrors);
  await page.goto(overallUrl, { waitUntil: "load" });
  await page.waitForSelector(".workspace");
  return page;
}

async function openSample(browser, consoleErrors, viewport = { width: 1440, height: 960 }) {
  const page = await browser.newPage({ viewport });
  attachLogging(page, consoleErrors);
  await page.addInitScript(() => localStorage.clear());
  await page.goto(sampleUrl, { waitUntil: "load" });
  await page.waitForSelector(".hero");
  return page;
}

async function completeCase(page, caseIndex) {
  await click(page, `.case-tab[data-case-index="${caseIndex}"]`);
  if (caseIndex === 0) {
    for (const [id, category] of [
      ["web", "experience"],
      ["video", "experience"],
      ["live", "experience"],
      ["peak", "capacity"]
    ]) {
      await click(page, `[data-sort-id="${id}"][data-sort-category="${category}"]`);
    }
    await click(page, "#checkActivity");
    await page.fill('[data-revision-input="demo-dorm"]', "网页改善不能代表全部体验闭环，还要补看直播上行、视频卡顿和高峰容量。");
    return;
  }
  if (caseIndex === 1) {
    for (const id of ["scene", "coverage", "mobility", "conclusion"]) {
      await click(page, `[data-step-id="${id}"]`);
    }
    await click(page, "#checkActivity");
    await page.fill('[data-revision-input="contrast-canteen"]', "地下食堂静止覆盖达标，但移动路径切换和重建未闭环，不能直接验收通过。");
    return;
  }
  if (caseIndex === 2) {
    for (const [metric, value] of [
      ["avgRate", "support"],
      ["p95", "boundary"],
      ["prb", "boundary"],
      ["stuck", "boundary"]
    ]) {
      await click(page, `[data-mark-metric="${metric}"][data-mark-value="${value}"]`);
    }
    await click(page, "#checkActivity");
    await page.fill('[data-revision-input="contrast-lab"]', "平均速率改善只能作为通过依据之一，95分位、PRB和卡顿仍要写成边界。");
    return;
  }
  if (caseIndex === 3) {
    for (const [id, category] of [
      ["stand", "support"],
      ["pay", "support"],
      ["handover", "boundary"],
      ["before", "background"]
    ]) {
      await click(page, `[data-evidence-id="${id}"][data-evidence-category="${category}"]`);
    }
    await click(page, "#checkActivity");
    return;
  }
  if (caseIndex === 4) {
    for (const [slot, option] of [
      ["judgement", "partial"],
      ["evidence", "evidence"],
      ["boundary", "upload"],
      ["next", "retest"]
    ]) {
      await click(page, `[data-compose-slot="${slot}"][data-compose-option="${option}"]`);
    }
    await click(page, "#submitCompose");
  }
}

async function runStudentClassFlow(browser) {
  const consoleErrors = [];
  const checks = [];
  const shots = [];
  const page = await openOverall(browser, consoleErrors);

  shots.push(await screenshot(page, "01-student-class-overall-entry"));
  checks.push(assertion("整书首页存在P4-T2深样章直达入口", await page.locator('[data-link="deep-sample-course"]').count() === 1));
  await click(page, '[data-link="deep-sample-course"]');
  await page.waitForSelector(".hero");
  checks.push(assertion("学生可从整书入口进入任务级深样章", [sampleUrl, sampleMirrorUrl, samplePreviewUrl].includes(page.url()), page.url()));
  checks.push(assertion("深样章提供返回整书母版入口", await page.locator(".back-link").count() === 1));

  await click(page, "#resetLearning");
  const entryText = await page.locator(".learning-entry").innerText();
  checks.push(assertion("课堂首屏说明第一步、产出、完成标准和最终提交", entryText.includes("先做第1例") && entryText.includes("最终要形成")));
  checks.push(assertion("默认进入课堂带学模式", (await page.locator(".mode-panel").innerText()).includes("课堂组织")));
  shots.push(await screenshot(page, "02-student-class-first-screen"));

  for (let index = 0; index < 5; index += 1) {
    await completeCase(page, index);
  }
  const progressText = await page.locator(".side-panel").innerText();
  const finalText = await page.locator(".case-card").innerText();
  const revisionCount = await page.evaluate(() => {
    const raw = localStorage.getItem("p4t2_graph_driven_3_5a1_state") || "{}";
    const state = JSON.parse(raw);
    return ["demo-dorm", "contrast-canteen", "contrast-lab"]
      .filter((id) => String(state.activities?.[id]?.revisionText || "").trim().length > 0)
      .length;
  });
  checks.push(assertion("课堂流程可完成5个递进案例", progressText.includes("已完成 5/5")));
  checks.push(assertion("最终案例能生成四段式验收结论", finalText.includes("判断") && finalText.includes("依据") && finalText.includes("边界") && finalText.includes("建议")));
  checks.push(assertion("至少前三个案例可形成学生自己的修正句", revisionCount === 3, `revisionCount=${revisionCount}`));
  shots.push(await screenshot(page, "03-student-class-completed"));

  await click(page, ".back-link");
  await page.waitForSelector(".workspace");
  checks.push(assertion("深样章可返回整书母版", (await readBody(page)).includes("整书综合母版 overall-0.5")));
  await page.close();

  return {
    role: "学生",
    flow: "课堂带学",
    pass: checks.every((item) => item.pass) && consoleErrors.length === 0,
    checks,
    consoleErrors,
    screenshots: shots,
    analysis: [
      "学习闭环由“真实化疑问 -> 指标表 -> 互动判断 -> 反馈修正 -> 职业结论”组成，当前课堂路径是可走通的。",
      "课堂模式差异主要体现在教师追问和停顿节奏，不是完全不同的页面结构；这符合带学场景，但仍依赖教师组织。",
      "学生能在首屏看到第一步和完成标准，比早期版本更接近可自学入口。"
    ]
  };
}

async function runStudentSelfFlow(browser) {
  const consoleErrors = [];
  const checks = [];
  const shots = [];
  const page = await openSample(browser, consoleErrors);

  await click(page, '[data-mode="self"]');
  const selfText = await page.locator(".mode-panel").innerText();
  checks.push(assertion("自学模式显示术语小卡和提交前自查", selfText.includes("术语小卡") && selfText.includes("提交前自查")));
  await page.fill("#glossarySearch", "95分位");
  checks.push(assertion("自学过程可查询术语字典", (await page.locator(".glossary-card").innerText()).includes("95分位时延")));
  shots.push(await screenshot(page, "04-student-self-first-screen"));

  await click(page, '[data-sort-id="web"][data-sort-category="coverage"]');
  await click(page, "#checkActivity");
  const badFeedback = await page.locator(".feedback").innerText();
  checks.push(assertion("错误尝试后出现二次学习路径", badFeedback.includes("还没有完全形成可靠依据") && badFeedback.includes("再试一次") && badFeedback.includes("写修正句")));
  await click(page, "[data-retry-activity]");
  checks.push(assertion("再试一次可清空当前活动", (await page.locator(".activity-box").innerText()).includes("完成活动后再检查")));

  await click(page, "#openMap");
  checks.push(assertion("自学模式可打开局部课程能力图谱", await page.locator("#mapDialog").evaluate((dialog) => dialog.open)));
  await click(page, '[data-node-id="P4T2-N05"]');
  checks.push(assertion("图谱节点显示学习任务、前置和掌握标准", (await page.locator(".node-detail").innerText()).includes("怎么算掌握")));
  shots.push(await screenshot(page, "05-student-self-graph"));

  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 900 });
  await page.waitForTimeout(120);
  const overflowX = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
  checks.push(assertion("移动端自学界面无横向溢出", !overflowX));
  shots.push(await screenshot(page, "06-student-self-mobile"));
  await page.close();

  return {
    role: "学生",
    flow: "自学跟练",
    pass: checks.every((item) => item.pass) && consoleErrors.length === 0,
    checks,
    consoleErrors,
    screenshots: shots,
    analysis: [
      "自学模式能提供术语、检查清单、错误反馈和再试路径，基本能支持学生独立重做。",
      "自学模式仍然沿用同一套案例活动，差异主要是解释支架；如果要成为正式自学教材，还需要更强的分步讲解、错因分流和学习完成确认。",
      "局部课程能力图谱对学生有帮助，但应保持局部入口，不宜把完整评审图放到学生首屏。"
    ]
  };
}

async function runTeacherFlow(browser) {
  const consoleErrors = [];
  const checks = [];
  const shots = [];
  const page = await openOverall(browser, consoleErrors);

  await click(page, '[data-view="teacher"]');
  const overallTeacherText = await page.locator(".workspace").innerText();
  checks.push(assertion("整书教师页说明P2/P4两个课堂入口", overallTeacherText.includes("学测试分析") && overallTeacherText.includes("学结果验证")));
  checks.push(assertion("整书教师页提供P4-T2深样章直达入口", await page.locator('[data-link="deep-sample-teacher"]').count() === 1));
  shots.push(await screenshot(page, "07-teacher-overall-view"));

  await click(page, '[data-link="deep-sample-teacher"]');
  await page.waitForSelector(".hero");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await click(page, '[data-view="teacher"]');
  const scrollY = await page.evaluate(() => Math.round(window.scrollY));
  const deepTeacherText = await page.locator("#teacherView").innerText();
  checks.push(assertion("深样章切换教师页后回到页首", scrollY < 40));
  checks.push(assertion("教师页包含2课时安排、提问脚本、典型答案和模拟学情", deepTeacherText.includes("2课时安排") && deepTeacherText.includes("关键提问脚本") && deepTeacherText.includes("典型答案入口") && deepTeacherText.includes("模拟学情看板")));
  checks.push(assertion("教师页明确课堂模式和自学验收边界", deepTeacherText.includes("课堂模式控节奏") && deepTeacherText.includes("自学布置与验收")));
  shots.push(await screenshot(page, "08-teacher-deep-sample-view"));

  await click(page, '[data-view="resources"]');
  const resourcesText = await page.locator("#resourcesView").innerText();
  checks.push(assertion("资源页说明卡片、图谱节点和活动映射", resourcesText.includes("卡片、图谱节点和学习活动的映射")));
  checks.push(assertion("资源页保留来源边界而非默认发布", resourcesText.includes("正式资源要逐项制作和审核") && resourcesText.includes("依据与边界")));
  shots.push(await screenshot(page, "09-teacher-resource-view"));
  await page.close();

  return {
    role: "教师",
    flow: "课堂组织与资源检查",
    pass: checks.every((item) => item.pass) && consoleErrors.length === 0,
    checks,
    consoleErrors,
    screenshots: shots,
    analysis: [
      "教师路径已经能从整书母版进入任务样章，再查看2课时安排、讲评脚本、典型答案、模拟学情和资源映射。",
      "当前教师页可用于试讲准备，但还不是完整课堂中控台；缺少真实学生提交、实时错误分布和可导出的课后作业收取。",
      "资源页能说明转化方向，但尚未进入真实素材制作、版权审查和平台发布接口。"
    ]
  };
}

(async () => {
  const previewServer = await startPreviewServer();
  const browser = await chromium.launch(launchOptions());
  try {
    const roleFlows = [
      await runStudentClassFlow(browser),
      await runStudentSelfFlow(browser),
      await runTeacherFlow(browser)
    ];

    const foundAndFixed = [
      {
        issue: "深样章从整书母版打开后缺少页面内返回整书入口。",
        fix: "在深样章顶栏增加“返回整书母版”链接，并在角色流程中验证可返回。"
      },
      {
        issue: "深样章在学生/教师/资源页之间切换时会保留原滚动位置，教师可能落在页面中段。",
        fix: "顶栏视图切换后强制回到页首，并在教师流程中验证。"
      },
      {
        issue: "学生反复试看或教师演示时缺少清空学习状态的显式控制。",
        fix: "学生首屏增加“重新开始”按钮，清空模式、案例、图谱节点、术语和活动记录。"
      },
      {
        issue: "整书教师页说明了P4-T2但没有直接下钻按钮。",
        fix: "整书教师视图增加P4-T2任务级深样章入口，并纳入QA断言。"
      }
    ];

    const recommendations = [
      {
        priority: "高",
        item: "正式自学模式需要从“同题不同提示”升级为“错因分流”。学生做错后不只再试一次，而是按错因进入术语补课、指标重读、案例反例或结论改写。"
      },
      {
        priority: "高",
        item: "教师页需要接入真实或模拟的学生提交汇总。现在有模拟学情，但没有把学生自己的修正句、错误类型和讲评优先级联动起来。"
      },
      {
        priority: "中",
        item: "整书母版仍偏治理/评审语言，不适合作为学生正式首屏。正式教材应按角色分入口：学生进入学习任务，教师进入课堂组织，编辑/专家进入图谱与资源治理。"
      },
      {
        priority: "中",
        item: "课程能力图谱在任务内表现为局部路径是合理的，但整书层仍需继续补足从P1到P6的完整节点、关系、资源、活动、评价映射。"
      },
      {
        priority: "中",
        item: "资源转化页目前能说明方向，后续应逐项产出真实样例：教学化重绘图、互动表、流程动画脚本、小游戏规则、评价采集字段。"
      }
    ];

    const summary = {
      generatedAt: new Date().toISOString(),
      overallUrl,
      sampleUrl,
      sampleMirrorUrl,
      pass: roleFlows.every((flow) => flow.pass),
      foundAndFixed,
      roleFlows,
      recommendations
    };

    fs.writeFileSync(path.join(outDir, "role_flow_audit_summary.json"), JSON.stringify(summary, null, 2), "utf8");
    console.log(JSON.stringify({
      generatedAt: summary.generatedAt,
      pass: summary.pass,
      roleFlows: summary.roleFlows.map((flow) => ({
        role: flow.role,
        flow: flow.flow,
        pass: flow.pass,
        checks: flow.checks.map((check) => ({ name: check.name, pass: check.pass }))
      })),
      outDir
    }, null, 2));
    process.exitCode = summary.pass ? 0 : 1;
  } finally {
    await browser.close();
    if (previewServer) await new Promise((resolve) => previewServer.close(resolve));
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
