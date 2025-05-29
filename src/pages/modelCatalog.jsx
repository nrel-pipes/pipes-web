import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from "jwt-decode";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";

import { useGetProjectsQuery } from "../hooks/useProjectQuery";
import { useGetUserQuery } from "../hooks/useUserQuery";
import useAuthStore from "../stores/AuthStore";
import useDataStore from "../stores/DataStore";

import NavbarSub from "../layouts/NavbarSub";
import ContentHeader from "./Components/ContentHeader";

import "./Components/Cards.css";
import "./PageStyles.css";
import "./Projects/ProjectListPage.css";


const ModelCatalog = () => {
    return (
        <div></div>
    );
};

export default ModelCatalog;

