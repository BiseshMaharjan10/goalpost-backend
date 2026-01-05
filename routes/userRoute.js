const router = require('express').Router();

const {registerUser, loginUser} = require('../controllers/userController');
const verifyEmail = require('../helpers/verifyEmail');

router.post('/registerUser', registerUser);
router.get("/verify-email",verifyEmail);
router.post("/loginUser",loginUser);

module.exports = router;