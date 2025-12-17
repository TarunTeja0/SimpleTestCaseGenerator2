import { useContext, useRef } from "react";
import { TestCaseTemplateContext } from "../../App";

export default function ImmutableFloatingInputField({fieldName, fieldValue}) {
    // const {staticFields} = useContext(TestCaseTemplateContext);
    // const fieldValue = staticFields[fieldName]
    // console.log("fieldname", fieldValue);

    const textareaRef = useRef(null);

      const autoGrow = (e) => {
    const el = textareaRef.current;
    // reset height to calculate new scrollHeight
    el.style.height = "auto";
    // set height equal to scrollHeight
    el.style.height = el.scrollHeight + "px";
    // call onChange if provided
    // onChange?.(e);
  };

    return (
        

            <div className="relative w-full border-slate-300 pointer-events-none mb-2">
                <textarea
                   ref={textareaRef}
                    onInput={autoGrow}
                    rows={1}
                    type="text"
                    id="floating-input"
                    placeholder=" "
                    className=" resize-none overflow-hidden
                        peer 
                        block w-full 
                        rounded-md border border-slate-300 
                        bg-transparent px-3 pt-7 pb-2 text-sm 
                        text-slate-900 
                        focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                    value={fieldValue}
                    
                />
                <label
                    htmlFor="floating-input"
                    
                    className="  pointer-events-none
          absolute left-3 top-2 text-slate-500 text-sm 
          transition-all
          peer-placeholder-shown:top-3 peer-placeholder-shown:text-slate-400 peer-placeholder-shown:text-base
          peer-focus:top-0 peer-focus:text-xs peer-focus:text-slate-500
        "
                >
                    {fieldName}
                </label>
            </div>

    )
}

