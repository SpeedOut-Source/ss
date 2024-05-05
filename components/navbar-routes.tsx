"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { SearchInput } from "./search-input";
import { SwitchMode } from "./switch-mode";

export const NavbarRoutes = () => {
 
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        <SwitchMode  />
        <UserButton
          afterSignOutUrl="/"
        />
      </div>
    </>
  )
}