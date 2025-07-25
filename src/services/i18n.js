// 语言配置
const languages = {
    zh: '中文',
    ja: '日本語',
    en: 'English'
};

// 翻译文本
const translations = {
    zh: {
        openDatabase: '模型数据库',
        importModel: '导入模型',
        exportModel: '导出模型',
        batchDelete: '批量删除',
        batchCheck: '批量检查',
        confirmCheck: '确认检查',
        selectAll: '全选',
        deselectAll: '取消全选',
        checkingModels: '正在检查模型...',
        checkComplete: '检查完成',
        updatedModels: '已更新',
        deletedModels: '已删除',
        errorModels: '检查失败',
        exportDeletedIds: '导出已删除ID',
        updated: '已更新',
        deleted: '已删除',
        failed: '失败',
        noModelSelected: '请选择要检查的模型',
        refreshList: '刷新列表',
        modelCount: '模型数量',
        search: '搜索模型...',
        latest: '最新',
        oldest: '最旧',
        questPriority: 'Quest优先',
        copyId: '复制ID',
        copySuccess: '复制成功！',
        switchModel: '切换模型',
        switching: '切换中...',
        switchSuccess: '切换成功！',
        switchFailed: '切换失败',
        switchAvatarError: '切换模型失败: {0} - {1}',
        saveToDatabase: '保存到模型数据库',
        saving: '保存中...',
        alreadySaved: '模型已存在',
        savedSuccess: '保存成功',
        avatarSaved: '模型已保存到数据库',
        saveFailed: '保存失败',
        author: '作者',
        confirmDelete: '确认删除',
        cancel: '取消',
        confirmDeleteMsg: '确定要删除选中的 {0} 个模型吗？',
        deleteSuccess: '成功删除 {0} 个模型',
        importFormats: '支持的导入格式说明：',
        modelLink: 'VRChat模型链接：',
        modelId: '模型ID格式：',
        csvFormat: 'CSV格式（支持带引号）：',
        batchImport: '批量导入说明：',
        refreshSuccess: '刷新成功',
        refreshFailed: '刷新失败',
        noValidIds: '未找到有效的模型ID，请检查输入内容。',
        importing: '正在导入模型数据 ({0}/{1}) {2}%',
        importSuccess: '✓ 成功导入: {0} 个模型',
        importSkipped: '⚠️ 跳过重复: {0} 个模型',
        importFailed: '✗ 导入失败: {0} 个模型',
        csvExport: 'CSV格式',
        txtExport: 'TXT格式',
        close: '关闭',
        databaseAlreadyOpen: '模型数据库已经打开',
        databaseOpened: '模型数据库已打开',
        successfulIds: '成功导入的模型ID',
        duplicateIds: '重复的模型ID',
        failureDetails: '失败详情',
        unknownError: '未知错误',
        checkModel: '检查',
        checking: '检查中...',
        checkSuccess: '已更新',
        checkDeleted: '已删除',
        checkError: '检查失败',
        avatarUpdated: '模型 "{0}" 已更新',
        avatarDeleted: '模型 "{0}" (ID: {1}) 已删除',
        checkFailed: '检查模型 "{0}" 失败: {1}',
        batchImportNotes: [
            '支持多行输入，每行一个模型数据',
            '自动忽略空行和无效数据',
            '自动跳过重复的模型ID'
        ],
        importPlaceholder: '请粘贴模型数据...',
        confirmImport: '确认导入',
        parseResponseError: '解析响应失败: {0}',
        fetchAvatarError: '获取模型数据失败: {0} - {1}',
        networkError: '网络请求失败: {0}',
        importFormatTitle: '支持的导入格式说明：',
        importFormatLink: 'VRChat模型链接：',
        importFormatId: '模型ID格式：',
        importFormatCsv: 'CSV格式（支持带引号）：',
        importFormatBatch: '批量导入说明：',
        importFormatBatchNotes: [
            '支持多行输入，每行一个模型数据',
            '自动忽略空行和无效数据',
            '自动跳过重复的模型ID'
        ],
        modelName: '模型名称',
        authorName: '作者名称'
    },
    ja: {
        openDatabase: 'アバターDB',
        importModel: 'インポート',
        exportModel: 'エクスポート',
        batchDelete: '一括削除',
        batchCheck: '一括チェック',
        confirmCheck: 'チェック実行',
        selectAll: 'すべて選択',
        deselectAll: '選択解除',
        checkingModels: 'アバターをチェック中...',
        checkComplete: 'チェック完了',
        updatedModels: '更新済み',
        deletedModels: '削除済み',
        errorModels: '失敗',
        exportDeletedIds: '削除済みIDをエクスポート',
        updated: '更新済み',
        deleted: '削除済み',
        failed: '失敗',
        noModelSelected: 'チェックするアバターを選択してください',
        refreshList: 'リスト更新',
        modelCount: 'アバター数',
        search: 'アバターを検索...',
        latest: '最新順',
        oldest: '古い順',
        questPriority: 'Quest優先',
        copyId: 'IDコピー',
        copySuccess: 'コピー完了!',
        switchModel: 'アバター切替',
        switching: '切替中...',
        switchSuccess: '切替完了!',
        switchFailed: '切替失敗',
        switchAvatarError: 'アバター切替失敗: {0} - {1}',
        saveToDatabase: 'DBに保存',
        saving: '保存中...',
        alreadySaved: '既に保存済み',
        savedSuccess: '保存完了',
        avatarSaved: 'アバターをDBに保存しました',
        saveFailed: '保存失敗',
        author: '作者',
        confirmDelete: '削除確認',
        cancel: 'キャンセル',
        confirmDeleteMsg: '選択した {0} 個のアバターを削除しますか？',
        deleteSuccess: '{0} 個のアバターを削除しました',
        importFormats: 'インポート形式の説明：',
        modelLink: 'VRChatアバターリンク：',
        modelId: 'アバターID形式：',
        csvFormat: 'CSV形式（引用符対応）：',
        batchImport: '一括インポートの説明：',
        refreshSuccess: '更新完了',
        refreshFailed: '更新失敗',
        noValidIds: '有効なアバターIDが見つかりません。入力内容を確認してください。',
        importing: 'インポート中 ({0}/{1}) {2}%',
        importSuccess: '✓ インポート成功: {0} 個',
        importSkipped: '⚠️ 重複スキップ: {0} 個',
        importFailed: '✗ インポート失敗: {0} 個',
        csvExport: 'CSV形式',
        txtExport: 'TXT形式',
        close: '閉じる',
        databaseAlreadyOpen: 'データベースは既に開いています',
        databaseOpened: 'データベースを開きました',
        successfulIds: 'インポート成功したアバターID',
        duplicateIds: '重複したアバターID',
        failureDetails: '失敗の詳細',
        unknownError: '不明なエラー',
        checkModel: 'チェック',
        checking: 'チェック中...',
        checkSuccess: '更新済み',
        checkDeleted: '削除済み',
        checkError: 'チェック失敗',
        avatarUpdated: 'アバター"{0}"を更新しました',
        avatarDeleted: 'アバター"{0}"(ID: {1})を削除しました',
        checkFailed: 'アバター"{0}"のチェックに失敗: {1}',
        batchImportNotes: [
            '複数行の入力に対応、1行につき1つのアバターデータ',
            '空行と無効なデータは自動的に無視されます',
            '重複したアバターIDは自動的にスキップされます'
        ],
        importPlaceholder: 'アバターデータを貼り付けてください...',
        confirmImport: 'インポート確認',
        parseResponseError: 'レスポンスの解析に失敗: {0}',
        fetchAvatarError: 'アバターデータの取得に失敗: {0} - {1}',
        networkError: 'ネットワークリクエストに失敗: {0}',
        importFormatTitle: 'インポート形式の説明：',
        importFormatLink: 'VRChatアバターリンク：',
        importFormatId: 'アバーターID形式：',
        importFormatCsv: 'CSV形式（引用符対応）：',
        importFormatBatch: '一括インポートの説明：',
        importFormatBatchNotes: [
            '複数行の入力に対応、1行につき1つのアバターデータ',
            '空行と無効なデータは自動的に無視されます',
            '重複したアバターIDは自動的にスキップされます'
        ],
        modelName: 'アバター名',
        authorName: '作者名'
    },
    en: {
        openDatabase: 'Avatar DB',
        importModel: 'Import',
        exportModel: 'Export',
        batchDelete: 'Batch Delete',
        batchCheck: 'Batch Check',
        confirmCheck: 'Confirm Check',
        selectAll: 'Select All',
        deselectAll: 'Deselect All',
        checkingModels: 'Checking Models...',
        checkComplete: 'Check Complete',
        updatedModels: 'Updated',
        deletedModels: 'Deleted',
        errorModels: 'Failed',
        exportDeletedIds: 'Export Deleted IDs',
        updated: 'updated',
        deleted: 'deleted',
        failed: 'failed',
        noModelSelected: 'Please select models to check',
        refreshList: 'Refresh',
        modelCount: 'Avatar Count',
        search: 'Search avatars...',
        latest: 'Latest',
        oldest: 'Oldest',
        questPriority: 'Quest Priority',
        copyId: 'Copy ID',
        copySuccess: 'Copied!',
        switchModel: 'Switch Avatar',
        switching: 'Switching...',
        switchSuccess: 'Switched!',
        switchFailed: 'Failed',
        switchAvatarError: 'Failed to switch avatar: {0} - {1}',
        saveToDatabase: 'Save to DB',
        saving: 'Saving...',
        alreadySaved: 'Already saved',
        savedSuccess: 'Saved',
        avatarSaved: 'Avatar saved to database',
        saveFailed: 'Save failed',
        author: 'Author',
        confirmDelete: 'Confirm Delete',
        cancel: 'Cancel',
        confirmDeleteMsg: 'Are you sure to delete {0} selected avatars?',
        deleteSuccess: 'Successfully deleted {0} avatars',
        importFormats: 'Supported Import Formats:',
        modelLink: 'VRChat Avatar Link:',
        modelId: 'Avatar ID Format:',
        csvFormat: 'CSV Format (with quotes support):',
        batchImport: 'Batch Import Instructions:',
        refreshSuccess: 'Refresh Success',
        refreshFailed: 'Refresh Failed',
        noValidIds: 'No valid avatar IDs found. Please check your input.',
        importing: 'Importing ({0}/{1}) {2}%',
        importSuccess: '✓ Successfully imported: {0} avatars',
        importSkipped: '⚠️ Skipped duplicates: {0} avatars',
        importFailed: '✗ Import failed: {0} avatars',
        csvExport: 'CSV Format',
        txtExport: 'TXT Format',
        close: 'Close',
        databaseAlreadyOpen: 'Avatar database is already open',
        databaseOpened: 'Avatar database opened',
        successfulIds: 'Successfully imported avatar IDs',
        duplicateIds: 'Duplicate avatar IDs',
        failureDetails: 'Failure details',
        unknownError: 'Unknown error',
        checkModel: 'Check',
        checking: 'Checking...',
        checkSuccess: 'Updated',
        checkDeleted: 'Deleted',
        checkError: 'Check Failed',
        avatarUpdated: 'Avatar "{0}" has been updated',
        avatarDeleted: 'Avatar "{0}" (ID: {1}) has been deleted',
        checkFailed: 'Failed to check avatar "{0}": {1}',
        batchImportNotes: [
            'Supports multiple lines, one avatar data per line',
            'Automatically ignores empty lines and invalid data',
            'Automatically skips duplicate avatar IDs'
        ],
        importPlaceholder: 'Paste avatar data here...',
        confirmImport: 'Confirm Import',
        parseResponseError: 'Failed to parse response: {0}',
        fetchAvatarError: 'Failed to fetch avatar data: {0} - {1}',
        networkError: 'Network request failed: {0}',
        importFormatTitle: 'Supported Import Formats:',
        importFormatLink: 'VRChat Avatar Link:',
        importFormatId: 'Avatar ID Format:',
        importFormatCsv: 'CSV Format (with quotes support):',
        importFormatBatch: 'Batch Import Instructions:',
        importFormatBatchNotes: [
            'Supports multiple lines, one avatar data per line',
            'Automatically ignores empty lines and invalid data',
            'Automatically skips duplicate avatar IDs'
        ],
        modelName: 'Avatar Name',
        authorName: 'Author Name'
    }
};

// 当前语言
let currentLang = detectSystemLanguage();

// 检测系统语言
function detectSystemLanguage() {
    const systemLang = navigator.language.toLowerCase();
    if (systemLang.startsWith('zh')) {
        return 'zh';
    } else if (systemLang.startsWith('ja')) {
        return 'ja';
    } else {
        return 'en';
    }
}

// 格式化字符串
function format(str, ...args) {
    return str.replace(/{(\d+)}/g, (match, number) => {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
}

// 获取翻译文本
export function t(key, ...args) {
    const text = translations[currentLang][key] || translations['en'][key] || key;
    return args.length > 0 ? format(text, ...args) : text;
}

// 切换语言
export function setLanguage(lang) {
    if (languages[lang]) {
        currentLang = lang;
        // 触发自定义事件，通知语言变更
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }
}

// 获取当前语言
export function getCurrentLanguage() {
    return currentLang;
}

// 获取所有支持的语言
export function getSupportedLanguages() {
    return languages;
}
