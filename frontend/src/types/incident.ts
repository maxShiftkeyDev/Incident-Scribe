export interface Incident {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  context?: {
    slackChannels?: string[]; // store channel IDs
    zoomCalls?: string[];
  };
} 