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
  "https://public-api.wordpress.com/rest/v1.1/sites/mikesheehyblog.wordpress.com/posts?number=3&fields=ID,title,excerpt,URL,date";

const CREDLY_API = "https://www.credly.com/users/mikesheehy/badges.json";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
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
      brief: stripHtml(post.excerpt).replace(/\s*\[&hellip;\]$/, "…"),
      url: post.URL,
      publishedAt: new Date(post.date).toISOString(),
    }));
  } catch (err) {
    console.error("[getLatestPosts] Failed to fetch WordPress posts:", err);
    return [];
  }
}

export default async function Home() {
  const [posts, badges] = await Promise.all([getLatestPosts(), getCredlyBadges()]);

  return (
    <div className="min-h-screen bg-white text-black">

      <header className="relative z-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-black/60">
              Mike Sheehy
            </p>
            <p className="text-lg font-semibold">Forward Deployed Engineer</p>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
          <div className="grid gap-12 md:grid-cols-[220px_minmax(0,700px)]">
            <aside className="space-y-6 md:sticky md:top-10 md:self-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/50">
                  Links
                </p>
                <nav className="mt-4 flex flex-col gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-black/70">
                  <a className="transition hover:text-black" href="#about">
                    About
                  </a>
                  <a className="transition hover:text-black" href="#expertise">
                    Expertise
                  </a>
                  <a className="transition hover:text-black" href="#work">
                    Work
                  </a>
                  <a className="transition hover:text-black" href="#certifications">
                    Certifications
                  </a>
                  <a className="transition hover:text-black" href="#blog">
                    Blog
                  </a>
                </nav>
              </div>
            </aside>

            <div className="space-y-16">
              <section className="space-y-10">
                <div className="space-y-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-black/50">
                    Forward Deployed Engineer
                  </p>
                  <h1 className="font-[var(--font-display)] text-4xl leading-tight md:text-6xl">
                    Bridging AI and cloud infrastructure for high-impact solutions.
                  </h1>
                  <p className="max-w-xl text-lg leading-8 text-black/70">
                    I architect and deploy AI-driven systems on cloud platforms, 
                    collaborating with engineering teams to integrate intelligent 
                    solutions end-to-end. From AI/ML infrastructure to full-stack 
                    development, I drive deployment excellence and engineering velocity.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      className="rounded-full border border-black/70 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition hover:bg-black hover:text-[#f6f2ea]"
                      href="#work"
                    >
                      View Work
                    </a>
                    <a
                      className="rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#f6f2ea] transition hover:bg-black/80"
                      href="mailto:hello@mikesheehy.dev"
                    >
                      Get In Touch
                    </a>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-black/50">
                      Focus Areas
                    </p>
                    <p className="text-2xl font-semibold">
                      AI integration, cloud deployment, and development velocity.
                    </p>
                  </div>
                  <div className="space-y-4 text-sm text-black/70">
                    <p>
                      Specializing in AI-Driven Development Lifecycle (AIDLC), cloud technologies 
                      (AWS, GCP), and full-stack engineering practices that accelerate team productivity.
                    </p>
                    <p>
                      Recent focus: AI model integration, cloud infrastructure optimization, 
                      CI/CD automation, and enabling teams to ship faster with confidence.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-black/60">
                    <span className="h-2 w-2 rounded-full bg-[#84b59f]"></span>
                    {' '}Open to forward deployed opportunities
                  </div>
                </div>
              </section>

              <section id="about" className="space-y-8">
                <div className="flex items-end justify-between gap-6">
                  <h2 className="font-[var(--font-display)] text-3xl md:text-4xl">
                    About Me
                  </h2>
                </div>
                <div className="space-y-6">
                  <p className="text-lg leading-8 text-black/70">
                    I&apos;m Mike, a Forward Deployed Engineer passionate about AI, cloud technologies, 
                    and the AI-Driven Development Lifecycle. With a strong foundation in full-stack development 
                    (Java, TypeScript, Python) and extensive experience with AWS and cloud infrastructure, 
                    I focus on making AI accessible and deployable at scale. I believe in building systems 
                    that amplify team productivity through intelligent automation and thoughtful architecture.
                  </p>
                  <p className="text-lg leading-8 text-black/70">
                    My expertise spans AI model integration, cloud-native development, CI/CD pipeline optimization, 
                    and fostering development workflows that leverage AI to reduce friction and accelerate delivery. 
                    I&apos;ve successfully led the integration of AI tools and practices into development teams, 
                    reducing cycle time and improving code quality across projects.
                  </p>
                  <p className="text-lg leading-8 text-black/70">
                    Beyond the technical work, I&apos;m committed to continuous learning and sharing knowledge 
                    within engineering communities. When not architecting systems or optimizing cloud infrastructure, 
                    I enjoy running, exploring new technologies, and staying connected with the latest developments 
                    in AI and cloud computing.
                  </p>
                </div>
              </section>

              <section id="expertise" className="space-y-8">
                <div className="flex items-end justify-between gap-6">
                  <h2 className="font-[var(--font-display)] text-3xl md:text-4xl">
                    Core Expertise
                  </h2>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">AI & Machine Learning</h3>
                    <ul className="space-y-2 text-sm text-black/70">
                      <li>• AI model integration and deployment</li>
                      <li>• AI-Driven Development Lifecycle (AIDLC) implementation</li>
                      <li>• LLM-based applications and prompt engineering</li>
                      <li>• ML infrastructure and MLOps practices</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Cloud Technologies</h3>
                    <ul className="space-y-2 text-sm text-black/70">
                      <li>• AWS services (EC2, Lambda, S3, RDS, SageMaker)</li>
                      <li>• Cloud infrastructure design and optimization</li>
                      <li>• Serverless architecture and microservices</li>
                      <li>• Infrastructure as Code (IaC) and automation</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Full-Stack Development</h3>
                    <ul className="space-y-2 text-sm text-black/70">
                      <li>• Backend: Java, Python, Node.js, TypeScript</li>
                      <li>• Frontend: React, Next.js, modern web frameworks</li>
                      <li>• Database design and optimization (SQL, NoSQL)</li>
                      <li>• System design and architectural patterns</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">DevOps & Engineering Culture</h3>
                    <ul className="space-y-2 text-sm text-black/70">
                      <li>• CI/CD pipelines and automation (GitHub Actions, Jenkins)</li>
                      <li>• Containerization and orchestration (Docker, Kubernetes)</li>
                      <li>• Developer experience and productivity tools</li>
                      <li>• Cross-team collaboration and knowledge sharing</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="work" className="space-y-8">
                <div className="flex items-end justify-between gap-6">
                  <h2 className="font-[var(--font-display)] text-3xl md:text-4xl">
                    Work Experience
                  </h2>
                </div>
                <div className="space-y-6">
                  {[
                    {
                      role: "Software Engineer Specialist",
                      company: "Nationwide Financial",
                      time: "2019 - Present",
                      detail:
                        ["Lead the integration of AI and cloud technologies into development workflows, improving team productivity and deployment velocity",
                        "Design and deploy scalable cloud-native solutions on AWS, including microservices and serverless architectures",
                        "Architect full-stack applications utilizing Java backend systems, modern frontend frameworks, and cloud infrastructure",
                        "Implement CI/CD automation and DevOps practices to reduce deployment friction and accelerate release cycles",
                        "Mentor teams on AI-Driven Development practices and best practices for cloud-native development"]
                    },
                    {
                      role: "Marketing IT Associate Developer",
                      company: "GE Appliances, a Haier Company",
                      time: "2016 - 2019",
                      detail:
                        ["Engineered full-stack solutions using Java, Spring, and cloud technologies to optimize marketing systems",
                        "Collaborated with cross-functional teams using GitHub to deliver high-impact digital products",
                        "Developed Progressive Web Applications and backend services supporting millions of user interactions",
                        "Built solutions leveraging Maven, Jenkins, and CodePipeline for continuous delivery and automated testing",
                        "Worked with infrastructure teams to deploy and optimize applications on cloud platforms"]
                    },
                    {
                      role: "Product Designer .NET Apprentice",
                      company: "The Software Guild",
                      time: "2016",
                      detail:
                        ["Completed intensive full-stack development program with hands-on experience in C#, ASP.NET MVC, and SQL Server",
                        "Built responsive web applications using HTML, CSS, Bootstrap, and JavaScript",
                        "Learned and applied Agile methodologies in individual and group project environments",
                        "Developed database-driven applications with proper separation of concerns (UI, business logic, data layers)"]
                    },
                  ].map((item) => (
                    <div
                      key={item.role}
                    >
                      <p className="text-sm uppercase tracking-[0.25em] text-black/50">
                        {item.time}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold">
                        {item.role}
                      </h3>
                      <p className="mt-1 text-sm font-medium uppercase tracking-[0.2em] text-black/40">
                        {item.company}
                      </p>
                      <div className="mt-4 text-sm leading-6 text-black/70">
                        {Array.isArray(item.detail) ? (
                          <ul className="list-disc pl-5">
                            {item.detail.map((detail, index) => (
                              <li key={index}>{detail}</li>
                            ))}
                          </ul>
                        ) : (
                          <ul className="list-disc pl-5">{item.detail}</ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="certifications" className="space-y-8">
                <div className="flex items-end justify-between gap-6">
                  <h2 className="font-[var(--font-display)] text-3xl md:text-4xl">
                    Certifications
                  </h2>
                  <a
                    href="https://www.credly.com/users/mikesheehy"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold uppercase tracking-wider text-black/50 transition hover:text-black"
                  >
                    View all
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {badges.length > 0 ? (
                    badges.map((badge) => (
                      <a
                        key={badge.id}
                        href={badge.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-col items-center gap-3 rounded-2xl border border-black/10 p-5 text-center transition hover:border-black/30 hover:shadow-sm"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={badge.imageUrl}
                          alt={badge.name}
                          className="h-24 w-24 object-contain"
                        />
                        <div className="space-y-1">
                          <p className="text-sm font-semibold leading-tight">
                            {badge.name}
                          </p>
                          <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                            {badge.issuer}
                          </p>
                          <p className="text-xs text-black/40">
                            {new Date(badge.issuedAt).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="col-span-full">
                      <p className="text-sm uppercase tracking-[0.25em] text-black/50">
                        Unable to load certifications
                      </p>
                      <a
                        className="mt-4 inline-flex rounded-full border border-black/60 px-5 py-2 text-xs font-semibold uppercase tracking-wider transition hover:bg-black hover:text-[#f6f2ea]"
                        href="https://www.credly.com/users/mikesheehy"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View on Credly
                      </a>
                    </div>
                  )}
                </div>
              </section>

              <section id="blog" className="space-y-8">
                <div className="flex items-end justify-between gap-6">
                  <h2 className="font-[var(--font-display)] text-3xl md:text-4xl">
                    Blog
                  </h2>
                </div>

                <div className="space-y-6">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <article
                        key={post.id}
                        className="group flex h-full flex-col justify-between transition"
                      >
                        <div className="space-y-2">
                          <p className="text-xs uppercase tracking-[0.25em] text-black/50">
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <h3 className="text-xl font-semibold transition group-hover:text-black">
                            {post.title}
                          </h3>
                          <p className="text-sm leading-6 text-black/70">
                            {post.brief}
                          </p>
                        </div>
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="mt-3 text-sm font-semibold uppercase tracking-wider text-black/60">
                            Read article
                          </span>
                        </a>
                      </article>
                    ))
                  ) : (
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-black/50">
                        Unable to load articles
                      </p>
                      <p className="mt-4 text-lg text-black/70">
                        The latest posts could not be fetched right now. Check back
                        soon or visit the blog directly.
                      </p>
                      <a
                        className="mt-6 inline-flex rounded-full border border-black/60 px-5 py-2 text-xs font-semibold uppercase tracking-wider transition hover:bg-black hover:text-[#f6f2ea]"
                        href="https://mikesheehyblog.wordpress.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit Blog
                      </a>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 text-sm text-black/60 md:flex-row md:items-center">
          <p>Designed and built in Next.js. Deployed on cloud infrastructure.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://linkedin.com/in/mbsheehy"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-black"
              aria-label="LinkedIn"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37[...]
              </svg>
            </a>
            <a
              href="https://github.com/mikesheehy"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-black"
              aria-label="GitHub"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-[...]
              </svg>
            </a>
            <a
              href="https://mikesheehyblog.wordpress.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-black"
              aria-label="WordPress"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 512 512">
                <path d="M256 8C119.3 8 8 119.2 8 256c0 136.7 111.3 248 248 248s248-111.3 248-248C504 119.2 392.7 8 256 8zM33 256c0-32.3 6.9-63 19.3-90.7l106.4 291.4C84.3 420.5 33 344.2 33 256zm2[...]
              </svg>
            </a>
            <a
              href="https://credly.com/users/mikesheehy"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-black"
              aria-label="Credly"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.8 13.154a.299.299 0 0 0-.101-.024.407.407 0 0 0-.202.048c-.06.028-.092.08-.127.136-.087.128-.15.268-.226.4-.107.187-.246.351-.38.515-.135.156-.286.291-.424.44-.028.02[...]
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
