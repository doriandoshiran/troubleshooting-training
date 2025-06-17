// Command execution and handling

// Enhanced key press handler with better error handling
function handleMainKeyPress(event) {
    try {
        var input = event.target;
        
        if (event.key === 'Enter') {
            var command = input.value.trim();
            if (command) {
                // Show the command on the current line by replacing the input
                replaceInputWithCommand(getPromptString() + ' ' + command);
                executeCommand(command);
                addToCommandHistory(command);
                // Only show new prompt if command doesn't handle it
                if (!commandHandlesOwnPrompt(command)) {
                    showNewPrompt();
                }
            } else {
                // Just show empty prompt if no command
                replaceInputWithCommand(getPromptString());
                showNewPrompt();
            }
            input.value = '';
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
    var asyncCommands = ['dd', 'ping', 'yum', 'clear', 'start'];
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
    // Remove the current input line
    var inputLine = document.querySelector('.input-line:last-child');
    if (inputLine && inputLine.parentNode) {
        inputLine.parentNode.removeChild(inputLine);
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

// Enhanced command execution with better error handling and easter eggs
function executeCommand(command) {
    try {
        var parts = command.split(' ');
        var cmd = parts[0];
        var args = parts.slice(1);
        
        // Easter egg commands first!
        if (cmd.toLowerCase() === 'shrek') {
            addOutput('🧅 "WHAT ARE YOU DOING IN MY SWAMP?!" 🧅', 'success');
            addOutput('');
            addOutput('Shrek says: "Better out than in!" - Always check your logs!', 'info');
            addOutput('"Ogres are like onions... they have layers!" - Just like your network stack!', 'info');
            addOutput('"This is the part where you run away!" - When you see the production deployment!', 'warning');
            addOutput('');
            addOutput('🟢 Now get back to work, you beautiful ogre! 🟢', 'success');
            return;
        }
        
        if (cmd.toLowerCase() === 'donkey') {
            addOutput('🐴 "I\'m a believer! I couldn\'t leave her if I tried!" 🐴', 'success');
            addOutput('');
            addOutput('Donkey wisdom for sysadmins:', 'info');
            addOutput('• "Are we there yet?" - Every deployment status check', 'info');
            addOutput('• "Pick me! Pick me!" - When volunteering for on-call duty', 'info');
            addOutput('• "That\'ll do, Shrek!" - After a successful rollback', 'info');
            addOutput('');
            addOutput('🎵 Now get back to work, you beautiful, loyal sidekick! 🎵', 'success');
            return;
        }
        
        if (cmd.toLowerCase() === 'meme' || cmd.toLowerCase() === 'memes') {
            addOutput('🎭 MEME COMMAND ACTIVATED! 🎭', 'success');
            addOutput('');
            addOutput('Popular dev memes:', 'info');
            addOutput('• "It works on my machine!" 🖥️', 'warning');
            addOutput('• "Just one more commit..." 🔄', 'warning');
            addOutput('• "I\'ll fix it in production" 🔥', 'error');
            addOutput('• "Why did it break? I didn\'t change anything!" 🤔', 'warning');
            addOutput('');
            addOutput('Shrek dev meme: "Debugging is like onions - it has layers!" 🧅', 'success');
            return;
        }
        
        if (cmd.toLowerCase() === 'ogre') {
            addOutput('🧅 OGRE MODE ACTIVATED! 🧅', 'success');
            addOutput('');
            addOutput('You are now thinking like an ogre!', 'info');
            addOutput('Remember: Ogres have layers, just like good architecture!', 'warning');
            addOutput('');
            addOutput('Current ogre stats:', 'info');
            addOutput('• Grumpiness: Maximum 😤', 'warning');
            addOutput('• Layer complexity: Expert level 🧅', 'success');
            addOutput('• Swamp security: Fortress mode 🏰', 'success');
            addOutput('• Onion knowledge: Legendary 🌟', 'success');
            return;
        }
        
        // Handle async commands that need special timing
        var asyncCommands = ['dd', 'ping', 'yum'];
        if (asyncCommands.includes(cmd.toLowerCase())) {
            executeAsyncCommand(cmd.toLowerCase(), args);
            return; // Don't call showNewPrompt here - async commands handle their own timing
        }
        
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
                    addOutput('🦘 This jumphost is more limited than Shrek\'s social circle!', 'warning');
                } else {
                    try {
                        if (typeof listFiles === 'function') {
                            listFiles(args);
                        } else {
                            addOutput('Error: listFiles function not found', 'error');
                            addOutput('🧅 This is more broken than Shrek\'s morning routine!', 'warning');
                        }
                    } catch (error) {
                        console.error('ls command error:', error);
                        addOutput('Error: ls command failed - ' + error.message, 'error');
                    }
                }
                break;
            case 'cd':
                if (currentHost === 'jumphost') {
                    addOutput('bash: cd: command not found on jumphost', 'error');
                    addOutput('🦘 You\'re stuck here like Fiona in her tower!', 'warning');
                } else {
                    try {
                        if (typeof changeDirectory === 'function') {
                            changeDirectory(args[0]);
                        } else {
                            addOutput('Error: changeDirectory function not found', 'error');
                        }
                    } catch (error) {
                        console.error('cd command error:', error);
                        addOutput('Error: cd command failed - ' + error.message, 'error');
                    }
                }
                break;
            case 'cat':
                if (currentHost === 'jumphost') {
                    addOutput('bash: cat: command not found on jumphost', 'error');
                    addOutput('🐱 No cats on this jumphost, only jumping!', 'warning');
                } else {
                    try {
                        if (typeof viewFile === 'function') {
                            viewFile(args[0]);
                        } else {
                            addOutput('Error: viewFile function not found', 'error');
                        }
                    } catch (error) {
                        console.error('cat command error:', error);
                        addOutput('Error: cat command failed - ' + error.message, 'error');
                    }
                }
                break;
            case 'vi':
            case 'vim':
            case 'nano':
                if (currentHost === 'jumphost') {
                    addOutput('bash: ' + cmd + ': command not found on jumphost', 'error');
                    addOutput('📝 No text editors here - this jumphost is more basic than Shrek\'s cooking!', 'warning');
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
            case 'whoami':
                if (currentHost === 'jumphost') {
                    addOutput('training');
                } else {
                    addOutput('root');
                }
                addOutput('🧅 You are an ogre... I mean, a sysadmin with layers!', 'success');
                break;
            case 'clear':
                clearTerminal();
                return; // Don't call showNewPrompt - clearTerminal handles it
            case 'kubectl':
                if (currentHost === 'k8s') {
                    executeKubectl(args);
                } else {
                    addOutput('kubectl: command not found', 'error');
                    addOutput('⚓ No kubectl here - you\'re not in Kubernetes land!', 'warning');
                }
                break;
            case 'systemctl':
                if (currentHost === 'centos') {
                    executeSystemctl(args);
                } else {
                    addOutput('systemctl: command not found', 'error');
                    addOutput('⚙️ systemctl is only available on the CentOS host!', 'info');
                }
                break;
            case 'firewall-cmd':
                if (currentHost === 'centos') {
                    executeFirewallCmd(args);
                } else {
                    addOutput('firewall-cmd: command not found', 'error');
                    addOutput('🔥 No firewall commands here - connect to CentOS first!', 'warning');
                }
                break;
            case 'free':
                if (currentHost !== 'jumphost') {
                    executeFree(args);
                } else {
                    addOutput('free: command not found on jumphost', 'error');
                    addOutput('💰 Nothing is free on the jumphost!', 'warning');
                }
                break;
            case 'df':
                if (currentHost !== 'jumphost') {
                    executeDf(args);
                } else {
                    addOutput('df: command not found on jumphost', 'error');
                    addOutput('💾 No disk info on this simple jumphost!', 'warning');
                }
                break;
            case 'mkswap':
                if (currentHost === 'centos') {
                    executeMkswap(args);
                } else {
                    addOutput('mkswap: command not found', 'error');
                    addOutput('🔄 Swap creation only available on CentOS!', 'info');
                }
                break;
            case 'swapon':
                if (currentHost === 'centos') {
                    executeSwapon(args);
                } else {
                    addOutput('swapon: command not found', 'error');
                    addOutput('🔄 Swap management only on CentOS!', 'info');
                }
                break;
            case 'history':
                showCommandHistory();
                break;
            case 'date':
                var now = new Date();
                addOutput(now.toString());
                addOutput('⏰ Time flies when you\'re having fun with Linux!', 'info');
                break;
            case 'uptime':
                var uptime = Math.floor(Math.random() * 100) + 1;
                addOutput('up ' + uptime + ' days, load average: 0.5, 0.3, 0.1');
                break;
            default:
                addOutput('bash: ' + cmd + ': command not found', 'error');
                
                // Fun responses for common typos
                if (cmd.toLowerCase().includes('shek') || cmd.toLowerCase().includes('shre')) {
                    addOutput('🧅 Did you mean "shrek"? Type it correctly to meet the ogre!', 'warning');
                } else if (cmd.toLowerCase().includes('help') || cmd.toLowerCase() === '?') {
                    addOutput('💡 Try typing "help" for available commands!', 'info');
                } else if (cmd.toLowerCase().includes('sudo')) {
                    addOutput('🔒 You\'re already root - no sudo needed! "With great power comes great responsibility!"', 'warning');
                } else {
                    // Random fun responses
                    var funResponses = [
                        '🧅 "That command is as real as Shrek\'s beauty routine!"',
                        '💡 "Like layers of an onion, try peeling back to basic commands!"',
                        '🐴 "Even Donkey knows that command doesn\'t exist!"'
                    ];
                    var randomResponse = funResponses[Math.floor(Math.random() * funResponses.length)];
                    addOutput(randomResponse, 'warning');
                }
        }
        
    } catch (error) {
        console.error('Command execution error:', error);
        addOutput('Error executing command: ' + command, 'error');
        addOutput('🧅 Something went wrong - even ogres have bad days!', 'warning');
    }
}

// Handle async commands that need special timing control
function executeAsyncCommand(cmd, args) {
    switch (cmd) {
        case 'dd':
            if (currentHost === 'centos') {
                executeDd(args);
                // Don't show prompt immediately - executeDd handles timing
            } else {
                addOutput('dd: command not found', 'error');
                addOutput('🔄 DD command only available on CentOS!', 'warning');
                showNewPrompt();
            }
            break;
        case 'ping':
            if (currentHost !== 'jumphost') {
                executePing(args);
                // Don't show prompt immediately - executePing handles timing
            } else {
                addOutput('ping: command not found on jumphost', 'error');
                addOutput('🏓 No ping-pong on this jumphost!', 'warning');
                showNewPrompt();
            }
            break;
        case 'yum':
            if (currentHost === 'centos') {
                executeYum(args);
                // executeYum handles its own timing
            } else {
                addOutput('yum: command not found', 'error');
                addOutput('🍰 No yum-yum here, only on CentOS!', 'warning');
                showNewPrompt();
            }
            break;
    }
}

function showCommandHistory() {
    if (commandHistory.length === 0) {
        addOutput('No commands in history');
        addOutput('🧅 Your history is as empty as Shrek\'s social calendar!', 'warning');
        return;
    }
    
    var start = Math.max(0, commandHistory.length - 50); // Show last 50 commands
    for (var i = start; i < commandHistory.length; i++) {
        addOutput((i + 1) + '  ' + commandHistory[i]);
    }
    addOutput('');
    addOutput('📜 Your command history - a tale of triumph and occasional typos!', 'info');
}

// Connection commands
function connectToHost(args) {
    if (args.length === 0) {
        addOutput('Usage: ssh root@[hostname]', 'error');
        addOutput('');
        addOutput('Available hosts:', 'info');
        addOutput('  root@prod-centos-01.company.local  - CentOS 7.9 system preparation');
        addOutput('  root@k8s-master-01.company.local   - Kubernetes cluster troubleshooting');
        addOutput('');
        addOutput('🧅 Choose your swamp... I mean, server!', 'success');
        return;
    }
    
    var target = args[0];
    var hostname = target.includes('@') ? target.split('@')[1] : target;
    
    if (hostname === 'prod-centos-01.company.local' || hostname === 'prod-centos-01') {
        addOutput('Connecting to prod-centos-01.company.local...', 'info');
        addOutput('🔐 Authenticating with SSH keys...', 'info');
        addOutput('Welcome to CentOS Linux 7.9.2009 (Core)', 'success');
        addOutput('🧅 "Welcome to my swamp!" - Shrek (probably)', 'success');
        addOutput('');
        currentHost = 'centos';
        currentDir = '/root';
    } else if (hostname === 'k8s-master-01.company.local' || hostname === 'k8s-master-01') {
        addOutput('Connecting to k8s-master-01.company.local...', 'info');
        addOutput('🔐 Authenticating with SSH keys...', 'info');
        addOutput('⚠️  Warning: Production Kubernetes cluster!', 'warning');
        addOutput('');
        currentHost = 'k8s';
        currentDir = '/root';
        systemState.k8s.connected = true;
    } else {
        addOutput('ssh: Could not resolve hostname ' + hostname, 'error');
        
        // Fun responses for wrong hostnames
        if (hostname.toLowerCase().includes('swamp')) {
            addOutput('🧅 Nice try, but Shrek\'s swamp is not a valid hostname!', 'warning');
        } else {
            addOutput('💡 Double-check the hostname - available hosts are listed above!', 'info');
        }
        return;
    }
    
    updatePrompt();
}

function startTraining() {
    addOutput('╔══════════════════════════════════════════════════════════════════════════════╗', 'info');
    addOutput('║                        ACME Corporation Training Program                     ║', 'info');
    addOutput('║                                                                              ║', 'info');
    addOutput('║  Welcome to the Infrastructure Security Training Environment               ║', 'info');
    addOutput('║                                                                              ║', 'info');
    addOutput('║  Available Training Hosts:                                                  ║', 'info');
    addOutput('║                                                                              ║', 'info');
    addOutput('║  🖥️  prod-centos-01.company.local    - CentOS 7.9 system preparation       ║', 'info');
    addOutput('║      • Configure firewall and network security                              ║', 'info');
    addOutput('║      • Setup swap, NTP, and system services                                 ║', 'info');
    addOutput('║      • Install and configure enterprise platform                           ║', 'info');
    addOutput('║                                                                              ║', 'info');
    addOutput('║  ☸️  k8s-master-01.company.local     - Kubernetes troubleshooting          ║', 'info');
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
    addOutput('║  ssh root@prod-centos-01.company.local    (System preparation)            ║', 'info');
    addOutput('║  ssh root@k8s-master-01.company.local     (Kubernetes troubleshooting)    ║', 'info');
    addOutput('║                                                                              ║', 'info');
    addOutput('╚══════════════════════════════════════════════════════════════════════════════╝', 'info');
    addOutput('Training environment initialized. Choose a host to begin:', 'success');
}

function disconnectFromHost() {
    if (currentHost === 'jumphost') {
        addOutput('You are already on the jumphost.', 'warning');
        addOutput('🦘 You\'re already here - nowhere to disconnect from!', 'info');
        return;
    }
    
    var hostName = getPromptHost();
    addOutput('Connection to ' + hostName + '.company.local closed.', 'info');
    
    if (hostName === 'prod-centos-01') {
        addOutput('🧅 "Farewell! Come back to my swamp anytime!" - Shrek', 'success');
    } else if (hostName === 'k8s-master-01') {
        addOutput('Connection closed.', 'info');
    }
    
    currentHost = 'jumphost';
    currentDir = '/root';
    updatePrompt();
}

function showHelp() {
    if (currentHost === 'jumphost') {
        addOutput('🦘 ACME Training Environment Help:', 'info');
        addOutput('');
        addOutput('Getting Started:', 'success');
        addOutput('  start                    - Show training overview and available hosts');
        addOutput('  ssh root@[hostname]      - Connect to remote host');
        addOutput('');
        addOutput('Available Hosts:', 'success');
        addOutput('  prod-centos-01.company.local  - CentOS system preparation');
        addOutput('  k8s-master-01.company.local   - Kubernetes troubleshooting');
        addOutput('');
        addOutput('Basic Commands:', 'success');
        addOutput('  help                     - Show this help');
        addOutput('  clear                    - Clear terminal');
        addOutput('  history                  - Show command history');
        addOutput('  date                     - Show current date/time');
        addOutput('  uptime                   - Show system uptime');
        addOutput('');
        addOutput('🎭 Fun Commands:', 'warning');
        addOutput('  shrek                    - Meet the ogre!');
        addOutput('  donkey                   - Donkey wisdom');
        addOutput('  meme                     - Developer memes');
        addOutput('  ogre                     - Activate ogre mode');
        addOutput('');
        addOutput('Begin by typing "start" to see the full training overview.', 'info');
        addOutput('🧅 Remember: Like onions, learning has layers!', 'success');
    } else if (currentHost === 'k8s') {
        addOutput('☸️  Kubernetes Troubleshooting Commands:', 'info');
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
        addOutput('  whoami                   - Show current user');
        addOutput('  clear                    - Clear terminal');
        addOutput('  history                  - Show command history');
        addOutput('');
        addOutput('🚩 Find 3 flags hidden in logs and configurations!', 'warning');
    } else if (currentHost === 'centos') {
        addOutput('🐧 CentOS System Administration Commands:', 'info');
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
        addOutput('  whoami                   - Show current user');
        addOutput('  clear                    - Clear terminal');
        addOutput('  history                  - Show command history');
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
        addOutput('Research commands online for proper syntax and usage!', 'info');
        addOutput('🧅 Remember: Good sysadmins are like ogres - they have layers of knowledge!', 'success');
    }
}