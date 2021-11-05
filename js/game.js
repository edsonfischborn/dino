import {
  createElm,
  appendCh,
  multiStyleAdd,
  moveTo,
  extractInt,
} from './util.js';
import { imgUrl, soundUrl } from './config.js';

const gameDefaultConfig = {
  dirt: `${imgUrl}/dirt.png`,
  cloud: `${imgUrl}/cloud.png`,
  reset: `${imgUrl}/reset-btn.png`,
  smallEnemy: {
    img: `${imgUrl}/small-enemy.png`,
    width: 30,
    height: 40,
  },
  mediumEnemy: {
    img: `${imgUrl}/medium-enemy.png`,
    width: 60,
    height: 46,
  },
  largeEnemy: {
    img: `${imgUrl}/large-enemy.png`,
    width: 75,
    height: 49,
  },
  flyEnemy: {
    img: `${imgUrl}/fly-enemy.gif`,
    width: 46,
    height: 40,
  },
  jumpSound: `${soundUrl}/jump.wav`,
  scoreSound: `${soundUrl}/score.wav`,
  overSound: `${soundUrl}/over.wav`,
};

/**
 *
 * @param {object} gameObj
 * @returns object
 */

export const Game = (gameObj = gameDefaultConfig) => {
  const layer = createElm('main');
  const score = createElm('strong');
  const highScore = createElm('strong');
  const gameOver = createElm('Strong');
  const reset = createElm('img');

  const jumpSound = createElm('audio');
  const scoreSound = createElm('audio');
  const overSound = createElm('audio');

  const queue = {
    dirt: [],
    enemy: [],
    cloud: [],
  };

  let gameEnd = false;
  let player = null;
  let step = 4;

  // Functions
  const addPlayer = (p) => {
    player = p;
    appendCh(layer, player.element);
  };

  const isPlayerColision = () => {
    const enemy = queue['enemy'][0];

    if (!enemy) return false;

    const p = player.element.getBoundingClientRect();
    const e = enemy.getBoundingClientRect();

    return (
      p.x < e.x + e.width &&
      p.x + p.width > e.x &&
      p.y < e.y + e.height &&
      p.y + p.height > e.y
    );
  };

  const running = () => {
    if (gameEnd || isPlayerColision()) {
      overPlayer();
      appendCh(layer, gameOver);
      appendCh(layer, reset);
      gameEnd = true;
      return true;
    }

    return false;
  };

  const overPlayer = () => {
    player.over();
    overSound.play();

    const score = getScore();
    const highScore = getHighScore();

    if (score > highScore) {
      setHighScore(score);
    }
  };

  const getScore = () => extractInt(score.innerText);
  const setScore = (s) => (score.innerText = `${s}`.padStart(5, '0'));

  const getHighScore = () => {
    const highScore = localStorage.getItem('highScore');
    return highScore ? extractInt(highScore) : null;
  };
  const setHighScore = (s) => {
    localStorage.setItem('highScore', s);
    highScore.innerText = `HI ${`${s}`.padStart(5, '0')}`;
  };

  const createDirt = (style = {}) => {
    const dirt = createElm('img');
    dirt.setAttribute('src', gameObj.dirt);

    multiStyleAdd(
      {
        position: 'absolute',
        bottom: '2px',
        left: '0px',
        width: '2000px',
        ...style,
      },
      dirt
    );

    appendCh(layer, dirt);
    queue['dirt'].push(dirt);
  };

  const createEnemy = (amount) => {
    for (let i = 0; i < amount; i++) {
      const enemy = createElm('img');
      const possibleEnymyes = ['smallEnemy', 'mediumEnemy'];

      if (getScore() >= 200) {
        possibleEnymyes.push('largeEnemy', 'flyEnemy');
      }

      const imgIndex = Math.floor(Math.random() * possibleEnymyes.length);
      const img = possibleEnymyes[imgIndex];
      const last = queue['enemy'][queue['enemy'].length - 1];
      const flyEnemyY = [15, 45];
      let left = extractInt(layer.style.width) + 20;
      let top = 5;

      if (img === 'flyEnemy') {
        top = flyEnemyY[Math.floor(Math.random() * flyEnemyY.length)];
      }

      if (last) {
        left = extractInt(last.style.left) + extractInt(last.style.width) + 400;
      }

      enemy.setAttribute('src', gameObj[img].img);
      multiStyleAdd(
        {
          position: 'absolute',
          bottom: `${top}px`,
          width: `${gameObj[img].width}px`,
          height: `${gameObj[img].height}px`,
          left: `${left}px`,
          zIndex: '2',
        },
        enemy
      );

      queue['enemy'].push(enemy);
      appendCh(layer, enemy);
    }
  };

  const createCloud = (amount) => {
    for (let i = 0; i < amount; i++) {
      const cloud = createElm('img');

      const last = queue['cloud'][queue['cloud'].length - 1];
      const top = `${Math.floor(Math.random() * (60 - 10 + 1)) + 10}px`;
      const spc = Math.floor(Math.random() * (250 - 100 + 1)) + 100;
      let left = extractInt(layer.style.width) + 20;

      if (last) {
        left = extractInt(last.style.left) + extractInt(last.style.width) + spc;
      }

      cloud.setAttribute('src', gameObj.cloud);
      multiStyleAdd(
        {
          position: 'absolute',
          top,
          width: '72px',
          left: `${left}px`,
        },
        cloud
      );

      queue['cloud'].push(cloud);
      appendCh(layer, cloud);
    }
  };

  const isRemovable = (elem) => {
    const width = extractInt(elem.style.width);
    let left = extractInt(elem.style.left) + width;

    return left < 0;
  };

  const animateDirt = async () => {
    createDirt();
    createDirt({
      left: queue['dirt'][0].style.width,
    });

    const loop = async (d) => {
      await moveTo(d, extractInt(d.style.left) - 4000, 'x', step, () => {
        if (running()) {
          return true;
        } else if (isRemovable(d)) {
          const left = `${
            extractInt(queue['dirt'][1].style.left) +
            extractInt(queue['dirt'][1].style.width)
          }px`;

          multiStyleAdd({ left }, queue['dirt'][0]);
          queue['dirt'].reverse();

          return true;
        }
      });

      if (!running()) {
        loop(d);
      }
    };

    await Promise.all([loop(queue['dirt'][0]), loop(queue['dirt'][1])]);
  };

  const animateObject = async (index, queueName) => {
    const e = queue[queueName][index];

    await moveTo(e, extractInt(e.style.left) - 4000, 'x', step, () => {
      if (running()) {
        return true;
      } else if (isRemovable(e)) {
        queue[queueName].shift();
        e.remove();

        setScore(`${getScore() + 10} `);

        if (getScore() % 200 === 0) {
          scoreSound.play();
          step++;
        }

        return true;
      }
    });
  };

  const mainGameAnimation = async () => {
    createEnemy(8);
    createCloud(4);

    await Promise.all([
      ...queue['enemy'].map((_, i) =>
        animateObject(i, 'enemy').then(async () => {
          if (i === 0) {
            createEnemy();
            await animateObject(queue['enemy'].length - 1, 'enemy');
          }
        })
      ),
      ...queue['cloud'].map((_, i) => animateObject(i, 'cloud')),
    ]);

    if (!running()) {
      mainGameAnimation();
    }
  };

  const animatePlayerJump = async (y = 80) => {
    player.jump();
    jumpSound.play();

    await moveTo(player.element, y, 'y', step * step, running);
    await moveTo(player.element, 10, 'y', step / step, running);

    player.run();
  };

  const animatePlayer = async (animation = 'jump') => {
    if (gameEnd) {
      player.over();
      return;
    }

    if (animation === 'jump') {
      await animatePlayerJump();
    } else if (animation === 'runLowered') {
      player.runLowered();
    } else if (animation === 'run') {
      player.run();
    }
  };

  const start = async () => {
    player.run();
    appendCh(layer, score, 'afterbegin');
    appendCh(layer, highScore, 'afterbegin');

    await Promise.all([animateDirt(), mainGameAnimation()]);
  };

  multiStyleAdd(
    {
      width: '600px',
      height: '150px',
      position: 'relative',
      overflow: 'hidden',
    },
    layer
  );

  multiStyleAdd(
    {
      display: 'none',
    },
    jumpSound,
    scoreSound,
    overSound
  );

  multiStyleAdd(
    {
      position: 'absolute',
      color: '#535353',
      fontSize: '20px',
      zIndex: '6',
    },
    score,
    highScore
  );

  multiStyleAdd(
    {
      position: 'absolute',
      color: '#535353',
      fontSize: '30px',
      zIndex: '6',
      fontWeight: '400',
      letterSpacing: '4px',
      top: '30%',
      left: `38%`,
    },
    gameOver
  );

  multiStyleAdd(
    {
      position: 'absolute',
      zIndex: '6',
      top: '55%',
      width: '35px',
      height: '30px',
      left: `48%`,
    },
    reset
  );

  score.style.right = '20px';
  highScore.style.right = '80px';

  setScore(0);
  setHighScore(getHighScore() | 0);

  layer.classList.add('main');
  gameOver.innerText = 'Game Over!';
  reset.setAttribute('src', gameObj.reset);
  reset.addEventListener('click', () => location.reload());
  jumpSound.setAttribute('src', gameObj.jumpSound);
  scoreSound.setAttribute('src', gameObj.scoreSound);
  overSound.setAttribute('src', gameObj.overSound);

  appendCh(layer, jumpSound, 'afterbegin');
  appendCh(layer, scoreSound, 'afterbegin');
  appendCh(layer, overSound, 'afterbegin');
  appendCh('body', layer, 'afterbegin');

  return {
    gameEnd: () => gameEnd,
    addPlayer,
    start,
    animatePlayer,
  };
};
