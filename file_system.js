// File system simulation and file operations

// File system simulation for CentOS host
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

// Cluster file system (when connected to k8s host)
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
2025-06-16T14:30:22.567Z DEBUG FLAG{DATABASE_CONNECTION_TIMEOUT_DETECTED}`,

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
  Warning  ProvisioningFailed  1m                  persistentvolume-controller  FLAG{STORAGE_CLASS_MISCONFIGURATION_ERROR}`,

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
# FLAG{SERVICE_SELECTOR_LABEL_MISMATCH_FOUND}`
};

// File operation functions
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
        updatePrompt();
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
    } else if (currentHost === 'k8s' && filename.includes('log')) {
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
            systemState.centos.yumProxyConfigured = true;
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
            systemState.centos.platformConfigured = true;
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