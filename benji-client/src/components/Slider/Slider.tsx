import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectPlayerState } from '../../app/playerSlice';
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
  }, [volume]);

  useEffect(() => {
    if (!activeTrackRef?.current || !active) return;
    updateSlider();
  }, [value]);

  /**
   * Active is set whenever user has clicked on slider
   * and unset on mouse up or mouse leave
   */
  useEffect(() => {
    console.log({ active: active });

    if (active === false) {
      console.log('change callback');
      console.log(value);
      //changeCb(value);
      updateSlider();
    }
  }, [active]);

  const updateSlider = () => {
    if (!activeTrackRef?.current) return;
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
    const newValue = Math.max(0, Math.min(100, Math.ceil((mouseX * 100) / slider.width)));
    return newValue;
  };

  return (
    <div
      ref={sliderRef}
      className={classes.slider}
      onMouseDown={(event) => {
        setActive(true);
        const newValue = handleUpdate(event);
        setValue(newValue);
      }}
      onMouseMove={(event) => {
        const newValue = handleUpdate(event);
        setValue(newValue);
      }}
      onMouseUp={() => setActive(false)}
      onMouseLeave={() => setActive(false)}
    >
      <div className={classes.slider__track}>
        <span ref={activeTrackRef} className={classes.track__left} />
      </div>
    </div>
  );
};

export default Slider;
