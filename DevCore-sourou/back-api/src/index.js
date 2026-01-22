const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect DB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/promotions', require('./routes/promotions'));
app.use('/api/works', require('./routes/works'));

app.get('/', (req, res) => res.send({ ok: true, name: 'gasaunivers-back-api' }));

const PORT = process.env.PORT || 5000;
if (require.main === module) {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
