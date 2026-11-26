// Dompet Keluarga — program penyerahan entri (Node 22, standard library only).
//
// Situsnya tinggal di app/: file statis yang dibuka browser tanpa build step
// dan tanpa satu pun permintaan jaringan. Yang dilakukan program ini hanyalah
// menyerahkan situs itu apa adanya: menyalin app/ dan screenshots/ dari
// samping file ini ke direktori keluaran, lalu menulis dossier.json memakai
// pustaka make.fun yang divendor di vendor/makefun-frontend.ts.
//
// Pustaka vendor itu jangan diubah: scorer membangun ulang dossier dengan
// salinannya sendiri dan membandingkan byte per byte.
//
// Di luar kontainer grader, MAKEFUN_OUTPUT_DIR menggantikan /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Akar repo = direktori tempat file ini berada.
const akarRepo = fileURLToPath(new URL('.', import.meta.url));
const direktoriKeluaran = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const sumberAplikasi = join(akarRepo, 'app');
const sumberGambar = join(akarRepo, 'screenshots');

function wajibAda(jalur, nama) {
  if (!existsSync(jalur)) throw new Error(`${nama} tidak ditemukan: ${jalur}`);
}

function hitungFile(jalur) {
  let jumlah = 0;
  for (const entri of readdirSync(jalur, { withFileTypes: true })) {
    const penuh = join(jalur, entri.name);
    jumlah += entri.isDirectory() ? hitungFile(penuh) : 1;
  }
  return jumlah;
}

// Periksa dulu sumbernya sebelum menyalin apa pun, supaya kegagalan
// terdengar sejak awal, bukan setelah dossier setengah jadi.
wajibAda(join(sumberAplikasi, 'index.html'), 'app/index.html');
wajibAda(sumberGambar, 'screenshots/');
const jumlahGambar = readdirSync(sumberGambar).filter((nama) => {
  const penuh = join(sumberGambar, nama);
  return statSync(penuh).isFile() && !nama.startsWith('.');
}).length;
if (jumlahGambar < 3 || jumlahGambar > 4) {
  throw new Error(`screenshots/ harus berisi 3 sampai 4 gambar, ada ${jumlahGambar}`);
}

mkdirSync(direktoriKeluaran, { recursive: true });
cpSync(sumberAplikasi, join(direktoriKeluaran, 'app'), { recursive: true });

const targetGambar = join(direktoriKeluaran, 'screenshots');
mkdirSync(targetGambar, { recursive: true });
cpSync(sumberGambar, targetGambar, { recursive: true });

// Batas-batas ini mengikuti aturan gate: teks dossier dibatasi 160 KiB,
// paling banyak 4 screenshot @ 256 KiB, app/ paling banyak 993 file dan 16 MiB.
const dossier = buildDossier(direktoriKeluaran, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(direktoriKeluaran, 'dossier.json'), dossier);

// Ringkasan singkat untuk log: berapa file yang diserahkan.
console.log(
  `Dompet Keluarga diserahkan: ${hitungFile(sumberAplikasi)} file app/, ` +
  `${jumlahGambar} screenshot, dossier ${Buffer.byteLength(dossier)} byte.`,
);
