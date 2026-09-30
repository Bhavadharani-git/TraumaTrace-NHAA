import { useState } from "react";
import "./App.css";
import PortalPage from "./components/PortalPage";
import ProfessionalApp from "./ProfessionalApp";
import AdminApp from "./AdminApp";
import FloatingChatbot from "./components/FloatingChatbot";
function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    phone: (
      <>
        <path d="M7.8 3.7 5.9 4.4a2 2 0 0 0-1.2 2.5c1.8 6.1 5.7 10 11.8 11.8a2 2 0 0 0 2.5-1.2l.7-1.9a2 2 0 0 0-1.1-2.6l-2.2-.9a2 2 0 0 0-2.4.6l-.9 1.1a14.4 14.4 0 0 1-4.8-4.8l1.1-.9a2 2 0 0 0 .6-2.4l-.9-2.2a2 2 0 0 0-2.6-1.1Z" />
      </>
    ),

    shield: (
      <>
        <path d="M12 3 19 6v5c0 4.8-2.9 8.7-7 10-4.1-1.3-7-5.2-7-10V6l7-3Z" />
        <path d="m9.5 12 1.7 1.7 3.7-4" />
      </>
    ),

    user: (
      <>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5.5 19.2c.7-3.2 3.1-4.9 6.5-4.9s5.8 1.7 6.5 4.9" />
      </>
    ),

    briefcase: (
      <>
        <rect x="3.5" y="7.5" width="17" height="11" rx="2" />
        <path d="M8.5 7.5v-1.2A1.8 1.8 0 0 1 10.3 4.5h3.4a1.8 1.8 0 0 1 1.8 1.8v1.2" />
        <path d="M3.8 11.5h16.4" />
        <path d="M10 12.3h4" />
      </>
    ),

    building: (
      <>
        <path d="M5 20V5.5h9V20" />
        <path d="M14 10h5v10" />
        <path d="M8 8h2M8 11h2M8 14h2M8 17h2M16 13h1M16 16h1" />
        <path d="M3.5 20h17" />
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h13" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),

    info: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 10.5v5" />
        <path d="M12 7.4h.01" />
      </>
    ),

    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] ?? paths.info}</svg>;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("landing");

  /*
   * When Citizen Support is selected,
   * render the existing Victim Portal inside
   * this same React/Capacitor application.
   */
  if (currentPage === "citizen") {
    return <PortalPage />;
  }
  if (currentPage === "professional") {
  return <ProfessionalApp />;
}
if (currentPage === "admin") {
  return <AdminApp />;
}

  return (
  <>
    <div className="nhaa-app">

      {/* HEADER */}

      <header className="site-header">
        <div className="header-left">
          <img
            src="/nhaa_logo.png"
            alt="NHAA 14566"
            className="header-nhaa-logo"
          />

          <div className="header-title">
            <h1>NHAA 14566</h1>
            <p>National Atrocity Helpline</p>
          </div>
        </div>

        <div className="header-right">
          <img
            src="/ministry_logo.png"
            alt="Ministry of Social Justice and Empowerment"
            className="header-ministry-logo"
          />
        </div>
      </header>

      {/* HERO */}

      <main>

        <section
          className="nhaa-hero"
          aria-labelledby="page-title"
        >
          <div className="nhaa-hero-inner">

            <div className="nhaa-hero-badge">
              <span className="nhaa-status-dot" />
              24×7 National Support
            </div>

            <p className="nhaa-eyebrow">
              National Helpline Against Atrocities
            </p>

            <h1 id="page-title">
              Support begins with <span>14566.</span>
            </h1>

            <p className="nhaa-hero-copy">
              A single national helpline for assistance, guidance,
              complaint support and coordinated follow-up for people
              seeking help.
            </p>

            <div className="nhaa-hero-actions">

              <a
                className="nhaa-primary-button"
                href="tel:14566"
              >
                <Icon name="phone" size={19} />
                Call 14566
              </a>

              <button
                className="nhaa-secondary-button"
                type="button"
                onClick={() =>
                  document
                    .getElementById("nhaa-access")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                }
              >
                Access support
                <Icon name="arrow" size={18} />
              </button>

            </div>

            <div className="nhaa-hero-note">
              <Icon name="lock" size={16} />
              Confidential support • multilingual assistance • coordinated services
            </div>

          </div>
        </section>

        {/* ACCESS SECTION */}

        <section
          className="nhaa-access-section"
          id="nhaa-access"
        >
          <div className="nhaa-section-inner">

            <div className="nhaa-section-heading">

              <div>
                <p className="nhaa-section-kicker">
                  NHAA 14566
                </p>

                <h2>
                  Choose how you need to access the service
                </h2>
              </div>

              <p>
                Each option opens the established NHAA access flow
                while the existing authentication and support logic
                remains in place.
              </p>

            </div>

            <div className="nhaa-access-grid">

              {/* CITIZEN */}

              <button
                type="button"
                className="nhaa-access-card"
                onClick={() => setCurrentPage("citizen")}
              >

                <span className="nhaa-card-icon">
                  <Icon name="user" size={23} />
                </span>

                <span className="nhaa-card-body">

                  <span className="nhaa-card-title">
                    Citizen Support
                  </span>

                  <span className="nhaa-card-copy">
                    Get help, register a complaint, or access
                    anonymous case support.
                  </span>

                </span>

                <span className="nhaa-card-arrow">
                  <Icon name="arrow" size={18} />
                </span>

              </button>

              {/* PROFESSIONAL */}

              <button
                type="button"
                className="nhaa-access-card"
                onClick={() => setCurrentPage("professional")}
              >

                <span className="nhaa-card-icon">
                  <Icon name="briefcase" size={23} />
                </span>

                <span className="nhaa-card-body">

                  <span className="nhaa-card-title">
                    Professional Support
                  </span>

                  <span className="nhaa-card-copy">
                    For counselors and authorized professionals
                    handling NHAA cases.
                  </span>

                </span>

                <span className="nhaa-card-arrow">
                  <Icon name="arrow" size={18} />
                </span>

              </button>

              {/* ADMIN */}

              <button
                type="button"
                className="nhaa-access-card"
                onClick={() => setCurrentPage("admin")}
              >

                <span className="nhaa-card-icon">
                  <Icon name="building" size={23} />
                </span>

                <span className="nhaa-card-body">

                  <span className="nhaa-card-title">
                    State &amp; Nodal Officers
                  </span>

                  <span className="nhaa-card-copy">
                    Secure access for authorized state, district
                    and nodal operations.
                  </span>

                </span>

                <span className="nhaa-card-arrow">
                  <Icon name="arrow" size={18} />
                </span>

              </button>

            </div>
          </div>
        </section>

        {/* TRUST */}

        <section className="nhaa-trust-section">

          <div className="nhaa-trust-inner">

            <div className="nhaa-trust-icon">
              <Icon name="shield" size={26} />
            </div>

            <div>

              <h2>
                One service, coordinated support
              </h2>

              <p>
                NHAA brings citizen support, professional handling
                and officer coordination into one service environment
                built around the 14566 helpline.
              </p>

            </div>

            <a
              href="tel:14566"
              className="nhaa-trust-link"
            >
              Call 14566
              <Icon name="arrow" size={17} />
            </a>

          </div>

        </section>

      </main>

      {/* FOOTER */}

      <footer className="nhaa-footer">

        <div className="nhaa-footer-inner">

          <div>
            <strong>NHAA 14566</strong>
            <span>
              National Helpline Against Atrocities
            </span>
          </div>

          <div className="nhaa-footer-contact">

            <span>
              Toll-free helpline
            </span>

            <a href="tel:14566">
              14566
            </a>

          </div>

          <div className="nhaa-footer-ministry">

            Ministry of Social Justice and Empowerment
            <br />

            Government of India

          </div>

        </div>

        <div className="nhaa-footer-bottom">

          <span>
            © 2025 NHAA 14566. All rights reserved.
          </span>

          <span>
            Accessible • Responsive • Mobile ready
          </span>

        </div>

      </footer>

    </div>

    <FloatingChatbot />
  </>
  );
}