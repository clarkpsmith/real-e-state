const express = require('express');
const meeting = require('./meeting');
const auth = require('../../middelwares/auth');

const router = express.Router();

router.get('/', auth, meeting.index);
router.get('/view/:id', auth, meeting.view);
router.post('/add', auth, meeting.add);
router.put('/edit/:id', auth, meeting.edit);
router.delete('/delete/:id', auth, meeting.deleteField);
router.post('/deleteMany', auth,  meeting.deleteManyField);

module.exports = router