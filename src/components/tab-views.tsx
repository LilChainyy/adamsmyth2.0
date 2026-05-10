"use client";

import { usePathname } from "next/navigation";
import { ChatContainer } from "@/components/chat/chat-container";
import { PortfolioOverview } from "@/components/progress/PortfolioOverview";

export function TabViews() {
  const pathname = usePathname();
  const isChat = pathname.startsWith("/chat");

  return (
    <>
      <div className={isChat ? "flex flex-1 flex-col" : "hidden"}>
        <ChatContainer />
      </div>
      <div className={!isChat ? "flex flex-1 flex-col" : "hidden"}>
        <PortfolioOverview />
      </div>
    </>
  );
}
