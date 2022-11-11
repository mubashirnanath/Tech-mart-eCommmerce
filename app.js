const path = require('path');
const dotenv = require('dotenv').config()
const express = require('express');
const app = express();
const session = require('express-session');
const nocache = require('nocache');
const db = require('./config/connection');
const logger = require('morgan');
const Swal = require('sweetalert2')
const flash = require('connect-flash');


db.connect((err)=>{
    if(err)console.log("connection failed"+err);
    else console.log("Database connected");
  })

  app.use(flash());
  const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');


// // view engine setup
app.set('views', path.join(__dirname, 'View'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:"key",
  cookie:{maxAge:1000*60*60}
}))

app.use(nocache())
app.listen(3000);

app.use('/', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('users/error');
  });




