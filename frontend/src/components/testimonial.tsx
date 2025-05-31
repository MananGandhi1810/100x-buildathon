"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

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
      "Our team's velocity increased by 40% after implementing this platform. The AI insights are incredibly accurate and save us hours of code review time.",
    rating: 5,
    avatar: "/images/avatars/sarah-chen.jpg",
  },
  {
    name: "Michael Rodriguez",
    role: "Senior Full-Stack Developer",
    company: "TechCorp",
    content:
      "The vulnerability scanner caught critical security issues we missed in manual reviews. It's like having a security expert on the team 24/7.",
    rating: 5,
    avatar: "/images/avatars/michael-rodriguez.jpg",
  },
  {
    name: "Emily Watson",
    role: "CTO",
    company: "StartupXYZ",
    content:
      "Chat with Code feature is revolutionary. Our junior developers can now understand legacy codebases in minutes instead of days.",
    rating: 5,
    avatar: "/images/avatars/emily-watson.jpg",
  },
];

const Testimonial14 = ({
  title = "Loved by developers worldwide",
  description = "See what our community is saying",
  testimonials = defaultTestimonials,
}: Testimonial14Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", updateCurrent);
    return () => {
      api.off("select", updateCurrent);
    };
  }, [api]);

  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-pretty lg:text-6xl">
              {title}
            </h2>
            <p className="mt-4 text-muted-foreground lg:text-xl">
              {description}
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex flex-col gap-6 rounded-lg border p-6"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="size-12">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Testimonial14 };
