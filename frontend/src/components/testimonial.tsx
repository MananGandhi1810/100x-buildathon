"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

interface Testimonial14Props {
  title?: string;
  description?: string;
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Engineering Manager",
    company: "TechCorp",
    content:
      "CodeAI has transformed our development workflow. The automated code review and documentation features have increased our team's velocity by 40%.",
    rating: 5,
    avatar: "https://github.com/shadcn.png",
  },
  {
    name: "Michael Rodriguez",
    role: "Senior Full-Stack Developer",
    company: "TechCorp",
    content:
      "The vulnerability scanner is incredibly effective. It caught several security issues in our codebase that we would have missed otherwise.",
    rating: 5,
    avatar: "https://github.com/shadcn.png",
  },
  {
    name: "Emily Watson",
    role: "CTO",
    company: "StartupXYZ",
    content:
      "The 'Chat with Code' feature is revolutionary. Our junior developers can now understand and modify complex codebases with confidence.",
    rating: 5,
    avatar: "https://github.com/shadcn.png",
  },
];

const Testimonial14 = ({
  title = "Trusted by Developers Worldwide",
  description = "Join thousands of developers who are shipping better code, faster with AI-powered development tools.",
  testimonials = defaultTestimonials,
}: Testimonial14Props) => {
  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-lg p-6 shadow-lg border border-border/40"
            >
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage
                    src={testimonial.avatar}
                    alt={testimonial.name}
                  />
                </Avatar>
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Testimonial14 };
