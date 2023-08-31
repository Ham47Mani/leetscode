// ============ Start User Type ============
export type UserType = {
  email: string,
  displayName?: string,
  password: string
}
// ============ End User Type ============

// ============ Start ProblemMAP Type ============
export interface ProblemMap {
	[key: string]: LocalProblem;
}
// ============ End ProblemMAP Type ============

// ============ Start Problem Type ============
export type Problem = {
  id: string,
  title: string,
  difficulty: string,
  category: string,
  order: number,
  videoId: string,
}
// ============ End Problem Type ============

// ============ Start LocalProblem Type ============
export type LocalProblem = {
  id: string,
  title: string,
  order: number,
  examples: Example[],
  constraints: string,
  problemStatement: string,
  starterCode: string,
  handlerFunction: ((fn: any) => boolean) | string,
  starterFunctionName: string
}
// ============ End LocalProblem Type ============

// ============ Start Database Problem Type ============
export type DBProblem = {
  id: string,
  title: string,
  difficulty: string,
  category: string,
  order: number,
  likes: number,
  dislikes: number,
  videoId?: string,
  link?: string,
}
// ============ End Database Problem Type ============

// ============ Start Example Type ============
export type Example = {
  id: number,
  inputText: string,
  outputText: string,
  explanation?: string,
  img?: string
}
// ============ End Example Type ============

// ============ Start User Type ============
export interface userDataType {
  uid: string;
  email: string | null;
  displayName: string;
  createAt: number;
  updateAt: number;
  likedProblem: string[];
  dislikedProblem: string[];
  solveProblem: string[];
  starredProblem: string[];
}
// ============ End User Type ============