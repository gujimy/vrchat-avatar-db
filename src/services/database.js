import { t } from './i18n';

// VRChat Avatar Database Operations
export class AvatarDatabase {
    constructor() {
        this.DB_KEY = 'vrchat_avatars';
    }

    // 获取所有模型数据
    getAllAvatars() {
        return JSON.parse(GM_getValue(this.DB_KEY, '[]'));
    }

    // 保存模型数据
    saveAvatar(avatarData) {
        const avatars = this.getAllAvatars();
        avatars.push(avatarData);
        GM_setValue(this.DB_KEY, JSON.stringify(avatars));
    }

    // 从VRChat API获取模型数据
    async fetchAvatarData(avatarId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://vrchat.com/api/1/avatars/${avatarId}`,
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Cookie': document.cookie,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Origin': 'https://vrchat.com',
                    'Referer': 'https://vrchat.com/'
                },
                withCredentials: true,
                onload: function(response) {
                    console.log('API Response Status:', response.status);
                    console.log('API Response Headers:', response.responseHeaders);
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (error) {
                            console.error('解析响应失败:', error);
                            reject(new Error(t('parseResponseError', error.message)));
                        }
                    } else {
                        console.error('API请求失败:', response.status, response.statusText, response.responseText);
                        reject(new Error(t('fetchAvatarError', response.status, response.statusText || t('unknownError'))));
                    }
                },
                onerror: function(error) {
                    console.error('API请求错误:', error);
                    reject(new Error(t('networkError', error.message || t('unknownError'))));
                }
            });
        });
    }

    // 切换模型
    async switchAvatar(avatarId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'PUT',
                url: `https://vrchat.com/api/1/avatars/${avatarId}/select`,
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Cookie': document.cookie,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Origin': 'https://vrchat.com',
                    'Referer': 'https://vrchat.com/'
                },
                withCredentials: true,
                onload: function(response) {
                    console.log('Switch Avatar Response:', response.status, response.statusText);
                    if (response.status === 200) {
                        resolve();
                    } else {
                        console.error('切换模型失败:', response.status, response.statusText, response.responseText);
                        reject(new Error(t('switchAvatarError', response.status, response.statusText || t('unknownError'))));
                    }
                },
                onerror: function(error) {
                    console.error('切换模型请求错误:', error);
                    reject(new Error(t('networkError', error.message || t('unknownError'))));
                }
            });
        });
    }

    // 删除模型
    deleteAvatar(avatarId) {
        const avatars = this.getAllAvatars();
        const newAvatars = avatars.filter(avatar => avatar.id !== avatarId);
        GM_setValue(this.DB_KEY, JSON.stringify(newAvatars));
    }

    // 批量删除模型
    batchDeleteAvatars(avatarIds) {
        const avatars = this.getAllAvatars();
        const newAvatars = avatars.filter(avatar => !avatarIds.includes(avatar.id));
        GM_setValue(this.DB_KEY, JSON.stringify(newAvatars));
    }

    // 导出数据为CSV
    exportToCSV() {
        const avatars = this.getAllAvatars();
        const header = 'ID,Name,Author Name\n';
        const content = avatars.map(avatar => 
            `${avatar.id},${avatar.name},${avatar.authorName}`
        ).join('\n');
        return header + content;
    }

    // 导出数据为TXT
    exportToTXT() {
        const avatars = this.getAllAvatars();
        return avatars.map(avatar => 
            `${avatar.id},${avatar.name},${avatar.authorName}`
        ).join('\n');
    }

    // 解析输入文本
    parseInput(text) {
        const lines = text.split(/[\n\r]+/);
        const avatarIds = [];
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            
            // 处理CSV格式（支持 ID,Name 和 ID,Name,Author Name）
            if (line.includes(',')) {
                // 使用正则表达式处理CSV，考虑引号和转义
                const parts = line.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
                const id = parts[0].trim().replace(/^["']|["']$/g, ''); // 移除可能的引号
                if (id.startsWith('avtr_')) {
                    avatarIds.push(id);
                }
                continue;
            }
            
            // 处理URL格式
            const match = trimmed.match(/avatars\/(avtr_[a-f0-9-]+)/i);
            if (match) {
                avatarIds.push(match[1]);
                continue;
            }
            
            // 处理纯ID格式
            if (/^avtr_[a-f0-9-]+$/i.test(trimmed)) {
                avatarIds.push(trimmed);
            }
        }
        
        return avatarIds;
    }
}

const db = new AvatarDatabase();
export default db; 