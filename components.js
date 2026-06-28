/* =========================================
   FAMEZEL COMPONENT LOADER - ULTRA SIMPLE
   LOADS COMPLETE HTML FILES (WITH CSS & JS INCLUDED)
   ========================================= */

// Load HTML component from single files (containing HTML, CSS, and JS)
async function loadHTML(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load HTML: ${url} (Status: ${response.status})`);
        }
        return await response.text();
    } catch (error) {
        console.error(`❌ Error loading ${url}:`, error.message);
        
        // Show user-friendly error message
        return `<div style="background: #ff4444; color: white; padding: 1rem; text-align: center; font-family: monospace;">
            ⚠️ Could not load ${url.split('/').pop()}<br>
            <small>Please check if the file exists and try refreshing the page.</small>
        </div>`;
    }
}

// Execute scripts from HTML content
function executeScripts(htmlContent) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
            newScript.src = script.src;
        } else {
            newScript.textContent = script.textContent;
        }
        document.head.appendChild(newScript);
    });
}

// Insert HTML and execute scripts
function insertHTMLWithScripts(targetElement, htmlContent, position = 'beforeend') {
    // Insert the HTML
    targetElement.insertAdjacentHTML(position, htmlContent);
    
    // Execute any scripts in the inserted HTML
    executeScripts(htmlContent);
}

// Load navbar and footer components (complete files)
async function loadComponents() {
    try {
        console.log('🚀 Loading FAMEZEL components from complete HTML files...');

        // Load complete HTML components (containing HTML, CSS, and JS)
        console.log('📄 Loading complete component files...');
        const [navbarHTML, footerHTML] = await Promise.all([
            loadHTML('components/navbar.html'),
            loadHTML('components/footer.html')
        ]);
        console.log('✅ Component files loaded successfully');

        // Insert navbar at the beginning of body (after atmospheric effects if they exist)
        const atmosphericEffects = document.querySelector('#dust-canvas') || 
                                 document.querySelector('.grain') || 
                                 document.querySelector('.scroll-progress');
        
        if (atmosphericEffects) {
            // Insert after atmospheric effects
            console.log('📍 Inserting navbar after atmospheric effects');
            insertHTMLWithScripts(atmosphericEffects, navbarHTML, 'afterend');
        } else {
            // Insert at beginning of body
            console.log('📍 Inserting navbar at beginning of body');
            insertHTMLWithScripts(document.body, navbarHTML, 'afterbegin');
        }

        // Insert footer at the end of body
        console.log('📍 Inserting footer at end of body');
        insertHTMLWithScripts(document.body, footerHTML, 'beforeend');
        
        console.log('✅ Components inserted into DOM with scripts executed');

        // Verify components are in DOM
        const navbar = document.querySelector('.site-header');
        const footer = document.querySelector('.footer');
        const menuBtn = document.querySelector('.menu-btn');
        const timeEl = document.getElementById('local-time');
        
        console.log('🔍 Component verification:');
        console.log('  - Navbar found:', !!navbar);
        console.log('  - Footer found:', !!footer);
        console.log('  - Menu button found:', !!menuBtn);
        console.log('  - Time element found:', !!timeEl);

        console.log('🎉 All components loaded successfully!');
        
        // Dispatch custom event to notify other scripts that components are ready
        window.dispatchEvent(new CustomEvent('componentsLoaded'));
        
    } catch (error) {
        console.error('❌ Error loading components:', error);
        
        // Show error message to user
        document.body.insertAdjacentHTML('afterbegin', `
            <div style="background: #ff4444; color: white; padding: 1rem; text-align: center; font-family: monospace; z-index: 99999; position: fixed; top: 0; left: 0; right: 0;">
                ⚠️ Component loading failed: ${error.message}<br>
                <small>Please refresh the page or check the console for details.</small>
            </div>
        `);
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', loadComponents);

// Export for manual initialization if needed
window.FamezelComponents = {
    loadComponents,
    loadHTML,
    executeScripts,
    insertHTMLWithScripts
};

console.log('📦 FAMEZEL Ultra-Simple Component System initialized - Loading complete HTML files');