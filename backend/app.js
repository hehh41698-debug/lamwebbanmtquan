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
    secret: 'techstore-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Route gốc
app.get('/', (req, res) => {
    res.json({
        message: '🚀 TechStore API Server',
        version: '1.0.0',
        endpoints: {
            products: '/api/products',
            product: '/api/products/:id',
            brands: '/api/brands',
            cart: '/api/cart',
            checkout: '/api/checkout',
            admin: '/api/admin/products'
        }
    });
});

// Đọc/Ghi file
const DATA_FILE = path.join(__dirname, 'data', 'products.json');

const readProducts = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeProducts = (products) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
};

// ============ API ROUTES ============

// Lấy danh sách sản phẩm
app.get('/api/products', (req, res) => {
    const products = readProducts();
    res.json(products);
});

// Lấy chi tiết sản phẩm
app.get('/api/products/:id', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
});

// Lấy danh sách thương hiệu
app.get('/api/brands', (req, res) => {
    const products = readProducts();
    const brands = [...new Set(products.map(p => p.brand))];
    res.json(brands);
});

// ============ GIỎ HÀNG ============

// Lấy giỏ hàng
app.get('/api/cart', (req, res) => {
    const cart = req.session.cart || [];
    const products = readProducts();
    
    const cartItems = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return {
            ...product,
            quantity: item.quantity,
            subtotal: product ? product.price * item.quantity : 0
        };
    });
    
    const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    res.json({ items: cartItems, total, count });
});

// Thêm vào giỏ hàng
app.post('/api/cart/add', (req, res) => {
    const { id, quantity = 1 } = req.body;
    
    if (!req.session.cart) {
        req.session.cart = [];
    }
    
    const cart = req.session.cart;
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ id, quantity });
    }
    
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    res.json({ success: true, count: total });
});

// Cập nhật giỏ hàng
app.post('/api/cart/update', (req, res) => {
    const { id, quantity } = req.body;
    
    if (!req.session.cart) {
        return res.json({ success: false });
    }
    
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

// Xóa khỏi giỏ hàng
app.post('/api/cart/remove', (req, res) => {
    const { id } = req.body;
    
    if (req.session.cart) {
        const cart = req.session.cart;
        const index = cart.findIndex(i => i.id === id);
        if (index !== -1) {
            cart.splice(index, 1);
        }
    }
    
    res.json({ success: true });
});

// Xóa toàn bộ giỏ hàng
app.post('/api/cart/clear', (req, res) => {
    req.session.cart = [];
    res.json({ success: true });
});

// ============ ĐẶT HÀNG ============

app.post('/api/checkout', (req, res) => {
    const order = req.body;
    console.log('📦 Đơn hàng mới:', order);
    
    // Xóa giỏ hàng
    req.session.cart = [];
    
    res.json({ 
        success: true, 
        message: 'Đặt hàng thành công!',
        order: order
    });
});

// ============ ADMIN ============

// Thêm sản phẩm
app.post('/api/admin/products', (req, res) => {
    const { name, brand, price, image, cpu, ram, storage, screen } = req.body;
    const products = readProducts();
    
    const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        name,
        brand,
        price: parseInt(price),
        image: image || 'https://via.placeholder.com/300x200?text=No+Image',
        cpu: cpu || 'Chưa cập nhật',
        ram: ram || 'Chưa cập nhật',
        storage: storage || 'Chưa cập nhật',
        screen: screen || 'Chưa cập nhật'
    };
    
    products.push(newProduct);
    writeProducts(products);
    
    res.json({ success: true, product: newProduct });
});

// Sửa sản phẩm
app.put('/api/admin/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, brand, price, image, cpu, ram, storage, screen } = req.body;
    const products = readProducts();
    
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = {
            id,
            name,
            brand,
            price: parseInt(price),
            image: image || 'https://via.placeholder.com/300x200?text=No+Image',
            cpu: cpu || 'Chưa cập nhật',
            ram: ram || 'Chưa cập nhật',
            storage: storage || 'Chưa cập nhật',
            screen: screen || 'Chưa cập nhật'
        };
        writeProducts(products);
        res.json({ success: true, product: products[index] });
    } else {
        res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
});

// Xóa sản phẩm
app.delete('/api/admin/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const products = readProducts();
    const filtered = products.filter(p => p.id !== id);
    writeProducts(filtered);
    res.json({ success: true });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`🚀 Backend server chạy tại: http://localhost:${PORT}`);
    console.log(`📦 Dữ liệu được lưu tại: data/products.json`);
});