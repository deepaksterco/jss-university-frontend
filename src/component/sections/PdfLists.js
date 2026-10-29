import React from "react";
import Image from "next/image";
import Link from "next/link";

// Sort pdfs by display_order (ascending, numeric). Items without a valid
// display_order go to the end and keep their original relative order.
const getSortedPdfs = (pdfs) => {
  if (!Array.isArray(pdfs)) return [];

  return [...pdfs].sort((a, b) => {
    const orderA = parseInt(a?.display_order, 10);
    const orderB = parseInt(b?.display_order, 10);

    const aValid = !Number.isNaN(orderA);
    const bValid = !Number.isNaN(orderB);

    if (aValid && bValid) return orderA - orderB;
    if (aValid) return -1;
    if (bValid) return 1;
    return 0;
  });
};

export default function PdfLists({ data }) {
  const renderSection = (section, sectionIndex) => {
    switch (section.type) {
      case "pdf_lists":
        return (
          <div
            key={sectionIndex}
            className="pdfs_row"
            data-aos="fade-up"
            data-aos-duration="900"
            data-aos-once="true"
          >
            {section?.items?.map((item, idx) => (
              <React.Fragment key={idx}>
                {item?.mainTitle && (
                  <h3
                    className="mainTitle"
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay={Math.min(idx * 100, 500)}
                    data-aos-once="true"
                  >
                    {item.mainTitle}
                  </h3>
                )}

                <ul>
                  {getSortedPdfs(item?.pdfs).map((singlePdf, pdfIdx) => {
                    const fileUrl =
                      singlePdf?.pdf ||
                      singlePdf?.url ||
                      singlePdf?.link ||
                      singlePdf?.pdf_url ||
                      "";

                    const isPdf = fileUrl.toLowerCase().includes(".pdf");

                    if (!singlePdf?.pdf && !singlePdf?.pdf_url) {
                      return (
                        <li
                          key={pdfIdx}
                          data-aos="fade-up"
                          data-aos-duration="800"
                          data-aos-delay={Math.min(pdfIdx * 100, 500)}
                          data-aos-once="true"
                        >
                          <p>{singlePdf?.pdf_type}</p>
                        </li>
                      );
                    } else {
                      return (
                        <li
                          key={pdfIdx}
                          data-aos="fade-up"
                          data-aos-duration="800"
                          data-aos-delay={Math.min(pdfIdx * 100, 500)}
                          data-aos-once="true"
                        >
                          <Link
                            href={fileUrl}
                            target={
                              singlePdf?.pdf || singlePdf?.pdf_url
                                ? "_blank"
                                : "_self"
                            }
                            rel="noopener noreferrer"
                          >
                            <p>{singlePdf?.pdf_type}</p>

                            {singlePdf?.pdf && (
                              <Image
                                src={
                                  isPdf
                                    ? "/images/icons/pdf.png"
                                    : "/images/icons/link.png"
                                }
                                width={20}
                                height={20}
                                loading="lazy"
                                alt={isPdf ? "pdf" : "link"}
                              />
                            )}
                          </Link>
                        </li>
                      );
                    }
                  })}
                </ul>
              </React.Fragment>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="pdf_list_section">
      <div className="container">
        {data?.length > 0 ? (
          data.map((section, index) => renderSection(section, index))
        ) : (
          <div className="abt_cntnt" data-aos="fade-up">
            <p>There is no data!</p>
          </div>
        )}
      </div>
    </section>
  );
}