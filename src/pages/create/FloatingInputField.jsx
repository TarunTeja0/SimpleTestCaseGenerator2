import { useContext } from "react";
import { TestCaseTemplateContext } from "../../App";

export default function FloatingInputField({fieldName,fieldValue, setFieldValue, setIsUnsaved}) {
    // const {staticFields} = useContext(TestCaseTemplateContext);
    // const fieldValue = staticFields[fieldName]
    console.log("fieldname", fieldValue);

    return (
        

            <div className="relative w-full">
                <input
                    type="text"
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
                    value={fieldValue}
                    onChange={(e)=>{ setFieldValue(e.target.value);
                                     setIsUnsaved(true);
                                    }
                                }
                />
                <label
                    htmlFor="floating-input"
                    
                    className=" pointer-events-none
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

