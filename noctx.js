const fs = require('fs');
const readline = require('readline');

console.log(`

Kurisu's Dataset Toolkit ヽ(*ﾟдﾟ)ノｶｲﾊﾞｰ

`)


// Function to create a JSONL formatted string
function createJSONL(prompt, completion) {
    const entry = {
        prompt: prompt,
        completion: completion
    };
    return JSON.stringify(entry) + '\n';
}

// Create a readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Array to store lines
const lines = [];

// Function to interactively collect lines and create JSONL
function collectLines() {
    rl.question('Enter a prompt line (or "exit" to finish): ', function(promptLine) {
        if (promptLine.trim().toLowerCase() === 'exit') {
            rl.close();
            return;
        }

        rl.question('Enter a completion line: ', function(completionLine) {
            lines.push(createJSONL(promptLine, completionLine));
            collectLines();
        });
    });
}

// Start collecting lines
collectLines();

rl.on('close', function() {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `output_${timestamp}.jsonl`;
    const generatedContent = lines.join('');
    fs.writeFileSync(filename, generatedContent, 'utf-8');
    console.log(`Generated JSONL file: ${filename} | EL PSY KONGROO`);
});
