// File system simulation for different hosts
var currentDir = '/root';
var currentHost = 'jumphost';

// CentOS file system structure
var centosFileSystem = {
    '/': {
        'root': 'directory',
        'etc': 'directory',
        'var': 'directory',
        'home': 'directory',
        'usr': 'directory',
        'opt': 'directory',
        'tmp': 'directory',
        'boot': 'directory',
        'proc': 'directory',
        'sys': 'directory',
        'dev': 'directory'
    },
    '/root': {
        '.bashrc': 'file',
        '.bash_profile': 'file',
        '.bash_history': 'file',
        'test.txt': 'file'
    },
    '/etc': {
        'fstab': 'file',
        'hosts': 'file',
        'passwd': 'file',
        'shadow': 'file',
        'group': 'file',
        'hostname': 'file',
        'resolv.conf': 'file',
        'yum.conf': 'file',
        'chrony.conf': 'file',
        'ntp.conf': 'file',
        'systemd': 'directory',
        'firewalld': 'directory'
    },
    '/etc/systemd': {
        'system': 'directory'
    },
    '/etc/systemd/system': {
        'multi-user.target.wants': 'directory'
    },
    '/var': {
        'log': 'directory',
        'cache': 'directory',
        'lib': 'directory',
        'run': 'directory',
        'tmp': 'directory'
    },
    '/var/log': {
        'messages': 'file',
        'secure': 'file',
        'yum.log': 'file',
        'boot.log': 'file',
        'cron': 'file'
    },
    '/opt': {
        'platform': 'directory'
    },
    '/opt/platform': {
        'config': 'directory',
        'data': 'directory',
        'logs': 'directory'
    },
    '/opt/platform/config': {
        'platform-config.yaml': 'file'
    }
};

// Kubernetes file system structure
var k8sFileSystem = {
    '/': {
        'root': 'directory',
        'var': 'directory', 
        'etc': 'directory',
        'home': 'directory'
    },
    '/root': {
        '.bashrc': 'file',
        '.kube': 'directory',
        'troubleshooting': 'directory'
    },
    '/root/.kube': {
        'config': 'file'
    },
    '/root/troubleshooting': {
        'investigation-notes.txt': 'file',
        'meme-logs.txt': 'file'
    },
    '/var': {
        'log': 'directory'
    },
    '/var/log': {
        'pods': 'directory',
        'containers': 'directory',
        'kubernetes': 'directory'
    },
    '/var/log/pods': {
        'webapp-deployment-7d4b8c9f4d-xyz123': 'directory',
        'database-statefulset-0': 'directory',
        'nginx-ingress-controller-abc123': 'directory',
        'shrek-pod-123': 'directory'
    },
    '/var/log/pods/webapp-deployment-7d4b8c9f4d-xyz123': {
        'webapp': 'directory'
    },
    '/var/log/pods/webapp-deployment-7d4b8c9f4d-xyz123/webapp': {
        '0.log': 'file',
        '1.log': 'file',
        'previous.log': 'file'
    },
    '/var/log/pods/database-statefulset-0': {
        'postgres': 'directory'
    },
    '/var/log/pods/database-statefulset-0/postgres': {
        '0.log': 'file'
    },
    '/var/log/containers': {
        'webapp-7d4b8c9f4d-xyz123_default_webapp-abc123.log': 'file',
        'database-statefulset-0_default_postgres-def456.log': 'file'
    },
    '/var/log/kubernetes': {
        'kube-apiserver.log': 'file',
        'kube-scheduler.log': 'file',
        'kube-controller-manager.log': 'file',
        'kubelet.log': 'file'
    },
    '/etc': {
        'kubernetes': 'directory',
        'hosts': 'file',
        'resolv.conf': 'file'
    },
    '/etc/kubernetes': {
        'manifests': 'directory',
        'admin.conf': 'file',
        'kubelet.conf': 'file'
    },
    '/etc/kubernetes/manifests': {
        'kube-apiserver.yaml': 'file',
        'kube-controller-manager.yaml': 'file',
        'kube-scheduler.yaml': 'file',
        'etcd.yaml': 'file'
    },
    '/home': {}
};

// File contents mapping
var fileContents = {
    // CentOS files
    '/etc/fstab': `#
# /etc/fstab
# Created by anaconda on Mon Jun 16 14:00:00 2025
#
# Accessible filesystems, by reference, are maintained under '/dev/disk'
# See man pages fstab(5), findfs(8), mount(8) and/or blkid(8) for more info
#
UUID=12345678-1234-1234-1234-123456789abc /                       xfs     defaults        0 0
UUID=87654321-4321-4321-4321-cba987654321 /boot                   xfs     defaults        0 0
UUID=abcdef12-3456-7890-abcd-ef1234567890 swap                    swap    defaults        0 0

# Add swap file entry here:
# /swapfile swap swap defaults 0 0

# 🧅 "Like ogres, good fstab files have layers!" - Shrek wisdom`,

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

    // Kubernetes files
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

    '/root/troubleshooting/meme-logs.txt': `🎭 Kubernetes Meme Logs & Fun Facts
=====================================

Why did the pod crash?
Because it couldn't find its database... much like Shrek looking for his swamp! 🧅

Kubernetes Facts:
- "kubectl" is pronounced "kube-control" or "kube-cuttle" (debate continues)
- A cluster without nodes is like Shrek without his swamp - pretty useless
- CrashLoopBackOff is basically Kubernetes having a tantrum
- "It works on my machine" doesn't apply in Kubernetes... it's "It works in my namespace"

Pro Tips:
1. Always check the logs (they're like onions, full of layers)
2. When in doubt, describe everything: kubectl describe all-the-things
3. Remember: Debugging is like being a detective, but the criminal is your own code

🔍 Happy hunting for those flags! 🚩`,

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

    '/var/log/containers/webapp-7d4b8c9f4d-xyz123_default_webapp-abc123.log': `2025-06-16T14:30:15.123Z stdout F Starting webapp container...
2025-06-16T14:30:16.456Z stdout F Loading configuration from /etc/config/app.yaml
2025-06-16T14:30:17.789Z stdout F Connecting to database at db.company.local:5432
2025-06-16T14:30:18.012Z stderr F ERROR: Failed to connect to database: connection timeout after 30s
2025-06-16T14:30:19.345Z stderr F Database host db.company.local is unreachable
2025-06-16T14:30:20.678Z stderr F Retrying database connection (attempt 1/3)
2025-06-16T14:30:25.901Z stderr F Retrying database connection (attempt 2/3)
2025-06-16T14:30:30.234Z stderr F Retrying database connection (attempt 3/3)
2025-06-16T14:30:35.567Z stderr F FATAL: All database connection attempts failed, shutting down
2025-06-16T14:30:36.890Z stdout F Container exit code: 1
2025-06-16T14:30:38.456Z stdout F FLAG{CONTAINER_LOG_FORMAT_DISCOVERED}
2025-06-16T14:30:39.789Z stdout F Container logs in CRI-O format complete`,

    '/var/log/kubernetes/kubelet.log': `I0616 14:30:10.123456       1 kubelet.go:1234] Starting kubelet
I0616 14:30:11.234567       1 kubelet.go:1245] Kubelet version: v1.28.0
I0616 14:30:12.345678       1 server.go:123] Started kubelet server
W0616 14:30:15.456789       1 pod_workers.go:456] Pod webapp-deployment-7d4b8c9f4d-xyz123 failed to start
E0616 14:30:18.567890       1 kuberuntime_manager.go:789] container "webapp" in pod "webapp-deployment-7d4b8c9f4d-xyz123" is waiting to start: CrashLoopBackOff
I0616 14:30:20.678901       1 kubelet.go:2456] SyncLoop (probe): webapp
I0616 14:30:25.789012       1 kubelet.go:2456] SyncLoop (probe): webapp
E0616 14:30:30.890123       1 pod_workers.go:234] Error syncing pod webapp-deployment-7d4b8c9f4d-xyz123: failed to start container "webapp": Error response from daemon: container exited with non-zero status
I0616 14:30:35.901234       1 kubelet.go:1789] FLAG{KUBELET_DEBUGGING_SKILLS} - Advanced troubleshooting complete`,

    '/etc/kubernetes/admin.conf': `apiVersion: v1
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

    '/root/.bashrc': `# .bashrc

# User specific aliases and functions

alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Source global definitions
if [ -f /etc/bashrc ]; then
        . /etc/bashrc
fi

# Custom aliases for this training environment
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'

# Kubernetes shortcuts (only on k8s host)
if [[ $HOSTNAME == *"k8s"* ]]; then
    alias k='kubectl'
    alias kgp='kubectl get pods'
    alias kgs='kubectl get services'
    alias kgn='kubectl get nodes'
fi

# Fun fact: This .bashrc is more customized than Shrek's swamp!
export PS1='[\u@\h \W]\$ '`
};

// Get current file system based on host
function getCurrentFileSystem() {
    if (currentHost === 'k8s-master-01') {
        return k8sFileSystem;
    }
    return centosFileSystem;
}

// File system operations
function listDirectory(path) {
    var currentFS = getCurrentFileSystem();
    var targetPath = path || currentDir;
    
    if (!targetPath.startsWith('/')) {
        targetPath = currentDir + '/' + targetPath;
        targetPath = targetPath.replace(/\/+/g, '/');
    }
    
    return currentFS[targetPath] || null;
}

function readFile(filePath) {
    if (!filePath.startsWith('/')) {
        filePath = currentDir + '/' + filePath;
        filePath = filePath.replace(/\/+/g, '/');
    }
    
    return fileContents[filePath] || null;
}

function fileExists(filePath) {
    var currentFS = getCurrentFileSystem();
    
    if (!filePath.startsWith('/')) {
        filePath = currentDir + '/' + filePath;
        filePath = filePath.replace(/\/+/g, '/');
    }
    
    // Check if file exists in current directory
    var dirPath = filePath.substring(0, filePath.lastIndexOf('/')) || '/';
    var fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    
    var dirContent = currentFS[dirPath];
    return dirContent && dirContent[fileName] !== undefined;
}

function isDirectory(path) {
    var currentFS = getCurrentFileSystem();
    
    if (!path.startsWith('/')) {
        path = currentDir + '/' + path;
        path = path.replace(/\/+/g, '/');
    }
    
    return currentFS[path] !== undefined;
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

function executeEditor(editor, args) {
    var filePath = args[0];
    
    if (!filePath) {
        addOutput(editor + ': no file specified', 'error');
        addOutput('Usage: ' + editor + ' <filename>', 'info');
        addOutput('💡 You need to tell ' + editor + ' which file to edit!', 'warning');
        return;
    }
    
    if (!filePath.startsWith('/')) {
        filePath = currentDir + '/' + filePath;
        filePath = filePath.replace(/\/+/g, '/');
    }
    
    var content = readFile(filePath);
    
    if (content !== null) {
        startInteractiveEditor(editor, filePath, content);
    } else {
        addOutput(editor + ': ' + filePath + ': No such file or directory', 'error');
        addOutput('💡 The file doesn\'t exist. You could create it, but this is a read-only simulation!', 'info');
        
        if (filePath.toLowerCase().includes('swamp')) {
            addOutput('🧅 "Get out of my swamp!" - File not found in Shrek\'s domain!', 'warning');
        }
    }
}

function startInteractiveEditor(editor, filePath, originalContent) {
    // Clear terminal and show editor interface
    var terminal = document.getElementById('terminal-output');
    terminal.innerHTML = '';
    
    addOutput('📝 ' + editor.toUpperCase() + ' - Interactive Editor', 'success');
    addOutput('File: ' + filePath, 'info');
    addOutput('═'.repeat(80), 'info');
    addOutput('');
    
    // Create editable content area
    var lines = originalContent.split('\n');
    var editorDiv = document.createElement('div');
    editorDiv.className = 'editor-content';
    editorDiv.style.cssText = `
        background: #1a1a1a;
        border: 1px solid #333;
        margin: 10px 0;
        padding: 10px;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        min-height: 200px;
        max-height: 400px;
        overflow-y: auto;
        position: relative;
    `;
    
    var textarea = document.createElement('textarea');
    textarea.value = originalContent;
    textarea.style.cssText = `
        width: 100%;
        height: 100%;
        background: transparent;
        border: none;
        color: #00ff00;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        resize: none;
        outline: none;
        min-height: 300px;
    `;
    
    editorDiv.appendChild(textarea);
    terminal.appendChild(editorDiv);
    
    // Add editor commands
    addOutput('');
    addOutput('Editor Commands:', 'warning');
    if (editor === 'nano') {
        addOutput('  Ctrl+X : Exit and save changes', 'info');
        addOutput('  Ctrl+O : Save file (Write Out)', 'info');
        addOutput('  Ctrl+G : Get help', 'info');
    } else {
        addOutput('  :w     : Save file', 'info');
        addOutput('  :q     : Quit', 'info');
        addOutput('  :wq    : Save and quit', 'info');
        addOutput('  :q!    : Quit without saving', 'info');
    }
    addOutput('');
    addOutput('💡 Type commands below or edit directly in the text area above', 'warning');
    addOutput('');
    
    // Create special input for editor commands
    var editorInputDiv = document.createElement('div');
    editorInputDiv.className = 'input-line editor-input';
    editorInputDiv.innerHTML = '<span class="prompt">' + (editor === 'nano' ? 'nano> ' : ':') + '</span><input type="text" class="command-input editor-command" autocomplete="off">';
    terminal.appendChild(editorInputDiv);
    
    var editorInput = editorInputDiv.querySelector('.editor-command');
    editorInput.focus();
    
    // Store editor state
    window.editorState = {
        editor: editor,
        filePath: filePath,
        originalContent: originalContent,
        textarea: textarea,
        modified: false
    };
    
    // Handle editor commands
    editorInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            var command = event.target.value.trim();
            
            if (command) {
                addOutput((editor === 'nano' ? 'nano> ' : ':') + command);
                handleEditorCommand(command);
            }
            
            event.target.value = '';
            event.preventDefault();
        }
    });
    
    // Handle text changes
    textarea.addEventListener('input', function() {
        window.editorState.modified = (textarea.value !== originalContent);
    });
    
    // Handle keyboard shortcuts for nano
    if (editor === 'nano') {
        textarea.addEventListener('keydown', function(event) {
            if (event.ctrlKey) {
                switch(event.key.toLowerCase()) {
                    case 'x':
                        event.preventDefault();
                        handleEditorCommand('exit');
                        break;
                    case 'o':
                        event.preventDefault();
                        handleEditorCommand('save');
                        break;
                    case 'g':
                        event.preventDefault();
                        handleEditorCommand('help');
                        break;
                }
            }
        });
    }
    
    scrollToBottom();
}

function handleEditorCommand(command) {
    var state = window.editorState;
    
    if (!state) {
        addOutput('Error: No active editor session', 'error');
        return;
    }
    
    var cmd = command.toLowerCase();
    
    if (state.editor === 'nano') {
        switch(cmd) {
            case 'exit':
            case 'x':
                if (state.modified) {
                    addOutput('Save modified buffer? (Y/N)', 'warning');
                    addOutput('💾 Changes detected! Type "y" to save, "n" to discard', 'info');
                } else {
                    exitEditor();
                }
                break;
            case 'save':
            case 'o':
                saveFile();
                break;
            case 'y':
                saveFile();
                exitEditor();
                break;
            case 'n':
                exitEditor();
                break;
            case 'help':
            case 'g':
                showNanoHelp();
                break;
            default:
                addOutput('Unknown command: ' + command, 'error');
                addOutput('Type Ctrl+G for help', 'info');
        }
    } else {
        // Vi/Vim commands
        switch(cmd) {
            case 'w':
                saveFile();
                break;
            case 'q':
                if (state.modified) {
                    addOutput('No write since last change (add ! to override)', 'error');
                } else {
                    exitEditor();
                }
                break;
            case 'q!':
                exitEditor();
                break;
            case 'wq':
                saveFile();
                exitEditor();
                break;
            case 'help':
                showViHelp();
                break;
            default:
                addOutput('Not an editor command: ' + command, 'error');
                addOutput('Type :help for help', 'info');
        }
    }
}

function saveFile() {
    var state = window.editorState;
    var newContent = state.textarea.value;
    
    // Update file content in memory
    fileContents[state.filePath] = newContent;
    
    addOutput('File saved: ' + state.filePath, 'success');
    addOutput('💾 ' + newContent.split('\n').length + ' lines written', 'success');
    
    state.modified = false;
    state.originalContent = newContent;
    
    // Check for task completion
    checkFileEditCompletion(state.filePath, newContent);
}

function exitEditor() {
    var state = window.editorState;
    
    addOutput('');
    addOutput('📝 Editor closed', 'success');
    addOutput('Returning to terminal...', 'info');
    
    // Clear editor state
    window.editorState = null;
    
    // Return to normal terminal
    setTimeout(function() {
        document.getElementById('terminal-output').innerHTML = '';
        addOutput('Terminal restored', 'success');
        showNewPrompt();
    }, 1000);
}

function showNanoHelp() {
    addOutput('');
    addOutput('📖 GNU nano Help', 'info');
    addOutput('─'.repeat(40), 'info');
    addOutput('Ctrl+X : Exit (will prompt to save)', 'info');
    addOutput('Ctrl+O : Write Out (save)', 'info');
    addOutput('Ctrl+G : Get Help', 'info');
    addOutput('');
    addOutput('💡 Make your changes in the text area above', 'warning');
}

function showViHelp() {
    addOutput('');
    addOutput('📖 Vi/Vim Help', 'info');
    addOutput('─'.repeat(40), 'info');
    addOutput(':w     : Write (save) file', 'info');
    addOutput(':q     : Quit (fails if modified)', 'info');
    addOutput(':wq    : Write and quit', 'info');
    addOutput(':q!    : Quit without saving', 'info');
    addOutput('');
    addOutput('💡 Make your changes in the text area above', 'warning');
}

function checkFileEditCompletion(filePath, content) {
    // Check YUM proxy configuration
    if (filePath === '/etc/yum.conf') {
        var hasProxy = content.includes('proxy=http://proxy.company.com:8080');
        var hasUsername = content.includes('proxy_username=corp_user');
        var hasPassword = content.includes('proxy_password=ProxyPass123');
        
        if (hasProxy && hasUsername && hasPassword) {
            addOutput('');
            addOutput('✅ YUM proxy configuration completed!', 'success');
            addOutput('📡 Proxy settings have been properly configured', 'success');
            
            if (typeof systemState !== 'undefined' && !systemState.centos.yumProxyConfigured) {
                systemState.centos.yumProxyConfigured = true;
                if (typeof completedTasks !== 'undefined') {
                    completedTasks.add('yum-proxy');
                }
                if (typeof updateTaskProgress === 'function') {
                    updateTaskProgress();
                }
                addOutput('✅ Task 4: YUM Proxy Configuration - COMPLETED', 'success');
            }
        } else {
            addOutput('💡 Remember to uncomment and configure the proxy settings:', 'warning');
            addOutput('  proxy=http://proxy.company.com:8080', 'info');
            addOutput('  proxy_username=corp_user', 'info');
            addOutput('  proxy_password=ProxyPass123', 'info');
        }
    }
    
    // Check platform configuration
    if (filePath === '/opt/platform/config/platform-config.yaml') {
        var hasDbHost = content.includes('host: "db.company.local"');
        var hasDbPassword = content.includes('password: "SecureDbPass2025!"');
        
        if (hasDbHost && hasDbPassword) {
            addOutput('');
            addOutput('✅ Platform configuration completed!', 'success');
            addOutput('🗃️  Database connection settings properly configured', 'success');
            
            if (typeof systemState !== 'undefined' && !systemState.centos.platformConfigured) {
                systemState.centos.platformConfigured = true;
                if (typeof completedTasks !== 'undefined') {
                    completedTasks.add('platform');
                }
                if (typeof updateTaskProgress === 'function') {
                    updateTaskProgress();
                }
                addOutput('✅ Task 6: Platform Configuration - COMPLETED', 'success');
            }
        } else {
            addOutput('💡 Remember to configure the required settings:', 'warning');
            addOutput('  database.host = "db.company.local"', 'info');
            addOutput('  database.password = "SecureDbPass2025!"', 'info');
        }
    }
}
// File system aliases for commands.js compatibility
function listFiles(args) {
    var path = args.length > 0 ? args[args.length - 1] : currentDir;
    var showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
    var longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al');
    
    // Handle path resolution
    var targetPath = path;
    if (!path || path.startsWith('-')) {
        targetPath = currentDir;
    } else if (!path.startsWith('/')) {
        targetPath = currentDir + '/' + path;
        targetPath = targetPath.replace(/\/+/g, '/');
    }
    
    var currentFS = getCurrentFileSystem();
    var dirContent = currentFS[targetPath];
    
    if (!dirContent) {
        addOutput('ls: cannot access \'' + path + '\': No such file or directory', 'error');
        return;
    }
    
    var entries = Object.keys(dirContent);
    
    if (!showAll) {
        entries = entries.filter(function(entry) {
            return !entry.startsWith('.');
        });
    }
    
    if (entries.length === 0) {
        addOutput('');
        return;
    }
    
    if (longFormat) {
        entries.forEach(function(entry) {
            var isDir = dirContent[entry] === 'directory';
            var permissions = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
            var linkCount = isDir ? '2' : '1';
            var size = isDir ? '4096' : '1024';
            var date = 'Jun 16 14:30';
            
            addOutput(permissions + '  ' + linkCount + ' root root     ' + size + ' ' + date + ' ' + entry);
        });
    } else {
        addOutput(entries.join('  '));
    }
}

function viewFile(filePath) {
    if (!filePath) {
        addOutput('cat: missing file argument', 'error');
        return;
    }
    
    var content = readFile(filePath);
    if (content !== null) {
        var lines = content.split('\n');
        lines.forEach(function(line) {
            addOutput(line);
        });
        
        // Check for flags in the content
        checkForFlag(content);
    } else {
        addOutput('cat: ' + filePath + ': No such file or directory', 'error');
    }
}

function editFile(filePath, editor) {
    executeEditor(editor, [filePath]);
}

// Missing file systems - add to your file-system.js
var clusterFileSystem = k8sFileSystem;  // Use k8sFileSystem as clusterFileSystem
var fileSystem = centosFileSystem;     // Use centosFileSystem as fileSystem

// CTF logs for Kubernetes challenges
window.ctfLogs = {
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
Status:        Pending
Volume:        
Labels:        <none>
Annotations:   volume.beta.kubernetes.io/storage-provisioner: kubernetes.io/no-provisioner
Finalizers:    [kubernetes.io/pvc-protection]
Capacity:      
Access Modes:  
VolumeMode:    Filesystem
Used By:       database-statefulset-0
Events:
  Type     Reason              Age               Message
  ----     ------              ----              -------
  Warning  ProvisioningFailed  2m (x15 over 30m) storageclass.storage.k8s.io "fast-ssd" not found
  Normal   ExternalProvisioning 30s              waiting for a volume to be created, either by external provisioner "kubernetes.io/no-provisioner" or manually created by system administrator
  Warning  ProvisioningFailed  15s              Failed to provision volume with StorageClass "fast-ssd": storageclass.storage.k8s.io "fast-ssd" not found
  Normal   WaitForFirstConsumer 5s               FLAG{STORAGE_CLASS_MISCONFIGURATION_FOUND}

🔍 Storage investigation complete - the StorageClass is missing!`,

    'nginx-service-config': `Name:                     nginx-service
Namespace:                default
Labels:                   app=nginx
Annotations:              <none>
Selector:                 app=nginx-wrong
Type:                     LoadBalancer
IP Family Policy:        SingleStack
IP Families:             IPv4
IP:                      10.96.100.200
IPs:                     10.96.100.200
LoadBalancer Ingress:    <pending>
Port:                    http  80/TCP
TargetPort:              80/TCP
NodePort:                http  30081/TCP
Endpoints:               <none>
Session Affinity:        None
External Traffic Policy: Cluster
Events:
  Type     Reason                Age               Message
  ----     ------                ----              -------
  Warning  SyncLoadBalancerFailed 5m (x10 over 30m) Error syncing load balancer: failed to ensure load balancer: no available nodes for service
  Normal   EnsuringLoadBalancer   2m                Ensuring load balancer
  Warning  ServiceSelectorMismatch 1m               Service selector "app=nginx-wrong" does not match any pods (should be "app=nginx")
  Normal   ConfigurationFixed     30s               FLAG{SERVICE_SELECTOR_MISMATCH_RESOLVED}

🔗 Service troubleshooting reveals selector mismatch!`
};