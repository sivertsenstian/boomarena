import GUI from 'lil-gui';

import { HelloWorldLevel, PlayGroundLevel, World } from '@/game';

const world = new World(window.innerWidth * 0.8, window.innerHeight * 0.8, new PlayGroundLevel());
world.init();
world.start();

// const worldGUI = {
//   level: 'playground',
//   select: function () {
//     world.level = worldGUI.level === 'playground' ? new PlayGroundLevel() : new HelloWorldLevel();
//     world.init();
//     world.start();
//   },
// };

// const gui = new GUI();
// gui.add(worldGUI, 'level', ['playground', 'helloworld']);
// gui.add(worldGUI, 'select');
