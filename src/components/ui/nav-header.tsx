"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type CursorPosition = { left: number; width: number; opacity: number };

const LINKS = [
  { href: "#services", label: "Ծառայություններ" },
  { href: "#team", label: "Մասնագետներ" },
  { href: "#reviews", label: "Կարծիքներ" },
  { href: "#faq", label: "Հարցեր" },
];

const TAB_CLASS = "relative z-10 block cursor-pointer text-center text-[8px] font-medium normal-case text-white mix-blend-difference md:text-[10px] md:uppercase";
const LABEL_CLASS = "block w-full cursor-pointer whitespace-nowrap py-1 leading-4 text-inherit no-underline hover:no-underline";

const measure = (tab: HTMLLIElement): CursorPosition => ({
  width: tab.getBoundingClientRect().width,
  opacity: 1,
  left: tab.offsetLeft,
});

// The pill rests on the booking tab and only leaves it while another tab is hovered.
function NavHeader({ onBook }: { onBook: () => void }) {
  const [position, setPosition] = useState<CursorPosition | null>(null);
  const bookTab = useRef<HTMLLIElement>(null);
  const goHome = useCallback(() => {
    if (bookTab.current) setPosition(measure(bookTab.current));
  }, []);

  useEffect(() => {
    goHome();
    window.addEventListener("resize", goHome);
    return () => window.removeEventListener("resize", goHome);
  }, [goHome]);

  return (
    <header className="site-nav" onMouseLeave={goHome}>
      <ul
        className="relative isolate mx-auto grid w-[355px] grid-cols-5 border-2 border-transparent md:w-[min(1155px,calc(100vw-32px))] md:p-1"
      >
        {LINKS.map((link) => (
          <Tab key={link.href} href={link.href} setPosition={setPosition} onBlur={goHome}>
            {link.label}
          </Tab>
        ))}
        <li ref={bookTab} onMouseEnter={goHome} className={TAB_CLASS}>
          <button type="button" onClick={onBook} onFocus={goHome} className={`${LABEL_CLASS} md:uppercase`}>
            Ամրագրել այցը
          </button>
        </li>

        {position && <Cursor position={position} />}
      </ul>
    </header>
  );
}

const Tab = ({
  children,
  href,
  setPosition,
  onBlur,
}: {
  children: React.ReactNode;
  href: string;
  setPosition: (position: CursorPosition) => void;
  onBlur: () => void;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const moveCursor = () => {
    if (ref.current) setPosition(measure(ref.current));
  };

  return (
    <li ref={ref} onMouseEnter={moveCursor} className={TAB_CLASS}>
      <a href={href} onFocus={moveCursor} onBlur={onBlur} className={LABEL_CLASS}>
        {children}
      </a>
    </li>
  );
};

const Cursor = ({ position }: { position: CursorPosition }) => {
  return (
    <motion.li
      initial={false}
      animate={position}
      aria-hidden="true"
      className="absolute top-0 z-0 h-6 rounded-[10px] bg-white md:top-1"
    />
  );
};

export default NavHeader;
