"use client";

import Script from "next/script";

export const BotpressProvider = () => {
  const initBotpress = () => {
    // @ts-ignore
    window.botpressWebChat.init({
      composerPlaceholder: "Chat with AI bot",
      botConversationDescription:
        "This AI bot will answer your all queries about this project",
      botId: "11bf25ef-2941-49e9-b7bf-79f381b52e55",
      hostUrl: "https://cdn.botpress.cloud/webchat/v1",
      messagingUrl: "https://messaging.botpress.cloud",
      clientId: "11bf25ef-2941-49e9-b7bf-79f381b52e55",
      webhookId: "bf92045c-0fe6-490d-8aa5-8c3dff43e8a8",
      botName: "SS Bot AI",
      avatarUrl: "https://github.com/SpeedOut-Source/ss/assets/43641536/806ecb6a-830d-42bc-b10a-75d8cc6fabcf" 
    });
  };

  return (
    <>
    <Script
      src="https://cdn.botpress.cloud/webchat/v1/inject.js"
      onLoad={() => {
        initBotpress();
      }}
      />
      </>
  );
};
