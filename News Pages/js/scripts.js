/*!
* Start Bootstrap - Small Business v5.0.4 (https://startbootstrap.com/template/small-business)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-small-business/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project


var currentUser;
firebase.auth().onAuthStateChanged(user => {
    if (user){
        currentUser = db.collection("users").doc(user.uid);
        console.log(currentUser);
        insertName(); // Calls the users name from firebase
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        window.location.href = "login.html";
    }
})


//--------------------------------------------------------------------------
// This is a function that gets called everytime the page loads.
// It is meant to get the name of the user who is logged in, and insert it
// on the page for a warm welcome.
//--------------------------------------------------------------------------
function insertName() {
    //To check if the user is logged in
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); //let me knwo who is the user that logged in to get the UID
            currentUser = db.collection("users").doc(user.uid); //will go to the firestore and go to the document of the user
            currentUser.get().then(userDoc => {
                //get the user Name
                var user_Name = userDoc.data().name;
                console.log(user_Name);
                document.getElementById("name-goes-here").innerHTML = user_Name;
            })
        }
    })
}

function writeHikes() {
    //define a variable for the collection you want to create in Firestore to populate data
    var hikesRef = db.collection("Hikes");

    hikesRef.add({
        id: "BBY01",
        name: "Burnaby Lake Park Trail", //replace with your own city?
        city: "Burnaby",
        province: "BC",
        level: "easy",
        length: 10, //number value
        length_time: 60, //number value
        last_updated: firebase.firestore.FieldValue.serverTimestamp() //current system time
    });
    hikesRef.add({
        id: "AM01",
        name: "Buntzen Lake Trail", //replace with your own city?
        city: "Anmore",
        province: "BC",
        level: "moderate",
        length: 10.5, //number value
        length_time: 80, //number value
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("March 10, 2022"))
    });
    hikesRef.add({
        id: "NV01",
        name: "Mount Seymour Trail", //replace with your own city?
        city: "North Vancouver",
        province: "BC",
        level: "hard",
        length: 8.2, //number value
        length_time: 120, //number value
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2022"))
    });
}


function populateCardsDynamically() {
    let hikeCardTemplate = document.getElementById("hikeCardTemplate");
    let hikeCardGroup = document.getElementById("hikeCardGroup");

    db.collection("Hikes")
    .orderBy("length_time")
    .limit(2)
    .get()
        .then(allHikes => {
            allHikes.forEach(doc => {
                var hikeName = doc.data().name; //gets the name field
                var hikeID = doc.data().id; //gets the unique ID field
                var hikeLength = doc.data().length; //gets the length field
                let testHikeCard = hikeCardTemplate.content.cloneNode(true);
                testHikeCard.querySelector('.card-title').innerHTML = hikeName;

                //testHikeCard.querySelector('.card-length').innerHTML = hikeLength;
                //NEW LINE: update to display length, duration, last updated
                testHikeCard.querySelector('.card-length').innerHTML =
                    "Length: " + doc.data().length + " km <br>" +
                    "Duration: " + doc.data().length_time + "min <br>" +
                    "Last updated: " + doc.data().last_updated.toDate();

                testHikeCard.querySelector('a').onclick = () => setHikeData(hikeID);
                testHikeCard.querySelector('img').src = `./images/${hikeID}.jpg`;

                testHikeCard.querySelector('.read-more').href = "eachHike.html?hikeName="+hikeName +"&id=" + hikeID;

                testHikeCard.querySelector('i').id = 'save-' + hikeID;
                testHikeCard.querySelector('i').onclick = () => saveBookmark(hikeID);

                hikeCardGroup.appendChild(testHikeCard);
            })

        })
}

function saveBookmark(hikeID){
    currentUser.set({
        bookmarks: firebase.firestore.FieldValue.arrayUnion(hikeID)
    }, {
        merge: true
    })
    .then(function(){
        console.log("bookmark has been saved for: " + currentUser);
        var iconID = 'save-' +hikeID;
        // console.log(iconID);
        document.getElementById(iconID).innerText = 'bookmark';
    })
}
