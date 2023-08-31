import Topbar from '@/app/components/topbar/Topbar'
import Workspace from '@/app/components/workspace/Workspace'
import { LocalProblem } from '@/app/constants/types';
import useHasMounted from '@/app/hooks/useHasMounted';
import { problems } from '@/app/utils/problems';
import { notFound } from 'next/navigation';

type ProblemPageProps = {
  params: {
    pid: string
  },
}

const ProblemPage = async ({params}: ProblemPageProps) => {
  const {pid} = params;// Get problem ID (pid) from url
  const problem: LocalProblem = await problems[pid];// Get Problem that has id = pid

  if (!problem) {
    notFound();
  }
  problem.handlerFunction = problem.handlerFunction.toString();
  return (
    <>
      <Topbar problemPage={true} />
      <Workspace problem={problem}/>
    </>
  )
}

export default ProblemPage;

//--- Return a list of 'params' to populate the [pid] dynamic segment
export async function generateStaticParams() {
  return Object.keys(problems).map(key => ({
    pid: key
  }));
}