// File system structure definitions
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
        '.easter_eggs': 'file',
        'cluster-info.txt': 'file',
        'kubernetes-cheat-sheet.txt': 'file'
    },
    '/root/.kube': {
        'config': 'file'
    },
    '/root/troubleshooting': {
        'investigation-notes.txt': 'file',
        'meme-logs.txt': 'file',
        'incident-report.txt': 'file',
        'debug-commands.txt': 'file',
        'network-analysis.txt': 'file'
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
    '/var/log/pods/shrek-pod-123': {
        'shrek': 'directory'
    },
    '/var/log/pods/shrek-pod-123/shrek': {
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

// Get current file system based on host
function getCurrentFileSystem() {
    if (currentHost === 'k8s-master-01') {
        return k8sFileSystem;
    }
    return centosFileSystem;
}
