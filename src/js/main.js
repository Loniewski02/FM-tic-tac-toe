let teamBtns;
let appBoxes;
let startMultiplayerGameBtn;
let startSingleplayerGameBtn;
let currentTurnInfo;
let p1PointsStatus;
let p2PointsStatus;
let tiesStatus;
let summaryBoardWin;
let summaryBoardWinner;
let newGameBtn;
let quitGameBtn;
let restartBtn;
let cancelRestartBtn;
let confirmRestartBtn;
let difficultyBtns;

let startingTeam = 'x';
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
	p2PointsStatus = document.querySelector('.app-main__body-summary--p2 .app-main__body-summary-number');
	tiesStatus = document.querySelector('.app-main__body-summary--ties .app-main__body-summary-number');
	appBoxes = document.querySelectorAll('.app-main__body-box');

	difficultyBtns = document.querySelectorAll('.difficulty-btn');
	summaryBoardWin = document.querySelector('.summary-board--win');
	summaryBoardWinner = document.querySelector('.summary-board__win-info span');
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
	difficultyBtns.forEach(btn => {
		btn.addEventListener('click', openSingleplayerGame);
	});
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
		} else if (playerTeam === 'o') {
			cpuTeam = 'x';
		}
	}
};

const openMultiplayerGame = () => {
	menuAnimationOut();
	mainAppAnimationIn();
	startMultiplayerGame();
};

const startMultiplayerGame = () => {
	appBoxes.forEach(box => {
		box.addEventListener('mouseenter', () => {
			handleBoxHover(event, startingTeam);
		});
		box.addEventListener('mouseleave', handleBoxLeave);
		box.addEventListener('click', multiplayerGame);
	});
};

const multiplayerGame = e => {
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
				summaryBoardWinner.textContent = '1';
			} else {
				p2Points++;
				p2PointsStatus.textContent = p2Points;
				summaryBoardWinner.textContent = '2';
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
};

const openSingleplayerGame = () => {
	summaryBoardAnimationOut('.summary-board--difficulty');
	setTimeout(() => {
		menuAnimationOut();
		mainAppAnimationIn();
		singleplayerGame();
	}, 500);
};

const startSingleplayerGame = () => {
	getDifficulty();
	appBoxes.forEach(box => {
		box.addEventListener('mouseenter', () => {
			handleBoxHover(event, playerTeam);
		});
		box.addEventListener('mouseleave', handleBoxLeave);
		box.addEventListener('click', singleplayerGame);
	});
};

const getDifficulty = e => {
	const difficulty = e.target.textContent;
};

const singleplayerGame = params => {};

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

const handleBoxHover = (e, tm) => {
	const hoveredBox = e.target;

	if (!hoveredBox.classList.contains('app-main__body-box--used')) {
		hoveredBox.style.backgroundImage = `url(./dist/img/icons/icon-${tm}-outline.svg)`;
	}
};

const handleBoxLeave = e => {
	const leftBox = e.target;

	if (!leftBox.classList.contains('app-main__body-box--used')) {
		leftBox.style.backgroundImage = '';
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
	gsap.to('.app-main__body-box', {
		duration: 0.2,
		delay: 0.6,
		opacity: '0',
	});
};

document.addEventListener('DOMContentLoaded', main);
