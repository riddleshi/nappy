const express = require('express');
const app = express();
const session = require('express-session')
const passport = require('./config/passport')
const cors = require('cors');

const indexRouter = require('./routes/indexRouter');
const registerRouter = require('./routes/registerRouter');
const loginRouter = require('./routes/loginRouter');

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static('public')); // Serve static files from the "public" folder

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.session());

app.use(cors({
  origin: 'http://localhost:3000', // React dev server
  credentials: true
}));

app.use('/log-in', loginRouter);
app.use('/', indexRouter);
app.use('/register', registerRouter);


app.listen(8080, () => {
    console.log('Server is running on port 8080');
}
);