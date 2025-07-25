// ==UserScript==
// @name         VRChat Avatar Database Manager
// @namespace    http://tampermonkey.net/
// @version      0.5.2
// @description  管理VRChat模型数据库
// @author       laomo
// @match        *://vrchat.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

import './styles/index.css';
import db from './services/database';
import { UIComponents } from './components/ui';
import { showToast } from './services/utils';

(function() {
    'use strict';
    
    // 全局UI组件实例
    let ui = null;

    // 等待页面加载完成
    function initializeApp() {
        console.log('Initializing VRChat Avatar Database Manager...');
        
        // 初始化UI组件
        ui = new UIComponents(db);

        // 创建并添加主容器
        const container = ui.createMainContainer();
        
        // 确保容器被添加到body
        if (document.body) {
            document.body.appendChild(container);
            showToast('VRChat模型数据库管理器已加载');
            // 监视模型详情页面
            ui.setupAvatarPageListeners();
            console.log('Initialization complete.');
        } else {
            // 如果body还不存在，等待DOM加载完成
            const observer = new MutationObserver((mutations, obs) => {
                if (document.body) {
                    document.body.appendChild(container);
                    showToast('VRChat模型数据库管理器已加载');
                    // 监视模型详情页面
                    ui.setupAvatarPageListeners();
                    console.log('Initialization complete.');
                    obs.disconnect();
                }
            });
            
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    }

    // 监听页面变化，确保按钮一直存在
    function setupPageChangeListeners() {
        // 页面观察器 - 在DOM变化时检测并更新按钮
        const bodyObserver = new MutationObserver((mutations) => {
            // 仅在左侧导航栏存在且我们的按钮不存在时，重新注入按钮
            const navBar = document.querySelector('.leftbar .btn-group-vertical');
            const ourButton = document.querySelector('.avatar-db-nav-button');
            
            if (navBar && !ourButton && ui) {
                console.log('检测到页面变化，重新注入按钮');
                ui.injectToNavbar();
            }
        });
        
        // 观察整个body的变化
        if (document.body) {
            bodyObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        // 监听history变化
        const _historyWrap = function(type) {
            const orig = history[type];
            const e = new Event(type);
            return function() {
                const rv = orig.apply(this, arguments);
                e.arguments = arguments;
                window.dispatchEvent(e);
                return rv;
            };
        };
        
        history.pushState = _historyWrap('pushState');
        history.replaceState = _historyWrap('replaceState');
        
        window.addEventListener('pushState', function() {
            console.log('检测到页面导航 (pushState)');
            // 给DOM一点时间加载，然后尝试重新注入按钮
            setTimeout(() => {
                if (ui) ui.injectToNavbar();
            }, 500);
        });
        
        window.addEventListener('replaceState', function() {
            console.log('检测到页面导航 (replaceState)');
            setTimeout(() => {
                if (ui) ui.injectToNavbar();
            }, 500);
        });
        
        // 常规导航事件
        window.addEventListener('popstate', function() {
            console.log('检测到页面导航 (popstate)');
            setTimeout(() => {
                if (ui) ui.injectToNavbar();
            }, 500);
        });
    }

    // 如果页面已经加载完成，直接初始化
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeApp();
        setupPageChangeListeners();
    } else {
        // 否则等待页面加载完成
        window.addEventListener('DOMContentLoaded', () => {
            initializeApp();
            setupPageChangeListeners();
        });
    }
})();
