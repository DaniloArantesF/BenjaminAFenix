import { EventEmitter } from 'events';
import type { Track } from './DiscordClient';

export interface QueueState {
  items: Track[];
  position: number;
}

class QueueController extends EventEmitter {
  items: Track[];
  position: number;
  shuffle: boolean;
  repeat: boolean;

  constructor() {
    super();
    this.items = [];
    this.position = -1;
    this.shuffle = false;
    this.repeat = false;
  }

  public setQueue(queue: Track[], position: number) {
    this.items = [...queue];
    this.position = position;
    this.emit('queue_update');
  }

  public pushItem(item: Track) {
    // console.log(JSON.stringify(item, null, 2));
    this.items = [...this.items, item];
    this.emit('queue_update');
  }

  /**
   * Returns current track to be played
   */
  public getTrack() {
    return this.items[this.position];
  }

  public topItems() {
    return this.items.slice(this.position, this.position + 2);
  }

  /**
   * Function called to jump to next song in queue
   * Position is updated and next resource is returned.
   */
  public next(): Track | null {
    if (this.repeat) return this.items[this.position];

    if (this.shuffle) {
      this.position = this.getRandomIndex();
    } else {
      if (this.position + 1 >= this.items.length) {
        // new pos is out of bounds
        return null;
      }
      this.position++;
    }

    this.emit('queue_update');
    return this.items[this.position];
  }

  /**
   * Function called to jump to previous song in queue
   * Position is updated and previous resource is returned.
   * If shuffle or repeat is enabled, it returns the same item
   */
  // TODO: implement history so it can return to prev random track
  public previous(): Track | null {
    if (this.shuffle || this.repeat) {
      return this.items[this.position];
    } else {
      if (this.position - 1 < 0) {
        // new pos is out of bounds
        return null;
      }
      this.position--;
    }

    this.emit('queue_update');
    return this.items[this.position];
  }

  // TODO: public insertTrack() {}

  // Resets queue to empty state.
  // Emits no events
  public reset() {
    this.items = [];
    this.position = -1;
    this.shuffle = false;
    this.repeat = false;
  }

  /**
   * Returns tracks in queue.
   * i.e. tracks that have not been played
   */
  public getQueue() {
    return this.items.slice(this.position);
  }

  /**
   * Inverts shuffle value or sets it to passed value
   * @param shuffle {optional}
   */
  public setShuffle(shuffle?: boolean) {
    this.shuffle = shuffle === undefined ? !this.shuffle : shuffle;
  }

  /**
   * Inverts repeat value or sets it to passed value
   * @param repeat {optional}
   */
  public setRepeat(repeat?: boolean) {
    this.repeat = repeat === undefined ? !this.repeat : repeat;
  }

  /**
   * Returns a random index within queue bounds
   */
  public getRandomIndex() {
    return Math.floor(Math.random() * this.items.length);
  }
}

export default QueueController;
