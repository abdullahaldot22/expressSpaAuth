const { pagePath } = require("./helper");
const fs = require('fs').promises; 

const layoutComponentHandler = async (req, res) => {
    const filePath = pagePath("/app/component/" + req.params.path);
    try {
        const htmlContent = await fs.readFile(filePath, 'utf8');
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`[File Error] Component not found: ${filePath}`);
            res.status(404).send(`Error: Component file not found at path: ${req.params.path}`);
        } else {
            console.error(`[Server Error] Failed to read component file: ${error.message}`);
            res.status(500).send(`Internal Server Error: ${error.message}`);
        }
    }
}

module.exports ={
    layoutComponentHandler
}