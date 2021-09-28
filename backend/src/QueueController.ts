import { EventEmitter } from 'events';
import type { AudioResource } from './DiscordClient';


class QueueController extends EventEmitter {
  items: AudioResource[];
  position: number;
  shuffle: boolean;

  constructor() {
    super();
    this.items = [];
    this.position = -1;
  }

  public setQueue(queue: AudioResource[], position: number) {
    this.items = [...queue];
    this.position = position;
    this.emit('queue_update');
  }

  public pushItem(item: AudioResource) {
    this.items = [...this.items, item];
    if (this.position === -1) {
      this.position = 0;
      this.emit('queue_update');
    }
    // console.info("Pushed Items:")
    // console.info(this.items)
  }

  /**
   * Returns current track to be played
   */
  public getTrack() {
    return this.items[this.position];
  }

  /**
   * Function called to jump to next song in queue
   * Position is updated and next resource is returned.
   */
  public next(): AudioResource | null {
    if (this.position + 1 >= this.items.length) { // new pos is out of bounds
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
  public previous(): AudioResource | null {
    if (this.position - 1 < 0) {  // new pos is out of bounds
      this.position = -1;
      return null;
    }
    this.emit('queue_update');
    return this.items[--this.position];
  }

  // TODO: public insertTrack() {}

}

export default QueueController;