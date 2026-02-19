type HashnodePost = {
  id: string;
  title: string;
  brief: string;
  url: string;
  publishedAt: string;
  coverImage?: {
    url: string;
  } | null;
};

const HASHNODE_ENDPOINT = "https://gql.hashnode.com";

async function getLatestPosts(): Promise<HashnodePost[]> {
  const query = `
    query PublicationPosts($host: String!, $first: Int!) {
      publication(host: $host) {
        posts(first: $first) {
          edges {
            node {
              id
              title
              brief
              url
              publishedAt
              coverImage {
                url
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(HASHNODE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { host: "mikesheehy.hashnode.dev", first: 3 },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as {
      data?: {
        publication?: {
          posts?: {
            edges?: { node?: HashnodePost }[];
          };
        };
      };
    };

    return (
      payload.data?.publication?.posts?.edges
        ?.map((edge) => edge.node)
        .filter((post): post is HashnodePost => Boolean(post)) ?? []
    );
  } catch {
    return [];
  }
}

export default async function Home() {
  const posts = await getLatestPosts();

  return (
    <div className="min-h-screen bg-white text-black">

      <header className="relative z-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-black/60">
              Mike Sheehy
            </p>
            <p className="text-lg font-semibold">Software Engineer</p>
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
                  <a className="transition hover:text-black" href="#work">
                    Work
                  </a>
                  <a className="transition hover:text-black" href="#blog">
                    Blog
                  </a>
                  <a
                    className="transition hover:text-black"
                    href="https://mikesheehy.hashnode.dev"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Hashnode
                  </a>
                  <a
                    className="transition hover:text-black"
                    href="mailto:hello@mikesheehy.dev"
                  >
                    Email
                  </a>
                </nav>
              </div>
            </aside>

            <div className="space-y-16">
              <section className="space-y-10">
                <div className="space-y-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-black/50">
                    Personal Site
                  </p>
                  <h1 className="font-[var(--font-display)] text-4xl leading-tight md:text-6xl">
                    Building calm, confident product experiences from idea to launch.
                  </h1>
                  <p className="max-w-xl text-lg leading-8 text-black/70">
                    I lead product engineering efforts that connect design, strategy,
                    and shipping. This space is where I share the highlights of the
                    work, the process behind it, and the writing that keeps me
                    learning.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      className="rounded-full border border-black/70 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition hover:bg-black hover:text-[#f6f2ea]"
                      href="#blog"
                    >
                      Latest Writing
                    </a>
                    <a
                      className="rounded-full bg-black px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#f6f2ea] transition hover:bg-black/80"
                      href="mailto:hello@mikesheehy.dev"
                    >
                      Say Hello
                    </a>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-black/50">
                      Currently
                    </p>
                    <p className="text-2xl font-semibold">
                      Partnering with teams to ship faster with clarity.
                    </p>
                  </div>
                  <div className="space-y-4 text-sm text-black/70">
                    <p>
                      Based in the US, working across product strategy, system
                      design, and engineering leadership.
                    </p>
                    <p>
                      Recent focus: design systems, developer experience, and
                      founder-friendly go-to-market launches.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-black/60">
                    <span className="h-2 w-2 rounded-full bg-[#84b59f]"></span>
                    Available for select collaborations
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
                  <p className="text-lg leading-8 text-black/70">I'm Mike, a dedicated full-stack developer specializing in Java with a keen interest in AWS and platform engineering. I first became interested in tech when I helped implement SEO strategies for my first job after college. A career change offered an opportunity to explore this field, complete a full stack developer bootcamp, and build some projects.</p>
                  <p className="text-lg leading-8 text-black/70">As part of my professional growth, I have obtained the AWS Certified Cloud Practitioner certification and I'm currently learning towards the AWS Certified Developer Associate certification.</p>
                  <p className="text-lg leading-8 text-black/70">When I'm not working or pursuing new technical skills, I spend my time running, listening to new music, cooking, cheering on my college and local sports teams, and traveling. In fact, some of this site was built while riding a high-speed train from Barcelona to Madrid! I also volunteer as a mentor for Code:You.</p>                    
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
                      role: "Lead Product Engineer",
                      company: "Flux Systems",
                      time: "2022 - Present",
                      detail:
                        "Shipped a new onboarding workflow that reduced time-to-value by 38%.",
                    },
                    {
                      role: "Senior Engineer",
                      company: "Northwind Labs",
                      time: "2019 - 2022",
                      detail:
                        "Designed a reusable UI kit across four product lines.",
                    },
                    {
                      role: "Product Designer",
                      company: "Studio K",
                      time: "2016 - 2019",
                      detail:
                        "Led cross-functional launches for B2B and consumer teams.",
                    },
                  ].map((item) => (
                    <div
                      key={item.role}
                    >
                      <p className="text-sm uppercase tracking-[0.25em] text-black/50">
                        {item.time}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold">
                        {item.role}
                      </h3>
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-black/40">
                        {item.company}
                      </p>
                      <p className="mt-4 text-sm leading-6 text-black/70">
                        {item.detail}
                      </p>
                    </div>
                  ))}
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
                      <a
                        key={post.id}
                        href={post.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex h-full flex-col justify-between transition"
                      >
                        <div className="space-y-4">
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
                        <span className="mt-6 text-sm font-semibold uppercase tracking-wider text-black/60">
                          Read article
                        </span>
                      </a>
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
                        href="https://mikesheehy.hashnode.dev"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit Hashnode
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
          <p>Designed and built in Next.js.</p>
          <div className="flex items-center gap-4">
            <a
              className="uppercase tracking-[0.25em] transition hover:text-black"
              href="https://mikesheehy.hashnode.dev"
              target="_blank"
              rel="noreferrer"
            >
              Hashnode
            </a>
            <a
              className="uppercase tracking-[0.25em] transition hover:text-black"
              href="mailto:hello@mikesheehy.dev"
            >
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
