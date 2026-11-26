// data.js — data contoh Dompet Keluarga: satu rumah tangga Indonesia,
// bulan November 2026 (bulan berjalan) plus ringkasan Oktober 2026 untuk
// perbandingan. Semua angka dalam Rupiah. Data ini hanya titik awal: pengguna
// bisa menambah, mengubah, dan menghapus transaksi, anggaran, dan target
// dari dalam situs, dan perubahan itu tersimpan di perangkatnya sendiri.

export const KATEGORI = [
  { id: 'belanja', nama: 'Belanja Harian', warna: '#1d7a4f' },
  { id: 'listrik', nama: 'Listrik & Air', warna: '#2f6fb2' },
  { id: 'transport', nama: 'Transportasi', warna: '#b97e0e' },
  { id: 'pendidikan', nama: 'Pendidikan', warna: '#7a4fb3' },
  { id: 'kesehatan', nama: 'Kesehatan', warna: '#b3382e' },
  { id: 'hiburan', nama: 'Hiburan', warna: '#0e7a7a' },
  { id: 'cicilan', nama: 'Cicilan', warna: '#5d6b63' },
  { id: 'lainnya', nama: 'Lainnya', warna: '#8a6d3b' },
];

export const KATEGORI_PEMASUKAN = [
  { id: 'gaji', nama: 'Gaji' },
  { id: 'usaha', nama: 'Usaha Sampingan' },
  { id: 'lain-masuk', nama: 'Pemasukan Lain' },
];

// Anggaran bulanan November 2026: target tiap kategori.
export const ANGGARAN_AWAL = [
  { kategori: 'belanja', target: 2400000 },
  { kategori: 'listrik', target: 550000 },
  { kategori: 'transport', target: 700000 },
  { kategori: 'pendidikan', target: 900000 },
  { kategori: 'kesehatan', target: 400000 },
  { kategori: 'hiburan', target: 350000 },
  { kategori: 'cicilan', target: 1250000 },
  { kategori: 'lainnya', target: 300000 },
];

// Transaksi contoh. id unik, tanggal ISO, jenis 'masuk' atau 'keluar'.
export const TRANSAKSI_AWAL = [
  { id: 't01', tanggal: '2026-11-01', keterangan: 'Gaji bulanan November', kategori: 'gaji', jenis: 'masuk', jumlah: 8500000 },
  { id: 't02', tanggal: '2026-11-01', keterangan: 'Belanja mingguan pasar', kategori: 'belanja', jenis: 'keluar', jumlah: 385000 },
  { id: 't03', tanggal: '2026-11-02', keterangan: 'Token listrik 200 kWh', kategori: 'listrik', jenis: 'keluar', jumlah: 220000 },
  { id: 't04', tanggal: '2026-11-03', keterangan: 'Bensin motor (2x isi)', kategori: 'transport', jenis: 'keluar', jumlah: 120000 },
  { id: 't05', tanggal: '2026-11-04', keterangan: 'SPP sekolah anak', kategori: 'pendidikan', jenis: 'keluar', jumlah: 650000 },
  { id: 't06', tanggal: '2026-11-05', keterangan: 'Belanja sayur & lauk', kategori: 'belanja', jenis: 'keluar', jumlah: 210000 },
  { id: 't07', tanggal: '2026-11-06', keterangan: 'Cicilan motor bulan ke-14', kategori: 'cicilan', jenis: 'keluar', jumlah: 1250000 },
  { id: 't08', tanggal: '2026-11-08', keterangan: 'Belanja bulanan minimarket', kategori: 'belanja', jenis: 'keluar', jumlah: 640000 },
  { id: 't09', tanggal: '2026-11-10', keterangan: 'Jasa desain logo (freelance)', kategori: 'usaha', jenis: 'masuk', jumlah: 1200000 },
  { id: 't10', tanggal: '2026-11-11', keterangan: 'Tagihan air PDAM', kategori: 'listrik', jenis: 'keluar', jumlah: 145000 },
  { id: 't11', tanggal: '2026-11-12', keterangan: 'Ongkos ojek online seminggu', kategori: 'transport', jenis: 'keluar', jumlah: 98000 },
  { id: 't12', tanggal: '2026-11-13', keterangan: 'Buku & alat tulis anak', kategori: 'pendidikan', jenis: 'keluar', jumlah: 175000 },
  { id: 't13', tanggal: '2026-11-14', keterangan: 'Berobat ke puskesmas', kategori: 'kesehatan', jenis: 'keluar', jumlah: 85000 },
  { id: 't14', tanggal: '2026-11-15', keterangan: 'Belanja mingguan pasar', kategori: 'belanja', jenis: 'keluar', jumlah: 342000 },
  { id: 't15', tanggal: '2026-11-16', keterangan: 'Nonton bioskop keluarga', kategori: 'hiburan', jenis: 'keluar', jumlah: 180000 },
  { id: 't16', tanggal: '2026-11-18', keterangan: 'Beli vitamin & obat', kategori: 'kesehatan', jenis: 'keluar', jumlah: 132000 },
  { id: 't17', tanggal: '2026-11-19', keterangan: 'Bensin motor', kategori: 'transport', jenis: 'keluar', jumlah: 60000 },
  { id: 't18', tanggal: '2026-11-20', keterangan: 'Langganan streaming sebulan', kategori: 'hiburan', jenis: 'keluar', jumlah: 54000 },
  { id: 't19', tanggal: '2026-11-21', keterangan: 'Belanja mingguan pasar', kategori: 'belanja', jenis: 'keluar', jumlah: 298000 },
  { id: 't20', tanggal: '2026-11-22', keterangan: 'Servis motor ringan', kategori: 'transport', jenis: 'keluar', jumlah: 145000 },
  { id: 't21', tanggal: '2026-11-23', keterangan: 'Jual barang bekas online', kategori: 'lain-masuk', jenis: 'masuk', jumlah: 250000 },
  { id: 't22', tanggal: '2026-11-24', keterangan: 'Belanja dapur & gas LPG', kategori: 'belanja', jenis: 'keluar', jumlah: 410000 },
  { id: 't23', tanggal: '2026-11-25', keterangan: 'Les privat matematika anak', kategori: 'pendidikan', jenis: 'keluar', jumlah: 300000 },
  { id: 't24', tanggal: '2026-11-26', keterangan: 'Makan di luar keluarga', kategori: 'lainnya', jenis: 'keluar', jumlah: 165000 },
  // Oktober 2026 — supaya pemilih bulan juga menampilkan bulan yang lengkap.
  { id: 'o01', tanggal: '2026-10-01', keterangan: 'Gaji bulanan Oktober', kategori: 'gaji', jenis: 'masuk', jumlah: 8500000 },
  { id: 'o02', tanggal: '2026-10-03', keterangan: 'Belanja mingguan pasar', kategori: 'belanja', jenis: 'keluar', jumlah: 365000 },
  { id: 'o03', tanggal: '2026-10-05', keterangan: 'Token listrik 200 kWh', kategori: 'listrik', jenis: 'keluar', jumlah: 215000 },
  { id: 'o04', tanggal: '2026-10-07', keterangan: 'SPP sekolah anak', kategori: 'pendidikan', jenis: 'keluar', jumlah: 650000 },
  { id: 'o05', tanggal: '2026-10-09', keterangan: 'Cicilan motor bulan ke-13', kategori: 'cicilan', jenis: 'keluar', jumlah: 1250000 },
  { id: 'o06', tanggal: '2026-10-11', keterangan: 'Belanja bulanan minimarket', kategori: 'belanja', jenis: 'keluar', jumlah: 590000 },
  { id: 'o07', tanggal: '2026-10-14', keterangan: 'Bensin motor', kategori: 'transport', jenis: 'keluar', jumlah: 110000 },
  { id: 'o08', tanggal: '2026-10-16', keterangan: 'Jasa ketik & print (freelance)', kategori: 'usaha', jenis: 'masuk', jumlah: 800000 },
  { id: 'o09', tanggal: '2026-10-18', keterangan: 'Belanja sayur & lauk', kategori: 'belanja', jenis: 'keluar', jumlah: 285000 },
  { id: 'o10', tanggal: '2026-10-20', keterangan: 'Tagihan air PDAM', kategori: 'listrik', jenis: 'keluar', jumlah: 138000 },
  { id: 'o11', tanggal: '2026-10-22', keterangan: 'Beli obat & vitamin', kategori: 'kesehatan', jenis: 'keluar', jumlah: 95000 },
  { id: 'o12', tanggal: '2026-10-25', keterangan: 'Belanja mingguan pasar', kategori: 'belanja', jenis: 'keluar', jumlah: 320000 },
  { id: 'o13', tanggal: '2026-10-27', keterangan: 'Nonton & jajan keluarga', kategori: 'hiburan', jenis: 'keluar', jumlah: 145000 },
  { id: 'o14', tanggal: '2026-10-29', keterangan: 'Ongkos ojek online', kategori: 'transport', jenis: 'keluar', jumlah: 88000 },
  { id: 'o15', tanggal: '2026-10-31', keterangan: 'Belanja dapur akhir bulan', kategori: 'belanja', jenis: 'keluar', jumlah: 410000 },
];

// Target tabungan keluarga.
export const TARGET_AWAL = [
  { id: 'g01', nama: 'Dana Darurat', target: 10000000, terkumpul: 6400000, tenggat: '2027-03-31', catatan: 'Cadangan 3 bulan pengeluaran pokok.' },
  { id: 'g02', nama: 'Liburan Keluarga ke Bali', target: 5000000, terkumpul: 2100000, tenggat: '2027-06-30', catatan: 'Tiket, penginapan, dan uang saku 4 hari.' },
  { id: 'g03', nama: 'DP Motor Baru', target: 12000000, terkumpul: 3800000, tenggat: '2027-12-31', catatan: 'Ganti motor lama yang sudah sering mogok.' },
];

// Ringkasan bulan lalu (Oktober 2026) untuk grafik perbandingan.
export const BULAN_LALU = { bulan: 'Oktober 2026', pemasukan: 9300000, pengeluaran: 6850000 };

export const BULAN_INI = '2026-11';
export const NAMA_BULAN = 'November 2026';

export function namaKategori(id) {
  const semua = [...KATEGORI, ...KATEGORI_PEMASUKAN];
  const ketemu = semua.find((k) => k.id === id);
  return ketemu ? ketemu.nama : id;
}

export function warnaKategori(id) {
  const ketemu = KATEGORI.find((k) => k.id === id);
  return ketemu ? ketemu.warna : '#8a6d3b';
}
