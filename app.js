// Name: Ashish
// CNumber: C0878716
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const indexRouter = require('./routes/index');
const Handlebars = require('handlebars');
const helpers = require('./helpers.js');
const cors = require('cors');

// Register helper
Handlebars.registerHelper('formatDate', helpers.formatDate);

const app = express();

// Handlebars middleware
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS middleware
app.use(cors({
  origin: 'http://localhost:3000' // your React app's URL
}));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const connectionString = 'mongodb+srv://ashishralh:Dell%40123@cluster0.vycc0qm.mongodb.net/ProductCatalog?retryWrites=true&w=majority'
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Use routes
app.use('/', indexRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
