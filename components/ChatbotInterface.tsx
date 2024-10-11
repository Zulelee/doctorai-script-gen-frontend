"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import {
  Copy,
  Check,
  Forward,
  Menu,
  Plus,
  User,
  Bot,
  Command,
} from "lucide-react";
import { motion } from "framer-motion";

interface Chat {
  _id: string;
  timestamp: number;
  initial_message?: string;
}

interface Message {
  _id: string;
  message: string;
  message_type: "user" | "agent1" | "agent2";
  category: "script" | "set" | "text";
  timestamp: number;
  chat_id: string;
}

interface Ideation {
  _id: string;
  initial_input: string;
  ideation_result?: string;
  research_result?: string;
  timestamp?: number;
}

interface Script {
  _id: string;
  ideation_id: string;
  initial_input: string;
  script: string;
  mr_beast_score: string;
  george_blackman_score: string;
}

const COMMANDS = [
  {
    command: "/scripts",
    description: "Fetch scripts for the current ideation",
  },
  { command: "/sets", description: "Display sets for the current ideation" },
  { command: "/script", description: "Generate a script for a specific set" },
  { command: "/output", description: "Start the ideation process" },
  { command: "/modify", description: "Modify an existing script" },
];

export default function ChatbotInterface() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [currentIdeation, setCurrentIdeation] = useState<Ideation | null>(null);
  const [expandedMessages, setExpandedMessages] = useState<{
    [key: string]: boolean;
  }>({});

  const [scripts, setScripts] = useState<Script[]>([]);
  const [activeTab, setActiveTab] = useState<
    "initial_input" | "script" | "mr_beast_score" | "george_blackman_score"
  >("initial_input");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkSession();
    const intervalId = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/users/sessions/latest`
      );
      const data = await response.json();
      if (data.success) {
        const expiryTime = new Date(data.expiry).getTime();
        if (expiryTime < Date.now()) {
          setSessionExpired(true);
        }
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const envUsername = process.env.NEXT_PUBLIC_USERNAME;
      const envPassword = process.env.NEXT_PUBLIC_PASSWORD;

      if (envUsername == username && envPassword == password) {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/users/sessions`, {
          method: "POST",
        });
        setSessionExpired(false);
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  const fetchChats = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/users/get_all_chats`
      );
      const data = await response.json();
      if (data.success) {
        setChats(data.data);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const selectChat = async (chatId: string) => {
    const chat = chats.find((c) => c._id === chatId);
    if (chat) {
      setSelectedChat(chat);
      await fetchMessages(chatId);

      if (!currentIdeation) {
        await fetchIdeation(chatId);
      }
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/users/get_messages_by_chat/${chatId}`
      );
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchIdeation = async (chatId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/users/get_ideation/${chatId}`
      );
      const data = await response.json();
      if (data.success) {
        if (data.data) {
          setCurrentIdeation(data.data);
        } else {
          setCurrentIdeation(null);
        }
      }
    } catch (error) {
      console.error("Error fetching Ideation:", error);
      setCurrentIdeation(null);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedChat) return;

    const timestamp = Date.now() / 1000;

    try {
      if (messages.length <= 1) {
        await updateChatInitialMessage(selectedChat._id, inputMessage);
      }
      await saveMessage(
        inputMessage,
        "user",
        "text",
        timestamp,
        selectedChat._id
      );

      await fetchMessages(selectedChat._id);

      setLoading(true);

      if (inputMessage.startsWith("/")) {
        await handleCommand(inputMessage);
      } else {
        const agentResponse = await getAgentResponse(inputMessage);
        await saveMessage(
          agentResponse,
          "agent1",
          "text",
          Date.now() / 1000,
          selectedChat._id
        );
      }

      await fetchMessages(selectedChat._id);
      setInputMessage("");
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateChatInitialMessage = async (chatId: string, message: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/users/update_chat/${chatId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initial_message: message }),
        }
      );
      await fetchChats();
    } catch (error) {
      console.error("Error updating chat:", error);
    }
  };

  const saveMessage = async (
    message: string,
    messageType: "user" | "agent1" | "agent2",
    category: "script" | "set" | "text",
    timestamp: number,
    chatId: string
  ) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/users/save_message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          message_type: messageType,
          timestamp: timestamp,
          category: category,
          chat_id: chatId,
        }),
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const getAgentResponse = async (question: string): Promise<string> => {
    try {
      const response = await fetch(
        "https://flowise-webmed-v1-18-07-2024.onrender.com/api/v1/prediction/0d5e4539-2761-46bc-a59b-5b105412b660",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: question,
            overrideConfig: {
              sessionId: selectedChat?._id,
            },
          }),
        }
      );
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("Error getting agent response:", error);
      return "Sorry, I couldn't process your request.";
    }
  };

  const handleCommand = async (command: string) => {
    const [cmd, ...args] = command.split(" ");

    switch (cmd) {
      case "/scripts":
        await fetchScripts();
        break;
      case "/sets":
        await displaySets();
        break;
      case "/script":
        if (args[0]) {
          await generateScript(parseInt(args[0]));
        } else {
          throw new Error(
            "Please specify a set number for the script generation."
          );
        }
        break;
      case "/output":
        await handleOutputCommand(cmd);
        break;
      case "/modify":
        if (args.length >= 2) {
          const scriptIndex = parseInt(args[0]) - 1;
          const modificationPrompt = args.slice(1).join(" ");
          await modifyScript(scriptIndex, modificationPrompt);
        } else {
          throw new Error(
            "Please specify a script number and modification prompt. Usage: /modify [script_number] [modification_prompt]"
          );
        }
        break;
      default:
        throw new Error(
          "Unknown command. Available commands are /scripts, /sets, /new_ideation, /script [set_number], and /output."
        );
    }
  };
  const modifyScript = async (
    scriptIndex: number,
    modificationPrompt: string
  ) => {
    if (!currentIdeation || !selectedChat) {
      await saveMessage(
        "No ideation selected. Please create a new ideation first.",
        "agent2",
        "text",
        Date.now() / 1000,
        selectedChat!._id
      );
      return;
    }

    if (scriptIndex < 0 || scriptIndex >= scripts.length) {
      await saveMessage(
        `Invalid script number. Please choose a number between 1 and ${scripts.length}.`,
        "agent2",
        "text",
        Date.now() / 1000,
        selectedChat._id
      );
      return;
    }

    const scriptToModify = scripts[scriptIndex];
    console.log("The script it");
    console.log(scriptToModify.script);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/users/modify_script`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            script: scriptToModify.script,
            modification_prompt: modificationPrompt,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        const modifiedScript = data.script;
        await saveMessage(
          `Modified Script:\n${modifiedScript}`,
          "agent2",
          "text",
          Date.now() / 1000,
          selectedChat._id
        );
        await fetchMessages(selectedChat._id);
      } else {
        throw new Error("Failed to modify script.");
      }
    } catch (error) {
      console.error("Error modifying script:", error);
      await saveMessage(
        "Error modifying script.",
        "agent2",
        "text",
        Date.now() / 1000,
        selectedChat._id
      );
    }
  };
  const handleOutputCommand = async (message: string) => {
    if (!selectedChat) return;

    try {
      const agent1Response = await getAgentResponse(message);

      if (agent1Response) {
        await saveMessage(
          `Output:\n${agent1Response}`,
          "agent1",
          "text",
          Date.now() / 1000,
          selectedChat._id
        );
        await fetchMessages(selectedChat._id);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/users/execute_agent_teams`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            initial_input: agent1Response,
            chat_id: selectedChat._id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        const ideationResult = data.ideation_result;
        const researchResult = data.research_result;
        const ideationId = data.ideation_id;
        await saveMessage(
          `Ideation & Research Completed! Enter the /sets command to view the sets`,
          "agent2",
          "text",
          Date.now() / 1000,
          selectedChat._id
        );

        setCurrentIdeation({
          _id: ideationId,
          initial_input: agent1Response,
          ideation_result: ideationResult,
          research_result: researchResult,
          timestamp: Date.now() / 1000,
        });
      } else {
        throw new Error("Failed to process the output command.");
      }
    } catch (error) {
      console.error("Error processing output command:", error);
      await saveMessage(
        "Error processing the output command.",
        "agent2",
        "text",
        Date.now() / 1000,
        selectedChat._id
      );
    }
  };

  const fetchScripts = async () => {
    if (!currentIdeation || !selectedChat) {
      await saveMessage(
        "No ideation selected. Please create a new ideation first.",
        "agent2",
        "text",
        Date.now() / 1000,
        selectedChat!._id
      );
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/users/get_scripts_by_ideation/${currentIdeation._id}&&${selectedChat._id}`
      );
      const data = await response.json();

      if (data.success) {
        setScripts(data.data);
        const scriptMessages = data.data.map((script: Script) => ({
          _id: script._id,
          message: `${script.script}`,
          message_type: "agent2" as const,
          timestamp: Date.now() / 1000,
          chat_id: selectedChat._id,
        }));

        for (const message of scriptMessages) {
          await saveMessage(
            message.message,
            message.message_type,
            "script",
            message.timestamp,
            message.chat_id
          );
        }

        await fetchMessages(selectedChat._id);
      } else {
        throw new Error("Failed to fetch scripts.");
      }
    } catch (error) {
      console.error("Error fetching scripts:", error);
      await saveMessage(
        "Error fetching scripts.",
        "agent2",
        "text",
        Date.now() / 1000,
        selectedChat._id
      );
    }
  };

  const displaySets = async () => {
    if (!currentIdeation || !currentIdeation.ideation_result) {
      await saveMessage(
        "No ideation selected or no sets available.",
        "agent2",
        "text",
        Date.now() / 1000,
        selectedChat!._id
      );
      return;
    }

    const sets = currentIdeation.ideation_result.split(/Set [I|V]+:/);
    const formattedSets = sets.slice(1).map((set, index) => ({
      _id: `set_${index}`,
      message: `Set ${["I", "II", "III"][index]}:\n${set.trim()}`,
      message_type: "agent2" as const,
      timestamp: Date.now() / 1000,
      chat_id: selectedChat!._id,
    }));

    for (const message of formattedSets) {
      await saveMessage(
        message.message,
        message.message_type,
        "set",
        message.timestamp,
        message.chat_id
      );
    }

    await fetchMessages(selectedChat!._id);
  };

  const generateScript = async (setNumber: number) => {
    if (!currentIdeation || !currentIdeation.ideation_result) {
      await saveMessage(
        "No ideation selected or no sets available.",
        "agent2",
        "text",
        Date.now() / 1000,
        selectedChat!._id
      );
      return;
    }
    const sets = currentIdeation.ideation_result.split(/Set [I|V]+:/);
    // const sets = currentIdeation.ideation_result.split("Set");
    if (setNumber < 1 || setNumber > sets.length - 1) {
      await saveMessage(
        `Invalid set number. Please choose a number between 1 and ${sets.length - 1}.`,
        "agent2",
        "text",
        Date.now() / 1000,
        selectedChat!._id
      );
      return;
    }

    const selectedSet = sets[setNumber].trim();
    console.log(selectedSet);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/users/generate_script`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ideation_result: selectedSet,
            research_result: currentIdeation.research_result,
            ideation_id: currentIdeation._id,
            chat_id: selectedChat!._id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log(data);
        await saveMessage(
          `Script generated Successfully! Use the /scripts command to view it.`,
          "agent2",
          "text",
          Date.now() / 1000,
          selectedChat!._id
        );
        await fetchMessages(selectedChat!._id);
      } else {
        throw new Error("Failed to generate script.");
      }
    } catch (error) {
      console.error("Error generating script:", error);
      await saveMessage(
        "Error generating script.",
        "agent2",
        "text",
        Date.now() / 1000,
        selectedChat!._id
      );
    }
  };

  const toggleExpand = (messageId: string) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const formatTimestamp = (timestamp: number) =>
    new Date(timestamp * 1000).toLocaleString([], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const LoadingAnimation = () => (
    <div className="flex items-center justify-center space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-blue-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );

  const createNewChat = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/users/create_chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: Date.now() / 1000,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        await fetchChats();
        const newChat = {
          _id: data.id,
          timestamp: Date.now() / 1000,
          initial_message: "New Chat",
        };
        setSelectedChat(newChat);
        setMessages([
          {
            _id: "default-message",
            message: "Hi, what ideas would you like to discuss today?",
            message_type: "agent1",
            category: "text",
            timestamp: Date.now() / 1000,
            chat_id: data.id,
          },
        ]);
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    // <div className="flex h-screen bg-gray-100">
    //   {/* Sidebar with chats */}
    //   <div
    //     className={`fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 ease-in-out ${
    //       sidebarVisible ? "translate-x-0" : "-translate-x-full"
    //     }`}
    //   >
    //     <div className="p-4 border-b border-gray-200 flex justify-between items-center">
    //       <img
    //         src="https://mcusercontent.com/68edd03c1700c1bdc714f04d5/images/d096c8ef-178b-741d-e81b-a3c9704a6dfd.png"
    //         alt="Logo"
    //         width={50}
    //         height={50}
    //         className="mr-4"
    //       />
    //       <h2 className="text-md font-semibold text-black">Script Generator</h2>
    //       <button
    //         onClick={toggleSidebar}
    //         className="p-2 rounded-full hover:bg-gray-200 text-black"
    //         aria-label="Close sidebar"
    //       >
    //         <X size={24} />
    //       </button>
    //     </div>
    //     <div className="p-2">
    //       <button
    //         onClick={createNewChat}
    //         className="w-full text-left p-2 rounded-lg mb-2 bg-blue-500 text-white hover:bg-blue-600 flex items-center"
    //       >
    //         <Plus size={20} className="mr-2" />
    //         New Chat
    //       </button>
    //       {chats.map((chat) => (
    //         <button
    //           key={chat._id}
    //           className={`w-full text-left p-2 rounded-lg mb-2 ${
    //             selectedChat?._id === chat._id
    //               ? "bg-blue-100 text-black"
    //               : "hover:bg-gray-100 text-black"
    //           }`}
    //           onClick={() => selectChat(chat._id)}
    //         >
    //           <p className="font-medium truncate">
    //             {chat.initial_message || "New Chat"}
    //           </p>
    //           <p className="text-xs text-gray-500">
    //             {formatTimestamp(chat.timestamp)}
    //           </p>
    //         </button>
    //       ))}
    //     </div>
    //   </div>

    //   {/* Chat interface */}
    //   <div
    //     className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
    //       sidebarVisible ? "ml-64" : "ml-0"
    //     }`}
    //   >
    //     {/* Top bar */}
    //     <div
    //       className={`h-14 flex items-center px-4 ${
    //         sidebarVisible
    //           ? "bg-transparent"
    //           : "bg-white border-b border-gray-200"
    //       }`}
    //     >
    //       {!sidebarVisible && (
    //         <button
    //           onClick={toggleSidebar}
    //           className="p-2 rounded-full hover:bg-gray-200 text-black"
    //           aria-label="Show sidebar"
    //         >
    //           <ChevronRight size={24} />
    //         </button>
    //       )}
    //     </div>

    //     {selectedChat ? (
    //       <>
    //         {/* Chat messages */}
    //         <div className="flex-1 overflow-y-auto p-4">
    //           {messages.map((message, index) => (
    //             <div
    //               key={index}
    //               className={`mb-4 ${
    //                 message.message_type === "user" ? "text-right" : "text-left"
    //               }`}
    //             >
    //               <div
    //                 className={`inline-block p-2 rounded-lg ${
    //                   message.message_type === "user"
    //                     ? "bg-blue-500 text-white"
    //                     : message.message_type === "agent1"
    //                       ? "bg-gray-300 text-black"
    //                       : "bg-blue-100 text-black"
    //                 }`}
    //               >
    //                 <div className="flex items-center mb-1">
    //                   {message.message_type === "user" ? (
    //                     <User size={16} className="mr-1" />
    //                   ) : message.message_type === "agent1" ? (
    //                     <Bot size={16} className="mr-1" />
    //                   ) : (
    //                     <Command size={16} className="mr-1" />
    //                   )}
    //                   <span className="text-xs">
    //                     {formatTimestamp(message.timestamp)}
    //                   </span>
    //                 </div>
    //                 {message.category === "script" ||
    //                 message.category === "set" ? (
    //                   <div>
    //                     <button
    //                       onClick={() => toggleExpand(message._id)}
    //                       className="mt-2 text-sm text-blue-500 hover:text-blue-700"
    //                     >
    //                       {expandedMessages[message._id]
    //                         ? `Hide ${message.category === "script" ? "Script" : "Set"}`
    //                         : `View ${message.category === "script" ? "Script" : "Set"}`}
    //                     </button>
    //                     {expandedMessages[message._id] && (
    //                       <div className="mt-2 p-4 text-black">
    //                         {message.category === "script" ? (
    //                           <>
    //                             <div className="flex mb-2">
    //                               <button
    //                                 className={`mr-2 px-2 py-1 rounded ${
    //                                   activeTab === "initial_input"
    //                                     ? "bg-blue-500 text-white"
    //                                     : "bg-gray-200 text-black"
    //                                 }`}
    //                                 onClick={() =>
    //                                   setActiveTab("initial_input")
    //                                 }
    //                               >
    //                                 Initial Input
    //                               </button>
    //                               <button
    //                                 className={`mr-2 px-2 py-1 rounded ${
    //                                   activeTab === "script"
    //                                     ? "bg-blue-500 text-white"
    //                                     : "bg-gray-200 text-black"
    //                                 }`}
    //                                 onClick={() => setActiveTab("script")}
    //                               >
    //                                 Script
    //                               </button>
    //                               <button
    //                                 className={`px-2 py-1 rounded ${
    //                                   activeTab === "mr_beast_score"
    //                                     ? "bg-blue-500 text-white"
    //                                     : "bg-gray-200 text-black"
    //                                 }`}
    //                                 onClick={() =>
    //                                   setActiveTab("mr_beast_score")
    //                                 }
    //                               >
    //                                 Mr. Beast&aposs Evaluation
    //                               </button>
    //                               <button
    //                                 className={`px-2 py-1 rounded ${
    //                                   activeTab === "george_blackman_score"
    //                                     ? "bg-blue-500 text-white"
    //                                     : "bg-gray-200 text-black"
    //                                 }`}
    //                                 onClick={() =>
    //                                   setActiveTab("george_blackman_score")
    //                                 }
    //                               >
    //                                 George Blackman&aposs Evaluation
    //                               </button>
    //                             </div>
    //                             {scripts.map((script) => {
    //                               if (script.script === message.message) {
    //                                 return (
    //                                   <pre
    //                                     key={script._id}
    //                                     className="whitespace-pre-wrap font-sans"
    //                                   >
    //                                     {activeTab === "initial_input"
    //                                       ? script.initial_input
    //                                       : activeTab === "script"
    //                                         ? script.script
    //                                         : activeTab === "mr_beast_score"
    //                                           ? script.mr_beast_score
    //                                           : script.george_blackman_score}
    //                                   </pre>
    //                                 );
    //                               }
    //                               return null;
    //                             })}
    //                           </>
    //                         ) : (
    //                           <pre className="whitespace-pre-wrap font-sans">
    //                             {message.message}
    //                           </pre>
    //                         )}
    //                       </div>
    //                     )}
    //                   </div>
    //                 ) : (
    //                   <pre className="whitespace-pre-wrap font-sans">
    //                     {message.message}
    //                   </pre>
    //                 )}
    //               </div>
    //               <br />
    //               <button
    //                 onClick={() => copyToClipboard(message.message, index)}
    //                 className={`ml-2 p-1 text-gray-500 hover:text-gray-700 transition-all duration-300`}
    //                 aria-label={
    //                   copiedIndex === index
    //                     ? "Copied to clipboard"
    //                     : "Copy to clipboard"
    //                 }
    //               >
    //                 {copiedIndex === index ? (
    //                   <Check size={16} />
    //                 ) : (
    //                   <Copy size={16} />
    //                 )}
    //               </button>
    //             </div>
    //           ))}
    //           {loading && (
    //             <div className="text-left mb-4">
    //               <div className="inline-block p-3 rounded-lg bg-gray-200">
    //                 <LoadingAnimation />
    //               </div>
    //             </div>
    //           )}
    //           <div ref={messagesEndRef} />
    //         </div>

    //         {/* Command suggestions */}
    //         <div className="border-t border-gray-200 p-2 bg-gray-50">
    //           <p className="text-sm font-medium text-gray-700 mb-1">
    //             Available commands:
    //           </p>
    //           <div className="flex flex-wrap gap-2">
    //             {COMMANDS.map((cmd) => (
    //               <button
    //                 key={cmd.command}
    //                 className="px-2 py-1 text-sm bg-white border border-gray-300 rounded-md text-black hover:bg-gray-100"
    //                 onClick={() => setInputMessage(cmd.command)}
    //                 title={cmd.description}
    //               >
    //                 {cmd.command}
    //               </button>
    //             ))}
    //           </div>
    //         </div>

    //         {/* Input area */}
    //         <form
    //           onSubmit={handleSendMessage}
    //           className="border-t border-gray-200 p-4"
    //         >
    //           <div className="flex items-top">
    //             <textarea
    //               ref={textareaRef}
    //               value={inputMessage}
    //               onChange={(e) => setInputMessage(e.target.value)}
    //               onKeyDown={handleKeyDown}
    //               placeholder="Type your message... (Shift+Enter for new line)"
    //               className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none text-black resize-none overflow-hidden"
    //               style={{ minHeight: "40px", maxHeight: "120px" }}
    //               disabled={loading}
    //               rows={1}
    //             />
    //             <button
    //               type="submit"
    //               className={`p-2 bg-blue-500 text-white rounded-r-md ${
    //                 loading
    //                   ? "opacity-50 cursor-not-allowed"
    //                   : "hover:bg-blue-600"
    //               }`}
    //               disabled={loading}
    //             >
    //               {loading ? <LoadingAnimation /> : <Forward size={25} />}
    //             </button>
    //           </div>
    //         </form>
    //       </>
    //     ) : (
    //       <div className="flex-1 flex items-center justify-center">
    //         <p className="text-black text-lg">
    //           Select a chat or create a new one to start
    //         </p>
    //       </div>
    //     )}
    //   </div>
    //   {sessionExpired && (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
    //       <div className="bg-white p-8 rounded-lg shadow-xl w-96">
    //         <h2 className="text-2xl font-bold mb-4 ">Log In</h2>
    //         <form onSubmit={handleLogin} className="space-y-4">
    //           <div>
    //             <label
    //               htmlFor="username"
    //               className="block text-sm font-medium text-gray-700"
    //             >
    //               Username
    //             </label>
    //             <input
    //               type="text"
    //               id="username"
    //               value={username}
    //               onChange={(e) => setUsername(e.target.value)}
    //               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    //               required
    //             />
    //           </div>
    //           <div>
    //             <label
    //               htmlFor="password"
    //               className="block text-sm font-medium text-gray-700"
    //             >
    //               Password
    //             </label>
    //             <input
    //               type="password"
    //               id="password"
    //               value={password}
    //               onChange={(e) => setPassword(e.target.value)}
    //               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    //               required
    //             />
    //           </div>
    //           <button
    //             type="submit"
    //             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    //           >
    //             Login
    //           </button>
    //         </form>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top bar */}
      <div className="h-14 flex items-center px-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-200 text-black md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <img
          src="https://mcusercontent.com/68edd03c1700c1bdc714f04d5/images/d096c8ef-178b-741d-e81b-a3c9704a6dfd.png"
          alt="Logo"
          width={40}
          height={40}
          className="ml-2 md:ml-0"
        />
        <h2 className="text-md font-semibold text-black ml-2">
          Script Generator
        </h2>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with chats */}
        <div
          className={`fixed inset-y-14 left-0 z-20 w-64 bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 ease-in-out ${
            sidebarVisible ? "translate-x-0" : "-translate-x-full"
          } md:relative md:inset-y-0 md:translate-x-0`}
        >
          <div className="p-2">
            <button
              onClick={createNewChat}
              className="w-full text-left p-2 rounded-lg mb-2 bg-blue-500 text-white hover:bg-blue-600 flex items-center"
            >
              <Plus size={20} className="mr-2" />
              New Chat
            </button>
            {chats.map((chat) => (
              <button
                key={chat._id}
                className={`w-full text-left p-2 rounded-lg mb-2 ${
                  selectedChat?._id === chat._id
                    ? "bg-blue-100 text-black"
                    : "hover:bg-gray-100 text-black"
                }`}
                onClick={() => selectChat(chat._id)}
              >
                <p className="font-medium truncate">
                  {chat.initial_message || "New Chat"}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTimestamp(chat.timestamp)}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat interface */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedChat ? (
            <>
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.message_type === "user"
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block p-2 rounded-lg ${
                        message.message_type === "user"
                          ? "bg-blue-500 text-white"
                          : message.message_type === "agent1"
                            ? "bg-gray-300 text-black"
                            : "bg-blue-100 text-black"
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.message_type === "user" ? (
                          <User size={16} className="mr-1" />
                        ) : message.message_type === "agent1" ? (
                          <Bot size={16} className="mr-1" />
                        ) : (
                          <Command size={16} className="mr-1" />
                        )}
                        <span className="text-xs">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      {message.category === "script" ||
                      message.category === "set" ? (
                        <div>
                          <button
                            onClick={() => toggleExpand(message._id)}
                            className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                          >
                            {expandedMessages[message._id]
                              ? `Hide ${message.category === "script" ? "Script" : "Set"}`
                              : `View ${message.category === "script" ? "Script" : "Set"}`}
                          </button>
                          {expandedMessages[message._id] && (
                            <div className="mt-2 p-4 text-black">
                              {message.category === "script" ? (
                                <>
                                  <div className="flex flex-wrap mb-2">
                                    <button
                                      className={`mr-2 mb-2 px-2 py-1 rounded ${
                                        activeTab === "initial_input"
                                          ? "bg-blue-500 text-white"
                                          : "bg-gray-200 text-black"
                                      }`}
                                      onClick={() =>
                                        setActiveTab("initial_input")
                                      }
                                    >
                                      Initial Input
                                    </button>
                                    <button
                                      className={`mr-2 mb-2 px-2 py-1 rounded ${
                                        activeTab === "script"
                                          ? "bg-blue-500 text-white"
                                          : "bg-gray-200 text-black"
                                      }`}
                                      onClick={() => setActiveTab("script")}
                                    >
                                      Script
                                    </button>
                                    <button
                                      className={`mr-2 mb-2 px-2 py-1 rounded ${
                                        activeTab === "mr_beast_score"
                                          ? "bg-blue-500 text-white"
                                          : "bg-gray-200 text-black"
                                      }`}
                                      onClick={() =>
                                        setActiveTab("mr_beast_score")
                                      }
                                    >
                                      Mr. Beast's Evaluation
                                    </button>
                                    <button
                                      className={`mb-2 px-2 py-1 rounded ${
                                        activeTab === "george_blackman_score"
                                          ? "bg-blue-500 text-white"
                                          : "bg-gray-200 text-black"
                                      }`}
                                      onClick={() =>
                                        setActiveTab("george_blackman_score")
                                      }
                                    >
                                      George Blackman's Evaluation
                                    </button>
                                  </div>
                                  {scripts.map((script) => {
                                    if (script.script === message.message) {
                                      return (
                                        <pre
                                          key={script._id}
                                          className="whitespace-pre-wrap font-sans text-sm"
                                        >
                                          {activeTab === "initial_input"
                                            ? script.initial_input
                                            : activeTab === "script"
                                              ? script.script
                                              : activeTab === "mr_beast_score"
                                                ? script.mr_beast_score
                                                : script.george_blackman_score}
                                        </pre>
                                      );
                                    }
                                    return null;
                                  })}
                                </>
                              ) : (
                                <pre className="whitespace-pre-wrap font-sans text-sm">
                                  {message.message}
                                </pre>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <pre className="whitespace-pre-wrap font-sans text-sm">
                          {message.message}
                        </pre>
                      )}
                    </div>
                    <br />
                    <button
                      onClick={() => copyToClipboard(message.message, index)}
                      className={`ml-2 p-1 text-gray-500 hover:text-gray-700 transition-all duration-300`}
                      aria-label={
                        copiedIndex === index
                          ? "Copied to clipboard"
                          : "Copy to clipboard"
                      }
                    >
                      {copiedIndex === index ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                ))}
                {loading && (
                  <div className="text-left mb-4">
                    <div className="inline-block p-3 rounded-lg bg-gray-200">
                      <LoadingAnimation />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Command suggestions */}
              <div className="border-t border-gray-200 p-2 bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Available commands:
                </p>
                <div className="flex flex-wrap gap-2">
                  {COMMANDS.map((cmd) => (
                    <button
                      key={cmd.command}
                      className="px-2 py-1 text-sm bg-white border border-gray-300 rounded-md text-black hover:bg-gray-100"
                      onClick={() => setInputMessage(cmd.command)}
                      title={cmd.description}
                    >
                      {cmd.command}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input area */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-gray-200 p-4"
              >
                <div className="flex items-top">
                  <textarea
                    ref={textareaRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message... (Shift+Enter for new line)"
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none text-black resize-none overflow-hidden"
                    style={{ minHeight: "40px", maxHeight: "120px" }}
                    disabled={loading}
                    rows={1}
                  />
                  <button
                    type="submit"
                    className={`p-2 bg-blue-500 text-white rounded-r-md ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-600"
                    }`}
                    disabled={loading}
                  >
                    {loading ? <LoadingAnimation /> : <Forward size={25} />}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-black text-lg">
                Select a chat or create a new one to start
              </p>
            </div>
          )}
        </div>
      </div>

      {sessionExpired && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-[90%]">
            <h2 className="text-2xl font-bold mb-4 ">Log In</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
