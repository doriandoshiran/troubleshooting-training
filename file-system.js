    '/var/log/pods/webapp-deployment-7d4b8c9f4d-xyz123/webapp/0.log': `2025-06-16T14:30:15.123Z INFO  Starting webapp container...
2025-06-16T14:30:16.456Z INFO  Loading configuration from /etc/config/app.yaml
2025-06-16T14:30:17.789Z INFO  Connecting to database at db.company.local:5432
2025-06-16T14:30:18.012Z ERROR Failed to connect to database: connection timeout after 30s
2025-06-16T14:30:19.345Z ERROR Database host db.company.local is unreachable
2025-06-16T14:30:20.678Z ERROR Retrying database connection (attempt 1/3)
2025-06-16T14:30:25.901Z ERROR Retrying database connection (attempt 2/3)
2025-06-16T14:30:30.234Z ERROR Retrying database connection (attempt 3/3)
2025-06-16T14:30:35.567Z FATAL All database connection attempts failed, shutting down
2025-06-16T14:30:36.890Z INFO  Container exit code: 1
2025-06-16T14:30:37.123Z DEBUG Investigation shows database service is running but unreachable
2025-06-16T14:30:38.456Z DEBUG FLAG{FILESYSTEM_LOG_INVESTIGATION_COMPLETE}
2025-06-16T14:30:39.789Z DEBUG 🔍 Container logs reveal network connectivity issues`,

    '/var/log/containers/webapp-7d4b8c9f4d-xyz123_default_webapp-abc123.log': `{"log":"Starting webapp container...\\n","stream":"stdout","time":"2025-06-16T14:30:15.123456789Z"}
{"log":"Loading configuration from /etc/config/app.yaml\\n","stream":"stdout","time":"2025-06-16T14:30:16.456789012Z"}
{"log":"Connecting to database at db.company.local:5432\\n","stream":"stdout","time":"2025-06-16T14:30:17.789012345Z"}
{"log":"ERROR: Failed to connect to database: connection timeout after 30s\\n","stream":"stderr","time":"2025-06-16T14:30:18.012345678Z"}
{"log":"FLAG{CONTAINER_LOG_FORMAT_DISCOVERED}\\n","stream":"stdout","time":"2025-06-16T14:30:38.456789012Z"}`,

    '/var/log/kubernetes/kubelet.log': `I0616 14:30:10.123456       1 kubelet.go:1234] Starting kubelet
I0616 14:30:11.234567       1 kubelet.go:1245] Kubelet version: v1.28.0
I0616 14:30:12.345678       1 server.go:123] Started kubelet server
W0616 14:30:15.456789       1 pod_workers.go:456] Pod webapp-deployment-7d4b8c9f4d-xyz123 failed to start
E0616 14:30:18.567890       1 kuberuntime_manager.go:789] container "webapp" in pod "webapp-deployment-7d4b8c9f4d-xyz123" is waiting to start: CrashLoopBackOff
I0616 14:30:20.678901       1 kubelet.go:2456] SyncLoop (probe): webapp
I0616 14:30:25.789012       1 kubelet.go:2456] SyncLoop (probe): webapp
E0616 14:30:30.890123       1 pod_workers.go:234] Error syncing pod webapp-deployment-7d4b8c9f4d-xyz123: failed to start container "webapp": Error response from daemon: container exited with non-zero status
I0616 14:30:35.901234       1 kubelet.go:1789] FLAG{KUBELET_DEBUGGING_SKILLS} - Advanced troubleshooting complete`,// File system simulation and file operations

// Ensure global scope
window.fileSystem = window.fileSystem || {};
window.clusterFileSystem = window.clusterFileSystem || {};
window.configFiles = window.configFiles || {};
window.ctfLogs = window.ctfLogs || {};

// File system simulation for CentOS host
var fileSystem = {
    '/': {
        'root/': 'directory',
        'etc/': 'directory',
        'opt/': 'directory',
        'proc/': 'directory',
        'var/': 'directory',
        'home/': 'directory',
        'usr/': 'directory',
        'bin/': 'directory',
        'sbin/': 'directory'
    },
    '/root': {
        '.bash_history': 'Command history file',
        '.bashrc': 'Bash configuration',
        '.vimrc': 'Vim configuration',
        'shrek.txt': 'Secret Shrek quotes file'
    },
    '/etc': {
        'fstab': 'File system table',
        'ntp.conf': 'NTP configuration',
        'yum.conf': 'YUM configuration',
        'hosts': 'Host file',
        'passwd': 'User account information',
        'shadow': 'User password hashes',
        'firewalld/': 'directory',
        'systemd/': 'directory'
    },
    '/etc/firewalld': {
        'zones/': 'directory',
        'firewalld.conf': 'Firewall configuration'
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
        'preparation.log': 'Preparation log file',
        'error.log': 'Error log file'
    },
    '/proc': {
        'meminfo': 'Memory information',
        'swaps': 'Swap information',
        'cpuinfo': 'CPU information',
        'version': 'Kernel version'
    },
    '/var/log': {
        'messages': 'System messages log',
        'secure': 'Security log',
        'kubernetes/': 'directory'
    },
    '/var/log/kubernetes': {
        'scheduler.log': 'Kubernetes scheduler log',
        'controller-manager.log': 'Controller manager log',
        'kubelet.log': 'Kubelet log'
    },
    '/home': {
        'training/': 'directory'
    },
    '/home/training': {
        'README.txt': 'Training instructions',
        'memes/': 'directory'
    },
    '/home/training/memes': {
        'shrek-quotes.txt': 'Shrek wisdom'
    }
};

// Cluster file system (when connected to k8s host)
var clusterFileSystem = {
    '/': {
        'root/': 'directory',
        'var/': 'directory',
        'etc/': 'directory',
        'home/': 'directory'
    },
    '/root': {
        '.kube/': 'directory',
        'troubleshooting/': 'directory',
        '.bashrc': 'Bash configuration'
    },
    '/root/.kube': {
        'config': 'Kubernetes configuration'
    },
    '/root/troubleshooting': {
        'investigation-notes.txt': 'Investigation notes',
        'meme-logs.txt': 'Funny log analysis'
    },
    '/var/log': {
        'pods/': 'directory',
        'containers/': 'directory',
        'kubernetes/': 'directory'
    },
    '/var/log/pods': {
        'webapp-deployment-7d4b8c9f4d-xyz123/': 'directory',
        'database-statefulset-0/': 'directory',
        'nginx-ingress-controller-abc123/': 'directory',
        'shrek-pod-123/': 'directory'
    },
    '/var/log/containers': {
        'webapp-container.log': 'Application container logs',
        'database-container.log': 'Database container logs',
        'sidecar-proxy.log': 'Sidecar proxy logs'
    }
};

// Configuration file contents with easter eggs - STATIC VERSION
var configFiles = {
    '/etc/fstab': `# /etc/fstab
# Created by anaconda
# Fun fact: This file is older than Shrek movies
UUID=12345678-1234-1234-1234-123456789012 /                       xfs     defaults        0 0
UUID=87654321-4321-4321-4321-210987654321 /boot                   xfs     defaults        0 0
UUID=abcdefgh-ijkl-mnop-qrst-uvwxyz123456 swap                    swap    defaults        0 0
# /swapfile swap swap defaults 0 0`,

    '/etc/ntp.conf': `# NTP configuration file
# Time sync is important - even Shrek needs to be on time!
driftfile /var/lib/ntp/drift
restrict default nomodify notrap nopeer noquery
restrict 127.0.0.1 
restrict ::1

# Default NTP servers
server 0.centos.pool.ntp.org iburst
server 1.centos.pool.ntp.org iburst
server 2.centos.pool.ntp.org iburst
server 3.centos.pool.ntp.org iburst

# Additional time servers can be added here
# server ntp.example.com iburst`,

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
distroverpkg=centos-release

# Corporate proxy configuration (uncomment and configure):
# proxy=http://proxy.company.com:8080
# proxy_username=corp_user
# proxy_password=ProxyPass123

# Fun fact: YUM stands for "Yellow dog Updater, Modified"
# Not "Yet another Unnecessary Manager" as some people think!`,

    '/etc/hosts': `127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.1.100 prod-centos-01.company.local prod-centos-01
192.168.1.200 db.company.local db-server
# 192.168.1.42 shrek.swamp.local shrek
# 🎯 Ready for enterprise configuration!`,

    '/root/shrek.txt': `🟢 SHREK WISDOM FOR SYSADMINS 🟢

"Better out than in!" - Always check your logs
"I'm not a monster, I'm just ahead of the curve" - When deploying on Friday
"What are you doing in my swamp?!" - When users complain about server maintenance
"Layers! Onions have layers!" - Just like network architecture
"Some of you may die, but that is a sacrifice I am willing to make" - Load balancing strategy

Remember: Even ogres need proper system monitoring!
🧅 Ogres are like servers - they have layers! 🧅`,

    '/home/training/memes/shrek-quotes.txt': `🧅 SHREK TECH QUOTES 🧅

"This is the part where you run away" - When seeing the server bill
"I like that boulder. That is a nice boulder." - Appreciating stable infrastructure  
"Are we there yet?" - Every deployment ever
"Do you know the muffin man?" - Asking about the on-call engineer
"Donkey!" - When the backup fails
"I'm looking down!" - Checking server metrics

Pro tip: Be like Shrek - embrace the layers (of your application stack)!`,

    '/opt/platform/config/platform-config.yaml': `# Platform Configuration Template
# Single Node Deployment with Separate Database Host
# ⚠️  Configure carefully - "With great power comes great responsibility" - Spider-Man (and Shrek)

global:
  deployment_type: "single-node"
  environment: "production"
  
cluster:
  master_node:
    hostname: "platform.company.local"
    ip_address: "192.168.1.100"
    
database:
  type: "postgresql"
  host: "CHANGE_ME"  # Set to: db.company.local (192.168.1.200)
  port: 5432
  database_name: "platform_db"
  username: "platform_user"
  password: "CHANGE_ME"  # Set to: SecureDbPass2025!
  
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
  key_path: "/opt/platform/certs/platform.key"
  
# Required configuration values:
# - database.host = "db.company.local" (IP: 192.168.1.200)
# - database.password = "SecureDbPass2025!" (secure password)
# - Verify all port configurations match your firewall rules
# 
# Pro tip: Like ogres and onions, good configs have layers!`,

    '/proc/meminfo': `MemTotal:       16777216 kB
MemFree:         8388608 kB
MemAvailable:   12582912 kB
Buffers:          524288 kB
Cached:          2097152 kB
SwapCached:            0 kB
Active:          4194304 kB
Inactive:        2097152 kB
SwapTotal:       0 kB
SwapFree:        0 kB
# Fun fact: This server has more RAM than Shrek's swamp has water!`,

    '/proc/swaps': `Filename				Type		Size	Used	Priority
# No swap configured - even Shrek needs backup space!`,

    '/proc/version': `Linux version 4.18.0-348.el8.x86_64 (mockbuild@centos.org) (gcc version 8.5.0) #1 SMP Tue Oct 19 15:14:05 UTC 2021
Built with love, layers, and a little bit of ogre magic! 🧅`,

    '/root/.kube/config': `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTi...
    server: https://192.168.1.10:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: kubernetes-admin
  name: kubernetes-admin@kubernetes
current-context: kubernetes-admin@kubernetes
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    client-certificate-data: LS0tLS1CRUdJTi...
    client-key-data: LS0tLS1CRUdJTi...
# Remember: With great kubectl comes great responsibility!`,

    '/root/troubleshooting/investigation-notes.txt': `Kubernetes Cluster Investigation Notes
=====================================

Issues Identified:
1. webapp-deployment pod in CrashLoopBackOff state
   - Container exits with code 1
   - Check logs for database connection issues
   - Status: More crashed than Shrek's morning routine

2. database-pv-claim stuck in Pending status
   - StorageClass "fast-ssd" not found
   - Check storage configuration
   - Status: More pending than Fiona waiting for rescue

3. nginx-service connectivity problems
   - Service selector may be misconfigured
   - Check service and deployment labels
   - Status: More confused than Donkey in the morning

Commands to investigate:
- kubectl get pods
- kubectl describe pod webapp-deployment-7d4b8c9f4d-xyz123
- kubectl logs webapp-deployment-7d4b8c9f4d-xyz123
- kubectl get pvc
- kubectl describe pvc database-pv-claim
- kubectl get services
- kubectl describe service nginx-service

Look for FLAGS in the output!

💡 Pro tip: Debugging Kubernetes is like peeling an onion - lots of layers and it might make you cry!
🔍 Remember: Stay persistent - investigate thoroughly!`,

    '/root/troubleshooting/meme-logs.txt': `🎭 KUBERNETES MEME TROUBLESHOOTING LOG 🎭

[ERROR] Pod crashed harder than my hopes and dreams
[WARN] Storage class not found - it's like looking for Shrek in a beauty contest
[INFO] Service selector wrong - more lost than Donkey without Shrek
[DEBUG] 🔍 Debugging mode: ACTIVATED 🔍
[ERROR] Database connection timeout - even Shrek waits for no one!
[SUCCESS] Finally fixed! 🎉 Victory tastes better than onions!

Moral of the story: 
- Persistence pays off (never give up)
- Read the logs (they're like ogres - have layers)
- Never give up (Shrek didn't give up on Fiona)

🧅 "Better out than in!" - Always check your error logs! 🧅`
};

// CTF-related logs and files with easter eggs
var ctfLogs = {
    'webapp-deployment-7d4b8c9f4d-xyz123': `2025-06-16T14:30:15.123Z INFO  Starting webapp container...
2025-06-16T14:30:16.456Z INFO  Loading configuration from /etc/config/app.yaml
2025-06-16T14:30:17.789Z INFO  Connecting to database at db.company.local:5432
2025-06-16T14:30:18.012Z ERROR Failed to connect to database: connection timeout after 30s
2025-06-16T14:30:19.345Z ERROR Database host db.company.local is unreachable (more unreachable than Shrek's social skills)
2025-06-16T14:30:20.678Z ERROR Retrying database connection (attempt 1/3)
2025-06-16T14:30:25.901Z ERROR Retrying database connection (attempt 2/3)
2025-06-16T14:30:30.234Z ERROR Retrying database connection (attempt 3/3)
2025-06-16T14:30:35.567Z FATAL All database connection attempts failed, shutting down
2025-06-16T14:30:36.890Z INFO  Container exit code: 1 (sadder than when Fiona turned into an ogre)
2025-06-16T14:30:37.123Z DEBUG Investigation shows database service is running but unreachable
2025-06-16T14:30:38.456Z DEBUG FLAG{DATABASE_CONNECTION_TIMEOUT_DETECTED}
2025-06-16T14:30:39.789Z DEBUG 🔍 Keep investigating! 🔍`,

    'database-pv-claim': `Name:          database-pv-claim
Namespace:     default
StorageClass:  fast-ssd
Status:        Pending (more pending than Donkey waiting for attention)
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
  Warning  ProvisioningFailed  1m                  persistentvolume-controller  Failed to provision volume with StorageClass "fast-ssd": storageclass.storage.k8s.io "fast-ssd" not found
  Warning  StorageClassNotFound 30s               persistentvolume-controller  FLAG{STORAGE_CLASS_MISCONFIGURATION_ERROR}
  Info     OgreWisdom          10s                persistent-volume-controller  "Better out than in!" - Check your storage classes! 🧅`,

    'nginx-service-config': `apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: default
  labels:
    app: nginx
    # 🔧 Deployed with care and precision 🔧
spec:
  selector:
    app: nginx-app-WRONG  # This selector is as wrong as calling Shrek handsome!
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: LoadBalancer
---
# SERVICE CONFIGURATION ANALYSIS:
# The service selector 'nginx-app-WRONG' doesn't match any pods
# Actual nginx deployment uses label 'app: nginx-deployment'
# This mismatch prevents the service from routing traffic to pods
# 
# It's like Donkey trying to connect to Dragon but calling her "Pretty Pony"
# 
# Network connectivity issue root cause:
# Service selector label mismatch causes zero endpoints
# FLAG{SERVICE_SELECTOR_LABEL_MISMATCH_FOUND}
# 
# 🧅 Remember: Labels are like ogres - they have to match exactly! 🧅
# 🔍 Debug carefully - investigate thoroughly! 🔍`
};

// Assign to window object for global access
window.fileSystem = fileSystem;
window.clusterFileSystem = clusterFileSystem;
window.configFiles = configFiles;
window.ctfLogs = ctfLogs;

// Debug function to verify files are loaded (can be called from console)
window.debugFiles = function() {
    console.log('ConfigFiles loaded:', Object.keys(window.configFiles || {}));
    console.log('CTF logs loaded:', Object.keys(window.ctfLogs || {}));
    console.log('Sample investigation notes:', window.configFiles['/root/troubleshooting/investigation-notes.txt'] ? 'FOUND' : 'NOT FOUND');
    console.log('Sample meme logs:', window.configFiles['/root/troubleshooting/meme-logs.txt'] ? 'FOUND' : 'NOT FOUND');
};

// Initialize the files immediately
if (typeof window !== 'undefined') {
    window.fileSystem = fileSystem;
    window.clusterFileSystem = clusterFileSystem;
    window.configFiles = configFiles;
    window.ctfLogs = ctfLogs;
}

// File operation functions with improved error handling
function listFiles(args) {
    var currentFS = getCurrentFileSystem();
    var dirContent = currentFS[currentDir];
    if (!dirContent) {
        addOutput('ls: cannot access \'' + currentDir + '\': No such file or directory', 'error');
        addOutput('💡 Pro tip: Like Shrek finding his way out of the swamp, double-check your path!', 'warning');
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
            var displayName = name;
            if (name.endsWith('/')) {
                displayName = name.slice(0, -1);
            }
            output += displayName + '  ';
        }
        addOutput(output.trim());
    }
}

function changeDirectory(path) {
    var currentFS = getCurrentFileSystem();
    
    if (!path || path === '~') {
        currentDir = '/root';
        return;
    }
    
    if (path === '..') {
        if (currentDir !== '/') {
            var parts = currentDir.split('/');
            parts.pop();
            currentDir = parts.join('/') || '/';
        }
        return;
    }
    
    if (path === '/') {
        currentDir = '/';
        return;
    }
    
    // Remove trailing slash from path for consistency
    var cleanPath = path;
    if (cleanPath.endsWith('/') && cleanPath !== '/') {
        cleanPath = cleanPath.slice(0, -1);
    }
    
    var targetPath;
    if (cleanPath.startsWith('/')) {
        targetPath = cleanPath;
    } else {
        targetPath = currentDir + '/' + cleanPath;
        targetPath = targetPath.replace(/\/+/g, '/');
    }
    
    // Check if the target path exists in the file system
    if (currentFS[targetPath]) {
        currentDir = targetPath;
        return;
    }
    
    // Also check if it's a directory in the current directory
    var dirContent = currentFS[currentDir];
    if (dirContent) {
        // Check for exact match or with trailing slash
        if (dirContent[cleanPath] === 'directory' || dirContent[cleanPath + '/'] === 'directory') {
            currentDir = targetPath;
            return;
        }
        // Check if the path with trailing slash exists in current dir content
        if (dirContent[cleanPath + '/']) {
            currentDir = targetPath;
            return;
        }
    }
    
    addOutput('cd: ' + path + ': No such file or directory', 'error');
    
    // Easter egg responses
    if (path.toLowerCase().includes('swamp')) {
        addOutput('🧅 "What are you doing in my swamp?!" - Directory not found, but Shrek approves of the attempt!', 'warning');
    } else {
        addOutput('💡 Hint: Use "ls" to see available directories, like peeling an onion layer by layer!', 'info');
    }
}

function viewFile(filename) {
    if (!filename) {
        addOutput('cat: missing file argument', 'error');
        addOutput('Usage: cat [file]');
        addOutput('💡 Remember: "Better out than in!" - Shrek (also applies to file contents)', 'info');
        return;
    }
    
    var filePath;
    if (filename.startsWith('/')) {
        filePath = filename;
    } else {
        filePath = currentDir + '/' + filename;
        filePath = filePath.replace(/\/+/g, '/');
    }
    
    // Get configFiles from window
    var configFiles = window.configFiles || {};
    
    // Try multiple path variations to find the file
    var content = null;
    var foundPath = null;
    
    // Debug: Log what we're looking for
    console.log('Looking for file:', filePath);
    console.log('Available files:', Object.keys(configFiles));
    
    // Try exact path first
    if (configFiles[filePath]) {
        content = configFiles[filePath];
        foundPath = filePath;
        console.log('Found at exact path:', filePath);
    }
    // Try just the filename
    else if (configFiles[filename]) {
        content = configFiles[filename];
        foundPath = filename;
        console.log('Found with filename:', filename);
    }
    
    if (content) {
        var lines = content.split('\n');
        for (var i = 0; i < lines.length; i++) {
            addOutput(lines[i]);
        }
        
        // Check for flags in the content
        if (typeof checkForFlag === 'function') {
            checkForFlag(content);
        }
        
        // Easter egg responses for special files
        if (foundPath && (foundPath.includes('shrek') || filename.includes('shrek'))) {
            addOutput('', 'success');
            addOutput('🧅 Shrek wisdom has been revealed! Remember: Like onions, good sysadmins have layers! 🧅', 'success');
        }
        
        if (filename === 'meme-logs.txt') {
            addOutput('', 'success');
            addOutput('🎭 "Some people think they can outsmart me... maybe, maybe. I have yet to meet one that can outsmart log files!" 🎭', 'success');
        }
        
        if (filename === 'investigation-notes.txt') {
            addOutput('', 'info');
            addOutput('📋 Investigation notes loaded! Look for commands to run and clues to follow!', 'info');
        }
        
    } else {
        console.log('File not found in configFiles, checking filesystem...');
        var currentFS = getCurrentFileSystem();
        var dirContent = currentFS[currentDir];
        
        if (dirContent && dirContent[filename]) {
            if (dirContent[filename] === 'directory') {
                addOutput('cat: ' + filename + ': Is a directory', 'error');
                addOutput('💡 Hint: Use "cd ' + filename + '" to enter the directory, or "ls ' + filename + '" to list its contents!', 'info');
            } else {
                addOutput('cat: ' + filename + ': File content simulation');
                addOutput('Use the actual file paths for real content.');
                console.log('File exists in filesystem but no content found');
            }
        } else {
            addOutput('cat: ' + filename + ': No such file or directory', 'error');
            console.log('File not found anywhere');
            
            // Fun error messages
            if (filename.toLowerCase().includes('meme')) {
                addOutput('🎭 No memes found, but the real meme is the friends we made along the way!', 'warning');
            } else if (filename.toLowerCase().includes('donkey')) {
                addOutput('🐴 "I\'m a believer!" - Donkey, but this file doesn\'t exist!', 'warning');
            } else {
                addOutput('💡 Pro tip: Check if the file exists with "ls" first!', 'info');
            }
        }
    }
}

function editFile(filename, editorName) {
    if (!filename) {
        var cmd = editorName || 'vi';
        addOutput(cmd + ': missing file argument', 'error');
        addOutput('Usage: ' + cmd + ' [file]');
        if (cmd === 'vi') {
            addOutput('💡 Fun fact: vi stands for "visual" - just like how Shrek is "visually striking"! 😂', 'info');
        } else if (cmd === 'nano') {
            addOutput('💡 Fun fact: nano is named after the editor "pico" - tiny like Shrek\'s patience!', 'info');
        }
        return;
    }
    
    var filePath;
    if (filename.startsWith('/')) {
        filePath = filename;
    } else {
        filePath = currentDir + '/' + filename;
        filePath = filePath.replace(/\/+/g, '/');
    }
    
    var cmd = editorName || 'vi';
    addOutput('Opening file in ' + cmd + ' editor: ' + filePath, 'info');
    addOutput('');
    addOutput('--- Simulated ' + cmd + ' editor ---', 'warning');
    addOutput('In a real environment, this would open the ' + cmd + ' text editor.');
    
    if (cmd === 'vi') {
        addOutput('💡 Remember: In vi, everything is possible but nothing is easy!', 'info');
    } else if (cmd === 'nano') {
        addOutput('💡 Remember: In nano, Ctrl+X to exit, Ctrl+O to save!', 'info');
    }
    
    addOutput('');
    
    // Check if configFiles exists
    var configFiles = window.configFiles || {};
    var content = configFiles[filePath];
    
    if (content) {
        addOutput('Current file contents:', 'info');
        var lines = content.split('\n');
        for (var i = 0; i < lines.length; i++) {
            addOutput((i + 1) + ': ' + lines[i]);
        }
        addOutput('');
        addOutput('Use this information to understand the file structure.', 'success');
        
        // Special handling for platform configuration
        if (filePath === '/opt/platform/config/platform-config.yaml') {
            addOutput('');
            addOutput('💡 CONFIGURATION TIPS:', 'warning');
            addOutput('1. Change "CHANGE_ME" values to the specified settings');
            addOutput('2. Set database.host to "db.company.local"');
            addOutput('3. Set database.password to "SecureDbPass2025!"');
            addOutput('4. Verify all port configurations match your firewall rules');
            addOutput('🧅 Remember: Good configs are like ogres - they have layers!', 'success');
            
            if (typeof systemState !== 'undefined' && !systemState.centos.platformConfigured) {
                systemState.centos.platformConfigured = true;
                if (typeof completedTasks !== 'undefined') {
                    completedTasks.add('platform');
                }
                if (typeof updateTaskProgress === 'function') {
                    updateTaskProgress();
                }
                addOutput('');
                addOutput('✅ Task 6: Platform Configuration - COMPLETED', 'success');
            }
        }
        
        // Special handling for YUM configuration
        if (filePath === '/etc/yum.conf') {
            addOutput('');
            addOutput('💡 YUM PROXY CONFIGURATION:', 'warning');
            addOutput('Uncomment and modify these lines:');
            addOutput('proxy=http://proxy.company.com:8080');
            addOutput('proxy_username=corp_user');
            addOutput('proxy_password=ProxyPass123');
            addOutput('Configuration completed!', 'success');
            
            if (typeof systemState !== 'undefined' && !systemState.centos.yumProxyConfigured) {
                systemState.centos.yumProxyConfigured = true;
                if (typeof completedTasks !== 'undefined') {
                    completedTasks.add('yum-proxy');
                }
                if (typeof updateTaskProgress === 'function') {
                    updateTaskProgress();
                }
                addOutput('');
                addOutput('✅ Task 4: YUM Proxy Configuration - COMPLETED', 'success');
            }
        }
        
        // Easter egg for special files
        if (filePath.includes('shrek')) {
            addOutput('');
            addOutput('🧅 Editing Shrek wisdom! "This is the part where you run away... from bad configs!"', 'success');
        }
        
    } else {
        addOutput('File does not exist. In ' + cmd + ', you could create a new file here.', 'info');
        
        // Fun responses for non-existent files
        if (filename.toLowerCase().includes('recipe')) {
            addOutput('🧅 Shrek says: "Onions are the only recipe you need!"', 'warning');
        } else if (filename.toLowerCase().includes('love')) {
            addOutput('💕 "Love is like an onion - you peel away layer after layer and sometimes you cry!" - Shrek', 'warning');
        }
    }
    
    addOutput('');
    addOutput('--- End of ' + cmd + ' simulation ---', 'warning');
    if (cmd === 'vi') {
        addOutput('💡 Pro tip: In real vi, press ESC then :q! to quit without saving!', 'info');
    } else if (cmd === 'nano') {
        addOutput('💡 Pro tip: In real nano, press Ctrl+X to exit, Ctrl+O to save!', 'info');
    }
}