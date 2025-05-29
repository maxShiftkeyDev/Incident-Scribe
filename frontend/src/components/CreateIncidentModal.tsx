// src/components/CreateIncidentModal.tsx
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import IncidentForm from "./IncidentForm";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addIncident } from "../features/incidents/incidentSlice";

export default function CreateIncidentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreate = (data: { title: string; description: string }) => {
    const newIncident = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "open",
    };

    dispatch(addIncident(newIncident)); // Save to Redux
    onClose();
    navigate(`/incident/${newIncident.id}`);
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
