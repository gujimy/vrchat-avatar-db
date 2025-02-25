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
            navButton.setAttribute('title', t('openDatabase'));
        }

        // 更新数据库页面
        const dbPage = document.querySelector('.avatar-db-page');
        if (dbPage) {
            // 更新头部按钮文本
            const importBtn = dbPage.querySelector('.import-btn');
            if (importBtn) importBtn.textContent = t('importModel');

            const exportBtn = dbPage.querySelector('.export-btn');
            if (exportBtn) exportBtn.textContent = t('exportModel');

            const batchDeleteBtn = dbPage.querySelector('.batch-delete-btn');
            if (batchDeleteBtn) {
                if (batchDeleteBtn.textContent.includes('(')) {
                    const count = batchDeleteBtn.textContent.match(/\((\d+)\)/)[1];
                    batchDeleteBtn.textContent = `${t('confirmDelete')} (${count})`;
                } else {
                    batchDeleteBtn.textContent = t('batchDelete');
                }
            }

            const refreshBtn = dbPage.querySelector('.refresh-text');
            if (refreshBtn) refreshBtn.textContent = t('refreshList');

            const avatarCount = dbPage.querySelector('.avatar-count');
            if (avatarCount) {
                const count = avatarCount.textContent.match(/\d+/)[0];
                avatarCount.textContent = `${t('modelCount')}: ${count}`;
            }

            // 更新搜索框占位符
            const searchBox = dbPage.querySelector('.search-box');
            if (searchBox) searchBox.placeholder = t('search');

            // 更新排序选项
            const sortSelect = dbPage.querySelector('.sort-select');
            if (sortSelect) {
                const currentValue = sortSelect.value;
                sortSelect.innerHTML = `
                    <option value="latest">${t('latest')}</option>
                    <option value="oldest">${t('oldest')}</option>
                    <option value="quest">${t('questPriority')}</option>
                `;
                sortSelect.value = currentValue;
            }

            // 更新所有模型卡片的文本
            const cards = dbPage.querySelectorAll('.avatar-card');
            cards.forEach(card => {
                const authorText = card.querySelector('p');
                if (authorText) {
                    const authorName = authorText.textContent.split(': ')[1];
                    authorText.textContent = `${t('author')}: ${authorName}`;
                }

                const switchBtn = card.querySelector('.switch-button');
                if (switchBtn) {
                    if (!switchBtn.classList.contains('switch-loading') && 
                        !switchBtn.classList.contains('success') && 
                        !switchBtn.classList.contains('error')) {
                        switchBtn.textContent = t('switchModel');
                    }
                }

                const copyBtn = card.querySelector('.copy-id-btn');
                if (copyBtn && !copyBtn.classList.contains('success')) {
                    copyBtn.textContent = t('copyId');
                }
            });
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
                <button class="copy-id-btn" data-id="${avatar.id}">${t('copyId')}</button>
            </div>
            <h4 style="margin: 10px 0; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #1565C0;">${avatar.name}</h4>
            <p style="color: #64B5F6; font-size: 12px; margin: 5px 0;">${t('author')}: ${avatar.authorName}</p>
            <button class='switch-button avatar-db-button' style="width: 100%; margin-top: 10px;">${t('switchModel')}</button>
        `;

        // 添加平台图标
        const platformIcon = createPlatformIcon(avatar);
        card.querySelector('div').appendChild(platformIcon);

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
} 