const express = require('express');
const app = express();
const session = require('express-session')
const passport = require('./config/passport')
const cors = require('cors');

const indexRouter = require('./routes/indexRouter');
const registerRouter = require('./routes/registerRouter');
const loginRouter = require('./routes/loginRouter');
const homeRouter = require('./routes/homeRouter');
const sleepGoalRouter = require('./routes/sleepGoalRouter');
const dreamJournalRouter = require('./routes/dreamJournalRouter');

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
app.use('/register', registerRouter);
app.use('/home', homeRouter);
app.use('/sleep-goal', sleepGoalRouter);
app.use('/dream-journal', dreamJournalRouter);
app.use('/', indexRouter);

app.listen(8080, () => {
    console.log('Server is running on port 8080');
}
);