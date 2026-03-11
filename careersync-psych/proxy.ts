import { NextRequest, NextResponse } from "next/server"

export default function proxy(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl

    if (pathname === "/forms") {
        const program = searchParams.get("program")
        if (program !== "Psych") {
            return NextResponse.redirect(new URL("/", request.url))
        }
    }

    if (pathname === "/results") {
        const submitted = request.cookies.get("careersync_submitted")?.value
        if (submitted !== "true") {
            return NextResponse.redirect(new URL("/", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/forms", "/results"],
}