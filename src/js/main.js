let menu;
let startGameBtns;
let teamBtns;
let appMain;
let appBoxes;
let restartBtn;
let cancelRestartBtn;
let confirmRestartBtn;
let newGameBtn;
let quitGameBtn;
let currentTurn;
let tiesStatus;
let summaryBoardWin;
let summaryBoardWinner;
let player1PointsStatus;
let player2PointsStatus;
let cpu;

let team = 'x';
let playerTeam = 'o';
let ties = 0;
let p1Points = 0;
let p2Points = 0;
let gameMode;
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
	menu = document.querySelector('.app-menu');
	teamBtns = document.querySelectorAll('.app-menu__box-btn');
	startGameBtns = document.querySelectorAll('.app-menu__btns-btn');
	appMain = document.querySelector('.app-main');
	appBoxes = document.querySelectorAll('.app-main__body-box');
	restartBtn = document.querySelector('.app-main__nav-restart-btn');
	cancelRestartBtn = document.querySelector('.summary-board__btn-restart--cancel');
	confirmRestartBtn = document.querySelector('.summary-board__btn-restart--confirm');
	newGameBtn = document.querySelectorAll('.new-game');
	quitGameBtn = document.querySelectorAll('.quit-game');
	currentTurn = document.querySelector('.app-main__nav-info-img');
	tiesStatus = document.querySelector('.app-main__body-summary--ties .app-main__body-summary-number');
	player2PointsStatus = document.querySelector('.app-main__body-summary--p2 .app-main__body-summary-number');
	player1PointsStatus = document.querySelector('.app-main__body-summary--p1 .app-main__body-summary-number');
	summaryBoardWin = document.querySelector('.summary-board--win');
	summaryBoardWinner = document.querySelector('.summary-board__win-info span');
};

const prepareDOMEvents = () => {
	menuAnimationIn();
	teamBtns.forEach(btn => btn.addEventListener('click', handleTeam));

	startGameBtns.forEach(btn =>
		btn.addEventListener('click', e => {
			gameMode = e.target.dataset.mode;
			startGame();
		})
	);

	restartBtn.addEventListener('click', () => {
		summaryBoardAnimationIn('.summary-board--restart');
	});
	cancelRestartBtn.addEventListener('click', () => {
		summaryBoardAnimationOut('.summary-board--restart');
	});

	confirmRestartBtn.addEventListener('click', backToMenu);

	appBoxes.forEach(box => {
		box.addEventListener('click', handleBoxClick);
		box.addEventListener('mouseenter', handleBoxHover);
		box.addEventListener('mouseleave', handleBoxLeave);
	});

	newGameBtn.forEach(btn => btn.addEventListener('click', resetGame));

	quitGameBtn.forEach(btn => btn.addEventListener('click', backToMenu));
};

const clearBoxes = () => {
	appBoxes.forEach(box => {
		box.classList.remove('app-main__body-box--used');
		box.style.backgroundColor = '#1f3641';
		box.style.backgroundImage = '';
		box.innerHTML = '';
	});
};

const clearWinnerBoardClass = () => {
	summaryBoardWin.classList.remove(`summary-board--win-x`);
	summaryBoardWin.classList.remove(`summary-board--win-y`);
};

const backToMenu = () => {
	summaryBoardAnimationOut('.summary-board');
	mainAppAnimationOut();
	setTimeout(() => {
		ties = 0;
		p1Points = 0;
		p2Points = 0;
		player1PointsStatus.textContent = '--';
		player2PointsStatus.textContent = '--';
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

const handleTeam = e => {
	teamBtns.forEach(btn => {
		if (btn.classList.contains('app-menu__box-btn--active')) {
			btn.classList.toggle('app-menu__box-btn--active');
		} else return;
	});

	teamPick(e);
};

const teamPick = e => {
	let target = e.target.closest('button');
	target.classList.add('app-menu__box-btn--active');

	if (target.classList.contains('app-menu__box-btn--active')) {
		playerTeam = target.dataset.team;
	}
};

const startGame = () => {
	currentTurn.setAttribute('src', `./dist/img/icons/icon-x.svg`);
	switch (gameMode) {
		case 'solo':
			summaryBoardAnimationIn('.summary-board--difficulty');
			soloGame();
			break;
		case 'multi':
			menuAnimationOut();
			mainAppAnimationIn();
			handleBoxClick();
			break;
	}
};

const handleBoxClick = e => {
	const clickedBox = e.target;

	if (!clickedBox.classList.contains('app-main__body-box--used')) {
		clickedBox.classList.add('app-main__body-box--used');
		clickedBox.style.backgroundImage = '';
		clickedBox.innerHTML = `<img src="./dist/img/icons/icon-${team}.svg" alt="" class="app-main__body-box-img">`;

		if (checkWin(team)) {
			if (team === 'x') {
				p2Points++;
				player2PointsStatus.textContent = p2Points;
				summaryBoardWinner.textContent = '2';
			} else {
				p1Points++;
				player1PointsStatus.textContent = p1Points;
				summaryBoardWinner.textContent = '1';
			}
			summaryBoardWin.classList.add(`summary-board--win-${team}`);

			setTimeout(() => {
				summaryBoardAnimationIn(`.summary-board--win-${team}`);
			}, 500);

			setTimeout(() => {
				team = 'x';
			}, 600);
		} else if (checkTie()) {
			ties++;
			tiesStatus.textContent = ties;
			summaryBoardAnimationIn('.summary-board--tied');
			team = 'x';
		} else {
			team = team === 'o' ? 'x' : 'o';
			currentTurn.setAttribute('src', `./dist/img/icons/icon-${team}.svg`);
		}
	}
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

const soloGame = team => {};

const handleBoxHover = e => {
	const hoveredBox = e.target;

	if (!hoveredBox.classList.contains('app-main__body-box--used')) {
		hoveredBox.style.backgroundImage = `url(./dist/img/icons/icon-${team}-outline.svg)`;
	}
};

const handleBoxLeave = e => {
	const leftBox = e.target;

	if (!leftBox.classList.contains('app-main__body-box--used')) {
		leftBox.style.backgroundImage = '';
	}
};

document.addEventListener('DOMContentLoaded', main);

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
	gsap.to('.app-main', { duration: 1, bottom: '0', opacity: '1', height: '100%' });
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
