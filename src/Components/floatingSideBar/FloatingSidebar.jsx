import React, { use, useState } from "react";
import "./FloatingSidebar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function FloatingSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  function goToCompare() {
    if (menuOpen) {
      setMenuOpen(false);
    }
    navigate("/compare");
  }

  return (
    <>
      {/* SIDEBAR */}
      <div className="sidebar-container">
        <button
          className="sidebar-item"
          onClick={() => toggleMenu()}
          title="Algoritmos"
        >
          <span class="material-symbols-outlined">
            memory
          </span>
        </button>

        <button
          className="sidebar-item"
          onClick={() => goToCompare()}
          title="Comparar algoritmos"
        >
          <span class="material-symbols-outlined">
            compare_arrows
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)} />
      )}

      <div className={`menu-panel ${menuOpen ? "open" : ""}`}>
        <div className="menu-items">
          <MenuItem text="FIFO" closeMenu={() => setMenuOpen(false)} />
          <MenuItem text="SJF" closeMenu={() => setMenuOpen(false)} />
          <MenuItem text="Prioridad" closeMenu={() => setMenuOpen(false)} />
          <MenuItem text="Round Robin" closeMenu={() => setMenuOpen(false)} />
        </div>
      </div>
    </>
  );
}

function MenuItem({ text, closeMenu }) {
  return (
    <Link
      to={`/algorithm/${text.toLowerCase()}`}
      className="menu-item"
      onClick={closeMenu}
    >
      <span>{text}</span>

      <span className="arrow">
        <span className="material-symbols-outlined">
          chevron_right
        </span>
      </span>
    </Link>
  );
}