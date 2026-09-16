import Link from "next/link";
import Image from "next/image";
import styles from "./SelectedWorks.module.css";
import projects from "../data/projects.json";

export default function SelectedWorks() {
  return (
    <section className={`section ${styles.works}`} id="works">
      <div className="container">
        <div className={styles.header}>
          <h2 className="text-title">Selected Stories</h2>
          <Link href="/works" className="btn-primary">View Full Portfolio</Link>
        </div>
        
        <div className={styles.grid}>
          {projects.map((project, index) => (
            <Link 
              href={`/works/${project.slug}`} 
              key={project.id} 
              className={`${styles.card} ${index % 2 !== 0 ? styles.offset : ""}`}
            >
              <div className={styles.imageWrapper}>
                <Image 
                  src={project.coverImage} 
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.image}
                />
              </div>
              <div className={styles.meta}>
                <span className={styles.category}>{project.category}</span>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <span className={styles.location}>{project.location}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
