import express from 'express'
 var router2 = express.Router();
 
 /* GET customers listing. */
 router2.get('/r2', function (req, res, next) {
    res.send('respond with a resource');
 });

function add (x, y) {
   return x + y;
 }
 
export const addFn  = add;
export const routerFn  = router2;
//module.exports.add = add;
