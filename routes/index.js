import express from "express";
export let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json("Welcome to the Food Order API.")
});
