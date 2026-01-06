const router = require('express').Router();
const multer = require("multer");
const upload = multer();

const {registerUser, loginUser} = require('../controllers/userController');
const verifyEmail = require('../helpers/verifyEmail');

router.post('/registerUser',upload.none(),registerUser);
router.get("/verify-email",verifyEmail);
router.post("/loginUser",loginUser);

module.exports = router;