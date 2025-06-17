"use client";
import { IRootState } from "@/stores";
import { toggleSidebar } from "@/stores/themeConfigSlice";
import { useDispatch, useSelector } from "react-redux";

export const Overlay = () => {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();
    return (
        <>
            {/* sidebar menu overlay */}
            <div
                className={`${(!themeConfig.sidebar && "hidden") || ""} fixed inset-0 z-50 bg-[black]/60 lg:hidden`}
                onClick={() => dispatch(toggleSidebar())}
            ></div>
        </>
    );
};
