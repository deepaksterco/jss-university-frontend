"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { RxCaretRight } from "react-icons/rx";
import { RiCloseLargeFill } from "react-icons/ri";
import "@/styles/style.css";
import "@/styles/custom.style.css";
import Link from "next/link";
import { ASSETS_URL, BASE_URL } from "@/config/config.mjs";

// Convert any YouTube link (watch, youtu.be, shorts, embed, live) to an embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    let id = null;

    if (host === "youtu.be") {
      id = u.pathname.slice(1);
    } else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      if (u.pathname === "/watch") {
        id = u.searchParams.get("v");
      } else {
        const match = u.pathname.match(/^\/(embed|shorts|live|v)\/([^/?]+)/);
        if (match) id = match[2];
      }
    }
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&loop=1` : null;
  } catch {
    return null;
  }
};

// Decide what to render: mp4 first, then video_url, otherwise null
const getVideoSource = (data) => {
  if (!data) return null;

  if (data.video) {
    const src = data.video.startsWith("http")
      ? data.video
      : `${ASSETS_URL}${data.video}`;
    return { type: "mp4", src };
  }

  if (data.video_url) {
    return {
      type: "iframe",
      src: getYouTubeEmbedUrl(data.video_url) || data.video_url, // fallback: use as-is
    };
  }

  return null;
};

export default function TestimonialClient() {
  const [testimonialData, setTestimonialData] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [typesList, setTypesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalAnimate, setModalAnimate] = useState(false);

  const allData = useRef([]);

  // Build unique types list from items
  const accumulateTypes = (items) => {
    const seen = new Map();
    items.forEach((item) => {
      if (item.type && !seen.has(item.type)) {
        seen.set(item.type, { type: item.type });
      }
    });
    setTypesList(Array.from(seen.values()));
  };

  // Fetch all testimonials once
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}testimonials`);
      if (!res.ok) throw new Error(`Testimonials API error: ${res.status}`);
      const data = await res.json();

      const items = Array.isArray(data.data) ? data.data : [];
      allData.current = items;
      accumulateTypes(items);
      setTestimonialData(items);
    } catch (err) {
      console.error("Testimonial fetch error:", err);
      setTestimonialData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Client-side filter whenever selectedType changes
  useEffect(() => {
    if (!selectedType) {
      setTestimonialData(allData.current);
    } else {
      setTestimonialData(
        allData.current.filter((item) => item.type === selectedType),
      );
    }
  }, [selectedType]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const openModal = async (item) => {
    console.log("clicked item:", item);
    setModalOpen(true);
    setModalData(null);
    setModalLoading(true);
    setModalAnimate(false);
    try {
      const res = await fetch(`${BASE_URL}testimonials/${item.slug}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Detail API error: ${res.status}`);
      const json = await res.json();
      const detail = json.data || json;
  
      // Start with the list item, let the detail override only real values
      const merged = { ...item };
      Object.keys(detail).forEach((key) => {
        if (detail[key] !== null && detail[key] !== undefined && detail[key] !== "") {
          merged[key] = detail[key];
        }
      });
      setModalData(merged);
    } catch (err) {
      console.error("Modal fetch error:", err);
      setModalData(item); // fall back to the list data instead of an error message
    } finally {
      setModalLoading(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setModalAnimate(true));
      });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  const videoSource = getVideoSource(modalData);
  console.log("modalData:", modalData, "videoSource:", videoSource);

  return (
    <main className="site_main">
      {/* Title Section */}
      <section className="inner-title">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="innnr_head">
                <h1>Testimonials</h1>
                <h2>
                  Discover Student Journeys of <span>Success</span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs — only shown when there are multiple types */}
      {typesList.length > 1 && (
        <section className="testimonial-filter">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="filter-tabs">
                  <button
                    className={`filter-tab ${selectedType === "" ? "active" : ""}`}
                    onClick={() => setSelectedType("")}
                  >
                    All
                  </button>
                  {typesList.map((t) => (
                    <button
                      key={t.type}
                      className={`filter-tab ${selectedType === t.type ? "active" : ""}`}
                      onClick={() => setSelectedType(t.type)}
                    >
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonial List */}
      <section className="testimonial_list_section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              {loading ? (
                <div className="text-center py-5">
                  <p>Loading Testimonials...</p>
                </div>
              ) : testimonialData.length === 0 ? (
                <div className="text-center py-5">
                  <p>No Testimonials found.</p>
                </div>
              ) : (
                <div className="program-list-boxs faulty-list">
                  {testimonialData.map((item) => (
                    <div
                      className="faulty-list-box"
                      key={item.id}
                      onClick={() => openModal(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="faulty-img">
                        <figure>
                          <Image
                            src={
                              item.image?.startsWith("http")
                                ? item.image
                                : `${ASSETS_URL}${item.image}`
                            }
                            alt={item.alt_text || item.name || 'faculty'}
                            className="img-fluid w-100"
                            width={300}
                            height={300}
                            style={{ objectFit: "cover" }}
                          />
                        </figure>
                      </div>
                      <div className="faulty-text">
                        {item?.name && <h4>{item.name}</h4>}
                        {/* {item.designation && <p>{item.designation}</p>} */}
                        {/* {item.company && (
                          <p className="testimonial-company">{item.company}</p>
                        )} */}
                        {(item.course || item.batch) && (
                          <p className="testimonial-course">
                            {[item.course, item.batch]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                        <span>
                          <RxCaretRight className="right-arrow" />
                        </span>
                      </div>
                      {/* <Link
                        href={`/testimonials/${item.slug}`}
                        className="streched_link"
                      /> */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {/* Modal */}
      {modalOpen && (
        <>
          {/* Full page loader — shows while data is fetching */}
          {modalLoading && (
            <div className="modal-page-loader">
              <div className="loader-spinner" />
            </div>
          )}

          {/* Modal — only mounts once data is ready */}
          {!modalLoading && (
            <div
              className={`testimonial-modal-overlay ${modalAnimate ? "overlay-visible" : ""}`}
              onClick={closeModal}
            >
               <div
                  className={`testimonial-modal ${videoSource ? "testimonial-modal--video" : ""} ${modalAnimate ? "modal-visible" : ""}`}
                  onClick={(e) => e.stopPropagation()}
                >
                <button
                  className="testimonial-modal-close"
                  onClick={closeModal}
                >
                  <RiCloseLargeFill size={19} />
                </button>

                {!modalData ? (
                    <div className="modal-loading">
                      <p>Something went wrong. Please try again.</p>
                    </div>
                  ) : videoSource ? (
                    /* VIDEO MODE: no image, no content */
                    <div className="modal-video-wrap">
                      {videoSource.type === "mp4" ? (
                        <video
                          className="modal-video"
                          src={videoSource.src}
                          muted
                          controls
                          autoPlay
                          loop
                          playsInline
                        />
                      ) : (
                        <iframe
                          className="modal-video"
                          src={videoSource.src}
                          title={modalData.name || "Testimonial video"}
                          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                          allowFullScreen
                        />
                      )}
                    </div>
                  ) : (
                  <div className="modal-inner">
                    <div className="modal-left">
                      <Image
                        src={
                          modalData.image?.startsWith("http")
                            ? modalData.image
                            : `${ASSETS_URL}${modalData.image}`
                        }
                        alt={modalData.alt_text || modalData.name}
                        width={300}
                        height={350}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                    <div className="modal-right">
                      <div className="right_content">
                        {modalData.title && (
                          <h3 className="modal_title">{modalData.title}</h3>
                        )}
                        {/* {modalData.short_description && (
                          <p className="modal_short_description">{modalData.short_description}</p>
                        )} */}
                        {modalData.description && (
                          <p className="modal_description">{modalData.description}</p>
                        )}
                        {modalData.name && (
                          <h3 className="modal_name">{modalData.name}</h3>
                        )}
                        {modalData.designation && (
                          <p className="modal-designation">
                            {modalData.designation}
                          </p>
                        )}
                        {modalData.company && (
                          <p className="modal-company">{modalData.company}</p>
                        )}
                        {(modalData.course || modalData.batch) && (
                          <p className="modal-course">
                            {[modalData.course, modalData.batch]
                              .filter(Boolean)
                              .join(" ")}
                          </p>
                        )}
                        {modalData.message && (
                          <div className="modal-message">
                            <p>{modalData.message}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
