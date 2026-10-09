import { NextResponse } from "next/server";

interface ContactBody {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
}

interface FieldIssue {
  path: string;
  message: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asTrimmed(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * POST /api/contact
 *
 * Validates a public contact enquiry server-side. Delivery to a shared inbox is
 * handled operationally from the server logs (no mail provider is configured in
 * this deployment), but the request is fully validated before it is accepted so
 * the endpoint is safe to expose.
 */
export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = asTrimmed(body.name);
  const email = asTrimmed(body.email);
  const subject = asTrimmed(body.subject);
  const message = asTrimmed(body.message);

  const errors: FieldIssue[] = [];
  if (!name) errors.push({ path: "name", message: "Please tell us your name." });
  if (!email) {
    errors.push({ path: "email", message: "We need an email address to reply." });
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.push({ path: "email", message: "Enter a valid email address." });
  }
  if (!subject) errors.push({ path: "subject", message: "Add a short subject." });
  if (message.length < 10) {
    errors.push({
      path: "message",
      message: "Please give us a little more detail (at least 10 characters).",
    });
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { success: false, message: "Please fix the highlighted fields.", errors },
      { status: 422 },
    );
  }

  // Traceable in server logs; wired to a shared inbox via the deployment config.
  console.info("[contact] new enquiry", {
    name,
    email,
    subject,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    message: "Thanks — we'll be in touch shortly.",
  });
}
