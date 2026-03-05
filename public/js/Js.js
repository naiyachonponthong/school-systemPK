/**
 * Personnel Management System - Main JavaScript
 * Part 1: Core Functions, Authentication, Navigation
 */

// ==================== GLOBAL STATE ====================
const AppState = {
  user: null,
  config: null,
  currentPage: 'dashboard',
  currentSubPage: null,
  language: 'th',
  loginRole: 'admin'
};

// ==================== LANGUAGE TRANSLATIONS ====================
const Translations = {
  th: {
    dashboard: 'หน้าหลัก',
    portfolio: 'แฟ้มสะสมผลงาน',
    personalInfo: 'ประวัติส่วนตัว',
    education: 'ประวัติการศึกษา',
    scoutQualification: 'คุณวุฒิทางลูกเสือ/ประวัติการทำงาน',
    workHistory: 'ประวัติการทำงาน',
    dutyInfo: 'ข้อมูลการปฏิบัติหน้าที่',
    positionDuty: 'ตำแหน่ง/หน้าที่หลัก/หน้าที่พิเศษ',
    teachingSummary: 'ตารางสรุปการปฏิบัติการสอน',
    projectActivity: 'ผลการปฏิบัติงานโครงการ/กิจกรรม',
    studentActivity: 'กิจกรรมพัฒนาผู้เรียนที่รับผิดชอบ',
    mediaProduction: 'ตารางสรุปการผลิตสื่อ/นวัตกรรม',
    mediaUsage: 'ตารางสรุปการใช้สื่อประเภทต่างๆ',
    fieldTrip: 'การนำนักเรียนไปศึกษาค้นคว้า/ทัศนศึกษา',
    competition: 'ตารางสรุปการฝึกซ้อมส่งนักเรียนแข่งขัน',
    selfDevelopment: 'การพัฒนาตนเอง',
    reports: 'รายงาน',
    members: 'จัดการสมาชิก',
    profile: 'โปรไฟล์',
    settings: 'ตั้งค่าระบบ',
    developing: 'กำลังพัฒนา',
    add: 'เพิ่ม',
    edit: 'แก้ไข',
    delete: 'ลบ',
    view: 'ดู',
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    search: 'ค้นหา',
    noData: 'ไม่มีข้อมูล',
    confirmDelete: 'ยืนยันการลบ',
    confirmDeleteMsg: 'คุณต้องการลบข้อมูลนี้หรือไม่?',
    yes: 'ใช่',
    no: 'ไม่',
    success: 'สำเร็จ',
    error: 'ผิดพลาด',
    loading: 'กำลังโหลด...',
    admin: 'ผู้ดูแลระบบ',
    staff: 'เจ้าหน้าที่',
    executive: 'ผู้บริหาร',
    head: 'หัวหน้า',
    user: 'บุคลากร',
    academicYear: 'ปีการศึกษา',
    auditLog: 'ประวัติการเปลี่ยนแปลง',
    meetings: 'การประชุม',
    meetingManagement: 'จัดการประชุม',
    myMeetings: 'ประชุมของฉัน',
    createMeeting: 'สร้างการประชุม',
    meetingTitle: 'หัวข้อการประชุม',
    meetingDate: 'วันที่ประชุม',
    meetingTime: 'เวลาประชุม',
    meetingLocation: 'สถานที่ประชุม',
    attendees: 'ผู้เข้าร่วมประชุม',
    selectAll: 'เลือกทั้งหมด',
    checkin: 'เช็คอิน',
    checkout: 'เช็คเอาท์',
    checkedIn: 'เช็คอินแล้ว',
    checkedOut: 'เช็คเอาท์แล้ว',
    pending: 'รอเช็คอิน',
    absent: 'ไม่เข้าร่วม',
    scanQR: 'สแกน QR Code',
    showQR: 'แสดง QR Code',
    requireLocation: 'ต้องยืนยันตำแหน่ง',
    requireQR: 'ต้องสแกน QR Code',
    scheduled: 'กำหนดการ',
    inProgress: 'กำลังดำเนินการ',
    completed: 'เสร็จสิ้น',
    cancelled: 'ยกเลิก',
    attendanceRate: 'อัตราการเข้าร่วม',
    startMeeting: 'เริ่มประชุม',
    endMeeting: 'จบประชุม',
    dutyPatrol: 'ประจำเวร',
    dutyManagement: 'จัดการตารางเวร',
    myDuty: 'เวรของฉัน',
    dutySchedule: 'ตารางเวร',
    dutyLocation: 'จุดประจำเวร',
    morningDuty: 'เวรเช้า',
    afternoonDuty: 'เวรเย็น'
  },
  en: {
    dashboard: 'Dashboard',
    portfolio: 'Portfolio',
    personalInfo: 'Personal Information',
    education: 'Education History',
    scoutQualification: 'Scout Qualification/Work History',
    workHistory: 'Work History',
    dutyInfo: 'Duty Information',
    positionDuty: 'Position/Main Duty/Special Duty',
    teachingSummary: 'Teaching Summary Table',
    projectActivity: 'Project/Activity Results',
    studentActivity: 'Student Development Activities',
    mediaProduction: 'Media/Innovation Production',
    mediaUsage: 'Media Usage Summary',
    fieldTrip: 'Field Trip/Study Visit',
    competition: 'Competition Training Summary',
    selfDevelopment: 'Self Development',
    reports: 'Reports',
    members: 'Members Management',
    profile: 'Profile',
    settings: 'Settings',
    developing: 'Under Development',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    noData: 'No Data',
    confirmDelete: 'Confirm Delete',
    confirmDeleteMsg: 'Do you want to delete this data?',
    yes: 'Yes',
    no: 'No',
    success: 'Success',
    error: 'Error',
    loading: 'Loading...',
    admin: 'Administrator',
    staff: 'Staff',
    executive: 'Executive',
    head: 'Head',
    user: 'Personnel',
    academicYear: 'Academic Year',
    auditLog: 'Audit Log',
    meetings: 'Meetings',
    meetingManagement: 'Meeting Management',
    myMeetings: 'My Meetings',
    createMeeting: 'Create Meeting',
    meetingTitle: 'Meeting Title',
    meetingDate: 'Meeting Date',
    meetingTime: 'Meeting Time',
    meetingLocation: 'Meeting Location',
    attendees: 'Attendees',
    selectAll: 'Select All',
    checkin: 'Check-in',
    checkout: 'Check-out',
    checkedIn: 'Checked In',
    checkedOut: 'Checked Out',
    pending: 'Pending',
    absent: 'Absent',
    scanQR: 'Scan QR Code',
    showQR: 'Show QR Code',
    requireLocation: 'Require Location',
    requireQR: 'Require QR Code',
    scheduled: 'Scheduled',
    inProgress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    attendanceRate: 'Attendance Rate',
    startMeeting: 'Start Meeting',
    endMeeting: 'End Meeting',
    dutyPatrol: 'Duty Patrol',
    dutyManagement: 'Duty Management',
    myDuty: 'My Duty',
    dutySchedule: 'Duty Schedule',
    dutyLocation: 'Duty Location',
    morningDuty: 'Morning Duty',
    afternoonDuty: 'Afternoon Duty'
  }
};

// ==================== UTILITY FUNCTIONS ====================
/**
 * แปลข้อความตามภาษาปัจจุบัน
 */
function t(key) {
  return Translations[AppState.language][key] || key;
}

/**
 * แสดง Loading
 */
function showLoading() {
  document.getElementById('loadingOverlay').classList.remove('hidden');
}

/**
 * ซ่อน Loading
 */
function hideLoading() {
  document.getElementById('loadingOverlay').classList.add('hidden');
}

/**
 * อัพเดทโลโก้ใน Loading Overlay
 */
function updateLoadingLogo() {
  const loadingLogo = document.getElementById('loadingLogo');
  if (loadingLogo && AppState.config && AppState.config.logo_url) {
    loadingLogo.innerHTML = `
      <div class="w-24 h-24 rounded-2xl bg-white shadow-2xl flex items-center justify-center overflow-hidden p-2 border-4 border-white/50 animate-pulse">
        <img src="${AppState.config.logo_url}" class="w-full h-full object-contain" alt="Logo">
      </div>
    `;
  }
}

/**
 * แสดงข้อความแจ้งเตือน
 */
function showAlert(type, title, text) {
  return Swal.fire({
    icon: type,
    title: title,
    text: text,
    confirmButtonColor: '#1c2b45'
  });
}

/**
 * แสดงข้อความยืนยัน
 */
function showConfirm(title, text) {
  return Swal.fire({
    icon: 'warning',
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonColor: '#1c2b45',
    cancelButtonColor: '#6b7280',
    confirmButtonText: t('yes'),
    cancelButtonText: t('no')
  });
}

/**
 * Format วันที่
 */
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (AppState.language === 'th') {
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * สลับการแสดงรหัสผ่าน
 */
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(inputId + 'Icon');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fi fi-rr-eye-crossed';
  } else {
    input.type = 'password';
    icon.className = 'fi fi-rr-eye';
  }
}

// ==================== LANGUAGE FUNCTIONS ====================
/**
 * สลับภาษา (พร้อม Loading State)
 */
async function toggleLanguage() {
  // แสดง Loading
  const loadingText = AppState.language === 'th' ? 'กำลังโหลด...' : 'Loading...';
  showLoading();

  try {
    // รอเล็กน้อยเพื่อให้เห็น loading animation
    await new Promise(resolve => setTimeout(resolve, 300));

    // สลับภาษา
    AppState.language = AppState.language === 'th' ? 'en' : 'th';
    localStorage.setItem('language', AppState.language);

    // อัพเดท UI
    updateLanguageUI();

    // รีเฟรชหน้าปัจจุบัน
    if (AppState.currentPage) {
      loadPage(AppState.currentPage, AppState.currentSubPage);
    }

    hideLoading();

    // แสดงข้อความสำเร็จแบบสั้น
    const successMsg = AppState.language === 'th' ? 'เปลี่ยนภาษาเรียบร้อย' : 'Language changed';
    Swal.fire({
      icon: 'success',
      title: successMsg,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });
  } catch (error) {
    hideLoading();
    console.error('Toggle language error:', error);
  }
}

/**
 * แสดง Mini Loading บนปุ่ม
 */
function showButtonLoading(button, originalContent) {
  button.disabled = true;
  button.dataset.originalContent = originalContent;
  button.innerHTML = '<i class="fi fi-rr-spinner animate-spin mr-2"></i>' +
    (AppState.language === 'th' ? 'กำลังโหลด...' : 'Loading...');
  button.style.opacity = '0.7';
  button.style.cursor = 'not-allowed';
}

/**
 * ซ่อน Mini Loading บนปุ่ม
 */
function hideButtonLoading(button, restoreContent) {
  button.disabled = false;
  if (restoreContent && button.dataset.originalContent) {
    button.innerHTML = button.dataset.originalContent;
  }
  button.style.opacity = '1';
  button.style.cursor = 'pointer';
  delete button.dataset.originalContent;
}

/**
 * อัพเดท UI ตามภาษา
 */
function updateLanguageUI() {
  const lang = AppState.language;
  document.getElementById('langToggleText').textContent = lang === 'th' ? 'EN' : 'TH';

  // อัพเดทข้อความที่มี data-lang attributes
  document.querySelectorAll('[data-lang-th]').forEach(el => {
    el.textContent = el.getAttribute(`data-lang-${lang}`);
  });

  // อัพเดท placeholders
  document.querySelectorAll('[data-placeholder-th]').forEach(el => {
    el.placeholder = el.getAttribute(`data-placeholder-${lang}`);
  });

  // อัพเดทชื่อแอพและโรงเรียน
  if (AppState.config) {
    const appName = lang === 'th' ? AppState.config.app_name : (AppState.config.app_name_en || AppState.config.app_name);
    const schoolName = lang === 'th' ? AppState.config.school_name : (AppState.config.school_name_en || AppState.config.school_name);

    // Login Page
    const loginAppName = document.getElementById('loginAppName');
    const loginSchoolName = document.getElementById('loginSchoolName');
    if (loginAppName) loginAppName.textContent = appName;
    if (loginSchoolName) loginSchoolName.textContent = schoolName;

    // อัพเดทโลโก้ในหน้า Login
    const loginLogo = document.getElementById('loginLogo');
    if (loginLogo && AppState.config.logo_url) {
      loginLogo.innerHTML = '<img src="' + AppState.config.logo_url + '" class="w-full h-full object-contain rounded-full p-1" alt="Logo">';
    }

    // Sidebar
    const sidebarAppName = document.getElementById('sidebarAppName');
    const sidebarSchoolName = document.getElementById('sidebarSchoolName');
    if (sidebarAppName) sidebarAppName.textContent = appName;
    if (sidebarSchoolName) sidebarSchoolName.textContent = schoolName;

    // อัพเดทโลโก้ใน Sidebar
    const sidebarLogo = document.getElementById('sidebarLogo');
    if (sidebarLogo && AppState.config.logo_url) {
      sidebarLogo.innerHTML = '<img src="' + AppState.config.logo_url + '" class="w-full h-full object-contain rounded-lg p-0.5" alt="Logo">';
    }
  }

  // อัพเดท page title
  if (document.getElementById('pageTitle')) {
    document.getElementById('pageTitle').textContent = t(AppState.currentPage);
  }

  // รีเฟรชเมนู
  if (AppState.user) {
    renderSidebarMenu();
  }
}

// ==================== INITIALIZATION ====================
/**
 * เริ่มต้นระบบ
 */
async function initializeApp() {
  try {
    // โหลดภาษาจาก localStorage
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      AppState.language = savedLang;
    }

    // โหลด Config
    let configResult;
    try {
      configResult = await api.get('/api/config');
    } catch(e) {
      configResult = { status: 'error' };
    }

    if (configResult.status === 'success') {
      AppState.config = configResult.data;
      updateLoadingLogo();
    }

    // ตรวจสอบ Session
    const savedSession = api.getToken();
    const savedUser = localStorage.getItem('user');

    if (savedSession && savedUser) {
      let sessionResult;
      try {
        sessionResult = await api.get('/api/auth/session');
      } catch(e) {
        sessionResult = { valid: false };
      }

      if (sessionResult.valid) {
        AppState.user = JSON.parse(savedUser);
        AppState.user.sessionToken = savedSession;
        showMainApp();
      } else {
        api.removeToken();
        localStorage.removeItem('user');
        showLoginPage();
      }
    } else {
      showLoginPage();
    }

    updateLanguageUI();
    hideLoading();
  } catch (error) {
    console.error('Initialize error:', error);
    hideLoading();
    showLoginPage();
  }
}

// ==================== AUTHENTICATION ====================
/**
 * สลับ Tab Login
 */
function switchLoginTab(role) {
  AppState.loginRole = role;

  document.querySelectorAll('.login-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  document.getElementById(`tab${role.charAt(0).toUpperCase() + role.slice(1)}`).classList.add('active');

  // แสดง/ซ่อน ลิงก์สมัครสมาชิก
  document.getElementById('registerLink').classList.toggle('hidden', role !== 'user');
}

/**
 * เข้าสู่ระบบ
 */
async function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!username || !password) {
    showAlert('error', t('error'), AppState.language === 'th' ? 'กรุณากรอกข้อมูลให้ครบ' : 'Please fill in all fields');
    return;
  }

  showLoading();

  try {
    let result;
    try {
      result = await api.post('/api/auth/login', {username, password, role: AppState.loginRole});
    } catch(err) {
      result = { status: 'error', message: err.message };
    }

    hideLoading();

    if (result.status === 'success') {
      AppState.user = result.data;
      api.setToken(result.data.sessionToken);
      localStorage.setItem('sessionToken', result.data.sessionToken);
      localStorage.setItem('user', JSON.stringify(result.data));

      showMainApp();
      showAlert('success', t('success'), result.message);
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

/**
 * แสดง Modal สมัครสมาชิก
 */
function showRegisterModal() {
  document.getElementById('registerModal').classList.remove('hidden');
  populateRegisterDropdowns();
}

/**
 * ปิด Modal สมัครสมาชิก
 */
function closeRegisterModal() {
  document.getElementById('registerModal').classList.add('hidden');
  document.getElementById('registerForm').reset();
}

/**
 * เติมข้อมูล Dropdown ในฟอร์มสมัครสมาชิก
 */
function populateRegisterDropdowns() {
  if (!AppState.config) return;

  const lang = AppState.language;
  const positions = lang === 'th' ? AppState.config.positions : AppState.config.positions_en;
  const gradeLevels = lang === 'th' ? AppState.config.grade_levels : AppState.config.grade_levels_en;

  // ตำแหน่ง
  const positionSelect = document.getElementById('regPosition');
  positionSelect.innerHTML = `<option value="">${lang === 'th' ? '-- เลือกตำแหน่ง --' : '-- Select Position --'}</option>`;
  positions.forEach((pos, i) => {
    positionSelect.innerHTML += `<option value="${AppState.config.positions[i]}">${pos}</option>`;
  });

  // สายชั้น
  const gradeSelect = document.getElementById('regGradeLevel');
  gradeSelect.innerHTML = `<option value="">${lang === 'th' ? '-- เลือกสายชั้น --' : '-- Select Grade Level --'}</option>`;
  gradeLevels.forEach((grade, i) => {
    gradeSelect.innerHTML += `<option value="${AppState.config.grade_levels[i]}">${grade}</option>`;
  });
}

/**
 * สมัครสมาชิก
 */
async function handleRegister(event) {
  event.preventDefault();

  // 1. ดึงค่าชื่อมาตรวจสอบก่อน
  const nameTh = document.getElementById('regName').value.trim();
  const nameEn = document.getElementById('regNameEn').value.trim();

  // 2. ตรวจสอบว่ากรอกอย่างน้อย 1 ชื่อหรือไม่
  if (!nameTh && !nameEn) {
    showAlert('error', t('error'), AppState.language === 'th' ? 'กรุณากรอกชื่อ-นามสกุล (ไทย หรือ อังกฤษ อย่างน้อย 1 ภาษา)' : 'Please enter Full Name (Thai or English)');
    return;
  }

  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;

  if (password !== confirmPassword) {
    showAlert('error', t('error'), AppState.language === 'th' ? 'รหัสผ่านไม่ตรงกัน' : 'Passwords do not match');
    return;
  }

  // ถ้าไม่มีชื่อไทย ให้ใช้ชื่ออังกฤษแทน (เพื่อให้มีข้อมูลแสดงผลในระบบ)
  const finalName = nameTh || nameEn;

  const userData = {
    username: document.getElementById('regUsername').value.trim(),
    password: password,
    name: finalName, // ใช้ชื่อที่ผ่านการตรวจสอบแล้ว
    name_en: nameEn,
    position: document.getElementById('regPosition').value,
    grade_level: document.getElementById('regGradeLevel').value,
    email: document.getElementById('regEmail').value.trim(),
    phone: document.getElementById('regPhone').value.trim()
  };

  showLoading();

  try {
    let result;
    try {
      result = await api.post('/api/auth/register', userData);
    } catch(err) {
      result = { status: 'error', message: err.message };
    }

    hideLoading();

    if (result.status === 'success') {
      closeRegisterModal();
      showAlert('success', t('success'), result.message);
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

/**
 * ออกจากระบบ
 */
async function handleLogout() {
  const confirm = await showConfirm(
    AppState.language === 'th' ? 'ออกจากระบบ' : 'Logout',
    AppState.language === 'th' ? 'คุณต้องการออกจากระบบหรือไม่?' : 'Do you want to logout?'
  );

  if (confirm.isConfirmed) {
    showLoading();

    try {
      await api.post('/api/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    }

    api.removeToken();
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('user');
    AppState.user = null;

    hideLoading();
    showLoginPage();
  }
}

// ==================== PAGE MANAGEMENT ====================
/**
 * แสดงหน้า Login
 */
function showLoginPage() {
  document.getElementById('loginPage').classList.remove('hidden');
  document.getElementById('mainApp').classList.add('hidden');

  // รีเซ็ตฟอร์ม
  document.getElementById('loginForm').reset();
  switchLoginTab('admin');
}

/**
 * แสดงแอพหลัก
 */
function showMainApp() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('mainApp').classList.remove('hidden');

  // อัพเดทข้อมูลผู้ใช้
  updateUserInfo();

  // รีเฟรชรูปโปรไฟล์จาก PersonalInfo
  refreshUserProfilePhoto();

  // สร้างเมนู
  renderSidebarMenu();

  // แสดงปุ่มตั้งค่าสำหรับ Admin
  if (AppState.user?.role === 'admin' || AppState.user?.role === 'staff') {
    document.getElementById('settingsMenuBtn').classList.remove('hidden');
  }

  // ไปหน้า Dashboard
  navigateTo('dashboard');
}

/**
 * อัพเดทข้อมูลผู้ใช้ใน UI
 */
function updateUserInfo() {
  const user = AppState.user;
  if (!user) return;

  const lang = AppState.language;
  const name = lang === 'th' ? user.name : (user.name_en || user.name);
  const roleText = t(user.role);

  // Sidebar
  document.getElementById('sidebarUserName').textContent = name;
  document.getElementById('sidebarUserRole').textContent = roleText;

  // Avatar
  if (user.profile_image) {
    document.getElementById('sidebarUserAvatar').innerHTML = `<img src="${user.profile_image}" class="w-full h-full rounded-full object-cover" alt="Profile">`;
    document.getElementById('headerUserAvatar').innerHTML = `<img src="${user.profile_image}" class="w-full h-full rounded-full object-cover" alt="Profile">`;
  }
}

/**
 * สร้างเมนู Sidebar
 */
function renderSidebarMenu() {
  const menu = document.getElementById('sidebarMenu');
  const role = AppState.user?.role;

  let menuItems = [
    {
      id: 'dashboard',
      icon: 'fi-rr-home',
      label: t('dashboard')
    }
  ];

  // เมนูสำหรับทุกคน
  menuItems.push({
    id: 'portfolio',
    icon: 'fi-rr-folder-open',
    label: t('portfolio'),
    submenu: [
      { id: 'personalInfo', label: t('personalInfo') },
      { id: 'education', label: t('education') },
      { id: 'scoutQualification', label: t('scoutQualification') }
    ]
  });

  // เมนูข้อมูลการปฏิบัติหน้าที่
  menuItems.push({
    id: 'dutyInfo',
    icon: 'fi-rr-briefcase',
    label: t('dutyInfo'),
    submenu: [
      { id: 'positionDuty', label: t('positionDuty') },
      { id: 'teachingSummary', label: t('teachingSummary') },
      { id: 'projectActivity', label: t('projectActivity') },
      { id: 'studentActivity', label: t('studentActivity') },
      { id: 'mediaProduction', label: t('mediaProduction') },
      { id: 'mediaUsage', label: t('mediaUsage') },
      { id: 'fieldTrip', label: t('fieldTrip') },
      { id: 'competition', label: t('competition') }
    ]
  });

  menuItems.push({
    id: 'selfDevelopment',
    icon: 'fi-rr-graduation-cap',
    label: t('selfDevelopment'),
    developing: true
  });

  menuItems.push({
    id: 'reports',
    icon: 'fi-rr-chart-pie',
    label: t('reports'),
    developing: true
  });

  // เมนูการประชุม (สำหรับทุกคน - ดูประชุมของตัวเอง)
  menuItems.push({
    id: 'meetings',
    icon: 'fi-rr-calendar-clock',
    label: t('meetings'),
    submenu: [
      { id: 'myMeetings', label: t('myMeetings') }
    ]
  });

  // เมนูจัดการประชุม (สำหรับ Admin, Staff, Head, Executive)
  if (role === 'admin' || role === 'staff' || role === 'head' || role === 'executive') {
    // หา meetings menu และเพิ่ม meetingManagement submenu
    const meetingsMenu = menuItems.find(m => m.id === 'meetings');
    if (meetingsMenu && meetingsMenu.submenu) {
      meetingsMenu.submenu.unshift({ id: 'meetingManagement', label: t('meetingManagement') });
    }
  }

  // เมนูประจำเวร (ทุก role)
  menuItems.push({
    id: 'duty',
    icon: 'fi-rr-calendar-check',
    label: t('dutyPatrol'),
    submenu: [
      { id: 'myDuty', label: t('myDuty') }
    ]
  });

  // เมนูจัดการตารางเวร (สำหรับ Admin, Staff, Head, Executive)
  if (role === 'admin' || role === 'staff' || role === 'head' || role === 'executive') {
    const dutyMenu = menuItems.find(m => m.id === 'duty');
    if (dutyMenu && dutyMenu.submenu) {
      dutyMenu.submenu.unshift({ id: 'dutyManagement', label: t('dutyManagement') });
    }
  }

  // เมนูสำหรับ Admin/Staff
  if (role === 'admin' || role === 'staff') {
    menuItems.push({
      id: 'members',
      icon: 'fi-rr-users',
      label: t('members')
    });

    // เพิ่มเมนู Audit Log
    menuItems.push({
      id: 'auditLog',
      icon: 'fi-rr-time-past',
      label: t('auditLog')
    });
  }

  // เมนูโปรไฟล์
  menuItems.push({
    id: 'profile',
    icon: 'fi-rr-user',
    label: t('profile')
  });

  // เมนูตั้งค่า (Admin only)
  if (role === 'admin') {
    menuItems.push({
      id: 'settings',
      icon: 'fi-rr-settings',
      label: t('settings')
    });
  }

  // Render menu
  menu.innerHTML = menuItems.map(item => {
    // ตรวจสอบว่า Sidebar ย่ออยู่หรือไม่ เพื่อกำหนด class เริ่มต้น
    const isSidebarCollapsed = document.getElementById('sidebar').classList.contains('w-20');
    const textClass = isSidebarCollapsed ? 'sidebar-text opacity-0 w-0 hidden' : 'sidebar-text opacity-100 transition-all duration-300';
    const arrowClass = isSidebarCollapsed ? 'hidden' : '';
    const badgeClass = isSidebarCollapsed ? 'hidden' : '';
    const tooltip = isSidebarCollapsed ? `title="${item.label}"` : ''; // เพิ่ม Tooltip เมื่อย่อ

    if (item.submenu) {
      return `
        <li class="relative group">
          <div class="menu-item ${AppState.currentPage === item.id ? 'active' : ''} flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all hover:bg-white/10" onclick="toggleSubmenu('${item.id}')" ${tooltip}>
            <i class="fi ${item.icon} text-xl w-6 text-center flex-shrink-0"></i>
            <span class="flex-1 ml-3 truncate ${textClass}">${item.label}</span>
            <i class="fi fi-rr-angle-small-down submenu-arrow transition-transform ml-auto ${arrowClass}" id="arrow-${item.id}"></i>
          </div>
          <ul class="submenu ${AppState.currentPage === item.id ? 'open' : ''} overflow-hidden max-h-0 transition-all duration-300 bg-black/20 rounded-lg mt-1 ml-2" id="submenu-${item.id}">
            ${item.submenu.map(sub => `
              <li class="submenu-item ${AppState.currentSubPage === sub.id ? 'active' : ''} hover:bg-white/5 cursor-pointer p-2 pl-3 text-sm text-gray-300 hover:text-white transition-colors whitespace-nowrap" onclick="navigateTo('${item.id}', '${sub.id}')">
                <div class="flex items-center gap-2">
                   <i class="fi fi-rr-circle-small text-[8px]"></i>
                   <span>${sub.label}</span>
                </div>
              </li>
            `).join('')}
          </ul>
        </li>
      `;
    } else if (item.developing) {
      return `
        <li class="relative group">
          <div class="menu-item opacity-60 flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all hover:bg-white/10" onclick="showDeveloping()" ${tooltip}>
            <i class="fi ${item.icon} text-xl w-6 text-center flex-shrink-0"></i>
            <span class="ml-3 truncate ${textClass}">${item.label}</span>
            <span class="badge badge-warning text-[10px] ml-auto px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 ${badgeClass}">${t('developing')}</span>
          </div>
        </li>
      `;
    } else {
      return `
        <li class="relative group">
          <div class="menu-item ${AppState.currentPage === item.id ? 'active' : ''} flex items-center px-3 py-3 rounded-xl cursor-pointer transition-all hover:bg-white/10" onclick="navigateTo('${item.id}')" ${tooltip}>
            <i class="fi ${item.icon} text-xl w-6 text-center flex-shrink-0"></i>
            <span class="ml-3 truncate ${textClass}">${item.label}</span>
          </div>
        </li>
      `;
    }
  }).join('');
}

/**
 * สลับการแสดง Submenu
 */
function toggleSubmenu(menuId) {
  const sidebar = document.getElementById('sidebar');
  // ถ้า Sidebar ย่ออยู่ ให้ขยายออกก่อน
  if (sidebar.classList.contains('w-20')) {
    toggleSidebarCollapse();
    // รอ animation นิดนึงแล้วค่อยเปิดเมนู (Optional)
    setTimeout(() => {
        const submenu = document.getElementById(`submenu-${menuId}`);
        const arrow = document.getElementById(`arrow-${menuId}`);
        submenu.classList.toggle('open');
        arrow.style.transform = submenu.classList.contains('open') ? 'rotate(180deg)' : '';
    }, 100);
    return;
  }

  const submenu = document.getElementById(`submenu-${menuId}`);
  const arrow = document.getElementById(`arrow-${menuId}`);

  submenu.classList.toggle('open');
  arrow.style.transform = submenu.classList.contains('open') ? 'rotate(180deg)' : '';
}

/**
 * แสดงข้อความกำลังพัฒนา
 */
function showDeveloping() {
  showAlert('info', t('developing'), AppState.language === 'th' ? 'ฟังก์ชันนี้กำลังอยู่ในระหว่างการพัฒนา' : 'This feature is under development');
}

/**
 * นำทางไปยังหน้าต่างๆ
 */
function navigateTo(page, subPage = null) {
  AppState.currentPage = page;
  AppState.currentSubPage = subPage;

  // อัพเดท Page Title
  let title = t(subPage || page);
  document.getElementById('pageTitle').textContent = title;

  // อัพเดท Active Menu
  renderSidebarMenu();

  // ปิด Sidebar บน Mobile
  closeSidebarMobile();

  // ปิด User Menu
  closeUserMenu();

  // แสดง loading indicator ทันที (Modern Design)
  const content = document.getElementById('pageContent');
  content.innerHTML = `
    <div class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center">
        <!-- Animated Logo/Icon -->
        <div class="relative inline-flex items-center justify-center mb-6">
          <div class="absolute w-20 h-20 bg-gradient-to-r from-primary/20 to-blue-400/20 rounded-full animate-ping"></div>
          <div class="absolute w-16 h-16 bg-gradient-to-r from-primary/30 to-blue-400/30 rounded-full animate-pulse"></div>
          <div class="relative w-14 h-14 bg-gradient-to-br from-primary to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <i class="fi fi-rr-loading text-2xl text-white animate-spin"></i>
          </div>
        </div>

        <!-- Loading Text with Animation -->
        <div class="space-y-2">
          <p class="text-gray-700 font-semibold text-lg">${t('loading')}</p>
          <div class="flex justify-center gap-1">
            <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>

        <!-- Skeleton Preview -->
        <div class="mt-8 max-w-md mx-auto space-y-3 opacity-50">
          <div class="h-4 bg-gray-200 rounded-full w-3/4 mx-auto animate-pulse"></div>
          <div class="h-3 bg-gray-200 rounded-full w-1/2 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  `;

  // โหลดหน้า (ใช้ setTimeout เพื่อให้ loading แสดงก่อน)
  setTimeout(() => loadPage(page, subPage), 10);
}

/**
 * โหลดหน้า
 */
function loadPage(page, subPage) {
  const content = document.getElementById('pageContent');

  switch (page) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'portfolio':
      if (subPage === 'personalInfo') {
        loadPersonalInfo();
      } else if (subPage === 'education') {
        loadEducation();
      } else if (subPage === 'scoutQualification') {
        loadScoutQualification();
      }
      break;
    case 'dutyInfo':
      if (subPage === 'positionDuty') {
        loadPositionDuty();
      } else if (subPage === 'teachingSummary') {
        loadTeachingSummary();
      } else if (subPage === 'projectActivity') {
        loadProjectActivity();
      } else if (subPage === 'studentActivity') {
        loadStudentActivity();
      } else if (subPage === 'mediaProduction') {
        loadMediaProduction();
      } else if (subPage === 'mediaUsage') {
        loadMediaUsage();
      } else if (subPage === 'fieldTrip') {
        loadFieldTrip();
      } else if (subPage === 'competition') {
        loadCompetition();
      } else {
        content.innerHTML = getDevelopingPage();
      }
      break;
    case 'members':
      loadMembers();
      break;
    case 'auditLog':
      loadAuditLog();
      break;
    case 'meetings':
      if (subPage === 'meetingManagement') {
        loadMeetingManagement();
      } else if (subPage === 'myMeetings') {
        loadMyMeetings();
      } else {
        content.innerHTML = getDevelopingPage();
      }
      break;
    case 'duty':
      if (subPage === 'dutyManagement') {
        loadDutyManagement();
      } else if (subPage === 'myDuty') {
        loadMyDuty();
      } else {
        content.innerHTML = getDevelopingPage();
      }
      break;
    case 'profile':
      loadProfile();
      break;
    case 'settings':
      loadSettings();
      break;
    default:
      content.innerHTML = getDevelopingPage();
  }
}

/**
 * หน้ากำลังพัฒนา
 */
function getDevelopingPage() {
  return `
    <div class="flex items-center justify-center min-h-[60vh]">
      <div class="dev-badge max-w-md">
        <i class="fi fi-rr-hammer block"></i>
        <h3 class="text-xl font-bold text-gray-800 mb-2">${t('developing')}</h3>
        <p class="text-gray-600">${AppState.language === 'th' ? 'ฟังก์ชันนี้กำลังอยู่ในระหว่างการพัฒนา กรุณารอการอัพเดท' : 'This feature is currently under development. Please wait for updates.'}</p>
      </div>
    </div>
  `;
}

// ==================== SIDEBAR FUNCTIONS ====================
/**
 * สลับการแสดง Sidebar (Mobile)
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  sidebar.classList.toggle('-translate-x-full');
  overlay.classList.toggle('hidden');
}

/**
 * ปิด Sidebar บน Mobile
 */
function closeSidebarMobile() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (window.innerWidth < 1024) {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  }
}

// ==================== USER MENU ====================
/**
 * สลับการแสดง User Menu
 */
function toggleUserMenu() {
  document.getElementById('userDropdown').classList.toggle('hidden');
}

/**
 * ปิด User Menu
 */
function closeUserMenu() {
  document.getElementById('userDropdown').classList.add('hidden');
}

// ปิด Dropdown เมื่อคลิกที่อื่น
document.addEventListener('click', function(e) {
  if (!e.target.closest('#userDropdown') && !e.target.closest('[onclick="toggleUserMenu()"]')) {
    closeUserMenu();
  }
});

// ==================== MODAL FUNCTIONS ====================
/**
 * เปิด Data Modal
 */
function openDataModal(title, content) {
  document.getElementById('dataModalTitle').innerHTML = `<i class="fi fi-rr-document mr-2"></i><span>${title}</span>`;
  document.getElementById('dataModalContent').innerHTML = content;
  document.getElementById('dataModal').classList.remove('hidden');
}

/**
 * ปิด Data Modal
 */
function closeDataModal() {
  document.getElementById('dataModal').classList.add('hidden');
}

/**
 * รีเฟรชรูปโปรไฟล์จาก PersonalInfo
 */
async function refreshUserProfilePhoto() {
  try {
    const user = AppState.user;
    if (!user) return;

    let result;
    try {
      result = await api.get('/api/users/' + user.id + '/latest-photo');
    } catch(e) {
      result = null;
    }

    if (result) {
      // อัพเดทรูปใน AppState
      AppState.user.profile_image = result;
      localStorage.setItem('user', JSON.stringify(AppState.user));

      // อัพเดท UI
      updateUserInfo();
    }
  } catch (error) {
    console.error('Refresh profile photo error:', error);
  }
}

/**
 * สลับสถานะย่อ/ขยาย Sidebar
 */
function toggleSidebarCollapse() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const toggleIcon = document.getElementById('sidebarToggleIcon');
  const texts = document.querySelectorAll('.sidebar-text');
  const subMenuArrows = document.querySelectorAll('.submenu-arrow');
  const logo = document.getElementById('sidebarLogo');
  const avatar = document.getElementById('sidebarUserAvatar');
  const badges = document.querySelectorAll('.badge'); // Badge "กำลังพัฒนา"

  // ตรวจสอบสถานะปัจจุบัน
  const isCollapsed = sidebar.classList.contains('w-20');

  if (isCollapsed) {
    // ขยาย (Expand)
    sidebar.classList.remove('w-20');
    sidebar.classList.add('w-64');

    mainContent.classList.remove('lg:ml-20');
    mainContent.classList.add('lg:ml-64');

    toggleIcon.classList.remove('fi-rr-angle-small-right');
    toggleIcon.classList.add('fi-rr-angle-small-left');

    // แสดงข้อความ
    texts.forEach(el => {
      el.classList.remove('opacity-0', 'w-0', 'hidden');
      el.classList.add('opacity-100');
    });

    // แสดงลูกศร submenu
    subMenuArrows.forEach(el => el.classList.remove('hidden'));

    // แสดง Badge
    badges.forEach(el => el.classList.remove('hidden'));

    // ปรับ Logo/Avatar กลับสู่ปกติ
    logo.classList.remove('mx-auto');
    avatar.classList.remove('mx-auto');

  } else {
    // ย่อ (Collapse)
    sidebar.classList.remove('w-64');
    sidebar.classList.add('w-20');

    mainContent.classList.remove('lg:ml-64');
    mainContent.classList.add('lg:ml-20');

    toggleIcon.classList.remove('fi-rr-angle-small-left');
    toggleIcon.classList.add('fi-rr-angle-small-right');

    // ปิด Submenu ที่เปิดอยู่ทั้งหมดก่อนย่อ
    document.querySelectorAll('.submenu.open').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.submenu-arrow').forEach(el => el.style.transform = '');

    // ซ่อนข้อความ
    texts.forEach(el => {
      el.classList.remove('opacity-100');
      el.classList.add('opacity-0', 'w-0', 'hidden');
    });

    // ซ่อนลูกศร submenu
    subMenuArrows.forEach(el => el.classList.add('hidden'));

    // ซ่อน Badge
    badges.forEach(el => el.classList.add('hidden'));

    // จัด Logo/Avatar ให้อยู่ตรงกลาง
    logo.classList.add('mx-auto');
    avatar.classList.add('mx-auto');
  }

  // บันทึกสถานะลง AppState (ถ้าต้องการ)
  AppState.isSidebarCollapsed = !isCollapsed;
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
