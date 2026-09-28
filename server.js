const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Tarayıcı ve form uyumluluk ayarları
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

// Sabit kayıtlı hesaplar
let users = [
    { username: "WeriqX", password: "1108", role: "admin" },
    { username: "selimk", password: "2344", role: "user" },
    { username: "kenobi3761", password: "2344", role: "user" }
];

let orders = [];

// Ana sayfaya girildiğinde direkt giriş ekranını yükler
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'giris.html'));
});

// HTML sayfalarının isimleriyle çağrılabilmesi için genel köprü
app.get('/:page.html', (req, res) => {
    res.sendFile(path.join(__dirname, `${req.params.page}.html`));
});

// GİRİŞ YAP (Hem POST hem GET hatalarını yakalayan güvenli endpoint)
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.send(`
            <div style="text-align:center; font-family:sans-serif; margin-top:50px; color:#ff5555;">
                <h1>Hata: Kullanıcı adı veya şifre boş bırakılamaz!</h1>
                <br><a href="/" style="color:#55ff55; font-size:18px;">Geri Dön</a>
            </div>
        `);
    }

    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase().trim() && u.password === password.trim());
    
    if (!user) {
        return res.send(`
            <div style="text-align:center; font-family:sans-serif; margin-top:50px; color:#ff5555;">
                <h1>Hata: Kullanıcı adı veya şifre yanlış!</h1>
                <br><a href="/" style="color:#55ff55; font-size:18px;">Geri Dön ve Tekrar Dene</a>
            </div>
        `);
    }
    
    // Kullanıcıyı tarayıcı hafızasına alıp markete geçiren JavaScript köprüsü
    res.send(`
        <script>
            localStorage.setItem('mc_user', '${user.username}');
            window.location.href = '/index.html';
        </script>
    `);
});

// Yanlışlıkla GET isteği atılırsa hata vermek yerine kullanıcıyı ana sayfaya fırlatır
app.get('/api/auth/login', (req, res) => {
    res.redirect('/');
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
