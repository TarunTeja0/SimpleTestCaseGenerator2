import { useState } from "react";

export default function ExitConfirmationDialog({ onGoHome, onStay }) {
  const [show, setShow] = useState(true);

  if (!show) return null;

  console.log("inside exit confirmtaiondialog component")

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px] text-center">
        <h2 className="text-lg font-semibold mb-3">Unsaved Changes</h2>
        <p className="text-sm text-gray-600 mb-6">
          If you exit without saving, you might lose newly added data.  
          To avoid this, please choose <strong>“Save & Exit.”</strong>
        </p>

        <div className="flex justify-between gap-3">
          <button
            onClick={() => {
              setShow(false);
              onGoHome();
            }}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg"
          >
            Go to Home
          </button>
          <button
            onClick={() => {
              setShow(false);
              onStay();
            }}
            className="flex-1 bg-blue-100 hover:bg-blue-200 text-yellow-800 py-2 rounded-lg"
          >
            Stay on this Page
          </button>
        </div>
      </div>
    </div>
  );
}
