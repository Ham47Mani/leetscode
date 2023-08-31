"use client";
import ProblemsTable from "./components/problemsTable/ProblemsTable";
import Topbar from "./components/topbar/Topbar";
import { useRecoilValue } from "recoil";
import { problemLoadingState } from "./atoms/problemsLoadingAtom";
import useHasMounted from "./hooks/useHasMounted";

export default function Home() {
  const { loadingProblems } = useRecoilValue(problemLoadingState);// Get loadingProblem state from Recoil
  const hasMounted: boolean = useHasMounted();// Get hasMounted from custome hooks for check if components has mounted or not

  if (!hasMounted) return null;

  return (
    <>
      <main className="bg-dark-layer-2 min-h-screen">
        {/* --- Topbar --- */}
        <Topbar />
        {/* --- Main Heading --- */}
        <h1 className="text-2xl text-center text-gray-700 dark:text-gray-400 font-medium uppercase mt-10 mb-8">
          &ldquo; Quality over quantity &rdquo; 👇
        </h1>
        {/* --- Problems Table --- */}
        <div className="relative overflow-x-auto pb-10">
          {
            loadingProblems && (
              <div className="container flex justify-center items-center flex-col animate-pulse">
                {
                  [...Array(10)].map((_, i) => (
                    <LoadingSkeleton key={i}/>
                  ))
                }
              </div>
            )
          }
          <table className="container text-sm text-left text-gray-500 dark:text-gray-400">
            {
              !loadingProblems && (
                <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b">
                  <tr>
                    <th scope="col" className="px-1 py-3 font-medium">Status</th>
                    <th scope="col" className="px-6 py-3 font-medium">Title</th>
                    <th scope="col" className="px-6 py-3 font-medium">Difficulty</th>
                    <th scope="col" className="px-6 py-3 font-medium">Category</th>
                    <th scope="col" className="px-6 py-3 font-medium">Solution</th>
                  </tr>
                </thead>
              )
            }
            <ProblemsTable />
          </table>
        </div>
      </main>
    </>
  )
}

const LoadingSkeleton = () => (
  <div className="flex items-center space-x-12 mt-4 px-6">
    <div className="w-6 h-6 shrink-0 rounded-full bg-dark-layer-1"></div>
    <div className="h-4 w-32 sm:w-52 rounded-full bg-dark-layer-1"></div>
    <div className="h-4 w-32 sm:w-52 rounded-full bg-dark-layer-1"></div>
    <div className="h-4 w-32 sm:w-52 rounded-full bg-dark-layer-1"></div>
    <div className="h-4 w-32 sm:w-52 rounded-full bg-dark-layer-1"></div>
    <span className="sr-only">Loading...</span>
  </div>
);