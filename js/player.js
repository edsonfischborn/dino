import { createElm, multiStyleAdd, moveTo } from './util.js';
import { imgUrl } from './config.js';

const playerDefaultImgConfig = {
  run: `${imgUrl}/dino-run.gif`,
  runLowered: `${imgUrl}/dino-run-lowered.gif`,
  stopped: `${imgUrl}/dino-stopped.png`,
  stoppedStart: `${imgUrl}/dino-stopped-start.png`,
  stoppedOver: `${imgUrl}/dino-stopped-over.png`,
};

/**
 * @param {object} imgObj
 * @param {number} height
 * @param {number} width
 * @param {string} color
 * @returns object
 */
export const Player = (
  imgObj = playerDefaultImgConfig,
  height = 50,
  width = 50,
  color = 'transparent'
) => {
  // Create player
  const player = createElm('img');

  // Functions
  const setPlayerImg = (img) => {
    if (getPlayerImg() === img) return;
    multiStyleAdd({ height: `${height}px`, width: `${width}px` }, player);
    player.setAttribute('src', img);
  };

  const getPlayerImg = () => {
    const src = player.getAttribute('src');
    if (src) {
      return src.split('/').pop();
    }
  };

  const getAnimation = () => {
    const img = getPlayerImg();
    for (let index in imgObj) {
      if (imgObj[index] === img) {
        return index;
      }
    }
  };

  const runLowered = () => {
    setPlayerImg(imgObj.runLowered);
    multiStyleAdd({ height: 'auto', width: `${1.2 * width}px` }, player);
  };

  const run = () => setPlayerImg(imgObj.run);
  const over = () => setPlayerImg(imgObj.stoppedOver);
  const jump = () => setPlayerImg(imgObj.stopped);

  // On init
  multiStyleAdd(
    {
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: color,
      position: 'absolute',
      bottom: '10px',
      left: '10px',
      zIndex: '5',
    },
    player
  );
  player.classList.add('player');
  setPlayerImg(imgObj.stoppedStart);

  return {
    element: player,
    run,
    runLowered,
    getAnimation,
    jump,
    over,
  };
};
