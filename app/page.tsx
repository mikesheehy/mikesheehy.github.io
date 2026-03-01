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
                    I engineer efforts that connect design, strategy,
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
                    {' '}Available for select collaborations
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
                      role: "Software Engineer Specialist",
                      company: "Nationwide Financial",
                      time: "2019 - Present",
                      detail:
                        ["Develop cost-effective information technology solutions by creating new and modifying existing software applications",
                        "Analyze and validates complex system requirements and existing business processes. Design, develop and implement new programs and modifications of existing applications.",
                        "Assist in leading all aspects of applications programming and development including file design, update, storage and retrieval."]
                    },
                    {
                      role: "Marketing IT Associate Developer",
                      company: "GE Appliances, a Haier Company",
                      time: "2016 - 2019",
                      detail:
                        ["Provide analysis to develop solutions toward Minimum Viable Product (MVP) and continue to enable productivity (efficiency) across the business",
                        "Build on working knowledge of Java, Maven, Spring, Jenkins, SAP Master Data Management, CodePipeline, Progressive Web Applications, AmpScript and more",
                        "Collaborate across multiple teams using GitHub",
                        "Work effectively with vendor/partners, resources and various IT teams such as Infrastructure, DBAs and Shared Services"],
                    },
                    {
                      role: "Product Designer.Net Apprentice",
                      company: "The Software Guild",
                      time: "2016",
                      detail:
                        ["Implement full stack practices to applications in both individual and group environments",
                        "Acquire knowledge in C#, SQL Server, ASP.NET, MVC, ADO.NET, HTML, Bootstrap, and JavaScript",
                        "Program applications into UI, database, and logic programming layers to optimize Agile performance"],
                    },
                  ].map((item) => (
                    <div
                      key={item.role}
                    >
                      <p className="text-sm uppercase tracking-[0.25em] text-black/50">
                        {item.time}
                      </p>
                      <h3 className="text-xl font-semibold">
                        {item.role}
                      </h3>
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-black/40">
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
          <div className="flex items-center gap-6">
            <a
              href="https://linkedin.com/in/mbsheehy"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-black"
              aria-label="LinkedIn"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
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
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://mikesheehy.hashnode.dev"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-black"
              aria-label="Hashnode"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 0 0-7.962 0l-6.37 6.37a5.63 5.63 0 0 0 0 7.962l6.37 6.37a5.63 5.63 0 0 0 7.962 0l6.37-6.37a5.63 5.63 0 0 0 0-7.962zM12 15.953a3.953 3.953 0 1 1 0-7.906 3.953 3.953 0 0 1 0 7.906z" />
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
                <path d="M23.8 13.154a.299.299 0 0 0-.101-.024.407.407 0 0 0-.202.048c-.06.028-.092.08-.127.136-.087.128-.15.268-.226.4-.107.187-.246.351-.38.515-.135.156-.286.291-.424.44-.028.027-.072.043-.107.027-.028-.016-.036-.056-.032-.088.04-.38.075-.763.123-1.138.02-.172.043-.336.063-.512.028-.247.056-.487.087-.735l.234-1.824c.02-.128.032-.372-.135-.52a.446.446 0 0 0-.233-.116.46.46 0 0 0-.254.06c-.226.16-.297.504-.365.76-.142.603-.178 1.241-.471 1.804a1.772 1.772 0 0 1-.202.316.668.668 0 0 1-.186.18.332.332 0 0 1-.246.051.365.365 0 0 1-.238-.207.871.87 0 0 1-.063-.324 4.499 4.499 0 0 1 .24-1.585c.045-.132.089-.252.104-.383.028-.156.028-.38-.114-.516-.131-.128-.337-.18-.504-.128-.194.056-.31.244-.372.392-.198.463-.25.95-.317 1.446-.044.327-.127.64-.293.926a2.717 2.717 0 0 1-.603.72c-.118.087-.222.123-.328.107a.376.376 0 0 1-.278-.208.875.875 0 0 1-.095-.315 3.361 3.36 0 0 1-.036-.616c.004-.223 0-.44.044-.658.075-.39.678-1.937.808-2.345.135-.407.262-.823.353-1.246.08-.38.123-.767.11-1.15-.007-.277-.07-.576-.288-.736a.611.61 0 0 0-.603-.048.968.968 0 0 0-.455.428 2.53 2.53 0 0 0-.226.59 12.01 12.01 0 0 0-.266 1.29c-.071.429-.138.848-.206 1.268-.06.355-.206 1.614-.261 1.88-.06.272-.175.54-.301.787-.131.268-.258.536-.408.791a.694.694 0 0 1-.175.224c-.08.06-.182.088-.27.048-.102-.048-.146-.176-.166-.292-.075-.435-.012-.875.072-1.302.083-.431.44-2.4.519-2.851.099-.532.24-1.05.285-1.59.028-.388.09-.88-.202-1.187-.115-.136-.31-.16-.44-.136-.174.036-.31.176-.388.296-.1.128-.186.28-.258.467-.115.284-.186.615-.261.91l-.032.129c-.083.383-.143.77-.186 1.162a16.95 16.948 0 0 0-.06.632c-.008.1-.016.203-.027.307 0 .08.007.168-.028.244a.304.304 0 0 1-.052.068c-.08.072-.202.06-.31.056-.557-.016-1.045.3-1.35.755-.18.252-.281.542-.39.834-.01.048-.034.1-.054.152-.051.143-.13.327-.222.511a3.037 3.037 0 0 1-.317.46 3.285 3.285 0 0 1-.384.41 1.123 1.123 0 0 1-.515.26c-.174.04-.384-.043-.543-.203a.916.916 0 0 1-.206-.54c-.004-.055-.004-.115.028-.163.05-.068.146-.072.23-.076a1.623 1.623 0 0 0 1.375-1.015c.138-.34.178-.698.122-1.046a1.193 1.193 0 0 0-.19-.48.9.9 0 0 0-.396-.323c-.293-.14-.658-.127-1.01.004-.575.232-.951.74-1.134 1.562l-.02.088c-.114.487-.23 1-.582 1.354-.127.12-.261.163-.368.143-.044-.004-.08-.04-.103-.075-.096-.16.003-.532.15-1a4.1 4.1 0 0 0 .1-.366.925.925 0 0 0-.108-.495.783.783 0 0 0-.372-.324c-.143-.064-.31-.06-.468-.06h-.047c-.044 0-.103 0-.151-.012a.215.215 0 0 1-.147-.127.485.485 0 0 1 .016-.232c.004-.02.012-.048.016-.072a.368.368 0 0 0-.162-.412.509.509 0 0 0-.468-.036.768.768 0 0 0-.364.348.769.769 0 0 0-.103.48c.04.13.07.32.043.475-.055.28-.222.51-.384.74-.04.05-.072.106-.107.16a4.96 4.96 0 0 1-.706.825c-.372.335-.804.575-1.232.67-.745.165-1.506-.06-1.91-.734-.222-.38-.32-.827-.348-1.266a5.425 5.425 0 0 1 .424-2.516c.328-.76.816-1.52 1.715-1.614.353-.04.753.083.912.4.115.23.075.506 0 .75-.072.244-.175.49-.18.75-.003.26.124.54.37.616.238.072.495-.08.634-.29.138-.21.186-.46.245-.704a6.282 6.281 0 0 1 .662-1.634c.139-.236.297-.488.254-.76a.543.543 0 0 0-.373-.415.543.543 0 0 0-.535.144c-.134.148-.206.371-.387.43-.17.06-.35-.055-.507-.134-.6-.32-1.336-.312-1.963-.048-.634.25-1.146.735-1.526 1.294C.462 8.53.098 9.508.022 10.48c-.027.34-.031.695 0 1.038.036.46.1.854.214 1.206.139.423.317.79.547 1.094.266.34.587.6.94.747.372.148.784.22 1.192.208a3.172 3.172 0 0 0 1.177-.283 4.29 4.29 0 0 0 1.026-.68c.309-.26.594-.559.84-.89.162-.224.309-.46.44-.708a4.83 4.83 0 0 0 .178-.383c.044-.104.087-.215.202-.26.056-.043.15-.02.202.013.064.04.115.075.135.135.048.116.02.232-.004.332v.012c-.028.1-.055.203-.091.303-.14.424-.238.811-.16 1.195.045.207.128.387.25.527a.84.84 0 0 0 .504.264c.246.04.51-.028.725-.132.143-.068.278-.156.397-.26.06-.06.122-.12.174-.184.044-.06.087-.147.178-.143a.15.15 0 0 1 .107.064c.028.031.04.071.06.115.23.52.776.84 1.335.84h.07c.27 0 .556-.093.79-.22.27-.14.48-.348.7-.552.02-.016.045-.04.073-.044.035-.008.07.012.099.044a.26.26 0 0 1 .047.1c.135.34.46.6.824.66a1.1 1.1 0 0 0 .99-.356c.056-.06.104-.128.167-.176.064-.044.15-.076.222-.044.107.04.135.164.182.268.107.235.357.371.615.375.289 0 .554-.148.764-.34.195-.183.353-.399.516-.61a.328.328 0 0 1 .106-.096c.04-.024.096-.028.13 0 .033.024.045.06.06.091.163.4.587.652 1.01.648.417-.004.809-.224 1.103-.516.095-.092.194-.2.32-.21.14-.017.207.114.254.22.072.142.115.238.25.338.158.116.36.152.547.1.17-.04.34-.156.47-.316.072-.088.112-.204.19-.284.092-.087.132.028.136.1.016.116.016.236.008.352-.016.236-.052.471-.08.703-.011.068-.02.136-.063.188-.06.068-.166.08-.253.064a2.898 2.898 0 0 0-.321-.028l-.14-.016c-.201-.012-.4-.036-.61-.044h-.185c-.404 0-.733.048-1.03.16-.48.187-.852.57-1.003 1.018a1.305 1.305 0 0 0-.052.64c.04.203.13.403.282.587.265.315.68.515 1.149.543.408.02.852-.064 1.292-.26.848-.367 1.482-1.094 1.696-1.95 0-.02.01-.039.023-.043.298-.104.57-.248.813-.428.245-.187.467-.399.65-.643.09-.12.174-.243.253-.37.07-.125.13-.257.202-.38a.906.906 0 0 0 .13-.316.411.411 0 0 0-.05-.328.257.257 0 0 0-.135-.124m-13.68-1.63c.017-.071.045-.14.06-.206a1.9 1.9 0 0 1 .262-.504c.04-.048.08-.1.135-.136a.246.246 0 0 1 .186-.048c.107.02.183.128.202.236.032.18-.04.396-.114.555a1.097 1.097 0 0 1-.31.415c-.06.044-.114.088-.178.116-.028.008-.063.028-.115.028h-.016c-.055 0-.114-.028-.126-.088a.827.827 0 0 1 .015-.367m4.308-.184c-.004.072-.024.148-.028.223a4.91 4.91 0 0 0 0 .779c.012.152.047.3-.016.444a1.069 1.069 0 0 1-.567.643.555.555 0 0 1-.245.056c-.02 0-.04-.004-.06-.004-.12 0-.214-.092-.265-.18a.871.87 0 0 1-.1-.272 2.129 2.129 0 0 1 .072-1.122c.08-.22.202-.435.38-.594a.874.874 0 0 1 .563-.24.31.31 0 0 1 .206.064c.04.044.06.104.056.164a.05.05 0 0 1 .004.04m6.43 4.653c-.015.044-.06.104-.08.14-.042.08-.102.163-.161.235a2.562 2.562 0 0 1-.317.304c-.238.18-.503.311-.777.387a2.025 2.025 0 0 1-.487.072h-.04a.795.795 0 0 1-.515-.18.433.433 0 0 1-.158-.25.537.537 0 0 1 .047-.305.776.776 0 0 1 .38-.383c.326-.16.682-.176 1.019-.16.139.004.265.012.4.02.107.004.218.012.325.024.056 0 .115.004.17.012.044.004.092-.004.135.008.06.004.068.036.06.076" />
            </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
