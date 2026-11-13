/* 発注書をA4のPDFにして送る・保存する
   - claude.ai のページ：保存の確認画面（iPhoneのClaudeアプリでは共有の画面）
   - スマホのブラウザ：共有の画面（LINE・メールなどを選べる）
   - パソコン：PDFファイルとして保存
   html2canvas と jsPDF（vendor フォルダ）を使います */
(function () {
  async function makePdf(el) {
    // A4の幅に合うように、いったん幅を決めて画像にする
    const oldW = el.style.width;
    el.style.width = '760px';
    let canvas;
    try { canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', windowWidth: 800 }); }
    finally { el.style.width = oldW; }
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const margin = 10, pageW = 210 - margin * 2, pageH = 297 - margin * 2;
    const pxPerMm = canvas.width / pageW;
    const sliceH = Math.floor(pageH * pxPerMm);   // 1ページに入る高さ（px）
    for (let y = 0, page = 0; y < canvas.height; y += sliceH, page++) {
      const h = Math.min(sliceH, canvas.height - y);
      const part = document.createElement('canvas');
      part.width = canvas.width; part.height = h;
      part.getContext('2d').drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
      if (page > 0) pdf.addPage();
      pdf.addImage(part.toDataURL('image/jpeg', 0.92), 'JPEG', margin, margin, pageW, h / pxPerMm);
    }
    return pdf.output('blob');
  }

  window.sendPdf = async function (el, filename, notify) {
    if (typeof html2canvas === 'undefined' || !window.jspdf) { notify('PDFを作る部品が読み込めませんでした'); return; }
    notify('PDFを作っています…');
    let blob;
    try { blob = await makePdf(el); } catch (e) { notify('PDFを作れませんでした：' + (e.message || e)); return; }
    // claude.ai のページの中
    try {
      const dl = window.claude && claude.use ? await claude.use('downloads') : null;
      if (dl) {
        try { await dl.save({ filename, data: blob }); notify('PDFを保存しました'); }
        catch (e) { notify(e && e.code === 'declined' ? '保存しませんでした' : 'この画面ではPDFを保存できません'); }
        return;
      }
    } catch (e) {}
    // スマホなど：共有の画面（LINE・メールなど）
    try {
      const file = new File([blob], filename, { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: filename.replace(/\.pdf$/, '') });
        return;
      }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    // パソコン：ファイルとして保存
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 3000);
    notify('PDFを保存しました');
  };
})();
