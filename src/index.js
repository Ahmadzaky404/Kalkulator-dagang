import PurchaseCalculator from './services/PurchaseCalculator.js';
import TransactionManager from './services/TransactionManager.js';
import StatisticsCalculator from './services/StatisticsCalculator.js';
import StorageService from './services/StorageService.js';
import CLI from './ui/CLI.js';

/**
 * Main entry point untuk Purchase Calculator
 */
async function main() {
  try {
    // Initialize services
    const storageService = new StorageService();
    const purchaseCalculator = new PurchaseCalculator();
    const transactionManager = new TransactionManager(storageService);
    const statisticsCalculator = new StatisticsCalculator();
    
    // Initialize CLI
    const cli = new CLI(purchaseCalculator, transactionManager, statisticsCalculator);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\nTerima kasih telah menggunakan Purchase Calculator!');
      process.exit(0);
    });
    
    // Start application
    await cli.start();
  } catch (error) {
    console.error('Error starting application:', error.message);
    process.exit(1);
  }
}

// Run application
main();
