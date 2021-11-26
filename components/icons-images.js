import Image from "next/image";

export default function IconsImages({ players }) {
  return (
    <div className="icons absolute flex flex-row bottom-0 left-0 m-4">
      <div>
        <div className="absolute z-10 w-full h-full flex flex-col justify-end pb-2">
          <p className="mx-6 text-xl">{players.player}</p>
          <p className="mx-6 -mt-2 text-right text-lg">игрок</p>
        </div>

        <div className="z-0 pointer-events-none">
          <img
            className="absolute w-full p-2"
            src={players.avatars && players.avatars.player}
          />

          <Image
            src="/assets/icon-frame.png"
            alt="Аватар игрока"
            width={400 * 0.5}
            height={480 * 0.5}
            loading="eager"
          />
        </div>
      </div>

      <div>
        <div className="absolute z-10 w-full h-full flex flex-col justify-end pb-2">
          <p className="mx-6 text-xl">{players.lead}</p>
          <p className="mx-6 -mt-2 text-right text-lg">ведущий</p>
        </div>

        <div className="z-0 pointer-events-none">
          <img
            className="absolute w-full p-2"
            src={players.avatars && players.avatars.lead}
          />

          <Image
            src="/assets/icon-frame.png"
            alt="Аватар ведущего"
            width={400 * 0.5}
            height={480 * 0.5}
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}
