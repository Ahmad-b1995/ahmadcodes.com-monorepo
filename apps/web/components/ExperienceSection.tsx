import React from "react";
import NavigationWrapper from "./NavigationWrapper";

type Experience = {
  range: string;
  title: string;
  company: string;
  href?: string;
  description: string;
  stack: string[];
};

const experiences: Experience[] = [
  {
    range: "2025 — Present",
    title: "Senior Full-Stack Engineer",
    company: "Barriertek",
    href: "https://barriertek.com",
    description:
      "Sole engineer building Woody Portal, a manufacturer customer and production portal that replaces phone-based order coordination, whiteboard production scheduling, and per-team Excel sheets with a unified real-time dashboard. Designed end-to-end in TypeScript: NestJS API, React + TanStack Query frontend, planned React Native mobile app, and bi-directional NetSuite integration via SuiteScript RESTlets. Deployed on Coolify (Postgres, Linux, Ansible). Partial launch with internal users; full external rollout Oct 2026.",
    stack: ["TypeScript", "NestJS", "React", "PostgreSQL", "NetSuite", "SuiteScript"],
  },
  {
    range: "2022 — 2025",
    title: "Senior Full-Stack Engineer",
    company: "DexTrading",
    href: "https://dextrading.com",
    description:
      "Lead engineer on a 3-developer frontend team for a cryptocurrency analytics platform. Rebuilt the customer-facing app on Next.js + TanStack Query with substantial perceived-load improvements. Designed and shipped a NestJS + GraphQL + Postgres content platform that became a primary acquisition channel. Built a Django-backed AI Q&A API tied to subscription growth. Integrated TradingView, Chart.js, and D3 for real-time market visualization. Established CI/CD via Docker, GitLab, and Jenkins.",
    stack: ["Next.js", "NestJS", "GraphQL", "Django", "PostgreSQL", "Docker"],
  },
  {
    range: "2021 — 2023",
    title: "Full-Stack Engineer",
    company: "Azer Tech (Sahibkar)",
    description:
      "Built a multi-language Next.js front-end with server-side rendering for an educational technology platform. Implemented React Beautiful DnD for drag-and-drop workflows in an exam-creation tool. Configured CI/CD pipelines with Portainer, Docker, and GitLab. Consulted on backend performance optimization for hot paths.",
    stack: ["Next.js", "React", "Node.js", "Docker", "PostgreSQL"],
  },
  {
    range: "2020 — 2021",
    title: "Full-Stack Engineer",
    company: "Chargoon",
    description:
      "Iranian enterprise software vendor delivering ERP solutions to mid-market and enterprise customers (public site is geo-restricted outside Iran). Migrated legacy ERP modules to a React + .NET stack as part of a 15-engineer team while shipping new features driven by customer requests. Drove code-review practices that tightened defect rates and review cycle times.",
    stack: ["React", ".NET", "TypeScript", "ERP", "Code Review"],
  },
  {
    range: "2018 — 2020",
    title: "Frontend Engineer",
    company: "Hamisheh",
    description:
      "PWA-based fitness video streaming startup (now defunct). Built the Angular front-end with HLS streaming, PWA install, and offline capabilities. Designed and shipped a CMS dashboard for content upload workflows. Dockerized the frontend deployment, cutting daily deployment time substantially. Conducted A/B testing and user research feeding back into product iterations.",
    stack: ["Angular", "HLS", "PWA", "Docker", "CMS"],
  },
];

const ExperienceSection = () => {
  return (
    <NavigationWrapper elementName="experience">
      <section
        id="experience"
        className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
        aria-label="Work experience"
      >
        <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-950/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 lg:sr-only">
            Experience
          </h2>
        </div>
        <div>
          <ol className="group/list">
            {experiences.map((exp) => {
              const TitleTag = exp.href ? "a" : "span";
              const titleProps = exp.href
                ? {
                    href: exp.href,
                    target: "_blank",
                    rel: "noreferrer noopener",
                    "aria-label": `${exp.title} at ${exp.company} (opens in a new tab)`,
                  }
                : {};

              return (
                <li className="mb-12" key={`${exp.company}-${exp.range}`}>
                  <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                    <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-100/50 dark:lg:group-hover:bg-slate-800/50 "></div>
                    <header
                      className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:col-span-2"
                      aria-label={exp.range}
                    >
                      {exp.range}
                    </header>
                    <div className="z-10 sm:col-span-6">
                      <h3 className="font-medium leading-snug text-slate-800 dark:text-slate-100">
                        <div>
                          <TitleTag
                            className="inline-flex items-baseline font-medium leading-tight text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-300 focus-visible:text-primary-600 dark:focus-visible:text-primary-300 group/link text-base"
                            {...titleProps}
                          >
                            <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                            <span>
                              {exp.title} ·{" "}
                              <span className="inline-block">
                                {exp.company}
                                {exp.href && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px"
                                    aria-hidden="true"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                )}
                              </span>
                            </span>
                          </TitleTag>
                        </div>
                      </h3>
                      <p className="mt-2 text-sm leading-normal text-slate-700 dark:text-slate-400">
                        {exp.description}
                      </p>
                      <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
                        {exp.stack.map((tech) => (
                          <li className="mr-1.5 mt-2" key={tech}>
                            <div className="flex items-center rounded-full bg-primary-100 dark:bg-primary-400/20 px-3 py-1 text-xs font-medium leading-5 text-primary-700 dark:text-primary-300">
                              {tech}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-12">
            <a
              className="inline-flex items-center font-medium leading-tight text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-300 focus-visible:text-primary-600 dark:focus-visible:text-primary-300 group"
              aria-label="View Full Résumé (opens in a new tab)"
              href="/ahmad-bagheri-resume.pdf"
              target="_blank"
              rel="noreferrer noopener"
            >
              <span>
                <span className="border-b border-transparent pb-px transition group-hover:border-primary-600 dark:group-hover:border-primary-300 motion-reduce:transition-none">
                  View Full Résumé
                </span>
                <span className="whitespace-nowrap">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="ml-1 inline-block h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-focus-visible:-translate-y-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </span>
            </a>
          </div>
        </div>
      </section>
    </NavigationWrapper>
  );
};

export default ExperienceSection;
