import type { AudioResource } from './DiscordClient';


class QueueController {
  items: AudioResource[];
  constructor() {
    this.items = [];
  }
}

export default QueueController;