import React from "react";
import NavigationWrapper from "./NavigationWrapper";

const AboutSection = () => {
  return (
    <NavigationWrapper elementName="about">
      <section
        id="about"
        className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
        aria-label="About me"
      >
        <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 dark:bg-slate-950/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 lg:sr-only">
            About
          </h2>
        </div>
        <div>
          <p className="mb-4 text-slate-700 dark:text-slate-400">
            I&apos;m a senior full-stack engineer with 7+ years of experience building integration-heavy
            systems for ERP, fintech, and traditional enterprise environments. I specialize in
            <span className="text-slate-800 dark:text-slate-300"> NetSuite/SuiteScript integrations</span>,
            TypeScript on both ends (NestJS + React/Next.js), and the production tools that wrap them.
          </p>
          <p className="mb-4 text-slate-700 dark:text-slate-400">
            Currently at <a className="text-slate-800 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-300" href="https://barriertek.com" target="_blank" rel="noreferrer">Barriertek</a>, I&apos;m the sole engineer on
            <span className="text-slate-800 dark:text-slate-300"> Woody Portal</span> &mdash; a manufacturer
            customer portal that replaces phone-based order coordination, whiteboard production scheduling,
            and per-team Excel sheets with a unified real-time dashboard for distributors, truckers, production
            workers, and the office team. Bi-directional NetSuite integration via SuiteScript RESTlets;
            currently in partial launch with full external rollout targeted for October 2026.
          </p>
          <p className="mb-4 text-slate-700 dark:text-slate-400">
            Before that, I led the frontend rebuild at <a className="text-slate-800 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-300" href="https://dextrading.com" target="_blank" rel="noreferrer">DexTrading</a>
            (a crypto analytics platform), shipped an in-house content platform that became a primary acquisition
            channel, and built a Django-backed AI Q&amp;A API tied to subscription growth. Earlier I worked at
            <span> </span><span className="text-slate-800 dark:text-slate-300">Chargoon</span> &mdash; an Iranian ERP vendor
            &mdash; migrating legacy modules to a React + .NET stack alongside a 15-engineer team.
          </p>
          <p className="mb-4 text-slate-700 dark:text-slate-400">
            I&apos;m comfortable owning architecture, infrastructure, and delivery end-to-end &mdash; from Postgres
            schema and API design through deployment on Coolify with Linux and Ansible, to CI/CD and the front-end
            polish. I&apos;m available for contract and part-time engagements (10&ndash;25 hrs/week), remote,
            GMT+3 with comfortable overlap with US Eastern and Western Europe.
          </p>
        </div>
      </section>
    </NavigationWrapper>
  );
};

export default AboutSection;
