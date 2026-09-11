"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./page.module.css";
import "@/styles/style.css";
import ProgramBox from "@/component/programBox/ProgramBox";
import { BASE_URL } from "@/config/config.mjs";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

export default function ProgramFilters({
  schoolData,
  activeProgram,
  activeSchoolId,
  activeDepartmentId,
  searchProgram,
  initialProgramListingData,
  currentQuery,
}) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();

  const [searchValue, setSearchValue] = useState(searchProgram || "");
  const [programListingData, setProgramListingData] = useState(initialProgramListingData || {});
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const timeoutRef = useRef(null);

  const updateQuery = (updates) => {
    const params = new URLSearchParams(currentQuery);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") params.delete(key);
      else params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSchoolToggle = (schoolId) => {
    updateQuery({ school_id: schoolId, department_id: null });
  };

  const handleDepartmentToggle = (departmentId) => {
    updateQuery({ department_id: departmentId });
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => updateQuery({ search: value }), 400);
  };

  const handleLoadMore = async () => {
    if (!programListingData?.total || !programListingData?.per_page) return;
    const totalPages = Math.ceil(programListingData.total / programListingData.per_page);
    const nextPage = page + 1;
    if (nextPage > totalPages) return;

    setLoadingMore(true);
    const query = [];
    if (activeSchoolId) query.push(`school_id=${encodeURIComponent(activeSchoolId)}`);
    if (activeDepartmentId) query.push(`department_id=${encodeURIComponent(activeDepartmentId)}`);
    if (searchProgram) query.push(`search=${encodeURIComponent(searchProgram)}`);
    query.push(`page=${nextPage}`);

    try {
      const res = await fetch(`${BASE_URL}programs/${activeProgram}?${query.join("&")}`);
      const data = await res.json();
      setProgramListingData((prev) => ({
        ...data.data,
        data: [...(prev.data || []), ...(data.data.data || [])],
      }));
      setPage(nextPage);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredDepartments = activeSchoolId
    ? schoolData.find((s) => s.id === activeSchoolId)?.departments || []
    : [];
  const programs = programListingData?.data;
  const hasMorePages =
    programListingData?.total && programListingData?.per_page
      ? page < Math.ceil(programListingData.total / programListingData.per_page)
      : false;

  return (
    <>
      <section className={styles.programSearch}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Search Programmes"
                  name="search"
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button type="button" aria-label="Search programmes">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.programSec1}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className={styles.programList}>
                <div className={styles.programCategory}>
                  <div className={styles.programCategoryBox}>
                    <p>Browse by Schools</p>
                    {isMobile ? (
                      <select
                        value={activeSchoolId ?? ""}
                        className="programs_select_dropdown"
                        onChange={(e) => handleSchoolToggle(e.target.value === "" ? null : Number(e.target.value))}
                      >
                        <option value="" disabled>--Select--</option>
                        {schoolData.map((school, idx) => (
                          <option key={idx} value={school.id}>{school.name}</option>
                        ))}
                      </select>
                    ) : (
                      schoolData.map((school) => (
                        <div key={school.id} className={`form-check ${styles.formCheck}`}>
                          <input
                            className="check-box"
                            type="radio"
                            name="school"
                            checked={activeSchoolId == school.id}
                            onChange={() => handleSchoolToggle(school.id)}
                            id={`school-${school.id}`}
                          />
                          <label className="form-check-label" htmlFor={`school-${school.id}`}>{school.name}</label>
                        </div>
                      ))
                    )}
                  </div>

                  <div className={styles.programCategoryBox}>
                    <p>Filter by Departments</p>
                    {isMobile ? (
                      <select
                        value={activeDepartmentId ?? ""}
                        className="programs_select_dropdown"
                        disabled={!activeSchoolId}
                        onChange={(e) => handleDepartmentToggle(e.target.value === "" ? null : Number(e.target.value))}
                      >
                        <option value="" disabled>--Select--</option>
                        {filteredDepartments.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    ) : !activeSchoolId ? (
                      <div className="select-school-msg">Please select a school first</div>
                    ) : filteredDepartments.length > 0 ? (
                      filteredDepartments.map((d) => (
                        <div key={d.id} className={`form-check ${styles.formCheck}`}>
                          <input
                            className="check-box"
                            type="radio"
                            name="department"
                            checked={activeDepartmentId == d.id}
                            onChange={() => handleDepartmentToggle(d.id)}
                            id={`department-${d.id}`}
                          />
                          <label className="form-check-label" htmlFor={`department-${d.id}`}>{d.name}</label>
                        </div>
                      ))
                    ) : (
                      <div>No departments available</div>
                    )}
                  </div>
                </div>

                <div className={styles.programMainList}>
                  {programs && programs.length === 0 && <h6 className="text-center">No Programme available</h6>}

                  {programs && programs.length > 0 && (
                    <div className={styles.programListBoxs}>
                      {programs.map((program, index) => (
                        <ProgramBox key={index} data={program} />
                      ))}
                    </div>
                  )}

                  {programs && programs.length > 0 && hasMorePages && (
                    <div className={styles.loadMoreContainer}>
                      <a
                        id="loadMore"
                        onClick={loadingMore ? undefined : handleLoadMore}
                        style={{ opacity: loadingMore ? 0.6 : 1, pointerEvents: loadingMore ? "none" : "auto" }}
                      >
                        {loadingMore ? "Loading..." : (<>Load More <i className="bi bi-arrow-down"></i></>)}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}