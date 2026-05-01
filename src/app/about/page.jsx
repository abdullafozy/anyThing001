import styles from "./about.module.css";
import Link from "next/link";

const team = [
  { img: "/images/face.png",     name: "Sophia Laurent", role: "Founder & Creative Director" },
  { img: "/images/skincare.png", name: "Layla Hassan",   role: "Head of Skincare" },
  { img: "/images/lips.png",     name: "Mia Rossi",      role: "Lead Makeup Artist" },
];

const values = [
  { icon: "✦", title: "Cruelty Free",    desc: "Every product is 100% cruelty-free and ethically sourced." },
  { icon: "◈", title: "Clean Beauty",    desc: "No parabens or harmful fillers — only formulas your skin will love." },
  { icon: "❋", title: "Inclusivity",     desc: "Shades for every skin type, every tone, every identity." },
  { icon: "◉", title: "Expert Curation", desc: "Our artists hand-pick every launch before it reaches you." },
];

export default function AboutPage() {
  return (
    <main className={styles.page}>

      {/* ── PAGE HEADER ── */}
      <section className={styles.pageHeader}>
        <p className={styles.eyebrow}>WHO WE ARE</p>
        <h1 className={styles.pageTitle}>ABOUT US</h1>
        <div className={styles.titleLine} />
      </section>

      {/* ── OUR STORY ── */}
      <section className={styles.storySection}>
        <div className={styles.storyGrid}>
          <div className={styles.storyImgWrap}>
            <img src="/images/hero-model.png" alt="Our Story" className={styles.storyImg} />
            <div className={styles.storyBadge}>
              <span className={styles.badgeYear}>2018</span>
              <span className={styles.badgeLabel}>FOUNDED</span>
            </div>
          </div>

          <div className={styles.storyText}>
            <div className={styles.sectionHeading}>
              <h2>OUR STORY</h2>
              <div className={styles.headingLine} />
            </div>
            <p className={styles.storyLead}>
              Born from a passion for self-expression, Glamour Palette was founded
              in 2018 to bring luxury beauty to every skin tone and every budget.
            </p>
            <p className={styles.storyBody}>
              We believe makeup is more than colour — it is confidence, art, and identity.
              From our very first lipstick to our 100th product launch, we have stayed
              committed to one promise: beauty that is bold, clean, and unapologetically you.
            </p>
            <p className={styles.storyBody}>
              Headquartered in Cairo and shipping across the MENA region, we partner only
              with cruelty-free labs and indie artists who share our vision of a more
              inclusive beauty industry.
            </p>
            <Link href="/products" className={styles.ctaBtn}>SHOP NOW</Link>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className={styles.valuesSection}>
        <div className={styles.sectionHeading} style={{ textAlign: "center" }}>
          <h2>OUR VALUES</h2>
          <div className={styles.headingLine} style={{ margin: "14px auto 0" }} />
        </div>
        <div className={styles.valuesGrid}>
          {values.map((v) => (
            <div key={v.title} className={styles.valueCard}>
              <span className={styles.valueIcon}>{v.icon}</span>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={styles.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

   

      {/* ── TEAM ── */}
      <section className={styles.teamSection}>
        <div className={styles.sectionHeading} style={{ textAlign: "center" }}>
          <h2>MEET THE TEAM</h2>
          <div className={styles.headingLine} style={{ margin: "14px auto 0" }} />
        </div>
        <div className={styles.teamGrid}>
          {team.map((m) => (
            <div key={m.name} className={styles.teamCard}>
              <div className={styles.teamImgWrap}>
                <img src={m.img} alt={m.name} className={styles.teamImg} />
                <div className={styles.teamOverlay} />
              </div>
              <h4 className={styles.teamName}>{m.name}</h4>
              <p className={styles.teamRole}>{m.role}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}