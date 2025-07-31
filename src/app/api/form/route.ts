import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, token } = body;

    if (!name || !email || !password || !token) {
      return NextResponse.json(
        { success: false, message: "Todos los campos son obligatorios, incluyendo la verificación." },
        { status: 400 }
      );
    }

    // Verify Turnstile token with Cloudflare API
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    const verificationResponse = await fetch(
      `https://challenges.cloudflare.com/turnstile/v0/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secretKey || "",
          response: token,
        }),
      }
    );

    const verificationResult = await verificationResponse.json();

    if (!verificationResult.success) {
      return NextResponse.json(
        { success: false, message: "La verificación de Turnstile falló." },
        { status: 400 }
      );
    }

    // Continue with your form logic:
    return NextResponse.json({
      success: true,
      message: "Formulario enviado exitosamente.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}
