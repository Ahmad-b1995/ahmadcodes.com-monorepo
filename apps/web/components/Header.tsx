// Header.jsx
import React from "react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import NavigationLinks from "./NavigationLinks";
import Link from "next/link";

const Header = () => {
  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          <Link href="/">Ahmad Bagheri</Link>
        </h1>
        <h2 className="mt-3 text-lg font-medium tracking-tight text-primary sm:text-xl">
          Senior Full-Stack Engineer
        </h2>
        <p className="mt-4 max-w-xs leading-normal text-slate-600 dark:text-slate-400">
          Sole-engineer specialist for ERP-integrated portals and dashboards.
          NetSuite, NestJS, React. 7+ years.
        </p>
        <p className="mt-3 max-w-xs text-sm leading-normal text-slate-500 dark:text-slate-500">
          Available for contract & part-time engagements (10&ndash;25 hrs/week). Remote, GMT+4.
        </p>
        <NavigationLinks /> 
      </div>
      <ul className="ml-1 mt-8 flex items-center" aria-label="Social media">
        <li className="mr-5 text-xs shrink-0">
          <Link
            className="block text-slate-600 dark:text-slate-400 hover:text-primary-300"
            href="https://github.com/Ahmad-b1995"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub (opens in a new tab)"
            title="GitHub"
          >
            <FaGithub size={20} />
          </Link>
        </li>
        <li className="mr-5 text-xs shrink-0">
          <Link
            className="block text-slate-600 dark:text-slate-400 hover:text-primary-300"
            href="https://www.linkedin.com/in/ahmad-bagheri/"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn (opens in a new tab)"
            title="LinkedIn"
          >
            <FaLinkedin size={20} />
          </Link>
        </li>
        <li className="mr-5 text-xs shrink-0">
        <Link
            className="block text-slate-600 dark:text-slate-400 hover:text-primary-300"
            href="mailto:contact@ahmadcodes.com"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Email (opens in a new tab)"
            title="Email"
          >
            <FaEnvelope size={20} />
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
