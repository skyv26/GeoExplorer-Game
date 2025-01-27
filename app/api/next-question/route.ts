import { NextResponse } from "next/server";
import { getAllRestContries } from "@/utils/api";
import { generateQuestion } from "@/utils/quizGenerator";

export async function GET() {
  try {
    const countries = await getAllRestContries();

    if (!countries || countries.length < 4) {
      return NextResponse.json({ error: "Not enough countries to generate a quiz question." }, { status: 400 });
    }

    const question = generateQuestion(countries);

    return NextResponse.json({ question }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/next-question:", error);
    return NextResponse.json({ error: "Failed to generate question." }, { status: 500 });
  }
}
