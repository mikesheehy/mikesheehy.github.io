import ThemeToggle from "./theme-toggle";

type BlogPost = {
  id: string;
  title: string;
  brief: string;
  url: string;
  publishedAt: string;
};

type CredlyBadge = {
  id: string;
  name: string;
  imageUrl: string;
  issuer: string;
  description: string;
  issuedAt: string;
  url: string;
};

const WORDPRESS_API =
  "https://public-api.wordpress.com/rest/v1.1/sites/mikesheehyblog.wordpress.com/posts?number=5&fields=ID,title,excerpt,URL,date";

const CREDLY_API = "https://www.credly.com/users/mikesheehy/badges.json";

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

// WordPress returns titles/excerpts with HTML entities (e.g. &#8217;), which
// React would otherwise render literally since it escapes text content.
function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith("#")) {
      const code = entity[1].toLowerCase() === "x"
        ? Number.parseInt(entity.slice(2), 16)
        : Number.parseInt(entity.slice(1), 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
  });
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, "")).trim();
}

// Fetched at build time and baked into the static HTML. The GitHub Pages
// workflow rebuilds on every push and on a weekly schedule, refreshing this data.
async function getCredlyBadges(): Promise<CredlyBadge[]> {
  try {
    const response = await fetch(CREDLY_API);

    if (!response.ok) {
      console.error(`[getCredlyBadges] Credly API returned ${response.status}`);
      return [];
    }

    const data = await response.json() as {
      data: {
        id: string;
        url: string;
        issued_at_date: string;
        badge_template: {
          name: string;
          image_url: string;
          description: string;
          issuer: { entities: { entity: { name: string } }[] };
        };
      }[];
    };

    return (data.data ?? []).map((badge) => ({
      id: badge.id,
      name: badge.badge_template.name,
      imageUrl: badge.badge_template.image_url,
      issuer: badge.badge_template.issuer?.entities?.[0]?.entity?.name ?? "",
      description: badge.badge_template.description,
      issuedAt: badge.issued_at_date,
      url: badge.url,
    }));
  } catch (err) {
    console.error("[getCredlyBadges] Failed to fetch Credly badges:", err);
    return [];
  }
}

async function getLatestPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(WORDPRESS_API);

    if (!response.ok) {
      console.error(`[getLatestPosts] WordPress API returned ${response.status}`);
      return [];
    }

    const data = await response.json() as {
      posts: { ID: number; title: string; excerpt: string; URL: string; date: string }[];
    };

    return (data.posts ?? []).map((post) => ({
      id: String(post.ID),
      title: stripHtml(post.title),
      brief: stripHtml(post.excerpt).replace(/ ?\[…\]$/, "…"),
      url: post.URL,
      publishedAt: new Date(post.date).toISOString(),
    }));
  } catch (err) {
    console.error("[getLatestPosts] Failed to fetch WordPress posts:", err);
    return [];
  }
}

const WORK_HISTORY = [
  {
    role: "Software Engineer Specialist",
    company: "Nationwide Financial",
    time: "2019 — Present",
    detail: [
      "Develop cost-effective information technology solutions by creating new and modifying existing software applications",
      "Analyze and validates complex system requirements and existing business processes. Design, develop and implement new programs and modifications of existing applications.",
      "Assist in leading all aspects of applications programming and development including file design, update, storage and retrieval.",
    ],
  },
  {
    role: "Marketing IT Associate Developer",
    company: "GE Appliances, a Haier Company",
    time: "2016 — 2019",
    detail: [
      "Provide analysis to develop solutions toward Minimum Viable Product (MVP) and continue to enable productivity (efficiency) across the business",
      "Build on working knowledge of Java, Maven, Spring, Jenkins, SAP Master Data Management, CodePipeline, Progressive Web Applications, AmpScript and more",
      "Collaborate across multiple teams using GitHub",
      "Work effectively with vendor/partners, resources and various IT teams such as Infrastructure, DBAs and Shared Services",
    ],
  },
  {
    role: ".Net Apprentice",
    company: "The Software Guild",
    time: "2016",
    detail: [
      "Implement full stack practices to applications in both individual and group environments",
      "Acquire knowledge in C#, SQL Server, ASP.NET, MVC, ADO.NET, HTML, Bootstrap, and JavaScript",
      "Program applications into UI, database, and logic programming layers to optimize Agile performance",
    ],
  },
];

export default async function Home() {
  const [posts, badges] = await Promise.all([getLatestPosts(), getCredlyBadges()]);

  return (
    <div id="top">
      <header className="site-header">
        <div className="wrap">
          <a href="#top" className="brand">
            <span className="brand-name">Mike Sheehy</span>
            <span className="brand-role">Software Engineer</span>
          </a>
          <nav className="site-nav">
            <a href="#about">About</a>
            <a href="#work">Work</a>
            <a href="#certifications">Certifications</a>
            <a href="#blog">Blog</a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main>
        <div className="wrap">
          <section className="hero">
            <div aria-hidden="true" className="hero-glow" />
            <div className="hero-content">
              <h1>Building software that turns complex ideas into clear, useful experiences.</h1>
              <p>
                I design and ship thoughtful products through AI-Driven Development Lifecycles to
                accelerate problem-solving and product delivery. This is where I share the work,
                the thinking behind it, and the lessons that come from building.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#blog">Latest Writing</a>
                <a className="btn btn-secondary" href="https://www.linkedin.com/in/mikesheehy/" target="_blank" rel="noopener noreferrer">
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </section>

          <section id="about">
            <h2>About Me</h2>
            <div className="prose">
              <p>I&apos;m Mike, a dedicated software engineer specializing in Java applications while also exploring AI and cloud technologies. I first became interested in tech when I implemented SEO strategies for my first job after college. A career change offered an opportunity to explore this field, complete a full stack developer bootcamp, and build some projects.</p>
              <p>As part of my professional growth, I have obtained the AWS Certified Cloud Practitioner certification and Cybersecurity Certificate from Columbus State. I&apos;m currently learning towards the AWS Certified AI Practicioner and Developer Associate certifications.</p>
              <p>When I&apos;m not working or pursuing new technical skills, I spend my time running, listening to new music, cooking, cheering on my favorite sports teams, and traveling. In fact, some of this site was built while riding a high-speed train from Barcelona to Madrid!</p>
            </div>
          </section>

          <section id="work">
            <h2>Work Experience</h2>
            <div className="work-list">
              {WORK_HISTORY.map((item) => (
                <article className="work-item" key={item.role}>
                  <time>{item.time}</time>
                  <div className="work-body">
                    <h3>{item.role}</h3>
                    <div className="work-org">{item.company}</div>
                    <ul>
                      {item.detail.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="certifications">
            <div className="section-head">
              <h2>Certifications</h2>
              <a className="btn btn-ghost" href="https://www.credly.com/users/mikesheehy" target="_blank" rel="noopener noreferrer">
                View all →
              </a>
            </div>
            <div className="cert-grid">
              {badges.length > 0 ? (
                badges.map((badge) => (
                  <a key={badge.id} className="cert-card" href={badge.url} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={badge.imageUrl} alt={badge.name} width={112} height={112} />
                    <div className="cert-name">{badge.name}</div>
                    <div className="cert-issuer">{badge.issuer}</div>
                    <div className="cert-date">
                      {new Date(badge.issuedAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </a>
                ))
              ) : (
                <div className="cert-empty">
                  <p>Unable to load certifications</p>
                  <a className="btn btn-secondary" href="https://www.credly.com/users/mikesheehy" target="_blank" rel="noopener noreferrer">
                    View on Credly
                  </a>
                </div>
              )}
            </div>
          </section>

          <section id="blog">
            <h2>Blog</h2>
            <div className="blog-list">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <a key={post.id} className="blog-item" href={post.url} target="_blank" rel="noopener noreferrer">
                    <time>
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    <div className="blog-body">
                      <h3>{post.title}</h3>
                      <p>{post.brief}</p>
                      <span className="read-more">Read article →</span>
                    </div>
                  </a>
                ))
              ) : (
                <div className="blog-empty">
                  <p>Unable to load articles</p>
                  <div className="blog-empty-body">
                    The latest posts could not be fetched right now. Check back soon or visit the
                    blog directly.
                  </div>
                  <a className="btn btn-secondary" href="https://mikesheehyblog.wordpress.com" target="_blank" rel="noopener noreferrer">
                    Visit Blog
                  </a>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-note">© {new Date().getFullYear()} mikesheehy.net</div>
          <nav className="footer-nav">
            <a href="https://linkedin.com/in/mbsheehy" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/mikesheehy" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://mikesheehyblog.wordpress.com" target="_blank" rel="noopener noreferrer">Blog</a>
            <a href="https://credly.com/users/mikesheehy" target="_blank" rel="noopener noreferrer">Credly</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
