#!/usr/bin/env node

require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genai.getGenerativeModel({ model: "gemini-1.5-flash" });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Parse @file references
function parseFiles(message) {
    const fileRegex = /@([^\s]+)/g;
    const matches = message.match(fileRegex);
    const files = [];
    
    if (matches) {
        matches.forEach(match => {
            let filePath = match.substring(1).trim();
            filePath = filePath.replace(/\\/g, '/');
            
            try {
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    files.push({ path: filePath, content });
                    console.log(`📁 Loaded: ${filePath}`);
                } else {
                    console.log(`⚠️  File not found: ${filePath}`);
                }
            } catch (err) {
                console.log(`⚠️  Could not read ${filePath}: ${err.message}`);
            }
        });
    }
    
    return files;
}

// Extract file modifications from Gemini's response
function extractFileModifications(response) {
    const modifications = [];
    const pattern1 = /FILE:\s*([^\n]+)\n```[\w]*\n([\s\S]*?)```/gi;
    let match;
    
    while ((match = pattern1.exec(response)) !== null) {
        modifications.push({
            path: match[1].trim().replace(/\\/g, '/'),
            content: match[2].trim()
        });
    }
    
    return modifications;
}

// Apply changes to files
function applyChanges(modifications) {
    console.log(`\n💾 Found ${modifications.length} file(s) to update:`);
    
    modifications.forEach((mod, index) => {
        console.log(`   ${index + 1}. ${mod.path}`);
    });
    
    rl.question('\nApply all changes? (y/n): ', (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            modifications.forEach(mod => {
                try {
                    if (fs.existsSync(mod.path)) {
                        const backupPath = `${mod.path}.backup`;
                        fs.copyFileSync(mod.path, backupPath);
                        console.log(`📦 Backup: ${backupPath}`);
                    }
                    
                    const dir = path.dirname(mod.path);
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                    
                    fs.writeFileSync(mod.path, mod.content, 'utf8');
                    console.log(`✅ Updated: ${mod.path}`);
                } catch (err) {
                    console.error(`❌ Failed to update ${mod.path}:`, err.message);
                }
            });
            
            console.log('\n🎉 All changes applied!');
        } else {
            console.log('❌ Changes discarded.');
        }
        
        rl.close();
    });
}

// Main function
async function askGemini(prompt) {
    const files = parseFiles(prompt);
    
    let fullPrompt = `You are a full-stack debugging assistant.

User Request: ${prompt}

`;
    
    if (files.length > 0) {
        fullPrompt += '--- Files Referenced ---\n';
        files.forEach(file => {
            fullPrompt += `\nFile: ${file.path}\n\`\`\`\n${file.content}\n\`\`\`\n`;
        });
        
        fullPrompt += `
When providing fixes, format like this:

FILE: ${files[0].path}
\`\`\`javascript
// complete fixed code
\`\`\`

Provide COMPLETE file content, not snippets.`;
    }
    
    try {
        console.log('\n🤔 Gemini is analyzing...\n');
        const result = await model.generateContent(fullPrompt);
        const response = result.response.text();
        
        console.log('━'.repeat(60));
        console.log(response);
        console.log('━'.repeat(60));
        
        const modifications = extractFileModifications(response);
        
        if (modifications.length > 0) {
            applyChanges(modifications);
        } else {
            console.log('\n✨ Done!');
            rl.close();
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        rl.close();
    }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log(`
🤖 Gemini CLI Debugger

Usage: npm run gemini "<prompt>"

Examples:
  npm run gemini "fix @backend/src/app.js"
  npm run gemini "explain @frontend/src/App.jsx"
  npm run gemini "bug in @backend/routes/auth.js affects @frontend/api/auth.js"
`);
    process.exit(0);
}

const prompt = args.join(' ');
askGemini(prompt);