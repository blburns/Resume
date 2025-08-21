# B.L. Burns - Professional Resume Portfolio

A modern, responsive portfolio showcasing professional experience, technical skills, and achievements with multiple resume formats and export capabilities.

**Last Updated: August 2025**

## 🚀 Features

### **Multiple Resume Formats**
- **Professional Resume** (`BLBurns_Resume_2025.html`) - Concise professional summary
- **Curriculum Vitae (CV)** (`BLBurns_CV_2025.html`) - Comprehensive academic and research-focused
- **Online Resume** (`BLBurns_Resume_Online_2025.html`) - Enhanced visual presentation

### **Interactive Elements**
- **Smart Sticky Navigation** - Export buttons and back navigation with intelligent sticky behavior
- **Adaptive Back Button** - Initially uniform with export buttons, transforms to sticky navigation when scrolling
- **Export Functionality** - Markdown export and print capabilities
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### **Technical Features**
- **Modern CSS** - CSS Grid, Flexbox, and custom properties
- **Responsive Breakpoints** - 1024px (tablet), 768px (mobile), 480px (small mobile)
- **Cross-browser Compatibility** - Optimized for modern browsers
- **Performance Optimized** - Efficient CSS and minimal JavaScript
- **Touch-Optimized** - Enhanced mobile experience with proper touch targets

## 📁 Project Structure

```
Resume/
├── assets/
│   ├── css/
│   │   └── resume-styles.css          # Main stylesheet with responsive design
│   ├── js/
│   │   └── resume-export.js           # Export functionality + sticky navigation
│   ├── icons/                         # Company logos and icons (lowercase naming)
│   └── fonts/                         # Typography assets
├── BLBurns_Resume_2025.html          # Professional resume
├── BLBurns_CV_2025.html              # Curriculum vitae
├── BLBurns_Resume_Online_2025.html   # Enhanced online version
├── index.html                         # Resume selection page
└── README.md                          # This file
```

## 🎨 Design System

### **Color Palette**
- **Primary**: `#4a5568` (Slate gray)
- **Secondary**: `#2d3748` (Dark slate)
- **Accent**: `#e2e8f0` (Light gray)
- **Background**: `#f8fafc` (Off-white)
- **Interactive**: Gradient backgrounds for buttons and navigation

### **Typography**
- **Primary Font**: Lato (variable weight)
- **Fallbacks**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Responsive Sizing**: Scales appropriately across devices
- **Readability**: Optimized line heights and spacing for all screen sizes

### **Layout Components**
- **Adaptive Header** - Export buttons with backdrop blur effect
- **Smart Grid Systems** - Responsive grids that stack on mobile
- **Card Design** - Consistent card styling with left borders and shadows
- **Mobile-First Navigation** - Touch-optimized buttons and navigation

## 📱 Responsive Design

### **Breakpoints & Behavior**
- **Desktop**: > 1024px - Full layout with side-by-side elements
- **Tablet**: 768px - 1024px - Adjusted spacing and layout
- **Mobile**: < 768px - Stacked layout, optimized touch targets
- **Small Mobile**: < 480px - Compact layout, enhanced mobile experience

### **Mobile Optimizations**
- **Touch Targets**: Minimum 44px for all interactive elements
- **Grid Layouts**: Single-column layouts on small screens with proper overflow handling
- **Typography**: Optimized font sizes for readability
- **Navigation**: Smart sticky back button with enhanced mobile styling
- **Company Logos**: Proper positioning and sizing across all screen sizes
- **Content Overflow**: Prevents horizontal scrolling on mobile devices

### **Responsive Features**
- **Flexible Grids** - Automatically stack to single column on mobile
- **Adaptive Spacing** - Reduced margins and padding on small screens
- **Touch-Friendly** - Enhanced button interactions and hover states
- **Content Flow** - Logical stacking order for mobile readability

## 🛠️ Technical Implementation

### **CSS Architecture**
- **CSS Custom Properties** - Centralized color and spacing variables
- **Mobile-First Approach** - Base styles for mobile, enhanced for larger screens
- **Modular Components** - Reusable CSS classes for consistent styling
- **Performance Optimized** - Efficient selectors and minimal repaints
- **Specificity Management** - Strategic use of `!important` for mobile overrides

### **JavaScript Features**
- **Scroll Detection** - Monitors scroll position for sticky navigation
- **Export Functions** - Markdown conversion and print functionality
- **Event Handling** - Responsive interactions across all devices
- **Error Handling** - Graceful fallbacks for export operations
- **Touch Optimization** - Enhanced mobile interaction handling

### **Browser Support**
- **Modern Browsers** - Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers** - iOS Safari, Chrome Mobile, Samsung Internet
- **Progressive Enhancement** - Core functionality works without JavaScript
- **Touch Support** - Optimized for touch devices and mobile browsers

## 🚀 Getting Started

### **Local Development**
1. Clone or download the project
2. Open `index.html` in a web browser
3. Navigate between different resume formats
4. Test responsive design by resizing browser window
5. Test mobile experience using browser dev tools

### **Deployment**
1. Upload all files to your web server
2. Ensure `assets/` folder structure is maintained
3. Test all resume formats and export functionality
4. Verify mobile responsiveness across devices
5. Test sticky navigation and mobile interactions

### **Customization**
- **Colors**: Modify CSS custom properties in `:root`
- **Content**: Update HTML files with your information
- **Styling**: Adjust CSS classes for different visual preferences
- **Icons**: Replace company logos in `assets/icons/` folder
- **Responsiveness**: Modify breakpoints in CSS media queries

## 📋 Resume Content

### **Professional Experience**
- Senior Systems Engineer & DevOps Specialist
- Advanced Customer Support Engineer (SoftLayer/IBM Cloud)
- Systems Security Analyst (Alert Logic)
- Operations & Technical Assistant (Austin Exploration)
- CTO / Chief Technology Officer (Eleven2)
- Network Administrator (Idera/BBS Technologies)

### **Technical Skills**
- **Infrastructure**: Linux, Windows Server, VMware, Docker
- **Networking**: Cisco, Juniper, Firewall Management
- **Programming**: Java, Kotlin, C#, Python, Perl
- **DevOps**: Ansible, Jenkins, Terraform, Git
- **Cloud**: AWS, Google Cloud, IBM Cloud
- **Security**: PCI DSS, HIPAA, SOX Compliance

### **Research Interests**
- Infrastructure Automation & DevOps
- Cloud Computing & Hybrid Infrastructure
- Cybersecurity & Compliance
- Quantum Computing & Post-Quantum Cryptography
- Scientific Computing & High-Performance Computing

### **Education & Certifications**
- **Current**: Information Technology Studies (Expected completion: May 2026)
- **Institution**: Houston Community College, North Harris College
- **Planned**: AWS Solutions Architect Associate (Q2 2026), Google Cloud Professional Cloud Architect (Q4 2026)

## 🔧 Browser Compatibility

### **Supported Features**
- CSS Grid and Flexbox
- CSS Custom Properties (Variables)
- Backdrop Filter (with fallbacks)
- Modern JavaScript (ES6+)
- Touch Events (mobile devices)
- Scroll-based interactions

### **Fallbacks**
- Graceful degradation for older browsers
- Alternative layouts for unsupported CSS features
- Print-friendly styles for all resume formats
- Touch-friendly alternatives for non-touch devices

## 📱 Mobile Experience

### **Key Mobile Features**
- **Sticky Navigation** - Back button becomes sticky when scrolling
- **Touch Optimization** - Proper touch targets and interaction feedback
- **Responsive Grids** - Content stacks properly on small screens
- **Company Logo Positioning** - Optimized layout for experience sections
- **Export Functionality** - Full-featured on mobile devices

### **Mobile Testing**
- Tested on iOS Safari, Chrome Mobile, Samsung Internet
- Verified touch interactions and scroll behavior
- Optimized for various mobile screen sizes
- Enhanced accessibility for mobile users

## 📄 License

This project is for personal and professional use. All content and styling are original work.

## 🤝 Contributing

While this is a personal portfolio project, suggestions for improvements are welcome:
- Responsive design enhancements
- Accessibility improvements
- Performance optimizations
- Cross-browser compatibility fixes
- Mobile experience enhancements

## 📞 Contact

- **Email**: contact@blburns.com
- **LinkedIn**: linkedin.com/in/blburns1
- **Location**: Houston, Texas Area

---

*Built with modern web technologies, responsive design principles, and mobile-first development approach.*
