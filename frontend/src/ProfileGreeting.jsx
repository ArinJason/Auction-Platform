import React from "react";

const ProfileGreeting = ({ user }) => {
  if (!user?.name) return null;

  return (
    <div className="profile-greeting">
      <span className="profile-avatar" aria-hidden="true">
        <span className="profile-avatar-head" />
        <span className="profile-avatar-body" />
      </span>
      <span className="profile-greeting-text">
        <span className="profile-greeting-label">Signed in</span>
        <strong>Hi, {user.name}</strong>
      </span>
    </div>
  );
};

export default ProfileGreeting;