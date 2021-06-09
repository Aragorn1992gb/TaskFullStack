module.exports = function(app) {
 
	var express = require("express");
	var router = express.Router();
	
    const customers = require('../controllers/customer.controller.js');
	
	var path = __basedir + '/views/';
	
	router.use(function (req,res,next) {
		console.log("/" + req.method);
		next();
	});
	
	app.get('/', (req,res) => {
		res.sendFile(path + "index.html");
	});

	app.post('/encrypt/', (req,res) => {
		console.log(path);
		res.redirect(307, "/getdecrypt");
		// res.sendFile(path + "encrypted.html");
	});

	app.get('/decrypt', (req,res) => {
		res.sendFile(path + "decrypt.html");
	});

	app.get('/decrypted', (req,res) => {
		res.sendFile(path + "decrypted.html");
	});
	
	app.use("/",router);

	router.post('/insert/',customers.insertFile);
	router.post('/decrypt/',customers.decryptFileByUUID);
	router.post('/getdecrypt/',customers.decryptFileByUUID);
 
	app.use("*", (req,res) => {
		res.sendFile(path + "404.html");
	});
}