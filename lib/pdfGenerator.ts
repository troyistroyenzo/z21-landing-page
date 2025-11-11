// PDF Generation utility for Onboarding Intakes
// Uses jsPDF for client-side PDF generation
// Install: npm install jspdf

import { jsPDF } from 'jspdf';

interface IntakeData {
  id: string;
  full_name: string;
  business_name: string;
  email: string;
  website_link?: string;
  business_description: string;
  target_customers: string;
  current_tools?: any;
  lead_contact_method: string;
  follow_up_process: string;
  top_priorities: string;
  success_definition: string;
  ai_familiarity: string;
  preferred_schedule?: any;
  timezone: string;
  team_members?: string;
  existing_workflows?: string;
  case_study_consent: string;
  additional_notes?: string;
  created_at: string;
}

export function generateIntakePDF(intake: IntakeData) {
  const doc = new jsPDF();
  let yPos = 20;
  const lineHeight = 7;
  const sectionSpacing = 10;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (margin * 2);

  // Helper to add text with word wrap
  const addText = (text: string, x: number, fontSize = 10, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    
    const lines = doc.splitTextToSize(text, contentWidth);
    lines.forEach((line: string) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, x, yPos);
      yPos += lineHeight;
    });
  };

  // Helper to add section header
  const addSectionHeader = (title: string) => {
    yPos += sectionSpacing;
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFillColor(250, 250, 250);
    doc.rect(margin - 5, yPos - 5, contentWidth + 10, 8, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, yPos);
    yPos += lineHeight + 3;
  };

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Z21 LAUNCHPAD - CLIENT INTAKE', pageWidth / 2, yPos, { align: 'center' });
  yPos += lineHeight * 2;

  // Header line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += lineHeight;

  // Submission date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const submittedDate = new Date(intake.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Submitted: ${submittedDate}`, margin, yPos);
  yPos += lineHeight * 2;

  // Section 1: About You & Business
  addSectionHeader('SECTION 1: ABOUT YOU & BUSINESS');
  addText(`Name: ${intake.full_name}`, margin);
  addText(`Business: ${intake.business_name}`, margin);
  addText(`Email: ${intake.email}`, margin);
  if (intake.website_link) {
    addText(`Website: ${intake.website_link}`, margin);
  }
  yPos += 3;
  addText('Business Description:', margin, 10, true);
  addText(intake.business_description, margin + 5);
  yPos += 3;
  addText('Target Customers:', margin, 10, true);
  addText(intake.target_customers, margin + 5);

  // Section 2: Current Setup
  addSectionHeader('SECTION 2: CURRENT SETUP');
  if (intake.current_tools) {
    const tools = Array.isArray(intake.current_tools) 
      ? intake.current_tools.join(', ') 
      : JSON.stringify(intake.current_tools);
    addText(`Current Tools: ${tools}`, margin);
  }
  yPos += 3;
  addText('Lead Contact Method:', margin, 10, true);
  addText(intake.lead_contact_method, margin + 5);
  yPos += 3;
  addText('Follow-up Process:', margin, 10, true);
  addText(intake.follow_up_process, margin + 5);

  // Section 3: Goals
  addSectionHeader('SECTION 3: GOALS');
  addText('Top Priorities:', margin, 10, true);
  addText(intake.top_priorities, margin + 5);
  yPos += 3;
  addText('Success Definition:', margin, 10, true);
  addText(intake.success_definition, margin + 5);
  yPos += 3;
  addText(`AI Familiarity: ${intake.ai_familiarity}`, margin);

  // Section 4: Logistics
  addSectionHeader('SECTION 4: LOGISTICS');
  if (intake.preferred_schedule) {
    const schedule = Array.isArray(intake.preferred_schedule) 
      ? intake.preferred_schedule.join(', ') 
      : JSON.stringify(intake.preferred_schedule);
    addText(`Preferred Schedule: ${schedule}`, margin);
  }
  addText(`Timezone: ${intake.timezone}`, margin);
  if (intake.team_members) {
    yPos += 3;
    addText('Team Members:', margin, 10, true);
    addText(intake.team_members, margin + 5);
  }
  if (intake.existing_workflows) {
    yPos += 3;
    addText('Existing Workflows:', margin, 10, true);
    addText(intake.existing_workflows, margin + 5);
  }

  // Section 5: Additional
  addSectionHeader('SECTION 5: ADDITIONAL');
  addText(`Case Study Consent: ${intake.case_study_consent}`, margin);
  if (intake.additional_notes) {
    yPos += 3;
    addText('Additional Notes:', margin, 10, true);
    addText(intake.additional_notes, margin + 5);
  }

  // Footer
  yPos = doc.internal.pageSize.getHeight() - 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 7;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Generated from Z21 Admin Panel', pageWidth / 2, yPos, { align: 'center' });

  // Generate filename
  const sanitizedName = intake.full_name.replace(/[^a-zA-Z0-9]/g, '_');
  const sanitizedBusiness = intake.business_name.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${sanitizedName}_${sanitizedBusiness}_Intake.pdf`;

  // Download
  doc.save(filename);
}
