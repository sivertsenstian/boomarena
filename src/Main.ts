import { PlayGroundLevel, World } from '@/game';

const world = new World(0.8, new PlayGroundLevel());
world.ready().then(() => {
  world.start();
});
