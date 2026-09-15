import Image from "next/image";
import Link from "next/link";
import { APPLY_NOW } from "@/config/config.mjs";
import Faq from "@/component/common/faq/Faq";
import EligibilityPrograms from "@/component/sections/EligibilityData";
import EducationalTabs from "./EducationalTabs";
import OverviewText from "./OverviewText";
import CurriculumCarousel from "./CurriculumCarousel";
import TestimonialCarousel from "./TestimonialCarousel";
import "@/styles/custom.style.css";
import "@/styles/style.css";

function convertTabSection(tabSection) {
  if (!tabSection) return null;
  const info = tabSection.tab_section_info?.[0];
  const tabContent =
    typeof tabSection.tab_section_content === "string"
      ? JSON.parse(tabSection.tab_section_content)
      : tabSection.tab_section_content || [];

  const tabsGroup = tabContent.map((tab) => ({
    tabName: tab.name,
    tabTitle: tab.name,
    tabDesc: [],
    tabLists: [],
    tabHTML: tab.data,
  }));

  return [
    {
      type: "eligibilityData",
      items: [
        {
          heading: info?.title || "",
          subheading: info?.subtitle || "",
          image: info?.image || "",
          sectionId: "tabSection",
          tabsGroup,
        },
      ],
    },
  ];
}

export default function ProgramDetailContent({ data }) {
  const {
    name,
    banner,
    admissionSection,
    overview,
    eligibility,
    peos,
    pos,
    pso,
    curriculum,
    fee_structure,
    testimonials,
    career_opportunities,
    faqs,
    description,
    tabSection,
  } = data;

  const tabItems = [
    { id: "tab1", label: "Program Educational Objectives (PEOs)", data: peos, prefix: "PEO" },
    { id: "tab2", label: "Program Outcomes (POs)", data: pos, prefix: "PO" },
    { id: "tab3", label: "Program Specific Outcomes (PSOs)", data: pso, prefix: "PSO" },
  ].filter((tab) => tab.data?.length > 0);

  return (
    <main className="site_main">
      <section className="program-detail">
        <div className="program-detail-img">
          <figure>
            <Image
              src={banner?.image || "/images/default-banner.webp"}
              alt={banner?.name || name}
              width={1200}
              height={600}
              className="img-fluid w-100"
              loading="eager"
              fetchPriority="high"
              priority
            />
            <figcaption>
              <div className="program-detail-text">
                <div className="innnr_head">
                    <h1 className="sub_heading">PROGRAMMES</h1>
                    {name && <h2 className="heading">{name}</h2>}
                </div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>

      {admissionSection && (
        <section className="admission-sec">
          <div className="containerMD">
            <div className="row">
              <div className="col-lg-12">
                <div className="ov_mainsec">
                  <div className="admission-box">
                    <div className="admission-box-text">
                      <p>Admission Open for</p>
                      <h2>{admissionSection?.academic_year || "2026-27"}</h2>
                    </div>
                    <div className="overview-duration">
                      {admissionSection?.course_duration && (
                        <div className="overview-duration-text">
                          <span>Course Duration</span>
                          <p>{admissionSection.course_duration}</p>
                        </div>
                      )}
                      {admissionSection?.annual_fees && (
                        <div className="fees">
                          <span>Annual Fees</span>
                          <p>{admissionSection.annual_fees}</p>
                        </div>
                      )}
                      <div className="structure-btns">
                        {admissionSection?.program_structure && (
                          <a
                            href={admissionSection.program_structure}
                            className="structure-btn CTA_ProgrameStructure"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src="/images/custom-page/blue-pdf.png"
                              alt="PDF"
                              width={20}
                              height={20}
                              className="img-fluid "
                            />
                            Programme Structure
                          </a>
                        )}
                        {admissionSection?.scholarship && (
                          <a
                            href={admissionSection.scholarship}
                            className="structure-btn"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src="/images/custom-page/scholer-icon.png"
                              alt="PDF"
                              width={20}
                              height={20}
                              className="img-fluid"
                            />
                            Scholarship
                          </a>
                        )}
                        {admissionSection?.brouchure && (
                          <a
                            href={admissionSection.brouchure}
                            className="structure-btn brochure_btn"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Image
                              src="/images/custom-page/blue-pdf.png"
                              alt="PDF"
                              width={20}
                              height={20}
                              className="img-fluid CTA_Brochure"
                            />
                            Brochure
                          </a>
                        )}
                        <a
                          href={APPLY_NOW}
                          target="_blank"
                          className="apply-btn1 CTA_Applynow"
                          rel="noopener noreferrer"
                        >
                          Apply Now
                        </a>
                      </div>
                    </div>
                    <div className="eligibility-text">
                      <Link href="/scholarship-and-eligibility#eligibilitySec" className="eligibility-link">
                        <span>Eligibility Criteria</span>
                        <svg
                          className="cta-arrow"
                          style={{ marginLeft: "1rem", marginBottom: "0.5rem" }}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="#fff"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 1 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 1 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                          />
                        </svg>
                      </Link>
                      <h3>{admissionSection?.eligibility_marks}</h3>
                      <p>{admissionSection?.eligibility_desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {overview && <OverviewText overview={overview} name={name} />}

      <section className="eligibility-sec" id="eligibilitySec">
        <div className="containerMD">
          <div className="row">
            <div className="col-lg-12">
              <div className="eligibility-img">
                <figure>
                  {overview?.overview_image && (
                    <Image
                      src={overview.overview_image}
                      alt="Overview"
                      width={1200}
                      height={400}
                      className="img-fluid w-100"
                    />
                  )}
                </figure>
              </div>
            </div>
            {eligibility?.eligibility_criteria && (
              <div className="col-lg-12">
                <div className="rank-box">
                  <h6>Eligibility Criteria</h6>
                  <div className="rank-text">
                    <div className="left-rank-text">
                      <h2>{eligibility.eligibility_criteria}</h2>
                    </div>
                    <div className="right-rank-text">
                      <p>{eligibility.eligibility_criteria_desc}</p>
                    </div>
                  </div>
                  {eligibility?.eligibility_criteria_notices?.length > 0 && (
                    <div className="seats">
                      {eligibility.eligibility_criteria_notices[0] && (
                        <div className="seats-left-text">
                          <p>{eligibility.eligibility_criteria_notices[0]}</p>
                        </div>
                      )}
                      {eligibility.eligibility_criteria_notices[1] && (
                        <div className="seats-right-text">
                          <p>{eligibility.eligibility_criteria_notices[1]}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {tabSection && tabSection?.tab_section_content && tabSection?.tab_section_info?.length !== 0 && (
        <EligibilityPrograms data={convertTabSection(tabSection)} />
      )}

      <div className="containerMD">
        <div className="pos_tab_line"></div>
      </div>

      {tabItems.length > 0 && (
        <section className="educational-sec">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="educational-box">
                  <EducationalTabs tabItems={tabItems} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {curriculum?.curriculum_title && (
        <CurriculumCarousel curriculum={curriculum} extraSpace={!(peos?.length > 0)} />
      )}

      {fee_structure?.fee_structure_title && (
        <section className="program-sec-six">
          <div className="container">
            <div className="row">
              <div className="col-lg-9">
                <div className="structure">
                  <span>Fee Structure</span>
                  <p>{fee_structure?.fee_structure_title}</p>
                </div>
                <div className="structure-box">
                  <div className="structure-img">
                    <figure>
                      {fee_structure?.fee_structure_image && (
                        <Image
                          src={fee_structure.fee_structure_image}
                          alt="Fee Structure"
                          width={500}
                          height={400}
                          className="img-fluid w-100"
                        />
                      )}
                    </figure>
                  </div>
                  <div className="structure-text">
                    <p>{fee_structure?.fee_structure_short_description}</p>
                    <h2>{fee_structure?.course_total_fees}</h2>
                    <span>{fee_structure?.academic_year}</span>
                    <div className="engineering-btn">
                      <a href={APPLY_NOW} className="apply-btn1 CTA_Applynow" target="_blank" rel="noopener noreferrer">
                        Apply Now
                      </a>
                      {fee_structure?.fee_structure_pdf && (
                        <a
                          href={fee_structure.fee_structure_pdf}
                          target="_blank"
                          className="structure-btn"
                          rel="noopener noreferrer"
                        >
                          <Image
                            src="/images/custom-page/red-pdf-icon.png"
                            alt="PDF"
                            width={20}
                            height={20}
                            className="img-fluid"
                          />
                          DOWNLOAD
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {testimonials && testimonials.length > 0 && <TestimonialCarousel testimonials={testimonials} />}

      {career_opportunities && (
        <section className="opportunitie-sec">
          <div className="opportunitie-img">
            <figure>
              {career_opportunities?.career_image && (
                <Image
                  src={career_opportunities.career_image}
                  alt="Career Opportunities"
                  width={1200}
                  height={600}
                  className="img-fluid w-100"
                />
              )}
            </figure>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="opportunitie-box">
                  <div className="opportunitie-text">
                    <blockquote>{career_opportunities?.career_subtitle || "CAREER OPPORTUNITIES"}</blockquote>
                    <h2 dangerouslySetInnerHTML={{ __html: career_opportunities?.career_title }}></h2>
                    <p>{career_opportunities?.career_desc}</p>
                  </div>
                  <div className="opportunitie-tab">
                    <ul>
                      {career_opportunities?.useful_links &&
                        career_opportunities.useful_links.map((opportunity, index) => (
                          <li key={index}>
                            <a
                              href={opportunity.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`View opportunity: ${opportunity.text}`}
                            >
                              {opportunity.text}
                            </a>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {description && (
        <section className="description-sec">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="description-box">
                  <div className="description-text">
                    {description.description_title && (
                      <h2 dangerouslySetInnerHTML={{ __html: description.description_title }}></h2>
                    )}
                    {description.description_content && (
                      <div dangerouslySetInnerHTML={{ __html: description.description_content }}></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {faqs && faqs.length > 0 && (
        <section className="faqSection">
          <div className="container">
            <Faq data={faqs} heading={"FREQUENTLY ASKED QUESTIONS"} />
          </div>
        </section>
      )}
    </main>
  );
}