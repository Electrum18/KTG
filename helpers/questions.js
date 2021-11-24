import create from "zustand";

const useQuestions = create((set) => ({
  stage: 0,
  question: undefined,
  variants: undefined,

  setQuestions: ({ stage, question, variants }) =>
    set(() => {
      const output = {};

      if (stage) output.stage = stage;
      if (question) output.question = question;
      if (variants) output.variants = variants;

      return output;
    }),
}));

export default useQuestions;
