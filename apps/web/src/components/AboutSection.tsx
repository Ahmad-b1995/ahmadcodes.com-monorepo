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
            With 7 years of experience as a senior full-stack developer, I specialize in building scalable ERP web solutions for startups across diverse sectors including cryptocurrency, e-commerce, and enterprise applications. My expertise spans modern technologies such as Next.js, TypeScript, Django, and GraphQL, enabling me to deliver comprehensive solutions that drive business growth.
          </p>
          <p className="mb-4 text-slate-700 dark:text-slate-400">
            Throughout my career, I&apos;ve achieved significant milestones including revamping DexTrading&apos;s web application with a 200% site speed increase and 50% user engagement boost. I successfully redesigned and launched their blog, resulting in a 500% increase in daily traffic and 200% improvement in user conversions. At Azer Tech, I optimized API performance by 50%, substantially enhancing platform efficiency and user satisfaction.
          </p>
          <p className="mb-4 text-slate-700 dark:text-slate-400">
            Currently at Barriertek, I&apos;m developing a comprehensive ERP system from scratch using React, NestJS, and PostgreSQL. This system replaces manual processes and eliminates phone-based communication, projected to serve 500+ users while reducing operational costs. I&apos;ve successfully onboarded 156+ customers with advanced features including real-time updates, NetSuite integration, and multi-platform support.
          </p>
          <p className="mb-4 text-slate-700 dark:text-slate-400">
            My approach combines technical excellence with leadership skills, having led teams of up to 3 developers while collaborating effectively in larger groups of 15+ members. I&apos;m passionate about implementing CI/CD pipelines, optimizing performance, and creating scalable DevOps infrastructure. Whether working with PostgreSQL, Docker, or cloud platforms, I focus on building solutions that are both innovative and maintainable.
          </p>
        </div>
      </section>
    </NavigationWrapper>
  );
};

export default AboutSection;
