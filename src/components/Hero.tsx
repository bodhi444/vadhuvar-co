import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.backgroundWrapper}>
        <Image 
          src="/works/hero/hero-1.jpg" 
          alt="Vadhuvar Co. Cinematic Wedding Story" 
          fill
          priority
          className={styles.backgroundImage}
          sizes="100vw"
        />
        <div className={styles.overlay}></div>
      </div>
      
      <div className={styles.content}>
        <h1 className={`${styles.title} animate-fade-in`}>Vadhuvar Co.</h1>
        <p className={`${styles.subtitle} animate-fade-in`}>Stories of love, beautifully remembered.</p>
      </div>

      <div className={styles.scrollIndicator}>
        <span>SCROLL</span>
        <div className={styles.line}></div>
      </div>
    </section>
  );
}
