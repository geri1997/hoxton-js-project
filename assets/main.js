const state = {
	user: {
		id: "test",
		password: "test123",
		scores: []
	},
	questions: [],
	question: 0,
	gameHasStarted: false,
	questionAnswered: false,
	gameLost: false,
	modalMessage: "",
	allCategories: [
		{ name: "All Categories", id: "" },
		{ name: "General Knowledge", id: 9 },
		{ name: "Television", id: 14 },
		{ name: "Geography", id: 22 },
		{ name: "Sports", id: 21 },
		{ name: "Film", id: 11 },
		{ name: "Science and Nature", id: 17 },
		{ name: "History", id: 23 }
	],
	selectedCategory: { name: "All Categories", id: "" },
	selectedDifficulty: "easy"
};

//HELPER FUNCTIONS
// function getShuffledAnswers() {
// 	const shuffledAnswers = [...state.questions[state.question].incorrect_answers];
// 	shuffledAnswers.push(state.questions[state.question].correct_answer);
// 	shuffledAnswers.sort(() => Math.random() - 0.5);
// 	return shuffledAnswers;
// }
// // RENDER FUNCTIONS

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

	if (state.user === null || state.gameHasStarted) {
		navEl.style.visibility = "hidden";
	}
	if (!state.gameHasStarted) {
		currentScoreEl.style.visibility = "hidden";
	}
	document.body.append(headerEl);
}

function renderMain() {
	const mainEl = document.createElement("main");

	if (state.user === null) {
		renderSignIn(mainEl);
		renderSignUp(mainEl);
	} else if (!state.gameHasStarted) {
		mainEl.setAttribute("class", "menu-main");
		renderGameMenu(mainEl);
	} else {
		mainEl.setAttribute("class", "game-main");
		renderGame(mainEl);
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
function renderGameMenu(mainEl) {
	const difficultyLabel = document.createElement("label");
	difficultyLabel.textContent = "Difficulty: ";
	const selectEl = document.createElement("select");
	const easyOption = document.createElement("option");
	easyOption.value = "easy";
	easyOption.textContent = "Easy";
	const mediumOption = document.createElement("option");
	mediumOption.value = "medium";
	mediumOption.textContent = "Medium";
	const hardOption = document.createElement("option");
	hardOption.value = "hard";
	hardOption.textContent = "Hard";

	const startGameBtn = document.createElement("button");
	startGameBtn.setAttribute("class", "start-btn");
	startGameBtn.textContent = "START GAME";
	selectEl.addEventListener("change", (e) => {
		state.selectedDifficulty = selectEl.value;

		render();
	});

	startGameBtn.addEventListener("click", () => {
		getQuestions().then((questions) => {
			state.questions = questions;
			state.questions.forEach((question) => {
				const shuffledAnswers = [...question.incorrect_answers];
				shuffledAnswers.push(question.correct_answer);
				shuffledAnswers.sort(() => Math.random() - 0.5);
				question.shuffledAnswers = shuffledAnswers;
			});
			state.gameHasStarted = true;
			render();
		});
	});
	difficultyLabel.append(selectEl);
	selectEl.append(easyOption, mediumOption, hardOption);
	selectEl.value = state.selectedDifficulty;

	const categoriesDiv = document.createElement("div");
	categoriesDiv.setAttribute("class", "categories");
	for (const category of state.allCategories) {
		const categoryBtn = document.createElement("button");
		categoryBtn.setAttribute("class", "category");

		if (category.name === state.selectedCategory.name) {
			categoryBtn.classList.add("active");
		}
		categoryBtn.textContent = category.name;
		categoryBtn.addEventListener("click", () => {
			state.selectedCategory = category;
			render();
		});
		categoriesDiv.append(categoryBtn);
	}

	mainEl.append(difficultyLabel, categoriesDiv, startGameBtn);
}
/* <div class="question">
				<h2>random question nr 1</h2>
			</div>
			<section class="answers">
				<button class="answer">answer1</button>
				<button class="answer">answer1</button>
				<button class="answer">answer1</button>
				<button class="answer">answer1</button> 
        </section>*/

function renderGame(mainEl) {
	const questionDiv = document.createElement("div");
	questionDiv.setAttribute("class", "question");
	const questionH2 = document.createElement("h2");
	questionH2.innerHTML = state.questions[state.question].question;

	const answersSection = document.createElement("section");
	answersSection.setAttribute("class", "answers");

	for (const answer of state.questions[state.question].shuffledAnswers) {
		const answerBtn = document.createElement("button");
		answerBtn.setAttribute("class", "answer");
		answerBtn.textContent = answer;
		answersSection.append(answerBtn);
		answerBtn.addEventListener("click", () => {
			state.questionAnswered = true;
			if (answerBtn.textContent !== state.questions[state.question].correct_answer) {
				state.gameLost = true;
			}
			render();
		});
		mainEl.append(questionDiv, answersSection);
		if (state.questionAnswered) {
			answerBtn.disabled = true;
			if (answerBtn.textContent === state.questions[state.question].correct_answer) {
				answerBtn.classList.add("right");
			} else answerBtn.classList.add("wrong");
		}
	}
	if (state.questionAnswered) {
		if (!state.gameLost) {
			const continueBtn = document.createElement("button");
			continueBtn.setAttribute("class", "game-button");
			continueBtn.textContent = "Continue";
			mainEl.append(continueBtn);
			continueBtn.addEventListener("click", () => {
				state.question++;
				state.questionAnswered = false;
				render();
			});
		} else {
			const mainMenuBtn = document.createElement("button");
			mainMenuBtn.setAttribute("class", "game-button");
			mainMenuBtn.textContent = "Go to main menu";
			mainMenuBtn.addEventListener("click", () => {
				state.gameHasStarted = false;
				state.question = 0;
				state.questionAnswered = false;
				state.gameLost = false;
				state.selectedCategory = { name: "All Categories", id: "" };
				state.selectedDifficulty = "easy";
				render();
			});
			mainEl.append(mainMenuBtn);
		}
	}

	questionDiv.append(questionH2);
}

function renderModal() {
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
function getQuestions() {
	return fetch(`https://opentdb.com/api.php?amount=15&category=${state.selectedCategory.id}&difficulty=${state.selectedDifficulty}&type=multiple`)
		.then((response) => response.json())
		.then((object) => object.results);
}

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
