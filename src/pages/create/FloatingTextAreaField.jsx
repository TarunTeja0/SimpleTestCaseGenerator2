import { useContext } from "react";
import { TestCaseTemplateContext } from "../../App";

export default function FloatingTextAreaField({fieldName, testCaseDraft, setTestCaseDraft}) {
    // const {staticFields} = useContext(TestCaseTemplateContext);
    // const fieldValue = staticFields[fieldName]
    // console.log("fieldname", fieldValue);

    // let fieldValue = "";

    
   
    function getValue(){
        if(fieldName === "Title") {return testCaseDraft.title}
        else if(fieldName === "Custom.ExpectedResult") {return testCaseDraft.expectedResult}
        else if(fieldName === "Custom.Precondition") {return testCaseDraft.precondition}
    }
 
    function setValue(e){
        if(fieldName === "Title") {setTestCaseDraft(prev => {return {...prev, "title":e.target.value}})}
    else if(fieldName === "Custom.ExpectedResult") {setTestCaseDraft(prev => {return {...prev, "expectedResult":e.target.value}})}
    else if(fieldName === "Custom.Precondition") {setTestCaseDraft(prev => {return {...prev, "precondition":e.target.value}})}
        

    }

    return (
        

            <div className="relative w-full">
                <textarea
                    type="text"
                    rows={5}
                    required
                    id="floating-input"
                    placeholder=" "
                    className="
                        peer 
                        block w-full 
                        rounded-md border border-slate-300 
                        bg-transparent px-3 pt-5 pb-2 text-sm 
                        text-slate-900 
                        focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                    value={getValue()}
                    onChange={(e)=>{setValue(e)}}
                />
                <label
                    htmlFor="floating-input"
                    className="
          absolute left-3 top-2 text-slate-500 text-sm
          transition-all
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-slate-400 peer-placeholder-shown:text-base
          peer-focus:top-1 peer-focus:text-xs peer-focus:text-slate-500
        "
                >
                    {fieldName}
                </label>
            </div>

    )
}

