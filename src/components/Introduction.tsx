import styles from "./Introduction.module.css";
import Image from "next/image";

export default function Introduction() {
  return (
    <section className={`section ${styles.intro}`} id="about">
      <div className={`container ${styles.grid}`}>
        <div className={styles.textContent}>
          <h2 className={styles.heading}>
            We preserve the feeling,<br />
            not just the frame.
          </h2>
          <p className={styles.paragraph}>
            Every love story carries its own rhythm—a quiet glance, an overwhelming joy, the unspoken promises. At Vadhuvar Co., our approach to wedding photography is deeply rooted in editorial storytelling. We believe in capturing the grand architectural scale of your day alongside the raw, intimate moments that make it truly yours.
          </p>
          <a href="#contact" className="btn-primary">Discover Our Approach</a>
        </div>
        <div className={styles.imageContent}>
          <div className={styles.imageWrapper}>
            <Image 
              src="/works/portraits/portrait-1.jpg" 
              alt="Vadhuvar Co. Editorial Portrait"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
