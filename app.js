const express = require('express');
const db = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const morgan = require('morgan');

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(morgan('dev'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.use('/api/user', userRoutes);

app.use('/api/product', productRoutes);

app.all('*', (req, res) => {
    res.status(404).json({
        status: 'Fail',
        message: `Can't find ${req.originalUrl} on this server!`,
    });
});

db.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});
db.sync();
app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        status: err.status,
        message: err.message
    });
});
const PORT = 3335;
app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}`);
});