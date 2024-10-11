"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Copy } from "lucide-react";

interface FinalResult {
  final_script: {
    Scientific_Accuracy_Clarity_Guardian: string;
    Call_to_Action_Channel_Integration_Specialist: string;
  };
}

export default function ScriptGenerator() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [setI, setSetI] = useState<string | null>(null);
  const [setII, setSetII] = useState<string | null>(null);
  const [setIII, setSetIII] = useState<string | null>(null);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [researchResult, setResearchResult] = useState<string | null>(null);
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
  const [activeTab, setActiveTab] = useState("script");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (loading) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 0.1);
      }, 100);
    } else if (!loading && timer !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, timer]);

  const parseMarkdownSets = (markdown: string) => {
    const regex =
      /Set I:[\s\S]*?(?=Set II:|Set III:|\Z)|Set II:[\s\S]*?(?=Set III:|\Z)|Set III:[\s\S]*/g;
    const matches = markdown.match(regex);

    if (matches && matches.length >= 3) {
      setSetI(matches[0].replace(/Set I:/, "").trim());
      setSetII(matches[1].replace(/Set II:/, "").trim());
      setSetIII(matches[2].replace(/Set III:/, "").trim());
    } else if (matches && matches.length === 2) {
      setSetI(matches[0].replace(/Set I:/, "").trim());
      setSetII(matches[1].replace(/Set II:/, "").trim());
      setSetIII(null);
    } else if (matches && matches.length === 1) {
      setSetI(matches[0].replace(/Set I:/, "").trim());
      setSetII(null);
      setSetIII(null);
    } else {
      console.error("Failed to parse the Markdown string properly.");
    }
  };

  const simulateLoading = async (stage: string, duration: number) => {
    setLoadingStage(stage);
    await new Promise((resolve) => setTimeout(resolve, duration));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimer(0);

    try {
      await simulateLoading("Ideating...", 3000);
      await simulateLoading("Researching...", 4000);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/users/execute_agent_teams`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ initial_input: inputText }),
        }
      );
      const data = await response.json();

      parseMarkdownSets(data.ideation_result);
      setResearchResult(data.research_result);
    } catch (error) {
      console.error("Error fetching ideation data:", error);
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  const handleGenerateScript = async () => {
    setLoading(true);
    setTimer(0);

    try {
      await simulateLoading("Generating output...", 5000);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/users/generate_script`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ideation_result: selectedSet,
            research_result: researchResult,
          }),
        }
      );
      const data = await response.json();

      setFinalResult(data);
    } catch (error) {
      console.error("Error generating script:", error);
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log("Copied to clipboard!");
    });
  };

  return (
    <div className="bg-gradient-to-b from-blue-100 to-white p-6 rounded-lg shadow-lg">
      <header className="flex items-center justify-center mb-8">
        <Image
          src="https://mcusercontent.com/68edd03c1700c1bdc714f04d5/images/d096c8ef-178b-741d-e81b-a3c9704a6dfd.png"
          alt="Logo"
          width={100}
          height={100}
          className="mr-4"
        />
        <h1 className="text-4xl font-bold text-center text-blue-900">
          AI Script Generator
        </h1>
      </header>

      <div className="max-w-2xl mx-auto mb-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Generate Your Script</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your topic or idea"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? loadingStage : "Generate Ideas"}
            </button>
          </form>
        </div>
      </div>

      {setI && (
        <div className="max-w-4xl mx-auto mb-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Choose a Set</h2>
            <select
              value={selectedSet || ""}
              onChange={(e) => setSelectedSet(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select a Set
              </option>
              <option value={setI}>Set I</option>
              {setII && <option value={setII}>Set II</option>}
              {setIII && <option value={setIII}>Set III</option>}
            </select>

            {selectedSet && (
              <div className="mb-4 p-4 bg-gray-100 rounded-md relative">
                <ReactMarkdown>{selectedSet}</ReactMarkdown>
                <button
                  onClick={() => copyToClipboard(selectedSet)}
                  className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                  aria-label="Copy to clipboard"
                >
                  <Copy size={16} />
                </button>
              </div>
            )}

            {researchResult && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Research Result</h3>
                <div className="p-4 bg-gray-100 rounded-md relative">
                  <ReactMarkdown>{researchResult}</ReactMarkdown>
                  <button
                    onClick={() => copyToClipboard(researchResult)}
                    className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                    aria-label="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerateScript}
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading || !selectedSet}
            >
              {loading ? loadingStage : "Generate Script"}
            </button>
          </div>
        </div>
      )}

      {finalResult && finalResult.final_script && (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Generated Script</h2>
            <div className="mb-4">
              <div className="flex border-b">
                <button
                  className={`py-2 px-4 ${
                    activeTab === "script"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("script")}
                >
                  Final Script
                </button>
                <button
                  className={`py-2 px-4 ${
                    activeTab === "cta"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("cta")}
                >
                  Call to Action
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-100 rounded-md relative">
              {activeTab === "script" ? (
                <ReactMarkdown>
                  {
                    finalResult.final_script
                      .Scientific_Accuracy_Clarity_Guardian
                  }
                </ReactMarkdown>
              ) : (
                <ReactMarkdown>
                  {
                    finalResult.final_script
                      .Call_to_Action_Channel_Integration_Specialist
                  }
                </ReactMarkdown>
              )}
              <button
                onClick={() =>
                  copyToClipboard(
                    activeTab === "script"
                      ? finalResult.final_script
                          .Scientific_Accuracy_Clarity_Guardian
                      : finalResult.final_script
                          .Call_to_Action_Channel_Integration_Specialist
                  )
                }
                className="absolute bottom-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                aria-label="Copy to clipboard"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timer display */}
      <div className="fixed bottom-4 right-4 bg-white p-2 rounded-md shadow-md">
        <p className="text-sm font-semibold">
          Time: {timer.toFixed(1)} seconds
        </p>
      </div>
    </div>
  );
}
