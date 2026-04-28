export const analyzeResume = async (jobDescription: string, resumeText: string) => {
  const prompt = `
    Analyze this resume against the following job description.
    Return ONLY a raw valid JSON object (no markdown code blocks, no other text) with these keys:
    overall_score (0-100), ats_tips (array of strings), tone_analysis (string), content_suggestions (array of strings), skill_gap_analysis (array of strings).

    Job Description: ${jobDescription}
    Resume Content: ${resumeText}
  `;

  try {
    const response = await window.puter.ai.chat(prompt);
    
    // Sometimes models return content inside markdown code blocks
    let rawContent = response.message.content;
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      rawContent = jsonMatch[0];
    }
    
    return JSON.parse(rawContent);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
};
