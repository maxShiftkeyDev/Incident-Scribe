import { Container, Typography, Stack, Box } from "@mui/material";
import CreateIncidentButton from "../components/CreateIncidentButton";
import IncidentList from "../components/IncidentList";

const Home = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Stack spacing={4}>
      <Box>
        <Typography variant="h5" fontWeight={600}>
          Welcome to the Incident Manager
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track, document, and manage incident response with integrated context.
        </Typography>
      </Box>

      <Box>
        <CreateIncidentButton />
      </Box>

      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Recent Incidents
        </Typography>
        <IncidentList showHeading={false} maxHeight="300px" />
      </Box>
    </Stack>
  </Container>
);

export default Home;
