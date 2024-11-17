import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

import ThemeSwitcher from "@/components/ThemeSwitcher";
import UserAvatar from "@/components/UserAvatar";
import UserProfile from "@/components/UserProfile";

const Header = async () => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <header className="flex items-center justify-between gap-4 p-4 border-b">
      <h1 className="text-center text-xl font-bold">SubsMGR</h1>

      <div className="flex items-center gap-8">
        <ThemeSwitcher />

        <UserProfile user={session.user}>
          <UserAvatar user={session.user} />
        </UserProfile>
      </div>
    </header>
  );
};

export default Header;
