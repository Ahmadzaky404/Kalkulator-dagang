import Transaction from '../../src/models/Transaction.js';

describe('Transaction', () => {
  test('should create transaction with all fields', () => {
    const date = new Date('2026-02-08T10:00:00');
    const transaction = new Transaction(50000, 100000, 50000, date);
    
    expect(transaction.id).toBeDefined();
    expect(transaction.itemPrice).toBe(50000);
    expect(transaction.paymentAmount).toBe(100000);
    expect(transaction.changeAmount).toBe(50000);
    expect(transaction.date.day).toBe(8);
    expect(transaction.date.month).toBe(2);
    expect(transaction.date.year).toBe(2026);
    expect(transaction.date.timestamp).toBe(date.getTime());
  });

  test('should create transaction with default date (now)', () => {
    const before = Date.now();
    const transaction = new Transaction(50000, 100000, 50000);
    const after = Date.now();
    
    expect(transaction.date.timestamp).toBeGreaterThanOrEqual(before);
    expect(transaction.date.timestamp).toBeLessThanOrEqual(after);
  });

  test('toJSON should return correct format', () => {
    const date = new Date('2026-02-08T10:00:00');
    const transaction = new Transaction(50000, 100000, 50000, date);
    const json = transaction.toJSON();
    
    expect(json.id).toBe(transaction.id);
    expect(json.itemPrice).toBe(50000);
    expect(json.paymentAmount).toBe(100000);
    expect(json.changeAmount).toBe(50000);
    expect(json.date.day).toBe(8);
    expect(json.date.month).toBe(2);
    expect(json.date.year).toBe(2026);
    expect(json.date.timestamp).toBe(date.getTime());
  });

  test('fromJSON should recreate transaction correctly', () => {
    const testDate = new Date('2026-02-08T00:00:00Z');
    const json = {
      id: 'test-id-123',
      itemPrice: 50000,
      paymentAmount: 100000,
      changeAmount: 50000,
      date: {
        day: 8,
        month: 2,
        year: 2026,
        timestamp: testDate.getTime()
      }
    };
    
    const transaction = Transaction.fromJSON(json);
    
    expect(transaction.id).toBe('test-id-123');
    expect(transaction.itemPrice).toBe(50000);
    expect(transaction.paymentAmount).toBe(100000);
    expect(transaction.changeAmount).toBe(50000);
    expect(transaction.date.day).toBe(8);
    expect(transaction.date.month).toBe(2);
    expect(transaction.date.year).toBe(2026);
    expect(transaction.date.timestamp).toBe(testDate.getTime());
  });

  test('round-trip: toJSON then fromJSON should preserve data', () => {
    const original = new Transaction(75000, 100000, 25000, new Date('2026-02-08'));
    const json = original.toJSON();
    const restored = Transaction.fromJSON(json);
    
    expect(restored.id).toBe(original.id);
    expect(restored.itemPrice).toBe(original.itemPrice);
    expect(restored.paymentAmount).toBe(original.paymentAmount);
    expect(restored.changeAmount).toBe(original.changeAmount);
    expect(restored.date.day).toBe(original.date.day);
    expect(restored.date.month).toBe(original.date.month);
    expect(restored.date.year).toBe(original.date.year);
    expect(restored.date.timestamp).toBe(original.date.timestamp);
  });
});
