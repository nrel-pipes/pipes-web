import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

import "./Banner.css"


const SiteBanner = () => {
  return (
    <Container className="banner">
      <Row>
        <Col className="banner-pipes-name" md={9} sm={8} xs={8}>
          PIPES
          {/* <Image className="banner-pipes-image" src="./images/pipes-banner-2.png" alt="PIPES" fluid /> */}
        </Col>
        <Col className="banner-nrel-container" md={3} sm={4} xs={4}>
          <Image className="banner-nrel-image" src="./images/nrel-logo@2x-01.png" alt="NREL" fluid />
        </Col>
      </Row>
    </Container>
  );
};

export default SiteBanner;
