let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let remarkSchema = new Schema({
    title: String,
    author: String,
    likes: {type: Number, default: 0},
    event: {type: Schema.Types.ObjectId, ref: 'Event'}
}, {timestamps: true});

let Remark = mongoose.model('Remark', remarkSchema);
module.exports = Remark;
