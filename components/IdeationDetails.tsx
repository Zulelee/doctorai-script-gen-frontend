"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Copy } from "lucide-react";

interface Ideation {
  _id: string;
  initial_input: string;
  ideation_result?: string;
  research_result?: string;
}

interface ScriptData {
  _id: string;
  ideation_id: string;
  initial_input: string | null;
  script: string;
  call_to_action: string;
  process_time: number;
  timestamp: number;
}

interface IdeationDetailsProps {
  ideation: Ideation;
}

export default function IdeationDetails({ ideation }: IdeationDetailsProps) {
  const [setI, setSetI] = useState<string>("");
  const [setII, setSetII] = useState<string>("");
  const [setIII, setSetIII] = useState<string>("");
  const [selectedSet, setSelectedSet] = useState<string>("");
  const [scriptData, setScriptData] = useState<ScriptData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (ideation.ideation_result) {
      parseMarkdownSets(ideation.ideation_result);
    } else {
      setSetI("");
      setSetII("");
      setSetIII("");
    }
    setSelectedSet("");
    setScriptData(null);
    setError("");
  }, [ideation]);

  const parseMarkdownSets = (markdown: string) => {
    const regex =
      /Set I:[\s\S]*?(?=Set II:|Set III:|\Z)|Set II:[\s\S]*?(?=Set III:|\Z)|Set III:[\s\S]*/g;
    const matches = markdown.match(regex);

    setSetI("");
    setSetII("");
    setSetIII("");

    if (matches) {
      matches.forEach((match, index) => {
        const content = match.replace(/Set [I|II|III]:/, "").trim();
        if (index === 0) setSetI(content);
        if (index === 1) setSetII(content);
        if (index === 2) setSetIII(content);
      });
    } else {
      console.error("Failed to parse the Markdown string properly.");
    }
  };

  const handleSetClick = (setName: string, setContent: string) => {
    setSelectedSet(setName);
    setError("");
    setScriptData(null);

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/users/get_scripts_by_ideation/${ideation._id}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const matchingScript = data.data.find((script: ScriptData) =>
            setContent.includes(script.initial_input)
          );
          if (matchingScript) {
            setScriptData(matchingScript);
          } else {
            setError("No matching script found for this set.");
          }
        } else {
          setError("Error loading scripts.");
        }
      })
      .catch((error) => {
        console.error("Error fetching scripts:", error);
        setError("Error loading scripts.");
      });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log("Copied to clipboard!");
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Ideation Details
      </h2>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Sets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {setI && (
            <button
              className={`p-4 rounded-lg text-left transition-colors ${
                selectedSet === "Set I"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
              onClick={() => handleSetClick("Set I", setI)}
            >
              <span className="font-semibold">Set I</span>
              <p className="mt-2 text-sm">{setI.substring(0, 100)}...</p>
            </button>
          )}
          {setII && (
            <button
              className={`p-4 rounded-lg text-left transition-colors ${
                selectedSet === "Set II"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
              onClick={() => handleSetClick("Set II", setII)}
            >
              <span className="font-semibold">Set II</span>
              <p className="mt-2 text-sm">{setII.substring(0, 100)}...</p>
            </button>
          )}
          {setIII && (
            <button
              className={`p-4 rounded-lg text-left transition-colors ${
                selectedSet === "Set III"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
              onClick={() => handleSetClick("Set III", setIII)}
            >
              <span className="font-semibold">Set III</span>
              <p className="mt-2 text-sm">{setIII.substring(0, 100)}...</p>
            </button>
          )}
        </div>
      </div>
      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}
      {selectedSet && scriptData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            {selectedSet} Script
          </h3>
          <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm relative">
            <ReactMarkdown>{scriptData.script}</ReactMarkdown>
            <button
              onClick={() => copyToClipboard(scriptData.script)}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-200"
              aria-label="Copy to clipboard"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      )}
      {selectedSet && !scriptData && !error && (
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          role="alert"
        >
          <p>Loading script...</p>
        </div>
      )}
    </div>
  );
}
