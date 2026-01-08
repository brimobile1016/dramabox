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

  try {
    const res = await fetch(
      `${UPSTREAM_API}/detail?bookId=${bookId}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Failed", status: res.status },
        { status: res.status }
      );
    }

    const book = await res.json();

    // 🔥 ADAPTER: SESUAIKAN DENGAN DramaDetailResponse
    return NextResponse.json({
      data: {
        book: {
          bookId: book.bookId,
          bookName: book.bookName,
          cover: book.coverWap,
          viewCount: 0,
          followCount: 0,
          introduction: book.introduction,
          chapterCount: book.chapterCount,
          labels: [],
          tags: book.tags ?? [],
          typeTwoNames: [],
          typeTwoList: [],
          language: "ID",
          typeTwoName: "",
          shelfTime: book.shelfTime ?? "",
          performerList: [],
        },
        recommends: [],
        chapterList: [],
      },
      success: true,
      status: 200,
      message: "OK",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Internal Error", status: 500 },
      { status: 500 }
    );
  }
}
