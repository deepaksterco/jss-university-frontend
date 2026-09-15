"use client";

import { useRouter, usePathname } from "next/navigation";

export default function ProgramTabs({ tabs, activeProgram, currentQuery }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabClick = (slug) => {
    const params = new URLSearchParams(currentQuery);
    params.set("type", slug);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <ul>
      {tabs.map((tab) => (
        <li key={tab.id} className={activeProgram === tab.slug ? "active" : ""}>
          <a onClick={() => handleTabClick(tab.slug)} style={{ cursor: "pointer" }}>
            {tab.name}
          </a>
        </li>
      ))}
    </ul>
  );
}