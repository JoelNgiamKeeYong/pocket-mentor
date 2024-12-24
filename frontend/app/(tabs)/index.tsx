import { SafeAreaView, StyleSheet } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

export default function HomeScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false); // New state for typing indicator

  // Initial message to show when the app starts
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer, how can I assist you today?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Open AI",
          avatar: require("@/assets/images/open-ai-logo.png"),
        },
      },
    ]);
  }, []);

  // Function to send user messages and get AI response from your server
  const sendMessageToOpenAI = async (userMessage: string) => {
    try {
      setIsTyping(true); // Show typing indicator when waiting for AI response

      const response = await axios.post("http://192.168.0.151:5000/chat", {
        message: userMessage,
      });

      const botMessage =
        response.data.message || "Sorry, I didn't understand that.";

      // Add the AI's response to the chat (after the user's message)
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [
          {
            _id: previousMessages.length + 2, // Ensure unique ID
            text: botMessage,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "Open AI",
              avatar: require("@/assets/images/open-ai-logo.png"),
            },
          },
        ])
      );
      setIsTyping(false); // Hide typing indicator after AI responds
    } catch (error) {
      console.error("Error sending message to OpenAI:", error);
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [
          {
            _id: previousMessages.length + 1,
            text: "Sorry, there was an issue with the AI service.",
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "Open AI",
            },
          },
        ])
      );
      setIsTyping(false); // Hide typing indicator on error
    }
  };

  const onSend = useCallback((messages: IMessage[] = []) => {
    const userMessage = messages[0]?.text;
    if (userMessage) {
      // Add the user's message to the chat
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );

      // Send the message to the AI
      sendMessageToOpenAI(userMessage);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: 1 }} // User ID
        alignTop={false}
        alwaysShowSend={false}
        isTyping={isTyping} // Show typing indicator when isTyping is true
        minComposerHeight={100}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Change to a neutral background color
  },
});
