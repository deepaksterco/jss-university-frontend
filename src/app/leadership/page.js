import { getPageSEO } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { BASE_URL } from "@/config/config.mjs";
import "@/styles/style.css";
import "@/styles/custom.style.css";

const isDev = process.env.NODE_ENV === "development";
const CURRENT_PATH = "/leadership";

export async function generateMetadata() {
  return await getPageSEO("leadership");
}

async function getLeadershipPageData() {
  const res = await fetch(
    `${BASE_URL}pages/leadership`,
    isDev ? { cache: "no-store" } : { next: { revalidate: 120 } }
  );
  if (!res.ok) {
    console.error("API Error:", res.status);
    throw new Error("Failed to fetch leadership page data");
  }
  const json = await res.json();
  return json.tabs || null;
}

async function getLeadershipData() {
  const res = await fetch(
    `${BASE_URL}leadership`,
    isDev ? { cache: "no-store" } : { next: { revalidate: 120 } }
  );
  if (!res.ok) {
    console.error("API Error:", res.status);
    throw new Error("Failed to fetch leadership data");
  }
  const json = await res.json();
  if (!json.success || !json.data) {
    return { featured: null, management: [], others: {} };
  }
  return {
    featured: json.data.featured || null,
    management: json.data.management || [],
    others: json.data.others || {},
  };
}

export default async function Leadership() {
  const seoData = await getPageSEO("leadership");

  const [aboutPage, { featured: featuredLeader, management: managementLeaders, others: otherLeaders }] =
    await Promise.all([getLeadershipPageData(), getLeadershipData()]);

  return (
    <>
      {seoData?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.schema) }}
        />
      )}

      {aboutPage && (
        <section className="inner-title">
          <div className="container">
            <div className="innnr_head text-center">
              <h1 className="sub_heading">{aboutPage.subTitle}</h1>
              <h2 dangerouslySetInnerHTML={{ __html: aboutPage.title }} />
              <ul>
                {aboutPage.tabs.map((tab, i) => (
                  <li
                    key={i}
                    className={CURRENT_PATH === tab.url ? "active" : ""}
                  >
                    <Link href={tab.url}>{tab.text}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {!featuredLeader ? (
        <div className="text-center p-10">
          <p>No Leadership Data Found</p>
        </div>
      ) : (
        <>
          <section className="leadership_one">
            <div className="container">
              <div className="top_img">
                <figure>
                  <Image
                    src={featuredLeader.image}
                    alt={featuredLeader.name}
                    width={1200}
                    height={600}
                    className="img-fluid w-100"
                    priority
                    fetchPriority="high"
                  />
                  <figcaption>
                    <h3>
                      {featuredLeader.name}
                      <span>{featuredLeader.subtitle || ""}</span>
                    </h3>
                    <div className="d-flex gap-3">
                      <p>{featuredLeader.designation}</p>
                      <Image
                        src="/images/icons/circularArrow.svg"
                        alt="arrow"
                        width={20}
                        height={20}
                        className="arrow-icon"
                      />
                    </div>
                  </figcaption>
                  <Link
                    href={`/leadership/${featuredLeader.slug}`}
                    className="links"
                    aria-label={`View leadership: ${featuredLeader.name}`}
                  />
                </figure>
              </div>
            </div>
          </section>

          {managementLeaders.length > 0 && (
            <section className="leadership_two">
              <div className="container">
                <div className="leader-category-block">
                  <div className="leadership_grid">
                    {managementLeaders.map((leader) => {
                      if (featuredLeader && leader.id === featuredLeader.id) return null;
                      return <LeaderCard key={leader.id} leader={leader} />;
                    })}
                  </div>
                </div>
              </div>
            </section>
          )}

          {Object.entries(otherLeaders).map(([categoryName, categoryLeaders]) => {
            if (!categoryLeaders?.length) return null;
            return (
              <section key={categoryName} className="leadership_two pt-0">
                <div className="container">
                  <div className="leader-category-block">
                    <h2 className="leader-category-title">
                      {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                    </h2>
                    <div className="leadership_grid">
                      {categoryLeaders.map((leader) => (
                        <LeaderCard key={leader.id} leader={leader} />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </>
      )}
    </>
  );
}

function LeaderCard({ leader }) {
  return (
    <div className="leadership_grid_Bx">
      <figure>
        <span>
          <Image src={leader.image} alt={leader.name} width={400} height={400} />
        </span>
        <figcaption>
          <h3>{leader.name}</h3>
          <p>{leader.designation}</p>
          <Image
            src="/images/icons/leder-arrow.svg"
            alt="arrow"
            width={20}
            height={20}
            className="arrow-icon"
          />
        </figcaption>
      </figure>
      <Link href={`/leadership/${leader.slug}`} className="links" aria-label={`View leadership: ${leader.name}`} />
    </div>
  );
}