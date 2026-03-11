"use client";

import "../styles/toggle.css";
import Toggle from "@/public/theme.svg";
import { useEffect, useState } from "react";

export default function ToggleTheme() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const dark = saved ? saved === "dark" : prefersDark;
        setIsDark(dark);
        document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    }, []);

    const toggle = () => {
        const next = !isDark;
        setIsDark(next);
        const theme = next ? "dark" : "light";
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    };

    return (
        <div className="program-toggle-div">
            <Toggle
                onClick={toggle}
                role="button"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                style={{ cursor: "pointer" }}
            />
        </div>
    );
}