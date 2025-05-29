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
    setIncidents: (state, action: PayloadAction<Incident[]>) => {
      state.items = action.payload;
    },
    updateIncident: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<Incident> }>
    ) => {
      const incident = state.items.find((i) => i.id === action.payload.id);
      if (incident) {
        Object.assign(incident, action.payload.changes);
      }
    },
  },

});



export const { addIncident, updateIncidentContext, updateIncidentStatus, setIncidents, updateIncident } = incidentSlice.actions;
export default incidentSlice.reducer;
export const selectAllIncidents = (state: { incidents: IncidentState }) => state.incidents.items;

