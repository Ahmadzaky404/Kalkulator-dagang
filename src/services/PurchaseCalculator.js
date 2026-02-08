/**
 * PurchaseCalculator service untuk menghitung uang kembalian
 */
class PurchaseCalculator {
  /**
   * Validasi input numerik
   * @param {number} value - Nilai yang akan divalidasi
   * @returns {{valid: boolean, error?: string}}
   */
  validateInput(value) {
    if (typeof value !== 'number' || isNaN(value)) {
      return { valid: false, error: 'Input harus berupa angka' };
    }
    
    if (value <= 0) {
      return { valid: false, error: 'Nilai harus lebih dari 0' };
    }
    
    return { valid: true };
  }

  /**
   * Menghitung uang kembalian
   * @param {number} itemPrice - Harga barang
   * @param {number} paymentAmount - Uang pembayaran
   * @returns {{change: number, valid: boolean, error?: string}}
   */
  calculateChange(itemPrice, paymentAmount) {
    // Validasi harga barang
    const priceValidation = this.validateInput(itemPrice);
    if (!priceValidation.valid) {
      return {
        change: 0,
        valid: false,
        error: 'Harga barang harus lebih dari 0'
      };
    }

    // Validasi uang pembayaran
    const paymentValidation = this.validateInput(paymentAmount);
    if (!paymentValidation.valid) {
      return {
        change: 0,
        valid: false,
        error: 'Uang pembayaran harus lebih dari 0'
      };
    }

    // Cek apakah pembayaran cukup
    if (paymentAmount < itemPrice) {
      return {
        change: 0,
        valid: false,
        error: 'Uang pembayaran tidak cukup'
      };
    }

    // Hitung kembalian
    const change = paymentAmount - itemPrice;
    
    return {
      change,
      valid: true
    };
  }
}

export default PurchaseCalculator;
