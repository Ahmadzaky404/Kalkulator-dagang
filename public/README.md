# Purchase Calculator - Web Version

## Fitur UI

### 🎨 Desain Modern
- Gradient background yang menarik
- Card-based layout yang clean
- Responsive design (mobile-friendly)
- Smooth animations dan transitions

### 💾 Data Persistence
- Menggunakan localStorage browser
- Data tetap tersimpan meskipun browser ditutup
- Tidak perlu database atau backend

### ✨ User Experience
- Form validation real-time
- Error messages yang jelas
- Success/error indicators dengan warna
- Format mata uang Rupiah otomatis
- Sorting transaksi otomatis (terbaru di atas)

## Teknologi

- **HTML5** - Struktur halaman
- **CSS3** - Styling dengan gradients dan animations
- **Vanilla JavaScript (ES6+)** - Logic tanpa framework
- **localStorage API** - Data persistence
- **Node.js HTTP Server** - Simple web server

## Browser Support

Aplikasi ini kompatibel dengan browser modern:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Cara Menggunakan

1. Jalankan server: `npm run start:web`
2. Buka browser: `http://localhost:3000`
3. Mulai gunakan aplikasi!

## Fitur Lengkap

### Mode Perhitungan Pembelian
- Input harga barang dan uang pembayaran
- Validasi input otomatis
- Perhitungan kembalian instant
- Opsi simpan transaksi

### Mode Manajemen Transaksi
- Lihat semua transaksi dengan statistik
- Filter berdasarkan hari tertentu
- Filter berdasarkan bulan tertentu
- Statistik real-time (total transaksi & revenue)

## Tips

- Data disimpan di browser, jadi gunakan browser yang sama untuk akses data
- Jangan clear browser data jika ingin menyimpan transaksi
- Untuk backup data, bisa export dari localStorage (fitur advanced)

## Development

File-file web ada di folder `public/`:
- `index.html` - Struktur HTML
- `styles.css` - Semua styling
- `app.js` - Business logic dan UI interactions

Server sederhana ada di `server.js` untuk serve static files.


---

## ✨ UPDATE: Multiple Items Support!

Aplikasi sekarang mendukung **transaksi dengan banyak barang**!

### Cara Menggunakan:

1. **Tambah Barang ke Keranjang:**
   - Isi nama barang (contoh: "Beras 5kg")
   - Isi harga per item (contoh: 50000)
   - Isi jumlah/quantity (contoh: 2)
   - Klik "➕ Tambah Barang"
   - Ulangi untuk barang lainnya

2. **Kelola Keranjang:**
   - Lihat daftar semua barang
   - Total harga dihitung otomatis
   - Hapus item individual dengan tombol 🗑️
   - Hapus semua dengan "🗑️ Hapus Semua"

3. **Selesaikan Transaksi:**
   - Masukkan uang pembayaran
   - Klik "💰 Hitung Kembalian"
   - Lihat detail lengkap + kembalian
   - Simpan transaksi

### Contoh Transaksi:
```
Barang 1: Beras 5kg - 2 × Rp 50.000 = Rp 100.000
Barang 2: Minyak Goreng - 1 × Rp 25.000 = Rp 25.000
Barang 3: Gula 1kg - 3 × Rp 15.000 = Rp 45.000
─────────────────────────────────────────────────
Total: Rp 170.000
Bayar: Rp 200.000
Kembalian: Rp 30.000 ✓
```

### Fitur Baru:
- ✅ Support multiple items per transaksi
- ✅ Nama barang, harga, dan quantity
- ✅ Subtotal per item otomatis
- ✅ Total keseluruhan real-time
- ✅ Detail items tersimpan di transaksi
- ✅ Tampil di riwayat transaksi

**Refresh browser untuk melihat update!** 🎉
