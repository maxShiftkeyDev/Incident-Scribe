// src/hooks/useIncidents.ts
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  addIncident,
  setIncidents,
  updateIncident,
  selectAllIncidents,
} from "../features/incidents/incidentSlice";
import type { Incident } from "../types/incident";
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
    async (id: string, updates: Partial<Incident>) => {
      try {
        const res = await axios.put(`${API_BASE}/incidents/${id}`, updates);
        dispatch(updateIncident({ id, changes: updates }));
        return res.data;
      } catch (err) {
        console.error("Failed to update incident", err);
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
  };
}
