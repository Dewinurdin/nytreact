const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/test", (req, res) => {
	res.json({
		user: "Dewi",
		todo: "MERN app"
	})
});

app.listen(PORT, function(){
	console.log(`🌎 ==> Server now listening on PORT ${PORT}!`);
});