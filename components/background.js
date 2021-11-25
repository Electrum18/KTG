import Image from "next/image";
import { useEffect } from "react";

import useSound from "use-sound";

export default function Background() {
  const [playTime, { stop: stopTime }] = useSound("/sound/time-tick.mp3", {
    volume: 0.5,
    onend: () => {
      setTimeout(playTime, 0);
    },
  });

  const [playLamp, { stop: stopLamp }] = useSound("/sound/light-ambient.mp3", {
    volume: 0.1,
    onend: () => {
      setTimeout(playLamp, 0);
    },
  });

  useEffect(() => {
    if (playTime) playTime();

    return () => {
      if (stopTime) stopTime();
    };
  }, [playTime]);

  useEffect(() => {
    if (playLamp) playLamp();

    return () => {
      if (stopLamp) stopLamp();
    };
  }, [playLamp]);

  return (
    <div id="loading-paper" className="absolute bottom-0 mx-auto">
      <div className="absolute z-10 w-full h-full flex flex-col justify-center">
        <p className="mx-8 text-center text-4xl">
          Загрузка, <br /> пожалуйста подождите
        </p>
      </div>

      <div className="z-0 pointer-events-none">
        <Image
          src="/assets/paper.png"
          alt="Бумага загрузки"
          width={220 * 1.5}
          height={270 * 1.5}
          loading="eager"
        />
      </div>
    </div>
  );
}
