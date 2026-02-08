import PurchaseCalculator from '../../src/services/PurchaseCalculator.js';

describe('PurchaseCalculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new PurchaseCalculator();
  });

  describe('calculateChange', () => {
    test('should calculate correct change for valid inputs', () => {
      const result = calculator.calculateChange(50000, 100000);
      expect(result.valid).toBe(true);
      expect(result.change).toBe(50000);
      expect(result.error).toBeUndefined();
    });

    test('should return error for insufficient payment', () => {
      const result = calculator.calculateChange(100000, 50000);
      expect(result.valid).toBe(false);
      expect(result.change).toBe(0);
      expect(result.error).toBe('Uang pembayaran tidak cukup');
    });

    test('should return error for zero price', () => {
      const result = calculator.calculateChange(0, 50000);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Harga barang harus lebih dari 0');
    });

    test('should return error for negative price', () => {
      const result = calculator.calculateChange(-10000, 50000);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Harga barang harus lebih dari 0');
    });

    test('should return error for zero payment', () => {
      const result = calculator.calculateChange(50000, 0);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Uang pembayaran harus lebih dari 0');
    });

    test('should return error for negative payment', () => {
      const result = calculator.calculateChange(50000, -10000);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Uang pembayaran harus lebih dari 0');
    });

    test('should handle exact payment (no change)', () => {
      const result = calculator.calculateChange(50000, 50000);
      expect(result.valid).toBe(true);
      expect(result.change).toBe(0);
    });
  });

  describe('validateInput', () => {
    test('should validate positive numbers', () => {
      const result = calculator.validateInput(100);
      expect(result.valid).toBe(true);
    });

    test('should reject zero', () => {
      const result = calculator.validateInput(0);
      expect(result.valid).toBe(false);
    });

    test('should reject negative numbers', () => {
      const result = calculator.validateInput(-50);
      expect(result.valid).toBe(false);
    });

    test('should reject non-numbers', () => {
      const result = calculator.validateInput('abc');
      expect(result.valid).toBe(false);
    });

    test('should reject NaN', () => {
      const result = calculator.validateInput(NaN);
      expect(result.valid).toBe(false);
    });
  });
});
