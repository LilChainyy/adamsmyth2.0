import { create } from "zustand";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

type ChatState = {
  messages: Message[];
  isResponding: boolean;
  addMessage: (role: Message["role"], content: string) => void;
  setResponding: (value: boolean) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isResponding: false,
  addMessage: (role, content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: crypto.randomUUID(),
          role,
          content,
          createdAt: new Date(),
        },
      ],
    })),
  setResponding: (value) => set({ isResponding: value }),
  clearMessages: () => set({ messages: [] }),
}));
