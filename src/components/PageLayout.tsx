import type { ReactNode } from "react";
import { NavBar } from "./NavBar";

type PageLayoutProps = {
  backgroundImage: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function PageLayout({
  backgroundImage,
  title,
  subtitle,
  children,
}: PageLayoutProps) {
  return (
    <div className="page-head" style={{ backgroundImage: backgroundImage }}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <NavBar />
      {children}
    </div>
  );
}
