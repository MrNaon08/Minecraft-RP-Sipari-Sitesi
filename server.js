const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let orders = [];

// Ana adrese girildiğinde direkt market sayfasını açar
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin sayfasını açar
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// SİPARİŞ OLUŞTUR
app.post('/api/orders', (req, res) => {
    const { username, address, product } = req.body;
    if (!username || !address || !product) return res.status(400).json({ message: "Eksik bilgi." });

    // Her siparişe silinebilmesi için rastgele benzersiz ID atıyoruz
    const newOrder = { 
        id: Math.random().toString(36).substr(2, 9), 
        username, 
        address, 
        product, 
        date: new Date() 
    };
    orders.push(newOrder);
    return res.status(200).json({ message: "Başarılı" });
});

// SİPARİŞLERİ LİSTELE
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// S SİPARİŞİ SİL (Teslim Edildi Komutu)
app.delete('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    orders = orders.filter(o => o.id !== orderId);
    return res.status(200).json({ message: "Sipariş başarıyla silindi." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu aktif.`));
