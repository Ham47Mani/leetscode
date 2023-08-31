"use client";
import Split from "react-split";
import ProblemDescription from "./problemDescription/ProblemDescription";
import Playground from "./playground/Playground";
import { LocalProblem } from "@/app/constants/types";
import Confetti from "react-confetti";
import useWindowSize from "@/app/hooks/useWindowSize";
import {useState} from 'react';

type WorkspaceProps = {
  problem: LocalProblem
}

const Workspace = ({problem}: WorkspaceProps) => {
  const {width, height} = useWindowSize();// Get Window size from my custome hook
  const [success, setSuccess] = useState<boolean>(false);// Code submit true of false
  const [solved, setSolved] = useState<boolean>(false);// Problem solved or not

  return (
    <Split className="split" minSize={0}>
      <ProblemDescription problem={problem} _solved={solved}/>
      <div className="bg-dark-fill-2">
        <Playground problem={problem} setSuccess={setSuccess} setSolved={setSolved}/>
        {success && <Confetti gravity={0.3} tweenDuration={4000} width={width - 1} height={height - 1}/>}
      </div>
    </Split>
  )
}

export default Workspace;