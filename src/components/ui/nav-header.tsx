"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Generator", to: "/generator" },
  { label: "Templates", to: "/templates" },
  { label: "Dashboard", to: "/dashboard" },
];

function NavHeader({ activeTab, setActiveTab }) {
  const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });

  return (
    <ul
      className="nav-pill-container"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {NAV_ITEMS.map((item) => (
        <Tab 
          key={item.label} 
          setPosition={setPosition} 
          item={item} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        >
          {item.label}
        </Tab>
      ))}
      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({
  children,
  setPosition,
  item,
  activeTab,
  setActiveTab
}) => {
  const ref = useRef(null);
  
  const handleClick = (e) => {
    if (item.to) {
      e.preventDefault();
      setActiveTab(item.to === "/" ? "home" : item.to.replace("/", ""));
      window.scrollTo(0,0);
    }
  };

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({ width, opacity: 1, left: ref.current.offsetLeft });
      }}
      className="nav-pill-tab"
    >
      <a 
        href={item.to || item.href} 
        onClick={handleClick}
        className="nav-pill-link"
      >
        {children}
      </a>
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-8 rounded-full md:h-9"
      style={{
        background: "linear-gradient(135deg, #2dd4bf 0%, #7c3aed 100%)",
        opacity: 0.85,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
  );
};

export default NavHeader;
