import { Box } from "@mui/material";
import { useParams } from "react-router";

const IncidentDetail: React.FC = () => {
  const { id } = useParams();

  return (
    <Box>
      <h1>Incident Detail</h1>
      <p>Viewing details for incident ID: {id}</p>
    </Box>
  );
};

export default IncidentDetail;
