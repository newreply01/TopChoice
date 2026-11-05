'use strict';

const candidates = {
  A: { name: '候選人 A', eyebrow: 'CANDIDATE A', descriptor: '示範角色 · 虛構資料', approach: '先補足生活支援，再分階段調整公共服務。', tags: ['漸進推動', '先期照顧'], color: 'a' },
  B: { name: '候選人 B', eyebrow: 'CANDIDATE B', descriptor: '示範角色 · 虛構資料', approach: '優先投入公共建設，同步檢視長期財源。', tags: ['擴大建設', '長期投資'], color: 'b' }
};

const issues = [
  { id: 'housing', name: '居住政策', icon: '⌂', brief: '住房可負擔與供給方式', A: '租屋支持與弱勢居住協助', B: '增加可負擔住宅供給' },
  { id: 'transit', name: '交通建設', icon: '⇄', brief: '通勤、公共運輸與建設排序', A: '優先改善公車與轉乘', B: '推動軌道與轉運建設' },
  { id: 'education', name: '教育照顧', icon: '▤', brief: '學習支持與照顧資源', A: '擴充課後照顧服務', B: '增加校園學習支持' },
  { id: 'energy', name: '能源韌性', icon: 'ϟ', brief: '供電穩定與轉型路徑', A: '強化電網與儲能配套', B: '多元配置並分期推進' },
  { id: 'industry', name: '產業轉型', icon: '⌘', brief: '地方產業與就業能力', A: '優先培力在地人才', B: '協助中小企業數位轉型' },
  { id: 'fiscal', name: '財政治理', icon: '≋', brief: '支出排序與財政透明', A: '定期檢視支出與成效', B: '公開長期投資與財源' }
];

const policies = {
  housing: [
    { id: 'rent', title: '租屋支持與居住協助', desc: '先擴充租屋支持與弱勢居住服務，再逐年檢視需求。', cost: 3, meta: ['短期可啟動', '需穩定財源'] },
    { id: 'supply', title: '增加可負擔住宅供給', desc: '盤點公有土地與更新資源，分期增加可負擔住宅。', cost: 4, meta: ['中長期建設', '需跨單位協作'] }
  ],
  transit: [
    { id: 'bus', title: '公車與轉乘優先', desc: '優先改善班次、轉乘動線與通勤資訊服務。', cost: 2, meta: ['分區試辦', '需營運人力'] },
    { id: 'rail', title: '軌道與轉運建設', desc: '以軌道及轉運節點為核心，分階段推進建設。', cost: 4, meta: ['長期建設', '需評估財源'] }
  ],
  education: [
    { id: 'after', title: '擴充課後照顧', desc: '增加課後照顧名額與服務時段，減輕家庭照顧壓力。', cost: 3, meta: ['先期擴充', '需師資人力'] },
    { id: 'teachers', title: '增加校園學習支持', desc: '強化校園支持人力與學習扶助服務。', cost: 2, meta: ['校園執行', '需人力配置'] }
  ],
  energy: [
    { id: 'grid', title: '電網與儲能配套', desc: '優先盤點電網韌性、儲能需求與緊急備援。', cost: 4, meta: ['中長期建設', '需中央協作'] },
    { id: 'mix', title: '多元配置與分期轉型', desc: '依需求調整能源配置，採分期檢視與滾動修正。', cost: 3, meta: ['分期推進', '需公開指標'] }
  ],
  industry: [
    { id: 'training', title: '在地人才培力', desc: '連結在地產業與教育資源，補足技能轉型需求。', cost: 2, meta: ['中期培力', '需產學合作'] },
    { id: 'sme', title: '中小企業數位轉型', desc: '提供診斷與導入協助，降低中小企業轉型門檻。', cost: 3, meta: ['分批推進', '需專業支援'] }
  ],
  fiscal: [
    { id: 'review', title: '定期檢視支出成效', desc: '建立公開檢視週期，調整成效有限或重複的支出。', cost: 2, meta: ['制度調整', '需透明指標'] },
    { id: 'investment', title: '公開長期投資與財源', desc: '同步揭露長期投資規劃、財源假設與風險。', cost: 3, meta: ['長期規劃', '需公開估算'] }
  ]
};

const scenarios = [
  { id: 'housing', title: '居住負擔升高', desc: '租屋成本增加，家庭需要可近的居住支持。', related: ['housing', 'fiscal'], asks: ['短期支持對象與申請條件為何？', '長期供給與財源如何銜接？'] },
  { id: 'transit', title: '通勤時間拉長', desc: '尖峰交通壅塞，跨區通勤與轉乘需求增加。', related: ['transit', 'industry'], asks: ['改善措施何時、在哪些路線啟動？', '建設期程與替代交通如何安排？'] },
  { id: 'budget', title: '財政空間有限', desc: '多項公共服務都需要資源，必須說明優先順序。', related: ['fiscal', 'education', 'energy'], asks: ['如何公開成本估算與排序依據？', '若財源不足，哪些項目會調整？'] }
];

const rounds = [
  { title: '提出主張', subtitle: '要處理什麼問題？', prompt: '請先說明政策要解決的問題、優先對象，以及預期改變。', issue: '住房與生活支持', fallback: '目前尚未配置相關政策。可先回到政策組合，或將「未提出方案」列為本輪討論起點。', ask: '這項主張如何界定受益對象？' },
  { title: '檢視執行', subtitle: '由誰做、何時做？', prompt: '追問權責機關、法規條件、推動期程、人力及跨單位協作方式。', issue: '交通與公共建設', fallback: '目前尚未配置相關政策。未提出的部分會明確保留為待回答，不推測候選人立場。', ask: '第一階段的里程碑與負責單位是什麼？' },
  { title: '核對證據', subtitle: '成本與來源在哪裡？', prompt: '要求公開成本估算、財源假設、成效指標與可追溯的原始資料。', issue: '財源、成效與問責', fallback: '目前尚未配置相關政策。正式版本應在此附上原始政見、預算資料與查核紀錄。', ask: '哪些公開資料能驗證這項方案的進度與成效？' }
];

const state = {
  view: 'overview',
  plans: { A: { housing: 'rent', transit: 'bus', education: 'teachers' }, B: { housing: 'supply', transit: 'rail', fiscal: 'review' } },
  scenario: 'housing',
  round: 0
};
const DATA_STORAGE_KEY = 'topchoice_data_v1';
const candidateKeys = ['A', 'B'];
let dataStore = loadDataStore();

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function loadDataStore() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(DATA_STORAGE_KEY) || '{}'); } catch (error) {}
  const profiles = Object.fromEntries(candidateKeys.map(key => {
    const stored = saved.profiles?.[key] || {};
    return [key, {
      eyebrow: candidates[key].eyebrow,
      name: typeof stored.name === 'string' ? stored.name : candidates[key].name,
      approach: typeof stored.approach === 'string' ? stored.approach : candidates[key].approach,
      tags: Array.isArray(stored.tags) ? stored.tags : candidates[key].tags,
      demo: stored.demo === false ? false : true
    }];
  }));
  const claims = Object.fromEntries(issues.map(issue => [issue.id, Object.fromEntries(candidateKeys.map(key => {
    const stored = saved.claims?.[issue.id]?.[key] || {};
    return [key, {
      text: typeof stored.text === 'string' ? stored.text : issue[key],
      sourceTitle: typeof stored.sourceTitle === 'string' ? stored.sourceTitle : '',
      sourceUrl: typeof stored.sourceUrl === 'string' ? stored.sourceUrl : '',
      sourceDate: typeof stored.sourceDate === 'string' ? stored.sourceDate : '',
      demo: stored.demo === false ? false : true
    }];
  }))]));
  return { profiles, claims };
}

function persistDataStore() {
  localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(dataStore));
}

function sourceMarkup(claim) {
  if (claim.demo) return '<span class="source-missing">虛構示範 · 非真實主張</span>';
  const title = escapeHTML(claim.sourceTitle || '查看原始來源');
  const date = claim.sourceDate ? ` · ${escapeHTML(claim.sourceDate)}` : '';
  let link = '';
  try {
    const url = new URL(claim.sourceUrl);
    if (['http:', 'https:'].includes(url.protocol)) link = `<a href="${escapeHTML(url.href)}" target="_blank" rel="noopener noreferrer">${title} ↗</a>`;
  } catch (error) {}
  return link ? `<span class="source-link">${link}${date}</span>` : `<span class="source-missing">已編輯 · 來源待補${date}</span>`;
}

function updateDataStatus() {
  const editedClaims = issues.reduce((count, issue) => count + candidateKeys.filter(key => !dataStore.claims[issue.id][key].demo).length, 0);
  const sourcedClaims = issues.reduce((count, issue) => count + candidateKeys.filter(key => {
    const claim = dataStore.claims[issue.id][key];
    try { return !claim.demo && ['http:', 'https:'].includes(new URL(claim.sourceUrl).protocol); } catch (error) { return false; }
  }).length, 0);
  const title = document.querySelector('#sourceStatusTitle');
  const text = document.querySelector('#sourceStatusText');
  const status = document.querySelector('#sourceStatus');
  const badge = document.querySelector('#demoDataBadge');
  const notice = document.querySelector('#policyNoticeText');
  if (editedClaims === 0) {
    title.textContent = '示範資料集';
    text.textContent = '候選人與政策內容皆為虛構示例，不對應任何真實人物、政黨或選舉主張。';
    status.lastChild.textContent = ' 尚未連接資料來源';
    badge.textContent = 'DEMO DATA';
    notice.innerHTML = '<strong>虛構示範資料</strong>　以下候選人與政見僅展示操作方式。正式資料需附原始來源、發布日期及更新紀錄。';
    return;
  }
  title.textContent = '本機比較資料';
  text.textContent = `已編輯 ${editedClaims}/12 項主張 · ${sourcedClaims} 筆附來源連結。輸入內容尚未獨立查證。`;
  status.lastChild.textContent = ` ${sourcedClaims} 筆附來源`;
  badge.textContent = 'LOCAL · UNVERIFIED';
  notice.textContent = '以下為使用者在本機編輯的資料；請核對每項主張的原始來源。所有輸入內容均未經本系統獨立查證。';
}

const costOf = (issueId, policyId) => policies[issueId].find(item => item.id === policyId)?.cost || 0;
const totalCost = candidate => Object.entries(state.plans[candidate]).reduce((sum, [issueId, policyId]) => sum + costOf(issueId, policyId), 0);
const issueName = id => issues.find(issue => issue.id === id)?.name || id;

function renderCandidates() {
  const target = document.querySelector('#candidateCards');
  target.innerHTML = candidateKeys.map(key => {
    const candidate = dataStore.profiles[key];
    return `<article class="candidate-card candidate-${key.toLowerCase()}">
      <div class="candidate-label"><i></i>${candidate.eyebrow}</div>
      <h3>${escapeHTML(candidate.name)}</h3><span class="fiction-label">${candidate.demo ? '虛構示範資料' : '使用者編輯 · 尚未獨立查證'}</span>
      <div class="candidate-meta">${candidate.tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join('')}</div>
      <p>${escapeHTML(candidate.approach)}</p>
    </article>`;
  }).join('');
}

function renderIssueTable() {
  document.querySelector('#issueTable').innerHTML = `<div class="issue-header"><span>議題</span>${candidateKeys.map(key => `<span>${escapeHTML(dataStore.profiles[key].name)}</span>`).join('')}</div>` + issues.map(issue => `
    <div class="issue-row"><div class="issue-name"><span class="issue-symbol">${issue.icon}</span>${issue.name}</div>
      ${candidateKeys.map(key => {
        const claim = dataStore.claims[issue.id][key];
        return `<div class="issue-summary ${key === 'B' ? 'coral' : ''}"><strong>${escapeHTML(claim.text)}</strong><span>${issue.brief}</span>${sourceMarkup(claim)}</div>`;
      }).join('')}
    </div>`).join('');
}

function renderBudgets() {
  document.querySelector('#budgetBoard').innerHTML = candidateKeys.map(key => {
    const total = totalCost(key);
    const percent = Math.min(100, total / 15 * 100);
    return `<div class="budget-card ${key.toLowerCase()}"><div class="budget-title"><span>${escapeHTML(dataStore.profiles[key].name)} · 政策點數</span><span>${Object.keys(state.plans[key]).length} 項已選</span></div><div class="budget-track"><div class="budget-number">${total}<small> / 15</small></div><div class="budget-meter"><i style="width:${percent}%"></i></div></div><div class="budget-caption">遊戲設定資源，不代表候選人或政府的實際財政預算。</div></div>`;
  }).join('');
}

function renderPolicies() {
  const target = document.querySelector('#policyList');
  target.innerHTML = issues.map(issue => `<section class="policy-card">
    <div class="policy-topic"><span>${issue.icon} / ${issue.id.toUpperCase()}</span><strong>${issue.name}</strong></div>
    ${policies[issue.id].map(policy => {
      const aSelected = state.plans.A[issue.id] === policy.id;
      const bSelected = state.plans.B[issue.id] === policy.id;
      return `<article class="policy-choice ${aSelected ? 'selected-a' : ''} ${bSelected ? 'selected-b' : ''}">
        <div class="choice-heading"><strong>${policy.title}</strong><span class="choice-cost">${policy.cost} PT</span></div>
        <p class="choice-desc">${policy.desc}</p><div class="choice-meta">${policy.meta.map(item => `<span>${item}</span>`).join('')}</div>
        <div class="choice-actions"><button class="choose-button ${aSelected ? 'a-on' : ''}" data-action="choose" data-candidate="A" data-issue="${issue.id}" data-policy="${policy.id}">${aSelected ? '✓ A 已選' : '＋ 選給 A'}</button><button class="choose-button ${bSelected ? 'b-on' : ''}" data-action="choose" data-candidate="B" data-issue="${issue.id}" data-policy="${policy.id}">${bSelected ? '✓ B 已選' : '＋ 選給 B'}</button></div>
      </article>`;
    }).join('')}
  </section>`).join('');
  renderBudgets();
}

function renderScenarioOptions() {
  document.querySelector('#scenarioOptions').innerHTML = scenarios.map(scenario => `<button class="scenario-option ${scenario.id === state.scenario ? 'active' : ''}" data-action="scenario" data-id="${scenario.id}"><strong>${scenario.title}</strong><small>${scenario.desc}</small></button>`).join('');
}

function renderScenarioResult() {
  const scenario = scenarios.find(item => item.id === state.scenario);
  const target = document.querySelector('#scenarioResult');
  const rows = scenario.related.map(issueId => {
    const issue = issues.find(item => item.id === issueId);
    return `<div class="coverage-row"><div class="coverage-label">${issue.name}</div>${candidateKeys.map(key => {
      const selectedId = state.plans[key][issueId];
      const selected = selectedId && policies[issueId].find(policy => policy.id === selectedId);
      return `<div class="coverage-cell ${key.toLowerCase()}"><b>${escapeHTML(dataStore.profiles[key].name)}</b>${selected ? `<span class="covered">已配置：${selected.title}</span><br>${scenario.asks[0]}` : `<span class="missing">尚未配置此議題</span><br>${scenario.asks[1]}`}</div>`;
    }).join('')}</div>`;
  }).join('');
  target.innerHTML = `<div class="scenario-result-head"><div><span class="section-kicker">SAME CONDITIONS / QUALITATIVE CHECK</span><h2>${scenario.title}</h2><p>${scenario.desc}</p></div><span class="scenario-flag">不作勝負判定</span></div><div class="coverage-list">${rows}</div><div class="coverage-legend"><span><i></i>已配置政策</span><span><i class="wait"></i>仍待回答</span></div>`;
}

function renderDebate() {
  const round = rounds[state.round];
  document.querySelector('#debateProgress').innerHTML = rounds.map((_, index) => `<i class="progress-dot ${index <= state.round ? 'active' : ''}"></i>`).join('') + `<span class="progress-count">${String(state.round + 1).padStart(2, '0')} / 03</span>`;
  document.querySelector('#roundRail').innerHTML = rounds.map((item, index) => `<button class="round-button ${index === state.round ? 'active' : ''}" data-action="round" data-index="${index}"><small>ROUND 0${index + 1}</small><strong>${item.title}</strong><span>${item.subtitle}</span></button>`).join('');
  const related = state.round === 0 ? ['housing'] : state.round === 1 ? ['transit'] : ['fiscal'];
  const sides = candidateKeys.map(key => {
    const issueId = related[0];
    const claim = dataStore.claims[issueId][key];
    const selectedId = state.plans[key][issueId];
    const selected = selectedId && policies[issueId].find(policy => policy.id === selectedId);
    return `<div class="debate-side ${key.toLowerCase()}"><div class="debate-side-label"><span>CANDIDATE ${key}</span><span>${claim.demo ? '示範資料' : '未獨立查證'}</span></div><h3>${escapeHTML(dataStore.profiles[key].name)}</h3><p>${escapeHTML(claim.text)}${selected ? `<br><span class="debate-policy-note">牌組選擇：${escapeHTML(selected.title)}</span>` : ''}</p><div class="source-placeholder"><b>來源資訊</b>${sourceMarkup(claim)}</div></div>`;
  }).join('');
  document.querySelector('#debateCard').innerHTML = `<div class="debate-card-top"><span class="debate-label">ROUND 0${state.round + 1} · ${round.issue}</span><h2>${round.title}｜${round.ask}</h2><p>${round.prompt}</p></div><div class="debate-columns">${sides}</div><div class="debate-card-foot"><span>提示：${round.ask}</span><div class="debate-controls"><button class="small-button" data-action="round-step" data-step="-1" ${state.round === 0 ? 'disabled' : ''}>← 上一輪</button><button class="small-button next" data-action="round-step" data-step="1" ${state.round === rounds.length - 1 ? 'disabled' : ''}>下一輪 →</button></div></div>`;
}

function populateEditor() {
  const candidateKey = document.querySelector('#editorCandidate').value;
  const issueId = document.querySelector('#editorIssue').value;
  const profile = dataStore.profiles[candidateKey];
  const claim = dataStore.claims[issueId][candidateKey];
  document.querySelector('#editorName').value = profile.name;
  document.querySelector('#editorApproach').value = profile.approach;
  document.querySelector('#editorTags').value = profile.tags.join(', ');
  document.querySelector('#editorClaim').value = claim.text;
  document.querySelector('#editorSourceTitle').value = claim.sourceTitle;
  document.querySelector('#editorSourceUrl').value = claim.sourceUrl;
  document.querySelector('#editorSourceDate').value = claim.sourceDate;
  document.querySelector('#editorFeedback').textContent = '';
}

function renderAllDataViews() {
  renderCandidates();
  renderIssueTable();
  renderBudgets();
  updateDataStatus();
  if (state.view === 'scenario') renderScenarioResult();
  if (state.view === 'debate') renderDebate();
}

const labels = { overview: '候選人比較', policy: '政策組合', scenario: '情境推演', debate: '三輪辯題' };
function navigate(view) {
  if (!labels[view]) return;
  state.view = view;
  document.querySelectorAll('.view').forEach(section => {
    const active = section.id === `view-${view}`;
    section.classList.toggle('active', active);
    section.hidden = !active;
  });
  document.querySelectorAll('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  document.querySelector('#currentCrumb').textContent = labels[view];
  window.history.replaceState(null, '', `#${view}`);
  if (view === 'policy') renderPolicies();
  if (view === 'scenario') { renderScenarioOptions(); renderScenarioResult(); }
  if (view === 'debate') renderDebate();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('click', event => {
  const nav = event.target.closest('[data-view]');
  if (nav) { navigate(nav.dataset.view); return; }
  const goto = event.target.closest('[data-goto]');
  if (goto) { navigate(goto.dataset.goto); return; }
  const action = event.target.closest('[data-action]');
  if (action) {
    if (action.dataset.action === 'choose') {
      const { candidate, issue, policy } = action.dataset;
      const previous = state.plans[candidate][issue];
      const currentTotal = totalCost(candidate) - costOf(issue, previous);
      if (previous === policy) delete state.plans[candidate][issue];
      else if (currentTotal + costOf(issue, policy) <= 15) state.plans[candidate][issue] = policy;
      else { action.textContent = '預算不足'; window.setTimeout(renderPolicies, 850); return; }
      renderPolicies();
      if (state.view === 'scenario') renderScenarioResult();
      if (state.view === 'debate') renderDebate();
    } else if (action.dataset.action === 'scenario') {
      state.scenario = action.dataset.id; renderScenarioOptions(); renderScenarioResult();
    } else if (action.dataset.action === 'round') {
      state.round = Number(action.dataset.index); renderDebate();
    } else if (action.dataset.action === 'round-step') {
      state.round = Math.max(0, Math.min(rounds.length - 1, state.round + Number(action.dataset.step))); renderDebate();
    }
    return;
  }
  if (event.target.closest('#aboutButton') || event.target.closest('#sourceInfo')) document.querySelector('#infoDialog').showModal();
  if (event.target.closest('.close-dialog')) document.querySelector('#infoDialog').close();
});

document.querySelector('#infoDialog').addEventListener('click', event => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});

document.querySelector('#editDataButton').addEventListener('click', () => {
  populateEditor();
  document.querySelector('#dataDialog').showModal();
});

document.querySelectorAll('#editorCandidate, #editorIssue').forEach(select => select.addEventListener('change', populateEditor));
document.querySelector('.close-data-dialog').addEventListener('click', () => document.querySelector('#dataDialog').close());

document.querySelector('#policyDataForm').addEventListener('submit', event => {
  event.preventDefault();
  const candidateKey = document.querySelector('#editorCandidate').value;
  const issueId = document.querySelector('#editorIssue').value;
  const sourceUrl = document.querySelector('#editorSourceUrl').value.trim();
  const feedback = document.querySelector('#editorFeedback');
  if (sourceUrl) {
    try {
      const url = new URL(sourceUrl);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol');
    } catch (error) {
      feedback.textContent = '來源網址需使用 http:// 或 https://';
      feedback.classList.add('error');
      return;
    }
  }
  dataStore.profiles[candidateKey] = {
    name: document.querySelector('#editorName').value.trim(),
    approach: document.querySelector('#editorApproach').value.trim(),
    tags: document.querySelector('#editorTags').value.split(',').map(tag => tag.trim()).filter(Boolean),
    demo: false
  };
  dataStore.claims[issueId][candidateKey] = {
    text: document.querySelector('#editorClaim').value.trim(),
    sourceTitle: document.querySelector('#editorSourceTitle').value.trim(),
    sourceUrl,
    sourceDate: document.querySelector('#editorSourceDate').value,
    demo: false
  };
  try {
    persistDataStore();
    feedback.classList.remove('error');
    feedback.textContent = '已儲存在此瀏覽器；這筆資料尚未獨立查證。';
    renderAllDataViews();
    window.setTimeout(() => document.querySelector('#dataDialog').close(), 500);
  } catch (error) {
    feedback.textContent = '無法儲存：瀏覽器可能限制本機儲存空間。';
    feedback.classList.add('error');
  }
});

document.querySelector('#exportDataButton').addEventListener('click', () => {
  const backup = { version: 1, exportedAt: new Date().toISOString(), data: dataStore };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `topchoice-data-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
});

document.querySelector('#resetDataButton').addEventListener('click', () => {
  if (!window.confirm('要刪除此瀏覽器儲存的比較資料並還原虛構示範資料嗎？')) return;
  localStorage.removeItem(DATA_STORAGE_KEY);
  dataStore = loadDataStore();
  renderAllDataViews();
  populateEditor();
});

renderCandidates();
renderIssueTable();
updateDataStatus();
const requestedView = window.location.hash.slice(1);
if (labels[requestedView]) navigate(requestedView);
