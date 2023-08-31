/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import YouTube from "react-youtube";
import Link from "next/link";
import { BsCheckCircle } from "react-icons/bs"
import { AiFillYoutube } from "react-icons/ai"
import { IoClose } from "react-icons/io5";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { problemLoadingState } from "@/app/atoms/problemsLoadingAtom";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { auth, firestore } from "@/app/firebase/firebase";
import { DBProblem } from "@/app/constants/types";
import { useAuthState } from "react-firebase-hooks/auth";

type ProblemsTableProps = {}

const ProblemsTable = () => {
  //--- Make state for open youtube video modal & set the video id
  const [youtubePlayer, setYoutubePlayer] = useState({
    isOpen: false,
    videoId: ""
  });
  //--- Close youtube modale & set a empty videoId
  const CloseModale = () => {
    setYoutubePlayer({
      isOpen: false,
      videoId: ""
    });
  }

  const { loadingProblems } = useRecoilValue(problemLoadingState);// Get loadingProblem state from Recoil
  const problems = useGetProblems();// Get all problems from our custome hook
  const solvedProblem = useGetSolvedProblem();// Get solved problems from our custome hook
  
  //--- Add an eventListener to close modal when user click Escape button from keyboard
  useEffect(() => {
    //--- Handle the button Click and close Modal
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") CloseModale();
    };
    
    window.addEventListener("keydown", handleEsc);//--- Add EventListener
    return () => window.removeEventListener("keydown", handleEsc);//--- Remove EventListener
  }, [])

  return (
    <>
      {
        !loadingProblems && (
          <>
            <tbody className="text-white">
              {
                problems.map((problem) => {
                  //--- Change difficulty color depending of them
                  const difficultyColor = problem.difficulty === "Easy" ? "text-dark-green-s" : 
                                          problem.difficulty === "Medium" ? "text-yellow-500" : "text-dark-pink";
                  return (
                    <tr className={`even:bg-dark-layer-1`} key={problem.id}>
                      <th className="px-2 py-4 font-medium whitespace-nowrap text-dark-green-s">
                        {solvedProblem.includes(problem.id) && <BsCheckCircle fontSize={18} width="18" />}
                      </th>
                      <td className="px-6 py-4">
                        {
                          problem.link ? (
                            <Link href={problem.link} className="hover:text-blue-600 cursor-pointer" target="_blank">
                              {problem.title}
                            </Link>
                          ) : (
                            <Link href={`/problems/${problem.id}`} className="hover:text-blue-600 cursor-pointer">
                              {problem.title}
                            </Link>
                          )
                        }
                      </td>
                      <td className={`px-6 py-4 ${difficultyColor}`}>{problem.difficulty}</td>
                      <td className="px-6 py-4">{problem.category}</td>
                      <td className="px-6 py-4">
                        {
                          problem.videoId ? 
                          <AiFillYoutube fontSize={28} className="cursor-pointer hover:text-red-600" 
                            onClick={() => setYoutubePlayer({isOpen: true, videoId: problem.videoId as string})}/> 
                          : 
                          <p className="text-gray-400 select-none">Comming soon</p>
                        }
                      </td>
                    </tr>
                  );
                })
              }
            </tbody>
            {
              youtubePlayer.isOpen && 
              <tfoot className="fixed inset-0 flex justify-center items-center">
                <div className="bg-black z-10 opacity-70 absolute inset-0" onClick={CloseModale}></div>
                <div className="relative z-50 px-6 max-w-4xl w-full flex items-center justify-center">
                  <div className="relative w-full">
                    <IoClose fontSize={35} className="cursor-pointer absolute -top-16 right-0 hover:text-white" onClick={CloseModale}/>
                    <YouTube videoId={youtubePlayer.videoId} loading='lazy' iframeClassName='w-full min-h-[500px]' />
                  </div>
                </div>
              </tfoot>
            }
          </>
        )
      }
    </>
    
  )
}

export default ProblemsTable;

// ==================== Start custome hook for get probems =========================
function useGetProblems () {
  const [problems, setProblems] = useState<DBProblem[]>([]);// Create state for the all problems
  const setLoadingProblems = useSetRecoilState(problemLoadingState);

  useEffect(() => {
    const getProblems = async () => {
      setLoadingProblems({loadingProblems: true});// Set loading to false after fetching problems
      //--- Fetching data logic from firestore
      const problemQuery = query(collection(firestore, "problems"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(problemQuery);
      const temp: DBProblem[] = [];
      querySnapshot.forEach(doc => {
        temp.push({id: doc.id, ...doc.data()} as DBProblem)
      });
      setProblems(temp);
      setLoadingProblems({loadingProblems: false});// Set loading to false after fetching problems
    }

    getProblems();
  }, []);

  return problems;
}
// ==================== End custome hook for get probems =========================

// ==================== Start custome hook for get solved probems =========================
function useGetSolvedProblem () {
  const [solvedProblem, setSolvedProblem] = useState<string[]>([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const getSolvedProblem = async () => {
      const userRef = doc(firestore, "users", user!.uid);
      const userDoc = await getDoc(userRef);

      if(userDoc.exists()) {
        setSolvedProblem(userDoc.data().solveProblem);
      }
    };

    if (user) getSolvedProblem();
    if (!user) setSolvedProblem([]);
  }, [user]);

  return solvedProblem;
}
// ==================== End custome hook for get solved probems =========================