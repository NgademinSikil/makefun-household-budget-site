// main.js — boot situs Dompet Keluarga.
//
// Begitu modul ini dimuat, ia merender halaman yang ditunjuk hash di address
// bar (#/, #/transaksi, #/anggaran, atau #/target), lalu merender ulang tiap
// kali hash berubah. Semua data dan grafik berasal dari file di bawah app/;
// halaman ini tidak pernah memanggil jaringan.

import { renderRute } from './views.js';

const tampilkanHalaman = () => renderRute(window.location.hash);

window.addEventListener('hashchange', tampilkanHalaman);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tampilkanHalaman, { once: true });
} else {
  tampilkanHalaman();
}
