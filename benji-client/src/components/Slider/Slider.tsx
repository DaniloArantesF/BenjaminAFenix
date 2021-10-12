import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectStatus } from '../../app/playerSlice';
import classes from './Slider.module.css';

const Slider = ({ range = { min: 0, max: 100 }, initialValue = 50 }) => {
  const [value, setValue] = useState(initialValue);
  const [active, setActive] = useState(false);
  const activeTrackRef = useRef<HTMLSpanElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const playerStatus = useAppSelector(selectStatus);

  useEffect(() => {
    if (!activeTrackRef?.current || !active) return;
    activeTrackRef.current.style.width = `${value}%`;
  }, [value]);

  /**
   * Active is set whenever user has clicked on slider
   * and unset on mouse up or mouse leave
   */
  useEffect(() => {
    if (!active && activeTrackRef?.current) {
      //setPlayerVolume(value / 100);
      activeTrackRef.current.style.width = `${value}%`;
    }
  }, [active]);

  /**
   * Used to calculate value of slider based on mouse position
   * @param event
   */
  const handleUpdate = (event: MouseEvent) => {
    if (!sliderRef?.current) return;
    let slider = sliderRef.current.getBoundingClientRect();
    let mouseX = event.clientX - slider.x;
    setValue(
      Math.max(0, Math.min(100, Math.ceil((mouseX * 100) / slider.width)))
    );
  };

  return (
    <div
      ref={sliderRef}
      className={classes.slider}
      onMouseDown={(event) => {
        setActive(true);
        handleUpdate(event);
      }}
      onMouseUp={() => setActive(false)}
      onMouseMove={(event) => handleUpdate(event)}
      onMouseLeave={() => setActive(false)}
    >
      <div className={classes.slider__track}>
        <span ref={activeTrackRef} className={classes.track__left} />
      </div>
    </div>
  );
};

export default Slider;
