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
    'kubectl', 'ssh', 'exit', 'logout', 'nano'
];

// Enhanced key press handler with better error handling
function handleMainKeyPress(event) {
    try {
        var input = event.target;
        
        if (event.key === 'Enter') {
            var command = input.value.trim();
            if (command) {
                // Show the command on the current line by replacing the input
                replaceInputWithCommand(getPromptString() + ' ' + command);
                var result = executeCommand(command);
                addToCommandHistory(command);
                // Only show new prompt if command doesn't handle it
                if (result !== 'async') {
                    setTimeout(function() {
                        showNewPrompt();
                    }, 50);
                }
            } else {
                // Just show empty prompt if no command
                replaceInputWithCommand(getPromptString());
                showNewPrompt();
            }
            // Clear the input value and prevent any further processing
            input.value = '';
            event.preventDefault();
            event.stopPropagation();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            navigateHistory('up', input);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            navigateHistory('down', input);
        } else if (event.key === 'Tab') {
            event.preventDefault();
            handleTabCompletion(input);
        } else if (event.key === 'l' && event.ctrlKey) {
            event.preventDefault();
            clearTerminal();
        }
    } catch (error) {
        console.error('Key press handling error:', error);
        addOutput('Error processing command input', 'error');
        addOutput('🧅 Even ogres make mistakes sometimes!', 'warning');
        showNewPrompt();
    }
}

// Check if command handles its own prompt display
function commandHandlesOwnPrompt(command) {
    var cmd = command.split(' ')[0].toLowerCase();
    var asyncCommands = ['dd', 'ping', 'yum', 'clear', 'ssh'];
    return asyncCommands.includes(cmd);
}

// Improved command history management
function addToCommandHistory(command) {
    commandHistory.push(command);
    historyIndex = commandHistory.length;
    
    // Limit history size to prevent memory issues
    if (commandHistory.length > 1000) {
        commandHistory = commandHistory.slice(-500);
        historyIndex = commandHistory.length;
    }
}

function navigateHistory(direction, input) {
    if (direction === 'up' && historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
    } else if (direction === 'down') {
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            input.value = '';
        }
    }
}

function handleTabCompletion(input) {
    var partial = input.value;
    var completions = getTabCompletions(partial);
    
    if (completions.length === 1) {
        input.value = completions[0];
    } else if (completions.length > 1) {
        replaceInputWithCommand(getPromptString() + ' ' + partial);
        var output = '';
        for (var i = 0; i < completions.length; i++) {
            output += completions[i].split(' ').pop() + '  ';
        }
        addOutput(output.trim());
        showNewPrompt();
        input.value = partial;
    }
}

function replaceInputWithCommand(text) {
    // Remove the current input line more specifically
    var terminal = document.getElementById('terminal-output');
    var inputLines = terminal.querySelectorAll('.input-line');
    
    // Remove the last input line (the one the user just typed in)
    if (inputLines.length > 0) {
        var lastInputLine = inputLines[inputLines.length - 1];
        if (lastInputLine && lastInputLine.parentNode) {
            lastInputLine.parentNode.removeChild(lastInputLine);
        }
    }
    
    // Add the command as output with original prompt styling
    addOutput(text);
}

function getTabCompletions(partial) {
    var completions = [];
    
    if (!partial.includes(' ')) {
        completions = availableCommands.filter(function(cmd) {
            return cmd.startsWith(partial);
        });
    } else {
        var parts = partial.split(' ');
        var lastPart = parts[parts.length - 1];
        var currentFS = getCurrentFileSystem();
        var dirContent = currentFS[currentDir];
        
        if (dirContent) {
            var files = Object.keys(dirContent);
            completions = files.filter(function(file) {
                return file.startsWith(lastPart);
            }).map(function(file) {
                return parts.slice(0, -1).join(' ') + ' ' + file;
            });
        }
    }
    
    return completions;
}

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
    var sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        // Use event delegation for better performance and reliability
        sidebar.addEventListener('click', function(event) {
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
        case 'k8s': return k8sFileSystem;
        case 'centos': return centosFileSystem;
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
    var terminal = document.getElementById('terminal-output');
    
    // Check if there's already an active input line and remove it
    var existingInputs = terminal.querySelectorAll('.input-line');
    existingInputs.forEach(function(inputLine) {
        if (inputLine.parentNode) {
            inputLine.parentNode.removeChild(inputLine);
        }
    });
    
    // Small delay to prevent race conditions
    setTimeout(function() {
        // Double-check no input lines exist
        var remainingInputs = terminal.querySelectorAll('.input-line');
        remainingInputs.forEach(function(inputLine) {
            if (inputLine.parentNode) {
                inputLine.parentNode.removeChild(inputLine);
            }
        });
        
        // Create a new input line and add it to the terminal
        var newInputLine = document.createElement('div');
        newInputLine.className = 'input-line';
        newInputLine.innerHTML = '<span class="prompt">' + getPromptString() + '</span><input type="text" class="command-input" autocomplete="off">';
        
        terminal.appendChild(newInputLine);
        
        // Focus the new input and set up event handler
        var newInput = newInputLine.querySelector('.command-input');
        if (newInput) {
            newInput.focus();
            newInput.addEventListener('keydown', handleMainKeyPress);
            // Clear any residual value
            newInput.value = '';
        }
        
        scrollToBottom();
        updatePrompt();
    }, 10);
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
            // Removed the duplicate green flag message - flag is already visible in logs
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
        
        // Clear any initial value that might cause duplicate execution
        mainInput.value = '';
    } else {
        // Fallback: if no main input found, look for any command input
        var anyInput = document.querySelector('.command-input');
        if (anyInput) {
            anyInput.removeEventListener('keydown', handleMainKeyPress);
            anyInput.addEventListener('keydown', handleMainKeyPress);
            anyInput.focus();
            anyInput.value = '';
        }
    }
}

// Initialize on page load with proper error handling
window.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize tab functionality
        initializeTabs();
        
        // Setup command input handling for the existing input in HTML
        setupCommandInput();
        
        // Setup focus management
        maintainInputFocus();
        
        // Update progress displays
        updateCtfProgress();
        updateTaskProgress();
        updatePrompt();
        
        // DON'T call showNewPrompt() here - use the existing prompt from HTML
        
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