import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer} id="contact">
      <div className={`container ${styles.grid}`}>
        <div className={styles.cta}>
          <h2 className={styles.heading}>Let&apos;s tell your story.</h2>
          <p className={styles.subtext}>Your story deserves to be remembered in its truest form.</p>
          <a href="mailto:hello@vadhuvar.co" className="btn-primary">Start a Conversation</a>
        </div>
        
        <div className={styles.bottomRow}>
          <div className={styles.brand}>
            <h3>VADHUVAR CO.</h3>
            <p>Premium Wedding Photography based in India.</p>
          </div>
          
          <div className={styles.links}>
            <div className={styles.column}>
              <h4>Explore</h4>
              <Link href="/">Home</Link>
              <Link href="#works">Works</Link>
              <Link href="#about">About</Link>
            </div>
            <div className={styles.column}>
              <h4>Social</h4>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            </div>
          </div>
        </div>
        
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Vadhuvar Co. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
