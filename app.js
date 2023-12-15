// Name: Ashish
// CNumber: C0878716
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const indexRouter = require('./routes/index');
const cors = require('cors');

const app = express();

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
const connectionString = 'mongodb+srv://dhruvhc2710:dhruvhc2710@cluster0.owzhnsu.mongodb.net/ProductCatalog?retryWrites=true&w=majority'
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
  

// Use routes
app.use('/', indexRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
