"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import Domino from "@/public/domino.svg";
import parseJSON from "../scripts/parseJSON";

function Dashboard() {
  const router = useRouter();
	parseJSON();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      router.replace("/user-auth");
      return;
    }

    // Validate the token by making an API call
    const validateToken = async () => {
      try {
        const res = await fetch("./dashboard/api/validateToken", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Token validation failed");
      } catch (error) {
        console.error(error);
        router.replace("/");
      }
    };

    validateToken();
  }, [router]);

  return (
    <>
      <section className="flex flex-row-reverse m-4 sticky">
        <button className="text-lg p-2 text-white rounded-lg w-fit font-normal bg-pink-600">
          SIGN OUT
        </button>
      </section>
      <section className="m-10 p-2">
        <div>
          <h1 className="font-bold text-4xl">
            Welcome,
            <br />
            <span className="font-normal">Satanshu Mishra</span>
          </h1>
        </div>
      </section>
      <section className="m-10 p-2">
        <a href="/sandbox" className="block w-fit">
          <div className="shadow-lg drop-shadow-md hover:shadow-2xl transition-all duration-300 w-fit p-8 rounded-xl flex flex-col justify-between items-center cursor-pointer">
            <Image
              src={Domino}
              alt="Recursion Icon"
              className="w-[146px] h-[146px] my-2"
            />
            <h4 className="font-light my-2 text-xl">Recursion</h4>
          </div>
        </a>
      </section>
    </>
  );
}

export default Dashboard;
