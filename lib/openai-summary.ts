import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface FormSubmission {
  name: string;
  email: string;
  work_description: string;
  sprint_type: string;
  qualification_status?: string | null;
  fit_score?: number | null;
  [key: string]: any;
}

export async function generateIntakeSummary(
  intake: any
): Promise<string> {
  try {
    const prompt = `Analyze this Z21 onboarding intake form and provide a brief 2-3 sentence summary for the business owner.

Business: ${intake.business_name}
Contact: ${intake.full_name} (${intake.email})
What they do: ${intake.business_description}
Target customers: ${intake.target_customers}
AI familiarity: ${intake.ai_familiarity}

Top Priorities:
${intake.top_priorities}

Success Definition:
${intake.success_definition}

Current tools: ${JSON.stringify(intake.current_tools)}
Timezone: ${intake.timezone}

Provide a concise summary highlighting:
1. Business readiness and context
2. Key automation opportunities
3. Potential challenges or focus areas

Keep it actionable and focused.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a business analyst helping evaluate client onboarding intake forms. Provide clear, brief summaries.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content || 'Summary generation failed.';
  } catch (error) {
    console.error('OpenAI intake summary error:', error);
    return 'AI summary unavailable - please review intake details manually.';
  }
}

export async function generateAISummary(
  submission: FormSubmission
): Promise<string> {
  try {
    const prompt = `Analyze this Z21 AI Onboarding sprint application and provide a concise 2-3 sentence summary for the business owner.

Applicant Details:
- Name: ${submission.name}
- Email: ${submission.email}
- Role: ${submission.work_description}
- Sprint: ${submission.sprint_type}
- Qualification Status: ${submission.qualification_status || 'N/A'}
- Fit Score: ${submission.fit_score || 'N/A'}/16

Full Application Data:
${JSON.stringify(submission, null, 2)}

Provide a professional summary that highlights:
1. Key qualifications and readiness
2. Any red flags or concerns
3. Recommended next action

Keep it concise, actionable, and business-focused.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a business analyst helping evaluate AI onboarding sprint applications. Provide clear, actionable summaries.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content || 'Summary generation failed.';
  } catch (error) {
    console.error('OpenAI summary generation error:', error);
    return 'AI summary unavailable - please review submission details manually.';
  }
}
