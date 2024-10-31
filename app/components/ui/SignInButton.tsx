"use client";

import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./button";

const SignInButton = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      // @ts-ignore
      localStorage.setItem("oauthToken", session.accessToken || "");
    } else {
      localStorage.removeItem("oauthToken");
    }
  }, [session]);

  const handleSignOut = () => {
    localStorage.removeItem("oauthToken");
    signOut();
  };

  const handleSignIn = async () => {
    try {
      await signIn("google");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {status === "loading" ? (
        <Button disabled className="sign-in-button">
          Loading...
        </Button>
      ) : session ? (
        <>
          <span className="user-name font-semibold">{session.user?.name}</span>
          <Button onClick={handleSignOut} className="sign-out-button">
            Sign Out
          </Button>
        </>
      ) : (
        <Button onClick={handleSignIn} className="sign-in-button">
          Sign In with Google
        </Button>
      )}
    </div>
  );
};

export default SignInButton; 