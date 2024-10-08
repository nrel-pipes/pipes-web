import React from 'react';
import "./Home.css"; // Assuming Home.css contains the required styles
import PillButton from './PillButton';

const SplashPage = () => {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row w-full max-w-7xl">
        <div className="flex-1 lg:max-w-1/2 text-left">
          {/* Main Title */}
          <h1 className="text-5xl font-bold">
            Empowering Your Team To
          </h1>
          {/* Sliding Text Block */}
          <div className="relative mt-3 h-[4.5em] w-full flex justify-start overflow-hidden">
            <div className="w-full relative text-left">
              <span className="absolute inline-block w-full h-full translate-y-full animate-slide leading-[1.75em] text-5xl gradient-text">
                Manage Metadata
              </span>
              <span
                className="absolute inline-block w-full h-full translate-y-full animate-slide leading-[1.75em] text-5xl gradient-text"
                style={{ animationDelay: '0.83s' }}
              >
                Plan Projects
              </span>
              <span
                className="absolute inline-block w-full h-full translate-y-full animate-slide leading-[1.75em] text-5xl gradient-text"
                style={{ animationDelay: '1.67s' }}
              >
                Collaborate
              </span>
            </div>
          </div>

          <div className="my-4 buttons">
          <PillButton text="Login" href="/login" />
          <PillButton text="Sign Up" href="/" />

          </div>
        </div>
        <div className="flex-1 lg:max-w-1/2 flex justify-center items-center">
          <img
            src="images/NREL-pipes-v2.png"
            className="rounded-lg shadow-2xl object-cover w-full h-full"
            alt="NREL PIPES"
          />
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
