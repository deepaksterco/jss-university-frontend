"use client";

import { useState } from "react";
import Image from "next/image";
import { APPLY_NOW } from "@/config/config.mjs";

export default function TestimonialCarousel({ testimonials }) {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];
  const text = current?.short_description || "";
  const [firstWord, ...restWords] = text.split(" ");

  const handlePrev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const handleNext = () => setIndex((i) => (i + 1) % testimonials.length);

  return (
    <section className="program-testimonial">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="program-testimonial-box">
              <div className="testimonial-box">
                <div className="testimonial-text">
                  <span>Placement Testimonial</span>
                  <p>{current?.title}</p>
                </div>
                <div className="arrows">
                  <button className="arrow-btn left" onClick={handlePrev} title="Previous testimonial">
                    <Image src="/images/icons/Arrow.svg" width={22} height={22} alt="Left Arrow" />
                  </button>
                  <button className="arrow-btn right" onClick={handleNext} title="Next testimonial">
                    <Image src="/images/icons/Arrow.svg" width={22} height={22} alt="Right Arrow" />
                  </button>
                </div>
                <div className="across">
                  <h2>{firstWord}</h2>
                  <p>{restWords.join(" ")}</p>
                  <a href={APPLY_NOW} className="apply-btn1 CTA_Applynow" target="_blank" rel="noopener noreferrer">
                    Apply Now
                  </a>
                </div>
              </div>
              <div className="testimonial-img">
                <div className="testimonial-img-box">
                  <figure>
                    <Image
                      src={current?.image}
                      alt={current?.name}
                      width={400}
                      height={500}
                      className="img-fluid w-100"
                    />
                    <figcaption>
                      <div className="testimonial-img-text">
                        <h4>{current?.name}</h4>
                        <p>
                          {current?.course}
                          <span>.</span>
                          {current?.batch}
                        </p>
                        <blockquote>
                          {current?.designation} at {current?.company}
                        </blockquote>
                      </div>
                      <span className="streched_link" aria-hidden="true" />
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}