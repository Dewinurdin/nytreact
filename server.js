const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const request = require("request");
const path = require("path");
// Our scraping tools
const cheerio = require("cheerio");

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Require all models
// const db = require("./model");
const Article = require("./model/Article.js")
const Note = require("./model/Note.js")
const PORT = process.env.PORT || 8080;

//Setting up connection to mongoose
const connection = mongoose.connection;
//Making sure Mongoose is Connected
connection.once("open", function(){
  console.log("Mongoose Connected!");
}).on("error", function(){
  console.log("Error loading Mongoose");
  //Throw Error if any
});

// Initialize Express
const app = express();
// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("view"));
// app.set('view', path.join(__dirname, 'view'));
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scraping_nyt");

// Routes

app.get('/', (req, res) =>{
  res.send("/");
});

// A GET route for scraping the New York Times
app.get("/scrape", function(req, expressRes) {
  let url = "https://www.nytimes.com";
  // Grab the body of the html with request
  request(url, (err, requestRes, html) => {
    if (err) throw err;
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    let $ = cheerio.load(html);
    
    $(".collection .theme-summary").each(function(index, element){
      // Save results in empty object
       let result = {};
       // console.log(result);
       
      result.title = $(this).children(".story-heading").text().trim();
      // console.log("Title: " + results.title);
      // console.log("=======================================================");
       result.summary = $(this).children(".summary").text().trim();
       // console.log("Body: " + results.summary);

       Article
          .create(result)
          .then((dbArticle) => {
            // View the added result in the console
            // console.log(dbArticle);
          })
          .catch((err) => {
            // If an error occurred, console log err
            return expressRes.json(err);
              }); 
          });
    });
    // expressRes.send("scrape successful");
    Article.find({}).then((allData) =>{
              expressRes.json(allData);
              // console.log(allData);
            });
  });

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  Article
  .find({}, (err, allData) => {
    if (err){
      console.log("err 95: ", err);
    } else {
      res.json(allData);
    }
  });
    

// Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:_id", (req, res) => {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   Article
//     .findOne({ _id: req.params.id })
//     // and populate all of the notes associated with it
//     .populate("note")
//     .then((dbArticle) => {
//       // If we were able to successfully find an Article with the given id, send it back to the client
//       console.log("dbArticle 115: ", dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       console.log(err);
//     });
// });

// app.get("*", (req, res)=>{
//   res.send("Page Not Found");
// });

// app.post("/articles", (req, res) => {
//   Article
//   .findAll({})
//   .then(function(dbArticle){
//     console.log("dbArticle 127: ", dbArticle);
//   })
//   .catch((err) =>{
//     console.log("err 129: ", err);
//   })
});

// Route for saving/updating an Article's associated Note
// app.post("/articles/:id", (req, res) => {
//   // Create a new note and pass the req.body to the entry
//   Note
//     .create(req.body)
//     .then(function(dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. 
//       //Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       // If we were able to successfully update an Article, send it back to the client
//       console.log("dbArticle 148: ", dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       console.log(err);
//     });
// });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});