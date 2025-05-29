import {
  Box,
  Typography,
  Stack,
  Container,
  Divider,
  Chip,
  Button,
} from "@mui/material";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateIncidentStatus } from "../features/incidents/incidentSlice";
import ManageContext from "../components/ManageContext";

const IncidentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const incident = useAppSelector((state) =>
    state.incidents.items.find((i) => i.id === id)
  );

  useEffect(() => {
    console.group("Incident Detail Debug");
    console.log("Selected Incident ID:", id);
    console.log("Incident:", incident);
    console.groupEnd();
  }, [id, incident]);

  if (!incident) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" color="error">
          Incident not found
        </Typography>
      </Container>
    );
  }

  const handleCloseIncident = () => {
    dispatch(updateIncidentStatus({ id: incident.id, status: "closed" }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Header Row */}
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {incident.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Created {new Date(incident.createdAt).toLocaleString()}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
  <Chip
    label={incident.status}
    color={incident.status === "open" ? "success" : "error"}
    variant="outlined"
    size="small"
  />
  {incident.status === "open" && (
    <Button
      variant="outlined"
      color="error"
      size="small"
      onClick={handleCloseIncident}
    >
      Close Incident
    </Button>
  )}
</Box>

        </Box>

        <Divider />

        {/* Description */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" color="text.primary">
            {incident.description}
          </Typography>
        </Box>

        {/* Context Section */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Context
          </Typography>
          <ManageContext incidentId={incident.id} />
        </Box>
      </Stack>
    </Container>
  );
};

export default IncidentDetail;
