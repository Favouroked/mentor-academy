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
    var cookieValue = $.cookie('email');
    $.removeCookie('email');
    $.getJSON('/students/showStudent/'+cookieValue, function(data){
        $('#level').val(data.level);
        $('#email').val(data.email);
        $('#department').val(data.department);
        $('#faculty').val(data.faculty);
        $('#fullname').val(data.fullname);
        $('#age').val(data.age);
    });

    $('.studentForm').submit(function (e) {
        e.preventDefault();
        var fullname = $('#fullname').val();
        var email = $('#email').val();
        var age = $('#age').val();
        var faculty = $('#faculty').val();
        var department = $('#department').val();
        var level = $('#level').val();
        console.log(fullname);
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
            url: '/students/showStudent/'+cookieValue+'/update',
            contentType: 'application/json',
            success: function (response) {
                alert(response);
                window.location.href = '/htmls/allStudents.html';
            }
        });
        return false;
    });
});