"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import {
  Copy,
  ChevronDown,
  ChevronUp,
  Check,
  Forward,
  X,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface Ideation {
  _id: string;
  initial_input: string;
  ideation_result?: string;
  research_result?: string;
  timestamp?: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "set" | "script";
  expanded?: boolean;
  scriptData?: {
    inputSet: string;
    finalScript: string;
    callToAction: string;
  };
}

interface Script {
  _id: string;
  ideation_id: string;
  initial_input: string;
  script: string;
  call_to_action: string;
}

const COMMANDS = [
  {
    command: "/scripts",
    description: "Fetch scripts for the current ideation",
  },
  { command: "/sets", description: "Display sets for the current ideation" },
  { command: "/new_ideation", description: "Create a new ideation" },
  { command: "/script", description: "Generate a script for a specific set" },
];

export default function ChatbotInterface() {
  const [ideations, setIdeations] = useState<Ideation[]>([]);
  const [selectedIdeation, setSelectedIdeation] = useState<Ideation | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchIdeations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

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

  const fetchIdeations = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/users/get_all_ideations`
      );
      const data = await response.json();
      if (data.success) {
        setIdeations(data.data);
      }
    } catch (error) {
      console.error("Error fetching ideations:", error);
    }
  };

  const selectIdeation = (ideation: Ideation) => {
    setSelectedIdeation(ideation);
    setMessages([
      {
        role: "assistant",
        content: "Hello! How can I help you with this ideation?",
      },
      { role: "user", content: ideation.initial_input },
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedIdeation) return;

    const newMessage: Message = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      if (inputMessage.startsWith("/")) {
        await handleCommand(inputMessage);
      } else {
        // Default response for non-command messages
        const assistantMessage: Message = {
          role: "assistant",
          content: `Here's a response to: "${inputMessage}"`,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "An error occurred while processing your request.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleCommand = async (command: string) => {
    const [cmd, ...args] = command.split(" ");

    switch (cmd) {
      case "/scripts":
        await fetchScripts();
        break;
      case "/sets":
        displaySets();
        break;
      case "/new_ideation":
        await createNewIdeation(args.join(" "));
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
      default:
        throw new Error(
          "Unknown command. Available commands are /scripts, /sets, /new_ideation, and /script [set_number]."
        );
    }
  };

  const fetchScripts = async () => {
    if (!selectedIdeation) throw new Error("No ideation selected.");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/users/get_scripts_by_ideation/${selectedIdeation._id}`
    );
    const data = await response.json();

    if (data.success) {
      const scriptMessages = data.data.map((script: Script) => ({
        role: "assistant" as const,
        content: `Script ID: ${script._id}`,
        type: "script" as const,
        expanded: false,
        scriptData: {
          inputSet: script.initial_input,
          finalScript: script.script,
          callToAction: script.call_to_action,
        },
      }));

      setMessages((prev) => [...prev, ...scriptMessages]);
    } else {
      throw new Error("Failed to fetch scripts.");
    }
  };

  const displaySets = () => {
    if (!selectedIdeation || !selectedIdeation.ideation_result) {
      throw new Error("No ideation selected or no sets available.");
    }

    const sets = selectedIdeation.ideation_result.split(/Set [I|V]+:/);
    const formattedSets = sets.slice(1).map((set, index) => {
      return {
        role: "assistant" as const,
        content: `Set ${["I", "II", "III"][index]}:\n${set.trim()}`,
        type: "set" as const,
        expanded: false,
      };
    });

    setMessages((prev) => [...prev, ...formattedSets]);
  };

  const createNewIdeation = async (initialInput: string) => {
    if (!initialInput)
      throw new Error("Please provide an initial input for the new ideation.");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/users/execute_agent_teams`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initial_input: initialInput }),
      }
    );

    const data = await response.json();

    if (data.success) {
      await fetchIdeations();
      selectIdeation(data.data);
      const assistantMessage: Message = {
        role: "assistant",
        content: "New ideation created successfully!",
      };
      setMessages([assistantMessage]);
    } else {
      throw new Error("Failed to create new ideation.");
    }
  };

  const generateScript = async (setNumber: number) => {
    if (!selectedIdeation || !selectedIdeation.ideation_result) {
      throw new Error("No ideation selected or no sets available.");
    }

    const sets = selectedIdeation.ideation_result.split("Set");
    if (setNumber < 1 || setNumber > sets.length - 1) {
      throw new Error(
        `Invalid set number. Please choose a number between 1 and ${sets.length - 1}.`
      );
    }

    const selectedSet = sets[setNumber].trim();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/users/generate_script`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideation_result: selectedSet,
          research_result: selectedIdeation.research_result,
          ideation_id: selectedIdeation._id,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      const scriptMessage: Message = {
        role: "assistant",
        content: `Generated Script:`,
        type: "script",
        expanded: false,
        scriptData: {
          inputSet: selectedSet,
          finalScript: data.script,
          callToAction: data.call_to_action,
        },
      };
      setMessages((prev) => [...prev, scriptMessage]);
    } else {
      throw new Error("Failed to generate script.");
    }
  };

  const toggleExpand = (index: number) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, expanded: !msg.expanded } : msg
      )
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const ScriptTabs: React.FC<{ scriptData: Message["scriptData"] }> = ({
    scriptData,
  }) => {
    const [activeTab, setActiveTab] = useState<
      "inputSet" | "finalScript" | "callToAction"
    >("inputSet");

    if (!scriptData) return null;

    return (
      <div className="mt-2">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 ${activeTab === "inputSet" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setActiveTab("inputSet")}
          >
            Input Set
          </button>
          <button
            className={`py-2 px-4 ${activeTab === "finalScript" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setActiveTab("finalScript")}
          >
            Final Script
          </button>
          <button
            className={`py-2 px-4 ${activeTab === "callToAction" ? "border-b-2 border-blue-500" : ""}`}
            onClick={() => setActiveTab("callToAction")}
          >
            Call to Action
          </button>
        </div>
        <div className="p-4">
          <pre className="whitespace-pre-wrap font-sans">
            {scriptData[activeTab]}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with ideations */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300 ease-in-out ${
          sidebarVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-black">Ideations</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-200 text-black"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-2">
          {ideations.map((ideation) => (
            <button
              key={ideation._id}
              className={`w-full text-left p-2 rounded-lg mb-2 ${
                selectedIdeation?._id === ideation._id
                  ? "bg-blue-100 text-black"
                  : "hover:bg-gray-100 text-black"
              }`}
              onClick={() => selectIdeation(ideation)}
            >
              <p className="font-medium truncate">{ideation.initial_input}</p>
              <p className="text-xs text-gray-500">
                {ideation.timestamp
                  ? formatTimestamp(ideation.timestamp)
                  : "No timestamp"}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat interface */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarVisible ? "ml-64" : "ml-0"}`}
      >
        {/* Top bar */}
        <div
          className={`h-14 flex items-center px-4 ${sidebarVisible ? "bg-transparent" : "bg-white border-b border-gray-200"}`}
        >
          {!sidebarVisible && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-gray-200 text-black"
              aria-label="Show sidebar"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {selectedIdeation ? (
          <>
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {message.type === "set" ? (
                      <div>
                        <button
                          onClick={() => toggleExpand(index)}
                          className="flex items-center justify-between w-full text-left"
                          aria-expanded={message.expanded}
                        >
                          <span>{message.content.split("\n")[0]}</span>
                          {message.expanded ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                        {message.expanded && (
                          <pre className="whitespace-pre-wrap font-sans mt-2">
                            {message.content.split("\n").slice(1).join("\n")}
                          </pre>
                        )}
                      </div>
                    ) : message.type === "script" ? (
                      <div>
                        <button
                          onClick={() => toggleExpand(index)}
                          className="flex items-center justify-between w-full text-left"
                          aria-expanded={message.expanded}
                        >
                          <span>{message.content}</span>
                          {message.expanded ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                        {message.expanded && message.scriptData && (
                          <ScriptTabs scriptData={message.scriptData} />
                        )}
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap font-sans">
                        {message.content}
                      </pre>
                    )}
                  </div>
                  <button
                    onClick={() => copyToClipboard(message.content, index)}
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
              <div className="flex items-center">
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black resize-none overflow-hidden"
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
                  <Forward size={25} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-black text-lg">
              Select an ideation to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
