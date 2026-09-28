const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Tanımlı hesaplar
let users = [
    { username: "WeriqX", password: "1108", role: "admin" },
    { username: "selimk", password: "2344", role: "user" },
    { username: "kenobi3761", password: "2344", role: "user" }
];

let orders = [];

// "Cannot GET /" hatasını çözen ana yönlendirme
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'giris.html'));
});

// Sayfaların isimleriyle çağrılabilmesi için (index.html, admin.html vb.)
app.get('/:page.html', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, `${page}.html`));
});

// KAYIT OL
app.post('/api/auth/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Eksik bilgi girdiniz." });
    
    const userExists = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (userExists) return res.status(400).json({ message: "Bu kullanıcı adı zaten alınmış!" });

    users.push({ username, password, role: "user" });
    return res.status(200).json({ message: "Kayıt işlemi başarılı!" });
});

// GİRİŞ YAP
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    
    if (!user) return res.status(400).json({ message: "Kullanıcı adı veya şifre yanlış!" });
    
    return res.status(200).json({ username: user.username, role: user.role });
});

// S SİPARİŞ OLUŞTUR
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
    const user = users.find(u => u.username.toLowerCase() === requester.toLowerCase());

    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Bu sayfayı görüntülemek için yönetici yetkiniz yok!" });
    }
    
    res.json(orders);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor.`));
