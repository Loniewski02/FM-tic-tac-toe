let menu;
let startGameBtns;
let teamBtns;
let appMain;
let appBoxes;
let restartBtn;
let cancelRestartBtn;
let confirmRestartBtn;

let team = 'o';
let gameMode;

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
	cancelRestartBtn = document.querySelector('.summary-board__btn--cancel');
	confirmRestartBtn = document.querySelector('.summary-board__btn--confirm');
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

	restartBtn.addEventListener('click', restartGame);
	cancelRestartBtn.addEventListener('click', () => {
		summaryBoardAnimationOut('.summary-board--restart');
	});

	confirmRestartBtn.addEventListener('click', () => {
		summaryBoardAnimationOut('.summary-board--restart');
		mainAppAnimationOut();
		setTimeout(() => {
			menuAnimationIn();
		}, 1000);
	});
};

const restartGame = () => {
	summaryBoardAnimationIn('.summary-board--restart');
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
		team = target.dataset.team;
	} else {
	}
};

const startGame = () => {
	menuAnimationOut();
	mainAppAnimationIn();
	switch (gameMode) {
		case 'solo':
			summaryBoardAnimationIn('.summary-board--difficulty');
			soloGame();
			break;
		case 'multi':
			multiGame();
			break;
	}
};

const soloGame = team => {};
const multiGame = team => {};

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
};

const summaryBoardAnimationOut = element => {
	gsap.to('.summary-board-shadow--bottom', { duration: 0.5, height: '0', opacity: 0 });
	gsap.to('.summary-board-shadow--top', { duration: 0.5, height: '0', opacity: 0 });
	gsap.to(element, { duration: 0.5, delay: 0.5, right: '-110%', opacity: '0' });
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
	gsap.to('.app-main__body-box', {
		duration: 0.5,
		delay: 0.3,
		marginLeft: '-3em',
	});
};
