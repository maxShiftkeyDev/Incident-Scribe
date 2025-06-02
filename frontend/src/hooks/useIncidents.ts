import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  addIncident,
  setIncidents,
  updateIncident,
  updateIncidentStatus,
  selectAllIncidents,
} from "../features/incidents/incidentSlice";
import type { Incident, IncidentContext } from "../types/incident";
import axios from "axios";

const API_BASE = "https://li97gzptaj.execute-api.us-east-1.amazonaws.com/Prod";

export function useIncidents() {
  const dispatch = useDispatch();
  const incidents = useSelector(selectAllIncidents);

  const fetchIncidents = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/incidents`);
      dispatch(setIncidents(res.data));
    } catch (err) {
      console.error("Failed to fetch incidents", err);
    }
  }, [dispatch]);

  const createIncident = useCallback(
    async (incident: Incident) => {
      try {
        const res = await axios.post(`${API_BASE}/incidents`, incident);
        dispatch(addIncident(incident));
        return res.data;
      } catch (err) {
        console.error("Failed to create incident", err);
        throw err;
      }
    },
    [dispatch]
  );

  const updateIncidentById = useCallback(
    async (incidentId: string, updates: Partial<Incident>) => {
      try {
        const res = await axios.put(
          `${API_BASE}/incidents/${incidentId}`,
          updates
        );
        dispatch(updateIncident({ incidentId, changes: updates }));
        return res.data;
      } catch (err) {
        console.error("Failed to update incident", err);
        throw err;
      }
    },
    [dispatch]
  );

  const updateIncidentStatusById = useCallback(
    async (incidentId: string, status: "open" | "closed") => {
      try {
        // PUT request to the new backend endpoint
        const res = await axios.put(
          `${API_BASE}/incidents/${incidentId}/status`,
          { status }
        );

        // Update Redux state
        dispatch(updateIncidentStatus({ incidentId, status }));
        return res.data;
      } catch (err) {
        console.error("Failed to update incident status", err);
        throw err;
      }
    },
    [dispatch]
  );

  const updateIncidentContextById = useCallback(
    async (incidentId: string, context: Partial<IncidentContext>) => {
      try {
        const res = await axios.put(
          `${API_BASE}/incidents/${incidentId}/context`,
          { context }
        );

        // Update Redux state with fresh context from backend
        dispatch(
          updateIncident({
            incidentId,
            changes: { context: res.data.context },
          })
        );

        return res.data;
      } catch (err) {
        console.error("Failed to update incident context", err);
        throw err;
      }
    },
    [dispatch]
  );

  return {
    incidents,
    fetchIncidents,
    createIncident,
    updateIncidentById,
    updateIncidentContextById,
    updateIncidentStatusById, // Added!
  };
}
