import create from "zustand";

const useQuestions = create((set) => ({
  stage: 0,
  level: 0,
  question: undefined,
  variants: undefined,
  helpers: {},

  setQuestions: ({ level, stage, question, variants, helpers }) =>
    set(() => {
      const output = {};

      if (level !== undefined) output.level = level;
      if (stage !== undefined) output.stage = stage;

      if (question) output.question = question;
      if (variants) output.variants = variants;
      if (helpers) output.helpers = helpers;

      return output;
    }),
}));

export default useQuestions;
