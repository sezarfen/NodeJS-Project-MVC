const express = require('express');
const router = express.Router();

const adminController = require("../controllers/adminController");
const adminLog = require("../middlewares/adminLogs");

router.get("/add-blog", adminController.getAddBlog);

router.post("/add-blog", adminLog,adminController.postAddBlog);

router.get("/blogs", adminController.getBlogs);

router.post("/delete-blog", adminLog,adminController.postDeleteBlog);

router.post("/blogs", adminController.getEditBlog);

router.post("/edit-blog", adminLog,adminController.postEditBlog);


router.post("/acceptComment",adminLog, adminController.postAcceptComment);

router.post("/rejectComment",adminLog ,adminController.postRejectComment);

router.post("/deleteComment",adminLog ,adminController.postdeleteComment);

router.post("/warnUser" ,adminLog, adminController.postWarnUser);

router.get("/logs" , adminController.getLogs);

router.post("/unblockUser" , adminLog  , adminController.postUnblockUser);


module.exports = router;