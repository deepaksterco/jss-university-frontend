import { getPageSEO } from "@/lib/seo";
import Script from "next/script";
import TabSection from "@/component/sections/TabSection";
import BlogsGrid from "@/component/blogs/Blogs";
import styles from "./page.module.css";
import { BASE_URL } from "@/config/config.mjs";

import '@/styles/inner.css';

export async function generateMetadata() {
  return await getPageSEO("blog");
}

const isDev = process.env.NODE_ENV === "development";

export const getBlogPageData = async () => {
  const res = await fetch(
    `${BASE_URL}pages/blog`,
    isDev ? { cache: "no-store" } : { next: { revalidate: 120 } }
  );
  if (!res.ok) {
    console.error("API Error:", res.status);
    throw new Error(`Failed to fetch data`);
  }
  return res.json();
};

export const getBlogData = async (page = 1) => {
  const res = await fetch(
    `${BASE_URL}blog?page=${page}`,
    isDev ? { cache: "no-store" } : { next: { revalidate: 120 } }
  );
  if (!res.ok) {
    console.error("API Error:", res.status);
    throw new Error(`Failed to fetch data`);
  }
  return res.json();
};

export default async function BlogsPage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;

  const seoData = await getPageSEO("blog");

  const [blogPageData, blogData] = await Promise.all([
    getBlogPageData(),
    getBlogData(page),
  ]);

  const data = blogPageData?.data ?? blogPageData; // adjust to your actual API shape
  const hasTabs = !!data?.tabs;

  return (
    <>
      {seoData?.schema && (
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.schema) }}
          strategy="beforeInteractive"
        />
      )}

      <div className={styles.happeningsContainer}>
        {hasTabs && (
          <TabSection
            title={data.tabs.title}
            subtitle={data.tabs.subTitle}
            tabs={data.tabs.tabs}
            slug={data.slug}
          />
        )}

        <div className={styles.tabContent}>
          <BlogsGrid blogs={blogData} />
        </div>
      </div>
    </>
  );
}