export interface IncidentContext {
  slackChannels?: { slackChannelId: string; name: string }[];
  zoomCalls?: string[];
}

export interface Incident {
  incidentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  context?: IncidentContext;
  status: "open" | "closed";
}
