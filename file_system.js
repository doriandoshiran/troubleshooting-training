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
distroverpkg=centos-release

# Add proxy configuration here:
# proxy=http://proxy.company.com:8080
# proxy_username=your_username
# proxy_password=your_password`,

    '/etc/hosts': `127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.1.100 prod-centos-01.company.local prod-centos-01
192.168.1.200 db.company.local db-server`,

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
  host: "CHANGE_ME"  # Database server hostname/IP
  port: 5432
  database_name: "platform_db"
  username: "platform_user"
  password: "CHANGE_ME"  # Database password
  
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
  
# Edit these values for your environment:
# - Set database.host to your database server IP
# - Set database.password to a secure password
# - Verify all port configurations`,

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

    '/proc/meminfo': `MemTotal:       16777216 kB
MemFree:         8388608 kB
MemAvailable:   12582912 kB
Buffers:          524288 kB
Cached:          2097152 kB
SwapCached:            0 kB
Active:          4194304 kB
Inactive:        2097152 kB
SwapTotal:       ${systemState.centos.swapConfigured ? '8388608' : '0'} kB
SwapFree:        ${systemState.centos.swapConfigured ? '8388608' : '0'} kB`,

    '/proc/swaps': systemState.centos.swapConfigured ? 
        `Filename				Type		Size	Used	Priority
/swapfile                               file		8388608	0	-2` :
        `Filename				Type		Size	Used	Priority`,

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
    client-key-data: LS0tLS1CRUdJTi...`,

    '/root/troubleshooting/investigation-notes.txt': `Kubernetes Cluster Investigation Notes
=====================================

Issues Identified:
1. webapp-deployment pod in CrashLoopBackOff state
   - Container exits with code 1
   - Check logs for database connection issues

2. database-pv-claim stuck in Pending status
   - StorageClass "fast-ssd" not found
   - Check storage configuration

3. nginx-service connectivity problems
   - Service selector may be misconfigured
   - Check service and deployment labels

Commands to investigate:
- kubectl get pods
- kubectl describe pod webapp-deployment-7d4b8c9f4d-xyz123
- kubectl logs webapp-deployment-7d4b8c9f4d-xyz123
- kubectl get pvc
- kubectl describe pvc database-pv-claim
- kubectl get services
- kubectl describe service nginx-service

Look for FLAGS in the output!`
};

// CTF-related logs and files
var ctfLogs = {
    'webapp-deployment-7d4b8c9f4d-xyz123': `2025-06-16T14:30:15.123Z INFO  Starting webapp container...
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
2025-06-16T14:30:38.456Z DEBUG FLAG{DATABASE_CONNECTION_TIMEOUT_DETECTED}`,

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
  Warning  ProvisioningFailed  1m                  persistentvolume-controller  Failed to provision volume with StorageClass "fast-ssd": storageclass.storage.k8s.io "fast-ssd" not found
  Warning  StorageClassNotFound 30s               persistentvolume-controller  FLAG{STORAGE_CLASS_MISCONFIGURATION_ERROR}`,

    'nginx-service-config': `apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: default
  labels:
    app: nginx
spec:
  selector:
    app: nginx-app-WRONG  # This selector is incorrect!
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
# Network connectivity issue root cause:
# Service selector label mismatch causes zero endpoints
# FLAG{SERVICE_SELECTOR_LABEL_MISMATCH_FOUND}`
};

// File operation functions
function listFiles(args) {
    var currentFS = getCurrentFileSystem();
    var dirContent = currentFS[currentDir];
    if (!dirContent) {
        addOutput('ls: cannot access \'' + currentDir + '\': No such file or directory', 'error');
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
        for (var i = 0; i < items.length; i