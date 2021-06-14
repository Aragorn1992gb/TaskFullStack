const db = require('../../db');
const validator = require('validator');
const aes256 = require('aes256');
const cryptoVar = require('crypto');
const url = require('url');

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

    var decryptedPlainText = cipher.decrypt(objAes.encryptedPlainText);

    return objAes;
}

function aes256Decrypt(key, encryptedPlainText){
    var decryptedPlainText= "";

    var cipher = aes256.createCipher(key);

    decryptedPlainText = cipher.decrypt(encryptedPlainText.toString());

    return decryptedPlainText;
}



exports.decryptFileByUUID = (req, res, next) => {
    let uuid = req.body.uuid;
    let key = req.body.key; 
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


exports.insertFile = (req, res, next) => {
    var encPayload = aes256Encrypt(req.body.payload);
    var uuid = uuidv4();
    var name = req.body.name.replace(/\'/g, '');
    var query = "INSERT INTO files VALUES('"+uuid+"', '"+name+"', "+req.body.size+", '"+req.body.mime+"', '"+encPayload.encryptedPlainText+"');";
    db.query(query, function(err, row){
        if(err){
            res.status(200);
            res.send('Query error: ' + err.sqlMessage + "query: " + query);
        }else{
            var info = {
                uuid: uuid,
                key: encPayload.key,
                name: name
            }
            res.json(info);
        }
    });
};

exports.selectByUUID = (req, res, next) => {
    console.log("entrato", req.url);
    let params = (new URL("http://localhost:8080/"+req.url)).searchParams;
    var uuid = params.get('uuid');
    console.log(uuid);
    if(!uuid){
        res.send('Parameter error: invalid parameter');
    }else{
        db.query("SELECT * FROM files WHERE uuid = '" + uuid +"'", (err, rows, fields) => {
            if(err){
                res.send('Query error: ' + err.sqlMessage);
            }else{
                console.log("length ",rows.length,"ghJ",rows.size)
                if(rows.length > 0){
                    console.log("ok");
                    var encryptedObj = {
                        uuid: rows[0].uuid,
                        fileName: rows[0].name,
                        size: rows[0].size,
                        mime: rows[0].mime
                    }
                    console.log(encryptedObj.uuid);
                    res.json(encryptedObj);
                } else {
                    console.log("Noone file find for that UUID");
                }
            }
        }); 
    };
};