// Fetch all Customers
var customers = [
    {
        id: 1,
        name: "Jack",
        age: 25,
        address:{
            street: "NANTERRE CT",
            postcode: "77471"
        }
    },
    {
        id: 2,
        name: "Mary",
        age: 37,
        address:{
            street: "W NORMA ST",
            postcode: "77009"
        }
    },
    {
        id: 3,
        name: "Peter",
        age: 17,
        address:{
            street: "S NUGENT AVE",
            postcode: "77571"
        }
    },
    {
        id: 4,
        name: "Amos",
        age: 23,
        address:{
            street: "E NAVAHO TRL",
            postcode: "77449"
        }
    },
    {
        id: 5,
        name: "Craig",
        age: 45,
        address: {
            street: "AVE N",
            postcode: "77587"
        }
    }
]

exports.getAll = (req, res) => {
console.log("--->Get All Customers: \n" + JSON.stringify(customers, null, 4));
res.send(customers); 
};


const db = require('../../db');
const validator = require('validator');

const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

exports.createTable = (req, res, next) => {
    let id = req.params.id; 
    if(!validator.isNumeric(id) || id == 0){
        res.send('Parameter error: invalid parameters');
    }else{
        db.query("SELECT * FROM prova WHERE id = " + id, (err, rows, fields) => {
            if(err){
                res.send('Query error: ' + err.sqlMessage);
            }else{
                res.json(rows);
            }
        });
    }
};

exports.getTable = (req, res, next) => {
    let id = req.params.id; 
    if(!validator.isNumeric(id) || id == 0){
        res.send('Parameter error: invalid parameters');
    }else{
        db.query("SELECT * FROM prova WHERE id = " + id, (err, rows, fields) => {
            if(err){
                res.send('Query error: ' + err.sqlMessage);
            }else{
                res.json(rows);
            }
        });
    }
};

exports.insertTable = (req, res, next) => {
    db.query("INSERT INTO prova VALUES("+uuidv4()+", '"+req.body.desc+"');", function(err, row){
        if(err){
            res.send('Query error: ' + err.sqlMessage);
        }else{
            res.json(row);
        }
    });
};

exports.getFileUUID = (req, res, next) => {
    let id = req.params.id; 
    if(!validator.isNumeric(id) || id == 0){
        res.send('Parameter error: invalid parameters');
    }else{
        db.query("SELECT * FROM prova WHERE id = " + id, (err, rows, fields) => {
            if(err){
                res.send('Query error: ' + err.sqlMessage);
            }else{
                res.json(rows);
            }
        }); 
    }
};

// bytearray for payload
// uuidv4() must arrive by FE in uiid


exports.insertFile = (req, res, next) => {
    db.query("INSERT INTO files VALUES('"+uuidv4()+"', '"+req.body.name+"', "+req.body.size+", '"+req.body.mime+"', '"+req.body.payload+"');", function(err, row){
    // db.query("INSERT INTO files VALUES("+uuidv4()+", '"+req.body.name+"', "+req.body.size+", '"+req.body.mime+"', "+req.body.payload+");", function(err, row){
        if(err){
            res.send('Query error: ' + err.sqlMessage);
        }else{
            res.json(row.uuid);
        }
    });
};