/**
 * Resume Export Functionality
 * Provides PDF, Markdown, and Print export capabilities for all resume formats
 */

// ========================================
// STICKY BACK BUTTON FUNCTIONALITY
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const backLink = document.querySelector('.back-link');
    const exportButtons = document.querySelector('.export-buttons');
    
    if (backLink && exportButtons) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const exportButtonsTop = exportButtons.offsetTop;
            
            if (scrollTop > exportButtonsTop) {
                backLink.classList.add('sticky');
            } else {
                backLink.classList.remove('sticky');
            }
        });
    }
});

// ========================================
// CONFIGURATION VARIABLES
// ========================================
// Override these values to customize server connection
const SERVER_CONFIG = {
    // Server hostname (empty string = auto-detect)
    HOSTNAME: '',
    
    // Server port (empty string = use default)
    PORT: '',
    
    // PDF generation endpoint
    PDF_ENDPOINT: '/generate-pdf',
    
    // Health check endpoint
    HEALTH_ENDPOINT: '/health',
    
    // Timeout for server requests (milliseconds)
    REQUEST_TIMEOUT: 30000,
    
    // Whether to use server-based PDF generation
    USE_SERVER_PDF: true,
    
    // Fallback to browser print if server fails
    FALLBACK_TO_PRINT: true
};

// Helper function to get server URL
function getServerUrl() {
    const hostname = SERVER_CONFIG.HOSTNAME || window.location.hostname;
    const port = SERVER_CONFIG.PORT || window.location.port;
    const protocol = window.location.protocol;
    
    if (port) {
        return `${protocol}//${hostname}:${port}`;
    }
    return `${protocol}//${hostname}`;
}

// Helper function to check if we're on localhost
function isLocalhost() {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
}

// ========================================
// MARKDOWN EXPORT FUNCTION
// ========================================
function exportToMarkdown() {
    try {
        // Get the main content
        const mainContent = document.querySelector('.container');
        if (!mainContent) {
            throw new Error('Main content container not found');
        }

        // Convert HTML to Markdown
        const markdown = htmlToMarkdown(mainContent);
        
        // Create and download the file
        downloadMarkdown(markdown, getFileName('md'));
        
        console.log('Markdown export completed successfully');
    } catch (error) {
        console.error('Error exporting to Markdown:', error);
        alert('Error exporting to Markdown. Please try again.');
    }
}

// ========================================
// HTML TO MARKDOWN CONVERSION
// ========================================
function htmlToMarkdown(element) {
    let markdown = '';
    
    // Process each child node
    for (let child of element.children) {
        markdown += processElement(child);
    }
    
    return markdown.trim();
}

function processElement(element) {
    const tagName = element.tagName.toLowerCase();
    const text = element.textContent?.trim() || '';
    
    // Handle different HTML elements
    switch (tagName) {
        case 'h1':
            return `# ${text}\n\n`;
        case 'h2':
            return `## ${text}\n\n`;
        case 'h3':
            return `### ${text}\n\n`;
        case 'h4':
            return `#### ${text}\n\n`;
        case 'h5':
            return `##### ${text}\n\n`;
        case 'h6':
            return `###### ${text}\n\n`;
        case 'p':
            return text ? `${text}\n\n` : '';
        case 'ul':
        case 'ol':
            return processList(element);
        case 'li':
            return `- ${text}\n`;
        case 'strong':
        case 'b':
            return `**${text}**`;
        case 'em':
        case 'i':
            return `*${text}*`;
        case 'code':
            return `\`${text}\``;
        case 'pre':
            return `\`\`\`\n${text}\n\`\`\`\n\n`;
        case 'blockquote':
            return `> ${text}\n\n`;
        case 'hr':
            return `---\n\n`;
        case 'a':
            const href = element.getAttribute('href');
            return href ? `[${text}](${href})` : text;
        case 'img':
            const alt = element.getAttribute('alt') || '';
            const src = element.getAttribute('src') || '';
            return src ? `![${alt}](${src})` : '';
        case 'div':
            // Process div content recursively
            let divContent = '';
            for (let child of element.children) {
                divContent += processElement(child);
            }
            return divContent;
        case 'span':
            return text;
        default:
            // For unknown elements, just get the text content
            return text ? `${text}\n` : '';
    }
}

function processList(listElement) {
    let markdown = '';
    const items = listElement.querySelectorAll('li');
    
    for (let item of items) {
        markdown += `- ${item.textContent.trim()}\n`;
    }
    
    return markdown + '\n';
}

// ========================================
// MARKDOWN DOWNLOAD
// ========================================
function downloadMarkdown(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}

// ========================================
// PDF EXPORT FUNCTION
// ========================================
function exportToPDF() {
    try {
        // Get the main content
        const mainContent = document.querySelector('.container');
        if (!mainContent) {
            throw new Error('Main content container not found');
        }

        // Create a clean HTML document for PDF generation
        const htmlContent = createPDFHTML(mainContent);
        
        // Use configuration to determine PDF generation method
        if (SERVER_CONFIG.USE_SERVER_PDF) {
            // Always try server-based PDF generation first
            console.log('Using server-based PDF generation');
            generatePDFWithWkhtmltopdf(htmlContent);
        } else {
            // Use browser print if server is disabled
            console.log('Using browser print (server disabled)');
            printToPDF(htmlContent);
        }
        
        console.log('PDF export initiated');
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        alert('Error exporting to PDF. Please try again.');
    }
}

function createPDFHTML(mainContent) {
    // Clone the content to avoid modifying the original
    const contentClone = mainContent.cloneNode(true);
    
    // Create a complete HTML document
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - PDF Export</title>
    <style>
        /* PDF-specific styles */
        @media print {
            body { margin: 0; padding: 20px; }
            .container { max-width: none; box-shadow: none; }
            .export-buttons { display: none !important; }
            .back-link { display: none !important; }
            
            /* Ensure proper page breaks */
            .section { page-break-inside: avoid; }
            .experience-item { page-break-inside: avoid; }
            .skill-category { page-break-inside: avoid; }
            
            /* Optimize for PDF */
            * { -webkit-print-color-adjust: exact; color-adjust: exact; }
        }
        
        /* Base styles for PDF */
        body { font-family: Arial, sans-serif; line-height: 1.4; }
        .header { background: #4a5568; color: white; padding: 30px; text-align: center; }
        .header h1 { font-size: 32px; margin: 0 0 10px 0; }
        .header h2 { font-size: 18px; margin: 0 0 15px 0; opacity: 0.9; }
        .contact-info { font-size: 14px; }
        
        .section { margin: 30px 0; }
        .section h3 { 
            background: #f8fafc; 
            color: #4a5568; 
            padding: 15px 20px; 
            margin: 0 0 20px 0; 
            border-left: 5px solid #4a5568;
            font-size: 20px;
        }
        
        .skill-category, .experience-item, .education-item, .cert-item {
            background: #f8fafc;
            padding: 20px;
            margin: 15px 0;
            border-left: 5px solid #4a5568;
        }
        
        .skill-category h4 { color: #4a5568; margin: 0 0 15px 0; font-size: 16px; }
        .skill-list { list-style: none; padding: 0; }
        .skill-list li { margin: 8px 0; padding-left: 20px; position: relative; }
        .skill-list li::before { content: '•'; position: absolute; left: 0; color: #4a5568; }
        
        .job-title { font-size: 18px; font-weight: bold; color: #2d3748; margin: 0 0 8px 0; }
        .company { font-size: 16px; color: #4a5568; margin: 0 0 8px 0; }
        .date { font-size: 14px; color: #718096; font-style: italic; margin: 0 0 15px 0; }
        .description { font-size: 14px; color: #2d3748; }
        .description ul { list-style: none; padding: 0; }
        .description li { margin: 8px 0; padding-left: 20px; position: relative; }
        .description li::before { content: '▸'; position: absolute; left: 0; color: #4a5568; }
        
        .certifications { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .cert-name { font-weight: bold; color: #4a5568; }
        .cert-org { color: #2d3748; }
        .cert-date { color: #718096; font-style: italic; }
        
        /* Page setup */
        @page { margin: 1in; size: A4; }
    </style>
</head>
<body>
    ${contentClone.outerHTML}
</body>
</html>`;
    
    return html;
}

function generatePDFWithWkhtmltopdf(htmlContent) {
    // Show loading indicator
    showLoadingIndicator();
    
    // Create form data to send HTML content
    const formData = new FormData();
    formData.append('html_content', htmlContent);
    formData.append('filename', getFileName('pdf'));
    
    // Make AJAX request to server endpoint
    const serverUrl = getServerUrl();
    const endpoint = serverUrl + SERVER_CONFIG.PDF_ENDPOINT;
    
    console.log('Sending PDF generation request to:', endpoint);
    console.log('HTML content length:', htmlContent.length);
    console.log('Form data entries:', Array.from(formData.entries()));
    
    fetch(endpoint, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
    })
    .then(blob => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = getFileName('pdf');
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        hideLoadingIndicator();
        console.log('PDF generated successfully with wkhtmltopdf');
    })
    .catch(error => {
        console.error('Error generating PDF:', error);
        hideLoadingIndicator();
        
        // Fallback to browser print if server fails
        if (SERVER_CONFIG.FALLBACK_TO_PRINT) {
            console.log('Server PDF generation failed, falling back to browser print...');
            printToPDF(htmlContent);
        } else {
            console.error('Server PDF generation failed and fallback is disabled');
            hideLoadingIndicator();
            alert('PDF generation failed. Please try again later.');
        }
    });
}

// ========================================
// SERVER HEALTH CHECK
// ========================================
async function checkServerHealth() {
    try {
        const serverUrl = getServerUrl();
        const healthEndpoint = serverUrl + SERVER_CONFIG.HEALTH_ENDPOINT;
        
        console.log('Checking server health at:', healthEndpoint);
        
        const response = await fetch(healthEndpoint, {
            method: 'GET',
            timeout: SERVER_CONFIG.REQUEST_TIMEOUT
        });
        
        if (response.ok) {
            const health = await response.json();
            console.log('Server health check passed:', health);
            return true;
        } else {
            console.warn('Server health check failed:', response.status);
            return false;
        }
    } catch (error) {
        console.warn('Server health check error:', error);
        return false;
    }
}

function printToPDF(htmlContent) {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.print();
            // Close the window after printing
            setTimeout(() => {
                printWindow.close();
            }, 1000);
        }, 500);
    };
}

function showLoadingIndicator() {
    // Create loading overlay
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'pdf-loading';
    loadingDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 8px;
                text-align: center;
            ">
                <div style="
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #4a5568;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                "></div>
                <p>Generating PDF with wkhtmltopdf...</p>
                <p style="font-size: 14px; color: #666;">This may take a few seconds</p>
            </div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(loadingDiv);
}

function hideLoadingIndicator() {
    const loadingDiv = document.getElementById('pdf-loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// ========================================
// EXACT HEADER REPLICA
// ========================================
function createExactHeader(pdf, pageWidth, margin) {
    // Create exact gradient background effect
    const headerHeight = 50;
    
    // Main header background
    pdf.setFillColor(74, 85, 104); // #4a5568 - primary color
    pdf.rect(0, 0, pageWidth, headerHeight, 'F');
    
    // Add subtle gradient effect with multiple layers
    pdf.setFillColor(66, 75, 96); // Slightly darker
    pdf.rect(0, 0, pageWidth, headerHeight * 0.3, 'F');
    
    pdf.setFillColor(82, 95, 120); // Slightly lighter
    pdf.rect(0, headerHeight * 0.7, pageWidth, headerHeight * 0.3, 'F');
    
    // Add header border
    pdf.setDrawColor(45, 55, 72); // #2d3748 - darker border
    pdf.setLineWidth(0.5);
    pdf.line(0, headerHeight, pageWidth, headerHeight);
    
    // Add title with exact styling
    const title = document.querySelector('.header h1')?.textContent || 'Resume';
    pdf.setTextColor(255, 255, 255); // White text
    pdf.setFontSize(34);
    pdf.setFont('helvetica', 'bold');
    
    // Add text shadow for depth
    pdf.setTextColor(45, 55, 72); // Shadow color
    pdf.text(title, pageWidth / 2 + 1.5, 32, { align: 'center' });
    pdf.setTextColor(255, 255, 255); // Main text color
    pdf.text(title, pageWidth / 2, 30, { align: 'center' });
    
    // Add subtitle
    const subtitle = document.querySelector('.header h2')?.textContent || '';
    if (subtitle) {
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(255, 255, 255);
        pdf.text(subtitle, pageWidth / 2, 42, { align: 'center' });
    }
    
    // Add contact info
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        const contactText = contactInfo.textContent.trim();
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(255, 255, 255);
        pdf.text(contactText, pageWidth / 2, 48, { align: 'center' });
    }
}

// ========================================
// EXACT SECTION HEADER REPLICA
// ========================================
function createExactSectionHeader(pdf, sectionTitle, yPos, margin, contentWidth) {
    // Create exact section header styling
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(74, 85, 104); // Primary color
    
    // Calculate title dimensions
    const titleWidth = pdf.getTextWidth(sectionTitle);
    const titleHeight = 25;
    
    // Create exact background box
    pdf.setFillColor(248, 250, 252); // #f8fafc - light background
    pdf.rect(margin - 10, yPos - 12, titleWidth + 20, titleHeight, 'F');
    
    // Add exact left border accent
    pdf.setFillColor(74, 85, 104); // #4a5568 - primary color
    pdf.rect(margin - 10, yPos - 12, 5, titleHeight, 'F');
    
    // Add exact border
    pdf.setDrawColor(226, 232, 240); // #e2e8f0 - border color
    pdf.setLineWidth(0.8);
    pdf.rect(margin - 10, yPos - 12, titleWidth + 20, titleHeight, 'S');
    
    // Add title text
    pdf.text(sectionTitle, margin, yPos);
    
    return yPos + 20;
}

// ========================================
// EXACT SECTION CONTENT PROCESSING
// ========================================
function processExactSectionContent(pdf, section, yPos, margin, contentWidth) {
    let currentY = yPos;
    
    // Process different types of content exactly as they appear
    const contentElements = section.querySelectorAll('h4, p, ul, li, .experience-item, .education-item, .cert-item, .skill-category, .certifications, .projects-grid, .contributions');
    
    contentElements.forEach(element => {
        const tagName = element.tagName.toLowerCase();
        const className = element.className;
        
        // Check if we need a new page
        if (currentY > 260) {
            pdf.addPage();
            currentY = 30;
        }
        
        switch (tagName) {
            case 'h4':
                currentY = processExactH4(pdf, element, currentY, margin, contentWidth);
                break;
                
            case 'p':
                currentY = processExactParagraph(pdf, element, currentY, margin, contentWidth);
                break;
                
            case 'ul':
                currentY = processExactList(pdf, element, currentY, margin, contentWidth);
                break;
                
            case 'li':
                currentY = processExactListItem(pdf, element, currentY, margin, contentWidth);
                break;
                
            default:
                // Handle custom classes exactly as they appear
                if (className.includes('experience-item') || className.includes('education-item') || className.includes('cert-item')) {
                    currentY = processExactExperienceItem(pdf, element, currentY, margin, contentWidth);
                } else if (className.includes('skill-category')) {
                    currentY = processExactSkillCategory(pdf, element, currentY, margin, contentWidth);
                } else if (className.includes('certifications')) {
                    currentY = processExactCertifications(pdf, element, currentY, margin, contentWidth);
                } else if (className.includes('projects-grid')) {
                    currentY = processExactProjectsGrid(pdf, element, currentY, margin, contentWidth);
                } else if (className.includes('contributions')) {
                    currentY = processExactContributions(pdf, element, currentY, margin, contentWidth);
                }
                break;
        }
    });
    
    return currentY;
}

// ========================================
// EXACT ELEMENT PROCESSING FUNCTIONS
// ========================================
function processExactH4(pdf, element, yPos, margin, contentWidth) {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(74, 85, 104); // Primary color
    pdf.text(element.textContent.trim(), margin, yPos);
    return yPos + 10;
}

function processExactParagraph(pdf, element, yPos, margin, contentWidth) {
    const paragraphText = element.textContent.trim();
    if (paragraphText) {
        pdf.setTextColor(45, 55, 72); // Text color
        const lines = pdf.splitTextToSize(paragraphText, contentWidth);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        lines.forEach(line => {
            if (yPos > 260) {
                pdf.addPage();
                yPos = 30;
            }
            pdf.text(line, margin, yPos);
            yPos += 6;
        });
    }
    return yPos;
}

function processExactList(pdf, element, yPos, margin, contentWidth) {
    const listItems = element.querySelectorAll('li');
    listItems.forEach(item => {
        if (yPos > 260) {
            pdf.addPage();
            yPos = 30;
        }
        const itemText = `• ${item.textContent.trim()}`;
        pdf.setTextColor(45, 55, 72); // Text color
        const lines = pdf.splitTextToSize(itemText, contentWidth);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        lines.forEach(line => {
            pdf.text(line, margin, yPos);
            yPos += 6;
        });
    });
    return yPos;
}

function processExactListItem(pdf, element, yPos, margin, contentWidth) {
    if (yPos > 260) {
        pdf.addPage();
        yPos = 30;
    }
    const liText = `• ${element.textContent.trim()}`;
    pdf.setTextColor(45, 55, 72); // Text color
    const liLines = pdf.splitTextToSize(liText, contentWidth);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    liLines.forEach(line => {
        pdf.text(line, margin, yPos);
        yPos += 6;
    });
    return yPos;
}

function processSectionContent(pdf, section, yPos, margin, contentWidth) {
    let currentY = yPos;
    
    // Process different types of content
    const contentElements = section.querySelectorAll('h4, p, ul, li, .experience-item, .education-item, .cert-item, .skill-category, .certifications, .projects-grid');
    
    contentElements.forEach(element => {
        const tagName = element.tagName.toLowerCase();
        const className = element.className;
        
        // Check if we need a new page
        if (currentY > 250) {
            pdf.addPage();
            currentY = 25;
        }
        
        switch (tagName) {
            case 'h4':
                pdf.setFontSize(13);
                pdf.setFont('helvetica', 'bold');
                pdf.setTextColor(74, 85, 104); // Primary color
                pdf.text(element.textContent.trim(), margin, currentY);
                currentY += 8;
                break;
                
            case 'p':
                const paragraphText = element.textContent.trim();
                if (paragraphText) {
                    pdf.setTextColor(45, 55, 72); // Text color
                    const lines = pdf.splitTextToSize(paragraphText, contentWidth);
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'normal');
                    lines.forEach(line => {
                        if (currentY > 250) {
                            pdf.addPage();
                            currentY = 25;
                        }
                        pdf.text(line, margin, currentY);
                        currentY += 5;
                    });
                }
                break;
                
            case 'ul':
                const listItems = element.querySelectorAll('li');
                listItems.forEach(item => {
                    if (currentY > 250) {
                        pdf.addPage();
                        currentY = 25;
                    }
                    const itemText = `• ${item.textContent.trim()}`;
                    pdf.setTextColor(45, 55, 72); // Text color
                    const lines = pdf.splitTextToSize(itemText, contentWidth);
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'normal');
                    lines.forEach(line => {
                        pdf.text(line, margin, currentY);
                        currentY += 5;
                    });
                });
                break;
                
            case 'li':
                if (currentY > 250) {
                    pdf.addPage();
                    currentY = 25;
                }
                const liText = `• ${element.textContent.trim()}`;
                pdf.setTextColor(45, 55, 72); // Text color
                const liLines = pdf.splitTextToSize(liText, contentWidth);
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                liLines.forEach(line => {
                    pdf.text(line, margin, currentY);
                    currentY += 5;
                });
                break;
                
            default:
                // Handle custom classes
                if (className.includes('experience-item') || className.includes('education-item') || className.includes('cert-item')) {
                    currentY = processComplexItem(pdf, element, currentY, margin, contentWidth);
                } else if (className.includes('skill-category')) {
                    currentY = processSkillCategory(pdf, element, currentY, margin, contentWidth);
                } else if (className.includes('certifications')) {
                    currentY = processCertifications(pdf, element, currentY, margin, contentWidth);
                } else if (className.includes('projects-grid')) {
                    currentY = processProjectsGrid(pdf, element, currentY, margin, contentWidth);
                }
                break;
        }
    });
    
    return currentY;
}

function processComplexItem(pdf, item, yPos, margin, contentWidth) {
    let currentY = yPos;
    
    // Check if we need a new page
    if (currentY > 250) {
        pdf.addPage();
        currentY = 25;
    }
    
    // Calculate content height for the experience box
    let contentHeight = 25; // Base height for title, company, date
    
    const descriptionElement = item.querySelector('.description, .cert-description');
    if (descriptionElement) {
        const descriptionText = descriptionElement.textContent.trim();
        if (descriptionText) {
            const lines = pdf.splitTextToSize(descriptionText, contentWidth);
            contentHeight += lines.length * 5; // 5mm per line
        }
    }
    
    // Draw experience item background box
    pdf.setFillColor(255, 255, 255); // White background
    pdf.rect(margin - 5, currentY - 8, contentWidth + 10, contentHeight + 16, 'F');
    
    // Add subtle border
    pdf.setDrawColor(226, 232, 240); // #e2e8f0 - border color
    pdf.setLineWidth(0.3);
    pdf.rect(margin - 5, currentY - 8, contentWidth + 10, contentHeight + 16, 'S');
    
    // Add left accent border
    pdf.setFillColor(74, 85, 104); // #4a5568 - primary color
    pdf.rect(margin - 5, currentY - 8, 3, contentHeight + 16, 'F');
    
    // Process job title/company
    const titleElement = item.querySelector('.job-title, .degree, .cert-name');
    if (titleElement) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(74, 85, 104); // Primary color
        pdf.text(titleElement.textContent.trim(), margin, currentY);
        currentY += 8;
    }
    
    // Process company/institution
    const companyElement = item.querySelector('.company, .institution, .cert-org');
    if (companyElement) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(45, 55, 72); // Text color
        pdf.text(companyElement.textContent.trim(), margin, currentY);
        currentY += 7;
    }
    
    // Process date
    const dateElement = item.querySelector('.date, .cert-date');
    if (dateElement) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(45, 55, 72); // Text color
        pdf.text(dateElement.textContent.trim(), margin, currentY);
        currentY += 7;
    }
    
    // Process description
    if (descriptionElement) {
        const descriptionText = descriptionElement.textContent.trim();
        if (descriptionText) {
            pdf.setTextColor(45, 55, 72); // Text color
            const lines = pdf.splitTextToSize(descriptionText, contentWidth);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            lines.forEach(line => {
                if (currentY > 250) {
                    pdf.addPage();
                    currentY = 25;
                }
                pdf.text(line, margin, currentY);
                currentY += 5;
            });
        }
    }
    
    return currentY + 12; // Add space after the item
}

// ========================================
// EXACT COMPLEX ITEM PROCESSING
// ========================================
function processExactExperienceItem(pdf, item, yPos, margin, contentWidth) {
    let currentY = yPos;
    
    // Check if we need a new page
    if (currentY > 260) {
        pdf.addPage();
        currentY = 30;
    }
    
    // Calculate content height for the exact experience box
    let contentHeight = 30; // Base height for title, company, date
    
    const descriptionElement = item.querySelector('.description, .cert-description');
    if (descriptionElement) {
        const descriptionText = descriptionElement.textContent.trim();
        if (descriptionText) {
            const lines = pdf.splitTextToSize(descriptionText, contentWidth);
            contentHeight += lines.length * 6; // 6mm per line
        }
    }
    
    // Draw exact experience item background box - match CSS styling
    pdf.setFillColor(248, 250, 252); // #f8fafc - light background
    pdf.rect(margin - 8, currentY - 10, contentWidth + 16, contentHeight + 20, 'F');
    
    // Add exact left border accent - match CSS border-left
    pdf.setFillColor(74, 85, 104); // #4a5568 - primary color
    pdf.rect(margin - 8, currentY - 10, 5, contentHeight + 20, 'F');
    
    // Add exact border - match CSS border
    pdf.setDrawColor(226, 232, 240); // #e2e8f0 - border color
    pdf.setLineWidth(0.8);
    pdf.rect(margin - 8, currentY - 10, contentWidth + 16, contentHeight + 20, 'S');
    
    // Process job title/company with exact styling
    const titleElement = item.querySelector('.job-title, .degree, .cert-name');
    if (titleElement) {
        pdf.setFontSize(15);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(45, 55, 72); // #2d3748 - secondary color
        pdf.text(titleElement.textContent.trim(), margin, currentY);
        currentY += 9;
    }
    
    // Process company/institution with exact styling
    const companyElement = item.querySelector('.company, .institution, .cert-org');
    if (companyElement) {
        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(74, 85, 104); // #4a5568 - primary color
        pdf.text(companyElement.textContent.trim(), margin, currentY);
        currentY += 8;
    }
    
    // Process date with exact styling
    const dateElement = item.querySelector('.date, .cert-date');
    if (dateElement) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(113, 128, 150); // #718096 - muted color
        pdf.text(dateElement.textContent.trim(), margin, currentY);
        currentY += 8;
    }
    
    // Process description with exact styling
    if (descriptionElement) {
        const descriptionText = descriptionElement.textContent.trim();
        if (descriptionText) {
            pdf.setTextColor(45, 55, 72); // #2d3748 - text color
            const lines = pdf.splitTextToSize(descriptionText, contentWidth);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            lines.forEach(line => {
                if (currentY > 260) {
                    pdf.addPage();
                    currentY = 30;
                }
                pdf.text(line, margin, currentY);
                currentY += 6;
            });
        }
    }
    
    return currentY + 15; // Match CSS margin-bottom
}

function processExactSkillCategory(pdf, skillCategory, yPos, margin, contentWidth) {
    let currentY = yPos;
    
    // Check if we need a new page
    if (currentY > 260) {
        pdf.addPage();
        currentY = 30;
    }
    
    // Calculate content height for the exact skill box
    const titleElement = skillCategory.querySelector('h4');
    const skillList = skillCategory.querySelector('.skill-list');
    let contentHeight = 25; // Base height
    
    if (skillList) {
        const skillItems = skillList.querySelectorAll('li');
        contentHeight += skillItems.length * 7; // 7mm per line
    }
    
    // Draw exact skill category box - match CSS styling
    pdf.setFillColor(248, 250, 252); // #f8fafc - light background
    pdf.rect(margin - 5, currentY - 8, contentWidth + 10, contentHeight + 16, 'F');
    
    // Add exact left border accent - match CSS border-left
    pdf.setFillColor(74, 85, 104); // #4a5568 - primary color
    pdf.rect(margin - 5, currentY - 8, 5, contentHeight + 16, 'F');
    
    // Add exact border - match CSS border
    pdf.setDrawColor(226, 232, 240); // #e2e8f0 - border color
    pdf.setLineWidth(0.8);
    pdf.rect(margin - 5, currentY - 8, contentWidth + 10, contentHeight + 16, 'S');
    
    // Add skill category title with exact styling
    if (titleElement) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(74, 85, 104); // Primary color
        pdf.text(titleElement.textContent.trim(), margin, currentY);
        currentY += 10;
    }
    
    // Process skill list with exact styling
    if (skillList) {
        const skillItems = skillList.querySelectorAll('li');
        skillItems.forEach(item => {
            if (currentY > 260) {
                pdf.addPage();
                currentY = 30;
            }
            const skillText = `• ${item.textContent.trim()}`;
            pdf.setTextColor(45, 55, 72); // Text color
            const lines = pdf.splitTextToSize(skillText, contentWidth);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            lines.forEach(line => {
                pdf.text(line, margin, currentY);
                currentY += 6;
            });
        });
    }
    
    return currentY + 12; // Match CSS spacing
}

// ========================================
// MISSING EXACT PROCESSING FUNCTIONS
// ========================================
function processExactCertifications(pdf, certifications, yPos, margin, contentWidth) {
    let currentY = yPos;
    
    // Check if we need a new page
    if (currentY > 260) {
        pdf.addPage();
        currentY = 30;
    }
    
    // Process certification items
    const certItems = certifications.querySelectorAll('.cert-item');
    certItems.forEach(item => {
        if (currentY > 260) {
            pdf.addPage();
            currentY = 30;
        }
        
        // Certification name
        const certName = item.querySelector('.cert-name');
        if (certName) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(74, 85, 104); // Primary color
            pdf.text(certName.textContent.trim(), margin, currentY);
            currentY += 6;
        }
        
        // Organization
        const certOrg = item.querySelector('.cert-org');
        if (certOrg) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(45, 55, 72); // Text color
            pdf.text(certOrg.textContent.trim(), margin, currentY);
            currentY += 5;
        }
        
        // Date
        const certDate = item.querySelector('.cert-date');
        if (certDate) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(45, 55, 72); // Text color
            pdf.text(certDate.textContent.trim(), margin, currentY);
            currentY += 5;
        }
        
        currentY += 3; // Space between certifications
    });
    
    return currentY;
}

function processExactProjectsGrid(pdf, projectsGrid, yPos, margin, contentWidth) {
    let currentY = yPos;
    
    // Check if we need a new page
    if (currentY > 260) {
        pdf.addPage();
        currentY = 30;
    }
    
    // Process project items
    const projectItems = projectsGrid.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        if (currentY > 260) {
            pdf.addPage();
            currentY = 30;
        }
        
        // Project title
        const projectTitle = item.querySelector('h4');
        if (projectTitle) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(74, 85, 104); // Primary color
            pdf.text(projectTitle.textContent.trim(), margin, currentY);
            currentY += 6;
        }
        
        // Project meta (duration, role)
        const projectMeta = item.querySelector('.project-meta');
        if (projectMeta) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(45, 55, 72); // Text color
            pdf.text(projectMeta.textContent.trim(), margin, currentY);
            currentY += 5;
        }
        
        // Project content
        const projectContent = item.querySelector('.project-content');
        if (projectContent) {
            const contentSections = projectContent.querySelectorAll('.project-section');
            contentSections.forEach(section => {
                const sectionTitle = section.querySelector('h5');
                if (sectionTitle) {
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'bold');
                    pdf.setTextColor(74, 85, 104); // Primary color
                    pdf.text(sectionTitle.textContent.trim(), margin, currentY);
                    currentY += 5;
                }
                
                const sectionText = section.querySelector('p');
                if (sectionText) {
                    pdf.setFontSize(9);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(45, 55, 72); // Text color
                    const lines = pdf.splitTextToSize(sectionText.textContent.trim(), contentWidth);
                    lines.forEach(line => {
                        if (currentY > 260) {
                            pdf.addPage();
                            currentY = 30;
                        }
                        pdf.text(line, margin, currentY);
                        currentY += 4;
                    });
                }
                
                currentY += 3; // Space between sections
            });
        }
        
        currentY += 5; // Space between projects
    });
    
    return currentY;
}

function processExactContributions(pdf, contributions, yPos, margin, contentWidth) {
    let currentY = yPos;
    
    // Check if we need a new page
    if (currentY > 260) {
        pdf.addPage();
        currentY = 30;
    }
    
    // Process contribution categories
    const contributionCategories = contributions.querySelectorAll('.contribution-category');
    contributionCategories.forEach(category => {
        if (currentY > 260) {
            pdf.addPage();
            currentY = 30;
        }
        
        // Category title
        const categoryTitle = category.querySelector('h4');
        if (categoryTitle) {
            pdf.setFontSize(13);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(74, 85, 104); // Primary color
            pdf.text(categoryTitle.textContent.trim(), margin, currentY);
            currentY += 8;
        }
        
        // Contribution items
        const contributionItems = category.querySelectorAll('.contribution-item');
        contributionItems.forEach(item => {
            if (currentY > 260) {
                pdf.addPage();
                currentY = 30;
            }
            
            const contributionText = item.querySelector('.contribution-text');
            if (contributionText) {
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(45, 55, 72); // Text color
                const text = `• ${contributionText.textContent.trim()}`;
                const lines = pdf.splitTextToSize(text, contentWidth);
                lines.forEach(line => {
                    pdf.text(line, margin, currentY);
                    currentY += 5;
                });
            }
        });
        
        currentY += 8; // Space between categories
    });
    
    return currentY;
}

// ========================================
// FOOTER AND PAGE MANAGEMENT
// ========================================
function addFooterToAllPages(pdf, pageWidth) {
    const totalPages = pdf.internal.getNumberOfPages();
    
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        pdf.setPage(pageNum);
        
        // Add footer line
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.setDrawColor(226, 232, 240); // #e2e8f0 - light border
        pdf.setLineWidth(0.3);
        pdf.line(25, pageHeight - 20, pageWidth - 25, pageHeight - 20);
        
        // Add page number
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(108, 122, 137); // #6c7a89 - muted text
        pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
        
        // Add timestamp
        const timestamp = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        pdf.text(`Generated on ${timestamp}`, pageWidth - 25, pageHeight - 15, { align: 'right' });
    }
}

// ========================================
// ENHANCED PAGE BREAK HANDLING
// ========================================
function checkPageBreak(pdf, currentY, margin = 25) {
    if (currentY > 250) {
        pdf.addPage();
        return margin;
    }
    return currentY;
}

// ========================================
// SKILL CATEGORY PROCESSING
// ========================================
function processSkillCategory(pdf, skillCategory, yPos, margin, contentWidth) {
    let currentY = yPos;
    
    // Check if we need a new page
    if (currentY > 250) {
        pdf.addPage();
        currentY = 25;
    }
    
    // Calculate content height for the box
    const titleElement = skillCategory.querySelector('h4');
    const skillList = skillCategory.querySelector('.skill-list');
    let contentHeight = 20; // Base height
    
    if (skillList) {
        const skillItems = skillList.querySelectorAll('li');
        contentHeight += skillItems.length * 6; // 6mm per skill item
    }
    
    // Draw skill category box with left border
    pdf.setFillColor(248, 250, 252); // #f8fafc - light background
    pdf.rect(margin - 3, currentY - 5, contentWidth + 6, contentHeight + 10, 'F');
    
    // Add left border accent
    pdf.setFillColor(74, 85, 104); // #4a5568 - primary color
    pdf.rect(margin - 3, currentY - 5, 3, contentHeight + 10, 'F');
    
    // Add border
    pdf.setDrawColor(226, 232, 240); // #e2e8f0 - border color
    pdf.setLineWidth(0.3);
    pdf.rect(margin - 3, currentY - 5, contentWidth + 6, contentHeight + 10, 'S');
    
    // Add skill category title
    if (titleElement) {
        pdf.setFontSize(13);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(74, 85, 104); // Primary color
        pdf.text(titleElement.textContent.trim(), margin, currentY);
        currentY += 8;
    }
    
    // Process skill list
    if (skillList) {
        const skillItems = skillList.querySelectorAll('li');
        skillItems.forEach(item => {
            if (currentY > 250) {
                pdf.addPage();
                currentY = 25;
            }
            const skillText = `• ${item.textContent.trim()}`;
            pdf.setTextColor(45, 55, 72); // Text color
            const lines = pdf.splitTextToSize(skillText, contentWidth);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            lines.forEach(line => {
                pdf.text(line, margin, currentY);
                currentY += 5;
            });
        });
    }
    
    return currentY + 10; // Add space after skill category
}

// ========================================
// CERTIFICATIONS PROCESSING
// ========================================
function processCertifications(pdf, certifications, yPos, margin, contentWidth) {
    let currentY = yPos;
    
    // Check if we need a new page
    if (currentY > 250) {
        pdf.addPage();
        currentY = 25;
    }
    
    // Process certification items
    const certItems = certifications.querySelectorAll('.cert-item');
    certItems.forEach(item => {
        if (currentY > 250) {
            pdf.addPage();
            currentY = 25;
        }
        
        // Certification name
        const certName = item.querySelector('.cert-name');
        if (certName) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(74, 85, 104); // Primary color
            pdf.text(certName.textContent.trim(), margin, currentY);
            currentY += 6;
        }
        
        // Organization
        const certOrg = item.querySelector('.cert-org');
        if (certOrg) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(45, 55, 72); // Text color
            pdf.text(certOrg.textContent.trim(), margin, currentY);
            currentY += 5;
        }
        
        // Date
        const certDate = item.querySelector('.cert-date');
        if (certDate) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(45, 55, 72); // Text color
            pdf.text(certDate.textContent.trim(), margin, currentY);
            currentY += 5;
        }
        
        currentY += 3; // Space between certifications
    });
    
    return currentY;
}

// ========================================
// PROJECTS GRID PROCESSING
// ========================================
function processProjectsGrid(pdf, projectsGrid, yPos, margin, contentWidth) {
    let currentY = yPos;
    
    // Check if we need a new page
    if (currentY > 250) {
        pdf.addPage();
        currentY = 25;
    }
    
    // Process project items
    const projectItems = projectsGrid.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        if (currentY > 250) {
            pdf.addPage();
            currentY = 25;
        }
        
        // Project title
        const projectTitle = item.querySelector('h4');
        if (projectTitle) {
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(74, 85, 104); // Primary color
            pdf.text(projectTitle.textContent.trim(), margin, currentY);
            currentY += 6;
        }
        
        // Project meta (duration, role)
        const projectMeta = item.querySelector('.project-meta');
        if (projectMeta) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'italic');
            pdf.setTextColor(45, 55, 72); // Text color
            pdf.text(projectMeta.textContent.trim(), margin, currentY);
            currentY += 5;
        }
        
        // Project content
        const projectContent = item.querySelector('.project-content');
        if (projectContent) {
            const contentSections = projectContent.querySelectorAll('.project-section');
            contentSections.forEach(section => {
                const sectionTitle = section.querySelector('h5');
                if (sectionTitle) {
                    pdf.setFontSize(10);
                    pdf.setFont('helvetica', 'bold');
                    pdf.setTextColor(74, 85, 104); // Primary color
                    pdf.text(sectionTitle.textContent.trim(), margin, currentY);
                    currentY += 5;
                }
                
                const sectionText = section.querySelector('p');
                if (sectionText) {
                    pdf.setFontSize(9);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setTextColor(45, 55, 72); // Text color
                    const lines = pdf.splitTextToSize(sectionText.textContent.trim(), contentWidth);
                    lines.forEach(line => {
                        if (currentY > 250) {
                            pdf.addPage();
                            currentY = 25;
                        }
                        pdf.text(line, margin, currentY);
                        currentY += 4;
                    });
                }
                
                currentY += 3; // Space between sections
            });
        }
        
        currentY += 5; // Space between projects
    });
    
    return currentY;
}

// ========================================
// PRINT FUNCTION
// ========================================
function printDocument() {
    try {
        window.print();
        console.log('Print initiated');
    } catch (error) {
        console.error('Error printing document:', error);
        alert('Error printing document. Please try again.');
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function getFileName(extension) {
    const pageTitle = document.title || 'resume';
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const cleanTitle = pageTitle.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
    return `${cleanTitle}-${timestamp}.${extension}`;
}

// ========================================
// ENHANCED MARKDOWN PROCESSING
// ========================================
function enhanceMarkdownProcessing(element) {
    // Handle special cases for resume content
    const enhancedMarkdown = processElement(element);
    
    // Clean up extra whitespace and formatting
    return enhancedMarkdown
        .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
        .replace(/\s+$/gm, '') // Remove trailing whitespace from lines
        .replace(/^\s+/gm, ''); // Remove leading whitespace from lines
}

// ========================================
// EXPORT CONFIGURATION
// ========================================
const exportConfig = {
    markdown: {
        includeImages: true,
        includeLinks: true,
        preserveFormatting: true,
        maxLineLength: 80
    },
    pdf: {
        pageSize: 'A4',
        margin: '1in',
        printBackground: true
    }
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Resume export functionality loaded');
    
    // Add export button event listeners if needed
    const exportButtons = document.querySelectorAll('.export-btn');
    exportButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent default if needed
            // e.preventDefault();
        });
    });
});

// Export functions to global scope
window.exportToMarkdown = exportToMarkdown;
window.exportToPDF = exportToPDF;

// ========================================
// TESTING FUNCTIONS (can be run from browser console)
// ========================================
function testExport() {
    console.log('Testing export functionality...');
    console.log('Main content found:', !!document.querySelector('.container'));
    console.log('Export function available:', typeof exportToPDF === 'function');
    console.log('Current hostname:', window.location.hostname);
    console.log('Server config:', SERVER_CONFIG);
    console.log('Server URL:', getServerUrl());
    
    // Test PDF export
    try {
        exportToPDF();
    } catch (error) {
        console.error('Export test failed:', error);
    }
}

function testMarkdownExport() {
    console.log('Testing markdown export...');
    try {
        exportToMarkdown();
    } catch (error) {
        console.error('Markdown export test failed:', error);
    }
}

function testServerConnection() {
    console.log('Testing server connection...');
    checkServerHealth().then(isHealthy => {
        if (isHealthy) {
            console.log('✅ Server is healthy and ready for PDF generation');
        } else {
            console.log('❌ Server health check failed - will use browser print fallback');
        }
    });
}

function updateServerConfig(newConfig) {
    console.log('Updating server configuration...');
    Object.assign(SERVER_CONFIG, newConfig);
    console.log('New server config:', SERVER_CONFIG);
    console.log('Updated server URL:', getServerUrl());
}

// Export testing functions to global scope
window.testExport = testExport;
window.testMarkdownExport = testMarkdownExport;
window.testServerConnection = testServerConnection;
window.updateServerConfig = updateServerConfig;
