import create from "zustand";

const useQuestions = create((set) => ({
  stage: 0,
  level: 0,
  question: undefined,
  variants: undefined,

  setQuestions: ({ level, stage, question, variants }) =>
    set(() => {
      const output = {};

      if (level !== undefined) output.level = level;
      if (stage !== undefined) output.stage = stage;

      if (question) output.question = question;
      if (variants) output.variants = variants;

      return output;
    }),
}));

export default useQuestions;
