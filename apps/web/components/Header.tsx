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
          TypeScript across React, Next.js, and NestJS. 7+ years shipping
          production apps. Also ERP/NetSuite integrations.
        </p>
        <p className="mt-3 max-w-xs text-sm leading-normal text-slate-500 dark:text-slate-500">
          Open to full-time & contract. Armenia, remote, GMT+4.
        </p>
        <a
          className="group mt-5 inline-flex items-center text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-300"
          href="/ahmad-bagheri-resume-fullstack.pdf"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="View résumé PDF (opens in a new tab)"
        >
          <span className="border-b border-slate-300 pb-px transition group-hover:border-primary-600 dark:border-slate-600 dark:group-hover:border-primary-300">
            View Résumé (PDF)
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="ml-1 h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
              clipRule="evenodd"
            ></path>
          </svg>
        </a>
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
            href="mailto:ahmadbagheri.tech@gmail.com"
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
