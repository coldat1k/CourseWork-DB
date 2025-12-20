const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const movieRoutes = require('./routes/movieRoutes');
const hallRoutes = require('./routes/hallRoutes');
const showingRoutes = require('./routes/showingRoutes');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.get('/tickets', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/tickets.html'));
});
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/showings', showingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});