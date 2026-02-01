import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Home = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) return redirect("/auth/login");
  return <div>Home</div>;
};

export default Home;
