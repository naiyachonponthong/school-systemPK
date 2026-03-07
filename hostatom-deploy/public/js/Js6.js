/**
 * Personnel Management System - JavaScript Part 6
 * Audit Log Management (ประวัติการเปลี่ยนแปลง)
 * ✅ FIXED VERSION - All syntax errors corrected
 */

// ==================== GLOBAL VARIABLES ====================
var auditLogPage = 1;
var auditLogFilters = {
  userId: null,
  action: '',
  collection: '',
  startDate: '',
  endDate: '',
  search: ''
};

// ==================== LOAD AUDIT LOG PAGE ====================
async function loadAuditLog() {
  var content = document.getElementById('pageContent');
  var lang = AppState.language;

  content.innerHTML = '<div class="fade-in">' +
    // Header Section
    '<div class="section-header flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">' +
    '<h2 class="text-2xl font-bold text-primary flex items-center">' +
    '<span class="bg-purple-100 text-purple-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">' +
    '<i class="fi fi-rr-time-past"></i></span>' +
    (lang === 'th' ? 'ประวัติการเปลี่ยนแปลง (Audit Log)' : 'Audit Log') +
    '</h2>' +
    (AppState.user && AppState.user.role === 'admin' ?
      '<button onclick="cleanupOldAuditLogs()" class="btn-secondary">' +
      '<i class="fi fi-rr-trash mr-2"></i>' +
      (lang === 'th' ? 'ลบข้อมูลเก่า (>90วัน)' : 'Cleanup Old Data (>90d)') +
      '</button>' : '') +
    '</div>' +

    // Filters Section
    renderAuditLogFilters() +

    // Stats will be inserted here by renderAuditLogStats()

    // Data Container
    '<div id="auditLogContainer">' +
    '<div class="py-12 flex justify-center"><div class="loading-spinner"></div></div>' +
    '</div>' +

    '</div>';

  loadAuditLogData();
}

// ==================== RENDER FILTERS ====================
function renderAuditLogFilters() {
  var lang = AppState.language;

  return '<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">' +
    '<div class="flex items-center mb-4">' +
    '<div class="w-1.5 h-6 bg-purple-600 rounded-full mr-3"></div>' +
    '<h3 class="font-bold text-gray-800 text-lg">' +
    (lang === 'th' ? 'ตัวกรองข้อมูล' : 'Filters') +
    '</h3>' +
    '</div>' +

    '<div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">' +

    // Action Filter
    '<div class="md:col-span-2">' +
    '<label class="block text-sm font-medium text-gray-700 mb-1">' +
    (lang === 'th' ? 'การกระทำ' : 'Action') +
    '</label>' +
    '<select id="auditActionFilter" class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">' +
    '<option value="">' + (lang === 'th' ? '-- ทั้งหมด --' : '-- All --') + '</option>' +
    '<option value="create">' + (lang === 'th' ? 'สร้าง' : 'Create') + '</option>' +
    '<option value="update">' + (lang === 'th' ? 'แก้ไข' : 'Update') + '</option>' +
    '<option value="delete">' + (lang === 'th' ? 'ลบ' : 'Delete') + '</option>' +
    '<option value="login">' + (lang === 'th' ? 'เข้าสู่ระบบ' : 'Login') + '</option>' +
    '<option value="logout">' + (lang === 'th' ? 'ออกจากระบบ' : 'Logout') + '</option>' +
    '<option value="view">' + (lang === 'th' ? 'ดูข้อมูล' : 'View') + '</option>' +
    '</select>' +
    '</div>' +

    // Collection Filter
    '<div class="md:col-span-2">' +
    '<label class="block text-sm font-medium text-gray-700 mb-1">' +
    (lang === 'th' ? 'หมวดหมู่' : 'Collection') +
    '</label>' +
    '<select id="auditCollectionFilter" class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">' +
    '<option value="">' + (lang === 'th' ? '-- ทั้งหมด --' : '-- All --') + '</option>' +
    '<option value="Users">' + (lang === 'th' ? 'ผู้ใช้' : 'Users') + '</option>' +
    '<option value="PersonalInfo">' + (lang === 'th' ? 'ข้อมูลส่วนตัว' : 'Personal Info') + '</option>' +
    '<option value="Education">' + (lang === 'th' ? 'การศึกษา' : 'Education') + '</option>' +
    '<option value="ScoutQualification">' + (lang === 'th' ? 'คุณวุฒิลูกเสือ' : 'Scout Qual.') + '</option>' +
    '<option value="PositionDuty">' + (lang === 'th' ? 'ตำแหน่ง/หน้าที่' : 'Position/Duty') + '</option>' +
    '<option value="TeachingSummary">' + (lang === 'th' ? 'สรุปการสอน' : 'Teaching Summary') + '</option>' +
    '<option value="ProjectActivity">' + (lang === 'th' ? 'โครงการ/กิจกรรม' : 'Project/Activity') + '</option>' +
    '<option value="StudentActivity">' + (lang === 'th' ? 'กิจกรรมพัฒนาผู้เรียน' : 'Student Activity') + '</option>' +
    '<option value="MediaProduction">' + (lang === 'th' ? 'สื่อ/นวัตกรรม' : 'Media/Innovation') + '</option>' +
    '<option value="MediaUsage">' + (lang === 'th' ? 'การใช้สื่อ' : 'Media Usage') + '</option>' +
    '<option value="FieldTrip">' + (lang === 'th' ? 'ทัศนศึกษา' : 'Field Trip') + '</option>' +
    '<option value="Competition">' + (lang === 'th' ? 'การแข่งขัน' : 'Competition') + '</option>' +
    '</select>' +
    '</div>' +

    // Start Date
    '<div class="md:col-span-2">' +
    '<label class="block text-sm font-medium text-gray-700 mb-1">' +
    (lang === 'th' ? 'วันที่เริ่มต้น' : 'Start Date') +
    '</label>' +
    '<input type="date" id="auditStartDate" class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">' +
    '</div>' +

    // End Date
    '<div class="md:col-span-2">' +
    '<label class="block text-sm font-medium text-gray-700 mb-1">' +
    (lang === 'th' ? 'วันที่สิ้นสุด' : 'End Date') +
    '</label>' +
    '<input type="date" id="auditEndDate" class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">' +
    '</div>' +

    // Search Input
    '<div class="md:col-span-3">' +
    '<label class="block text-sm font-medium text-gray-700 mb-1">' +
    (lang === 'th' ? 'ค้นหา' : 'Search') +
    '</label>' +
    '<input type="text" id="auditSearchInput" class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="' +
    (lang === 'th' ? 'ชื่อผู้ใช้, รายละเอียด...' : 'Username, details...') +
    '" onkeypress="if(event.keyCode==13){filterAuditLog();}">' +
    '</div>' +

    // Search Button
    '<div class="md:col-span-1">' +
    '<button onclick="filterAuditLog()" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">' +
    '<i class="fi fi-rr-search"></i>' +
    '</button>' +
    '</div>' +

    '</div>' +

    // Reset Button
    '<div class="mt-3 flex justify-end">' +
    '<button onclick="resetAuditLogFilters()" class="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1 transition-colors">' +
    '<i class="fi fi-rr-refresh"></i>' +
    '<span>' + (lang === 'th' ? 'รีเซ็ตตัวกรอง' : 'Reset Filters') + '</span>' +
    '</button>' +
    '</div>' +

    '</div>';
}

// ==================== FILTER FUNCTIONS - ✅ FIXED ====================
function filterAuditLog() {
  auditLogPage = 1;

  // ✅ แก้ไข: assign แต่ละ property แยกกัน
  auditLogFilters.action = document.getElementById('auditActionFilter').value;
  auditLogFilters.collection = document.getElementById('auditCollectionFilter').value;
  auditLogFilters.startDate = document.getElementById('auditStartDate').value;
  auditLogFilters.endDate = document.getElementById('auditEndDate').value;
  auditLogFilters.search = document.getElementById('auditSearchInput').value;

  loadAuditLogData();
}

function resetAuditLogFilters() {
  auditLogPage = 1;

  // ✅ แก้ไข: reset แต่ละ property แยกกัน
  auditLogFilters.userId = null;
  auditLogFilters.action = '';
  auditLogFilters.collection = '';
  auditLogFilters.startDate = '';
  auditLogFilters.endDate = '';
  auditLogFilters.search = '';

  // Clear form values
  document.getElementById('auditActionFilter').value = '';
  document.getElementById('auditCollectionFilter').value = '';
  document.getElementById('auditStartDate').value = '';
  document.getElementById('auditEndDate').value = '';
  document.getElementById('auditSearchInput').value = '';

  loadAuditLogData();
}

// ==================== LOAD DATA - ✅ FIXED ====================
async function loadAuditLogData() {
  try {
    var user = AppState.user || {};

    // ✅ แก้ไข: ใช้ Object.assign() อย่างถูกต้อง - merge ทุก object ในคำสั่งเดียว
    var filters = Object.assign({}, auditLogFilters, { page: auditLogPage });

    // Build query string, skipping empty params
    var params = [];
    if (filters.page) params.push('page=' + filters.page);
    if (filters.search) params.push('search=' + encodeURIComponent(filters.search));
    if (filters.userId) params.push('userId=' + filters.userId);
    if (filters.action) params.push('action=' + encodeURIComponent(filters.action));
    if (filters.collection) params.push('collection=' + encodeURIComponent(filters.collection));
    if (filters.startDate) params.push('startDate=' + encodeURIComponent(filters.startDate));
    if (filters.endDate) params.push('endDate=' + encodeURIComponent(filters.endDate));
    var queryString = params.length > 0 ? '?' + params.join('&') : '';

    var result = await api.get('/api/audit' + queryString).catch(function() {
      return { status: 'error', data: [], stats: {} };
    });

    renderAuditLogData(result);
    renderAuditLogStats(result.stats || {});
  } catch (error) {
    console.error('Load audit log error:', error);
  }
}

// ==================== RENDER STATS ====================
function renderAuditLogStats(stats) {
  var lang = AppState.language;

  // Build stats cards HTML
  var statsHtml = '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">';

  // Total
  statsHtml += '<div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">' +
    '<div class="flex items-center justify-between">' +
    '<div>' +
    '<p class="text-gray-500 text-sm font-medium mb-1">' + (lang === 'th' ? 'ทั้งหมด' : 'Total') + '</p>' +
    '<h4 class="text-3xl font-bold text-gray-800">' + (stats.total || 0) + '</h4>' +
    '</div>' +
    '<div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl">' +
    '<i class="fi fi-rr-list"></i>' +
    '</div>' +
    '</div>' +
    '</div>';

  // Today
  statsHtml += '<div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">' +
    '<div class="flex items-center justify-between">' +
    '<div>' +
    '<p class="text-gray-500 text-sm font-medium mb-1">' + (lang === 'th' ? 'วันนี้' : 'Today') + '</p>' +
    '<h4 class="text-3xl font-bold text-gray-800">' + (stats.today || 0) + '</h4>' +
    '</div>' +
    '<div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">' +
    '<i class="fi fi-rr-calendar-day"></i>' +
    '</div>' +
    '</div>' +
    '</div>';

  // This Week
  statsHtml += '<div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">' +
    '<div class="flex items-center justify-between">' +
    '<div>' +
    '<p class="text-gray-500 text-sm font-medium mb-1">' + (lang === 'th' ? 'สัปดาห์นี้' : 'This Week') + '</p>' +
    '<h4 class="text-3xl font-bold text-gray-800">' + (stats.week || 0) + '</h4>' +
    '</div>' +
    '<div class="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-2xl">' +
    '<i class="fi fi-rr-calendar-week"></i>' +
    '</div>' +
    '</div>' +
    '</div>';

  // This Month
  statsHtml += '<div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">' +
    '<div class="flex items-center justify-between">' +
    '<div>' +
    '<p class="text-gray-500 text-sm font-medium mb-1">' + (lang === 'th' ? 'เดือนนี้' : 'This Month') + '</p>' +
    '<h4 class="text-3xl font-bold text-gray-800">' + (stats.month || 0) + '</h4>' +
    '</div>' +
    '<div class="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl">' +
    '<i class="fi fi-rr-calendar"></i>' +
    '</div>' +
    '</div>' +
    '</div>';

  statsHtml += '</div>';

  // Insert stats before container
  var container = document.getElementById('auditLogContainer');
  if (container && container.previousElementSibling) {
    // Check if stats already exist
    var existingStats = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4');
    if (existingStats && existingStats.parentElement) {
      existingStats.parentElement.innerHTML = statsHtml;
    } else {
      container.insertAdjacentHTML('beforebegin', statsHtml);
    }
  }
}

// ==================== RENDER DATA ====================
function renderAuditLogData(result) {
  var container = document.getElementById('auditLogContainer');
  var lang = AppState.language;
  var data = result.data || [];

  if (data.length === 0) {
    container.innerHTML = '<div class="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">' +
      '<div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 text-4xl">' +
      '<i class="fi fi-rr-time-past"></i>' +
      '</div>' +
      '<h3 class="text-lg font-bold text-gray-700 mb-2">' + (lang === 'th' ? 'ไม่มีข้อมูล' : 'No Data') + '</h3>' +
      '<p class="text-gray-500">' + (lang === 'th' ? 'ไม่พบประวัติการเปลี่ยนแปลง' : 'No audit logs found') + '</p>' +
      '</div>';
    return;
  }

  // Render timeline view
  container.innerHTML = renderTimelineView(data, lang);
}

// ==================== TIMELINE VIEW ====================
function renderTimelineView(data, lang) {
  var html = '<div class="space-y-6">';

  // Group by date
  var grouped = {};
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var dateObj = new Date(item.timestamp);
    var date = dateObj.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(item);
  }

  // Render each date group
  for (var dateKey in grouped) {
    if (grouped.hasOwnProperty(dateKey)) {
      var items = grouped[dateKey];

      html += '<div class="bg-white rounded-xl shadow-sm border overflow-hidden">';

      // Date header
      html += '<div class="bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-3">';
      html += '<h3 class="font-bold text-white flex items-center gap-2">';
      html += '<i class="fi fi-rr-calendar-day"></i>';
      html += '<span>' + dateKey + '</span>';
      html += '<span class="ml-auto text-sm bg-white/20 px-3 py-1 rounded-full">' + items.length + ' ' + (lang === 'th' ? 'รายการ' : 'items') + '</span>';
      html += '</h3>';
      html += '</div>';

      // Log items
      html += '<div class="divide-y divide-gray-100">';

      for (var j = 0; j < items.length; j++) {
        var log = items[j];
        html += renderLogItem(log, lang);
      }

      html += '</div>';
      html += '</div>';
    }
  }

  html += '</div>';
  return html;
}

// ==================== RENDER LOG ITEM ====================
function renderLogItem(log, lang) {
  var actionClass = getActionClass(log.action);
  var actionIcon = getActionIcon(log.action);
  var actionLabel = getActionLabel(log.action, lang);

  var timeObj = new Date(log.timestamp);
  var time = timeObj.toLocaleTimeString(lang === 'th' ? 'th-TH' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  var html = '<div class="p-4 hover:bg-gray-50 transition-colors cursor-pointer" onclick="viewAuditLogDetail(\'' + log.id + '\')">';
  html += '<div class="flex items-start gap-4">';

  // Icon
  html += '<div class="flex-shrink-0 w-10 h-10 rounded-lg ' + actionClass + ' flex items-center justify-center shadow-sm">';
  html += '<i class="fi ' + actionIcon + ' text-white"></i>';
  html += '</div>';

  // Content
  html += '<div class="flex-1 min-w-0">';

  // Header line
  html += '<div class="flex items-center gap-2 mb-1 flex-wrap">';
  html += '<span class="font-semibold text-gray-900">' + (log.username || 'System') + '</span>';
  html += '<span class="px-2 py-0.5 rounded-full text-xs font-medium ' +
    actionClass.replace('bg-', 'bg-').replace('-500', '-100').replace('text-white', 'text-' + actionClass.split('-')[1] + '-700') +
    '">' + actionLabel + '</span>';
  html += '<span class="text-gray-400 text-sm"><i class="fi fi-rr-clock mr-1"></i>' + time + '</span>';
  html += '</div>';

  // Description
  html += '<p class="text-gray-600 text-sm mb-2">' + (log.description || '-') + '</p>';

  // Meta info
  if (log.collection || log.record_id || log.ip_address) {
    html += '<div class="flex items-center gap-3 text-xs text-gray-500 flex-wrap">';

    if (log.collection) {
      html += '<span class="flex items-center gap-1">';
      html += '<i class="fi fi-rr-folder"></i>';
      html += '<span>' + log.collection + '</span>';
      html += '</span>';
    }

    if (log.record_id) {
      html += '<span class="text-gray-400">•</span>';
      html += '<span class="font-mono">ID: ' + log.record_id.substring(0, 8) + '...</span>';
    }

    if (log.ip_address) {
      html += '<span class="text-gray-400">•</span>';
      html += '<span class="flex items-center gap-1">';
      html += '<i class="fi fi-rr-globe"></i>';
      html += '<span>' + log.ip_address + '</span>';
      html += '</span>';
    }

    html += '</div>';
  }

  html += '</div>';

  // Arrow indicator
  html += '<div class="flex-shrink-0 text-gray-400">';
  html += '<i class="fi fi-rr-angle-right"></i>';
  html += '</div>';

  html += '</div>';
  html += '</div>';

  return html;
}

// ==================== HELPER FUNCTIONS ====================
function getActionClass(action) {
  switch(action) {
    case 'create': return 'bg-green-500';
    case 'update': return 'bg-blue-500';
    case 'delete': return 'bg-red-500';
    case 'login': return 'bg-purple-500';
    case 'logout': return 'bg-gray-500';
    case 'view': return 'bg-cyan-500';
    default: return 'bg-gray-400';
  }
}

function getActionIcon(action) {
  switch(action) {
    case 'create': return 'fi-rr-plus';
    case 'update': return 'fi-rr-edit';
    case 'delete': return 'fi-rr-trash';
    case 'login': return 'fi-rr-sign-in-alt';
    case 'logout': return 'fi-rr-sign-out-alt';
    case 'view': return 'fi-rr-eye';
    default: return 'fi-rr-info';
  }
}

function getActionLabel(action, lang) {
  var labels = {
    'create': { th: 'สร้าง', en: 'Create' },
    'update': { th: 'แก้ไข', en: 'Update' },
    'delete': { th: 'ลบ', en: 'Delete' },
    'login': { th: 'เข้าสู่ระบบ', en: 'Login' },
    'logout': { th: 'ออกจากระบบ', en: 'Logout' },
    'view': { th: 'ดูข้อมูล', en: 'View' }
  };

  if (labels[action]) {
    return labels[action][lang];
  }
  return action;
}

/**
 * IMPROVED: Audit Log Display
 *
 * ปัญหาเดิม:
 * 1. JSON ยาวและยุ่มยาก - ต้องแสดงเป็น Table หรือ Tree
 * 2. ไม่แสดงความแตกต่าง (diff) - ต้องไฮไลต์ฟิลด์ที่เปลี่ยน
 * 3. บางฟิลด์มีค่า nested JSON - ต้องแสดงอย่างถูกต้อง
 */

// ==================== IMPROVED MODAL ====================
function showAuditLogDetailModalImproved(log) {
  var lang = AppState.language;

  var html = '<div class="space-y-4 max-h-[75vh] overflow-y-auto pr-2">';

  // ======== HEADER ========
  html += '<div class="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">';
  html += '<div class="w-12 h-12 rounded-xl ' + getActionClass(log.action) + ' flex items-center justify-center shadow-lg">';
  html += '<i class="fi ' + getActionIcon(log.action) + ' text-white text-xl"></i>';
  html += '</div>';
  html += '<div class="flex-1">';
  html += '<h4 class="font-bold text-gray-800 text-lg">' + getActionLabel(log.action, lang) + '</h4>';
  html += '<p class="text-sm text-gray-600">' + formatDate(log.timestamp) + '</p>';
  html += '</div>';
  html += '</div>';

  // ======== BASIC INFO GRID ========
  html += '<div class="grid grid-cols-2 gap-4">';

  html += '<div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">';
  html += '<label class="text-xs text-blue-700 font-bold mb-1 block flex items-center gap-1">';
  html += '<i class="fi fi-rr-user"></i>';
  html += (lang === 'th' ? 'ผู้ใช้' : 'User');
  html += '</label>';
  html += '<p class="font-bold text-gray-900 text-base">' + (log.username || log.user_name || '-') + '</p>';
  html += '</div>';

  html += '<div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">';
  html += '<label class="text-xs text-purple-700 font-bold mb-1 block flex items-center gap-1">';
  html += '<i class="fi fi-rr-user-pen"></i>';
  html += (lang === 'th' ? 'บทบาท' : 'Role');
  html += '</label>';
  html += '<p class="font-bold text-gray-900 text-base">' + (log.user_role ? t(log.user_role) : '-') + '</p>';
  html += '</div>';

  html += '<div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">';
  html += '<label class="text-xs text-orange-700 font-bold mb-1 block flex items-center gap-1">';
  html += '<i class="fi fi-rr-folder"></i>';
  html += (lang === 'th' ? 'หมวดหมู่' : 'Collection');
  html += '</label>';
  html += '<p class="font-bold text-gray-900 text-base">' + (log.collection || '-') + '</p>';
  html += '</div>';

  html += '<div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200">';
  html += '<label class="text-xs text-green-700 font-bold mb-1 block flex items-center gap-1">';
  html += '<i class="fi fi-rr-shield-check"></i>';
  html += (lang === 'th' ? 'การกระทำ' : 'Action');
  html += '</label>';
  html += '<p class="font-bold text-gray-900 text-base">' + getActionLabel(log.action, lang) + '</p>';
  html += '</div>';

  html += '</div>';

  // ======== DESCRIPTION ========
  if (log.description) {
    html += '<div class="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">';
    html += '<label class="text-xs text-blue-700 font-bold mb-2 block flex items-center gap-1">';
    html += '<i class="fi fi-rr-document"></i>';
    html += (lang === 'th' ? 'รายละเอียด' : 'Description');
    html += '</label>';
    html += '<p class="text-gray-700 text-sm leading-relaxed">' + log.description + '</p>';
    html += '</div>';
  }

  // ======== DATA CHANGES - IMPROVED ========
  var oldDataContent = log.old_data || log.old_data_json;
  var newDataContent = log.new_data || log.new_data_json;

  if (oldDataContent || newDataContent) {
    html += '<div class="border-t-2 border-gray-200 pt-4">';
    html += '<h5 class="font-bold text-gray-800 mb-4 flex items-center gap-2 text-base">';
    html += '<i class="fi fi-rr-compare text-purple-600"></i>';
    html += '<span>' + (lang === 'th' ? '📊 การเปลี่ยนแปลงข้อมูล' : '📊 Data Changes') + '</span>';
    html += '</h5>';

    html += '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">';

    // ======== OLD DATA ========
    if (oldDataContent) {
      html += '<div class="border-2 border-red-300 rounded-lg overflow-hidden">';
      html += '<div class="bg-red-100 border-b border-red-300 px-4 py-2">';
      html += '<h6 class="font-bold text-red-700 flex items-center gap-2">';
      html += '<i class="fi fi-rr-history text-lg"></i>';
      html += (lang === 'th' ? 'ข้อมูลเดิม' : 'Old Data');
      html += '</h6>';
      html += '</div>';

      html += '<div class="bg-red-50 p-4 max-h-80 overflow-y-auto">';
      html += renderDataComparison(oldDataContent, true);
      html += '</div>';
      html += '</div>';
    }

    // ======== NEW DATA ========
    if (newDataContent) {
      html += '<div class="border-2 border-green-300 rounded-lg overflow-hidden">';
      html += '<div class="bg-green-100 border-b border-green-300 px-4 py-2">';
      html += '<h6 class="font-bold text-green-700 flex items-center gap-2">';
      html += '<i class="fi fi-rr-check-circle text-lg"></i>';
      html += (lang === 'th' ? 'ข้อมูลใหม่' : 'New Data');
      html += '</h6>';
      html += '</div>';

      html += '<div class="bg-green-50 p-4 max-h-80 overflow-y-auto">';
      html += renderDataComparison(newDataContent, false);
      html += '</div>';
      html += '</div>';
    }

    html += '</div>';
    html += '</div>';
  }

  // ======== METADATA ========
  if (log.ip_address || log.record_id) {
    html += '<div class="border-t pt-3 text-xs text-gray-500 space-y-1">';
    if (log.ip_address) {
      html += '<div class="flex items-center gap-2">';
      html += '<i class="fi fi-rr-globe"></i>';
      html += '<span><strong>IP:</strong> ' + log.ip_address + '</span>';
      html += '</div>';
    }
    if (log.record_id) {
      html += '<div class="flex items-center gap-2">';
      html += '<i class="fi fi-rr-fingerprint"></i>';
      html += '<span><strong>' + (AppState.language === 'th' ? 'รหัส:' : 'ID:') + '</strong> ' + log.record_id + '</span>';
      html += '</div>';
    }
    html += '</div>';
  }

  html += '</div>';

  // ======== FOOTER ========
  html += '<div class="sticky bottom-0 bg-white pt-4 border-t mt-6 flex justify-between items-center gap-3">';

  // Copy button
  html += '<button onclick="copyAuditLogToClipboard(\'' +
    (log.old_data || '').replace(/'/g, "&#39;") + '\', \'' +
    (log.new_data || '').replace(/'/g, "&#39;") +
    '\')" class="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1 transition-colors">';
  html += '<i class="fi fi-rr-copy"></i>';
  html += '<span>' + (AppState.language === 'th' ? 'คัดลอก' : 'Copy') + '</span>';
  html += '</button>';

  html += '<button onclick="closeDataModal()" class="btn-outline px-6 h-11">';
  html += '<i class="fi fi-rr-cross mr-2"></i>' + (AppState.language === 'th' ? 'ปิด' : 'Close');
  html += '</button>';
  html += '</div>';

  openDataModal(
    (AppState.language === 'th' ? '📋 รายละเอียด Audit Log' : '📋 Audit Log Detail'),
    html
  );
}

// ==================== RENDER DATA COMPARISON ====================
/**
 * แสดงข้อมูล JSON เป็น Table แทนข้อความ JSON
 * - จัดเรียง field ตามความสำคัญ
 * - ไฮไลต์ field ที่สำคัญ
 * - ซ่อน field ที่ไม่สำคัญ
 */
function renderDataComparison(jsonData, isOldData) {
  try {
    var obj = {};

    // ลอง parse JSON
    if (typeof jsonData === 'string') {
      try {
        obj = JSON.parse(jsonData);
      } catch (e) {
        // ถ้าไม่ใช่ JSON ให้แสดงเป็น text
        return '<div class="text-gray-700 text-sm font-mono whitespace-pre-wrap break-words">' +
          jsonData.substring(0, 500) +
          '</div>';
      }
    } else {
      obj = jsonData;
    }

    // ฟิลด์ที่สำคัญที่สุด (แสดงเสมอ)
    var importantFields = [
      'name', 'full_name', 'email', 'phone', 'position',
      'academic_year', 'institution', 'degree', 'major',
      'status', 'active', 'role', 'title', 'description'
    ];

    // ฟิลด์ที่ไม่ต้องแสดง
    var skipFields = ['id', 'user_id', 'created_at', 'updated_at', 'password',
                      'last_login', 'profile_image', 'photo_url', 'details'];

    var html = '<div class="space-y-2">';
    var hasImportant = false;
    var hasOther = false;

    // === แสดงฟิลด์สำคัญก่อน ===
    for (var i = 0; i < importantFields.length; i++) {
      var field = importantFields[i];
      if (obj.hasOwnProperty(field) && obj[field] !== null && obj[field] !== undefined && obj[field] !== '') {
        var value = formatFieldValue(obj[field]);
        html += renderDataRow(field, value, true);
        hasImportant = true;
      }
    }

    // === Separator ===
    if (hasImportant) {
      html += '<div class="border-t border-gray-300 my-2"></div>';
    }

    // === แสดงฟิลด์อื่น ๆ ===
    for (var key in obj) {
      if (obj.hasOwnProperty(key) &&
          importantFields.indexOf(key) === -1 &&
          skipFields.indexOf(key) === -1 &&
          obj[key] !== null &&
          obj[key] !== undefined &&
          obj[key] !== '') {

        var value = formatFieldValue(obj[key]);
        html += renderDataRow(key, value, false);
        hasOther = true;
      }
    }

    // ถ้าว่างเปล่า
    if (!hasImportant && !hasOther) {
      html += '<div class="text-gray-500 text-sm italic">';
      html += AppState.language === 'th' ? '(ไม่มีข้อมูล)' : '(No data)';
      html += '</div>';
    }

    html += '</div>';
    return html;
  } catch (error) {
    return '<div class="text-red-600 text-sm">Error: ' + error.message + '</div>';
  }
}

// ==================== RENDER DATA ROW ====================
function renderDataRow(fieldName, value, isImportant) {
  var displayName = formatFieldName(fieldName);

  // Truncate long values
  var displayValue = value;
  if (value && value.length > 100) {
    displayValue = value.substring(0, 100) + '...';
  }

  // Color based on importance
  var bgClass = isImportant ? 'bg-white border-l-2 border-yellow-400' : 'bg-white/50';
  var labelClass = isImportant ? 'font-semibold text-gray-800' : 'font-medium text-gray-700';

  var html = '<div class="' + bgClass + ' rounded px-2 py-1.5 text-xs">';
  html += '<div class="' + labelClass + ' text-gray-600 mb-0.5">' + displayName + ':</div>';
  html += '<div class="text-gray-800 font-mono text-xs bg-white/50 rounded px-1.5 py-0.5 break-all">' +
    escapeHtml(displayValue) +
    '</div>';
  html += '</div>';

  return html;
}

// ==================== FORMAT FIELD NAME ====================
function formatFieldName(fieldName) {
  var labels = {
    // Thai labels
    'name': 'ชื่อ', 'full_name': 'ชื่อ - นามสกุล', 'name_en': 'ชื่อ (EN)',
    'email': 'อีเมล', 'phone': 'เบอร์โทร', 'position': 'ตำแหน่ง',
    'role': 'บทบาท', 'status': 'สถานะ', 'active': 'ใช้งาน',
    'academic_year': 'ปีการศึกษา', 'institution': 'สถาบัน',
    'degree': 'ระดับการศึกษา', 'major': 'สาขา',
    'id_card': 'เลขบัตร', 'date_of_birth': 'วันเกิด',
    'address': 'ที่อยู่', 'province': 'จังหวัด', 'district': 'อำเภอ',
    'title': 'หัวข้อ', 'description': 'รายละเอียด',
    'teaching_class': 'ชั้นที่สอน', 'teaching_hours': 'ชั่วโมงสอน',
    'subject': 'วิชา', 'grade': 'เกรด', 'year': 'ปี'
  };

  if (labels[fieldName]) {
    return labels[fieldName];
  }

  // แปลงจาก snake_case เป็น readable
  return fieldName
    .replace(/_/g, ' ')
    .replace(/^./, function(str) { return str.toUpperCase(); });
}

// ==================== FORMAT FIELD VALUE ====================
function formatFieldValue(value) {
  if (value === null || value === undefined) {
    return '-';
  }

  if (typeof value === 'boolean') {
    return value ? 'ใช่' : 'ไม่';
  }

  if (typeof value === 'object') {
    // ถ้าเป็น nested object ให้แสดง JSON (ข้อมูลจะถูกประมวลผล)
    try {
      return JSON.stringify(value);
    } catch (e) {
      return String(value);
    }
  }

  if (typeof value === 'string') {
    // ตรวจสอบว่าเป็น date หรือไม่
    if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
      try {
        var date = new Date(value);
        return formatDate(date);
      } catch (e) {}
    }
  }

  return String(value);
}

// ==================== ESCAPE HTML ====================
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==================== COPY TO CLIPBOARD ====================
function copyAuditLogToClipboard(oldData, newData) {
  var lang = AppState.language;

  try {
    var text = 'AUDIT LOG DATA\n';
    text += '================\n\n';

    if (oldData) {
      text += 'OLD DATA:\n';
      text += oldData + '\n\n';
    }

    if (newData) {
      text += 'NEW DATA:\n';
      text += newData + '\n';
    }

    // ใช้ API ของ Google Apps Script
    var textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    showToast('success',
      lang === 'th' ? 'คัดลอกสำเร็จ' : 'Copied successfully',
      'top-end',
      2000
    );
  } catch (error) {
    console.error('Copy error:', error);
    showAlert('error', 'Error', error.message);
  }
}

// ==================== UPDATE FUNCTION CALL ====================
/**
 * เปลี่ยนจาก showAuditLogDetailModal เป็น showAuditLogDetailModalImproved
 * ในฟังก์ชัน viewAuditLogDetail()
 */

async function viewAuditLogDetail(logId) {
  showLoading();

  try {
    var result = await api.get('/api/audit/' + logId).catch(function() {
      return { status: 'error' };
    });

    hideLoading();

    if (result.status === 'success' && result.data) {
      showAuditLogDetailModalImproved(result.data);  // ✅ เปลี่ยนฟังก์ชัน
    } else {
      showAlert('error', t('error'),
        AppState.language === 'th' ? 'ไม่พบข้อมูล' : 'Data not found');
    }
  } catch (error) {
    hideLoading();
    console.error('View audit log error:', error);
    showAlert('error', t('error'), error.message);
  }
}

// ==================== FORMAT DATE HELPER ====================
function formatDate(dateStr) {
  if (!dateStr) return '-';

  try {
    var date = new Date(dateStr);
    var lang = AppState.language || 'en';

    var options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };

    return date.toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', options);
  } catch (e) {
    return String(dateStr);
  }
}

// ==================== STYLE ADDITIONS ====================


function showAuditLogDetailModal(log) {
  var lang = AppState.language;

  var html = '<div class="space-y-4 max-h-[70vh] overflow-y-auto pr-2">';

  // Header
  html += '<div class="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">';
  html += '<div class="w-12 h-12 rounded-xl ' + getActionClass(log.action) + ' flex items-center justify-center shadow-lg">';
  html += '<i class="fi ' + getActionIcon(log.action) + ' text-white text-xl"></i>';
  html += '</div>';
  html += '<div class="flex-1">';
  html += '<h4 class="font-bold text-gray-800 text-lg">' + getActionLabel(log.action, lang) + '</h4>';
  html += '<p class="text-sm text-gray-600">' + formatDate(log.timestamp) + '</p>';
  html += '</div>';
  html += '</div>';

  // Basic Info
  html += '<div class="grid grid-cols-2 gap-4">';

  html += '<div class="bg-gray-50 rounded-lg p-3">';
  html += '<label class="text-xs text-gray-500 mb-1 block flex items-center gap-1">';
  html += '<i class="fi fi-rr-user"></i>';
  html += (lang === 'th' ? 'ผู้ใช้' : 'User');
  html += '</label>';
  html += '<p class="font-medium text-gray-900">' + (log.username || '-') + '</p>';
  html += '</div>';

  html += '<div class="bg-gray-50 rounded-lg p-3">';
  html += '<label class="text-xs text-gray-500 mb-1 block flex items-center gap-1">';
  html += '<i class="fi fi-rr-user-pen"></i>';
  html += (lang === 'th' ? 'บทบาท' : 'Role');
  html += '</label>';
  html += '<p class="font-medium text-gray-900">' + (log.user_role ? t(log.user_role) : '-') + '</p>';
  html += '</div>';

  html += '<div class="bg-gray-50 rounded-lg p-3">';
  html += '<label class="text-xs text-gray-500 mb-1 block flex items-center gap-1">';
  html += '<i class="fi fi-rr-folder"></i>';
  html += (lang === 'th' ? 'หมวดหมู่' : 'Collection');
  html += '</label>';
  html += '<p class="font-medium text-gray-900">' + (log.collection || '-') + '</p>';
  html += '</div>';

  html += '<div class="bg-gray-50 rounded-lg p-3">';
  html += '<label class="text-xs text-gray-500 mb-1 block flex items-center gap-1">';
  html += '<i class="fi fi-rr-fingerprint"></i>';
  html += (lang === 'th' ? 'รหัสบันทึก' : 'Record ID');
  html += '</label>';
  html += '<p class="font-medium font-mono text-sm text-gray-900 truncate" title="' + (log.record_id || '-') + '">' + (log.record_id || '-') + '</p>';
  html += '</div>';

  html += '<div class="bg-gray-50 rounded-lg p-3 col-span-2">';
  html += '<label class="text-xs text-gray-500 mb-1 block flex items-center gap-1">';
  html += '<i class="fi fi-rr-globe"></i>';
  html += 'IP Address';
  html += '</label>';
  html += '<p class="font-medium font-mono text-sm text-gray-900">' + (log.ip_address || '-') + '</p>';
  html += '</div>';

  html += '</div>';

  // Description
  if (log.description) {
    html += '<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">';
    html += '<label class="text-xs text-blue-700 font-semibold mb-2 block flex items-center gap-1">';
    html += '<i class="fi fi-rr-document"></i>';
    html += (lang === 'th' ? 'รายละเอียด' : 'Description');
    html += '</label>';
    html += '<p class="text-gray-700 text-sm">' + log.description + '</p>';
    html += '</div>';
  }

  // Old/New Data Comparison
  if (log.old_data || log.new_data) {
    html += '<div class="border-t pt-4">';
    html += '<h5 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">';
    html += '<i class="fi fi-rr-compare"></i>';
    html += (lang === 'th' ? 'การเปลี่ยนแปลงข้อมูล' : 'Data Changes');
    html += '</h5>';

    html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';

    // Old Data
    if (log.old_data) {
      html += '<div>';
      html += '<label class="text-xs text-red-600 font-semibold mb-2 block flex items-center gap-1">';
      html += '<i class="fi fi-rr-time-past"></i>';
      html += (lang === 'th' ? 'ข้อมูลเดิม' : 'Old Data');
      html += '</label>';
      html += '<div class="bg-red-50 border border-red-200 rounded-lg p-3 max-h-64 overflow-auto">';

      try {
        var oldDataObj = JSON.parse(log.old_data);
        html += '<pre class="text-xs font-mono whitespace-pre-wrap break-words text-gray-700">' +
          JSON.stringify(oldDataObj, null, 2) +
          '</pre>';
      } catch (e) {
        html += '<p class="text-xs text-gray-600">' + log.old_data + '</p>';
      }

      html += '</div>';
      html += '</div>';
    }

    // New Data
    if (log.new_data) {
      html += '<div>';
      html += '<label class="text-xs text-green-600 font-semibold mb-2 block flex items-center gap-1">';
      html += '<i class="fi fi-rr-check-circle"></i>';
      html += (lang === 'th' ? 'ข้อมูลใหม่' : 'New Data');
      html += '</label>';
      html += '<div class="bg-green-50 border border-green-200 rounded-lg p-3 max-h-64 overflow-auto">';

      try {
        var newDataObj = JSON.parse(log.new_data);
        html += '<pre class="text-xs font-mono whitespace-pre-wrap break-words text-gray-700">' +
          JSON.stringify(newDataObj, null, 2) +
          '</pre>';
      } catch (e) {
        html += '<p class="text-xs text-gray-600">' + log.new_data + '</p>';
      }

      html += '</div>';
      html += '</div>';
    }

    html += '</div>';
    html += '</div>';
  }

  html += '</div>';

  // Footer buttons
  html += '<div class="sticky bottom-0 bg-white pt-4 border-t mt-4 flex justify-end gap-3">';
  html += '<button onclick="closeDataModal()" class="btn-outline px-6 h-11">';
  html += '<i class="fi fi-rr-cross mr-2"></i>' + (lang === 'th' ? 'ปิด' : 'Close');
  html += '</button>';
  html += '</div>';

  openDataModal(
    (lang === 'th' ? 'รายละเอียด Audit Log' : 'Audit Log Detail'),
    html
  );
}

// ==================== CLEANUP OLD LOGS ====================
async function cleanupOldAuditLogs() {
  var lang = AppState.language;

  var confirm = await showConfirm(
    lang === 'th' ? 'ยืนยันการลบข้อมูล' : 'Confirm Deletion',
    lang === 'th' ?
      'คุณต้องการลบข้อมูล Audit Log ที่เก่ากว่า 90 วันหรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้' :
      'Delete audit logs older than 90 days? This action cannot be undone.'
  );

  if (confirm.isConfirmed) {
    showLoading();

    try {
      var result = await api.delete('/api/audit/cleanup').catch(function(err) {
        return { status: 'error', message: err.message };
      });

      hideLoading();

      if (result.status === 'success') {
        showAlert('success', t('success'), result.message);
        loadAuditLogData(); // Reload data
      } else {
        showAlert('error', t('error'), result.message);
      }
    } catch (error) {
      hideLoading();
      showAlert('error', t('error'), error.message);
    }
  }
}

// ==================== TOAST HELPER ====================
function showToast(type, message, position, timer) {
  position = position || 'top-end';
  timer = timer || 3000;

  Swal.fire({
    icon: type,
    title: message,
    toast: true,
    position: position,
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: true,
    didOpen: function(toast) {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
}
