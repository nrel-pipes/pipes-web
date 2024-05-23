import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import useAuthStore from './stores/authStore';


const CognitoTokens = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const accessToken = useAuthStore((state) => state.accessToken);
  const idToken = useAuthStore((state) => state.idToken);

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
    if (!isLoggedIn) {
      navigate('/login');
    }

    const currentExportUnixTokens = "export PIPES_ACCESS_TOKEN=" + accessToken + "\n\nexport PIPES_ID_TOKEN=" + idToken;
    setExportUnixTokens(currentExportUnixTokens);

    const currentExportWinTokens = "SET PIPES_ACCESS_TOKEN=" + accessToken + "\n\nSET PIPES_ID_TOKEN=" + idToken;
    setExportWinTokens(currentExportWinTokens);

  }, [isLoggedIn, navigate, accessToken, idToken]);

  return (
    <Container>
        <Row>
          <Col className='mx-auto mt-5'>
            <h3 style={{"paddingTop": "30px", "paddingBottom": "30px"}}>Run the Following Commands in Terminal</h3>
            <Tabs defaultActiveKey="linuxmacos" id="envtokens" className="justify-content-center">
              <Tab eventKey="linuxmacos" title="Linux/MacOS">
                <InputGroup className="mb-3">
                  <FormControl
                    as="textarea"
                    readOnly
                    rows={10}
                    value={exportUnixTokens}
                    aria-label="export-tokens"
                    aria-describedby="basic-addon2"
                    style={{fontSize: "9pt", minHeight: "460px"}}
                  />
                  <Button
                    variant="outline-info"
                    id="button-addon2"
                    style={{width: "120px"}}
                    onClick={copyToClipboard1}
                  >
                    {tokenCopied ? 'Copied!' : 'Copy'}
                  </Button>
                </InputGroup>
              </Tab>
              <Tab eventKey="windows" title="Windows">
                <InputGroup className="mb-3">
                  <FormControl
                    as="textarea"
                    readOnly
                    rows={10}
                    value={exportWinTokens}
                    aria-label="export-tokens"
                    aria-describedby="basic-addon2"
                    style={{fontSize: "9pt", minHeight: "460px"}}
                  />
                  <Button
                    variant="outline-info"
                    id="button-addon2"
                    style={{width: "120px"}}
                    onClick={copyToClipboard2}
                  >
                    {tokenCopied ? 'Copied!' : 'Copy'}
                  </Button>
                </InputGroup>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
  );
}


export default CognitoTokens;
