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
 
    // Retrieve all Customers
    app.get('/api/customers/all', customers.getAll);
	
	app.use("/",router);

	router.get('/prove/:id/',customers.getTable);
	router.post('/insert/',customers.insertFile);
	router.post('/decrypt/',customers.decryptFileByUUID);
 
	app.use("*", (req,res) => {
		res.sendFile(path + "404.html");
	});
}