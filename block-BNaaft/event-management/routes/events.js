var express = require('express');
var router = express.Router();
var Event = require('../models/events');
var Remark = require('../models/remarks');

/* Adding a new Event */
router.get('/addEvent', function(req, res, next) {
  res.render('addEvent');
});
router.post('/', (req, res, next) => {
  req.body.event_category = req.body.event_category.trim().split(" ");
  Event.create(req.body, (err, event) => {
    if(err) return next(err);
    res.redirect('/events');
  });
});

/* Filters */
router.post('/filter', (req, res, next) => {
  if(req.body.filter==="oldest") {
    Event.find({}).sort({start_date : 1}).exec((err, events) =>{
      if(err) return next(err);
      res.render('events', {events});
    });
  }
  if(req.body.filter==="latest") {
    Event.find({}).sort({start_date : -1}).exec((err, events) =>{
      if(err) return next(err);
      res.render('events', {events});
    });
  }
  if(req.body.filter==="category") {
    Event.find({event_category: {$in: [req.body.value]}}, (err, events) => {
      if(err) return next(err);
      res.render('events', {events});
    });
  }
  if(req.body.filter==="location") {
    Event.find({location: {$in: [req.body.value]}}, (err, events) => {
      if(err) return next(err);
      res.render('events', {events});
    });   
  }
});
/* Filter by category */
router.get('/:category/filter', (req, res, next) => {
  let category = req.params.category;
  Event.find({event_category: {$in: [category]}}, (err, events) => {
    if(err) return next(err);
    res.render('events', {events}); 
  });
});

/*  Listing all the events */
router.get('/', function(req, res, next) {
  Event.find({}, (err, events) => {
    if(err) return next(err);
    res.render('events', { events });
  });
});

/* Get an event's detail */
router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Event.findById(id).populate('remarks').exec((err, event) => {
    if(err) return next(err);    
    res.render('eventDetails', { event });
  });
});

/* Edit an Event */
router.get('/:id/edit', (req, res) => {
  let id = req.params.id;
  Event.findById(id, (err, event) => {
    if(err) return next(err);
    res.render('editEvent', { event });
  });
});
router.post('/:id', (req, res) => {
  let id = req.params.id;
  req.body.event_category = req.body.event_category.trim().split(" "); 
  Event.findByIdAndUpdate(id, req.body, (err, updatedEvent) => {
    if(err) return next(err);
    res.redirect('/events/' + id);
  });
});

/* Delete an Event */
router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Event.findByIdAndDelete(id, (err, deletedEvent) => {
    if(err) return next(err);
    Remark.deleteMany({event: deletedEvent.id}, (err, deletedRemarks) => {
      if(err) return next(err);
      res.redirect('/events');
    });
  });
});

/* Like an Event */
router.get('/:id/like',(req, res, next) => {
  let id = req.params.id;
  Event.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, event) => {
    if(err) return next(err);
    res.redirect('/events/' + event.id);
  });
});

/* Dislike an Event */
router.get('/:id/dislike',(req, res) => {
  let id = req.params.id;
  Event.findByIdAndUpdate(id, {$inc: {likes: -1}}, (err, event) => {
    if(err) return next(err);
    res.redirect('/events/' + event.id);
  });
});

/* Add a Remark  */
router.post('/:id/remark', (req, res) => {
  let id = req.params.id;
  req.body.event = id;
  Remark.create(req.body, (err, remark) => {
    if(err) return next(err);
    Event.findByIdAndUpdate(id, {$push: {remarks: remark.id}}, (err, updatedRemark) => {
      if(err) return next(err);
      res.redirect('/events/' + id);
    });
  });
});



module.exports = router;
