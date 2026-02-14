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
    <div className="min-h-screen bg-[#f6f2ea] text-[#1f1b17]">
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute -left-32 top-16 h-80 w-80 rounded-full bg-[#f0b45f]/60 blur-3xl" />
        <div className="absolute right-0 top-96 h-96 w-96 rounded-full bg-[#84b59f]/40 blur-[140px]" />
      </div>

      <header className="relative z-10 border-b border-black/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-black/60">
              Mike Sheehy
            </p>
            <p className="text-lg font-semibold">Product Engineer</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium uppercase tracking-widest text-black/70 md:flex">
            <a className="transition hover:text-black" href="#about">
              About
            </a>
            <a className="transition hover:text-black" href="#work">
              Work
            </a>
            <a className="transition hover:text-black" href="#blog">
              Blog
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24">
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
          <div className="rounded-3xl border border-black/10 bg-white/70 p-8 shadow-[0_30px_120px_-60px_rgba(15,15,15,0.5)] backdrop-blur">
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
                <span className="h-2 w-2 rounded-full bg-[#84b59f]" />
                Available for select collaborations
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="mx-auto w-full max-w-6xl space-y-8 px-6 py-16"
        >
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl">
              About Me
            </h2>
            <p className="text-sm uppercase tracking-[0.3em] text-black/40">
              Human side
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <p className="text-lg leading-8 text-black/70">
              I am a product engineer who loves closing the gap between teams
              and customers. My work blends design craft, systems thinking, and
              thoughtful execution. I believe the best products feel inevitable
              because the details are treated with care.
            </p>
            <div className="rounded-2xl border border-black/10 bg-white/70 p-6 text-sm leading-6 text-black/70">
              <p className="mb-4 font-semibold uppercase tracking-[0.25em] text-black/50">
                Focus Areas
              </p>
              <ul className="space-y-3">
                <li>Product strategy and roadmap facilitation.</li>
                <li>Design systems that scale across teams.</li>
                <li>Engineering leadership and delivery rituals.</li>
                <li>Rapid prototyping with measurable outcomes.</li>
              </ul>
            </div>
          </div>
        </section>

        <section
          id="work"
          className="mx-auto w-full max-w-6xl space-y-8 px-6 py-16"
        >
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl">
              Work Experience
            </h2>
            <p className="text-sm uppercase tracking-[0.3em] text-black/40">
              Selected work
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
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
                className="rounded-2xl border border-black/10 bg-white/70 p-6 shadow-[0_20px_80px_-60px_rgba(15,15,15,0.5)]"
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

        <section
          id="blog"
          className="mx-auto w-full max-w-6xl space-y-8 px-6 py-16"
        >
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl">
              Blog
            </h2>
            <p className="text-sm uppercase tracking-[0.3em] text-black/40">
              Hashnode
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {posts.length > 0 ? (
              posts.map((post) => (
                <a
                  key={post.id}
                  href={post.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col justify-between rounded-2xl border border-black/10 bg-white/70 p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_80px_-60px_rgba(15,15,15,0.6)]"
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
              <div className="rounded-2xl border border-black/10 bg-white/70 p-6 md:col-span-3">
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
      </main>

      <footer className="relative z-10 border-t border-black/10">
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
