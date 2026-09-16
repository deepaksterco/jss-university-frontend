"use client";

import { useState, useEffect } from "react";
import { APPLY_NOW } from "@/config/config.mjs";

const MOBILE_BREAKPOINT = 768;

export default function EducationalTabs({ tabItems }) {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(tabItems[0]?.id ?? null);
  const [openAccordion, setOpenAccordion] = useState(tabItems[0]?.id ?? null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const renderTabContent = (tab) => (
    <div className="item-content">
      <div className="peo-list">
        {tab.data.map((item, index) => (
          <div key={index} className="peo-box">
            <h3>
              {tab.prefix}-{index + 1}
            </h3>
            <div className="content_heading">
              <span>{item.title && `${item.title} : `}</span>
              <p dangerouslySetInnerHTML={{ __html: item.description }} />
            </div>
          </div>
        ))}
      </div>
      <a href={APPLY_NOW} className="apply-btn1 CTA_Applynow" target="_blank" rel="noopener noreferrer">
        Apply Now
      </a>
    </div>
  );

  if (!isMobile) {
    return (
      <article className="tabbed-content">
        <nav className="tabs">
          <ul>
            {tabItems.map((tab) => (
              <li key={tab.id}>
                <a
                  href={`#${tab.id}`}
                  className={activeTab === tab.id ? "active" : ""}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab.id);
                  }}
                >
                  {tab.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {tabItems.map((tab) => (
          <div
            key={tab.id}
            id={tab.id}
            className={`item ${activeTab === tab.id ? "active" : ""}`}
            data-title={tab.label}
          >
            {renderTabContent(tab)}
          </div>
        ))}
      </article>
    );
  }

  return (
    <div>
      {tabItems.map((tab) => (
        <details
          key={tab.id}
          className="faqItem tabs_accordion"
          open={openAccordion === tab.id}
          onToggle={(e) => {
            if (e.target.open) setOpenAccordion(tab.id);
            else if (openAccordion === tab.id) setOpenAccordion(null);
          }}
        >
          <summary className="faqQuestion">
            <span className="faq_heading">{tab.label}</span>
            <span className="icon"></span>
          </summary>
          <div className="faqAnswer">{renderTabContent(tab)}</div>
        </details>
      ))}
    </div>
  );
}