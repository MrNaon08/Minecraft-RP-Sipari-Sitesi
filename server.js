const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sabit hesaplar
let users = [
    { username: "WeriqX", password: "1108", role: "admin" },
    { username: "selimk", password: "2344", role: "user" },
    { username: "kenobi3761", password: "2344", role: "user" }
];

let orders = [];

// Ana sayfa giriş ekranını açar
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'giris.html'));
});

// Admin panelini açmak için köprü
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// GİRİŞ YAP API
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Kullanıcı adı veya şifre boş bırakılamaz!" });
    }

    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase().trim() && u.password === password.trim());
    
    if (!user) {
        return res.status(400).json({ message: "Kullanıcı adı veya şifre yanlış!" });
    }
    
    // Yönlendirme yapmıyoruz, verileri json olarak güvenle dönüyoruz
    return res.status(200).json({ username: user.username, role: user.role });
});

// SİPARİŞ OLUŞTUR
app.post('/api/orders', (req, res) => {
    const { username, address, product } = req.body;
    if (!username || !address || !product) return res.status(400).json({ message: "Sipariş bilgileri eksik." });

    const newOrder = { username, address, product, date: new Date() };
    orders.push(newOrder);
    return res.status(200).json({ message: "Siparişiniz listeye eklendi." });
});

// SİPARİŞLERİ ÇEK
app.get('/api/orders', (req, res) => {
    const requester = req.query.username; 
    if (!requester) return res.status(403).json({ message: "Yetkisiz erişim!" });

    const user = users.find(u => u.username.toLowerCase() === requester.toLowerCase().trim());

    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Yönetici yetkiniz yok!" });
    }
    res.json(orders);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu aktif.`));
