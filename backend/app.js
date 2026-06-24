const express = require('express');
const cors = require('cors');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
    secret: 'techstore-secret',
    resave: false,
    saveUninitialized: true
}));

// Đọc dữ liệu
const DATA_FILE = path.join(__dirname, 'data', 'products.json');

const readProducts = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Lỗi đọc file:', error);
        return [];
    }
};

const writeProducts = (products) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
};

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'TechStore API Server' });
});

// Products
app.get('/api/products', (req, res) => {
    const products = readProducts();
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
});

app.get('/api/brands', (req, res) => {
    const products = readProducts();
    const brands = [...new Set(products.map(p => p.brand))];
    res.json(brands);
});

// Cart
app.get('/api/cart', (req, res) => {
    const cart = req.session.cart || [];
    const products = readProducts();
    const items = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return { ...product, quantity: item.quantity };
    });
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    res.json({ items, total, count });
});

app.post('/api/cart/add', (req, res) => {
    const { id, quantity = 1 } = req.body;
    if (!req.session.cart) req.session.cart = [];
    const cart = req.session.cart;
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ id, quantity });
    }
    res.json({ success: true });
});

app.post('/api/cart/update', (req, res) => {
    const { id, quantity } = req.body;
    if (!req.session.cart) return res.json({ success: false });
    const cart = req.session.cart;
    const item = cart.find(i => i.id === id);
    if (item) {
        if (quantity > 0) {
            item.quantity = quantity;
        } else {
            const index = cart.indexOf(item);
            cart.splice(index, 1);
        }
    }
    res.json({ success: true });
});

app.post('/api/cart/remove', (req, res) => {
    const { id } = req.body;
    if (req.session.cart) {
        const cart = req.session.cart;
        const index = cart.findIndex(i => i.id === id);
        if (index !== -1) cart.splice(index, 1);
    }
    res.json({ success: true });
});

app.post('/api/cart/clear', (req, res) => {
    req.session.cart = [];
    res.json({ success: true });
});

// Checkout
app.post('/api/checkout', (req, res) => {
    const order = req.body;
    console.log('Đơn hàng mới:', order);
    req.session.cart = [];
    res.json({ success: true, message: 'Đặt hàng thành công!' });
});

// Admin
app.post('/api/admin/products', (req, res) => {
    const { name, brand, price, image, cpu, ram, storage, screen } = req.body;
    const products = readProducts();
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        brand,
        price: parseInt(price),
        image: image || 'https://via.placeholder.com/300x200',
        cpu: cpu || 'Chưa cập nhật',
        ram: ram || 'Chưa cập nhật',
        storage: storage || 'Chưa cập nhật',
        screen: screen || 'Chưa cập nhật'
    };
    products.push(newProduct);
    writeProducts(products);
    res.json({ success: true, product: newProduct });
});

app.put('/api/admin/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, brand, price, image, cpu, ram, storage, screen } = req.body;
    const products = readProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = { id, name, brand, price: parseInt(price), image, cpu, ram, storage, screen };
        writeProducts(products);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
});

app.delete('/api/admin/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const products = readProducts();
    const filtered = products.filter(p => p.id !== id);
    writeProducts(filtered);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend chạy tại: http://localhost:${PORT}`);
    console.log(`📦 Dữ liệu: data/products.json`);
});