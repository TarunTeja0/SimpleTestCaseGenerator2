import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { TestCaseFileNameContext } from "../../App";

export default function HomeTestCaseCard ({f, setFading}){
    const navigate = useNavigate();
    const {saveTestCaseFileNameFunc} = useContext(TestCaseFileNameContext);
    
    const onClick = () => {

        saveTestCaseFileNameFunc(f.fileName);
        setFading();
        setTimeout(() =>  navigate("/create?filename="+f.fileName), 400);
      
    }
   
   return(
    //  <div className="bg-white rounded-xl shadow-md p-6 hover:scale-[1.02] transition-transform"
            
    //           style={{
    //             border: "1px solid #ddd",
    //             padding: 12,
    //             borderRadius: 8,
    //             boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    //             background: "#fff",
    //           }}
    //         >
    //           <div style={{ fontWeight: 600 }}>{f.fileName}</div>
    //           <div style={{ color: "#666", fontSize: 13 }}>
    //             Created: {new Date(f.createdOn).toLocaleString()}
    //           </div>
    //         </div>

        //   <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div onClick={onClick}>
          <div
            key={f.fileName}
            className="bg-white rounded-xl shadow-md p-6 hover:scale-[1.02] transition-transform"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-700">
              {f.fileName}
            </h3>
            <p className="text-gray-600">Created: {new Date(f.createdOn).toLocaleString()}</p>
          </div>
        
      </div>
   )
}