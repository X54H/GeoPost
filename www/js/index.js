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

// TODO Sistemare logout
//

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
    $("#sub").click(function () {
        login()
    })
}


function login () {
    // username = $("#inputUsername").val();
    // password = $("#inputPassword").val();
    var username = "giuse";
    var password = "bigs123qwert";
    console.log(username);2
    console.log(password);
    //TODO gestire gli errori login
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
            SingletonUser.getInstance().session_id = session_id
            loadFriends();
        }
    });
}

function loadFriends() {
    $.ajax({
        url: "https://ewserver.di.unimi.it/mobicomp/geopost/followed?session_id=" + SingletonUser.getInstance()
            .session_id,
        success: function (result) {
                var people = result.followed;
                people.forEach(function (person) {
                    SingletonFriendsList.getInstance().addFriend(person);
                })
                showAmiciSeguitiScreen();
        }
    })
}


function showAmiciSeguitiScreen() {
    var riga = "";
    $("#back").hide();
    $("nav").show()
    $("#dynamicBody").load("html/followedFriends.html", function () {
        var a = '<a href="#" class="list-group-item list-group-item-action flex-column align-items-start">';
        var d = '<div class="d-flex w-100 justify-content-between">';
        SingletonFriendsList.getInstance().getFriendsList().forEach(function (person) {
            riga += a + d;
            riga += '<h5 class="mb-1">' + person.username + '</h5>';
            riga += '</div>';
            if (person.status != null) riga += '<p class="mb-1">' + person.status + '</p>';
            riga += '<small style="position: absolute;\n' +
                'top: 12px;\n' +
                'right: 16px;">15 km</small>'
            riga += '</a>'

        })
        $(".list-group").html(riga);

        $("#mappa").hide();
        $("#bottone_lista").click(function() {
            $("#mappa").hide();
            $("#lista").show();
        });
        $("#bottone_mappa").click(function() {
            $("#lista").hide();
            $("#mappa").show();
            google.maps.event.trigger(map, 'resize');
        });
        // getMapLocation();
        initMap();
    })
}



function logout() {
    $.ajax({
        url: "https://ewserver.di.unimi.it/mobicomp/geopost/logout?session_id=" + SingletonUser.getInstance().session_id,
        success: function (result) {
            console.log("logout eseguito!");
            window.location.href = "index.html"
        }
    })
}


function postMessage() {
    $("#dynamicBody").load("html/postMessage.html", function () {
        $("#back").show();
        $("#bottone_mappa").hide()
        $("#submitPost").click(function () {
            var msg = $("#post").val();
            $.ajax({
                url: "https://ewserver.di.unimi.it/mobicomp/geopost/status_update?session_id="
                + SingletonU.getInstance().session_id + "&message=" + msg + "&lat=" + Singleton.getInstance().position.lat
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

function followFriend() {
    $("#back").show();
    $("#dynamicBody").load("html/followFriend.html",
        function () {
            $("#followFriend").click(
                function () {
                    var name = $("#inputFriend").val();
                    console.log(name);
                    $.ajax({
                        url: 'https://ewserver.di.unimi.it/mobicomp/geopost/follow?session_id='
                        + SingletonUser.getInstance().session_id + '&username=' + name,

                        success: function (result) {
                            console.log(result);
                        },

                        error: function(xhr, status, error) {
                            alert(xhr.responseText);
                        }
                    })
                }
            )
        }
    );
}

// https://ewserver.di.unimi.it/mobicomp/geopost/follow?session_id= *&username=*