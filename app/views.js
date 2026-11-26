// views.js — semua halaman Dompet Keluarga: Ikhtisar, Transaksi, Anggaran,
// dan Target Tabungan. Router hash memanggil renderRute; setiap halaman
// merender dari store dan memasang kembali pendengar kejadiannya sendiri.

import { BULAN_LALU, KATEGORI, KATEGORI_PEMASUKAN } from './data.js';
import { gambarBatang, gambarDonat } from './charts.js';
import {
  formatRupiah,
  formatTanggal,
  namaBulanDariKode,
  namaKategori,
  realisasiPerKategori,
  ringkasanBulan,
  store,
  totalTargetTabungan,
  transaksiBulan,
  warnaKategori,
} from './store.js';

const view = document.getElementById('view');
let pesan = '';
let pesanSalah = false;
let editId = null;

function esc(teks) {
  return String(teks)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function opsiBulan() {
  const bulan = ['2026-10', '2026-11'];
  return bulan
    .map((b) => `<option value="${b}"${b === store.bulan ? ' selected' : ''}>${namaBulanDariKode(b)}</option>`)
    .join('');
}

function pemilihBulan() {
  return `<label>Bulan
    <select id="pilih-bulan">${opsiBulan()}</select>
  </label>`;
}

function blokPesan() {
  if (!pesan) return '';
  return `<p class="pesan${pesanSalah ? ' salah' : ''}" role="status">${esc(pesan)}</p>`;
}

function tandaiAktif(rute) {
  for (const a of document.querySelectorAll('.nav-link')) {
    const href = a.getAttribute('href');
    const aktif = (rute === '#/' && href === '#/') || (rute !== '#/' && href === rute);
    a.classList.toggle('aktif', aktif);
  }
}

function pasangBulan() {
  const pilih = document.getElementById('pilih-bulan');
  if (pilih) {
    pilih.addEventListener('change', () => {
      store.setBulan(pilih.value);
      renderRute(window.location.hash);
    });
  }
}

// ---------- Ikhtisar ----------

function renderIkhtisar() {
  const bulan = store.bulan;
  const ringkas = ringkasanBulan(bulan);
  const realisasi = realisasiPerKategori(bulan);
  const tabungan = totalTargetTabungan();
  const terbaru = transaksiBulan(bulan).slice(0, 5);

  const potongan = [...realisasi.entries()]
    .map(([kategori, nilai]) => ({ label: namaKategori(kategori), nilai, warna: warnaKategori(kategori) }))
    .sort((a, b) => b.nilai - a.nilai);
  const totalKeluar = potongan.reduce((s, p) => s + p.nilai, 0);

  const lewat = store.anggaran
    .map((a) => ({ ...a, pakai: realisasi.get(a.kategori) ?? 0 }))
    .filter((a) => a.pakai > a.target);

  const legenda = potongan
    .map((p) => `<li><span><span class="titik" style="background:${p.warna}"></span>${esc(p.label)}</span><strong>${formatRupiah(p.nilai)} · ${Math.round((p.nilai / totalKeluar) * 100)}%</strong></li>`)
    .join('');

  const barisTerbaru = terbaru
    .map((t) => `<tr>
      <td>${formatTanggal(t.tanggal)}</td>
      <td>${esc(t.keterangan)}</td>
      <td>${esc(namaKategori(t.kategori))}</td>
      <td class="angka ${t.jenis === 'masuk' ? 'masuk' : 'keluar'}">${t.jenis === 'masuk' ? '+' : '−'} ${formatRupiah(t.jumlah)}</td>
    </tr>`)
    .join('');

  view.innerHTML = `
  <h1>Ikhtisar ${namaBulanDariKode(bulan)}</h1>
  <p class="sub">Uang masuk, uang keluar, dan sisa anggaran keluarga bulan ini — semua angka dihitung otomatis dari transaksi Anda.</p>
  <div class="baris-kontrol">${pemilihBulan()}</div>
  ${blokPesan()}
  <section class="ringkas" aria-label="Ringkasan bulan ini">
    <div class="kotak"><div class="label">Pemasukan</div><div class="angka masuk">${formatRupiah(ringkas.pemasukan)}</div><div class="catatan">${ringkas.jumlah} transaksi bulan ini</div></div>
    <div class="kotak"><div class="label">Pengeluaran</div><div class="angka keluar">${formatRupiah(ringkas.pengeluaran)}</div><div class="catatan">${Math.round((ringkas.pengeluaran / Math.max(ringkas.pemasukan, 1)) * 100)}% dari pemasukan</div></div>
    <div class="kotak"><div class="label">Sisa Uang</div><div class="angka ${ringkas.sisa >= 0 ? 'sisa-baik' : 'sisa-lebih'}">${formatRupiah(ringkas.sisa)}</div><div class="catatan">${ringkas.sisa >= 0 ? 'Masih dalam batas anggaran' : 'Pengeluaran melebihi pemasukan'}</div></div>
    <div class="kotak"><div class="label">Tabungan Terkumpul</div><div class="angka">${formatRupiah(tabungan)}</div><div class="catatan">Dari ${store.target.length} target tabungan</div></div>
  </section>
  ${lewat.length ? `<p class="pesan salah" role="status">Perhatian: ${lewat.map((a) => esc(namaKategori(a.kategori))).join(', ')} sudah melebihi anggaran bulan ini. Lihat <a href="#/anggaran">halaman Anggaran</a>.</p>` : `<p class="pesan" role="status">Semua kategori masih dalam anggaran bulan ini. Bagus — pertahankan sampai akhir bulan.</p>`}
  <div class="grid-2">
    <section class="kartu">
      <h2>Pengeluaran per Kategori</h2>
      <canvas class="grafik" id="donat" width="520" height="300" role="img" aria-label="Grafik donat pengeluaran per kategori"></canvas>
      <ul class="legenda">${legenda || '<li>Belum ada pengeluaran bulan ini.</li>'}</ul>
    </section>
    <section class="kartu">
      <h2>Pemasukan vs Pengeluaran</h2>
      <canvas class="grafik" id="batang" width="520" height="300" role="img" aria-label="Grafik batang pemasukan dan pengeluaran Oktober dan November 2026"></canvas>
      <p class="tengah">Bulan lalu (${BULAN_LALU.bulan}): pemasukan ${formatRupiah(BULAN_LALU.pemasukan)}, pengeluaran ${formatRupiah(BULAN_LALU.pengeluaran)}.</p>
    </section>
  </div>
  <section class="kartu">
    <h2>Transaksi Terbaru</h2>
    <div class="bungkus-tabel"><table>
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="angka">Jumlah</th></tr></thead>
      <tbody>${barisTerbaru || '<tr><td colspan="4">Belum ada transaksi bulan ini.</td></tr>'}</tbody>
    </table></div>
    <p><a class="tombol garis kecil" href="#/transaksi">Lihat semua transaksi →</a></p>
  </section>
  <aside class="tips"><strong>Tips bulan ini:</strong> sisa uang ${formatRupiah(Math.max(ringkas.sisa, 0))} — sisihkan dulu ke Dana Darurat sebelum dipakai untuk hal lain. Target Dana Darurat tinggal ${formatRupiah(10000000 - store.target[0].terkumpul)} lagi.</aside>`;

  pasangBulan();
  const donat = document.getElementById('donat');
  if (donat) gambarDonat(donat, potongan);
  const batang = document.getElementById('batang');
  if (batang) {
    gambarBatang(batang, [
      { label: 'Masuk Okt', nilai: BULAN_LALU.pemasukan, warna: '#1d7a4f' },
      { label: 'Keluar Okt', nilai: BULAN_LALU.pengeluaran, warna: '#b3382e' },
      { label: 'Masuk Nov', nilai: ringkas.pemasukan, warna: '#2f6fb2' },
      { label: 'Keluar Nov', nilai: ringkas.pengeluaran, warna: '#b97e0e' },
    ]);
  }
}

// ---------- Transaksi ----------

let filterKategori = 'semua';
let filterJenis = 'semua';

function opsiKategori(semuaLabel) {
  const opsi = [...KATEGORI_PEMASUKAN, ...KATEGORI]
    .map((k) => `<option value="${k.id}">${esc(k.nama)}</option>`)
    .join('');
  return `<option value="semua">${semuaLabel}</option>${opsi}`;
}

function renderTransaksi() {
  const bulan = store.bulan;
  let list = transaksiBulan(bulan);
  if (filterKategori !== 'semua') list = list.filter((t) => t.kategori === filterKategori);
  if (filterJenis !== 'semua') list = list.filter((t) => t.jenis === filterJenis);
  const totalMasuk = list.filter((t) => t.jenis === 'masuk').reduce((s, t) => s + t.jumlah, 0);
  const totalKeluar = list.filter((t) => t.jenis === 'keluar').reduce((s, t) => s + t.jumlah, 0);

  const sedangEdit = editId ? store.transaksi.find((t) => t.id === editId) : null;

  const baris = list
    .map((t) => `<tr>
      <td>${formatTanggal(t.tanggal)}</td>
      <td>${esc(t.keterangan)}</td>
      <td>${esc(namaKategori(t.kategori))}</td>
      <td><span class="badge${t.jenis === 'keluar' ? ' keluar' : ''}">${t.jenis === 'masuk' ? 'Masuk' : 'Keluar'}</span></td>
      <td class="angka ${t.jenis === 'masuk' ? 'masuk' : 'keluar'}">${t.jenis === 'masuk' ? '+' : '−'} ${formatRupiah(t.jumlah)}</td>
      <td><button type="button" class="tombol garis kecil" data-aksi="ubah" data-id="${t.id}">Ubah</button>
      <button type="button" class="tombol bahaya kecil" data-aksi="hapus" data-id="${t.id}">Hapus</button></td>
    </tr>`)
    .join('');

  view.innerHTML = `
  <h1>Transaksi ${namaBulanDariKode(bulan)}</h1>
  <p class="sub">Catat setiap uang masuk dan keluar. Semua total di bawah dihitung otomatis dari daftar ini.</p>
  <div class="baris-kontrol">
    ${pemilihBulan()}
    <label>Filter kategori
      <select id="filter-kategori">${opsiKategori('Semua kategori')}</select>
    </label>
    <label>Filter jenis
      <select id="filter-jenis">
        <option value="semua">Masuk &amp; keluar</option>
        <option value="masuk">Pemasukan saja</option>
        <option value="keluar">Pengeluaran saja</option>
      </select>
    </label>
  </div>
  ${blokPesan()}
  <section class="kartu">
    <h2>${sedangEdit ? 'Ubah Transaksi' : 'Tambah Transaksi'}</h2>
    <form id="form-transaksi" class="tambah">
      <label>Tanggal<input type="date" id="f-tanggal" required value="${sedangEdit ? sedangEdit.tanggal : bulan + '-26'}"></label>
      <label>Jenis
        <select id="f-jenis">
          <option value="keluar"${sedangEdit && sedangEdit.jenis === 'keluar' ? ' selected' : ''}>Pengeluaran</option>
          <option value="masuk"${sedangEdit && sedangEdit.jenis === 'masuk' ? ' selected' : ''}>Pemasukan</option>
        </select>
      </label>
      <label>Kategori<select id="f-kategori"></select></label>
      <label>Jumlah (Rp)<input type="number" id="f-jumlah" min="1" step="1" required placeholder="contoh: 150000" value="${sedangEdit ? sedangEdit.jumlah : ''}"></label>
      <label class="lebar">Keterangan<input type="text" id="f-keterangan" maxlength="80" required placeholder="contoh: Belanja sayur di pasar" value="${sedangEdit ? esc(sedangEdit.keterangan) : ''}"></label>
      <div>
        <button class="tombol" type="submit">${sedangEdit ? 'Simpan Perubahan' : 'Tambah Transaksi'}</button>
        ${sedangEdit ? ' <button class="tombol garis" type="button" id="batal-edit">Batal</button>' : ''}
      </div>
    </form>
  </section>
  <section class="kartu">
    <h2>Daftar Transaksi (${list.length})</h2>
    <p class="sub">Total tampil: masuk <strong class="masuk">${formatRupiah(totalMasuk)}</strong> · keluar <strong class="keluar">${formatRupiah(totalKeluar)}</strong> · selisih <strong>${formatRupiah(totalMasuk - totalKeluar)}</strong></p>
    <div class="bungkus-tabel"><table>
      <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th>Jenis</th><th class="angka">Jumlah</th><th>Aksi</th></tr></thead>
      <tbody>${baris || '<tr><td colspan="6">Tidak ada transaksi yang cocok dengan filter ini.</td></tr>'}</tbody>
    </table></div>
  </section>`;

  pasangBulan();
  const fk = document.getElementById('filter-kategori');
  fk.value = filterKategori;
  fk.addEventListener('change', () => { filterKategori = fk.value; renderTransaksi(); });
  const fj = document.getElementById('filter-jenis');
  fj.value = filterJenis;
  fj.addEventListener('change', () => { filterJenis = fj.value; renderTransaksi(); });

  const jenisSel = document.getElementById('f-jenis');
  const katSel = document.getElementById('f-kategori');
  const isiKategori = () => {
    const daftar = jenisSel.value === 'masuk' ? KATEGORI_PEMASUKAN : KATEGORI;
    katSel.innerHTML = daftar.map((k) => `<option value="${k.id}">${esc(k.nama)}</option>`).join('');
    if (sedangEdit) katSel.value = sedangEdit.kategori;
  };
  isiKategori();
  jenisSel.addEventListener('change', isiKategori);

  document.getElementById('form-transaksi').addEventListener('submit', (e) => {
    e.preventDefault();
    const jumlah = Number(document.getElementById('f-jumlah').value);
    const keterangan = document.getElementById('f-keterangan').value.trim();
    const tanggal = document.getElementById('f-tanggal').value;
    if (!tanggal || !keterangan || !(jumlah > 0)) {
      pesan = 'Lengkapi tanggal, keterangan, dan jumlah yang lebih dari Rp 0.';
      pesanSalah = true;
      renderTransaksi();
      return;
    }
    const data = {
      tanggal,
      keterangan,
      kategori: katSel.value,
      jenis: jenisSel.value,
      jumlah,
    };
    if (sedangEdit) {
      store.ubahTransaksi(editId, data);
      pesan = `Transaksi "${keterangan}" berhasil diubah.`;
      editId = null;
    } else {
      store.tambahTransaksi(data);
      pesan = `Transaksi "${keterangan}" sebesar ${formatRupiah(jumlah)} berhasil ditambahkan.`;
    }
    pesanSalah = false;
    renderTransaksi();
  });
  const batal = document.getElementById('batal-edit');
  if (batal) batal.addEventListener('click', () => { editId = null; pesan = ''; renderTransaksi(); });

  view.querySelectorAll('[data-aksi]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (btn.dataset.aksi === 'ubah') {
        editId = id;
        pesan = '';
        renderTransaksi();
        document.getElementById('form-transaksi')?.scrollIntoView({ behavior: 'smooth' });
      } else if (btn.dataset.aksi === 'hapus') {
        const t = store.transaksi.find((x) => x.id === id);
        if (t && window.confirm(`Hapus transaksi "${t.keterangan}" sebesar ${formatRupiah(t.jumlah)}?`)) {
          store.hapusTransaksi(id);
          pesan = `Transaksi "${t.keterangan}" dihapus.`;
          pesanSalah = false;
          renderTransaksi();
        }
      }
    });
  });
}

// ---------- Anggaran ----------

function renderAnggaran() {
  const bulan = store.bulan;
  const realisasi = realisasiPerKategori(bulan);
  let totalTarget = 0;
  let totalPakai = 0;

  const baris = store.anggaran
    .map((a) => {
      const pakai = realisasi.get(a.kategori) ?? 0;
      const sisa = a.target - pakai;
      const persen = a.target > 0 ? Math.round((pakai / a.target) * 100) : 0;
      totalTarget += a.target;
      totalPakai += pakai;
      const status = pakai > a.target
        ? '<span class="badge lebih">Melebihi</span>'
        : persen >= 80
          ? '<span class="badge hampir">Hampir habis</span>'
          : '<span class="badge">Aman</span>';
      const kelas = pakai > a.target ? 'lebih' : persen >= 80 ? 'kuning' : '';
      return `<tr${pakai > a.target ? ' class="lebih"' : ''}>
      <td><strong>${esc(namaKategori(a.kategori))}</strong></td>
      <td class="angka">${formatRupiah(pakai)}</td>
      <td>
        <form class="form-anggaran" data-kategori="${a.kategori}">
          <label class="sr-hanya" for="t-${a.kategori}">Target ${esc(namaKategori(a.kategori))}</label>
          <input type="number" id="t-${a.kategori}" min="0" step="1" value="${a.target}" aria-label="Target anggaran ${esc(namaKategori(a.kategori))}">
          <button class="tombol kecil" type="submit">Simpan</button>
        </form>
      </td>
      <td class="angka ${sisa < 0 ? 'keluar' : 'masuk'}">${formatRupiah(sisa)}</td>
      <td style="min-width:140px">
        <div class="bar-baris"><span>${persen}% terpakai</span><span>${status}</span></div>
        <div class="progres ${kelas}" role="img" aria-label="${esc(namaKategori(a.kategori))} terpakai ${persen} persen"><span style="width:${Math.min(persen, 100)}%"></span></div>
      </td>
    </tr>`;
    })
    .join('');

  const persenTotal = totalTarget > 0 ? Math.round((totalPakai / totalTarget) * 100) : 0;

  view.innerHTML = `
  <h1>Anggaran Bulanan ${namaBulanDariKode(bulan)}</h1>
  <p class="sub">Tetapkan batas belanja tiap kategori, lalu pantau realisasinya. Ubah angka target dan tekan Simpan — progress bar dan sisa anggaran langsung terhitung ulang.</p>
  <div class="baris-kontrol">${pemilihBulan()}</div>
  ${blokPesan()}
  <section class="kartu">
    <h2>Ringkasan Anggaran</h2>
    <div class="ringkas">
      <div class="kotak"><div class="label">Total Target</div><div class="angka">${formatRupiah(totalTarget)}</div></div>
      <div class="kotak"><div class="label">Total Terpakai</div><div class="angka keluar">${formatRupiah(totalPakai)}</div></div>
      <div class="kotak"><div class="label">Sisa Anggaran</div><div class="angka ${totalTarget - totalPakai >= 0 ? 'sisa-baik' : 'sisa-lebih'}">${formatRupiah(totalTarget - totalPakai)}</div></div>
      <div class="kotak"><div class="label">Terpakai</div><div class="angka">${persenTotal}%</div><div class="catatan">dari total target</div></div>
    </div>
  </section>
  <section class="kartu">
    <h2>Anggaran per Kategori</h2>
    <div class="bungkus-tabel"><table>
      <thead><tr><th>Kategori</th><th class="angka">Terpakai</th><th>Target (Rp)</th><th class="angka">Sisa</th><th>Progress</th></tr></thead>
      <tbody>${baris}</tbody>
    </table></div>
    <p class="sub">Realisasi dihitung dari transaksi bulan yang dipilih. Tambah transaksi di <a href="#/transaksi">halaman Transaksi</a> untuk mengubah angka terpakai.</p>
  </section>`;

  pasangBulan();
  view.querySelectorAll('.form-anggaran').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const kategori = form.dataset.kategori;
      const input = form.querySelector('input');
      const nilai = Number(input.value);
      if (!(nilai >= 0)) {
        pesan = 'Target anggaran harus Rp 0 atau lebih.';
        pesanSalah = true;
        renderAnggaran();
        return;
      }
      store.ubahAnggaran(kategori, nilai);
      pesan = `Target ${namaKategori(kategori)} diubah menjadi ${formatRupiah(nilai)}.`;
      pesanSalah = false;
      renderAnggaran();
    });
  });
}

// ---------- Target Tabungan ----------

function renderTarget() {
  const totalTarget = store.target.reduce((s, g) => s + g.target, 0);
  const totalTerkumpul = totalTargetTabungan();

  const kartu = store.target
    .map((g) => {
      const persen = g.target > 0 ? Math.round((g.terkumpul / g.target) * 100) : 0;
      const sisa = g.target - g.terkumpul;
      return `<article class="kartu">
      <h3>${esc(g.nama)}</h3>
      <p class="sub">${esc(g.catatan)}</p>
      <div class="bar-baris"><span>Terkumpul <strong>${formatRupiah(g.terkumpul)}</strong></span><span>Target <strong>${formatRupiah(g.target)}</strong></span></div>
      <div class="progres" role="img" aria-label="${esc(g.nama)} terkumpul ${persen} persen"><span style="width:${Math.min(persen, 100)}%"></span></div>
      <p><strong>${persen}%</strong> · ${sisa > 0 ? `kurang ${formatRupiah(sisa)} lagi` : 'Target tercapai!'} · tenggat ${formatTanggal(g.tenggat)}</p>
      <form class="form-dana" data-id="${g.id}">
        <label>Tambah dana (Rp)<input type="number" min="1" step="1" required placeholder="contoh: 200000"></label>
        <button class="tombol kecil" type="submit">Tambah ke Target</button>
      </form>
    </article>`;
    })
    .join('');

  view.innerHTML = `
  <h1>Target Tabungan</h1>
  <p class="sub">Tiga tujuan besar keluarga: dana darurat, liburan, dan kendaraan baru. Tambah dana kapan pun ada sisa uang — progress langsung bergerak.</p>
  ${blokPesan()}
  <section class="ringkas">
    <div class="kotak"><div class="label">Total Target</div><div class="angka">${formatRupiah(totalTarget)}</div></div>
    <div class="kotak"><div class="label">Total Terkumpul</div><div class="angka masuk">${formatRupiah(totalTerkumpul)}</div></div>
    <div class="kotak"><div class="label">Kurang</div><div class="angka">${formatRupiah(totalTarget - totalTerkumpul)}</div></div>
    <div class="kotak"><div class="label">Tercapai</div><div class="angka">${totalTarget > 0 ? Math.round((totalTerkumpul / totalTarget) * 100) : 0}%</div><div class="catatan">dari semua target</div></div>
  </section>
  <div class="daftar-target">${kartu}</div>
  <section class="kartu">
    <h2>Buat Target Baru</h2>
    <form id="form-target">
      <label>Nama target<input type="text" id="g-nama" maxlength="60" required placeholder="contoh: Renovasi dapur"></label>
      <label>Target (Rp)<input type="number" id="g-target" min="1" step="1" required placeholder="contoh: 3000000"></label>
      <label>Tenggat<input type="date" id="g-tenggat" required value="2027-12-31"></label>
      <label>Catatan<input type="text" id="g-catatan" maxlength="100" placeholder="contoh: Cat dapur dan ganti keramik"></label>
      <button class="tombol" type="submit">Tambah Target</button>
    </form>
  </section>`;

  view.querySelectorAll('.form-dana').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const jumlah = Number(form.querySelector('input').value);
      if (!(jumlah > 0)) {
        pesan = 'Jumlah dana harus lebih dari Rp 0.';
        pesanSalah = true;
        renderTarget();
        return;
      }
      const g = store.target.find((x) => x.id === form.dataset.id);
      store.tambahDanaTarget(form.dataset.id, jumlah);
      pesan = `${formatRupiah(jumlah)} ditambahkan ke "${g ? g.nama : 'target'}".`;
      pesanSalah = false;
      renderTarget();
    });
  });

  document.getElementById('form-target').addEventListener('submit', (e) => {
    e.preventDefault();
    const nama = document.getElementById('g-nama').value.trim();
    const target = Number(document.getElementById('g-target').value);
    const tenggat = document.getElementById('g-tenggat').value;
    const catatan = document.getElementById('g-catatan').value.trim() || 'Target tabungan keluarga.';
    if (!nama || !(target > 0) || !tenggat) {
      pesan = 'Lengkapi nama, target, dan tenggat target baru.';
      pesanSalah = true;
      renderTarget();
      return;
    }
    store.tambahTarget({ nama, target, terkumpul: 0, tenggat, catatan });
    pesan = `Target "${nama}" sebesar ${formatRupiah(target)} berhasil dibuat.`;
    pesanSalah = false;
    renderTarget();
  });
}

// ---------- Router ----------

export function renderRute(hash) {
  const rute = (hash || '#/').split('?')[0];
  pesan = '';
  pesanSalah = false;
  if (rute === '#/transaksi') {
    tandaiAktif('#/transaksi');
    renderTransaksi();
  } else if (rute === '#/anggaran') {
    tandaiAktif('#/anggaran');
    renderAnggaran();
  } else if (rute === '#/target') {
    tandaiAktif('#/target');
    renderTarget();
  } else {
    tandaiAktif('#/');
    renderIkhtisar();
  }
  window.scrollTo(0, 0);
}
