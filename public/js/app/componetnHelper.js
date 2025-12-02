async function loadComponentAndInject(appData, path, elementID, componentParams = {}) {
    
    if (!appData) {
        console.error("Missing appData.");
        return;
    }

    const componentUrl = `/component/${encodeURIComponent(path)}`;
    const container = document.getElementById(elementID);

    if (!container) {
        console.error(`Target element '${elementID}' not found.`); 
        return;
    }

    const componentFileName = path.split('/').pop();
    const componentName = componentFileName.replace(/\..*/, '');
    const initFunctionName = `init${componentName.charAt(0).toUpperCase() + componentName.slice(1)}`;

    container.innerHTML = `<span class="text-sm text-gray-500">Loading ${componentFileName}...</span>`;
    
    try {
        const response = await fetch(componentUrl);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP Error ${response.status}: Failed to load component from ${componentUrl}. Details: ${errorText.substring(0, 100)}...`);
        }
        
        const htmlContent = await response.text();

        const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/g;
        let scriptContent = '';
        let cleanHtml = htmlContent.replace(scriptRegex, (match, scriptText) => {
            scriptContent += scriptText + '\n';
            return ''; 
        });

        container.innerHTML = cleanHtml;

        if (scriptContent.trim()) {
            try {
                const scriptEl = document.createElement('script');
                scriptEl.textContent = scriptContent;
                container.appendChild(scriptEl); 
            } catch (e) {
                console.error(`Script execution error for ${path}:`, e);
            }
        }

        const initializer = window[initFunctionName];
        
        if (typeof initializer === 'function') {
            initializer(appData, componentParams); 
        } else {
            console.error(`Initializer '${initFunctionName}' not found for ${path}.`);
        }

    } catch (error) {
        console.error("Component load failed:", error);
        container.innerHTML = `
            <div class="p-1 bg-red-100 text-red-700 rounded-md text-xs">
                Load Failed: ${error.message}
            </div>
        `;
    }
}