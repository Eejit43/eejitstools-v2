if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const createError = require('http-errors');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

const indexRouter = require('./routes/index');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.set('json spaces', 2);

app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));

app.use('/', indexRouter);

app.get('/headers', (req, res) => {
    res.status(200).json(req.headers);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: err.message });
});

module.exports = app;
