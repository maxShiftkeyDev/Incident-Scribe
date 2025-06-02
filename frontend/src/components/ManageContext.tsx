import {
  Box,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Paper,
  Avatar,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks";
import { useIncidents } from "../hooks/useIncidents";
import SlackLogo from "../assets/slack-logo.svg";

type SlackChannel = { slackChannelId: string; name: string };

export default function ManageContext({ incidentId }: { incidentId: string }) {
  const theme = useTheme();

  // Fetch incident from Redux
  const incident = useAppSelector((state) =>
    state.incidents.items.find((i) => i.incidentId === incidentId)
  );

  // Local UI state
  const [channels, setChannels] = useState<SlackChannel[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Import the hook to call backend updates
  const { updateIncidentContextById } = useIncidents();

  // Initialize selected IDs from incident context
  useEffect(() => {
    if (incident?.context?.slackChannels) {
      const ids = incident.context.slackChannels.map((c) => c.slackChannelId);
      setSelectedIds(ids);
    }
  }, [incident]);

  // Mock channels - Replace with actual API call in production
  useEffect(() => {
    const mockChannels: SlackChannel[] = [
      { slackChannelId: "C01", name: "engineering" },
      { slackChannelId: "C02", name: "product" },
      { slackChannelId: "C03", name: "support" },
      { slackChannelId: "C04", name: "ai-ops" },
      { slackChannelId: "C05", name: "security" },
    ];
    setChannels(mockChannels);
  }, []);

  // Handle selection change
  const handleChange = async (event: any) => {
    const newSelectedIds = event.target.value as string[];

    // Get full objects for selected channels
    const selectedChannelObjects = channels.filter((c) =>
      newSelectedIds.includes(c.slackChannelId)
    );

    setSelectedIds(newSelectedIds);

    // Save to backend (DynamoDB) via API
    try {
      await updateIncidentContextById(incidentId, {
        slackChannels: selectedChannelObjects,
      });
    } catch (err) {
      console.error("Failed to persist context update", err);
      // Optionally: show error message to user
    }
  };

  if (!incident) return null;

  // Sort channels: selected ones first
  const sortedChannels = [
    ...channels.filter((c) => selectedIds.includes(c.slackChannelId)),
    ...channels.filter((c) => !selectedIds.includes(c.slackChannelId)),
  ];

  return (
    <Box mt={5}>
      <Typography variant="h5" gutterBottom>
        Manage Context
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Box display="flex" gap={4} flexWrap="wrap">
        {/* Slack Section */}
        <Paper
          elevation={1}
          sx={{
            flex: 1,
            minWidth: 300,
            p: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Avatar
              src={SlackLogo}
              alt="Slack"
              variant="square"
              sx={{ width: 24, height: 24 }}
            />
            <Typography variant="h6" fontWeight={600}>
              Slack Channels
            </Typography>
          </Box>

          <FormControl fullWidth variant="outlined">
            <InputLabel id="slack-channel-label">
              Select Slack Channels
            </InputLabel>
            <Select
              labelId="slack-channel-label"
              label="Select Slack Channels"
              multiple
              value={selectedIds}
              onChange={handleChange}
              renderValue={(selected) =>
                sortedChannels
                  .filter((c) => selected.includes(c.slackChannelId))
                  .map((c) => `#${c.name}`)
                  .join(", ")
              }
            >
              {sortedChannels.map((channel) => (
                <MenuItem
                  key={channel.slackChannelId}
                  value={channel.slackChannelId}
                >
                  <Checkbox
                    checked={selectedIds.includes(channel.slackChannelId)}
                  />
                  <ListItemText primary={`#${channel.name}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* Zoom Section */}
        <Paper
          elevation={1}
          sx={{
            flex: 1,
            minWidth: 300,
            p: 3,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Zoom Calls
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (Coming soon)
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
