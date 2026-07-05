const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const sampleDir = path.resolve(__dirname, "..");
const qaDir = __dirname;
const url = `file://${path.join(sampleDir, "index.html")}`;
const forbiddenStudentImages = [
  "image287.png",
  "image288.png",
  "image289.png",
  "image290.png",
  "image291.png",
  "image292.png",
  "image293.png"
];

async function checkViewport(browser, name, viewport) {
  const page = await browser.newPage({ viewport });
  await page.addInitScript(() => localStorage.clear());
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));

  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(300);

  const initial = await page.evaluate((forbidden) => {
    const student = document.querySelector("#studentView");
    const studentText = student?.textContent || "";
    return {
      title: document.title,
      taskTitle: document.querySelector("#taskTitle")?.textContent?.trim(),
      studentActive: student?.classList.contains("active"),
      tabCount: document.querySelectorAll(".tab").length,
      initialPanel: document.querySelector("#initialJudgmentPanel")?.textContent || "",
      lessonTabCount: document.querySelectorAll(".lesson-tab").length,
      lessonSegmentCount: document.querySelectorAll(".lesson-segment").length,
      learningTableCount: document.querySelectorAll(".learning-table").length,
      materialChoiceCount: document.querySelectorAll(".material-choice").length,
      materialDetailCount: document.querySelectorAll(".material-detail").length,
      legacyMaterialCardCount: document.querySelectorAll(".material-card").length,
      activeMaterialTitle: document.querySelector("#activeMaterialTitle")?.textContent?.trim(),
      activeMaterialModeTask: document.querySelector("#activeMaterialModeTask")?.textContent || "",
      modeWorkflow: document.querySelector("#modeWorkflow")?.textContent || "",
      activeLessonText: document.querySelector(".lesson-segment")?.textContent || "",
      abilityMapInitiallyHidden: document.querySelector("#abilityMapDialog")?.hidden === true,
      cardNavCount: document.querySelectorAll("#cardNav li").length,
      forbiddenInStudent: forbidden.filter((file) => studentText.includes(file)),
      backendWordsVisible: ["证据X", "EV-COV-01", "EV-PERF-02", "来源层级"].filter((word) => studentText.includes(word)),
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
    };
  }, forbiddenStudentImages);

  await page.selectOption("#initialStatus", "部分达标");
  await page.fill("#firstReason", "网页访问好了，但视频通话和直播上行仍异常，不能直接判断全部达标。");
  await page.fill("#firstDataToCheck", "覆盖质量、直播上行95分位时延、切换成功率和晚高峰负荷。");
  const initialSaved = await page.evaluate(() => ({
    status: document.querySelector("#initialStatus")?.value,
    reason: document.querySelector("#firstReason")?.value || "",
    data: document.querySelector("#firstDataToCheck")?.value || ""
  }));

  await page.click('.lesson-tab[data-segment-id="seg-coverage"]');
  await page.waitForTimeout(100);
  const coverageFocus = await page.evaluate(() => ({
    activeLesson: document.querySelector(".lesson-tab.active strong")?.textContent || "",
    text: document.querySelector("#seg-coverage")?.textContent || "",
    activeMaterialTitle: document.querySelector("#activeMaterialTitle")?.textContent?.trim(),
    tableCount: document.querySelectorAll(".learning-table").length
  }));

  const classroomMainMode = await page.evaluate(() => ({
    guide: document.querySelector("#modeGuide")?.textContent || "",
    materialPrompts: document.querySelector("#activeMaterialModeTask")?.textContent || "",
    workflow: document.querySelector("#modeWorkflow")?.textContent || "",
    record: document.querySelector("#modeRecord")?.textContent || "",
    editor: document.querySelector("#writingGuide")?.textContent || ""
  }));

  await page.click('.ability-step[data-node-id="performance"]');
  await page.waitForTimeout(150);
  const pathFocus = await page.evaluate(() => ({
    activePath: document.querySelector(".ability-step.active strong")?.textContent?.trim(),
    activeMaterialTitle: document.querySelector("#activeMaterialTitle")?.textContent?.trim(),
    activeMaterialModeTask: document.querySelector("#activeMaterialModeTask")?.textContent || "",
    detailCount: document.querySelectorAll(".material-detail").length,
    activeSegmentText: document.querySelector("#seg-experience")?.textContent || ""
  }));

  await page.click("#openAbilityMap");
  await page.waitForTimeout(150);
  const mapOpen = await page.evaluate(() => ({
    visible: document.querySelector("#abilityMapDialog")?.hidden === false,
    nodes: document.querySelectorAll(".map-node").length,
    detail: document.querySelector("#nodeDetail")?.textContent || ""
  }));

  await page.click('.map-node[data-node-id="coverage"]');
  await page.waitForTimeout(120);
  const mapAfterCoverage = await page.evaluate(() => ({
    activeText: document.querySelector(".map-node.active strong")?.textContent?.trim(),
    detail: document.querySelector("#nodeDetail")?.textContent || "",
    activeMaterialTitle: document.querySelector("#activeMaterialTitle")?.textContent?.trim()
  }));

  await page.click('.node-resource[data-resource-id="R-COV-KNOW"]');
  await page.waitForTimeout(150);
  const resourceFromMap = await page.evaluate(() => {
    const drawer = document.querySelector("#resourceDrawer");
    const map = document.querySelector("#abilityMapDialog");
    const drawerPanel = document.querySelector(".drawer-panel");
    const probe = document.elementFromPoint(window.innerWidth - 80, 80);
    return {
      drawerVisible: drawer?.hidden === false,
      mapVisible: map?.hidden === false,
      drawerZ: Number(getComputedStyle(drawer).zIndex),
      mapZ: Number(getComputedStyle(map).zIndex),
      resourceTitle: document.querySelector("#drawerTitle")?.textContent?.trim(),
      topText: probe?.textContent?.trim() || "",
      drawerRight: drawerPanel?.getBoundingClientRect().right || 0
    };
  });
  await page.click(".close-drawer");
  await page.waitForTimeout(80);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);

  await page.click('.material-choice[data-group-id="coverage"]');
  await page.waitForTimeout(100);
  await page.click('.add-evidence[data-evidence-id="EV-COV-01"]');
  await page.waitForTimeout(100);
  const afterOneEvidence = await page.evaluate(() => ({
    selectedText: document.querySelector("#selectedEvidenceList")?.textContent || "",
    conclusionState: document.querySelector("#conclusionState")?.textContent || ""
  }));

  await page.click('.material-choice[data-group-id="performance"]');
  await page.waitForTimeout(100);
  await page.click('.add-evidence[data-evidence-id="EV-PERF-02"]');
  await page.waitForTimeout(100);
  const afterTwoEvidence = await page.evaluate(() => ({
    selectedText: document.querySelector("#selectedEvidenceList")?.textContent || "",
    conclusionState: document.querySelector("#conclusionState")?.textContent || ""
  }));

  await page.click("#selfStudyMode");
  await page.waitForTimeout(100);
  const selfMainMode = await page.evaluate(() => ({
    guide: document.querySelector("#modeGuide")?.textContent || "",
    materialPrompts: document.querySelector("#activeMaterialModeTask")?.textContent || "",
    workflow: document.querySelector("#modeWorkflow")?.textContent || "",
    record: document.querySelector("#modeRecord")?.textContent || "",
    editor: document.querySelector("#writingGuide")?.textContent || ""
  }));
  await page.click('.open-resource[data-resource-id="R-SCENE-01"]');
  await page.waitForTimeout(100);
  const sceneHelp = await page.textContent(".support-box");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(80);
  await page.click('.material-choice[data-group-id="coverage"]');
  await page.waitForTimeout(100);
  await page.click('.open-resource[data-resource-id="R-COV-DATA"]');
  await page.waitForTimeout(100);
  const evidenceHelp = await page.textContent(".support-box");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(80);
  await page.click("#openFeedbackResource");
  await page.waitForTimeout(100);
  const feedbackHelp = await page.textContent(".support-box");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(80);

  await page.selectOption("#resultStatus", "部分达标");
  await page.fill("#missingData", "晚高峰路测数据、直播上行业务日志、切换成功率、异常释放和容量负荷数据。");
  await page.fill("#evidenceOne", "SS-RSRP覆盖率由88.4%提升至96.3%，弱覆盖采样点占比由12.6%降至3.8%。");
  await page.fill("#evidenceOneLimit", "覆盖改善不能单独证明视频通话和直播上行体验已经全部恢复。");
  await page.fill("#evidenceTwo", "直播上行95分位时延由180 ms降至110 ms，10分钟卡顿次数由6次降至2次。");
  await page.fill("#evidenceTwoLimit", "改善不等于达标，仍需结合目标值和晚高峰业务日志复核。");
  await page.fill("#professionalExpression", "本次优化结果建议判断为部分达标。依据是覆盖强度和弱覆盖问题已有明显改善，视频和直播相关指标也有改善。但覆盖数据不能证明业务体验全部恢复，直播上行95分位时延和卡顿次数仍需复核。建议下一步补充晚高峰路测、直播上行业务日志、切换成功率和容量负荷数据。");
  await page.click("#checkConclusion");
  await page.waitForTimeout(120);
  const conclusionFeedback = await page.textContent("#conclusionFeedback");

  await page.click('[data-view="teacher"]');
  await page.waitForTimeout(100);
  const teacherVisible = await page.evaluate(() => ({
    active: document.querySelector("#teacherView")?.classList.contains("active"),
    text: document.querySelector("#teacherView")?.textContent || ""
  }));

  await page.click('[data-view="audit"]');
  await page.waitForTimeout(100);
  const auditVisible = await page.evaluate(() => ({
    active: document.querySelector("#auditView")?.classList.contains("active"),
    rows: document.querySelectorAll(".audit-table tbody tr").length,
    sourceCards: document.querySelectorAll(".source-grid article").length,
    text: document.querySelector("#auditView")?.textContent || ""
  }));

  await page.click('[data-view="student"]');
  await page.waitForTimeout(120);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(80);
  await page.screenshot({ path: path.join(qaDir, `${name}.png`), fullPage: true });
  await page.close();

  return {
    viewport: name,
    screenshot: path.join(qaDir, `${name}.png`),
    ...initial,
    initialSaved,
    coverageFocus,
    mapOpen,
    mapAfterCoverage,
    resourceFromMap,
    pathFocus,
    afterOneEvidence,
    afterTwoEvidence,
    classroomMainMode,
    selfMainMode,
    selfStudyHelpDifferent: sceneHelp !== evidenceHelp && evidenceHelp !== feedbackHelp && sceneHelp !== feedbackHelp,
    sceneHelp,
    evidenceHelp,
    feedbackHelp,
    conclusionFeedback,
    teacherVisible,
    auditVisible,
    consoleErrors
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [];
    results.push(await checkViewport(browser, "desktop", { width: 1440, height: 1000 }));
    results.push(await checkViewport(browser, "mobile", { width: 390, height: 900 }));

    const pass = results.every((item) =>
      item.title.includes("样章3.2") &&
      item.taskTitle === "网页好了，为什么还不能直接说优化成功" &&
      item.studentActive === true &&
      item.tabCount === 3 &&
      item.initialPanel.includes("初步判断") &&
      item.initialSaved.status === "部分达标" &&
      item.lessonTabCount >= 8 &&
      item.lessonSegmentCount === 1 &&
      item.learningTableCount >= 1 &&
      item.materialChoiceCount === 4 &&
      item.materialDetailCount === 1 &&
      item.legacyMaterialCardCount === 0 &&
      item.activeMaterialTitle === "覆盖与质量" &&
      item.activeLessonText.includes("网页好了") &&
      item.coverageFocus.activeLesson.includes("覆盖与质量") &&
      item.coverageFocus.activeMaterialTitle === "覆盖与质量" &&
      item.coverageFocus.tableCount >= 2 &&
      item.coverageFocus.text.includes("能支持什么") &&
      item.coverageFocus.text.includes("不能说明什么") &&
      item.abilityMapInitiallyHidden === true &&
      item.cardNavCount === 0 &&
      item.forbiddenInStudent.length === 0 &&
      item.backendWordsVisible.length === 0 &&
      item.mapOpen.visible === true &&
      item.mapOpen.nodes >= 7 &&
      item.mapAfterCoverage.activeText === "查看覆盖与质量" &&
      item.mapAfterCoverage.detail.includes("覆盖与质量") &&
      item.mapAfterCoverage.activeMaterialTitle === "覆盖与质量" &&
      item.resourceFromMap.drawerVisible === true &&
      item.resourceFromMap.mapVisible === true &&
      item.resourceFromMap.drawerZ > item.resourceFromMap.mapZ &&
      item.resourceFromMap.resourceTitle === "覆盖验证看什么" &&
      item.resourceFromMap.topText.includes("覆盖验证看什么") &&
      item.pathFocus.activePath === "查看业务体验" &&
      item.pathFocus.activeMaterialTitle === "业务体验" &&
      item.pathFocus.activeSegmentText.includes("平均值变好") &&
      item.pathFocus.detailCount === 1 &&
      item.afterOneEvidence.conclusionState.includes("不能只凭覆盖数据") &&
      item.afterTwoEvidence.conclusionState.includes("可以开始写结论") &&
      item.classroomMainMode.guide.includes("课堂协作路线") &&
      item.classroomMainMode.materialPrompts.includes("课堂任务") &&
      item.classroomMainMode.workflow.includes("课堂流程") &&
      item.classroomMainMode.record.includes("课堂讨论") &&
      item.classroomMainMode.editor.includes("课堂汇报") &&
      item.selfMainMode.guide.includes("自学任务书") &&
      item.selfMainMode.materialPrompts.includes("自学读法") &&
      item.selfMainMode.workflow.includes("自学流程") &&
      item.selfMainMode.record.includes("自学检查") &&
      item.selfMainMode.editor.includes("自学作答") &&
      item.selfStudyHelpDifferent === true &&
      item.conclusionFeedback.includes("专业阈值") &&
      item.teacherVisible.active === true &&
      item.teacherVisible.text.includes("课堂停顿点") &&
      item.teacherVisible.text.includes("当前学情数据为样章模拟数据") &&
      item.auditVisible.active === true &&
      item.auditVisible.rows === 9 &&
      item.auditVisible.sourceCards === 6 &&
      item.auditVisible.text.includes("来源层级") &&
      item.auditVisible.text.includes("禁用于学生主学习区") &&
      item.overflowX === false &&
      item.consoleErrors.length === 0
    );

    const summary = {
      url,
      generatedAt: new Date().toISOString(),
      pass,
      results
    };
    fs.writeFileSync(path.join(qaDir, "playwright_qa_summary.json"), JSON.stringify(summary, null, 2), "utf8");
    console.log(JSON.stringify(summary, null, 2));
    process.exit(pass ? 0 : 1);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
