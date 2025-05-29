// src/components/CreateIncidentModal.tsx
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import IncidentForm from "./IncidentForm";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router";
import { useIncidents } from "../hooks/useIncidents";

export default function CreateIncidentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { createIncident } = useIncidents();
  const navigate = useNavigate();

  const handleCreate = async (data: { title: string; description: string }) => {
    const newIncident = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "open" as const,
    };

    try {
      await createIncident(newIncident); // Syncs with backend and dispatches
      onClose();
      navigate(`/incident/${newIncident.id}`);
    } catch (error) {
      console.error("Failed to create incident", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create a New Incident</DialogTitle>
      <DialogContent>
        <IncidentForm onSubmit={handleCreate} />
      </DialogContent>
    </Dialog>
  );
}
