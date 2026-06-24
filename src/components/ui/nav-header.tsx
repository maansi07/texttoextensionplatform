"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Generator", to: "/generator" },
  { label: "Templates", to: "/templates" },
  { label: "Dashboard", to: "/dashboard" },
];

function NavHeader() {
  const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });

  return (
    <ul
      className="nav-pill-container"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {NAV_ITEMS.map((item) => (
        <Tab key={item.to} to={item.to} setPosition={setPosition}>
          {item.label}
        </Tab>
      ))}
      <Cursor position={position} />
    </ul>
  );
}

function Tab({
  to,
  children,
  setPosition,
}) {
  const ref = useRef(null);

  const handleEnter = () => {
    if (!ref.current) return;
    const parent = ref.current.parentElement;
    if (!parent) return;
    
    const parentRect = parent.getBoundingClientRect();
    const childRect = ref.current.getBoundingClientRect();
    const width = childRect.width;
    // Calculate exact left position relative to the ul container
    const left = childRect.left - parentRect.left;
    
    setPosition({ width, opacity: 1, left });
  };

  return (
    <li ref={ref} onMouseEnter={handleEnter} className="nav-pill-tab">
      <Link
        to={to}
        className="nav-pill-link"
      >
        {children}
      </Link>
    </li>
  );
}

function Cursor({ position }) {
  return (
    <motion.li
      animate={position}
      className="nav-cursor"
      style={{
        position: "absolute",
        zIndex: 0,
        height: "36px",
        borderRadius: "9999px",
        background: "linear-gradient(135deg, #2dd4bf 0%, #7c3aed 100%)",
        top: "50%",
        marginTop: "-18px",
        opacity: 0.9,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
  );
}

export default NavHeader;
