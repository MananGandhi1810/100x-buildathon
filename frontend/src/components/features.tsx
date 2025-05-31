"use client";

import { useState } from "react";
import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  gradient: "bg1" | "bg2" | "bg3";
}

interface Feature197Props {
  features: FeatureItem[];
}

const defaultFeatures: FeatureItem[] = [
  {
    id: 1,
    title: "README Generator",
    description:
      "AI-powered documentation generation that creates comprehensive README files from your codebase in seconds.",
    gradient: "bg1",
  },
  {
    id: 2,
    title: "Pull Request Analyzer",
    description:
      "Intelligent PR analysis with automated code reviews, impact assessment, and merge recommendations.",
    gradient: "bg2",
  },
  {
    id: 3,
    title: "Vulnerability Scanner",
    description:
      "Advanced security scanning that identifies vulnerabilities, OWASP compliance issues, and suggests fixes.",
    gradient: "bg3",
  },
  {
    id: 4,
    title: "Chat with Code",
    description:
      "Natural language interface to understand, debug, and modify your codebase through conversational AI.",
    gradient: "bg1",
  },
  {
    id: 5,
    title: "Deploy with Chat",
    description:
      "Conversational deployment pipeline that handles CI/CD, environment setup, and monitoring configuration.",
    gradient: "bg2",
  },
  {
    id: 6,
    title: "Code Structure Visualization",
    description:
      "Interactive dependency graphs and architecture diagrams to understand complex codebases instantly.",
    gradient: "bg3",
  },
  {
    id: 7,
    title: "Automated Testing",
    description:
      "AI-generated test suites with edge case detection, performance testing, and coverage optimization.",
    gradient: "bg1",
  },
];

const Feature197 = ({ features = defaultFeatures }: Feature197Props) => {
  const [activeTabId, setActiveTabId] = useState<number | null>(1);

  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="mb-12 flex w-full items-start justify-between gap-12">
          <div className="w-full md:w-1/2">
            <Accordion type="single" collapsible defaultValue="item-1">
              {features.map((tab) => (
                <AccordionItem key={tab.id} value={`item-${tab.id}`}>
                  <AccordionTrigger
                    onClick={() => {
                      setActiveTabId(tab.id);
                    }}
                    className="cursor-pointer py-5 no-underline! transition"
                  >
                    <h6
                      className={`text-xl font-semibold ${
                        tab.id === activeTabId
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {tab.title}
                    </h6>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mt-3 text-muted-foreground">
                      {tab.description}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="relative m-auto hidden aspect-[4/3] w-1/2 overflow-hidden rounded-xl md:block">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`absolute inset-0 transition-opacity duration-300 ${
                  feature.id === activeTabId ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={`/${feature.gradient}.png`}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={feature.id === 1}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <h3 className="text-4xl font-bold text-white drop-shadow-lg">
                      {feature.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature197 };
