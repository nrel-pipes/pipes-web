import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import "./styles/Footer.css";


function SiteFooter() {
  return (
    <footer className="mt-4 py-3 footer">
      <Container>
        <Row>
          <Col className="text-start">
            <div className="row text-start social-and-global-links">
              <div className="col-md-4 col-lg-5">
                <div>
                  <a href="https://www.nrel.gov/webmaster.html">Contact Us</a></div><div className="mt-2"><a href="http://www.nrel.gov/about/visiting-nrel.html">Visit</a>
                </div>
                <div className="mt-2">
                  <a href="http://www.nrel.gov/news/subscribe.html">Subscribe</a>
                </div>
                <div className="mt-3">
                  <ul className="social-links list-inline">
                    <li className="list-inline-item">
                      <a href="https://www.facebook.com/nationalrenewableenergylab" rel="noopener noreferrer" target="_blank" aria-label="Follow NREL on Facebook">
                        <img alt="Facebook" aria-hidden="true" className="social-svg" src="data:image/svg+xml,%3csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 320 512' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z'%3e%3c/path%3e%3c/svg%3e" />
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a href="https://www.instagram.com/nationalrenewableenergylab/" rel="noopener noreferrer" target="_blank" aria-label="Follow NREL on Instagram">
                        <img alt="Instagram" aria-hidden="true" className="social-svg" src="data:image/svg+xml,%3csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 448 512' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z'%3e%3c/path%3e%3c/svg%3e" />
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a href="https://www.linkedin.com/company/national-renewable-energy-laboratory" rel="noopener noreferrer" target="_blank" aria-label="Follow NREL on Linked In">
                        <img alt="LinkedIn" aria-hidden="true" className="social-svg" src="data:image/svg+xml,%3csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 448 512' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z'%3e%3c/path%3e%3c/svg%3e" />
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a href="https://www.youtube.com/user/NRELPR/" rel="noopener noreferrer" target="_blank" aria-label="Follow NREL on YouTube">
                        <img alt="Youtube" aria-hidden="true" className="social-svg" src="data:image/svg+xml,%3csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 576 512' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z'%3e%3c/path%3e%3c/svg%3e" />
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a href="https://twitter.com/nrel/" rel="noopener noreferrer" target="_blank" aria-label="Follow NREL on Twitter">
                        <img alt="Twitter" aria-hidden="true" className="social-svg" src="data:image/svg+xml,%3csvg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 512 512' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z'%3e%3c/path%3e%3c/svg%3e" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-md-8 col-lg-7 globalsecondary">
                <div className="row">
                  <div className="col-sm-6 col-lg-3">
                    <div className="mt-1">
                      <a href="http://www.nrel.gov/accessibility.html">Accessibility</a>
                    </div>
                    <div className="mt-1">
                      <a href="http://www.nrel.gov/disclaimer.html">Disclaimer</a>
                    </div>
                    <div className="mt-1">
                      <a href="http://www.nrel.gov/security.html">Security and Privacy</a>
                    </div>
                    <div className="mt-1">
                      <a href="http://www.nrel.gov/webmaster.html">Site Feedback</a>
                    </div>
                  </div>
                  <div className="col-sm-6 col-lg-3">
                    <div className="mt-1">
                      <a href="https://developer.nrel.gov/">Developers</a>
                    </div>
                    <div className="mt-1">
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
                    <img className="mr-5" src="data:image/png;base64,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" alt="Alliance for Sustainable Energy, LLC" />
                  </a>
                  <a href="https://www.energy.gov">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAcCAMAAACgTerKAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+nhxg7wAAAARnQU1BAACxjwv8YQUAAAABc1JHQgCuzhzpAAAAM1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACjBUbJAAAAEHRSTlMAIDCfYO8QQIC/349wUK/PG5tojgAAAq9JREFUSMfdlumW6yAIgHHfI+//tBdcoua0nfbvZeYkBAmfAdSCTkD/JD4EDU10CJfja0hAF89jZCZV2cRWSQMpyOGRIWlW2QcK+VuYT1Po/RZCYPIougn9ZYSP3mtApdBZg8RHRQPao9IOkUyOHtkDZfDOR54MFPTZJHb1ryBgsJZhQrAUwvCnoUroslGVIReSBzpwaBQypHmYyvEbAzz5pQBYZ1ZOiEzlQrlDqnOC56QhmkihURl2bBCFgSHNQyMuSARQgd9yOyRjMhdlVeJ1oWjloTRUY0e6HOcg+XiRWjAPiMbc0+Wh3SdEYlDkhAeCy+yzBU1veqI7/krSvGhXDaSAy2xjVZNGN+HbH3s0M09b97iCo7S3/k8RbhfKC0mv/9COcQn21o+UtNQVS5rdB4fucReqK4lpLqyFfrslUNGXXLO+3gyLsmCbHkefspSXELy+gyC21WDDMlRqoqZkHjAjxktIa8FvIO2bw+nRnw2lLjWLeAeJX0J4wvm0FFosLIl2KhY/05ZX4dfLO2QVvkFoM3CljsS2nBhtrW6amhMX110cP7MzZObBHpCtjYYZeu4D7QfsLvvu0aPa2JQ78R2ifJf1JTShHTLG/QaRV3dLY/osQeUWtKwG3LpsiN9KIF/VBJ410b3MtDvLlfLVC0Z8hoRvIHHEc1uPtSW+Ar6DmL0hP0GifAMZYSNskBq66NFT6gkZ4+GERDszo5+QXnu3Qx7dFax5QB7dVXW8szELf0L6I3yC3El828JjGnJ2klz9/w5yL8Z7dcQTsrbp2cJljo/FWGZTv4Xc4ibEvS48rnVyzZ3hjPALZMT4AOkJ432wnnvmDxBh/oCMhFHJ7U6p8gdIH/gEGf1ETWPvQ6veP7cOyHn82j+OX9dP1+6wH7SFd7a8nchy7jAk/wDYoFrv9+HJXgAAAABJRU5ErkJggg==" alt="U.S. Department of Energy" />
                  </a>
                </div>
                <div className="col-12 col-sm-7">
                  <p className="nrel-attr">The National Renewable Energy Laboratory is a national laboratory of the &nbsp;
                    <a href="https://www.energy.gov/">U.S. Department of Energy</a>,
                    <a href="https://www.energy.gov/eere/office-energy-efficiency-renewable-energy">Office of Energy Efficiency and Renewable Energy</a>, operated by the
                    <a href="https://www.allianceforsustainableenergy.org/">Alliance for Sustainable Energy LLC</a>.
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
