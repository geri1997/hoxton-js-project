const state = {
	user: {
		id: "test",
		password: "test123",
		scores: [1230350, 3150, 0, 50, 3150],
		highscore: 1230350
	},
	time: 60,
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
	selectedDifficulty: "easy",
	currentScore: 0,
	leaderboard: [],
	jokerUsed: false,
	jokerIncorrectAnswers: []
};

//HELPER FUNCTIONS
function getJokerIncorrectAnswers() {
	const incorretAnswers = state.questions[state.question].incorrect_answers;
	incorretAnswers.sort(() => Math.random() - 0.5);
	return incorretAnswers.slice(0, 2);
}

function getAverageScore() {
	if (state.user.scores.length === 0) return 0;
	let average = 0;
	for (const score of state.user.scores) {
		average = average + score;
	}
	return average / state.user.scores.length;
}
// RENDER FUNCTIONS

function renderHeader() {
	const headerEl = document.createElement("header");

	const currentScoreEl = document.createElement("span");
	currentScoreEl.textContent = `Current Score: ${state.currentScore}`;

	const h1El = document.createElement("h1");
	h1El.textContent = "Who wants to be a GeRinnionaire";

	const navEl = document.createElement("nav");
	const statsAEl = document.createElement("a");
	const leaderboardA = document.createElement("a");
	statsAEl.textContent = "My Stats";
	statsAEl.addEventListener("click", (e) => {
		state.modalMessage = "Stats";
		render();
	});
	leaderboardA.textContent = "Leaderboard";
	leaderboardA.addEventListener("click", (e) => {
		state.modalMessage = "Leaderboard";
		fetchLeaderboard().then(() => {
			render();
		});
	});
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
			scores: [],
			highscore: 0
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
			const parser = new DOMParser();
			state.questions = questions;
			state.questions.forEach((question) => {
				question.correct_answer = parser.parseFromString(question.correct_answer, "text/html").body.innerHTML;
				question.incorrect_answers = question.incorrect_answers.map((answer) => parser.parseFromString(answer, "text/html").body.innerHTML);
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

function renderGame(mainEl) {
	const questionDiv = document.createElement("div");
	questionDiv.setAttribute("class", "question");
	const questionH2 = document.createElement("h2");
	questionH2.innerHTML = state.questions[state.question].question;

	const timerH3 = document.createElement("h3");
	timerH3.textContent = "Timer: " + state.time;
	timerH3.setAttribute("class", "timer");
	if (!state.questionAnswered) {
		const intervalId = setInterval(() => {
			state.time--;
			timerH3.textContent = "Timer: " + state.time;
			if (state.time === 0) {
				state.gameLost = true;
				clearInterval(intervalId);
				state.questionAnswered = true;
				render();
			}
			if (state.questionAnswered) {
				clearInterval(intervalId);
			}
		}, 1000);
	}
	// if (!state.questionAnswered && state.jokerUsed) {
	// 	const intervalId = setInterval(() => {
	// 		state.time--;
	// 		timerH3.textContent = "Timer: " + state.time;
	// 		if (state.time === 0) {
	// 			state.gameLost = true;
	// 			clearInterval(intervalId);
	// 			state.questionAnswered = true;
	// 			renderAnswers(answersSection);
	// 		}
	// 		if (state.questionAnswered) {
	// 			clearInterval(intervalId);
	// 		}
	// 	}, 1000);
	// }
	mainEl.append(timerH3);
	const jokerBtn = document.createElement("button");
	jokerBtn.setAttribute("class", "joker-btn");
	jokerBtn.textContent = `50/50 Joker`;
	jokerBtn.addEventListener("click", () => {
		state.jokerUsed = true;
		state.jokerIncorrectAnswers = getJokerIncorrectAnswers();
		renderAnswers(answersSection);
	});
	if (state.jokerUsed) {
		jokerBtn.disabled = true;
		jokerBtn.classList.add("used");
	}
	const answersSection = document.createElement("section");
	answersSection.setAttribute("class", "answers");
	renderAnswers(answersSection);
	mainEl.append(questionDiv, jokerBtn, answersSection);
	if (state.questionAnswered) {
		if (!state.gameLost && state.question < 14) {
			const continueBtn = document.createElement("button");
			continueBtn.setAttribute("class", "game-button");
			continueBtn.textContent = "Continue";
			mainEl.append(continueBtn);
			continueBtn.addEventListener("click", () => {
				state.question++;
				state.time = 60;
				state.questionAnswered = false;
				render();
			});
		} else {
			state.user.scores.push(state.currentScore);
			if (state.currentScore > state.user.highscore) {
				state.user.highscore = state.currentScore;
			}
			updateUserScore(state.user);
			const mainMenuBtn = document.createElement("button");
			mainMenuBtn.setAttribute("class", "game-button");
			mainMenuBtn.textContent = "Go to main menu";
			mainMenuBtn.addEventListener("click", () => {
				state.jokerUsed = false;
				state.currentScore = 0;
				state.gameHasStarted = false;
				state.question = 0;
				state.questionAnswered = false;
				state.time = 60;
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
function renderAnswers(answersSection) {
	answersSection.innerHTML = "";
	for (const answer of state.questions[state.question].shuffledAnswers) {
		const answerBtn = document.createElement("button");
		answerBtn.setAttribute("class", "answer");
		answerBtn.textContent = answer;
		answersSection.append(answerBtn);
		if (state.jokerIncorrectAnswers.includes(answer)) {
			answerBtn.classList.add("wrong");
		}
		answerBtn.addEventListener("click", () => {
			state.questionAnswered = true;
			if (answerBtn.textContent !== state.questions[state.question].correct_answer) {
				state.gameLost = true;
			} else {
				state.currentScore = state.currentScore + 50 * 2 ** state.question;
			}
			render();
		});

		if (state.questionAnswered) {
			answerBtn.disabled = true;
			if (answerBtn.textContent === state.questions[state.question].correct_answer) {
				answerBtn.classList.add("right");
			} else answerBtn.classList.add("wrong");
		}
	}
}
function renderModal() {
	if (state.modalMessage === "Leaderboard") {
		const modalWrapper = document.createElement("section");
		modalWrapper.setAttribute("class", "modal-wrapper");
		modalWrapper.addEventListener("click", (e) => {
			if (e.target === modalWrapper) {
				state.modalMessage = "";
				render();
			}
		});
		const modal = document.createElement("div");
		modal.setAttribute("class", "modal stats");

		h2El = document.createElement("h2");
		h2El.textContent = "Leaderboard";
		modal.append(h2El);
		for (let i = 0; i < 3; i++) {
			const highscoreH3 = document.createElement("h3");
			highscoreH3.textContent = `${i + 1}. ${state.leaderboard[i].id} : ${state.leaderboard[i].highscore}`;
			modal.append(highscoreH3);
		}
		const h3El = document.createElement("h3");
		const currentRank = state.leaderboard.findIndex((user) => user.id === state.user.id) + 1;
		h3El.textContent = `Your current rank is: ${currentRank}`;

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
		modal.append(h3El, okButton, modalCloseBtn);
		modalWrapper.append(modal);
		document.body.append(modalWrapper);
	} else if (state.modalMessage === "Stats") {
		const modalWrapper = document.createElement("section");
		modalWrapper.setAttribute("class", "modal-wrapper");
		modalWrapper.addEventListener("click", (e) => {
			if (e.target === modalWrapper) {
				state.modalMessage = "";
				render();
			}
		});
		const modal = document.createElement("div");
		modal.setAttribute("class", "modal stats");
		h2El = document.createElement("h2");
		h2El.textContent = state.user.id;
		const highscoreH3 = document.createElement("h3");
		highscoreH3.textContent = `High Score: ${state.user.highscore}`;
		const averageScoreH3 = document.createElement("h3");
		averageScoreH3.textContent = `Average Score: ${getAverageScore().toFixed(2)}`;
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
		modal.append(h2El, highscoreH3, averageScoreH3, okButton, modalCloseBtn);
		modalWrapper.append(modal);
		document.body.append(modalWrapper);
	} else if (state.modalMessage !== "") {
		const modalWrapper = document.createElement("section");
		modalWrapper.setAttribute("class", "modal-wrapper");
		modalWrapper.addEventListener("click", (e) => {
			if (e.target === modalWrapper) {
				state.modalMessage = "";
				render();
			}
		});
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

function fetchLeaderboard() {
	return fetch(`http://localhost:3000/users?_sort=highscore&_order=desc`)
		.then((resp) => resp.json())
		.then(
			(users) =>
				(state.leaderboard = users.map((user) => ({
					id: user.id,
					highscore: user.highscore
				})))
		);
}

function updateUserScore(user) {
	fetch(`http://localhost:3000/users/${user.id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(user)
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
