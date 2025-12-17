import React, { useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { TestCaseTemplateContext } from "../../App";
import FloatingInputField from "./FloatingInputField";
import TestCaseCard from "./TestCaseCard";
import { useNavigate } from "react-router-dom";
import { IsUnsavedContext } from "./Create";

export default function TopFoldNavSheet() {
  const [open, setOpen] = useState(true);
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const [fading, setFading] = useState(false);
  // const [dynamicColumns, setDynamicColumns] = useState({'ID': true, 'WorkItemType': false, 'Title': false, 'StepNumber': false,	'StepAction': false, 'StepExpectedResult': false,	'ExpectedResult': false, 'DefectID': false, 'ExecutedOn': false,	'ExecutionResult': false, 'ScenarioID': false, 'Interface': false, 'Module': false, 'Precondition': false,	'ScenarioDescription': false, 'SprintNo': false, 'SubModule': false,	'TestCycle': false, 'UserRole': false, 'UserStoryID': false,	'AreaPath': false,	'AssignedTo': false, 'Environment': false, 'State': false, 'Tags': false})

  // const [staticColumns, setStaticColumns] = useState({ 'WorkItemType': "", 'Title': "", 'StepNumber': "",	'StepAction': "", 'StepExpectedResult': false,	'ExpectedResult': false, 'DefectID': false, 'ExecutedOn': false,	'ExecutionResult': false, 'ScenarioID': false, 'Interface': false, 'Module': false, 'Precondition': false,	'ScenarioDescription': false, 'SprintNo': false, 'SubModule': false,	'TestCycle': false, 'UserRole': false, 'UserStoryID': false,	'AreaPath': false,	'AssignedTo': false, 'Environment': false, 'State': false, 'Tags': false})

  const { firstRowFields, setFirstRowFields } = useContext(TestCaseTemplateContext);

  const {isUnsaved, setIsUnsaved} = useContext(IsUnsavedContext);



  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);


  // const toggleDynamicColumns = (item) => {
  //   dynamicColumns[item] = !dynamicColumns[item]
  //   setDynamicColumns(dynamicColumns);
  // }

  return (
    // <div className={`min-h-screen bg-slate-50 text-slate-800 transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}>
    <div className={` bg-slate-50 text-slate-800 `}>

      {/* Toggle Handle (always visible) */}
      {!open &&
        <div className="fixed top-0 left-0 right-0 z-[60] flex justify-center pointer-events-none">
          <button
            onClick={() => setOpen((v) => !v)}
            className="pointer-events-auto mt-0 inline-flex items-center gap-2 rounded-b-2xl bg-white/90 px-4 py-2 shadow-md ring-1 ring-slate-200 backdrop-blur-md hover:bg-white"
            aria-expanded={open}
            aria-controls="top-folding-nav"
          >
            <span className="font-medium">Edit</span>
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      }
      {/* <div className="flex flex-col">

        <div className="flex justify-between text-2xl font-bold bg-white  text-left py-4 px-2 shadow-md z-30">
          <div className="">Create Test Cases</div>
          <div className="text-lg flex gap-5 me-10  ">
            <button className="px-3 py-1.5 rounded-md bg-white border-2 border-slate-500 border text-black hover:bg-black hover:text-white text-white text-xl"> Save & Exit</button>
            <button className="px-3 py-1.5 rounded-md bg-gray-500 hover:bg-black text-white text-xl" onClick={()=>{setFading(true); // trigger CSS fade
    setTimeout(() => navigate("/preview"), 300);}}> Submit & Preview</button>
          </div>
        </div>
        
        <div className="grid grid-cols-12   ">
          <div className="col-span-7 bg-white p-6 border border-r-gray-300 z-20 rounded-3 rounded">
            <LeftMain />
          </div>
          <div className="col-span-5  bg-slate-50 pb-2 max-h-screen overflow-y-auto overflow-x-hidden custom-scrollbar z-20 ">
            <RightMain />
          

          </div>
        </div>
      </div> */}

      {/* Folding Nav Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="top-folding-nav"
            ref={panelRef}
            className="fixed top-0 left-0 right-0 z-50 origin-top"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
          >
            <div className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 shadow-lg ring-1 ring-slate-200">
              {/* Safe area spacer so it doesn't overlap the handle */}
              <div className="h-12" />

              <div className="max-h-[70vh] overflow-y-auto mx-auto max-w-6xl px-4 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight">Test cases </h1>
                    <p className="text-sm text-slate-600">Common Fields</p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                    aria-label="Close navigation"
                  >
                    <X className="mr-2 h-4 w-4" /> Close
                  </button>
                </div>

                {/* first version */}
                {/* <nav className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {Object.keys(staticFields).map(field => {
                    return <FloatingInputField key={field} fieldName={field} setFieldValue={fieldValue => setStaticFields((staticFields => ({ ...staticFields, [field]: fieldValue })))} />
                  })}
                </nav> */}

                {/* <nav className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {Object.keys(firstRowFields).map(field => {
                    if(field.type === "STATIC" || field.type === "CATEGORICAL"){
                      return <FloatingInputField key={field} fieldName={field} setFieldValue={fieldValue => setFirstRowFields((staticFields => ({ ...staticFields, [field]: fieldValue })))} />
                    }
                    return null;
                  })}
                </nav> */}

              <nav className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                {firstRowFields && Object.entries(firstRowFields)
                  .filter(([_, fieldObj]) =>
                    fieldObj.type === "STATIC" || fieldObj.type === "CATEGORICAL" || fieldObj.type === "PREFIX+SEQUENCE"
                  )
                  .map(([fieldName, fieldObj]) => (
                    <FloatingInputField
                      key={fieldName}
                      fieldName={fieldName}
                      fieldValue={fieldObj.value}
                      setFieldValue={(newValue) =>
                        setFirstRowFields(prev => ({
                          ...prev,
                          [fieldName]: { ...prev[fieldName], value: newValue }
                        }))
                      }
                      setIsUnsaved = {setIsUnsaved}
                    />
                  ))
                }
              </nav>


              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content: list of fields under the nav */}
      {/* <main className="mx-auto max-w-3xl px-4 pt-20 pb-24">
        <header className="mb-6">
          <h2 className="text-2xl font-semibold">Fields</h2>
          <p className="text-sm text-slate-600">This list stays under the top navigation bar. Open/close the bar to see it fold from the top.</p>
        </header>

        <ul className="space-y-3">
          {Array.from({ length: 16 }).map((_, i) => (
            <li
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <label className="block text-sm font-medium text-slate-700">Field {i + 1}</label>
              <input
                type="text"
                placeholder={`Enter value for field ${i + 1}`}
                className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
              />
            </li>
          ))}
        </ul>
      </main> */}

      {/* Optional backdrop when open (click to close) */}
      <AnimatePresence>
        {open && (
          <motion.button
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
