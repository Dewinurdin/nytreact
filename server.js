const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8080;
const cors = require('cors');

const app = express();



app.use(cors()); //accept request

app.get("/test", (req, res) => {
	res.json({
		user: "Dewi",
		todo: "MERN app"
	})
});

app.listen(PORT, function(){
	console.log(`Server now listening on PORT ${PORT}!`);
});