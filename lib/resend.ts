import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SubmissionData {
  name: string;
  email: string;
  work_description: string;
  profile_link: string;
  referral_source: string;
  sprint_type: string;
  qualification_status?: string | null;
  fit_score?: number | null;
  [key: string]: any;
}

export async function sendOnboardingNotification(
  data: any,
  aiSummary: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    
    if (!notificationEmail) {
      throw new Error('NOTIFICATION_EMAIL environment variable not set');
    }

    // Build intake details HTML
    const detailsHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: #18181b;">
          <td style="padding: 12px; border: 1px solid #27272a; font-weight: 600; color: #a1a1aa;">Business</td>
          <td style="padding: 12px; border: 1px solid #27272a; color: #e4e4e7;">${data.business_name}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #27272a; font-weight: 600; color: #a1a1aa;">Contact</td>
          <td style="padding: 12px; border: 1px solid #27272a; color: #e4e4e7;">${data.full_name} (${data.email})</td>
        </tr>
        <tr style="background: #18181b;">
          <td style="padding: 12px; border: 1px solid #27272a; font-weight: 600; color: #a1a1aa;">What They Do</td>
          <td style="padding: 12px; border: 1px solid #27272a; color: #e4e4e7;">${data.business_description}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #27272a; font-weight: 600; color: #a1a1aa;">Target Customers</td>
          <td style="padding: 12px; border: 1px solid #27272a; color: #e4e4e7;">${data.target_customers}</td>
        </tr>
        <tr style="background: #18181b;">
          <td style="padding: 12px; border: 1px solid #27272a; font-weight: 600; color: #a1a1aa;">AI Familiarity</td>
          <td style="padding: 12px; border: 1px solid #27272a; color: #e4e4e7;">${data.ai_familiarity}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #27272a; font-weight: 600; color: #a1a1aa;">Top Priorities</td>
          <td style="padding: 12px; border: 1px solid #27272a; color: #e4e4e7; white-space: pre-wrap;">${data.top_priorities}</td>
        </tr>
        <tr style="background: #18181b;">
          <td style="padding: 12px; border: 1px solid #27272a; font-weight: 600; color: #a1a1aa;">Success Definition</td>
          <td style="padding: 12px; border: 1px solid #27272a; color: #e4e4e7; white-space: pre-wrap;">${data.success_definition}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #27272a; font-weight: 600; color: #a1a1aa;">Schedule</td>
          <td style="padding: 12px; border: 1px solid #27272a; color: #e4e4e7;">${JSON.stringify(data.preferred_schedule)} • ${data.timezone}</td>
        </tr>
      </table>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: 'Z21 Onboarding <notifications@resend.dev>',
      to: [notificationEmail],
      subject: `NEW ONBOARDING SUMMARY: ${data.full_name} (${data.business_name})`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #09090b;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                  📝 New Onboarding Intake
                </h1>
                <p style="margin: 8px 0 0 0; color: #ffffff; opacity: 0.9; font-size: 16px;">
                  ${data.business_name}
                </p>
              </div>

              <!-- Content -->
              <div style="background: #000000; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #27272a;">
                <!-- AI Summary -->
                <div style="background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                  <h2 style="margin: 0 0 12px 0; color: #e4e4e7; font-size: 18px; font-weight: 600;">
                    🤖 Quick Summary
                  </h2>
                  <p style="margin: 0; color: #a1a1aa; font-size: 14px; line-height: 1.6;">
                    ${aiSummary}
                  </p>
                </div>

                <h2 style="margin: 0 0 16px 0; color: #e4e4e7; font-size: 18px; font-weight: 600;">
                  📋 Intake Details
                </h2>
                ${detailsHtml}

                <!-- Footer -->
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #27272a; text-align: center;">
                  <p style="margin: 0; color: #71717a; font-size: 14px;">
                    Submitted via Onboarding Intake • Z21 Launchpad
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('Onboarding email sent successfully:', emailData);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function sendApplicantConfirmation(
  data: SubmissionData
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!data.email) {
      throw new Error('Applicant email is required');
    }

    // Determine email content based on qualification status
    const statusConfig: Record<string, { subject: string; content: string; timeframe: string }> = {
      strong_fit: {
        subject: '✅ Application received - I\'ll reach out soon!',
        timeframe: 'within the next 24 hours',
        content: `Based on your responses, you look like a great fit for the program.`
      },
      conditional: {
        subject: '✅ Application received - I\'ll reach out soon!',
        timeframe: 'over the next 2-3 business days',
        content: `I'll review it carefully and reach out personally to discuss if the program is a good fit.`
      },
      not_qualified: {
        subject: '✅ Application received + Resources for you',
        timeframe: '',
        content: `Based on your current setup, I recommend building more AI familiarity before joining the sprint—this will help you get maximum value from the program.`
      }
    };

    const config = statusConfig[data.qualification_status || 'conditional'] || statusConfig.conditional;
    const isNotQualified = data.qualification_status === 'not_qualified';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #09090b;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                Thanks for applying!
              </h1>
            </div>

            <!-- Content -->
            <div style="background: #000000; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #27272a;">
              <p style="margin: 0 0 16px 0; color: #e4e4e7; font-size: 16px; line-height: 1.6;">
                Hi ${data.name},
              </p>
              
              <p style="margin: 0 0 16px 0; color: #e4e4e7; font-size: 16px; line-height: 1.6;">
                Thanks for ${isNotQualified ? 'your interest in' : 'applying to'} the Z21 AI Onboarding Sprint!
              </p>

              <p style="margin: 0 0 16px 0; color: #e4e4e7; font-size: 16px; line-height: 1.6;">
                I've received your application${config.timeframe ? ` and will review it personally ${config.timeframe}` : ''}. ${config.content}
              </p>

              ${isNotQualified ? `
                <p style="margin: 0 0 16px 0; color: #e4e4e7; font-size: 16px; line-height: 1.6;">
                  In the meantime, I've added you to our newsletter and here are some resources to get started:
                </p>

                <div style="text-align: center; margin: 24px 0;">
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://z21.ph'}/ai-resources" 
                     style="display: inline-block; background: #10b981; color: #ffffff; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                    👉 Explore AI Resources
                  </a>
                </div>

                <p style="margin: 0 0 16px 0; color: #e4e4e7; font-size: 16px; line-height: 1.6;">
                  You'll get weekly tips on integrating AI into your workflow. Once you're more comfortable with the tools, we'd love to have you in a future cohort!
                </p>
              ` : `
                <p style="margin: 16px 0 0 0; color: #e4e4e7; font-size: 16px; line-height: 1.6;">
                  Talk soon,
                </p>
              `}

              <!-- Signature -->
              <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #27272a;">
                <p style="margin: 0 0 4px 0; color: #e4e4e7; font-size: 16px; font-weight: 600;">
                  ${isNotQualified ? 'Stay in touch,' : 'Talk soon,'}
                </p>
                <p style="margin: 0; color: #a1a1aa; font-size: 14px;">
                  Troy<br/>Z21 Launchpad
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: 'Troy @ Z21 <notifications@resend.dev>',
      to: [data.email],
      subject: config.subject,
      html: htmlContent
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('Applicant confirmation email sent successfully:', emailData);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function sendSubmissionNotification(
  data: SubmissionData,
  aiSummary: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    
    if (!notificationEmail) {
      throw new Error('NOTIFICATION_EMAIL environment variable not set');
    }

    // Map qualification_status to email display
    const statusConfig: Record<string, { emoji: string; text: string; color: string }> = {
      strong_fit: { emoji: '🎯', text: 'STRONG FIT', color: '#10b981' },
      conditional: { emoji: '⚠️', text: 'REVIEW NEEDED', color: '#eab308' },
      not_qualified: { emoji: '❌', text: 'NOT QUALIFIED', color: '#ef4444' }
    };
    
    const config = statusConfig[data.qualification_status || 'not_qualified'] || statusConfig.not_qualified;
    const statusEmoji = config.emoji;
    const statusText = config.text;
    const statusColor = config.color;

    // Build submission details HTML
    const detailsHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: #18181b;">
          <td style="padding: 12px; border: 1px solid #27272a; font-weight: 600; color: #a1a1aa;">Name</td>
          <td style="padding: 12px; border: 1px solid #27272a; color: #e4e4e7;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #27272a; font-weight: 600; color: #a1a1aa;">Email</td>
          <td style="padding: 12px; border: 1px solid #27272a; color: #e4e4e7;">${data.email}</td>
        </tr>
        <tr style="background: #18181b;">
          <td style="padding: 12px; border: 1px solid #27272a; font-weight: 600; color: #a1a1aa;">Role</td>
          <td style="padding: 12px; border: 1px solid #27272a; color: #e4e4e7;">${data.work_description}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #27272a; font-weight: 600; color: #a1a1aa;">Profile</td>
          <td style="padding: 12px; border: 1px solid #27272a;"><a href="${data.profile_link}" style="color: #60a5fa;">${data.profile_link}</a></td>
        </tr>
        <tr style="background: #18181b;">
          <td style="padding: 12px; border: 1px solid #27272a; font-weight: 600; color: #a1a1aa;">Sprint Type</td>
          <td style="padding: 12px; border: 1px solid #27272a; color: #e4e4e7;">${data.sprint_type}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #27272a; font-weight: 600; color: #a1a1aa;">Fit Score</td>
          <td style="padding: 12px; border: 1px solid #27272a; color: #e4e4e7;">${data.fit_score || 'N/A'}/16</td>
        </tr>
        <tr style="background: #18181b;">
          <td style="padding: 12px; border: 1px solid #27272a; font-weight: 600; color: #a1a1aa;">Referral Source</td>
          <td style="padding: 12px; border: 1px solid #27272a; color: #e4e4e7;">${data.referral_source}</td>
        </tr>
      </table>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: 'Z21 Vibe Check <notifications@resend.dev>',
      to: [notificationEmail],
      subject: `${statusEmoji} ${statusText}: New Application from ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #09090b;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, ${statusColor} 0%, ${statusColor}99 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                  ${statusEmoji} ${statusText}
                </h1>
                <p style="margin: 8px 0 0 0; color: #ffffff; opacity: 0.9; font-size: 16px;">
                  New Application Received
                </p>
              </div>

              <!-- Content -->
              <div style="background: #000000; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #27272a;">
                <!-- AI Summary -->
                <div style="background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                  <h2 style="margin: 0 0 12px 0; color: #e4e4e7; font-size: 18px; font-weight: 600;">
                    🤖 AI Summary
                  </h2>
                  <p style="margin: 0; color: #a1a1aa; font-size: 14px; line-height: 1.6;">
                    ${aiSummary}
                  </p>
                </div>

                <!-- Application Details -->
                <h2 style="margin: 0 0 16px 0; color: #e4e4e7; font-size: 18px; font-weight: 600;">
                  📋 Application Details
                </h2>
                ${detailsHtml}

                <!-- Footer -->
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #27272a; text-align: center;">
                  <p style="margin: 0; color: #71717a; font-size: 14px;">
                    Submitted via Vibe Check • Z21 Launchpad
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', emailData);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
