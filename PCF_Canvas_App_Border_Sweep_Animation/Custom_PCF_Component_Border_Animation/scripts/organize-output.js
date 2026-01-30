const fs = require('fs');
const path = require('path');

// Get the namespace from ControlManifest.xml - the test harness expects folder name to match namespace
// (Like confetti: namespace="CustomPCFComponentConfetti" -> folder "CustomPCFComponentConfetti")
const manifestPath = path.join(__dirname, '..', 'out', 'controls', 'ControlManifest.xml');
let componentDirName = 'CustomPCFComponentBorderAnimation'; // Default

// Read namespace from manifest
if (fs.existsSync(manifestPath)) {
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const namespaceMatch = manifestContent.match(/namespace="([^"]+)"/);
    if (namespaceMatch) {
        componentDirName = namespaceMatch[1];
    }
}

const outputDir = path.join(__dirname, '..', 'out', 'controls');
const componentDir = path.join(outputDir, componentDirName);

// Create component directory if it doesn't exist
if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
}

// Files to copy from root to component directory
const filesToOrganize = [
    'bundle.js',
    'ControlManifest.xml'
];

// First, ensure component directory exists for packaging
if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
}

// Copy files to component subdirectory (for packaging)
filesToOrganize.forEach(file => {
    const sourcePath = path.join(outputDir, file);
    const destPath = path.join(componentDir, file);
    
    if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${file} to ${componentDirName}/`);
    }
});

// Copy css directory to component subdirectory
const cssSource = path.join(outputDir, 'css');
const cssDest = path.join(componentDir, 'css');

if (fs.existsSync(cssSource)) {
    // Remove existing css directory in component folder
    if (fs.existsSync(cssDest)) {
        fs.rmSync(cssDest, { recursive: true, force: true });
    }
    
    // Copy css directory recursively
    fs.cpSync(cssSource, cssDest, { recursive: true });
    console.log(`Copied css/ directory to ${componentDirName}/css/`);

    // Remove root-level css so solution packager sees only the control subdirectory
    // (packager treats each subdir of out/controls as a control and expects ControlManifest.xml)
    fs.rmSync(cssSource, { recursive: true, force: true });
    console.log('Removed root-level css/ so packager only sees control folder.');
}

// Copy strings directory to component subdirectory (resx for display name), then remove from root
const stringsSource = path.join(outputDir, 'strings');
const stringsDest = path.join(componentDir, 'strings');
if (fs.existsSync(stringsSource)) {
    if (fs.existsSync(stringsDest)) {
        fs.rmSync(stringsDest, { recursive: true, force: true });
    }
    fs.cpSync(stringsSource, stringsDest, { recursive: true });
    console.log(`Copied strings/ directory to ${componentDirName}/strings/`);
    fs.rmSync(stringsSource, { recursive: true, force: true });
    console.log('Removed root-level strings/ so packager only sees control folder.');
}

// IMPORTANT: When running 'npm run start' from WITHIN a component directory,
// the test harness expects files at ROOT of out/controls/ (not in subdirectory)
// So we KEEP files at root for test harness, and ALSO copy to subdirectory for packaging
// The solution build (.cdsproj) will use the subdirectory structure for packaging

// DO NOT remove files from root - test harness needs them there when run from component directory
// Files are copied to subdirectory for solution packaging, but remain at root for test harness

console.log(`✅ Component organized: ${componentDirName}`);
console.log(`   - Files at root (out/controls/) for test harness: ✅`);
console.log(`   - Files in subdirectory (out/controls/${componentDirName}/) for packaging: ✅`);