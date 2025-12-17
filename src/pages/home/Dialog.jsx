import React, { useContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { TestCaseFileNameContext } from "../../App";
import { useNavigate } from "react-router-dom";

export default function Dialog({ open, onClose, onSave }) {
  const dialogRef = useRef(null);
  const previousActiveRef = useRef(null);
  const [fileNameInput, setFileNameInput] = useState("");
  
  const navigate = useNavigate();
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const {testCaseFileName, saveTestCaseFileNameFunc} = useContext(TestCaseFileNameContext);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(()=>{
    if(shouldNavigate && testCaseFileName!=""){
        navigate("/create?filename="+testCaseFileName)
    }
  }, [testCaseFileName, shouldNavigate, navigate]);

  // Basic focus management
  useEffect(() => {
    if (open) {
      previousActiveRef.current = document.activeElement;
      dialogRef.current?.focus();
    } else {
      previousActiveRef.current?.focus?.();
    }
  }, [open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50"
      aria-labelledby="dialog-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          tabIndex={-1}
          className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl outline-none"
        >
          <div className="flex items-start justify-between">
            <h2 id="dialog-title" className="text-xl font-semibold text-gray-800">
              {/* {title} */}
              Create new Test Cases
            </h2>
            
            <button
              onClick={onClose}
              className="ml-3 rounded-full p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Close dialog"
              title="Close"
            >
              ×
            </button>
          </div>

          <div className="mt-4">

             <div className="relative w-full">
                <input
                    id="test"
                    placeholder=" " // <-- important for peer-placeholder-shown
                    className="peer block w-full rounded-md border border-gray-300 bg-transparent px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={fileNameInput}
                    onChange={(e)=>setFileNameInput(e.target.value)}
                />
                <label
                    htmlFor="test"
                    className="absolute left-3 top-2 text-sm text-gray-500 transition-all 
                    peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                    peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600"
                >
                    Enter your Test Case Filename
                </label>
             </div>

          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // TODO: handle submit/save here
                saveTestCaseFileNameFunc(fileNameInput);
                onSave(fileNameInput);
                setShouldNavigate(true);

              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
