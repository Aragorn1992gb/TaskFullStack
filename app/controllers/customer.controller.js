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


const db = require('../../db');
const validator = require('validator');
const aes256 = require('aes256');
const cryptoVar = require('crypto');

const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

function aes256Encrypt(plaintext){
    objAes = {
        key: "",
        encryptedPlainText: ""
    };

    objAes.key = cryptoVar.randomBytes(64).toString('base64');

    var cipher = aes256.createCipher(objAes.key);

    objAes.encryptedPlainText = cipher.encrypt(plaintext);

    console.log("PLAIN",plaintext);
    console.log("ENCR",objAes.encryptedPlainText);

    var decryptedPlainText = cipher.decrypt(objAes.encryptedPlainText);

    console.log("decryptedPlainText",decryptedPlainText);    

    return objAes;
}

function aes256Decrypt(key, encryptedPlainText){
    var decryptedPlainText= "";

    var cipher = aes256.createCipher(key);

    console.log("encrProva",encryptedPlainText.toString());

    decryptedPlainText = cipher.decrypt(encryptedPlainText.toString());

    return decryptedPlainText;
}


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

exports.decryptFileByUUID = (req, res, next) => {
    let uuid = req.body.uuid;
    let key = req.body.key; 
    console.log("keyy",key);
    console.log("uuidd",uuid);
    if(!uuid && !key){
        res.send('Parameter error: invalid parameters');
    }else{
        db.query("SELECT * FROM files WHERE uuid = '" + uuid +"'", (err, rows, fields) => {
            if(err){
                res.send('Query error: ' + err.sqlMessage);
            }else{
                var decryptedObj = {
                    uuid: rows[0].uuid,
                    fileName: rows[0].name,
                    size: rows[0].size,
                    mime: rows[0].mime,
                    payload: aes256Decrypt(key, rows[0].payload)
                }
                res.json(decryptedObj);
            }
        }); 
    }
};

// bytearray for payload
// uuidv4() must arrive by FE in uiid


exports.insertFile = (req, res, next) => {
    var encPayload = aes256Encrypt(req.body.payload);
    var uuid = uuidv4();

    db.query("INSERT INTO files VALUES('"+uuid+"', '"+req.body.name+"', "+req.body.size+", '"+req.body.mime+"', '"+encPayload.encryptedPlainText+"');", function(err, row){
        if(err){
            res.send('Query error: ' + err.sqlMessage);
        }else{
            var info = {
                uuid: uuid,
                key: encPayload.key
            }
            res.json(info);
        }
    });
};