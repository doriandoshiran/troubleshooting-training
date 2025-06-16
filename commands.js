// Command execution and handling

// Handle key press events for main input
function handleMainKeyPress(event) {
    var input = document.getElementById('main-command-input');
    
    if (event.key === 'Enter') {
        var command = input.value.trim();
        if (command) {
            // Show the command on the current line by replacing the input
            replaceInputWithCommand(getPromptString() + ' ' + command);
            executeCommand(command);
            commandHistory.push(command);
            historyIndex = commandHistory.length;
        } else {
            // Just show empty prompt if no command
            replaceInputWithCommand(getPromptString());
            showNewPrompt();
        }
        input.value = '';
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        }
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            input.value = '';
        }
    } else if (event.key === 'Tab') {
        event.preventDefault();
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
}

function replaceInputWithCommand(text) {
    // Remove the current input line
    var inputLine = document.querySelector('.input-line');
    if (inputLine && inputLine.parentNode) {
        inputLine.parentNode.removeChild(inputLine);
    }
    
    // Add the command as output
    addOutput(text, 'info');
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

// Execute command function
function executeCommand(command) {
    var parts = command.split(' ');
    var cmd = parts[0];
    var args = parts.slice(1);
    
    switch (cmd.toLowerCase()) {
        case 'start':
            startTraining();
            break;
        case 'help':
            showHelp();
            break;
        case 'ssh':
            connectToHost(args);
            break;
        case 'exit':
        case 'logout':
            disconnectFromHost();
            break;
        case 'ls':
            if (currentHost === 'jumphost') {
                addOutput('bash: ls: command not found on jumphost', 'error');
            } else {
                listFiles(args);
            }
            break;
        case 'cd':
            if (currentHost === 'jumphost') {
                addOutput('bash: cd: command not found on jumphost', 'error');
            } else {
                changeDirectory(args[0]);
            }
            break;
        case 'cat':
            if (currentHost === 'jumphost') {
                addOutput('bash: cat: command not found on jumphost', 'error');
            } else {
                viewFile(args[0]);
            }
            break;
        case 'vi':
        case 'vim':
        case 'nano':
            if (currentHost === 'jumphost') {
                addOutput('bash: ' + cmd + ': command not found on jumphost', 'error');
            } else {
                editFile(args[0]);
            }
            break;
        case 'pwd':
            if (currentHost === 'jumphost') {
                addOutput('/home/training');
            } else {
                addOutput(currentDir);
            }
            break;
        case 'clear':
            clearTerminal();
            break;
        case 'kubectl':
            if (currentHost === 'k8s') {
                executeKubectl(args);
            } else {
                addOutput('kubectl: command not found', 'error');
            }
            break;
        case 'systemctl':
            if (currentHost === 'centos') {
                executeSystemctl(args);
            } else {
                addOutput('systemctl: command not found', 'error');
            }
            break;
        case 'firewall-cmd':
            if (currentHost === 'centos') {
                executeFirewallCmd(args);
            } else {
                addOutput('firewall-cmd: command not found', 'error');
            }
            break;
        case 'yum':
            if (currentHost === 'centos') {
                executeYum(args);
            } else {
                addOutput('yum: command not found', 'error');
            }
            break;
        case 'free':
            if (currentHost !== 'jumphost') {
                executeFree(args);
            } else {
                addOutput('free: command not found on jumphost', 'error');
            }
            break;
        case 'df':
            if (currentHost !== 'jumphost') {
                executeDf(args);
            } else {
                addOutput('df: command not found on jumphost', 'error');
            }
            break;
        case 'dd':
            if (currentHost === 'centos') {
                executeDd(args);
                return; // Don't show prompt immediately
            } else {
                addOutput('dd: command not found', 'error');
            }
            break;
        case 'mkswap':
            if (currentHost === 'centos') {
                executeMkswap(args);
            } else {
                addOutput('mkswap: command not found', 'error');
            }
            break;
        case 'swapon':
            if (currentHost === 'centos') {
                executeSwapon(args);
            } else {
                addOutput('swapon: command not found', 'error');
            }
            break;
        case 'ping':
            if (currentHost !== 'jumphost') {
                executePing(args);
                return; // Don't show prompt immediately
            } else {
                addOutput('ping: command not found on jumphost', 'error');
            }
            break;
        default:
            addOutput('bash: ' + cmd + ': command not found', 'error');
    }
    
    showNewPrompt();
}

// Connection commands
function connectToHost(args) {
    if (args.length === 0) {
        addOutput('Usage: ssh root@[hostname]', 'error');
        addOutput('');
        addOutput('Available hosts:', 'info');
        addOutput('  root@prod-centos-01.company.local  - CentOS 7.9 system preparation');
        addOutput('  root@k8s-master-01.company.local   - Kubernetes cluster troubleshooting');
        return;
    }
    
    var target = args[0];
    var hostname = target.includes('@') ? target.split('@')[1] : target;
    
    if (hostname === 'prod-centos-01.company.local' || hostname === 'prod-centos-01') {
        addOutput('Connecting to prod-centos-01.company.local...', 'info');
        addOutput('Welcome to CentOS Linux 7.9.2009 (Core)', 'success');
        addOutput('');
        if (!connectedHosts.has('centos')) {
            addOutput('🎯 SYSTEM PREPARATION TASKS:', 'warning');
            addOutput('1. Configure firewall (open required ports)');
            addOutput('2. Create and configure 8GB swap file');
            addOutput('3. Setup NTP time synchronization');
            addOutput('5. Install required system packages');
            addOutput('6. Configure platform for single-node deployment');
            addOutput('');
            addOutput('Type "help" for available commands.', 'info');
            connectedHosts.add('centos');
        }
        currentHost = 'centos';
        currentDir = '/root';
    } else if (hostname === 'k8s-master-01.company.local' || hostname === 'k8s-master-01') {
        addOutput('Connecting to k8s-master-01.company.local...', 'info');
        addOutput('Warning: Production Kubernetes cluster!', 'warning');
        addOutput('');
        if (!connectedHosts.has('k8s')) {
            addOutput('🚨 CRITICAL ISSUES DETECTED:', 'error');
            addOutput('• webapp-deployment pod keeps crashing');
            addOutput('• database-pv-claim stuck in Pending status');
            addOutput('• nginx-service has connectivity problems');
            addOutput('');
            addOutput('🔍 Your mission: Find 3 flags hidden in logs and configurations!', 'success');
            addOutput('Use kubectl commands to investigate. Type "help" for guidance.', 'info');
            connectedHosts.add('k8s');
        }
        currentHost = 'k8s';
        currentDir = '/root';
        systemState.k8s.connected = true;
    } else {
        addOutput('ssh: Could not resolve hostname ' + hostname, 'error');
        return;
    }
    
    updatePrompt();
}

function startTraining() {
    addOutput('');
    addOutput('╔══════════════════════════════════════════════════════════════════════════════╗', 'info');
    addOutput('║                        ACME Corporation Training Program                     ║', 'info');
    addOutput('║                                                                              ║', 'info');
    addOutput('║  Welcome to the Infrastructure Security Training Environment               ║', 'info');
    addOutput('║                                                                              ║', 'info');
    addOutput('║  Available Training Hosts:                                                  ║', 'info');
    addOutput('║                                                                              ║', 'info');
    addOutput('║  🖥️  prod-centos-01.acme.local    - CentOS 7.9 system preparation          ║', 'info');
    addOutput('║      • Configure firewall and network security                              ║', 'info');
    addOutput('║      • Setup swap, NTP, and system services                                 ║', 'info');
    addOutput('║      • Install and configure enterprise platform                           ║', 'info');
    addOutput('║                                                                              ║', 'info');
    addOutput('║  ☸️  k8s-master-01.acme.local     - Kubernetes troubleshooting             ║', 'info');
    addOutput('║      • Investigate pod crashes and service issues                          ║', 'info');
    addOutput('║      • Debug storage and networking problems                                ║', 'info');
    addOutput('║      • Find hidden security flags in logs (CTF challenges)                 ║', 'info');
    addOutput('║                                                                              ║', 'info');
    addOutput('║  Training Objectives:                                                       ║', 'info');
    addOutput('║  • Master Linux system administration skills                                ║', 'info');
    addOutput('║  • Learn Kubernetes troubleshooting techniques                             ║', 'info');
    addOutput('║  • Develop security incident investigation abilities                        ║', 'info');
    addOutput('║  • Practice with real-world enterprise scenarios                           ║', 'info');
    addOutput('║                                                                              ║', 'info');
    addOutput('║  Connection Instructions:                                                    ║', 'info');
    addOutput('║  ssh root@prod-centos-01.acme.local    (System preparation)               ║', 'info');
    addOutput('║  ssh root@k8s-master-01.acme.local     (Kubernetes troubleshooting)       ║', 'info');
    addOutput('║                                                                              ║', 'info');
    addOutput('╚══════════════════════════════════════════════════════════════════════════════╝', 'info');
    addOutput('');
    addOutput('Training environment initialized. Choose a host to begin:', 'success');
    addOutput('');
}

function disconnectFromHost() {
    if (currentHost === 'jumphost') {
        addOutput('You are already on the jumphost.', 'warning');
        return;
    }
    
    addOutput('Connection to ' + getPromptHost() + '.acme.local closed.', 'info');
    currentHost = 'jumphost';
    currentDir = '/root';
    updatePrompt();
}

function showHelp() {
    if (currentHost === 'jumphost') {
        addOutput('ACME Training Environment Help:', 'info');
        addOutput('');
        addOutput('Getting Started:', 'success');
        addOutput('  start                    - Show training overview and available hosts');
        addOutput('  ssh root@[hostname]      - Connect to remote host');
        addOutput('');
        addOutput('Available Hosts:', 'success');
        addOutput('  prod-centos-01.acme.local  - CentOS system preparation');
        addOutput('  k8s-master-01.acme.local   - Kubernetes troubleshooting');
        addOutput('');
        addOutput('Basic Commands:', 'success');
        addOutput('  help                     - Show this help');
        addOutput('  clear                    - Clear terminal');
        addOutput('');
        addOutput('Begin by typing "start" to see the full training overview.');
    } else if (currentHost === 'k8s') {
        addOutput('Kubernetes Troubleshooting Commands:', 'info');
        addOutput('');
        addOutput('Connection Commands:', 'success');
        addOutput('  exit/logout              - Return to jumphost');
        addOutput('');
        addOutput('Kubernetes Commands:', 'success');
        addOutput('  kubectl get [resource]   - List resources (pods, services, pvc, events)');
        addOutput('  kubectl describe [type] [name] - Get detailed info');
        addOutput('  kubectl logs [pod-name]  - View pod logs');
        addOutput('');
        addOutput('System Commands:', 'success');
        addOutput('  ls [-la]                 - List files');
        addOutput('  cat [file]               - View file contents');
        addOutput('  cd [directory]           - Change directory');
        addOutput('  pwd                      - Show current directory');
        addOutput('  clear                    - Clear terminal');
        addOutput('');
        addOutput('🚩 Find 3 flags hidden in logs and configurations!');
    } else if (currentHost === 'centos') {
        addOutput('CentOS System Administration Commands:', 'info');
        addOutput('');
        addOutput('Connection Commands:', 'success');
        addOutput('  exit/logout              - Return to jumphost');
        addOutput('');
        addOutput('System Commands:', 'success');
        addOutput('  ls [-la]                 - List files and directories');
        addOutput('  cd [directory]           - Change directory');
        addOutput('  cat [file]               - Display file contents');
        addOutput('  vi [file]                - Edit file');
        addOutput('  pwd                      - Show current directory');
        addOutput('  clear                    - Clear terminal');
        addOutput('');
        addOutput('System Administration:', 'success');
        addOutput('  systemctl [action] [service] - Manage services');
        addOutput('  firewall-cmd [options]       - Configure firewall');
        addOutput('  yum [command] [package]      - Package management');
        addOutput('  free [-h]                    - Show memory usage');
        addOutput('  df [-h]                      - Show disk usage');
        addOutput('');
        addOutput('Storage Commands:', 'success');
        addOutput('  dd                       - Create files/swap');
        addOutput('  mkswap [file]            - Setup swap file');
        addOutput('  swapon [file]            - Enable swap');
        addOutput('');
        addOutput('Research commands online for proper syntax and usage!');
    }
}