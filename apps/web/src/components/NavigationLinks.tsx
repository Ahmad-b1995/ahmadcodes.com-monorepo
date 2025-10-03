"use client";
import React from "react";
import { Link } from "react-scroll";

const NavigationLinks = () => {
  return (
    <nav className="nav hidden lg:block" aria-label="In-page jump links">
      <ul className="mt-16 w-max">
        <li>
          <Link
            className="group flex items-center py-3 cursor-pointer"
            to="about"
            smooth={true}
            duration={500}
            spy={true}
            activeClass="active" 
            offset={-100} 
          >
            <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 dark:bg-slate-400 transition-all group-hover:w-16 group-hover:bg-primary-600 dark:group-hover:bg-primary-300 group-focus-visible:w-16 group-focus-visible:bg-primary-600 dark:group-focus-visible:bg-primary-300 motion-reduce:transition-none"></span>
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 group-focus-visible:text-primary-600 dark:group-focus-visible:text-primary-300">
              About
            </span>
          </Link>
        </li>
        <li>
          <Link
            className="group flex items-center py-3 cursor-pointer"
            to="experience"
            smooth={true}
            duration={500}
            spy={true}
            activeClass="active" 
            offset={-100} 
          >
            <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 dark:bg-slate-400 transition-all group-hover:w-16 group-hover:bg-primary-600 dark:group-hover:bg-primary-300 group-focus-visible:w-16 group-focus-visible:bg-primary-600 dark:group-focus-visible:bg-primary-300 motion-reduce:transition-none"></span>
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 group-focus-visible:text-primary-600 dark:group-focus-visible:text-primary-300">
              Experience
            </span>
          </Link>
        </li>
        {/* <li>
          <Link
            className="group flex items-center py-3 cursor-pointer"
            to="projects"
            smooth={true}
            duration={500}
            spy={true}
            activeClass="active" 
            offset={-150} 
          >
            <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 dark:bg-slate-400 transition-all group-hover:w-16 group-hover:bg-primary-600 dark:group-hover:bg-primary-300 group-focus-visible:w-16 group-focus-visible:bg-primary-600 dark:group-focus-visible:bg-primary-300 motion-reduce:transition-none"></span>
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 group-focus-visible:text-primary-600 dark:group-focus-visible:text-primary-300">
              Projects
            </span>
          </Link>
        </li> */}
        <li>
          <Link
            className="group flex items-center py-3 cursor-pointer"
            to="blog"
            smooth={true}
            duration={500}
            spy={true}
            activeClass="active" 
            offset={-150} 
          >
            <span className="nav-indicator mr-4 h-px w-8 bg-slate-600 dark:bg-slate-400 transition-all group-hover:w-16 group-hover:bg-primary-600 dark:group-hover:bg-primary-300 group-focus-visible:w-16 group-focus-visible:bg-primary-600 dark:group-focus-visible:bg-primary-300 motion-reduce:transition-none"></span>
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-300 group-focus-visible:text-primary-600 dark:group-focus-visible:text-primary-300">
              Blog
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationLinks;
