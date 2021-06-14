const { response } = require("express");

module.exports = function(app) {
 
	var express = require("express");
	var router = express.Router();
	
    const customers = require('../controllers/customer.controller.js');
	
	var path = __basedir + '/views/';

	// Redis Client Setup
	const redis = require('redis');
	const redisClient = redis.createClient({
		host: 'redis',
		port: 6379,
		retry_strategy: () => 1000
	});
	const redisPublisher = redisClient.duplicate();
	
	
	router.use(function (req,res,next) {
		console.log("/" + req.method);
		next();
	});
	
	app.get('/', (req,res) => {
		res.sendFile(path + "index.html");
	});

	app.post('/encrypt/', (req,res) => {

		var promises = [];

		promises.push( new Promise( function(resolve,reject) {
			redisClient.hset('file', 'uuid', req.body.uuid, function (err, resR) {
				if(err) {
					reject(err); 
				}
				resolve(resR);
			});
		}));

		promises.push( new Promise( function(resolve,reject) {
			redisClient.hset('file', 'key', req.body.key, function (err, resR) {
				if(err) {
					reject(err);
				}	
				resolve(resR);
			});
		}));

		promises.push( new Promise( function(resolve,reject) {
			redisClient.hset('file', 'name', req.body.name, function (err, resR) {
				if(err) {
					reject(err);
				}	
				resolve(resR);
			});
		}));

		Promise.all(promises).then( function(values) {
			res.status(200); 
			res.send("SUCCESS");
		} ).catch(
			error => {
				res.status(501); 
				res.send(error.message);
			}
		);		

	});


	app.get('/decryptfile', (req,res) => {
		res.sendFile(path + "decrypt.html");
	});

	// app.get('/decrypted', (req,res) => {
	// 	res.sendFile(path + "decrypted.html");
	// });

	app.get('/encrypted', (req,res) => {
		res.sendFile(path + "encrypted.html");
	});

	app.get('/getFileInfo', (req,res) => {		
		console.log("Getting file info...");
		var objInfoFile = {
			uuid: "",
			key: "",
			name: ""
		}

		var promises = [];

		promises.push( new Promise( function(resolve,reject) {
			redisClient.hget('file', 'uuid', function (err, resR) {
				if(err) {
					reject(err); 
				}
				else if(resR){
					objInfoFile.uuid = resR.toString();	
				}
				
				resolve(resR);
			});
		}));

		promises.push( new Promise( function(resolve,reject) {
			redisClient.hget('file', 'key', function (err, resR) {
				if(err) {
					reject(err);
				}
				else if(resR){
					objInfoFile.key = resR.toString();	
				}
				
				resolve(resR);
			});
		}));

		promises.push( new Promise( function(resolve,reject) {
			redisClient.hget('file', 'name', function (err, resR) {
				if(err) {
					reject(err);
				}
				else if(resR){
					objInfoFile.name = resR.toString();	
				}
				
				resolve(resR);
			});
		}));
		

		Promise.all(promises).then( function(values) {
			redisClient.flushdb( function (err, succeeded) {
				console.log(succeeded);
			});
			res.json(objInfoFile);
		} ).catch(
			error => {
				res.status(501); 
				res.send(error.message);
			}
		//handleError(res,err)
		);			
		
	});

	app.get('/searchbyuuid', (req,res) => {
		console.log(req);
		res.sendFile(path + "decrypting.html");
	});

	function handleError(res,err) {
		res.status(501); 
		res.send("ERROR: "+err.message);
	}
	
	app.use("/",router);

	router.post('/insert/',customers.insertFile);
	router.get('/getbyuuid/',customers.selectByUUID);
	router.post('/decrypt/',customers.decryptFileByUUID);
 
	app.use("*", (req,res) => {
		res.sendFile(path + "404.html");
	});
}