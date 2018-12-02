// first we import our dependencies…
const Comment = require('./models/comment');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

// and create our instances
const app = express();
app.use(cors());
const router = express.Router();

// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.API_PORT || 3001;
// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// now we can set the route path & initialize the API
router.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Use our router configuration when we call /api
app.use('/api', router);

// db config -- set your URI from mLab in secrets.js
mongoose.connect('mongodb://localhost:27017/commentsDb');
var db = mongoose.connection;
//console.log(db);
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.get('/comments', (req, res) => {
  console.log("in get");;
  Comment.find((err, comments) => {
    if (err) return res.json({ success: false, error: err });
    console.log(comments);
    return res.json({ success: true, data: comments });
  });
});

router.post('/comments', (req, res) => {
  const comment = new Comment();
  // body parser lets us use the req.body
  const { author, text } = req.body;
  if (!author || !text) {
    // we should throw an error. we can do this check on the front end
    return res.json({
      success: false,
      error: 'You must provide an author and comment'
    });
  }
  comment.author = author;
  comment.text = text;
  comment.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
