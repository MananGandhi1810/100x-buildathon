import { Button } from "@/components/ui/button";
import { Github, ArrowRight } from "lucide-react";
export default function GithubButton() {
  return (
    <a
      href={`https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user%20repo`}
      className="block"
    >
      <Button
        className="w-full h-14 bg-white text-black hover:bg-slate-100 transition-all duration-300 group"
        size="lg"
      >
        <Github className="mr-3 h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
        Continue with GitHub
        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>
    </a>
  );
}
