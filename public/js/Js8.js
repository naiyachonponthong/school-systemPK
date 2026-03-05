// ==================== DUTY PATROL SYSTEM (ระบบเข้าประจำเวร) ====================

const DutyState = {
  weeklySchedule: null,  // ตารางเวรสัปดาห์
  locations: [],         // จุดเวรทั้งหมด
  users: [],             // ผู้ใช้ที่ active
  currentWeek: null,     // สัปดาห์ที่เลือก
  academicYear: ''       // ปีการศึกษา
};

// วันในสัปดาห์
const WEEKDAYS = [
  { id: 1, name: 'จันทร์', nameEn: 'Monday', short: 'MON' },
  { id: 2, name: 'อังคาร', nameEn: 'Tuesday', short: 'TUE' },
  { id: 3, name: 'พุธ', nameEn: 'Wednesday', short: 'WED' },
  { id: 4, name: 'พฤหัสบดี', nameEn: 'Thursday', short: 'THU' },
  { id: 5, name: 'ศุกร์', nameEn: 'Friday', short: 'FRI' }
];

// กลุ่มจุดเวร
const LOCATION_CATEGORIES = {
  kindergarten: { name: 'เวรอนุบาล', nameEn: 'Kindergarten', color: 'blue' },
  foreigners: { name: 'Foreigners', nameEn: 'Foreigners', color: 'green' },
  admin: { name: 'ธุรการ', nameEn: 'Admin', color: 'yellow' },
  head: { name: 'หัวหน้า', nameEn: 'Head', color: 'purple' },
  fix: { name: 'เวรประจำ', nameEn: 'Fix Position', color: 'indigo' },
  primary: { name: 'เวรประถม-มัธยม', nameEn: 'Primary-Secondary', color: 'orange' }
};

// ช่วงเวลาเวร
const DUTY_PERIODS = {
  morning: { name: 'เช้า', nameEn: 'Morning', time: '07:00-07:40' },
  afternoon: { name: 'เย็น', nameEn: 'Afternoon', time: '15:30-17:40' },
  lunch: { name: 'เที่ยง', nameEn: 'Lunch', time: '11:20-12:40' },
  morning_afternoon: { name: 'เช้า/เย็น', nameEn: 'Morning/Afternoon', time: '' },
  morning_lunch: { name: 'เช้า/เที่ยง', nameEn: 'Morning/Lunch', time: '' },
  lunch_afternoon: { name: 'เที่ยง/เย็น', nameEn: 'Lunch/Afternoon', time: '' }
};

// ประเภทเวร
const DUTY_TYPES = {
  fix: { name: 'ประจำ (ไม่เปลี่ยนตำแหน่ง)', nameEn: 'Fix position' },
  rotate: { name: 'ประจำ (หมุนเปลี่ยนตำแหน่ง)', nameEn: 'Rotate position' }
};

// ==================== DUTY MANAGEMENT PAGE ====================
function loadDutyManagement() {
  const lang = AppState.language;
  const content = document.getElementById('pageContent');

  content.innerHTML = `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">
            <i class="fi fi-rr-calendar-check text-primary mr-2"></i>
            ${lang === 'th' ? 'ตารางเวรปฏิบัติหน้าที่ประจำวัน' : 'Duty Schedule for Teachers and Staffs'}
          </h1>
          <p class="text-gray-500 mt-1" id="academicYearLabel">${lang === 'th' ? 'ปีการศึกษา' : 'Academic Year'} <span id="currentAcademicYear">-</span></p>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button onclick="openLocationManagement()" class="btn-secondary">
            <i class="fi fi-rr-marker mr-2"></i>${lang === 'th' ? 'จัดการจุดเวร' : 'Locations'}
          </button>
          <button onclick="openWeeklyScheduleModal()" class="btn-primary">
            <i class="fi fi-rr-pencil mr-2"></i>${lang === 'th' ? 'แก้ไขตารางเวร' : 'Edit Schedule'}
          </button>
          <button onclick="printDutySchedule()" class="btn-secondary">
            <i class="fi fi-rr-print mr-2"></i>${lang === 'th' ? 'พิมพ์' : 'Print'}
          </button>
        </div>
      </div>

      <!-- Week Navigation - กระดาษแนวนอน -->
      <div class="bg-white rounded-2xl p-4 border border-gray-100">
        <div class="flex items-center justify-center gap-4">
          <button onclick="changeWeek(-1)" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center">
            <i class="fi fi-rr-angle-left"></i>
          </button>
          <div class="text-center">
            <h3 class="font-bold text-lg" id="currentWeekLabel">${lang === 'th' ? 'สัปดาห์ที่' : 'Week'} -</h3>
            <p class="text-sm text-gray-500" id="currentWeekDates">-</p>
          </div>
          <button onclick="changeWeek(1)" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center">
            <i class="fi fi-rr-angle-right"></i>
          </button>
        </div>
      </div>

      <!-- Duty Schedule Table Only -->
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <div id="dutyScheduleTable" class="min-w-[1200px]">
            <div class="text-center py-8"><i class="fi fi-rr-spinner animate-spin text-3xl text-primary"></i></div>
          </div>
        </div>
      </div>
    </div>
  `;
  loadDutyData();
}

async function loadDutyData() {
  try {
    // Initialize current week if not set
    if (!DutyState.currentWeek) {
      DutyState.currentWeek = getCurrentWeekDates();
    }

    const [locationsResult, scheduleResult, usersResult] = await Promise.all([
      api.get('/api/duties/locations?academicYear='),
      api.get('/api/duties/schedules/weekly?startDate='+DutyState.currentWeek.startDate+'&endDate=&academicYear='),
      api.get('/api/users?page=1&search=')
    ]);

    if (locationsResult.status === 'success') DutyState.locations = locationsResult.data;
    if (usersResult.status === 'success') DutyState.users = usersResult.data;
    if (scheduleResult.status === 'success') {
      DutyState.weeklySchedule = scheduleResult.data;
      DutyState.academicYear = scheduleResult.academicYear || '2568';
    }

    updateWeekDisplay();
    renderDutyScheduleTable();
  } catch (e) { console.error(e); }
}

// Get current week dates (Monday to Friday)
function getCurrentWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  return {
    startDate: formatDateISO(monday),
    endDate: formatDateISO(friday),
    weekNumber: getWeekNumber(monday),
    dates: getWeekDatesArray(monday)
  };
}

function formatDateISO(date) {
  return date.toISOString().split('T')[0];
}

function getWeekNumber(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
}

function getWeekDatesArray(monday) {
  const dates = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(formatDateISO(d));
  }
  return dates;
}

function changeWeek(direction) {
  const current = new Date(DutyState.currentWeek.startDate);
  current.setDate(current.getDate() + (direction * 7));

  const friday = new Date(current);
  friday.setDate(current.getDate() + 4);

  DutyState.currentWeek = {
    startDate: formatDateISO(current),
    endDate: formatDateISO(friday),
    weekNumber: getWeekNumber(current),
    dates: getWeekDatesArray(current)
  };

  loadDutyData();
}

function updateWeekDisplay() {
  const lang = AppState.language;
  const week = DutyState.currentWeek;

  document.getElementById('currentWeekLabel').textContent = `${lang === 'th' ? 'สัปดาห์ที่' : 'Week'} ${week.weekNumber}`;
  document.getElementById('currentWeekDates').textContent = `${formatDate(week.startDate)} - ${formatDate(week.endDate)}`;
  document.getElementById('currentAcademicYear').textContent = DutyState.academicYear;
}

// Render matrix table (Days x Locations)
function renderDutyScheduleTable() {
  const container = document.getElementById('dutyScheduleTable');
  const lang = AppState.language;
  const locations = DutyState.locations || [];
  const schedule = DutyState.weeklySchedule || {};
  const week = DutyState.currentWeek;

  if (locations.length === 0) {
    container.innerHTML = `<div class="text-center py-16"><p class="text-gray-500">${lang === 'th' ? 'ยังไม่มีจุดเวร กรุณาเพิ่มจุดเวรก่อน' : 'No locations. Please add locations first.'}</p><button onclick="openLocationManagement()" class="btn-primary mt-4"><i class="fi fi-rr-plus mr-2"></i>${lang === 'th' ? 'เพิ่มจุดเวร' : 'Add Location'}</button></div>`;
    return;
  }

  // Group locations by category
  const categories = {};
  locations.forEach(loc => {
    const cat = loc.category || 'other';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(loc);
  });

  const categoryOrder = ['kindergarten', 'foreigners', 'admin', 'head', 'fix', 'primary'];
  const categoryColors = {
    kindergarten: 'bg-blue-50 border-blue-200',
    foreigners: 'bg-green-50 border-green-200',
    admin: 'bg-yellow-50 border-yellow-200',
    head: 'bg-purple-50 border-purple-200',
    fix: 'bg-indigo-50 border-indigo-200',
    primary: 'bg-orange-50 border-orange-200'
  };

  // Count total locations and fix/rotate split
  let totalLocs = 0;
  categoryOrder.forEach(catKey => {
    totalLocs += (categories[catKey] || []).length;
  });

  // Fix position: kindergarten, foreigners, admin, head, fix (first 8 cols typically)
  // Rotate position: primary (last 3 cols typically)
  let fixCount = 0;
  let rotateCount = 0;
  ['kindergarten', 'foreigners', 'admin', 'head', 'fix'].forEach(cat => {
    fixCount += (categories[cat] || []).length;
  });
  rotateCount = (categories['primary'] || []).length;

  // Build table HTML - Vertical layout (แนวตั้ง) ตามรูปต้นฉบับ
  let html = `<table class="w-full border-collapse text-sm">`;

  // Header Row 1: Category groups
  html += `<thead><tr class="bg-gray-50">`;
  html += `<th rowspan="4" class="border border-gray-200 px-2 py-2 text-center font-semibold w-20">${lang === 'th' ? 'บริเวณ<br>Area' : 'Area'}</th>`;

  categoryOrder.forEach(catKey => {
    const catLocs = categories[catKey] || [];
    if (catLocs.length > 0) {
      const catInfo = LOCATION_CATEGORIES[catKey] || { name: catKey, nameEn: catKey };
      html += `<th colspan="${catLocs.length}" class="border border-gray-200 px-2 py-2 text-center font-semibold ${categoryColors[catKey] || ''}">${lang === 'th' ? catInfo.name : catInfo.nameEn}</th>`;
    }
  });
  html += `</tr>`;

  // Header Row 2: Location names
  html += `<tr class="bg-gray-50">`;
  categoryOrder.forEach(catKey => {
    const catLocs = categories[catKey] || [];
    catLocs.forEach(loc => {
      const locName = lang === 'th' ? loc.name : (loc.name_en || loc.name);
      html += `<th class="border border-gray-200 px-1 py-1 text-center text-xs font-medium ${categoryColors[catKey] || ''}" style="min-width:80px;max-width:100px;"><div class="line-clamp-4">${locName}</div></th>`;
    });
  });
  html += `</tr>`;

  // Header Row 3: ช่วงเวลา Duration
  html += `<tr class="bg-gray-50">`;
  categoryOrder.forEach(catKey => {
    const catLocs = categories[catKey] || [];
    catLocs.forEach(loc => {
      const period = DUTY_PERIODS[loc.period] || DUTY_PERIODS.morning_afternoon;
      html += `<th class="border border-gray-200 px-1 py-1 text-center text-xs text-gray-600 ${categoryColors[catKey] || ''}">${lang === 'th' ? period.name : period.nameEn}</th>`;
    });
  });
  html += `</tr>`;

  // Header Row 4: Fix position / Rotate position
  html += `<tr class="bg-gray-100">`;
  // Fix position section
  if (fixCount > 0) {
    html += `<th colspan="${fixCount}" class="border border-gray-200 px-2 py-1 text-center text-xs font-medium bg-gray-100">${lang === 'th' ? 'เวรประจำ (ไม่เปลี่ยนตำแหน่ง)<br>Fix position' : 'Fix position'}</th>`;
  }
  // Rotate position section
  if (rotateCount > 0) {
    html += `<th colspan="${rotateCount}" class="border border-gray-200 px-2 py-1 text-center text-xs font-medium bg-orange-100">${lang === 'th' ? 'เวรประจำ (หมุนเปลี่ยนตำแหน่ง)<br>Rotate position' : 'Rotate position'}</th>`;
  }
  html += `</tr></thead>`;

  // Body: Days
  html += `<tbody>`;
  WEEKDAYS.forEach((day, dayIndex) => {
    const dateStr = week.dates[dayIndex];
    const dateObj = new Date(dateStr);
    const dayNum = dateObj.getDate();
    const monthNum = dateObj.getMonth() + 1;
    const yearShort = (dateObj.getFullYear() + 543) % 100; // Buddhist year short

    html += `<tr class="hover:bg-gray-50">`;
    // Combined day/date cell
    html += `<td class="border border-gray-200 px-2 py-2 text-center font-medium bg-gray-50">
      <div>${lang === 'th' ? day.name : day.nameEn}</div>
      <div class="text-xs text-gray-500">${day.short}</div>
      <div class="text-xs">${dayNum}/${monthNum}/${yearShort}</div>
    </td>`;

    categoryOrder.forEach(catKey => {
      const catLocs = categories[catKey] || [];
      catLocs.forEach(loc => {
        const cellData = schedule[dateStr]?.[loc.id] || { users: [] };
        const users = cellData.users || [];

        html += `<td class="border border-gray-200 px-1 py-1 text-xs align-top cursor-pointer hover:bg-blue-50" onclick="editDutyCell('${dateStr}','${loc.id}')">`;
        if (users.length > 0) {
          html += users.map(u => `<div class="truncate">${u.user_name || u.name}</div>`).join('');
        } else {
          html += `<div class="text-gray-300 text-center">-</div>`;
        }
        html += `</td>`;
      });
    });
    html += `</tr>`;
  });
  html += `</tbody></table>`;

  container.innerHTML = html;
}

// Edit duty cell (open modal to assign users)
function editDutyCell(dateStr, locationId) {
  const lang = AppState.language;
  const location = DutyState.locations.find(l => l.id === locationId);
  const schedule = DutyState.weeklySchedule || {};
  const cellData = schedule[dateStr]?.[locationId] || { users: [] };
  const currentUsers = cellData.users || [];

  const dateObj = new Date(dateStr);
  const dayName = WEEKDAYS[dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1]?.name || '';

  const modalContent = `
    <div class="space-y-4">
      <div class="bg-gray-50 rounded-xl p-3">
        <p class="text-sm"><strong>${lang === 'th' ? 'วัน:' : 'Day:'}</strong> ${dayName} (${formatDate(dateStr)})</p>
        <p class="text-sm"><strong>${lang === 'th' ? 'จุดเวร:' : 'Location:'}</strong> ${location?.name || '-'}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">${lang === 'th' ? 'เลือกผู้รับผิดชอบ' : 'Select Assigned Users'}</label>
        <div class="border border-gray-200 rounded-xl p-3 max-h-64 overflow-y-auto space-y-2">
          ${DutyState.users.map(u => `
            <label class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input type="checkbox" name="cell_users" value="${u.user_id}" data-name="${u.user_name}"
                ${currentUsers.some(cu => cu.user_id === u.user_id) ? 'checked' : ''}
                class="w-4 h-4 text-primary rounded">
              <span>${u.user_name}</span>
            </label>
          `).join('')}
        </div>
      </div>
      <div class="flex justify-end gap-2 pt-4">
        <button type="button" onclick="closeDataModal()" class="btn-secondary">${lang === 'th' ? 'ยกเลิก' : 'Cancel'}</button>
        <button type="button" onclick="saveDutyCell('${dateStr}','${locationId}')" class="btn-primary">${lang === 'th' ? 'บันทึก' : 'Save'}</button>
      </div>
    </div>
  `;

  openDataModal(`${lang === 'th' ? 'กำหนดผู้รับผิดชอบ' : 'Assign Users'}`, modalContent);
}

async function saveDutyCell(dateStr, locationId) {
  const lang = AppState.language;
  const checkboxes = document.querySelectorAll('input[name="cell_users"]:checked');
  const users = Array.from(checkboxes).map(cb => ({
    user_id: cb.value,
    user_name: cb.dataset.name
  }));

  showLoading();
  try {
    const result = await api.post('/api/duties/schedules/cell', { date: dateStr, location_id: locationId, users: users });
    hideLoading();
    if (result.status === 'success') {
      showAlert('success', t('success'), result.message);
      closeDataModal();
      loadDutyData();
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (e) {
    hideLoading();
    showAlert('error', t('error'), e.message);
  }
}

function printDutySchedule() {
  window.print();
}

function openWeeklyScheduleModal() {
  const lang = AppState.language;
  const locations = DutyState.locations || [];
  const week = DutyState.currentWeek;

  if (locations.length === 0) {
    showAlert('warning', lang === 'th' ? 'ไม่มีจุดเวร' : 'No Locations', lang === 'th' ? 'กรุณาเพิ่มจุดเวรก่อน' : 'Please add locations first');
    return;
  }

  // Group locations by category
  const categories = {};
  locations.forEach(loc => {
    const cat = loc.category || 'primary';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(loc);
  });

  const categoryOrder = ['kindergarten', 'foreigners', 'admin', 'head', 'primary'];

  // Build location tabs
  let locationTabs = '';
  let locationContents = '';
  let isFirst = true;

  categoryOrder.forEach(catKey => {
    const catLocs = categories[catKey] || [];
    if (catLocs.length > 0) {
      const catInfo = LOCATION_CATEGORIES[catKey] || { name: catKey, nameEn: catKey };
      catLocs.forEach(loc => {
        locationTabs += `<button type="button" onclick="switchScheduleTab('${loc.id}')"
          class="schedule-tab px-3 py-2 text-sm rounded-lg whitespace-nowrap ${isFirst ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}"
          data-loc="${loc.id}">${loc.name}</button>`;

        // Build day rows for this location
        let dayRows = WEEKDAYS.map((day, idx) => {
          const dateStr = week.dates[idx];
          const schedule = DutyState.weeklySchedule || {};
          const cellData = schedule[dateStr]?.[loc.id] || { users: [] };
          const currentUsers = cellData.users || [];
          const userIds = currentUsers.map(u => u.user_id);

          return `
            <div class="border-b border-gray-100 py-3">
              <div class="flex items-center justify-between mb-2">
                <span class="font-medium text-gray-700">${lang === 'th' ? day.name : day.nameEn} <span class="text-gray-400 text-sm">(${formatDate(dateStr)})</span></span>
              </div>
              <div class="flex flex-wrap gap-2">
                ${DutyState.users.map(u => `
                  <label class="inline-flex items-center gap-1 px-2 py-1 border rounded-lg text-sm cursor-pointer hover:bg-gray-50
                    ${userIds.includes(u.user_id) ? 'bg-primary/10 border-primary' : 'border-gray-200'}">
                    <input type="checkbox" name="users_${loc.id}_${dateStr}" value="${u.user_id}" data-name="${u.user_name}"
                      ${userIds.includes(u.user_id) ? 'checked' : ''} class="w-3 h-3">
                    <span>${u.user_name}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `;
        }).join('');

        locationContents += `
          <div id="scheduleContent_${loc.id}" class="schedule-content ${isFirst ? '' : 'hidden'}">
            <div class="bg-gray-50 rounded-xl p-3 mb-4">
              <p class="font-medium">${loc.name}</p>
              <p class="text-sm text-gray-500">${(LOCATION_CATEGORIES[loc.category] || {}).name || ''} - ${(DUTY_PERIODS[loc.period] || {}).name || ''}</p>
            </div>
            ${dayRows}
          </div>
        `;
        isFirst = false;
      });
    }
  });

  const modalContent = `
    <div class="space-y-4">
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
        <i class="fi fi-rr-info mr-2"></i>${lang === 'th' ? 'สัปดาห์:' : 'Week:'} ${formatDate(week.startDate)} - ${formatDate(week.endDate)}
      </div>
      <div class="flex gap-2 overflow-x-auto pb-2">
        ${locationTabs}
      </div>
      <div id="scheduleContents" class="max-h-96 overflow-y-auto">
        ${locationContents}
      </div>
      <div class="flex justify-end gap-2 pt-4 border-t">
        <button type="button" onclick="closeDataModal()" class="btn-secondary">${lang === 'th' ? 'ยกเลิก' : 'Cancel'}</button>
        <button type="button" onclick="saveWeeklySchedule()" class="btn-primary">${lang === 'th' ? 'บันทึกทั้งหมด' : 'Save All'}</button>
      </div>
    </div>
  `;

  openDataModal(lang === 'th' ? 'แก้ไขตารางเวรประจำสัปดาห์' : 'Edit Weekly Schedule', modalContent, 'max-w-4xl');
}

function switchScheduleTab(locId) {
  // Hide all contents
  document.querySelectorAll('.schedule-content').forEach(el => el.classList.add('hidden'));
  // Show selected content
  document.getElementById(`scheduleContent_${locId}`)?.classList.remove('hidden');
  // Update tab styles
  document.querySelectorAll('.schedule-tab').forEach(el => {
    if (el.dataset.loc === locId) {
      el.classList.remove('bg-gray-100', 'hover:bg-gray-200');
      el.classList.add('bg-primary', 'text-white');
    } else {
      el.classList.remove('bg-primary', 'text-white');
      el.classList.add('bg-gray-100', 'hover:bg-gray-200');
    }
  });
}

async function saveWeeklySchedule() {
  const lang = AppState.language;
  const week = DutyState.currentWeek;
  const locations = DutyState.locations || [];

  // Collect all assignments
  const assignments = [];
  locations.forEach(loc => {
    week.dates.forEach(dateStr => {
      const checkboxes = document.querySelectorAll(`input[name="users_${loc.id}_${dateStr}"]:checked`);
      const users = Array.from(checkboxes).map(cb => ({
        user_id: cb.value,
        user_name: cb.dataset.name
      }));
      assignments.push({ date: dateStr, location_id: loc.id, users });
    });
  });

  showLoading();
  try {
    const result = await api.put('/api/duties/schedules/weekly', { schedules: assignments });
    hideLoading();
    if (result.status === 'success') {
      showAlert('success', t('success'), result.message);
      closeDataModal();
      loadDutyData();
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (e) {
    hideLoading();
    showAlert('error', t('error'), e.message);
  }
}

function renderDutySchedulesList() {
  const container = document.getElementById('dutySchedulesList');
  const lang = AppState.language;
  const schedules = DutyState.schedules;

  if (schedules.length === 0) {
    container.innerHTML = `<div class="text-center py-16 bg-white rounded-2xl border border-gray-100"><div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fi fi-rr-calendar-clock text-4xl text-gray-400"></i></div><p class="text-gray-500 font-medium">${lang === 'th' ? 'ไม่พบตารางเวร' : 'No schedules found'}</p></div>`;
    return;
  }

  const statusCfg = {
    scheduled: { bg: 'bg-yellow-500', light: 'bg-yellow-50', text: 'text-yellow-700', label: lang === 'th' ? 'รอเข้าเวร' : 'Scheduled' },
    in_progress: { bg: 'bg-green-500', light: 'bg-green-50', text: 'text-green-700', label: lang === 'th' ? 'กำลังปฏิบัติ' : 'In Progress' },
    completed: { bg: 'bg-gray-500', light: 'bg-gray-50', text: 'text-gray-700', label: lang === 'th' ? 'เสร็จสิ้น' : 'Completed' }
  };

  container.innerHTML = schedules.map(sch => {
    const st = statusCfg[sch.status] || statusCfg.scheduled;
    const p = DUTY_PERIODS[sch.period] || DUTY_PERIODS[1];
    const pn = lang === 'th' ? p.name : p.nameEn;
    const stats = sch.checkin_stats || { total_assigned: 0, checked_in: 0, checked_out: 0 };
    return `
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
        <div class="h-1.5 ${st.bg}"></div>
        <div class="p-5">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 bg-${p.color}-100 rounded-2xl flex items-center justify-center"><i class="fi ${p.icon} text-2xl text-${p.color}-600"></i></div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-bold text-gray-800 text-lg">${sch.location?.name || '-'}</h3>
                  <span class="px-2.5 py-1 ${st.light} border rounded-full text-xs font-semibold ${st.text}">${st.label}</span>
                </div>
                <div class="flex flex-wrap items-center gap-4 mt-2 text-sm">
                  <span><i class="fi fi-rr-calendar text-blue-500 mr-1"></i>${formatDateRange(sch.start_date || sch.duty_date, sch.end_date || sch.duty_date, lang)}</span>
                  <span><i class="fi fi-rr-clock text-purple-500 mr-1"></i>${pn} (${p.time})</span>
                  <span><i class="fi fi-rr-users text-green-500 mr-1"></i>${stats.total_assigned} ${lang === 'th' ? 'คน' : 'people'}</span>
                </div>
                <div class="mt-3 flex items-center gap-3">
                  <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-xs">
                    <div class="h-full bg-green-500 rounded-full" style="width:${stats.total_assigned > 0 ? ((stats.checked_in + stats.checked_out) / stats.total_assigned * 100) : 0}%"></div>
                  </div>
                  <span class="text-xs text-gray-500">${stats.checked_in + stats.checked_out}/${stats.total_assigned}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="viewDutyDetails('${sch.id}')" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl flex items-center justify-center"><i class="fi fi-rr-eye"></i></button>
              ${sch.status === 'scheduled' ? `
                <button onclick="editDutySchedule('${sch.id}')" class="w-10 h-10 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-xl flex items-center justify-center"><i class="fi fi-rr-pencil"></i></button>
                <button onclick="deleteDutySchedule('${sch.id}')" class="w-10 h-10 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-xl flex items-center justify-center"><i class="fi fi-rr-trash"></i></button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== MY DUTY PAGE ====================
function loadMyDuty() {
  const lang = AppState.language;
  const content = document.getElementById('pageContent');
  content.innerHTML = `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800"><i class="fi fi-rr-calendar-check text-primary mr-2"></i>${lang === 'th' ? 'เวรของฉัน' : 'My Duty'}</h1>
        <p class="text-gray-500 mt-1">${lang === 'th' ? 'ตารางเวรดูแลนักเรียนของคุณ' : 'Your duty schedule'}</p>
      </div>
      <div id="todayDutyCard" class="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white">
        <div class="flex items-center gap-2 mb-4"><i class="fi fi-rr-calendar-day text-2xl"></i><h2 class="text-xl font-bold">${lang === 'th' ? 'เวรวันนี้' : "Today's Duty"}</h2></div>
        <div id="todayDutyContent"><div class="flex items-center justify-center py-4"><i class="fi fi-rr-spinner animate-spin text-2xl"></i></div></div>
      </div>
      <div>
        <h2 class="text-lg font-bold text-gray-800 mb-4"><i class="fi fi-rr-calendar-lines mr-2"></i>${lang === 'th' ? 'เวรที่จะถึง' : 'Upcoming Duties'}</h2>
        <div id="myDutyList" class="space-y-4"><div class="text-center py-8"><i class="fi fi-rr-spinner animate-spin text-3xl text-primary"></i></div></div>
      </div>
    </div>
  `;
  loadMyDutyData();
}

async function loadMyDutyData() {
  const lang = AppState.language;
  try {
    const [todayResult, allResult] = await Promise.all([
      api.get('/api/duties/schedules/today'),
      api.get('/api/duties/schedules?page=1&academicYear=&startDate=&endDate=')
    ]);
    renderTodayDuty(todayResult.status === 'success' ? todayResult.data : []);
    if (allResult.status === 'success') { DutyState.schedules = allResult.data; renderMyDutyList(); }
  } catch (e) { console.error(e); }
}

function renderTodayDuty(todaySchedules) {
  const container = document.getElementById('todayDutyContent');
  const lang = AppState.language;
  if (!todaySchedules || todaySchedules.length === 0) {
    container.innerHTML = `<div class="text-center py-4"><i class="fi fi-rr-smile text-4xl opacity-75"></i><p class="mt-2 opacity-90">${lang === 'th' ? 'วันนี้ไม่มีเวรของคุณ' : 'No duty today'}</p></div>`;
    return;
  }
  container.innerHTML = todaySchedules.map(sch => {
    const p = DUTY_PERIODS[sch.period] || DUTY_PERIODS[1];
    return `
      <div class="bg-white/20 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center"><i class="fi ${p.icon} text-xl"></i></div>
            <div><h3 class="font-bold">${sch.location?.name || '-'}</h3><p class="text-sm opacity-90">${lang === 'th' ? p.name : p.nameEn} (${p.time})</p></div>
          </div>
          <button onclick="openDutyCheckinModal('${sch.id}')" class="px-4 py-2 bg-white text-primary rounded-xl font-semibold hover:bg-gray-100">
            <i class="fi fi-rr-door-open mr-2"></i>${lang === 'th' ? 'เข้าเวร' : 'Check In'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderMyDutyList() {
  const container = document.getElementById('myDutyList');
  const lang = AppState.language;
  const today = new Date().toISOString().split('T')[0];
  const upcoming = DutyState.schedules.filter(s => s.duty_date >= today || s.status === 'in_progress');
  if (upcoming.length === 0) {
    container.innerHTML = `<div class="text-center py-8 bg-white rounded-2xl border border-gray-100"><div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3"><i class="fi fi-rr-calendar text-3xl text-gray-400"></i></div><p class="text-gray-500">${lang === 'th' ? 'ไม่มีเวรที่จะถึง' : 'No upcoming duties'}</p></div>`;
    return;
  }
  container.innerHTML = upcoming.map(sch => {
    const p = DUTY_PERIODS[sch.period] || DUTY_PERIODS[1];
    const isToday = sch.duty_date === today;
    return `
      <div class="bg-white rounded-2xl border ${isToday ? 'border-primary' : 'border-gray-100'} p-4 hover:shadow-md transition-all">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-${p.color}-100 rounded-xl flex items-center justify-center"><i class="fi ${p.icon} text-xl text-${p.color}-600"></i></div>
            <div>
              <div class="flex items-center gap-2"><h3 class="font-bold text-gray-800">${sch.location?.name || '-'}</h3>${isToday ? `<span class="px-2 py-0.5 bg-primary text-white text-xs rounded-full">${lang === 'th' ? 'วันนี้' : 'Today'}</span>` : ''}</div>
              <div class="flex items-center gap-3 text-sm text-gray-500 mt-1"><span><i class="fi fi-rr-calendar mr-1"></i>${formatDate(sch.duty_date)}</span><span><i class="fi fi-rr-clock mr-1"></i>${lang === 'th' ? p.name : p.nameEn}</span></div>
            </div>
          </div>
          ${isToday ? `<button onclick="openDutyCheckinModal('${sch.id}')" class="btn-primary"><i class="fi fi-rr-door-open mr-2"></i>${lang === 'th' ? 'เข้าเวร' : 'Check In'}</button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// ==================== MODALS ====================
function openCreateScheduleModal() {
  const lang = AppState.language;
  const modalContent = `
    <form id="createScheduleForm" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'วันเริ่มต้น' : 'Start Date'} *</label><input type="date" name="start_date" required class="w-full px-3 py-2 border border-gray-200 rounded-xl"></div>
        <div><label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'วันสิ้นสุด' : 'End Date'} *</label><input type="date" name="end_date" required class="w-full px-3 py-2 border border-gray-200 rounded-xl"></div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">${lang === 'th' ? 'ช่วงเวลา' : 'Period'} *</label>
        <div class="flex flex-wrap gap-4">
          <label class="flex items-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-orange-50 cursor-pointer has-[:checked]:bg-orange-100 has-[:checked]:border-orange-400">
            <input type="checkbox" name="periods" value="1" class="w-4 h-4 text-orange-500 rounded">
            <i class="fi fi-rr-sunrise text-orange-500"></i>
            <span>${lang === 'th' ? 'เช้า (07:00-07:40)' : 'Morning (07:00-07:40)'}</span>
          </label>
          <label class="flex items-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-purple-50 cursor-pointer has-[:checked]:bg-purple-100 has-[:checked]:border-purple-400">
            <input type="checkbox" name="periods" value="2" class="w-4 h-4 text-purple-500 rounded">
            <i class="fi fi-rr-sunset text-purple-500"></i>
            <span>${lang === 'th' ? 'เย็น (15:30-17:40)' : 'Afternoon (15:30-17:40)'}</span>
          </label>
        </div>
      </div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'จุดเวร' : 'Location'} *</label><select name="location_id" required class="w-full px-3 py-2 border border-gray-200 rounded-xl"><option value="">-- ${lang === 'th' ? 'เลือก' : 'Select'} --</option>${DutyState.locations.map(l => `<option value="${l.id}">${l.name}</option>`).join('')}</select></div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'ผู้รับผิดชอบ' : 'Assigned'} *</label><div class="border border-gray-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2">${DutyState.users.map(u => `<label class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"><input type="checkbox" name="assigned_users" value="${u.user_id}" data-name="${u.user_name}" class="w-4 h-4 text-primary rounded"><span>${u.user_name}</span></label>`).join('')}</div></div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'หมายเหตุ' : 'Notes'}</label><textarea name="notes" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-xl"></textarea></div>
      <div class="flex justify-end gap-2 pt-4"><button type="button" onclick="closeDataModal()" class="btn-secondary">${lang === 'th' ? 'ยกเลิก' : 'Cancel'}</button><button type="submit" class="btn-primary">${lang === 'th' ? 'สร้าง' : 'Create'}</button></div>
    </form>
  `;
  openDataModal(lang === 'th' ? 'สร้างตารางเวร' : 'Create Schedule', modalContent);
  document.getElementById('createScheduleForm').addEventListener('submit', handleCreateSchedule);
}

async function handleCreateSchedule(e) {
  e.preventDefault();
  const form = e.target;
  const lang = AppState.language;

  // ตรวจสอบช่วงเวลา
  const periodCbs = form.querySelectorAll('input[name="periods"]:checked');
  if (periodCbs.length === 0) { showAlert('warning', lang === 'th' ? 'เลือกช่วงเวลาอย่างน้อย 1 ช่วง' : 'Select at least 1 period'); return; }
  const periods = Array.from(periodCbs).map(cb => parseInt(cb.value));

  // ตรวจสอบผู้รับผิดชอบ
  const userCbs = form.querySelectorAll('input[name="assigned_users"]:checked');
  if (userCbs.length === 0) { showAlert('warning', lang === 'th' ? 'เลือกผู้รับผิดชอบ' : 'Select users'); return; }
  const users = Array.from(userCbs).map(cb => ({ user_id: cb.value, user_name: cb.dataset.name }));

  // ตรวจสอบวันที่
  const startDate = form.start_date.value;
  const endDate = form.end_date.value;
  if (startDate > endDate) { showAlert('warning', lang === 'th' ? 'วันสิ้นสุดต้องมากกว่าหรือเท่ากับวันเริ่มต้น' : 'End date must be after start date'); return; }

  const data = {
    start_date: startDate,
    end_date: endDate,
    periods: periods,
    location_id: form.location_id.value,
    assigned_users: users,
    notes: form.notes.value
  };

  showLoading();
  try {
    const result = await api.post('/api/duties/schedules', data);
    hideLoading();
    if (result.status === 'success') { showAlert('success', t('success'), result.message); closeDataModal(); loadDutyData(); }
    else { showAlert('error', t('error'), result.message); }
  } catch (e) {
    hideLoading();
    showAlert('error', t('error'), e.message);
  }
}

async function deleteDutySchedule(scheduleId) {
  const lang = AppState.language;
  const confirm = await showConfirm(lang === 'th' ? 'ยืนยัน' : 'Confirm', lang === 'th' ? 'ลบตารางเวรนี้?' : 'Delete this schedule?');
  if (!confirm.isConfirmed) return;
  showLoading();
  try {
    const result = await api.delete('/api/duties/schedules/'+scheduleId);
    hideLoading();
    if (result.status === 'success') { showAlert('success', t('success'), result.message); loadDutyData(); }
    else { showAlert('error', t('error'), result.message); }
  } catch (e) {
    hideLoading();
    showAlert('error', t('error'), e.message);
  }
}

function viewDutyDetails(scheduleId) {
  const lang = AppState.language;
  const sch = DutyState.schedules.find(s => s.id === scheduleId);
  if (!sch) return;
  const p = DUTY_PERIODS[sch.period] || DUTY_PERIODS[1];
  const stats = sch.checkin_stats || { total_assigned: 0, checked_in: 0, checked_out: 0, pending: 0 };
  const modalContent = `
    <div class="space-y-6">
      <div class="bg-gradient-to-r from-${p.color}-500 to-${p.color}-600 rounded-2xl p-6 text-white">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center"><i class="fi ${p.icon} text-3xl"></i></div>
          <div><h3 class="text-xl font-bold">${sch.location?.name || '-'}</h3><p class="opacity-90">${formatDate(sch.duty_date)} • ${lang === 'th' ? p.name : p.nameEn}</p></div>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-3">
        <div class="bg-blue-50 rounded-xl p-3 text-center"><p class="text-2xl font-bold text-blue-600">${stats.total_assigned}</p><p class="text-xs text-blue-700">${lang === 'th' ? 'ทั้งหมด' : 'Total'}</p></div>
        <div class="bg-green-50 rounded-xl p-3 text-center"><p class="text-2xl font-bold text-green-600">${stats.checked_in}</p><p class="text-xs text-green-700">${lang === 'th' ? 'เข้าเวร' : 'In'}</p></div>
        <div class="bg-purple-50 rounded-xl p-3 text-center"><p class="text-2xl font-bold text-purple-600">${stats.checked_out}</p><p class="text-xs text-purple-700">${lang === 'th' ? 'ออกเวร' : 'Out'}</p></div>
        <div class="bg-orange-50 rounded-xl p-3 text-center"><p class="text-2xl font-bold text-orange-600">${stats.pending}</p><p class="text-xs text-orange-700">${lang === 'th' ? 'รอ' : 'Wait'}</p></div>
      </div>
      <div><h4 class="font-semibold text-gray-800 mb-3"><i class="fi fi-rr-users mr-2"></i>${lang === 'th' ? 'ผู้รับผิดชอบ' : 'Assigned'}</h4>
        <div class="space-y-2 max-h-48 overflow-y-auto">${sch.assigned_users?.map(u => `<div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"><i class="fi fi-rr-user text-primary"></i></div><span class="font-medium">${u.user_name}</span></div></div>`).join('') || '-'}</div>
      </div>
      <div class="flex justify-end"><button onclick="closeDataModal()" class="btn-primary">${lang === 'th' ? 'ปิด' : 'Close'}</button></div>
    </div>
  `;
  openDataModal(lang === 'th' ? 'รายละเอียดตารางเวร' : 'Schedule Details', modalContent);
}

async function openDutyCheckinModal(scheduleId) {
  const lang = AppState.language;
  const sch = DutyState.schedules.find(s => s.id === scheduleId);
  if (!sch) return;
  showLoading();
  try {
    const statusResult = await api.get('/api/duties/user/status');
    hideLoading();
    const currentStatus = statusResult.status === 'success' ? statusResult.data.checkin_status : 'pending';
    const p = DUTY_PERIODS[sch.period] || DUTY_PERIODS[1];
    let content = '';
    if (currentStatus === 'pending') {
      content = `<div class="text-center space-y-4">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"><i class="fi fi-rr-door-open text-4xl text-green-600"></i></div>
        <h3 class="text-xl font-bold text-gray-800">${lang === 'th' ? 'เข้าเวร' : 'Check In'}</h3>
        <p class="text-gray-600">${sch.location?.name || '-'}</p>
        <p class="text-sm text-gray-500">${lang === 'th' ? p.name : p.nameEn} (${p.time})</p>
        <div id="gpsStatus" class="text-sm text-gray-500 py-2"><i class="fi fi-rr-spinner animate-spin mr-2"></i>${lang === 'th' ? 'ตรวจสอบตำแหน่ง...' : 'Checking location...'}</div>
        <button onclick="performDutyCheckin('${scheduleId}')" id="checkinBtn" disabled class="btn-primary w-full py-3 opacity-50"><i class="fi fi-rr-check mr-2"></i>${lang === 'th' ? 'ยืนยันเข้าเวร' : 'Confirm'}</button>
      </div>`;
    } else if (currentStatus === 'checked_in') {
      content = `<div class="text-center space-y-4">
        <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto"><i class="fi fi-rr-door-closed text-4xl text-orange-600"></i></div>
        <h3 class="text-xl font-bold text-gray-800">${lang === 'th' ? 'ออกเวร' : 'Check Out'}</h3>
        <p class="text-green-600 font-medium"><i class="fi fi-rr-check-circle mr-1"></i>${lang === 'th' ? 'คุณเข้าเวรแล้ว' : 'Checked in'}</p>
        <div class="text-left"><label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'หมายเหตุ' : 'Notes'}</label><textarea id="checkoutNotes" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-xl"></textarea></div>
        <button onclick="performDutyCheckout('${scheduleId}')" class="btn-primary w-full py-3 bg-orange-500 hover:bg-orange-600"><i class="fi fi-rr-check mr-2"></i>${lang === 'th' ? 'ยืนยันออกเวร' : 'Confirm'}</button>
      </div>`;
    } else {
      content = `<div class="text-center space-y-4">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto"><i class="fi fi-rr-check-circle text-4xl text-gray-600"></i></div>
        <h3 class="text-xl font-bold text-gray-800">${lang === 'th' ? 'เสร็จสิ้น' : 'Completed'}</h3>
        <p class="text-gray-600">${lang === 'th' ? 'คุณเข้าเวรและออกเวรแล้ว' : 'Duty completed'}</p>
        <button onclick="closeDataModal()" class="btn-secondary w-full py-3">${lang === 'th' ? 'ปิด' : 'Close'}</button>
      </div>`;
    }
    openDataModal(lang === 'th' ? 'เข้าเวร' : 'Duty Check In', content);
    if (currentStatus === 'pending') startGPSCheck();
  } catch (e) {
    hideLoading();
    console.error(e);
  }
}

function startGPSCheck() {
  const lang = AppState.language;
  const statusEl = document.getElementById('gpsStatus');
  const btnEl = document.getElementById('checkinBtn');
  if (!navigator.geolocation) {
    statusEl.innerHTML = `<span class="text-yellow-600"><i class="fi fi-rr-exclamation mr-2"></i>${lang === 'th' ? 'ไม่รองรับ GPS' : 'GPS not supported'}</span>`;
    btnEl.disabled = false; btnEl.classList.remove('opacity-50'); return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => { DutyState.currentLocation = { latitude: pos.coords.latitude, longitude: pos.coords.longitude }; statusEl.innerHTML = `<span class="text-green-600"><i class="fi fi-rr-marker mr-2"></i>${lang === 'th' ? 'ตรวจสอบตำแหน่งแล้ว' : 'Location verified'}</span>`; btnEl.disabled = false; btnEl.classList.remove('opacity-50'); },
    err => { statusEl.innerHTML = `<span class="text-yellow-600"><i class="fi fi-rr-exclamation mr-2"></i>${lang === 'th' ? 'ไม่สามารถตรวจสอบได้' : 'Cannot verify'}</span>`; btnEl.disabled = false; btnEl.classList.remove('opacity-50'); },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

async function performDutyCheckin(scheduleId) {
  const lang = AppState.language;
  showLoading();
  try {
    const location = DutyState.currentLocation || {};
    const result = await api.post('/api/duties/checkin', { schedule_id: scheduleId, latitude: location.latitude, longitude: location.longitude });
    hideLoading();
    if (result.status === 'success') { showAlert('success', t('success'), result.message); closeDataModal(); loadMyDutyData(); }
    else { showAlert('error', t('error'), result.message); }
  } catch (e) {
    hideLoading();
    showAlert('error', t('error'), e.message);
  }
}

async function performDutyCheckout(scheduleId) {
  const lang = AppState.language;
  const notes = document.getElementById('checkoutNotes')?.value || '';
  showLoading();
  try {
    const result = await api.put('/api/duties/checkout', { schedule_id: scheduleId, notes: notes });
    hideLoading();
    if (result.status === 'success') { showAlert('success', t('success'), result.message); closeDataModal(); loadMyDutyData(); }
    else { showAlert('error', t('error'), result.message); }
  } catch (e) {
    hideLoading();
    showAlert('error', t('error'), e.message);
  }
}

// ==================== LOCATION MANAGEMENT ====================
function openLocationManagement() {
  const lang = AppState.language;
  const modalContent = `
    <div class="space-y-4">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <p class="text-gray-600">${lang === 'th' ? 'รายการจุดเวร' : 'Duty Locations'}</p>
        <div class="flex gap-2">
          <button onclick="initDefaultLocations()" class="btn-secondary text-sm"><i class="fi fi-rr-refresh mr-1"></i>${lang === 'th' ? 'รีเซ็ตเป็นค่าเริ่มต้น' : 'Reset Default'}</button>
          <button onclick="openAddLocationModal()" class="btn-primary text-sm"><i class="fi fi-rr-plus mr-1"></i>${lang === 'th' ? 'เพิ่ม' : 'Add'}</button>
        </div>
      </div>
      <div id="locationsList" class="space-y-2 max-h-96 overflow-y-auto">
        ${DutyState.locations.map(l => {
          const cat = LOCATION_CATEGORIES[l.category] || {};
          const period = DUTY_PERIODS[l.period] || {};
          return `
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div class="flex-1">
              <h4 class="font-medium text-gray-800">${l.name}</h4>
              <div class="flex flex-wrap gap-2 mt-1">
                <span class="text-xs px-2 py-1 rounded-full ${cat.color ? cat.color.replace('bg-', 'bg-opacity-20 text-') : 'bg-gray-100 text-gray-600'}">
                  ${lang === 'th' ? cat.name : cat.nameEn}
                </span>
                <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  ${lang === 'th' ? period.name : period.nameEn}
                </span>
              </div>
              ${l.description ? `<p class="text-sm text-gray-500 mt-1">${l.description}</p>` : ''}
            </div>
            <div class="flex gap-2">
              <button onclick="editLocation('${l.id}')" class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-50"><i class="fi fi-rr-edit"></i></button>
              <button onclick="deleteLocation('${l.id}')" class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-red-600 hover:bg-red-50"><i class="fi fi-rr-trash"></i></button>
            </div>
          </div>
        `}).join('') || `<p class="text-center text-gray-500 py-4">${lang === 'th' ? 'ไม่มีจุดเวร' : 'No locations'}</p>`}
      </div>
      <div class="flex justify-end pt-4"><button onclick="closeDataModal()" class="btn-secondary">${lang === 'th' ? 'ปิด' : 'Close'}</button></div>
    </div>
  `;
  openDataModal(lang === 'th' ? 'จัดการจุดเวร' : 'Manage Locations', modalContent);
}

function openAddLocationModal() {
  const lang = AppState.language;
  const categoryOptions = Object.entries(LOCATION_CATEGORIES).map(([key, cat]) =>
    `<option value="${key}">${lang === 'th' ? cat.name : cat.nameEn}</option>`
  ).join('');
  const periodOptions = Object.entries(DUTY_PERIODS).map(([key, p]) =>
    `<option value="${key}">${lang === 'th' ? p.name : p.nameEn}${p.time ? ` (${p.time})` : ''}</option>`
  ).join('');

  const modalContent = `
    <form id="addLocationForm" class="space-y-4">
      <div><label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'ชื่อจุดเวร' : 'Name'} *</label><input type="text" name="name" required class="w-full px-3 py-2 border border-gray-200 rounded-xl"></div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'กลุ่ม' : 'Category'} *</label><select name="category" required class="w-full px-3 py-2 border border-gray-200 rounded-xl">${categoryOptions}</select></div>
        <div><label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'ช่วงเวลา' : 'Period'} *</label><select name="period" required class="w-full px-3 py-2 border border-gray-200 rounded-xl">${periodOptions}</select></div>
      </div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'รายละเอียด' : 'Description'}</label><textarea name="description" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-xl"></textarea></div>
      <div class="flex justify-end gap-2 pt-4"><button type="button" onclick="openLocationManagement()" class="btn-secondary">${lang === 'th' ? 'ยกเลิก' : 'Cancel'}</button><button type="submit" class="btn-primary">${lang === 'th' ? 'บันทึก' : 'Save'}</button></div>
    </form>
  `;
  openDataModal(lang === 'th' ? 'เพิ่มจุดเวร' : 'Add Location', modalContent);
  document.getElementById('addLocationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    showLoading();
    try {
      const data = {
        name: form.name.value,
        category: form.category.value,
        period: form.period.value,
        description: form.description.value
      };
      const result = await api.post('/api/duties/locations', data);
      hideLoading();
      if (result.status === 'success') { showAlert('success', t('success'), result.message); DutyState.locations.push(result.data); openLocationManagement(); }
      else { showAlert('error', t('error'), result.message); }
    } catch (e) {
      hideLoading();
      showAlert('error', t('error'), e.message);
    }
  });
}

function editLocation(locationId) {
  const lang = AppState.language;
  const location = DutyState.locations.find(l => l.id === locationId);
  if (!location) return;

  const categoryOptions = Object.entries(LOCATION_CATEGORIES).map(([key, cat]) =>
    `<option value="${key}" ${location.category === key ? 'selected' : ''}>${lang === 'th' ? cat.name : cat.nameEn}</option>`
  ).join('');
  const periodOptions = Object.entries(DUTY_PERIODS).map(([key, p]) =>
    `<option value="${key}" ${location.period === key ? 'selected' : ''}>${lang === 'th' ? p.name : p.nameEn}${p.time ? ` (${p.time})` : ''}</option>`
  ).join('');

  const modalContent = `
    <form id="editLocationForm" class="space-y-4">
      <input type="hidden" name="id" value="${location.id}">
      <div><label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'ชื่อจุดเวร' : 'Name'} *</label><input type="text" name="name" value="${location.name}" required class="w-full px-3 py-2 border border-gray-200 rounded-xl"></div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'หมวด' : 'Category'} *</label><select name="category" required class="w-full px-3 py-2 border border-gray-200 rounded-xl">${categoryOptions}</select></div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'ช่วงเวลา' : 'Period'} *</label><select name="period" required class="w-full px-3 py-2 border border-gray-200 rounded-xl">${periodOptions}</select></div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'รายละเอียด' : 'Description'}</label><textarea name="description" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-xl">${location.description || ''}</textarea></div>
      <div class="flex justify-end gap-2 pt-4">
        <button type="button" onclick="openLocationManagement()" class="btn-secondary">${lang === 'th' ? 'ยกเลิก' : 'Cancel'}</button>
        <button type="submit" class="btn-primary">${lang === 'th' ? 'บันทึก' : 'Save'}</button>
      </div>
    </form>
  `;
  openDataModal(lang === 'th' ? 'แก้ไขจุดเวร' : 'Edit Location', modalContent);
  document.getElementById('editLocationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    showLoading();
    try {
      const data = {
        id: form.id.value,
        name: form.name.value,
        category: form.category.value,
        period: form.period.value,
        description: form.description.value
      };
      const result = await api.put('/api/duties/locations/'+data.id, data);
      hideLoading();
      if (result.status === 'success') { showAlert('success', t('success'), result.message); openLocationManagement(); }
      else { showAlert('error', t('error'), result.message); }
    } catch (e) {
      hideLoading();
      showAlert('error', t('error'), e.message);
    }
  });
}

async function deleteLocation(locationId) {
  const lang = AppState.language;
  const confirm = await showConfirm(lang === 'th' ? 'ยืนยัน' : 'Confirm', lang === 'th' ? 'ลบจุดเวรนี้?' : 'Delete this location?');
  if (!confirm.isConfirmed) return;
  showLoading();
  try {
    const result = await api.delete('/api/duties/locations/'+locationId);
    hideLoading();
    if (result.status === 'success') { showAlert('success', t('success'), result.message); DutyState.locations = DutyState.locations.filter(l => l.id !== locationId); openLocationManagement(); }
    else { showAlert('error', t('error'), result.message); }
  } catch (e) {
    hideLoading();
    showAlert('error', t('error'), e.message);
  }
}

async function initDefaultLocations() {
  const lang = AppState.language;
  const confirm = await showConfirm(
    lang === 'th' ? 'ยืนยันรีเซ็ต' : 'Confirm Reset',
    lang === 'th' ? 'จะลบจุดเวรเดิมทั้งหมดและสร้างจุดเวรตามค่าเริ่มต้นใหม่ ดำเนินการต่อ?' : 'This will delete all existing locations and create default ones. Continue?'
  );
  if (!confirm.isConfirmed) return;

  showLoading();
  try {
    const result = await api.post('/api/duties/locations/reset-default', {});
    hideLoading();
    if (result.status === 'success') {
      showAlert('success', t('success'), result.message);
      closeDataModal();
      loadDutyData(); // Reload all data
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (e) {
    hideLoading();
    showAlert('error', t('error'), e.message);
  }
}

function editDutySchedule(scheduleId) {
  const lang = AppState.language;
  const sch = DutyState.schedules.find(s => s.id === scheduleId);
  if (!sch) return;

  const locationOptions = DutyState.locations.map(l =>
    `<option value="${l.id}" ${sch.location_id === l.id ? 'selected' : ''}>${l.name}</option>`
  ).join('');

  const currentUsers = sch.assigned_users || [];

  const modalContent = `
    <form id="editScheduleForm" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'วันเริ่มต้น' : 'Start Date'} *</label>
          <input type="date" name="start_date" value="${sch.start_date || ''}" required class="w-full px-3 py-2 border border-gray-200 rounded-xl">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'วันสิ้นสุด' : 'End Date'} *</label>
          <input type="date" name="end_date" value="${sch.end_date || ''}" required class="w-full px-3 py-2 border border-gray-200 rounded-xl">
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'จุดเวร' : 'Location'} *</label>
        <select name="location_id" required class="w-full px-3 py-2 border border-gray-200 rounded-xl">
          <option value="">-- ${lang === 'th' ? 'เลือก' : 'Select'} --</option>
          ${locationOptions}
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'ช่วงเวลา' : 'Period'}</label>
        <div class="flex flex-wrap gap-4">
          ${Object.entries(DUTY_PERIODS).map(([key, p]) => `
            <label class="flex items-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
              <input type="radio" name="period" value="${key}" ${sch.period === key ? 'checked' : ''} class="w-4 h-4 text-primary">
              <span>${lang === 'th' ? p.name : p.nameEn}${p.time ? ' (' + p.time + ')' : ''}</span>
            </label>
          `).join('')}
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">${lang === 'th' ? 'ผู้รับผิดชอบ' : 'Assigned Users'}</label>
        <div class="border border-gray-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2">
          ${DutyState.users.map(u => `
            <label class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input type="checkbox" name="assigned_users" value="${u.user_id}" data-name="${u.user_name}"
                ${currentUsers.some(cu => cu.user_id === u.user_id) ? 'checked' : ''}
                class="w-4 h-4 text-primary rounded">
              <span>${u.user_name}</span>
            </label>
          `).join('')}
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'หมายเหตุ' : 'Notes'}</label>
        <textarea name="notes" rows="2" class="w-full px-3 py-2 border border-gray-200 rounded-xl">${sch.notes || ''}</textarea>
      </div>
      <div class="flex justify-end gap-2 pt-4">
        <button type="button" onclick="closeDataModal()" class="btn-secondary">${lang === 'th' ? 'ยกเลิก' : 'Cancel'}</button>
        <button type="submit" class="btn-primary">${lang === 'th' ? 'บันทึก' : 'Save'}</button>
      </div>
    </form>
  `;

  openDataModal(lang === 'th' ? 'แก้ไขตารางเวร' : 'Edit Schedule', modalContent);
  document.getElementById('editScheduleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const userCbs = form.querySelectorAll('input[name="assigned_users"]:checked');
    const users = Array.from(userCbs).map(cb => ({ user_id: cb.value, user_name: cb.dataset.name }));

    showLoading();
    try {
      const data = {
        id: scheduleId,
        start_date: form.start_date.value,
        end_date: form.end_date.value,
        period: form.period?.value || sch.period,
        location_id: form.location_id.value,
        assigned_users: users,
        notes: form.notes.value
      };
      const result = await api.put('/api/duties/schedules/' + scheduleId, data);
      hideLoading();
      if (result.status === 'success') {
        showAlert('success', t('success'), result.message);
        closeDataModal();
        loadDutyData();
      } else {
        showAlert('error', t('error'), result.message);
      }
    } catch (err) {
      hideLoading();
      showAlert('error', t('error'), err.message);
    }
  });
}
