"use client";

import React, { useState, useEffect } from "react";

interface Ideation {
  _id: string;
  initial_input: string;
  ideation_result?: string;
  research_result?: string;
  process_time?: number;
  timestamp?: number;
}

interface SidebarProps {
  onSelectIdeation: (ideation: Ideation) => void;
}

export default function Sidebar({ onSelectIdeation }: SidebarProps) {
  const [ideations, setIdeations] = useState<Ideation[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/users/get_all_ideations`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIdeations(data.data);
        } else {
          setError("Error loading ideations.");
        }
      })
      .catch((error) => {
        console.error("Error fetching ideations:", error);
        setError("Error loading ideations.");
      });
  }, []);

  const truncateInput = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    return (
      words.slice(0, wordLimit).join(" ") +
      (words.length > wordLimit ? "..." : "")
    );
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

  return (
    <aside className="w-72 bg-[#0A2033] text-white h-screen overflow-y-auto">
      <div className="p-6 bg-[#0A2033] border-b border-[#7DC142]">
        <h2 className="text-2xl font-bold text-[#7DC142]">Ideations</h2>
      </div>
      <div className="p-4">
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {ideations.map((ideation) => (
          <button
            key={ideation._id}
            className="w-full text-left bg-white text-[#0A2033] p-4 mb-3 rounded-lg shadow transition-all hover:bg-gray-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#7DC142]"
            onClick={() => onSelectIdeation(ideation)}
          >
            <p className="font-medium">
              {truncateInput(ideation.initial_input, 6)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {ideation.timestamp
                ? formatTimestamp(ideation.timestamp)
                : "No timestamp"}
            </p>
          </button>
        ))}
      </div>
    </aside>
  );
}
