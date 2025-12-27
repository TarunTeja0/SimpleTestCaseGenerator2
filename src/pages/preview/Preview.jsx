import React, { useContext, useState } from "react";
import Spreadsheet from "react-spreadsheet";
import * as XLSX from "xlsx";
import Lodash from "lodash"

import { useEffect, useRef } from "react";
import { downloadExcel, duplicateTestCasesBySegmentsAndTags, firstRowJsonToReactSpreadsheetRow, HeaderarrayToReactSpreadsheetRow, testCaseRowsGenerator, testCasesWithCorrectSequenceNumbers } from "../../util/reactSpreadsheetUtil";
import { ListOfTestCasesDataContext, TestCaseTemplateContext } from "../../App";
import PreviewTopBar from "./PreviewTopBar";
// import Spreadsheet from "react-spreadsheet";

/**
 * FixedWidthSpreadsheetJS
 *
 * - Uses JS to apply fixed widths per column (inline styles).
 * - Works around library CSS specificity / inline style issues.
 * - Adjust colWidths array to set widths (px).
 */

export default function FixedWidthSpreadsheetJS() {
  
  // const [data, setData] = useState([]);

  
  // const {staticFields} = useContext(TestCaseTemplateContext);
  const {firstRowFields} = useContext(TestCaseTemplateContext);

  const {listOfTestCasesData} = useContext(ListOfTestCasesDataContext);
  
  //returns all the rows of all the test cases without the prefix 
  const arrayOfArrayOfRows = listOfTestCasesData.map((testCaseData)=>{
    const arrayOfRow =testCaseRowsGenerator(firstRowFields, testCaseData);
    return arrayOfRow;
  })

  console.log("arrayOfArrayOfRows", arrayOfArrayOfRows);

  //each array inside this array is a row
  const arrayOfRows = arrayOfArrayOfRows.flat();

  let finalTestCaseRows = duplicateTestCasesBySegmentsAndTags(arrayOfRows, firstRowFields["Custom.UserRole"].value, firstRowFields["Tags"].value, Lodash)
  console.log("finalTestCaseRows", finalTestCaseRows.length);

  finalTestCaseRows = testCasesWithCorrectSequenceNumbers(firstRowFields["Custom.ScenarioID"], firstRowFields["Custom.TestCaseID"], finalTestCaseRows);
  // const arrayOfRows = useRef(arrayOfArrayOfRows.flat());
  
  // useEffect(()=>setData(),[]);
  console.log("arrayOfRows", arrayOfArrayOfRows.flat());
  
  console.log("data for all test cases", ...arrayOfArrayOfRows.flat());
  
  // useEffect(()=>
  //   {const tempData = [firstRowFields,...(arrayOfArrayOfRows.flat())];
  //     setInterval(2000)
  //   setData(tempData)}, []);
  const headers = [
    "ID","Work Item Type","Title","Test Step","Step Action","Step Expected",
    "Custom.ExpectedResult","Custom.DefectID","Custom.ExecutedOn",
    "Custom.ExecutionResult","Custom.ScenarioID","Custom.Interface",
    "Custom.Module","Custom.Precondition","Custom.Scenariodescription",
    "Custom.SprintNo","Custom.SubModule","Custom.ScenarioID","Custom.TestCycle",
    "Custom.TestData","Custom.UserRole","Custom.UserStoryID","Area Path",
    "Assigned To","Custom.Environment","State","Tags"
  ];
  
  
  const firstRow = firstRowJsonToReactSpreadsheetRow(headers, firstRowFields);
  
  const [data, setData] = useState(()=>[
    HeaderarrayToReactSpreadsheetRow(firstRowFields),
    ...finalTestCaseRows
    // ...arrayOfRows
  //   // firstRow
  //   // [{ value: "ID" }, { value: "Name" }, { value: "Age" }],
  //   // [{ value: "1" }, { value: "Alice the first Alice the first Alice the first Alice the first Alice the first Alice the first Alice the first Alice the first Alice the first" }, { value: "25" }],
  //   // [{ value: "2" }, { value: "Bob" }, { value: "30" }],
  //   // [{ value: "3" }, { value: "Charlie" }, { value: "22" }],
  //   // [{ value: "4" }, { value: "Diana" }, { value: "27" }],
  ]);
  
  // downloadExcel(data, XLSX);

  console.log("data", data);
  // widths in px for each column (adjust)
  const colWidths = [100, 150, 100, 450, 120, 450, 450, 450, 100, 100, 100, 250, 100, 100, 300, 100, 130, 100, 250, 100, 100, 180, 100, 160, 300, 100, 100, 100];

  const wrapperRef = useRef(null);
  const applyTimeoutRef = useRef(null);

  // function to apply inline widths
  function applyColumnWidths() {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // find the first table used by react-spreadsheet
    const table = wrapper.querySelector("table");
    if (!table) return;

    // ensure table-layout fixed
    table.style.tableLayout = "fixed";
    table.style.width = "100%";

    // all rows
    const rows = table.querySelectorAll("tr");
    if (!rows || rows.length === 0) return;

    // apply widths to each cell in the column (nth-child)
    for (let colIndex = 0; colIndex < colWidths.length; colIndex++) {
      const w = colWidths[colIndex];
      // apply to header cell if present (first row)
      rows.forEach((row) => {
        const cell = row.children[colIndex];
        if (cell) {
          // set box-sizing and overflow rules and width
          cell.style.boxSizing = "border-box";
          cell.style.minWidth = `${w}px`;
          cell.style.maxWidth = `${w}px`;
          cell.style.width = `${w}px`;
          cell.style.overflow = "hidden";
          cell.style.whiteSpace = "normal";
          // cell.style.
          // cell.style.textOverflow = "wrap";
          cell.style.overflowWrap = "break-word"; 
        }
      });
    }

    // also target inputs created when editing cells (if present)
    const inputs = wrapper.querySelectorAll("input, textarea");
    inputs.forEach((el) => {
      el.style.boxSizing = "border-box";
      // ensure editing inputs don't overflow column
      const parent = el.closest("td, th, div");
      if (parent) {
        const idx = Array.prototype.indexOf.call(parent.parentElement.children, parent);
        const w = colWidths[idx] ?? colWidths[colWidths.length - 1];
        el.style.width = `${w}px`;
      } else {
        // fallback width
        el.style.width = `${colWidths[0] ?? 100}px`;
      }
    });
  }

  // Re-apply widths after mount and after changes.
  useEffect(() => {
    // small helper that retries a couple times in case the grid hasn't finished rendering
    const attempt = () => {
      applyColumnWidths();
    };

    // apply after next paint - helps with timing
    applyTimeoutRef.current = requestAnimationFrame(attempt);

    // also re-apply a little later to handle async renders inside the lib
    const t = setTimeout(attempt, 150);
    const t2 = setTimeout(attempt, 500);

    return () => {
      cancelAnimationFrame(applyTimeoutRef.current);
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [data]); // re-run when grid data changes (editing, etc.)

  // also when window resizes, reapply (optional)
  useEffect(() => {
    const onResize = () => {
      // small debounce
      clearTimeout(applyTimeoutRef.current);
      applyTimeoutRef.current = setTimeout(() => applyColumnWidths(), 80);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="p-4 border overflow-hidden" ref={wrapperRef} >
      
      <PreviewTopBar data={data}/>
      <div className="overflow-x-auto scroll">
        <Spreadsheet data={data} onChange={setData} />
      </div>
      {/* Helpful CSS to make sure content doesn't expand beyond width */}
      <style>{`
        /* ensure inner table does not grow columns automatically */
        .Spreadsheet__sheet table { table-layout: fixed !important; width: 100% !important; }
        /* force input to use the width we set via JS */
        .Spreadsheet__cell input, .Spreadsheet__cell textarea { max-width: 100% !important; box-sizing: border-box !important; }
      `}</style>
    </div>
  );
}


// export default function Preview() {
//   // Static test case data
//   // const testCases = [
//   //   { title: "Login TestLogin TestLogin TestLogin TestLogin TestLogin TestLogin Test", expectedResult: "Login successful", precondition: "User exists" },
//   //   { title: "Logout Test", expectedResult: "Logout successful", precondition: "User logged in" },
//   //   { title: "Profile Update", expectedResult: "Profile updated", precondition: "User logged in" },
//   // ];

//     const [data, setData] = useState([
//     [{ value: "ID" }, { value: "Name" }, { value: "Age" }],
//     [{ value: "1" }, { value: "Alice" }, { value: "25" }],
//     [{ value: "2" }, { value: "Bob" }, { value: "30" }],
//     [{ value: "3" }, { value: "Charlie" }, { value: "22" }],
//     [{ value: "4" }, { value: "Diana" }, { value: "27" }],
//   ]);

//   // Prepare initial spreadsheet rows
//   // const headers = ["Title", "ExpectedResult", "Precondition"];
//   // const rows = testCases.map(tc => [tc.title, tc.expectedResult, tc.precondition]);

//   // Build initial 2D array for Spreadsheet
//   // const [data, setData] = useState([
//   //   headers.map(h => ({ value: h })), // header row
//   //   ...rows.map(r => r.map(cell => ({ value: cell }))),
//   // ]);

//   // Download current spreadsheet as Excel
//   const handleDownload = () => {
//     const aoa = data.map(row => row.map(cell => cell?.value ?? ""));
//     const ws = XLSX.utils.aoa_to_sheet(aoa);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "TestCases");
//     XLSX.writeFile(wb, "testcases.xlsx");
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-semibold mb-2">Test Case Spreadsheet Preview</h2>
      
//       <div className="border overflow-auto max-w-full">
//         <Spreadsheet data={data} onChange={setData} />
//       </div>
//         <style>{`
//         /* ensure table uses fixed layout so cell widths are stable */
//         .Spreadsheet__sheet table,
//         .Spreadsheet__sheet table tbody,
//         .Spreadsheet__sheet table thead {
//           table-layout: fixed !important;
//           width: 100% !important;
//         }

//         /* Target row->cell and also inner content element (covers versions) */
//         .Spreadsheet__row > .Spreadsheet__cell,
//         .Spreadsheet__row > .Spreadsheet__cell > .Spreadsheet__cell__content,
//         .Spreadsheet__row > .Spreadsheet__cell > .Spreadsheet__cell__value {
//           box-sizing: border-box !important;
//           overflow: hidden !important;
//           white-space: nowrap !important;
//           text-overflow: ellipsis !important;
//         }

//         /* Column widths (adjust px values as needed) */
//         .Spreadsheet__row > .Spreadsheet__cell:nth-child(1),
//         .Spreadsheet__row > .Spreadsheet__cell:nth-child(1) > .Spreadsheet__cell__content {
//           min-width: 80px !important;
//           max-width: 80px !important;
//           width: 80px !important;
//         }
//         .Spreadsheet__row > .Spreadsheet__cell:nth-child(2),
//         .Spreadsheet__row > .Spreadsheet__cell:nth-child(2) > .Spreadsheet__cell__content {
//           min-width: 200px !important;
//           max-width: 200px !important;
//           width: 200px !important;
//         }
//         .Spreadsheet__row > .Spreadsheet__cell:nth-child(3),
//         .Spreadsheet__row > .Spreadsheet__cell:nth-child(3) > .Spreadsheet__cell__content {
//           min-width: 100px !important;
//           max-width: 100px !important;
//           width: 100px !important;
//         }

//         /* Optional: prevent cell from expanding when editing */
//         .Spreadsheet__cell input {
//           width: 100% !important;
//           box-sizing: border-box !important;
//         }
//       `}</style>

      

//       <button
//         onClick={handleDownload}
//         className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//       >
//         Download Excel
//       </button>
//     </div>
//   );
// }
