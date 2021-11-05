import { Player } from './player.js';
import { Game } from './game.js';

const game = Game();
const player = Player();

game.addPlayer(player);

let started = false;
let jump = false;
window.addEventListener('keydown', async (e) => {
  e.preventDefault();
  const code = e.code;

  if (code === 'ArrowUp' || code === 'Space') {
    if (game.gameEnd()) {
      location.reload();
    }

    if (jump || game.gameEnd()) return;

    if (!started) {
      game.start();
      started = true;
    }

    jump = true;
    await game.animatePlayer();
    jump = false;
  } else if (code === 'ArrowDown') {
    if (jump || game.gameEnd()) return;
    game.animatePlayer('runLowered');
  }
});

window.addEventListener('keyup', async (e) => {
  e.preventDefault();
  const code = e.code;

  if (code === 'ArrowDown') {
    if (jump || game.gameEnd()) return;
    game.animatePlayer('run');
  }
});
