// src/components/CreateIncidentButton.tsx
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CreateIncidentModal from "./CreateIncidentModal";

const CreateIncidentButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Create Incident
      </Button>
      <CreateIncidentModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default CreateIncidentButton;
