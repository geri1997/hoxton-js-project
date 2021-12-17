const state = {
  user: null,
  question: 0,
};
// RENDER FUNCTIONS
function renderLandingPage() {
  const headerEl = document.createElement("header");
  headerEl.setAttribute("class", "landing-header");

  const h1El = document.createElement("h1");
  h1El.textContent = "Who wants to be a GeRinnionaire";

  const mainEl = document.createElement("main");
  mainEl.setAttribute("class", "landing-main");

  const signInSection = document.createElement("section");
  signInSection.setAttribute("class", "sign-in");

  const signInH2 = document.createElement("h2");
  signInH2.textContent = "Sign In";
  const signInForm = document.createElement("form");

  const signInUsernameLabel = document.createElement("label");
  signInUsernameLabel.setAttribute("class", "sign-in-label");
  signInUsernameLabel.textContent = "Username: ";
  const signInUsernameInput = document.createElement("input");
  signInUsernameInput.setAttribute("class", "sign-in-input");
  signInUsernameInput.setAttribute("type", "text");
  signInUsernameInput.setAttribute("required", "");
  signInUsernameInput.setAttribute("placeholder", "Type your username...");

  const signInPasswordLabel = document.createElement("label");
  signInPasswordLabel.setAttribute("class", "sign-in-label");
  signInPasswordLabel.textContent = "Password: ";
  const signInPasswordInput = document.createElement("input");
  signInPasswordInput.setAttribute("class", "sign-in-input");
  signInPasswordInput.setAttribute("type", "password");
  signInPasswordInput.setAttribute("required", "");
  signInPasswordInput.setAttribute("placeholder", "Type your password...");

  const signInButton = document.createElement("button");
  signInButton.textContent = "Sign In";
  signInButton.setAttribute("class", "cta");

  const signUpSection = document.createElement("section");
  signUpSection.setAttribute("class", "sign-up");

  signInForm.addEventListener("submit", (event) => {
    event.preventDefault();
    signIn(signInUsernameInput.value, signInPasswordInput.value);
  });

  const signUpTitle = document.createElement("h2");
  signUpTitle.textContent = "or Create an Account";

  const signUpForm = document.createElement("form");
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let user = {
      id: signUpUserInput.value,
      password: signUpPasswordInput.value,
      scores: [],
    };
    signUp(user);
  });

  signUpUserLabel = document.createElement("label");
  signUpUserLabel.setAttribute("class", "sign-up-label");
  signUpUserLabel.textContent = "Username: ";
  const signUpUserInput = document.createElement("input");
  signUpUserInput.setAttribute("class", "sign-up-input");
  signUpUserInput.type = "text";
  signUpUserInput.required = true;
  signUpUserInput.placeholder = "Type your username...";
  signUpUserLabel.append(signUpUserInput);

  signUpPasswordLabel = document.createElement("label");
  signUpPasswordLabel.setAttribute("class", "sign-up-label");
  signUpPasswordLabel.textContent = "Password: ";
  const signUpPasswordInput = document.createElement("input");
  signUpPasswordInput.setAttribute("class", "sign-up-input");
  signUpPasswordInput.type = "password";
  signUpPasswordInput.required = true;
  signUpPasswordInput.placeholder = "Type your password...";
  signUpPasswordLabel.append(signUpPasswordInput);

  const signUpButton = document.createElement("button");
  signUpButton.setAttribute("class", "cta");
  signUpButton.textContent = "Sign Up";

  signUpForm.append(signUpUserLabel, signUpPasswordLabel, signUpButton);

  signUpSection.append(signUpTitle, signUpForm);

  document.body.append(headerEl, mainEl);
  headerEl.append(h1El);
  mainEl.append(signInSection, signUpSection);
  signInSection.append(signInH2, signInForm);
  signInForm.append(signInUsernameLabel, signInPasswordLabel, signInButton);
  signInUsernameLabel.append(signInUsernameInput);
  signInPasswordLabel.append(signInPasswordInput);
}

function render() {
  if (state.user === null) {
    renderLandingPage();
  }
}
// SERVER FUNCTIONS
function signIn(username, password) {
  return fetch(`http://localhost:3000/users/${username}`)
    .then(function (resp) {
      return resp.json();
    })
    .then(function (user) {
      if (user.password === password) {
        alert("Welcome");
        state.user = user;
        render();
      } else {
        alert("Wrong username/password. Please try again.");
      }
    });
}

function signUp(user) {
  fetch(`http://localhost:3000/users/${user.id}`).then((resp) => {
    console.log(user.id);
    console.log(resp.ok);
    if (!resp.ok) {
      state.user = user;
      createNewUserOnServer(user);
    } else {
      alert("This username already exists.");
    }
  });
}
function createNewUserOnServer(user) {
  fetch("http://localhost:3000/users/",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
}
render();
