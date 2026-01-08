/*
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

const UPSTREAM_API = "https://api.sansekai.my.id/api/dramabox";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await params;
  const headersList = await headers();
  const accept = headersList.get("accept") || "";

  // If browser navigation (Accept: text/html) -> redirect to UI page
  if (accept.includes("text/html")) {
    return NextResponse.redirect(new URL(`/detail/${bookId}`, request.url));
  }

  // If API fetch -> proxy to upstream
  try {
    const response = await fetch(`${UPSTREAM_API}/detail?bookId=${bookId}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
*/

import { NextRequest, NextResponse } from "next/server";

const UPSTREAM_API = "https://api.sansekai.my.id/api/dramabox";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await params;

  /**
   * Deteksi apakah request ini navigasi browser langsung
   * (BUKAN fetch / react-query)
   */
  const fetchMode = request.headers.get("sec-fetch-mode");

  // ✅ Redirect HANYA jika navigasi browser
  if (fetchMode === "navigate") {
    return NextResponse.redirect(
      new URL(`/detail/${bookId}`, request.url)
    );
  }

  // ✅ Fetch API upstream (JSON ONLY)
  try {
    const response = await fetch(
      `${UPSTREAM_API}/detail?bookId=${bookId}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
