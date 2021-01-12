import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const initalState = {
  items: { default: { items: [], nextPageToken: "" } },
  current: "default",
  loading: false
};

function videos(state = initalState, action) {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.current]: {
            items: [
              ...(state.items[action.payload.current]?.items || []),
              ...(action.payload.items[action.payload.current].items || [])
            ],
            nextPageToken:
              action.payload.items[action.payload.current].nextPageToken
          }
        },
        current: action.payload.current
      };
    case "GET":
      return {
        ...state,
        current: action.payload.current
      };
    case "LOADING":
      return {
        ...state,
        loading: action.payload.loading
      };
    default:
      return state;
  }
}

export const store = createStore(videos, applyMiddleware(thunk));
