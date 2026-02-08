import { v4 as uuidv4 } from 'uuid';

/**
 * Transaction model untuk menyimpan data transaksi pembelian
 */
class Transaction {
  /**
   * @param {number} itemPrice - Harga barang
   * @param {number} paymentAmount - Uang pembayaran
   * @param {number} changeAmount - Uang kembalian
   * @param {Date} date - Tanggal transaksi (default: sekarang)
   */
  constructor(itemPrice, paymentAmount, changeAmount, date = new Date()) {
    this.id = uuidv4();
    this.itemPrice = itemPrice;
    this.paymentAmount = paymentAmount;
    this.changeAmount = changeAmount;
    
    // Extract date components
    const dateObj = date instanceof Date ? date : new Date(date);
    this.date = {
      day: dateObj.getDate(),
      month: dateObj.getMonth() + 1, // JavaScript months are 0-indexed
      year: dateObj.getFullYear(),
      timestamp: dateObj.getTime()
    };
  }

  /**
   * Mengkonversi transaksi ke format JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      itemPrice: this.itemPrice,
      paymentAmount: this.paymentAmount,
      changeAmount: this.changeAmount,
      date: {
        day: this.date.day,
        month: this.date.month,
        year: this.date.year,
        timestamp: this.date.timestamp
      }
    };
  }

  /**
   * Membuat transaksi dari objek JSON
   * @param {Object} json
   * @returns {Transaction}
   */
  static fromJSON(json) {
    const transaction = new Transaction(
      json.itemPrice,
      json.paymentAmount,
      json.changeAmount,
      new Date(json.date.timestamp)
    );
    transaction.id = json.id;
    return transaction;
  }
}

export default Transaction;
