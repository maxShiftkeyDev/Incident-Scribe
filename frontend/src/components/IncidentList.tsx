import {
    Box,
    Typography,
    List,
    ListItemButton,
    Divider,
    Paper,
    Chip,
    Avatar,
  } from "@mui/material";
  import { useAppSelector } from "../hooks";
  import { useNavigate } from "react-router-dom";
  import SlackLogo from "../assets/slack-logo.svg";
  import ZoomLogo from "../assets/zoom-logo.svg";
  
  interface IncidentListProps {
    maxHeight?: string; // optional override for scroll container
    showHeading?: boolean;
  }
  
  const MAX_DESC_LENGTH = 100;
  
  const IncidentList: React.FC<IncidentListProps> = ({
    maxHeight = "70vh",
    showHeading = true,
  }) => {
    const incidents = useAppSelector((state) => state.incidents.items);
    const navigate = useNavigate();
  
    const sortedIncidents = [...incidents].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  
    return (
      <Paper variant="outlined" sx={{ maxHeight, overflowY: "auto" }}>
        {showHeading && (
          <Box
            display="flex"
            px={2}
            py={1}
            bgcolor="grey.100"
            borderBottom="1px solid"
            borderColor="divider"
            sx={{ fontWeight: 500 }}
          >
            <Box flex={2}><Typography variant="caption">Title</Typography></Box>
            <Box flex={3}><Typography variant="caption">Description</Typography></Box>
            <Box flex={1}><Typography variant="caption">Context</Typography></Box>
            <Box flex={1}><Typography variant="caption">Status</Typography></Box>
            <Box flex={1} textAlign="right"><Typography variant="caption">Created At</Typography></Box>
          </Box>
        )}
  
        <List disablePadding>
          {sortedIncidents.map((incident, index) => {
            const contextIcons = [];
  
            if (incident.context?.slackChannels?.length) {
              contextIcons.push(
                <Avatar key="slack" src={SlackLogo} alt="Slack" variant="square" sx={{ width: 20, height: 20 }} />
              );
            }
            if (incident.context?.zoomCalls?.length) {
              contextIcons.push(
                <Avatar key="zoom" src={ZoomLogo} alt="Zoom" variant="square" sx={{ width: 20, height: 20 }} />
              );
            }
  
            return (
              <Box key={incident.id}>
                <ListItemButton onClick={() => navigate(`/incident/${incident.id}`)} sx={{ py: 2, px: 2 }}>
                  <Box display="flex" alignItems="center" width="100%" gap={2}>
                    <Box flex={2}>
                      <Typography variant="subtitle2">{incident.title}</Typography>
                    </Box>
                    <Box flex={3}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {incident.description.length > MAX_DESC_LENGTH
                          ? `${incident.description.slice(0, MAX_DESC_LENGTH)}...`
                          : incident.description}
                      </Typography>
                    </Box>
                    <Box flex={1} display="flex" gap={0.5}>{contextIcons}</Box>
                    <Box flex={1}>
                      <Chip
                        label={incident.status}
                        size="small"
                        variant="outlined"
                        color={incident.status === "open" ? "success" : "error"}
                      />
                    </Box>
                    <Box flex={1} textAlign="right">
                      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                        {new Date(incident.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </ListItemButton>
                {index < sortedIncidents.length - 1 && <Divider />}
              </Box>
            );
          })}
        </List>
      </Paper>
    );
  };
  
  export default IncidentList;
  