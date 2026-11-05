'use strict';

const phases = ['setup', 'team', 'platform', 'campaign', 'result'];
const phaseMeta = {
  setup: ['候選人設定', 'CAMPAIGN SETUP', '準備參選', '決定你的候選人風格與起始競選資源，展開第一場選戰。', '01'],
  team: ['組成團隊', 'BUILD YOUR TEAM', '找對人，選戰才跑得動', '從五種專業幕僚中聘用三位。團隊能力會影響你的起始資源與選民支持。', '02'],
  platform: ['制定政見', 'SET YOUR PLATFORM', '選出三項主打政見', '每項政策都會影響不同選民群體。有限的版面，代表你必須決定優先順序。', '03'],
  campaign: ['競選週期', 'CAMPAIGN TRAIL', '每個事件，都是一次選擇', '比較各種應對的代價和效果，管理資源，累積支持。', '04'],
  result: ['開票夜', 'ELECTION NIGHT', '選民已經做出選擇', '你的團隊、政見和四次事件應對，將一起反映在最後得票。', '05']
};

const archetypes = [
  { id: 'organizer', icon: '⌂', title: '地方組織型', desc: '熟悉街坊網絡，基層行程更有效。', effect: '志工 +1、家庭支持 +2', resources: { volunteers: 1 }, support: { families: 2 } },
  { id: 'planner', icon: '▤', title: '政策規劃型', desc: '擅長整合複雜議題，信任感較穩。', effect: '信任 +2', resources: { trust: 2 }, support: {} },
  { id: 'communicator', icon: '◉', title: '溝通表達型', desc: '擅長與媒體和群眾對話。', effect: '能見度 +2、青年支持 +2', resources: { media: 2 }, support: { youth: 2 } }
];

const resourcePacks = [
  { id: 'field', title: '志工先行', desc: '把人力放在街頭與社區。', values: { funds: 6, volunteers: 9, media: 4, trust: 5 } },
  { id: 'balanced', title: '均衡募款', desc: '經費、人力與曝光平均配置。', values: { funds: 8, volunteers: 6, media: 6, trust: 5 } },
  { id: 'media', title: '媒體起跑', desc: '以內容傳播快速提高能見度。', values: { funds: 10, volunteers: 4, media: 9, trust: 4 } }
];

const teams = [
  { id: 'fieldLead', icon: '⌂', title: '地方組織主任', desc: '熟悉社區行程與志工動員。', effect: '志工 +2；家庭與商家支持 +1', resources: { volunteers: 2 }, support: { families: 1, business: 1 } },
  { id: 'policyLead', icon: '▤', title: '政策總監', desc: '把主張整理成可執行方案。', effect: '信任 +1；所有政見額外加成', resources: { trust: 1 }, support: {}, policyBonus: 1 },
  { id: 'mediaLead', icon: '◉', title: '媒體總監', desc: '安排採訪、聲量與公開回應。', effect: '能見度 +2；社群事件效果提升', resources: { media: 2 }, support: {}, mediaBonus: 2 },
  { id: 'fundraiser', icon: '$', title: '募款主任', desc: '穩定選戰現金流，爭取更多場次。', effect: '經費 +3', resources: { funds: 3 }, support: {} },
  { id: 'dataLead', icon: '⌁', title: '民調分析師', desc: '讀懂群體反應，及早調整溝通。', effect: '信任 +1；通勤族支持 +2', resources: { trust: 1 }, support: { commuters: 2 } }
];

const policies = [
  { id: 'housing', icon: '⌂', title: '居住減壓方案', desc: '擴充租屋支持與可負擔住宅，分階段檢視供給。', groups: { youth: 7, families: 4 }, tags: ['青年', '家庭'] },
  { id: 'transit', icon: '⇄', title: '通勤交通改善', desc: '改善公車班次、轉乘資訊與壅塞熱點。', groups: { commuters: 7, youth: 2 }, tags: ['通勤族', '青年'] },
  { id: 'education', icon: '▤', title: '課後照顧擴充', desc: '增加課後照顧名額與學習扶助服務。', groups: { families: 7, youth: 2 }, tags: ['家庭', '青年'] },
  { id: 'climate', icon: 'ϟ', title: '城市韌性計畫', desc: '改善排水、遮蔭與極端天候備援。', groups: { families: 4, business: 3 }, tags: ['家庭', '商家'] },
  { id: 'industry', icon: '⌘', title: '在地產業升級', desc: '提供小型商家數位工具與人才媒合。', groups: { business: 7, commuters: 2 }, tags: ['商家', '通勤族'] },
  { id: 'fiscal', icon: '≋', title: '公開預算檢視', desc: '定期公布重大支出進度、成本與成效。', groups: { youth: 2, commuters: 2, families: 2, business: 2 }, tags: ['透明治理'] }
];

const voterGroups = [
  { id: 'youth', name: '青年租屋族', weight: 0.23 },
  { id: 'commuters', name: '通勤家庭', weight: 0.28 },
  { id: 'families', name: '育兒家庭', weight: 0.30 },
  { id: 'business', name: '在地商家', weight: 0.19 }
];

const events = [
  { id: 'rain', icon: '☂', title: '連日降雨，戶外行程受阻', desc: '原訂的市場拜訪和街頭宣講都在戶外。團隊需要重新安排今天的接觸方式。', choices: [
    { title: '改辦室內社區座談', desc: '集中志工接待居民，維持面對面互動。', cost: { volunteers: 2 }, effects: { support: { families: 4, business: 2 }, trust: 1 }, result: '座談順利舉行，社區互動增加。' },
    { title: '轉為線上即時問答', desc: '改用直播回應通勤和生活問題。', cost: { funds: 1 }, effects: { support: { youth: 4, commuters: 1 }, media: -1 }, result: '線上問答帶來新觸及，經費略有支出。', needs: 'mediaLead', bonus: { support: { youth: 2 }, media: -1 } }
  ] },
  { id: 'forum', icon: '▤', title: '電視政見論壇邀請', desc: '主辦單位邀請你參加市政論壇，準備時間有限。', choices: [
    { title: '投入幕僚整理政策資料', desc: '用數據和執行步驟回答追問。', cost: { funds: 2 }, effects: { support: { commuters: 3, families: 2 }, trust: 2 }, result: '回答有條理，政策信任提升。', needs: 'policyLead', bonus: { trust: 1 } },
    { title: '直接上場，強調溝通願景', desc: '節省準備經費，爭取現場曝光。', cost: { media: 1 }, effects: { support: { youth: 3 }, media: -1, trust: -1 }, result: '曝光提高，但部分細節仍待補充。', needs: 'mediaLead', bonus: { trust: 1 } }
  ] },
  { id: 'transitBuzz', icon: '⇄', title: '通勤議題突然升溫', desc: '早晨交通延誤成為熱門話題，媒體詢問你的改善方案。', choices: [
    { title: '公布分階段交通計畫', desc: '提出近期可做與長期需協調的項目。', cost: { funds: 1 }, effects: { support: { commuters: 5 }, trust: 1 }, result: '通勤族看到具體方向。', policy: 'transit', bonus: { support: { commuters: 3 } } },
    { title: '先蒐集路線意見再回應', desc: '用志工做快速通勤需求調查。', cost: { volunteers: 2 }, effects: { support: { commuters: 3, youth: 1 }, trust: 1 }, result: '先聽再答，取得路線需求回饋。', needs: 'dataLead', bonus: { support: { commuters: 2 }, trust: 1 } }
  ] },
  { id: 'donation', icon: '$', title: '社區募款餐會邀約', desc: '地方團體願意協助籌款，但期待你公開資金使用方向。', choices: [
    { title: '接受並公開用途規劃', desc: '增加經費，同時公布支出原則。', cost: {}, effects: { funds: 3, support: { business: 2 }, trust: 1 }, result: '募得競選經費，透明說明獲得肯定。' },
    { title: '婉拒餐會，改辦小額募款', desc: '不增加大額資源，擴大支持者參與。', cost: { media: 1 }, effects: { support: { youth: 3, business: 1 }, media: -1, trust: 1 }, result: '小額支持增加，能見度略有消耗。' }
  ] },
  { id: 'policyCost', icon: '≋', title: '政見成本被追問', desc: '記者會上有人詢問主打政策的財源、時程和執行單位。', choices: [
    { title: '公開成本假設與執行期程', desc: '承認仍需協調之處，清楚列出下一步。', cost: { funds: 2 }, effects: { trust: 3, support: { families: 2, business: 1 } }, result: '說明透明，信任度上升。', needs: 'policyLead', bonus: { trust: 1 } },
    { title: '先發布一頁式政策摘要', desc: '用簡明資訊快速回覆，保留細節待補。', cost: { media: 1 }, effects: { support: { youth: 2 }, media: -1, trust: 1 }, result: '摘要快速觸及支持者，細節仍待公布。', needs: 'mediaLead', bonus: { support: { youth: 2 } } }
  ] },
  { id: 'schedule', icon: '⌁', title: '兩場重要行程撞期', desc: '同一時段有青年論壇和商圈座談，團隊無法全員分身。', choices: [
    { title: '親自出席青年論壇', desc: '幕僚代為參加商圈座談。', cost: { volunteers: 1 }, effects: { support: { youth: 4, business: 1 }, trust: 1 }, result: '親自對話讓青年議題更受關注。', needs: 'mediaLead', bonus: { media: 1 } },
    { title: '優先走訪商圈', desc: '安排政策幕僚另行公開青年論壇紀錄。', cost: { funds: 1 }, effects: { support: { business: 4, youth: 1 }, trust: 1 }, result: '商家需求被記錄並納入政策討論。', needs: 'fieldLead', bonus: { support: { business: 2 } } }
  ] }
];

const rivalMoves = {
  rain: { title: '改辦室內街坊說明會', desc: '對手把志工隊轉進社區據點，維持家庭與商家接觸。', cost: { volunteers: 1 }, effects: { support: { families: 3, business: 2 }, trust: 1 }, edge: 0.55 },
  forum: { title: '引用公開資料應答', desc: '對手以成本與執行時程資料穩住政策信任。', cost: { funds: 1 }, effects: { support: { commuters: 2 }, trust: 2 }, edge: 0.25 },
  transitBuzz: { title: '發布通勤快問快答', desc: '對手快速整理交通改善重點，搶下通勤議題聲量。', cost: { media: 1 }, effects: { support: { youth: 2, commuters: 3 }, media: -1 }, edge: 0.30 },
  donation: { title: '舉辦公開募款餐會', desc: '對手增加選戰資金，同時公開募款與支出原則。', cost: {}, effects: { funds: 2, support: { business: 3 }, trust: 1 }, edge: 0.35 },
  policyCost: { title: '公布成本估算摘要', desc: '對手提供初步財源假設，爭取家庭與商家信任。', cost: { funds: 1 }, effects: { support: { families: 1, business: 2 }, trust: 2 }, edge: 0.25 },
  schedule: { title: '拆成兩組同步跑行程', desc: '對手讓候選人和地方團隊分別出席兩場活動。', cost: { volunteers: 1 }, effects: { support: { youth: 2, business: 2 }, media: 1 }, edge: 0.30 }
};

const state = {
  phase: 'setup', candidateName: '我的候選人', archetype: 'organizer', resourcePack: 'balanced',
  teamIds: [], policyIds: [], resources: null, support: Object.fromEntries(voterGroups.map(group => [group.id, 0])),
  rivalResources: null, rivalSupport: Object.fromEntries(voterGroups.map(group => [group.id, 0])),
  eventDeck: [], round: 0, roundScore: { player: 0, rival: 0, ties: 0 }, roundHistory: [], lastRoundResult: null,
  log: [], result: null, lastOutcome: ''
};
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const resourceMeta = {
  funds: { icon: '$', label: '經費', unit: '點' }, volunteers: { icon: '⌂', label: '志工', unit: '人力' },
  media: { icon: '◉', label: '能見度', unit: '點' }, trust: { icon: '◇', label: '公信力', unit: '/ 10' }
};

function selectedTeamHas(id) { return state.teamIds.includes(id); }
function selectedPolicyHas(id) { return state.policyIds.includes(id); }

function renderResources() {
  let values = state.resources;
  if (!values) values = resourcePacks.find(pack => pack.id === state.resourcePack).values;
  $('#resourceList').innerHTML = Object.entries(resourceMeta).map(([key, meta]) => `<div class="resource-line"><span class="resource-icon">${meta.icon}</span><span class="resource-label">${meta.label}</span><span class="resource-value">${values[key]}<span class="resource-unit">${meta.unit}</span></span></div>`).join('');
}

function renderPhaseNav() {
  const activeIndex = phases.indexOf(state.phase);
  document.querySelectorAll('[data-phase-nav]').forEach((item, index) => {
    item.classList.toggle('active', index === activeIndex);
    item.classList.toggle('complete', index < activeIndex);
  });
  const [label, kicker, title, description, symbol] = phaseMeta[state.phase];
  $('#currentStageLabel').textContent = label;
  $('#stageKicker').textContent = kicker;
  $('#stageTitle').textContent = title;
  $('#stageDescription').textContent = description;
  $('#stageSymbol').textContent = symbol;
  if (state.phase === 'campaign') {
    $('#stageTitle').textContent = `第 ${state.round + 1} 輪｜候選人正面交鋒`;
    $('#stageDescription').textContent = '先看 AI 對手本輪策略，再選擇你的應對；每輪都會更新系列比分。';
  }
  $('#turnLabel').textContent = state.phase === 'campaign' ? 'ROUND' : 'TURN';
  $('#turnIndicator').textContent = state.phase === 'campaign' ? `${String(state.round + 1).padStart(2, '0')} / 04` : `${String(activeIndex + 1).padStart(2, '0')} / 05`;
  $('#matchScore').hidden = state.phase !== 'campaign';
  $('#matchScore').textContent = `你 ${state.roundScore.player} : ${state.roundScore.rival} AI`;
  $('#backButton').hidden = !['team', 'platform'].includes(state.phase);
  $('#continueButton').hidden = state.phase === 'campaign';
  $('#continueButton').disabled = (state.phase === 'team' && state.teamIds.length !== 3) || (state.phase === 'platform' && state.policyIds.length !== 3);
  $('#continueButton').textContent = state.phase === 'result' ? '再選一次 ' : state.phase === 'platform' ? '開始競選 ' : state.phase === 'team' ? '選擇主打政見 ' : '進入競選團隊 ';
  const arrow = document.createElement('span'); arrow.textContent = state.phase === 'result' ? '↻' : '→'; $('#continueButton').append(arrow);
  $('#footerHint').textContent = state.phase === 'team' ? `已選 ${state.teamIds.length} / 3 位幕僚` : state.phase === 'platform' ? `已選 ${state.policyIds.length} / 3 項政見` : state.phase === 'campaign' ? '選擇一種應對；資源不足的選項無法使用。' : state.phase === 'result' ? '每次重新開始都會抽到新的事件組合。' : '先完成候選人設定，再開始組建團隊。';
}

function cardButton({ id, title, desc, effect, selected, groupClass = '', icon = '', metrics = [] }) {
  return `<button type="button" class="choice-card ${groupClass} ${selected ? 'selected' : ''}" data-choice="${groupClass}" data-id="${id}">${icon ? `<span class="team-icon">${icon}</span>` : ''}<strong>${title}</strong><p>${desc}</p>${effect ? `<div class="choice-metrics"><span>${effect}</span></div>` : ''}${metrics.length ? `<div class="pack-values">${metrics.map(item => `<span>${item}</span>`).join('')}</div>` : ''}</button>`;
}

function renderSetup() {
  const archetypeCards = archetypes.map(item => cardButton({ id: item.id, title: item.title, desc: item.desc, effect: item.effect, selected: state.archetype === item.id, groupClass: 'archetype', icon: item.icon })).join('');
  const packCards = resourcePacks.map(pack => cardButton({ id: pack.id, title: pack.title, desc: pack.desc, selected: state.resourcePack === pack.id, groupClass: 'resource-pack', metrics: [`經費 ${pack.values.funds}`, `志工 ${pack.values.volunteers}`, `曝光 ${pack.values.media}`] })).join('');
  $('#stageContent').innerHTML = `<div class="setup-grid"><section class="setup-block"><label class="field-label" for="candidateName">候選人姓名</label><input id="candidateName" class="candidate-name-input" maxlength="24" value="${escapeHTML(state.candidateName)}" placeholder="輸入你的候選人名字"><div class="selection-note">你扮演參選人本人。對手由 AI 操作，所有角色都為虛構。</div></section><section class="setup-block"><div class="stage-section-title"><div><h2>候選人風格</h2><p>選擇一項起始特長</p></div></div><div class="option-grid">${archetypeCards}</div></section><section class="setup-block full"><div class="stage-section-title"><div><h2>起始資源包</h2><p>選戰資源有限，會影響後續可採取的應對</p></div></div><div class="resource-pack-grid">${packCards}</div><div class="selection-note">資源包是遊戲內抽象點數，不對應真實政治獻金或政府預算。</div></section></div>`;
  $('#candidateName').addEventListener('input', event => { state.candidateName = event.target.value; });
}

function renderTeam() {
  const teamCards = teams.map(member => cardButton({ id: member.id, title: member.title, desc: member.desc, effect: member.effect, selected: selectedTeamHas(member.id), groupClass: 'team', icon: member.icon })).join('');
  $('#stageContent').innerHTML = `<div class="stage-section-title"><div><h2>你的核心幕僚</h2><p>選 3 位組成競選團隊；不同組合會改變資源與選民支持。</p></div><span class="count-badge">${state.teamIds.length} / 3 已聘用</span></div><div class="team-grid">${teamCards}</div><div class="selection-note">團隊不是裝飾：地方組織補志工、募款主任補經費、媒體與政策幕僚會強化對應事件。</div>`;
}

function renderPlatform() {
  const policyCards = policies.map(policy => `<button type="button" class="choice-card policy-card ${selectedPolicyHas(policy.id) ? 'selected' : ''}" data-choice="policy" data-id="${policy.id}"><span class="policy-cost">主打政見</span><span class="team-icon">${policy.icon}</span><strong>${policy.title}</strong><p>${policy.desc}</p><div class="policy-groups">${policy.tags.map(tag => `<span>${tag}</span>`).join('')}</div></button>`).join('');
  $('#stageContent').innerHTML = `<div class="stage-section-title"><div><h2>競選政見平台</h2><p>選 3 項主打政策；每項都會改變部分群體對你的起始支持。</p></div><span class="count-badge">${state.policyIds.length} / 3 已選</span></div><div class="team-grid">${policyCards}</div><div class="selection-note">政見效果只作用於虛構選民群體。政策選擇會與你的幕僚及事件應對一起影響最後開票。</div>`;
}

function formatCosts(cost = {}) {
  return Object.entries(cost).filter(([, value]) => value).map(([key, value]) => `${resourceMeta[key].label} -${value}`).join('　') || '不消耗資源';
}

function renderCampaign() {
  const event = state.eventDeck[state.round];
  const rivalMove = rivalMoves[event.id];
  const choices = event.choices.map((choice, index) => {
    const canAfford = Object.entries(choice.cost || {}).every(([key, value]) => state.resources[key] >= value);
    const teamQualified = !choice.needs || selectedTeamHas(choice.needs);
    const policyQualified = !choice.policy || selectedPolicyHas(choice.policy);
    const bonusQualified = teamQualified && policyQualified;
    const requirement = choice.needs ? teams.find(team => team.id === choice.needs)?.title : choice.policy ? policies.find(policy => policy.id === choice.policy)?.title : '團隊配置';
    const bonusHint = choice.bonus ? `<div class="choice-metrics"><span>${bonusQualified ? `加成有效：${requirement}` : `未配置${requirement}，無額外加成`}</span></div>` : '';
    return `<button type="button" class="event-choice" data-event-choice="${index}" ${canAfford ? '' : 'disabled'}><strong><span>${choice.title}</span><span>0${index + 1}</span></strong><p>${choice.desc}</p><div class="event-costs">${formatCosts(choice.cost)}</div>${!canAfford ? '<div class="event-costs">資源不足</div>' : ''}${bonusHint}</button>`;
  }).join('');
  const roundHistory = state.roundHistory.map(item => `<span class="round-result-chip ${item.winner}">R${item.round} ${item.winner === 'player' ? '你勝' : item.winner === 'rival' ? 'AI 勝' : '平手'}</span>`).join('');
  const log = state.lastRoundResult ? `<div class="event-result"><b>${state.lastRoundResult.summary}</b><span>${state.lastOutcome}</span></div>` : '';
  $('#stageContent').innerHTML = `<section class="series-board"><div class="series-player"><span>YOUR CAMPAIGN</span><strong>${escapeHTML(state.candidateName)}</strong><small>你</small></div><div class="series-center"><span>四輪交鋒</span><b>VS</b><strong>${state.roundScore.player} : ${state.roundScore.rival}</strong><small>目前比分</small></div><div class="series-player rival"><span>AI RIVAL</span><strong>對手候選人</strong><small>AI 對手</small></div></section><div class="round-history">${roundHistory || '<span class="round-result-chip pending">尚未完成回合</span>'}<span class="round-result-chip current">進行中 R${state.round + 1}</span></div><div class="duel-turns"><article class="turn-card rival-turn"><div class="turn-card-label"><span class="turn-avatar">AI</span><span>對手已出招</span><b>AI 回合</b></div><h3>${rivalMove.title}</h3><p>${rivalMove.desc}</p><div class="turn-effect">${formatCosts(rivalMove.cost)} · 影響 ${ (eventImpactScore(rivalMove.effects, rivalMove.cost) + rivalMove.edge).toFixed(1)}</div></article><article class="turn-card player-turn"><div class="turn-card-label"><span class="turn-avatar you">你</span><span>輪到你應對</span><b>你的回合</b></div><h3>${event.title}</h3><p>${event.desc}</p></article></div><article class="phase-card campaign-event"><div class="campaign-event-top"><span class="event-type">ROUND ${state.round + 1} / RANDOM EVENT ${event.icon}</span><span class="event-round">選擇你的戰術回應</span></div><div class="event-choice-grid">${choices}</div>${log}</article><div class="support-preview">${voterGroups.map(group => `<div class="support-chip"><span>${group.name} 支持變化</span><b>${state.support[group.id] >= 0 ? '+' : ''}${state.support[group.id]}</b></div>`).join('')}</div>`;
  document.querySelectorAll('[data-event-choice]').forEach(button => button.addEventListener('click', () => resolveEvent(Number(button.dataset.eventChoice))));
}

function renderResult() {
  const result = state.result || calculateElection();
  state.result = result;
  const win = result.playerShare >= 50;
  const supportRows = voterGroups.map(group => {
    const you = result.playerGroups[group.id]; const rival = result.rivalGroups[group.id];
    return `<div class="result-group"><div class="result-group-head"><span>${group.name}</span><b>你 ${Math.round(you)} · AI ${Math.round(rival)}</b></div><div class="duel-bars"><div class="duel-bar"><i style="width:${clamp(you, 0, 100)}%"></i></div><div class="duel-bar rival"><i style="width:${clamp(rival, 0, 100)}%"></i></div></div></div>`;
  }).join('');
  const selectedTitles = state.policyIds.map(id => policies.find(policy => policy.id === id).title).join('、');
  const roundSummary = state.roundHistory.map(item => `<span class="round-result-chip ${item.winner}">R${item.round} ${item.winner === 'player' ? '你勝' : item.winner === 'rival' ? 'AI 勝' : '平手'}</span>`).join('');
  $('#stageContent').innerHTML = `<section class="result-hero ${win ? 'win' : 'lose'}"><div class="vote-donut" style="--vote-angle:${result.playerShare * 3.6}deg"><div class="vote-center"><b>${result.playerShare.toFixed(1)}%</b><span>你的預估得票</span></div></div><div><span class="result-label">ELECTION NIGHT / FINAL COUNT</span><h2 class="result-headline">${win ? '恭喜，成功勝選！' : '這次未能勝選'}</h2><p class="result-summary">${win ? '團隊與政見獲得足夠支持，海灣市迎來新市長。' : '選戰落幕。回看四輪交鋒與資源配置，找出下次能調整的地方。'}</p><div class="score-line"><span class="you">你 ${result.playerShare.toFixed(1)}%</span><span class="ai">AI 對手 ${result.rivalShare.toFixed(1)}%</span></div></div></section><section class="series-final"><div><span>4-ROUND SERIES</span><b>你 ${state.roundScore.player} : ${state.roundScore.rival} AI</b><small>本輪得分不取代開票結果</small></div><div class="round-history">${roundSummary}</div></section><div class="stage-section-title" style="margin-top:15px"><div><h2>選民群體支持</h2><p>你與 AI 對手在各群體的模擬支持指數。</p></div><span class="count-badge">主打：${escapeHTML(selectedTitles)}</span></div><div class="result-groups">${supportRows}</div><p class="result-disclaimer">此結果為虛構遊戲計算，包含隨機波動，不代表任何真實候選人、選區或選舉預測。</p>`;
}

function render() {
  renderPhaseNav(); renderResources();
  if (state.phase === 'setup') renderSetup();
  if (state.phase === 'team') renderTeam();
  if (state.phase === 'platform') renderPlatform();
  if (state.phase === 'campaign') renderCampaign();
  if (state.phase === 'result') renderResult();
  const logVisible = state.log.length > 0;
  $('#gameLog').hidden = !logVisible;
  if (logVisible) $('#gameLogText').textContent = state.log[state.log.length - 1];
}

function applyResourceDelta(target, delta = {}) {
  for (const [key, value] of Object.entries(delta)) target[key] = key === 'trust' ? clamp(target[key] + value, 0, 10) : Math.max(0, target[key] + value);
}
function addSupport(target, delta = {}) {
  for (const [key, value] of Object.entries(delta)) target[key] = (target[key] || 0) + value;
}

function initializeCampaign() {
  const pack = resourcePacks.find(item => item.id === state.resourcePack);
  state.resources = { ...pack.values };
  state.support = Object.fromEntries(voterGroups.map(group => [group.id, 0]));
  const archetype = archetypes.find(item => item.id === state.archetype);
  applyResourceDelta(state.resources, archetype.resources);
  addSupport(state.support, archetype.support);
  state.teamIds.forEach(id => {
    const team = teams.find(item => item.id === id);
    applyResourceDelta(state.resources, team.resources);
    addSupport(state.support, team.support);
  });
  state.resources.trust = clamp(state.resources.trust, 0, 10);
  const shuffledEvents = [...events];
  for (let index = shuffledEvents.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledEvents[index], shuffledEvents[swapIndex]] = [shuffledEvents[swapIndex], shuffledEvents[index]];
  }
  state.eventDeck = shuffledEvents.slice(0, 4);
  state.rivalResources = { funds: 7, volunteers: 6, media: 6, trust: 6 };
  state.rivalSupport = Object.fromEntries(voterGroups.map(group => [group.id, 0]));
  state.roundScore = { player: 0, rival: 0, ties: 0 };
  state.roundHistory = [];
  state.lastRoundResult = null;
  state.round = 0;
  state.lastOutcome = '';
  state.log = [`競選開始：${state.candidateName}選擇「${archetype.title}」，聘用 ${state.teamIds.length} 位幕僚，主打 ${state.policyIds.length} 項政見。`];
  state.phase = 'campaign';
}

function resolveEvent(choiceIndex) {
  const event = state.eventDeck[state.round];
  const choice = event.choices[choiceIndex];
  const rivalMove = rivalMoves[event.id];
  if (!choice || !Object.entries(choice.cost || {}).every(([key, value]) => state.resources[key] >= value)) return;
  const playerEffects = { ...choice.effects, support: { ...(choice.effects?.support || {}) } };
  const bonusQualified = (!choice.needs || selectedTeamHas(choice.needs)) && (!choice.policy || selectedPolicyHas(choice.policy));
  if (choice.bonus && bonusQualified) {
    for (const [key, value] of Object.entries(choice.bonus)) {
      if (key === 'support') addSupport(playerEffects.support, value);
      else playerEffects[key] = (playerEffects[key] || 0) + value;
    }
  }
  applyResourceDelta(state.resources, Object.fromEntries(Object.entries(choice.cost || {}).map(([key, value]) => [key, -value])));
  applyResourceDelta(state.resources, Object.fromEntries(Object.entries(playerEffects).filter(([key]) => key !== 'support')));
  addSupport(state.support, playerEffects.support);
  applyResourceDelta(state.rivalResources, Object.fromEntries(Object.entries(rivalMove.cost || {}).map(([key, value]) => [key, -value])));
  applyResourceDelta(state.rivalResources, Object.fromEntries(Object.entries(rivalMove.effects).filter(([key]) => key !== 'support')));
  addSupport(state.rivalSupport, rivalMove.effects.support);
  const playerImpact = eventImpactScore(playerEffects, choice.cost);
  const rivalImpact = eventImpactScore(rivalMove.effects, rivalMove.cost) + rivalMove.edge;
  const difference = playerImpact - rivalImpact;
  const winner = Math.abs(difference) < 0.12 ? 'tie' : difference > 0 ? 'player' : 'rival';
  if (winner === 'player') state.roundScore.player += 1;
  else if (winner === 'rival') state.roundScore.rival += 1;
  else state.roundScore.ties += 1;
  const roundResult = { round: state.round + 1, eventTitle: event.title, playerMove: choice.title, rivalMove: rivalMove.title, playerImpact, rivalImpact, winner };
  state.roundHistory.push(roundResult);
  const winnerLabel = winner === 'player' ? `${state.candidateName}拿下本輪` : winner === 'rival' ? 'AI 對手拿下本輪' : '本輪平手';
  roundResult.summary = `第 ${roundResult.round} 輪：${winnerLabel}｜本輪影響 ${playerImpact.toFixed(1)} : ${rivalImpact.toFixed(1)}｜系列比分 ${state.roundScore.player} : ${state.roundScore.rival}`;
  state.lastRoundResult = roundResult;
  state.lastOutcome = choice.result;
  state.log.push(`${roundResult.summary}。${event.title}：${choice.title}；AI：${rivalMove.title}。`);
  state.round += 1;
  if (state.round >= state.eventDeck.length) {
    state.result = calculateElection();
    state.phase = 'result';
  }
  render();
}

function groupScores(base, policyIds, supportMods = {}, trust = 5, media = 5) {
  const scores = Object.fromEntries(voterGroups.map(group => [group.id, base]));
  policyIds.forEach(id => {
    const policy = policies.find(item => item.id === id);
    if (policy) addSupport(scores, policy.groups);
  });
  addSupport(scores, supportMods);
  const trustDelta = (trust - 5) * 0.65;
  for (const group of voterGroups) scores[group.id] = clamp(scores[group.id] + trustDelta, 22, 78);
  scores.youth = clamp(scores.youth + (media - 5) * 0.35, 22, 78);
  scores.commuters = clamp(scores.commuters + (media - 5) * 0.15, 22, 78);
  return scores;
}

function weightedScore(scores) {
  return voterGroups.reduce((total, group) => total + scores[group.id] * group.weight, 0);
}

function eventImpactScore(effects, costs = {}) {
  const groups = effects.support || {};
  const voterImpact = voterGroups.reduce((total, group) => total + (groups[group.id] || 0) * group.weight, 0);
  const resourceImpact = (effects.trust || 0) * 0.35 + (effects.media || 0) * 0.16 + (effects.funds || 0) * 0.10 + (effects.volunteers || 0) * 0.13;
  const costPenalty = (costs.funds || 0) * 0.10 + (costs.media || 0) * 0.16 + (costs.volunteers || 0) * 0.13;
  return voterImpact + resourceImpact - costPenalty;
}

function calculateElection() {
  const playerGroups = groupScores(43, state.policyIds, state.support, state.resources.trust, state.resources.media);
  const rivalPolicyIds = ['housing', 'transit', 'industry'];
  const rivalMods = { commuters: 2, business: 1 };
  addSupport(rivalMods, state.rivalSupport);
  const rivalGroups = groupScores(48, rivalPolicyIds, rivalMods, state.rivalResources.trust, state.rivalResources.media);
  const spread = weightedScore(playerGroups) - weightedScore(rivalGroups) + (Math.random() * 4 - 2);
  const playerShare = Number(clamp(50 + spread * 0.72, 28, 72).toFixed(1));
  return { playerGroups, rivalGroups, playerShare, rivalShare: Number((100 - playerShare).toFixed(1)) };
}

function nextPhase() {
  if (state.phase === 'setup') {
    const inputName = $('#candidateName').value.trim();
    if (!inputName) { $('#candidateName').focus(); return; }
    state.candidateName = inputName;
    state.phase = 'team';
  } else if (state.phase === 'team') {
    if (state.teamIds.length !== 3) return;
    state.phase = 'platform';
  } else if (state.phase === 'platform') {
    if (state.policyIds.length !== 3) return;
    initializeCampaign();
  } else if (state.phase === 'result') {
    resetGame();
    return;
  }
  render();
}

function resetGame() {
  state.phase = 'setup'; state.candidateName = '我的候選人'; state.archetype = 'organizer'; state.resourcePack = 'balanced';
  state.teamIds = []; state.policyIds = []; state.resources = null; state.round = 0; state.log = []; state.result = null; state.lastOutcome = '';
  state.rivalResources = null;
  state.rivalSupport = Object.fromEntries(voterGroups.map(group => [group.id, 0]));
  state.roundScore = { player: 0, rival: 0, ties: 0 };
  state.roundHistory = []; state.lastRoundResult = null;
  state.support = Object.fromEntries(voterGroups.map(group => [group.id, 0]));
  render();
}

function goBack() {
  if (state.phase === 'team') state.phase = 'setup';
  else if (state.phase === 'platform') state.phase = 'team';
  render();
}

$('#stageContent').addEventListener('click', event => {
  const button = event.target.closest('[data-choice]');
  if (!button) return;
  const { choice, id } = button.dataset;
  if (choice === 'archetype') state.archetype = id;
  if (choice === 'resource-pack') state.resourcePack = id;
  if (choice === 'team') {
    if (selectedTeamHas(id)) state.teamIds = state.teamIds.filter(item => item !== id);
    else if (state.teamIds.length < 3) state.teamIds.push(id);
  }
  if (choice === 'policy') {
    if (selectedPolicyHas(id)) state.policyIds = state.policyIds.filter(item => item !== id);
    else if (state.policyIds.length < 3) state.policyIds.push(id);
  }
  render();
});
$('#continueButton').addEventListener('click', nextPhase);
$('#backButton').addEventListener('click', goBack);
$('#rulesButton').addEventListener('click', () => $('#rulesDialog').showModal());
$('#closeRules').addEventListener('click', () => $('#rulesDialog').close());
$('#rulesDone').addEventListener('click', () => $('#rulesDialog').close());
$('#rulesDialog').addEventListener('click', event => { if (event.target === $('#rulesDialog')) $('#rulesDialog').close(); });

render();
