import React, { useEffect, useRef, useState } from "react";

// Single-file React component for the two-step dialog described by the user.
// - Page 1: shows a large read-only textbox containing a static prompt + a copy icon
//   and Next / Prev buttons (Prev disabled on page 1).
// - Page 2: shows an empty editable textarea for the user to paste JSON, with
//   Prev and Submit buttons.
// Styling uses Tailwind classes (no imports needed).

export default function PromptJsonDialog({
  initialPrompt = "Add your prompt here. Replace this text with the prompt you want to show.",
  onSubmit,
  title = "Prompt → JSON",
  open, onClose, onSave
}) {
  const [page, setPage] = useState(1);
  const [promptText] = useState(initialPrompt);
  const [jsonText, setJsonText] = useState("");
  const [copied, setCopied] = useState(false);

  const dialogRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose(); // close when clicked outside
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = promptText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleNext = () => {
    setPage(2);
    // focus the input on page 2 after render
    setTimeout(() => {
      const el = document.getElementById("json-input");
      if (el) el.focus();
    }, 50);
  };

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));

  const handleSubmit = () => {
    onSubmit(jsonText);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-labelledby="dialog-title"
      role="dialog"
      aria-modal="true">

      {/* overlay */}
      <div className="absolute inset-0 bg-white/40" aria-hidden="true"
        onClick={onClose}
      />

      {/* dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="relative z-10 w-full max-w-2xl rounded-2xl bg-white  shadow-2xl p-6 mx-4"
      >
        <div className="flex items-start justify-between mb-4">
          <h2 id="dialog-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            onClick={() => {
              onClose();
            }}
            className="text-sm opacity-70 hover:opacity-100 px-2 py-1 border border-1 rounded rounded-lg border-neutral-300 text-sm font-medium"
            aria-label="Close dialog"
            title="Close dialog"
          >
            Close
          </button>
        </div>

        {/* Content area */}
        <div className="mb-6">
          {page === 1 ? (
            <div className="flex flex-col">
              <label className="sr-only">Prompt (read only)</label>

              <div className="relative">
                {/* large read-only textarea spanning most of dialog */}
                <textarea
                  readOnly
                  value={promptText}
                  rows={10}
                  className="w-full resize-none rounded-xl border border-neutral-200 p-4 pr-12 text-sm leading-relaxed bg-neutral-50 "
                />

                {/* copy icon positioned at top-right inside the textarea area */}
                <button
                  onClick={copyPrompt}
                  className="absolute top-3 right-3 flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  aria-label="Copy prompt"
                  title="Copy prompt"
                >
                  {/* simple clipboard SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    role="img"
                    aria-hidden="true"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>

                  <span className="sr-only">Copy</span>
                </button>

                {/* small toast indicator */}
                {copied && (
                  <div className="absolute top-2 left-3 rounded-md bg-black/80 text-white text-xs px-2 py-1">
                    Copied
                  </div>
                )}
              </div>

              <p className="mt-3 text-xs text-neutral-500">
                This is static prompt text (read-only). Use the copy button to copy it to clipboard.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              <label htmlFor="json-input" className="mb-2 font-medium">
                Paste JSON object here
              </label>

              <div className="relative inline-block">
              
              <textarea id="json-input"
                placeholder='e.g. { "testCases": [ ... ] }'
                rows={12}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full resize-none rounded-xl border border-neutral-200 p-4 text-sm leading-relaxed bg-white"
                aria-label="JSON input"
              />

              <button
                onClick={() => {
                  // setPage(1);
                  setJsonText("");
                }}
                className="text-sm opacity-70 hover:opacity-100 absolute top-0 right-0 m-4 px-2 py-1 border border-1 rounded rounded-lg border-neutral-300 text-sm font-medium  flex items-center  hover:bg-red-600 hover:border-transparent hover:text-white transform transition hover:scale-105 duration-200 ease-in-out"
                aria-label="Clear dialog"
                title="Clear dialog"
              >
                Clear
              </button>

              </div>

              <p className="mt-3 text-xs text-neutral-500">
                Paste your JSON object and click Submit. The default submit validates JSON before proceeding.
              </p>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`rounded-lg px-3 py-2 text-sm font-medium border ${page === 1
                  ? "border-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "border-neutral-300 hover:bg-neutral-50"
                }`}
              aria-disabled={page === 1}
            >
              Previous
            </button>

            {page === 1 ? (
              <button
                onClick={handleNext}
                className="rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-95"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-95"
                title="Submit JSON"
              >
                Upload
              </button>
            )}
          </div>

          <div className="text-xs text-neutral-500">Page {page} of 2</div>
        </div>
      </div>
    </div>
  );
}
