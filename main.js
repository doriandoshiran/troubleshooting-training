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

// Tab switching function with proper event handling
function switchTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.tab').forEach(function(tab) {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(function(content) {
        content.classList.remove('active');
    });
    
    // Add active class to clicked tab
    var clickedTab = document.querySelector('.tab[data-tab="' + tabName + '"]');
    var targetContent = document.getElementById(tabName);
    
    if (clickedTab && targetContent) {
        clickedTab.classList.add('active');
        targetContent.classList.add('active');
    }
    
    // Ensure terminal input maintains focus
    setTimeout(function() {
        var mainInput = document.getElementById('main-command-input');
        if (mainInput) {
            mainInput.focus();
        }
    }, 100);
}

// Initialize tab functionality with proper event delegation
function initializeTabs() {
    var tabContainer = document.querySelector('.tab-container');
    if (tabContainer) {
        // Remove any existing listeners to prevent conflicts
        tabContainer.replaceWith(tabContainer.cloneNode(true));
        tabContainer = document.querySelector('.tab-container');
        
        // Use event delegation for better performance and reliability
        tabContainer.addEventListener('click', function(event) {
            var tab = event.target.closest('.tab');
            if (tab) {
                event.preventDefault();
                event.stopPropagation();
                var tabName = tab.getAttribute('data-tab');
                if (tabName) {
                    switchTab(tabName);
                }
            }
        });
    }
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
        default: return 'acme-training@jumphost:~$';
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
    scrollToBottom();
}

function scrollToBottom() {
    var terminal = document.getElementById('terminal-output');
    terminal.scrollTop = terminal.scrollHeight;
}

function clearTerminal() {
    var terminal = document.getElementById('terminal-output');
    terminal.innerHTML = '<div class="output info">Terminal cleared. Type "help" for available commands.</div>';
    showNewPrompt();
}

function showNewPrompt() {
    // Create a new input line and add it to the terminal
    var terminal = document.getElementById('terminal-output');
    var newInputLine = document.createElement('div');
    newInputLine.className = 'input-line';
    newInputLine.innerHTML = '<span class="prompt">' + getPromptString() + '</span><input type="text" class="command-input" autocomplete="off"><span class="cursor">_</span>';
    
    terminal.appendChild(newInputLine);
    
    // Focus the new input and set up event handler
    var newInput = newInputLine.querySelector('.command-input');
    if (newInput) {
        newInput.focus();
        newInput.addEventListener('keydown', handleMainKeyPress);
    }
    
    scrollToBottom();
    updatePrompt();
}

// Enhanced input focus management
function maintainInputFocus() {
    var mainInput = document.getElementById('main-command-input');
    if (mainInput) {
        // Keep focus on main input
        mainInput.addEventListener('blur', function() {
            setTimeout(function() {
                if (document.activeElement.tagName !== 'INPUT') {
                    mainInput.focus();
                }
            }, 50);
        });
        
        // Focus on terminal click
        var terminal = document.getElementById('terminal-output');
        if (terminal) {
            terminal.addEventListener('click', function() {
                mainInput.focus();
            });
        }
        
        // Focus on document click (unless clicking on tabs)
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.tab-container') && !event.target.closest('.tab-content')) {
                mainInput.focus();
            }
        });
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
    
    var taskProgressElement = document.getElementById('task-progress');
    if (taskProgressElement) {
        taskProgressElement.textContent = status;
    }
}

function updateCtfProgress() {
    var total = 3;
    var found = foundFlags.size;
    var ctfProgressElement = document.getElementById('ctf-progress');
    if (ctfProgressElement) {
        ctfProgressElement.textContent = 'Flags: ' + found + '/' + total + ' found';
    }
    
    if (found > 0) {
        updateFlagsDisplay();
    }
}

function updateFlagsDisplay() {
    var flagsDiv = document.getElementById('flags-display');
    if (!flagsDiv) return;
    
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
    // Update main prompt
    var promptElement = document.querySelector('.prompt');
    if (promptElement) {
        promptElement.textContent = getPromptString();
    }
    
    var hostStatus = 'Host: ' + getPromptHost();
    if (currentHost !== 'jumphost') {
        hostStatus += ' (' + currentDir + ')';
    }
    var currentHostElement = document.getElementById('current-host');
    if (currentHostElement) {
        currentHostElement.textContent = hostStatus;
    }
    
    // Update terminal header
    var statusElement = document.getElementById('system-status');
    if (statusElement) {
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

// Enhanced command input handling
function setupCommandInput() {
    var mainInput = document.getElementById('main-command-input');
    if (mainInput) {
        // Remove any existing event listeners
        mainInput.removeEventListener('keydown', handleMainKeyPress);
        
        // Add the event listener
        mainInput.addEventListener('keydown', handleMainKeyPress);
        
        // Ensure focus
        mainInput.focus();
    }
}

// Initialize on page load with proper error handling
window.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize tab functionality
        initializeTabs();
        
        // Setup command input handling
        setupCommandInput();
        
        // Setup focus management
        maintainInputFocus();
        
        // Initial display
        addOutput('Multi-Host Training Environment Ready', 'success');
        addOutput('');
        addOutput('Available training hosts:', 'info');
        addOutput('  🖥️  prod-centos-01.company.local  - System preparation tasks');
        addOutput('  ☸️  k8s-master-01.company.local   - Kubernetes troubleshooting');
        addOutput('');
        addOutput('Connect using: ssh root@[hostname]', 'success');
        addOutput('Type "help" for available commands.', 'info');
        
        // Update progress displays
        updateCtfProgress();
        updateTaskProgress();
        updatePrompt();
        
        // Set up cleanup on page unload
        window.addEventListener('beforeunload', function() {
            // Clean up any intervals or timeouts if needed
            // This prevents memory leaks
        });
        
    } catch (error) {
        console.error('Initialization error:', error);
        addOutput('Warning: Some features may not work properly due to initialization errors.', 'warning');
    }
});