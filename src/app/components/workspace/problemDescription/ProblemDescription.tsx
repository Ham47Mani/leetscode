"use client";
import { useState, useEffect } from 'react';
import Image from "next/image";
import { DBProblem, LocalProblem } from "@/app/constants/types";
import { AiFillDislike, AiFillLike, AiFillStar, AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsCheckCircle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { Transaction, arrayRemove, arrayUnion, doc, getDoc, runTransaction, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '@/app/firebase/firebase';
import RectangleSkeleton from '../../skeleton/RectangleSkeleton';
import CircleSkeleton from '../../skeleton/CircleSkeleton';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';

type ProblemDescriptionProps = {
  problem: LocalProblem,
  _solved: boolean
}

const ProblemDescription = ({problem, _solved}: ProblemDescriptionProps) => {
  const [user] = useAuthState(auth);
  const {currentProblem, loading, problemDifficultyClass, setCurrentProblem} = useGetCurrentProblem(problem.id);
  const {liked, disliked, solved, starred, setData} = useGetUserDataOnProblem(problem.id);
  const [updating, setUpdating] = useState<boolean>(false);

  //--- Return user & problem data
  const getUserAndProblemData = async (transaction: Transaction) => {
    const userRef = doc(firestore, "users", user!.uid);// Make ref to user logged in
    const problemRef = doc(firestore, "problems", problem.id);// Make ref to problem open
      
    const userDoc = await transaction.get(userRef);// Get current logged user
    const problemDoc = await transaction.get(problemRef);// Get problem opened

    return {userRef, userDoc, problemRef, problemDoc};
  }

  //--- Handle Like problem
  const handleLike = async () => {
    if (!user) {// Check if no user login in
      toast.error("You must be logged in to like a problem", {position: "top-left", theme: "dark"});
      return;
    }
    if (updating) return;
    setUpdating(true);
    await runTransaction(firestore, async(transaction) => {
      const {userRef, userDoc, problemRef, problemDoc} = await getUserAndProblemData(transaction);

      if (userDoc.exists() && problemDoc.exists()) {
        if (liked) {
          //--- Remove problem-id from likedProblem on user document, decrement likes on problem document
          transaction.update(userRef, {
            likedProblem: userDoc.data().likedProblem.filter((id: string) => id !== problem.id )
          });
          transaction.update(problemRef, {
            likes: problemDoc.data().likes - 1
          });
          setCurrentProblem(prevProblem => ({...prevProblem, likes: prevProblem!.likes - 1}) as DBProblem);
          setData(prevData => ({...prevData, liked: false}));

        } else if (disliked) {

          transaction.update(userRef, {
            likedProblem: [...userDoc.data().likedProblem, problem.id],
            dislikedProblem: userDoc.data().dislikedProblem.filter((id: string) => id !== problem.id )
          });
          transaction.update(problemRef, {
            likes: problemDoc.data().likes + 1,
            disliked: problemDoc.data().disliked - 1,
          });
          setCurrentProblem(prevProblem => ({...prevProblem, likes: prevProblem!.likes + 1, dislikes: prevProblem!.dislikes - 1}) as DBProblem);
          setData(prevData => ({...prevData, liked: true, disliked: false}));

        } else {
          transaction.update(userRef, {
            likedProblem: [...userDoc.data().likedProblem, problem.id],
          });
          transaction.update(problemRef, {
            likes: problemDoc.data().likes + 1,
          });
          setCurrentProblem(prevProblem => ({...prevProblem, likes: prevProblem!.likes + 1}) as DBProblem);
          setData(prevData => ({...prevData, liked: true, disliked: false}));

        }
      }
    });
    setUpdating(false);
  };

  //--- Handle Dislike problem
  const handleDislike = async () => {
    if (!user) {// Check if no user login in
      toast.error("You must be logged in to dislike a problem", {position: "top-left", theme: "dark"});
      return;
    }
    if (updating) return;
    setUpdating(true);
    await runTransaction(firestore, async (transaction) => {
      const {userRef, userDoc, problemRef, problemDoc} = await getUserAndProblemData(transaction);

      if (userDoc.exists() && problemDoc.exists()) {
        if (disliked) {
          //--- Remove problem-id from DislikeProblem on user document, decrement dislies on problem document
          transaction.update(userRef, {
            dislikedProblem: userDoc.data().dislikedProblem.filter((id: string) => id !== problem.id)
          });
          transaction.update(problemRef, {
            dislikes: problemDoc.data().dislikes - 1
          });
          setCurrentProblem(prevProblem => ({...prevProblem, dislikes: prevProblem!.dislikes - 1}) as DBProblem );
          setData(prevData => ({...prevData, disliked: false}));

        } else if (liked) {
          transaction.update(userRef, {
            dislikedProblem: [...userDoc.data().dislikedProblem, problem.id],
            likedProblem: userDoc.data().dislikedProblem.filter((id: string) => id !== problem.id),
          });
          transaction.update(problemRef, {
            dislikes: problemDoc.data().dislikes + 1,
            likes: problemDoc.data().dislikes - 1
          });
          setCurrentProblem(prevProblem => ({...prevProblem, dislikes: prevProblem!.dislikes + 1, likes: prevProblem!.likes - 1}) as DBProblem );
          setData(prevData => ({...prevData, disliked: true, liked: false }));

        } else {
          transaction.update(userRef, {
            dislikedProblem: [...userDoc.data().dislikedProblem, problem.id],
          });
          transaction.update(problemRef, {
            dislikes: problemDoc.data().dislikes + 1,
          });
          setCurrentProblem(prevProblem => ({...prevProblem, dislikes: prevProblem!.dislikes + 1}) as DBProblem );
          setData(prevData => ({...prevData, disliked: true}));

        }
      }
    });
    setUpdating(false);
  }

  //--- Handle Start problem
  const handleStart = async () => {
    if (!user) {
      toast.error("You must logged in to star a problem", {position: "top-left", theme: "dark"});
      return;
    }
    if (updating) return;
    setUpdating(true);
    if(!starred) {
      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        starredProblem: arrayUnion(problem.id)
      });
      setData(prevData => ({...prevData, starred: true}));

    } else {
      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        starredProblem: arrayRemove(problem.id)
      });
      setData(prevData => ({...prevData, starred: false}));
    }
    setUpdating(false);
  }

  return (
    <div className="bg-dark-layer-1">
      {/* ------ Tabs ------ */}
      <div className="flex items-center h-11 w-full pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
        <div className="bg-dark-layer-1 rounded-t-[5px] px-5 py-3 text-xs cursor-pointer">
          Description
        </div>
      </div>

      {/* ------ Content ------ */}
      <div className="flex px-0 py-5 h-[calc(100vh-94px)] overflow-y-auto">
        <div className="px-5">
          {/* --- Problem Heading --- */}
          <div className="flex space-x-4">
            <div className="flex-1 me-2 text-lg text-white font-medium">{problem.title}</div>
          </div>
          {
            !loading && currentProblem && (
              <div className="flex items-center mt-3">
                <div className={`inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize ${problemDifficultyClass}`}>
                  {currentProblem.difficulty}
                </div>
                {(solved || _solved) && (
                  <div className="rounded p-1 ms-4 text-lg text-dark-green-s">
                    <BsCheckCircle />
                  </div>
                )}
                <div className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-1 ms-4 text-lg transition-colors duration-200 text-dark-gray-6"
                  onClick={handleLike}
                >
                  { liked && !updating && <AiFillLike className="text-dark-blue-s" />}
                  { !liked && !updating && <AiFillLike />}
                  { updating && <AiOutlineLoading3Quarters className="animate-spin" /> }
                  <span className="text-xs">{currentProblem.likes}</span>
                </div>
                <div className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-1 ms-4 text-lg transition-colors duration-200 text-dark-gray-6"
                  onClick={handleDislike}
                >
                  { disliked && !updating && <AiFillDislike className="text-dark-blue-s" />}
                  { !disliked && !updating && <AiFillDislike />}
                  { updating && <AiOutlineLoading3Quarters className="animate-spin" /> }
                  <span className="text-xs">{currentProblem.dislikes}</span>
                </div>
                <div className="cursor-pointer hover:bg-dark-fill-3 rounded p-1 ms-4 text-xl transition-colors duration-200 text-dark-gray-6"
                  onClick={handleStart}
                >
                  { updating && <AiOutlineLoading3Quarters className="animate-spin" /> }
                  { starred && !updating && <AiFillStar className="text-dark-yellow"/> }
                  { !starred && !updating && <TiStarOutline /> }
                </div>
              </div>
            )
          }
          {
            loading && (
              <div className='mt-3 flex space-x-2'>
                <RectangleSkeleton />
                <CircleSkeleton />
                <RectangleSkeleton />
                <RectangleSkeleton />
                <CircleSkeleton />
              </div>
            )
          }
          {/* --- Problem Statement (paragraphs) --- */}
          <div className="text-white text-sm" dangerouslySetInnerHTML={{__html: problem.problemStatement}}/>
          {/* --- Examples --- */}
          <div className="mt-4">
            {
              problem.examples.map((example) => (
                <div key={example.id}>
                  <p className="font-medium text-white">Example {example.id + 1}:</p>
                  {
                    example.img && (
                      <div className="w-full my-2">
                        <Image src={example.img} alt="image example" width={600} height={600} className="w-full"/>
                      </div>
                    )
                  }
                  <div className="example-card">
                    <pre>
                      <strong className="text-white">Input: </strong> {example.inputText}
                      <br />
                      <strong>Output:</strong> {example.outputText}
                      <br />
                      {
                        example.explanation && (
                          <>
                            <strong>Explanation: </strong> {example.explanation}
                          </>
                        )
                      }
                    </pre>
                  </div>
                </div>
              ))
            }
          </div>
          {/* --- Constraints --- */}
          <div className="my-5 pb-5">
            <div className="text-white text-sm font-medium">Constraints:</div>
            <ul className="text-white ms-5 list-disc" dangerouslySetInnerHTML={{__html: problem.constraints}}>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProblemDescription

// ====================== Start useGetCurrentProblem ======================
function useGetCurrentProblem(problemID: string) {
  const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [problemDifficultyClass, setProblemDifficultyClass] = useState<string>("");

  useEffect(() => {
    //--- Get problem from firestore DB
    const getCurrentProblem = async () => {
      setLoading(true);
      const problemSnap = await getDoc(doc(firestore, "problems", problemID));
      if (problemSnap.exists()) {
        const problem = problemSnap.data();
        setCurrentProblem({id: problemSnap.id, ...problem} as DBProblem);
        setProblemDifficultyClass(
          problem.difficulty === "Easy" ? "bg-olive text-olive" : 
          problem.difficulty === "Medium" ? "bg-dark-yellow text-dark-yellow" : 
          "bg-dark-pink text-dark-pink"
        )
      }
      setLoading(false);
    }
    getCurrentProblem();
  }, [problemID]);

  return {currentProblem, loading, problemDifficultyClass, setCurrentProblem};
}
// ====================== End useGetCurrentProblem ======================

// ====================== Start useGetUserDataOnProblem ======================
function useGetUserDataOnProblem (problemID: string) {
  const [data, setData] = useState({liked: false, disliked: false, solved: false, starred: false});// Initial state with default value
  const [user] = useAuthState(auth);// Get user auth details

  useEffect(() => {
    const getuserDataOnProblem = async () => {
      const userRef = doc(firestore, "users", user!.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const {likedProblem, dislikedProblem, solveProblem, starredProblem} = userSnap.data();
        setData({
          liked: likedProblem.includes(problemID),
          disliked: dislikedProblem.includes(problemID),
          solved: solveProblem.includes(problemID),
          starred: starredProblem.includes(problemID),
        })
      }
    }

    if (user) getuserDataOnProblem();// Call getuserDataOnProblem function
    return () => setData({liked: false, disliked: false, solved: false, starred: false});
  }, [problemID, user]);

  return {...data, setData};
}
// ====================== End useGetUserDataOnProblem ======================