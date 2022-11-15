import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

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

app.get("/login/:id", (req, res) => {
    console.log(req.body);
    console.log(req.params.id);
    res.send({request: req.body, data: req.params.id})
})

//Routes
app.post("/register", (req, res) => {
    console.log(req.body);
    const { name, email, password} = req.body;

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

app.listen(9400, () => {
    console.log("hi from Node!!")
})



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