var mongoose = require('mongoose');

var StudentSchema = mongoose.Schema({
    fullname: {
        type: String
    },
    matic_no: {
        type: String
    },
    email: {
        type: String
    },
    department: {
        type: String
    },
    faculty: {
        type: String
    },
    age: {
        type: String
    },
    level: {
        type: String
    },
    profileImage: {
        type: String
    }
});

var Student = module.exports = mongoose.model('Student', StudentSchema);

module.exports.getStudentByFullname = function (fullname, callback) {
    var query = {fullname: fullname};
    Student.findOne(query, callback);
}

module.exports.getAllStudents = function (callback) {
    Student.find(callback);
}

module.exports.getStudentByEmail = function (email, callback) {
    var query = {email: email};
    Student.findOne(query, callback);
}
