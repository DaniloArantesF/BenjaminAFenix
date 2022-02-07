import { Track } from "../../types";
import classes from './TrackPreview.module.css';

interface TrackPreviewProps {
  track: Track | null;
}

const TrackPreview = ({ track }: TrackPreviewProps) => {
  return (
    <div className={classes.track_preview}>
      <div className={classes.track__thumbnail}>
        { track && <img alt="track thumbnail" src={track.thumbnail} />}
      </div>
      <div className={classes.track__info}>
        <h1>{track?.title}</h1>
        <h2>{track?.channelTitle}</h2>
      </div>
    </div>
  );
};

export default TrackPreview;