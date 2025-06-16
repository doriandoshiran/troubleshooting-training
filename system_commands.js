// System administration commands for CentOS and Kubernetes

function executeSystemctl(args) {
    var action = args[0];
    var service = args[1];
    
    if (!action || !service) {
        addOutput('systemctl: missing arguments', 'error');
        addOutput('Usage: systemctl [start|stop|enable|disable|status] [service]');
        return;
    }
    
    if (service === 'ntpd') {
        if (action === 'start') {
            addOutput('Starting ntpd service...', 'info');
            setTimeout(function() {
                addOutput('ntpd service started successfully', 'success');
                systemState.centos.ntpConfigured = true;
                completedTasks.add('ntp');
                updateTaskProgress();
                showNewPrompt();
            }, 1000);
            return;
        } else if (action === 'enable') {
            addOutput('Enabling ntpd service...', 'info');
            addOutput('Created symlink from /etc/systemd/system/multi-user.target.wants/ntpd.service to /usr/lib/systemd/system/ntpd.service', 'success');
        } else if (action === 'status') {
            if (systemState.centos.ntpConfigured) {
                addOutput('● ntpd.service - Network Time Protocol daemon');
                addOutput('   Loaded: loaded (/usr/lib/systemd/system/ntpd.service; enabled)', 'success');
                addOutput('   Active: active (running) since Mon 2025-06-16 14:30:00 UTC', 'success');
                addOutput('Filesystem     1K-blocks     Used Available Use% Mounted on');
        addOutput('/dev/sda1      524288000 47185920 451102080  10% /');
        addOutput('/dev/sda2        1048576   153600    870400  15% /boot');
        addOutput('tmpfs            8388608        0   8388608   0% /dev/shm');
    }
}

function executeDd(args) {
    var command = args.join(' ');
    
    if (command.includes('if=/dev/zero') && command.includes('of=/swapfile')) {
        addOutput('Creating 8GB swap file...', 'info');
        addOutput('This may take a few minutes...', 'warning');
        
        var progress = 0;
        var progressDiv = document.createElement('div');
        progressDiv.className = 'output';
        document.getElementById('terminal-output').appendChild(progressDiv);
        
        var interval = setInterval(function() {
            progress += Math.random() * 10 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                progressDiv.remove();
                addOutput('8388608+0 records in');
                addOutput('8388608+0 records out');
                addOutput('8589934592 bytes (8.6 GB) copied, 45.2341 s, 190 MB/s', 'success');
                addOutput('Swap file created successfully!', 'success');
                addOutput('Next: chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile', 'info');
                showNewPrompt();
            } else {
                progressDiv.textContent = 'Progress: ' + Math.floor(progress) + '% - Writing ' + Math.floor(progress * 85.8) + ' MB...';
                scrollToBottom();
            }
        }, 300);
        return;
    } else {
        addOutput('dd: invalid arguments', 'error');
        addOutput('Example: dd if=/dev/zero of=/swapfile bs=1024 count=8388608');
    }
}

function executeMkswap(args) {
    var file = args[0];
    
    if (file === '/swapfile') {
        addOutput('Setting up swapspace version 1, size = 8388604 KiB');
        addOutput('no label, UUID=12345678-1234-1234-1234-123456789012', 'success');
        addOutput('Swap file initialized! Next: swapon /swapfile', 'info');
    } else {
        addOutput('mkswap: ' + (file || 'missing file') + ': No such file or directory', 'error');
    }
}

function executeSwapon(args) {
    var file = args[0];
    
    if (file === '/swapfile') {
        addOutput('Swap file activated successfully!', 'success');
        systemState.centos.swapConfigured = true;
        completedTasks.add('swap');
        updateTaskProgress();
        addOutput('Don\'t forget to add to /etc/fstab for persistence:', 'warning');
        addOutput('echo "/swapfile swap swap defaults 0 0" >> /etc/fstab', 'info');
    } else {
        addOutput('swapon: ' + (file || 'missing file') + ': No such file or directory', 'error');
    }
}

function executePing(args) {
    var host = args[0];
    
    if (!host) {
        addOutput('ping: missing host argument', 'error');
        showNewPrompt();
        return;
    }
    
    addOutput('PING ' + host + ' (192.168.1.1) 56(84) bytes of data.', 'info');
    
    var count = 0;
    var interval = setInterval(function() {
        count++;
        var time = (Math.random() * 10 + 1).toFixed(1);
        addOutput('64 bytes from ' + host + ' (192.168.1.1): icmp_seq=' + count + ' ttl=64 time=' + time + ' ms');
        
        if (count >= 4) {
            clearInterval(interval);
            addOutput('');
            addOutput('--- ' + host + ' ping statistics ---');
            addOutput('4 packets transmitted, 4 received, 0% packet loss');
            addOutput('rtt min/avg/max/mdev = 1.2/5.4/9.8/3.2 ms', 'success');
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
        addOutput('Available: get, describe, logs');
        return;
    }
    
    if (subcommand === 'get') {
        if (resource === 'pods') {
            addOutput('NAME                                READY   STATUS             RESTARTS   AGE');
            addOutput('webapp-deployment-7d4b8c9f4d-xyz123  0/1     CrashLoopBackOff   5          10m', 'error');
            addOutput('database-statefulset-0              1/1     Running            0          1h', 'success');
            addOutput('nginx-ingress-controller-abc123     1/1     Running            0          2h', 'success');
        } else if (resource === 'services') {
            addOutput('NAME            TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE');
            addOutput('kubernetes      ClusterIP      10.96.0.1       <none>        443/TCP        3d');
            addOutput('webapp-service  LoadBalancer   10.96.245.123   <pending>     80:30080/TCP   1h');
            addOutput('nginx-service   LoadBalancer   10.96.100.200   <pending>     80:30081/TCP   2h');
        } else if (resource === 'pvc' || resource === 'persistentvolumeclaims') {
            addOutput('NAME                STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE');
            addOutput('database-pv-claim   Pending                                      fast-ssd       30m', 'warning');
        } else if (resource === 'events') {
            addOutput('LAST SEEN   TYPE      REASON              OBJECT                               MESSAGE');
            addOutput('2m          Warning   ProvisioningFailed  persistentvolumeclaim/database-pv-claim   storageclass "fast-ssd" not found');
            addOutput('5m          Warning   BackOff             pod/webapp-deployment-7d4b8c9f4d-xyz123   Back-off restarting failed container');
        }
    } else if (subcommand === 'describe') {
        if (resource === 'pod' && name === 'webapp-deployment-7d4b8c9f4d-xyz123') {
            addOutput('Name:         webapp-deployment-7d4b8c9f4d-xyz123');
            addOutput('Namespace:    default');
            addOutput('Status:       Failed');
            addOutput('Containers:');
            addOutput('  webapp:');
            addOutput('    State:          Waiting');
            addOutput('    Reason:         CrashLoopBackOff');
            addOutput('    Exit Code:      1');
        } else if (resource === 'pvc' && name === 'database-pv-claim') {
            var pvcDesc = ctfLogs['database-pv-claim'];
            addOutput(pvcDesc);
            checkForFlag(pvcDesc);
        } else if (resource === 'service' && name === 'nginx-service') {
            var serviceDesc = ctfLogs['nginx-service-config'];
            addOutput(serviceDesc);
            checkForFlag(serviceDesc);
        }
    } else if (subcommand === 'logs') {
        if (resource === 'webapp-deployment-7d4b8c9f4d-xyz123' || resource === name) {
            var logs = ctfLogs['webapp-deployment-7d4b8c9f4d-xyz123'];
            var lines = logs.split('\n');
            for (var i = 0; i < lines.length; i++) {
                addOutput(lines[i]);
            }
            checkForFlag(logs);
        } else {
            addOutput('kubectl logs: pod "' + (resource || name || 'unknown') + '" not found', 'error');
        }
    } else {
        addOutput('kubectl: unknown subcommand "' + subcommand + '"', 'error');
    }
}
                addOutput('● ntpd.service - Network Time Protocol daemon');
                addOutput('   Loaded: loaded (/usr/lib/systemd/system/ntpd.service; disabled)', 'warning');
                addOutput('   Active: inactive (dead)', 'warning');
            }
        }
    } else if (service === 'firewalld') {
        if (action === 'status') {
            addOutput('● firewalld.service - firewalld - dynamic firewall daemon');
            addOutput('   Loaded: loaded (/usr/lib/systemd/system/firewalld.service; enabled)', 'success');
            addOutput('   Active: active (running) since Mon 2025-06-16 14:00:00 UTC', 'success');
        }
    } else {
        addOutput('systemctl: unknown service "' + service + '"', 'error');
    }
}

function executeFirewallCmd(args) {
    if (args.length === 0) {
        addOutput('firewall-cmd: missing arguments', 'error');
        return;
    }
    
    var command = args.join(' ');
    
    if (command.includes('--add-port=')) {
        var port = command.match(/--add-port=(\d+\/tcp)/);
        if (port) {
            addOutput('success', 'success');
            
            // Track opened ports
            if (!systemState.centos.openPorts) {
                systemState.centos.openPorts = [];
            }
            systemState.centos.openPorts.push(port[1]);
            
            // Check if all required ports are opened
            var requiredPorts = ['22/tcp', '80/tcp', '443/tcp', '8443/tcp', '5432/tcp', '9200/tcp', '6443/tcp'];
            var allOpened = requiredPorts.every(function(p) {
                return systemState.centos.openPorts.includes(p);
            });
            
            if (allOpened && !completedTasks.has('firewall')) {
                addOutput('All required ports have been opened!', 'info');
                systemState.centos.firewallConfigured = true;
                completedTasks.add('firewall');
                updateTaskProgress();
            }
        }
    } else if (command.includes('--reload')) {
        addOutput('success', 'success');
        if (systemState.centos.openPorts && systemState.centos.openPorts.length > 0) {
            addOutput('Firewall rules reloaded and active', 'info');
        }
    } else if (command.includes('--list-ports')) {
        if (systemState.centos.openPorts && systemState.centos.openPorts.length > 0) {
            addOutput(systemState.centos.openPorts.join(' '));
        } else {
            addOutput('');
        }
    } else {
        addOutput('firewall-cmd: invalid option', 'error');
    }
}

function executeYum(args) {
    var command = args[0];
    
    if (!command) {
        addOutput('yum: missing command', 'error');
        return;
    }
    
    if (command === 'update') {
        addOutput('Loaded plugins: fastestmirror', 'info');
        addOutput('Loading mirror speeds from cached hostfile', 'info');
        addOutput('Resolving Dependencies', 'info');
        addOutput('--> Running transaction check', 'info');
        addOutput('Dependencies Resolved', 'success');
        addOutput('');
        addOutput('Transaction Summary');
        addOutput('=====================================');
        addOutput('Upgrade  ' + Math.floor(Math.random() * 50 + 20) + ' Packages');
        addOutput('');
        addOutput('Total download size: ' + Math.floor(Math.random() * 200 + 50) + ' MB');
        addOutput('Is this ok [y/N]: ', 'warning');
        
        setTimeout(function() {
            addOutput('y');
            addOutput('Downloading packages...', 'info');
            setTimeout(function() {
                addOutput('Running transaction', 'info');
                addOutput('Complete!', 'success');
                showNewPrompt();
            }, 2000);
        }, 1000);
        return;
    } else if (command === 'install') {
        var packages = args.slice(1);
        if (packages.length === 0) {
            addOutput('yum install: missing package name', 'error');
            return;
        }
        
        addOutput('Loaded plugins: fastestmirror', 'info');
        addOutput('Loading mirror speeds from cached hostfile', 'info');
        
        var isNtp = packages.includes('ntp');
        var hasRequiredPackages = packages.includes('wget') || packages.includes('curl') || packages.includes('unzip');
        
        if (isNtp || hasRequiredPackages) {
            addOutput('Resolving Dependencies', 'info');
            addOutput('Dependencies Resolved', 'success');
            addOutput('');
            addOutput('Installing: ' + packages.join(', '));
            
            setTimeout(function() {
                addOutput('Complete!', 'success');
                
                if (hasRequiredPackages && !systemState.centos.packagesInstalled) {
                    systemState.centos.packagesInstalled = true;
                    completedTasks.add('packages');
                    updateTaskProgress();
                }
                
                showNewPrompt();
            }, 2000);
            return;
        } else {
            addOutput('No package ' + packages[0] + ' available.', 'error');
        }
    } else {
        addOutput('yum: unknown command "' + command + '"', 'error');
    }
}

function executeFree(args) {
    var humanReadable = args && args.includes('-h');
    
    if (humanReadable) {
        addOutput('              total        used        free      shared  buff/cache   available');
        addOutput('Mem:            16G        4.2G        8.1G        256M        3.7G         11G');
        if (systemState.centos.swapConfigured) {
            addOutput('Swap:          8.0G          0B        8.0G');
        } else {
            addOutput('Swap:            0B          0B          0B', 'warning');
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
}

function executeDf(args) {
    var humanReadable = args && args.includes('-h');
    
    if (humanReadable) {
        addOutput('Filesystem      Size  Used Avail Use% Mounted on');
        addOutput('/dev/sda1       500G   45G  429G  10% /');
        addOutput('/dev/sda2       1.0G  150M  851M  15% /boot');
        addOutput('tmpfs           8.0G     0  8.0G   0% /dev/shm');
    } else {