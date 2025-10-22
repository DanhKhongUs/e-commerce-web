import { NextResponse } from "next/server";

export function handleError(error: unknown, status = 400) {
  const message =
    error instanceof Error ? error.message : "Internal server error";
  console.error(error);
  return NextResponse.json({ error: message }, { status });
}
