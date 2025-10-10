// Color Palette Management
const colorPalettes = {
    ocean: {
        primary: '#0ea5e9',
        secondary: '#0284c7',
        accent: '#38bdf8',
        hero: 'linear-gradient(135deg, #38bdf8 0%, #38bdf8 12.5%, #0ea5e9 12.5%, #0ea5e9 25%, #0284c7 25%, #0284c7 37.5%, #0369a1 37.5%, #0369a1 50%, #075985 50%, #075985 62.5%, #0c4a6e 62.5%, #0c4a6e 75%, #082f49 75%, #082f49 87.5%, #0f172a 87.5%, #0f172a 100%)',
        primaryGradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        accentGradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
        textGradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        shadow: '0 4px 20px rgba(14, 165, 233, 0.15)',
        shadowLg: '0 10px 40px rgba(14, 165, 233, 0.25)'
    },
    mint: {
        primary: '#10b981',
        secondary: '#059669',
        accent: '#34d399',
        hero: 'linear-gradient(135deg, #34d399 0%, #34d399 12.5%, #10b981 12.5%, #10b981 25%, #059669 25%, #059669 37.5%, #047857 37.5%, #047857 50%, #065f46 50%, #065f46 62.5%, #064e3b 62.5%, #064e3b 75%, #022c22 75%, #022c22 87.5%, #0f172a 87.5%, #0f172a 100%)',
        primaryGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        accentGradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
        textGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        shadow: '0 4px 20px rgba(16, 185, 129, 0.15)',
        shadowLg: '0 10px 40px rgba(16, 185, 129, 0.25)'
    },
    orange: {
        primary: '#f97316',
        secondary: '#ea580c',
        accent: '#fb923c',
        hero: 'linear-gradient(135deg, #fb923c 0%, #fb923c 12.5%, #f97316 12.5%, #f97316 25%, #ea580c 25%, #ea580c 37.5%, #dc2626 37.5%, #dc2626 50%, #b91c1c 50%, #b91c1c 62.5%, #991b1b 62.5%, #991b1b 75%, #7f1d1d 75%, #7f1d1d 87.5%, #0f172a 87.5%, #0f172a 100%)',
        primaryGradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        accentGradient: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
        textGradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        shadow: '0 4px 20px rgba(249, 115, 22, 0.15)',
        shadowLg: '0 10px 40px rgba(249, 115, 22, 0.25)'
    },
    lime: {
        primary: '#84cc16',
        secondary: '#65a30d',
        accent: '#a3e635',
        hero: 'linear-gradient(135deg, #a3e635 0%, #a3e635 12.5%, #84cc16 12.5%, #84cc16 25%, #65a30d 25%, #65a30d 37.5%, #4d7c0f 37.5%, #4d7c0f 50%, #365314 50%, #365314 62.5%, #1a2e05 62.5%, #1a2e05 75%, #0f172a 75%, #0f172a 87.5%, #0f172a 87.5%, #0f172a 100%)',
        primaryGradient: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
        accentGradient: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
        textGradient: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
        shadow: '0 4px 20px rgba(132, 204, 22, 0.15)',
        shadowLg: '0 10px 40px rgba(132, 204, 22, 0.25)'
    },
    peach: {
        primary: '#fb923c',
        secondary: '#f97316',
        accent: '#fdba74',
        hero: 'linear-gradient(135deg, #fdba74 0%, #fdba74 12.5%, #fb923c 12.5%, #fb923c 25%, #f97316 25%, #f97316 37.5%, #ea580c 37.5%, #ea580c 50%, #dc2626 50%, #dc2626 62.5%, #b91c1c 62.5%, #b91c1c 75%, #7f1d1d 75%, #7f1d1d 87.5%, #0f172a 87.5%, #0f172a 100%)',
        primaryGradient: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
        accentGradient: 'linear-gradient(135deg, #fdba74 0%, #fb923c 100%)',
        textGradient: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
        shadow: '0 4px 20px rgba(251, 146, 60, 0.15)',
        shadowLg: '0 10px 40px rgba(251, 146, 60, 0.25)'
    },
    blue: {
        primary: '#3b82f6',
        secondary: '#2563eb',
        accent: '#60a5fa',
        hero: 'linear-gradient(135deg, #60a5fa 0%, #60a5fa 12.5%, #3b82f6 12.5%, #3b82f6 25%, #2563eb 25%, #2563eb 37.5%, #1d4ed8 37.5%, #1d4ed8 50%, #1e40af 50%, #1e40af 62.5%, #1e3a8a 62.5%, #1e3a8a 75%, #1e293b 75%, #1e293b 87.5%, #0f172a 87.5%, #0f172a 100%)',
        primaryGradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        accentGradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
        textGradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        shadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
        shadowLg: '0 10px 40px rgba(59, 130, 246, 0.25)'
    },
    emerald: {
        primary: '#10b981',
        secondary: '#059669',
        accent: '#34d399',
        hero: 'linear-gradient(135deg, #34d399 0%, #34d399 12.5%, #10b981 12.5%, #10b981 25%, #059669 25%, #059669 37.5%, #047857 37.5%, #047857 50%, #065f46 50%, #065f46 62.5%, #064e3b 62.5%, #064e3b 75%, #022c22 75%, #022c22 87.5%, #0f172a 87.5%, #0f172a 100%)',
        primaryGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        accentGradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
        textGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        shadow: '0 4px 20px rgba(16, 185, 129, 0.15)',
        shadowLg: '0 10px 40px rgba(16, 185, 129, 0.25)'
    },
    amber: {
        primary: '#f59e0b',
        secondary: '#d97706',
        accent: '#fbbf24',
        hero: 'linear-gradient(135deg, #fbbf24 0%, #fbbf24 12.5%, #f59e0b 12.5%, #f59e0b 25%, #d97706 25%, #d97706 37.5%, #b45309 37.5%, #b45309 50%, #92400e 50%, #92400e 62.5%, #78350f 62.5%, #78350f 75%, #451a03 75%, #451a03 87.5%, #0f172a 87.5%, #0f172a 100%)',
        primaryGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        accentGradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        textGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        shadow: '0 4px 20px rgba(245, 158, 11, 0.15)',
        shadowLg: '0 10px 40px rgba(245, 158, 11, 0.25)'
    }
};

let currentPalette = 'ocean';

function togglePaletteMenu() {
    const menu = document.getElementById('paletteMenu');
    menu.classList.toggle('show');
}

function selectPalette(paletteName) {
    currentPalette = paletteName;
    const palette = colorPalettes[paletteName];
    
    // Update CSS custom properties
    document.documentElement.style.setProperty('--primary-color', palette.primary);
    document.documentElement.style.setProperty('--secondary-color', palette.secondary);
    document.documentElement.style.setProperty('--accent-color', palette.accent);
    document.documentElement.style.setProperty('--gradient-hero', palette.hero);
    document.documentElement.style.setProperty('--gradient-primary', palette.primaryGradient);
    document.documentElement.style.setProperty('--gradient-accent', palette.accentGradient);
    document.documentElement.style.setProperty('--gradient-text', palette.textGradient);
    document.documentElement.style.setProperty('--shadow', palette.shadow);
    document.documentElement.style.setProperty('--shadow-lg', palette.shadowLg);
    
    // Update hero title styling
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.color = palette.textColor || '#2d3748';
        heroTitle.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
    
    // Update active state for swatches
    const swatches = document.querySelectorAll('.palette-swatch');
    swatches.forEach(swatch => {
        swatch.classList.remove('active');
        if (swatch.dataset.palette === paletteName) {
            swatch.classList.add('active');
        }
    });
    
    // Close dropdown menu
    const menu = document.getElementById('paletteMenu');
    menu.classList.remove('show');
    
    // Save preference
    localStorage.setItem('selectedPalette', paletteName);
}

// Close palette menu when clicking outside
document.addEventListener('click', function(event) {
    const paletteSelector = document.querySelector('.color-palette-selector');
    const paletteMenu = document.getElementById('paletteMenu');
    
    if (!paletteSelector.contains(event.target)) {
        paletteMenu.classList.remove('show');
    }
});

// Load saved palette on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedPalette = localStorage.getItem('selectedPalette') || 'ocean';
    selectPalette(savedPalette);
});
