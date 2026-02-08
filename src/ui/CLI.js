import readline from 'readline';

/**
 * CLI interface untuk Purchase Calculator
 */
class CLI {
  /**
   * @param {PurchaseCalculator} purchaseCalculator
   * @param {TransactionManager} transactionManager
   * @param {StatisticsCalculator} statisticsCalculator
   */
  constructor(purchaseCalculator, transactionManager, statisticsCalculator) {
    this.purchaseCalculator = purchaseCalculator;
    this.transactionManager = transactionManager;
    this.statisticsCalculator = statisticsCalculator;
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Helper untuk membaca input dari user
   * @param {string} question
   * @returns {Promise<string>}
   */
  question(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

  /**
   * Validasi input numerik
   * @param {string} input
   * @returns {{valid: boolean, value?: number, error?: string}}
   */
  validateNumericInput(input) {
    const trimmed = input.trim();
    
    if (trimmed === '') {
      return { valid: false, error: 'Input tidak boleh kosong' };
    }
    
    const value = parseFloat(trimmed);
    
    if (isNaN(value)) {
      return { valid: false, error: 'Input harus berupa angka' };
    }
    
    if (value <= 0) {
      return { valid: false, error: 'Angka harus lebih dari 0' };
    }
    
    return { valid: true, value };
  }

  /**
   * Validasi input tanggal
   * @param {number} day
   * @param {number} month
   * @param {number} year
   * @returns {{valid: boolean, error?: string}}
   */
  validateDateInput(day, month, year) {
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return { valid: false, error: 'Tanggal harus berupa angka' };
    }
    
    if (day < 1 || day > 31) {
      return { valid: false, error: 'Hari harus antara 1-31' };
    }
    
    if (month < 1 || month > 12) {
      return { valid: false, error: 'Bulan harus antara 1-12' };
    }
    
    if (year < 1900 || year > 2100) {
      return { valid: false, error: 'Tahun tidak valid' };
    }
    
    return { valid: true };
  }

  /**
   * Input numerik dengan validasi dan retry
   * @param {string} prompt
   * @returns {Promise<number>}
   */
  async getValidNumericInput(prompt) {
    while (true) {
      const input = await this.question(prompt);
      const validation = this.validateNumericInput(input);
      
      if (validation.valid) {
        return validation.value;
      }
      
      console.log(`✗ Error: ${validation.error}. Silakan coba lagi.`);
    }
  }

  /**
   * Clear screen
   */
  clearScreen() {
    console.clear();
  }

  /**
   * Menampilkan menu utama
   */
  async showMainMenu() {
    this.clearScreen();
    console.log('=================================');
    console.log('   PURCHASE CALCULATOR');
    console.log('=================================');
    console.log('1. Mode Perhitungan Pembelian');
    console.log('2. Mode Manajemen Transaksi');
    console.log('3. Keluar');
    console.log('=================================');
    
    const choice = await this.question('Pilih menu (1-3): ');
    
    switch (choice.trim()) {
      case '1':
        await this.runPurchaseMode();
        break;
      case '2':
        await this.runTransactionMode();
        break;
      case '3':
        console.log('\nTerima kasih telah menggunakan Purchase Calculator!');
        this.rl.close();
        return;
      default:
        console.log('\nPilihan tidak valid!');
        await this.question('Tekan Enter untuk melanjutkan...');
        await this.showMainMenu();
    }
  }

  /**
   * Menjalankan mode perhitungan pembelian
   */
  async runPurchaseMode() {
    this.clearScreen();
    console.log('=================================');
    console.log('   MODE PERHITUNGAN PEMBELIAN');
    console.log('=================================\n');
    
    // Input harga barang dengan validasi
    const itemPrice = await this.getValidNumericInput('Masukkan harga barang: Rp ');
    
    // Input uang pembayaran dengan validasi
    const paymentAmount = await this.getValidNumericInput('Masukkan uang pembayaran: Rp ');
    
    // Hitung kembalian
    const result = this.purchaseCalculator.calculateChange(itemPrice, paymentAmount);
    
    console.log('\n=================================');
    if (result.valid) {
      console.log('✓ TRANSAKSI BERHASIL');
      console.log('=================================');
      console.log(`Harga Barang    : Rp ${itemPrice.toLocaleString('id-ID')}`);
      console.log(`Uang Pembayaran : Rp ${paymentAmount.toLocaleString('id-ID')}`);
      console.log(`Uang Kembalian  : Rp ${result.change.toLocaleString('id-ID')}`);
      console.log('=================================\n');
      
      // Tanya apakah ingin menyimpan transaksi
      const saveChoice = await this.question('Simpan transaksi ini? (y/n): ');
      
      if (saveChoice.trim().toLowerCase() === 'y') {
        const Transaction = (await import('../models/Transaction.js')).default;
        const transaction = new Transaction(itemPrice, paymentAmount, result.change);
        const saved = await this.transactionManager.saveTransaction(transaction);
        
        if (saved) {
          console.log('✓ Transaksi berhasil disimpan!\n');
        } else {
          console.log('✗ Gagal menyimpan transaksi.\n');
        }
      }
    } else {
      console.log('✗ TRANSAKSI GAGAL');
      console.log('=================================');
      console.log(`Error: ${result.error}`);
      console.log('=================================\n');
    }
    
    await this.question('Tekan Enter untuk kembali ke menu utama...');
    await this.showMainMenu();
  }

  /**
   * Menjalankan mode manajemen transaksi
   */
  async runTransactionMode() {
    this.clearScreen();
    console.log('=================================');
    console.log('   MODE MANAJEMEN TRANSAKSI');
    console.log('=================================');
    console.log('1. Lihat Semua Transaksi');
    console.log('2. Filter Berdasarkan Hari');
    console.log('3. Filter Berdasarkan Bulan');
    console.log('4. Kembali ke Menu Utama');
    console.log('=================================');
    
    const choice = await this.question('Pilih menu (1-4): ');
    
    switch (choice.trim()) {
      case '1':
        await this.viewAllTransactions();
        break;
      case '2':
        await this.filterByDay();
        break;
      case '3':
        await this.filterByMonth();
        break;
      case '4':
        await this.showMainMenu();
        return;
      default:
        console.log('\nPilihan tidak valid!');
        await this.question('Tekan Enter untuk melanjutkan...');
        await this.runTransactionMode();
    }
  }

  /**
   * Lihat semua transaksi
   */
  async viewAllTransactions() {
    this.clearScreen();
    console.log('=================================');
    console.log('   SEMUA TRANSAKSI');
    console.log('=================================\n');
    
    const transactions = await this.transactionManager.getAllTransactions();
    
    if (transactions.length === 0) {
      console.log('Belum ada transaksi yang tersimpan.\n');
    } else {
      this.displayTransactions(transactions);
      
      // Display statistics
      const stats = this.statisticsCalculator.generateSummary(transactions);
      this.displayStatistics(stats);
    }
    
    await this.question('\nTekan Enter untuk kembali...');
    await this.runTransactionMode();
  }

  /**
   * Filter transaksi berdasarkan hari
   */
  async filterByDay() {
    this.clearScreen();
    console.log('=================================');
    console.log('   FILTER BERDASARKAN HARI');
    console.log('=================================\n');
    
    // Input dengan validasi
    let day, month, year;
    let isValid = false;
    
    while (!isValid) {
      const dayInput = await this.question('Masukkan hari (1-31): ');
      day = parseInt(dayInput);
      
      const monthInput = await this.question('Masukkan bulan (1-12): ');
      month = parseInt(monthInput);
      
      const yearInput = await this.question('Masukkan tahun (contoh: 2026): ');
      year = parseInt(yearInput);
      
      const validation = this.validateDateInput(day, month, year);
      
      if (validation.valid) {
        isValid = true;
      } else {
        console.log(`\n✗ Error: ${validation.error}. Silakan coba lagi.\n`);
      }
    }
    
    console.log('\n=================================');
    console.log(`   TRANSAKSI ${day}/${month}/${year}`);
    console.log('=================================\n');
    
    const transactions = await this.transactionManager.filterByDay(day, month, year);
    
    if (transactions.length === 0) {
      console.log('Tidak ada transaksi pada tanggal tersebut.\n');
    } else {
      this.displayTransactions(transactions);
      
      // Display statistics
      const stats = this.statisticsCalculator.generateSummary(transactions);
      this.displayStatistics(stats);
    }
    
    await this.question('\nTekan Enter untuk kembali...');
    await this.runTransactionMode();
  }

  /**
   * Filter transaksi berdasarkan bulan
   */
  async filterByMonth() {
    this.clearScreen();
    console.log('=================================');
    console.log('   FILTER BERDASARKAN BULAN');
    console.log('=================================\n');
    
    // Input dengan validasi
    let month, year;
    let isValid = false;
    
    while (!isValid) {
      const monthInput = await this.question('Masukkan bulan (1-12): ');
      month = parseInt(monthInput);
      
      const yearInput = await this.question('Masukkan tahun (contoh: 2026): ');
      year = parseInt(yearInput);
      
      // Validate month and year only
      const validation = this.validateDateInput(1, month, year);
      
      if (validation.valid) {
        isValid = true;
      } else {
        console.log(`\n✗ Error: ${validation.error}. Silakan coba lagi.\n`);
      }
    }
    
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    console.log('\n=================================');
    console.log(`   TRANSAKSI ${monthNames[month - 1]} ${year}`);
    console.log('=================================\n');
    
    const transactions = await this.transactionManager.filterByMonth(month, year);
    
    if (transactions.length === 0) {
      console.log('Tidak ada transaksi pada bulan tersebut.\n');
    } else {
      this.displayTransactions(transactions);
      
      // Display statistics
      const stats = this.statisticsCalculator.generateSummary(transactions);
      this.displayStatistics(stats);
    }
    
    await this.question('\nTekan Enter untuk kembali...');
    await this.runTransactionMode();
  }

  /**
   * Menampilkan daftar transaksi
   * @param {Transaction[]} transactions
   */
  displayTransactions(transactions) {
    transactions.forEach((t, index) => {
      console.log(`${index + 1}. Tanggal: ${t.date.day}/${t.date.month}/${t.date.year}`);
      console.log(`   Harga Barang    : Rp ${t.itemPrice.toLocaleString('id-ID')}`);
      console.log(`   Uang Pembayaran : Rp ${t.paymentAmount.toLocaleString('id-ID')}`);
      console.log(`   Uang Kembalian  : Rp ${t.changeAmount.toLocaleString('id-ID')}`);
      console.log('');
    });
  }

  /**
   * Menampilkan statistik
   * @param {Object} stats
   */
  displayStatistics(stats) {
    console.log('=================================');
    console.log('   RINGKASAN STATISTIK');
    console.log('=================================');
    console.log(`Total Transaksi : ${stats.transactionCount}`);
    console.log(`Total Revenue   : Rp ${stats.totalRevenue.toLocaleString('id-ID')}`);
    console.log('=================================');
  }

  /**
   * Start aplikasi
   */
  async start() {
    await this.showMainMenu();
  }
}

export default CLI;
