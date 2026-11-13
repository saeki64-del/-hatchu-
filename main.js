// 発注書（Windows版）
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000, height: 950,
    title: '発注書',
    icon: path.join(__dirname, 'web', 'icon-512.png'),
    webPreferences: { contextIsolation: true, sandbox: true },
  });
  win.loadFile(path.join(__dirname, 'web', 'joto.html'));
  // 外部リンクは普段のブラウザで開く
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
}

Menu.setApplicationMenu(Menu.buildFromTemplate([
  { label: 'ファイル', submenu: [
    { label: '印刷', accelerator: 'Ctrl+P', click: (_, w) => w && w.webContents.print() },
    { type: 'separator' },
    { label: '終了', role: 'quit' },
  ] },
  { label: '編集', submenu: [
    { label: '元に戻す', role: 'undo' }, { label: 'やり直し', role: 'redo' }, { type: 'separator' },
    { label: '切り取り', role: 'cut' }, { label: 'コピー', role: 'copy' }, { label: '貼り付け', role: 'paste' }, { label: 'すべて選択', role: 'selectAll' },
  ] },
  { label: '表示', submenu: [
    { label: '拡大', role: 'zoomIn' }, { label: '縮小', role: 'zoomOut' }, { label: '元の大きさ', role: 'resetZoom' },
    { type: 'separator' }, { label: '再読み込み', role: 'reload' }, { label: '全画面', role: 'togglefullscreen' },
  ] },
]));

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
