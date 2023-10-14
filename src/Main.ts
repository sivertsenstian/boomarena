import { HelloWorldLevel, PlayGroundLevel, World } from '@/game';

const world = new World(new PlayGroundLevel());
world.ready().then(() => {
  world.start();
});
