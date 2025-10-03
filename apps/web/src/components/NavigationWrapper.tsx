"use client";
import React, { ReactNode } from "react";
import { Element } from "react-scroll";

interface Props{
    elementName: string
    children: ReactNode
}
const NavigationWrapper = ({ elementName, children }: Props) => {
  return (
    <Element name={elementName}>
      <section
        id={elementName}
        className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
        aria-label={elementName}
      >
        {children}
      </section>
    </Element>
  );
};

export default NavigationWrapper;
