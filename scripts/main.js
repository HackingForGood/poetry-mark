
function PoetryMark() {
  this.checkSetup();

  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');
  this.poemCards = document.getElementById('poem-body');
  

  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));

  this.initFirebase();
  this.addPoem(this.poemCards, 1);
  this.addPoem(this.poemCards, 2);
}

PoetryMark.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Signs-in Friendly Chat.
PoetryMark.prototype.signIn = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

// Signs-out of Friendly Chat.
PoetryMark.prototype.signOut = function() {
  // Sign out of Firebase.
  this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
PoetryMark.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    var profilePicUrl = user.photoURL; // Only change these two lines!
    var userName = user.displayName;   // Only change these two lines!

    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    this.signInButton.setAttribute('hidden', 'true');

  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    this.signInButton.removeAttribute('hidden');
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
PoetryMark.prototype.checkSignedInWithMessage = function() {
  // Return true if the user is signed in Firebase
  if (this.auth.currentUser) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};

PoetryMark.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
};

PoetryMark.prototype.addPoem = function(poemContainer, poemId) {
  var poemElement = document.createElement("div");
  poemElement.id = "poem-card";
  this.loadPoem(poemElement, poemId);
  
  poemContainer.appendChild(poemElement);
}

PoetryMark.prototype.loadPoem = function(poemDiv, poemId) {
  var poemElement = poemDiv;

  return this.database.ref('/poems/' + poemId).once('value').then(function(snapshot) {
    var poet = document.createElement("p");
    poet.appendChild(document.createTextNode(snapshot.val().poet));

    var title = document.createElement("p");
    title.appendChild(document.createTextNode(snapshot.val().title));

    var poem = document.createElement("p");
    var p = snapshot.val().poem.replace(/\n/g, "<br />");
    poem.innerHTML = p;

    var starContainer = document.createElement("p");
    var star = document.createElement("favorite-star");
    starContainer.appendChild(star);

    poem.id = "poem";
    poet.id = "poet";
    title.id = "title";

    poemElement.appendChild(title);
    poemElement.appendChild(poet);
    poemElement.appendChild(poem);
    poemElement.appendChild(starContainer);
});
}

 window.onload = function() {
  window.poetryMark = new PoetryMark();
};