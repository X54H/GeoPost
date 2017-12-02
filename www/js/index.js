/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

//TODO Aggiungere Scroll View
//TODO Modificare l'interfaccia grafica

function onLoad() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
}


function onDeviceReady() {
    this.receivedEvent('deviceready');
    document.addEventListener('pause', this.onPause.bind(this), false)
}


function onPause () {
        console.log("pausaaa")
    }

// Update DOM on a Received Event
function receivedEvent(id) {
    console.log(id);
    //TODO Bug doppio click da risolvere.
    $("#sub").one("click", function () {
        login()
    })
}


function login () {
    username = $("#inputUsername").val();
    password = $("#inputPassword").val();
    // var username = "giuse";
    // var password = "bigs123qwert";
    console.log(username);2
    console.log(password);
    $.ajax({
        type: "POST",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        url: "   https://ewserver.di.unimi.it/mobicomp/geopost/login",
        data: {
            'username': username,
            'password': password
        },
        error: function(xhr, textStatus, error){
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);

        },
        success: function(session_id){
            console.log(session_id);
            console.log(Singleton.getInstance().username);
            console.log(Singleton.getInstance().position);
            console.log(Singleton.getInstance().username = username);
            console.log(Singleton.getInstance().session_id = session_id);
            console.log(Singleton.getInstance().position = null);
            loadPeople();
        }
    });
}

function loadPeople() {
    $.ajax({
        url: "https://ewserver.di.unimi.it/mobicomp/geopost/followed?session_id=" + Singleton.getInstance().session_id,
        success: function (result) {
                var people = result.followed;
                showAmiciSeguitiScreen(people);
        }
    })
}


function showAmiciSeguitiScreen(people) {
    var riga = "";
    $("#back").hide();
    $("nav").show()
    $("#dynamicBody").load("html/followedFriends.html", function () {
        var a = '<a href="#" class="list-group-item list-group-item-action flex-column align-items-start">';
        var d = '<div class="d-flex w-100 justify-content-between">';
        people.forEach(function (person, index) {
            addPerson(person);
            riga += a + d;
            riga += '<h5 class="mb-1">' + person.username + '</h5>';
            riga += '</div>';
            if (person.msg != null) riga += '<p class="mb-1">' + person.msg + '</p>';
            riga += '<small style="position: absolute;\n' +
                'top: 12px;\n' +
                'right: 16px;">15 km</small>'
            riga += '</a>'

        })
        $(".list-group").html(riga);
        $("#mappa").hide();
        $("#bottone_lista").click(function() {
            $("#bottone_mappa").removeClass("btn-primary").addClass("btn-default");
            $("#bottone_lista").removeClass("btn-default").addClass("btn-primary");
            $("#mappa").hide();
            $("#lista").show();
        });
        $("#bottone_mappa").click(function() {
            $("#bottone_lista").removeClass("btn-primary").addClass("btn-default");
            $("#bottone_mappa").removeClass("btn-default").addClass("btn-primary");
            $("#lista").hide();
            $("#mappa").show();
            google.maps.event.trigger(map, 'resize');
        });
        initMap();
    })
}



function logout() {
    $.ajax({
        url: "https://ewserver.di.unimi.it/mobicomp/geopost/logout?session_id=" + Singleton.getInstance().session_id,
        success: function (result) {
            console.log("logout eseguito!");
            window.location.href = "index.html"
        }
    })
}


function postMessage() {
    $("#dynamicBody").load("html/postMessage.html", function () {
        $("#back").show();
        getMapLocation();
        $("#submitPost").click(function () {
            var msg = $("#post").val();
            $.ajax({
                url: "https://ewserver.di.unimi.it/mobicomp/geopost/status_update?session_id="
                + Singleton.getInstance().session_id + "&message=" + msg + "&lat=" + Singleton.getInstance().position.lat
                + "&lon=" + Singleton.getInstance().position.lon,

                success: function (result) {
                    console.log("Messaggio postato! with resul=" + result);
                    console.log(" " + msg)
                    Singleton.getInstance().msg = msg;
                    alert("Your state is updated! Thank you!")
                }
            })
        })
    })
}
