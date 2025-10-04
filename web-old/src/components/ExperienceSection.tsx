import React from "react";
import NavigationWrapper from "./NavigationWrapper";

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
            <li className="mb-12">
              <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-100/50 dark:lg:group-hover:bg-slate-800/50 "></div>
                <header
                  className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:col-span-2"
                  aria-label="2023 to Present"
                >
                  2023 — Present
                </header>
                <div className="z-10 sm:col-span-6">
                  <h3 className="font-medium leading-snug text-slate-800 dark:text-slate-100">
                    <div>
                      <a
                        className="inline-flex items-baseline font-medium leading-tight text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-300 focus-visible:text-primary-600 dark:focus-visible:text-primary-300 group/link text-base"
                        href="https://barriertek.com"
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="Senior Full Stack Developer at Barriertek (opens in a new tab)"
                      >
                        <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                        <span>
                          Senior Full Stack Developer ·{" "}
                          <span className="inline-block">
                            Barriertek
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
                          </span>
                        </span>
                      </a>
                    </div>
                  </h3>
                  <p className="mt-2 text-sm leading-normal text-slate-700 dark:text-slate-400">
                    Leading the development of a comprehensive ERP system from scratch using React, NestJS, and PostgreSQL. Successfully onboarded 156+ customers with advanced features including real-time updates, NetSuite integration, and multi-platform support. The system is projected to serve 500+ users while reducing operational costs and eliminating phone-based communication.
                  </p>
                  <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
                    <li className="mr-1.5 mt-2">
                      <div className="flex items-center rounded-full bg-primary-100 dark:bg-primary-400/20 px-3 py-1 text-xs font-medium leading-5 text-primary-700 dark:text-primary-300">
                        React
                      </div>
                    </li>
                    <li className="mr-1.5 mt-2">
                      <div className="flex items-center rounded-full bg-primary-100 dark:bg-primary-400/20 px-3 py-1 text-xs font-medium leading-5 text-primary-700 dark:text-primary-300">
                        NestJS
                      </div>
                    </li>
                    <li className="mr-1.5 mt-2">
                      <div className="flex items-center rounded-full bg-primary-100 dark:bg-primary-400/20 px-3 py-1 text-xs font-medium leading-5 text-primary-700 dark:text-primary-300">
                        PostgreSQL
                      </div>
                    </li>
                    <li className="mr-1.5 mt-2">
                      <div className="flex items-center rounded-full bg-primary-100 dark:bg-primary-400/20 px-3 py-1 text-xs font-medium leading-5 text-primary-700 dark:text-primary-300">
                        TypeScript
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li className="mb-12">
              <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-100/50 dark:lg:group-hover:bg-slate-800/50 "></div>
                <header
                  className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:col-span-2"
                  aria-label="2020 to 2023"
                >
                  2020 — 2023
                </header>
                <div className="z-10 sm:col-span-6">
                  <h3 className="font-medium leading-snug text-slate-800 dark:text-slate-100">
                    <div>
                      <a
                        className="inline-flex items-baseline font-medium leading-tight text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-300 focus-visible:text-primary-600 dark:focus-visible:text-primary-300 group/link text-base"
                        href="https://dextrading.com"
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="Senior Full Stack Developer at DexTrading (opens in a new tab)"
                      >
                        <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                        <span>
                          Senior Full Stack Developer ·{" "}
                          <span className="inline-block">
                            DexTrading
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
                          </span>
                        </span>
                      </a>
                    </div>
                  </h3>
                  <p className="mt-2 text-sm leading-normal text-slate-700 dark:text-slate-400">
                    Revamped the web application achieving a 200% site speed increase and 50% user engagement boost. Successfully redesigned and launched the company blog, resulting in a 500% increase in daily traffic and 200% improvement in user conversions. Led a team of 3 developers while implementing modern development practices.
                  </p>
                  <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
                    <li className="mr-1.5 mt-2">
                      <div className="flex items-center rounded-full bg-primary-100 dark:bg-primary-400/20 px-3 py-1 text-xs font-medium leading-5 text-primary-700 dark:text-primary-300">
                        Next.js
                      </div>
                    </li>
                    <li className="mr-1.5 mt-2">
                      <div className="flex items-center rounded-full bg-primary-100 dark:bg-primary-400/20 px-3 py-1 text-xs font-medium leading-5 text-primary-700 dark:text-primary-300">
                        Django
                      </div>
                    </li>
                    <li className="mr-1.5 mt-2">
                      <div className="flex items-center rounded-full bg-primary-100 dark:bg-primary-400/20 px-3 py-1 text-xs font-medium leading-5 text-primary-700 dark:text-primary-300">
                        GraphQL
                      </div>
                    </li>
                    <li className="mr-1.5 mt-2">
                      <div className="flex items-center rounded-full bg-primary-100 dark:bg-primary-400/20 px-3 py-1 text-xs font-medium leading-5 text-primary-700 dark:text-primary-300">
                        AWS
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li className="mb-12">
              <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-100/50 dark:lg:group-hover:bg-slate-800/50 "></div>
                <header
                  className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:col-span-2"
                  aria-label="2018 to 2020"
                >
                  2018 — 2020
                </header>
                <div className="z-10 sm:col-span-6">
                  <h3 className="font-medium leading-snug text-slate-800 dark:text-slate-100">
                    <div>
                      <a
                        className="inline-flex items-baseline font-medium leading-tight text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-300 focus-visible:text-primary-600 dark:focus-visible:text-primary-300 group/link text-base"
                        href="https://azertech.com"
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="Full Stack Developer at Azer Tech (opens in a new tab)"
                      >
                        <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                        <span>
                          Full Stack Developer ·{" "}
                          <span className="inline-block">
                            Azer Tech
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
                          </span>
                        </span>
                      </a>
                    </div>
                  </h3>
                  <p className="mt-2 text-sm leading-normal text-slate-700 dark:text-slate-400">
                    Optimized API performance by 50%, substantially enhancing platform efficiency and user satisfaction. Collaborated with a team of 15+ developers to build scalable e-commerce solutions. Implemented CI/CD pipelines and DevOps infrastructure for improved deployment processes.
                  </p>
                  <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
                    <li className="mr-1.5 mt-2">
                      <div className="flex items-center rounded-full bg-primary-100 dark:bg-primary-400/20 px-3 py-1 text-xs font-medium leading-5 text-primary-700 dark:text-primary-300">
                        React
                      </div>
                    </li>
                    <li className="mr-1.5 mt-2">
                      <div className="flex items-center rounded-full bg-primary-100 dark:bg-primary-400/20 px-3 py-1 text-xs font-medium leading-5 text-primary-700 dark:text-primary-300">
                        Node.js
                      </div>
                    </li>
                    <li className="mr-1.5 mt-2">
                      <div className="flex items-center rounded-full bg-primary-100 dark:bg-primary-400/20 px-3 py-1 text-xs font-medium leading-5 text-primary-700 dark:text-primary-300">
                        MongoDB
                      </div>
                    </li>
                    <li className="mr-1.5 mt-2">
                      <div className="flex items-center rounded-full bg-primary-100 dark:bg-primary-400/20 px-3 py-1 text-xs font-medium leading-5 text-primary-700 dark:text-primary-300">
                        Docker
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ol>
          <div className="mt-12">
            <a
              className="inline-flex items-center font-medium leading-tight text-slate-800 dark:text-slate-100 hover:text-primary-600 dark:hover:text-primary-300 focus-visible:text-primary-600 dark:focus-visible:text-primary-300 group"
              aria-label="View Full Résumé (opens in a new tab)"
              href="https://drive.google.com/file/d/1uqP-YWDO2jZ5ZcWroBDAUHJhOkQx43FQ/view?usp=drive_link"
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
