import Image from "next/image";

import useQuestions from "../helpers/questions";

const prices = [
  1_000_000, 500_000, 250_000, 125_000, 64_000, 32_000, 16_000, 8_000, 4_000,
  2_000, 1_000, 500, 300, 200, 100,
];

function addSpaces(value) {
  if (value.length > 6) {
    return value.replace(/(\d+)(\d{3})(\d{3})/g, "$1 $2 $3");
  } else {
    return value.replace(/(\d+)(\d{3})/g, "$1 $2");
  }
}

export default function NotepadScore() {
  const level = useQuestions((state) => state.level);

  function idFromBelow(id) {
    return prices.length - 1 - id;
  }

  return (
    <div className="notepad absolute w-full h-full">
      <div className="absolute top-0 right-24 m-2">
        <div className="absolute z-10 w-full h-full flex flex-col pt-12">
          {prices.map((price, id) => (
            <p
              key={price}
              className={
                "mx-4 -mt-2 text-xl tracking-widest " +
                (level === idFromBelow(id) ? "text-red-500 " : "") +
                (level > idFromBelow(id) ? "line-through " : "") +
                (level <= idFromBelow(id) &&
                level !== idFromBelow(id) &&
                (idFromBelow(id) === 4 || idFromBelow(id) === 9)
                  ? "text-blue-500"
                  : "")
              }
            >
              {addSpaces(price.toString())}
              {idFromBelow(id) === 4 || idFromBelow(id) === 9
                ? " возврат подсказок"
                : ""}
            </p>
          ))}
        </div>

        <div className="z-0 pointer-events-none">
          <Image
            src="/assets/notepad.png"
            alt="Блокнот выигрыша"
            width={400 * 0.8}
            height={480 * 0.8}
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
