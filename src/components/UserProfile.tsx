"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { User } from "next-auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "./ThemeSwitcher";

import { signOut } from "next-auth/react";

type Props = {
  children: React.ReactNode;
  user: User;
};

const UserProfile = ({ children, user }: Props) => {
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-4">
          <SheetHeader className="flex flex-col gap-4 items-center">
            <SheetClose />
            <SheetTitle className="text-center">User Profile</SheetTitle>
            <Avatar className="w-16 h-16 cursor-pointer">
              <AvatarImage
                src={user?.image as string}
                alt={user?.name as string}
              />
              <AvatarFallback>{user?.name}</AvatarFallback>
            </Avatar>
          </SheetHeader>
          <SheetDescription className="flex flex-col gap-2 text-center">
            <span className="text-xs text-gray-400">{user?.email}</span>
            <span className="text-sm text-gray-500 font-semibold">
              {user?.name}
            </span>
          </SheetDescription>
        </div>
        <SheetFooter>
          <div className="w-full flex flex-col items-center gap-4">
            <ThemeSwitcher />
            <Button
              className="w-full"
              variant={"destructive"}
              onClick={async () => {
                await signOut();
              }}
            >
              Sign Out
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default UserProfile;
