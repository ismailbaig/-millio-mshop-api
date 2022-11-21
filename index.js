import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {addFn} from './customers.js';
import {options} from './options.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/milliodb', {
    useNewUrlparser: true,
    useunifiedTopology: true
}, () => {
    console.log("mongo db connected!!");
});

// Mongoose Schema - Start
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

export const itembasedetailsModel = new mongoose.Schema({
    pkItemId: Number,
    id: Number,
    uniqueId: String,
    itemName: String,
    rating: String,
    itemCartCount: Number,
    reviewCount: Number,
    itemDetail1: String, 
    itemDetail2: String, 
    itemDetail3: String, 
    itemDetail4: String, 
    itemDetail5: String, 
    itemDetail6: String, 
    description: String,
    discountPrice: Number,
    actualPrice: Number,
    imageName: String
});

const User = new mongoose.model("User", userSchema);
const itembasedetails = new mongoose.model("itembasedetails", itembasedetailsModel);
// Mongoose Schema - End

//Application Routes - Start
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
            let token = jwt.sign(userdata, options.skey, {
                algorithm: 'HS256',
                expiresIn: '60m'
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
    });
});

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
            });
        }
    });
});

//Gets all data from Collection for Items base information
app.get("/gtalitms", verifyToken, (req, res) => {
    jwt.verify(req.token, options.skey, (err, data) => {
        if(err){
            res.status(403).json({
                message: "Invalid Token !!",        
              });
        } else {
            itembasedetails.find( {},  (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    res.status(200).json(result);
                }
            });
        };
    });
});

app.get("/gtsgleitm/:uid", verifyToken, (req, res) => {
    jwt.verify(req.token, options.skey, (err, data) => {
        if(err){
            res.status(403).json({
                message: "Invalid Token !!",        
              });
        } else {
            var uid = req.params.uid;
            itembasedetails.findOne( {uniqueId: uid},  (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    res.status(200).json(result);
                }
            });
        };
    });
});

//Application Routes - End


// Test Routes - START
app.post("/testtoken", verifyToken, (req, res, next) => {
    jwt.verify(req.token, options.skey, (err, data) => {
        if(err){
            res.status(403).json({
                message: "Invalid Token !!",        
              });
        } else {

            res.status(200).json({
                message: "Token validated 11 !!", 
                addFn2: addFn(1,20)       
              });
        }            
    })
});

app.get("/test", (req, res) => {
    res.send("test");
});
// Test Routes - END

//Middle ware
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

app.listen(9400, () => {
    console.log("hi from Node!!")
});
