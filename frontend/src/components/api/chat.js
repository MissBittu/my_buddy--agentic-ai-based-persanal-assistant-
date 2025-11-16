import axios from "axios";

export async function sendChatMessage(content) {
  const res = await axios.post("/api/v1/chat/message", {
    content,
  });
  return res.data;
}
