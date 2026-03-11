"use client"

import { useRouter } from "next/navigation"
import ThemeToggle from "./themetoggle"
import "../styles/nav.css"
import Spark from "@/public/gemini.svg"

interface HeaderProps {
    page?: 1 | 2 | 3 | 4
    totalPages?: number
}

export default function Header({ page = 1, totalPages = 4 }: HeaderProps) {
    const router = useRouter()

    const handleRestart = () => {
        sessionStorage.removeItem("careersync_data")
        document.cookie = "careersync_submitted=; path=/; max-age=0"
        router.push("/")
    }

    const progress = (page / totalPages) * 100

    return (
        <div className="head-grp">

            <div className="nav-bar">
                <Spark />
                <button className="btn-txt" onClick={handleRestart}>Restart</button>
            </div>

            <div className="progress-bar-track">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <ThemeToggle />

        </div>
    )
}