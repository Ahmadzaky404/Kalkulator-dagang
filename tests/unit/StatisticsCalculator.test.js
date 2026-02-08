import StatisticsCalculator from '../../src/services/StatisticsCalculator.js';
import Transaction from '../../src/models/Transaction.js';

describe('StatisticsCalculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new StatisticsCalculator();
  });

  describe('calculateTotalRevenue', () => {
    test('should calculate total revenue from multiple transactions', () => {
      const transactions = [
        new Transaction(50000, 100000, 50000),
        new Transaction(30000, 50000, 20000),
        new Transaction(20000, 25000, 5000)
      ];

      const total = calculator.calculateTotalRevenue(transactions);
      expect(total).toBe(100000); // 50000 + 30000 + 20000
    });

    test('should return 0 for empty array', () => {
      const total = calculator.calculateTotalRevenue([]);
      expect(total).toBe(0);
    });

    test('should return 0 for null', () => {
      const total = calculator.calculateTotalRevenue(null);
      expect(total).toBe(0);
    });

    test('should return 0 for undefined', () => {
      const total = calculator.calculateTotalRevenue(undefined);
      expect(total).toBe(0);
    });

    test('should handle single transaction', () => {
      const transactions = [new Transaction(50000, 100000, 50000)];
      const total = calculator.calculateTotalRevenue(transactions);
      expect(total).toBe(50000);
    });
  });

  describe('getTransactionCount', () => {
    test('should count transactions correctly', () => {
      const transactions = [
        new Transaction(50000, 100000, 50000),
        new Transaction(30000, 50000, 20000),
        new Transaction(20000, 25000, 5000)
      ];

      const count = calculator.getTransactionCount(transactions);
      expect(count).toBe(3);
    });

    test('should return 0 for empty array', () => {
      const count = calculator.getTransactionCount([]);
      expect(count).toBe(0);
    });

    test('should return 0 for null', () => {
      const count = calculator.getTransactionCount(null);
      expect(count).toBe(0);
    });

    test('should return 0 for undefined', () => {
      const count = calculator.getTransactionCount(undefined);
      expect(count).toBe(0);
    });
  });

  describe('generateSummary', () => {
    test('should generate correct summary', () => {
      const transactions = [
        new Transaction(50000, 100000, 50000),
        new Transaction(30000, 50000, 20000),
        new Transaction(20000, 25000, 5000)
      ];

      const summary = calculator.generateSummary(transactions);
      expect(summary.totalRevenue).toBe(100000);
      expect(summary.transactionCount).toBe(3);
    });

    test('should generate summary for empty transactions', () => {
      const summary = calculator.generateSummary([]);
      expect(summary.totalRevenue).toBe(0);
      expect(summary.transactionCount).toBe(0);
    });
  });
});
