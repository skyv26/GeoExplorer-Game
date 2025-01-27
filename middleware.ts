import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/game") {
    const hasStarted = request.cookies.get("gameStarted")
    if (!hasStarted) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  if (pathname === "/gameover") {
    const hasFinished = request.cookies.get("gameFinished")
    if (!hasFinished) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/game", "/gameover"],
}

