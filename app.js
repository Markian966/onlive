require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const homeRoutes = require('./routes/home');

app.use('/', homeRoutes);

app.use((req, res) => {
  res.status(404).render('layouts/main', { 
    title: '404 - Page Not Found',
    body: '../pages/error',
    message: 'The page you are looking for does not exist' 
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).render('layouts/main', { 
    title: '500 - Server Error',
    body: '../pages/error',
    message: 'An internal server error occurred' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});