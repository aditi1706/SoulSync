// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// --- In-Memory "Database" for Demonstration ---
// This will reset every time the server restarts.
let wellnessData = {
    goalsCompleted: 0,
    dailyStreak: 1,
};

// Middleware to read JSON from requests
app.use(express.json());

// This line tells Express to serve your existing HTML, CSS, and JS files
app.use(express.static(path.join(__dirname, 'public')));


// --- API Endpoint for Inspirational Quotes ---
const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "— Steve Jobs" },
    { text: "Believe you can and you're halfway there.", author: "— Theodore Roosevelt" },
    { text: "The mind is everything. What you think you become.", author: "— Buddha" }
];

app.get('/api/quote', (req, res) => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json(randomQuote);
});

// --- API Endpoints for Wellness Dashboard Data ---

// Endpoint to GET the current dashboard data
app.get('/api/dashboard-stats', (req, res) => {
    res.json(wellnessData);
});

// Endpoint to POST that a goal was completed
app.post('/api/goals/complete', (req, res) => {
    wellnessData.goalsCompleted += 1;
    // In a real app, you would add logic here to check dates and update the streak.
    console.log(`A goal was completed! Total today: ${wellnessData.goalsCompleted}`);
    res.json({ success: true, goalsCompleted: wellnessData.goalsCompleted });
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});