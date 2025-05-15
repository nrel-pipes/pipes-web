import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

import "./styles/Banner.css";

const SiteBanner = () => {
  return (
    <Container className="banner">
      <Row>
        <Col className="banner-pipes-name" md={9} sm={8} xs={8}>
          <a href="/">
            <Image
              className="rounded"
              src="/images/NREL-PIPES-Logo-FullColor.png"
              alt="PIPES"
              style={{ width: "28%" }}
              fluid
            />
          </a>
        </Col>
        <Col className="banner-nrel-container" md={3} sm={4} xs={4}>
          <Image
            className="banner-nrel-image"
            src="/images/nrel-logo@2x-01.png"
            alt="NREL"
            fluid
          />
        </Col>
      </Row>
    </Container>
  );
};

export default SiteBanner;
