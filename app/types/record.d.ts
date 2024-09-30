type Message = {
  sender: string | null;
  systemResponse: string;
  id: string;
};

type MenuItem = {
  text: string;
  link: string;
  icon: JSX.Element;
  freTier: boolean;
};

type AllConversationResponse = {
  sender: string;
  conversationId: number;
};

type MessageResponse = {
  id: string;
  sender: string;
  systemResponse: string;
  conversationId: string;
  createdAt: string;
};

type InputNewMessage = {
  conversationId: string | null;
  message: {
    sender: string;
    systemResponse: string | null;
    id: string;
  };
};
