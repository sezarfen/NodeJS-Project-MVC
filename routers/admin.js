const express = require('express');
const router = express.Router();

const adminController = require("../controllers/adminController");


router.get("/add-blog", adminController.getAddBlog);

router.post("/add-blog", adminController.postAddBlog);

router.get("/blogs", adminController.getBlogs);

router.post("/delete-blog", adminController.postDeleteBlog);

router.post("/blogs", adminController.getEditBlog);

router.post("/edit-blog", adminController.postEditBlog);


router.post("/acceptComment", adminController.postAcceptComment)
router.post("/rejectComment", adminController.postRejectComment)

router.post("/deleteComment", adminController.postdeleteComment)

module.exports = router;