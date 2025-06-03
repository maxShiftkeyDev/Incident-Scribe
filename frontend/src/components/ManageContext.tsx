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
import { useSlack } from "../hooks/useSlack";
import { useIncidents } from "../hooks/useIncidents";
import SlackLogo from "../assets/slack-logo.svg";

// ⚠️ Slack API shape: id + name
type SlackChannel = { id: string; name: string };

export default function ManageContext({ incidentId }: { incidentId: string }) {
  const theme = useTheme();

  // 🟢 Fetch incident from Redux
  const incident = useAppSelector((state) =>
    state.incidents.items.find((i) => i.incidentId === incidentId)
  );

  // 🟢 Slack channels from Redux (populated by hook)
  const { channels, fetchSlackChannels } = useSlack();

  // 🟢 Local state for selected IDs (incident context)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 🟢 Hook to update context in backend (DynamoDB)
  const { updateIncidentContextById } = useIncidents();

  // 🟢 Initialize selected IDs from incident context
  useEffect(() => {
    if (incident?.context?.slackChannels) {
      const ids = incident.context.slackChannels.map((c) => c.slackChannelId);
      setSelectedIds(ids);
    }
  }, [incident]);

  // 🟢 Fetch Slack channels on mount
  useEffect(() => {
    fetchSlackChannels();
  }, [fetchSlackChannels]);

  // 🟢 Handle selection change
  const handleChange = async (event: any) => {
    const newSelectedIds = event.target.value as string[];

    // Convert selected IDs to full Slack channel objects (with id + name)
    const selectedChannelObjects = channels
      .filter((c) => newSelectedIds.includes(c.id))
      .map((c) => ({
        slackChannelId: c.id,
        name: c.name,
      }));

    setSelectedIds(newSelectedIds);

    // Save to backend
    try {
      await updateIncidentContextById(incidentId, {
        slackChannels: selectedChannelObjects,
      });
    } catch (err) {
      console.error("Failed to persist context update", err);
    }
  };

  if (!incident) return null;

  // 🟢 Sort channels: selected first
  const sortedChannels = [
    ...channels.filter((c) => selectedIds.includes(c.id)),
    ...channels.filter((c) => !selectedIds.includes(c.id)),
  ];

  return (
    <Box mt={5}>
      <Typography variant="h5" gutterBottom>
        Manage Context
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Box display="flex" gap={4} flexWrap="wrap">
        {/* 🟢 Slack Section */}
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
                  .filter((c) => selected.includes(c.id))
                  .map((c) => `#${c.name}`)
                  .join(", ")
              }
            >
              {sortedChannels.map((channel) => (
                <MenuItem key={channel.id} value={channel.id}>
                  <Checkbox checked={selectedIds.includes(channel.id)} />
                  <ListItemText primary={`#${channel.name}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* 🟢 Zoom Section (Coming soon) */}
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
