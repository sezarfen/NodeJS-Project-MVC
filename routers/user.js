const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController");
const isAuthenticated = require("../middlewares/isAuthenticated");

// GET REQUESTS
router.get("/",userController.getIndex);

router.get("/blogIndex/:blogId",userController.getBlogIndex);

router.post("/newBlogComment" , isAuthenticated, userController.postNewComment)

module.exports = router;