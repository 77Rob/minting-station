import { useCallback, useEffect, useState } from "react";
const frames = [
  "/home/animation/1.png",
  "/home/animation/2.png",
  "/home/animation/3.png",
  "/home/animation/4.png",
  "/home/animation/5.png",
  "/home/animation/6.png",
  "/home/animation/7.png",
];

const AnimatedLogo = () => {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const frameChangeInterval = setInterval(() => {
      setFrame((frame) => (frame + 1) % frames.length);
    }, 1500);

    return () => clearInterval(frameChangeInterval);
  }, []);
  console.log(frame);
  return (
    <div className="flex justify-center items-center">
      {<img src={frames[frame]} className="w-[320px] object-contain" />}
      <img src="/home/LogoText.png" className="object-contain w-[500px]" />
    </div>
  );
};

export default AnimatedLogo;
