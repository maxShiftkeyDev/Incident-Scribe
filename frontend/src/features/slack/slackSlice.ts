// src/features/slack/slackSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SlackChannel {
  id: string;
  name: string;
}

interface SlackState {
  channels: SlackChannel[];
}

const initialState: SlackState = {
  channels: [],
};

const slackSlice = createSlice({
  name: "slack",
  initialState,
  reducers: {
    setSlackChannels: (state, action: PayloadAction<SlackChannel[]>) => {
      state.channels = action.payload;
    },
  },
});

export const { setSlackChannels } = slackSlice.actions;
export default slackSlice.reducer;

export const selectSlackChannels = (state: { slack: SlackState }) =>
  state.slack.channels;
