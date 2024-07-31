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
    <header className="flex items-center justify-end gap-4 p-4 border-b">
      <ThemeSwitcher />

      <UserProfile user={session.user}>
        <UserAvatar user={session.user} />
      </UserProfile>
    </header>
  );
};

export default Header;
