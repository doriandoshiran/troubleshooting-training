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
        'test.txt': 'file',
        '.secrets': 'file'
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
        'troubleshooting': 'directory',
        '.easter_eggs': 'file'
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
    '/root/test.txt': 'This is a test file in the root directory.\nYou can edit this file to practice your skills.\n\nRemember: Like ogres, files have layers of content!\n🧅 Happy testing!',
    
    '/root/.secrets': '# Hidden System Secrets\n# ====================\n# This file contains development secrets - do not share!\n\n# Database backup credentials\nBACKUP_USER=admin\nBACKUP_PASS=Sw4mp_B4ckup_2025!\n\n# SSH Keys for emergency access\nEMERGENCY_KEY="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ..."\n\n# Hidden development flag\nHIDDEN_FLAG{SECRET_FILE_DISCOVERED}\n\n# Remember: "Better out than in!" - Shrek wisdom for logs\n# Always check hidden files for configuration secrets!\n\n# Production database connection (backup)\nPROD_DB_HOST=db-backup.company.local\nPROD_DB_USER=emergency_admin\nPROD_DB_PASS=0gr3_Str0ng_P4ss!\n\n# End of secrets file',
    
    '/root/.bash_profile': '# .bash_profile\n\n# Get the aliases and functions\nif [ -f ~/.bashrc ]; then\n\t. ~/.bashrc\nfi\n\n# User specific environment and startup programs\n\nPATH=$PATH:$HOME/bin\n\nexport PATH',
    
    '/root/.bash_history': '# Bash history file\nls\ncd /etc\ncat /etc/fstab\nvi /etc/yum.conf\nsystemctl status firewalld\nfirewall-cmd --list-ports\nyum update\nfree -h\ndf -h\n# HIDDEN_FLAG{BASH_HISTORY_EXPLORED}\nshrek\ndonkey\nfiona',
    
    '/etc/fstab': '#\n# /etc/fstab\n# Created by anaconda on Mon Jun 16 14:00:00 2025\n#\n# Accessible filesystems, by reference, are maintained under \'/dev/disk\'\n# See man pages fstab(5), findfs(8), mount(8) and/or blkid(8) for more info\n#\nUUID=12345678-1234-1234-1234-123456789abc /                       xfs     defaults        0 0\nUUID=87654321-4321-4321-4321-cba987654321 /boot                   xfs     defaults        0 0\nUUID=abcdef12-3456-7890-abcd-ef1234567890 swap                    swap    defaults        0 0\n\n# Add swap file entry here:\n# /swapfile none swap sw 0 0\n\n# Remember: Good fstab files are properly configured for system stability',

    '/etc/yum.conf': '[main]\ncachedir=/var/cache/yum/$basearch/$releasever\nkeepyourcache=0\ndebuglevel=2\nlogfile=/var/log/yum.log\nexactarch=1\nobsoletes=1\ngpgcheck=1\nplugins=1\ninstallonly_limit=5\nbugtracker_url=http://bugs.centos.org/set_project.php?project_id=23&ref=http://bugs.centos.org/bug_report_page.php?category=yum\ndistroverpkg=centos-release\n\n# Corporate proxy configuration (uncomment and configure):\n# proxy=http://proxy.company.com:8080\n# proxy_username=corp_user\n# proxy_password=ProxyPass123\n\n# Fun fact: YUM stands for "Yellow dog Updater, Modified"\n# Not "Yet another Unnecessary Manager" as some people think!',

    '/opt/platform/config/platform-config.yaml': '# Platform Configuration Template\n# Single Node Deployment with Separate Database Host\n# ⚠️  Configure carefully - "With great power comes great responsibility" - Spider-Man (and Shrek)\n\nglobal:\n  deployment_type: "single-node"\n  environment: "production"\n  \ncluster:\n  master_node:\n    hostname: "platform.company.local"\n    ip_address: "192.168.1.100"\n    \ndatabase:\n  type: "postgresql"\n  host: "CHANGE_ME"  # Set to: db.company.local (192.168.1.200)\n  port: 5432\n  database_name: "platform_db"\n  username: "platform_user"\n  password: "CHANGE_ME"  # Set to: SecureDbPass2025!\n  \nnetwork:\n  http_port: 80\n  https_port: 443\n  management_port: 8443\n  api_port: 6443\n  \nstorage:\n  data_path: "/opt/platform/data"\n  logs_path: "/opt/platform/logs"\n  \nsecurity:\n  ssl_enabled: true\n  cert_path: "/opt/platform/certs/platform.crt"\n  key_path: "/opt/platform/certs/platform.key"\n  \n# Required configuration values:\n# - database.host = "db.company.local" (IP: 192.168.1.200)\n# - database.password = "SecureDbPass2025!" (secure password)\n# - Verify all port configurations match your firewall rules\n# \n# Pro tip: Like ogres and onions, good configs have layers!',

    // Kubernetes files
    '/root/.easter_eggs': '# Kubernetes Easter Eggs Collection\n# =================================\n# You found the secret easter egg file!\n\n🎭 Container Jokes:\n"Why did the container break up with the VM?\nBecause it was too heavyweight for the relationship!"\n\n🐳 Docker Wisdom:\n"Life is like a Dockerfile - you layer your experiences!"\n\n☸️  Kubernetes Philosophy:\n"In Kubernetes we trust, but we always verify the YAML!"\n\n🧅 Shrek\'s Container Wisdom:\n"Containers are like onions - they have layers!\nAnd sometimes they make you cry when they crash!"\n\n# Hidden flag for the curious explorer\nHIDDEN_FLAG{EASTER_EGG_HUNTER}\n\n# Pro Tips:\n# - Always check hidden files (files starting with .)\n# - The best secrets are often in plain sight\n# - "Better out than in!" applies to logs too\n\n🎉 Congratulations on finding this secret file!\nKeep exploring for more hidden surprises!',
    
    '/root/troubleshooting/investigation-notes.txt': 'Kubernetes Cluster Investigation Notes\n=====================================\nIssues Identified:\n1. webapp-deployment pod in CrashLoopBackOff state\n   - Container exits with code 1\n   - Check logs for database connection issues\n   - Status: More crashed than Shrek\'s morning routine\n\n2. database-pv-claim stuck in Pending status\n   - StorageClass "fast-ssd" not found\n   - Check storage configuration\n   - Status: More pending than Fiona waiting for rescue\n\n3. nginx-service connectivity problems\n   - Service selector may be misconfigured\n   - Check service and deployment labels\n   - Status: More confused than Donkey in the morning\n\nCommands to investigate:\n- kubectl get pods\n- kubectl describe pod webapp-deployment-7d4b8c9f4d-xyz123\n- kubectl logs webapp-deployment-7d4b8c9f4d-xyz123\n- kubectl get pvc\n- kubectl describe pvc database-pv-claim\n- kubectl get services\n- kubectl describe service nginx-service\n\nLook for FLAGS in the output!\n💡 Pro tip: Debugging Kubernetes is like peeling an onion - lots of layers and it might make you cry!\n🔍 Remember: Stay persistent - investigate thoroughly!',

    '/root/troubleshooting/meme-logs.txt': '🎭 Kubernetes Meme Logs & Fun Facts\n=====================================\n\nWhy did the pod crash?\nBecause it couldn\'t find its database... much like Shrek looking for his swamp! 🧅\n\nKubernetes Facts:\n- "kubectl" is pronounced "kube-control" or "kube-cuttle" (debate continues)\n- A cluster without nodes is like Shrek without his swamp - pretty useless\n- CrashLoopBackOff is basically Kubernetes having a tantrum\n- "It works on my machine" doesn\'t apply in Kubernetes... it\'s "It works in my namespace"\n\nPro Tips:\n1. Always check the logs (they\'re like onions, full of layers)\n2. When in doubt, describe everything: kubectl describe all-the-things\n3. Remember: Debugging is like being a detective, but the criminal is your own code\n\n🔍 Happy hunting for those flags! 🚩\n\n# Hidden bonus for reading meme logs\nHIDDEN_FLAG{MEME_MASTER_LEVEL_UNLOCKED}',

    '/var/log/pods/webapp-deployment-7d4b8c9f4d-xyz123/webapp/1.log': '2025-06-16T15:30:15.123Z INFO  Container restart attempt #2\n2025-06-16T15:30:16.456Z INFO  Starting webapp container...\n2025-06-16T15:30:17.789Z INFO  Loading configuration from /etc/config/app.yaml\n2025-06-16T15:30:18.012Z ERROR Failed to connect to database: same connection issues persist\n2025-06-16T15:30:19.345Z ERROR Network configuration may be the root cause\n2025-06-16T15:30:20.678Z ERROR Container exit code: 1\n2025-06-16T15:30:21.901Z DEBUG Restart loop continues - check service configuration\n2025-06-16T15:30:22.234Z DEBUG FLAG{RESTART_LOOP_ANALYSIS_COMPLETE}',

    '/root/.bashrc': '# .bashrc\n\n# User specific aliases and functions\n\nalias rm=\'rm -i\'\nalias cp=\'cp -i\'\nalias mv=\'mv -i\'\n\n# Source global definitions\nif [ -f /etc/bashrc ]; then\n        . /etc/bashrc\nfi\n\n# Custom aliases for this training environment\nalias ll=\'ls -alF\'\nalias la=\'ls -A\'\nalias l=\'ls -CF\'\n\n# Kubernetes shortcuts (only on k8s host)\nif [[ $HOSTNAME == *"k8s"* ]]; then\n    alias k=\'kubectl\'\n    alias kgp=\'kubectl get pods\'\n    alias kgs=\'kubectl get services\'\n    alias kgn=\'kubectl get nodes\'\nfi\n\n# Fun fact: This .bashrc is more customized than Shrek\'s swamp!\nexport PS1=\'[\\u@\\h \\W]\\$ \'\n\n# Hidden easter egg for bashrc explorers\n# HIDDEN_FLAG{BASHRC_CONFIGURATION_MASTER}'
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
        if (filePath.toLowerCase().includes('swamp')) {
            addOutput('🧅 "Get out of my swamp!" - File not found in Shrek\'s domain!', 'warning');
        } else {
            addOutput('💡 The file doesn\'t exist. You could create it, but this is a read-only simulation!', 'info');
        }
    }
}

function startInteractiveEditor(editor, filePath, originalContent) {
    // Clear terminal and show editor interface
    var terminal = document.getElementById('terminal-output');
    terminal.innerHTML = '';
    
    // Create nano-style header
    addOutput('  GNU nano 2.1.2-svn                File: ' + filePath, 'info');
    addOutput('');
    
    // Create editable content area that looks like real nano
    var editorDiv = document.createElement('div');
    editorDiv.className = 'editor-content';
    editorDiv.style.cssText = 'background: #0c0c0c; border: none; margin: 0; padding: 0; font-family: \'Courier New\', monospace; font-size: 14px; min-height: 300px; max-height: 400px; overflow-y: auto; position: relative;';
    
    var textarea = document.createElement('textarea');
    textarea.value = originalContent;
    textarea.style.cssText = 'width: 100%; height: 300px; background: transparent; border: none; color: #ffffff; font-family: \'Courier New\', monospace; font-size: 14px; resize: none; outline: none; padding: 5px; margin: 0;';
    
    editorDiv.appendChild(textarea);
    terminal.appendChild(editorDiv);
    
    // Add nano-style bottom commands (like real nano)
    addOutput('');
    addOutput('^G Get Help  ^O Write Out ^W Where Is  ^K Cut Text  ^J Justify   ^C Cur Pos', 'info');
    addOutput('^X Exit      ^R Read File ^\\ Replace   ^U Uncut Text^T To Spell  ^_ Go To Line', 'info');
    
    // Focus the textarea immediately
    textarea.focus();
    
    // Store editor state
    window.editorState = {
        editor: editor,
        filePath: filePath,
        originalContent: originalContent,
        textarea: textarea,
        modified: false
    };
    
    // Handle text changes
    textarea.addEventListener('input', function() {
        window.editorState.modified = (textarea.value !== originalContent);
    });
    
    // Handle keyboard shortcuts (like real nano)
    textarea.addEventListener('keydown', function(event) {
        if (event.ctrlKey) {
            switch(event.key.toLowerCase()) {
                case 'x':
                    event.preventDefault();
                    handleNanoExit();
                    break;
                case 'o':
                    event.preventDefault();
                    handleNanoSave();
                    break;
                case 'g':
                    event.preventDefault();
                    showNanoHelp();
                    break;
            }
        }
    });
    
    scrollToBottom();
}

function handleNanoExit() {
    var state = window.editorState;
    if (!state) return;
    
    if (state.modified) {
        // Show save prompt like real nano
        var terminal = document.getElementById('terminal-output');
        
        // Add save prompt at bottom
        var promptDiv = document.createElement('div');
        promptDiv.style.cssText = 'position: fixed; bottom: 0; left: 0; right: 0; background: #0c0c0c; color: #ffffff; padding: 5px; border-top: 1px solid #333;';
        promptDiv.innerHTML = 'Save modified buffer? (Answering "No" will DESTROY changes!) <span style="background: #333; padding: 2px;">Y</span>es <span style="background: #333; padding: 2px;">N</span>o <span style="background: #333; padding: 2px;">C</span>ancel';
        document.body.appendChild(promptDiv);
        
        // Handle save prompt response
        function handleSaveResponse(event) {
            var key = event.key.toLowerCase();
            if (key === 'y') {
                document.body.removeChild(promptDiv);
                document.removeEventListener('keydown', handleSaveResponse);
                saveFile();
                exitEditor();
            } else if (key === 'n') {
                document.body.removeChild(promptDiv);
                document.removeEventListener('keydown', handleSaveResponse);
                exitEditor();
            } else if (key === 'c') {
                document.body.removeChild(promptDiv);
                document.removeEventListener('keydown', handleSaveResponse);
                // Cancel - go back to editing
                window.editorState.textarea.focus();
            }
        }
        
        document.addEventListener('keydown', handleSaveResponse);
    } else {
        exitEditor();
    }
}

function handleNanoSave() {
    var state = window.editorState;
    if (!state) return;
    
    saveFile();
    
    // Show save confirmation like real nano
    var terminal = document.getElementById('terminal-output');
    var saveMsg = document.createElement('div');
    saveMsg.style.cssText = 'position: fixed; bottom: 50px; left: 0; right: 0; background: #0c0c0c; color: #00ff00; padding: 5px; text-align: center;';
    saveMsg.textContent = '[ Wrote ' + state.textarea.value.split('\n').length + ' lines ]';
    document.body.appendChild(saveMsg);
    
    setTimeout(function() {
        if (document.body.contains(saveMsg)) {
            document.body.removeChild(saveMsg);
        }
        state.textarea.focus();
    }, 2000);
}

function handleEditorCommand(command) {
    // This function is kept for vi/vim compatibility
    // Nano now uses direct keyboard shortcuts
    var state = window.editorState;
    
    if (!state) {
        addOutput('Error: No active editor session', 'error');
        return;
    }
    
    var cmd = command.toLowerCase();
    
    // Vi/Vim commands only
    if (state.editor === 'vi' || state.editor === 'vim') {
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
    if (!state) return;
    
    var newContent = state.textarea.value;
    
    // Update file content in memory
    fileContents[state.filePath] = newContent;
    
    state.modified = false;
    state.originalContent = newContent;
    
    // Check for task completion
    checkFileEditCompletion(state.filePath, newContent);
}

function exitEditor() {
    var state = window.editorState;
    
    // Clean up any fixed position elements
    var fixedElements = document.querySelectorAll('[style*="position: fixed"]');
    fixedElements.forEach(function(el) {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    });
    
    // Clear editor state
    window.editorState = null;
    
    // Return to normal terminal
    setTimeout(function() {
        document.getElementById('terminal-output').innerHTML = '';
        addOutput('');
        addOutput('📝 Editor closed - returning to terminal', 'success');
        addOutput('File: ' + state.filePath, 'info');
        showNewPrompt();
    }, 100);
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
    
    // Check fstab configuration for swap
    if (filePath === '/etc/fstab') {
        var hasSwapEntry = content.includes('/swapfile') && content.includes('swap');
        
        if (hasSwapEntry) {
            addOutput('');
            addOutput('✅ Swap entry added to /etc/fstab!', 'success');
            addOutput('🔄 Swap will now persist across system reboots', 'success');
            addOutput('💡 Swap configuration is now fully complete!', 'info');
        }
    }
}

// CTF logs for Kubernetes challenges
window.ctfLogs = {
    'webapp-deployment-7d4b8c9f4d-xyz123': '2025-06-16T14:30:15.123Z INFO  Starting webapp container...\n2025-06-16T14:30:16.456Z INFO  Loading configuration from /etc/config/app.yaml\n2025-06-16T14:30:17.789Z INFO  Connecting to database at db.company.local:5432\n2025-06-16T14:30:18.012Z ERROR Failed to connect to database: connection timeout after 30s\n2025-06-16T14:30:19.345Z ERROR Database host db.company.local is unreachable (more unreachable than Shrek\'s social skills)\n2025-06-16T14:30:20.678Z ERROR Retrying database connection (attempt 1/3)\n2025-06-16T14:30:25.901Z ERROR Retrying database connection (attempt 2/3)\n2025-06-16T14:30:30.234Z ERROR Retrying database connection (attempt 3/3)\n2025-06-16T14:30:35.567Z FATAL All database connection attempts failed, shutting down\n2025-06-16T14:30:36.890Z INFO  Container exit code: 1 (sadder than when Fiona turned into an ogre)\n2025-06-16T14:30:37.123Z DEBUG Investigation shows database service is running but unreachable\n2025-06-16T14:30:38.456Z DEBUG FLAG{DATABASE_CONNECTION_TIMEOUT_DETECTED}\n2025-06-16T14:30:39.789Z DEBUG 🔍 Keep investigating! 🔍',

    'database-pv-claim': 'Name:          database-pv-claim\nNamespace:     default\nStorageClass:  fast-ssd\nStatus:        Pending\nVolume:        \nLabels:        <none>\nAnnotations:   volume.beta.kubernetes.io/storage-provisioner: kubernetes.io/no-provisioner\nFinalizers:    [kubernetes.io/pvc-protection]\nCapacity:      \nAccess Modes:  \nVolumeMode:    Filesystem\nUsed By:       database-statefulset-0\nEvents:\n  Type     Reason              Age               Message\n  ----     ------              ----              -------\n  Warning  ProvisioningFailed  2m (x15 over 30m) storageclass.storage.k8s.io "fast-ssd" not found\n  Normal   ExternalProvisioning 30s              waiting for a volume to be created, either by external provisioner "kubernetes.io/no-provisioner" or manually created by system administrator\n  Warning  ProvisioningFailed  15s              Failed to provision volume with StorageClass "fast-ssd": storageclass.storage.k8s.io "fast-ssd" not found\n  Normal   WaitForFirstConsumer 5s               FLAG{STORAGE_CLASS_MISCONFIGURATION_FOUND}\n\n🔍 Storage investigation complete - the StorageClass is missing!',

    'nginx-service-config': 'Name:                     nginx-service\nNamespace:                default\nLabels:                   app=nginx\nAnnotations:              <none>\nSelector:                 app=nginx-wrong\nType:                     LoadBalancer\nIP Family Policy:        SingleStack\nIP Families:             IPv4\nIP:                      10.96.100.200\nIPs:                     10.96.100.200\nLoadBalancer Ingress:    <pending>\nPort:                    http  80/TCP\nTargetPort:              80/TCP\nNodePort:                http  30081/TCP\nEndpoints:               <none>\nSession Affinity:        None\nExternal Traffic Policy: Cluster\nEvents:\n  Type     Reason                Age               Message\n  ----     ------                ----              -------\n  Warning  SyncLoadBalancerFailed 5m (x10 over 30m) Error syncing load balancer: failed to ensure load balancer: no available nodes for service\n  Normal   EnsuringLoadBalancer   2m                Ensuring load balancer\n  Warning  ServiceSelectorMismatch 1m               Service selector "app=nginx-wrong" does not match any pods (should be "app=nginx")\n  Normal   ConfigurationFixed     30s               FLAG{SERVICE_SELECTOR_MISMATCH_RESOLVED}\n\n🔗 Service troubleshooting reveals selector mismatch!'
};
    