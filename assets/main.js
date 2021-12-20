const state = {
	user: null,
	question: 0,
	gameIsPlaying: false,
	modalMessage: ""
};
// RENDER FUNCTIONS

function renderHeader() {
	const headerEl = document.createElement("header");

	const currentScoreEl = document.createElement("span");
	currentScoreEl.textContent = `Current Score: 0`;

	const h1El = document.createElement("h1");
	h1El.textContent = "Who wants to be a GeRinnionaire";

	const navEl = document.createElement("nav");
	const statsAEl = document.createElement("a");
	const leaderboardA = document.createElement("a");
	statsAEl.textContent = "My Stats";
	leaderboardA.textContent = "Leaderboard";

	navEl.append(statsAEl, leaderboardA);

	headerEl.append(currentScoreEl, h1El, navEl);

	if (state.user === null || !state.gameIsPlaying) {
		navEl.style.visibility = "hidden";
	}
	if (!state.gameIsPlaying) {
		currentScoreEl.style.visibility = "hidden";
	}
	document.body.append(headerEl);
}

function renderMain() {
	const mainEl = document.createElement("main");

	if (state.user === null) {
		mainEl.setAttribute("class", "landing-main");
		renderSignIn(mainEl);
		renderSignUp(mainEl);
	}

	document.body.append(mainEl);
}

function renderSignIn(mainEl) {
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

	signInSection.append(signInH2, signInForm);
	signInForm.append(signInUsernameLabel, signInPasswordLabel, signInButton);
	signInUsernameLabel.append(signInUsernameInput);
	signInPasswordLabel.append(signInPasswordInput);

	signInForm.addEventListener("submit", (event) => {
		event.preventDefault();
		signIn(signInUsernameInput.value, signInPasswordInput.value);
	});

	mainEl.append(signInSection);
}
function renderSignUp(mainEl) {
	const signUpSection = document.createElement("section");
	signUpSection.setAttribute("class", "sign-up");

	const signUpTitle = document.createElement("h2");
	signUpTitle.textContent = "or Create an Account";

	const signUpForm = document.createElement("form");
	signUpForm.addEventListener("submit", (e) => {
		e.preventDefault();
		let user = {
			id: signUpUserInput.value,
			password: signUpPasswordInput.value,
			scores: []
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
	mainEl.append(signUpSection);
}
function renderModal() {
	console.log("");
	if (state.modalMessage !== "") {
		const modalWrapper = document.createElement("section");
		modalWrapper.setAttribute("class", "modal-wrapper");
		const modal = document.createElement("div");
		modal.setAttribute("class", "modal");
		h2El = document.createElement("h2");
		h2El.textContent = state.modalMessage;
		const okButton = document.createElement("button");
		okButton.setAttribute("class", "ok-button");
		okButton.textContent = "OK";
		okButton.addEventListener("click", () => {
			state.modalMessage = "";
			render();
		});
		const modalCloseBtn = document.createElement("button");
		modalCloseBtn.textContent = "X";
		modalCloseBtn.setAttribute("class", "close-modal-btn");
		modalCloseBtn.addEventListener("click", () => {
			state.modalMessage = "";
			render();
		});
		modal.append(h2El, okButton, modalCloseBtn);
		modalWrapper.append(modal);
		document.body.append(modalWrapper);
	}
}

function render() {
	document.body.innerHTML = "";
	renderHeader();
	renderMain();
	renderModal();
}
// SERVER FUNCTIONS
function signIn(username, password) {
	return fetch(`http://localhost:3000/users/${username}`)
		.then(function (resp) {
			return resp.json();
		})
		.then(function (user) {
			if (user.password === password) {
				state.modalMessage = "Welcome";
				state.user = user;
				render();
			} else {
				state.modalMessage = "Wrong username/password. Please try again.";
				render();
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
			state.modalMessage = "Welcome";
			render();
		} else {
			state.modalMessage = "This username already exists.";
			render();
		}
	});
}
function createNewUserOnServer(user) {
	fetch("http://localhost:3000/users/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(user)
	});
}
render();
