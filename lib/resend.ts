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

export async function sendSubmissionNotification(
  data: SubmissionData,
  aiSummary: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    
    if (!notificationEmail) {
      throw new Error('NOTIFICATION_EMAIL environment variable not set');
    }

    const isStrongFit = data.qualification_status === 'strong_fit';
    const statusEmoji = isStrongFit ? '🎯' : '⚠️';
    const statusText = isStrongFit ? 'STRONG FIT' : 'NOT FIT';
    const statusColor = isStrongFit ? '#10b981' : '#eab308';

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
