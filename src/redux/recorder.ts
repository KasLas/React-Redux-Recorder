import { Action } from 'redux';
import { RootState } from './store';

interface RecorderState {
  dateStart: string;
}

// This actin will have two action types start and stop
const START = 'recorder/start';
const STOP = 'recorder/stop';

// Description of Action objects
type StartAction = Action<typeof START>;
type StopAction = Action<typeof STOP>;

// Action creators
export const stop = (): StopAction => ({
  type: STOP,
});

export const start = (): StartAction => ({
  type: START,
});

// initializes application with this state value
const initialState: RecorderState = {
  dateStart: '',
};

// selector function to get the current dateStart value from state
export const selectRecorderState = (rootState: RootState) => rootState.recorder;

export const selectDateStart = (rootState: RootState) =>
  selectRecorderState(rootState).dateStart;

const recorderReducer = (
  state: RecorderState = initialState,
  action: StartAction | StopAction
) => {
  switch (action.type) {
    case START:
      // when start action is invoked then is the states property dateStart overwritten
      return { ...state, dateStart: new Date().toISOString() };

    case STOP:
      return { ...state, dateStart: '' };

    default:
      return state;
  }
};

export default recorderReducer;
