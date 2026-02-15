const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./db');
const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'campus_event_secret_123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

// --- AUTH ROUTES ---

app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));

// POST Signup: Hashing & Duplicate Email Check (Requirement)
app.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userRef = db.collection('users').doc(email);
        const doc = await userRef.get();

        if (doc.exists) return res.send("Email already exists! <a href='/signup'>Try again</a>");

        const hashedPassword = await bcrypt.hash(password, 10);
        await userRef.set({ name, email, password: hashedPassword, role });
        res.redirect('/login');
    } catch (e) { res.status(500).send("Error: " + e.message); }
});

// POST Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userDoc = await db.collection('users').doc(email).get();
        if (userDoc.exists) {
            const user = userDoc.data();
            if (await bcrypt.compare(password, user.password)) {
                req.session.user = user;
                return res.redirect('/dashboard');
            }
        }
        res.send("Invalid credentials. <a href='/login'>Go back</a>");
    } catch (e) { res.status(500).send("Error: " + e.message); }
});

// --- DASHBOARD & EVENT ROUTES ---

app.get('/dashboard', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    
    try {
        const eventsSnapshot = await db.collection('events').get();
        const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.render('dashboard', { user: req.session.user, events });
    } catch (e) { res.status(500).send("Error fetching events."); }
});

// Admin: Add Event
app.post('/add-event', async (req, res) => {
    if (req.session.user.role !== 'admin') return res.status(403).send("Unauthorized");
    const { title, date, description } = req.body;
    await db.collection('events').add({ title, date, description, attendees: [] });
    res.redirect('/dashboard');
});

// Admin: Remove Event (Extra functionality)
app.post('/delete-event/:id', async (req, res) => {
    if (req.session.user.role !== 'admin') return res.status(403).send("Unauthorized");
    await db.collection('events').doc(req.params.id).delete();
    res.redirect('/dashboard');
});

// Student: Mark Attendance
app.post('/join-event/:id', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const eventId = req.params.id;
    await db.collection('events').doc(eventId).update({
        attendees: admin.firestore.FieldValue.arrayUnion(req.session.user.email)
    });
    res.redirect('/dashboard');
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.listen(3000, () => console.log('Server: http://localhost:3000'));