export default {
  ADD_TRACK: (user: string, newTrack: string) => `${user} added ${newTrack}`,
  SKIP_TRACK: (user: string, prevTrack: string) => `${user} skiped ${prevTrack}`,
  CHANGE_TRACK: (user: string, curTrack: string) => `${user} changed to ${curTrack}`,
  PREV_TRACK: (user: string, prevTrack: string) => `${user} rewinded to ${prevTrack}`,
  PLAY: (user: string) => `${user} started playback`,
  PAUSE: (user: string) => `${user} paused playback`,
  SHUFFLE:(user: string, status: string) => `${user} set shuffle ${status}`,
  REPEAT:(user: string, status: string) => `${user} set repeat ${status}`
}