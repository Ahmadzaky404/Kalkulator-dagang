import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * StorageService untuk persistensi data ke file JSON
 */
class StorageService {
  /**
   * @param {string} filePath - Path ke file storage (default: data/transactions.json)
   */
  constructor(filePath = 'data/transactions.json') {
    this.filePath = path.resolve(path.join(__dirname, '../../', filePath));
  }

  /**
   * Memeriksa apakah file storage ada
   * @returns {Promise<boolean>}
   */
  async exists() {
    try {
      await fs.access(this.filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Membaca data dari file
   * @returns {Promise<Object[]>}
   */
  async load() {
    try {
      const fileExists = await this.exists();
      
      if (!fileExists) {
        return [];
      }

      const data = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(data);
      
      return parsed.transactions || [];
    } catch (error) {
      // Handle JSON parse error
      if (error instanceof SyntaxError) {
        console.warn('JSON parse error, creating backup and initializing new storage');
        
        // Create backup if file exists
        try {
          const backupPath = `${this.filePath}.backup`;
          await fs.copyFile(this.filePath, backupPath);
        } catch (backupError) {
          console.warn('Could not create backup:', backupError.message);
        }
        
        return [];
      }
      
      // Other errors
      console.error('Error loading data:', error.message);
      return [];
    }
  }

  /**
   * Menyimpan data ke file
   * @param {Object[]} data
   * @returns {Promise<void>}
   */
  async save(data) {
    try {
      // Ensure directory exists
      const dir = path.dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });

      const storageData = {
        version: '1.0',
        transactions: data
      };

      await fs.writeFile(
        this.filePath,
        JSON.stringify(storageData, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Error saving data:', error.message);
      throw new Error('Gagal menyimpan data: ' + error.message);
    }
  }
}

export default StorageService;
