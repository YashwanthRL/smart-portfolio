// Theme Switcher
class ThemeManager {
    constructor() {
        this.themeButtons = document.querySelectorAll('.theme-btn');
        this.html = document.documentElement;
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        
        this.init();
    }
    
    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listeners
        this.themeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const theme = button.getAttribute('data-theme');
                this.setTheme(theme);
            });
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
        
        // Add keyboard shortcut (Ctrl/Cmd + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
    
    setTheme(theme) {
        this.html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        
        // Update active button
        this.themeButtons.forEach(button => {
            button.classList.toggle('active', button.getAttribute('data-theme') === theme);
        });
        
        // Update meta theme color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
        
        // Add transition class
        this.html.classList.add('theme-transition');
        setTimeout(() => {
            this.html.classList.remove('theme-transition');
        }, 1000);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Show notification
        this.showThemeNotification(newTheme);
    }
    
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        metaThemeColor.content = theme === 'dark' ? '#0a0a1a' : '#f0f2f5';
    }
    
    showThemeNotification(theme) {
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.innerHTML = `
            <i class="fas fa-${theme === 'dark' ? 'moon' : 'sun'}"></i>
            <span>${theme.charAt(0).toUpperCase() + theme.slice(1)} Mode Activated</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after animation
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Add styles for theme notification
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .theme-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        backdrop-filter: blur(10px);
        border: 1px solid var(--border-color);
        padding: 1rem 1.5rem;
        border-radius: 50px;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        color: var(--text-primary);
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        transform: translateX(120%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 10001;
    }
    
    .theme-notification.show {
        transform: translateX(0);
    }
    
    .theme-notification i {
        font-size: 1.2rem;
        color: var(--primary);
    }
    
    .theme-transition * {
        transition: background-color 0.3s ease,
                    color 0.3s ease,
                    border-color 0.3s ease,
                    box-shadow 0.3s ease !important;
    }
`;
document.head.appendChild(notificationStyles);