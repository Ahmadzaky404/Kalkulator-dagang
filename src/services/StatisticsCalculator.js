/**
 * StatisticsCalculator untuk menghitung statistik penjualan
 */
class StatisticsCalculator {
  /**
   * Menghitung total revenue dari daftar transaksi
   * @param {Transaction[]} transactions
   * @returns {number}
   */
  calculateTotalRevenue(transactions) {
    if (!transactions || transactions.length === 0) {
      return 0;
    }

    return transactions.reduce((total, transaction) => {
      return total + transaction.itemPrice;
    }, 0);
  }

  /**
   * Menghitung jumlah transaksi
   * @param {Transaction[]} transactions
   * @returns {number}
   */
  getTransactionCount(transactions) {
    return transactions ? transactions.length : 0;
  }

  /**
   * Membuat ringkasan statistik
   * @param {Transaction[]} transactions
   * @returns {{totalRevenue: number, transactionCount: number}}
   */
  generateSummary(transactions) {
    return {
      totalRevenue: this.calculateTotalRevenue(transactions),
      transactionCount: this.getTransactionCount(transactions)
    };
  }
}

export default StatisticsCalculator;
