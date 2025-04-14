const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serving static files (for frontend)

const usersFile = path.join(__dirname, 'users.json');
let users = {};

if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
}

app.post('/register', (req, res) => {
    const { name, email, phone, password } = req.body;

    if (users[email]) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit code

    users[email] = { name, phone, password, code };
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    res.json({ message: 'Registered successfully', code });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users[email];
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', code: user.code });
});

app.post('/vr-login', (req, res) => {
    const { email, code } = req.body;
    const user = users[email];
    if (!user || user.code !== code) {
        return res.status(401).json({ message: 'Invalid code or user not found' });
    }
    res.json({ message: 'VR Login successful' });
});

app.listen(PORT, () => {
    console.log(`🚀 TFG WEB is running at http://localhost:${PORT}`);
});

app.get('/get-users', (req, res) => {
    if (!fs.existsSync(usersFile)) {
        return res.status(404).json({ message: 'User data not found' });
    }

    const data = fs.readFileSync(usersFile, 'utf8');
    const allUsers = JSON.parse(data);
    res.json(allUsers);
});

