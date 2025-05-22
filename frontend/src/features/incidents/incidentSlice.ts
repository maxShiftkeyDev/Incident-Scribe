// src/features/incidents/incidentSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Incident } from '../../types/incident';

const incidentSlice = createSlice({
  name: 'incidents',
  initialState: [] as Incident[],
  reducers: {
    addIncident(state, action: PayloadAction<Incident>) {
      state.push(action.payload);
    },
  },
});

export const { addIncident } = incidentSlice.actions;
export default incidentSlice.reducer;
