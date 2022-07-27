const express = require('express');
const Controller = require('../Controllers/general');
const router = express.Router();
router.post('/signup', Controller.postSignup);
router.post('/signin', Controller.postSignin);
router.post('/message', Controller.authenticate, Controller.postMessage)
router.get('/messages', Controller.getMessages)

router.get('/getGroupMessages/:gid/:lid', Controller.getGroupMessages)
router.post('/postGroupMessage/:gid', Controller.authenticate, Controller.postGroupMessage)

router.post('/addUser',Controller.addUser)
router.post('/postGroup',Controller.authenticate, Controller.postGroup)
router.get('/getGroupsOfaUser',Controller.authenticate, Controller.getGroupsOfaUser)


router.post('/MakeAsAdmin',Controller.authenticate,Controller.MakeAsAdmin)
router.post('/removeUser',Controller.authenticate,Controller.removeUser)
module.exports = router;
