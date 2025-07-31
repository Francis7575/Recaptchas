import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { token } = body;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  // Oficcial google endpoint for recaptcha verification
  const verificationResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    {
      method: "POST",
    }
  );

  const verification = await verificationResponse.json();

  if (verification.success && verification.score > 0.5) {
    return NextResponse.json({
      success: true, score: verification.score, 
    });
  } else {
    return NextResponse.json({
      success: false,
      score: verification.score,
      error: "Recaptcha verification failed",
    })
  }
}
