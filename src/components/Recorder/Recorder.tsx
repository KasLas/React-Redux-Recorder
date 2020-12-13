import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectDateStart, start, stop } from '../../redux/recorder';
import './Recorder.css';
import cx from 'classnames';

// function for adding a zero
const addZero = (num: number) => (num < 10 ? `0${num}` : `${num}`);

const Recorder = () => {
  // Get dispatch action from react-redux;
  const dispatch = useDispatch();

  // get selector
  const dateStart = useSelector(selectDateStart);

  // boolean value for finding out if recorder is started
  const started = !!dateStart;

  // variable to store the 1 second interval for timer rerender
  let interval = useRef<number>();

  // useStae usage for updating count of rerenders
  const [, setCount] = useState<number>(0);

  const handleClick = () => {
    if (started) {
      window.clearInterval(interval.current);
      dispatch(stop());
    } else {
      dispatch(start());
      interval.current = window.setInterval(() => {
        setCount((count) => count + 1);
      }, 1000);
    }
  };

  // useEffect for clearing the values and preventing memory leak
  useEffect(() => {
    return () => {
      window.clearInterval(interval.current);
    };
  }, []);

  // calculations for displaying seconds, minutes, hours

  let seconds = started
    ? Math.floor((Date.now() - new Date(dateStart).getTime()) / 1000)
    : 0;
  const hours = seconds ? Math.floor(seconds / 60 / 60) : 0;
  seconds -= hours * 60 * 60;
  const minutes = seconds ? Math.floor(seconds / 60) : 0;
  seconds -= minutes * 60;

  return (
    <div className={cx('recorder', { 'recorder-started': started })}>
      <button onClick={handleClick} className="recorder-record">
        <span></span>
      </button>
      <div className="recorder-counter">
        {addZero(hours)}:{addZero(minutes)}:{addZero(seconds)}
      </div>
    </div>
  );
};

export default Recorder;
