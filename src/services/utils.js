// VRChat Avatar Database Utilities

// 显示提示信息
export function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    if (isError) {
        toast.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    }
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 获取等级对应的颜色
export function getRankColor(performanceRating) {
    const colors = {
        'Excellent': '#00FF05', // 深绿色
        'Good': '#77E87C',      // 浅绿色
        'Medium': '#EAAA09',     // 橙色
        'Poor': '#e37d6b',       // 浅红色
        'VeryPoor': '#e55a42',  // 深红色
        'None': '#9E9E9E',      // 灰色
        'Unknown': '#9E9E9E'     // 灰色
    };
    return colors[performanceRating] || colors['Unknown'];
}

// 获取等级优先级
export function getRankPriority(performanceRating) {
    const priority = {
        'Excellent': 1,
        'Good': 2,
        'Medium': 3,
        'Poor': 4,
        'VeryPoor': 5,
        'None': 6,
        'Unknown': 7
    };
    return priority[performanceRating] || 7;
}

// 创建平台图标
export function createPlatformIcon(avatar) {
    const iconContainer = document.createElement('div');
    iconContainer.style.position = 'absolute';
    iconContainer.style.top = '5px';
    iconContainer.style.right = '5px';
    iconContainer.style.display = 'flex';
    iconContainer.style.gap = '4px';

    // 获取最新的PC和Quest包
    const pcPackages = avatar.unityPackages
        .filter(pkg => pkg.platform === 'standalonewindows' && pkg.variant === 'security')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    const questPackages = avatar.unityPackages
        .filter(pkg => pkg.platform === 'android' && pkg.variant === 'security')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const pcPackage = pcPackages[0];
    const questPackage = questPackages[0];

    // 检查是否支持各平台
    const supportsPc = avatar.unityPackages.some(pkg => pkg.platform === 'standalonewindows');
    const supportsQuest = avatar.unityPackages.some(pkg => pkg.platform === 'android');

    // PC 平台图标
    if (supportsPc) {
        const pcIcon = document.createElement('div');
        pcIcon.style.padding = '4px 8px';
        pcIcon.style.borderRadius = '4px';
        pcIcon.style.fontSize = '12px';
        pcIcon.style.fontWeight = 'bold';
        pcIcon.style.color = 'white';
        const performanceRating = pcPackage ? pcPackage.performanceRating : 'Unknown';
        pcIcon.style.backgroundColor = getRankColor(performanceRating);
        pcIcon.title = `PC Performance: ${performanceRating}`;
        pcIcon.textContent = 'PC';
        iconContainer.appendChild(pcIcon);
    }

    // Quest 平台图标
    if (supportsQuest) {
        const questIcon = document.createElement('div');
        questIcon.style.padding = '4px 8px';
        questIcon.style.borderRadius = '4px';
        questIcon.style.fontSize = '12px';
        questIcon.style.fontWeight = 'bold';
        questIcon.style.color = 'white';
        const performanceRating = questPackage ? questPackage.performanceRating : 'Unknown';
        questIcon.style.backgroundColor = getRankColor(performanceRating);
        questIcon.title = `Quest Performance: ${performanceRating}`;
        questIcon.textContent = 'A';
        iconContainer.appendChild(questIcon);
    }

    return iconContainer;
}

// 下载文件
export function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
} 