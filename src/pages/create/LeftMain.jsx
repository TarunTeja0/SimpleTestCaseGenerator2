import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import FloatingInputField from "./FloatingInputField";
import FloatingTextAreaField from "./FloatingTextAreaField";
import { IDBContext, ListOfTestCasesDataContext, TestCaseFileNameContext, TestCaseTemplateContext } from "../../App";
import { ClipboardContext, IsUnsavedContext } from "./Create";
import { getTestCaseDataOfFileNameFromStore } from "../../util/dbUtil";

export default function LeftMain() {
  const formRef = useRef(null);
  const { testCaseFileName } = useContext(TestCaseFileNameContext);
  const { listOfTestCasesData, setListOfTestCasesData } = useContext(ListOfTestCasesDataContext);
    const { firstRowFields, setFirstRowFields } = useContext(TestCaseTemplateContext);
  
  const {clipboardTestCaseData, setClipboardTestCaseData} = useContext(ClipboardContext);

  const {iDBConnection, setIDBConnection} =useContext(IDBContext);

  const {isUnsaved, setIsUnsaved} = useContext(IsUnsavedContext);

  useEffect(()=>{
  (async () =>{
    getTestCaseDataOfFileNameFromStore(iDBConnection, "testCaseData", testCaseFileName);
    const res = await getTestCaseDataOfFileNameFromStore(iDBConnection, "testCaseData", testCaseFileName, );
    console.log("what", res);
    console.log("listOfTestCasesData", res.listOfTestCasesData)
    console.log("firstRowFields", res.firstRowFields)
    if(res.listOfTestCasesData && res.firstRowFields){
      // if(res.listOfTestCasesData !== undefined || res.listOfTestCasesData?.lenght !== 0)
        setListOfTestCasesData(res.listOfTestCasesData);
      // if(!res.firstRowFields === undefined)
        setFirstRowFields(res.firstRowFields);
    }
    else{
      setListOfTestCasesData([]);
      // if(!res.firstRowFields === undefined)
        setFirstRowFields({
    "ID": { index: 0, type: "EMPTY", value: "" },
    "Work Item Type": { index: 1, type: "STATIC", value: "" },
    "Title": { index: 2, type: "DYNAMIC", value: "" },
    "Test Step": { index: 3, type: "DYNAMIC", value: "" },
    "Step Action": { index: 4, type: "DYNAMIC", value: "" },
    "Step Expected": { index: 5, type: "DYNAMIC", value: "" },
    "Custom.ExpectedResult": { index: 6, type: "DYNAMIC", value: "" },
    "Custom.DefectID": { index: 7, type: "EMPTY", value: "" },
    "Custom.ExecutedOn": { index: 8, type: "EMPTY", value: "" },
    "Custom.ExecutionResult": { index: 9, type: "EMPTY", value: "" },
    "Custom.ScenarioID": { index: 10, type: "PREFIX+SEQUENCE", value: "" },
    "Custom.Interface": { index: 11, type: "EMPTY", value: "" },
    "Custom.Module": { index: 12, type: "EMPTY", value: "" },
    "Custom.Precondition": { index: 13, type: "DYNAMIC", value: "" },
    "Custom.Scenariodescription": { index: 14, type: "EMPTY", value: "" },
    "Custom.SprintNo": { index: 15, type: "STATIC", value: "" },
    "Custom.SubModule": { index: 16, type: "EMPTY", value: "" },
    "Custom.TestCaseID": { index: 17, type: "PREFIX+SEQUENCE", value: "" },
    "Custom.TestCycle": { index: 18, type: "EMPTY", value: "" },
    "Custom.TestData": { index: 19, type: "EMPTY", value: "" },
    "Custom.UserRole": { index: 20, type: "CATEGORICAL", value: "" },
    "Custom.UserStoryID": { index: 21, type: "STATIC", value: "" },
    "Area Path": { index: 22, type: "STATIC", value: "" },
    "Assigned To": { index: 23, type: "STATIC", value: "" },
    "Custom.Environment": { index: 24, type: "STATIC", value: "" },
    "State": { index: 25, type: "STATIC", value: "" },
    "Tags": { index: 26, type: "CATEGORICAL", value: "" }
        });
    }
    

    })();
    
  },[]);



  useEffect(()=>{
    if(clipboardTestCaseData !== null){
      setTestCaseDraft(clipboardTestCaseData);
    }
  }, [clipboardTestCaseData])
  console.log("clipboardTestCaseData", clipboardTestCaseData);

  const [testCaseDraft, setTestCaseDraft] = useState( {
    testCaseIndex: "",
    title: "",
    expectedResult:"",
    precondition:"",
    steps: [
      { StepNumber: 1, StepAction: "", StepExpectedResult: "" },
    ],
  });

  console.log("test case values:", testCaseDraft);

  function handleSubmit(e) {
    e.preventDefault();              // stop navigation
    const form = formRef.current;

    // 1) Run built-in validation and show native messages if invalid
    // reportValidity() returns true if valid; false and shows messages if not
    if (!form.reportValidity()) {
      // focus the first invalid field (optional, improves UX/accessibility)
      const firstInvalid = form.querySelector(':invalid');
      firstInvalid?.focus();
      return; // don't proceed
    }
  }

   // Steps handlers
  const addStep = () => {
    setTestCaseDraft((prev) => {
      const nextNo = prev.steps.length + 1;
      return {
        ...prev,
        steps: [
          ...prev.steps,
          { StepNumber: nextNo, StepAction: "", StepExpectedResult: "" },
        ],
      };
    });
  };

  const updateStep = (
    index,
    key,
    val
  ) => {
    setTestCaseDraft((prev) => {
      const copy = [...prev.steps];
      copy[index] = { ...copy[index], [key]: val };
      return { ...prev, steps: copy };
    });
  };

  const removeStep = (index) => {
    setTestCaseDraft((prev) => {
      const copy = prev.steps.filter((_, i) => i !== index);
      // re-number
      const renumbered = copy.map((s, i) => ({
        ...s,
        StepNumber: i + 1,
      }));
      return { ...prev, steps: renumbered };
    });
  };

  const onReset = () => {
        setTestCaseDraft({
        testCaseIndex: "",
        title: "",
        expectedResult:"",
        precondition:"",
        steps: [
          { StepNumber: 1, StepAction: "", StepExpectedResult: "" },
        ],
      })
                // reset
                // settestCaseDraft({ ...initialHeadertestCaseDraft, steps: [{ StepNumber: 1, StepAction: "", StepExpectedResult: "" }] });
  }

  const onSaveAndNext = (e) => {
      handleSubmit(e);
      //when no elements were there
      if(testCaseDraft.steps.length === 1 && (testCaseDraft.steps[0].StepAction === "" || testCaseDraft.steps[0].StepExpectedResult == "")){
        console.log("should add atleast one step");
        return
      }
      //for copy
      if(testCaseDraft.testCaseIndex === ""){
        console.log("list of tc data in left", listOfTestCasesData);
        setListOfTestCasesData(prev =>{
          testCaseDraft.testCaseIndex = listOfTestCasesData?.length+1;
          return [...prev, testCaseDraft]
        } )
      }
      //for edit
      else if(Number.isInteger(testCaseDraft.testCaseIndex)){
        console.log("for edit - save & continue")
        setListOfTestCasesData(prevListOfTestCasesData => {
          return prevListOfTestCasesData.map((testCaseData, idx)=>{
            if(testCaseDraft.testCaseIndex === testCaseData.testCaseIndex){
              return testCaseDraft;
            }
            return testCaseData;
          })
        })
      }
      setIsUnsaved(true);
      onReset();
    }
  


  return (
    <div>
      <form ref={formRef} novalidate>
      <h1 className="text-2xl font-bold text-left">Create Test Cases</h1>
      <h1 className="text-xl font-bold text-left mt-4">File Name : {testCaseFileName}</h1>

      <div className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-3 w-full mb-2">
        {
          ['Title',
            'Custom.ExpectedResult',
            'Custom.Precondition'].map((field) => {
              return <FloatingTextAreaField key={field} fieldName={field} testCaseDraft={testCaseDraft} setTestCaseDraft={setTestCaseDraft} />
            })
        }
      </div>

      {/* test steps */}
     <section className="bg-white rounded-2xl shadow p-4 border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">Steps</h2>
              <button
                type="button"
                onClick={addStep}
                className="inline-flex items-center gap-2 border rounded-2xl px-3 py-1 hover:bg-gray-50"
                title="Add Step"
              >
                <span className="text-xl leading-none">＋</span>
                <span>Add Step</span>
              </button>
            </div>

            {/* Table-like header */}
            <div className="grid grid-cols-12 font-medium text-gray-600 text-sm px-2 py-2">
              <div className="col-span-2">Step Number</div>
              <div className="col-span-5">Step Action</div>
              <div className="col-span-5">Step Expected Result</div>
            </div>

            <div className="space-y-3">
              {testCaseDraft.steps.map((step, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-2 items-start bg-gray-50 rounded-2xl p-3 border"
                >
                  <input 
                    className="col-span-2 border rounded-xl px-3 py-2 w-full pointer-events-none"
                    type="number"
                    
                    min={1}
                    value={step.StepNumber}
                    onChange={(e) =>
                      updateStep(index, "StepNumber", Number(e.target.value))
                    }
                  />

                  <textarea
                    className="col-span-5 border rounded-xl px-3 py-2 w-full"
                    rows={2}
                    required
                    placeholder="Enter Step Action"
                    value={step.StepAction}
                    onChange={(e) => updateStep(index, "StepAction", e.target.value)}
                  />

                  <textarea
                    className="col-span-5 border rounded-xl px-3 py-2 w-full"
                    rows={2}
                    required
                    placeholder="Enter Step Expected Result"
                    value={step.StepExpectedResult}
                    onChange={(e) =>
                      updateStep(index, "StepExpectedResult", e.target.value)
                    }
                  />

                  <div className="col-span-12 flex justify-end gap-2">
                    <button
                      type="submit"
                      
                      className="px-3 py-1 rounded-xl border hover:bg-gray-100"
                      onClick={() => removeStep(index)}
                    >
                      Delete
                    </button>
                    {index === testCaseDraft.steps.length - 1 && (
                      <button
                        type="button"
                        className="px-3 py-1 rounded-xl border hover:bg-gray-100"
                        onClick={addStep}
                      >
                        + Add another
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

            {/* buttons */}
           <div className="flex items-center justify-end gap-3 w-full mt-4 ">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-2xl shadow"
              onClick={e=>onSaveAndNext(e)}
            >
              Save & next
            </button>
            <button
              type="button"
              className="border px-4 py-2 rounded-2xl"
              onClick={onReset}
            >
              Reset
            </button>
          </div>
              </form>
    </div >
  )
}



// export default function LeftMain() {
//   // Build initial header testCaseDraft object (all empty strings)
//   // const initialHeadertestCaseDraft = useMemo(() => {
//   //   const obj = {};
//   //   Object.keys(FIELD_CONFIG)
//   //     .filter((k) => !STEP_KEYS.includes(k))
//   //     .forEach((k) => (obj[k] = ""));
//   //   return obj;
//   // }, []);

//   // const [testCaseDraft, settestCaseDraft] = useState<FormtestCaseDraft>({
//   //   ...initialHeadertestCaseDraft,
//   //   steps: [
//   //     { StepNumber: 1, StepAction: "", StepExpectedResult: "" },
//   //   ],
//   // });

//   // Utility to update header (non-step) fields
//   // const updateHeader = (key, val) => {
//   //   settestCaseDraft((prev) => ({ ...prev, [key]: val }));
//   // };

//   // Steps handlers
//   // const addStep = () => {
//   //   settestCaseDraft((prev) => {
//   //     const nextNo = prev.steps.length + 1;
//   //     return {
//   //       ...prev,
//   //       steps: [
//   //         ...prev.steps,
//   //         { StepNumber: nextNo, StepAction: "", StepExpectedResult: "" },
//   //       ],
//   //     };
//   //   });
//   // };

//   const removeStep = (index) => {
//     settestCaseDraft((prev) => {
//       const copy = prev.steps.filter((_, i) => i !== index);
//       // re-number
//       const renumbered = copy.map((s, i) => ({
//         ...s,
//         StepNumber: i + 1,
//       }));
//       return { ...prev, steps: renumbered };
//     });
//   };

//   const updateStep = (
//     index,
//     key,
//     val
//   ) => {
//     settestCaseDraft((prev) => {
//       const copy = [...prev.steps];
//       copy[index] = { ...copy[index], [key]: val };
//       return { ...prev, steps: copy };
//     });
//   };

//   const onSubmit = (e) => {
//     e.preventDefault();
//     // You can send `testCaseDraft` to your API or convert to Excel/CSV.
//     console.log("Form submit:", testCaseDraft);
//     alert("Check the console for submitted JSON data.");
//   };

//   // Build list of header fields (everything except the 3 step keys)
//   const headerKeys = Object.keys(FIELD_CONFIG).filter(
//     (k) => !STEP_KEYS.includes(k)
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-2xl font-semibold mb-4">Test Case Form</h1>
//         <p className="text-sm text-gray-600 mb-6">
//           Header fields appear first. Steps are on a separate line below, with a
//           + button to add more rows.
//         </p>

//         <form onSubmit={onSubmit} className="space-y-8">
//           {/* Header Fields */}
//           <section className="bg-white rounded-2xl shadow p-4 border">
//             <h2 className="text-lg font-medium mb-3">Header</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {headerKeys.map((key) => (
//                 <div key={String(key)} className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-1">
//                     {String(key)}
//                   </label>
//                   {String(key).toLowerCase().includes("description") ||
//                   String(key).toLowerCase().includes("precondition") ? (
//                     <textarea
//                       className="border rounded-xl px-3 py-2 focus:outline-none focus:ring w-full"
//                       rows={3}
//                       value={testCaseDraft[key]}
//                       onChange={(e) => updateHeader(key, e.target.value)}
//                       placeholder={`Enter ${String(key)}`}
//                     />
//                   ) : (
//                     <input
//                       type="text"
//                       className="border rounded-xl px-3 py-2 focus:outline-none focus:ring w-full"
//                       value={testCaseDraft[key]}
//                       onChange={(e) => updateHeader(key, e.target.value)}
//                       placeholder={`Enter ${String(key)}`}
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Steps Section */}
//           <section className="bg-white rounded-2xl shadow p-4 border">
//             <div className="flex items-center justify-between mb-3">
//               <h2 className="text-lg font-medium">Steps</h2>
//               <button
//                 type="button"
//                 onClick={addStep}
//                 className="inline-flex items-center gap-2 border rounded-2xl px-3 py-1 hover:bg-gray-50"
//                 title="Add Step"
//               >
//                 <span className="text-xl leading-none">＋</span>
//                 <span>Add Step</span>
//               </button>
//             </div>

//             {/* Table-like header */}
//             <div className="grid grid-cols-12 font-medium text-gray-600 text-sm px-2 py-2">
//               <div className="col-span-2">Step Number</div>
//               <div className="col-span-5">Step Action</div>
//               <div className="col-span-5">Step Expected Result</div>
//             </div>

//             <div className="space-y-3">
//               {testCaseDraft.steps.map((step, index) => (
//                 <div
//                   key={index}
//                   className="grid grid-cols-12 gap-2 items-start bg-gray-50 rounded-2xl p-3 border"
//                 >
//                   <input
//                     className="col-span-2 border rounded-xl px-3 py-2 w-full"
//                     type="number"
//                     min={1}
//                     value={step.StepNumber}
//                     onChange={(e) =>
//                       updateStep(index, "StepNumber", Number(e.target.value))
//                     }
//                   />

//                   <textarea
//                     className="col-span-5 border rounded-xl px-3 py-2 w-full"
//                     rows={2}
//                     placeholder="Enter Step Action"
//                     value={step.StepAction}
//                     onChange={(e) => updateStep(index, "StepAction", e.target.value)}
//                   />

//                   <textarea
//                     className="col-span-5 border rounded-xl px-3 py-2 w-full"
//                     rows={2}
//                     placeholder="Enter Step Expected Result"
//                     value={step.StepExpectedResult}
//                     onChange={(e) =>
//                       updateStep(index, "StepExpectedResult", e.target.value)
//                     }
//                   />

//                   <div className="col-span-12 flex justify-end gap-2">
//                     <button
//                       type="button"
//                       className="px-3 py-1 rounded-xl border hover:bg-gray-100"
//                       onClick={() => removeStep(index)}
//                     >
//                       Delete
//                     </button>
//                     {index === testCaseDraft.steps.length - 1 && (
//                       <button
//                         type="button"
//                         className="px-3 py-1 rounded-xl border hover:bg-gray-100"
//                         onClick={addStep}
//                       >
//                         + Add another
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Actions */}
//           <div className="flex items-center gap-3">
//             <button
//               type="submit"
//               className="bg-black text-white px-4 py-2 rounded-2xl shadow"
//             >
//               Save
//             </button>
//             <button
//               type="button"
//               className="border px-4 py-2 rounded-2xl"
//               onClick={() => {
//                 // reset
//                 settestCaseDraft({ ...initialHeadertestCaseDraft, steps: [{ StepNumber: 1, StepAction: "", StepExpectedResult: "" }] });
//               }}
//             >
//               Reset
//             </button>
//           </div>
//         </form>

//         {/* Debug Preview */}
//         <pre className="mt-6 text-xs bg-gray-100 p-3 rounded-xl overflow-auto">
// {JSON.stringify(testCaseDraft, null, 2)}
//         </pre>
//       </div>
//     </div>
//   );
// }
