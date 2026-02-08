import PurchaseCalculator from '../../src/services/PurchaseCalculator.js';
import Transaction from '../../src/models/Transaction.js';
import TransactionManager from '../../src/services/TransactionManager.js';
import StatisticsCalculator from '../../src/services/StatisticsCalculator.js';
import StorageService from '../../src/services/StorageService.js';

describe('Basic Component Tests', () => {
  test('PurchaseCalculator can be instantiated', () => {
    const calculator = new PurchaseCalculator();
    expect(calculator).toBeDefined();
  });

  test('Transaction can be created', () => {
    const transaction = new Transaction(10000, 20000, 10000);
    expect(transaction).toBeDefined();
    expect(transaction.itemPrice).toBe(10000);
    expect(transaction.paymentAmount).toBe(20000);
    expect(transaction.changeAmount).toBe(10000);
  });

  test('StatisticsCalculator can be instantiated', () => {
    const calculator = new StatisticsCalculator();
    expect(calculator).toBeDefined();
  });

  test('StorageService can be instantiated', () => {
    const storage = new StorageService();
    expect(storage).toBeDefined();
  });

  test('TransactionManager can be instantiated', () => {
    const storage = new StorageService();
    const manager = new TransactionManager(storage);
    expect(manager).toBeDefined();
  });
});
