import create from "zustand";

const useQuestions = create((set) => ({
  stage: 0,
  question: undefined,
  variants: undefined,
  result: undefined,

  setQuestions: ({ stage, question, variants, result }) =>
    set(() => {
      const output = {};

      if (stage) output.stage = stage;
      if (question) output.question = question;
      if (variants) output.variants = variants;
      if (result) output.result = result;

      return output;
    }),
}));

export default useQuestions;
