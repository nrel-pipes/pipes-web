
import React, {useEffect, useState} from 'react';
import jwtDecode from 'jwt-decode';
import {Container, Row, Tabs, Tab, InputGroup, Button, FormControl, Alert} from 'react-bootstrap'
import { CognitoRefreshToken, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';

import { COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID } from '../components/CognitoConfig';
import Sidebar from "./Sidebar";
import ChangePasswordPage from './ChangePasswordPage';
import { minHeight } from '@mui/system';

// Cognito Configuration
const poolData = {
  UserPoolId: COGNITO_USER_POOL_ID,
  ClientId: COGNITO_CLIENT_ID
}

export const userPool = new CognitoUserPool(poolData);

const AccountPage = () => {
  const [idToken, setIdToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [exportUnixTokens, setExportUnixTokens] = useState("");
  const [exportWinTokens, setExportWinTokens] = useState("");
  const [userAttributes, setUserAttributes] = useState({});
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")

  const copyToClipboard1 = async () => {
    try {
      await navigator.clipboard.writeText(exportUnixTokens);
      setCopied(true);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const copyToClipboard2 = async () => {
    try {
      await navigator.clipboard.writeText(exportWinTokens);
      setCopied(true);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  useEffect(() =>{
    const idToken = localStorage.getItem("idToken");
    setIdToken(idToken);
    if (idToken) {
      const decodedIdToken = jwtDecode(idToken);
      setUserAttributes(decodedIdToken);
    }

    const currentAccessToken = localStorage.getItem("accessToken");
    setAccessToken(currentAccessToken);

    const currentExportUnixTokens = "export PIPES_ACCESS_TOKEN=" + currentAccessToken + "\n\nexport PIPES_ID_TOKEN=" + idToken;
    setExportUnixTokens(currentExportUnixTokens);

    const currentExportWinTokens = "SET PIPES_ACCESS_TOKEN=" + currentAccessToken + "\n\nSET PIPES_ID_TOKEN=" + idToken;
    setExportWinTokens(currentExportWinTokens);

    const currentRefreshToken = localStorage.getItem("refreshToken");
    setRefreshToken(currentRefreshToken);
  }, [idToken, accessToken, setRefreshToken]);

  // Personal information
  const username = userAttributes.email;

  // handle refresh
  const handleTokenRefresh = () => {
    const cognitoRefreshToken = new CognitoRefreshToken({
      RefreshToken: refreshToken,
    });
    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.refreshSession(cognitoRefreshToken, (error, session) => {
      if (error) {
        setErrorMessage(error);
        return;
      }

      // Access and ID tokens from refreshed session
      const newAccessToken = session.getAccessToken().getJwtToken();
      setAccessToken(newAccessToken);
      localStorage.setItem('accessToken', newAccessToken);

      const newIdToken = session.getIdToken().getJwtToken();
      setIdToken(newIdToken);
      localStorage.setItem('idToken', newIdToken);
    });
  };

  return (
    <Container fluid>
      <Row>
        {errorMessage && <Alert variant="danger" className="text-center main-content">{errorMessage}</Alert>}
      </Row>
      <Row>
        <Sidebar />
        <Tabs
          defaultActiveKey="clienttokens"
          id="c2c"
          className="main-content"
        >
          <Tab eventKey="clienttokens" title="Client Tokens">
            <div className="main-content text-center">
              <h3 style={{"paddingTop": "30px"}}>Run Following Commands in Terminal</h3>
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
                      style={{fontSize: "10pt", minHeight: "360px"}}
                    />
                    <Button
                      variant="outline-info"
                      id="button-addon2"
                      style={{width: "120px"}}
                      onClick={copyToClipboard1}
                    >
                      {copied ? 'Copied!' : 'Copy'}
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
                      style={{fontSize: "10pt", minHeight: "360px"}}
                    />
                    <Button
                      variant="outline-info"
                      id="button-addon2"
                      style={{width: "120px"}}
                      onClick={copyToClipboard2}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </InputGroup>
                </Tab>
              </Tabs>
              <Button className="mt-3 " variant="outline-light" size="lg" style={{ width: '150px' }} onClick={handleTokenRefresh}>
                Refresh
              </Button>
            </div>
          </Tab>
          <Tab eventKey="personalinfo" title="Personal Info">
            <div className="text-center">
              <h3 style={{"paddingTop": "30px"}}>Basic Information</h3>
              <p>Email: {username}</p>
            </div>
          </Tab>
          <Tab eventKey="changepassword" title="Change Password">
            <ChangePasswordPage />
          </Tab>
        </Tabs>
      </Row>
    </Container>
  );
};

export default AccountPage;
