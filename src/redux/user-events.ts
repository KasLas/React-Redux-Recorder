import { Action, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './store';

export interface UserEvent {
  id: number;
  title: string;
  dateStart: string;
  dateEnd: string;
}

interface UserEventsState {
  byIds: Record<UserEvent['id'], UserEvent>;
  allIds: UserEvent['id'][];
}

// 1. Create Action type
const LOAD_REQUEST = 'userEvents/load_request';
const LOAD_SUCCESS = 'userEvents/load_success';
const LOAD_FAILURE = 'userEvents/load_failure';

// 2. Create Action
interface LoadRequestAction extends Action<typeof LOAD_REQUEST> {}
interface LoadRequestFailureAction extends Action<typeof LOAD_FAILURE> {
  error: string;
}
interface LoadRequestSuccessAction extends Action<typeof LOAD_SUCCESS> {
  payload: {
    events: UserEvent[];
  };
}

// 3. Dispatch load request action
export const loadUserEvents = (): ThunkAction<
  void,
  RootState,
  undefined,
  LoadRequestAction | LoadRequestSuccessAction | LoadRequestFailureAction
> => async (dispatch, getState) => {
  dispatch({
    type: LOAD_REQUEST,
  });

  // fetch data from json server
  try {
    const response = await fetch('http://localhost:3001/events');
    const events: UserEvent[] = await response.json();

    dispatch({
      type: LOAD_SUCCESS,
      payload: {
        events,
      },
    });
  } catch (e) {
    dispatch({
      type: LOAD_FAILURE,
      error: 'Failed to load user events.',
    });
  }
};

// Selector function for accessing userEvents part of the rootState
const selectUserEventsState = (rootState: RootState) => rootState.userEvents;

// Selector for userEvents
export const selectUserEventsArray = (rootState: RootState) => {
  const state = selectUserEventsState(rootState);
  return state.allIds.map((id) => state.byIds[id]);
};

const initialState: UserEventsState = {
  byIds: {},
  allIds: [],
};

const userEventsReducer = (
  state: UserEventsState = initialState,
  action: LoadRequestSuccessAction
) => {
  switch (action.type) {
    case LOAD_SUCCESS:
      const { events } = action.payload;

      return {
        ...state,
        allIds: events.map(({ id }) => id),
        byIds: events.reduce<UserEventsState['byIds']>((byIds, event) => {
          byIds[event.id] = event;
          return byIds;
        }, {}),
      };
    default:
      return state;
  }
};

export default userEventsReducer;
