// ============================================================
// Ally — app.js
// ============================================================

const LS_PROFILE = 'aiw_v6_profile';
const LS_FEEDBACK = 'aiw_v6_fb';
const LS_TOPICS = 'aiw_v6_topics_today';

let state = {
  uploadedFiles: [],   // [{name, content}]
  currentTopic: null,  // string
  currentPlatform: null,
  currentResult: null, // {platform, content, meta}
  pendingFeedback: null,
};

// ---------- SEED TOPICS (50) ----------
const SEED_TOPICS = [
  { title: "我把朋友圈关了三个月，发现的不是清醒，是逃避", track: "自我觉察", reason: "反常识切入「数字断联」话题，避开了泛滥的「断舍离」鸡汤角度" },
  { title: "为什么越自律的人，越容易在小事上崩溃", track: "心理认知", reason: "近期「微观崩溃」话题在情感类账号有发酵趋势，适合理性克制的表达者" },
  { title: "我观察了10个真正不焦虑的人，发现一个共同点", track: "观察笔记", reason: "结构化观察类内容适合你擅长的逻辑论证型写作" },
  { title: "那些教你「高效」的方法论，正在偷走你的耐心", track: "反思批判", reason: "对效率崇拜的反思在职场创作者中正在升温" },
  { title: "我用三年想明白：成年人的友情，是要分阶段经营的", track: "人际关系", reason: "情感颗粒度细腻的话题，适合亲近度高的叙述风格" },
  { title: "「我应该更努力」这句话，可能是最大的精神内耗来源", track: "心理认知", reason: "贴近你过往内容中对「应该思维」的探讨方向" },
  { title: "辞职那天，我才发现自己从没真正休息过", track: "个人叙事", reason: "第一人称叙事强，适合你擅长的故事化开头" },
  { title: "为什么读了很多书，还是想不明白自己要什么", track: "自我觉察", reason: "知识焦虑话题持续高热，适合理性+情感兼顾的表达" },
  { title: "好的关系，是可以彼此「浪费时间」的", track: "人际关系", reason: "温度感强的金句型选题，适合短句密集的口播改编" },
  { title: "我开始记录「今天什么都没干」，意外地治愈", track: "生活方式", reason: "反生产力叙事在当下情绪类内容中表现稳定" },
  { title: "30岁后才懂：边界感不是冷漠，是对关系的尊重", track: "人际关系", reason: "年龄锚点+认知转折结构，适合中长篇深度表达" },
  { title: "「躺平」被骂了三年，但它其实救了很多人", track: "社会观察", reason: "为污名化概念正名的角度，容易引发讨论和转发" },
  { title: "我删掉了所有「待办清单」APP，效率反而高了", track: "生活方式", reason: "反工具崇拜叙事，贴合你平实简洁的语言风格" },
  { title: "成年人的崩溃，往往不是因为大事", track: "心理认知", reason: "细节化叙事容易引发强共鸣，适合短视频脚本改编" },
  { title: "为什么我们越来越不敢说「我不会」", track: "职场观察", reason: "职场脆弱性话题在知识类账号近期热度上升" },
  { title: "真正的自由，是可以选择「不优化」自己", track: "自我觉察", reason: "对自我优化文化的反思角度，适合理性克制风格" },
  { title: "我和最好的朋友，半年没说话也不尴尬", track: "人际关系", reason: "颠覆「友情需要维系」的常规认知，适合金句式开头" },
  { title: "「想清楚再做」可能是这个时代最大的拖延借口", track: "反思批判", reason: "行动力话题结合反常识角度，互动率通常较高" },
  { title: "那些看起来很「稳」的人，可能只是不敢动", track: "心理认知", reason: "标签反转型选题，适合做对比论证结构" },
  { title: "我开始对自己说「够了」，而不是「再加把劲」", track: "自我觉察", reason: "情绪疗愈类金句型表达，适合小红书短图文" },

  { title: "副业赚的第一笔钱，我用来辞职了吗？答案可能让你意外", track: "职场叙事", reason: "悬念式标题结构，结合个人决策叙事容易完读" },
  { title: "我拒绝了一个高薪offer，原因是HR的一句话", track: "职场观察", reason: "细节钩子型开头，适合口播三秒抓人结构" },
  { title: "团队里最沉默的那个人，往往最先看穿真相", track: "职场观察", reason: "反直觉人物观察类，适合中长文深度分析" },
  { title: "我管理团队五年，最后悔的不是用错人，是这件事", track: "管理反思", reason: "管理类反思内容近期在职场垂类表现稳健" },
  { title: "「卷」到最后，拼的不是努力，是这个能力", track: "职场认知", reason: "对内卷话语的再定义，容易引发评论区辩论" },
  { title: "为什么聪明人反而更容易陷入「自证陷阱」", track: "心理认知", reason: "认知偏差类选题适合逻辑密度高的论证体" },
  { title: "我用一年时间，把「讨好型人格」改掉了多少", track: "自我成长", reason: "进度式叙事容易做成系列内容，提升账号粘性" },
  { title: "真正厉害的人，都在悄悄做这一件「无用」的事", track: "观察笔记", reason: "悬念+反差结构，适合做钩子型口播开头" },
  { title: "我发现：抱怨最少的人，往往是过得最累的人", track: "心理认知", reason: "反常识洞察类，适合金句卡片式呈现" },
  { title: "「情绪稳定」可能是被过度推崇的一种假象", track: "反思批判", reason: "对流行概念的祛魅角度，讨论度通常较高" },

  { title: "我把买的所有「自我提升课」算了一笔账", track: "消费观察", reason: "数据化叙事增强说服力，适合头条干货体" },
  { title: "存钱不是为了安全感，是为了「能说不」的权利", track: "财富认知", reason: "金钱话题结合心理认知，适合金句式标题" },
  { title: "我发现：越怕浪费时间的人，越容易浪费人生", track: "反思批判", reason: "悖论式表达，适合做开篇钩子" },
  { title: "极简生活三年后，我把「断舍离」用反了", track: "生活方式", reason: "对热门概念的反思角度，区别于同质化内容" },
  { title: "「精致穷」之后，我们开始流行「认真穷」", track: "社会观察", reason: "造词类标题容易形成传播话题" },

  { title: "我观察发现：会休息的人，工作效率反而更高", track: "生活方式", reason: "反常识结论+可验证叙事，适合干货体长文" },
  { title: "为什么「等我有空再做」的事，永远不会被做", track: "行动力", reason: "拖延症话题持续高热，适合短句密集口播" },
  { title: "我用了一个笨办法，戒掉了睡前刷手机", track: "生活方式", reason: "方法论+个人验证型，适合大纲转长文" },
  { title: "真正restful的休息，不是躺着，是这件事", track: "生活方式", reason: "认知颠覆型标题，适合金句卡设计" },
  { title: "我发现：越焦虑的人，越喜欢制定「完美计划」", track: "心理认知", reason: "焦虑心理类洞察，适合中等篇幅深度分析" },

  { title: "「假装很忙」可能是当代人最隐蔽的自我欺骗", track: "反思批判", reason: "职场异化话题角度新颖，适合金句式开头" },
  { title: "我花了两年才明白：表达脆弱，也是一种力量", track: "自我觉察", reason: "情感细腻型叙事，适合长篇真诚自述" },
  { title: "那些总说「随便」的人，可能比谁都执着", track: "人际关系", reason: "人物侧写类，反差结构容易引发共鸣" },
  { title: "我开始练习「钝感力」，结果意外地轻松了", track: "自我成长", reason: "概念引入+个人验证，适合系列化内容" },
  { title: "为什么我们越长大，越不敢轻易「喜欢」一件事", track: "自我觉察", reason: "成长叙事+情感共鸣，适合视频号互动结尾" },

  { title: "我用「不评判」原则过了一个月，朋友关系变了", track: "人际关系", reason: "实验式叙事结构，过程感强，适合系列连载" },
  { title: "「稳定」从来不是不变，而是知道自己在变什么", track: "自我觉察", reason: "金句式哲思表达，适合短图文卡片" },
  { title: "真正的成熟，是可以「示弱」而不感到羞耻", track: "心理认知", reason: "情感共鸣点强，适合中长篇深度内容" },
  { title: "我发现：越想控制结果的人，越容易被结果控制", track: "反思批判", reason: "悖论结构标题，讨论度和转发率通常较高" },
  { title: "学会「课题分离」之后，我和父母的关系变好了", track: "人际关系", reason: "心理学概念+家庭叙事，亲近感强，易共鸣" },
];

// ---------- INIT ----------
window.addEventListener('DOMContentLoaded', () => {
  renderHome();
  bindPasteCounter();
  bindDropzone();
  setTodayDate();
});

function setTodayDate() {
  const el = document.getElementById('todayDate');
  if (!el) return;
  const d = new Date();
  const days = ['周日','周一','周二','周三','周四','周五','周六'];
  el.textContent = `${d.getMonth()+1}月${d.getDate()}日 · ${days[d.getDay()]}`;
}

// ============================================================
// PAGE SWITCH
// ============================================================
function switchPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('show'));
  document.getElementById(`page-${page}`).classList.add('show');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === page));
  document.querySelectorAll('.mnav-item').forEach(n => n.classList.toggle('active', n.dataset.page === page));

  if (page === 'home') renderHome();
  if (page === 'profile') renderProfile();
}

// ============================================================
// PROFILE storage
// ============================================================
function loadProfile() {
  try {
    const raw = localStorage.getItem(LS_PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function saveProfile(p) {
  localStorage.setItem(LS_PROFILE, JSON.stringify(p));
  updateSidebarProfilePill();
}

function updateSidebarProfilePill() {
  const profile = loadProfile();
  const dot = document.querySelector('.pp-dot');
  const status = document.getElementById('sidebarProfileStatus');
  if (!dot || !status) return;
  if (profile) {
    dot.classList.add('active');
    status.textContent = '已建立';
  } else {
    dot.classList.remove('active');
    status.textContent = '尚未建立';
  }
}

// ============================================================
// HOME / TOPICS
// ============================================================
function renderHome() {
  updateSidebarProfilePill();
  const profile = loadProfile();
  const emptyEl = document.getElementById('homeEmpty');
  const filledEl = document.getElementById('homeFilled');

  if (!profile) {
    emptyEl.style.display = 'block';
    filledEl.style.display = 'none';
    return;
  }
  emptyEl.style.display = 'none';
  filledEl.style.display = 'block';
  loadTopics(false);
}

function showUpload() {
  document.getElementById('uploadPanel').classList.add('open');
}

function switchUploadTab(btn, panelId) {
  // scope toggling to the same tab-group (siblings inside the same .upload-tabs)
  const tabGroup = btn.parentElement;
  tabGroup.querySelectorAll('.utab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const panelGroup = tabGroup.parentElement;
  panelGroup.querySelectorAll('.utab-panel').forEach(p => p.classList.remove('show'));
  document.getElementById(panelId).classList.add('show');
}

// Panel registry: '' = home, '2' = update (in profile), '3' = first-build (in profile empty state)
const UPLOAD_PANEL_SUFFIXES = ['', '2', '3'];
function btnIdFor(suffix) {
  return { '': 'doCloneBtn', '2': 'doUpdateBtn', '3': 'doFirstBuildBtn' }[suffix];
}

function bindPasteCounter() {
  UPLOAD_PANEL_SUFFIXES.forEach(suf => {
    bindPasteCounterFor(`pasteArea${suf}`, `pasteCount${suf}`, btnIdFor(suf));
  });
}

function bindPasteCounterFor(areaId, countId, btnId) {
  const area = document.getElementById(areaId);
  const count = document.getElementById(countId);
  if (!area) return;
  area.addEventListener('input', () => {
    count.textContent = area.value.length;
    refreshCloneBtn(areaId, btnId);
  });
}

function bindDropzone() {
  UPLOAD_PANEL_SUFFIXES.forEach(suf => bindDropzoneFor(`dropzone${suf}`, suf));
}

function bindDropzoneFor(dzId, suf) {
  const dz = document.getElementById(dzId);
  if (!dz) return;
  ['dragenter', 'dragover'].forEach(evt => {
    dz.addEventListener(evt, e => { e.preventDefault(); dz.classList.add('dragover'); });
  });
  ['dragleave', 'drop'].forEach(evt => {
    dz.addEventListener(evt, e => { e.preventDefault(); dz.classList.remove('dragover'); });
  });
  dz.addEventListener('drop', e => {
    const files = Array.from(e.dataTransfer.files);
    processFiles(files, suf);
  });
}

function handleFileUpload(event) {
  const suf = (event.target.id.match(/^fileInput(\d*)$/) || [, ''])[1];
  const files = Array.from(event.target.files);
  processFiles(files, suf);
}

async function processFiles(files, suf) {
  for (const file of files) {
    let content = '';
    try {
      if (file.name.endsWith('.docx')) {
        const buf = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buf });
        content = result.value;
      } else {
        content = await file.text();
        if (file.name.endsWith('.html')) {
          const tmp = document.createElement('div');
          tmp.innerHTML = content;
          content = tmp.textContent || tmp.innerText || '';
        }
      }
    } catch (e) {
      content = '';
    }
    state.uploadedFiles.push({ name: file.name, content });
  }
  renderFileList(suf);
  refreshCloneBtn(`pasteArea${suf}`, btnIdFor(suf));
}

function renderFileList(suf) {
  const list = document.getElementById(`fileList${suf}`);
  list.innerHTML = state.uploadedFiles.map((f, i) => `
    <div class="file-chip">
      <span class="file-chip-name">${escapeHtml(f.name)}</span>
      <button class="file-chip-remove" onclick="removeFile(${i}, '${suf}')">✕</button>
    </div>
  `).join('');
}

function removeFile(i, suf) {
  state.uploadedFiles.splice(i, 1);
  renderFileList(suf);
  refreshCloneBtn(`pasteArea${suf}`, btnIdFor(suf));
}

function refreshCloneBtn(areaId, btnId) {
  const pasteArea = document.getElementById(areaId);
  const hasContent = (pasteArea && pasteArea.value.trim().length >= 50) || state.uploadedFiles.length > 0;
  document.getElementById(btnId).disabled = !hasContent;
}

function doClone() {
  state.uploadedFiles = mergePasteIntoFiles(state.uploadedFiles);
  switchPage('profile');
  document.getElementById('analyzingView').style.display = 'block';
  document.getElementById('profileEmptyView').style.display = 'none';
  document.getElementById('profileView').style.display = 'none';
  runAnalysis();
}

function mergePasteIntoFiles(files) {
  // include whichever paste textarea currently has content (home / update / first-build panel)
  const merged = [...files];
  UPLOAD_PANEL_SUFFIXES.forEach(suf => {
    const p = document.getElementById(`pasteArea${suf}`);
    if (p && p.value.trim().length >= 50) {
      merged.push({ name: '粘贴的文字', content: p.value.trim() });
    }
  });
  return merged;
}

function runAnalysis() {
  const steps = [
    '正在阅读你的文字…',
    '提取句式与节奏特征…',
    '分析词汇密度与情感浓度…',
    '比对逻辑结构与表达习惯…',
    '生成你的声音身份卡…',
    '完成'
  ];
  const stepEl = document.getElementById('analyzingStep');
  const fillEl = document.getElementById('analyzingFill');
  let i = 0;
  fillEl.style.width = '0%';

  const interval = setInterval(() => {
    i++;
    if (i >= steps.length) {
      clearInterval(interval);
      const profile = simulateProfile();
      saveProfile(profile);
      state.uploadedFiles = [];
      resetUploadPanels();
      setTimeout(() => {
        renderProfile();
      }, 400);
      return;
    }
    stepEl.textContent = steps[i];
    fillEl.style.width = `${(i / (steps.length - 1)) * 100}%`;
  }, 650);
}

function resetUploadPanels() {
  UPLOAD_PANEL_SUFFIXES.forEach(suf => {
    const area = document.getElementById(`pasteArea${suf}`);
    if (area) area.value = '';
    const count = document.getElementById(`pasteCount${suf}`);
    if (count) count.textContent = '0';
    const list = document.getElementById(`fileList${suf}`);
    if (list) list.innerHTML = '';
  });
  document.getElementById('uploadPanel').classList.remove('open');
  document.getElementById('updatePanel').classList.remove('open');
  const firstBuild = document.getElementById('firstBuildPanel');
  if (firstBuild) firstBuild.classList.remove('open');
}

function simulateProfile() {
  const existing = loadProfile();
  return {
    badges: ["⚡ 快节奏", "🧠 理性克制", "✏️ 平实简洁"],
    summary: "你习惯用短句推进逻辑，情绪不外露但态度清晰——像一个把话想透了才开口的人。",
    traits: [
      { label: "句式节奏", val: 78, color: "#E85D44" },
      { label: "词汇丰富度", val: 62, color: "#4A7FB5" },
      { label: "情感浓度", val: 45, color: "#B9791E" },
      { label: "逻辑密度", val: 71, color: "#4A7FB5" },
      { label: "亲近度", val: 58, color: "#2F8F66" },
      { label: "流畅度", val: 82, color: "#E85D44" },
    ],
    stats: [
      { num: 25, lbl: "句数(估算)", color: "#E85D44" },
      { num: 18, lbl: "均句字数", color: "#4A7FB5" },
      { num: 340, lbl: "去重词汇", color: "#B9791E" },
    ],
    generationCount: existing ? existing.generationCount : 0,
    likedCount: existing ? existing.likedCount : 0,
    dislikedCount: existing ? existing.dislikedCount : 0,
    created: existing ? existing.created : new Date().toISOString(),
    updated: new Date().toISOString(),
  };
}

function showUpdateProfile() {
  document.getElementById('updatePanel').classList.add('open');
  document.getElementById('updatePanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeUpdatePanel() {
  document.getElementById('updatePanel').classList.remove('open');
}

function showFirstBuildPanel() {
  document.getElementById('firstBuildPanel').classList.add('open');
  document.getElementById('firstBuildPanel').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================================
// PROFILE RENDER
// ============================================================
function renderProfile() {
  const profile = loadProfile();
  const analyzingView = document.getElementById('analyzingView');
  const emptyView = document.getElementById('profileEmptyView');
  const profileView = document.getElementById('profileView');

  if (!profile) {
    analyzingView.style.display = 'none';
    profileView.style.display = 'none';
    emptyView.style.display = 'block';
    return;
  }

  analyzingView.style.display = 'none';
  emptyView.style.display = 'none';
  profileView.style.display = 'block';

  document.getElementById('vcBadges').innerHTML = profile.badges
    .map(b => `<span class="vc-badge">${escapeHtml(b)}</span>`).join('');
  document.getElementById('vcSummary').textContent = profile.summary;

  document.getElementById('vcTraits').innerHTML = profile.traits.map(t => `
    <div class="trait-row">
      <span class="trait-label">${escapeHtml(t.label)}</span>
      <div class="trait-bar-bg"><div class="trait-bar-fill" style="width:${t.val}%;background:${t.color}"></div></div>
      <span class="trait-val">${t.val}</span>
    </div>
  `).join('');

  document.getElementById('vcStats').innerHTML = profile.stats.map(s => `
    <div class="vstat-row">
      <span class="vstat-num" style="color:${s.color}">${s.num}</span>
      <span class="vstat-lbl">${escapeHtml(s.lbl)}</span>
    </div>
  `).join('');

  document.getElementById('vcGenCount').textContent = profile.generationCount;
  const total = profile.likedCount + profile.dislikedCount;
  document.getElementById('vcLikeRate').textContent = total > 0
    ? `${Math.round((profile.likedCount / total) * 100)}%`
    : '暂无反馈';
}

// ============================================================
// TOPICS
// ============================================================
function loadTopics(randomOnly) {
  let topics = [];
  if (!randomOnly) {
    try {
      const cached = sessionStorage.getItem(LS_TOPICS);
      if (cached) topics = JSON.parse(cached);
    } catch (e) {}
  }
  if (!topics.length) {
    topics = pickRandomTopics(3);
    sessionStorage.setItem(LS_TOPICS, JSON.stringify(topics));
  }
  renderTopics(topics);
}

function pickRandomTopics(n) {
  const pool = [...SEED_TOPICS];
  const picked = [];
  for (let i = 0; i < n && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const t = pool.splice(idx, 1)[0];
    picked.push({
      ...t,
      score: 60 + Math.floor(Math.random() * 35),
      fit: 60 + Math.floor(Math.random() * 35),
    });
  }
  return picked;
}

function renderTopics(topics) {
  const grid = document.getElementById('topicGrid');
  grid.innerHTML = topics.map((t, i) => `
    <div class="topic-card" tabindex="0" onclick="selectTopic(${i})" onkeypress="if(event.key==='Enter')selectTopic(${i})">
      <div class="tc-index">${String(i + 1).padStart(2, '0')}</div>
      <div class="tc-body">
        <div class="tc-top-row">
          <div class="tc-title">${escapeHtml(t.title)}</div>
        </div>
        <div class="tc-reason">${escapeHtml(t.reason)}</div>
        <div class="tc-meta">
          <span class="tc-tag">${escapeHtml(t.track)}</span>
          <span class="tc-score">
            爆文概率
            <span class="tc-score-bar"><span class="tc-score-fill" style="width:${t.score}%;background:#E85D44"></span></span>
            <span class="tc-score-val">${t.score}</span>
          </span>
          <span class="tc-score">
            你擅长度
            <span class="tc-score-bar"><span class="tc-score-fill" style="width:${t.fit}%;background:#4A7FB5"></span></span>
            <span class="tc-score-val">${t.fit}</span>
          </span>
        </div>
      </div>
    </div>
  `).join('');
  window._currentTopics = topics;
}

function selectTopic(idx) {
  const t = window._currentTopics[idx];
  state.currentTopic = t.title;
  switchPage('generate');
  document.getElementById('genTopicInput').value = t.title;
}

function useCustomTopic() {
  const val = document.getElementById('customTopicInput').value.trim();
  if (!val) return;
  state.currentTopic = val;
  switchPage('generate');
  document.getElementById('genTopicInput').value = val;
}

// ============================================================
// GENERATE
// ============================================================
function pickType(btn) {
  document.querySelectorAll('.platform-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  state.currentPlatform = btn.dataset.platform;
}

function doGenerate() {
  const topic = document.getElementById('genTopicInput').value.trim();
  if (!topic) {
    document.getElementById('genTopicInput').focus();
    document.getElementById('genTopicInput').style.borderColor = '#E85D44';
    setTimeout(() => { document.getElementById('genTopicInput').style.borderColor = ''; }, 1200);
    return;
  }
  if (!state.currentPlatform) {
    document.querySelectorAll('.platform-pill')[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const extra = document.getElementById('genExtra').value.trim();
  document.getElementById('genProgress').style.display = 'flex';
  document.getElementById('generateBtn').disabled = true;
  ['gpStep1','gpStep2','gpStep3','gpStep4'].forEach(id => {
    document.getElementById(id).classList.remove('active', 'done');
  });

  const stepIds = ['gpStep1','gpStep2','gpStep3','gpStep4'];
  let i = 0;
  const interval = setInterval(() => {
    if (i > 0) document.getElementById(stepIds[i-1]).classList.add('done');
    if (i < stepIds.length) {
      document.getElementById(stepIds[i]).classList.add('active');
      i++;
    } else {
      clearInterval(interval);
      finishGenerate(topic, state.currentPlatform, extra);
    }
  }, 550);
}

async function finishGenerate(topic, platform, extra) {
  const generators = {
    koubo: genKoubo, wechat: genWechat, xhs: genXiaohongshu,
    toutiao: genToutiao, outline: genOutline,
  };

  const profile = loadProfile();
  const sysPrompt = buildSystemPrompt(platform, profile);
  const userPrompt = buildUserPrompt(topic, extra);

  let content = await apiCall(sysPrompt, userPrompt);
  if (!content) {
    // API 不可用，回退模拟引擎
    content = generators[platform](topic, extra);
  }

  state.currentResult = { platform, topic, content, generatedAt: new Date() };

  if (profile) {
    profile.generationCount = (profile.generationCount || 0) + 1;
    saveProfile(profile);
  }

  document.getElementById('generateBtn').disabled = false;
  document.getElementById('genProgress').style.display = 'none';
  document.getElementById('fbLike').classList.remove('selected-like');
  document.getElementById('fbDislike').classList.remove('selected-dislike');
  document.getElementById('fbCommentBox').style.display = 'none';
  document.getElementById('fbThanks').style.display = 'none';

  switchPage('result');
  renderResult();
}

const PLATFORM_PROMPTS = {
  koubo: '生成口播三版合一内容：版本一口播稿(200-350字,3秒钩子+核心判断+认知转向,每句不超过20字)；版本二抖音60秒版(150-250字,最冲突的一句做开头,1个观点+1个案例,15秒处有转折,问题式结尾)；版本三视频号版(300-600字,"你有没有遇到过"开头,3-5处用【金句卡：xxx】标记,互动引导结尾)。三版之间用 --- 分隔。禁止使用：赋能/打造/抓手/闭环/生态/破局/底层逻辑/认知升级。',
  wechat: '生成一篇1500-2500字的公众号文章，第一人称坦诚的口吻，用Markdown格式，包含10个左右的小标题模块，结构上要有实战经验、反常识观点和明确的行动建议。',
  xhs: '生成一篇200-400字的小红书笔记，闺蜜聊天的语气，标题要吸睛，正文里自然使用emoji，结尾附5-8个相关标签(#标签)。',
  toutiao: '生成一篇800-1500字的头条干货文，开头提供3个A/B测试标题供选择，首段直接给出结论，全文信息密度要高。',
  outline: '生成一份200-400字的写作大纲，用Markdown格式，三层结构(一级/二级标题+要点)，方便后续展开成完整文章。',
};

function buildSystemPrompt(platform, profile) {
  let voiceDesc = '';
  if (profile) {
    voiceDesc = `\n\n请模仿以下声音特征写作：${profile.summary}（标签：${profile.badges.join('、')}）`;
  }
  return `你是一名资深内容策略师和写作助手，正在为用户生成内容。${PLATFORM_PROMPTS[platform]}${voiceDesc}\n\n直接输出最终内容，不要输出多余的解释或前言。`;
}

function buildUserPrompt(topic, extra) {
  let p = `主题：${topic}`;
  if (extra) p += `\n\n用户提供的素材稿件（请自然融入正文，不要附在结尾）：${extra}`;
  return p;
}

const PLATFORM_LABELS = {
  koubo: '口播 · 三版合一', wechat: '公众号', xhs: '小红书', toutiao: '头条', outline: '大纲',
};

function renderResult() {
  const r = state.currentResult;
  if (!r) return;

  const wordCount = r.content.replace(/[#*>`\-\n]/g, '').length;
  document.getElementById('resultMeta').innerHTML = `
    <span class="meta-badge">${escapeHtml(PLATFORM_LABELS[r.platform])}</span>
    <span class="meta-badge">${wordCount} 字</span>
    <span class="meta-badge">${escapeHtml(r.topic)}</span>
  `;
  document.getElementById('resultBody').innerHTML = renderMarkdown(r.content);
}

function copyResult() {
  if (!state.currentResult) return;
  navigator.clipboard.writeText(state.currentResult.content).then(() => {
    const btn = document.querySelector('.result-actions .btn-secondary');
    flashButtonText(btn, '已复制 ✓');
  });
}

function downloadResult() {
  if (!state.currentResult) return;
  const blob = new Blob([state.currentResult.content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${state.currentResult.topic.slice(0, 20)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

function flashButtonText(btn, text) {
  if (!btn) return;
  const original = btn.innerHTML;
  btn.innerHTML = text;
  setTimeout(() => { btn.innerHTML = original; }, 1500);
}

// ============================================================
// FEEDBACK
// ============================================================
function doFeedback(liked) {
  document.getElementById('fbLike').classList.toggle('selected-like', liked);
  document.getElementById('fbDislike').classList.toggle('selected-dislike', !liked);

  const profile = loadProfile();
  if (profile) {
    if (liked) profile.likedCount = (profile.likedCount || 0) + 1;
    else profile.dislikedCount = (profile.dislikedCount || 0) + 1;
    saveProfile(profile);
  }

  if (!liked) {
    document.getElementById('fbCommentBox').style.display = 'flex';
    state.pendingFeedback = { liked: false };
  } else {
    logFeedback({ liked: true, disliked: false, comment: '' });
    document.getElementById('fbCommentBox').style.display = 'none';
    document.getElementById('fbThanks').style.display = 'block';
  }
}

function submitFeedbackComment() {
  const comment = document.getElementById('fbComment').value.trim();
  logFeedback({ liked: false, disliked: true, comment });
  document.getElementById('fbCommentBox').style.display = 'none';
  document.getElementById('fbThanks').style.display = 'block';
  document.getElementById('fbComment').value = '';
}

function logFeedback({ liked, disliked, comment }) {
  let log = [];
  try {
    const raw = localStorage.getItem(LS_FEEDBACK);
    if (raw) log = JSON.parse(raw);
  } catch (e) {}
  log.push({
    date: new Date().toISOString(),
    topic: state.currentResult ? state.currentResult.topic : '',
    liked, disliked, comment,
    type: state.currentResult ? state.currentResult.platform : '',
  });
  localStorage.setItem(LS_FEEDBACK, JSON.stringify(log));
}

// ============================================================
// CONTENT GENERATORS (simulated)
// ============================================================
function genKoubo(topic, extra) {
  const extraLine = extra ? `\n\n（融入你的素材：${extra.slice(0, 60)}…）` : '';
  return `## 版本一 · 口播稿（直接可拍）

你有没有想过，「${topic}」这件事，可能从一开始就想错了方向。

我观察了很久，发现大多数人卡在这件事上，不是因为不努力，是因为用错了力气的方向。

真正的转折点，往往不是「做得更多」，而是「看得更清楚」。

这也是为什么，我想花三分钟，把这件事重新说一遍。${extraLine}

---

## 版本二 · 抖音60秒版

「${topic}」——这句话听起来很合理，对吧？但我想告诉你一个反常识的真相：恰恰是这种「合理」，让大多数人停在了原地。

一个观点：真正的改变，从来不靠「想清楚」，靠的是「先做错一次」。

一个案例：我见过太多人，因为想得太多，反而一步都没迈出去。

十五秒后你会发现——你缺的不是答案，是开始的勇气。

你呢？你现在卡在哪一步？

---

## 版本三 · 视频号版（含金句卡）

你有没有遇到过这样的瞬间：明明道理都懂，却还是过不好「${topic}」这件事？

【金句卡：道理和行动之间，隔着的不是认知，是反复。】

我们总以为，想清楚了就能做到。但现实往往是反过来的——是先做了,才想清楚。

我自己也是这样走过来的。一开始也卡在「想」上，后来才明白，真正推着我往前走的,从来不是更完整的计划，是「先迈出去」这一个动作。

【金句卡：成长不是想明白才出发，是出发了才想明白。】

【金句卡：你今天的犹豫，往往就是答案本身。】

如果你也正卡在类似的地方，留言告诉我，你卡住的是哪一步？我们一起想办法。`;
}

function genWechat(topic, extra) {
  const extraBlock = extra ? `\n\n## 说回我自己的经历\n\n${extra}\n` : '';
  return `# ${topic}

## 写在前面

这是一篇我想了很久才决定写的文章。不是因为它有多复杂，而是因为它太容易被简化成一句口号——而口号往往是思考停止的地方。

## 一个被忽略的事实

大多数关于「${topic}」的讨论,停在了表面的因果上。但如果你往深处看一层，会发现真正起作用的,从来不是那个被反复强调的「方法」，而是一种更底层的判断习惯。

## 我观察到的三个现象

第一,那些表现得「轻松」的人，往往是把困难提前消化掉了，而不是没遇到困难。

第二,真正的改变很少是「顿悟式」的，更多时候是反复修正之后的结果。

第三,我们对「努力」的定义，可能本身就需要被重新审视。${extraBlock}

## 这件事教会我的

如果非要总结一条经验，那就是：别急着寻找「正确答案」，先去理解「为什么这个问题会存在」。答案往往就藏在问题本身的结构里。

## 写在最后

如果你也正在经历类似的困惑,我想告诉你——你不需要立刻想明白。允许自己慢一点，本身就是一种能力。

欢迎在评论区告诉我，你在「${topic}」这件事上，卡住的是哪一部分？我们可以一起聊聊。`;
}

function genXiaohongshu(topic, extra) {
  const extraLine = extra ? `\n\n真实经历分享：${extra.slice(0, 80)}\n` : '';
  return `# 💭 ${topic}，我必须现在说一下

姐妹们谁懂啊😭 这件事真的让我纠结了好久

之前一直以为是自己想太多，后来发现根本不是这样的🙅‍♀️

✨ 三个发现，分享给同样在纠结的你：

1️⃣ 不是你不够好，是方向一开始就不太对
2️⃣ 那些看起来很「稳」的人，可能也是硬撑出来的
3️⃣ 慢一点真的没关系，不是所有事都要立刻有答案${extraLine}

说真的，写这篇笔记之前我也犹豫了很久要不要发，但还是想分享给可能也在emo的你🫶

如果你也有类似的经历，评论区告诉我呀，我们一起聊聊～

#自我成长 #情绪疗愈 #成年人的清醒 #生活感悟 #说点真心话`;
}

function genToutiao(topic, extra) {
  const extraSection = extra ? `\n\n## 一个真实案例\n\n${extra}\n` : '';
  return `# 标题ABC测试

**标题A：** ${topic}，真相和你想的不一样
**标题B：** 关于「${topic}」，我观察了很久，得出一个反常识结论
**标题C：** 为什么大多数人都误解了「${topic}」

---

## 核心结论先放在这里

很多人对「${topic}」的理解，停留在表面归因，而忽略了背后真正的结构性原因。

## 数据和现象支持

从近期的公开讨论和案例来看,这个问题至少存在三个维度的误解：第一是把结果当成原因；第二是把个例当成普遍规律；第三是忽略了时间维度的作用。${extraSection}

## 三个可以立刻用上的判断方法

第一，遇到「${topic}」相关的判断时，先问自己「这是不是幸存者偏差」。

第二，区分「方法问题」和「方向问题」，大多数人卡在后者却以为是前者。

第三，给自己设置一个「观察期」，而不是急于下结论。

## 写在最后

这篇内容信息密度比较高，建议收藏后反复看。如果你有不同看法，欢迎评论区理性讨论。`;
}

function genOutline(topic, extra) {
  const extraLine = extra ? `\n  - 融入素材：${extra.slice(0, 50)}…` : '';
  return `# ${topic} · 大纲

## 一、引入
- 提出反常识疑问，打破读者预设
- 抛出本文核心判断：表面原因 ≠ 真实原因

## 二、问题拆解
- 现象一：大多数讨论停留在「应该怎么做」
- 现象二：忽略了「为什么会这样」的结构性追问
- 现象三：把个例经验当成普遍规律${extraLine}

## 三、重新定义问题
- 区分「方法问题」与「认知问题」
- 给出一个新的判断框架

## 四、可执行的转变
- 第一步：建立「观察期」机制
- 第二步：用「反向验证」代替「正向假设」
- 第三步：接受「慢一点」也是一种推进方式

## 五、收尾
- 回扣开头的疑问，给出柔和但坚定的结论
- 互动引导：邀请读者分享自己的判断标准

> 💡 展开建议：每个二级标题可扩写为 200-300 字段落，案例部分建议替换为你的真实经历，增强可信度。`;
}

// ============================================================
// API SETTINGS MODAL
// ============================================================
function openApiSettings() {
  const cfg = getManualApiConfig();
  document.getElementById('manualApiUrl').value = cfg ? cfg.url : '';
  document.getElementById('manualApiKey').value = cfg ? cfg.key : '';
  document.getElementById('apiModalOverlay').classList.add('open');
}

function closeApiSettings() {
  document.getElementById('apiModalOverlay').classList.remove('open');
}

function saveApiSettingsFromModal() {
  const url = document.getElementById('manualApiUrl').value.trim();
  const key = document.getElementById('manualApiKey').value.trim();
  saveManualApiConfig(url, key);
  closeApiSettings();
}

// ============================================================
// REAL API CALL (proxy-first, manual key fallback)
// ============================================================
function getManualApiConfig() {
  try {
    const raw = localStorage.getItem('aiw_v6_manual_api');
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function saveManualApiConfig(url, key) {
  localStorage.setItem('aiw_v6_manual_api', JSON.stringify({ url, key }));
}

async function apiCall(sys, user) {
  // 1. 优先尝试后端代理 /api/chat（无需用户配置 Key）
  try {
    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: sys, user }),
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.content) return data.content;
    }
  } catch (e) {
    // 代理不可用，继续走手动配置
  }

  // 2. 回退：使用用户手动配置的 API URL + Key
  const manual = getManualApiConfig();
  if (manual && manual.url && manual.key) {
    try {
      const resp = await fetch(manual.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${manual.key}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: sys },
            { role: 'user', content: user },
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });
      const data = await resp.json();
      return data?.choices?.[0]?.message?.content || null;
    } catch (e) {
      return null;
    }
  }

  // 3. 都不可用 → 返回 null，调用方走模拟引擎兜底
  return null;
}


function renderMarkdown(md) {
  let html = escapeHtml(md);

  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/^---$/gim, '<hr>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/^&gt; (.*$)/gim, '<p style="color:var(--gold);border-left:2px solid var(--gold);padding-left:12px;">$1</p>');
  html = html.replace(/^\d+\.\s(.*$)/gim, '<li>$1</li>');
  html = html.replace(/^[-*]\s(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`);

  html = html.split('\n').map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (/^<(h1|h2|h3|hr|ul|li|p)/.test(trimmed)) return trimmed;
    return `<p>${trimmed}</p>`;
  }).join('\n');

  return html;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
