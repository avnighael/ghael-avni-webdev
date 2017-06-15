var mongoose = require('mongoose');

var donationSchema  = mongoose.Schema({
    _user: {type: mongoose.Schema.Types.ObjectId, ref: 'userModel'},
    _project:{type: mongoose.Schema.Types.ObjectId, ref: 'projectModel'},
    donated: Number
}, {
    collection: "donation",
    timestamps: true
});

module.exports = donationSchema;