import { NextResponse } from "next/server";

import type { AppError } from "@/types/book";

// ─── Success responses ────────────────────────────────────────────────────────

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function created<T>(data: T): NextResponse {
  return NextResponse.json(data, { status: 201 });
}

// ─── Error responses ──────────────────────────────────────────────────────────

export function errorResponse(appError: AppError): NextResponse {
  return NextResponse.json(
    { error: { code: appError.code, message: appError.message } },
    { status: appError.status },
  );
}
