// Command execution and handling

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
            
            // Hidden flag for easter egg discovery
            addOutput('');
            addOutput('DEBUG: HIDDEN_FLAG{OGRE_MODE_DISCOVERED}', 'info');
            addOutput('');
            return;
        }
        
        if (cmd.toLowerCase() === 'fiona') {
            addOutput('👸 "I\'d like to know that myself!" 👸', 'success');
            addOutput('');
            addOutput('Princess Fiona\'s IT wisdom:', 'info');
            addOutput('• "I\'m not afraid!" - When pushing to production on Friday', 'info');
            addOutput('• "What\'s that supposed to mean?" - Reading legacy code', 'warning');
            addOutput('• "Better ogre than never!" - Embracing technical debt', 'info');
            addOutput('');
            addOutput('💚 Stay strong, beautiful admin! 💚', 'success');
            
            // Hidden flag for finding Fiona
            addOutput('');
            addOutput('DEBUG: HIDDEN_FLAG{PRINCESS_FIONA_FOUND}', 'info');
            addOutput('');
            return;
        }
        
        if (cmd.toLowerCase() === 'farquaad') {
            addOutput('👑 "Some of you may die, but that\'s a sacrifice I\'m willing to make!" 👑', 'warning');
            addOutput('');
            addOutput('Lord Farquaad\'s management style:', 'warning');
            addOutput('• "Mirror, mirror on the wall..." - Checking monitoring dashboards', 'info');
            addOutput('• "Perfect!" - When the demo works but production doesn\'t', 'warning');
            addOutput('• "I\'m not a monster!" - After breaking production', 'error');
            addOutput('');
            addOutput('🏰 Management detected - proceed with caution! 🏰', 'warning');
            
            // Hidden flag for the villain
            addOutput('');
            addOutput('DEBUG: HIDDEN_FLAG{LORD_FARQUAAD_SUMMONED}', 'info');
            addOutput('');
            return;
        }
        
        // Handle async commands that need special timing
        var asyncCommands = ['dd', 'ping', 'yum', 'ssh'];
        if (asyncCommands.includes(cmd.toLowerCase())) {
            return executeAsyncCommand(cmd.toLowerCase(), args);
        }
        
        switch (cmd.toLowerCase()) {
            case 'start':
                startTraining();
                break;
            case 'help':
                showHelp();
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
                    editFile(args[0], cmd);
                }
                break;
            case 'pwd':
                if (currentHost === 'jumphost') {
                    addOutput('/home/acme-training');
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
                return 'no_prompt'; // Don't call showNewPrompt - clearTerminal handles it
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
                var result = executeDd(args);
                return result; // executeDd returns 'async' for valid commands, null for invalid
            } else {
                addOutput('dd: command not found', 'error');
                addOutput('🔄 DD command only available on CentOS!', 'warning');
                return null; // Show prompt immediately for this error case
            }
        case 'ping':
            if (currentHost !== 'jumphost') {
                return executePing(args);
                // Don't show prompt immediately - executePing handles timing
            } else {
                addOutput('ping: command not found on jumphost', 'error');
                addOutput('🏓 No ping-pong on this jumphost!', 'warning');
                return null;
            }
        case 'yum':
            if (currentHost === 'centos') {
                return executeYum(args);
                // executeYum handles its own timing
            } else {
                addOutput('yum: command not found', 'error');
                addOutput('🍰 No yum-yum here, only on CentOS!', 'warning');
                return null;
            }
        case 'ssh':
            return connectToHost(args);
    }
    return null;
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

// Connection commands with delays
function connectToHost(args) {
    if (args.length === 0) {
        addOutput('Usage: ssh root@[hostname]', 'error');
        addOutput('');
        addOutput('Available hosts:', 'info');
        addOutput('  root@prod-centos-01.company.local  - CentOS 7.9 system preparation');
        addOutput('  root@k8s-master-01.company.local   - Kubernetes cluster troubleshooting');
        addOutput('');
        addOutput('🧅 Choose your swamp... I mean, server!', 'success');
        return 'async';
    }
    
    var target = args[0];
    var hostname = target.includes('@') ? target.split('@')[1] : target;
    
    if (hostname === 'prod-centos-01.company.local' || hostname === 'prod-centos-01') {
        addOutput('Connecting to prod-centos-01.company.local...', 'info');
        
        setTimeout(function() {
            addOutput('🔐 Authenticating with SSH keys...', 'info');
            
            setTimeout(function() {
                addOutput('Welcome to CentOS Linux 7.9.2009 (Core)', 'success');
                addOutput('🧅 "Welcome to my swamp!" - Shrek (probably)', 'success');
                addOutput('');
                currentHost = 'centos';
                currentDir = '/root';
                updatePrompt();
                showNewPrompt();
            }, 1500);
        }, 1000);
        return 'async';
        
    } else if (hostname === 'k8s-master-01.company.local' || hostname === 'k8s-master-01') {
        addOutput('Connecting to k8s-master-01.company.local...', 'info');
        
        setTimeout(function() {
            addOutput('🔐 Authenticating with SSH keys...', 'info');
            
            setTimeout(function() {
                addOutput('⚠️  Warning: Production Kubernetes cluster!', 'warning');
                addOutput('');
                currentHost = 'k8s';
                currentDir = '/root';
                systemState.k8s.connected = true;
                updatePrompt();
                showNewPrompt();
            }, 1500);
        }, 1000);
        return 'async';
        
    } else {
        addOutput('ssh: Could not resolve hostname ' + hostname, 'error');
        
        // Fun responses for wrong hostnames
        if (hostname.toLowerCase().includes('swamp')) {
            addOutput('🧅 Nice try, but Shrek\'s swamp is not a valid hostname!', 'warning');
        } else {
            addOutput('💡 Double-check the hostname - available hosts are listed above!', 'info');
        }
        return 'async';
    }
}

function startTraining() {
    // Prevent duplicate execution by checking if we recently showed this
    var now = Date.now();
    if (window.lastStartTime && (now - window.lastStartTime) < 2000) {
        return; // Don't show again if called within 2 seconds
    }
    window.lastStartTime = now;
    
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
        addOutput('  vi/nano [file]           - Edit file');
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