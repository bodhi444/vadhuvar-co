"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            VADHUVAR CO.
          </Link>
          <div className={styles.desktopLinks}>
            <Link href="/">HOME</Link>
            <Link href="#works">WORKS</Link>
            <Link href="#about">ABOUT</Link>
            <Link href="#services">SERVICES</Link>
            <Link href="#contact">CONTACT</Link>
          </div>
          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "CLOSE" : "MENU"}
          </button>
        </div>
      </nav>
      
      {/* Mobile Overlay */}
      <div className={`${styles.mobileOverlay} ${menuOpen ? styles.mobileOpen : ""}`}>
        <div className={styles.mobileLinks}>
          <Link href="/" onClick={() => setMenuOpen(false)}>HOME</Link>
          <Link href="#works" onClick={() => setMenuOpen(false)}>WORKS</Link>
          <Link href="#about" onClick={() => setMenuOpen(false)}>ABOUT</Link>
          <Link href="#services" onClick={() => setMenuOpen(false)}>SERVICES</Link>
          <Link href="#contact" onClick={() => setMenuOpen(false)}>CONTACT</Link>
        </div>
      </div>
    </>
  );
}
