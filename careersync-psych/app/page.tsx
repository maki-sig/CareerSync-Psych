"use client"

import { useRouter } from "next/navigation"
import "../app/styles/page.css" 
import Psi from "@/public/psi.svg"
import ThemeToggle from "@/app/components/themetoggle"

export default function Landing() {
    const router = useRouter()

    return (
        <>
            <ThemeToggle />
            <section className="program-section">
                <h1 className="title-txt">CareerSync</h1>
                <span className="desc option-txt">This is a decision support form based web app that will align Psychology students to related industry careers.<br />Powered by Gemini.</span>

                <div className="program-card">
                    <span className="caption-txt">Choose your program to start</span>
                    <button className="btn-txt" onClick={() => router.push("/forms?program=Psych")}>
                        <Psi />
                        Psychology
                    </button>
                    <a href="https://www.tiktok.com/@hellokinaban" target="blank">
                        <span className="caption-txt">HelloKinaban @ tiktok && github || Marc Botis</span>
                    </a> 
                </div>
            </section>
        </>
    )
}