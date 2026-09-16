import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import projects from "@/data/projects.json";
import styles from "./Project.module.css";

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = projects.find((p) => p.slug === resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navigation />
      
      <main className={styles.main}>
        {/* Project Hero */}
        <header className={styles.hero}>
          <div className={styles.heroImageWrapper}>
            <Image 
              src={project.coverImage} 
              alt={project.title}
              fill
              priority
              className={styles.heroImage}
              sizes="100vw"
            />
            <div className={styles.overlay}></div>
          </div>
          <div className={styles.heroContent}>
            <span className={styles.category}>{project.category}</span>
            <h1 className={styles.title}>{project.title}</h1>
            <div className={styles.meta}>
              <span>{project.location}</span>
              <span className={styles.separator}></span>
              <span>{project.year}</span>
            </div>
          </div>
        </header>

        {/* Project Description */}
        <section className={`container ${styles.descriptionSection}`}>
          <div className={styles.descriptionWrapper}>
            <p className={styles.description}>{project.description}</p>
          </div>
        </section>

        {/* Visual Storytelling Sequence */}
        <section className={`container ${styles.gallery}`}>
          {project.images.map((imgSrc, index) => {
            // Intelligent Image Layout Matching Concept
            // First image full width, next two side-by-side, etc.
            let gridClass = styles.fullWidth;
            if (index > 0 && index % 3 !== 0) {
              gridClass = styles.halfWidth;
            }

            return (
              <div key={index} className={`${styles.imageBlock} ${gridClass}`}>
                <div className={styles.imageInner}>
                  <Image 
                    src={imgSrc}
                    alt={`${project.title} - ${index + 1}`}
                    fill
                    sizes={gridClass === styles.fullWidth ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                    className={styles.galleryImage}
                  />
                </div>
              </div>
            );
          })}
        </section>
        
        {/* Next Project / Back CTA */}
        <section className={styles.footerCTA}>
          <Link href="/#works" className="btn-primary">Return to Works</Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
