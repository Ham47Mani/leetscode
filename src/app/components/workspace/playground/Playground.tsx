import { useEffect, useState } from "react";
import Split from "react-split";
import PreferenceNav from "./preferenceNav/PreferenceNav";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import EditorFooter from "./EditorFooter";
import { LocalProblem } from "@/app/constants/types";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/app/firebase/firebase";
import { toast } from 'react-toastify';
import { useParams } from "next/navigation";
import { problems } from "@/app/utils/problems";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import useLocalStorage from "@/app/hooks/useLocalStorage";

type PlaygroundProps = {
  problem: LocalProblem,
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  setSolved: React.Dispatch<React.SetStateAction<boolean>>,
}

export interface ISetting {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
}

const Playground = ({problem, setSuccess, setSolved}: PlaygroundProps) => {
  const [activeTestCase, setActiveTestCase] = useState<number>(0);// State for change the active case state in testcase
  const [user] = useAuthState(auth);// Get user logged in
  const query = useParams();// Get params (pid) from link
  let [userCode, setUserCode] = useState<string>(problem.starterCode);// Code user write it
  const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");// Get FontSize from localStorage with my custome hook
  const [settings, setSettings] = useState<ISetting>({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false
  });

  //--- Handle submit code
  const handleSubmitCode = async () => {
    if (!user) {
      toast.error("Please login to submit your code", {position: "top-center", autoClose: 3000, theme: "dark"});
      return;
    }
    
    try {
      userCode = userCode.slice(userCode.indexOf(problem.starterFunctionName));// Get code from function ..... (ignore comment)      
      const callBack = new Function(`return ${userCode}`)();// Transform userCode from string to function and execut it
      const codeHandler = problems[query.pid as string].handlerFunction;

      if (typeof codeHandler == "function") {
        const successCode = codeHandler(callBack);
        if (successCode) {
          toast.success("Congrats! All tests passed!", {position: "top-center", autoClose: 3000, theme: "dark"});
          setSuccess(true);
          setTimeout(() => {setSuccess(false)}, 4000);
  
          const userRef = doc(firestore, "users", user.uid);
          await updateDoc(userRef, {
            solveProblem: arrayUnion(query.pid)
          });
          setSolved(true);
        }
      }
    } catch (error: any) {
      if (error.message.startsWith("AssertionError [ERR_ASSERTION]:")) {
        toast.error("Oops! One or more test cases failed", {position: "top-center", autoClose: 3000, theme: "dark"});
      } else {
        toast.error(error.message, {position: "top-center", autoClose: 3000, theme: "dark"});
      }      
    }
  }

  //--- Save user code when write anything in code editor
  const handleChange = (value: string) => {
    setUserCode(value)
    localStorage.setItem(`code-${query.pid}`, JSON.stringify(value));
  }

  useEffect(() => {
    const code = localStorage.getItem(`code-${query.pid}`);
    if (user) {
      setUserCode(code ? JSON.parse(code) : problem.starterCode);
    } else {
      setUserCode(problem.starterCode);
    }
  }, [query.pid, user, problem.starterCode]);

  return (
    <div className="flex flex-col bg-dark-layer-1 relative overflow-x-hidden">
      <PreferenceNav settings={settings} setSettings={setSettings}/>
      <Split className="h-[calc(100vh-94px)]" direction="vertical" sizes={[60, 40]} minSize={[60, 100]} >
        {/* ------ Code Editor ------ */}
        <div className="w-full overflow-auto">
          <CodeMirror 
            value={userCode}
            onChange={handleChange}
            theme={vscodeDark}
            extensions={[javascript()]}
            style={{fontSize: settings.fontSize}}
          />
        </div>
        {/* ------ Testcase ------ */}
        <div className="w-full px-5 overflow-auto">
          {/* --- Testcase Heading --- */}
          <div className="flex h-10 items-center space-x-6">
            <div className="relative flex flex-col h-full justify-center cursor-pointer">
              <div className="text-sm font-medium leading-5 text-white">Testcases</div>
              <hr className="absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white" />
            </div>
          </div>
          {/* --- Testcase Cases --- */}
          <div className="flex">
            {
              problem.examples.map(example => (
                <div className="me-2 mt-2 items-start" key={example.id} onClick={() => setActiveTestCase(example.id)}>
                  <div className="flex flex-wrap items-center gap-y-4">
                    <div className={`inline-flex items-center font-medium px-4 py-1 whitespace-nowrap cursor-pointer transition-all rounded-lg relative bg-dark-fill-3 hover:bg-dark-fill-2
                      ${activeTestCase === example.id ? "text-white" : "text-gray-500"}
                    `}>
                      Case {example.id + 1}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          {/* --- Testcase Body --- */}
          <div className="font-semibold my-4">
            <p className="text-sm font-medium mt-4 text-white">Input:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] mt-2 border-transparent text-white bg-dark-fill-3">
              {problem.examples[activeTestCase].inputText}
            </div>
            <p className="text-sm font-medium mt-4 text-white">Output:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] mt-2 border-transparent text-white bg-dark-fill-3">
              {problem.examples[activeTestCase].outputText}
            </div>
          </div>
        </div>
      </Split>
      <EditorFooter handleSubmitCode={handleSubmitCode}/>
    </div>
  )
}

export default Playground;