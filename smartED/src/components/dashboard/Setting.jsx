import React from "react";
import { ChangeProfielPic } from "./settings/ChangeProfielPic";
import { ProfileInfo } from "./settings/ProfileInfo";
import { ChangePassword } from "./settings/ChangePassword";
import { DeleteAccount } from "./settings/DeleteAccount";

export const Setting = () => {
  return (
    <>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Profile
      </h1>

      {/* change Profile Picture */}
      <ChangeProfielPic />

      {/* Profile Information */}
      <ProfileInfo />

      {/* change Password */}
      <ChangePassword />

      {/* Delete Account */}
      <DeleteAccount />
    </>
  );
};
