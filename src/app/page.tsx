import { Button } from "@/components/ui/button";

import Link from "next/link";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-8">
      <h1 className="text-4xl font-bold">Next.js Template</h1>
      <p className="text-lg mt-4">
        A custom template with Next.js, TypeScript, Shadcn UI, Tailwind CSS,
        Light and Dark Mode, PostgreSQL, Prisma, NextAuth.js, Google OAuth
      </p>
      <Link href="api/auth/signin">
        <Button className="mt-4">Get Started</Button>
      </Link>
    </div>
  );
};

export default Home;
