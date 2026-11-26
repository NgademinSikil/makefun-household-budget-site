// charts.js — grafik canvas polos, tanpa library dan tanpa network.
// Menggambar donat pengeluaran per kategori dan batang perbandingan bulanan.

export function gambarDonat(canvas, potongan) {
  const ctx = canvas.getContext('2d');
  const lebar = canvas.width;
  const tinggi = canvas.height;
  ctx.clearRect(0, 0, lebar, tinggi);
  const total = potongan.reduce((s, p) => s + p.nilai, 0);
  const cx = lebar / 2;
  const cy = tinggi / 2;
  const rLuar = Math.min(lebar, tinggi) / 2 - 8;
  const rDalam = rLuar * 0.58;
  if (total <= 0) {
    ctx.fillStyle = '#8a9490';
    ctx.font = '600 15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Belum ada pengeluaran', cx, cy);
    return;
  }
  let sudut = -Math.PI / 2;
  for (const p of potongan) {
    const bagian = (p.nilai / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, rLuar, sudut, sudut + bagian);
    ctx.closePath();
    ctx.fillStyle = p.warna;
    ctx.fill();
    sudut += bagian;
  }
  // Lubang tengah donat.
  ctx.beginPath();
  ctx.arc(cx, cy, rDalam, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.fillStyle = '#22302a';
  ctx.font = '800 17px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Total', cx, cy - 4);
  ctx.font = '700 14px system-ui, sans-serif';
  ctx.fillText(formatSingkat(total), cx, cy + 16);
}

export function gambarBatang(canvas, batang) {
  const ctx = canvas.getContext('2d');
  const lebar = canvas.width;
  const tinggi = canvas.height;
  ctx.clearRect(0, 0, lebar, tinggi);
  const maks = Math.max(...batang.map((b) => b.nilai), 1);
  const bawah = tinggi - 34;
  const atas = 26;
  const lebarKolom = lebar / batang.length;
  const lebarBatang = Math.min(64, lebarKolom * 0.55);
  ctx.strokeStyle = '#dde5de';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 4; i += 1) {
    const y = bawah - ((bawah - atas) * i) / 4;
    ctx.beginPath();
    ctx.moveTo(8, y);
    ctx.lineTo(lebar - 8, y);
    ctx.stroke();
  }
  batang.forEach((b, i) => {
    const tinggiBatang = ((bawah - atas) * b.nilai) / maks;
    const x = lebarKolom * i + (lebarKolom - lebarBatang) / 2;
    const y = bawah - tinggiBatang;
    ctx.fillStyle = b.warna;
    ctx.beginPath();
    ctx.roundRect(x, y, lebarBatang, tinggiBatang, [5, 5, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#22302a';
    ctx.font = '700 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(formatSingkat(b.nilai), x + lebarBatang / 2, y - 6);
    ctx.fillStyle = '#5d6b63';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(b.label, x + lebarBatang / 2, tinggi - 14);
  });
}

// "Rp 4,9 jt" untuk label kecil di dalam grafik.
export function formatSingkat(nilai) {
  if (nilai >= 1000000) {
    const jt = nilai / 1000000;
    return 'Rp ' + (Number.isInteger(jt) ? String(jt) : jt.toFixed(1).replace('.', ',')) + ' jt';
  }
  if (nilai >= 1000) return 'Rp ' + Math.round(nilai / 1000) + ' rb';
  return 'Rp ' + String(nilai);
}
