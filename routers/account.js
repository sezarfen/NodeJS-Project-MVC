const express = require('express');
const router = express.Router();

const beforeProfile = require("../middlewares/beforeProfile");
const accountController = require("../controllers/accountController");

router.get("/login", accountController.getLogin);
router.post("/login", accountController.postLogin);

router.get("/register", accountController.getRegister);
router.post("/register", accountController.postRegister);

router.get("/logout", accountController.getLogout);

router.get("/notifications", accountController.getNotifications);

router.post("/acceptRequest", accountController.postAcceptRequest);
router.post("/rejectRequest", accountController.postRejectRequest);

router.get("/subUsers", accountController.getSubUsers);

router.post("/contectUser", accountController.postContectUser);
router.post("/deleteSubUser", accountController.postDeleteSubUser);

router.get("/profile/:username", beforeProfile,accountController.getSpecificProfile);
router.get("/profile", beforeProfile, accountController.getProfile);

router.post("/apllyReferenceAgain", accountController.getReferenceAgain);

router.post("/followUser", accountController.postFollowUser);
router.post("/unfollowUser", accountController.postUnfollowUser);

router.get("/getFollowers", accountController.getFollowers);

module.exports = router;