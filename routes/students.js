var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var Student = require('../models/student');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        var file_name = file.fieldname + '-' + Date.now() + '.jpg';
        cb(null, file_name);
    }
});

var upload = multer({storage: storage}).single('profileImage');

router.post('/add', upload, function (req, res) {
    var fullname = req.body.fullname[0];
    var email = req.body.email[0];
    var age = req.body.age[0];
    var faculty = req.body.faculty[0];
    var department = req.body.department[0];
    var level = req.body.level[0];
    console.log(fullname);
    console.log(email);
    var profileimage;

    if (req.file) {
        profileimage = req.file.filename;
        upload(req, res, function (err) {
            if (err) throw err;

            console.log("Image uploaded");
        });
    } else {
        profileimage = "noimage.jpg";
    }
    var newStudent = new Student({
        fullname: fullname,
        email: email,
        age: age,
        department: department,
        faculty: faculty,
        level: level,
        profileImage: profileimage
    });
    newStudent.save(function (err, student) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send("Student added");
        }
    });
});

router.get('/showStudent/:email', function (req, res) {
    var email = req.params.email;
    Student.getStudentByEmail(email, function (err, student) {
        if (err) throw err;
        res.json(student);
    });
});

router.get('/all', function (req, res) {
    Student.getAllStudents(function (err, students) {
        if (err) throw err;
        res.json(students);
    });
});


router.post('/showStudent/:email/update', upload, function (req, res) {
    var dir = __dirname;
    var dirname = dir.replace('routes', 'public');
    var reqemail = req.params.email;
    var fullname = req.body.fullname[0];
    var email = req.body.email[0];
    var faculty = req.body.faculty[0];
    var department = req.body.department[0];
    var level = req.body.level[0];
    var age = req.body.age[0];
    var profileimage;
    var oldProfileImage;
    Student.getStudentByEmail(reqemail, function (err, student) {
        if (err) {
            res.status(500).send(err);
        }
        if (req.file) {
            profileimage = req.file.filename;
            upload(req, res, function (err) {
                if (err) {
                    req.flash("An error occured while uploading");
                }
                console.log("Image uploaded");
            });
            oldProfileImage = student.profileImage;
            fs.unlink(dirname + '/images/' + oldProfileImage);
        }
        student.fullname = fullname || student.fullname;
        student.email = email || student.email;
        student.faculty = faculty || student.faculty;
        student.department = department || student.department;
        student.level = level || student.level;
        student.age = age || student.age;
        student.profileImage = profileimage || student.profileImage;
        student.save(function (err, student) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send("Student resource updated with image");
            }
        });

    });
});

router.get('/showStudent/:email/delete', function (req, res) {
    var dir = __dirname;
    var dirname = dir.replace('routes', 'public');
    var email = req.params.email;
    var oldprofileImage;
    Student.getStudentByEmail(email, function (err, student) {
        if (err) throw err;
        oldprofileImage = student.profileImage;
        fs.unlink(dirname + '/images/' + oldprofileImage);
        student.remove();
        res.send('Student deleted');
    });
});


module.exports = router;
