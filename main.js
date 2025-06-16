// Global variables
var currentDir = '/root';
var commandHistory = [];
var historyIndex = -1;
var completedTasks = new Set();
var foundFlags = new Set();
var currentHost = 'jumphost'; // 'jumphost', 'centos', or 'k8s'
var connectedHosts = new Set();
var systemState = {
    centos: {
        firewallConfigured: false,
        swapConfigured: false,
        ntpConfigured: false,
        yumProxyConfigured: false,
        packagesInstalled: false,
        platformConfigured: false,
        openPorts: []
    },
    k8s: {
        connected: false,
        investigationStarted: false
    }
};

// Available commands for tab completion
var availableCommands = [
    'ls', 'cd', 'cat', 'vi', 'pwd', 'clear', 'mkdir', 'chmod', 'help',
    'systemctl', 'firewall-cmd', 'yum', 'rpm', 'service', 'chkconfig',
    'free', 'df', 'du', 'ps', 'top', 'netstat', 'ss', 'ping', 'curl', 'wget',
    'dd', 'mkswap', 'swapon', 'swapoff', 'mount', 'umount', 'fdisk',
    'iptables', 'route', 'ifconfig', 'ip', 'hostnamectl', 'timedatectl',
    'kubectl', 'ssh', 'exit', 'logout'
];

// Tab switching function
function switchTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab').forEach(function(tab) {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(function(content) {
        content.classList.remove('active');
    });
    
    // Add active class to clicked tab and corresponding content
    var clickedTab = document.querySelector('.tab[data-tab="' + tabName + '"]');
    var targetContent = document.getElementById(tabName);
    
    if (clickedTab && targetContent) {
        clickedTab.classList.add('active');
        targetContent.classList.add('active');
    }
}

// Initialize tab functionality
function initializeTabs() {
    document.querySelectorAll('.tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            var tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

// Utility functions
function getCurrentDirName() {
    if (currentDir === '/root') return '~';
    return currentDir.split('/').pop() || '/';
}

function getPromptHost() {
    switch(currentHost) {
        case 'centos': return 'prod-centos-01';
        case 'k8s': return 'k8s-master-01';
        default: return 'jumphost';
    }
}

function getPromptString() {
    switch(currentHost) {
        case 'centos': return '[root@prod-centos-01 ' + getCurrentDirName() + ']#';
        case 'k8s': return '[root@k8s-master-01 ' + getCurrentDirName() + ']#';
        default: return 'acme-training@jumphost:~

function getCurrentFileSystem() {
    switch(currentHost) {
        case 'k8s': return clusterFileSystem;
        case 'centos': return fileSystem;
        default: return { '/root': {} };
    }
}

// Terminal output functions
function addOutput(text, className) {
    var terminal = document.getElementById('terminal-output');
    var outputDiv = document.createElement('div');
    outputDiv.className = 'output ' + (className || '');
    outputDiv.textContent = text;
    terminal.appendChild(outputDiv);
}

function scrollToBottom() {
    var terminal = document.getElementById('terminal-output');
    terminal.scrollTop = terminal.scrollHeight;
}

function clearTerminal() {
    var terminal = document.getElementById('terminal-output');
    terminal.innerHTML = '<div class="output info">Terminal cleared. Type "help" for available commands.</div>';
}

function showNewPrompt() {
    addOutput('');
    updatePrompt();
    scrollToBottom();
    
    // Focus the main input
    var mainInput = document.getElementById('main-command-input');
    if (mainInput) {
        mainInput.focus();
    }
}

// Progress tracking functions
function updateTaskProgress() {
    var total = 6;
    var completed = completedTasks.size;
    var status = 'Tasks: ';
    
    if (currentHost === 'jumphost') {
        status += 'Not connected';
    } else if (currentHost === 'centos') {
        status += completed + '/' + total + ' completed';
    } else if (currentHost === 'k8s') {
        status += 'Investigating issues';
    }
    
    document.getElementById('task-progress').textContent = status;
}

function updateCtfProgress() {
    var total = 3;
    var found = foundFlags.size;
    document.getElementById('ctf-progress').textContent = 'Flags: ' + found + '/' + total + ' found';
    
    if (found > 0) {
        updateFlagsDisplay();
    }
}

function updateFlagsDisplay() {
    var flagsDiv = document.getElementById('flags-display');
    if (foundFlags.size === 0) {
        flagsDiv.innerHTML = '<p>🔍 No flags found yet. Start investigating!</p>';
        return;
    }
    
    var flagsArray = Array.from(foundFlags);
    var html = '<h4>🏆 Found Flags:</h4>';
    flagsArray.forEach(function(flag, index) {
        html += '<div class="flag-found">🚩 Flag ' + (index + 1) + ': FLAG{' + flag + '}</div>';
    });
    
    if (foundFlags.size === 3) {
        html += '<div class="flag-found">🎉 All flags found! You are a debugging master!</div>';
    }
    
    flagsDiv.innerHTML = html;
}

function checkForFlag(text) {
    var flagRegex = /FLAG\{([^}]+)\}/g;
    var match;
    
    while ((match = flagRegex.exec(text)) !== null) {
        var flagContent = match[1];
        
        if (!foundFlags.has(flagContent)) {
            foundFlags.add(flagContent);
            addOutput('🚩 FLAG FOUND! FLAG{' + flagContent + '}', 'success');
            updateCtfProgress();
        }
    }
}

function updatePrompt() {
    var promptText = getPromptString();
    document.querySelector('.prompt').textContent = promptText;
    
    var hostStatus = 'Host: ' + getPromptHost();
    if (currentHost !== 'jumphost') {
        hostStatus += ' (' + currentDir + ')';
    }
    document.getElementById('current-host').textContent = hostStatus;
    
    // Update terminal header
    var statusElement = document.getElementById('system-status');
    switch(currentHost) {
        case 'centos':
            statusElement.textContent = 'Connected: prod-centos-01.acme.local (CentOS 7.9)';
            break;
        case 'k8s':
            statusElement.textContent = 'Connected: k8s-master-01.acme.local (Kubernetes)';
            break;
        default:
            statusElement.textContent = 'ACME Training Environment - Local Connection';
    }
    
    updateTaskProgress();
}

function checkAllTasksComplete() {
    if (completedTasks.size === 6) {
        addOutput('');
        addOutput('🎉 Congratulations! All system preparation tasks completed!', 'success');
        addOutput('');
        addOutput('System is now ready for platform deployment:', 'info');
        addOutput('✓ Firewall configured with required ports');
        addOutput('✓ Swap file created and activated');
        addOutput('✓ NTP service configured and running');
        addOutput('✓ YUM proxy settings configured');
        addOutput('✓ Required packages installed');
        addOutput('✓ Platform configuration updated');
        addOutput('');
        addOutput('Your CentOS system is now properly prepared!', 'success');
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    // Initialize tab functionality
    initializeTabs();
    
    addOutput('ACME Corporation Infrastructure Training Environment', 'success');
    addOutput('System ready. Type "start" to begin training.', 'info');
    updateCtfProgress();
    updateTaskProgress();
    showNewPrompt();
});;
    }
}

function getCurrentFileSystem() {
    switch(currentHost) {
        case 'k8s': return clusterFileSystem;
        case 'centos': return fileSystem;
        default: return { '/root': {} };
    }
}

// Terminal output functions
function addOutput(text, className) {
    var terminal = document.getElementById('terminal-output');
    var outputDiv = document.createElement('div');
    outputDiv.className = 'output ' + (className || '');
    outputDiv.textContent = text;
    terminal.appendChild(outputDiv);
}

function scrollToBottom() {
    var terminal = document.getElementById('terminal-output');
    terminal.scrollTop = terminal.scrollHeight;
}

function clearTerminal() {
    var terminal = document.getElementById('terminal-output');
    terminal.innerHTML = '<div class="output info">Terminal cleared. Type "help" for available commands.</div>';
}

function showNewPrompt() {
    addOutput('');
    updatePrompt();
    scrollToBottom();
    
    // Focus the main input
    var mainInput = document.getElementById('main-command-input');
    if (mainInput) {
        mainInput.focus();
    }
}

// Progress tracking functions
function updateTaskProgress() {
    var total = 6;
    var completed = completedTasks.size;
    var status = 'Tasks: ';
    
    if (currentHost === 'jumphost') {
        status += 'Not connected';
    } else if (currentHost === 'centos') {
        status += completed + '/' + total + ' completed';
    } else if (currentHost === 'k8s') {
        status += 'Investigating issues';
    }
    
    document.getElementById('task-progress').textContent = status;
}

function updateCtfProgress() {
    var total = 3;
    var found = foundFlags.size;
    document.getElementById('ctf-progress').textContent = 'Flags: ' + found + '/' + total + ' found';
    
    if (found > 0) {
        updateFlagsDisplay();
    }
}

function updateFlagsDisplay() {
    var flagsDiv = document.getElementById('flags-display');
    if (foundFlags.size === 0) {
        flagsDiv.innerHTML = '<p>🔍 No flags found yet. Start investigating!</p>';
        return;
    }
    
    var flagsArray = Array.from(foundFlags);
    var html = '<h4>🏆 Found Flags:</h4>';
    flagsArray.forEach(function(flag, index) {
        html += '<div class="flag-found">🚩 Flag ' + (index + 1) + ': FLAG{' + flag + '}</div>';
    });
    
    if (foundFlags.size === 3) {
        html += '<div class="flag-found">🎉 All flags found! You are a debugging master!</div>';
    }
    
    flagsDiv.innerHTML = html;
}

function checkForFlag(text) {
    var flagRegex = /FLAG\{([^}]+)\}/g;
    var match;
    
    while ((match = flagRegex.exec(text)) !== null) {
        var flagContent = match[1];
        
        if (!foundFlags.has(flagContent)) {
            foundFlags.add(flagContent);
            addOutput('🚩 FLAG FOUND! FLAG{' + flagContent + '}', 'success');
            updateCtfProgress();
        }
    }
}

function updatePrompt() {
    var promptText = getPromptString();
    document.querySelector('.prompt').textContent = promptText;
    
    var hostStatus = 'Host: ' + getPromptHost();
    if (currentHost !== 'jumphost') {
        hostStatus += ' (' + currentDir + ')';
    }
    document.getElementById('current-host').textContent = hostStatus;
    
    // Update terminal header
    var statusElement = document.getElementById('system-status');
    switch(currentHost) {
        case 'centos':
            statusElement.textContent = 'Connected: prod-centos-01.company.local (CentOS 7.9)';
            break;
        case 'k8s':
            statusElement.textContent = 'Connected: k8s-master-01.company.local (Kubernetes)';
            break;
        default:
            statusElement.textContent = 'Training Environment - Local Connection';
    }
    
    updateTaskProgress();
}

function checkAllTasksComplete() {
    if (completedTasks.size === 6) {
        addOutput('');
        addOutput('🎉 Congratulations! All system preparation tasks completed!', 'success');
        addOutput('');
        addOutput('System is now ready for platform deployment:', 'info');
        addOutput('✓ Firewall configured with required ports');
        addOutput('✓ Swap file created and activated');
        addOutput('✓ NTP service configured and running');
        addOutput('✓ YUM proxy settings configured');
        addOutput('✓ Required packages installed');
        addOutput('✓ Platform configuration updated');
        addOutput('');
        addOutput('Your CentOS system is now properly prepared!', 'success');
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    // Initialize tab functionality
    initializeTabs();
    
    addOutput('Multi-Host Training Environment Ready', 'success');
    addOutput('');
    addOutput('Available training hosts:', 'info');
    addOutput('  🖥️  prod-centos-01.company.local  - System preparation tasks');
    addOutput('  ☸️  k8s-master-01.company.local   - Kubernetes troubleshooting');
    addOutput('');
    addOutput('Connect using: ssh root@[hostname]', 'success');
    addOutput('Type "help" for available commands.', 'info');
    updateCtfProgress();
    updateTaskProgress();
    showNewPrompt();
});