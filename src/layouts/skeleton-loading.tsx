"use client";

import { Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";

export const SkeletonLoading = () => {
    const [skeletonHeight, setSkeletonHeight] = useState(600); // Default height

    // Dynamically adjust skeleton height based on viewport
    useEffect(() => {
        const handleResize = () => {
            const headerHeight = 300; // adjust based on actual header or fixed component heights
            const calculatedHeight = window.innerHeight - headerHeight;
            setSkeletonHeight(calculatedHeight);
        };

        handleResize(); // Set initial height
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <Skeleton height={40} />
            <Skeleton height={40} mt={2} />
            <Skeleton height={skeletonHeight} mt={2} />
        </>
    );
};
