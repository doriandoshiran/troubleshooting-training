function listFiles(args) {
    var currentFS = getCurrentFileSystem();
    var dirContent = currentFS[currentDir];
    if (!dirContent) {
        addOutput('ls: cannot access directory', 'error');
        return;
    }
    
    var longFormat = args && (args.includes('-l') || args.includes('-la') || args.includes('-al'));
    var showHidden = args && (args.includes('-a') || args.includes('-la') || args.includes('-al'));
    
    var items = Object.keys(dirContent);
    
    if (showHidden) {
        items.unshift('.', '..');
    }
    
    if (longFormat) {
        if (showHidden) {
            addOutput('total ' + (items.length * 4));
        }
        
        for (var i = 0; i < items.length; i++) {
            var name = items[i];
            var isDir = name.endsWith('/') || name === '.' || name === '..';
            var permissions = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
            var size = isDir ? '4096' : Math.floor(Math.random() * 10000 + 1000).toString();
            var date = 'Jun 16 14:30';
            
            var displayName = name;
            if (name.endsWith('/')) {
                displayName = name.slice(0, -1);
            }
            
            addOutput(permissions + '  1 root root ' + size.padStart(8) + ' ' + date + ' ' + displayName);
        }
    } else {
        var output = '';
        for (var i = 0; i < items.length; i++) {
            var name = items[i];
            if (name.endsWith('/')) {
                output += name.slice(0, -1) + '/  ';
            } else {
                output += name + '  ';
            }
        }
        
        if (output.trim()) {
            addOutput(output.trim());
        }
    }
}

function changeDirectory(dir) {
    if (!dir) {
        currentDir = '/root';
        updatePrompt();
        return;
    }
    
    var targetDir;
    if (dir.startsWith('/')) {
        targetDir = dir;
    } else if (dir === '..') {
        var parts = currentDir.split('/');
        parts.pop();
        targetDir = parts.join('/') || '/';
    } else if (dir === '.') {
        return;
    } else {
        targetDir = currentDir + '/' + dir;
    }
    
    targetDir = targetDir.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
    
    var currentFS = getCurrentFileSystem();
    if (currentFS[targetDir]) {
        currentDir = targetDir;
        updatePrompt();// Global variables
var currentDir = '/root';
var commandHistory = [];
var historyIndex = -1;
var completedTasks = new Set();
var foundFlags = new Set();
var currentHost = 'platform'; // 'platform' or 'cluster'
var systemState = {
    firewallConfigured: false,
    swapConfigured: false,
    ntpConfigured: false,
    yumProxyConfigured: false,
    packagesInstalled: false,
    platformConfigured: false
};

// File system simulation
var fileSystem = {
    '/root': {
        '.bash_history': 'Command history file',
        '.bashrc': 'Bash configuration'
    },
    '/etc': {
        'fstab': 'File system table',
        'ntp.conf': 'NTP configuration',
        'yum.conf': 'YUM configuration',
        'hosts': 'Host file',
        'firewalld/': 'directory'
    },
    '/etc/firewalld': {
        'zones/': 'directory'
    },
    '/opt': {
        'platform/': 'directory'
    },
    '/opt/platform': {
        'config/': 'directory',
        'scripts/': 'directory',
        'logs/': 'directory'
    },
    '/opt/platform/config': {
        'platform-config.yaml': 'Platform configuration template',
        'database-config.yaml': 'Database configuration template',
        'ntp.conf.template': 'NTP configuration template'
    },
    '/opt/platform/scripts': {
        'prepare-system.sh': 'System preparation script',
        'validate-setup.sh': 'Setup validation script'
    },
    '/opt/platform/logs': {
        'preparation.log': 'Preparation log file'
    },
    '/proc': {
        'meminfo': 'Memory information',
        'swaps': 'Swap information'
    },
    '/var/log': {
        'messages': 'System messages log',
        'kubernetes/': 'directory'
    },
    '/var/log/kubernetes': {
        'scheduler.log': 'Kubernetes scheduler log',
        'controller-manager.log': 'Controller manager log',
        'kubelet.log': 'Kubelet log'
    }
};

// Cluster file system (when connected to cluster host)
var clusterFileSystem = {
    '/root': {
        '.kube/': 'directory',
        'troubleshooting/': 'directory'
    },
    '/root/.kube': {
        'config': 'Kubernetes configuration'
    },
    '/root/troubleshooting': {
        'investigation-notes.txt': 'Investigation notes'
    },
    '/var/log': {
        'pods/': 'directory',
        'containers/': 'directory',
        'kubernetes/': 'directory'
    },
    '/var/log/pods': {
        'webapp-deployment-7d4b8c9f4d-xyz123/': 'directory',
        'database-statefulset-0/': 'directory',
        'nginx-ingress-controller-abc123/': 'directory'
    },
    '/var/log/containers': {
        'webapp-container.log': 'Application container logs',
        'database-container.log': 'Database container logs',
        'sidecar-proxy.log': 'Sidecar proxy logs'
    }
};

// Configuration file contents
var configFiles = {
    '/etc/fstab': `# /etc/fstab
# Created by anaconda
UUID=12345678-1234-1234-1234-123456789012 /                       xfs     defaults        0 0
UUID=87654321-4321-4321-4321-210987654321 /boot                   xfs     defaults        0 0
UUID=abcdefgh-ijkl-mnop-qrst-uvwxyz123456 swap                    swap    defaults        0 0`,

    '/etc/ntp.conf': `# NTP configuration file
driftfile /var/lib/ntp/drift
restrict default nomodify notrap nopeer noquery
restrict 127.0.0.1 
restrict ::1

# Default NTP servers
server 0.centos.pool.ntp.org iburst
server 1.centos.pool.ntp.org iburst
server 2.centos.pool.ntp.org iburst
server 3.centos.pool.ntp.org iburst`,

    '/etc/yum.conf': `[main]
cachedir=/var/cache/yum/$basearch/$releasever
keepcache=0
debuglevel=2
logfile=/var/log/yum.log
exactarch=1
obsoletes=1
gpgcheck=1
plugins=1
installonly_limit=5
bugtracker_url=http://bugs.centos.org/set_project.php?project_id=23&ref=http://bugs.centos.org/bug_report_page.php?category=yum
distroverpkg=centos-release`,

    '/opt/platform/config/platform-config.yaml': `# Platform Configuration Template
# Single Node Deployment with Separate Database Host

global:
  deployment_type: "single-node"
  environment: "production"
  
cluster:
  master_node:
    hostname: "platform.company.local"
    ip_address: "192.168.1.100"
    
database:
  type: "postgresql"
  host: "db.company.local"
  port: 5432
  database_name: "platform_db"
  username: "platform_user"
  password: "change_me"
  
network:
  http_port: 80
  https_port: 443
  management_port: 8443
  api_port: 6443
  
storage:
  data_path: "/opt/platform/data"
  logs_path: "/opt/platform/logs"
  
security:
  ssl_enabled: true
  cert_path: "/opt/platform/certs/platform.crt"
  key_path: "/opt/platform/certs/platform.key"`,

    '/opt/platform/config/database-config.yaml': `# Database Configuration Template
# PostgreSQL connection settings for separate database host

database:
  host: "CHANGE_ME"  # Database server hostname/IP
  port: 5432
  name: "platform_db"
  username: "platform_user"
  password: "CHANGE_ME"  # Database password
  
connection:
  max_connections: 100
  timeout: 30
  ssl_mode: "require"
  
backup:
  enabled: true
  schedule: "0 2 * * *"  # Daily at 2 AM
  retention_days: 30`,

    '/proc/meminfo': `MemTotal:       16384000 kB
MemFree:         8192000 kB
MemAvailable:   12288000 kB
Buffers:          512000 kB
Cached:          2048000 kB
SwapCached:            0 kB
Active:          4096000 kB
Inactive:        2048000 kB
SwapTotal:             0 kB
SwapFree:              0 kB`,

    '/proc/swaps': `Filename				Type		Size	Used	Priority`
};

// CTF-related logs and files
var ctfLogs = {
    'webapp-deployment-7d4b8c9f4d-xyz123': `2025-06-16T14:30:15.123Z INFO  Starting webapp container...
2025-06-16T14:30:16.456Z INFO  Loading configuration from /etc/config/app.yaml
2025-06-16T14:30:17.789Z ERROR Failed to connect to database: connection timeout
2025-06-16T14:30:18.012Z ERROR Retrying database connection (attempt 1/3)
2025-06-16T14:30:19.345Z ERROR Retrying database connection (attempt 2/3)
2025-06-16T14:30:20.678Z ERROR Retrying database connection (attempt 3/3)
2025-06-16T14:30:21.901Z FATAL Database connection failed, shutting down
2025-06-16T14:30:22.234Z INFO  Container exit code: 1
2025-06-16T14:30:22.567Z DEBUG Flag: {CTF_FLAG_1:DATABASE_CONNECTION_TIMEOUT_ERROR}`,

    'database-pv-claim': `Name:          database-pv-claim
Namespace:     default
StorageClass:  fast-ssd
Status:        Pending
Volume:        
Labels:        <none>
Annotations:   volume.beta.kubernetes.io/storage-provisioner: kubernetes.io/no-provisioner
Finalizers:    [kubernetes.io/pvc-protection]
Capacity:      
Access Modes:  
VolumeMode:    Filesystem
Events:
  Type     Reason              Age                From                         Message
  ----     ------              ----               ----                         -------
  Warning  ProvisioningFailed  2m (x15 over 30m)  persistentvolume-controller  storageclass "fast-ssd" not found
  Normal   ExternalProvisioning 2m (x4 over 30m)  persistentvolume-controller  waiting for a volume to be created
  Warning  ProvisioningFailed  1m                  persistentvolume-controller  Flag: {CTF_FLAG_2:STORAGE_CLASS_NOT_FOUND}`,

    'nginx-service-config': `apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: default
spec:
  selector:
    app: nginx-app-WRONG
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: LoadBalancer
---
# This service selector is wrong! Should be 'nginx-deployment' not 'nginx-app-WRONG'
# Network connectivity issue: selector mismatch causes service to not find pods
# Flag: {CTF_FLAG_3:SERVICE_SELECTOR_MISMATCH_NETWORK_ISSUE}`
};http://bugs.centos.org/set_project.php?project_id=23&ref=http://bugs.centos.org/bug_report_page.php?category=yum
distroverpkg=centos-release`,

    '/opt/platform/config/platform-config.yaml': `# Platform Configuration Template
# Single Node Deployment with Separate Database Host

global:
  deployment_type: "single-node"
  environment: "production"
  
cluster:
  master_node:
    hostname: "platform.company.local"
    ip_address: "192.168.1.100"
    
database:
  type: "postgresql"
  host: "db.company.local"
  port: 5432
  database_name: "platform_db"
  username: "platform_user"
  password: "change_me"
  
network:
  http_port: 80
  https_port: 443
  management_port: 8443
  api_port: 6443
  
storage:
  data_path: "/opt/platform/data"
  logs_path: "/opt/platform/logs"
  
security:
  ssl_enabled: true
  cert_path: "/opt/platform/certs/platform.crt"
  key_path: "/opt/platform/certs/platform.key"`,

    '/opt/platform/config/database-config.yaml': `# Database Configuration Template
# PostgreSQL connection settings for separate database host

database:
  host: "CHANGE_ME"  # Database server hostname/IP
  port: 5432
  name: "platform_db"
  username: "platform_user"
  password: "CHANGE_ME"  # Database password
  
connection:
  max_connections: 100
  timeout: 30
  ssl_mode: "require"
  
backup:
  enabled: true
  schedule: "0 2 * * *"  # Daily at 2 AM
  retention_days: 30`,

    '/proc/meminfo': `MemTotal:       16384000 kB
MemFree:         8192000 kB
MemAvailable:   12288000 kB
Buffers:          512000 kB
Cached:          2048000 kB
SwapCached:            0 kB
Active:          4096000 kB
Inactive:        2048000 kB
SwapTotal:             0 kB
SwapFree:              0 kB`,

    '/proc/swaps': `Filename				Type		Size	Used	Priority`
};

// Available commands for tab completion
var availableCommands = [
    'ls', 'cd', 'cat', 'vi', 'pwd', 'clear', 'mkdir', 'chmod', 'help', 'start',
    'systemctl', 'firewall-cmd', 'yum', 'rpm', 'service', 'chkconfig',
    'free', 'df', 'du', 'ps', 'top', 'netstat', 'ss', 'ping', 'curl', 'wget',
    'dd', 'mkswap', 'swapon', 'swapoff', 'mount', 'umount', 'fdisk',
    'iptables', 'route', 'ifconfig', 'ip', 'hostnamectl', 'timedatectl',
    'kubectl', 'ssh', 'connect'
];

// Tab switching function
function switchTab(tabName) {
    var tabs = document.querySelectorAll('.tab');
    var contents = document.querySelectorAll('.tab-content');
    
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    for (var i = 0; i < contents.length; i++) {
        contents[i].classList.remove('active');
    }
    
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Handle key press events for main input
function handleMainKeyPress(event) {
    var input = document.getElementById('main-command-input');
    
    if (event.key === 'Enter') {
        var command = input.value.trim();
        if (command) {
            addOutput('[root@platform ' + getCurrentDirName() + ']# ' + command, 'info');
            executeCommand(command);
            commandHistory.push(command);
            historyIndex = commandHistory.length;
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
            addOutput('');
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

function getTabCompletions(partial) {
    var completions = [];
    
    if (!partial.includes(' ')) {
        completions = availableCommands.filter(function(cmd) {
            return cmd.startsWith(partial);
        });
    } else {
        var parts = partial.split(' ');
        var lastPart = parts[parts.length - 1];
        var dirContent = fileSystem[currentDir];
        
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

function getCurrentDirName() {
    if (currentDir === '/root') return '~';
    return currentDir.split('/').pop() || '/';
}

function getPromptHost() {
    return currentHost === 'cluster' ? 'cluster-master' : 'platform';
}

function getCurrentFileSystem() {
    return currentHost === 'cluster' ? clusterFileSystem : fileSystem;
}

// Execute command function
function executeCommand(command) {
    var parts = command.split(' ');
    var cmd = parts[0];
    var args = parts.slice(1);
    
    switch (cmd.toLowerCase()) {
        case 'help':
            showHelp();
            break;
        case 'start':
            startAssessment();
            break;
        case 'connect':
        case 'ssh':
            connectToHost(args[0]);
            break;
        case 'ls':
            listFiles(args);
            break;
        case 'cd':
            changeDirectory(args[0]);
            break;
        case 'cat':
            viewFile(args[0]);
            break;
        case 'vi':
        case 'vim':
        case 'nano':
            editFile(args[0]);
            break;
        case 'pwd':
            addOutput(currentDir);
            break;
        case 'clear':
            clearTerminal();
            break;
        case 'kubectl':
            executeKubectl(args);
            break;
        case 'systemctl':
            if (currentHost === 'cluster') {
                addOutput('systemctl: not available on cluster host. Use kubectl instead.', 'error');
            } else {
                executeSystemctl(args);
            }
            break;
        case 'firewall-cmd':
            if (currentHost === 'cluster') {
                addOutput('firewall-cmd: not available on cluster host', 'error');
            } else {
                executeFirewallCmd(args);
            }
            break;
        case 'yum':
            if (currentHost === 'cluster') {
                addOutput('yum: not available on cluster host', 'error');
            } else {
                executeYum(args);
            }
            break;
        case 'free':
            executeFree(args);
            break;
        case 'df':
            executeDf(args);
            break;
        case 'netstat':
            executeNetstat(args);
            break;
        case 'ss':
            executeSs(args);
            break;
        case 'dd':
            if (currentHost === 'cluster') {
                addOutput('dd: not available on cluster host', 'error');
            } else {
                executeDd(args);
                return; // Don't show prompt immediately
            }
            break;
        case 'mkswap':
            if (currentHost === 'cluster') {
                addOutput('mkswap: not available on cluster host', 'error');
            } else {
                executeMkswap(args);
            }
            break;
        case 'swapon':
            if (currentHost === 'cluster') {
                addOutput('swapon: not available on cluster host', 'error');
            } else {
                executeSwapon(args);
            }
            break;
        case 'ping':
            executePing(args);
            return; // Don't show prompt immediately
        default:
            addOutput('bash: ' + cmd + ': command not found', 'error');
    }
    
    showNewPrompt();
}

function showNewPrompt() {
    addOutput('');
    updatePrompt();
    scrollToBottom();
}

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

function updateTaskProgress() {
    var total = 6;
    var completed = completedTasks.size;
    document.getElementById('task-progress').textContent = 'Progress: ' + completed + '/' + total + ' tasks completed';
}

function updateCtfProgress() {
    var total = 3;
    var found = foundFlags.size;
    document.getElementById('ctf-progress').textContent = 'CTF: ' + found + '/' + total + ' flags found';
    
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
        html += '<div class="flag-found">🚩 Flag ' + (index + 1) + ': ' + flag + '</div>';
    });
    
    if (foundFlags.size === 3) {
        html += '<div class="flag-found">🎉 All flags found! You are a debugging master!</div>';
    }
    
    flagsDiv.innerHTML = html;
}

function checkForFlag(text) {
    var flagRegex = /\{CTF_FLAG_(\d+):([^}]+)\}/g;
    var match;
    
    while ((match = flagRegex.exec(text)) !== null) {
        var flagNumber = match[1];
        var flagContent = match[2];
        var flagText = 'CTF_FLAG_' + flagNumber + ':' + flagContent;
        
        if (!foundFlags.has(flagText)) {
            foundFlags.add(flagText);
            addOutput('🚩 FLAG FOUND! ' + flagText, 'success');
            updateCtfProgress();
        }
    }
}

function updatePrompt() {
    var promptText = '[root@' + getPromptHost() + ' ' + getCurrentDirName() + ']#';
    document.querySelector('.prompt').textContent = promptText;
    document.getElementById('current-dir-display').textContent = 'Current Directory: ' + currentDir + ' (' + getPromptHost() + ')';
    
    // Update terminal header
    var statusElement = document.getElementById('system-status');
    if (currentHost === 'cluster') {
        statusElement.textContent = 'System: Online | Kubernetes Cluster';
    } else {
        statusElement.textContent = 'System: Online | CentOS 7.9';
    }
}

// Command implementations
function connectToHost(hostname) {
    if (!hostname) {
        addOutput('Available hosts:', 'info');
        addOutput('  platform.company.local  - CentOS preparation host');
        addOutput('  cluster.company.local   - Kubernetes cluster (CTF challenges)');
        addOutput('');
        addOutput('Usage: connect [hostname] or ssh [hostname]');
        return;
    }
    
    if (hostname === 'cluster.company.local' || hostname === 'cluster') {
        addOutput('Connecting to cluster.company.local...', 'info');
        addOutput('Warning: You are now connected to a production Kubernetes cluster!', 'warning');
        addOutput('Use kubectl commands to investigate the cluster issues.', 'info');
        addOutput('');
        currentHost = 'cluster';
        currentDir = '/root';
    } else if (hostname === 'platform.company.local' || hostname === 'platform') {
        addOutput('Connecting to platform.company.local...', 'info');
        addOutput('Connected to CentOS preparation environment.', 'success');
        addOutput('');
        currentHost = 'platform';
        currentDir = '/root';
    } else {
        addOutput('ssh: Could not resolve hostname ' + hostname, 'error');
        return;
    }
    
    updatePrompt();
}

function executeKubectl(args) {
    if (currentHost !== 'cluster') {
        addOutput('kubectl: command not found. Connect to cluster host first.', 'error');
        addOutput('Use: connect cluster.company.local', 'info');
        return;
    }
    
    var subcommand = args[0];
    var resource = args[1];
    var name = args[2];
    
    if (!subcommand) {
        addOutput('kubectl: missing subcommand', 'error');
        addOutput('Available: get, describe, logs, events');
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
        } else if (resource === 'pv' || resource === 'persistentvolumes') {
            addOutput('NAME              CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE');
            addOutput('database-pv       50Gi       RWO            Retain           Available           manual                  1h');
        } else if (resource === 'pvc' || resource === 'persistentvolumeclaims') {
            addOutput('NAME                STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE');
            addOutput('database-pv-claim   Pending                                      fast-ssd       30m', 'warning');
        } else if (resource === 'events') {
            addOutput('LAST SEEN   TYPE      REASON              OBJECT                               MESSAGE');
            addOutput('2m          Warning   ProvisioningFailed  persistentvolumeclaim/database-pv-claim   storageclass "fast-ssd" not found');
            addOutput('5m          Warning   BackOff             pod/webapp-deployment-7d4b8c9f4d-xyz123   Back-off restarting failed container');
            addOutput('8m          Normal    Pulling             pod/webapp-deployment-7d4b8c9f4d-xyz123   Pulling image "webapp:latest"');
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
            addOutput('Events:');
            addOutput('  Warning  BackOff  2m (x10 over 5m)  kubelet  Back-off restarting failed container');
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
function showHelp() {
    if (currentHost === 'cluster') {
        addOutput('Kubernetes Cluster Troubleshooting Commands:', 'info');
        addOutput('');
        addOutput('Connection Commands:', 'success');
        addOutput('  connect [hostname]       - Switch between hosts');
        addOutput('  ssh [hostname]           - Same as connect');
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
        addOutput('🚩 CTF Challenge: Find 3 flags hidden in the cluster logs and configurations!');
    } else {
        addOutput('CentOS System Preparation Commands:', 'info');
        addOutput('');
        addOutput('Connection Commands:', 'success');
        addOutput('  connect [hostname]       - Switch to cluster host for CTF challenges');
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
        addOutput('Network Commands:', 'success');
        addOutput('  netstat -tuln            - Show listening ports');
        addOutput('  ss -tuln                 - Show socket statistics');
        addOutput('  ping [host]              - Test connectivity');
        addOutput('');
        addOutput('Storage Commands:', 'success');
        addOutput('  dd                       - Create files/swap');
        addOutput('  mkswap [file]            - Setup swap file');
        addOutput('  swapon [file]            - Enable swap');
        addOutput('');
        addOutput('Type "start" to begin the system preparation assessment.');
        addOutput('Type "connect cluster.company.local" for CTF challenges.');
    }
}

function startAssessment() {
    if (currentHost === 'cluster') {
        addOutput('🚩 CTF Challenge Mode: Kubernetes Troubleshooting', 'success');
        addOutput('');
        addOutput('You are now investigating a production Kubernetes cluster with several issues.', 'warning');
        addOutput('Your mission: Find 3 flags hidden in logs and configurations to prove your debugging skills!', 'info');
        addOutput('');
        addOutput('Known Issues:', 'error');
        addOutput('1. 💥 webapp-deployment pod keeps crashing');
        addOutput('2. 💾 database-pv-claim stuck in Pending status');
        addOutput('3. 🌐 nginx-service has connectivity problems');
        addOutput('');
        addOutput('Investigation Tips:', 'info');
        addOutput('• Use "kubectl get pods" to see pod status');
        addOutput('• Use "kubectl logs [pod-name]" to check application logs');
        addOutput('• Use "kubectl describe [resource] [name]" for detailed info');
        addOutput('• Check events with "kubectl get events"');
        addOutput('• Look for configuration issues in service definitions');
        addOutput('');
        addOutput('🔍 Start investigating! Flags are hidden in the detailed output.', 'success');
    } else {
        addOutput('CentOS System Preparation Assessment Started!', 'success');
        addOutput('');
        addOutput('Complete the following preparation tasks:', 'info');
        addOutput('');
        addOutput('1. Configure Firewall:', 'warning');
        addOutput('   - Research and open ports: 22, 80, 443, 8443, 5432, 9200, 6443');
        addOutput('   - Make configuration permanent and reload');
        addOutput('');
        addOutput('2. Create Swap File (8GB):', 'warning');
        addOutput('   - Research dd command to create 8GB file');
        addOutput('   - Set proper permissions and initialize swap');
        addOutput('   - Activate swap and make it persistent');
        addOutput('');
        addOutput('3. Configure NTP:', 'warning');
        addOutput('   - Install NTP package using yum');
        addOutput('   - Configure time servers in config file');
        addOutput('   - Enable and start the service');
        addOutput('');
        addOutput('4. Configure YUM Proxy:', 'warning');
        addOutput('   - Research yum.conf configuration');
        addOutput('   - Add proxy settings for corporate environment');
        addOutput('');
        addOutput('5. Install Required Packages:', 'warning');
        addOutput('   - Update system packages');
        addOutput('   - Install essential tools and dependencies');
        addOutput('');
        addOutput('6. Configure Platform Settings:', 'warning');
        addOutput('   - Edit platform configuration for single-node deployment');
        addOutput('   - Configure separate database host settings');
        addOutput('');
        addOutput('💡 Research commands online - this simulates real-world scenarios!', 'info');
        addOutput('🚩 Want a challenge? Try: connect cluster.company.local', 'success');
    }
}

function listFiles(args) {
    var dirContent = fileSystem[currentDir];
    if (!dirContent) {
        addOutput('ls: cannot access directory', 'error');
        return;
    }
    
    var longFormat = args && (args.includes('-l') || args.includes('-la') || args.includes('-al'));
    var showHidden = args && (args.includes('-a') || args.includes('-la') || args.includes('-al'));
    
    var items = Object.keys(dirContent);
    
    if (showHidden) {
        items.unshift('.', '..');
    }
    
    if (longFormat) {
        if (showHidden) {
            addOutput('total ' + (items.length * 4));
        }
        
        for (var i = 0; i < items.length; i++) {
            var name = items[i];
            var isDir = name.endsWith('/') || name === '.' || name === '..';
            var permissions = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
            var size = isDir ? '4096' : Math.floor(Math.random() * 10000 + 1000).toString();
            var date = 'Jun 16 14:30';
            
            var displayName = name;
            if (name.endsWith('/')) {
                displayName = name.slice(0, -1);
            }
            
            addOutput(permissions + '  1 root root ' + size.padStart(8) + ' ' + date + ' ' + displayName);
        }
    } else {
        var output = '';
        for (var i = 0; i < items.length; i++) {
            var name = items[i];
            if (name.endsWith('/')) {
                output += name.slice(0, -1) + '/  ';
            } else {
                output += name + '  ';
            }
        }
        
        if (output.trim()) {
            addOutput(output.trim());
        }
    }
}

function changeDirectory(dir) {
    if (!dir) {
        currentDir = '/root';
        updatePrompt();
        return;
    }
    
    var targetDir;
    if (dir.startsWith('/')) {
        targetDir = dir;
    } else if (dir === '..') {
        var parts = currentDir.split('/');
        parts.pop();
        targetDir = parts.join('/') || '/';
    } else if (dir === '.') {
        return;
    } else {
        targetDir = currentDir + '/' + dir;
    }
    
    targetDir = targetDir.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
    
    if (fileSystem[targetDir]) {
        currentDir = targetDir;
    } else {
        addOutput('cd: ' + dir + ': No such file or directory', 'error');
    }
}

function viewFile(filename) {
    if (!filename) {
        addOutput('cat: missing file operand', 'error');
        return;
    }
    
    var fullPath = currentDir + '/' + filename;
    if (configFiles[fullPath]) {
        var lines = configFiles[fullPath].split('\n');
        for (var i = 0; i < lines.length; i++) {
            addOutput(lines[i]);
        }
    } else if (configFiles[filename]) {
        var lines = configFiles[filename].split('\n');
        for (var i = 0; i < lines.length; i++) {
            addOutput(lines[i]);
        }
    } else if (currentHost === 'cluster' && filename.includes('log')) {
        // Handle cluster log files
        var logContent = ctfLogs[filename] || ctfLogs[filename.replace('.log', '')];
        if (logContent) {
            var lines = logContent.split('\n');
            for (var i = 0; i < lines.length; i++) {
                addOutput(lines[i]);
            }
            checkForFlag(logContent);
        } else {
            addOutput('cat: ' + filename + ': No such file or directory', 'error');
        }
    } else {
        addOutput('cat: ' + filename + ': No such file or directory', 'error');
    }
}

function editFile(filename) {
    if (!filename) {
        addOutput('vi: missing file operand', 'error');
        return;
    }
    
    addOutput('Opening ' + filename + ' in vi editor...', 'info');
    addOutput('(This is a simulation - file editing interface not implemented)', 'warning');
    addOutput('');
    
    if (filename === '/etc/yum.conf' || filename === 'yum.conf') {
        addOutput('To configure YUM proxy, add these lines to /etc/yum.conf:', 'info');
        addOutput('proxy=http://proxy.company.com:8080');
        addOutput('proxy_username=your_username');
        addOutput('proxy_password=your_password');
        addOutput('');
        addOutput('Simulating proxy configuration...', 'warning');
        setTimeout(function() {
            addOutput('YUM proxy configuration updated!', 'success');
            systemState.yumProxyConfigured = true;
            completedTasks.add('yum-proxy');
            updateTaskProgress();
            showNewPrompt();
        }, 2000);
        return;
    } else if (filename.includes('platform-config.yaml')) {
        addOutput('Configure these settings for single-node deployment:', 'info');
        addOutput('1. Set database.host to your database server IP');
        addOutput('2. Update database.password');
        addOutput('3. Verify network ports configuration');
        addOutput('');
        addOutput('Example configuration:');
        addOutput('database:');
        addOutput('  host: "192.168.1.200"  # Your database server');
        addOutput('  password: "SecurePassword123"');
        addOutput('');
        addOutput('Simulating configuration update...', 'warning');
        setTimeout(function() {
            addOutput('Platform configuration updated!', 'success');
            systemState.platformConfigured = true;
            completedTasks.add('platform-config');
            updateTaskProgress();
            checkAllTasksComplete();
            showNewPrompt();
        }, 2000);
        return;
    } else if (filename.includes('fstab')) {
        addOutput('To make swap permanent, add this line to /etc/fstab:', 'info');
        addOutput('/swapfile swap swap defaults 0 0');
        addOutput('');
        addOutput('Simulating fstab update...', 'warning');
        setTimeout(function() {
            addOutput('Fstab updated - swap will be persistent on reboot!', 'success');
            showNewPrompt();
        }, 1000);
        return;
    }
}

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
                systemState.ntpConfigured = true;
                completedTasks.add('ntp');
                updateTaskProgress();
                showNewPrompt();
            }, 1000);
            return;
        } else if (action === 'enable') {
            addOutput('Enabling ntpd service...', 'info');
            addOutput('Created symlink from /etc/systemd/system/multi-user.target.wants/ntpd.service to /usr/lib/systemd/system/ntpd.service', 'success');
        } else if (action === 'status') {
            if (systemState.ntpConfigured) {
                addOutput('● ntpd.service - Network Time Protocol daemon');
                addOutput('   Loaded: loaded (/usr/lib/systemd/system/ntpd.service; enabled)', 'success');
                addOutput('   Active: active (running) since Mon 2025-06-16 14:30:00 UTC', 'success');
            } else {
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
            if (!systemState.openPorts) {
                systemState.openPorts = [];
            }
            systemState.openPorts.push(port[1]);
            
            // Check if all required ports are opened
            var requiredPorts = ['22/tcp', '80/tcp', '443/tcp', '8443/tcp', '5432/tcp', '9200/tcp', '6443/tcp'];
            var allOpened = requiredPorts.every(function(p) {
                return systemState.openPorts.includes(p);
            });
            
            if (allOpened && !completedTasks.has('firewall')) {
                addOutput('All required ports have been opened!', 'info');
                systemState.firewallConfigured = true;
                completedTasks.add('firewall');
                updateTaskProgress();
            }
        }
    } else if (command.includes('--reload')) {
        addOutput('success', 'success');
        if (systemState.openPorts && systemState.openPorts.length > 0) {
            addOutput('Firewall rules reloaded and active', 'info');
        }
    } else if (command.includes('--list-ports')) {
        if (systemState.openPorts && systemState.openPorts.length > 0) {
            addOutput(systemState.openPorts.join(' '));
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
                
                if (hasRequiredPackages && !systemState.packagesInstalled) {
                    systemState.packagesInstalled = true;
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
        if (systemState.swapConfigured) {
            addOutput('Swap:          8.0G          0B        8.0G');
        } else {
            addOutput('Swap:            0B          0B          0B', 'warning');
        }
    } else {
        addOutput('             total       used       free     shared    buffers     cached');
        addOutput('Mem:      16777216    4194304    8388608     262144     524288    3932160');
        if (systemState.swapConfigured) {
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
        addOutput('Filesystem     1K-blocks     Used Available Use% Mounted on');
        addOutput('/dev/sda1      524288000 47185920 451102080  10% /');
        addOutput('/dev/sda2        1048576   153600    870400  15% /boot');
        addOutput('tmpfs            8388608        0   8388608   0% /dev/shm');
    }
}

function executeNetstat(args) {
    if (args.includes('-tuln')) {
        addOutput('Active Internet connections (only servers)');
        addOutput('Proto Recv-Q Send-Q Local Address           Foreign Address         State');
        addOutput('tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN');
        
        if (systemState.firewallConfigured || (systemState.openPorts && systemState.openPorts.length > 0)) {
            addOutput('tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN');
            addOutput('tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN');
            addOutput('tcp        0      0 0.0.0.0:8443            0.0.0.0:*               LISTEN');
        }
        
        if (systemState.ntpConfigured) {
            addOutput('udp        0      0 0.0.0.0:123             0.0.0.0:*');
        }
    } else {
        addOutput('netstat: invalid option', 'error');
        addOutput('Try "netstat -tuln" to show listening ports');
    }
}

function executeSs(args) {
    if (args.includes('-tuln')) {
        addOutput('Netid  State      Recv-Q Send-Q Local Address:Port               Peer Address:Port');
        addOutput('tcp    LISTEN     0      128    *:22                           *:*');
        
        if (systemState.firewallConfigured || (systemState.openPorts && systemState.openPorts.length > 0)) {
            addOutput('tcp    LISTEN     0      128    *:80                           *:*');
            addOutput('tcp    LISTEN     0      128    *:443                          *:*');
            addOutput('tcp    LISTEN     0      128    *:8443                         *:*');
        }
        
        if (systemState.ntpConfigured) {
            addOutput('udp    UNCONN     0      0      *:123                          *:*');
        }
    } else {
        addOutput('ss: invalid option', 'error');
        addOutput('Try "ss -tuln" to show listening sockets');
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
        systemState.swapConfigured = true;
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
window.onload = function() {
    addOutput('Multi-Host Training Environment Initialized', 'success');
    addOutput('Available hosts:', 'info');
    addOutput('  • platform.company.local - CentOS preparation tasks');
    addOutput('  • cluster.company.local  - Kubernetes CTF challenges');
    addOutput('');
    addOutput('Type "help" for commands, "start" for assessment, or "connect cluster.company.local" for CTF.', 'info');
    updateCtfProgress();
    showNewPrompt();
};