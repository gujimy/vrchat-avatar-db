// VRChat Avatar Database UI Components
import { createPlatformIcon, showToast, downloadFile } from '../services/utils';
import { t, setLanguage, getCurrentLanguage, getSupportedLanguages } from '../services/i18n';
import db from '../services/database';

export class UIComponents {
    constructor(db) {
        this.db = db;
        // 监听语言变更事件
        window.addEventListener('languageChanged', () => {
            this.updateUILanguage();
        });
    }

    // 更新UI语言
    updateUILanguage() {
        // 更新导航栏按钮
        const navButton = document.querySelector('.avatar-db-nav-button');
        if (navButton) {
            const buttonText = navButton.querySelector('span');
            if (buttonText) {
                buttonText.textContent = t('openDatabase');
            }
        }
        
        // 更新检查按钮
        const checkButtons = document.querySelectorAll('.check-btn');
        checkButtons.forEach(btn => {
            if (btn.classList.contains('check-btn') && !btn.getAttribute('data-checking')) {
                btn.textContent = t('checkModel');
            }
        });
        
        // 更新批量检查按钮
        const batchCheckBtn = document.querySelector('.batch-check-btn');
        if (batchCheckBtn && !batchCheckBtn.getAttribute('data-checking')) {
            // 只有在未进入批量检查模式时才更新按钮文本
            if (!batchCheckBtn.textContent.includes('(')) {
                batchCheckBtn.textContent = t('batchCheck');
            }
        }
        
        // 更新取消按钮
        const cancelBtn = document.querySelector('.cancel-check-btn');
        if (cancelBtn) {
            cancelBtn.textContent = t('cancel');
        }
        
        // 更新其他需要本地化的元素
        const avatarCount = document.querySelector('.avatar-count');
        if (avatarCount) {
            const count = avatarCount.textContent.match(/\d+/)[0];
            avatarCount.textContent = `${t('modelCount')}: ${count}`;
        }
        
        // 更新排序下拉菜单
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            Array.from(sortSelect.options).forEach(option => {
                if (option.value === 'latest') {
                    option.textContent = t('latest');
                } else if (option.value === 'oldest') {
                    option.textContent = t('oldest');
                } else if (option.value === 'quest') {
                    option.textContent = t('questPriority');
                }
            });
        }
        
        // 更新搜索框占位符
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.placeholder = t('search');
        }
        
        // 更新导入/导出按钮
        const importBtn = document.querySelector('.import-btn');
        if (importBtn) {
            importBtn.textContent = t('importModel');
        }
        
        const exportBtn = document.querySelector('.export-btn');
        if (exportBtn) {
            exportBtn.textContent = t('exportModel');
        }
        
        const exportCsvBtn = document.querySelector('.export-csv-btn');
        if (exportCsvBtn) {
            exportCsvBtn.textContent = t('csvExport');
        }
        
        const exportTxtBtn = document.querySelector('.export-txt-btn');
        if (exportTxtBtn) {
            exportTxtBtn.textContent = t('txtExport');
        }
        
        // 更新批量删除按钮
        const batchDeleteBtn = document.querySelector('.batch-delete-btn');
        if (batchDeleteBtn && !batchDeleteBtn.textContent.includes('(')) {
            batchDeleteBtn.textContent = t('batchDelete');
        }
        
        // 更新刷新按钮
        const refreshText = document.querySelector('.refresh-text');
        if (refreshText) {
            refreshText.textContent = t('refreshList');
        }
    }

    // 创建语言切换器
    createLanguageSelector() {
        const container = document.createElement('div');
        container.className = 'language-selector';
        container.style.cssText = `
            position: relative;
            margin-left: 10px;
        `;

        const currentLang = getCurrentLanguage();
        const languages = getSupportedLanguages();

        // 创建语言选择下拉框
        const langSelect = document.createElement('select');
        langSelect.className = 'sort-select';  // 使用与排序相同的样式
        langSelect.style.cssText = `
            min-width: 80px;
            padding: 8px 16px;
            border-radius: 20px;
            border: 1px solid #90CAF9;
            background: #E8F0FE;
            color: #1565C0;
            transition: all 0.3s ease;
            font-size: 13px;
            cursor: pointer;
        `;

        // 添加语言选项
        Object.entries(languages).forEach(([code, name]) => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            option.selected = code === currentLang;
            langSelect.appendChild(option);
        });

        // 添加切换语言事件
        langSelect.addEventListener('change', (e) => {
            const selectedLang = e.target.value;
            setLanguage(selectedLang);
        });

        container.appendChild(langSelect);
        return container;
    }

    // 创建主容器
    createMainContainer() {
        // 只尝试将按钮注入到VRChat左侧导航栏
        this.injectToNavbar();
        // 返回空元素，不再创建浮动按钮
        return document.createElement('div');
    }

    // 尝试将按钮注入到VRChat左侧导航栏
    injectToNavbar() {
        // 移除可能存在的旧按钮
        const existingButton = document.querySelector('.avatar-db-nav-button');
        if (existingButton) {
            existingButton.remove();
        }

        // 检测VRChat左侧导航栏
        const leftBar = document.querySelector('.leftbar .btn-group-vertical');
        if (!leftBar) {
            console.log('未找到VRChat导航栏');
            return false;
        }

        // 创建新按钮
        const button = document.createElement('div');
        button.className = 'avatar-db-nav-button';
        
        // 获取VRChat按钮样式
        const existingButtons = leftBar.querySelectorAll('a');
        let referenceButton = null;
        
        for (const btn of existingButtons) {
            if (btn && window.getComputedStyle(btn).display !== 'none') {
                referenceButton = btn;
                break;
            }
        }
        
        if (referenceButton) {
            // 复制VRChat按钮的样式
            const computedStyle = window.getComputedStyle(referenceButton);
            button.className += ' ' + referenceButton.className;
            
            // 设置与VRChat按钮一致的样式
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
            button.style.width = computedStyle.width;
            button.style.height = computedStyle.height;
            button.style.margin = computedStyle.margin;
            button.style.padding = computedStyle.padding;
            button.style.borderRadius = computedStyle.borderRadius;
            button.style.backgroundColor = '#07242B'; // 自定义背景色
            button.style.color = computedStyle.color;
            button.style.fontSize = computedStyle.fontSize;
            button.style.fontFamily = computedStyle.fontFamily;
            button.style.textAlign = 'center';
            button.style.cursor = 'pointer';
        }

        // 添加数据库图标 (使用五角星SVG图标)
        const dbIcon = `
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="database" 
                class="svg-inline--fa fa-database" role="img" xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 448 512" width="20" height="20" style="margin-right: 0;">
                <path fill="currentColor" d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z"></path>
            </svg>
        `;

        // 添加右侧的">"符号
        const rightArrow = `
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-right" class="svg-inline--fa fa-angle-right css-1efeorg e9fqopp0" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16">
                <path fill="currentColor" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path>
            </svg>
        `;

        // 设置按钮内容
        button.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; width: 100%; position: relative; padding: 0 10px;">
                <div style="position: absolute; left: 15px; display: flex; align-items: center;">
                    ${dbIcon}
                </div>
                <span style="width: 100%; text-align: center; padding: 0 35px;">${t('openDatabase')}</span>
                <div style="position: absolute; right: 15px;">
                    ${rightArrow}
                </div>
            </div>
        `;

        // 添加标题属性 (tooltip)
        button.setAttribute('title', t('openDatabase'));

        // 添加悬停效果
        if (referenceButton) {
            // 使用自定义悬停颜色
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#053C48'; // 悬停时的颜色
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = '#07242B'; // 恢复原始颜色
            });
        } else {
            // 使用默认悬停效果
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#053C48';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = '#07242B';
            });
        }

        // 添加点击事件
        button.addEventListener('click', () => {
            // 检查是否已经打开
            if (document.querySelector('.avatar-db-page')) {
                showToast(t('databaseAlreadyOpen'));
                return;
            }
            console.log('Opening avatar database...');
            this.displayAvatars();
            showToast(t('databaseOpened'));
        });

        // 添加到导航栏
        leftBar.insertBefore(button, leftBar.firstChild);
        console.log('成功注入按钮到导航栏');
        return true;
    }

    // 创建导入模态框
    createImportModal() {
        const modal = document.createElement('div');
        modal.className = 'avatar-db-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(244, 247, 250, 0.98);
            padding: 40px 20px 20px;
            border-radius: 16px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(33, 150, 243, 0.2);
            color: #1565C0;
            width: 500px;
        `;

        // 创建帮助按钮
        const helpBtn = document.createElement('button');
        helpBtn.className = 'avatar-db-button';
        helpBtn.innerHTML = '?';
        helpBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 50px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            padding: 0;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #E3F2FD;
            color: #1565C0;
            border: none;
            cursor: pointer;
            z-index: 1;
            transition: all 0.3s ease;
        `;

        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            padding: 0;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #E3F2FD;
            color: #1565C0;
            border: none;
            cursor: pointer;
            z-index: 1;
            transition: all 0.3s ease;
        `;

        // 添加按钮悬停效果
        [helpBtn, closeBtn].forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.backgroundColor = '#BBDEFB';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.backgroundColor = '#E3F2FD';
            });
        });

        // 创建格式说明弹窗
        const helpContent = document.createElement('div');
        helpContent.style.cssText = `
            display: none;
            position: absolute;
            top: 50px;
            right: 10px;
            width: 400px;
            padding: 15px;
            background: #FFFFFF;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 2;
            font-size: 13px;
            color: #1565C0;
        `;
        helpContent.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color:rgb(0, 0, 0);">${t('importFormatTitle')}</h3>
            <div style="line-height: 1.6;">
                <p style="margin: 0 0 15px 0;">1. ${t('importFormatLink')}</p>
                <pre style="background: #F5F9FF; padding: 8px; border-radius: 4px; margin: 0 0 15px 0; border: 1px solid #BBDEFB; color: #1565C0; font-weight: bold;">https://vrchat.com/home/avatar/avtr_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</pre>
                
                <p style="margin: 0 0 15px 0;">2. ${t('importFormatId')}</p>
                <pre style="background: #F5F9FF; padding: 8px; border-radius: 4px; margin: 0 0 15px 0; border: 1px solid #BBDEFB; color: #1565C0; font-weight: bold;">avtr_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</pre>
                
                <p style="margin: 0 0 15px 0;">3. ${t('importFormatCsv')}</p>
                <pre style="background: #F5F9FF; padding: 8px; border-radius: 4px; margin: 0 0 15px 0; border: 1px solid #BBDEFB; color: #1565C0; font-weight: bold;">avtr_xxxxxx,${t('modelName')},${t('authorName')}
avtr_xxxxxx,"${t('modelName')}",${t('authorName')}</pre>
                
                <p style="margin: 0 0 15px 0;">4. ${t('importFormatBatch')}</p>
                <ul style="margin: 0; padding-left: 20px;">
                    ${t('importFormatBatchNotes').map(note => `<li>${note}</li>`).join('')}
                </ul>
            </div>
        `;

        const mainContent = document.createElement('div');
        mainContent.innerHTML = `
            <textarea class="avatar-db-textarea" placeholder="${t('importPlaceholder')}"></textarea>
            <button class="avatar-db-button confirm-btn">${t('confirmImport')}</button>
            <div class="progress" style="display:none;"><div class="progress-bar"></div></div>
            <div class="import-message"></div>
        `;

        // 添加帮助按钮事件
        helpBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            helpContent.style.display = helpContent.style.display === 'none' ? 'block' : 'none';
        });

        // 点击其他地方关闭帮助内容
        document.addEventListener('click', (e) => {
            if (!helpBtn.contains(e.target) && !helpContent.contains(e.target)) {
                helpContent.style.display = 'none';
            }
        });

        // 添加关闭按钮事件
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            const textarea = modal.querySelector('.avatar-db-textarea');
            if (textarea) textarea.value = '';
        });

        modal.appendChild(helpBtn);
        modal.appendChild(closeBtn);
        modal.appendChild(helpContent);
        modal.appendChild(mainContent);

        this.setupImportModalEvents(mainContent);
        return modal;
    }

    // 设置导入模态框事件
    setupImportModalEvents(modal) {
        const [textarea, confirmBtn, progressBar, message] = modal.children;

        confirmBtn.addEventListener('click', async () => {
            const text = textarea.value;
            const avatarIds = this.db.parseInput(text);
            
            if (avatarIds.length === 0) {
                message.className = 'import-message';
                message.innerHTML = `<div class="error">${t('noValidIds')}</div>`;
                return;
            }

            progressBar.style.display = 'block';
            const progress = progressBar.querySelector('.progress-bar');
            progress.style.width = '0%';
            message.className = 'import-message';
            message.innerHTML = `<div>${t('importing', 0, avatarIds.length, 0)}</div>`;

            const successIds = [];
            const failedIds = [];
            const duplicateIds = [];
            const errors = new Map();

            for (let i = 0; i < avatarIds.length; i++) {
                const id = avatarIds[i];
                if (this.db.getAllAvatars().find(a => a.id === id)) {
                    duplicateIds.push(id);
                    continue;
                }
                try {
                    const avatarData = await this.db.fetchAvatarData(id);
                    this.db.saveAvatar(avatarData);
                    successIds.push(id);
                } catch (error) {
                    console.error(`导入模型失败 ${id}:`, error);
                    failedIds.push(id);
                    errors.set(id, error.message);
                }
                const percent = Math.round(((i + 1) / avatarIds.length) * 100);
                progress.style.width = `${percent}%`;
                message.innerHTML = `<div>${t('importing', i + 1, avatarIds.length, percent)}</div>`;
            }

            this.showImportSummary(message, successIds, duplicateIds, failedIds, errors);

            // 如果有成功导入的模型，自动刷新显示
            if (successIds.length > 0) {
                // 获取当前显示的容器
                const avatarContainer = document.querySelector('.avatar-grid-container');
                if (avatarContainer) {
                    // 获取当前的排序和搜索条件
                    const header = document.querySelector('.header');
                    const currentSort = header.querySelector('.sort-select').value;
                    const searchTerm = header.querySelector('.search-box').value.toLowerCase();
                    
                    // 重新获取并显示数据
                    let updatedAvatars = this.db.getAllAvatars();
                    
                    // 应用搜索过滤
                    if (searchTerm) {
                        updatedAvatars = updatedAvatars.filter(avatar => 
                            avatar.name.toLowerCase().includes(searchTerm) || 
                            avatar.authorName.toLowerCase().includes(searchTerm)
                        );
                    }

                    // 应用排序
                    if (currentSort === 'latest') {
                        updatedAvatars.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    } else if (currentSort === 'oldest') {
                        updatedAvatars.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    } else if (currentSort === 'quest') {
                        updatedAvatars.sort((a, b) => {
                            // 获取 Quest 包的性能评级
                            const getQuestRating = (avatar) => {
                                const questPackages = avatar.unityPackages
                                    .filter(pkg => pkg.platform === 'android' && pkg.variant === 'security')
                                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                                return questPackages[0]?.performanceRating || 'None';
                            };

                            // 检查是否支持 Quest
                            const aQuest = a.unityPackages.some(pkg => pkg.platform === 'android');
                            const bQuest = b.unityPackages.some(pkg => pkg.platform === 'android');

                            // 如果一个支持 Quest 而另一个不支持，支持的排在前面
                            if (aQuest && !bQuest) return -1;
                            if (!aQuest && bQuest) return 1;

                            // 如果都支持 Quest，按性能评级排序
                            if (aQuest && bQuest) {
                                const aRating = getQuestRating(a);
                                const bRating = getQuestRating(b);
                                const ratingPriority = {
                                    'Excellent': 1,
                                    'Good': 2,
                                    'Medium': 3,
                                    'Poor': 4,
                                    'VeryPoor': 5,
                                    'None': 6,
                                    'Unknown': 7
                                };
                                return ratingPriority[aRating] - ratingPriority[bRating];
                            }

                            // 如果都不支持 Quest，按创建时间排序
                            return new Date(b.created_at) - new Date(a.created_at);
                        });
                    }

                    // 更新显示
                    this.renderAvatars(updatedAvatars, avatarContainer);
                    
                    // 更新计数器
                    const avatarCount = header.querySelector('.avatar-count');
                    if (avatarCount) {
                        avatarCount.textContent = `${t('modelCount')}: ${updatedAvatars.length}`;
                    }
                }
            }
        });
    }

    // 显示导入结果摘要
    showImportSummary(messageElement, successIds, duplicateIds, failedIds, errors) {
        const summaryParts = [];
        
        const totalSuccess = successIds.length;
        const totalDuplicate = duplicateIds.length;
        const totalFailed = failedIds.length;
        
        if (totalSuccess > 0) {
            summaryParts.push(`<div class="success">${t('importSuccess', totalSuccess)}</div>`);
            summaryParts.push(`<div class="success-list">${t('successfulIds')}：<br>${successIds.join('<br>')}</div>`);
        }
        
        if (totalDuplicate > 0) {
            summaryParts.push(`<div class="warning">${t('importSkipped', totalDuplicate)}</div>`);
            summaryParts.push(`<div class="warning-list">${t('duplicateIds')}：<br>${duplicateIds.join('<br>')}</div>`);
        }
        
        if (totalFailed > 0) {
            summaryParts.push(`<div class="error">${t('importFailed', totalFailed)}</div>`);
            summaryParts.push(`<div class="error-list">${t('failureDetails')}：<br>`);
            failedIds.forEach(id => {
                const error = errors.get(id) || t('unknownError');
                summaryParts.push(`${id}: ${error}<br>`);
            });
            summaryParts.push('</div>');
        }
        
        messageElement.innerHTML = `
            <div class="summary-container">
                ${summaryParts.join('')}
            </div>
        `;
    }

    // 创建模型卡片
    createAvatarCard(avatar) {
        const card = document.createElement('div');
        card.className = 'avatar-card';
        card.dataset.avatarId = avatar.id;

        card.innerHTML = `
            <div style="position: relative; padding-top: 75%; overflow: hidden; border-radius: 4px; margin-bottom: 10px;">
                <a href="https://vrchat.com/home/avatar/${avatar.id}" target="_blank" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
                    <img src="${avatar.thumbnailImageUrl}" alt="${avatar.name}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                </a>
                <button class="copy-id-btn" data-id="${avatar.id}" style="position: absolute; top: 5px; left: 5px; background: rgba(33, 150, 243, 0.9); color: white; border: none; border-radius: 4px; padding: 3px 6px; font-size: 12px; cursor: pointer; transition: all 0.3s ease; opacity: 0;">${t('copyId')}</button>
                <button class="check-btn" data-id="${avatar.id}" style="position: absolute; bottom: 5px; right: 5px; background: rgba(76, 175, 80, 0.9); color: white; border: none; border-radius: 4px; padding: 3px 6px; font-size: 12px; cursor: pointer; transition: all 0.3s ease; opacity: 0;">${t('checkModel')}</button>
            </div>
            <h4 style="margin: 10px 0; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #1565C0;">${avatar.name}</h4>
            <p style="color: #64B5F6; font-size: 12px; margin: 5px 0;">${t('author')}: ${avatar.authorName}</p>
            <button class='switch-button avatar-db-button' style="width: 100%; margin-top: 10px;">${t('switchModel')}</button>
        `;

        // 添加平台图标
        const platformIcon = createPlatformIcon(avatar);
        card.querySelector('div').appendChild(platformIcon);

        // 添加卡片悬停时显示按钮的效果
        card.addEventListener('mouseenter', () => {
            card.querySelector('.copy-id-btn').style.opacity = '1';
            card.querySelector('.check-btn').style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.copy-id-btn').style.opacity = '0';
            card.querySelector('.check-btn').style.opacity = '0';
        });

        this.setupCardEvents(card, avatar);
        return card;
    }

    // 设置卡片事件
    setupCardEvents(card, avatar) {
        // 复制ID按钮事件
        const copyBtn = card.querySelector('.copy-id-btn');
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(avatar.id).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = t('copySuccess');
                copyBtn.classList.add('success');
                setTimeout(() => {
                    copyBtn.textContent = t('copyId');
                    copyBtn.classList.remove('success');
                }, 1500);
            });
        });

        // 检查模型按钮事件
        const checkBtn = card.querySelector('.check-btn');
        checkBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const originalText = checkBtn.textContent;
            checkBtn.textContent = t('checking') || '检查中...';
            checkBtn.style.background = 'rgba(33, 150, 243, 0.9)';
            checkBtn.disabled = true;
            
            try {
                console.log(`开始检查模型: ${avatar.id}`);
                
                // 移除可能存在的旧模态框和遮罩
                const existingModals = document.querySelectorAll('.avatar-db-modal, .avatar-db-modal-overlay');
                existingModals.forEach(elem => {
                    try {
                        document.body.removeChild(elem);
                    } catch (e) {
                        console.warn('移除现有模态框元素失败:', e);
                    }
                });
                
                // 创建结果模态框
                const { overlay, modal } = this.createCheckResultsModal();
                
                // 添加模态框到DOM
                document.body.appendChild(overlay);
                document.body.appendChild(modal);
                console.log('检查结果模态框已添加到DOM');
                
                // 获取模态框中的元素
                const progressBar = modal.querySelector('.check-progress-bar');
                const status = modal.querySelector('.check-status');
                const results = modal.querySelector('.check-results');
                const title = modal.querySelector('h3');
                const exportBtn = modal.querySelector('.export-deleted-btn');
                const deletedContainer = modal.querySelector('.deleted-models-container');
                const deletedList = modal.querySelector('.deleted-models-list');
                
                // 更新状态
                title.textContent = t('checkingModels') || '正在检查模型...';
                status.textContent = t('checking') || '检查中...';
                
                // 更新进度条
                progressBar.style.width = '50%';
                
                // 检查模型状态
                const result = await this.db.checkAvatarStatus(avatar.id);
                console.log(`模型检查结果:`, result);
                
                // 更新进度条到100%
                progressBar.style.width = '100%';
                
                // 添加结果项
                const addResultItem = (avatar, result) => {
                    const item = document.createElement('div');
                    item.style.cssText = `
                        display: flex;
                        align-items: center;
                        padding: 10px;
                        border-radius: 8px;
                        margin-bottom: 10px;
                        border-left: 4px solid ${result.status === 'available' ? '#4CAF50' : result.status === 'unavailable' ? '#F44336' : '#FF9800'};
                        background: ${result.status === 'available' ? 'rgba(76, 175, 80, 0.1)' : result.status === 'unavailable' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 152, 0, 0.1)'};
                    `;
                    
                    item.innerHTML = `
                        <div style="width: 40px; height: 40px; margin-right: 10px; flex-shrink: 0; overflow: hidden; border-radius: 4px;">
                            <img src="${avatar.thumbnailImageUrl}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div style="flex-grow: 1; overflow: hidden;">
                            <div style="font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${avatar.name}</div>
                            <div style="font-size: 12px; color: #757575;">${avatar.id}</div>
                        </div>
                        <div style="margin-left: 10px; flex-shrink: 0; color: ${result.status === 'available' ? '#4CAF50' : result.status === 'unavailable' ? '#F44336' : '#FF9800'};">
                            ${result.status === 'available' ? t('checkSuccess') || '已更新' : 
                              result.status === 'unavailable' ? t('checkDeleted') || '已删除' : 
                              t('checkError') || '检查失败'}
                        </div>
                    `;
                    
                    results.appendChild(item);
                    
                    // 如果是被删除的模型，同时添加到删除列表
                    if (result.status === 'unavailable') {
                        const deletedItem = document.createElement('div');
                        deletedItem.style.cssText = `
                            display: flex;
                            justify-content: space-between;
                            padding: 5px 0;
                            border-bottom: 1px dashed #E0E0E0;
                        `;
                        deletedItem.innerHTML = `
                            <div style="flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${avatar.name}</div>
                            <div style="color: #757575; margin-left: 10px;">${avatar.id}</div>
                        `;
                        deletedList.appendChild(deletedItem);
                        
                        // 如果有删除的模型，显示删除模型容器和导出按钮
                        deletedContainer.style.display = 'block';
                        exportBtn.style.opacity = '1';
                        exportBtn.style.pointerEvents = 'auto';
                        
                        // 添加导出点击事件
                        exportBtn.addEventListener('click', () => {
                            const content = `${avatar.id},${avatar.name}`;
                            downloadFile(content, 'deleted_vrchat_avatar.csv');
                        });
                    }
                };
                
                if (result.status === 'available') {
                    // 模型可用，更新数据
                    this.db.updateAvatar(avatar.id, result.data);
                    // 添加结果项
                    addResultItem(avatar, result);
                    // 更新当前卡片上的信息
                    card.querySelector('h4').textContent = result.data.name;
                    card.querySelector('p').textContent = `${t('author')}: ${result.data.authorName}`;
                    card.querySelector('img').src = result.data.thumbnailImageUrl;
                    
                    // 更新统计
                    modal.querySelector('#updated-count').textContent = '1';
                    modal.querySelector('#deleted-count').textContent = '0';
                    modal.querySelector('#error-count').textContent = '0';
                    
                    // 更新标题和状态
                    title.textContent = t('checkComplete') || '检查完成';
                    status.textContent = `${t('checkComplete') || '检查完成'}: 1 ${t('updated') || '已更新'}`;
                    
                } else if (result.status === 'unavailable') {
                    // 模型不可用，从数据库中删除
                    this.db.deleteAvatar(avatar.id);
                    // 添加结果项
                    addResultItem(avatar, result);
                    
                    // 更新统计
                    modal.querySelector('#updated-count').textContent = '0';
                    modal.querySelector('#deleted-count').textContent = '1';
                    modal.querySelector('#error-count').textContent = '0';
                    
                    // 更新标题和状态
                    title.textContent = t('checkComplete') || '检查完成';
                    status.textContent = `${t('checkComplete') || '检查完成'}: 1 ${t('deleted') || '已删除'}`;
                    
                    // 添加淡出效果后移除卡片
                    card.style.opacity = '0.5';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.remove();
                    }, 2000);
                } else {
                    // 检查出错
                    // 添加结果项
                    addResultItem(avatar, result);
                    
                    // 更新统计
                    modal.querySelector('#updated-count').textContent = '0';
                    modal.querySelector('#deleted-count').textContent = '0';
                    modal.querySelector('#error-count').textContent = '1';
                    
                    // 更新标题和状态
                    title.textContent = t('checkComplete') || '检查完成';
                    status.textContent = `${t('checkComplete') || '检查完成'}: 1 ${t('failed') || '失败'}`;
                }
                
                setTimeout(() => {
                    checkBtn.textContent = originalText;
                    checkBtn.style.background = 'rgba(76, 175, 80, 0.9)';
                    checkBtn.disabled = false;
                }, 2000);
            } catch (error) {
                console.error(`检查模型失败: ${avatar.id}`, error);
                checkBtn.textContent = t('checkError') || '检查失败';
                checkBtn.style.background = 'rgba(255, 152, 0, 0.9)';
                showToast(t('checkError') || `检查失败: ${error.message}`, 'error');
                
                setTimeout(() => {
                    checkBtn.textContent = originalText;
                    checkBtn.style.background = 'rgba(76, 175, 80, 0.9)';
                    checkBtn.disabled = false;
                }, 2000);
            }
        });

        // 切换模型按钮事件
        const switchBtn = card.querySelector('.switch-button');
        switchBtn.addEventListener('click', async (event) => {
            event.stopPropagation();
            const originalText = switchBtn.textContent;
            switchBtn.classList.add('switch-loading');
            switchBtn.disabled = true;
            switchBtn.textContent = t('switching');
            
            try {
                await this.db.switchAvatar(avatar.id);
                switchBtn.classList.remove('switch-loading');
                switchBtn.classList.add('success');
                switchBtn.textContent = t('switchSuccess');
                setTimeout(() => {
                    switchBtn.classList.remove('success');
                    switchBtn.textContent = t('switchModel');
                    switchBtn.disabled = false;
                }, 1500);
            } catch (error) {
                switchBtn.classList.remove('switch-loading');
                switchBtn.classList.add('error');
                switchBtn.textContent = t('switchFailed');
                setTimeout(() => {
                    switchBtn.classList.remove('error');
                    switchBtn.textContent = t('switchModel');
                    switchBtn.disabled = false;
                }, 1500);
            }
        });

        // 卡片悬停效果
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 8px 16px rgba(33, 150, 243, 0.2)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 8px rgba(33, 150, 243, 0.15)';
        });
    }

    // 渲染模型列表
    renderAvatars(avatars, container) {
        container.innerHTML = '';
        container.className = 'avatar-grid-container';
        avatars.forEach(avatar => {
            const card = this.createAvatarCard(avatar);
            container.appendChild(card);
        });
    }

    // 显示模型数据库页面
    displayAvatars() {
        const avatars = this.db.getAllAvatars();
        const dbPage = document.createElement('div');
        dbPage.className = 'avatar-db-page';
        dbPage.style.cssText = `
            padding: 0;
            background: #F4F7FA;
            color: #2196F3;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            flex-direction: column;
        `;

        // 创建头部
        const header = this.createHeader(avatars.length);
        dbPage.appendChild(header);

        // 创建模型容器
        const avatarContainer = document.createElement('div');
        avatarContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 15px;
            padding: 20px;
            overflow-y: auto;
            flex: 1;
            background: #F4F7FA;
        `;

        this.renderAvatars(avatars, avatarContainer);
        dbPage.appendChild(avatarContainer);
        document.body.appendChild(dbPage);

        // 设置事件监听
        this.setupPageEvents(header, avatarContainer, dbPage, avatars);
    }

    // 创建头部
    createHeader(avatarCount) {
        const header = document.createElement('div');
        header.className = 'header';
        
        // 创建内部容器
        const innerContainer = document.createElement('div');
        innerContainer.style.cssText = `
            display: flex;
            gap: 10px;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            position: relative;
        `;

        // 左侧按钮组
        const leftButtons = document.createElement('div');
        leftButtons.style.cssText = 'display: flex; gap: 10px; align-items: center;';
        leftButtons.innerHTML = `
            <button class="avatar-db-button close-btn" style="min-width: 30px; width: 30px; height: 30px; border-radius: 50%; padding: 0; font-size: 20px; display: flex; align-items: center; justify-content: center; background-color: #ff4444; color: white; flex-shrink: 0;">×</button>
            <button class="avatar-db-button import-btn">${t('importModel')}</button>
            <div class="export-container" style="position: relative;">
                <button class="avatar-db-button export-btn">${t('exportModel')}</button>
                <div class="export-dropdown" style="display: none; position: absolute; top: 100%; left: 0; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); z-index: 10001; margin-top: 5px;">
                    <button class="avatar-db-button export-csv-btn" style="width: 100%; border-radius: 8px 8px 0 0;">${t('csvExport')}</button>
                    <button class="avatar-db-button export-txt-btn" style="width: 100%; border-radius: 0 0 8px 8px;">${t('txtExport')}</button>
                </div>
            </div>
            <button class="avatar-db-button batch-delete-btn">${t('batchDelete')}</button>
            <button class="avatar-db-button batch-check-btn">${t('batchCheck')}</button>
            <button class="avatar-db-button refresh-btn">
                <span class="refresh-text">${t('refreshList')}</span>
                <span class="refresh-spinner" style="display: none;">⟳</span>
            </button>
            <span class="avatar-count" style="color: #1565C0; font-size: 13px; padding: 5px 12px; background: rgba(33, 150, 243, 0.1); border-radius: 15px;">${t('modelCount')}: ${avatarCount}</span>
        `;

        // 右侧控件组
        const rightControls = document.createElement('div');
        rightControls.style.cssText = 'display: flex; gap: 10px; align-items: center;';
        
        // 创建排序选择器
        const sortSelect = document.createElement('select');
        sortSelect.className = 'sort-select';
        sortSelect.innerHTML = `
            <option value="latest">${t('latest')}</option>
            <option value="oldest">${t('oldest')}</option>
            <option value="quest">${t('questPriority')}</option>
        `;

        // 创建搜索框
        const searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.className = 'search-box';
        searchBox.placeholder = t('search');

        // 添加控件到右侧容器
        rightControls.appendChild(sortSelect);
        rightControls.appendChild(searchBox);
        rightControls.appendChild(this.createLanguageSelector());  // 直接添加语言选择器实例

        // 组装头部
        innerContainer.appendChild(leftButtons);
        innerContainer.appendChild(rightControls);
        header.appendChild(innerContainer);

        // 添加关闭按钮悬停效果
        const closeBtn = header.querySelector('.close-btn');
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.backgroundColor = '#ff6666';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.backgroundColor = '#ff4444';
        });

        return header;
    }

    // 设置页面事件
    setupPageEvents(header, avatarContainer, dbPage, avatars) {
        // 导入按钮事件
        const importBtn = header.querySelector('.import-btn');
        importBtn.addEventListener('click', () => {
            const importModal = this.createImportModal();
            document.body.appendChild(importModal);
            importModal.style.display = 'block';
        });

        // 导出按钮事件
        const exportBtn = header.querySelector('.export-btn');
        const exportDropdown = header.querySelector('.export-dropdown');
        const exportContainer = header.querySelector('.export-container');

        exportBtn.addEventListener('click', () => {
            exportDropdown.style.display = exportDropdown.style.display === 'none' ? 'block' : 'none';
        });

        // 点击其他地方时关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!exportContainer.contains(e.target)) {
                exportDropdown.style.display = 'none';
            }
        });

        // CSV导出
        header.querySelector('.export-csv-btn').addEventListener('click', () => {
            const content = this.db.exportToCSV();
            downloadFile(content, 'vrchat_avatars.csv');
            exportDropdown.style.display = 'none';
        });

        // TXT导出
        header.querySelector('.export-txt-btn').addEventListener('click', () => {
            const content = this.db.exportToTXT();
            downloadFile(content, 'vrchat_avatars.txt');
            exportDropdown.style.display = 'none';
        });

        // 批量删除事件
        const batchDeleteBtn = header.querySelector('.batch-delete-btn');
        let selectedAvatars = new Set();
        batchDeleteBtn.addEventListener('click', () => {
            this.handleBatchDelete(batchDeleteBtn, avatarContainer, selectedAvatars);
        });
        
        // 批量检查事件
        const batchCheckBtn = header.querySelector('.batch-check-btn');
        batchCheckBtn.addEventListener('click', () => {
            this.handleBatchCheck(batchCheckBtn, avatarContainer, selectedAvatars);
        });

        // 刷新按钮事件
        const refreshBtn = header.querySelector('.refresh-btn');
        const refreshText = refreshBtn.querySelector('.refresh-text');
        const refreshSpinner = refreshBtn.querySelector('.refresh-spinner');
        const avatarCount = header.querySelector('.avatar-count');
        this.setupRefreshEvent(refreshBtn, refreshText, refreshSpinner, avatarCount, avatarContainer);

        // 排序事件
        const sortSelect = header.querySelector('.sort-select');
        this.setupSortEvent(sortSelect, avatars, avatarContainer);

        // 搜索事件
        const searchBox = header.querySelector('.search-box');
        this.setupSearchEvent(searchBox, avatars, avatarContainer, avatarCount);

        // 关闭按钮事件
        const closeBtn = header.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(dbPage);
        });
    }

    // 设置刷新事件
    setupRefreshEvent(refreshBtn, refreshText, refreshSpinner, avatarCount, avatarContainer) {
        refreshBtn.addEventListener('click', async () => {
            // 如果按钮已经禁用，直接返回
            if (refreshBtn.disabled) {
                return;
            }

            refreshBtn.disabled = true;
            refreshText.style.display = 'none';
            refreshSpinner.style.display = 'inline-block';

            try {
                const currentSort = document.querySelector('.sort-select').value;
                const searchTerm = document.querySelector('.search-box').value.toLowerCase();
                let updatedAvatars = this.db.getAllAvatars();

                if (searchTerm) {
                    updatedAvatars = updatedAvatars.filter(avatar => 
                        avatar.name.toLowerCase().includes(searchTerm) || 
                        avatar.authorName.toLowerCase().includes(searchTerm)
                    );
                }

                if (currentSort === 'latest') {
                    updatedAvatars.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                } else if (currentSort === 'oldest') {
                    updatedAvatars.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                } else if (currentSort === 'quest') {
                    updatedAvatars.sort((a, b) => {
                        // 获取 Quest 包的性能评级
                        const getQuestRating = (avatar) => {
                            const questPackages = avatar.unityPackages
                                .filter(pkg => pkg.platform === 'android' && pkg.variant === 'security')
                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                            return questPackages[0]?.performanceRating || 'None';
                        };

                        // 检查是否支持 Quest
                        const aQuest = a.unityPackages.some(pkg => pkg.platform === 'android');
                        const bQuest = b.unityPackages.some(pkg => pkg.platform === 'android');

                        // 如果一个支持 Quest 而另一个不支持，支持的排在前面
                        if (aQuest && !bQuest) return -1;
                        if (!aQuest && bQuest) return 1;

                        // 如果都支持 Quest，按性能评级排序
                        if (aQuest && bQuest) {
                            const aRating = getQuestRating(a);
                            const bRating = getQuestRating(b);
                            const ratingPriority = {
                                'Excellent': 1,
                                'Good': 2,
                                'Medium': 3,
                                'Poor': 4,
                                'VeryPoor': 5,
                                'None': 6,
                                'Unknown': 7
                            };
                            return ratingPriority[aRating] - ratingPriority[bRating];
                        }

                        // 如果都不支持 Quest，按创建时间排序
                        return new Date(b.created_at) - new Date(a.created_at);
                    });
                }

                this.renderAvatars(updatedAvatars, avatarContainer);
                avatarCount.textContent = `${t('modelCount')}: ${updatedAvatars.length}`;
                // 显示刷新成功状态
                const originalText = refreshText.textContent;
                refreshText.textContent = t('refreshSuccess');
                refreshBtn.style.backgroundColor = '#4CAF50';
                showToast(t('refreshSuccess'));
                
                // 1.5秒后恢复原始状态
                setTimeout(() => {
                    refreshText.textContent = originalText;
                    refreshBtn.style.backgroundColor = '';
                }, 1500);
            } catch (error) {
                console.error('刷新失败:', error);
                showToast(t('refreshFailed'), true);
                refreshBtn.style.backgroundColor = '#f44336';
                refreshText.textContent = t('refreshFailed');
                
                // 1.5秒后恢复原始状态
                setTimeout(() => {
                    refreshText.textContent = t('refreshList');
                    refreshBtn.style.backgroundColor = '';
                }, 1500);
            } finally {
                refreshBtn.disabled = false;
                refreshText.style.display = 'inline-block';
                refreshSpinner.style.display = 'none';
            }
        });
    }

    // 设置排序事件
    setupSortEvent(sortSelect, avatars, avatarContainer) {
        sortSelect.addEventListener('change', (e) => {
            const sortValue = e.target.value;
            let sortedAvatars = [...avatars];

            if (sortValue === 'latest') {
                sortedAvatars.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            } else if (sortValue === 'oldest') {
                sortedAvatars.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            } else if (sortValue === 'quest') {
                sortedAvatars.sort((a, b) => {
                    // 获取 Quest 包的性能评级
                    const getQuestRating = (avatar) => {
                        const questPackages = avatar.unityPackages
                            .filter(pkg => pkg.platform === 'android' && pkg.variant === 'security')
                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                        return questPackages[0]?.performanceRating || 'None';
                    };

                    // 检查是否支持 Quest
                    const aQuest = a.unityPackages.some(pkg => pkg.platform === 'android');
                    const bQuest = b.unityPackages.some(pkg => pkg.platform === 'android');

                    // 如果一个支持 Quest 而另一个不支持，支持的排在前面
                    if (aQuest && !bQuest) return -1;
                    if (!aQuest && bQuest) return 1;

                    // 如果都支持 Quest，按性能评级排序
                    if (aQuest && bQuest) {
                        const aRating = getQuestRating(a);
                        const bRating = getQuestRating(b);
                        const ratingPriority = {
                            'Excellent': 1,
                            'Good': 2,
                            'Medium': 3,
                            'Poor': 4,
                            'VeryPoor': 5,
                            'None': 6,
                            'Unknown': 7
                        };
                        return ratingPriority[aRating] - ratingPriority[bRating];
                    }

                    // 如果都不支持 Quest，按创建时间排序
                    return new Date(b.created_at) - new Date(a.created_at);
                });
            }

            this.renderAvatars(sortedAvatars, avatarContainer);
        });
    }

    // 设置搜索事件
    setupSearchEvent(searchBox, avatars, avatarContainer, avatarCount) {
        searchBox.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredAvatars = avatars.filter(avatar =>
                avatar.name.toLowerCase().includes(searchTerm) ||
                avatar.authorName.toLowerCase().includes(searchTerm)
            );
            this.renderAvatars(filteredAvatars, avatarContainer);
            avatarCount.textContent = `${t('modelCount')}: ${filteredAvatars.length}`;
        });
    }

    // 处理批量删除
    handleBatchDelete(batchDeleteBtn, avatarContainer, selectedAvatars) {
        const cards = avatarContainer.querySelectorAll('.avatar-card');
        
        // 进入批量删除模式
        if (batchDeleteBtn.textContent === t('batchDelete')) {
            // 显示复选框
            cards.forEach(card => {
                if (!card.querySelector('.select-checkbox')) {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'select-checkbox';
                    checkbox.style.cssText = `
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        width: 20px;
                        height: 20px;
                        z-index: 1;
                        cursor: pointer;
                    `;
                    card.appendChild(checkbox);

                    checkbox.addEventListener('change', (e) => {
                        const avatarId = card.dataset.avatarId;
                        if (e.target.checked) {
                            selectedAvatars.add(avatarId);
                            card.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
                        } else {
                            selectedAvatars.delete(avatarId);
                            card.style.backgroundColor = '';
                        }
                        // 更新按钮文本显示选中数量
                        batchDeleteBtn.textContent = `${t('confirmDelete')} (${selectedAvatars.size})`;
                    });
                }
                // 显示所有复选框
                const checkbox = card.querySelector('.select-checkbox');
                checkbox.style.display = 'block';
                // 重置选中状态
                checkbox.checked = false;
                card.style.backgroundColor = '';
            });

            // 更改按钮状态
            batchDeleteBtn.textContent = '确认删除 (0)';
            batchDeleteBtn.style.backgroundColor = '#ff4444';
            
            // 添加取消按钮
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'avatar-db-button cancel-delete-btn';
            cancelBtn.textContent = t('cancel');
            cancelBtn.style.backgroundColor = '#9e9e9e';
            batchDeleteBtn.parentNode.insertBefore(cancelBtn, batchDeleteBtn.nextSibling);

            // 取消按钮事件
            cancelBtn.addEventListener('click', () => {
                this.exitBatchDeleteMode(batchDeleteBtn, cards, selectedAvatars);
                cancelBtn.remove();
            });

        } else {
            // 确认删除
            if (selectedAvatars.size > 0) {
                if (confirm(t('confirmDeleteMsg', selectedAvatars.size))) {
                    this.db.batchDeleteAvatars(Array.from(selectedAvatars));
                    
                    // 获取当前的排序和搜索条件
                    const header = document.querySelector('.header');
                    const currentSort = header.querySelector('.sort-select').value;
                    const searchTerm = header.querySelector('.search-box').value.toLowerCase();
                    
                    // 重新获取并显示数据
                    let updatedAvatars = this.db.getAllAvatars();
                    
                    // 应用搜索过滤
                    if (searchTerm) {
                        updatedAvatars = updatedAvatars.filter(avatar => 
                            avatar.name.toLowerCase().includes(searchTerm) || 
                            avatar.authorName.toLowerCase().includes(searchTerm)
                        );
                    }

                    // 应用排序
                    if (currentSort === 'latest') {
                        updatedAvatars.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    } else if (currentSort === 'oldest') {
                        updatedAvatars.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    } else if (currentSort === 'quest') {
                        updatedAvatars.sort((a, b) => {
                            // 获取 Quest 包的性能评级
                            const getQuestRating = (avatar) => {
                                const questPackages = avatar.unityPackages
                                    .filter(pkg => pkg.platform === 'android' && pkg.variant === 'security')
                                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                                return questPackages[0]?.performanceRating || 'None';
                            };

                            // 检查是否支持 Quest
                            const aQuest = a.unityPackages.some(pkg => pkg.platform === 'android');
                            const bQuest = b.unityPackages.some(pkg => pkg.platform === 'android');

                            // 如果一个支持 Quest 而另一个不支持，支持的排在前面
                            if (aQuest && !bQuest) return -1;
                            if (!aQuest && bQuest) return 1;

                            // 如果都支持 Quest，按性能评级排序
                            if (aQuest && bQuest) {
                                const aRating = getQuestRating(a);
                                const bRating = getQuestRating(b);
                                const ratingPriority = {
                                    'Excellent': 1,
                                    'Good': 2,
                                    'Medium': 3,
                                    'Poor': 4,
                                    'VeryPoor': 5,
                                    'None': 6,
                                    'Unknown': 7
                                };
                                return ratingPriority[aRating] - ratingPriority[bRating];
                            }

                            // 如果都不支持 Quest，按创建时间排序
                            return new Date(b.created_at) - new Date(a.created_at);
                        });
                    }

                    // 更新显示
                    this.renderAvatars(updatedAvatars, avatarContainer);
                    
                    // 更新计数器
                    const avatarCount = header.querySelector('.avatar-count');
                    if (avatarCount) {
                        avatarCount.textContent = `${t('modelCount')}: ${updatedAvatars.length}`;
                    }

                    // 显示删除成功提示
                    showToast(t('deleteSuccess', selectedAvatars.size));
                }
            }
            
            // 退出批量删除模式
            this.exitBatchDeleteMode(batchDeleteBtn, cards, selectedAvatars);
            const cancelBtn = document.querySelector('.cancel-delete-btn');
            if (cancelBtn) cancelBtn.remove();
        }
    }

    // 退出批量删除模式
    exitBatchDeleteMode(batchDeleteBtn, cards, selectedAvatars) {
        // 隐藏复选框
        cards.forEach(card => {
            const checkbox = card.querySelector('.select-checkbox');
            if (checkbox) {
                checkbox.style.display = 'none';
            }
            card.style.backgroundColor = '';
        });

        // 重置按钮状态
        batchDeleteBtn.textContent = t('batchDelete');
        batchDeleteBtn.style.backgroundColor = '';
        
        // 清空选中集合
        selectedAvatars.clear();
    }

    // 处理批量检查
    handleBatchCheck(batchCheckBtn, avatarContainer, selectedAvatars) {
        const cards = avatarContainer.querySelectorAll('.avatar-card');
        
        // 进入批量检查模式
        if (batchCheckBtn.textContent === t('batchCheck')) {
            // 显示复选框
            cards.forEach(card => {
                if (!card.querySelector('.select-checkbox')) {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'select-checkbox';
                    checkbox.style.cssText = `
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        width: 20px;
                        height: 20px;
                        z-index: 1;
                        cursor: pointer;
                    `;
                    card.appendChild(checkbox);

                    checkbox.addEventListener('change', (e) => {
                        const avatarId = card.dataset.avatarId;
                        if (e.target.checked) {
                            selectedAvatars.add(avatarId);
                            card.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
                        } else {
                            selectedAvatars.delete(avatarId);
                            card.style.backgroundColor = '';
                        }
                        // 更新按钮文本显示选中数量
                        batchCheckBtn.textContent = `${t('confirmCheck')} (${selectedAvatars.size})`;
                        // 更新全选按钮状态
                        const selectAllBtn = document.querySelector('.select-all-check-btn');
                        if (selectAllBtn) {
                            selectAllBtn.textContent = selectedAvatars.size === cards.length ? t('deselectAll') : t('selectAll');
                        }
                    });
                }
                // 显示所有复选框
                const checkbox = card.querySelector('.select-checkbox');
                checkbox.style.display = 'block';
                // 重置选中状态
                checkbox.checked = false;
                card.style.backgroundColor = '';
            });

            // 更改按钮状态
            batchCheckBtn.textContent = `${t('confirmCheck')} (0)`;
            batchCheckBtn.style.backgroundColor = '#2196F3'; // 蓝色
            
            // 添加全选按钮
            const selectAllBtn = document.createElement('button');
            selectAllBtn.className = 'avatar-db-button select-all-check-btn';
            selectAllBtn.textContent = t('selectAll');
            selectAllBtn.style.backgroundColor = '#4CAF50';
            batchCheckBtn.parentNode.insertBefore(selectAllBtn, batchCheckBtn.nextSibling);
            
            // 添加全选按钮事件
            selectAllBtn.addEventListener('click', () => {
                const allChecked = selectedAvatars.size === cards.length;
                cards.forEach(card => {
                    const checkbox = card.querySelector('.select-checkbox');
                    const avatarId = card.dataset.avatarId;
                    if (allChecked) {
                        // 取消全选
                        checkbox.checked = false;
                        selectedAvatars.delete(avatarId);
                        card.style.backgroundColor = '';
                    } else {
                        // 全选
                        checkbox.checked = true;
                        selectedAvatars.add(avatarId);
                        card.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
                    }
                });
                // 更新按钮文本
                batchCheckBtn.textContent = `${t('confirmCheck')} (${selectedAvatars.size})`;
                selectAllBtn.textContent = allChecked ? t('selectAll') : t('deselectAll');
            });

            // 添加取消按钮
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'avatar-db-button cancel-check-btn';
            cancelBtn.textContent = t('cancel');
            cancelBtn.style.backgroundColor = '#9e9e9e';
            batchCheckBtn.parentNode.insertBefore(cancelBtn, batchCheckBtn.nextSibling);

            // 取消按钮事件
            cancelBtn.addEventListener('click', () => {
                this.exitBatchCheckMode(batchCheckBtn, cards, selectedAvatars);
                selectAllBtn.remove();
                cancelBtn.remove();
            });

        } else {
            // 确认检查
            if (selectedAvatars.size > 0) {
                console.log('准备开始批量检查', selectedAvatars.size, '个模型');
                
                // 移除可能存在的旧模态框和遮罩
                const existingModals = document.querySelectorAll('.avatar-db-modal, .avatar-db-modal-overlay');
                existingModals.forEach(elem => {
                    try {
                        document.body.removeChild(elem);
                    } catch (e) {
                        console.warn('移除现有模态框元素失败:', e);
                    }
                });
                
                try {
                    // 创建结果模态框
                    const { overlay, modal } = this.createCheckResultsModal();
                    
                    // 先添加遮罩和模态框到DOM
                    document.body.appendChild(overlay);
                    document.body.appendChild(modal);
                    console.log('检查结果模态框已添加到DOM');
                    
                    // 强制重排，确保显示
                    setTimeout(() => {
                        modal.style.opacity = '0.99';
                        setTimeout(() => {
                            modal.style.opacity = '1';
                        }, 10);
                    }, 0);
                    
                    // 开始批量检查
                    this.startBatchCheck(Array.from(selectedAvatars), modal);
                } catch (error) {
                    console.error('创建或显示检查结果模态框失败:', error);
                    alert('创建检查结果界面失败，请重试');
                }
            } else {
                alert(t('noModelSelected'));
            }
            
            // 退出批量检查模式
            this.exitBatchCheckMode(batchCheckBtn, cards, selectedAvatars);
            const selectAllBtn = document.querySelector('.select-all-check-btn');
            const cancelBtn = document.querySelector('.cancel-check-btn');
            if (selectAllBtn) selectAllBtn.remove();
            if (cancelBtn) cancelBtn.remove();
        }
    }

    // 退出批量检查模式
    exitBatchCheckMode(batchCheckBtn, cards, selectedAvatars) {
        // 隐藏复选框
        cards.forEach(card => {
            const checkbox = card.querySelector('.select-checkbox');
            if (checkbox) {
                checkbox.style.display = 'none';
            }
            card.style.backgroundColor = '';
        });

        // 重置按钮状态
        batchCheckBtn.textContent = t('batchCheck') || '批量检查';
        batchCheckBtn.style.backgroundColor = '';
        
        // 清空选中集合
        selectedAvatars.clear();
    }

    // 创建检查结果模态框
    createCheckResultsModal() {
        // 创建半透明背景遮罩
        const overlay = document.createElement('div');
        overlay.className = 'avatar-db-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 99999;
        `;

        const modal = document.createElement('div');
        modal.className = 'avatar-db-modal check-results-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(244, 247, 250, 0.98);
            padding: 20px;
            border-radius: 16px;
            z-index: 100000;
            box-shadow: 0 4px 20px rgba(33, 150, 243, 0.3);
            color: #1565C0;
            width: 600px;
            max-width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            display: block;
            visibility: visible;
            opacity: 1;
            pointer-events: auto;
        `;

        // 创建标题
        const title = document.createElement('h3');
        title.textContent = t('checkingModels') || '正在检查模型...';
        title.style.cssText = `
            margin: 10px 0 20px;
            color: #1565C0;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
        `;
        
        // 创建进度显示
        const progress = document.createElement('div');
        progress.className = 'check-progress';
        progress.style.cssText = `
            height: 6px;
            width: 100%;
            background: #E3F2FD;
            border-radius: 3px;
            margin: 20px 0;
            overflow: hidden;
        `;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'check-progress-bar';
        progressBar.style.cssText = `
            height: 100%;
            width: 0%;
            background: #2196F3;
            transition: width 0.3s;
        `;
        progress.appendChild(progressBar);

        // 创建状态容器
        const status = document.createElement('div');
        status.className = 'check-status';
        status.style.cssText = `
            text-align: center;
            color: #757575;
            margin-bottom: 20px;
            font-size: 14px;
        `;
        status.textContent = '准备检查...';
        
        // 创建检查结果统计
        const stats = document.createElement('div');
        stats.className = 'check-stats';
        stats.style.cssText = `
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
        `;
        
        // 添加三种类型的计数器
        const createStat = (id, label, color) => {
            const stat = document.createElement('div');
            stat.style.cssText = `
                text-align: center;
                color: ${color};
            `;
            stat.innerHTML = `
                <div style="font-size: 32px; font-weight: bold;" id="${id}">0</div>
                <div>${label}</div>
            `;
            return stat;
        };
        
        stats.appendChild(createStat('updated-count', t('updatedModels') || '已更新', '#4CAF50'));
        stats.appendChild(createStat('deleted-count', t('deletedModels') || '已删除', '#F44336'));
        stats.appendChild(createStat('error-count', t('errorModels') || '检查失败', '#FF9800'));
        
        // 创建结果列表容器
        const results = document.createElement('div');
        results.className = 'check-results';
        results.style.cssText = `
            margin-top: 20px;
        `;
        
        // 被删除模型的容器
        const deletedContainer = document.createElement('div');
        deletedContainer.className = 'deleted-models-container';
        deletedContainer.style.cssText = `
            margin-top: 20px;
            display: none;
            background-color: rgba(244, 67, 54, 0.1);
            border-radius: 8px;
            padding: 15px;
            border-left: 4px solid #F44336;
        `;
        
        const deletedTitle = document.createElement('h4');
        deletedTitle.textContent = t('deletedModels') || '已删除模型';
        deletedTitle.style.cssText = `
            margin: 0 0 10px 0;
            color: #F44336;
            font-size: 16px;
        `;
        
        const deletedList = document.createElement('div');
        deletedList.className = 'deleted-models-list';
        deletedList.style.cssText = `
            max-height: 200px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 13px;
        `;
        
        deletedContainer.appendChild(deletedTitle);
        deletedContainer.appendChild(deletedList);
        
        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            padding: 0;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #E3F2FD;
            color: #1565C0;
            border: none;
            cursor: pointer;
            z-index: 1;
            transition: all 0.3s ease;
        `;
        
        // 添加按钮悬停效果
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.backgroundColor = '#BBDEFB';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.backgroundColor = '#E3F2FD';
        });
        
        // 添加关闭按钮事件
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        });
        
        // 创建导出删除的ID按钮
        const exportBtn = document.createElement('button');
        exportBtn.className = 'avatar-db-button export-deleted-btn';
        exportBtn.textContent = t('exportDeletedIds') || '导出已删除ID';
        exportBtn.style.cssText = `
            margin: 20px auto;
            display: block;
            background-color: #F44336;
            color: white;
            opacity: 0.7;
            pointer-events: none;
        `;
        
        // 组装模态框
        modal.appendChild(closeBtn);
        modal.appendChild(title);
        modal.appendChild(progress);
        modal.appendChild(status);
        modal.appendChild(stats);
        modal.appendChild(results);
        modal.appendChild(deletedContainer);
        modal.appendChild(exportBtn);
        
        return { overlay, modal, deletedList };
    }
    
    // 开始批量检查
    async startBatchCheck(avatarIds, resultsModal) {
        console.log('开始批量检查', avatarIds.length, '个模型');
        
        // 从resultsModal解构出需要的元素
        const modal = resultsModal;
        const progressBar = modal.querySelector('.check-progress-bar');
        const status = modal.querySelector('.check-status');
        const results = modal.querySelector('.check-results');
        const title = modal.querySelector('h3');
        const exportBtn = modal.querySelector('.export-deleted-btn');
        const deletedContainer = modal.querySelector('.deleted-models-container');
        const deletedList = modal.querySelector('.deleted-models-list');
        
        // 统计数据
        let updated = 0;
        let deleted = 0;
        let errors = 0;
        const deletedIds = [];
        
        // 更新统计展示
        const updateStats = () => {
            modal.querySelector('#updated-count').textContent = updated;
            modal.querySelector('#deleted-count').textContent = deleted;
            modal.querySelector('#error-count').textContent = errors;
        };
        
        // 添加结果项
        const addResultItem = (avatar, result) => {
            const item = document.createElement('div');
            item.style.cssText = `
                display: flex;
                align-items: center;
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 10px;
                border-left: 4px solid ${result.status === 'available' ? '#4CAF50' : result.status === 'unavailable' ? '#F44336' : '#FF9800'};
                background: ${result.status === 'available' ? 'rgba(76, 175, 80, 0.1)' : result.status === 'unavailable' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 152, 0, 0.1)'};
            `;
            
            item.innerHTML = `
                <div style="width: 40px; height: 40px; margin-right: 10px; flex-shrink: 0; overflow: hidden; border-radius: 4px;">
                    <img src="${avatar.thumbnailImageUrl}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="flex-grow: 1; overflow: hidden;">
                    <div style="font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${avatar.name}</div>
                    <div style="font-size: 12px; color: #757575;">${avatar.id}</div>
                </div>
                <div style="margin-left: 10px; flex-shrink: 0; color: ${result.status === 'available' ? '#4CAF50' : result.status === 'unavailable' ? '#F44336' : '#FF9800'};">
                    ${result.status === 'available' ? t('checkSuccess') || '已更新' : 
                      result.status === 'unavailable' ? t('checkDeleted') || '已删除' : 
                      t('checkError') || '检查失败'}
                </div>
            `;
            
            // 添加到结果列表
            results.appendChild(item);
            
            // 如果是被删除的模型，同时添加到删除列表
            if (result.status === 'unavailable') {
                const deletedItem = document.createElement('div');
                deletedItem.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    padding: 5px 0;
                    border-bottom: 1px dashed #E0E0E0;
                `;
                deletedItem.innerHTML = `
                    <div style="flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${avatar.name}</div>
                    <div style="color: #757575; margin-left: 10px;">${avatar.id}</div>
                `;
                deletedList.appendChild(deletedItem);
                
                // 如果有删除的模型，显示删除模型容器
                deletedContainer.style.display = 'block';
            }
        };
        
        // 延时函数，用于控制请求速率
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        
        // 遍历所有选中的模型进行检查
        for (let i = 0; i < avatarIds.length; i++) {
            const avatarId = avatarIds[i];
            const progress = Math.round(((i + 1) / avatarIds.length) * 100);
            
            // 更新进度条
            progressBar.style.width = `${progress}%`;
            
            // 更新状态文本
            status.textContent = `${t('checking') || '检查中'} ${i + 1}/${avatarIds.length} (${progress}%)`;
            
            try {
                // 获取模型数据
                const avatar = this.db.getAllAvatars().find(a => a.id === avatarId);
                if (!avatar) {
                    console.error(`找不到模型数据: ${avatarId}`);
                    errors++;
                    updateStats();
                    continue;
                }
                
                console.log(`开始检查模型 ${i+1}/${avatarIds.length}: ${avatar.name} (${avatar.id})`);
                
                // 检查模型状态
                const result = await this.db.checkAvatarStatus(avatarId);
                console.log(`模型检查结果:`, result);
                
                if (result.status === 'available') {
                    // 模型可用，更新数据
                    this.db.updateAvatar(avatarId, result.data);
                    addResultItem(avatar, result);
                    updated++;
                } else if (result.status === 'unavailable') {
                    // 模型不可用，从数据库中删除
                    this.db.deleteAvatar(avatarId);
                    addResultItem(avatar, result);
                    deleted++;
                    deletedIds.push({ id: avatarId, name: avatar.name });
                } else {
                    // 检查出错
                    addResultItem(avatar, result);
                    errors++;
                }
                
                // 更新统计
                updateStats();
                
                // 延时以避免请求过快
                await delay(500);
            } catch (error) {
                console.error(`批量检查模型失败 ${avatarId}:`, error);
                errors++;
                updateStats();
                await delay(500);
            }
        }
        
        // 检查完成后更新界面
        title.textContent = t('checkComplete') || '检查完成';
        status.textContent = `${t('checkComplete') || '检查完成'}: ${updated} ${t('updated') || '已更新'}, ${deleted} ${t('deleted') || '已删除'}, ${errors} ${t('failed') || '失败'}`;
        
        // 如果有删除的模型，启用导出按钮
        if (deleted > 0) {
            exportBtn.style.opacity = '1';
            exportBtn.style.pointerEvents = 'auto';
            
            // 添加导出点击事件
            exportBtn.addEventListener('click', () => {
                const content = deletedIds.map(item => `${item.id},${item.name}`).join('\n');
                downloadFile(content, 'deleted_vrchat_avatars.csv');
            });
        }
        
        // 自动刷新模型列表
        if (updated > 0 || deleted > 0) {
            // 获取当前显示的容器
            const avatarContainer = document.querySelector('.avatar-grid-container');
            if (avatarContainer) {
                // 获取当前的排序和搜索条件
                const header = document.querySelector('.header');
                const currentSort = header.querySelector('.sort-select').value;
                const searchTerm = header.querySelector('.search-box').value.toLowerCase();
                
                // 重新获取并显示数据
                let updatedAvatars = this.db.getAllAvatars();
                
                // 应用搜索过滤
                if (searchTerm) {
                    updatedAvatars = updatedAvatars.filter(avatar => 
                        avatar.name.toLowerCase().includes(searchTerm) || 
                        avatar.authorName.toLowerCase().includes(searchTerm)
                    );
                }

                // 应用排序
                if (currentSort === 'latest') {
                    updatedAvatars.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                } else if (currentSort === 'oldest') {
                    updatedAvatars.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                } else if (currentSort === 'quest') {
                    updatedAvatars.sort((a, b) => {
                        // 获取 Quest 包的性能评级
                        const getQuestRating = (avatar) => {
                            const questPackages = avatar.unityPackages
                                .filter(pkg => pkg.platform === 'android' && pkg.variant === 'security')
                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                            return questPackages[0]?.performanceRating || 'None';
                        };

                        // 检查是否支持 Quest
                        const aQuest = a.unityPackages.some(pkg => pkg.platform === 'android');
                        const bQuest = b.unityPackages.some(pkg => pkg.platform === 'android');

                        // 如果一个支持 Quest 而另一个不支持，支持的排在前面
                        if (aQuest && !bQuest) return -1;
                        if (!aQuest && bQuest) return 1;

                        // 如果都支持 Quest，按性能评级排序
                        if (aQuest && bQuest) {
                            const aRating = getQuestRating(a);
                            const bRating = getQuestRating(b);
                            const ratingPriority = {
                                'Excellent': 1,
                                'Good': 2,
                                'Medium': 3,
                                'Poor': 4,
                                'VeryPoor': 5,
                                'None': 6,
                                'Unknown': 7
                            };
                            return ratingPriority[aRating] - ratingPriority[bRating];
                        }

                        // 如果都不支持 Quest，按创建时间排序
                        return new Date(b.created_at) - new Date(a.created_at);
                    });
                }

                // 更新显示
                this.renderAvatars(updatedAvatars, avatarContainer);
                
                // 更新计数器
                const avatarCount = header.querySelector('.avatar-count');
                if (avatarCount) {
                    avatarCount.textContent = `${t('modelCount')}: ${updatedAvatars.length}`;
                }
            }
        }
    }

    // 监视模型详情页面加载
    setupAvatarPageListeners() {
        // 创建MutationObserver来监听DOM变化
        const observer = new MutationObserver(() => {
            this.checkAvatarPage();
        });
        
        // 观察整个document
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
        
        // 监听URL变化
        window.addEventListener('pushState', () => {
            setTimeout(() => this.checkAvatarPage(), 500);
        });
        
        window.addEventListener('popstate', () => {
            setTimeout(() => this.checkAvatarPage(), 500);
        });
        
        // 初始检查
        setTimeout(() => this.checkAvatarPage(), 1000);
    }

    // 检查当前是否在模型详情页面
    checkAvatarPage() {
        // 检查URL是否包含avatar路径
        if (window.location.href.includes('/home/avatar/')) {
            // 找到"Change Into Avatar"按钮
            const changeButton = Array.from(document.querySelectorAll('button')).find(btn => 
                btn.textContent.includes('Change Into Avatar'));
            
            // 如果找到按钮且我们的按钮尚未添加
            if (changeButton && !document.querySelector('.save-to-db-btn')) {
                this.addSaveButtonToAvatarPage(changeButton);
            }
        }
    }

    // 添加保存按钮到模型详情页面
    addSaveButtonToAvatarPage(changeButton) {
        // 从URL中提取模型ID
        const match = window.location.href.match(/avatar\/(avtr_[a-f0-9-]+)/i);
        if (!match) return;
        
        const avatarId = match[1];
        
        // 创建保存按钮
        const saveButton = document.createElement('button');
        saveButton.className = 'save-to-db-btn';
        
        // 复制样式从"Change Into Avatar"按钮
        const computedStyle = window.getComputedStyle(changeButton);
        saveButton.style.cssText = `
            background-color: #07242B; /* 更匹配VRChat的深色系风格 */
            color: white;
            border: none;
            border-radius: ${computedStyle.borderRadius};
            padding: 12px 20px; /* 调整内边距使按钮看起来更协调 */
            margin-bottom: 10px;
            cursor: pointer;
            width: 100%;
            font-family: ${computedStyle.fontFamily};
            font-size: ${computedStyle.fontSize};
            font-weight: 500; /* 调整字体粗细 */
            transition: background-color 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 轻微阴影效果 */
            height: ${computedStyle.height}; /* 保持与Change Into Avatar按钮一致的高度 */
            line-height: 1.2; /* 调整行高使文本垂直居中 */
        `;
        
        // 添加数据库图标
        const saveIcon = document.createElement('span');
        saveIcon.innerHTML = `
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="database" 
                class="svg-inline--fa fa-database" role="img" xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 448 512" width="16" height="16" style="margin-right: 10px; opacity: 0.9;">
                <path fill="currentColor" d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z"></path>
            </svg>
        `;
        
        // 设置按钮文本和图标
        saveButton.innerHTML = saveIcon.innerHTML + `<span style="flex: 1; text-align: center; padding-right: 16px;">${t('saveToDatabase')}</span>`;
        
        // 添加悬停效果
        saveButton.addEventListener('mouseenter', () => {
            saveButton.style.backgroundColor = '#1A2C40'; /* 深色悬停效果 */
            saveButton.style.boxShadow = '0 3px 7px rgba(0, 0, 0, 0.3)';
        });
        
        saveButton.addEventListener('mouseleave', () => {
            saveButton.style.backgroundColor = '#101F2E';
            saveButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        });
        
        // 添加点击事件
        saveButton.addEventListener('click', async () => {
            try {
                // 禁用按钮并更改文本
                saveButton.disabled = true;
                const originalContent = saveButton.innerHTML;
                saveButton.innerHTML = saveIcon.innerHTML + `<span style="flex: 1; text-align: center; padding-right: 16px;">${t('saving')}</span>`;
                
                // 检查模型是否已存在
                const existingAvatars = this.db.getAllAvatars();
                if (existingAvatars.some(a => a.id === avatarId)) {
                    saveButton.innerHTML = saveIcon.innerHTML + `<span style="flex: 1; text-align: center; padding-right: 16px;">${t('alreadySaved')}</span>`;
                    setTimeout(() => {
                        saveButton.innerHTML = originalContent;
                        saveButton.disabled = false;
                    }, 1500);
                    return;
                }
                
                // 获取模型数据
                const avatarData = await this.db.fetchAvatarData(avatarId);
                
                // 保存到数据库
                this.db.saveAvatar(avatarData);
                
                // 更新按钮状态
                saveButton.style.backgroundColor = '#1E3C2F'; /* 成功状态的深绿色 */
                saveButton.innerHTML = saveIcon.innerHTML + `<span style="flex: 1; text-align: center; padding-right: 16px;">${t('savedSuccess')}</span>`;
                
                // 显示提示
                showToast(t('avatarSaved'));
                
                // 恢复按钮状态
                setTimeout(() => {
                    saveButton.style.backgroundColor = '#101F2E';
                    saveButton.innerHTML = originalContent;
                    saveButton.disabled = false;
                }, 1500);
                
            } catch (error) {
                console.error('保存模型失败:', error);
                saveButton.style.backgroundColor = '#3E2021'; /* 错误状态的深红色 */
                saveButton.innerHTML = saveIcon.innerHTML + `<span style="flex: 1; text-align: center; padding-right: 16px;">${t('saveFailed')}</span>`;
                showToast(t('saveFailed'), true);
                
                // 恢复按钮状态
                setTimeout(() => {
                    saveButton.style.backgroundColor = '#101F2E';
                    saveButton.innerHTML = saveIcon.innerHTML + `<span style="flex: 1; text-align: center; padding-right: 16px;">${t('saveToDatabase')}</span>`;
                    saveButton.disabled = false;
                }, 1500);
            }
        });
        
        // 插入按钮到"Change Into Avatar"按钮上方
        changeButton.parentNode.insertBefore(saveButton, changeButton);
    }

    // 创建ID模态框
    createIdModal(title, id, name) {
        console.log(`正在创建模态框: 标题=${title}, ID=${id}, 名称=${name}`);
        
        // 先移除可能存在的旧模态框
        try {
            const existingModals = document.querySelectorAll('.avatar-db-modal, .avatar-db-modal-overlay');
            existingModals.forEach(m => {
                try {
                    document.body.removeChild(m);
                } catch (e) {
                    console.warn('移除已存在元素失败:', e);
                }
            });
        } catch (e) {
            console.warn('清理旧模态框失败:', e);
        }
        
        // 创建半透明背景遮罩
        const overlay = document.createElement('div');
        overlay.className = 'avatar-db-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 99999;
        `;
        
        const modal = document.createElement('div');
        modal.className = 'avatar-db-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(244, 247, 250, 0.98);
            padding: 20px;
            border-radius: 16px;
            z-index: 100000;
            box-shadow: 0 4px 20px rgba(244, 67, 54, 0.3);
            color: #1565C0;
            width: 400px;
            max-width: 90vw;
            pointer-events: auto;
            display: block;
            visibility: visible;
            opacity: 1;
        `;

        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            padding: 0;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #E3F2FD;
            color: #1565C0;
            border: none;
            cursor: pointer;
            z-index: 1;
            transition: all 0.3s ease;
        `;

        // 添加按钮悬停效果
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.backgroundColor = '#BBDEFB';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.backgroundColor = '#E3F2FD';
        });

        // 创建内容
        const content = document.createElement('div');
        content.style.cssText = `
            text-align: center;
            padding: 10px;
        `;
        
        // 标题
        const titleElem = document.createElement('h3');
        titleElem.textContent = title || '模型已删除';
        titleElem.style.cssText = `
            margin: 10px 0 20px;
            color: #F44336;
            font-size: 16px;
            font-weight: bold;
        `;
        
        // 显示ID和复制按钮的容器
        const idContainer = document.createElement('div');
        idContainer.style.cssText = `
            display: flex;
            margin: 20px 0;
            background: #F5F5F5;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #E0E0E0;
        `;
        
        // ID显示框
        const idDisplay = document.createElement('input');
        idDisplay.type = 'text';
        idDisplay.value = id;
        idDisplay.readOnly = true;
        idDisplay.style.cssText = `
            flex: 1;
            padding: 10px 15px;
            border: none;
            background: transparent;
            font-family: monospace;
            color: #333;
            font-size: 14px;
        `;
        
        // 复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.textContent = t('copyId') || '复制ID';
        copyBtn.style.cssText = `
            background: #2196F3;
            color: white;
            border: none;
            padding: 0 15px;
            cursor: pointer;
            font-size: 13px;
            transition: background 0.3s;
        `;
        
        copyBtn.addEventListener('mouseenter', () => {
            copyBtn.style.background = '#1976D2';
        });
        
        copyBtn.addEventListener('mouseleave', () => {
            copyBtn.style.background = '#2196F3';
        });
        
        copyBtn.addEventListener('click', () => {
            idDisplay.select();
            document.execCommand('copy');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = t('copySuccess') || '已复制';
            copyBtn.style.background = '#4CAF50';
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '#2196F3';
            }, 1500);
        });
        
        // 模型名称显示
        const nameInfo = document.createElement('p');
        nameInfo.textContent = `${t('modelName') || '模型名称'}: ${name}`;
        nameInfo.style.cssText = `
            margin: 15px 0;
            color: #555;
            font-size: 14px;
        `;

        // 组装ID容器
        idContainer.appendChild(idDisplay);
        idContainer.appendChild(copyBtn);
        
        // 组装内容
        content.appendChild(titleElem);
        content.appendChild(nameInfo);
        content.appendChild(idContainer);

        // 添加关闭按钮事件
        const closeModal = () => {
            try {
                document.body.removeChild(overlay);
                document.body.removeChild(modal);
            } catch (e) {
                console.error('移除模态框失败:', e);
            }
        };
        
        closeBtn.addEventListener('click', closeModal);
        
        // 点击背景遮罩也可以关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });

        // 组装模态框
        modal.appendChild(closeBtn);
        modal.appendChild(content);
        
        console.log('模态框创建完成');
        
        // 一起返回遮罩和模态框
        return {
            overlay,
            modal
        };
    }
}
