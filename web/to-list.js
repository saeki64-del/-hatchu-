// 送信先（会社名）のリスト：一度入れた会社名をボタンで並べ、タップで選べるようにする
// 城東テクノ・ほかのメーカーの発注書で共通（同じ端末の中に保存）
(function () {
  const KEY = 'order_to_list', MAX = 20;
  const inp = document.getElementById('oTo');
  if (!inp) return;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const css = document.createElement('style');
  css.textContent = `
    .tolist { display:flex; flex-wrap:wrap; gap:6px; align-items:center; margin:6px 0 2px; }
    .tolist .tl-h { font-size:12px; color:#666; width:100%; }
    .tolist button { font-family:inherit; cursor:pointer; border-radius:16px; font-size:14px; padding:7px 12px; min-height:36px; }
    .tolist .tl-pick { background:#fff; color:var(--main); border:1px solid var(--main); }
    .tolist .tl-pick.on { background:var(--main); color:#fff; }
    .tolist.edit .tl-pick { border-style:dashed; color:#b03a2e; border-color:#b03a2e; }
    .tolist.edit .tl-pick::after { content:'　×'; font-weight:bold; }
    .tolist .tl-edit { background:none; border:0; color:#555; text-decoration:underline; font-size:13px; padding:7px 6px; }
  `;
  document.head.appendChild(css);

  const box = document.createElement('div');
  box.className = 'tolist no-print';
  inp.after(box);
  let editing = false;

  function load() {
    try { const v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v.filter(s => typeof s === 'string' && s.trim()) : null; } catch (e) { return null; }
  }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a.slice(0, MAX))); } catch (e) {} }
  function add(name) {
    name = String(name || '').trim();
    if (!name) return;
    save([name, ...(load() || []).filter(x => x !== name)]);
    render();
  }

  // はじめてのときは、今まで入れていた送信先をリストに入れておく
  if (load() == null) {
    const seed = [];
    try { const h = JSON.parse(localStorage.getItem('joto_hdr')); if (h && h.oTo) seed.push(h.oTo); } catch (e) {}
    for (const m of ['nichiha', 'kmew', 'konoshima']) {
      try { const v = JSON.parse(localStorage.getItem('order_to_' + m)); if (typeof v === 'string' && v.trim()) seed.push(v); } catch (e) {}
    }
    save([...new Set(seed.map(s => s.trim()).filter(Boolean))]);
  }

  function render() {
    const a = load() || [], cur = inp.value.trim();
    if (!a.length) { editing = false; box.className = 'tolist no-print'; box.innerHTML = '<span class="tl-h">入れた会社名はここに並び、次からはタップで選べます</span>'; return; }
    box.className = 'tolist no-print' + (editing ? ' edit' : '');
    box.innerHTML = `<span class="tl-h">${editing ? '消したい会社名を押してください' : '登録した送信先（タップで選ぶ）'}</span>`
      + a.map((n, i) => `<button type="button" class="tl-pick${!editing && n === cur ? ' on' : ''}" data-i="${i}"${editing ? ` aria-label="${esc(n)} をリストから消す"` : ''}>${esc(n)}</button>`).join('')
      + `<button type="button" class="tl-edit">${editing ? '完了' : '編集'}</button>`;
  }

  box.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.classList.contains('tl-edit')) { editing = !editing; render(); return; }
    const a = load() || [], n = a[+b.dataset.i];
    if (n == null) return;
    if (editing) { save(a.filter(x => x !== n)); render(); return; }
    inp.value = n;
    inp.dispatchEvent(new Event('input', { bubbles: true })); // 各ページの保存・発注書の表示を動かす
    add(n); // 使った順に並べる
  });
  inp.addEventListener('change', () => add(inp.value)); // 入れ終わったらリストに入れる
  inp.addEventListener('input', render);

  window.toListRefresh = render;
  render();
})();
