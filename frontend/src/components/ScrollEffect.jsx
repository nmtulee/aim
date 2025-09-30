import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollEffect = ({
  top = 80,
  direction = 'y',
  offset = 50,
  style = '',
  delay = 0,
  children,
}) => {
  const boxRef = useRef(null);

  useEffect(() => {
    gsap.from(boxRef.current, {
      scrollTrigger: {
        trigger: boxRef.current,
        start: `top ${top}%`,
        toggleActions: 'play none none none',
      },
      opacity: 0,
      [direction]: offset,
      duration: 1,
      delay: delay,
    });
  }, [top, direction, offset,delay]);

  return (
    <div ref={boxRef} className={style}>
      {children}
    </div>
  );
};

export default ScrollEffect;
