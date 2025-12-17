import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useRef, useEffect, useState } from 'react';

function FloatingField({ label, value, textareaRef, height }) {
  return (
    <div className="relative flex-1">
      <label
        className={`absolute -top-2 left-2 px-1 bg-white text-xs text-slate-500 transition-all pointer-events-none ${value ? 'opacity-100' : 'opacity-0'
          }`}
      >
        {label}
      </label>
      <textarea
        ref={textareaRef}
        className="w-full p-1.5 border border-slate-300 bg-white text-slate-900 rounded-md overflow-hidden text-xs resize-none"
        style={{ height }}
        value={value}
        readOnly
      />
    </div>
  );
}

function SimpleField({ value, height, textareaRef }) {
  return (
    <textarea
      ref={textareaRef}
      className="flex-1 p-1.5 border border-slate-300 bg-white text-slate-900 rounded-md overflow-hidden text-[10px] resize-none"
      style={{ height }}
      value={value}
      readOnly
    />
  );
}

export default function TestCaseCard({ testCaseIndex, testCaseData, testCaseNum, onDelete, onCopy, onEdit }) {
  const titleRef = useRef(null);
  const expectedRef = useRef(null);
  const preconditionRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState('auto');

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: testCaseIndex })


  // For steps testSteps: create refs and heights per row so they expand together
  const testSteps = testCaseData?.steps || [];
  const actionRefs = useRef(testSteps.map(() => React.createRef()));
  const resultRefs = useRef(testSteps.map(() => React.createRef()));
  const [rowHeights, setRowHeights] = useState(testSteps.map(() => '2.5rem'));

  useEffect(() => {
    const adjustHeaderHeights = () => {
      const heights = [titleRef, expectedRef, preconditionRef]
        .map(ref => ref.current?.scrollHeight || 0);
      const maxHeight = Math.max(...heights, 48); // minimum 48px (~3rem)
      setHeaderHeight(maxHeight + 'px');
    };

    const adjustRowHeights = () => {
      const newHeights = testSteps.map((_, idx) => {
        const a = actionRefs.current[idx]?.current?.scrollHeight || 0;
        const r = resultRefs.current[idx]?.current?.scrollHeight || 0;
        const max = Math.max(a, r, 40); // minimum
        return max + 'px';
      });
      setRowHeights(newHeights);
    };

    const adjustAll = () => {
      adjustHeaderHeights();
      adjustRowHeights();
    };

    // small timeout to allow DOM to render properly
    const t = setTimeout(adjustAll, 0);
    window.addEventListener('resize', adjustAll);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', adjustAll);
    };
  }, []);

  const deleteTestCaseFunc = () => {

  }

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  return (
    <div className='overflow-visible cursor-default' ref={setNodeRef} {...attributes} {...listeners} style={style} onClick={(e)=> console.log("clicked on? "+ e.target)}>
      <div className="mb-2 w-11/12 mx-auto p-4 border border-slate-300 rounded-xl shadow bg-white text-slate-900 text-sm  hover:shadow-xl hover:scale-110 transition duration-200 hover:z-20  relative">
      {/* <div className="mb-2 w-11/12 mx-auto p-4 border border-slate-300 rounded-xl shadow bg-white text-slate-900 text-sm "> */}

        {/* Heading */}

        <h2 className="text-md text-left font-bold mb-3 text-slate-900">Test case {testCaseNum + 1}</h2>

        {/* Header Fields */}
        <div className="flex items-start gap-2">
          <FloatingField label="Title" value={testCaseData.title} textareaRef={titleRef} height={headerHeight} />
          <FloatingField label="Expected Result" value={testCaseData.expectedResult} textareaRef={expectedRef} height={headerHeight} />
          <FloatingField label="Precondition" value={testCaseData.precondition} textareaRef={preconditionRef} height={headerHeight} />
        </div>

        {/* Steps Table */}
        <div className="mt-3 border border-slate-300 rounded-md p-2 bg-slate-50">
          <div className="flex text-xs font-semibold text-slate-700 mb-1">
            <div className="w-10">Step</div>
            <div className="flex-1">Action</div>
            <div className="flex-1">Result</div>
          </div>

          <div className="space-y-1.5">
            {testSteps.map((step, idx) => (
              <div key={step.StepNumber} className="flex items-start gap-2">
                <div className="w-10 pt-1 text-xs text-slate-600">{step.StepNumber}</div>
                <SimpleField value={step.StepAction} height={rowHeights[idx]} textareaRef={actionRefs.current[idx]} />
                <SimpleField value={step.StepExpectedResult} height={rowHeights[idx]} textareaRef={resultRefs.current[idx]} />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 flex justify-between items-center">
          <button className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm " onClick={(e) => { onDelete(testCaseNum)}}>Delete</button>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 rounded-full border border-slate-400 text-slate-900 text-sm z-auto"
              onClick={() => {
                console.log("inside copy");
                console.log("clicked copy");
                onCopy(testCaseNum)
              }}>COPY</button>
            <button className="px-4 py-1.5 rounded-full border border-slate-400 text-slate-900 text-sm" onClick={() => onEdit(testCaseNum)}>EDIT</button>
          </div>
        </div>
      </div>
    </div>
  );
}


// import React, { useRef, useEffect, useState } from 'react';

// function FloatingField({ label, value, textareaRef, height }) {
//   return (
//     <div className="relative flex-1">
//       <label
//         className={`absolute -top-2 left-2 px-1 bg-white text-xs text-slate-500 transition-all pointer-events-none ${
//           value ? 'opacity-100' : 'opacity-0'
//         }`}
//       >
//         {label}
//       </label>
//       <textarea
//         ref={textareaRef}
//         className="w-full p-1.5 border border-slate-300 bg-white text-slate-900 rounded-md overflow-hidden text-sm"
//         style={{ height }}
//         value={value}
//         readOnly
//       />
//     </div>
//   );
// }

// function SimpleField({ value, height }) {
//   return (
//     <textarea
//       className="flex-1 p-1.5 border border-slate-300 bg-white text-slate-900 rounded-md overflow-hidden text-sm"
//       style={{ height }}
//       value={value}
//       readOnly
//     />
//   );
// }

// export default function TestCaseCard() {
//   const titleRef = useRef(null);
//   const expectedRef = useRef(null);
//   const preconditionRef = useRef(null);
//   const [height, setHeight] = useState('auto');

//   useEffect(() => {
//     const adjustHeights = () => {
//       const heights = [titleRef, expectedRef, preconditionRef]
//         .map(ref => ref.current?.scrollHeight || 0);
//       const maxHeight = Math.max(...heights, 48); // minimum 48px (~3rem)
//       setHeight(maxHeight + 'px');
//     };

//     adjustHeights();
//     window.addEventListener('resize', adjustHeights);
//     return () => window.removeEventListener('resize', adjustHeights);
//   }, []);

//   return (
//     <div className="max-w-md mx-auto p-3 border border-slate-300 rounded-xl shadow bg-white text-slate-900 text-sm">
//       {/* Heading */}
//       <h2 className="text-lg font-bold mb-3 text-slate-900">Test case 1</h2>

//       {/* Header Fields */}
//       <div className="flex items-start gap-2">
//         <FloatingField label="Title" value="Title" textareaRef={titleRef} height={height} />
//         <FloatingField label="Expected Result" value="Expected Result" textareaRef={expectedRef} height={height} />
//         <FloatingField label="Precondition" value="Precondition" textareaRef={preconditionRef} height={height} />
//       </div>

//       {/* Steps Table */}
//       <div className="mt-3 border border-slate-300 rounded-md p-2 bg-slate-50">
//         <div className="flex text-xs font-semibold text-slate-700 mb-1">
//           <div className="w-10">Step</div>
//           <div className="flex-1">Action</div>
//           <div className="flex-1">Result</div>
//         </div>

//         <div className="space-y-1.5">
//           {[1, 2, 3, 4].map(num => (
//             <div key={num} className="flex items-start gap-2">
//               <div className="w-10 pt-1 text-xs text-slate-600">{num}</div>
//               <SimpleField value={`Step ${num} action`} height={'2.5rem'} />
//               <SimpleField value={`Step ${num} result`} height={'2.5rem'} />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="mt-3 flex justify-between items-center">
//         <button className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm">Delete</button>
//         <div className="flex gap-2">
//           <button className="px-4 py-1.5 rounded-full border border-slate-400 text-slate-900 text-sm">COPY</button>
//           <button className="px-4 py-1.5 rounded-full border border-slate-400 text-slate-900 text-sm">EDIT</button>
//         </div>
//       </div>
//     </div>
//   );
// }