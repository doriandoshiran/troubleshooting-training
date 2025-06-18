// File system operations and main functions

// Combine all file contents
var fileContents = {};

// Initialize file contents from all sources
function initializeFileContents() {
    // Combine CentOS files
    if (typeof centosFileContents !== 'undefined') {
        Object.assign(fileContents, centosFileContents);
    }
    
    // Combine Kubernetes config files
    if (typeof k8sConfigFiles !== 'undefined') {
        Object.assign(fileContents, k8sConfigFiles);
    }
    
    // Combine Kubernetes log files
    if (typeof k8sLogFiles !== 'undefined') {
        Object.assign(fileContents, k8sLogFiles);
    }
    
    // Combine Kubernetes troubleshooting docs
    if (typeof k8sTroubleshootingDocs !== 'undefined') {
        Object.assign(fileContents, k8sTroubleshootingDocs);
    }
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
    
    // Create editable content area that looks like real nano - BIGGER SIZE
    var editorDiv = document.createElement('div');
    editorDiv.className = 'editor-content';
    editorDiv.style.cssText = 'background: #0c0c0c; border: none; margin: 0; padding: 0; font-family: \'Courier New\', monospace; font-size: 14px; min-height: 500px; max-height: 600px; overflow-y: auto; position: relative;';
    
    var textarea = document.createElement('textarea');
    textarea.value = originalContent;
    textarea.style.cssText = 'width: 100%; height: 500px; background: transparent; border: none; color: #ffffff; font-family: \'Courier New\', monospace; font-size: 14px; resize: none; outline: none; padding: 5px; margin: 0;';
    
    editorDiv.appendChild(textarea);
    terminal.appendChild(editorDiv);
    
    // Add nano-style bottom commands (like real nano)
    addOutput('');
    addOutput('^G Get Help  ^O Write Out ^W Where Is  ^K Cut Text  ^J Justify   ^C Cur Pos', 'info');
    addOutput('^X Exit      ^R Read File ^\\ Replace   ^U Uncut Text^T To Spell  ^_ Go To Line', 'info');
    
    // Focus the textarea immediately and prevent losing focus
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
    
    // Better focus management for nano editor
    textarea.addEventListener('blur', function() {
        setTimeout(function() {
            if (window.editorState && window.editorState.textarea) {
                window.editorState.textarea.focus();
            }
        }, 10);
    });
    
    // Prevent losing focus when clicking in editor area
    editorDiv.addEventListener('click', function(event) {
        event.preventDefault();
        textarea.focus();
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
    
    // Platform configuration detection
    if (filePath === '/opt/platform/config/platform-config.yaml') {
        var hasDbHost = content.includes('db.company.local');
        var hasDbPassword = content.includes('SecureDbPass2025!');
        var hasDbHostQuoted = content.includes('"db.company.local"');
        var hasDbPasswordQuoted = content.includes('"SecureDbPass2025!"');
        
        var dbHostConfigured = hasDbHost || hasDbHostQuoted;
        var dbPasswordConfigured = hasDbPassword || hasDbPasswordQuoted;
        
        var hostInCorrectPlace = content.match(/host:\s*["']?db\.company\.local["']?/);
        var passwordInCorrectPlace = content.match(/password:\s*["']?SecureDbPass2025!["']?/);
        
        if ((dbHostConfigured && dbPasswordConfigured) || (hostInCorrectPlace && passwordInCorrectPlace)) {
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
                
                if (typeof checkAllTasksComplete === 'function') {
                    checkAllTasksComplete();
                }
            }
        } else {
            addOutput('💡 Remember to configure the required settings:', 'warning');
            addOutput('  database.host = "db.company.local" (or without quotes)', 'info');
            addOutput('  database.password = "SecureDbPass2025!" (or without quotes)', 'info');
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

// Initialize file contents when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeFileContents();
});.startsWith('/')) {
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
    
    if (!filePath