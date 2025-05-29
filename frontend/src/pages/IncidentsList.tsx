import { Container, Stack, Typography, Box } from "@mui/material";
import IncidentList from "../components/IncidentList";

const IncidentsListPage = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" fontWeight={600}>Past Incidents</Typography>
        <Typography variant="body2" color="text.secondary">
          Click any incident to view full details and manage its context.
        </Typography>
      </Box>
      <IncidentList />
    </Stack>
  </Container>
);

export default IncidentsListPage;
