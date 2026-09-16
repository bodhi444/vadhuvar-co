import styles from "./Services.module.css";

const services = [
  { id: "01", title: "Wedding Photography", description: "Comprehensive coverage of your wedding day, focusing on raw emotion and cinematic composition." },
  { id: "02", title: "Pre-Wedding Stories", description: "Editorial portrait sessions capturing the connection before the chaos of the big day." },
  { id: "03", title: "Wedding Films", description: "Cinematic highlight reels and full documentary films that preserve the movement and sound of your memories." },
];

export default function Services() {
  return (
    <section className={`section ${styles.services}`} id="services">
      <div className={`container ${styles.grid}`}>
        <div className={styles.header}>
          <h2 className="text-title">Our Services</h2>
          <p className="text-body" style={{ marginTop: "1.5rem" }}>
            We take on a limited number of commissions each year to ensure every story receives our undivided creative attention.
          </p>
        </div>
        
        <div className={styles.list}>
          {services.map((service) => (
            <div key={service.id} className={styles.serviceItem}>
              <div className={styles.serviceId}>{service.id}</div>
              <div className={styles.serviceContent}>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDesc}>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
