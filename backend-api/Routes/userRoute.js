const express = require("express");
const { registerUser, loginUser, singleUser, allUser } = require("../Controllers/userController");

const router = express.Router();

// router.get("/signup", (req, res) => {
//     res.send("Register");
// })

router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.get("/find/:userId", singleUser);
router.get("/allusers", allUser);


module.exports = router;