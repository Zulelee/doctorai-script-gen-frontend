/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
// import {
//   getScriptingPrompt,
//   updateScriptingPrompt,
// } from "@/prompts/ScriptingPrompt";

interface EditScriptingPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function EditScriptingPromptModal({
  isOpen,
  onClose,
  onSave,
}: EditScriptingPromptModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen) {
        setIsLoading(true);
        const response = await fetch("/api/prompt", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setPrompt(data.content);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isOpen]);

  const handleSave = async () => {
    setIsLoading(true);
    await fetch("/api/prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: prompt }),
    });
    setIsLoading(false);
    onSave();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[80vw] h-[80vh] max-w-none flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Scripting Prompt</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : (
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter the scripting prompt here..."
            className="flex-grow min-h-0 resize-none"
          />
        )}
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isLoading}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
