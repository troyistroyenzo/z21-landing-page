/**
 * CSV Export Utilities
 * Client-side CSV generation and download
 */

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Build CSV content
  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle null/undefined
      if (value === null || value === undefined) return '';
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const escaped = String(value).replace(/"/g, '""');
      return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
    });
    csvRows.push(values.join(','));
  }
  
  const csvContent = csvRows.join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Format applicant data for CSV export
export function formatApplicantsForCSV(applicants: any[]) {
  return applicants.map(app => ({
    Name: app.name,
    Email: app.email,
    Business: app.business_description || '',
    Score: app.score || 0,
    Status: app.qualification_status || '',
    'Created Date': new Date(app.created_at).toLocaleDateString(),
    'Created Time': new Date(app.created_at).toLocaleTimeString()
  }));
}

// Format subscriber data for CSV export
export function formatSubscribersForCSV(subscribers: any[]) {
  return subscribers.map(sub => ({
    Email: sub.email,
    Source: sub.source || '',
    'Subscribed Date': new Date(sub.subscribed_at).toLocaleDateString(),
    'Subscribed Time': new Date(sub.subscribed_at).toLocaleTimeString()
  }));
}
