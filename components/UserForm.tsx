"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface FinalResult {
  final_script: {
    Scientific_Accuracy_Clarity_Guardian: string;
    Call_to_Action_Channel_Integration_Specialist: string;
  };
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [setI, setSetI] = useState<string | null>(null);
  const [setII, setSetII] = useState<string | null>(null);
  const [setIII, setSetIII] = useState<string | null>(null);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [researchResult, setResearchResult] = useState<string | null>(null);
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);

  const parseMarkdownSets = (markdown: string) => {
    // Updated regex to capture content between the sets, without including '**'
    const regex =
      /Set I:[\s\S]*?(?=Set II:|Set III:|\Z)|Set II:[\s\S]*?(?=Set III:|\Z)|Set III:[\s\S]*/g;

    // Matching content between the Set markers
    const matches = markdown.match(regex);

    if (matches && matches.length >= 3) {
      setSetI(matches[0].replace(/Set I:/, "").trim()); // Remove "Set I:" and trim any extra spaces
      setSetII(matches[1].replace(/Set II:/, "").trim()); // Remove "Set II:" and trim any extra spaces
      setSetIII(matches[2].replace(/Set III:/, "").trim()); // Remove "Set III:" and trim any extra spaces
    } else if (matches && matches.length === 2) {
      setSetI(matches[0].replace(/Set I:/, "").trim());
      setSetII(matches[1].replace(/Set II:/, "").trim());
      setSetIII(""); // Set III may be optional
    } else if (matches && matches.length === 1) {
      setSetI(matches[0].replace(/Set I:/, "").trim());
      setSetII("");
      setSetIII("");
    } else {
      console.error("Failed to parse the Markdown string properly.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://fastapi-sql-production.up.railway.app/users/execute_agent_teams",
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
    }
  };

  const handleGenerateScript = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://fastapi-sql-production.up.railway.app/users/generate_script",
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
        Script Generator
      </h1>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mb-6"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text"
          required
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Submit
        </button>
      </form>

      {/* Display Ideation Data in Dropdown */}
      {setI && setII && setIII && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Choose a Set:
          </h2>
          <div className="mb-6">
            <select
              value={selectedSet || ""}
              onChange={(e) => setSelectedSet(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>
                Select a Set
              </option>
              <option value={setI}>Set I</option>
              <option value={setII}>Set II</option>
              <option value={setIII}>Set III</option>
            </select>
          </div>

          {/* Render the selected markdown content */}
          {selectedSet && (
            <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
              <ReactMarkdown>{selectedSet}</ReactMarkdown>
            </div>
          )}

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">
            Research Result:
          </h3>
          <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <ReactMarkdown>{researchResult}</ReactMarkdown>
          </div>

          <button
            onClick={handleGenerateScript}
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Generate Script
          </button>
        </div>
      )}
      {/* Loading Spinner */}
      {loading && <p className="text-center text-indigo-600">Loading...</p>}
      {/* Final Output */}
      {finalResult && finalResult.final_script && (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Generated Script
          </h2>

          {/* Final Script */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Final Script:
            </h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <ReactMarkdown>
                {finalResult.final_script.Scientific_Accuracy_Clarity_Guardian}
              </ReactMarkdown>
            </div>
          </div>

          {/* Refined Call to Action */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Refined Call to Action:
            </h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <ReactMarkdown>
                {
                  finalResult.final_script
                    .Call_to_Action_Channel_Integration_Specialist
                }
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
