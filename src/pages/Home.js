
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SplashPage from "../components/SplashPage"
import Features from "../components/Features"

import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import Image from "react-bootstrap/Image";
// import Card from 'react-bootstrap/Card';

import "./PageStyles.css"

const Home = () => {

  return (
    <Container>
      <SplashPage/>
      <Features/>
    </Container>

  );
};


export default Home;
