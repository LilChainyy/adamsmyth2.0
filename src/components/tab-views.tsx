"use client";

import { usePathname } from "next/navigation";
import { LearnHome } from "@/components/learn/learn-home";
import { MyPortfolio } from "@/components/portfolio/my-portfolio";

export function TabViews({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const isLearn = pathname === "/learn";
  const isPortfolio = pathname.startsWith("/portfolio");
  const isTabRoute = isLearn || isPortfolio;

  return (
    <>
      <div className={isLearn ? "flex flex-1 flex-col" : "hidden"}>
        <LearnHome />
      </div>
      <div className={isPortfolio ? "flex flex-1 flex-col" : "hidden"}>
        <MyPortfolio />
      </div>
      {!isTabRoute && children && (
        <div className="flex flex-1 flex-col">{children}</div>
      )}
    </>
  );
}
