// GitHub API Integration
class GitHubManager {
    constructor() {
        this.username = 'YashwanthRL'; // Change this to your GitHub username
        this.reposContainer = document.getElementById('githubRepos');
        this.calendarContainer = document.getElementById('githubCalendar');
        this.reposPerPage = 6;
        this.currentPage = 1;
        
        if (this.reposContainer) {
            this.init();
        }
    }
    
    async init() {
        await this.fetchGitHubData();
        this.setupEventListeners();
    }
    
    async fetchGitHubData() {
        try {
            this.showLoading();
            
            // Fetch user data
            const userResponse = await fetch(`https://api.github.com/users/${this.username}`);
            if (!userResponse.ok) throw new Error('User not found');
            const userData = await userResponse.json();
            
            // Fetch repositories
            const reposResponse = await fetch(
                `https://api.github.com/users/${this.username}/repos?sort=updated&per_page=100`
            );
            if (!reposResponse.ok) throw new Error('Failed to fetch repos');
            const reposData = await reposResponse.json();
            
            // Filter and sort repositories
            const filteredRepos = this.filterRepos(reposData);
            
            // Display data
            this.displayUserStats(userData);
            this.displayRepositories(filteredRepos);
            this.displayContributionCalendar();
            
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    filterRepos(repos) {
        // Filter out forks and sort by stars
        return repos
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, this.reposPerPage);
    }
    
    displayUserStats(userData) {
        const statsHTML = `
            <div class="github-profile">
                <img src="${userData.avatar_url}" alt="${userData.login}" class="github-avatar">
                <div class="github-info">
                    <h3>${userData.name || userData.login}</h3>
                    <p class="github-bio">${userData.bio || 'No bio available'}</p>
                    <div class="github-stats-row">
                        <div class="github-stat">
                            <i class="fas fa-book"></i>
                            <span>${userData.public_repos} Repos</span>
                        </div>
                        <div class="github-stat">
                            <i class="fas fa-users"></i>
                            <span>${userData.followers} Followers</span>
                        </div>
                        <div class="github-stat">
                            <i class="fas fa-user-plus"></i>
                            <span>${userData.following} Following</span>
                        </div>
                    </div>
                    <a href="${userData.html_url}" target="_blank" class="github-link">
                        View Profile <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
        
        this.reposContainer.insertAdjacentHTML('beforebegin', statsHTML);
    }
    
    displayRepositories(repos) {
        const reposHTML = repos.map(repo => `
            <div class="github-repo-card">
                <div class="repo-header">
                    <i class="fas fa-bookmark"></i>
                    <h4>${repo.name}</h4>
                </div>
                <p class="repo-description">${repo.description || 'No description available'}</p>
                <div class="repo-details">
                    <div class="repo-stat">
                        <i class="fas fa-star"></i>
                        <span>${repo.stargazers_count}</span>
                    </div>
                    <div class="repo-stat">
                        <i class="fas fa-code-branch"></i>
                        <span>${repo.forks_count}</span>
                    </div>
                    ${repo.language ? `
                        <div class="repo-stat">
                            <span class="language-dot" style="background: ${this.getLanguageColor(repo.language)}"></span>
                            <span>${repo.language}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="repo-footer">
                    <span class="repo-updated">Updated ${this.timeAgo(new Date(repo.updated_at))}</span>
                    <a href="${repo.html_url}" target="_blank" class="repo-link">
                        View <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
        `).join('');
        
        const reposGrid = document.createElement('div');
        reposGrid.className = 'github-repos-grid';
        reposGrid.innerHTML = reposHTML;
        this.reposContainer.appendChild(reposGrid);
    }
    
    displayContributionCalendar() {
        // Create a contribution graph clone
        const calendarHTML = `
            <div class="contribution-calendar">
                <h3>Contribution Activity</h3>
                <div class="calendar-grid">
                    ${this.generateCalendarGrid()}
                </div>
                <div class="calendar-legend">
                    <span>Less</span>
                    <div class="legend-colors">
                        <div class="legend-color" style="background: #ebedf0"></div>
                        <div class="legend-color" style="background: #9be9a8"></div>
                        <div class="legend-color" style="background: #40c463"></div>
                        <div class="legend-color" style="background: #30a14e"></div>
                        <div class="legend-color" style="background: #216e39"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>
        `;
        
        this.calendarContainer.innerHTML = calendarHTML;
    }
    
    generateCalendarGrid() {
        // Generate a sample calendar grid (last 52 weeks)
        const weeks = 52;
        const days = 7;
        let gridHTML = '';
        
        for (let week = 0; week < weeks; week++) {
            for (let day = 0; day < days; day++) {
                const level = Math.floor(Math.random() * 5); // Random contribution level
                gridHTML += `<div class="calendar-day" data-level="${level}"></div>`;
            }
        }
        
        return gridHTML;
    }
    
    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f1e05a',
            'Python': '#3572A5',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'Java': '#b07219',
            'TypeScript': '#2b7489',
            'C++': '#f34b7d',
            'C': '#555555',
            'Ruby': '#701516',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'PHP': '#4F5D95'
        };
        return colors[language] || '#8b8b8b';
    }
    
    timeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };
        
        for (let [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
            }
        }
        return 'Just now';
    }
    
    showLoading() {
        this.reposContainer.innerHTML = `
            <div class="loading-spinner"></div>
            <p style="text-align: center; color: var(--text-secondary);">Loading GitHub data...</p>
        `;
    }
    
    showError(message) {
        this.reposContainer.innerHTML = `
            <div class="github-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load GitHub data: ${message}</p>
                <p class="error-hint">Make sure to replace 'YOUR_GITHUB_USERNAME' with your actual GitHub username</p>
                <button onclick="location.reload()" class="btn primary-btn">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
    }
    
    setupEventListeners() {
        // Add any event listeners if needed
    }
}

// Initialize GitHub manager
const githubManager = new GitHubManager();

// Add GitHub styles
const githubStyles = document.createElement('style');
githubStyles.textContent = `
    .github-profile {
        display: flex;
        align-items: center;
        gap: 2rem;
        padding: 2rem;
        background: var(--card-bg);
        border-radius: 15px;
        border: 1px solid var(--border-color);
        margin-bottom: 2rem;
    }
    
    .github-avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 3px solid var(--primary);
    }
    
    .github-info h3 {
        margin-bottom: 0.5rem;
    }
    
    .github-bio {
        color: var(--text-secondary);
        margin-bottom: 1rem;
    }
    
    .github-stats-row {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .github-stat {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-secondary);
    }
    
    .github-stat i {
        color: var(--primary);
    }
    
    .github-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--primary);
        text-decoration: none;
        font-weight: 500;
        transition: gap 0.3s ease;
    }
    
    .github-link:hover {
        gap: 1rem;
    }
    
    .github-repos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
    }
    
    .github-repo-card {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 1.5rem;
        transition: all 0.3s ease;
    }
    
    .github-repo-card:hover {
        border-color: var(--primary);
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    
    .repo-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.8rem;
    }
    
    .repo-header i {
        color: var(--primary);
    }
    
    .repo-description {
        color: var(--text-secondary);
        font-size: 0.9rem;
        margin-bottom: 1rem;
    }
    
    .repo-details {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .repo-stat {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .language-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        display: inline-block;
    }
    
    .repo-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
    }
    
    .repo-updated {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    
    .repo-link {
        color: var(--primary);
        text-decoration: none;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.3rem;
        transition: gap 0.3s ease;
    }
    
    .repo-link:hover {
        gap: 0.5rem;
    }
    
    .contribution-calendar {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 15px;
        padding: 2rem;
        margin-top: 2rem;
    }
    
    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(52, 1fr);
        grid-template-rows: repeat(7, 1fr);
        gap: 3px;
        margin: 1rem 0;
        overflow-x: auto;
    }
    
    .calendar-day {
        width: 12px;
        height: 12px;
        border-radius: 2px;
        background: var(--border-color);
    }
    
    .calendar-day[data-level="0"] { background: #ebedf0; }
    .calendar-day[data-level="1"] { background: #9be9a8; }
    .calendar-day[data-level="2"] { background: #40c463; }
    .calendar-day[data-level="3"] { background: #30a14e; }
    .calendar-day[data-level="4"] { background: #216e39; }
    
    .calendar-legend {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    
    .legend-colors {
        display: flex;
        gap: 3px;
    }
    
    .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 2px;
    }
    
    .github-error {
        text-align: center;
        padding: 3rem;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 15px;
    }
    
    .github-error i {
        font-size: 3rem;
        color: #ff6b6b;
        margin-bottom: 1rem;
    }
    
    .error-hint {
        color: var(--primary);
        margin: 1rem 0;
        font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
        .github-profile {
            flex-direction: column;
            text-align: center;
        }
        
        .github-stats-row {
            justify-content: center;
        }
        
        .github-repos-grid {
            grid-template-columns: 1fr;
        }
        
        .calendar-grid {
            grid-template-columns: repeat(52, 10px);
        }
        
        .calendar-day {
            width: 10px;
            height: 10px;
        }
    }
`;
document.head.appendChild(githubStyles);