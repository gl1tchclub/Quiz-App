/**
 * @file Logout.jsx
 * @module Logout
 * @description Page component for logging out a user, displays confirmation and logout button.
 * @author Elizabeth Minty
 */

import LogoutButton from "../components/buttons/LogoutButton";
import React from "react";
import CardWrapper from "../components/CardWrapper";

const LogoutPage = () => {
  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <CardWrapper
        title="Do you wish to log out?"
        label="We'll see you soon!"
        box="w-1/2 bg-pink-300 shadow-lg rounded-lg p-6 mb-40"
      >
        <div className="flex justify-center mt-6">
          <LogoutButton />
        </div>
      </CardWrapper>
    </div>
  );
};
export default LogoutPage;
