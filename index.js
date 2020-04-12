const express = require ('express');
const expressHandlebars = require('express-handlebars');
const cast = require('./data/cast.json');
const question = require('./lib/getQuestionToBeAsked');
const app = express();

app.engine('hbs', expressHandlebars({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
  res.render('beach', {
    title: 'beach',
    cast: cast
  })
});

app.get('/question', (req, res) => {
  if (req.query.id) {
    const selectedQuestion = question(req.query.id);
    res.json(selectedQuestion ? selectedQuestion : {tired: true});
  }
  else {
    res.status(400);
    res.json({error: 'no id'})
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000));
});