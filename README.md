# Dompet Keluarga — Anggaran Rumah Tangga

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/NgademinSikil/makefun-household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/NgademinSikil/makefun-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

Situs anggaran rumah tangga untuk [make.fun bounty "Make the best household budget site"](https://make.fun/bounty/best-household-budget-site-20261126-1457) — berjalan penuh di browser desktop dan ponsel dari file statis, tanpa network.

Empat halaman lewat hash route: Ikhtisar, Transaksi, Anggaran, dan Target Tabungan. Pelacak pemasukan-pengeluaran (tambah, edit, hapus transaksi dengan kategori dan tanggal), perencana anggaran bulanan per kategori (target vs realisasi, sisa, progress bar), target tabungan dengan progress, chart donat dan batang digambar dengan canvas polos (tanpa library), tampilan bulanan dengan filter kategori — semua angka dihitung otomatis dan tersimpan di perangkat sendiri (localStorage).

## Angka di dalamnya (contoh rumah tangga Indonesia, November 2026)

- **Pemasukan November:** Rp 9.950.000 (gaji Rp 8.500.000 + penghasilan tambahan)
- **Pengeluaran November:** Rp 6.064.000 · **Sisa:** Rp 3.886.000
- **Tabungan terkumpul:** Rp 12.300.000 (Dana Darurat, Pendidikan Anak, Liburan Keluarga)
- **Transaksi contoh:** 24 transaksi November 2026 + 15 transaksi Oktober 2026, 8 kategori anggaran

## Jalankan

Serve `app/` dengan server statis apa saja dan buka `index.html`:

```sh
npx serve app
```

## Layout

- `main.ts` — menyerahkan situs: menyalin `app/` dan `screenshots/` ke `/output` dan menulis `dossier.json`
- `app/index.html` — halaman + navigasi
- `app/data.js` — transaksi contoh, kategori anggaran, dan target tabungan
- `app/store.js` — state, perhitungan, dan penyimpanan lokal
- `app/views.js` — render tiap halaman dan routing
- `app/charts.js` — chart donat dan batang canvas
- `app/main.js` — init
- `app/style.css` — tampilan + layout ponsel

Screenshot di `screenshots/` adalah render asli situs yang sedang berjalan (desktop 1280×800 dan ponsel 390×844).

Dibangun untuk [make.fun](https://make.fun/r/ds1567x3) — lihat, nilai, dan bangun versimu sendiri.
