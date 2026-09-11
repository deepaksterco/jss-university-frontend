"use client";

import { useState } from "react";
import Image from "next/image";

export default function CurriculumCarousel({ curriculum, extraSpace }) {
  const [index, setIndex] = useState(0);
  const desc = curriculum?.curriculum_desc || [];

  const handlePrev = () => setIndex((i) => (i - 1 + desc.length) % desc.length);
  const handleNext = () => setIndex((i) => (i + 1) % desc.length);

  return (
    <section className={`core-sec ${extraSpace ? "extra_space" : ""}`}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="core-box">
              <div className="core-text">
                <span>Curriculum </span>
                <h6 className="d-block mb-5">{curriculum?.curriculum_title}</h6>
                <blockquote>Core Subjects:</blockquote>
                <p>{desc[index]}</p>
                {desc.length > 1 && (
                  <div className="arrows">
                    <button
                      className="arrow-btn left"
                      onClick={handlePrev}
                      title="Previous curriculum"
                      disabled={index === 0}
                      style={{ opacity: index === 0 ? 0.5 : 1, cursor: index === 0 ? "not-allowed" : "pointer" }}
                    >
                      <Image src="/images/icons/Arrow.svg" width={22} height={22} alt="Left Arrow" />
                    </button>
                    <button
                      className="arrow-btn right"
                      onClick={handleNext}
                      title="Next curriculum"
                      disabled={index === desc.length - 1}
                      style={{
                        opacity: index === desc.length - 1 ? 0.5 : 1,
                        cursor: index === desc.length - 1 ? "not-allowed" : "pointer",
                      }}
                    >
                      <Image src="/images/icons/Arrow.svg" width={22} height={22} alt="Right Arrow" />
                    </button>
                  </div>
                )}
                {curriculum?.curriculum_pdf && (
                  <div className="core-pdf">
                    <a href={curriculum.curriculum_pdf} target="_blank" rel="noopener noreferrer">
                      <Image src="/images/custom-page/red-pdf-icon.png" alt="PDF" width={20} height={20} className="img-fluid" />
                      Download
                    </a>
                  </div>
                )}
              </div>
              <div className="core-img">
                <figure>
                  {curriculum?.curriculum_image && (
                    <Image
                      src={curriculum.curriculum_image}
                      alt="Curriculum"
                      width={500}
                      height={300}
                      className="img-fluid w-100"
                    />
                  )}
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}