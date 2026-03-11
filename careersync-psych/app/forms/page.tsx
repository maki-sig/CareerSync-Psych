"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Header from "../components/header"
import "../styles/forms.css"

type WorkStyle = "Collaborative" | "Independent" | null
type SoftSkill = "Logical and systematic thinker" | "Efficiency and performance driven" | "Fast-acting and highly adaptive" | "Clear and effective communicator" | null

const SUBJECTS_IT = [
    "Networking & Infrastructure",
    "Cybersecurity",
    "Database Administration",
    "Systems Administration",
    "Web Development",
    "Cloud Computing",
    "IT Project Management",
    "Technical Support",
    "Network Security",
    "IT Service Management",
]

const SUBJECTS_CS = [
    "Data Structures & Algorithms",
    "Operating Systems",
    "Software Engineering",
    "Artificial Intelligence",
    "Machine Learning",
    "Computer Architecture",
    "Programming Languages",
    "Discrete Mathematics",
    "Computer Graphics",
    "Theory of Computation",
]

const HOBBIES = ["Puzzles", "Visual arts", "Fitness", "Music", "Reading", "Outdoor exploration", "Socializing", "Self-reflecting", "Craft & building", "Collecting data & trends"]

function buildPrompt(data: {
    program: string
    workStyle: WorkStyle
    subjects: string[]
    softSkill: SoftSkill
    hobbies: string[]
}): string {
    const { program, workStyle, subjects, softSkill, hobbies } = data

    return `
I'm a ${program} student that completed a career profile survey. Here are my responses:
Program: ${program === "IT" ? "Information Technology" : "Computer Science"}
Preffered work style: ${workStyle ?? "Not specified"}
Technical subjects they enjoyed or excelled in:
${subjects.length > 0 ? subjects.map(s => `- ${s}`).join("\n") : "- None selected"}
Interpersonal strength: ${softSkill ?? "Not specified"}
Pesonal hobbies & interests:
${hobbies.length > 0 ? hobbies.map(h => `- ${h}`).join("\n") : "- None selected"}
Based on this profile, recommend the single best-fit tech career for me.
    `.trim()
}

export default function Forms() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const program = searchParams.get("program") === "IT" ? "IT" : "CS"
    const SUBJECTS = program === "IT" ? SUBJECTS_IT : SUBJECTS_CS

    const [page, setPage] = useState<1 | 2 | 3 | 4>(1)
    const [workStyle, setWorkStyle] = useState<WorkStyle>(null)
    const [subjects, setSubjects] = useState<string[]>([])
    const [softSkill, setSoftSkill] = useState<SoftSkill>(null)
    const [hobbies, setHobbies] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [validationMsg, setValidationMsg] = useState<string | null>(null)

    const toggleCheckbox = (
        value: string,
        list: string[],
        setter: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value])
    }

    const goToPage = (next: 1 | 2 | 3 | 4) => {
        if (next > page) {
            if (page === 1 && !workStyle) {
                setValidationMsg("required")
                return
            }
            if (page === 2 && subjects.length === 0) {
                setValidationMsg("required")
                return
            }
            if (page === 3 && !softSkill) {
                setValidationMsg("required")
                return
            }
        }
        setValidationMsg(null)
        setPage(next)
    }

    const handleSubmit = async () => {
        if (hobbies.length === 0) {
            setValidationMsg("required")
            return
        }

        setValidationMsg(null)
        setIsLoading(true)

        const formData = { program, workStyle, subjects, softSkill, hobbies }
        const prompt = buildPrompt(formData)
        // console.log(prompt)
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            })

            if (!res.ok) {
                throw new Error(`API error: ${res.status} ${res.statusText}`)
            }

            const text = await res.text()
            const parsed = JSON.parse(text)
            console.log("API response:", parsed)
            sessionStorage.setItem("careersync_results", JSON.stringify(parsed))
            sessionStorage.setItem("careersync_data", JSON.stringify(formData))

            document.cookie = "careersync_submitted=true; path=/"
            router.push("/results")
            
        } catch (err) {
            console.error("Failed to fetch career recommendations:", err)
            alert("Something went wrong generating your results. Please try again later.")
            setIsLoading(false)
        }
    }

    return (
        <>
            <Header page={page} />

            <form className="forms">

                {/* ── PAGE 1: Workflow Mode ── */}
                {page === 1 && (
                    <div className="workstyle-section">
                        <h1 className="category-txt">Workflow Mode</h1>
                        <div className="workstyle-card">
                            <span className="question-txt">How do you achieve your peak performance?</span>
                            <span className="caption-txt" style={{ color: validationMsg ? "var(--danger-btn-border)" : undefined }}>
                                Choose the work environment where you feel most in the zone
                            </span>
                            <div className="workstyle-btn-grp">
                                {(["Collaborative", "Independent"] as WorkStyle[]).map(option => (
                                    <label key={option!} className={`option-txt workstyle-option ${workStyle === option ? "selected" : ""}`}
                                        onClick={() => setValidationMsg(null)}>
                                        <input type="radio" name="workstyle" value={option!} checked={workStyle === option} onChange={() => setWorkStyle(option)} />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="nav-btn-grp">
                            <button type="button" className="secondary-btn btn-txt" onClick={() => goToPage(2)}>Next</button>
                        </div>
                    </div>
                )}

                {/* ── PAGE 2: Core Domains ── */}
                {page === 2 && (
                    <div className="subjects-section">
                        <h1 className="category-txt">Core Domains</h1>
                        <div className="subjects-card">
                            <span className="question-txt">Which technical subjects have you mastered or enjoyed most?</span>
                            <span className="caption-txt" style={{ color: validationMsg ? "var(--danger-btn-border)" : undefined }}>
                                Select the areas where you feel most confident or find the highest level of interest
                            </span>
                            <div className="subjects-checkbox-grp">
                                {SUBJECTS.map(subject => (
                                    <label key={subject} className="option-txt checkbox-option"
                                        onClick={() => setValidationMsg(null)}>
                                        <input type="checkbox" checked={subjects.includes(subject)} onChange={() => toggleCheckbox(subject, subjects, setSubjects)} />
                                        <span className="checkbox-box" />
                                        {subject}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="nav-btn-grp">
                            <button type="button" className="secondary-btn btn-txt" onClick={() => goToPage(1)}>Back</button>
                            <button type="button" className="secondary-btn btn-txt" onClick={() => goToPage(3)}>Next</button>
                        </div>
                    </div>
                )}

                {/* ── PAGE 3: Professional DNA ── */}
                {page === 3 && (
                    <div className="softskills-section">
                        <h1 className="category-txt">Professional DNA</h1>
                        <div className="softskills-card">
                            <span className="question-txt">What is your primary interpersonal strength?</span>
                            <span className="caption-txt" style={{ color: validationMsg ? "var(--danger-btn-border)" : undefined }}>
                                Choose the one strength that most defines your contribution to a technical team
                            </span>
                            <div className="softskills-btn-grp">
                                {(["Logical and systematic thinker", "Efficiency and performance driven", "Fast-acting and highly adaptive", "Clear and effective communicator"] as SoftSkill[]).map(option => (
                                    <label key={option!} className={`option-txt softskill-option ${softSkill === option ? "selected" : ""}`}
                                        onClick={() => setValidationMsg(null)}>
                                        <input type="radio" name="softskill" value={option!} checked={softSkill === option} onChange={() => setSoftSkill(option)} />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="nav-btn-grp">
                            <button type="button" className="secondary-btn btn-txt" onClick={() => goToPage(2)}>Back</button>
                            <button type="button" className="secondary-btn btn-txt" onClick={() => goToPage(4)}>Next</button>
                        </div>
                    </div>
                )}

                {/* ── PAGE 4: Side Quests ── */}
                {page === 4 && (
                    <div className="hobbies-section">
                        <h1 className="category-txt">Side Quests</h1>
                        <div className="hobbies-card">
                            <span className="question-txt">Where does your curiosity wander off-academics?</span>
                            <span className="caption-txt" style={{ color: validationMsg ? "var(--danger-btn-border)" : undefined }}>
                                Select activities that fuel your creative energy
                            </span>
                            <div className="hobbies-checkbox-grp">
                                {HOBBIES.map(hobby => (
                                    <label key={hobby} className="option-txt checkbox-option"
                                        onClick={() => setValidationMsg(null)}>
                                        <input type="checkbox" checked={hobbies.includes(hobby)} onChange={() => toggleCheckbox(hobby, hobbies, setHobbies)} />
                                        <span className="checkbox-box" />
                                        {hobby}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="nav-btn-grp">
                            <button type="button" className="secondary-btn btn-txt" onClick={() => goToPage(3)}>Back</button>
                            <button
                                type="button"
                                className="submit-btn btn-txt"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? "Analyzing..." : "Submit"}
                            </button>
                        </div>
                    </div>
                )}

            </form>
        </>
    )
}