import express, { response } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
//import customersRouter from 'customers'

var router = express.Router();

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/milliodb', {
    useNewUrlparser: true,
    useunifiedTopology: true
}, () => {
    console.log("mongo db connected!!");
})


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/test", (req, res) => {
    res.send("test");
})

app.get("/login/:id", (req, res) => {
    console.log(req.body);
    console.log(req.params.id);
    res.send({request: req.body, data: req.params.id})
})

//Routes
app.post("/register", (req, res) => {
    console.log(req.query);
    const { name, email, password} = req.query;

    User.findOne({email: email}, (err, user) => {
        if(user) {
            res.send({message: "User already exists"})
        } else {
            const user = new User({
                name, email, password
            });

            user.save(err => {
                if(err){
                    res.send(err)
                } else {
                    res.send({message: "User registered scuccessfully!!"})
                }
            })
        }
    })
});

app.post("/login", (req, res) => {
    const { uid, pd } = req.query;
    User.findOne({name: uid, password: pd}, (err, user) => {
        if(err) {
            res.status(500).json({
                message: 'Error'
                });
        }
        if(user) {
            let userdata = {
                username: uid,
                password: pd
            }
            let token = jwt.sign(userdata, "mysecretkey123", {
                algorithm: 'HS256',
                expiresIn: '10m'
            });

            res.status(200).json({
                message: 'Login Successful',
                jwtoken: 'Bearer ' + token
                });

        }else {
            res.status(401).json({
                message: 'Login Failed 2'
                });
        }
    })
})

app.post("/testtoken", verifyToken, (req, res, next) => {
    jwt.verify(req.token, "mysecretkey123", (err, authData) => {
        if(err){
            res.status(403).json({
                message: "Invalid Token validated!!",        
              });
        } else {
            res.status(200).json({
                message: "Token validated!!",        
              });
        }            
    })
});

function verifyToken(req, res, next) {

    const bearerHeader = req.headers["authorization"];
  
    if (typeof bearerHeader !== "undefined") {
  
      const bearerToken = bearerHeader.split(" ")[1];
  
      req.token = bearerToken;
  
      next();
  
    } else {
  
      res.sendStatus(403);
  
    }
  
  }

//This should work only after JWT is valid
app.get("dashboard", (req, res) => {
    // chck for JWT validation
});

app.listen(9400, () => {
    console.log("hi from Node!!")
})

//module.exports = index;

/*
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

// your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
*/