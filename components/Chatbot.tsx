"use client";
import React from "react";
import Link from "next/link";

const Chatbot = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white p-3 flex-shrink-0">
        <Link href="/" className="text-blue-600 inline-block">
          Back to Script Generator
        </Link>
      </div>
      <div className="flex-grow overflow-hidden">
        <iframe
          src="https://flowise-webmed-v1-18-07-2024.onrender.com/chatbot/0d5e4539-2761-46bc-a59b-5b105412b660"
          className="w-full h-full border-none"
          title="Brainstorm"
        ></iframe>
      </div>
    </div>
  );
};

export default Chatbot;
