import PhDApplicationForm from "@/component/common/Phd-form/PhDApplicationForm";
import { getPageSEO } from "@/lib/seo";

export async function generateMetadata() {
  return await getPageSEO(`phd-application-form`);
}

export default async function Page() {
  const seoData = await getPageSEO(`phd-application-form`);

  return (
    <>
      {seoData?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seoData.schema),
          }}
        />

      )}
      <h1 style={{
        display:'none'
      }}>PHD Application Form</h1>
      <PhDApplicationForm />
    </>
  )
}