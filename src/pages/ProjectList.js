import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "./stores/authStore";


const ProjectList = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>Projects Listing</div>
  );
};


export default ProjectList;
