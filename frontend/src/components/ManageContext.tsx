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
  import { useAppDispatch, useAppSelector } from "../hooks";
  import { updateIncidentContext } from "../features/incidents/incidentSlice";
  import SlackLogo from "../assets/slack-logo.svg";
  
  type SlackChannel = { id: string; name: string };
  
  export default function ManageContext({ incidentId }: { incidentId: string }) {
    const dispatch = useAppDispatch();
    const theme = useTheme();
  
    const incident = useAppSelector((state) =>
      state.incidents.items.find((i) => i.id === incidentId)
    );
  
    const [channels, setChannels] = useState<SlackChannel[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>(
      incident?.context?.slackChannels ?? []
    );
  
    const handleChange = (event: any) => {
      const selected = event.target.value;
      setSelectedIds(selected);
      dispatch(
        updateIncidentContext({
          id: incidentId,
          context: { slackChannels: selected },
        })
      );
    };
  
    useEffect(() => {
      const mockChannels = [
        { id: "C01", name: "engineering" },
        { id: "C02", name: "product" },
        { id: "C03", name: "support" },
        { id: "C04", name: "ai-ops" },
        { id: "C05", name: "security" },
      ];
      setChannels(mockChannels);
    }, []);
  
    if (!incident) return null;
  
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
              <Avatar src={SlackLogo} alt="Slack" variant="square" sx={{ width: 24, height: 24 }} />
              <Typography variant="h6" fontWeight={600}>
                Slack Channels
              </Typography>
            </Box>
  
            <FormControl fullWidth variant="outlined">
              <InputLabel id="slack-channel-label">Select Slack Channels</InputLabel>
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
  