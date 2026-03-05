/**
 * Personnel Management System - JavaScript Part 2
 * Converted for Node.js + Express backend - ALL FUNCTIONS INCLUDED
 */

// ==================== HELPER FUNCTIONS ====================
function renderFilterBar(prefix, searchFunc) {
  var lang = AppState.language;
  var years = (AppState.config && AppState.config.academic_years) ? AppState.config.academic_years : [];
  var currentYear = (AppState.config && AppState.config.current_academic_year) ? AppState.config.current_academic_year : '';

  // สร้าง options โดยปีปัจจุบันเป็นค่าเริ่มต้น
  var yearOptions = '<option value="">' + (lang === 'th' ? '-- ทั้งหมด --' : '-- All Years --') + '</option>';
  for (var i = 0; i < years.length; i++) {
    yearOptions += '<option value="' + years[i] + '"' + (years[i] === currentYear ? ' selected' : '') + '>' + years[i] + '</option>';
  }

  return '<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6 fade-in">' +
    '<div class="flex items-center mb-4"><div class="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></div>' +
    '<h3 class="font-bold text-gray-800 text-lg">' + (lang === 'th' ? 'ตัวกรองข้อมูล' : 'Data Filter') + '</h3></div>' +
    '<div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">' +
    '<div class="md:col-span-3"><label class="block text-sm font-medium text-gray-700 mb-1">' + (lang === 'th' ? 'ปีการศึกษา' : 'Academic Year') + '</label>' +
    '<select id="' + prefix + 'FilterYear" class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg">' + yearOptions + '</select></div>' +
    '<div class="md:col-span-7"><label class="block text-sm font-medium text-gray-700 mb-1">' + (lang === 'th' ? 'คำค้นหา' : 'Search') + '</label>' +
    '<input type="text" id="' + prefix + 'SearchInput" class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg" placeholder="' + (lang === 'th' ? 'ระบุคำค้นหา...' : 'Enter keyword...') + '" onkeypress="if(event.keyCode==13){filterWithLoading(\'' + searchFunc + '\');}"></div>' +
    '<div class="md:col-span-2"><button id="' + prefix + 'SearchBtn" onclick="filterWithLoading(\'' + searchFunc + '\')" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2"><i class="fi fi-rr-search"></i><span>' + (lang === 'th' ? 'ค้นหา' : 'Search') + '</span></button></div></div></div>';
}

function filterWithLoading(funcName) {
  var lang = AppState.language;
  // หา button ทั้งหมดที่มี SearchBtn
  var buttons = document.querySelectorAll('[id$="SearchBtn"]');
  buttons.forEach(function(btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fi fi-rr-spinner animate-spin"></i><span>' + (lang === 'th' ? 'กำลังโหลด...' : 'Loading...') + '</span>';
  });

  // เรียก function ที่ต้องการ
  setTimeout(function() {
    if (typeof window[funcName] === 'function') {
      window[funcName]();
    }
    // คืนค่าปุ่มหลังจาก 500ms
    setTimeout(function() {
      buttons.forEach(function(btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fi fi-rr-search"></i><span>' + (lang === 'th' ? 'ค้นหา' : 'Search') + '</span>';
      });
    }, 500);
  }, 100);
}

function buildStatCard(title, count, icon, colorClass, bgClass) {
  return '<div class="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"><div class="flex items-center justify-between"><div><p class="text-gray-500 text-sm font-medium mb-1">' + title + '</p><h4 class="text-3xl font-bold text-gray-800">' + count + '</h4></div><div class="w-12 h-12 rounded-xl ' + bgClass + ' ' + colorClass + ' flex items-center justify-center text-2xl"><i class="fi ' + icon + '"></i></div></div></div>';
}

function buildQuickMenuBtn(page, subPage, icon, color, label) {
  var onclick = subPage ? "navigateTo('" + page + "', '" + subPage + "')" : "navigateTo('" + page + "')";
  return '<button onclick="' + onclick + '" class="group bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all"><div class="flex flex-col items-center"><div class="w-14 h-14 rounded-2xl bg-' + color + '-50 text-' + color + '-600 flex items-center justify-center mb-4 group-hover:bg-' + color + '-600 group-hover:text-white transition-colors"><i class="fi ' + icon + ' text-2xl"></i></div><span class="font-semibold text-gray-700 text-sm text-center">' + label + '</span></div></button>';
}

async function loadDashboard() {
  var content = document.getElementById('pageContent');
  var lang = AppState.language;
  var user = AppState.user || {};
  var config = AppState.config || {};
  var role = user.role || 'user';

  var profileImg = user.profile_image
    ? '<img src="' + user.profile_image + '" class="w-full h-full rounded-full object-cover">'
    : '<i class="fi fi-sr-user text-3xl text-white"></i>';

  var userName = lang === 'th' ? (user.name || '') : (user.name_en || user.name || '');
  var schoolName = lang === 'th' ? (config.school_name || '') : (config.school_name_en || '');
  var currentYear = config.current_academic_year || '';

  var greeting = '';
  var hour = new Date().getHours();
  if (lang === 'th') {
    if (hour < 12) greeting = 'สวัสดีตอนเช้า';
    else if (hour < 17) greeting = 'สวัสดีตอนบ่าย';
    else greeting = 'สวัสดีตอนเย็น';
  } else {
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 17) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';
  }

  // Dashboard สำหรับ Admin/Staff
  if (role === 'admin' || role === 'staff') {
    content.innerHTML = renderAdminDashboard(lang, user, config, greeting, userName, schoolName, profileImg, currentYear);
  }
  // Dashboard สำหรับ User
  else {
    content.innerHTML = renderUserDashboard(lang, user, config, greeting, userName, schoolName, profileImg, currentYear);
  }

  loadDashboardStats();
}

// ==================== ADMIN/STAFF DASHBOARD ====================
function renderAdminDashboard(lang, user, config, greeting, userName, schoolName, profileImg, currentYear) {
  var roleText = t(user.role);

  var html = '<div class="fade-in">';

  // Header Banner
  html += '<div class="relative overflow-hidden rounded-2xl mb-8 shadow-xl">';
  html += '<div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800"></div>';
  html += '<div class="absolute inset-0 opacity-10" style="background-image: url(\'data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\');"></div>';
  html += '<div class="relative px-8 py-10">';
  html += '<div class="flex flex-col md:flex-row items-center gap-6">';

  // Profile Image
  html += '<div class="relative">';
  html += '<div class="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">';
  html += profileImg;
  html += '</div>';
  html += '<div class="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">';
  html += '<i class="fi fi-sr-shield-check text-white text-sm"></i>';
  html += '</div></div>';

  // Welcome Text
  html += '<div class="text-center md:text-left flex-1">';
  html += '<p class="text-blue-100 text-lg mb-2 font-medium">' + greeting + '</p>';
  html += '<h1 class="text-white text-3xl md:text-4xl font-bold mb-2">' + userName + '</h1>';
  html += '<div class="flex flex-wrap items-center justify-center md:justify-start gap-4">';
  html += '<div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">';
  html += '<i class="fi fi-rr-shield-check text-yellow-300"></i>';
  html += '<span class="text-white font-medium">' + roleText + '</span>';
  html += '</div>';
  html += '<div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">';
  html += '<i class="fi fi-rr-building text-blue-200"></i>';
  html += '<span class="text-white">' + schoolName + '</span>';
  html += '</div>';
  html += '<div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">';
  html += '<i class="fi fi-rr-calendar text-green-300"></i>';
  html += '<span class="text-white">' + (lang === 'th' ? 'ปีการศึกษา' : 'Year') + ' ' + currentYear + '</span>';
  html += '</div></div></div>';

  // Quick Stats (Small)
  html += '<div class="hidden lg:flex flex-col gap-3">';
  html += '<div class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 text-center min-w-[120px]">';
  html += '<div class="text-2xl font-bold text-white" id="miniTotalUsers">-</div>';
  html += '<div class="text-xs text-blue-100">' + (lang === 'th' ? 'ผู้ใช้ทั้งหมด' : 'Total Users') + '</div>';
  html += '</div>';
  html += '<div class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 text-center min-w-[120px]">';
  html += '<div class="text-2xl font-bold text-white" id="miniTotalRecords">-</div>';
  html += '<div class="text-xs text-blue-100">' + (lang === 'th' ? 'ข้อมูลทั้งหมด' : 'Total Records') + '</div>';
  html += '</div></div>';

  html += '</div></div></div>';

  // Stats Cards
  html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" id="statsCards">';
  html += buildSkeletonCard() + buildSkeletonCard() + buildSkeletonCard() + buildSkeletonCard();
  html += '</div>';

  // Quick Actions Section
  html += '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">';

// Quick Actions Card
html += '<div class="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">';
html += '<div class="flex items-center justify-between mb-6">';
html += '<div class="flex items-center gap-3">';
html += '<div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">';
html += '<i class="fi fi-rr-bolt text-white text-lg"></i></div>';
html += '<h3 class="text-xl font-bold text-gray-800">' + (lang === 'th' ? 'การดำเนินการด่วน' : 'Quick Actions') + '</h3>';
html += '</div></div>';

html += '<div class="grid grid-cols-2 md:grid-cols-3 gap-4">';

// แสดงเมนูตามบทบาท
if (user.role === 'admin') {
  // Admin - แสดงเมนูจัดการทั้งหมด
  html += buildQuickActionCard('members', null, 'fi-rr-users', 'blue', lang === 'th' ? 'จัดการสมาชิก' : 'Members', lang === 'th' ? 'ดูและจัดการผู้ใช้' : 'View & manage users');
  html += buildQuickActionCard('settings', null, 'fi-rr-settings', 'purple', lang === 'th' ? 'ตั้งค่าระบบ' : 'Settings', lang === 'th' ? 'กำหนดค่าระบบ' : 'Configure system');
  html += buildQuickActionCard('portfolio', 'personalInfo', 'fi-rr-user', 'green', lang === 'th' ? 'ข้อมูลบุคลากร' : 'Personnel Data', lang === 'th' ? 'ดูข้อมูลทั้งหมด' : 'View all data');
  html += buildQuickActionCard('portfolio', 'education', 'fi-rr-graduation-cap', 'orange', lang === 'th' ? 'การศึกษา' : 'Education', lang === 'th' ? 'จัดการข้อมูลการศึกษา' : 'Manage education');
  html += buildQuickActionCard('portfolio', 'scoutQualification', 'fi-rr-camping', 'red', lang === 'th' ? 'ลูกเสือ' : 'Scout', lang === 'th' ? 'คุณวุฒิลูกเสือ' : 'Scout qualification');
  html += buildQuickActionCard('profile', null, 'fi-rr-id-badge', 'cyan', lang === 'th' ? 'โปรไฟล์' : 'Profile', lang === 'th' ? 'ข้อมูลส่วนตัว' : 'Personal info');
} else if (user.role === 'executive') {
  // Executive - แสดงเมนูดูข้อมูลเท่านั้น
  html += buildQuickActionCard('members', null, 'fi-rr-users', 'blue', lang === 'th' ? 'ดูข้อมูลสมาชิก' : 'View Members', lang === 'th' ? 'ดูรายชื่อและข้อมูลผู้ใช้' : 'View user list & data');
  html += buildQuickActionCard('portfolio', 'personalInfo', 'fi-rr-user', 'green', lang === 'th' ? 'ข้อมูลบุคลากร' : 'Personnel Data', lang === 'th' ? 'ดูข้อมูลส่วนตัว' : 'View personal data');
  html += buildQuickActionCard('portfolio', 'education', 'fi-rr-graduation-cap', 'orange', lang === 'th' ? 'ประวัติการศึกษา' : 'Education', lang === 'th' ? 'ดูข้อมูลการศึกษา' : 'View education data');
  html += buildQuickActionCard('portfolio', 'scoutQualification', 'fi-rr-camping', 'red', lang === 'th' ? 'คุณวุฒิลูกเสือ' : 'Scout Qual.', lang === 'th' ? 'ดูคุณวุฒิลูกเสือ' : 'View scout qualification');
  html += buildQuickActionCard('dutyInfo', 'positionDuty', 'fi-rr-briefcase', 'purple', lang === 'th' ? 'ข้อมูลการปฏิบัติหน้าที่' : 'Duty Info', lang === 'th' ? 'ดูข้อมูลการปฏิบัติงาน' : 'View duty information');
  html += buildQuickActionCard('profile', null, 'fi-rr-id-badge', 'cyan', lang === 'th' ? 'โปรไฟล์ของฉัน' : 'My Profile', lang === 'th' ? 'ข้อมูลส่วนตัว' : 'Personal info');
} else if (user.role === 'staff') {
  // Staff - แสดงเมนูจัดการบางส่วน
  html += buildQuickActionCard('members', null, 'fi-rr-users', 'blue', lang === 'th' ? 'จัดการสมาชิก' : 'Members', lang === 'th' ? 'ดูและจัดการผู้ใช้' : 'View & manage users');
  html += buildQuickActionCard('portfolio', 'personalInfo', 'fi-rr-user', 'green', lang === 'th' ? 'ข้อมูลบุคลากร' : 'Personnel Data', lang === 'th' ? 'ดูข้อมูลทั้งหมด' : 'View all data');
  html += buildQuickActionCard('portfolio', 'education', 'fi-rr-graduation-cap', 'orange', lang === 'th' ? 'การศึกษา' : 'Education', lang === 'th' ? 'ดูข้อมูลการศึกษา' : 'View education');
  html += buildQuickActionCard('portfolio', 'scoutQualification', 'fi-rr-camping', 'red', lang === 'th' ? 'ลูกเสือ' : 'Scout', lang === 'th' ? 'คุณวุฒิลูกเสือ' : 'Scout qualification');
  html += buildQuickActionCard('dutyInfo', 'positionDuty', 'fi-rr-briefcase', 'purple', lang === 'th' ? 'ข้อมูลการปฏิบัติหน้าที่' : 'Duty Info', lang === 'th' ? 'ดูข้อมูลการปฏิบัติงาน' : 'View duty info');
  html += buildQuickActionCard('profile', null, 'fi-rr-id-badge', 'cyan', lang === 'th' ? 'โปรไฟล์' : 'Profile', lang === 'th' ? 'ข้อมูลส่วนตัว' : 'Personal info');
}

html += '</div></div>';

  // System Info Card
  html += '<div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">';
  html += '<div class="flex items-center gap-3 mb-6">';
  html += '<div class="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">';
  html += '<i class="fi fi-rr-info text-white text-lg"></i></div>';
  html += '<h3 class="text-xl font-bold text-gray-800">' + (lang === 'th' ? 'ข้อมูลระบบ' : 'System Info') + '</h3>';
  html += '</div>';

  html += '<div class="space-y-4">';
  html += '<div class="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">';
  html += '<div class="flex items-center gap-3">';
  html += '<div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">';
  html += '<i class="fi fi-rr-apps text-blue-600"></i></div>';
  html += '<span class="text-sm font-medium text-gray-700">' + (lang === 'th' ? 'เวอร์ชันระบบ' : 'Version') + '</span>';
  html += '</div>';
  html += '<span class="text-sm font-bold text-gray-900">1.0.0</span></div>';

  html += '<div class="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">';
  html += '<div class="flex items-center gap-3">';
  html += '<div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">';
  html += '<i class="fi fi-rr-calendar text-green-600"></i></div>';
  html += '<span class="text-sm font-medium text-gray-700">' + (lang === 'th' ? 'ปีการศึกษาปัจจุบัน' : 'Current Year') + '</span>';
  html += '</div>';
  html += '<span class="text-sm font-bold text-gray-900">' + currentYear + '</span></div>';

  html += '<div class="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">';
  html += '<div class="flex items-center gap-3">';
  html += '<div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">';
  html += '<i class="fi fi-rr-time-past text-purple-600"></i></div>';
  html += '<span class="text-sm font-medium text-gray-700">' + (lang === 'th' ? 'เข้าสู่ระบบล่าสุด' : 'Last Login') + '</span>';
  html += '</div>';
  html += '<span class="text-xs text-gray-600">' + (user.last_login ? formatDate(user.last_login) : '-') + '</span></div>';

  html += '</div></div>';

  html += '</div></div>';

  return html;
}

// ==================== USER DASHBOARD ====================
function renderUserDashboard(lang, user, config, greeting, userName, schoolName, profileImg, currentYear) {
  var html = '<div class="fade-in">';

  // Header Banner
  html += '<div class="relative overflow-hidden rounded-2xl mb-8 shadow-xl">';
  html += '<div class="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800"></div>';
  html += '<div class="absolute inset-0 opacity-10" style="background-image: url(\'data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\');"></div>';
  html += '<div class="relative px-8 py-10">';
  html += '<div class="flex flex-col md:flex-row items-center gap-6">';

  html += '<div class="relative">';
  html += '<div class="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">';
  html += profileImg;
  html += '</div>';
  html += '<div class="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">';
  html += '<i class="fi fi-sr-user text-white text-sm"></i>';
  html += '</div></div>';

  html += '<div class="text-center md:text-left flex-1">';
  html += '<p class="text-green-100 text-lg mb-2 font-medium">' + greeting + '</p>';
  html += '<h1 class="text-white text-3xl md:text-4xl font-bold mb-2">' + userName + '</h1>';
  html += '<div class="flex flex-wrap items-center justify-center md:justify-start gap-4">';
  html += '<div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">';
  html += '<i class="fi fi-rr-building text-green-200"></i>';
  html += '<span class="text-white">' + schoolName + '</span>';
  html += '</div>';
  html += '<div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">';
  html += '<i class="fi fi-rr-calendar text-yellow-300"></i>';
  html += '<span class="text-white">' + (lang === 'th' ? 'ปีการศึกษา' : 'Year') + ' ' + currentYear + '</span>';
  html += '</div></div></div></div></div></div>';

  // Progress Card
  html += '<div class="mb-8">';
  html += '<div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">';
  html += '<div class="flex items-center justify-between mb-6">';
  html += '<div class="flex items-center gap-3">';
  html += '<div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">';
  html += '<i class="fi fi-rr-chart-pie text-white text-lg"></i></div>';
  html += '<div>';
  html += '<h3 class="text-xl font-bold text-gray-800">' + (lang === 'th' ? 'ความสมบูรณ์ของข้อมูล' : 'Data Completeness') + '</h3>';
  html += '<p class="text-sm text-gray-500">' + (lang === 'th' ? 'ปีการศึกษา ' + currentYear : 'Academic Year ' + currentYear) + '</p>';
  html += '</div></div>';
  html += '<div class="text-3xl font-bold text-blue-600" id="completionPercentage">0%</div>';
  html += '</div>';

  html += '<div class="mb-4">';
  html += '<div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">';
  html += '<div id="progressBar" class="h-full rounded-full transition-all duration-1000 ease-out" style="width: 0%; background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);"></div>';
  html += '</div></div>';

  html += '<div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="progressDetails">';
  html += '<div class="text-center p-3 bg-gray-50 rounded-xl"><div class="text-2xl font-bold text-gray-400">-</div><div class="text-xs text-gray-500">' + (lang === 'th' ? 'ประวัติส่วนตัว' : 'Personal Info') + '</div></div>';
  html += '<div class="text-center p-3 bg-gray-50 rounded-xl"><div class="text-2xl font-bold text-gray-400">-</div><div class="text-xs text-gray-500">' + (lang === 'th' ? 'การศึกษา' : 'Education') + '</div></div>';
  html += '<div class="text-center p-3 bg-gray-50 rounded-xl"><div class="text-2xl font-bold text-gray-400">-</div><div class="text-xs text-gray-500">' + (lang === 'th' ? 'คุณวุฒิลูกเสือ' : 'Scout Qual.') + '</div></div>';
  html += '</div></div></div>';

  // My Stats Cards
  html += '<div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8" id="statsCards">';
  html += buildSkeletonCard() + buildSkeletonCard() + buildSkeletonCard();
  html += '</div>';

  // Quick Actions
  html += '<div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">';
  html += '<div class="flex items-center gap-3 mb-6">';
  html += '<div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">';
  html += '<i class="fi fi-rr-rocket-lunch text-white text-lg"></i></div>';
  html += '<h3 class="text-xl font-bold text-gray-800">' + (lang === 'th' ? 'จัดการข้อมูลของฉัน' : 'Manage My Data') + '</h3>';
  html += '</div>';

  html += '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">';
  html += buildQuickActionCard('portfolio', 'personalInfo', 'fi-rr-user', 'blue', lang === 'th' ? 'ประวัติส่วนตัว' : 'Personal Info', lang === 'th' ? 'จัดการข้อมูลส่วนตัว' : 'Manage personal data');
  html += buildQuickActionCard('portfolio', 'education', 'fi-rr-graduation-cap', 'purple', lang === 'th' ? 'ประวัติการศึกษา' : 'Education', lang === 'th' ? 'จัดการการศึกษา' : 'Manage education');
  html += buildQuickActionCard('portfolio', 'scoutQualification', 'fi-rr-camping', 'orange', lang === 'th' ? 'คุณวุฒิลูกเสือ' : 'Scout Qual.', lang === 'th' ? 'คุณวุฒิและประวัติงาน' : 'Scout & work history');
  html += '</div></div>';

  html += '</div>';

  return html;
}

// ==================== HELPER FUNCTIONS ====================
function buildSkeletonCard() {
  return '<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">' +
    '<div class="flex items-center justify-between mb-4">' +
    '<div class="h-4 bg-gray-200 rounded w-24"></div>' +
    '<div class="w-12 h-12 bg-gray-200 rounded-xl"></div>' +
    '</div>' +
    '<div class="h-8 bg-gray-200 rounded w-16"></div>' +
    '</div>';
}

function buildQuickActionCard(page, subPage, icon, color, title, subtitle) {
  var onclick = subPage ? "navigateTo('" + page + "', '" + subPage + "')" : "navigateTo('" + page + "')";
  return '<button onclick="' + onclick + '" class="group relative overflow-hidden bg-white p-5 rounded-2xl border-2 border-gray-200 hover:border-' + color + '-500 hover:shadow-xl transition-all duration-300">' +
    '<div class="absolute top-0 right-0 w-24 h-24 bg-' + color + '-500 opacity-0 group-hover:opacity-10 rounded-full -mr-12 -mt-12 transition-opacity"></div>' +
    '<div class="relative">' +
    '<div class="w-12 h-12 bg-' + color + '-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-' + color + '-500 group-hover:scale-110 transition-all duration-300">' +
    '<i class="fi ' + icon + ' text-' + color + '-600 text-xl group-hover:text-white transition-colors"></i>' +
    '</div>' +
    '<h4 class="font-bold text-gray-800 mb-1 group-hover:text-' + color + '-600 transition-colors">' + title + '</h4>' +
    '<p class="text-xs text-gray-500">' + subtitle + '</p>' +
    '</div></button>';
}

async function loadDashboardStats() {
  try {
    var user = AppState.user || {};
    var role = user.role || 'user';
    var result;
    try {
      result = await api.get('/api/dashboard/stats');
    } catch(e) {
      result = { status: 'error' };
    }

    if (result.status === 'success') {
      var stats = result.data;
      var lang = AppState.language;
      var isAdmin = role === 'admin' || role === 'staff';

      var cardsHtml = '';

      if (isAdmin) {
        // Admin Dashboard Stats
        cardsHtml += buildStatCard(
          lang === 'th' ? 'ผู้ใช้ทั้งหมด' : 'Total Users',
          stats.totalUsers,
          'fi-rr-users',
          'blue',
          'from-blue-500 to-blue-600'
        );
        cardsHtml += buildStatCard(
          lang === 'th' ? 'ข้อมูลส่วนตัว' : 'Personal Info',
          stats.totalPersonalInfo,
          'fi-rr-user',
          'green',
          'from-green-500 to-green-600'
        );
        cardsHtml += buildStatCard(
          lang === 'th' ? 'การศึกษา' : 'Education',
          stats.totalEducation,
          'fi-rr-graduation-cap',
          'purple',
          'from-purple-500 to-purple-600'
        );
        cardsHtml += buildStatCard(
          lang === 'th' ? 'การประชุม' : 'Meetings',
          stats.totalMeetings || 0,
          'fi-rr-calendar-clock',
          'cyan',
          'from-cyan-500 to-cyan-600'
        );

        // Update mini stats
        document.getElementById('miniTotalUsers').textContent = stats.totalUsers;
        var totalRecords = stats.totalPersonalInfo + stats.totalEducation + stats.totalScoutQualification;
        document.getElementById('miniTotalRecords').textContent = totalRecords;
      } else {
        // User Dashboard Stats
        cardsHtml += buildStatCard(
          lang === 'th' ? 'ประวัติส่วนตัว' : 'Personal Info',
          stats.totalPersonalInfo,
          'fi-rr-user',
          'blue',
          'from-blue-500 to-blue-600'
        );
        cardsHtml += buildStatCard(
          lang === 'th' ? 'ประวัติการศึกษา' : 'Education',
          stats.totalEducation,
          'fi-rr-graduation-cap',
          'purple',
          'from-purple-500 to-purple-600'
        );
        cardsHtml += buildStatCard(
          lang === 'th' ? 'คุณวุฒิลูกเสือ' : 'Scout Qual.',
          stats.totalScoutQualification,
          'fi-rr-camping',
          'orange',
          'from-orange-500 to-orange-600'
        );

        // Calculate completion
        var total = 3;
        var completed = 0;
        if (stats.totalPersonalInfo > 0) completed++;
        if (stats.totalEducation > 0) completed++;
        if (stats.totalScoutQualification > 0) completed++;

        var percentage = Math.round((completed / total) * 100);

        // Update progress bar
        setTimeout(function() {
          document.getElementById('progressBar').style.width = percentage + '%';
          document.getElementById('completionPercentage').textContent = percentage + '%';
        }, 300);

        // Update progress details
        var detailsHtml = '';
        detailsHtml += '<div class="text-center p-3 rounded-xl ' + (stats.totalPersonalInfo > 0 ? 'bg-green-50' : 'bg-gray-50') + '">';
        detailsHtml += '<div class="text-2xl font-bold ' + (stats.totalPersonalInfo > 0 ? 'text-green-600' : 'text-gray-400') + '">';
        detailsHtml += stats.totalPersonalInfo > 0 ? '<i class="fi fi-sr-check-circle"></i>' : '<i class="fi fi-rr-cross-circle"></i>';
        detailsHtml += '</div>';
        detailsHtml += '<div class="text-xs text-gray-600 mt-1">' + (lang === 'th' ? 'ประวัติส่วนตัว' : 'Personal Info') + '</div>';
        detailsHtml += '</div>';

        detailsHtml += '<div class="text-center p-3 rounded-xl ' + (stats.totalEducation > 0 ? 'bg-green-50' : 'bg-gray-50') + '">';
        detailsHtml += '<div class="text-2xl font-bold ' + (stats.totalEducation > 0 ? 'text-green-600' : 'text-gray-400') + '">';
        detailsHtml += stats.totalEducation > 0 ? '<i class="fi fi-sr-check-circle"></i>' : '<i class="fi fi-rr-cross-circle"></i>';
        detailsHtml += '</div>';
        detailsHtml += '<div class="text-xs text-gray-600 mt-1">' + (lang === 'th' ? 'การศึกษา' : 'Education') + '</div>';
        detailsHtml += '</div>';

        detailsHtml += '<div class="text-center p-3 rounded-xl ' + (stats.totalScoutQualification > 0 ? 'bg-green-50' : 'bg-gray-50') + '">';
        detailsHtml += '<div class="text-2xl font-bold ' + (stats.totalScoutQualification > 0 ? 'text-green-600' : 'text-gray-400') + '">';
        detailsHtml += stats.totalScoutQualification > 0 ? '<i class="fi fi-sr-check-circle"></i>' : '<i class="fi fi-rr-cross-circle"></i>';
        detailsHtml += '</div>';
        detailsHtml += '<div class="text-xs text-gray-600 mt-1">' + (lang === 'th' ? 'คุณวุฒิลูกเสือ' : 'Scout Qual.') + '</div>';
        detailsHtml += '</div>';

        document.getElementById('progressDetails').innerHTML = detailsHtml;
      }

      document.getElementById('statsCards').innerHTML = cardsHtml;
    }
  } catch (error) {
    console.error('Load stats error:', error);
  }
}

function buildStatCard(title, count, icon, color, gradient) {
  return '<div class="group relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">' +
    '<div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ' + gradient + ' opacity-0 group-hover:opacity-10 rounded-full -mr-16 -mt-16 transition-opacity"></div>' +
    '<div class="relative">' +
    '<div class="flex items-center justify-between mb-4">' +
    '<div class="flex-1">' +
    '<p class="text-sm font-medium text-gray-500 mb-1">' + title + '</p>' +
    '<h4 class="text-3xl font-bold text-gray-800 group-hover:scale-110 transition-transform inline-block">' + count + '</h4>' +
    '</div>' +
    '<div class="w-14 h-14 bg-gradient-to-br ' + gradient + ' rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">' +
    '<i class="fi ' + icon + ' text-2xl text-white"></i>' +
    '</div></div>' +
    '<div class="h-1 bg-gray-100 rounded-full overflow-hidden">' +
    '<div class="h-full bg-gradient-to-r ' + gradient + ' rounded-full transition-all duration-500 group-hover:w-full" style="width: 60%;"></div>' +
    '</div></div></div>';
}

// ==================== PERSONAL INFO ====================
var personalInfoPage = 1;
var personalInfoSearch = '';
var personalInfoYearFilter = '';

async function loadPersonalInfo() {
  var content = document.getElementById('pageContent');
  // ตั้งค่าเริ่มต้นเป็นปีปัจจุบัน
  var currentYear = (AppState.config && AppState.config.current_academic_year) ? AppState.config.current_academic_year : '';
  personalInfoYearFilter = currentYear;

  content.innerHTML = '<div class="fade-in"><div class="section-header flex flex-col md:flex-row justify-between items-center mb-6 gap-4"><h2 class="text-2xl font-bold text-primary flex items-center"><span class="bg-blue-100 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3"><i class="fi fi-rr-user"></i></span>' + t('personalInfo') + '</h2><button onclick="showPersonalInfoForm()" class="btn-primary"><i class="fi fi-rr-plus mr-1"></i>' + t('add') + '</button></div>' + renderFilterBar('pi', 'filterPersonalInfo') + '<div id="personalInfoContainer"><div class="py-12 flex justify-center"><div class="loading-spinner"></div></div></div></div>';
  loadPersonalInfoData();
}

function filterPersonalInfo() {
  personalInfoSearch = document.getElementById('piSearchInput').value;
  personalInfoYearFilter = document.getElementById('piFilterYear').value;
  personalInfoPage = 1;
  loadPersonalInfoData();
}

async function loadPersonalInfoData() {
  try {
    var user = AppState.user || {};
    var result;
    try {
      result = await api.get('/api/portfolio/personal-info?userId=' + user.id + '&page=' + personalInfoPage + '&search=' + encodeURIComponent(personalInfoSearch));
    } catch(e) {
      result = { status: 'error', data: [] };
    }
    if (personalInfoYearFilter && result.status === 'success') {
      var filtered = [];
      for (var i = 0; i < result.data.length; i++) { if (result.data[i].academic_year === personalInfoYearFilter) filtered.push(result.data[i]); }
      result.data = filtered;
    }
    renderPersonalInfoTable(result);
  } catch (error) { console.error('Load personal info error:', error); }
}

function renderPersonalInfoTable(result) {
  var container = document.getElementById('personalInfoContainer');
  var lang = AppState.language;
  var data = result.data || [];
  if (data.length === 0) {
    container.innerHTML = '<div class="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm"><div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 text-4xl"><i class="fi fi-rr-folder-open"></i></div><h3 class="text-lg font-bold text-gray-700">' + t('noData') + '</h3></div>';
    return;
  }
  var tableHtml = '<div class="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden"><table class="data-table w-full"><thead class="bg-gray-50"><tr><th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">#</th><th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">' + (lang === 'th' ? 'ปี' : 'Year') + '</th><th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">' + (lang === 'th' ? 'ชื่อ-นามสกุล' : 'Name') + '</th><th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">' + (lang === 'th' ? 'เลขบัตร' : 'ID') + '</th><th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">' + (lang === 'th' ? 'วันเกิด' : 'DOB') + '</th><th class="px-4 py-3 text-center text-xs font-semibold text-gray-600">' + (lang === 'th' ? 'จัดการ' : 'Action') + '</th></tr></thead><tbody>';
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    tableHtml += '<tr class="border-t hover:bg-gray-50"><td class="px-4 py-3 text-sm">' + (i + 1) + '</td><td class="px-4 py-3"><span class="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">' + (item.academic_year || '-') + '</span></td><td class="px-4 py-3 font-medium">' + (item.full_name || '-') + '</td><td class="px-4 py-3 text-sm">' + (item.id_card || '-') + '</td><td class="px-4 py-3 text-sm">' + formatDate(item.birth_date) + '</td><td class="px-4 py-3 text-center"><div class="flex justify-center gap-1"><button onclick="viewPersonalInfo(\'' + item.id + '\')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><i class="fi fi-rr-eye"></i></button><button onclick="editPersonalInfo(\'' + item.id + '\')" class="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"><i class="fi fi-rr-edit"></i></button><button onclick="deletePersonalInfoRecord(\'' + item.id + '\')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg"><i class="fi fi-rr-trash"></i></button></div></td></tr>';
  }
  tableHtml += '</tbody></table></div>';
  var cardsHtml = '<div class="md:hidden space-y-4">';
  for (var j = 0; j < data.length; j++) {
    var itm = data[j];
    cardsHtml += '<div class="bg-white rounded-xl p-4 border shadow-sm"><div class="flex items-center gap-3 mb-3"><div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">' + (itm.full_name ? itm.full_name.charAt(0) : '?') + '</div><div><h4 class="font-bold text-gray-800">' + (itm.full_name || '-') + '</h4><span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">' + (itm.academic_year || '-') + '</span></div></div><div class="text-sm text-gray-600 mb-3"><div><i class="fi fi-rr-id-card mr-1"></i>' + (itm.id_card || '-') + '</div><div><i class="fi fi-rr-calendar mr-1"></i>' + formatDate(itm.birth_date) + '</div></div><div class="flex gap-2 pt-3 border-t"><button onclick="viewPersonalInfo(\'' + itm.id + '\')" class="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium">' + t('view') + '</button><button onclick="editPersonalInfo(\'' + itm.id + '\')" class="px-3 py-2 rounded-lg bg-yellow-50 text-yellow-600"><i class="fi fi-rr-edit"></i></button><button onclick="deletePersonalInfoRecord(\'' + itm.id + '\')" class="px-3 py-2 rounded-lg bg-red-50 text-red-600"><i class="fi fi-rr-trash"></i></button></div></div>';
  }
  cardsHtml += '</div>';
  container.innerHTML = tableHtml + cardsHtml;
  if (result.pagination && result.pagination.totalPages > 1) { container.innerHTML += renderPagination(result.pagination, 'personalInfoPage', 'loadPersonalInfoData'); }
}

function generateChildEntryHtml(index, data, lang) {
  data = data || {};
  return '<div class="child-entry border border-blue-200 rounded-xl bg-white mb-4 shadow-sm" id="child-entry-' + index + '">' +
    '<div class="bg-blue-500 px-4 py-3 flex justify-between items-center rounded-t-xl">' +
    '<h4 class="font-bold text-white text-sm flex items-center"><i class="fi fi-rr-child-head mr-2"></i>' + (lang === 'th' ? 'ข้อมูลบุตรคนที่' : 'Child #') + ' <span class="child-index ml-1">' + index + '</span></h4>' +
    '<button type="button" onclick="deleteChildEntry(this)" class="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-xs flex items-center"><i class="fi fi-rr-trash mr-1"></i>' + (lang === 'th' ? 'ลบข้อมูลบุตร' : 'Delete') + '</button></div>' +
    '<div class="p-5 bg-gray-50">' +
    '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' +
    '<div><label class="flex items-center text-sm text-gray-600 mb-1"><i class="fi fi-rr-user mr-2 text-gray-400"></i>' + (lang === 'th' ? 'ชื่อบุตร' : 'Name') + '</label><input type="text" class="form-input child-name" value="' + (data.name || '') + '"></div>' +
    '<div><label class="flex items-center text-sm text-gray-600 mb-1"><i class="fi fi-rr-briefcase mr-2 text-gray-400"></i>' + (lang === 'th' ? 'อาชีพ' : 'Occupation') + '</label><input type="text" class="form-input child-occupation" value="' + (data.occupation || '') + '"></div>' +
    '<div><label class="flex items-center text-sm text-gray-600 mb-1"><i class="fi fi-rr-id-card-clip-alt mr-2 text-gray-400"></i>' + (lang === 'th' ? 'เลขประจำตัวบัตรประชาชน' : 'ID Card') + '</label><input type="text" class="form-input child-id-card" maxlength="13" value="' + (data.id_card || '') + '"></div>' +
    '<div><label class="flex items-center text-sm text-gray-600 mb-1"><i class="fi fi-rr-calendar mr-2 text-gray-400"></i>' + (lang === 'th' ? 'วัน-เดือน-ปีเกิด' : 'Birth Date') + '</label><input type="date" class="form-input child-birth-date" value="' + (data.birth_date || '') + '"></div>' +
    '<div><label class="flex items-center text-sm text-gray-600 mb-1"><i class="fi fi-rr-home mr-2 text-gray-400"></i>' + (lang === 'th' ? 'ที่อยู่' : 'Address') + '</label><input type="text" class="form-input child-address" value="' + (data.address || '') + '"></div>' +
    '<div><label class="flex items-center text-sm text-gray-600 mb-1"><i class="fi fi-rr-phone-call mr-2 text-gray-400"></i>' + (lang === 'th' ? 'เบอร์โทรศัพท์' : 'Phone') + '</label><input type="text" class="form-input child-phone" value="' + (data.phone || '') + '"></div>' +
    '</div></div></div>';
}

function addChildEntry() {
  var wrapper = document.getElementById('childrenWrapper');
  var index = wrapper.querySelectorAll('.child-entry').length + 1;
  wrapper.insertAdjacentHTML('beforeend', generateChildEntryHtml(index, {}, AppState.language));
  var noMsg = document.getElementById('noChildrenMsg');
  if (noMsg) noMsg.remove();
}

function deleteChildEntry(btn) {
  var entry = btn.closest('.child-entry');
  if (entry) { entry.remove(); reindexChildren(); }
}

function reindexChildren() {
  var entries = document.querySelectorAll('.child-entry');
  for (var i = 0; i < entries.length; i++) {
    var indexSpan = entries[i].querySelector('.child-index');
    if (indexSpan) indexSpan.textContent = i + 1;
  }
}

async function showPersonalInfoForm(data) {
  var lang = AppState.language;
  var user = AppState.user || {};
  var config = AppState.config || {};
  var currentYear = (config && config.current_academic_year) ? config.current_academic_year : '';
  var copiedFromYear = '';

  // ถ้าเป็นการเพิ่มใหม่
  if (!data || !data.id) {
    showLoading();
    try {
      // 1. ตรวจสอบว่ามีข้อมูลปีนี้แล้วหรือไม่
      var checkResult;
      try {
        checkResult = await api.get('/api/portfolio/check-year-data?userId=' + user.id + '&type=PersonalInfo&year=' + encodeURIComponent(currentYear));
      } catch(e) {
        checkResult = { exists: false };
      }

      if (checkResult.exists) {
        hideLoading();
        var confirm = await Swal.fire({
          icon: 'warning',
          title: lang === 'th' ? 'พบข้อมูลปีนี้แล้ว' : 'Data Already Exists',
          html: '<div class="text-center">' +
            '<div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">' +
            '<i class="fi fi-rr-user text-4xl text-blue-600"></i></div>' +
            '<p class="text-gray-700 mb-2 text-lg">' +
            (lang === 'th' ? 'ท่านได้กรอกข้อมูลประวัติส่วนตัวของ' : 'You have already entered personal information for') +
            '</p>' +
            '<p class="text-blue-600 font-bold text-2xl mb-2">ปีการศึกษา ' + currentYear + '</p>' +
            '<p class="text-gray-600">' + (lang === 'th' ? 'ไปแล้ว' : 'already') + '</p>' +
            '</div>',
          showCancelButton: true,
          confirmButtonColor: '#3b82f6',
          cancelButtonColor: '#6b7280',
          confirmButtonText: '<i class="fi fi-rr-edit mr-2"></i>' + (lang === 'th' ? 'แก้ไขข้อมูลเดิม' : 'Edit Existing'),
          cancelButtonText: '<i class="fi fi-rr-cross mr-2"></i>' + (lang === 'th' ? 'ยกเลิก' : 'Cancel'),
          customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-lg px-6 py-3', cancelButton: 'rounded-lg px-6 py-3' }
        });

        if (confirm.isConfirmed) {
          data = checkResult.data;
        } else {
          return;
        }
      } else {
        // 2. ไม่มีข้อมูลปีนี้ -> ดึงข้อมูลปีล่าสุดมา
        var latestResult;
        try {
          latestResult = await api.get('/api/portfolio/latest-year-data?userId=' + user.id + '&type=PersonalInfo');
        } catch(e) {
          latestResult = { status: 'error' };
        }

        hideLoading();

        if (latestResult.status === 'success') {
          data = latestResult.data;
          copiedFromYear = latestResult.year;
          delete data.id;
          delete data.created_at;
          delete data.updated_at;

          showToast('info',
            lang === 'th'
              ? '📋 ดึงข้อมูลจากปีการศึกษา ' + copiedFromYear + ' มาแสดงแล้ว กรุณาตรวจสอบและแก้ไขข้อมูลที่เปลี่ยนแปลง'
              : '📋 Data copied from academic year ' + copiedFromYear + '. Please review and update.',
            'top-end', 5000
          );
        }
      }
    } catch (error) {
      hideLoading();
      console.error('Check/Load year error:', error);
    }
  }

  data = data || {};
  var childrenData = [];
  try { if (data.children_info) childrenData = JSON.parse(data.children_info); } catch (e) {}
  if (!Array.isArray(childrenData)) childrenData = [];

  var defaultFullName = '';
  if (!data.full_name) {
    defaultFullName = lang === 'th' ? (user.name || '') : (user.name_en || user.name || '');
  } else {
    defaultFullName = data.full_name;
  }

  var childrenHtml = '';
  for (var i = 0; i < childrenData.length; i++) {
    childrenHtml += generateChildEntryHtml(i + 1, childrenData[i], lang);
  }

  // บังคับใช้ปีปัจจุบันเสมอ เมื่อเป็นการเพิ่มใหม่หรือคัดลอกมา
var displayYear = currentYear;

// ถ้าเป็นการแก้ไขข้อมูลเดิม (มี id) ให้ใช้ปีของข้อมูลนั้น
if (data && data.id && !copiedFromYear) {
  displayYear = data.academic_year || currentYear;
}
  var yearField = '<input type="text" id="piAcademicYear" class="form-input bg-gray-100 font-semibold text-primary" value="' + displayYear + '" readonly>';

  var copiedNotice = '';
  if (copiedFromYear) {
    copiedNotice = '<div class="md:col-span-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-2">' +
      '<div class="flex items-start gap-3">' +
      '<i class="fi fi-rr-copy-alt text-blue-600 text-2xl mt-0.5"></i>' +
      '<div class="flex-1">' +
      '<p class="font-bold text-blue-900 mb-1">' +
      (lang === 'th' ? '📋 ข้อมูลคัดลอกจากปีการศึกษา ' + copiedFromYear : '📋 Data copied from academic year ' + copiedFromYear) +
      '</p>' +
      '<p class="text-sm text-blue-700">' +
      (lang === 'th'
        ? 'กรุณาตรวจสอบและแก้ไขข้อมูลที่มีการเปลี่ยนแปลง (เช่น รูปภาพ, ที่อยู่, เบอร์โทร ฯลฯ) แล้วกดบันทึก'
        : 'Please review and update any changed information (photo, address, phone, etc.) then save') +
      '</p>' +
      '</div></div></div>';
  }

  var photoHtml = '<div class="md:col-span-6 mb-4">';
  photoHtml += '<label class="form-label flex items-center">';
  photoHtml += '<i class="fi fi-rr-camera mr-2 text-blue-600"></i>' + (lang === 'th' ? 'รูปถ่าย' : 'Photo');
  if (copiedFromYear) {
    photoHtml += ' <span class="ml-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full animate-pulse">' +
      '⚠️ ' + (lang === 'th' ? 'แนะนำให้อัพเดทรูปใหม่' : 'Update recommended') + '</span>';
  }
  photoHtml += '</label>';
  photoHtml += '<div class="flex flex-col md:flex-row items-start md:items-center gap-4">';
  photoHtml += '<div id="piPhotoPreview" class="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 hover:border-blue-400 transition-colors">';
  if (data.photo_url) {
    photoHtml += '<img src="' + data.photo_url + '" class="w-full h-full object-cover" id="piPhotoImg">';
  } else {
    photoHtml += '<div class="text-center p-4"><i class="fi fi-rr-user text-4xl text-gray-300 mb-2"></i><p class="text-xs text-gray-400">' + (lang === 'th' ? 'ไม่มีรูป' : 'No photo') + '</p></div>';
  }
  photoHtml += '</div><div class="flex-1">';
  photoHtml += '<input type="file" id="piPhotoInput" accept="image/jpeg,image/png,image/jpg" class="hidden" onchange="handlePersonalPhotoUpload(this)">';
  photoHtml += '<input type="hidden" id="piPhotoUrl" value="' + (data.photo_url || '') + '">';
  photoHtml += '<div class="flex flex-wrap gap-2 mb-3">';
  photoHtml += '<button type="button" onclick="document.getElementById(\'piPhotoInput\').click()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">';
  photoHtml += '<i class="fi fi-rr-upload"></i><span>' + (lang === 'th' ? 'เลือกรูปภาพ' : 'Choose Photo') + '</span></button>';
  if (data.photo_url) {
    photoHtml += '<button type="button" onclick="removePersonalPhoto()" class="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">';
    photoHtml += '<i class="fi fi-rr-trash"></i><span>' + (lang === 'th' ? 'ลบรูป' : 'Remove') + '</span></button>';
  }
  photoHtml += '</div><div class="text-xs text-gray-500 space-y-1">';
  photoHtml += '<p><i class="fi fi-rr-info mr-1"></i>' + (lang === 'th' ? 'รองรับไฟล์: JPG, PNG' : 'Supported: JPG, PNG') + '</p>';
  photoHtml += '<p><i class="fi fi-rr-file-check mr-1"></i>' + (lang === 'th' ? 'ขนาดสูงสุด: 5 MB' : 'Max size: 5 MB') + '</p>';
  photoHtml += '<p><i class="fi fi-rr-bulb mr-1"></i>' + (lang === 'th' ? 'แนะนำ: รูปหน้าตรง ขนาด 300x300 px' : 'Recommended: 300x300 px') + '</p>';
  photoHtml += '</div></div></div></div>';

  var formHtml = '<form id="personalInfoForm" onsubmit="savePersonalInfoData(event)" class="space-y-6">';
  formHtml += '<input type="hidden" id="piId" value="' + (data.id || '') + '">';
  formHtml += '<div class="bg-white rounded-xl shadow-sm border overflow-hidden">';
  formHtml += '<div class="bg-blue-50 px-4 py-3 border-b flex items-center">';
  formHtml += '<div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3"><i class="fi fi-rr-user"></i></div>';
  formHtml += '<h3 class="font-bold text-gray-800">' + (lang === 'th' ? '1. ข้อมูลทั่วไป' : '1. General Info') + '</h3></div>';
  formHtml += '<div class="p-5 grid grid-cols-1 md:grid-cols-6 gap-4">';
  formHtml += copiedNotice;
  formHtml += photoHtml;
  formHtml += '<div class="md:col-span-2"><label class="form-label">' + (lang === 'th' ? 'ปีการศึกษา' : 'Year') + ' *</label>' + yearField + '</div>';
  formHtml += '<div class="md:col-span-4"><label class="form-label">' + (lang === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name') + ' *</label><input type="text" id="piFullName" class="form-input" required value="' + defaultFullName + '"></div>';
  formHtml += '<div class="md:col-span-2"><label class="form-label">' + (lang === 'th' ? 'เลขครู' : 'Teacher ID') + '</label><input type="text" id="piTeacherId" class="form-input" value="' + (data.teacher_id || '') + '"></div>';
  formHtml += '<div class="md:col-span-2"><label class="form-label">' + (lang === 'th' ? 'บัตร ปชช.' : 'ID Card') + '</label><input type="text" id="piIdCard" class="form-input" value="' + (data.id_card || '') + '"></div>';
  formHtml += '<div class="md:col-span-2"><label class="form-label">' + (lang === 'th' ? 'วันเกิด' : 'Birth Date') + '</label><input type="date" id="piBirthDate" class="form-input" value="' + (data.birth_date || '') + '"></div>';
  formHtml += '<div class="md:col-span-2"><label class="form-label">' + (lang === 'th' ? 'สัญชาติ' : 'Nationality') + '</label><input type="text" id="piNationality" class="form-input" value="' + (data.nationality || 'ไทย') + '"></div>';
  formHtml += '<div class="md:col-span-2"><label class="form-label">' + (lang === 'th' ? 'เชื้อชาติ' : 'Ethnicity') + '</label><input type="text" id="piEthnicity" class="form-input" value="' + (data.ethnicity || 'ไทย') + '"></div>';
  formHtml += '<div class="md:col-span-2"><label class="form-label">' + (lang === 'th' ? 'ศาสนา' : 'Religion') + '</label><input type="text" id="piReligion" class="form-input" value="' + (data.religion || 'พุทธ') + '"></div>';
  formHtml += '<div class="md:col-span-3"><label class="form-label">' + (lang === 'th' ? 'หมู่เลือด' : 'Blood') + '</label><select id="piBloodType" class="form-select"><option value="">--</option><option value="A"' + (data.blood_type === 'A' ? ' selected' : '') + '>A</option><option value="B"' + (data.blood_type === 'B' ? ' selected' : '') + '>B</option><option value="AB"' + (data.blood_type === 'AB' ? ' selected' : '') + '>AB</option><option value="O"' + (data.blood_type === 'O' ? ' selected' : '') + '>O</option></select></div>';
  formHtml += '<div class="md:col-span-3"><label class="form-label">' + (lang === 'th' ? 'สถานภาพ' : 'Status') + '</label><select id="piMaritalStatus" class="form-select"><option value="โสด"' + (data.marital_status === 'โสด' ? ' selected' : '') + '>' + (lang === 'th' ? 'โสด' : 'Single') + '</option><option value="สมรส"' + (data.marital_status === 'สมรส' ? ' selected' : '') + '>' + (lang === 'th' ? 'สมรส' : 'Married') + '</option><option value="หย่าร้าง"' + (data.marital_status === 'หย่าร้าง' ? ' selected' : '') + '>' + (lang === 'th' ? 'หย่าร้าง' : 'Divorced') + '</option></select></div>';
  formHtml += '</div></div>';
  formHtml += '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">' + buildAddressSection('Reg', lang === 'th' ? '2. ที่อยู่ตามทะเบียนบ้าน' : '2. Registered Address', 'green', data, lang, false) + buildAddressSection('Curr', lang === 'th' ? '3. ที่อยู่ปัจจุบัน' : '3. Current Address', 'teal', data, lang, true) + '</div>';
  formHtml += '<div class="bg-white rounded-xl shadow-sm border overflow-hidden"><div class="bg-purple-50 px-4 py-3 border-b flex items-center"><div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-3"><i class="fi fi-rr-users-alt"></i></div><h3 class="font-bold text-gray-800">' + (lang === 'th' ? '4. ครอบครัว' : '4. Family') + '</h3></div><div class="p-5 space-y-4">' + buildFamilyRow('Father', lang === 'th' ? 'บิดา' : 'Father', data, lang) + buildFamilyRow('Mother', lang === 'th' ? 'มารดา' : 'Mother', data, lang) + buildFamilyRow('Spouse', lang === 'th' ? 'คู่สมรส' : 'Spouse', data, lang) + '</div></div>';
  formHtml += '<div class="mb-6"><h2 class="text-xl font-bold text-blue-500 mb-4 flex items-center"><i class="fi fi-rr-users mr-2"></i>' + (lang === 'th' ? 'ข้อมูลบุตร' : 'Children Information') + '</h2><div id="childrenWrapper">' + childrenHtml + '</div><button type="button" onclick="addChildEntry()" class="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"><i class="fi fi-rr-plus mr-2"></i>' + (lang === 'th' ? 'เพิ่มข้อมูลบุตร' : 'Add Child') + '</button></div>';
  formHtml += '<div class="flex gap-3 pt-4 sticky bottom-0 bg-white/90 backdrop-blur pb-2 border-t"><button type="button" onclick="closeDataModal()" class="flex-1 btn-outline h-12">' + t('cancel') + '</button><button type="submit" class="flex-1 btn-primary h-12"><i class="fi fi-rr-disk mr-2"></i>' + t('save') + '</button></div></form>';

  openDataModal((data.id ? t('edit') : t('add')) + ' ' + t('personalInfo'), formHtml);
}

function handlePersonalPhotoUpload(input) {
  if (input.files && input.files[0]) {
    var file = input.files[0];
    var lang = AppState.language;

    // ตรวจสอบขนาดไฟล์ (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showAlert('error', t('error'),
        lang === 'th' ? 'ขนาดไฟล์ต้องไม่เกิน 5 MB' : 'File size must not exceed 5 MB');
      input.value = '';
      return;
    }

    // ตรวจสอบประเภทไฟล์
    var allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.indexOf(file.type) === -1) {
      showAlert('error', t('error'),
        lang === 'th' ? 'กรุณาเลือกไฟล์รูปภาพ (JPG หรือ PNG เท่านั้น)' : 'Please select an image file (JPG or PNG only)');
      input.value = '';
      return;
    }

    showLoading();

    var reader = new FileReader();
    reader.onload = function(e) {
      var base64Data = e.target.result;

      // แสดงตัวอย่างรูปทันที
      var preview = document.getElementById('piPhotoPreview');
      preview.innerHTML = '<img src="' + base64Data + '" class="w-full h-full object-cover" id="piPhotoImg" alt="Preview">';

      // อัพโหลดไปยังเซิร์ฟเวอร์
      api.post('/api/upload/logo', { base64Data: base64Data, fileName: file.name })
        .then(function(result) {
          hideLoading();
          if (result.status === 'success') {
            document.getElementById('piPhotoUrl').value = result.url;
            showAlert('success', t('success'),
              lang === 'th' ? 'อัพโหลดรูปภาพสำเร็จ' : 'Photo uploaded successfully');
          } else {
            showAlert('error', t('error'), result.message);
            // คืนค่ารูปเดิม
            var oldUrl = document.getElementById('piPhotoUrl').value;
            if (oldUrl) {
              preview.innerHTML = '<img src="' + oldUrl + '" class="w-full h-full object-cover" id="piPhotoImg" alt="Preview">';
            } else {
              preview.innerHTML = '<div class="text-center p-4"><i class="fi fi-rr-user text-4xl text-gray-300 mb-2"></i><p class="text-xs text-gray-400">' +
                (lang === 'th' ? 'ไม่มีรูป' : 'No photo') + '</p></div>';
            }
          }
        })
        .catch(function(error) {
          hideLoading();
          showAlert('error', t('error'), error.message);
          // คืนค่ารูปเดิม
          var oldUrl = document.getElementById('piPhotoUrl').value;
          var preview = document.getElementById('piPhotoPreview');
          if (oldUrl) {
            preview.innerHTML = '<img src="' + oldUrl + '" class="w-full h-full object-cover" id="piPhotoImg" alt="Preview">';
          } else {
            preview.innerHTML = '<div class="text-center p-4"><i class="fi fi-rr-user text-4xl text-gray-300 mb-2"></i><p class="text-xs text-gray-400">' +
              (lang === 'th' ? 'ไม่มีรูป' : 'No photo') + '</p></div>';
          }
        });
    };

    reader.onerror = function() {
      hideLoading();
      showAlert('error', t('error'),
        lang === 'th' ? 'ไม่สามารถอ่านไฟล์ได้' : 'Cannot read file');
      input.value = '';
    };

    reader.readAsDataURL(file);
  }
}

// ==================== ฟังก์ชันลบรูปภาพ ====================
function removePersonalPhoto() {
  var lang = AppState.language;
  var preview = document.getElementById('piPhotoPreview');

  preview.innerHTML = '<div class="text-center p-4">' +
    '<i class="fi fi-rr-user text-4xl text-gray-300 mb-2"></i>' +
    '<p class="text-xs text-gray-400">' + (lang === 'th' ? 'ไม่มีรูป' : 'No photo') + '</p>' +
    '</div>';

  document.getElementById('piPhotoUrl').value = '';
  document.getElementById('piPhotoInput').value = '';

  showAlert('info', t('success'),
    lang === 'th' ? 'ลบรูปภาพแล้ว (กรุณากด "บันทึก" เพื่อยืนยัน)' : 'Photo removed (Please click "Save" to confirm)');
}

function buildAddressSection(prefix, title, color, data, lang, showCopyBtn) {
  data = data || {};
  var lp = prefix.toLowerCase();
  var copyBtn = showCopyBtn ? '<button type="button" onclick="copyAddress()" class="text-xs bg-' + color + '-100 text-' + color + '-600 px-2 py-1 rounded hover:bg-' + color + '-200">' + (lang === 'th' ? 'เหมือนทะเบียนบ้าน' : 'Same') + '</button>' : '';
  return '<div class="bg-white rounded-xl shadow-sm border overflow-hidden"><div class="bg-' + color + '-50 px-4 py-3 border-b flex items-center justify-between"><div class="flex items-center"><div class="w-8 h-8 rounded-lg bg-' + color + '-100 text-' + color + '-600 flex items-center justify-center mr-3"><i class="fi fi-rr-home"></i></div><h3 class="font-bold text-gray-800">' + title + '</h3></div>' + copyBtn + '</div><div class="p-5 grid grid-cols-2 gap-3"><div><label class="text-xs text-gray-500">' + (lang === 'th' ? 'บ้านเลขที่' : 'House No.') + '</label><input type="text" id="pi' + prefix + 'HouseNo" class="form-input text-sm" value="' + (data[lp + '_house_no'] || '') + '"></div><div><label class="text-xs text-gray-500">' + (lang === 'th' ? 'หมู่' : 'Moo') + '</label><input type="text" id="pi' + prefix + 'Moo" class="form-input text-sm" value="' + (data[lp + '_moo'] || '') + '"></div><div class="col-span-2"><label class="text-xs text-gray-500">' + (lang === 'th' ? 'ถนน/ซอย' : 'Road') + '</label><input type="text" id="pi' + prefix + 'Road" class="form-input text-sm" value="' + (data[lp + '_road'] || '') + '"></div><div><label class="text-xs text-gray-500">' + (lang === 'th' ? 'ตำบล' : 'Subdistrict') + '</label><input type="text" id="pi' + prefix + 'Subdistrict" class="form-input text-sm" value="' + (data[lp + '_subdistrict'] || '') + '"></div><div><label class="text-xs text-gray-500">' + (lang === 'th' ? 'อำเภอ' : 'District') + '</label><input type="text" id="pi' + prefix + 'District" class="form-input text-sm" value="' + (data[lp + '_district'] || '') + '"></div><div><label class="text-xs text-gray-500">' + (lang === 'th' ? 'จังหวัด' : 'Province') + '</label><input type="text" id="pi' + prefix + 'Province" class="form-input text-sm" value="' + (data[lp + '_province'] || '') + '"></div><div><label class="text-xs text-gray-500">' + (lang === 'th' ? 'รหัส ปณ.' : 'Zip') + '</label><input type="text" id="pi' + prefix + 'Zip" class="form-input text-sm" value="' + (data[lp + '_zip'] || '') + '"></div></div></div>';
}

function buildFamilyRow(type, title, data, lang) {
  data = data || {};
  var lt = type.toLowerCase();
  return '<div class="grid grid-cols-1 md:grid-cols-4 gap-3 pb-3 border-b border-gray-100 last:border-0"><div class="md:col-span-4 text-sm font-bold text-gray-700">' + title + '</div><div class="md:col-span-2"><input type="text" id="pi' + type + 'Name" class="form-input text-sm" placeholder="' + (lang === 'th' ? 'ชื่อ-นามสกุล' : 'Name') + '" value="' + (data[lt + '_name'] || '') + '"></div><div><input type="text" id="pi' + type + 'Occ" class="form-input text-sm" placeholder="' + (lang === 'th' ? 'อาชีพ' : 'Occ.') + '" value="' + (data[lt + '_occ'] || '') + '"></div><div><input type="text" id="pi' + type + 'Phone" class="form-input text-sm" placeholder="' + (lang === 'th' ? 'เบอร์โทร' : 'Phone') + '" value="' + (data[lt + '_phone'] || '') + '"></div></div>';
}

function copyAddress() {
  var fields = ['HouseNo', 'Moo', 'Road', 'Subdistrict', 'District', 'Province', 'Zip'];
  for (var i = 0; i < fields.length; i++) { document.getElementById('piCurr' + fields[i]).value = document.getElementById('piReg' + fields[i]).value; }
}

async function savePersonalInfoData(event) {
  event.preventDefault();
  showLoading();
  var user = AppState.user || {};

  var personalData = {
    id: document.getElementById('piId').value || null,
    user_id: user.id,
    academic_year: document.getElementById('piAcademicYear').value,
    full_name: document.getElementById('piFullName').value,
    teacher_id: document.getElementById('piTeacherId').value,
    id_card: document.getElementById('piIdCard').value,
    birth_date: document.getElementById('piBirthDate').value,
    nationality: document.getElementById('piNationality').value,
    ethnicity: document.getElementById('piEthnicity').value,
    religion: document.getElementById('piReligion').value,
    blood_type: document.getElementById('piBloodType').value,
    marital_status: document.getElementById('piMaritalStatus').value,
    photo_url: document.getElementById('piPhotoUrl').value,
    reg_house_no: document.getElementById('piRegHouseNo').value,
    reg_moo: document.getElementById('piRegMoo').value,
    reg_road: document.getElementById('piRegRoad').value,
    reg_subdistrict: document.getElementById('piRegSubdistrict').value,
    reg_district: document.getElementById('piRegDistrict').value,
    reg_province: document.getElementById('piRegProvince').value,
    reg_zip: document.getElementById('piRegZip').value,
    curr_house_no: document.getElementById('piCurrHouseNo').value,
    curr_moo: document.getElementById('piCurrMoo').value,
    curr_road: document.getElementById('piCurrRoad').value,
    curr_subdistrict: document.getElementById('piCurrSubdistrict').value,
    curr_district: document.getElementById('piCurrDistrict').value,
    curr_province: document.getElementById('piCurrProvince').value,
    curr_zip: document.getElementById('piCurrZip').value,
    father_name: document.getElementById('piFatherName').value,
    father_occ: document.getElementById('piFatherOcc').value,
    father_phone: document.getElementById('piFatherPhone').value,
    mother_name: document.getElementById('piMotherName').value,
    mother_occ: document.getElementById('piMotherOcc').value,
    mother_phone: document.getElementById('piMotherPhone').value,
    spouse_name: document.getElementById('piSpouseName').value,
    spouse_occ: document.getElementById('piSpouseOcc').value,
    spouse_phone: document.getElementById('piSpousePhone').value
  };

  var childrenList = [];
  var entries = document.querySelectorAll('.child-entry');
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    childrenList.push({
      name: entry.querySelector('.child-name').value,
      occupation: entry.querySelector('.child-occupation').value,
      id_card: entry.querySelector('.child-id-card').value,
      birth_date: entry.querySelector('.child-birth-date').value,
      address: entry.querySelector('.child-address').value,
      phone: entry.querySelector('.child-phone').value
    });
  }
  personalData.children_info = JSON.stringify(childrenList);

  try {
    var result;
    if (personalData.id) {
      result = await api.put('/api/portfolio/personal-info/' + personalData.id, personalData);
    } else {
      result = await api.post('/api/portfolio/personal-info', personalData);
    }

    hideLoading();

    if (result.status === 'success') {
      closeDataModal();
      showAlert('success', t('success'), result.message);

      // รีเฟรชรูปโปรไฟล์
      await refreshUserProfilePhoto();

      loadPersonalInfoData();
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

async function viewPersonalInfo(id) {
  showLoading();
  try {
    var result = await api.get('/api/portfolio/personal-info/' + id);

    hideLoading();

    if (result.status === 'success') {
      var data = result.data;
      var lang = AppState.language;

      // Parse children info
      var childrenData = [];
      try {
        if (data.children_info) {
          childrenData = JSON.parse(data.children_info);
        }
      } catch(e) {}

      var content = '<div class="max-h-[80vh] overflow-y-auto pr-2">';

      // ==================== Profile Header (แก้ไขส่วนนี้) ====================
      content += '<div class="text-center mb-6 pb-6 border-b">';

      // แสดงรูปภาพจริงหรือ placeholder
      content += '<div class="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-blue-300 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200">';

      if (data.photo_url) {
        // แสดงรูปภาพที่อัพโหลด
        content += '<img src="' + data.photo_url + '" class="w-full h-full object-cover" alt="' + (data.full_name || '') + '" onerror="this.onerror=null; this.src=\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%233b82f6%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2240%22 font-family=%22Arial%22>' + (data.full_name ? data.full_name.charAt(0) : '?') + '</text></svg>\';">';
      } else {
        // แสดง icon placeholder
        content += '<div class="w-full h-full flex items-center justify-center">';
        content += '<i class="fi fi-rr-user text-5xl text-blue-600"></i>';
        content += '</div>';
      }

      content += '</div>';

      content += '<h3 class="text-2xl font-bold text-gray-900 mb-2">' + (data.full_name || '-') + '</h3>';
      content += '<span class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white;">';
      content += '<i class="fi fi-rr-calendar mr-2"></i>' + (lang === 'th' ? 'ปีการศึกษา' : 'Year') + ' ' + (data.academic_year || '-');
      content += '</span></div>';
      // ==================== สิ้นสุดส่วนที่แก้ไข ====================

      // ข้อมูลทั่วไป
      content += '<div class="mb-6">';
      content += '<h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">';
      content += '<i class="fi fi-rr-info text-blue-600 mr-2"></i>' + (lang === 'th' ? 'ข้อมูลทั่วไป' : 'General Information');
      content += '</h4>';
      content += '<div class="grid grid-cols-2 gap-4">';

      content += buildInfoItem(lang === 'th' ? 'เลขครู' : 'Teacher ID', data.teacher_id || '-', 'fi-rr-id-badge');
      content += buildInfoItem(lang === 'th' ? 'เลขบัตรประชาชน' : 'ID Card', data.id_card || '-', 'fi-rr-id-card-clip-alt');
      content += buildInfoItem(lang === 'th' ? 'วันเกิด' : 'Birth Date', formatDate(data.birth_date), 'fi-rr-cake-birthday');
      content += buildInfoItem(lang === 'th' ? 'สัญชาติ' : 'Nationality', data.nationality || '-', 'fi-rr-flag');
      content += buildInfoItem(lang === 'th' ? 'เชื้อชาติ' : 'Ethnicity', data.ethnicity || '-', 'fi-rr-users-alt');
      content += buildInfoItem(lang === 'th' ? 'ศาสนา' : 'Religion', data.religion || '-', 'fi-rr-church');
      content += buildInfoItem(lang === 'th' ? 'หมู่เลือด' : 'Blood Type', data.blood_type || '-', 'fi-rr-drop');
      content += buildInfoItem(lang === 'th' ? 'สถานภาพ' : 'Marital Status', data.marital_status || '-', 'fi-rr-heart');

      content += '</div></div>';

      // ที่อยู่ตามทะเบียนบ้าน
      content += '<div class="mb-6">';
      content += '<h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">';
      content += '<i class="fi fi-rr-home text-green-600 mr-2"></i>' + (lang === 'th' ? 'ที่อยู่ตามทะเบียนบ้าน' : 'Registered Address');
      content += '</h4>';
      content += '<div class="bg-green-50 rounded-xl p-4 border border-green-200">';
      content += '<p class="text-sm text-gray-700 leading-relaxed">';

      var regAddr = [];
      if (data.reg_house_no) regAddr.push((lang === 'th' ? 'บ้านเลขที่ ' : 'No. ') + data.reg_house_no);
      if (data.reg_moo) regAddr.push((lang === 'th' ? 'หมู่ ' : 'Moo ') + data.reg_moo);
      if (data.reg_road) regAddr.push((lang === 'th' ? 'ถนน/ซอย ' : 'Road ') + data.reg_road);
      if (data.reg_subdistrict) regAddr.push((lang === 'th' ? 'ต.' : 'Subdistrict ') + data.reg_subdistrict);
      if (data.reg_district) regAddr.push((lang === 'th' ? 'อ.' : 'District ') + data.reg_district);
      if (data.reg_province) regAddr.push((lang === 'th' ? 'จ.' : 'Province ') + data.reg_province);
      if (data.reg_zip) regAddr.push(data.reg_zip);

      content += regAddr.length > 0 ? regAddr.join(' ') : '-';
      content += '</p></div></div>';

      // ที่อยู่ปัจจุบัน
      content += '<div class="mb-6">';
      content += '<h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">';
      content += '<i class="fi fi-rr-marker text-teal-600 mr-2"></i>' + (lang === 'th' ? 'ที่อยู่ปัจจุบัน' : 'Current Address');
      content += '</h4>';
      content += '<div class="bg-teal-50 rounded-xl p-4 border border-teal-200">';
      content += '<p class="text-sm text-gray-700 leading-relaxed">';

      var currAddr = [];
      if (data.curr_house_no) currAddr.push((lang === 'th' ? 'บ้านเลขที่ ' : 'No. ') + data.curr_house_no);
      if (data.curr_moo) currAddr.push((lang === 'th' ? 'หมู่ ' : 'Moo ') + data.curr_moo);
      if (data.curr_road) currAddr.push((lang === 'th' ? 'ถนน/ซอย ' : 'Road ') + data.curr_road);
      if (data.curr_subdistrict) currAddr.push((lang === 'th' ? 'ต.' : 'Subdistrict ') + data.curr_subdistrict);
      if (data.curr_district) currAddr.push((lang === 'th' ? 'อ.' : 'District ') + data.curr_district);
      if (data.curr_province) currAddr.push((lang === 'th' ? 'จ.' : 'Province ') + data.curr_province);
      if (data.curr_zip) currAddr.push(data.curr_zip);

      content += currAddr.length > 0 ? currAddr.join(' ') : '-';
      content += '</p></div></div>';

      // ข้อมูลครอบครัว
      content += '<div class="mb-6">';
      content += '<h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">';
      content += '<i class="fi fi-rr-users text-purple-600 mr-2"></i>' + (lang === 'th' ? 'ข้อมูลครอบครัว' : 'Family Information');
      content += '</h4>';

      // บิดา
      content += '<div class="bg-purple-50 rounded-xl p-4 mb-3 border border-purple-200">';
      content += '<h5 class="font-semibold text-gray-800 mb-3 flex items-center">';
      content += '<i class="fi fi-rr-user text-purple-600 mr-2"></i>' + (lang === 'th' ? 'บิดา' : 'Father');
      content += '</h5>';
      content += '<div class="grid grid-cols-3 gap-3 text-sm">';
      content += buildSmallInfo(lang === 'th' ? 'ชื่อ-นามสกุล' : 'Name', data.father_name || '-');
      content += buildSmallInfo(lang === 'th' ? 'อาชีพ' : 'Occupation', data.father_occ || '-');
      content += buildSmallInfo(lang === 'th' ? 'เบอร์โทรศัพท์' : 'Phone', data.father_phone || '-');
      content += '</div></div>';

      // มารดา
      content += '<div class="bg-purple-50 rounded-xl p-4 mb-3 border border-purple-200">';
      content += '<h5 class="font-semibold text-gray-800 mb-3 flex items-center">';
      content += '<i class="fi fi-rr-user text-purple-600 mr-2"></i>' + (lang === 'th' ? 'มารดา' : 'Mother');
      content += '</h5>';
      content += '<div class="grid grid-cols-3 gap-3 text-sm">';
      content += buildSmallInfo(lang === 'th' ? 'ชื่อ-นามสกุล' : 'Name', data.mother_name || '-');
      content += buildSmallInfo(lang === 'th' ? 'อาชีพ' : 'Occupation', data.mother_occ || '-');
      content += buildSmallInfo(lang === 'th' ? 'เบอร์โทรศัพท์' : 'Phone', data.mother_phone || '-');
      content += '</div></div>';

      // คู่สมรส
      if (data.spouse_name || data.spouse_occ || data.spouse_phone) {
        content += '<div class="bg-purple-50 rounded-xl p-4 border border-purple-200">';
        content += '<h5 class="font-semibold text-gray-800 mb-3 flex items-center">';
        content += '<i class="fi fi-rr-heart text-purple-600 mr-2"></i>' + (lang === 'th' ? 'คู่สมรส' : 'Spouse');
        content += '</h5>';
        content += '<div class="grid grid-cols-3 gap-3 text-sm">';
        content += buildSmallInfo(lang === 'th' ? 'ชื่อ-นามสกุล' : 'Name', data.spouse_name || '-');
        content += buildSmallInfo(lang === 'th' ? 'อาชีพ' : 'Occupation', data.spouse_occ || '-');
        content += buildSmallInfo(lang === 'th' ? 'เบอร์โทรศัพท์' : 'Phone', data.spouse_phone || '-');
        content += '</div></div>';
      }

      content += '</div>';

      // ข้อมูลบุตร
      if (childrenData && childrenData.length > 0) {
        content += '<div class="mb-6">';
        content += '<h4 class="text-lg font-bold text-gray-800 mb-4 flex items-center">';
        content += '<i class="fi fi-rr-child-head text-cyan-600 mr-2"></i>' + (lang === 'th' ? 'ข้อมูลบุตร' : 'Children Information');
        content += ' <span class="ml-2 text-sm bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">' + childrenData.length + ' ' + (lang === 'th' ? 'คน' : 'children') + '</span>';
        content += '</h4>';

        for (var i = 0; i < childrenData.length; i++) {
          var child = childrenData[i];
          content += '<div class="bg-cyan-50 rounded-xl p-4 mb-3 border border-cyan-200">';
          content += '<h5 class="font-semibold text-gray-800 mb-3 flex items-center">';
          content += '<span class="bg-cyan-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2">' + (i + 1) + '</span>';
          content += (child.name || '-');
          content += '</h5>';
          content += '<div class="grid grid-cols-2 gap-3 text-sm">';
          content += buildSmallInfo(lang === 'th' ? 'อาชีพ' : 'Occupation', child.occupation || '-');
          content += buildSmallInfo(lang === 'th' ? 'เลขบัตรประชาชน' : 'ID Card', child.id_card || '-');
          content += buildSmallInfo(lang === 'th' ? 'วัน-เดือน-ปีเกิด' : 'Birth Date', formatDate(child.birth_date));
          content += buildSmallInfo(lang === 'th' ? 'เบอร์โทรศัพท์' : 'Phone', child.phone || '-');
          if (child.address) {
            content += '<div class="col-span-2 pt-2 border-t border-cyan-200">';
            content += '<span class="text-cyan-600 text-xs font-medium flex items-center mb-1">';
            content += '<i class="fi fi-rr-marker mr-1"></i>' + (lang === 'th' ? 'ที่อยู่' : 'Address');
            content += '</span>';
            content += '<p class="text-gray-700">' + child.address + '</p>';
            content += '</div>';
          }
          content += '</div></div>';
        }

        content += '</div>';
      }

      content += '</div>';

      // Footer buttons
      content += '<div class="sticky bottom-0 bg-white pt-4 border-t flex justify-end gap-3">';
      content += '<button onclick="closeDataModal()" class="btn-outline px-6 h-11">';
      content += '<i class="fi fi-rr-cross mr-2"></i>' + t('close');
      content += '</button>';
      content += '<button onclick="editPersonalInfo(\'' + id + '\')" class="btn-primary px-6 h-11">';
      content += '<i class="fi fi-rr-edit mr-2"></i>' + t('edit');
      content += '</button></div>';

      openDataModal(t('personalInfo'), content);
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

// Helper Functions (ไม่ต้องแก้ไข)
function buildInfoItem(label, value, icon) {
  return '<div class="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">' +
    '<div class="flex items-center gap-2 mb-1">' +
    '<i class="fi ' + icon + ' text-blue-600 text-sm"></i>' +
    '<span class="text-xs text-gray-500 font-medium">' + label + '</span>' +
    '</div>' +
    '<p class="text-sm text-gray-900 font-semibold">' + value + '</p>' +
    '</div>';
}

function buildSmallInfo(label, value) {
  return '<div>' +
    '<span class="text-gray-500 text-xs block mb-1">' + label + '</span>' +
    '<p class="text-gray-700 font-medium">' + (value || '-') + '</p>' +
    '</div>';
}

async function editPersonalInfo(id) {
  showLoading();
  try {
    var result;
    try {
      result = await api.get('/api/portfolio/personal-info/' + id);
    } catch(e) {
      result = { status: 'error' };
    }
    hideLoading();
    if (result.status === 'success') showPersonalInfoForm(result.data);
    else showAlert('error', t('error'), 'ไม่สามารถโหลดข้อมูลได้');
  } catch (error) { hideLoading(); showAlert('error', t('error'), error.message); }
}

async function deletePersonalInfoRecord(id) {
  var confirm = await showConfirm(t('confirmDelete'), t('confirmDeleteMsg'));
  if (confirm.isConfirmed) {
    showLoading();
    try {
      var result = await api.delete('/api/portfolio/personal-info/' + id);
      hideLoading();
      if (result.status === 'success') { showAlert('success', t('success'), result.message); loadPersonalInfoData(); }
    } catch (error) { hideLoading(); showAlert('error', t('error'), error.message); }
  }
}
