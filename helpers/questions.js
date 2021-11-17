import create from "zustand";

const useQuestions = create((set) => ({
  stage: 0,
  question: undefined,
  variants: undefined,
  result: undefined,

  setQuestions: ({ stage, question, variants, result }) =>
    set({ stage, question, variants, result }),
}));

export default useQuestions;
