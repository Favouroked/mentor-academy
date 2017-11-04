$(document).ready(function () {
    allStudents();
});
$body = $("body");

$(document).on({
    ajaxStart: function () {
        $body.addClass("loading");
    },
    ajaxStop: function () {
        $body.removeClass("loading");
    }
});

function allStudents() {
    var theStudents = '';
    $.getJSON('/students/all', function (data) {
        $.each(data, function () {
            theStudents += '<tr>';
            theStudents += '<td>' + this.fullname + '</td>';
            theStudents += '<td class="studentEmail">' + this.email + '</td>';
            theStudents += '<td>' + this.age + '</td>';
            theStudents += '<td>' + this.faculty + '</td>';
            theStudents += '<td>' + this.department + '</td>';
            theStudents += '<td>' + this.level + '</td>';
            theStudents += '</tr>';
        });

        $('table tbody').html(theStudents);
        $('tbody tr').on('mouseover', function () {
            $(this).attr('title', "Click to view this student's profile");
        })
    });

}

function showProfile(mail) {
    var profile = '';
    $.getJSON('/students/showStudent/' + mail, function (data) {
        console.log(data);
        profile += '<div class="container">';
        profile += '<div class="row"><div class="col-sm-10"><h1>' + data.fullname + '</h1></div><div class="col-sm-2"><a href="#" class="pull-right"><img title="profile image" class="img-circle img-responsive" src="/images/' + data.profileImage + '"></a></div></div>';
        profile += '<ul class="list-group">';
        profile += '<li class="list-group-item text-muted">Profile</li>';
        profile += '<li class="list-group-item text-right"><span class="pull-left"><strong>Email</strong></span><span class="the-email">' + data.email + '</span></li>';
        profile += '<li class="list-group-item text-right"><span class="pull-left"><strong>Faculty</strong></span>' + data.faculty + '</li>';
        profile += '<li class="list-group-item text-right"><span class="pull-left"><strong>Department</strong></span>' + data.department + '</li>';
        profile += '<li class="list-group-item text-right"><span class="pull-left"><strong>Level</strong></span>' + data.level + '</li></ul>';
        profile += '<button class="reload btn btn-default">Back to All Students</button>';
        profile += '<button class="delete btn btn-danger">Delete Student</button>';
        profile += '<a href="/htmls/updateStudent.html" class="update text-right">Update</a>';
        console.log(profile);
        $('.profileDiv').html(profile);
    });
    console.log(profile);
}

function deleteStudent(email) {
    $.ajax({
        type: 'GET',
        url: '/students/showStudent/' + email + '/delete',
        success: function (response) {
            alert(response);
            location.reload();
        }
    });
}

$(document).on('click', 'tbody tr', function () {
    var email = $(this).find('.studentEmail').html();
    showProfile(email);

});
$(document).on('click', '.reload', function () {
    location.reload();
});
$(document).on('click', '.delete', function () {
    var wanna_delete = $('.list-group').find('.the-email').html();
    deleteStudent(wanna_delete);
});
$(document).on('click', '.update', function () {
    var the_email = $('.list-group').find('.the-email').html();
    $.cookie('email', the_email, {expires: 7, path: '/'});
    return true;
});