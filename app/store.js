// store.js — data situs dan perhitungannya. Satu-satunya sumber kebenaran
// untuk transaksi, anggaran, dan target tabungan. Perubahan disimpan ke
// localStorage bila tersedia, dan selalu bisa dibaca kembali dari data awal.

import {
  ANGGARAN_AWAL,
  BULAN_INI,
  TARGET_AWAL,
  TRANSAKSI_AWAL,
  namaKategori,
  warnaKategori,
} from './data.js';

const KUNCI = 'dompet-keluarga-v1';

function muat() {
  try {
    const mentah = window.localStorage.getItem(KUNCI);
    if (!mentah) return null;
    const data = JSON.parse(mentah);
    if (!Array.isArray(data.transaksi) || !Array.isArray(data.anggaran) || !Array.isArray(data.target)) return null;
    return data;
  } catch {
    return null;
  }
}

function simpan() {
  try {
    window.localStorage.setItem(KUNCI, JSON.stringify(state));
  } catch {
    // Penyimpanan tidak tersedia (misalnya mode privat): situs tetap jalan
    // di memori selama halaman terbuka.
  }
}

const tersimpan = muat();
const state = tersimpan ?? {
  transaksi: TRANSAKSI_AWAL.map((t) => ({ ...t })),
  anggaran: ANGGARAN_AWAL.map((a) => ({ ...a })),
  target: TARGET_AWAL.map((g) => ({ ...g })),
  bulan: BULAN_INI,
};

export const store = {
  get transaksi() { return state.transaksi; },
  get anggaran() { return state.anggaran; },
  get target() { return state.target; },
  get bulan() { return state.bulan; },
  setBulan(bulan) { state.bulan = bulan; simpan(); },

  tambahTransaksi(trx) {
    const id = 't' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
    state.transaksi.push({ id, ...trx });
    simpan();
    return id;
  },
  ubahTransaksi(id, trx) {
    const i = state.transaksi.findIndex((t) => t.id === id);
    if (i === -1) return false;
    state.transaksi[i] = { id, ...trx };
    simpan();
    return true;
  },
  hapusTransaksi(id) {
    const i = state.transaksi.findIndex((t) => t.id === id);
    if (i === -1) return false;
    state.transaksi.splice(i, 1);
    simpan();
    return true;
  },
  ubahAnggaran(kategori, target) {
    const a = state.anggaran.find((x) => x.kategori === kategori);
    if (!a) return false;
    a.target = target;
    simpan();
    return true;
  },
  tambahDanaTarget(id, jumlah) {
    const g = state.target.find((x) => x.id === id);
    if (!g) return false;
    g.terkumpul += jumlah;
    simpan();
    return true;
  },
  tambahTarget(goal) {
    const id = 'g' + Date.now().toString(36);
    state.target.push({ id, ...goal });
    simpan();
    return id;
  },
  reset() {
    state.transaksi = TRANSAKSI_AWAL.map((t) => ({ ...t }));
    state.anggaran = ANGGARAN_AWAL.map((a) => ({ ...a }));
    state.target = TARGET_AWAL.map((g) => ({ ...g }));
    state.bulan = BULAN_INI;
    simpan();
  },
};

// ---- Perhitungan ----

export function transaksiBulan(bulan) {
  return state.transaksi
    .filter((t) => t.tanggal.startsWith(bulan))
    .sort((a, b) => (a.tanggal < b.tanggal ? 1 : a.tanggal > b.tanggal ? -1 : 0));
}

export function ringkasanBulan(bulan) {
  const list = transaksiBulan(bulan);
  let pemasukan = 0;
  let pengeluaran = 0;
  for (const t of list) {
    if (t.jenis === 'masuk') pemasukan += t.jumlah;
    else pengeluaran += t.jumlah;
  }
  return { pemasukan, pengeluaran, sisa: pemasukan - pengeluaran, jumlah: list.length };
}

export function realisasiPerKategori(bulan) {
  const hasil = new Map();
  for (const t of transaksiBulan(bulan)) {
    if (t.jenis !== 'keluar') continue;
    hasil.set(t.kategori, (hasil.get(t.kategori) ?? 0) + t.jumlah);
  }
  return hasil;
}

export function totalTargetTabungan() {
  return state.target.reduce((s, g) => s + g.terkumpul, 0);
}

// ---- Format ----

export function formatRupiah(nilai) {
  return 'Rp ' + nilai.toLocaleString('id-ID');
}

export function formatTanggal(iso) {
  const [tahun, bulan, hari] = iso.split('-').map(Number);
  const nama = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][bulan - 1];
  return `${hari} ${nama} ${tahun}`;
}

export function namaBulanDariKode(kode) {
  const [tahun, bulan] = kode.split('-').map(Number);
  const nama = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][bulan - 1];
  return `${nama} ${tahun}`;
}

export { namaKategori, warnaKategori };
