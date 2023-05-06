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
	menu = document.querySelector('.menu');
	teamBtns = document.querySelectorAll('.menu__box-btn');
	startGameBtns = document.querySelectorAll('.menu__btns-btn');
	appMain = document.querySelector('.app');
	appBoxes = document.querySelectorAll('.app__body-box');
	restartBtn = document.querySelector('.app__nav-restart-btn');
	cancelRestartBtn = document.querySelector('.summary-board__btn--cancel');
	confirmRestartBtn = document.querySelector('.summary-board__btn--confirm');
};

const prepareDOMEvents = () => {
	gsap.to('.menu', { duration: 1, opacity: '1', height: '100%', top: 0 });
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
};

const restartGame = () => {
	summaryBoardAnimationIn('.summary-board--restart');
};

const handleTeam = e => {
	teamBtns.forEach(btn => {
		if (btn.classList.contains('menu__box-btn--active')) {
			btn.classList.toggle('menu__box-btn--active');
		} else return;
	});

	teamPick(e);
};

const teamPick = e => {
	let target = e.target.closest('button');
	target.classList.add('menu__box-btn--active');

	if (target.classList.contains('menu__box-btn--active')) {
		team = target.dataset.team;
	} else {
	}
	console.log(team);
};

const startGame = () => {
	menuAnimationIn();
	mainAppAnimationIn();

	switch (gameMode) {
		case 'solo':
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
	gsap.to('.menu', { duration: 1, top: '-110%', opacity: '0', height: '0' });
};

const summaryBoardAnimationIn = element => {
	gsap.to(element, { duration: 0.5, right: '0', opacity: '1', visibility: 'visible', width: '100%' });
	gsap.to('.summary-board-shadow--bottom', { duration: 0.5, delay: 0.5, height: '50vh', opacity: 0.6 });
	gsap.to('.summary-board-shadow--top', { duration: 0.5, delay: 0.5, height: '50vh', opacity: 0.6 });
};

const summaryBoardAnimationOut = element => {
	gsap.to('.summary-board-shadow--bottom', { duration: 0.5, height: '0', opacity: 0 });
	gsap.to('.summary-board-shadow--top', { duration: 0.5, height: '0', opacity: 0 });
	gsap.to(element, { duration: 0.5, delay: 0.5, right: '-50%', opacity: '0', width: '0' });
};

const mainAppAnimationIn = () => {
	gsap.to('.app', { duration: 1, bottom: '0', opacity: '1', height: '100%' });
};
