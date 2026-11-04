(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  const toast = document.getElementById('toast');
  const pageUrl = 'https://mela0976.github.io/ai-trainer-profile/';
  const email = 'f901107@gmail.com';
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  const scenarios = {
    knowledge: { task: '把散落的企業知識，變成查得到依據的回答。', steps: [['理解問題','確認角色、情境與知識範圍'],['檢索知識','從授權資料中找到相關來源'],['組合回應','整理重點，保留引用與依據'],['人工確認','檢查正確性與使用邊界']], result: '設計目標：讓答案有來源，讓使用者能判斷。' },
    workflow: { task: '把重複的資訊整理，串成可追蹤的工作流程。', steps: [['定義任務','釐清輸入、責任與成功條件'],['連接工具','在既定權限內串接資料與服務'],['組織步驟','拆解生成、查核與交付流程'],['人工驗收','檢查結果，再決定後續動作']], result: '設計目標：流程可追蹤，重要決策有人確認。' },
    learning: { task: '讓團隊帶著自己的工作問題，練習新的 AI 方法。', steps: [['理解角色','確認職能、任務與學習起點'],['示範方法','以產業情境拆解工具與流程'],['動手實作','用任務練習並討論成果'],['移轉能力','保留範本、查核方法與下一步']], result: '教學目標：從看懂示範，走向能自行應用。' }
  };
  const agentTabs = [...document.querySelectorAll('[data-agent]')];
  function selectAgent(tab) {
    const scenario = scenarios[tab.dataset.agent];
    agentTabs.forEach(button => { button.setAttribute('aria-selected', String(button === tab)); button.tabIndex = button === tab ? 0 : -1; });
    document.getElementById('agent-panel').setAttribute('aria-labelledby', tab.id);
    document.getElementById('agent-task').textContent = scenario.task;
    ['one','two','three','four'].forEach((key,index) => { document.getElementById('step-'+key+'-title').textContent = scenario.steps[index][0]; document.getElementById('step-'+key+'-copy').textContent = scenario.steps[index][1]; });
    document.getElementById('agent-result').textContent = scenario.result;
  }
  agentTabs.forEach((tab,index) => {
    tab.addEventListener('click', () => selectAgent(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index+1)%agentTabs.length;
      if (event.key === 'ArrowLeft') next = (index+agentTabs.length-1)%agentTabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = agentTabs.length-1;
      if (next !== undefined) { event.preventDefault(); selectAgent(agentTabs[next]); agentTabs[next].focus(); }
    });
  });

  function closeMenu(returnFocus) {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '開啟選單');
    nav.classList.remove('is-open');
    if (returnFocus) menuButton.focus();
  }

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
      nav.classList.toggle('is-open', open);
      if (open) {
        const firstLink = nav.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    document.addEventListener('click', (event) => {
      if (menuButton.getAttribute('aria-expanded') === 'true' && !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760 && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(false);
    });
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (error) { copied = false; }
    field.remove();
    return copied;
  }

  const copyButton = document.getElementById('copy-email');
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      try {
        if (await copyText(email)) showToast('Email 已複製：' + email);
        else showToast('無法複製 Email，請直接選取文字。');
      } catch (error) {
        showToast('無法複製 Email，請直接選取文字。');
      }
    });
  }

  const shareButton = document.getElementById('share-card');
  if (shareButton) {
    shareButton.addEventListener('click', async () => {
      const shareData = { title: '蔡政霖 Cheng-Lin Tsai', text: 'AI Agent、企業應用與人才賦能。', url: pageUrl };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          showToast('名片已開啟分享。');
          return;
        } catch (error) {
          if (error && error.name === 'AbortError') return;
        }
      }
      try {
        if (await copyText(pageUrl)) showToast('名片連結已複製。');
        else showToast('分享失敗，請稍後再試或複製網址：' + pageUrl);
      } catch (error) {
        showToast('分享失敗，請稍後再試或複製網址：' + pageUrl);
      }
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
