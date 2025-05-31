import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  FaGoogle,
  FaMicrosoft,
  FaAmazon,
  FaFacebook,
  FaApple,
} from "react-icons/fa";

interface Hero3Props {
  heading: string;
  description: string;
  buttons: {
    primary: {
      text: string;
      url: string;
    };
    secondary: {
      text: string;
      url: string;
    };
  };
  reviews: {
    count: number;
    rating: number;
    avatars: {
      src: string;
      alt: string;
    }[];
  };
}

const Hero3 = ({ heading, description, buttons, reviews }: Hero3Props) => {
  const companyIcons = [
    { icon: FaGoogle, color: "#4285F4" },
    { icon: FaMicrosoft, color: "#00A4EF" },
    { icon: FaAmazon, color: "#FF9900" },
    { icon: FaFacebook, color: "#1877F2" },
    { icon: FaApple, color: "#000000" },
  ];

  return (
    <section className="relative py-32">
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-4xl font-bold mb-6 md:text-6xl lg:text-7xl">
              {heading}
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {buttons.primary && (
                <Button size="lg" asChild>
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button size="lg" variant="outline" asChild>
                  <a href={buttons.secondary.url}>{buttons.secondary.text}</a>
                </Button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {companyIcons.map(({ icon: Icon, color }, index) => (
                  <div
                    key={index}
                    className="relative w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-white flex items-center justify-center"
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <span className="font-semibold">
                  {reviews.count.toLocaleString()}
                </span>{" "}
                developers trust us
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.floor(reviews.rating) }).map(
                    (_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    )
                  )}
                  <span className="text-muted-foreground">
                    {reviews.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[800px] w-full">
            <Image
              src="/hero.png"
              alt="AI-powered development tools"
              fill
              className="object-contain rounded-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero3 };
