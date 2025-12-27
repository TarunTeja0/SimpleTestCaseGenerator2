import { useRef } from "react";

function FilePicker({onFileSelect}) {
  const fileInputRef = useRef(null);

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".xls,.xlsx"
        onChange={onFileSelect}
      />

      <button
        class="absolute top-1 right-10 hover:bg-black  hover:text-white text-black bg-slate-300 font-semibold px-6 py-3 rounded-lg
               "
               onClick={() => fileInputRef.current.click()}
              >
        Import
      </button>
    </>
  );
}

export default FilePicker;