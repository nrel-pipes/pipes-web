import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import "../PageStyles.css";

import NavbarSub from '../../layouts/NavbarSub';
import useAuthStore from '../../stores/AuthStore';

const TokensPage = () => {
  const navigate = useNavigate();
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const getIdToken = useAuthStore((state) => state.getIdToken);

  const [exportUnixTokens, setExportUnixTokens] = useState("");
  const [exportWinTokens, setExportWinTokens] = useState("");
  const [tokenCopied, setTokenCopied] = useState(false);

  const copyToClipboard1 = async () => {
    try {
      await navigator.clipboard.writeText(exportUnixTokens);
      setTokenCopied(true);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const copyToClipboard2 = async () => {
    try {
      await navigator.clipboard.writeText(exportWinTokens);
      setTokenCopied(true);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  useEffect(() => {
    const setupTokens = async () => {
      try {
        // Check if user is authenticated
        const isAuthenticated = await checkAuthStatus();

        if (!isAuthenticated) {
          navigate('/login');
          return;
        }

        // Get tokens from the updated auth store
        const accessToken = await getAccessToken();
        const idToken = await getIdToken();

        // Update the token display strings
        const currentExportUnixTokens = "export PIPES_ACCESS_TOKEN=" + accessToken + "\n\nexport PIPES_ID_TOKEN=" + idToken;
        setExportUnixTokens(currentExportUnixTokens);

        const currentExportWinTokens = "SET PIPES_ACCESS_TOKEN=" + accessToken + "\n\nSET PIPES_ID_TOKEN=" + idToken;
        setExportWinTokens(currentExportWinTokens);
      } catch (error) {
        console.error('Error setting up tokens:', error);
        navigate('/login');
      }
    };

    setupTokens();
  }, [navigate, checkAuthStatus, getAccessToken, getIdToken]);

  return (
    <>
    <NavbarSub />
    <Container className="mainContent" fluid style={{ padding: '0 20px' }}>
      <Row>
        <Col className='mx-auto mt-5'>
          <h3 className="fw-light" style={{"paddingTop": "30px", "paddingBottom": "30px"}}>Run the Following Commands in Terminal</h3>
          <Tabs defaultActiveKey="linuxmacos" id="envtokens" className="justify-content-center">
            <Tab eventKey="linuxmacos" title="Linux/MacOS">
              <div className="mb-3">
                <FormControl
                  as="textarea"
                  readOnly
                  rows={10}
                  value={exportUnixTokens}
                  aria-label="export-tokens"
                  style={{fontSize: "9pt", minHeight: "460px", width: "100%", marginBottom: "10px"}}
                />
                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    onClick={copyToClipboard1}
                    style={{
                      backgroundColor: "#0079c2",
                      borderColor: "#0079c2",
                      color: "white",
                      width: "160px",
                      padding: "8px",
                      fontSize: "16px"
                    }}
                  >
                    {tokenCopied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            </Tab>
            <Tab eventKey="windows" title="Windows">
              <div className="mb-3">
                <FormControl
                  as="textarea"
                  readOnly
                  rows={10}
                  value={exportWinTokens}
                  aria-label="export-tokens"
                  style={{fontSize: "9pt", minHeight: "460px", width: "100%", marginBottom: "10px"}}
                />
                <div className="d-flex justify-content-center">
                  <Button
                    variant="primary"
                    onClick={copyToClipboard2}
                    style={{
                      backgroundColor: "#0079c2",
                      borderColor: "#0079c2",
                      color: "white",
                      width: "160px", // Increased width
                      padding: "8px", // Added padding
                      fontSize: "16px" // Increased font size
                    }}
                  >
                    {tokenCopied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
    </>
  );
}

export default TokensPage;
