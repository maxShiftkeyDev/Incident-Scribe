// https://react-redux.js.org/using-react-redux/usage-with-typescript
import { configureStore } from "@reduxjs/toolkit";
import incidentReducer from "./features/incidents/incidentSlice";
import slackReducer from "./features/slack/slackSlice";

// For now, empty reducer — you'll add slices later
export const store = configureStore({
  reducer: {
    incidents: incidentReducer,
    slack: slackReducer,
  },
});

// Inferred types for usage in your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
