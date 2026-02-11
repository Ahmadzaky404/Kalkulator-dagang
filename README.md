# 💰 Purchase Calculator (Kalkulator Dagang)

Aplikasi kalkulator pembelian berbasis **Node.js** dengan fitur lengkap untuk menghitung kembalian, menyimpan transaksi, dan melihat statistik penjualan. Tersedia dalam 2 versi: **Web UI** (tampilan grafis) dan **CLI** (terminal).

**✨ Fitur Utama:**
- 🛒 Perhitungan kembalian otomatis dengan support multiple items
- 💾 Penyimpanan transaksi otomatis
- 📊 Statistik penjualan (total revenue & jumlah transaksi)
- 📅 Filter transaksi berdasarkan hari atau bulan
- 🎨 Desain minimalis dan user-friendly
- ✅ Validasi input lengkap
- 🧪 Test coverage komprehensif (33 unit tests)

**🛠️ Tech Stack:**
- **Backend**: Node.js + ES6 Modules
- **Frontend**: HTML, CSS, JavaScript (Vanilla) + Tailwind CSS
- **Testing**: Jest + fast-check
- **Storage**: localStorage (Web) / JSON file (CLI)

## Fitur

### 1. Mode Perhitungan Pembelian
- Menghitung uang kembalian secara otomatis
- Validasi input untuk mencegah kesalahan
- Opsi untuk menyimpan transaksi

### 2. Mode Manajemen Transaksi
- **Lihat Semua Transaksi**: Menampilkan seluruh riwayat transaksi yang tersimpan
- **Filter Berdasarkan Hari**: Melihat transaksi pada tanggal tertentu
- **Filter Berdasarkan Bulan**: Melihat transaksi dalam bulan tertentu
- **Statistik Penjualan**: Menampilkan total revenue dan jumlah transaksi

### 3. Fitur Tambahan
- Data persisten (tersimpan di file JSON)
- Sorting otomatis berdasarkan tanggal (terbaru di atas)
- Format mata uang Rupiah
- Validasi input dengan pesan error yang jelas
- Error handling yang robust

## Persyaratan Sistem

- Node.js versi 18 atau lebih tinggi
- npm (Node Package Manager)

## Instalasi

1. Clone atau download repository ini
2. Buka terminal di folder proyek
3. Install dependencies:

```bash
npm install
```

## Cara Menjalankan

### Versi Web (Dengan UI Grafis) - RECOMMENDED

Jalankan aplikasi web dengan perintah:

```bash
npm run start:web
```

Kemudian buka browser dan akses:
```
http://localhost:3000
```

Aplikasi akan terbuka dengan tampilan UI yang modern dan mudah digunakan!

### Versi Terminal (CLI)

Jalankan aplikasi CLI dengan perintah:

```bash
npm start
```

Atau langsung dengan Node.js:

```bash
node src/index.js
```

## Cara Menggunakan

### Versi Web (UI Grafis)

Aplikasi web memiliki tampilan yang intuitif dengan menu-menu berikut:

**Menu Utama:**
- 🛒 Mode Perhitungan Pembelian
- 📊 Mode Manajemen Transaksi

**Mode Perhitungan Pembelian:**
1. Masukkan harga barang
2. Masukkan uang pembayaran
3. Klik "Hitung Kembalian"
4. Hasil akan ditampilkan dengan opsi untuk menyimpan transaksi

**Mode Manajemen Transaksi:**
- 📋 Lihat Semua Transaksi - Menampilkan semua transaksi dengan statistik
- 📅 Filter Berdasarkan Hari - Filter transaksi berdasarkan tanggal tertentu
- 📆 Filter Berdasarkan Bulan - Filter transaksi berdasarkan bulan tertentu

### Versi Terminal (CLI)

### Mode Perhitungan Pembelian

1. Pilih menu "1. Mode Perhitungan Pembelian"
2. Masukkan harga barang (contoh: 50000)
3. Masukkan uang pembayaran (contoh: 100000)
4. Aplikasi akan menampilkan uang kembalian
5. Pilih apakah ingin menyimpan transaksi (y/n)

### Mode Manajemen Transaksi

1. Pilih menu "2. Mode Manajemen Transaksi"
2. Pilih sub-menu yang diinginkan:
   - **Lihat Semua Transaksi**: Menampilkan semua transaksi dengan statistik
   - **Filter Berdasarkan Hari**: Input hari, bulan, dan tahun untuk filter
   - **Filter Berdasarkan Bulan**: Input bulan dan tahun untuk filter

### Contoh Penggunaan

```
=================================
   PURCHASE CALCULATOR
=================================
1. Mode Perhitungan Pembelian
2. Mode Manajemen Transaksi
3. Keluar
=================================
Pilih menu (1-3): 1

=================================
   MODE PERHITUNGAN PEMBELIAN
=================================

Masukkan harga barang: Rp 50000
Masukkan uang pembayaran: Rp 100000

=================================
✓ TRANSAKSI BERHASIL
=================================
Harga Barang    : Rp 50.000
Uang Pembayaran : Rp 100.000
Uang Kembalian  : Rp 50.000
=================================

Simpan transaksi ini? (y/n): y
✓ Transaksi berhasil disimpan!
```

## Testing

### Menjalankan Semua Test

```bash
npm test
```

### Menjalankan Test dengan Watch Mode

```bash
npm run test:watch
```

### Menjalankan Test dengan Coverage

```bash
npm run test:coverage
```

### Test Coverage

Aplikasi ini memiliki test coverage yang komprehensif:
- Unit tests untuk semua komponen utama
- Test untuk validasi input dan error handling
- Test untuk perhitungan dan statistik
- Test untuk serialization/deserialization

## Struktur Proyek

```
purchase-calculator/
├── public/                         # Web UI files
│   ├── index.html                  # Main HTML file
│   ├── styles.css                  # Styling
│   └── app.js                      # Frontend JavaScript
├── src/
│   ├── models/
│   │   └── Transaction.js          # Model data transaksi
│   ├── services/
│   │   ├── PurchaseCalculator.js   # Logika perhitungan
│   │   ├── TransactionManager.js   # Manajemen transaksi
│   │   ├── StatisticsCalculator.js # Perhitungan statistik
│   │   └── StorageService.js       # Persistensi data
│   ├── ui/
│   │   └── CLI.js                  # Antarmuka CLI
│   └── index.js                    # Entry point aplikasi CLI
├── tests/
│   ├── unit/                       # Unit tests
│   └── properties/                 # Property-based tests
├── data/
│   └── transactions.json           # File penyimpanan data (CLI version)
├── server.js                       # HTTP server untuk web version
├── package.json
└── README.md
```

## Teknologi yang Digunakan

- **Runtime**: Node.js (v18+)
- **Backend**: Node.js HTTP Server
- **Language**: JavaScript (ES6+ dengan ES Modules)
- **Frontend**: Vanilla JavaScript + Tailwind CSS
- **Testing**: Jest + fast-check
- **Storage**: 
  - Web version: Browser localStorage
  - CLI version: JSON file-based storage
- **CLI**: Node.js readline module

## Fitur Keamanan dan Validasi

- Validasi input numerik (harus angka positif)
- Validasi tanggal (hari 1-31, bulan 1-12, tahun valid)
- Error handling untuk file I/O operations
- Backup otomatis jika file JSON corrupt
- Retry logic untuk input yang tidak valid

## Data Storage

### Versi Web
Data transaksi disimpan di **localStorage** browser, sehingga data akan tetap tersimpan meskipun browser ditutup (selama tidak clear browser data).

### Versi CLI
Data transaksi disimpan dalam file `data/transactions.json` dengan format:

```json
{
  "version": "1.0",
  "transactions": [
    {
      "id": "uuid-here",
      "itemPrice": 50000,
      "paymentAmount": 100000,
      "changeAmount": 50000,
      "date": {
        "day": 8,
        "month": 2,
        "year": 2026,
        "timestamp": 1738972800000
      }
    }
  ]
}
```

## Troubleshooting

### Aplikasi tidak bisa menyimpan data
- Pastikan folder `data/` ada dan memiliki permission write
- Cek apakah ada file `transactions.json.backup` jika file utama corrupt

### Test gagal
- Pastikan Node.js versi 18 atau lebih tinggi
- Jalankan `npm install` ulang untuk memastikan dependencies terinstall

### Error "Cannot find module"
- Pastikan menggunakan Node.js dengan ES Modules support
- Cek bahwa `"type": "module"` ada di package.json

## Kontribusi

Untuk berkontribusi pada proyek ini:
1. Fork repository
2. Buat branch baru untuk fitur Anda
3. Commit perubahan Anda
4. Push ke branch
5. Buat Pull Request

## Lisensi

MIT License

## Kontak

Untuk pertanyaan atau saran, silakan buat issue di repository ini.

---

