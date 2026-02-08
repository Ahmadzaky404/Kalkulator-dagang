// Import classes (akan menggunakan localStorage untuk web version)
class Transaction {
    constructor(itemPrice, paymentAmount, changeAmount, date = new Date()) {
        this.id = this.generateId();
        this.itemPrice = itemPrice;
        this.paymentAmount = paymentAmount;
        this.changeAmount = changeAmount;

        const dateObj = date instanceof Date ? date : new Date(date);
        this.date = {
            day: dateObj.getDate(),
            month: dateObj.getMonth() + 1,
            year: dateObj.getFullYear(),
            timestamp: dateObj.getTime()
        };
    }

    generateId() {
        return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    toJSON() {
        return {
            id: this.id,
            itemPrice: this.itemPrice,
            paymentAmount: this.paymentAmount,
            changeAmount: this.changeAmount,
            date: this.date
        };
    }

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

class PurchaseCalculator {
    validateInput(value) {
        if (typeof value !== 'number' || isNaN(value)) {
            return { valid: false, error: 'Input harus berupa angka' };
        }

        if (value <= 0) {
            return { valid: false, error: 'Nilai harus lebih dari 0' };
        }

        return { valid: true };
    }

    calculateChange(itemPrice, paymentAmount) {
        const priceValidation = this.validateInput(itemPrice);
        if (!priceValidation.valid) {
            return {
                change: 0,
                valid: false,
                error: 'Harga barang harus lebih dari 0'
            };
        }

        const paymentValidation = this.validateInput(paymentAmount);
        if (!paymentValidation.valid) {
            return {
                change: 0,
                valid: false,
                error: 'Uang pembayaran harus lebih dari 0'
            };
        }

        if (paymentAmount < itemPrice) {
            return {
                change: 0,
                valid: false,
                error: 'Uang pembayaran tidak cukup'
            };
        }

        const change = paymentAmount - itemPrice;

        return {
            change,
            valid: true
        };
    }
}

class StorageService {
    constructor() {
        this.storageKey = 'purchase_calculator_transactions';
    }

    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) return [];
            const parsed = JSON.parse(data);
            return parsed.transactions || [];
        } catch (error) {
            console.error('Error loading data:', error);
            return [];
        }
    }

    save(transactions) {
        try {
            const data = {
                version: '1.0',
                transactions: transactions
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data:', error);
            throw new Error('Gagal menyimpan data');
        }
    }
}

class TransactionManager {
    constructor(storageService) {
        this.storageService = storageService;
        this.transactionsCache = null;
    }

    _loadTransactions() {
        if (this.transactionsCache === null) {
            const data = this.storageService.load();
            this.transactionsCache = data.map(json => Transaction.fromJSON(json));
        }
        return this.transactionsCache;
    }

    _saveTransactions(transactions) {
        const data = transactions.map(t => t.toJSON());
        this.storageService.save(data);
        this.transactionsCache = transactions;
    }

    saveTransaction(transaction) {
        try {
            const transactions = this._loadTransactions();
            transactions.push(transaction);
            this._saveTransactions(transactions);
            return true;
        } catch (error) {
            console.error('Error saving transaction:', error);
            return false;
        }
    }

    getAllTransactions() {
        const transactions = this._loadTransactions();
        return [...transactions].sort((a, b) => b.date.timestamp - a.date.timestamp);
    }

    filterByDay(day, month, year) {
        if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
            console.warn('Invalid date parameters');
            return [];
        }

        const transactions = this._loadTransactions();
        const filtered = transactions.filter(t =>
            t.date.day === day &&
            t.date.month === month &&
            t.date.year === year
        );

        return filtered.sort((a, b) => b.date.timestamp - a.date.timestamp);
    }

    filterByMonth(month, year) {
        if (month < 1 || month > 12 || year < 1900) {
            console.warn('Invalid date parameters');
            return [];
        }

        const transactions = this._loadTransactions();
        const filtered = transactions.filter(t =>
            t.date.month === month &&
            t.date.year === year
        );

        return filtered.sort((a, b) => b.date.timestamp - a.date.timestamp);
    }
}

class StatisticsCalculator {
    calculateTotalRevenue(transactions) {
        if (!transactions || transactions.length === 0) {
            return 0;
        }

        return transactions.reduce((total, transaction) => {
            return total + transaction.itemPrice;
        }, 0);
    }

    getTransactionCount(transactions) {
        return transactions ? transactions.length : 0;
    }

    generateSummary(transactions) {
        return {
            totalRevenue: this.calculateTotalRevenue(transactions),
            transactionCount: this.getTransactionCount(transactions)
        };
    }
}

// Initialize services
const storageService = new StorageService();
const purchaseCalculator = new PurchaseCalculator();
const transactionManager = new TransactionManager(storageService);
const statisticsCalculator = new StatisticsCalculator();

// Global state
let currentTransaction = null;
let cartItems = [];

// UI Functions
window.showScreen = function(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
    // Reset purchase form when entering purchase mode
    if (screenId === 'purchaseMode') {
        updateItemsDisplay();
    }
};

window.addItem = function(event) {
    event.preventDefault();
    
    const price = parseFloat(document.getElementById('itemPrice').value);
    const qty = parseInt(document.getElementById('itemQty').value);
    
    const item = {
        id: Date.now(),
        price: price,
        quantity: qty,
        subtotal: price * qty
    };
    
    cartItems.push(item);
    updateItemsDisplay();
    
    // Reset form
    document.getElementById('addItemForm').reset();
    document.getElementById('itemQty').value = 1;
    document.getElementById('itemPrice').focus();
};

window.removeItem = function(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    updateItemsDisplay();
};

window.clearAllItems = function() {
    if (cartItems.length === 0) {
        alert('Keranjang sudah kosong!');
        return;
    }
    
    if (confirm('Hapus semua barang dari keranjang?')) {
        cartItems = [];
        updateItemsDisplay();
        document.getElementById('purchaseResult').style.display = 'none';
    }
};

function updateItemsDisplay() {
    const itemsContent = document.getElementById('itemsContent');
    const itemsTotal = document.getElementById('itemsTotal');
    const totalPriceEl = document.getElementById('totalPrice');
    
    if (cartItems.length === 0) {
        itemsContent.innerHTML = '<p class="text-center text-gray-500 py-6 italic">Belum ada barang. Tambahkan barang di bawah.</p>';
        itemsTotal.classList.add('hidden');
        return;
    }
    
    let html = '';
    let total = 0;
    
    cartItems.forEach((item, index) => {
        total += item.subtotal;
        html += `
            <div class="bg-white rounded-lg p-4 flex justify-between items-center border-l-4 border-blue-500 shadow-sm">
                <div class="flex-1">
                    <div class="font-semibold text-gray-800">🛍️ Barang ${index + 1}</div>
                    <div class="text-gray-600 text-sm mt-1">
                        <span class="font-medium">${item.quantity} pcs</span> × Rp ${formatCurrency(item.price)} = 
                        <span class="font-semibold text-blue-600">Rp ${formatCurrency(item.subtotal)}</span>
                    </div>
                </div>
                <button onclick="removeItem(${item.id})" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm">
                    🗑️
                </button>
            </div>
        `;
    });
    
    itemsContent.innerHTML = html;
    totalPriceEl.textContent = 'Rp ' + formatCurrency(total);
    itemsTotal.classList.remove('hidden');
}

window.calculatePurchase = function(event) {
    event.preventDefault();
    
    if (cartItems.length === 0) {
        alert('Tambahkan barang terlebih dahulu!');
        return;
    }
    
    const totalPrice = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const paymentAmount = parseFloat(document.getElementById('paymentAmount').value);

    const result = purchaseCalculator.calculateChange(totalPrice, paymentAmount);

    const resultBox = document.getElementById('purchaseResult');
    const resultTitle = document.getElementById('resultTitle');
    const resultContent = document.getElementById('resultContent');
    const saveButtonGroup = document.getElementById('saveButtonGroup');

    resultBox.classList.remove('hidden');

    if (result.valid) {
        resultBox.className = 'bg-green-50 border border-green-500 rounded-lg p-6 shadow-sm';
        resultTitle.textContent = '✓ TRANSAKSI BERHASIL';
        resultTitle.className = 'text-xl font-bold mb-4 text-green-700';
        
        let itemsHtml = '<div class="mb-4"><strong class="text-gray-800">Detail Barang:</strong></div>';
        cartItems.forEach((item, index) => {
            itemsHtml += `
                <div class="bg-white rounded-lg p-3 mb-2 border border-gray-200">
                    ${index + 1}. Barang ${index + 1} - ${item.quantity} × Rp ${formatCurrency(item.price)} = Rp ${formatCurrency(item.subtotal)}
                </div>
            `;
        });
        
        resultContent.innerHTML = itemsHtml + `
            <div class="border-t border-green-300 pt-4 mt-4 space-y-2">
                <div class="flex justify-between items-center py-2">
                    <strong class="text-gray-800">Total Harga:</strong>
                    <span class="text-blue-600 font-semibold">Rp ${formatCurrency(totalPrice)}</span>
                </div>
                <div class="flex justify-between items-center py-2">
                    <strong class="text-gray-800">Uang Pembayaran:</strong>
                    <span class="text-blue-600 font-semibold">Rp ${formatCurrency(paymentAmount)}</span>
                </div>
                <div class="flex justify-between items-center py-2 bg-green-100 rounded-lg px-3">
                    <strong class="text-gray-800">Uang Kembalian:</strong>
                    <span class="text-green-700 font-bold">Rp ${formatCurrency(result.change)}</span>
                </div>
            </div>
        `;

        currentTransaction = new Transaction(totalPrice, paymentAmount, result.change);
        // Store items detail in transaction
        currentTransaction.items = cartItems.map(item => ({...item}));
        saveButtonGroup.classList.remove('hidden');
    } else {
        resultBox.className = 'bg-red-50 border border-red-500 rounded-lg p-6 shadow-sm';
        resultTitle.textContent = '✗ TRANSAKSI GAGAL';
        resultTitle.className = 'text-xl font-bold mb-4 text-red-700';
        resultContent.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                ${result.error}
            </div>
        `;
        saveButtonGroup.classList.add('hidden');
        currentTransaction = null;
    }
};

window.saveTransaction = function() {
    if (!currentTransaction) return;

    const saved = transactionManager.saveTransaction(currentTransaction);

    if (saved) {
        alert('✓ Transaksi berhasil disimpan!');
        resetPurchaseForm();
    } else {
        alert('✗ Gagal menyimpan transaksi.');
    }
};

window.resetPurchaseForm = function() {
    document.getElementById('purchaseForm').reset();
    document.getElementById('addItemForm').reset();
    document.getElementById('purchaseResult').classList.add('hidden');
    cartItems = [];
    updateItemsDisplay();
    currentTransaction = null;
};

window.viewAllTransactions = function() {
    const transactions = transactionManager.getAllTransactions();
    displayTransactions(transactions, 'transactionsList', 'statisticsBox');
    showScreen('viewTransactions');
};

window.filterTransactionsByDay = function(event) {
    event.preventDefault();

    const day = parseInt(document.getElementById('filterDay').value);
    const month = parseInt(document.getElementById('filterDayMonth').value);
    const year = parseInt(document.getElementById('filterDayYear').value);

    const transactions = transactionManager.filterByDay(day, month, year);
    displayTransactions(transactions, 'filteredDayResults', null, `${day}/${month}/${year}`);
};

window.filterTransactionsByMonth = function(event) {
    event.preventDefault();

    const month = parseInt(document.getElementById('filterMonth').value);
    const year = parseInt(document.getElementById('filterMonthYear').value);

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const transactions = transactionManager.filterByMonth(month, year);
    displayTransactions(transactions, 'filteredMonthResults', null, `${monthNames[month - 1]} ${year}`);
};

function displayTransactions(transactions, containerId, statsContainerId, filterLabel) {
    const container = document.getElementById(containerId);

    if (transactions.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <div class="text-4xl mb-3">📭</div>
                <p class="text-gray-500">Tidak ada transaksi${filterLabel ? ' pada ' + filterLabel : ''}.</p>
            </div>
        `;
        if (statsContainerId) {
            document.getElementById(statsContainerId).innerHTML = '';
        }
        return;
    }

    let html = '';
    if (filterLabel) {
        html += `<h3 class="text-xl font-bold text-gray-800 mb-4">Transaksi ${filterLabel}</h3>`;
    }

    transactions.forEach((t, index) => {
        let itemsDetail = '';
        if (t.items && t.items.length > 0) {
            itemsDetail = '<div class="mt-3 pt-3 border-t border-gray-200">';
            itemsDetail += '<div class="font-semibold text-blue-600 mb-2">Detail Barang:</div>';
            t.items.forEach((item, idx) => {
                itemsDetail += `<div class="text-sm text-gray-600 ml-3">
                    ${idx + 1}. Barang ${idx + 1} - ${item.quantity} × Rp ${formatCurrency(item.price)}
                </div>`;
            });
            itemsDetail += '</div>';
        }
        
        html += `
            <div class="bg-gray-50 rounded-lg p-4 mb-3 border-l-4 border-blue-600 shadow-sm">
                <div class="font-semibold text-blue-600 mb-2">${index + 1}. Tanggal: ${t.date.day}/${t.date.month}/${t.date.year}</div>
                ${itemsDetail}
                <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                    <div class="bg-white rounded-lg p-3 border border-gray-200">
                        <span class="text-sm text-gray-600">Total Harga:</span>
                        <div class="font-semibold text-blue-600">Rp ${formatCurrency(t.itemPrice)}</div>
                    </div>
                    <div class="bg-white rounded-lg p-3 border border-gray-200">
                        <span class="text-sm text-gray-600">Uang Pembayaran:</span>
                        <div class="font-semibold text-blue-600">Rp ${formatCurrency(t.paymentAmount)}</div>
                    </div>
                    <div class="bg-white rounded-lg p-3 border border-gray-200">
                        <span class="text-sm text-gray-600">Uang Kembalian:</span>
                        <div class="font-semibold text-green-600">Rp ${formatCurrency(t.changeAmount)}</div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Display statistics
    const stats = statisticsCalculator.generateSummary(transactions);
    const statsHtml = `
        <div class="bg-blue-600 text-white rounded-lg p-5 shadow-sm">
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
                <span>📊</span> Ringkasan Statistik
            </h3>
            <div class="space-y-2">
                <div class="flex justify-between items-center py-2 border-b border-white border-opacity-20">
                    <span>Total Transaksi:</span>
                    <strong class="text-xl">${stats.transactionCount}</strong>
                </div>
                <div class="flex justify-between items-center py-2">
                    <span>Total Revenue:</span>
                    <strong class="text-xl">Rp ${formatCurrency(stats.totalRevenue)}</strong>
                </div>
            </div>
        </div>
    `;
    
    if (statsContainerId) {
        document.getElementById(statsContainerId).innerHTML = statsHtml;
    } else {
        container.innerHTML += statsHtml;
    }
}

function formatCurrency(amount) {
    return amount.toLocaleString('id-ID');
}

// Initialize
console.log('Purchase Calculator Web App loaded successfully!');
