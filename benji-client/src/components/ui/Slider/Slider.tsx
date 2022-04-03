import { MouseEvent, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectPlayerState } from '../../../app/playerSlice';
import classes from './Slider.module.css';

interface SliderProps {
  changeCb: (value: number) => void;
}

const Slider = ({ changeCb }: SliderProps) => {
  const [value, setValue] = useState(100);
  const [active, setActive] = useState<boolean>();
  const activeTrackRef = useRef<HTMLSpanElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { volume } = useAppSelector(selectPlayerState);

  useEffect(() => {
    if (!volume) return;
    setValue(volume * 100);
    updateSlider(volume * 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  useEffect(() => {
    if (!activeTrackRef?.current || !active) return;
    updateSlider();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  /**
   * Active is set whenever user has clicked on slider
   * and unset on mouse up or mouse leave
   */
  useEffect(() => {
    if (active === false) {
      //console.log(`Volume Changed to ${value}`);
      changeCb(value);
      updateSlider();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const updateSlider = (newValue?: number) => {
    if (!activeTrackRef?.current) return;
    if (newValue) {
      return (activeTrackRef.current.style.width = `${newValue}%`);
    }
    activeTrackRef.current.style.width = `${value}%`;
  };

  /**
   * Used to calculate value of slider based on mouse position
   * @param event
   */
  const handleUpdate = (event: MouseEvent) => {
    if (!sliderRef?.current) return 0;
    let slider = sliderRef.current.getBoundingClientRect();
    let mouseX = event.clientX - slider.x;
    const newValue = Math.max(
      0,
      Math.min(100, Math.ceil((mouseX * 100) / slider.width))
    );
    return newValue;
  };

  return (
    <div className={classes.slider_container}>
      <div
        ref={sliderRef}
        className={classes.slider}
        onMouseDown={(event) => {
          setActive(true);
          const newValue = handleUpdate(event);
          setValue(newValue);
        }}
        onMouseMove={(event) => {
          if (!active) return;
          const newValue = handleUpdate(event);
          setValue(newValue);
        }}
        onMouseUp={() => setActive(false)}
        onMouseLeave={() => {
          active && setActive(false);
        }}
      >
        <div className={classes.slider__track}>
          <span ref={activeTrackRef} className={classes.track__left} />
        </div>
      </div>
      <div className={ classes.volume_counter}>
        { value }
      </div>
    </div>
  );
};

export default Slider;
