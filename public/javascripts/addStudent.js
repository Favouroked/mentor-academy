$body = $("body");

$(document).on({
    ajaxStart: function () {
        $body.addClass("loading");
    },
    ajaxStop: function () {
        $body.removeClass("loading");
    }
});
$(document).ready(function() {
    $('.addStudentForm').submit(function (e) {
        e.preventDefault();
        var fullname = $('#fullname').val();
        var email = $('#email').val();
        var age = $('#age').val();
        var faculty = $('#faculty').val();
        var department = $('#department').val();
        var level = $('#level').val();
        $(this).ajaxSubmit({
            data: {
                fullname: fullname,
                email: email,
                age: age,
                faculty: faculty,
                department: department,
                level: level
            },
            type: 'post',
            url: '/students/add',
            contentType: 'application/json',
            success: function (response) {
                alert(response);
                window.location.href = '/htmls/allStudents.html';
            }
        });
    });
});