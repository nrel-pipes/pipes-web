import { Navigate } from "react-router-dom";

import useAuthStore from "./stores/authStore";


const Projects = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  if (!isLoggedIn) {
    return (
      <Navigate to='/login' />
    );
  }

  return (
    <div>Projects</div>
  );
};


export default Projects;
