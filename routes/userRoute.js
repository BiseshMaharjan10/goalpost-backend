const router = require('express').Router();

const {registerUser} = require('../controllers/userController');
const verifyEmail = require('../helpers/verifyEmail');

router.post('/registerUser', registerUser);
router.get("/verify-email",verifyEmail);

module.exports = router;