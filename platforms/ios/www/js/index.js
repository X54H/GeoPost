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

    var sd = ""
    // Application Constructor
    function onLoad() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    }

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    function onDeviceReady() {
        this.receivedEvent('deviceready');
        document.addEventListener('pause', this.onPause.bind(this), false)

    }

    function onPause () {
        console.log("pausaaa")
    }


    // Update DOM on a Received Event
    function receivedEvent(id) {
        $("#sub").click(function () {
            login()
        })
    }

function login () {
    // username = $("#inputUsername").val();
    // password = $("#inputPassword").val();
    username = "giuse";
    password = "bigs123qwert";
    console.log(username)
    console.log(password)
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
            sd = session_id
            console.log(session_id);
        output = ""
            $.ajax({
                url: "https://ewserver.di.unimi.it/mobicomp/geopost/followed?session_id=" + session_id,
                success: function (result) {
                    result.followed.forEach(function (item, index) {
                        this.output += "<li class=\"list-group-item\">"+ item.username +"</li>";
                    })
                    followedFriends(output)
                }
            })
        }
    });
}

function followedFriends(output) {
    $("nav").show()
    $("#dynamicBody").load("followedFriends.html", function () {
        $("#mappa").hide();
        $("#amici").html(output);

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
        $.getScript( "https://maps.googleapis.com/maps/api/js?key=AIzaSyBZZtpQ-rvXhNSqPEgc8957A07yL11Ya4w&callback=initMap",
            function () {
                initMap();
            });

    })
}

function initMap() {

    var uluru = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
}

function logout() {
    $.ajax({
        url: "https://ewserver.di.unimi.it/mobicomp/geopost/logout?session_id=" + sd,
        success: function (result) {
            console.log("logout eseguito!");
            window.location.href = "index.html"
        }
    })
    
}

//     <h1>Apache Cordova</h1>
// <div id="deviceready" class="blink">
//     <p class="event listening">Connecting to Device</p>
// <p class="event received">Device is Ready</p>
// </div>