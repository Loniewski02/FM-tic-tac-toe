let teamBtns;
let appBoxes;
let startMultiplayerGameBtn;
let startSingleplayerGameBtn;
let currentTurnInfo;
let p1PointsStatus;
let p1PointsTitle;
let p2PointsStatus;
let p2PointsTitle;
let tiesStatus;
let summaryBoardWin;
let summaryBoardWinner;
let newGameBtn;
let quitGameBtn;
let restartBtn;
let cancelRestartBtn;
let confirmRestartBtn;
let difficultyBtns;

let isComputerTurn = false;
let difficultyLevel;
let startingTeam;
let startingTeamSingleplayer;
let playerTeam = 'o';
let cpuTeam = 'x';
let ties = 0;
let p1Points = 0;
let p2Points = 0;

const winConditions = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

const main = () => {
	prepareDOMElements();
	prepareDOMEvents();
};

const prepareDOMElements = () => {
	teamBtns = document.querySelectorAll('.app-menu__box-btn');
	startMultiplayerGameBtn = document.querySelector('.app-menu__btns-btn--multi');
	startSingleplayerGameBtn = document.querySelector('.app-menu__btns-btn--solo');
	currentTurnInfo = document.querySelector('.app-main__nav-info-img');
	p1PointsStatus = document.querySelector('.app-main__body-summary--p1 .app-main__body-summary-number');
	p1PointsTitle = document.querySelector('.app-main__body-summary--p1 .app-main__body-summary-title');
	p2PointsStatus = document.querySelector('.app-main__body-summary--p2 .app-main__body-summary-number');
	p2PointsTitle = document.querySelector('.app-main__body-summary--p2 .app-main__body-summary-title');
	tiesStatus = document.querySelector('.app-main__body-summary--ties .app-main__body-summary-number');
	appBoxes = document.querySelectorAll('.app-main__body-box');

	difficultyBtns = document.querySelectorAll('.difficulty-btn');
	summaryBoardWin = document.querySelector('.summary-board--win');
	summaryBoardWinner = document.querySelector('.summary-board__win-info');
	newGameBtn = document.querySelectorAll('.new-game');
	quitGameBtn = document.querySelectorAll('.quit-game');
	restartBtn = document.querySelector('.app-main__nav-restart-btn');
	cancelRestartBtn = document.querySelector('.summary-board__btn-restart--cancel');
	confirmRestartBtn = document.querySelector('.summary-board__btn-restart--confirm');
};

const prepareDOMEvents = () => {
	menuAnimationIn();
	startMultiplayerGameBtn.addEventListener('click', openMultiplayerGame);
	startSingleplayerGameBtn.addEventListener('click', openSingleplayerMenu);
	teamBtns.forEach(btn => btn.addEventListener('click', handleTeam));
	newGameBtn.forEach(btn => btn.addEventListener('click', resetGame));
	quitGameBtn.forEach(btn => btn.addEventListener('click', backToMenu));
	restartBtn.addEventListener('click', () => {
		summaryBoardAnimationIn('.summary-board--restart');
	});
	cancelRestartBtn.addEventListener('click', () => {
		summaryBoardAnimationOut('.summary-board--restart');
	});
	confirmRestartBtn.addEventListener('click', backToMenu);
};

const clearWinnerBoardClass = () => {
	summaryBoardWin.classList.remove(`summary-board--win-x`);
	summaryBoardWin.classList.remove(`summary-board--win-o`);
};

const disableBoxes = () => {
	appBoxes.forEach(box => {
		box.classList.add('app-main__body-box--used');
	});
};

const clearBoxes = () => {
	appBoxes.forEach(box => {
		box.classList.remove('app-main__body-box--used');
		box.style.backgroundColor = '#1f3641';
		box.style.backgroundImage = '';
		box.style.transform = '';
		box.innerHTML = '';
	});
};

const backToMenu = () => {
	summaryBoardAnimationOut('.summary-board');
	mainAppAnimationOut();
	setTimeout(() => {
		ties = 0;
		p1Points = 0;
		p2Points = 0;
		p1PointsStatus.textContent = '--';
		p2PointsStatus.textContent = '--';
		tiesStatus.textContent = '--';
		clearBoxes();
		menuAnimationIn();
		clearWinnerBoardClass();
	}, 1000);
};

const resetGame = () => {
	summaryBoardAnimationOut('.summary-board');
	setTimeout(() => {
		clearBoxes();
		clearWinnerBoardClass();
	}, 1000);

	setTimeout(() => {
		if (difficultyLevel === 'easy' || difficultyLevel === 'medium' || difficultyLevel === 'hard') {
			startSingleplayerGame();
		}
	}, 1001);
};

const handleTeam = () => {
	teamBtns.forEach(btn => {
		if (btn.classList.contains('app-menu__box-btn--active')) {
			btn.classList.toggle('app-menu__box-btn--active');
		} else return;
	});

	teamPick(event);
};

const teamPick = e => {
	let target = e.target.closest('button');
	target.classList.add('app-menu__box-btn--active');

	if (target.classList.contains('app-menu__box-btn--active')) {
		playerTeam = target.dataset.team;

		if (playerTeam === 'x') {
			cpuTeam = 'o';
			startingTeamSingleplayer = 'x';
		} else if (playerTeam === 'o') {
			cpuTeam = 'x';
			startingTeamSingleplayer = 'o';
		}
	}
};

const openMultiplayerGame = () => {
	menuAnimationOut();
	mainAppAnimationIn();
	startMultiplayerGame();
};

const startMultiplayerGame = () => {
	startingTeam = 'x';
	appBoxes.forEach(box => {
		box.addEventListener('mouseenter', () => {
			handleBoxHover(event, startingTeam);
		});
		box.addEventListener('focus', () => {
			handleBoxHover(event, startingTeam);
		});
		box.addEventListener('mouseleave', hideBoxHover);
		box.addEventListener('blur', hideBoxHover);
		box.removeEventListener('click', singleplayerGame);
		box.addEventListener('click', multiplayerGame);
		box.removeEventListener('keydown', enterKeyForSingleplayer);
		box.addEventListener('keydown', enterKeyForMultiplayer);
	});
};

const multiplayerGame = e => {
	difficultyLevel = 'multiplayer';
	const clickedBox = e.target;

	if (!clickedBox.classList.contains('app-main__body-box--used')) {
		clickedBox.classList.add('app-main__body-box--used');
		clickedBox.style.backgroundImage = '';
		clickedBox.innerHTML = `<img src="./dist/img/icons/icon-${startingTeam}.svg" alt="" class="app-main__body-box-img">`;

		if (checkWin(startingTeam)) {
			disableBoxes();
			if (startingTeam === 'x') {
				p1Points++;
				p1PointsStatus.textContent = p1Points;
				p1PointsTitle.textContent = `x (p1)`;
				summaryBoardWinner.textContent = `player 1 wins!`;
			} else {
				p2Points++;
				p2PointsStatus.textContent = p2Points;
				p2PointsTitle.textContent = `o (p2)`;
				summaryBoardWinner.textContent = `player 2 wins!`;
			}
			summaryBoardWin.classList.add(`summary-board--win-${startingTeam}`);

			setTimeout(() => {
				summaryBoardAnimationIn(`.summary-board--win-${startingTeam}`);
				startingTeam = 'x';
			}, 500);
		} else if (checkTie()) {
			disableBoxes();
			ties++;
			tiesStatus.textContent = ties;
			summaryBoardAnimationIn('.summary-board--tied');
			startingTeam = 'x';
		} else {
			startingTeam = startingTeam === 'o' ? 'x' : 'o';
			currentTurnInfo.setAttribute('src', `./dist/img/icons/icon-${startingTeam}.svg`);
		}
	}
};

const openSingleplayerMenu = () => {
	summaryBoardAnimationIn('.summary-board--difficulty');
	difficultyBtns.forEach(btn => {
		btn.addEventListener('click', getDifficulty);
	});
};

const openSingleplayerGame = () => {
	summaryBoardAnimationOut('.summary-board--difficulty');
	setTimeout(() => {
		menuAnimationOut();
		mainAppAnimationIn();
		singleplayerGame();
	}, 500);
	startSingleplayerGame();
};

const getDifficulty = e => {
	const difficulty = e.target.dataset.difficulty;
	difficultyLevel = difficulty;
	openSingleplayerGame();
};

const startSingleplayerGame = () => {
	startingTeamSingleplayer = 'x';
	appBoxes.forEach(box => {
		box.addEventListener('mouseenter', e => {
			handleBoxHover(e, playerTeam);
		});
		box.addEventListener('focus', e => {
			handleBoxHover(e, playerTeam);
		});
		box.addEventListener('mouseleave', hideBoxHover);
		box.addEventListener('blur', hideBoxHover);
		box.removeEventListener('click', multiplayerGame);
		box.addEventListener('click', singleplayerGame);
		box.removeEventListener('keydown', enterKeyForMultiplayer);
		box.addEventListener('keydown', enterKeyForSingleplayer);
	});

	if (difficultyLevel === 'easy' || difficultyLevel === 'medium') {
		if (playerTeam === 'o') {
			makeEasyMove();
		}
	} else if (difficultyLevel === 'hard') {
		if (playerTeam === 'o') {
			computerFirstMove();
		}
	}
};

const changeTeams = () => {
	if (playerTeam === 'x') {
		p1PointsTitle.textContent = `${playerTeam}(player)`;
		p2PointsTitle.textContent = `${cpuTeam}(CPU)`;
	} else if (playerTeam === 'o') {
		p2PointsTitle.textContent = `${playerTeam}(player)`;
		p1PointsTitle.textContent = `${cpuTeam}(CPU)`;
	}
};

const singleplayerGame = e => {
	const emptyBoxes = Array.from(document.querySelectorAll('.app-main__body-box:not(.app-main__body-box--used)'));
	let playerWin;
	changeTeams();

	const clickedBox = e.target;
	if (!clickedBox.classList.contains('app-main__body-box--used') && !isComputerTurn) {
		clickedBox.classList.add('app-main__body-box--used');
		clickedBox.style.backgroundImage = '';
		clickedBox.innerHTML = `<img src="./dist/img/icons/icon-${playerTeam}.svg" alt="" class="app-main__body-box-img">`;
		playerWin = handleMoveResult(playerTeam, 'you won!');
		clickedBox.removeEventListener('click', singleplayerGame);
	}

	if (difficultyLevel === 'easy') {
		if (!playerWin && emptyBoxes.length > 1) {
			isComputerTurn = true;
			setTimeout(() => {
				makeEasyMove(emptyBoxes);
				handleMoveResult(cpuTeam, 'oh no, you lost ...');
				isComputerTurn = false;
			}, 500);
		}
	} else if (difficultyLevel === 'medium') {
		if (!playerWin && emptyBoxes.length > 1) {
			isComputerTurn = true;
			setTimeout(() => {
				makeNormalMove(emptyBoxes);
				handleMoveResult(cpuTeam, 'oh no, you lost ...');
				isComputerTurn = false;
			}, 500);
		}
	} else if (difficultyLevel === 'hard') {
		if (!playerWin && emptyBoxes.length > 1) {
			isComputerTurn = true;
			setTimeout(() => {
				makeHardMove(emptyBoxes);
				handleMoveResult(cpuTeam, 'oh no, you lost ...');
				isComputerTurn = false;
			}, 500);
		}
	}
};

const computerFirstMove = () => {
	const arr = Array.from(appBoxes);
	arr[4].classList.add('app-main__body-box--used');
	arr[4].style.backgroundImage = '';
	arr[4].innerHTML = `<img src="./dist/img/icons/icon-${cpuTeam}.svg" alt="" class="app-main__body-box-img">`;
	arr[4].removeEventListener('click', singleplayerGame);
	handleMoveResult(cpuTeam, 'oh no, you lost ...');
};

const makeEasyMove = () => {
	const emptyBoxes = Array.from(document.querySelectorAll('.app-main__body-box:not(.app-main__body-box--used)'));
	const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
	const randomBox = emptyBoxes[randomIndex];
	randomBox.classList.add('app-main__body-box--used');
	randomBox.style.backgroundImage = '';
	randomBox.innerHTML = `<img src="./dist/img/icons/icon-${cpuTeam}.svg" alt="" class="app-main__body-box-img">`;
	randomBox.removeEventListener('click', singleplayerGame);
};

const makeNormalMove = () => {
	const emptyBoxes = Array.from(document.querySelectorAll('.app-main__body-box:not(.app-main__body-box--used)'));

	for (let i = 0; i < emptyBoxes.length; i++) {
		const box = emptyBoxes[i];
		box.classList.add('app-main__body-box--used');
		box.innerHTML = `<img src="./dist/img/icons/icon-${playerTeam}.svg" alt="" class="app-main__body-box-img">`;
		if (checkCanWin(playerTeam)) {
			box.classList.remove('app-main__body-box--used');
			box.innerHTML = '';
			box.classList.add('app-main__body-box--used');
			box.innerHTML = `<img src="./dist/img/icons/icon-${cpuTeam}.svg" alt="" class="app-main__body-box-img">`;
			box.removeEventListener('click', singleplayerGame);
			box.style.backgroundImage = '';
			return;
		}
		box.classList.remove('app-main__body-box--used');
		box.innerHTML = '';
	}

	const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
	const randomBox = emptyBoxes[randomIndex];
	randomBox.classList.add('app-main__body-box--used');
	randomBox.style.backgroundImage = '';
	randomBox.innerHTML = `<img src="./dist/img/icons/icon-${cpuTeam}.svg" alt="" class="app-main__body-box-img">`;
	randomBox.removeEventListener('click', singleplayerGame);
};

const makeHardMove = () => {
	const emptyBoxes = Array.from(document.querySelectorAll('.app-main__body-box:not(.app-main__body-box--used)'));

	for (let i = 0; i < emptyBoxes.length; i++) {
		const box = emptyBoxes[i];
		box.classList.add('app-main__body-box--used');
		box.innerHTML = `<img src="./dist/img/icons/icon-${cpuTeam}.svg" alt="" class="app-main__body-box-img">`;
		if (checkCanWin(cpuTeam)) {
			box.removeEventListener('click', singleplayerGame);
			box.style.backgroundImage = '';
			return;
		}
		box.classList.remove('app-main__body-box--used');
		box.innerHTML = '';
	}

	for (let i = 0; i < emptyBoxes.length; i++) {
		const box = emptyBoxes[i];
		box.classList.add('app-main__body-box--used');
		box.innerHTML = `<img src="./dist/img/icons/icon-${playerTeam}.svg" alt="" class="app-main__body-box-img">`;
		if (checkCanWin(playerTeam)) {
			box.classList.remove('app-main__body-box--used');
			box.innerHTML = '';
			box.classList.add('app-main__body-box--used');
			box.innerHTML = `<img src="./dist/img/icons/icon-${cpuTeam}.svg" alt="" class="app-main__body-box-img">`;
			box.removeEventListener('click', singleplayerGame);
			box.style.backgroundImage = '';
			return;
		}
		box.classList.remove('app-main__body-box--used');
		box.innerHTML = '';
	}

	const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
	const randomBox = emptyBoxes[randomIndex];
	randomBox.classList.add('app-main__body-box--used');
	randomBox.style.backgroundImage = '';
	randomBox.innerHTML = `<img src="./dist/img/icons/icon-${cpuTeam}.svg" alt="" class="app-main__body-box-img">`;
	randomBox.removeEventListener('click', singleplayerGame);
};

const handleMoveResult = (tm, info) => {
	if (checkWin(tm)) {
		disableBoxes();
		if (tm === 'o') {
			p2Points++;
			p2PointsStatus.textContent = p2Points;
			summaryBoardWinner.textContent = info;
		} else {
			p1Points++;
			p1PointsStatus.textContent = p1Points;
			summaryBoardWinner.textContent = info;
		}
		summaryBoardWin.classList.add(`summary-board--win-${tm}`);

		setTimeout(() => {
			summaryBoardAnimationIn(`.summary-board--win-${tm}`);
		}, 500);

		return true;
	} else if (checkTie()) {
		disableBoxes();
		ties++;
		tiesStatus.textContent = ties;
		summaryBoardAnimationIn('.summary-board--tied');

		return false;
	} else {
		startingTeamSingleplayer = startingTeamSingleplayer === 'o' ? 'x' : 'o';
		currentTurnInfo.setAttribute('src', `./dist/img/icons/icon-${startingTeamSingleplayer}.svg`);
		return;
	}
};

const checkCanWin = team => {
	for (const condition of winConditions) {
		const [a, b, c] = condition;

		if (
			appBoxes[a].innerHTML === `<img src="./dist/img/icons/icon-${team}.svg" alt="" class="app-main__body-box-img">` &&
			appBoxes[b].innerHTML === `<img src="./dist/img/icons/icon-${team}.svg" alt="" class="app-main__body-box-img">` &&
			appBoxes[c].innerHTML === `<img src="./dist/img/icons/icon-${team}.svg" alt="" class="app-main__body-box-img">`
		) {
			return true;
		}
	}
	return false;
};

const checkWin = team => {
	for (const condition of winConditions) {
		const [a, b, c] = condition;
		const winningBoxes = [appBoxes[a], appBoxes[b], appBoxes[c]];

		if (
			appBoxes[a].innerHTML === `<img src="./dist/img/icons/icon-${team}.svg" alt="" class="app-main__body-box-img">` &&
			appBoxes[b].innerHTML === `<img src="./dist/img/icons/icon-${team}.svg" alt="" class="app-main__body-box-img">` &&
			appBoxes[c].innerHTML === `<img src="./dist/img/icons/icon-${team}.svg" alt="" class="app-main__body-box-img">`
		) {
			winningBoxes.forEach(box => {
				box.style.backgroundColor = team === 'o' ? '#ffc860' : '#31c3bd';
				box.style.transform = 'scale(1.1)';
				const img = box.querySelector('img');
				img.style.filter = `brightness(0) saturate(100%) invert(12%) sepia(6%) saturate(3580%) hue-rotate(158deg) brightness(97%) contrast(91%)`;
			});
			return true;
		}
	}
	return false;
};

const checkTie = () => {
	const usedBoxes = Array.from(appBoxes).filter(box => box.classList.contains('app-main__body-box--used'));
	if (usedBoxes.length === appBoxes.length) {
		return true;
	}
	return false;
};

const enterKeyForSingleplayer = e => {
	if (e.key === 'Enter') {
		singleplayerGame(e);
	}
};

const enterKeyForMultiplayer = e => {
	if (e.key === 'Enter') {
		multiplayerGame(e);
	}
};

const handleBoxHover = (e, tm) => {
	const hoveredBox = e.target;

	if (!hoveredBox.classList.contains('app-main__body-box--used')) {
		hoveredBox.style.backgroundImage = `url(./dist/img/icons/icon-${tm}-outline.svg)`;
	}
};

const hideBoxHover = e => {
	const bluredBox = e.target;

	if (!bluredBox.classList.contains('app-main__body-box--used')) {
		bluredBox.style.backgroundImage = '';
	}
};

//GASP animations...

const menuAnimationIn = () => {
	gsap.to('.app-menu', { duration: 1, opacity: '1', height: '100%', top: 0 });
};

const menuAnimationOut = () => {
	gsap.to('.app-menu', { duration: 1, top: '-50%', opacity: '0', height: '0' });
};

const summaryBoardAnimationIn = element => {
	gsap.to(element, { duration: 0.5, right: '0', opacity: '1', visibility: 'visible' });
	gsap.to('.summary-board-shadow--bottom', { duration: 0.5, delay: 0.5, height: '50vh', opacity: 0.6 });
	gsap.to('.summary-board-shadow--top', { duration: 0.5, delay: 0.5, height: '50vh', opacity: 0.6 });
	gsap.to('.app-main__body-box', {
		duration: 0.5,
		delay: 0.3,
		marginLeft: '-3em',
	});
};

const summaryBoardAnimationOut = element => {
	gsap.to('.summary-board-shadow--bottom', { duration: 0.5, height: '0', opacity: 0 });
	gsap.to('.summary-board-shadow--top', { duration: 0.5, height: '0', opacity: 0 });
	gsap.to(element, { duration: 0.5, delay: 0.5, right: '-110%', opacity: '0' });
	gsap.to(element, { duration: 0.1, delay: 1, visibility: 'hidden' });
	gsap.to('.app-main__body-box', {
		duration: 0.3,
		delay: 1,
		marginLeft: '0',
	});
};

const mainAppAnimationIn = () => {
	gsap.to('.app-main', { duration: 1, bottom: '0', opacity: '1', height: '100%', display: 'flex' });
	gsap.to('.app-main__body-box', {
		duration: 0.5,
		delay: 0.8,
		opacity: '1',
		width: '100%',
		height: '100%',
	});
	gsap.to('.app-main__body-box', {
		duration: 0.3,
		delay: 1,
		marginLeft: '0',
	});
};

const mainAppAnimationOut = () => {
	gsap.to('.app-main', { duration: 1, delay: 0.8, bottom: '-50%', opacity: '0', height: '0' });
	gsap.to('.app-main', { duration: 0.1, delay: 1.5, display: 'none' });
	gsap.to('.app-main__body-box', {
		duration: 0.2,
		delay: 0.6,
		opacity: '0',
	});
};

document.addEventListener('DOMContentLoaded', main);
