import { getPageSEO } from "@/lib/seo";
import { BASE_URL } from "@/config/config.mjs";
import ProgramTabs from "./ProgramTabs";
import ProgramFilters from "./ProgramFilters";

export async function generateMetadata() {
  return await getPageSEO("programs");
}

async function getSchoolData() {
  const res = await fetch(`${BASE_URL}school-department-list`, { next: { revalidate: 300 } });
  const json = await res.json();
  return json.data || [];
}

async function getProgramTypes() {
  const res = await fetch(`${BASE_URL}program-list`, { next: { revalidate: 300 } });
  const json = await res.json();
  return json.data || [];
}

async function getPrograms({ type, schoolId, departmentId, search }) {
  const query = [];
  if (schoolId) query.push(`school_id=${encodeURIComponent(schoolId)}`);
  if (departmentId) query.push(`department_id=${encodeURIComponent(departmentId)}`);
  if (search) query.push(`search=${encodeURIComponent(search)}`);
  query.push(`page=1`);

  const url = `${BASE_URL}programs/${type}${query.length ? `?${query.join("&")}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();
  return json.data;
}

export default async function Program({ searchParams }) {
  const sp = (await searchParams) || {};
  const type = sp.type || "under-graduate";
  let schoolId = sp.school_id ? Number(sp.school_id) : null;
  const departmentId = sp.department_id ? Number(sp.department_id) : null;
  const search = sp.search || "";

  const seoData = await getPageSEO("programs");

  const [schoolData, programData, programListingData] = await Promise.all([
    getSchoolData(),
    getProgramTypes(),
    getPrograms({ type, schoolId, departmentId, search }),
  ]);

  // Deep link with only department_id? resolve its parent school server-side.
  if (!schoolId && departmentId) {
    const parent = schoolData.find((s) =>
      s.departments?.some((d) => d.id === departmentId),
    );
    if (parent) schoolId = parent.id;
  }

  return (
    <>
      {seoData?.schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.schema) }}
        />
      )}

      <section className="inner-title">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="innnr_head">
                <h1>PROGRAMME</h1>
                <h2>
                  COMPREHENSIVE <span>ACADEMIC PROGRAMME</span> <br />
                  FOR <span>LIFELONG LEARNING</span>
                </h2>
                <ProgramTabs tabs={programData} activeProgram={type} currentQuery={sp} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProgramFilters
        key={`${type}-${schoolId}-${departmentId}-${search}`}
        schoolData={schoolData}
        activeProgram={type}
        activeSchoolId={schoolId}
        activeDepartmentId={departmentId}
        searchProgram={search}
        initialProgramListingData={programListingData}
        currentQuery={sp}
      />
    </>
  );
}