"use client";

import { useState } from "react";

export default function OverviewText({ overview, name }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="overview-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="over-view-box">
              <div className="overview-text">
                <h5>Overview</h5>
                <h6>{overview?.overview_title || name}</h6>
                <p
                  className={expanded ? "expanded_text" : ""}
                  dangerouslySetInnerHTML={{ __html: overview?.overview_desc || "" }}
                />
                {overview?.overview_desc && overview.overview_desc.split(" ").length > 1 && (
                  <button className="btn read_more" onClick={() => setExpanded(!expanded)}>
                    {expanded ? "Show Less" : "Show More"}
                    <i className={`ms-2 ${expanded ? "expanded_icon" : "expanded_icon_bottom"}`}></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}