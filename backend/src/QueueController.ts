import { EventEmitter } from 'events';
import type { Track } from './DiscordClient';

class QueueController extends EventEmitter {
  items: Track[];
  position: number;
  shuffle: boolean;

  constructor() {
    super();
    this.items = [];
    this.position = -1;
  }

  public setQueue(queue: Track[], position: number) {
    this.items = [...queue];
    this.position = position;
    this.emit('queue_update');
  }

  public pushItem(item: Track) {
    console.log(JSON.stringify(item, null, 2));
    this.items = [...this.items, item];
    if (this.position === -1) {
      this.position = 0;
    }
    this.emit('queue_update');
  }

  /**
   * Returns current track to be played
   */
  public getTrack() {
    return this.items[this.position];
  }

  public topItems() {
    return this.items.slice(0, 2);
  }

  /**
   * Function called to jump to next song in queue
   * Position is updated and next resource is returned.
   */
  public next(): Track | null {
    if (this.position + 1 >= this.items.length) {
      // new pos is out of bounds
      this.position = -1;
      return null;
    }
    this.position++;
    this.emit('queue_update');
    return this.items[this.position];
  }

  /**
   * Function called to jump to previous song in queue
   * Position is updated and previous resource is returned.
   */
  public previous(): Track | null {
    if (this.position - 1 < 0) {
      // new pos is out of bounds
      this.position = -1;
      return null;
    }
    this.emit('queue_update');
    return this.items[--this.position];
  }

  // TODO: public insertTrack() {}

  // Resets queue to empty state.
  // Emits no events
  public reset() {
    this.items = [];
    this.position = -1;
  }
}

export default QueueController;
