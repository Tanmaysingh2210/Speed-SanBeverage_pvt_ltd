const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');



connectDB();
const app = express();
app.use(express.json());

app.use(session({
    secret: "beverage-campa",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use('/auth', authRoutes);



const port = 3000;
app.listen(port, () => (`server running at port ${port}`));