"use client";
import { IRootState } from "@/stores";
import React from "react";
import { useSelector } from "react-redux";

export const MainContainer = ({ children }: { children: React.ReactNode }) => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    return (
        <div
            className={`${themeConfig.navbar} main-container min-h-screen text-black dark:text-white-dark`}
        >
            {children}
        </div>
    );
};
