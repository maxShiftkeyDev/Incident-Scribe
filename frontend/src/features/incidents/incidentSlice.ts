import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Incident, type IncidentContext } from "../../types/incident"; // ✅ use your shared types!

interface IncidentState {
  items: Incident[];
}

const initialState: IncidentState = {
  items: [],
};

const incidentSlice = createSlice({
  name: "incidents",
  initialState,
  reducers: {
    addIncident: (state, action: PayloadAction<Incident>) => {
      state.items.push(action.payload);
    },
    updateIncidentContext: (
      state,
      action: PayloadAction<{
        incidentId: string;
        context: Partial<IncidentContext>;
      }>
    ) => {
      const incident = state.items.find(
        (i) => i.incidentId === action.payload.incidentId
      );
      if (incident) {
        incident.context = {
          ...incident.context,
          ...action.payload.context,
        };
      }
    },
    updateIncidentStatus: (
      state,
      action: PayloadAction<{ incidentId: string; status: "open" | "closed" }>
    ) => {
      const incident = state.items.find(
        (i) => i.incidentId === action.payload.incidentId
      );
      if (incident) {
        incident.status = action.payload.status;
      }
    },
    setIncidents: (state, action: PayloadAction<Incident[]>) => {
      state.items = action.payload;
    },
    updateIncident: (
      state,
      action: PayloadAction<{ incidentId: string; changes: Partial<Incident> }>
    ) => {
      const incident = state.items.find(
        (i) => i.incidentId === action.payload.incidentId
      );
      if (incident) {
        Object.assign(incident, action.payload.changes);
      }
    },
  },
});

export const {
  addIncident,
  updateIncidentContext,
  updateIncidentStatus,
  setIncidents,
  updateIncident,
} = incidentSlice.actions;

export default incidentSlice.reducer;
export const selectAllIncidents = (state: { incidents: IncidentState }) =>
  state.incidents.items;
