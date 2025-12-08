import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { FaInstagram, FaLinkedin, FaSquareFacebook, FaThreads, FaXTwitter, FaYoutube } from "react-icons/fa6";

import "./styles/Footer.css";


function SiteFooter() {
  return (
    <footer className="mt-4 py-3 footer">
      <Container>
        <Row>
          <Col className="text-start nlr-links">
            <div className="row text-start social-and-global-links">
              <div className="col-md-4 col-lg-5">
                <div className="mt-3">
                  <a href="https://www.nrel.gov/webmaster.html">Contact Us</a></div>
                  <div className="mt-3"><a href="http://www.nrel.gov/about/visiting-nrel.html">Visit</a>
                </div>
                <div className="mt-3">
                  <a href="http://www.nrel.gov/news/subscribe.html">Subscribe</a>
                </div>
                <div className="mt-3">
                  <ul className="social-links list-inline mt-4" aria-label="social links">
                    <li className="list-inline-item"><a href="https://www.facebook.com/nationalrenewableenergylab" aria-label="Follow NLR on Facebook" data-sf-ec-immutable=""><FaSquareFacebook /></a></li>
                    <li className="list-inline-item"><a href="https://www.instagram.com/nationalrenewableenergylab/" aria-label="Follow NLR on Instagram" data-sf-ec-immutable=""><FaInstagram /></a></li>
                    <li className="list-inline-item"><a href="https://www.linkedin.com/company/national-renewable-energy-laboratory" aria-label="Follow NLR on Linked In" data-sf-ec-immutable=""><FaLinkedin /></a></li>
                    <li className="list-inline-item"><a href="https://www.youtube.com/user/NRELPR/" aria-label="Follow NLR on YouTube" data-sf-ec-immutable=""><FaYoutube /></a></li>
                    <li className="list-inline-item"><a href="https://x.com/NatLabRockies" aria-label="Follow NLR on X" data-sf-ec-immutable=""><FaXTwitter /></a></li>
                    <li className="list-inline-item"><a href="https://www.threads.net/@nationalrenewableenergylab" aria-label="Follow NLR on Threads" data-sf-ec-immutable=""><FaThreads style={{ width: "15px", height: "15px" }} /></a></li>
                  </ul>
                </div>
              </div>

              <div className="col-md-8 col-lg-7 globalsecondary">
                <div className="row">
                  <div className="col-sm-6 col-lg-3">
                    <div className="mt-3">
                      <a href="http://www.nrel.gov/accessibility.html">Accessibility</a>
                    </div>
                    <div className="mt-3">
                      <a href="http://www.nrel.gov/disclaimer.html">Disclaimer</a>
                    </div>
                    <div className="mt-3">
                      <a href="http://www.nrel.gov/security.html">Security and Privacy</a>
                    </div>
                    <div className="mt-3">
                      <a href="http://www.nrel.gov/webmaster.html">Site Feedback</a>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-3">
                    <div className="mt-3">
                      <a href="https://developer.nrel.gov/">Developers</a>
                    </div>
                    <div className="mt-3">
                      <a href="https://thesource.nrel.gov/">Employees</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr />

            <div className="mt-4">
              <div className="row">
                <div className="col-sm-5">
                  <a href="https://www.allianceforsustainableenergy.org/">
                    <img src="/images/alliance-logo-black.svg" height="53" title="alliance-logo-black" className="mb-3" width="145" alt="Alliance for Sustainable Energy, LLC" />
                  </a>
                  <a href="https://www.energy.gov/">
                    <img src="/images/u-s-department-of-energy.svg" height="50" title="U.S. Department of Energy" width="203" alt="U.S. Department of Energy" className="ms-2" />
                  </a>
                </div>
                <div className="col-12 col-sm-7">
                  <p className="nlr-attr">
                    The National Laboratory of the Rockies is a national laboratory of the U.S. Department of Energy,
                    Office of Critical Minerals and Energy Innovation, operated under Contract No. DE-AC36-08GO28308.
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default SiteFooter;
