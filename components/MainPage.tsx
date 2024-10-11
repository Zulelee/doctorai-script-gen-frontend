// "use client";

// import React, { useState } from "react";
// import Sidebar from "./Sidebar";
// import IdeationDetails from "./IdeationDetails";
// import ScriptGenerator from "./ScriptGenerator";

// interface Ideation {
//   _id: string;
//   initial_input: string;
//   ideation_result?: string;
//   research_result?: string;
//   process_time?: number;
//   timestamp?: number;
// }

// export default function MainPage() {
//   const [selectedIdeation, setSelectedIdeation] = useState<Ideation | null>(
//     null
//   );
//   const [showScriptGenerator, setShowScriptGenerator] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <Sidebar onSelectIdeation={setSelectedIdeation} />
//       <main className="flex-1 overflow-y-auto p-6">
//         <div className="mb-6 flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-gray-800">
//             Ideation Dashboard
//           </h1>
//           <button
//             onClick={() => setShowScriptGenerator(!showScriptGenerator)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//           >
//             {showScriptGenerator ? "View Ideations" : "Generate Script"}
//           </button>
//         </div>
//         {showScriptGenerator ? (
//           <ScriptGenerator />
//         ) : selectedIdeation ? (
//           <IdeationDetails ideation={selectedIdeation} />
//         ) : (
//           <div className="flex items-center justify-center h-full">
//             <div className="text-center">
//               <h2 className="text-3xl font-bold text-gray-700 mb-4">
//                 Welcome to Ideation
//               </h2>
//               <p className="text-xl text-gray-600">
//                 Please select an ideation from the sidebar to get started.
//               </p>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// Chatbot style:

"use client";

import React from "react";
import ChatbotInterface from "./ChatbotInterface";

export default function MainPage() {
  return (
    <div className="h-screen bg-gray-100">
      <ChatbotInterface />
    </div>
  );
}
