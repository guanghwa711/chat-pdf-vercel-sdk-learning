"use client";

import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./button";

const SignInButton = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      // @ts-ignore
      localStorage.setItem("oauthToken", session?.accessToken);
    }
  }, [session]);

  const handleSignOut = () => {
    localStorage.removeItem("oauthToken");
    signOut();
  };

  return (
    <div className="flex items-center gap-4">
      {session ? (
        <>
          <span className="user-name font-semibold">{session.user?.name}</span>
          <Button onClick={handleSignOut} className="sign-out-button">
            Sign Out
          </Button>
        </>
      ) : (
        <Button onClick={() => signIn("google")} className="sign-in-button">
          Sign In with Google
        </Button>
      )}
    </div>
  );
};

export default SignInButton; 