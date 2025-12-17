import React, { useContext } from "react";
import * as XLSX from "xlsx";
import { TestCaseFileNameContext } from "../../App";
import { useNavigate } from "react-router-dom";

/**
 * Props:
 * - filename: string
 * - data: 2D array in react-spreadsheet shape: Array<Array<{ value }>> OR plain 2D array
 * - onClose: () => void
 */
export default function PreviewTopBar({ data = []}) {
  // normalize react-spreadsheet cell objects -> plain values
    const navigate = useNavigate();
  const {testCaseFileName: filename} = useContext(TestCaseFileNameContext);

  const toAOA = (rows) => {
    if (!Array.isArray(rows)) return [];
    return rows.map(row =>
      (Array.isArray(row) ? row : []).map(cell => {
        if (cell == null) return "";
        if (typeof cell === "object" && "value" in cell) return cell.value ?? "";
        return cell;
      })
    );
  };

  const handleDownload = () => {
    const aoa = toAOA(data);
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, filename || "preview.xlsx");
  };

  return (
    <div className="w-full bg-white border-b px-4 py-3 flex items-center justify-between ">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xl text-gray-700 font-medium">Preview:</span>
        <span className="text-xl truncate"  style={{ maxWidth: 420 }}>{filename || "sample file name"}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleDownload}
          className="px-3 py-1.5 rounded-md bg-gray-500 hover:bg-black text-white text-xl"
        >
          Download Excel
        </button>

        <button
          onClick={()=>navigate(-1)}
          className="px-3 py-1.5 rounded-md bg-white border-2 border-slate-500 border text-black hover:bg-black hover:text-white text-white text-xl"
        >
          Close Preview
        </button>
      </div>
    </div>
  );
}
