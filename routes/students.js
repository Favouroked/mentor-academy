var express = require('express');
var router = express.Router();
var multer = require('multer');
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
    var fullname = req.body.fullname;
    var email = req.body.email;
    var age = req.body.age;
    var faculty = req.body.faculty;
    var department = req.body.department;
    var level = req.body.level;
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
    var email = req.params.email;
    var profileimage;
    Student.getStudentByEmail(email, function (err, student) {
        if (err) {
            res.status(500).send(err);
        } else {
            if (req.file) {
                profileimage = req.file.filename;
                upload(req, res, function (err) {
                    if (err) {
                        req.flash("An error occured while uploading");
                        // res.redirect('/students/add');
                    }
                    console.log("Image uploaded");
                });
                student.fullname = req.body.fullname || student.fullname;
                student.email = req.body.email || student.email;
                student.faculty = req.body.faculty || student.faculty;
                student.department = req.body.department || student.department;
                student.level = req.body.level || student.level;
                student.age = req.body.age || student.age;
                student.profileImage = profileimage || student.profileImage;

                student.save(function (err, student) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.send("Student resource updated");
                    }
                });
            } else {
                student.fullname = req.body.fullname[0] || student.fullname;
                student.email = req.body.email[0] || student.email;
                student.faculty = req.body.faculty[0] || student.faculty;
                student.department = req.body.department[0] || student.department;
                student.level = req.body.level[0] || student.level;
                student.age = req.body.age[0] || student.age;
                student.profileImage = student.profileImage;

                student.save(function (err, student) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.send("Student resource updated");
                    }
                });
            }

        }
    });
});

router.get('/showStudent/:email/delete', function (req, res) {
    var email = req.params.email;
    Student.getStudentByEmail(email, function (err, student) {
        if (err) throw err;
        student.remove();
        res.send('Student deleted');
    });
});


module.exports = router;
