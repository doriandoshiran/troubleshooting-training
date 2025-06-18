// System administration commands for CentOS and Kubernetes

function executeSystemctl(args) {
    var action = args[0];
    var service = args[1];
    
    if (!action || !service) {
        addOutput('systemctl: missing arguments', 'error');
        addOutput('Usage: systemctl [start|stop|enable|disable|status] [service]');
        addOutput('🧅 Even ogres need proper syntax!', 'warning');
        return;
    }
    
    if (service === 'ntpd') {
        if (action === 'start') {
            addOutput('Starting ntpd service...', 'info');
            addOutput('🕐 Time sync is important - even Shrek needs to be on time!', 'info');
            setTimeout(function() {
                addOutput('ntpd service started successfully', 'success');
                addOutput('✅ Network Time Protocol daemon is now running', 'success');
                addOutput('✅ Task 3: NTP Configuration - COMPLETED', 'success');
                systemState.centos.ntpConfigured = true;
                completedTasks.add('ntp');
                updateTaskProgress();
                checkAllTasksComplete();
                showNewPrompt();
            }, 1500);
            return 'async';
        } else if (action === 'enable') {
            addOutput('Enabling ntpd service...', 'info');
            addOutput('Created symlink from /etc/systemd/system/multi-user.target.wants/ntpd.service to /usr/lib/systemd/system/ntpd.service', 'success');
            addOutput('✅ ntpd will now start automatically on boot', 'success');
        } else if (action === 'status') {
            if (systemState.centos.ntpConfigured) {
                addOutput('● ntpd.service - Network Time Protocol daemon');
                addOutput('   Loaded: loaded (/usr/lib/systemd/system/ntpd.service; enabled)', 'success');
                addOutput('   Active: active (running) since Mon 2025-06-16 14:30:00 UTC', 'success');
                addOutput('   Main PID: 1234 (ntpd)');
                addOutput('   Status: "synchronised to NTP server (0.centos.pool.ntp.org)"');
                addOutput('🎯 Time sync running perfectly!', 'success');
            } else {
                addOutput('● ntpd.service - Network Time Protocol daemon');
                addOutput('   Loaded: loaded (/usr/lib/systemd/system/ntpd.service; disabled)', 'warning');
                addOutput('   Active: inactive (dead)', 'warning');
                addOutput('💡 Use "systemctl start ntpd" to start the service', 'info');
            }
        } else if (action === 'stop') {
            addOutput('Stopping ntpd service...', 'warning');
            addOutput('ntpd service stopped', 'info');
            systemState.centos.ntpConfigured = false;
            completedTasks.delete('ntp');
            updateTaskProgress();
        }
    } else if (service === 'firewalld') {
        if (action === 'status') {
            addOutput('● firewalld.service - firewalld - dynamic firewall daemon');
            addOutput('   Loaded: loaded (/usr/lib/systemd/system/firewalld.service; enabled)', 'success');
            addOutput('   Active: active (running) since Mon 2025-06-16 14:00:00 UTC', 'success');
            addOutput('   Main PID: 987 (firewalld)');
            addOutput('🔥 Firewall protecting your system!', 'success');
        } else if (action === 'restart') {
            addOutput('Restarting firewalld service...', 'info');
            setTimeout(function() {
                addOutput('firewalld service restarted successfully', 'success');
                showNewPrompt();
            }, 1000);
            return 'async';
        }
    } else if (service === 'sshd') {
        if (action === 'status') {
            addOutput('● sshd.service - OpenSSH server daemon');
            addOutput('   Loaded: loaded (/usr/lib/systemd/system/sshd.service; enabled)', 'success');
            addOutput('   Active: active (running) since Mon 2025-06-16 13:00:00 UTC', 'success');
            addOutput('   Main PID: 123 (sshd)');
            addOutput('🔐 SSH gateway open for secure connections!', 'success');
        }
    } else {
        addOutput('systemctl: unknown service "' + service + '"', 'error');
        addOutput('💡 Common services: ntpd, firewalld, sshd', 'info');
        addOutput('🧅 "Not all services are created equal!" - Shrek wisdom', 'warning');
    }
}

function executeFirewallCmd(args) {
    if (args.length === 0) {
        addOutput('firewall-cmd: missing arguments', 'error');
        addOutput('Usage: firewall-cmd --add-port=PORT/PROTOCOL [--permanent]');
        addOutput('       firewall-cmd --list-ports');
        addOutput('       firewall-cmd --reload');
        addOutput('       firewall-cmd --state');
        addOutput('🔥 Firewall commands need proper arguments!', 'warning');
        return;
    }
    
    var command = args.join(' ');
    
    if (command.includes('--add-port=')) {
        var portMatch = command.match(/--add-port=(\d+\/tcp|\d+\/udp)/);
        if (portMatch) {
            var port = portMatch[1];
            addOutput('success', 'success');
            
            // Track opened ports
            if (!systemState.centos.openPorts) {
                systemState.centos.openPorts = [];
            }
            if (!systemState.centos.openPorts.includes(port)) {
                systemState.centos.openPorts.push(port);
            }
            
            if (command.includes('--permanent')) {
                addOutput('✅ Port ' + port + ' added permanently to firewall', 'success');
                addOutput('🔒 This rule will survive reboots!', 'info');
                addOutput('💡 Remember to reload firewall rules with --reload', 'warning');
            } else {
                addOutput('⚠️  Port ' + port + ' added to firewall (temporary)', 'warning');
                addOutput('💡 Use --permanent flag to make changes persistent', 'info');
            }
            
        } else {
            addOutput('firewall-cmd: invalid port format', 'error');
            addOutput('Use format: --add-port=PORT/PROTOCOL (e.g., --add-port=80/tcp)', 'info');
            addOutput('💡 Don\'t forget the protocol (tcp/udp)!', 'warning');
        }
    } else if (command.includes('--reload')) {
        addOutput('success', 'success');
        if (systemState.centos.openPorts && systemState.centos.openPorts.length > 0) {
            addOutput('🔄 Firewall rules reloaded and active', 'success');
            addOutput('📋 Active ports: ' + systemState.centos.openPorts.join(', '), 'success');
            
            // Check if all required ports are opened AND firewall is reloaded
            var requiredPorts = ['22/tcp', '80/tcp', '443/tcp', '8443/tcp', '5432/tcp', '9200/tcp', '6443/tcp'];
            var allOpened = requiredPorts.every(function(p) {
                return systemState.centos.openPorts.includes(p);
            });
            
            if (allOpened && !completedTasks.has('firewall')) {
                addOutput('');
                addOutput('🎉 All required ports have been opened and firewall reloaded!', 'success');
                addOutput('🔥 Your firewall is now properly configured and active!', 'success');
                addOutput('✅ Task 1: Firewall Configuration - COMPLETED', 'success');
                systemState.centos.firewallConfigured = true;
                completedTasks.add('firewall');
                updateTaskProgress();
                checkAllTasksComplete();
            }
        } else {
            addOutput('🔄 Firewall reloaded (no custom ports configured)', 'info');
        }
    } else if (command.includes('--list-ports')) {
        if (systemState.centos.openPorts && systemState.centos.openPorts.length > 0) {
            addOutput(systemState.centos.openPorts.join(' '));
            addOutput('📋 ' + systemState.centos.openPorts.length + ' custom ports configured', 'info');
        } else {
            addOutput('');
            addOutput('📭 No custom ports configured yet', 'info');
            addOutput('💡 Use --add-port to open ports for services', 'info');
        }
    } else if (command.includes('--state')) {
        addOutput('running', 'success');
        addOutput('🔥 Firewall is active and protecting your server!', 'success');
    } else if (command.includes('--help')) {
        addOutput('Common firewall-cmd options:', 'info');
        addOutput('  --state                  - Check firewall status');
        addOutput('  --list-ports             - List open ports');
        addOutput('  --add-port=PORT/PROTOCOL - Open a port');
        addOutput('  --reload                 - Reload firewall rules');
        addOutput('  --permanent              - Make changes persistent');
        addOutput('🔥 Use --permanent with --add-port for lasting rules!', 'warning');
    } else {
        addOutput('firewall-cmd: invalid option', 'error');
        addOutput('Try: firewall-cmd --help for available options', 'info');
    }
}

// Global variable to track interactive commands
var interactiveCommand = null;

function executeYum(args) {
    var command = args[0];
    
    if (!command) {
        addOutput('yum: missing command', 'error');
        addOutput('Usage: yum [update|install|search] [package]');
        addOutput('🍰 YUM needs to know what you want to do!', 'warning');
        return;
    }
    
    if (command === 'update') {
        addOutput('Loaded plugins: fastestmirror', 'info');
        addOutput('Loading mirror speeds from cached hostfile', 'info');
        addOutput('🌍 Finding fastest mirrors...', 'info');
        
        setTimeout(function() {
            addOutput('Resolving Dependencies', 'info');
            addOutput('--> Running transaction check', 'info');
            addOutput('Dependencies Resolved', 'success');
            addOutput('');
            addOutput('Transaction Summary');
            addOutput('=====================================');
            var packageCount = Math.floor(Math.random() * 50 + 20);
            addOutput('Upgrade  ' + packageCount + ' Packages');
            addOutput('');
            var downloadSize = Math.floor(Math.random() * 200 + 50);
            addOutput('Total download size: ' + downloadSize + ' MB');
            
            // Create interactive prompt
            addOutput('Is this ok [y/N]: ', 'warning');
            
            // Set up interactive mode
            interactiveCommand = {
                type: 'yum-update-confirm',
                packageCount: packageCount,
                downloadSize: downloadSize
            };
            
            // Create special input for this interaction
            createInteractiveInput('yum-confirm');
            
        }, 1000);
        return 'async';
        
    } else if (command === 'install') {
        var packages = args.slice(1);
        if (packages.length === 0) {
            addOutput('yum install: missing package name', 'error');
            addOutput('Usage: yum install PACKAGE [PACKAGE2...]');
            addOutput('💡 Specify which packages to install!', 'warning');
            return;
        }
        
        addOutput('Loaded plugins: fastestmirror', 'info');
        addOutput('Loading mirror speeds from cached hostfile', 'info');
        addOutput('🔍 Searching for packages: ' + packages.join(', '), 'info');
        
        setTimeout(function() {
            var isNtp = packages.includes('ntp');
            var hasRequiredPackages = packages.some(function(pkg) {
                return ['wget', 'curl', 'unzip', 'tar', 'net-tools', 'device-mapper-persistent-data', 'lvm2'].includes(pkg);
            });
            
            if (isNtp || hasRequiredPackages) {
                addOutput('Resolving Dependencies', 'info');
                addOutput('--> Running transaction check', 'info');
                addOutput('Dependencies Resolved', 'success');
                addOutput('');
                addOutput('Installing: ' + packages.join(', '));
                addOutput('📦 Package installation starting...', 'info');
                
                setTimeout(function() {
                    addOutput('Complete!', 'success');
                    
                    if (hasRequiredPackages && !systemState.centos.packagesInstalled) {
                        systemState.centos.packagesInstalled = true;
                        completedTasks.add('packages');
                        updateTaskProgress();
                        addOutput('🎉 Required system packages installed successfully!', 'success');
                        addOutput('✅ Task 5: Package Installation - COMPLETED', 'success');
                        checkAllTasksComplete();
                    }
                    
                    if (isNtp) {
                        addOutput('💡 Don\'t forget to start and enable the ntpd service!', 'info');
                        addOutput('Commands: systemctl start ntpd && systemctl enable ntpd', 'info');
                    }
                    
                    showNewPrompt();
                }, 2000);
            } else {
                addOutput('No package ' + packages[0] + ' available.', 'error');
                addOutput('💡 Check the package name or try "yum search ' + packages[0] + '"', 'info');
                addOutput('🧅 "Not all packages are created equal!" - Ogre wisdom', 'warning');
                showNewPrompt();
            }
        }, 1500);
        return 'async';
        
    } else if (command === 'search') {
        var searchTerm = args[1];
        if (!searchTerm) {
            addOutput('yum search: missing search term', 'error');
            addOutput('Usage: yum search TERM', 'info');
            return;
        }
        addOutput('Loaded plugins: fastestmirror', 'info');
        addOutput('Loading mirror speeds from cached hostfile', 'info');
        addOutput('🔍 Searching repositories...', 'info');
        addOutput('========================== N/S matched: ' + searchTerm + ' ==========================');
        
        // Provide some realistic search results
        if (searchTerm.includes('ntp')) {
            addOutput('ntp.x86_64 : The NTP daemon and utilities');
            addOutput('ntpdate.x86_64 : Utility to set the date and time via NTP');
        } else if (searchTerm.includes('wget')) {
            addOutput('wget.x86_64 : A utility for retrieving files using the HTTP or FTP protocols');
        } else if (searchTerm.includes('curl')) {
            addOutput('curl.x86_64 : A utility for getting files from remote servers (FTP, HTTP, and others)');
        } else {
            addOutput('No matching packages found for: ' + searchTerm);
            addOutput('💡 Try broader search terms or check spelling!', 'info');
        }
    } else if (command === 'list') {
        if (args[1] === 'installed') {
            addOutput('Loaded plugins: fastestmirror', 'info');
            addOutput('Installed Packages', 'success');
            addOutput('bash.x86_64                    4.2.46-34.el7                @anaconda');
            addOutput('coreutils.x86_64              8.22-24.el7                   @anaconda');
            addOutput('kernel.x86_64                 3.10.0-1160.el7               @anaconda');
            addOutput('systemd.x86_64                219-78.el7                    @anaconda');
            addOutput('📦 Showing sample of installed packages', 'info');
        } else {
            addOutput('Usage: yum list [installed|available|updates]', 'info');
        }
    } else {
        addOutput('yum: unknown command "' + command + '"', 'error');
        addOutput('Available commands: update, install, search, list', 'info');
        addOutput('💡 Try "yum --help" for more options', 'info');
    }
}

// Function to create interactive input for special commands
function createInteractiveInput(type) {
    var terminal = document.getElementById('terminal-output');
    
    // Remove any existing input lines
    var existingInputs = terminal.querySelectorAll('.input-line');
    existingInputs.forEach(function(inputLine) {
        if (inputLine.parentNode) {
            inputLine.parentNode.removeChild(inputLine);
        }
    });
    
    // Create a new input line for the interactive command
    var newInputLine = document.createElement('div');
    newInputLine.className = 'input-line interactive-input';
    newInputLine.innerHTML = '<input type="text" class="command-input interactive-command-input" autocomplete="off" data-type="' + type + '">';
    
    terminal.appendChild(newInputLine);
    
    // Focus the new input and set up event handler
    var newInput = newInputLine.querySelector('.command-input');
    if (newInput) {
        newInput.focus();
        newInput.addEventListener('keydown', handleInteractiveInput);
        newInput.value = '';
    }
    
    scrollToBottom();
}

// Function to handle interactive input (like y/n prompts)
function handleInteractiveInput(event) {
    if (event.key === 'Enter') {
        var input = event.target;
        var response = input.value.trim().toLowerCase();
        var inputType = input.getAttribute('data-type');
        
        // Show the user's response
        addOutput(response);
        
        // Remove the interactive input line
        var inputLine = input.closest('.input-line');
        if (inputLine && inputLine.parentNode) {
            inputLine.parentNode.removeChild(inputLine);
        }
        
        // Handle the response based on the command type
        if (inputType === 'yum-confirm' && interactiveCommand) {
            if (response === 'y' || response === 'yes') {
                addOutput('Downloading packages...', 'info');
                addOutput('📦 Package downloads in progress...', 'info');
                
                setTimeout(function() {
                    addOutput('Running transaction', 'info');
                    addOutput('🔄 Installing updates...', 'info');
                    
                    setTimeout(function() {
                        addOutput('Complete!', 'success');
                        addOutput('🎉 System updated with ' + interactiveCommand.packageCount + ' packages!', 'success');
                        interactiveCommand = null;
                        showNewPrompt();
                    }, 1500);
                }, 2000);
            } else {
                addOutput('Operation cancelled by user', 'warning');
                addOutput('💡 No packages were updated', 'info');
                interactiveCommand = null;
                showNewPrompt();
            }
        }
        
        event.preventDefault();
        event.stopPropagation();
    }
}

function executeFree(args) {
    var humanReadable = args && args.includes('-h');
    
    if (humanReadable) {
        addOutput('              total        used        free      shared  buff/cache   available');
        addOutput('Mem:            16G        4.2G        8.1G        256M        3.7G         11G');
        if (systemState.centos.swapConfigured) {
            addOutput('Swap:          8.0G          0B        8.0G');
            addOutput('💾 Swap space configured and available!', 'success');
        } else {
            addOutput('Swap:            0B          0B          0B', 'warning');
            addOutput('⚠️  No swap space configured - consider adding swap!', 'warning');
            addOutput('💡 Use: dd, mkswap, swapon to create swap space', 'info');
        }
    } else {
        addOutput('             total       used       free     shared    buffers     cached');
        addOutput('Mem:      16777216    4194304    8388608     262144     524288    3932160');
        if (systemState.centos.swapConfigured) {
            addOutput('Swap:      8388608          0    8388608');
        } else {
            addOutput('Swap:            0          0          0', 'warning');
        }
    }
    addOutput('🧅 Memory info revealed - like layers of an onion!', 'info');
}

function executeDf(args) {
    var humanReadable = args && args.includes('-h');
    
    if (humanReadable) {
        addOutput('Filesystem      Size  Used Avail Use% Mounted on');
        addOutput('/dev/sda1       500G   45G  429G  10% /');
        addOutput('/dev/sda2       1.0G  150M  851M  15% /boot');
        addOutput('tmpfs           8.0G     0  8.0G   0% /dev/shm');
        addOutput('💾 Disk usage looks healthy!', 'success');
    } else {
        addOutput('Filesystem     1K-blocks     Used Available Use% Mounted on');
        addOutput('/dev/sda1      524288000 47185920 451102080  10% /');
        addOutput('/dev/sda2        1048576   153600    870400  15% /boot');
        addOutput('tmpfs            8388608        0   8388608   0% /dev/shm');
    }
    addOutput('💾 Storage space managed efficiently!', 'success');
}

function executeDd(args) {
    var command = args.join(' ');
    
    if (command.includes('if=/dev/zero') && command.includes('of=/swapfile')) {
        addOutput('Creating 8GB swap file...', 'info');
        addOutput('⚠️  This may take a few minutes...', 'warning');
        addOutput('🧅 "Better out than in!" - Creating swap space like Shrek!', 'info');
        
        // Mark that swap file creation has started
        systemState.centos.swapFileCreated = true;
        
        var progress = 0;
        var progressDiv = document.createElement('div');
        progressDiv.className = 'output info';
        document.getElementById('terminal-output').appendChild(progressDiv);
        
        var interval = setInterval(function() {
            progress += Math.random() * 8 + 2;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                progressDiv.remove();
                addOutput('8388608+0 records in');
                addOutput('8388608+0 records out');
                addOutput('8589934592 bytes (8.6 GB) copied, 45.2341 s, 190 MB/s', 'success');
                addOutput('🎉 Swap file created successfully!', 'success');
                addOutput('');
                addOutput('💡 Next: Research how to prepare and activate swap space', 'info');
                addOutput('Hint: You need to set permissions, initialize, and enable it', 'info');
                addOutput('📚 Look up: chmod, mkswap, swapon commands online', 'warning');
                addOutput('🗃️ Also research: making swap persistent in /etc/fstab', 'warning');
                addOutput('');
                addOutput('🎉 Swap file creation step completed successfully!', 'success');
                // Force show new prompt after completion
                setTimeout(function() {
                    showNewPrompt();
                }, 100);
            } else {
                progressDiv.textContent = '📊 Progress: ' + Math.floor(progress) + '% - Writing ' + Math.floor(progress * 85.8) + ' MB...';
                scrollToBottom();
            }
        }, 400);
        // Return async to prevent immediate prompt
        return 'async';
    } else if (command.includes('if=') && command.includes('of=')) {
        addOutput('dd: creating file...', 'info');
        setTimeout(function() {
            addOutput('File created successfully', 'success');
            addOutput('💾 DD command completed!', 'success');
            setTimeout(function() {
                showNewPrompt();
            }, 100);
        }, 1000);
        return 'async';
    } else {
        addOutput('dd: invalid arguments', 'error');
        addOutput('Usage: dd if=SOURCE of=DESTINATION [options]', 'info');
        addOutput('Common options:', 'info');
        addOutput('  bs=SIZE     - Set block size (e.g., bs=1024, bs=1M, bs=1G)', 'info');
        addOutput('  count=N     - Copy only N blocks', 'info');
        addOutput('  if=FILE     - Input file (e.g., /dev/zero for zeros)', 'info');
        addOutput('  of=FILE     - Output file (destination)', 'info');
        addOutput('', 'info');
        addOutput('💡 Research dd command usage online for proper syntax', 'warning');
        addOutput('🧅 "Even ogres need to learn the right syntax!" - Shrek', 'warning');
        // Return null to show prompt immediately for invalid syntax
        return null;
    }
}

function executeMkswap(args) {
    var file = args[0];
    
    if (!file) {
        addOutput('mkswap: missing file argument', 'error');
        addOutput('Usage: mkswap [file]', 'info');
        addOutput('💡 Specify the swap file to initialize!', 'warning');
        return;
    }
    
    if (file === '/swapfile') {
        if (systemState.centos.swapFileCreated) {
            addOutput('Setting up swapspace version 1, size = 8388604 KiB');
            addOutput('no label, UUID=12345678-1234-1234-1234-123456789012', 'success');
            addOutput('');
            addOutput('✅ Swap file initialized successfully!', 'success');
            addOutput('💡 Next: Research how to activate/enable the swap space', 'info');
            addOutput('🔄 One more command needed to make it active!', 'success');
        } else {
            addOutput('mkswap: ' + file + ': No such file or directory', 'error');
            addOutput('💡 Create the swap file first using the dd command', 'info');
            addOutput('📚 Research: How to create files with dd command', 'info');
        }
    } else {
        addOutput('mkswap: ' + file + ': No such file or directory', 'error');
        addOutput('💡 Make sure the file exists first (create it with dd)', 'info');
        addOutput('📚 Research: How to create files with dd command', 'info');
    }
}

function executeSwapon(args) {
    var file = args[0];
    
    if (!file) {
        addOutput('swapon: missing file argument', 'error');
        addOutput('Usage: swapon [file]', 'info');
        addOutput('💡 Specify which swap file to activate!', 'warning');
        return;
    }
    
    if (file === '/swapfile') {
        if (systemState.centos.swapFileCreated) {
            addOutput('🎉 Swap file activated successfully!', 'success');
            addOutput('');
            systemState.centos.swapConfigured = true;
            completedTasks.add('swap');
            updateTaskProgress();
            addOutput('✅ 8GB swap space is now active and ready!', 'success');
            addOutput('');
            addOutput('💡 To make swap persistent across reboots:', 'warning');
            addOutput('📝 Research: How to add swap entries to /etc/fstab', 'info');
            addOutput('🔍 Look up: fstab file format and swap entries', 'info');
            addOutput('');
            addOutput('✅ Task 2: Swap Configuration - COMPLETED', 'success');
            checkAllTasksComplete();
        } else {
            addOutput('swapon: ' + file + ': No such file or directory', 'error');
            addOutput('💡 Create the swap file first using the dd command', 'info');
            addOutput('📚 Research: Complete swap setup process (dd, mkswap, swapon)', 'info');
        }
    } else {
        addOutput('swapon: ' + file + ': No such file or directory', 'error');
        addOutput('💡 Make sure the swap file exists and is properly formatted', 'info');
        addOutput('📚 Research: Complete swap setup process (dd, mkswap, swapon)', 'info');
    }
}

function executePing(args) {
    var host = args[0];
    
    if (!host) {
        addOutput('ping: missing host argument', 'error');
        addOutput('Usage: ping [hostname]', 'info');
        addOutput('💡 Specify a host to ping!', 'warning');
        showNewPrompt();
        return;
    }
    
    addOutput('PING ' + host + ' (192.168.1.1) 56(84) bytes of data.', 'info');
    addOutput('🏓 Pinging ' + host + ' - let\'s see if it responds!', 'info');
    
    var count = 0;
    var interval = setInterval(function() {
        count++;
        var time = (Math.random() * 10 + 1).toFixed(1);
        addOutput('64 bytes from ' + host + ' (192.168.1.1): icmp_seq=' + count + ' ttl=64 time=' + time + ' ms');
        scrollToBottom();
        
        if (count >= 4) {
            clearInterval(interval);
            addOutput('');
            addOutput('--- ' + host + ' ping statistics ---');
            addOutput('4 packets transmitted, 4 received, 0% packet loss, time 3003ms');
            addOutput('rtt min/avg/max/mdev = 1.2/5.4/9.8/3.2 ms', 'success');
            addOutput('🎉 Network connectivity confirmed!', 'success');
            showNewPrompt();
        }
    }, 1000);
}

function executeKubectl(args) {
    if (currentHost !== 'k8s') {
        addOutput('kubectl: command not found', 'error');
        return;
    }
    
    var subcommand = args[0];
    var resource = args[1];
    var name = args[2];
    
    if (!subcommand) {
        addOutput('kubectl: missing subcommand', 'error');
        addOutput('Available commands: get, describe, logs', 'info');
        addOutput('Try: kubectl get pods', 'info');
        addOutput('⚓ Need to specify what kubectl should do!', 'warning');
        return;
    }
    
    if (subcommand === 'get') {
        if (resource === 'pods') {
            addOutput('NAME                                READY   STATUS             RESTARTS   AGE');
            addOutput('webapp-deployment-7d4b8c9f4d-xyz123  0/1     CrashLoopBackOff   5          10m', 'error');
            addOutput('database-statefulset-0              1/1     Running            0          1h', 'success');
            addOutput('nginx-ingress-controller-abc123     1/1     Running            0          2h', 'success');
            addOutput('🚨 One pod is having issues - investigate with kubectl logs!', 'warning');
        } else if (resource === 'services' || resource === 'svc') {
            addOutput('NAME            TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE');
            addOutput('kubernetes      ClusterIP      10.96.0.1       <none>        443/TCP        3d');
            addOutput('webapp-service  LoadBalancer   10.96.245.123   <pending>     80:30080/TCP   1h');
            addOutput('nginx-service   LoadBalancer   10.96.100.200   <pending>     80:30081/TCP   2h', 'warning');
            addOutput('🔗 Services listed - some external IPs are pending', 'info');
        } else if (resource === 'pvc' || resource === 'persistentvolumeclaims') {
            addOutput('NAME                STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE');
            addOutput('database-pv-claim   Pending                                      fast-ssd       30m', 'warning');
            addOutput('💾 Storage claim is pending - check storage class!', 'warning');
        } else if (resource === 'events') {
            addOutput('LAST SEEN   TYPE      REASON              OBJECT                               MESSAGE');
            addOutput('2m          Warning   ProvisioningFailed  persistentvolumeclaim/database-pv-claim   storageclass "fast-ssd" not found', 'warning');
            addOutput('5m          Warning   BackOff             pod/webapp-deployment-7d4b8c9f4d-xyz123   Back-off restarting failed container', 'error');
            addOutput('1m          Normal    Scheduled           pod/database-statefulset-0               Successfully assigned default/database-statefulset-0 to node01');
            addOutput('📋 Recent cluster events - investigate the warnings!', 'warning');
        } else if (resource === 'nodes') {
            addOutput('NAME      STATUS   ROLES                  AGE   VERSION');
            addOutput('master    Ready    control-plane,master   5d    v1.24.0', 'success');
            addOutput('node01    Ready    <none>                 5d    v1.24.0', 'success');
            addOutput('🖥️  All nodes are ready and healthy!', 'success');
        } else {
            addOutput('kubectl get: unknown resource type "' + (resource || 'unknown') + '"', 'error');
            addOutput('Available resources: pods, services, pvc, events, nodes', 'info');
            addOutput('💡 Try: kubectl get pods', 'info');
        }
    } else if (subcommand === 'describe') {
        if (resource === 'pod' && name === 'webapp-deployment-7d4b8c9f4d-xyz123') {
            addOutput('Name:         webapp-deployment-7d4b8c9f4d-xyz123');
            addOutput('Namespace:    default');
            addOutput('Priority:     0');
            addOutput('Node:         node01/192.168.1.10');
            addOutput('Start Time:   Mon, 16 Jun 2025 14:20:00 +0000');
            addOutput('Labels:       app=webapp');
            addOutput('              pod-template-hash=7d4b8c9f4d');
            addOutput('Status:       Failed');
            addOutput('IP:           10.244.1.5');
            addOutput('');
            addOutput('Containers:');
            addOutput('  webapp:');
            addOutput('    Container ID:   docker://abc123def456');
            addOutput('    Image:          webapp:latest');
            addOutput('    State:          Waiting');
            addOutput('      Reason:       CrashLoopBackOff');
            addOutput('    Last State:     Terminated');
            addOutput('      Reason:       Error');
            addOutput('      Exit Code:    1');
            addOutput('');
            addOutput('Events:');
            addOutput('  Type     Reason     Age                Message');
            addOutput('  ----     ------     ----               -------');
            addOutput('  Warning  BackOff    2m (x10 over 5m)   Back-off restarting failed container', 'warning');
            addOutput('');
            addOutput('🔍 Pod details revealed - check logs next!', 'info');
        } else if (resource === 'pvc' && name === 'database-pv-claim') {
            var ctfLogs = window.ctfLogs || {};
            var pvcDesc = ctfLogs['database-pv-claim'];
            if (pvcDesc) {
                addOutput(pvcDesc);
                checkForFlag(pvcDesc);
            } else {
                addOutput('No description available for this resource', 'warning');
            }
        } else if (resource === 'service' && name === 'nginx-service') {
            var ctfLogs = window.ctfLogs || {};
            var serviceDesc = ctfLogs['nginx-service-config'];
            if (serviceDesc) {
                addOutput(serviceDesc);
                checkForFlag(serviceDesc);
            } else {
                addOutput('No description available for this resource', 'warning');
            }
        } else {
            addOutput('kubectl describe: resource "' + (resource || 'unknown') + '" "' + (name || 'unknown') + '" not found', 'error');
            addOutput('💡 Check resource name and try again', 'info');
            addOutput('Example: kubectl describe pod webapp-deployment-7d4b8c9f4d-xyz123', 'info');
        }
    } else if (subcommand === 'logs') {
        var podName = resource || name;
        if (podName === 'webapp-deployment-7d4b8c9f4d-xyz123' || podName === 'webapp-deployment') {
            var ctfLogs = window.ctfLogs || {};
            var logs = ctfLogs['webapp-deployment-7d4b8c9f4d-xyz123'];
            if (logs) {
                var lines = logs.split('\n');
                for (var i = 0; i < lines.length; i++) {
                    if (lines[i].trim()) {
                        var line = lines[i];
                        var className = '';
                        
                        // Color code log levels
                        if (line.includes(' ERROR ')) {
                            className = 'error';
                        } else if (line.includes(' WARN ')) {
                            className = 'warning';
                        } else if (line.includes(' INFO ')) {
                            className = 'info';
                        } else if (line.includes(' DEBUG ')) {
                            className = 'info';
                        } else if (line.includes(' FATAL ')) {
                            className = 'error';
                        }
                        
                        addOutput(line, className);
                    }
                }
                checkForFlag(logs);
                addOutput('');
                addOutput('📜 Pod logs retrieved - look for clues!', 'info');
            } else {
                addOutput('No logs available for this pod', 'warning');
            }
        } else if (podName === 'database-statefulset-0') {
            addOutput('2025-06-16T14:25:00.123Z INFO  Starting PostgreSQL database...');
            addOutput('2025-06-16T14:25:01.456Z INFO  Database initialized successfully');
            addOutput('2025-06-16T14:25:02.789Z INFO  Accepting connections on port 5432');
            addOutput('2025-06-16T14:25:03.012Z INFO  Database ready for queries');
            addOutput('💚 Database pod is healthy and running!', 'success');
        } else {
            addOutput('kubectl logs: pod "' + (podName || 'unknown') + '" not found', 'error');
            addOutput('Available pods: webapp-deployment-7d4b8c9f4d-xyz123, database-statefulset-0', 'info');
            addOutput('💡 Use full pod name from kubectl get pods', 'info');
        }
    } else {
        addOutput('kubectl: unknown subcommand "' + subcommand + '"', 'error');
        addOutput('Available subcommands: get, describe, logs', 'info');
        addOutput('💡 Start with: kubectl get pods', 'info');
    }
}
        