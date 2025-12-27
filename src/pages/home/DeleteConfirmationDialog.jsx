import { useState } from "react";

export default function DeleteConfirmationDialog({ onDeleteFile, onCancel }) {
  



  console.log("inside exit confirmtaiondialog component")

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px] text-center">
        <p className="text-sm text-gray-600 mb-6">
            <strong>“Are you sure you want to delete this file?”</strong>
        </p>

        <div className="flex justify-between gap-3">
          <button
            onClick={(e) => {
              onCancel(e);
            }}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg"
          >
            Don't Delete
          </button>
          <button
            onClick={(e) => {
                onDeleteFile(e);
            }}
            className="flex-1 bg-blue-100 hover:bg-blue-200 text-yellow-800 py-2 rounded-lg"
          >
            Delete File
          </button>
        </div>
      </div>
    </div>
  );
}
