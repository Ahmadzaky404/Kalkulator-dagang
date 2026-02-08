import Transaction from '../models/Transaction.js';

/**
 * TransactionManager untuk mengelola transaksi
 */
class TransactionManager {
  /**
   * @param {StorageService} storageService - Service untuk persistensi data
   */
  constructor(storageService) {
    this.storageService = storageService;
    this.transactionsCache = null;
  }

  /**
   * Load transactions dari storage dan cache
   * @returns {Promise<Transaction[]>}
   */
  async _loadTransactions() {
    if (this.transactionsCache === null) {
      const data = await this.storageService.load();
      this.transactionsCache = data.map(json => Transaction.fromJSON(json));
    }
    return this.transactionsCache;
  }

  /**
   * Save transactions ke storage dan update cache
   * @param {Transaction[]} transactions
   * @returns {Promise<void>}
   */
  async _saveTransactions(transactions) {
    const data = transactions.map(t => t.toJSON());
    await this.storageService.save(data);
    this.transactionsCache = transactions;
  }

  /**
   * Menyimpan transaksi baru
   * @param {Transaction} transaction
   * @returns {Promise<boolean>}
   */
  async saveTransaction(transaction) {
    try {
      const transactions = await this._loadTransactions();
      transactions.push(transaction);
      await this._saveTransactions(transactions);
      return true;
    } catch (error) {
      console.error('Error saving transaction:', error.message);
      return false;
    }
  }

  /**
   * Mengambil semua transaksi (sorted by timestamp descending)
   * @returns {Promise<Transaction[]>}
   */
  async getAllTransactions() {
    const transactions = await this._loadTransactions();
    // Sort by timestamp descending (most recent first)
    return [...transactions].sort((a, b) => b.date.timestamp - a.date.timestamp);
  }

  /**
   * Filter transaksi berdasarkan hari
   * @param {number} day - Hari (1-31)
   * @param {number} month - Bulan (1-12)
   * @param {number} year - Tahun
   * @returns {Promise<Transaction[]>}
   */
  async filterByDay(day, month, year) {
    // Validate date parameters
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
      console.warn('Invalid date parameters');
      return [];
    }

    const transactions = await this._loadTransactions();
    const filtered = transactions.filter(t => 
      t.date.day === day && 
      t.date.month === month && 
      t.date.year === year
    );
    
    // Sort by timestamp descending
    return filtered.sort((a, b) => b.date.timestamp - a.date.timestamp);
  }

  /**
   * Filter transaksi berdasarkan bulan
   * @param {number} month - Bulan (1-12)
   * @param {number} year - Tahun
   * @returns {Promise<Transaction[]>}
   */
  async filterByMonth(month, year) {
    // Validate date parameters
    if (month < 1 || month > 12 || year < 1900) {
      console.warn('Invalid date parameters');
      return [];
    }

    const transactions = await this._loadTransactions();
    const filtered = transactions.filter(t => 
      t.date.month === month && 
      t.date.year === year
    );
    
    // Sort by timestamp descending
    return filtered.sort((a, b) => b.date.timestamp - a.date.timestamp);
  }
}

export default TransactionManager;
