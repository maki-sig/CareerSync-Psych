"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Spark from "@/public/gemini.svg"
import "../styles/results.css"
import ThemeToggle from "../components/themetoggle"

interface ResultsData {
    role: string
    summary: string
    fitReason: string
    confidence: number
}

export default function Results() {
    const router = useRouter()
    const [data, setData] = useState<ResultsData | null>(null)

    useEffect(() => {
        const raw = sessionStorage.getItem("careersync_results") 
        if (!raw) {
            router.push("/")
            return
        }
        try {
            setData(JSON.parse(raw))
        } catch {
            router.push("/")
        }
    }, [router])

    const handleRestart = () => {
        sessionStorage.removeItem("careersync_results")
        sessionStorage.removeItem("careersync_data")
        document.cookie = "careersync_submitted=; path=/; max-age=0"
        router.push("/")
    }

    if (!data) return null

    return (
        <>
            <ThemeToggle />
            <div className="results-section">
                <Spark />
                <h1 className="title-txt">
                    You Synced as {data.role}
                </h1>
                <div className="results-card">
                    <span className="option-txt">{data.summary}</span>
                    <span className="option-txt">{data.fitReason}</span>
                    <span className="caption-txt">{data.confidence}% confidence match</span>
                </div>
                <button className="submit-btn btn-txt" onClick={handleRestart}>
                    CareerSync
                </button>
            </div>
        </>
    )
}