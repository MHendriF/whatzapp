import { messages } from "@/dummy-data/db";
import ChatBubble from "./ChatBubble";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/ChatStore";

const MessageContainer = () => {
  const { selectedConversation } = useConversationStore();
  const messages = useQuery(api.messages.getMessages, {
    conversation: selectedConversation?._id!,
  });
  const me = useQuery(api.users.getMe);
  console.log("🚀 ~ MessageContainer ~ messages:", messages);

  return (
    <div className="relative p-3 flex-1 overflow-auto h-full bg-chat-tile-light dark:bg-chat-tile-dark">
      <div className="mx-12 flex flex-col gap-3 h-full">
        {messages?.map((message, idx) => (
          <div key={message._id}>
            <ChatBubble message={message} me={me} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default MessageContainer;
