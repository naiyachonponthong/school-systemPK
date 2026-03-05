/**
 * Personnel Management System - JavaScript Part 4
 * Members, Profile, Settings
 */
// ==================== MEMBERS ====================
async function loadMembers() {
  var content = document.getElementById('pageContent');
  var lang = AppState.language;
  var currentUserRole = AppState.user ? AppState.user.role : 'user';

  content.innerHTML = '<div class="fade-in">' +
    '<div class="section-header flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">' +
    '<h2 class="text-2xl font-bold text-primary flex items-center">' +
    '<span class="bg-gray-100 text-gray-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">' +
    '<i class="fi fi-rr-users"></i></span>' + t('members') + '</h2>' +
    (currentUserRole === 'admin' ? '<button onclick="showAddMemberForm()" class="btn-primary"><i class="fi fi-rr-user-add mr-2"></i>' + (lang === 'th' ? 'เพิ่มสมาชิก' : 'Add Member') + '</button>' : '') +
    '</div>' +

    // Filter
    '<div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">' +
    '<div class="flex items-center mb-4"><div class="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></div>' +
    '<h3 class="font-bold text-gray-800 text-lg">' + (lang === 'th' ? 'ค้นหาสมาชิก' : 'Search Members') + '</h3></div>' +
    '<div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">' +
    '<div class="md:col-span-3"><label class="block text-sm font-medium text-gray-700 mb-1">' + (lang === 'th' ? 'บทบาท' : 'Role') + '</label>' +
    '<select id="memberRoleFilter" class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg">' +
    '<option value="">' + (lang === 'th' ? '-- ทั้งหมด --' : '-- All --') + '</option>' +
    '<option value="admin">' + (lang === 'th' ? 'ผู้ดูแลระบบ' : 'Administrator') + '</option>' +
    '<option value="executive">' + (lang === 'th' ? 'ผู้บริหาร' : 'Executive') + '</option>' +
    '<option value="staff">' + (lang === 'th' ? 'เจ้าหน้าที่' : 'Staff') + '</option>' +
    '<option value="user">' + (lang === 'th' ? 'บุคลากร' : 'Personnel') + '</option>' +
    '</select></div>' +
    '<div class="md:col-span-7"><label class="block text-sm font-medium text-gray-700 mb-1">' + (lang === 'th' ? 'คำค้นหา' : 'Search') + '</label>' +
    '<input type="text" id="memberSearchInput" class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg" placeholder="' + (lang === 'th' ? 'ชื่อผู้ใช้, ชื่อ...' : 'Username, name...') + '" onkeypress="if(event.keyCode==13)filterMembers();"></div>' +
    '<div class="md:col-span-2"><button onclick="filterMembers()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2"><i class="fi fi-rr-search"></i><span>' + (lang === 'th' ? 'ค้นหา' : 'Search') + '</span></button></div>' +
    '</div></div>' +

    '<div id="membersContainer"><div class="py-12 flex justify-center"><div class="loading-spinner"></div></div></div></div>';

  loadMembersData();
}

function filterMembers() {
  loadMembersData();
}

async function loadMembersData() {
  try {
    var search = document.getElementById('memberSearchInput') ? document.getElementById('memberSearchInput').value : '';
    var roleFilter = document.getElementById('memberRoleFilter') ? document.getElementById('memberRoleFilter').value : '';
    var result = await api.get('/api/users?page=1&search=' + encodeURIComponent(search)).catch(function() { return { status: 'error', data: [] }; });

    var container = document.getElementById('membersContainer');
    var lang = AppState.language;
    var currentUserRole = AppState.user ? AppState.user.role : 'user';
    var data = result.data || [];

    // Filter by role if selected
    if (roleFilter) {
      data = data.filter(function(u) { return u.role === roleFilter; });
    }

    if (data.length === 0) {
      container.innerHTML = '<div class="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">' +
        '<div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 text-4xl"><i class="fi fi-rr-users"></i></div>' +
        '<h3 class="text-lg font-bold text-gray-700 mb-2">' + t('noData') + '</h3></div>';
      return;
    }

    var html = '<div class="bg-white rounded-xl shadow-sm border overflow-hidden">';

    // Desktop Table
    html += '<div class="hidden md:block overflow-x-auto"><table class="w-full"><thead class="bg-gray-50"><tr>';
    html += '<th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">#</th>';
    html += '<th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">' + (lang === 'th' ? 'ชื่อผู้ใช้' : 'Username') + '</th>';
    html += '<th class="px-4 py-3 text-left text-xs font-semibold text-gray-600">' + (lang === 'th' ? 'ชื่อ' : 'Name') + '</th>';
    html += '<th class="px-4 py-3 text-center text-xs font-semibold text-gray-600">' + (lang === 'th' ? 'บทบาท' : 'Role') + '</th>';
    html += '<th class="px-4 py-3 text-center text-xs font-semibold text-gray-600">' + (lang === 'th' ? 'สถานะ' : 'Status') + '</th>';
    html += '<th class="px-4 py-3 text-center text-xs font-semibold text-gray-600">' + (lang === 'th' ? 'จัดการ' : 'Actions') + '</th>';
    html += '</tr></thead><tbody>';

    for (var i = 0; i < data.length; i++) {
      var user = data[i];
      var roleClass = getRoleBadgeClass(user.role);

      html += '<tr class="border-t hover:bg-gray-50">';
      html += '<td class="px-4 py-3 text-sm text-gray-500">' + (i + 1) + '</td>';
      html += '<td class="px-4 py-3"><span class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">' + user.username + '</span></td>';
      html += '<td class="px-4 py-3 font-medium">' + (user.name || '-') + '</td>';
      html += '<td class="px-4 py-3 text-center"><span class="px-3 py-1 rounded-full text-xs font-medium ' + roleClass + '">' + t(user.role) + '</span></td>';
      html += '<td class="px-4 py-3 text-center"><span class="px-3 py-1 rounded-full text-xs font-medium ' + (user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') + '">' + (user.active ? (lang === 'th' ? 'ใช้งาน' : 'Active') : (lang === 'th' ? 'ระงับ' : 'Inactive')) + '</span></td>';
      html += '<td class="px-4 py-3 text-center">';
      html += '<div class="flex items-center justify-center gap-2">';

      // ปุ่มดูข้อมูล - สำหรับ admin, executive, staff
      if (currentUserRole === 'admin' || currentUserRole === 'executive' || currentUserRole === 'staff') {
        html += '<button onclick="viewMemberData(\'' + user.id + '\')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="' + (lang === 'th' ? 'ดูข้อมูล' : 'View Data') + '"><i class="fi fi-rr-eye"></i></button>';
      }

      // ปุ่มแก้ไข - สำหรับ admin เท่านั้น
      if (currentUserRole === 'admin') {
        html += '<button onclick="editMember(\'' + user.id + '\')" class="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="' + (lang === 'th' ? 'แก้ไข' : 'Edit') + '"><i class="fi fi-rr-edit"></i></button>';
        html += '<button onclick="toggleMemberStatus(\'' + user.id + '\', ' + user.active + ')" class="p-2 ' + (user.active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50') + ' rounded-lg" title="' + (user.active ? (lang === 'th' ? 'ระงับ' : 'Suspend') : (lang === 'th' ? 'เปิดใช้งาน' : 'Activate')) + '"><i class="fi ' + (user.active ? 'fi-rr-ban' : 'fi-rr-check') + '"></i></button>';
      }

      html += '</div></td></tr>';
    }

    html += '</tbody></table></div>';

    // Mobile Cards
    html += '<div class="md:hidden divide-y">';
    for (var j = 0; j < data.length; j++) {
      var u = data[j];
      var rClass = getRoleBadgeClass(u.role);

      html += '<div class="p-4">';
      html += '<div class="flex items-center justify-between mb-3">';
      html += '<div class="flex items-center gap-3">';
      html += '<div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"><i class="fi fi-rr-user"></i></div>';
      html += '<div><h4 class="font-bold text-gray-800">' + (u.name || u.username) + '</h4>';
      html += '<span class="text-sm text-gray-500">@' + u.username + '</span></div></div>';
      html += '<span class="px-2 py-1 rounded-full text-xs font-medium ' + (u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') + '">' + (u.active ? '●' : '○') + '</span>';
      html += '</div>';
      html += '<div class="flex items-center justify-between">';
      html += '<span class="px-3 py-1 rounded-full text-xs font-medium ' + rClass + '">' + t(u.role) + '</span>';
      html += '<div class="flex gap-2">';
      if (currentUserRole === 'admin' || currentUserRole === 'executive' || currentUserRole === 'staff') {
        html += '<button onclick="viewMemberData(\'' + u.id + '\')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><i class="fi fi-rr-eye"></i></button>';
      }
      if (currentUserRole === 'admin') {
        html += '<button onclick="editMember(\'' + u.id + '\')" class="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"><i class="fi fi-rr-edit"></i></button>';
      }
      html += '</div></div></div>';
    }
    html += '</div>';

    html += '</div>';

    // Role Legend
    html += '<div class="mt-4 p-4 bg-gray-50 rounded-xl">';
    html += '<h4 class="font-semibold text-gray-700 mb-3">' + (lang === 'th' ? 'คำอธิบายบทบาท' : 'Role Description') + '</h4>';
    html += '<div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">';
    html += '<div class="flex items-center gap-2"><span class="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">' + (lang === 'th' ? 'ผู้ดูแลระบบ' : 'Admin') + '</span><span class="text-gray-600">' + (lang === 'th' ? 'จัดการทุกอย่าง' : 'Manage everything') + '</span></div>';
    html += '<div class="flex items-center gap-2"><span class="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">' + (lang === 'th' ? 'ผู้บริหาร' : 'Executive') + '</span><span class="text-gray-600">' + (lang === 'th' ? 'ดูข้อมูลบุคลากร' : 'View personnel data') + '</span></div>';
    html += '<div class="flex items-center gap-2"><span class="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">' + (lang === 'th' ? 'เจ้าหน้าที่' : 'Staff') + '</span><span class="text-gray-600">' + (lang === 'th' ? 'ดูข้อมูลบุคลากร' : 'View personnel data') + '</span></div>';
    html += '<div class="flex items-center gap-2"><span class="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">' + (lang === 'th' ? 'บุคลากร' : 'Personnel') + '</span><span class="text-gray-600">' + (lang === 'th' ? 'จัดการข้อมูลตนเอง' : 'Manage own data') + '</span></div>';
    html += '</div></div>';

    container.innerHTML = html;
  } catch (error) { console.error('Load members error:', error); }
}

function getRoleBadgeClass(role) {
  switch(role) {
    case 'admin': return 'bg-red-100 text-red-700';
    case 'executive': return 'bg-purple-100 text-purple-700';
    case 'staff': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-200 text-gray-700';
  }
}

// แสดงฟอร์มเพิ่มสมาชิก (ปรับปรุงใหม่)
function showAddMemberForm() {
  var lang = AppState.language;
  var config = AppState.config || {};
  var positions = config.positions || [];
  var gradeLevels = config.grade_levels || [];

  var formHtml = '<form id="addMemberForm" onsubmit="saveNewMember(event)" class="space-y-6">';

  // แถวที่ 1: Username & Password
  formHtml += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
  formHtml += '<div><label class="form-label"><i class="fi fi-rr-user mr-2 text-blue-600"></i>' + (lang === 'th' ? 'ชื่อผู้ใช้' : 'Username') + ' <span class="text-red-500">*</span></label>';
  formHtml += '<input type="text" id="newUsername" class="form-input" required placeholder="' + (lang === 'th' ? 'ภาษาอังกฤษเท่านั้น' : 'English only') + '"></div>';
  formHtml += '<div><label class="form-label"><i class="fi fi-rr-lock mr-2 text-blue-600"></i>' + (lang === 'th' ? 'รหัสผ่าน' : 'Password') + ' <span class="text-red-500">*</span></label>';
  formHtml += '<input type="password" id="newPassword" class="form-input" required></div>';
  formHtml += '</div>';

  // แถวที่ 2: ชื่อ-นามสกุล
  formHtml += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
  formHtml += '<div><label class="form-label"><i class="fi fi-rr-id-card-clip-alt mr-2 text-blue-600"></i>' + (lang === 'th' ? 'ชื่อ-นามสกุล (ไทย)' : 'Full Name (Thai)') + '</label>';
  formHtml += '<input type="text" id="newName" class="form-input"></div>';
  formHtml += '<div><label class="form-label"><i class="fi fi-rr-id-card-clip-alt mr-2 text-blue-600"></i>' + (lang === 'th' ? 'ชื่อ-นามสกุล (อังกฤษ)' : 'Full Name (English)') + '</label>';
  formHtml += '<input type="text" id="newNameEn" class="form-input"></div>';
  formHtml += '</div>';

  // แถวที่ 3: ตำแหน่ง & สายชั้น (ดึงจาก Config)
  formHtml += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';

  // ส่วนของตำแหน่ง
  formHtml += '<div><label class="form-label"><i class="fi fi-rr-briefcase mr-2 text-blue-600"></i>' + (lang === 'th' ? 'ตำแหน่ง' : 'Position') + ' <span class="text-red-500">*</span></label>';
  formHtml += '<select id="newPosition" class="form-input" required>';
  formHtml += '<option value="">' + (lang === 'th' ? '-- เลือกตำแหน่ง --' : '-- Select Position --') + '</option>';
  positions.forEach(function(pos) {
    formHtml += '<option value="' + pos + '">' + pos + '</option>';
  });
  formHtml += '</select></div>';

  // ส่วนของสายชั้น
  formHtml += '<div><label class="form-label"><i class="fi fi-rr-graduation-cap mr-2 text-blue-600"></i>' + (lang === 'th' ? 'สายชั้น' : 'Grade Level') + ' <span class="text-red-500">*</span></label>';
  formHtml += '<select id="newGradeLevel" class="form-input" required>';
  formHtml += '<option value="">' + (lang === 'th' ? '-- เลือกสายชั้น --' : '-- Select Grade --') + '</option>';
  gradeLevels.forEach(function(grade) {
    formHtml += '<option value="' + grade + '">' + grade + '</option>';
  });
  formHtml += '</select></div>';
  formHtml += '</div>';

  // แถวที่ 4: บทบาท & อีเมล
  formHtml += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
  formHtml += '<div><label class="form-label"><i class="fi fi-rr-shield-check mr-2 text-blue-600"></i>' + (lang === 'th' ? 'สิทธิ์การใช้งาน (Role)' : 'Role') + ' <span class="text-red-500">*</span></label>';
  formHtml += '<select id="newRole" class="form-input" required>';
  formHtml += '<option value="user">' + (lang === 'th' ? 'บุคลากร (User)' : 'Personnel') + '</option>';
  formHtml += '<option value="staff">' + (lang === 'th' ? 'เจ้าหน้าที่ (Staff)' : 'Staff') + '</option>';
  formHtml += '<option value="executive">' + (lang === 'th' ? 'ผู้บริหาร (Executive)' : 'Executive') + '</option>';
  formHtml += '<option value="admin">' + (lang === 'th' ? 'ผู้ดูแลระบบ (Admin)' : 'Administrator') + '</option>';
  formHtml += '</select></div>';
  formHtml += '<div><label class="form-label"><i class="fi fi-rr-envelope mr-2 text-blue-600"></i>' + (lang === 'th' ? 'อีเมล' : 'Email') + '</label>';
  formHtml += '<input type="email" id="newEmail" class="form-input"></div>';
  formHtml += '</div>';

  formHtml += '<div class="flex justify-end gap-3 pt-4 border-t">';
  formHtml += '<button type="button" onclick="closeDataModal()" class="btn-secondary"><i class="fi fi-rr-cross-small mr-1"></i>' + t('cancel') + '</button>';
  formHtml += '<button type="submit" class="btn-primary"><i class="fi fi-rr-check mr-1"></i>' + t('save') + '</button>';
  formHtml += '</div></form>';

  openDataModal(lang === 'th' ? 'เพิ่มสมาชิกใหม่' : 'Add New Member', formHtml);
}

async function saveNewMember(event) {
  event.preventDefault();
  showLoading();

  var data = {
    username: document.getElementById('newUsername').value.trim().toLowerCase(),
    password: document.getElementById('newPassword').value,
    name: document.getElementById('newName').value,
    name_en: document.getElementById('newNameEn').value,
    position: document.getElementById('newPosition').value, // เพิ่มตำแหน่ง
    grade_level: document.getElementById('newGradeLevel').value, // เพิ่มสายชั้น
    role: document.getElementById('newRole').value,
    email: document.getElementById('newEmail').value,
    active: true
  };

  try {
    var result = await api.post('/api/users', data).catch(function(err) { return { status: 'error', message: err.message }; });

    hideLoading();
    if (result.status === 'success') {
      closeDataModal();
      showAlert('success', t('success'), AppState.language === 'th' ? 'เพิ่มสมาชิกสำเร็จ' : 'Member added successfully');
      loadMembersData();
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

async function editMember(userId) {
  showLoading();
  var lang = AppState.language;
  var config = AppState.config || {};
  var positions = config.positions || [];
  var gradeLevels = config.grade_levels || [];

  try {
    // ดึงข้อมูลผู้ใช้จาก Server
    var result = await api.get('/api/users/' + userId).catch(function() { return { status: 'error' }; });
    hideLoading();

    if (result.status !== 'success') {
      showAlert('error', t('error'), lang === 'th' ? 'ไม่พบข้อมูลสมาชิก' : 'Member not found');
      return;
    }

    var user = result.data;

    var formHtml = '<form id="editMemberForm" onsubmit="updateMember(event)" class="space-y-6">';
    formHtml += '<input type="hidden" id="editUserId" value="' + user.id + '">';

    // แถวที่ 1: ชื่อผู้ใช้ (แก้ไขไม่ได้) & รหัสผ่านใหม่
    formHtml += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
    formHtml += '<div><label class="form-label"><i class="fi fi-rr-user mr-2 text-blue-600"></i>' + (lang === 'th' ? 'ชื่อผู้ใช้' : 'Username') + '</label>';
    formHtml += '<input type="text" class="form-input bg-gray-100" value="' + user.username + '" disabled></div>';
    formHtml += '<div><label class="form-label"><i class="fi fi-rr-lock mr-2 text-blue-600"></i>' + (lang === 'th' ? 'รหัสผ่านใหม่' : 'New Password') + '</label>';
    formHtml += '<input type="password" id="editPassword" class="form-input" placeholder="' + (lang === 'th' ? 'เว้นว่างถ้าไม่เปลี่ยน' : 'Leave empty to keep current') + '"></div>';
    formHtml += '</div>';

    // แถวที่ 2: ชื่อ-นามสกุล
    formHtml += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
    formHtml += '<div><label class="form-label"><i class="fi fi-rr-id-card-clip-alt mr-2 text-blue-600"></i>' + (lang === 'th' ? 'ชื่อ-นามสกุล (ไทย)' : 'Full Name (Thai)') + '</label>';
    formHtml += '<input type="text" id="editName" class="form-input" value="' + (user.name || '') + '"></div>';
    formHtml += '<div><label class="form-label"><i class="fi fi-rr-id-card-clip-alt mr-2 text-blue-600"></i>' + (lang === 'th' ? 'ชื่อ-นามสกุล (อังกฤษ)' : 'Full Name (English)') + '</label>';
    formHtml += '<input type="text" id="editNameEn" class="form-input" value="' + (user.name_en || '') + '"></div>';
    formHtml += '</div>';

    // แถวที่ 3: ตำแหน่ง & สายชั้น (ดึงจาก Config)
    formHtml += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';

    // ส่วนของตำแหน่ง
    formHtml += '<div><label class="form-label"><i class="fi fi-rr-briefcase mr-2 text-blue-600"></i>' + (lang === 'th' ? 'ตำแหน่ง' : 'Position') + '</label>';
    formHtml += '<select id="editPosition" class="form-input">';
    formHtml += '<option value="">-- ' + (lang === 'th' ? 'เลือกตำแหน่ง' : 'Select Position') + ' --</option>';
    positions.forEach(function(pos) {
      var selected = (user.position === pos) ? ' selected' : '';
      formHtml += '<option value="' + pos + '"' + selected + '>' + pos + '</option>';
    });
    formHtml += '</select></div>';

    // ส่วนของสายชั้น
    formHtml += '<div><label class="form-label"><i class="fi fi-rr-graduation-cap mr-2 text-blue-600"></i>' + (lang === 'th' ? 'สายชั้น' : 'Grade Level') + '</label>';
    formHtml += '<select id="editGradeLevel" class="form-input">';
    formHtml += '<option value="">-- ' + (lang === 'th' ? 'เลือกสายชั้น' : 'Select Grade') + ' --</option>';
    gradeLevels.forEach(function(grade) {
      var selected = (user.grade_level === grade) ? ' selected' : '';
      formHtml += '<option value="' + grade + '"' + selected + '>' + grade + '</option>';
    });
    formHtml += '</select></div>';
    formHtml += '</div>';

    // แถวที่ 4: บทบาท & อีเมล
    formHtml += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
    formHtml += '<div><label class="form-label"><i class="fi fi-rr-shield-check mr-2 text-blue-600"></i>' + (lang === 'th' ? 'บทบาท' : 'Role') + '</label>';
    formHtml += '<select id="editRole" class="form-input">';
    formHtml += '<option value="user"' + (user.role === 'user' ? ' selected' : '') + '>' + (lang === 'th' ? 'บุคลากร' : 'Personnel') + '</option>';
    formHtml += '<option value="staff"' + (user.role === 'staff' ? ' selected' : '') + '>' + (lang === 'th' ? 'เจ้าหน้าที่' : 'Staff') + '</option>';
    formHtml += '<option value="executive"' + (user.role === 'executive' ? ' selected' : '') + '>' + (lang === 'th' ? 'ผู้บริหาร' : 'Executive') + '</option>';
    formHtml += '<option value="admin"' + (user.role === 'admin' ? ' selected' : '') + '>' + (lang === 'th' ? 'ผู้ดูแลระบบ' : 'Administrator') + '</option>';
    formHtml += '</select></div>';
    formHtml += '<div><label class="form-label"><i class="fi fi-rr-envelope mr-2 text-blue-600"></i>' + (lang === 'th' ? 'อีเมล' : 'Email') + '</label>';
    formHtml += '<input type="email" id="editEmail" class="form-input" value="' + (user.email || '') + '"></div>';
    formHtml += '</div>';

    formHtml += '<div class="flex justify-end gap-3 pt-4 border-t">';
    formHtml += '<button type="button" onclick="closeDataModal()" class="btn-secondary"><i class="fi fi-rr-cross-small mr-1"></i>' + t('cancel') + '</button>';
    formHtml += '<button type="submit" class="btn-primary"><i class="fi fi-rr-check mr-1"></i>' + t('save') + '</button>';
    formHtml += '</div></form>';

    openDataModal(lang === 'th' ? 'แก้ไขข้อมูลสมาชิก' : 'Edit Member', formHtml);
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

async function updateMember(event) {
  event.preventDefault();
  showLoading();

  var data = {
    id: document.getElementById('editUserId').value,
    name: document.getElementById('editName').value,
    name_en: document.getElementById('editNameEn').value,
    position: document.getElementById('editPosition').value, // เพิ่มตำแหน่ง
    grade_level: document.getElementById('editGradeLevel').value, // เพิ่มสายชั้น
    role: document.getElementById('editRole').value,
    email: document.getElementById('editEmail').value
  };

  // ถ้ามีการกรอกรหัสผ่านใหม่ ให้ส่งไปด้วย
  var newPassword = document.getElementById('editPassword').value;
  if (newPassword) {
    data.password = newPassword;
  }

  try {
    var result = await api.put('/api/users/' + data.id, data).catch(function(err) { return { status: 'error', message: err.message }; });

    hideLoading();

    if (result.status === 'success') {
      closeDataModal();
      showAlert('success', t('success'), AppState.language === 'th' ? 'อัปเดตข้อมูลสำเร็จ' : 'Updated successfully');
      loadMembersData(); // รีเฟรชตารางสมาชิก
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

async function toggleMemberStatus(userId, currentStatus) {
  var lang = AppState.language;
  var confirmResult = await showConfirm(
    currentStatus ? (lang === 'th' ? 'ระงับการใช้งาน' : 'Suspend User') : (lang === 'th' ? 'เปิดใช้งาน' : 'Activate User'),
    currentStatus ? (lang === 'th' ? 'ต้องการระงับสมาชิกนี้?' : 'Suspend this member?') : (lang === 'th' ? 'ต้องการเปิดใช้งานสมาชิกนี้?' : 'Activate this member?')
  );

  if (confirmResult.isConfirmed) {
    showLoading();
    try {
      var result = await api.put('/api/users/' + userId, { id: userId, active: !currentStatus }).catch(function(err) { return { status: 'error', message: err.message }; });
      hideLoading();
      if (result.status === 'success') {
        showAlert('success', t('success'), lang === 'th' ? 'อัพเดทสถานะสำเร็จ' : 'Status updated');
        loadMembersData();
      }
    } catch (error) {
      hideLoading();
    }
  }
}

// ดูข้อมูลบุคลากร
async function viewMemberData(userId) {
  showLoading();
  var lang = AppState.language;

  try {
    var result = await api.get('/api/users/' + userId).catch(function() { return { status: 'error' }; });
    hideLoading();

    if (result.status !== 'success') {
      showAlert('error', t('error'), lang === 'th' ? 'ไม่พบข้อมูล' : 'Data not found');
      return;
    }

    var user = result.data;

    // เก็บ user ที่กำลังดูไว้ใน AppState
    AppState.viewingUser = user;

    // สร้าง Modal แสดงข้อมูล
    var html = '<div class="space-y-6">';

    // Profile Header
    html += '<div class="bg-gradient-to-r from-primary to-primary-light rounded-xl p-6 text-center text-white">';
    html += '<div class="w-20 h-20 mx-auto mb-3 bg-white rounded-full flex items-center justify-center">';
    html += user.profile_image ? '<img src="' + user.profile_image + '" class="w-full h-full rounded-full object-cover">' : '<i class="fi fi-sr-user text-3xl text-primary"></i>';
    html += '</div>';
    html += '<h3 class="text-xl font-bold">' + (user.name || user.username) + '</h3>';
    html += '<p class="text-secondary">@' + user.username + '</p>';
    html += '<span class="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">' + t(user.role) + '</span>';
    html += '</div>';

    // Quick Links
    html += '<div class="grid grid-cols-2 md:grid-cols-4 gap-3">';
    html += '<button onclick="viewMemberSection(\'' + userId + '\', \'personalInfo\')" class="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl text-center transition-colors">';
    html += '<i class="fi fi-rr-user text-2xl text-blue-600 mb-2"></i>';
    html += '<p class="text-sm font-medium text-gray-700">' + (lang === 'th' ? 'ประวัติส่วนตัว' : 'Personal Info') + '</p></button>';

    html += '<button onclick="viewMemberSection(\'' + userId + '\', \'education\')" class="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl text-center transition-colors">';
    html += '<i class="fi fi-rr-graduation-cap text-2xl text-purple-600 mb-2"></i>';
    html += '<p class="text-sm font-medium text-gray-700">' + (lang === 'th' ? 'ประวัติการศึกษา' : 'Education') + '</p></button>';

    html += '<button onclick="viewMemberSection(\'' + userId + '\', \'dutyInfo\')" class="p-4 bg-amber-50 hover:bg-amber-100 rounded-xl text-center transition-colors">';
    html += '<i class="fi fi-rr-briefcase text-2xl text-amber-600 mb-2"></i>';
    html += '<p class="text-sm font-medium text-gray-700">' + (lang === 'th' ? 'ข้อมูลการปฏิบัติหน้าที่' : 'Duty Info') + '</p></button>';

    html += '<button onclick="viewMemberSection(\'' + userId + '\', \'scoutQualification\')" class="p-4 bg-green-50 hover:bg-green-100 rounded-xl text-center transition-colors">';
    html += '<i class="fi fi-rr-trophy text-2xl text-green-600 mb-2"></i>';
    html += '<p class="text-sm font-medium text-gray-700">' + (lang === 'th' ? 'คุณวุฒิลูกเสือ' : 'Scout Qualification') + '</p></button>';
    html += '</div>';

    // Contact Info
    html += '<div class="bg-gray-50 rounded-xl p-4">';
    html += '<h4 class="font-semibold text-gray-700 mb-3">' + (lang === 'th' ? 'ข้อมูลติดต่อ' : 'Contact Info') + '</h4>';
    html += '<div class="space-y-2 text-sm">';
    if (user.email) html += '<div class="flex items-center gap-2"><i class="fi fi-rr-envelope text-gray-400"></i><span>' + user.email + '</span></div>';
    if (user.phone) html += '<div class="flex items-center gap-2"><i class="fi fi-rr-phone-call text-gray-400"></i><span>' + user.phone + '</span></div>';
    html += '</div></div>';

    html += '<div class="flex justify-end">';
    html += '<button onclick="closeDataModal()" class="btn-secondary"><i class="fi fi-rr-cross-small mr-1"></i>' + (lang === 'th' ? 'ปิด' : 'Close') + '</button>';
    html += '</div></div>';

    openDataModal((lang === 'th' ? 'ข้อมูลบุคลากร: ' : 'Personnel Data: ') + (user.name || user.username), html);
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

async function viewMemberSection(userId, section) {
  closeDataModal();
  showLoading();

  // เก็บ user id ที่กำลังดู
  AppState.viewingUserId = userId;

  // ไปยังหน้าที่ต้องการพร้อม param บอกว่ากำลังดูข้อมูลคนอื่น
  setTimeout(function() {
    hideLoading();
    if (section === 'personalInfo') {
      navigateTo('portfolio', 'personalInfo');
    } else if (section === 'education') {
      navigateTo('portfolio', 'education');
    } else if (section === 'dutyInfo') {
      navigateTo('dutyInfo', 'positionDuty');
    } else if (section === 'scoutQualification') {
      navigateTo('portfolio', 'scoutQualification');
    }
  }, 300);
}

// ==================== PROFILE ====================
async function loadProfile() {
  var content = document.getElementById('pageContent');
  var lang = AppState.language;
  var user = AppState.user || {};

  content.innerHTML = '<div class="fade-in">' +
    // Profile Header Card
    '<div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">' +
    '<div class="bg-gradient-to-r from-primary to-primary-light p-8 text-center">' +
    '<div class="w-32 h-32 mx-auto mb-4 bg-white rounded-full flex items-center justify-center border-4 border-white/30 shadow-xl">' +
    (user.profile_image ? '<img src="' + user.profile_image + '" class="w-full h-full rounded-full object-cover">' : '<i class="fi fi-sr-user text-5xl text-primary"></i>') +
    '</div>' +
    '<h2 class="text-2xl font-bold text-white mb-1">' + (lang === 'th' ? user.name : (user.name_en || user.name)) + '</h2>' +
    '<p class="text-secondary text-lg font-medium mb-3">@' + user.username + '</p>' +
    '<div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">' +
    '<span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>' +
    '<span class="text-white font-medium">' + t(user.role || '') + '</span>' +
    '</div>' +
    '</div></div>' +

    // Main Content Grid
    '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">' +

    // Left Column - Profile Form
    '<div class="lg:col-span-2">' +
    '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">' +
    '<div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b flex items-center justify-between">' +
    '<div class="flex items-center gap-3">' +
    '<div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">' +
    '<i class="fi fi-rr-user-pen text-blue-600 text-xl"></i></div>' +
    '<h3 class="font-bold text-gray-800 text-lg">' + (lang === 'th' ? 'ข้อมูลส่วนตัว' : 'Personal Information') + '</h3>' +
    '</div>' +
    '<span class="text-xs text-gray-500">' + (lang === 'th' ? 'อัพเดทข้อมูลของคุณ' : 'Update your information') + '</span>' +
    '</div>' +

    '<div class="p-6">' +
    '<form id="profileForm" onsubmit="saveProfile(event)">' +
    '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">' +

    // ชื่อ (ไทย)
    '<div class="form-group">' +
    '<label class="form-label flex items-center gap-2">' +
    '<i class="fi fi-rr-user text-blue-500"></i>' +
    (lang === 'th' ? 'ชื่อ-นามสกุล (ไทย)' : 'Full Name (Thai)') +
    '</label>' +
    '<input type="text" id="profileName" class="form-input" value="' + (user.name || '') + '" placeholder="' + (lang === 'th' ? 'กรอกชื่อ-นามสกุล' : 'Enter full name') + '">' +
    '</div>' +

    // ชื่อ (อังกฤษ)
    '<div class="form-group">' +
    '<label class="form-label flex items-center gap-2">' +
    '<i class="fi fi-rr-user text-blue-500"></i>' +
    (lang === 'th' ? 'ชื่อ-นามสกุล (อังกฤษ)' : 'Full Name (English)') +
    '</label>' +
    '<input type="text" id="profileNameEn" class="form-input" value="' + (user.name_en || '') + '" placeholder="' + (lang === 'th' ? 'กรอกชื่อ-นามสกุล (ภาษาอังกฤษ)' : 'Enter full name (English)') + '">' +
    '</div>' +

    // Username (Read-only)
    '<div class="form-group">' +
    '<label class="form-label flex items-center gap-2">' +
    '<i class="fi fi-rr-at text-blue-500"></i>' +
    (lang === 'th' ? 'ชื่อผู้ใช้' : 'Username') +
    '</label>' +
    '<input type="text" class="form-input bg-gray-50" value="' + (user.username || '') + '" disabled>' +
    '<p class="text-xs text-gray-500 mt-1">' + (lang === 'th' ? 'ไม่สามารถเปลี่ยนชื่อผู้ใช้ได้' : 'Username cannot be changed') + '</p>' +
    '</div>' +

    // Role (Read-only)
    '<div class="form-group">' +
    '<label class="form-label flex items-center gap-2">' +
    '<i class="fi fi-rr-shield-check text-blue-500"></i>' +
    (lang === 'th' ? 'บทบาท' : 'Role') +
    '</label>' +
    '<input type="text" class="form-input bg-gray-50" value="' + t(user.role || '') + '" disabled>' +
    '</div>' +

    // อีเมล
    '<div class="form-group">' +
    '<label class="form-label flex items-center gap-2">' +
    '<i class="fi fi-rr-envelope text-blue-500"></i>' +
    (lang === 'th' ? 'อีเมล' : 'Email') +
    '</label>' +
    '<input type="email" id="profileEmail" class="form-input" value="' + (user.email || '') + '" placeholder="' + (lang === 'th' ? 'กรอกอีเมล' : 'Enter email') + '">' +
    '</div>' +

    // เบอร์โทร
    '<div class="form-group">' +
    '<label class="form-label flex items-center gap-2">' +
    '<i class="fi fi-rr-phone-call text-blue-500"></i>' +
    (lang === 'th' ? 'เบอร์โทรศัพท์' : 'Phone Number') +
    '</label>' +
    '<input type="tel" id="profilePhone" class="form-input" value="' + (user.phone || '') + '" placeholder="' + (lang === 'th' ? 'กรอกเบอร์โทรศัพท์' : 'Enter phone number') + '">' +
    '</div>' +

    // ตำแหน่ง (Read-only)
    '<div class="form-group">' +
    '<label class="form-label flex items-center gap-2">' +
    '<i class="fi fi-rr-briefcase text-blue-500"></i>' +
    (lang === 'th' ? 'ตำแหน่ง' : 'Position') +
    '</label>' +
    '<input type="text" class="form-input bg-gray-50" value="' + (user.position || '-') + '" disabled>' +
    '</div>' +

    // สายชั้น (Read-only)
    '<div class="form-group">' +
    '<label class="form-label flex items-center gap-2">' +
    '<i class="fi fi-rr-graduation-cap text-blue-500"></i>' +
    (lang === 'th' ? 'สายชั้น' : 'Grade Level') +
    '</label>' +
    '<input type="text" class="form-input bg-gray-50" value="' + (user.grade_level || '-') + '" disabled>' +
    '</div>' +

    '</div>' +

    // Save Button
    '<div class="mt-6 pt-6 border-t">' +
    '<button type="submit" class="w-full md:w-auto btn-primary px-8 py-3 text-base">' +
    '<i class="fi fi-rr-disk mr-2"></i>' + t('save') +
    '</button>' +
    '</div>' +

    '</form>' +
    '</div></div>' +

    // Change Password Card
    '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">' +
    '<div class="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b flex items-center gap-3">' +
    '<div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">' +
    '<i class="fi fi-rr-lock text-orange-600 text-xl"></i></div>' +
    '<h3 class="font-bold text-gray-800 text-lg">' + (lang === 'th' ? 'เปลี่ยนรหัสผ่าน' : 'Change Password') + '</h3>' +
    '</div>' +

    '<div class="p-6">' +
    '<form id="passwordForm" onsubmit="changePasswordSubmit(event)">' +
    '<div class="space-y-4">' +

    // รหัสผ่านเดิม
    '<div class="form-group">' +
    '<label class="form-label flex items-center gap-2">' +
    '<i class="fi fi-rr-key text-orange-500"></i>' +
    (lang === 'th' ? 'รหัสผ่านเดิม' : 'Current Password') + ' <span class="text-red-500">*</span>' +
    '</label>' +
    '<input type="password" id="oldPassword" class="form-input" required placeholder="' + (lang === 'th' ? 'กรอกรหัสผ่านเดิม' : 'Enter current password') + '">' +
    '</div>' +

    // รหัสผ่านใหม่
    '<div class="form-group">' +
    '<label class="form-label flex items-center gap-2">' +
    '<i class="fi fi-rr-lock text-orange-500"></i>' +
    (lang === 'th' ? 'รหัสผ่านใหม่' : 'New Password') + ' <span class="text-red-500">*</span>' +
    '</label>' +
    '<input type="password" id="newPassword" class="form-input" required minlength="6" placeholder="' + (lang === 'th' ? 'อย่างน้อย 6 ตัวอักษร' : 'At least 6 characters') + '">' +
    '<p class="text-xs text-gray-500 mt-1">' + (lang === 'th' ? 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' : 'Password must be at least 6 characters') + '</p>' +
    '</div>' +

    // ยืนยันรหัสผ่าน
    '<div class="form-group">' +
    '<label class="form-label flex items-center gap-2">' +
    '<i class="fi fi-rr-shield-check text-orange-500"></i>' +
    (lang === 'th' ? 'ยืนยันรหัสผ่านใหม่' : 'Confirm New Password') + ' <span class="text-red-500">*</span>' +
    '</label>' +
    '<input type="password" id="confirmNewPassword" class="form-input" required placeholder="' + (lang === 'th' ? 'กรอกรหัสผ่านอีกครั้ง' : 'Enter password again') + '">' +
    '</div>' +

    '</div>' +

    // Change Password Button
    '<div class="mt-6 pt-6 border-t">' +
    '<button type="submit" class="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">' +
    '<i class="fi fi-rr-key mr-2"></i>' + (lang === 'th' ? 'เปลี่ยนรหัสผ่าน' : 'Change Password') +
    '</button>' +
    '</div>' +

    '</form>' +
    '</div></div>' +
    '</div>' +

    // Right Column - Info Cards
    '<div class="lg:col-span-1 space-y-6">' +

    // Account Info Card
    '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">' +
    '<div class="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b">' +
    '<h3 class="font-bold text-gray-800 flex items-center gap-2">' +
    '<i class="fi fi-rr-info text-purple-600"></i>' +
    (lang === 'th' ? 'ข้อมูลบัญชี' : 'Account Info') +
    '</h3></div>' +
    '<div class="p-6 space-y-4">' +

    '<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">' +
    '<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">' +
    '<i class="fi fi-rr-user text-blue-600"></i></div>' +
    '<div class="flex-1 min-w-0">' +
    '<p class="text-xs text-gray-500">' + (lang === 'th' ? 'ชื่อผู้ใช้' : 'Username') + '</p>' +
    '<p class="font-semibold text-gray-800 truncate">@' + (user.username || '') + '</p>' +
    '</div></div>' +

    '<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">' +
    '<div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">' +
    '<i class="fi fi-rr-shield-check text-green-600"></i></div>' +
    '<div class="flex-1 min-w-0">' +
    '<p class="text-xs text-gray-500">' + (lang === 'th' ? 'บทบาท' : 'Role') + '</p>' +
    '<p class="font-semibold text-gray-800">' + t(user.role || '') + '</p>' +
    '</div></div>' +

    '<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">' +
    '<div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">' +
    '<i class="fi fi-rr-time-check text-purple-600"></i></div>' +
    '<div class="flex-1 min-w-0">' +
    '<p class="text-xs text-gray-500">' + (lang === 'th' ? 'เข้าสู่ระบบล่าสุด' : 'Last Login') + '</p>' +
    '<p class="font-semibold text-gray-800 text-sm">' + (user.last_login ? formatDate(user.last_login) : '-') + '</p>' +
    '</div></div>' +

    '</div></div>' +

    // Quick Actions Card
    '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">' +
    '<div class="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b">' +
    '<h3 class="font-bold text-gray-800 flex items-center gap-2">' +
    '<i class="fi fi-rr-bolt text-cyan-600"></i>' +
    (lang === 'th' ? 'เมนูด่วน' : 'Quick Actions') +
    '</h3></div>' +
    '<div class="p-6 space-y-3">' +

    '<button onclick="navigateTo(\'portfolio\', \'personalInfo\')" class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors text-left">' +
    '<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">' +
    '<i class="fi fi-rr-user text-blue-600"></i></div>' +
    '<span class="font-medium text-gray-700">' + t('personalInfo') + '</span>' +
    '<i class="fi fi-rr-angle-right ml-auto text-gray-400"></i>' +
    '</button>' +

    '<button onclick="navigateTo(\'portfolio\', \'education\')" class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors text-left">' +
    '<div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">' +
    '<i class="fi fi-rr-graduation-cap text-purple-600"></i></div>' +
    '<span class="font-medium text-gray-700">' + t('education') + '</span>' +
    '<i class="fi fi-rr-angle-right ml-auto text-gray-400"></i>' +
    '</button>' +

    '<button onclick="navigateTo(\'portfolio\', \'scoutQualification\')" class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors text-left">' +
    '<div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">' +
    '<i class="fi fi-rr-camping text-orange-600"></i></div>' +
    '<span class="font-medium text-gray-700">' + t('scoutQualification') + '</span>' +
    '<i class="fi fi-rr-angle-right ml-auto text-gray-400"></i>' +
    '</button>' +

    '</div></div>' +

    '</div>' +
    '</div></div>';
}

async function saveProfile(event) {
  event.preventDefault();
  showLoading();

  var user = AppState.user || {};

  var userData = {
    id: user.id,
    name: document.getElementById('profileName').value,
    name_en: document.getElementById('profileNameEn').value,
    email: document.getElementById('profileEmail').value,
    phone: document.getElementById('profilePhone').value
  };

  try {
    var result = await api.put('/api/users/' + userData.id, userData).catch(function(err) { return { status: 'error', message: err.message }; });

    hideLoading();
    if (result.status === 'success') {
      AppState.user = Object.assign({}, AppState.user, userData);
      localStorage.setItem('user', JSON.stringify(AppState.user));
      updateUserInfo();
      showAlert('success', t('success'), result.message);
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

async function changePasswordSubmit(event) {
  event.preventDefault();
  var newPassword = document.getElementById('newPassword').value;
  var confirmNewPassword = document.getElementById('confirmNewPassword').value;
  if (newPassword !== confirmNewPassword) { showAlert('error', t('error'), AppState.language === 'th' ? 'รหัสผ่านใหม่ไม่ตรงกัน' : 'Passwords do not match'); return; }
  showLoading();
  try { var user = AppState.user || {}; var result = await api.put('/api/users/' + user.id + '/change-password', { oldPassword: document.getElementById('oldPassword').value, newPassword: newPassword }); hideLoading(); if (result.status === 'success') { document.getElementById('passwordForm').reset(); showAlert('success', t('success'), result.message); } else { showAlert('error', t('error'), result.message); } } catch (error) { hideLoading(); showAlert('error', t('error'), error.message); }
}

// ==================== SETTINGS ====================
var settingsActiveTab = 'organization';

async function loadSettings() {
  var content = document.getElementById('pageContent');
  var lang = AppState.language;
  var config = AppState.config || {};

  content.innerHTML = '<div class="fade-in">' +
    // Header
    '<div class="bg-white rounded-2xl shadow-sm p-6 mb-6">' +
    '<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">' +
    '<div class="flex items-center gap-4">' +
    '<div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center"><i class="fi fi-rr-settings text-2xl text-blue-600"></i></div>' +
    '<div><h1 class="text-xl font-bold text-gray-800">' + (lang === 'th' ? 'ตั้งค่าระบบ' : 'System Settings') + '</h1>' +
    '<p class="text-gray-500 text-sm">' + (lang === 'th' ? 'กำหนดค่าพื้นฐานและข้อมูลหลักขององค์กร' : 'Configure organization settings') + '</p></div></div>' +
    '<button onclick="saveAllSettings()" class="btn-primary px-6 py-3 shadow-lg"><i class="fi fi-rr-disk mr-2"></i>' + (lang === 'th' ? 'บันทึกการตั้งค่าทั้งหมด' : 'Save All') + '</button>' +
    '</div></div>' +

    // Tabs
    '<div class="bg-white rounded-2xl shadow-sm overflow-hidden">' +
    '<div class="border-b border-gray-200">' +
    '<nav class="flex overflow-x-auto" id="settingsTabs">' +
    '<button onclick="switchSettingsTab(\'organization\')" class="settings-tab active flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2" data-tab="organization"><i class="fi fi-rr-building"></i><span>' + (lang === 'th' ? 'องค์กร' : 'Organization') + '</span></button>' +
    '<button onclick="switchSettingsTab(\'positions\')" class="settings-tab flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2" data-tab="positions"><i class="fi fi-rr-briefcase"></i><span>' + (lang === 'th' ? 'ตำแหน่ง' : 'Positions') + '</span></button>' +
    '<button onclick="switchSettingsTab(\'gradeLevels\')" class="settings-tab flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2" data-tab="gradeLevels"><i class="fi fi-rr-graduation-cap"></i><span>' + (lang === 'th' ? 'สายชั้น' : 'Grade Levels') + '</span></button>' +
    '<button onclick="switchSettingsTab(\'academicYears\')" class="settings-tab flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2" data-tab="academicYears"><i class="fi fi-rr-calendar"></i><span>' + (lang === 'th' ? 'ปีการศึกษา' : 'Academic Years') + '</span></button>' +
    '</nav></div>' +
    '<div id="settingsTabContent" class="p-6"></div>' +
    '</div></div>';

  // Add tab styles
  addSettingsTabStyles();

  // Load first tab
  switchSettingsTab('organization');
}

function addSettingsTabStyles() {
  if (!document.getElementById('settingsTabStyles')) {
    var style = document.createElement('style');
    style.id = 'settingsTabStyles';
    style.textContent = '.settings-tab { color: #6b7280; border-color: transparent; transition: all 0.2s; } .settings-tab:hover { color: #1c2b45; background-color: #f9fafb; } .settings-tab.active { color: #2563eb; border-color: #2563eb; background-color: #eff6ff; } .settings-list-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: white; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 12px; transition: all 0.2s; } .settings-list-item:hover { border-color: #2563eb; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1); }';
    document.head.appendChild(style);
  }
}

function switchSettingsTab(tabName) {
  settingsActiveTab = tabName;
  var lang = AppState.language;
  var config = AppState.config || {};

  // Update active tab
  var tabs = document.querySelectorAll('.settings-tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
    if (tabs[i].getAttribute('data-tab') === tabName) tabs[i].classList.add('active');
  }

  var contentContainer = document.getElementById('settingsTabContent');

  if (tabName === 'organization') {
    contentContainer.innerHTML = renderOrganizationTab(config, lang);
  } else if (tabName === 'positions') {
    contentContainer.innerHTML = renderListTab('positions', config.positions || [], lang, 'fi-rr-briefcase', 'blue', lang === 'th' ? 'ตำแหน่ง' : 'Position');
  } else if (tabName === 'gradeLevels') {
    contentContainer.innerHTML = renderListTab('gradeLevels', config.grade_levels || [], lang, 'fi-rr-graduation-cap', 'green', lang === 'th' ? 'สายชั้น' : 'Grade Level');
  } else if (tabName === 'academicYears') {
    contentContainer.innerHTML = renderAcademicYearsTab(config, lang);
  }
}

function renderOrganizationTab(config, lang) {
  return '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">' +
    '<div class="lg:col-span-2">' +
    '<div class="flex items-center gap-2 mb-4"><div class="w-1 h-6 bg-blue-600 rounded-full"></div><h3 class="font-bold text-gray-800">' + (lang === 'th' ? 'ข้อมูลพื้นฐาน' : 'Basic Info') + '</h3></div>' +
    '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' +

    // ชื่อระบบ (ไทย)
    '<div class="form-group"><label class="form-label">' + (lang === 'th' ? 'ชื่อระบบ (ไทย)' : 'System Name (Thai)') + '</label><input type="text" id="settAppName" class="form-input" value="' + (config.app_name || '') + '"></div>' +

    // ชื่อระบบ (อังกฤษ)
    '<div class="form-group"><label class="form-label">' + (lang === 'th' ? 'ชื่อระบบ (อังกฤษ)' : 'System Name (English)') + '</label><input type="text" id="settAppNameEn" class="form-input" value="' + (config.app_name_en || '') + '"></div>' +

    // ชื่อโรงเรียน (ไทย)
    '<div class="form-group"><label class="form-label">' + (lang === 'th' ? 'ชื่อโรงเรียน (ไทย)' : 'School Name (Thai)') + '</label><input type="text" id="settSchoolName" class="form-input" value="' + (config.school_name || '') + '"></div>' +

    // ชื่อโรงเรียน (อังกฤษ) - เพิ่มฟิลด์นี้
    '<div class="form-group"><label class="form-label">' + (lang === 'th' ? 'ชื่อโรงเรียน (อังกฤษ)' : 'School Name (English)') + '</label><input type="text" id="settSchoolNameEn" class="form-input" value="' + (config.school_name_en || '') + '"></div>' +

    '<div class="form-group md:col-span-2"><label class="form-label">' + (lang === 'th' ? 'ที่อยู่' : 'Address') + '</label><textarea id="settAddress" class="form-input" rows="2">' + (config.address || '') + '</textarea></div>' +
    '<div class="form-group"><label class="form-label">' + (lang === 'th' ? 'เขต/อำเภอ' : 'District') + '</label><input type="text" id="settDistrict" class="form-input" value="' + (config.district || '') + '"></div>' +
    '<div class="form-group"><label class="form-label">' + (lang === 'th' ? 'จังหวัด' : 'Province') + '</label><input type="text" id="settProvince" class="form-input" value="' + (config.province || '') + '"></div>' +
    '<div class="form-group"><label class="form-label">' + (lang === 'th' ? 'รหัสไปรษณีย์' : 'Postal Code') + '</label><input type="text" id="settPostalCode" class="form-input" maxlength="5" value="' + (config.postal_code || '') + '"></div>' +
    '<div class="form-group"><label class="form-label">' + (lang === 'th' ? 'เบอร์โทร' : 'Phone') + '</label><input type="tel" id="settPhone" class="form-input" value="' + (config.phone || '') + '"></div>' +
    '<div class="form-group"><label class="form-label">' + (lang === 'th' ? 'อีเมล' : 'Email') + '</label><input type="email" id="settEmail" class="form-input" value="' + (config.email || '') + '"></div>' +
    '<div class="form-group"><label class="form-label">' + (lang === 'th' ? 'ปีการศึกษาปัจจุบัน' : 'Current Academic Year') + '</label><select id="settCurrentYear" class="form-select">' + buildYearOptions(config) + '</select></div>' +
    '</div>' +

    // Folder ID Section
    '<div class="flex items-center gap-2 mb-4 mt-6"><div class="w-1 h-6 bg-orange-500 rounded-full"></div><h3 class="font-bold text-gray-800">' + (lang === 'th' ? 'การจัดเก็บไฟล์' : 'File Storage') + '</h3></div>' +
    '<div class="bg-orange-50 border border-orange-200 rounded-xl p-4">' +
    '<div class="form-group mb-0"><label class="form-label flex items-center"><i class="fi fi-rr-folder mr-2 text-orange-500"></i>' + (lang === 'th' ? 'Google Drive Folder ID' : 'Google Drive Folder ID') + '</label>' +
    '<input type="text" id="settFolderId" class="form-input" placeholder="' + (lang === 'th' ? 'วาง Folder ID สำหรับเก็บรูปภาพ' : 'Paste Folder ID for images') + '" value="' + (config.folder_id || '') + '">' +
    '<p class="text-xs text-orange-600 mt-2"><i class="fi fi-rr-info mr-1"></i>' + (lang === 'th' ? 'คัดลอก ID จาก URL ของ Google Drive Folder' : 'Copy ID from Google Drive Folder URL') + '</p></div>' +
    '</div>' +
    '</div>' +

    // Logo Section
    '<div class="lg:col-span-1">' +
    '<div class="flex items-center gap-2 mb-4"><div class="w-1 h-6 bg-purple-500 rounded-full"></div><h3 class="font-bold text-gray-800">' + (lang === 'th' ? 'ตราสัญลักษณ์' : 'Logo') + '</h3></div>' +
    '<div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer" onclick="document.getElementById(\'logoUpload\').click()">' +
    '<div id="logoPreview" class="mb-4">' + (config.logo_url ? '<img src="' + config.logo_url + '" class="w-32 h-32 mx-auto object-contain rounded-xl border bg-white p-2">' : '<div class="w-32 h-32 mx-auto bg-blue-100 rounded-xl flex items-center justify-center"><i class="fi fi-rr-school text-4xl text-blue-500"></i></div>') + '</div>' +
    '<input type="file" id="logoUpload" class="hidden" accept="image/*" onchange="handleLogoUpload(event)">' +
    '<button type="button" class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-white"><i class="fi fi-rr-cloud-upload"></i><span>' + (lang === 'th' ? 'อัปโหลดโลโก้' : 'Upload Logo') + '</span></button>' +
    '<p class="text-xs text-gray-500 mt-2">' + (lang === 'th' ? 'PNG หรือ JPG ไม่เกิน 2MB' : 'PNG or JPG, max 2MB') + '</p>' +
    '</div></div></div>';
}

function buildYearOptions(config) {
  var years = config.academic_years || [];
  var currentYear = config.current_academic_year || '';
  var html = '';
  for (var i = 0; i < years.length; i++) {
    html += '<option value="' + years[i] + '"' + (years[i] === currentYear ? ' selected' : '') + '>' + years[i] + '</option>';
  }
  return html;
}

function renderListTab(type, items, lang, icon, color, label) {
  var addBtnText = lang === 'th' ? 'เพิ่ม' + label : 'Add ' + label;
  var noDataText = lang === 'th' ? 'ยังไม่มี' + label : 'No ' + label + ' yet';

  var listHtml = '';
  if (items.length === 0) {
    listHtml = '<div class="text-center py-12 text-gray-500"><i class="fi ' + icon + ' text-4xl mb-3 block text-gray-300"></i><p>' + noDataText + '</p></div>';
  } else {
    for (var i = 0; i < items.length; i++) {
      listHtml += '<div class="settings-list-item">' +
        '<div class="flex items-center">' +
        '<div class="w-10 h-10 bg-' + color + '-100 rounded-lg flex items-center justify-center text-' + color + '-600 mr-4"><i class="fi ' + icon + '"></i></div>' +
        '<div><div class="font-medium text-gray-900">' + items[i] + '</div><div class="text-xs text-gray-500">#' + (i + 1) + '</div></div>' +
        '</div>' +
        '<div class="flex gap-2">' +
        '<button onclick="editSettingsItem(\'' + type + '\', ' + i + ', \'' + items[i].replace(/'/g, "\\'") + '\')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="' + (lang === 'th' ? 'แก้ไข' : 'Edit') + '"><i class="fi fi-rr-edit"></i></button>' +
        '<button onclick="deleteSettingsItem(\'' + type + '\', ' + i + ')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="' + (lang === 'th' ? 'ลบ' : 'Delete') + '"><i class="fi fi-rr-trash"></i></button>' +
        '</div></div>';
    }
  }

  return '<div class="flex items-center justify-between mb-6">' +
    '<div class="flex items-center gap-2"><div class="w-1 h-6 bg-' + color + '-600 rounded-full"></div><h3 class="font-bold text-gray-800">' + (lang === 'th' ? 'จัดการ' + label : 'Manage ' + label + 's') + '</h3></div>' +
    '<button onclick="addSettingsItem(\'' + type + '\')" class="inline-flex items-center gap-2 px-4 py-2 text-' + color + '-600 hover:bg-' + color + '-50 rounded-lg font-medium"><i class="fi fi-rr-plus"></i><span>' + addBtnText + '</span></button>' +
    '</div>' +
    '<div id="' + type + 'List">' + listHtml + '</div>';
}

function renderAcademicYearsTab(config, lang) {
  var years = config.academic_years || [];
  var currentYear = config.current_academic_year || '';

  var listHtml = '';
  if (years.length === 0) {
    listHtml = '<div class="text-center py-12 text-gray-500"><i class="fi fi-rr-calendar text-4xl mb-3 block text-gray-300"></i><p>' + (lang === 'th' ? 'ยังไม่มีปีการศึกษา' : 'No academic years') + '</p></div>';
  } else {
    for (var i = 0; i < years.length; i++) {
      var isCurrent = years[i] === currentYear;
      listHtml += '<div class="settings-list-item">' +
        '<div class="flex items-center">' +
        '<div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 mr-4"><i class="fi fi-rr-calendar"></i></div>' +
        '<div><div class="font-medium text-gray-900">' + years[i] + (isCurrent ? ' <span class="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">' + (lang === 'th' ? 'ปัจจุบัน' : 'Current') + '</span>' : '') + '</div><div class="text-xs text-gray-500">' + (lang === 'th' ? 'ปีการศึกษา' : 'Academic Year') + '</div></div>' +
        '</div>' +
        '<div class="flex gap-2">' +
        (!isCurrent ? '<button onclick="setCurrentAcademicYear(\'' + years[i] + '\')" class="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="' + (lang === 'th' ? 'ตั้งเป็นปีปัจจุบัน' : 'Set as Current') + '"><i class="fi fi-rr-check"></i></button>' : '') +
        '<button onclick="editSettingsItem(\'academicYears\', ' + i + ', \'' + years[i] + '\')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="' + (lang === 'th' ? 'แก้ไข' : 'Edit') + '"><i class="fi fi-rr-edit"></i></button>' +
        '<button onclick="deleteSettingsItem(\'academicYears\', ' + i + ')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="' + (lang === 'th' ? 'ลบ' : 'Delete') + '"><i class="fi fi-rr-trash"></i></button>' +
        '</div></div>';
    }
  }

  return '<div class="flex items-center justify-between mb-6">' +
    '<div class="flex items-center gap-2"><div class="w-1 h-6 bg-yellow-500 rounded-full"></div><h3 class="font-bold text-gray-800">' + (lang === 'th' ? 'จัดการปีการศึกษา' : 'Manage Academic Years') + '</h3></div>' +
    '<button onclick="addSettingsItem(\'academicYears\')" class="inline-flex items-center gap-2 px-4 py-2 text-yellow-600 hover:bg-yellow-50 rounded-lg font-medium"><i class="fi fi-rr-plus"></i><span>' + (lang === 'th' ? 'เพิ่มปีการศึกษา' : 'Add Year') + '</span></button>' +
    '</div>' +
    '<div id="academicYearsList">' + listHtml + '</div>';
}

// Add item
async function addSettingsItem(type) {
  var lang = AppState.language;
  var title, placeholder;
  if (type === 'positions') { title = lang === 'th' ? 'เพิ่มตำแหน่ง' : 'Add Position'; placeholder = lang === 'th' ? 'ชื่อตำแหน่ง' : 'Position Name'; }
  else if (type === 'gradeLevels') { title = lang === 'th' ? 'เพิ่มสายชั้น' : 'Add Grade Level'; placeholder = lang === 'th' ? 'ชื่อสายชั้น' : 'Grade Level'; }
  else { title = lang === 'th' ? 'เพิ่มปีการศึกษา' : 'Add Academic Year'; placeholder = lang === 'th' ? 'ปีการศึกษา เช่น 2567' : 'e.g. 2024'; }

  var result = await Swal.fire({ title: title, input: 'text', inputPlaceholder: placeholder, showCancelButton: true, confirmButtonColor: '#1c2b45', cancelButtonText: t('cancel'), confirmButtonText: t('save'), inputValidator: function(value) { if (!value || !value.trim()) return lang === 'th' ? 'กรุณากรอกข้อมูล' : 'Please enter a value'; } });

  if (result.value) {
    var configKey = type === 'positions' ? 'positions' : (type === 'gradeLevels' ? 'grade_levels' : 'academic_years');
    if (!AppState.config[configKey]) AppState.config[configKey] = [];
    AppState.config[configKey].push(result.value.trim());
    switchSettingsTab(type);
    showAlert('success', t('success'), lang === 'th' ? 'เพิ่มข้อมูลแล้ว (กรุณาบันทึก)' : 'Added (Please save)');
  }
}

// Edit item
async function editSettingsItem(type, index, currentValue) {
  var lang = AppState.language;
  var title;
  if (type === 'positions') title = lang === 'th' ? 'แก้ไขตำแหน่ง' : 'Edit Position';
  else if (type === 'gradeLevels') title = lang === 'th' ? 'แก้ไขสายชั้น' : 'Edit Grade Level';
  else title = lang === 'th' ? 'แก้ไขปีการศึกษา' : 'Edit Academic Year';

  var result = await Swal.fire({ title: title, input: 'text', inputValue: currentValue, showCancelButton: true, confirmButtonColor: '#1c2b45', cancelButtonText: t('cancel'), confirmButtonText: t('save'), inputValidator: function(value) { if (!value || !value.trim()) return lang === 'th' ? 'กรุณากรอกข้อมูล' : 'Please enter a value'; } });

  if (result.value && result.value !== currentValue) {
    var configKey = type === 'positions' ? 'positions' : (type === 'gradeLevels' ? 'grade_levels' : 'academic_years');
    AppState.config[configKey][index] = result.value.trim();
    switchSettingsTab(type);
    showAlert('success', t('success'), lang === 'th' ? 'แก้ไขข้อมูลแล้ว (กรุณาบันทึก)' : 'Updated (Please save)');
  }
}

// Delete item
async function deleteSettingsItem(type, index) {
  var lang = AppState.language;
  var confirm = await showConfirm(t('confirmDelete'), t('confirmDeleteMsg'));
  if (confirm.isConfirmed) {
    var configKey = type === 'positions' ? 'positions' : (type === 'gradeLevels' ? 'grade_levels' : 'academic_years');
    AppState.config[configKey].splice(index, 1);
    switchSettingsTab(type);
    showAlert('success', t('success'), lang === 'th' ? 'ลบข้อมูลแล้ว (กรุณาบันทึก)' : 'Deleted (Please save)');
  }
}

// Set current academic year
function setCurrentAcademicYear(year) {
  AppState.config.current_academic_year = year;
  switchSettingsTab('academicYears');
  showAlert('success', t('success'), AppState.language === 'th' ? 'ตั้งเป็นปีปัจจุบันแล้ว (กรุณาบันทึก)' : 'Set as current (Please save)');
}

// Handle logo upload
function handleLogoUpload(event) {
  var file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showAlert('error', t('error'), AppState.language === 'th' ? 'ไฟล์ใหญ่เกิน 2MB' : 'File exceeds 2MB'); return; }

  var reader = new FileReader();
  reader.onload = function(e) {
    // Show preview immediately
    document.getElementById('logoPreview').innerHTML = '<img src="' + e.target.result + '" class="w-32 h-32 mx-auto object-contain rounded-xl border bg-white p-2">';

    // Upload to server
    showLoading();

    api.uploadFile('/api/upload/image', file)
      .then(function(result) {
        hideLoading();
        if (result.status === 'success') {
          AppState.config.logo_url = result.url;
          showAlert('success', t('success'), AppState.language === 'th' ? 'อัพโหลดโลโก้สำเร็จ' : 'Logo uploaded');
        } else {
          showAlert('error', t('error'), result.message);
        }
      })
      .catch(function(err) {
        hideLoading();
        showAlert('error', t('error'), err.message);
      });
  };
  reader.readAsDataURL(file);
}

async function saveAllSettings() {
  showLoading();

  // Get values from organization tab if visible
  var appNameEl = document.getElementById('settAppName');
  if (appNameEl) {
    AppState.config.app_name = appNameEl.value;
    AppState.config.app_name_en = document.getElementById('settAppNameEn').value; // เพิ่มบรรทัดนี้
    AppState.config.school_name = document.getElementById('settSchoolName').value;
    AppState.config.school_name_en = document.getElementById('settSchoolNameEn').value; // เพิ่มบรรทัดนี้
    AppState.config.address = document.getElementById('settAddress').value;
    AppState.config.district = document.getElementById('settDistrict').value;
    AppState.config.province = document.getElementById('settProvince').value;
    AppState.config.postal_code = document.getElementById('settPostalCode').value;
    AppState.config.phone = document.getElementById('settPhone').value;
    AppState.config.email = document.getElementById('settEmail').value;
    AppState.config.folder_id = document.getElementById('settFolderId').value;
    var currentYearEl = document.getElementById('settCurrentYear');
    if (currentYearEl) AppState.config.current_academic_year = currentYearEl.value;
  }

  try {
    var result = await api.put('/api/config', AppState.config).catch(function(err) { return { status: 'error', message: err.message }; });

    hideLoading();

    if (result.status === 'success') {
      updateLanguageUI();
      showAlert('success', t('success'), result.message);
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

async function saveSettings(event) {
  if (event) event.preventDefault();
  await saveAllSettings();
}

// ==================== PAGINATION ====================
function renderPagination(pagination, pageVar, loadFunc) {
  var currentPage = pagination.currentPage;
  var totalPages = pagination.totalPages;
  var html = '<div class="pagination mt-6 flex items-center justify-center gap-2">';
  html += '<button class="pagination-btn" ' + (currentPage <= 1 ? 'disabled' : '') + ' onclick="' + pageVar + ' = ' + (currentPage - 1) + '; ' + loadFunc + '()"><i class="fi fi-rr-angle-left"></i></button>';
  var startPage = Math.max(1, currentPage - 2);
  var endPage = Math.min(totalPages, currentPage + 2);
  if (startPage > 1) { html += '<button class="pagination-btn" onclick="' + pageVar + ' = 1; ' + loadFunc + '()">1</button>'; if (startPage > 2) html += '<span class="px-2">...</span>'; }
  for (var i = startPage; i <= endPage; i++) { html += '<button class="pagination-btn ' + (i === currentPage ? 'active' : '') + '" onclick="' + pageVar + ' = ' + i + '; ' + loadFunc + '()">' + i + '</button>'; }
  if (endPage < totalPages) { if (endPage < totalPages - 1) html += '<span class="px-2">...</span>'; html += '<button class="pagination-btn" onclick="' + pageVar + ' = ' + totalPages + '; ' + loadFunc + '()">' + totalPages + '</button>'; }
  html += '<button class="pagination-btn" ' + (currentPage >= totalPages ? 'disabled' : '') + ' onclick="' + pageVar + ' = ' + (currentPage + 1) + '; ' + loadFunc + '()"><i class="fi fi-rr-angle-right"></i></button>';
  html += '</div>';
  return html;
}
