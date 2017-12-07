var people = []

function Person(username, msg, lat, lon) {
    this.username = username;
    this.msg = msg
    this.position = {'lat' : Number(lat),  'lon' : Number(lon)}

}

function FriendsList() {
    this.people
}

function addPerson(person){
    var p = new Person(person.username, person.msg, person.lat, person.lon); // here we create instance
    if (personExists(person))
        people.push(p);
}

function getPerson(username) {
    people.forEach(function (person, index) {
        if (person.username == username){
            return person
        }
    })
}

function personExists(p) {
    people.forEach(function (person, index) {
        if (person.username == p.username){
            return true
        }
    })
    return false
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