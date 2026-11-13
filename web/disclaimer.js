// 免責事項：ページの下に表示し、はじめて開いたときに一度だけ「同意して使う」を出す
// 文面を大きく変えたら DISC_VER を上げる（もう一度同意してもらう）
(function () {
  const DISC_VER = '2026-11';
  const ITEMS = [
    'このツールは、佐伯外装が作成して無料で公開しているものです。城東テクノ株式会社・ニチハ株式会社・ケイミュー株式会社・神島化学工業株式会社とは関係がなく、各社の公式ツールではありません。このツールについて、各メーカーへのお問い合わせはご遠慮ください。',
    '品番・品名・入数・寸法・色・対応する役物などは、各メーカーの公開資料をもとに作っていますが、正しさ・もれのなさ・最新であることは保証しません。廃番や仕様の変更が反映されていないことがあります。',
    '本体を選んだあとに出る役物・部材は目安です。現場に必要な部材がすべて出るとは限りません。',
    '商品の写真・色見本は画面での見え方です。実物の色・柄とは異なります。',
    '発注の前に、必ず各メーカーの最新のカタログ・施工説明書などで、品番・色・数量・納まりをご確認ください。',
    'このツールを使ったことによる発注まちがい・数量の過不足・工期の遅れ・その他の損害について、佐伯外装は一切の責任を負いません。ご自身の判断と責任でお使いください。',
    '入力した内容（発注内容・送信先・邸名など）は、お使いの端末の中にだけ保存されます。このツールが自動で外部へ送ることはありません（PDFは、ご自分で選んだアプリから送られます）。',
    '内容は予告なく変更したり、公開をやめたりすることがあります。',
    '記載の会社名・商品名は、各社の商標または登録商標です。',
  ];
  const TITLE = 'ご利用にあたって（免責事項）';
  const list = '<ol>' + ITEMS.map(t => `<li>${t}</li>`).join('') + '</ol>';

  const css = document.createElement('style');
  css.textContent = `
    .disc-foot { max-width:900px; margin:0 auto 24px; padding:0 10px; }
    .disc-foot details { background:var(--card,#fff); border:1px solid var(--line,#bbb); border-radius:10px; padding:10px 12px; font-size:12px; color:#444; }
    .disc-foot summary { cursor:pointer; font-size:13px; font-weight:bold; color:#333; }
    .disc-foot ol, .disc-box ol { margin:8px 0 0; padding-left:1.4em; line-height:1.6; }
    .disc-foot li, .disc-box li { margin-bottom:4px; }
    .disc-foot .disc-c { margin:8px 0 0; color:#666; }
    .disc-ov { position:fixed; inset:0; background:rgba(20,28,36,.6); z-index:100; display:flex; align-items:center; justify-content:center; padding:16px; }
    .disc-box { background:#fff; color:#222; border-radius:12px; max-width:560px; width:100%; max-height:88vh; display:flex; flex-direction:column; box-shadow:0 8px 30px rgba(0,0,0,.35); }
    .disc-box h2 { margin:0; padding:16px 18px 8px; font-size:18px; }
    .disc-box .disc-body { overflow-y:auto; padding:0 18px; font-size:13px; }
    .disc-box .disc-lead { margin:0; font-size:14px; }
    .disc-box .disc-act { padding:12px 18px 16px; border-top:1px solid #e3e3e3; }
    .disc-box .disc-act p { margin:0 0 8px; font-size:12px; color:#666; }
    .disc-box button { width:100%; font-size:17px; padding:14px; border:0; border-radius:8px; background:var(--main,#2e6b3a); color:#fff; font-family:inherit; cursor:pointer; }
    @media print { .disc-foot, .disc-ov { display:none !important; } }
  `;
  document.head.appendChild(css);

  // ページの下に、いつでも読める免責事項
  const foot = document.createElement('footer');
  foot.className = 'disc-foot no-print';
  foot.innerHTML = `<details><summary>${TITLE}</summary>${list}<p class="disc-c">2026年11月　佐伯外装</p></details>`;
  const main = document.querySelector('main');
  if (main) main.after(foot); else document.body.appendChild(foot);

  // はじめて開いたときだけ、同意してもらう
  let ok = false;
  try { ok = localStorage.getItem('disc_ok') === DISC_VER; } catch (e) {}
  if (ok) return;
  const ov = document.createElement('div');
  ov.className = 'disc-ov';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.setAttribute('aria-labelledby', 'discTitle');
  ov.innerHTML = `<div class="disc-box">
    <h2 id="discTitle">${TITLE}</h2>
    <div class="disc-body"><p class="disc-lead">お使いになる前に、次のことをご確認ください。</p>${list}</div>
    <div class="disc-act"><p>同意いただけない場合は、ご利用をお控えください。この内容は、ページのいちばん下からいつでも読めます。</p>
    <button type="button" id="discOk">上記に同意して使う</button></div>
  </div>`;
  document.body.appendChild(ov);
  const btn = ov.querySelector('#discOk');
  btn.addEventListener('click', () => {
    try { localStorage.setItem('disc_ok', DISC_VER); } catch (e) {}
    ov.remove();
  });
  btn.focus();
})();
