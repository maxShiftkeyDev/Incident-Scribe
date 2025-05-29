import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Incident {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: "open" | "closed";
  context?: {
    slackChannels?: string[]; // store channel IDs
    zoomCalls?: string[];
  };
}

interface IncidentState {
  items: Incident[];
}

const initialState: IncidentState = {
  items: [],
};

const incidentSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    addIncident: (state, action: PayloadAction<Incident>) => {
      state.items.push(action.payload);
    },
    updateIncidentContext: (
      state,
      action: PayloadAction<{
        id: string;
        context: Partial<Incident["context"]>;
      }>
    ) => {
      const incident = state.items.find((i) => i.id === action.payload.id);
      if (incident) {
        incident.context = {
          ...incident.context,
          ...action.payload.context,
        };
      }
    },
    updateIncidentStatus: (
      state,
      action: PayloadAction<{ id: string; status: "open" | "closed" }>
    ) => {
      const incident = state.items.find((i) => i.id === action.payload.id);
      if (incident) {
        incident.status = action.payload.status;
      }
    },
    // You can add more reducers here for editing/removing incidents
  },

});



export const { addIncident, updateIncidentContext, updateIncidentStatus } = incidentSlice.actions;
export default incidentSlice.reducer;
