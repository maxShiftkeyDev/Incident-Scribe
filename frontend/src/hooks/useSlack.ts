// src/hooks/useSlack.ts
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import axios from "axios";
import {
  setSlackChannels,
  selectSlackChannels,
} from "../features/slack/slackSlice";

const API_BASE = "https://li97gzptaj.execute-api.us-east-1.amazonaws.com/Prod";

export function useSlack() {
  const dispatch = useDispatch();
  const channels = useSelector(selectSlackChannels);

  const fetchSlackChannels = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/integrations/slack/channels`);
      dispatch(setSlackChannels(res.data.channels));
    } catch (err) {
      console.error("Failed to fetch Slack channels", err);
    }
  }, [dispatch]);

  return {
    channels,
    fetchSlackChannels,
  };
}
