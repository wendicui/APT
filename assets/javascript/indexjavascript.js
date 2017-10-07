$(document).ready(function(){
    function firstsearch() {
        window.location.href = "search.html";
    }
    $("#firstsearch").click(firstsearch);

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBrzI7gkNYK7muMbNF6R8TCmVqmDMFbZLA",
    authDomain: "projectone-21906.firebaseapp.com",
    databaseURL: "https://projectone-21906.firebaseio.com",
    projectId: "projectone-21906",
    storageBucket: "projectone-21906.appspot.com",
    messagingSenderId: "934410089770"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var name = "";
});
