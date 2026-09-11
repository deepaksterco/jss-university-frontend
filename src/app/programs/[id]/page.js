import { getPageSEO } from "@/lib/seo";
import { BASE_URL, WEB_URL } from "@/config/config.mjs";
import ProgramDetailContent from "./ProgramDetailContent";
import Link from "next/link";

async function getCourseDetail(id) {
  try {
    const res = await fetch(`${BASE_URL}course/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.success ? json.data : null;
  } catch {
    return null;
  }
}

function buildCourseSchema(id, data, seoData) {
  const pageUrl = `${WEB_URL}programs/${id}`;
  const name = data.name ?? id;
  const description = seoData?.description ?? data.overview?.overview_desc ?? "";
  const duration = data.admissionSection?.course_duration ?? "4 Years";
  const durationYears = parseInt(duration.match(/\d+/)?.[0] ?? "4", 10);
  const durationISO = `P${durationYears}Y`;
  const repeatCount = durationYears * 2;

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": pageUrl,
    name,
    description,
    provider: {
      "@type": "Organization",
      name: "JSS University, Noida",
      sameAs: WEB_URL,
      logo: { "@type": "ImageObject", url: `${WEB_URL}images/header/homenew.png` },
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      name,
      url: pageUrl,
      description,
      courseMode: "onsite",
      courseWorkload: `35 hours per week`,
      courseSchedule: {
        "@type": "Schedule",
        duration: durationISO,
        repeatFrequency: "P6M",
        repeatCount,
      },
    },
    offers: {
      "@type": "Offer",
      url: pageUrl,
      category: "Paid",
      availability: "https://schema.org/InStock",
    },
  };
}

function buildFAQSchema(data) {
  const faqs = data?.faqs;
  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  return await getPageSEO(`programs/${id}`);
}

export default async function ProgramDetail({ params }) {
  const { id } = await params;

  const [seoData, courseData] = await Promise.all([
    getPageSEO(`programs/${id}`),
    getCourseDetail(id),
  ]);

  const courseSchema = courseData ? buildCourseSchema(id, courseData, seoData) : null;
  const faqSchema = courseData ? buildFAQSchema(courseData) : null;

  return (
    <>
      {seoData?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.schema) }}
        />
      )}
      {courseSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {!courseData ? (
        <div
          className="error-container"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "20px", color: "#d32f2f" }}>
            No Sections Found For This Program. Please Add Sections To Display
            Program Details.
          </div>
          <Link href="/programs" className="apply-btn1">
            Back to Programs
          </Link>
        </div>
      ) : (
        <ProgramDetailContent data={courseData} />
      )}
    </>
  );
}