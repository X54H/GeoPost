$(document).ready(function () {

    $("#sub").click(function () {
        username = $("#inputUsername").val();
        password = $("#inputPassword").val();
        $.ajax({
            type: "POST",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            url: "   https://ewserver.di.unimi.it/mobicomp/geopost/login",
            data: {
                'username': username,
                'password': password
            },
            success: function(msg){
                session_id = msg
                output = ""
                $(".container").load("amiciSeguiti.html", function () {
                    $.ajax({
                        url: "https://ewserver.di.unimi.it/mobicomp/geopost/followed?session_id=" + session_id,
                        success: function (result) {
                            result.followed.forEach(function (item, index) {
                                output += "<li>"+ item.username +"</li>";
                            })
                            $("#list").html(output)
                        }
                    })
                })
            }
        });
    })
})


