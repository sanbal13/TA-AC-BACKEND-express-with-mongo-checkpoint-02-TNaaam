var express = require('express');
var router = express.Router();
var Remark = require('../models/remarks');
var Event = require('../models/events');

/* Edit a Remark */
router.get('/:id/edit', (req, res) => {
  let id = req.params.id;
  Remark.findById(id, (err, remark) => {
    if(err) return next(err);
    res.render('editRemark', { remark });
  });
});
router.post('/:id', (req, res) => {
  let id = req.params.id;
  Remark.findByIdAndUpdate(id, req.body, (err, updatedRemark) => {
    if(err) return next(err);
    res.redirect('/events/' + updatedRemark.event);
  });
});

/* Delete a Remark */
router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Remark.findByIdAndDelete(id, (err, deletedRemark) => {
    if(err) return next(err);
    Event.findByIdAndUpdate(deletedRemark.event, {$pull: {remarks: id}}, (err, event) => {
      if(err) return next(err);
      res.redirect('/events/' + event.id);
    });
  });
});

/* Like a Remark */
router.get('/:id/like',(req, res, next) => {
  let id = req.params.id;
  Remark.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, remark) => {
    if(err) return next(err);
    res.redirect('/events/' + remark.event);
  });
});

/* Dislike a Remark */
router.get('/:id/dislike',(req, res) => {
  let id = req.params.id;
  Remark.findByIdAndUpdate(id, {$inc: {likes: -1}}, (err, remark) => {
    if(err) return next(err);
    res.redirect('/events/' + remark.event);
  });
});


module.exports = router;