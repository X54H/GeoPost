var people = []

function Person(username, msg, lat, lon) {
    this.username = username;
    this.msg = msg
    this.position = {'lat' : Number(lat),  'lon' : Number(lon)}
}


function addPerson(person){
    var p = new Person(person.username, person.msg, person.lat, person.lon); // here we create instance
    people.push(p);
}

var Singleton = (function () {
    var instance;

    function createInstance(username, session_id, position) {
        return Object.create(Person);

    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();