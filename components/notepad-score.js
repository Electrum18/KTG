import Image from "next/image";

const prices = [
  1_000_000, 500_000, 250_000, 125_000, 64_000, 32_000, 16_000, 8_000, 4_000,
  2_000, 1_000, 500, 300, 200, 100,
];

export default function NotepadScore() {
  return (
    <div className="notepad absolute w-full h-full">
      <div className="absolute top-0 right-24 m-2">
        <div className="absolute z-10 w-full h-full flex flex-col pt-12">
          {prices.map((price) => (
            <p key={price} className="mx-4 -mt-2 text-xl tracking-widest">
              {price.toString().replace(/(.{3})/g, "$1 ")}
            </p>
          ))}
        </div>

        <div className="z-0 pointer-events-none">
          <Image
            src="/assets/notepad.png"
            alt="Блокнот выигрыша"
            width={400 * 0.8}
            height={480 * 0.8}
          />
        </div>
      </div>
    </div>
  );
}
