/**
 * Personnel Management System - Meeting Attendance Module
 * Part 7: Meeting Management and Check-in/Check-out Functions
 */

// ==================== MEETING STATE ====================
const MeetingState = {
  meetings: [],
  currentMeeting: null,
  attendees: [],
  users: [],
  qrRefreshInterval: null,
  locationWatchId: null,
  currentLocation: null,
  deviceFingerprint: null
};

// ==================== HELPER FUNCTIONS ====================
/**
 * Format เวลาให้อ่านง่าย
 */
function formatMeetingTime(isoString) {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }) + ' น.';
  } catch (e) {
    return isoString;
  }
}

// ==================== DEVICE FINGERPRINT ====================
/**
 * สร้าง Device Fingerprint
 */
function generateDeviceFingerprint() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Device Fingerprint', 2, 2);
  const canvasData = canvas.toDataURL();

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvasData.slice(0, 100)
  ];

  let hash = 0;
  const str = components.join('|');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  MeetingState.deviceFingerprint = Math.abs(hash).toString(16);
  return MeetingState.deviceFingerprint;
}

// ==================== MEETING MANAGEMENT PAGE ====================
/**
 * โหลดหน้าจัดการประชุม
 */
async function loadMeetingManagement() {
  const content = document.getElementById('pageContent');
  const lang = AppState.language;

  content.innerHTML = `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">${t('meetingManagement')}</h2>
          <p class="text-gray-600">${lang === 'th' ? 'สร้างและจัดการการประชุม' : 'Create and manage meetings'}</p>
        </div>
        <button onclick="openCreateMeetingModal()" class="btn-primary flex items-center gap-2">
          <i class="fi fi-rr-plus"></i>
          <span>${t('createMeeting')}</span>
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl shadow-sm p-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <input type="text" id="meetingSearchInput" placeholder="${lang === 'th' ? 'ค้นหาการประชุม...' : 'Search meetings...'}"
              class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
              onkeyup="filterMeetings()">
          </div>
          <select id="meetingStatusFilter" class="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20" onchange="filterMeetings()">
            <option value="">${lang === 'th' ? 'สถานะทั้งหมด' : 'All Status'}</option>
            <option value="scheduled">${t('scheduled')}</option>
            <option value="in_progress">${t('inProgress')}</option>
            <option value="completed">${t('completed')}</option>
            <option value="cancelled">${t('cancelled')}</option>
          </select>
        </div>
      </div>

      <!-- Meetings List -->
      <div id="meetingsList" class="space-y-4">
        <div class="text-center py-8">
          <i class="fi fi-rr-spinner animate-spin text-3xl text-primary"></i>
          <p class="mt-2 text-gray-600">${t('loading')}</p>
        </div>
      </div>
    </div>
  `;

  generateDeviceFingerprint();
  await loadMeetingsData();
}

/**
 * โหลดข้อมูลการประชุม
 */
async function loadMeetingsData() {
  try {
    const result = await api.get('/api/meetings?page=1&status=&academicYear=');

    if (result.status === 'success') {
      MeetingState.meetings = result.data || [];
      renderMeetingsList();
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (error) {
    showAlert('error', t('error'), error.message);
  }
}

/**
 * แสดงรายการประชุม
 */
function renderMeetingsList() {
  const container = document.getElementById('meetingsList');
  const lang = AppState.language;
  let meetings = [...MeetingState.meetings];

  // Apply filters
  const searchTerm = document.getElementById('meetingSearchInput')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('meetingStatusFilter')?.value || '';

  if (searchTerm) {
    meetings = meetings.filter(m =>
      m.title.toLowerCase().includes(searchTerm) ||
      m.location?.toLowerCase().includes(searchTerm)
    );
  }

  if (statusFilter) {
    meetings = meetings.filter(m => m.status === statusFilter);
  }

  // Sort by date descending
  meetings.sort((a, b) => new Date(b.meeting_date) - new Date(a.meeting_date));

  if (meetings.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16 bg-white rounded-2xl border border-gray-100">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fi fi-rr-calendar-clock text-4xl text-gray-400"></i>
        </div>
        <p class="text-gray-500 font-medium">${lang === 'th' ? 'ไม่พบการประชุม' : 'No meetings found'}</p>
        <p class="text-gray-400 text-sm mt-1">${lang === 'th' ? 'ลองเปลี่ยนตัวกรองหรือสร้างการประชุมใหม่' : 'Try changing filters or create a new meeting'}</p>
      </div>
    `;
    return;
  }

  const statusConfig = {
    scheduled: {
      bg: 'bg-blue-500',
      light: 'bg-blue-50 border-blue-200',
      text: 'text-blue-700',
      icon: 'fi-rr-calendar',
      label: t('scheduled')
    },
    in_progress: {
      bg: 'bg-green-500',
      light: 'bg-green-50 border-green-200',
      text: 'text-green-700',
      icon: 'fi-rr-play-circle',
      label: t('inProgress')
    },
    completed: {
      bg: 'bg-gray-500',
      light: 'bg-gray-50 border-gray-200',
      text: 'text-gray-700',
      icon: 'fi-rr-check-circle',
      label: t('completed')
    },
    cancelled: {
      bg: 'bg-red-500',
      light: 'bg-red-50 border-red-200',
      text: 'text-red-700',
      icon: 'fi-rr-ban',
      label: t('cancelled')
    }
  };

  container.innerHTML = meetings.map((meeting, index) => {
    const status = statusConfig[meeting.status] || statusConfig.scheduled;
    const attendeeCount = meeting.attendance_stats?.total || 0;

    return `
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <!-- Status Bar -->
        <div class="h-1.5 ${status.bg}"></div>

        <div class="p-5">
          <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <!-- Left: Meeting Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start gap-4">
                <!-- Icon -->
                <div class="w-14 h-14 ${status.light} border rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <i class="fi ${status.icon} text-2xl ${status.text}"></i>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="font-bold text-gray-800 text-lg">${meeting.title}</h3>
                    <span class="px-2.5 py-1 ${status.light} border rounded-full text-xs font-semibold ${status.text}">
                      ${status.label}
                    </span>
                  </div>

                  <!-- Date/Time/Location -->
                  <div class="flex flex-wrap items-center gap-4 mt-3">
                    <div class="flex items-center gap-2 text-sm">
                      <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <i class="fi fi-rr-calendar text-blue-500"></i>
                      </div>
                      <span class="text-gray-700 font-medium">${formatDate(meeting.meeting_date)}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm">
                      <div class="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                        <i class="fi fi-rr-clock text-purple-500"></i>
                      </div>
                      <span class="text-gray-700 font-medium">${meeting.start_time || '-'} - ${meeting.end_time || '-'}</span>
                    </div>
                    ${meeting.location ? `
                      <div class="flex items-center gap-2 text-sm">
                        <div class="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                          <i class="fi fi-rr-marker text-orange-500"></i>
                        </div>
                        <span class="text-gray-700 font-medium">${meeting.location}</span>
                      </div>
                    ` : ''}
                    <div class="flex items-center gap-2 text-sm">
                      <div class="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <i class="fi fi-rr-users text-green-500"></i>
                      </div>
                      <span class="text-gray-700 font-medium">${attendeeCount} ${lang === 'th' ? 'คน' : 'people'}</span>
                    </div>
                  </div>

                  <!-- Badges -->
                  <div class="flex items-center gap-2 mt-3">
                    ${meeting.require_qr ? `
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                        <i class="fi fi-rr-qrcode"></i> QR Code
                      </span>
                    ` : ''}
                    ${meeting.require_location ? `
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium">
                        <i class="fi fi-rr-marker"></i> GPS
                      </span>
                    ` : ''}
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Actions -->
            <div class="flex items-center gap-2 flex-shrink-0 lg:border-l lg:pl-4 lg:ml-4 border-gray-100">
              ${meeting.status === 'scheduled' ? `
                <button onclick="startMeeting('${meeting.id}')" class="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm hover:shadow-md" title="${t('startMeeting')}">
                  <i class="fi fi-rr-play"></i>
                </button>
              ` : ''}
              ${meeting.status === 'in_progress' ? `
                <button onclick="openMeetingQR('${meeting.id}')" class="w-10 h-10 bg-primary hover:bg-primary-light text-white rounded-xl flex items-center justify-center transition-colors shadow-sm hover:shadow-md" title="${t('showQR')}">
                  <i class="fi fi-rr-qrcode"></i>
                </button>
                <button onclick="endMeeting('${meeting.id}')" class="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm hover:shadow-md" title="${t('endMeeting')}">
                  <i class="fi fi-rr-stop"></i>
                </button>
              ` : ''}
              <button onclick="viewMeetingDetails('${meeting.id}')" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl flex items-center justify-center transition-colors" title="${t('view')}">
                <i class="fi fi-rr-eye"></i>
              </button>
              ${meeting.status === 'scheduled' ? `
                <button onclick="editMeeting('${meeting.id}')" class="w-10 h-10 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-xl flex items-center justify-center transition-colors" title="${t('edit')}">
                  <i class="fi fi-rr-pencil"></i>
                </button>
                <button onclick="deleteMeeting('${meeting.id}')" class="w-10 h-10 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-xl flex items-center justify-center transition-colors" title="${t('delete')}">
                  <i class="fi fi-rr-trash"></i>
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * กรองการประชุม
 */
function filterMeetings() {
  renderMeetingsList();
}

// ==================== CREATE/EDIT MEETING MODAL ====================
/**
 * เปิด Modal สร้างการประชุม
 */
async function openCreateMeetingModal(meetingId = null) {
  const lang = AppState.language;
  const isEdit = !!meetingId;
  let meeting = null;

  if (isEdit) {
    meeting = MeetingState.meetings.find(m => m.id === meetingId);
  }

  // Load users list
  showLoading();
  try {
    const result = await api.get('/api/users?page=1&search=');

    if (result.status === 'success') {
      MeetingState.users = result.data || [];
    }
  } catch (error) {
    console.error('Load users error:', error);
  }
  hideLoading();

  const today = new Date().toISOString().split('T')[0];

  const modalContent = `
    <form id="meetingForm" onsubmit="saveMeeting(event, '${meetingId || ''}')" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">${t('meetingTitle')} *</label>
        <input type="text" id="meetingTitle" required value="${meeting?.title || ''}"
          class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="${lang === 'th' ? 'หัวข้อการประชุม' : 'Meeting title'}">
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">${t('meetingDate')} *</label>
          <input type="date" id="meetingDate" required value="${meeting?.meeting_date || today}"
            class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">${t('meetingLocation')}</label>
          <input type="text" id="meetingLocation" value="${meeting?.location || ''}"
            class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="${lang === 'th' ? 'สถานที่ประชุม' : 'Meeting location'}">
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'เวลาเริ่ม' : 'Start Time'}</label>
          <input type="time" id="meetingStartTime" value="${meeting?.start_time || '09:00'}"
            class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'เวลาสิ้นสุด' : 'End Time'}</label>
          <input type="time" id="meetingEndTime" value="${meeting?.end_time || '12:00'}"
            class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary">
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">${lang === 'th' ? 'รายละเอียด' : 'Description'}</label>
        <textarea id="meetingDescription" rows="3"
          class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="${lang === 'th' ? 'รายละเอียดเพิ่มเติม' : 'Additional details'}">${meeting?.description || ''}</textarea>
      </div>

      <!-- Verification Options -->
      <div class="bg-gray-50 rounded-xl p-4">
        <h4 class="font-medium text-gray-800 mb-3">${lang === 'th' ? 'การยืนยันตัวตน' : 'Verification Options'}</h4>
        <div class="space-y-3">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" id="requireQR" ${meeting?.require_qr !== false ? 'checked' : ''} class="w-5 h-5 rounded text-primary focus:ring-primary">
            <span class="text-gray-700">${t('requireQR')}</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" id="requireLocation" ${meeting?.require_location ? 'checked' : ''} onchange="toggleLocationSettings()" class="w-5 h-5 rounded text-primary focus:ring-primary">
            <span class="text-gray-700">${t('requireLocation')}</span>
          </label>
          <div id="locationSettings" class="${meeting?.require_location ? '' : 'hidden'} ml-8 space-y-2">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-xs text-gray-600">Latitude</label>
                <input type="number" step="any" id="meetingLat" value="${meeting?.location_lat || ''}"
                  class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg">
              </div>
              <div>
                <label class="text-xs text-gray-600">Longitude</label>
                <input type="number" step="any" id="meetingLng" value="${meeting?.location_lng || ''}"
                  class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg">
              </div>
            </div>
            <div>
              <label class="text-xs text-gray-600">${lang === 'th' ? 'รัศมี (เมตร)' : 'Radius (meters)'}</label>
              <input type="number" id="meetingRadius" value="${meeting?.location_radius || 100}" min="10" max="1000"
                class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg">
            </div>
            <button type="button" onclick="getCurrentLocationForMeeting()" class="text-sm text-primary hover:underline">
              <i class="fi fi-rr-marker mr-1"></i>${lang === 'th' ? 'ใช้ตำแหน่งปัจจุบัน' : 'Use current location'}
            </button>
          </div>
        </div>
      </div>

      <!-- Attendees Selection -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">${t('attendees')}</label>
        <label class="flex items-center gap-3 cursor-pointer mb-3">
          <input type="checkbox" id="selectAllUsers" onchange="toggleAllAttendees()" class="w-5 h-5 rounded text-primary focus:ring-primary">
          <span class="text-gray-700">${t('selectAll')}</span>
        </label>
        <div id="attendeesList" class="max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3 space-y-2">
          ${MeetingState.users.map(user => `
            <label class="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
              <input type="checkbox" name="attendees" value="${user.id}" class="attendee-checkbox w-4 h-4 rounded text-primary focus:ring-primary">
              <span class="text-gray-700">${lang === 'th' ? user.name : (user.name_en || user.name)}</span>
              <span class="text-xs text-gray-500">(${user.position || '-'})</span>
            </label>
          `).join('')}
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t">
        <button type="button" onclick="closeDataModal()" class="btn-secondary">${t('cancel')}</button>
        <button type="submit" class="btn-primary">${t('save')}</button>
      </div>
    </form>
  `;

  openDataModal(isEdit ? (lang === 'th' ? 'แก้ไขการประชุม' : 'Edit Meeting') : t('createMeeting'), modalContent);
}

/**
 * Toggle location settings visibility
 */
function toggleLocationSettings() {
  const checkbox = document.getElementById('requireLocation');
  const settings = document.getElementById('locationSettings');
  settings.classList.toggle('hidden', !checkbox.checked);
}

/**
 * Toggle all attendees
 */
function toggleAllAttendees() {
  const selectAll = document.getElementById('selectAllUsers');
  document.querySelectorAll('.attendee-checkbox').forEach(cb => {
    cb.checked = selectAll.checked;
  });
}

/**
 * Get current location for meeting
 */
function getCurrentLocationForMeeting() {
  if (!navigator.geolocation) {
    showAlert('error', t('error'), AppState.language === 'th' ? 'เบราว์เซอร์ไม่รองรับ Geolocation' : 'Browser does not support Geolocation');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      document.getElementById('meetingLat').value = position.coords.latitude.toFixed(6);
      document.getElementById('meetingLng').value = position.coords.longitude.toFixed(6);
    },
    (error) => {
      showAlert('error', t('error'), AppState.language === 'th' ? 'ไม่สามารถดึงตำแหน่งได้: ' + error.message : 'Cannot get location: ' + error.message);
    },
    { enableHighAccuracy: true }
  );
}

/**
 * บันทึกการประชุม
 */
async function saveMeeting(event, meetingId) {
  event.preventDefault();

  const attendees = Array.from(document.querySelectorAll('.attendee-checkbox:checked')).map(cb => cb.value);
  const selectAll = document.getElementById('selectAllUsers').checked;

  if (!selectAll && attendees.length === 0) {
    showAlert('error', t('error'), AppState.language === 'th' ? 'กรุณาเลือกผู้เข้าร่วมประชุมอย่างน้อย 1 คน' : 'Please select at least 1 attendee');
    return;
  }

  const meetingData = {
    title: document.getElementById('meetingTitle').value.trim(),
    meeting_date: document.getElementById('meetingDate').value,
    start_time: document.getElementById('meetingStartTime').value,
    end_time: document.getElementById('meetingEndTime').value,
    location: document.getElementById('meetingLocation').value.trim(),
    description: document.getElementById('meetingDescription').value.trim(),
    require_qr: document.getElementById('requireQR').checked,
    require_location: document.getElementById('requireLocation').checked,
    location_lat: document.getElementById('meetingLat').value ? parseFloat(document.getElementById('meetingLat').value) : null,
    location_lng: document.getElementById('meetingLng').value ? parseFloat(document.getElementById('meetingLng').value) : null,
    location_radius: parseInt(document.getElementById('meetingRadius').value) || 100,
    created_by: AppState.user.id,
    select_all_users: selectAll,
    attendees: selectAll ? null : attendees
  };

  showLoading();

  try {
    let result;
    if (meetingId) {
      meetingData.id = meetingId;
      meetingData.updated_by = AppState.user.id;
      result = await api.put('/api/meetings/'+meetingId, meetingData);
    } else {
      result = await api.post('/api/meetings', meetingData);
    }

    hideLoading();

    if (result.status === 'success') {
      closeDataModal();
      showAlert('success', t('success'), result.message);
      await loadMeetingsData();
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

/**
 * แก้ไขการประชุม
 */
function editMeeting(meetingId) {
  openCreateMeetingModal(meetingId);
}

/**
 * ลบการประชุม
 */
async function deleteMeeting(meetingId) {
  const confirm = await showConfirm(t('confirmDelete'), t('confirmDeleteMsg'));
  if (!confirm.isConfirmed) return;

  showLoading();
  try {
    const result = await api.delete('/api/meetings/'+meetingId);

    hideLoading();

    if (result.status === 'success') {
      showAlert('success', t('success'), result.message);
      await loadMeetingsData();
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

/**
 * เริ่มการประชุม
 */
async function startMeeting(meetingId) {
  const lang = AppState.language;
  const confirm = await showConfirm(
    t('startMeeting'),
    lang === 'th' ? 'ต้องการเริ่มการประชุมนี้หรือไม่?' : 'Do you want to start this meeting?'
  );
  if (!confirm.isConfirmed) return;

  showLoading();
  try {
    const result = await api.put('/api/meetings/'+meetingId+'/status', {status: 'in_progress'});

    hideLoading();

    if (result.status === 'success') {
      showAlert('success', t('success'), lang === 'th' ? 'เริ่มการประชุมแล้ว' : 'Meeting started');
      await loadMeetingsData();
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

/**
 * จบการประชุม
 */
async function endMeeting(meetingId) {
  const lang = AppState.language;
  const meeting = MeetingState.meetings.find(m => m.id === meetingId);

  const confirm = await showConfirm(
    t('endMeeting'),
    lang === 'th' ? 'ต้องการจบการประชุมนี้หรือไม่? ระบบจะแสดง QR Code สำหรับเช็คเอาท์' : 'Do you want to end this meeting? QR Code for checkout will be displayed'
  );
  if (!confirm.isConfirmed) return;

  showLoading();
  try {
    const result = await api.put('/api/meetings/'+meetingId+'/status', {status: 'completed'});

    hideLoading();

    if (result.status === 'success') {
      // แสดง QR Code สำหรับ Checkout ให้ผู้เข้าร่วมสแกนออก
      await showCheckoutQRAfterEnd(meetingId, meeting);
      await loadMeetingsData();
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

/**
 * แสดง QR Checkout หลังจบประชุม
 */
async function showCheckoutQRAfterEnd(meetingId, meeting) {
  const lang = AppState.language;

  MeetingState.currentMeeting = meeting;

  const modalContent = `
    <div class="text-center space-y-6">
      <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <i class="fi fi-rr-check-circle text-4xl text-green-600"></i>
      </div>

      <div>
        <h3 class="text-xl font-bold text-gray-800">${lang === 'th' ? 'จบการประชุมแล้ว' : 'Meeting Ended'}</h3>
        <p class="text-gray-600 mt-1">${meeting?.title || ''}</p>
      </div>

      <div class="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <p class="text-orange-800 font-medium">
          <i class="fi fi-rr-qrcode mr-2"></i>
          ${lang === 'th' ? 'แสดง QR Code ให้ผู้เข้าร่วมสแกนเพื่อเช็คเอาท์' : 'Show QR Code for attendees to check-out'}
        </p>
      </div>

      <div id="qrCodeContainer" class="bg-white p-6 rounded-2xl inline-block shadow-lg border-2 border-orange-200">
        <div id="qrCodeDisplay" class="w-64 h-64 flex items-center justify-center">
          <i class="fi fi-rr-spinner animate-spin text-3xl text-primary"></i>
        </div>
      </div>

      <div class="text-sm text-gray-500">
        <p id="qrTimer">${lang === 'th' ? 'QR Code จะรีเฟรชใน' : 'QR Code will refresh in'} <span id="qrCountdown">30</span> ${lang === 'th' ? 'วินาที' : 'seconds'}</p>
      </div>

      <button onclick="closeDataModal()" class="btn-primary px-8 py-3">
        <i class="fi fi-rr-check mr-2"></i>
        ${lang === 'th' ? 'เสร็จสิ้น' : 'Done'}
      </button>
    </div>
  `;

  openDataModal(lang === 'th' ? 'เช็คเอาท์ผู้เข้าร่วม' : 'Attendee Checkout', modalContent);

  // Generate QR for checkout
  await generateAndDisplayQR(meetingId, 'checkout');
  startQRRefreshTimer(meetingId, 'checkout');
}

// ==================== QR CODE DISPLAY ====================
/**
 * แสดง QR Code สำหรับ Check-in
 */
async function openMeetingQR(meetingId) {
  const lang = AppState.language;
  const meeting = MeetingState.meetings.find(m => m.id === meetingId);
  if (!meeting) return;

  MeetingState.currentMeeting = meeting;

  const modalContent = `
    <div class="text-center space-y-4">
      <h3 class="text-lg font-semibold">${meeting.title}</h3>
      <p class="text-gray-600">${formatDate(meeting.meeting_date)} | ${meeting.start_time} - ${meeting.end_time}</p>

      <div class="flex justify-center gap-4 mb-4">
        <button onclick="showQRType('checkin')" id="btnQRCheckin" class="px-4 py-2 rounded-lg bg-green-500 text-white font-medium">
          ${t('checkin')}
        </button>
        <button onclick="showQRType('checkout')" id="btnQRCheckout" class="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium">
          ${t('checkout')}
        </button>
      </div>

      <div id="qrCodeContainer" class="bg-white p-4 rounded-xl inline-block">
        <div id="qrCodeDisplay" class="w-64 h-64 flex items-center justify-center">
          <i class="fi fi-rr-spinner animate-spin text-3xl text-primary"></i>
        </div>
      </div>

      <div class="text-sm text-gray-500">
        <p id="qrTimer">${lang === 'th' ? 'QR Code จะรีเฟรชใน' : 'QR Code will refresh in'} <span id="qrCountdown">30</span> ${lang === 'th' ? 'วินาที' : 'seconds'}</p>
        <p class="mt-1">${lang === 'th' ? 'ให้ผู้เข้าร่วมสแกน QR Code นี้เพื่อเช็คอิน/เช็คเอาท์' : 'Let attendees scan this QR Code to check-in/check-out'}</p>
      </div>
    </div>
  `;

  openDataModal(t('showQR'), modalContent);

  // Start QR refresh
  await generateAndDisplayQR(meetingId, 'checkin');
  startQRRefreshTimer(meetingId, 'checkin');
}

/**
 * Switch QR Type
 */
function showQRType(type) {
  const btnCheckin = document.getElementById('btnQRCheckin');
  const btnCheckout = document.getElementById('btnQRCheckout');

  if (type === 'checkin') {
    btnCheckin.className = 'px-4 py-2 rounded-lg bg-green-500 text-white font-medium';
    btnCheckout.className = 'px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium';
  } else {
    btnCheckin.className = 'px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium';
    btnCheckout.className = 'px-4 py-2 rounded-lg bg-orange-500 text-white font-medium';
  }

  stopQRRefreshTimer();
  generateAndDisplayQR(MeetingState.currentMeeting.id, type);
  startQRRefreshTimer(MeetingState.currentMeeting.id, type);
}

/**
 * Generate and display QR Code
 */
async function generateAndDisplayQR(meetingId, type) {
  const container = document.getElementById('qrCodeDisplay');

  // ถ้า container ไม่มี (modal ถูกปิดแล้ว) ให้หยุด timer
  if (!container) {
    stopQRRefreshTimer();
    return;
  }

  try {
    const result = await api.post('/api/meetings/'+meetingId+'/token', {type: type});

    // ตรวจสอบอีกครั้งว่า container ยังอยู่
    const containerCheck = document.getElementById('qrCodeDisplay');
    if (!containerCheck) {
      stopQRRefreshTimer();
      return;
    }

    if (result.status === 'success') {
      const qrData = JSON.stringify({
        meetingId: meetingId,
        token: result.data.token,
        type: type,
        expires: result.data.expires_at
      });

      containerCheck.innerHTML = '';
      new QRCode(containerCheck, {
        text: qrData,
        width: 256,
        height: 256,
        colorDark: '#1c2b45',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      containerCheck.innerHTML = `<p class="text-red-500">${result.message}</p>`;
    }
  } catch (error) {
    const containerCheck = document.getElementById('qrCodeDisplay');
    if (containerCheck) {
      containerCheck.innerHTML = `<p class="text-red-500">${error.message}</p>`;
    }
    stopQRRefreshTimer();
  }
}

/**
 * Start QR refresh timer
 */
function startQRRefreshTimer(meetingId, type) {
  // หยุด timer เก่าก่อนเริ่มใหม่
  stopQRRefreshTimer();

  let countdown = 30;
  const countdownEl = document.getElementById('qrCountdown');

  MeetingState.qrRefreshInterval = setInterval(async () => {
    countdown--;
    if (countdownEl) countdownEl.textContent = countdown;

    if (countdown <= 0) {
      countdown = 30;
      await generateAndDisplayQR(meetingId, type);
    }
  }, 1000);
}

/**
 * Stop QR refresh timer
 */
function stopQRRefreshTimer() {
  if (MeetingState.qrRefreshInterval) {
    clearInterval(MeetingState.qrRefreshInterval);
    MeetingState.qrRefreshInterval = null;
  }
}

// ==================== MY MEETINGS PAGE ====================
/**
 * โหลดหน้าประชุมของฉัน
 */
async function loadMyMeetings() {
  const content = document.getElementById('pageContent');
  const lang = AppState.language;

  content.innerHTML = `
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">${t('myMeetings')}</h2>
        <p class="text-gray-600">${lang === 'th' ? 'รายการประชุมที่คุณต้องเข้าร่วม' : 'Meetings you need to attend'}</p>
      </div>

      <div id="myMeetingsList" class="space-y-4">
        <div class="text-center py-8">
          <i class="fi fi-rr-spinner animate-spin text-3xl text-primary"></i>
          <p class="mt-2 text-gray-600">${t('loading')}</p>
        </div>
      </div>
    </div>
  `;

  generateDeviceFingerprint();
  await loadMyMeetingsData();
}

/**
 * โหลดข้อมูลประชุมของฉัน
 */
async function loadMyMeetingsData() {
  try {
    const result = await api.get('/api/meetings/user/my-meetings?academicYear=');

    if (result.status === 'success') {
      renderMyMeetingsList(result.data || []);
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (error) {
    showAlert('error', t('error'), error.message);
  }
}

/**
 * แสดงรายการประชุมของฉัน
 */
function renderMyMeetingsList(meetings) {
  const container = document.getElementById('myMeetingsList');
  const lang = AppState.language;

  if (meetings.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 bg-white rounded-2xl">
        <i class="fi fi-rr-calendar-clock text-5xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">${lang === 'th' ? 'ไม่มีการประชุมที่ต้องเข้าร่วม' : 'No meetings to attend'}</p>
      </div>
    `;
    return;
  }

  // Sort by date
  meetings.sort((a, b) => {
    const dateA = new Date(a.meeting_date);
    const dateB = new Date(b.meeting_date);
    return dateA - dateB;
  });

  container.innerHTML = meetings.map(meeting => {
    const statusColors = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    const checkinStatus = meeting.my_status || 'pending';
    const checkinColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      checked_in: 'bg-green-100 text-green-800',
      checked_out: 'bg-blue-100 text-blue-800'
    };

    const checkinLabels = {
      pending: t('pending'),
      checked_in: t('checkedIn'),
      checked_out: t('checkedOut')
    };

    return `
      <div class="bg-white rounded-2xl shadow-sm p-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800 text-lg">${meeting.title}</h3>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
              <span><i class="fi fi-rr-calendar mr-1"></i>${formatDate(meeting.meeting_date)}</span>
              <span><i class="fi fi-rr-clock mr-1"></i>${meeting.start_time || '-'} - ${meeting.end_time || '-'}</span>
              ${meeting.location ? `<span><i class="fi fi-rr-marker mr-1"></i>${meeting.location}</span>` : ''}
            </div>
            <div class="flex items-center gap-2 mt-3">
              <span class="px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[meeting.status]}">${t(meeting.status === 'in_progress' ? 'inProgress' : meeting.status)}</span>
              <span class="px-2 py-0.5 rounded-full text-xs font-medium ${checkinColors[checkinStatus]}">${checkinLabels[checkinStatus]}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            ${meeting.status === 'in_progress' && checkinStatus === 'pending' ? `
              <button onclick="openCheckinModal('${meeting.id}')" class="btn-success flex items-center gap-2">
                <i class="fi fi-rr-qrcode"></i>
                <span>${t('checkin')}</span>
              </button>
            ` : ''}
            ${meeting.status === 'in_progress' && checkinStatus === 'checked_in' ? `
              <button onclick="openCheckoutModal('${meeting.id}')" class="btn-warning flex items-center gap-2">
                <i class="fi fi-rr-qrcode"></i>
                <span>${t('checkout')}</span>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== CHECK-IN/CHECK-OUT MODAL ====================
/**
 * เปิด Modal Check-in
 */
async function openCheckinModal(meetingId) {
  openCheckinCheckoutModal(meetingId, 'checkin');
}

/**
 * เปิด Modal Check-out
 */
async function openCheckoutModal(meetingId) {
  openCheckinCheckoutModal(meetingId, 'checkout');
}

/**
 * เปิด Modal Check-in/Check-out
 */
async function openCheckinCheckoutModal(meetingId, type) {
  const lang = AppState.language;
  const isCheckin = type === 'checkin';

  // Get meeting details
  showLoading();
  let meeting;
  try {
    const result = await api.get('/api/meetings/'+meetingId);

    if (result.status === 'success') {
      meeting = result.data;
    } else {
      hideLoading();
      showAlert('error', t('error'), result.message);
      return;
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
    return;
  }
  hideLoading();

  MeetingState.currentMeeting = meeting;

  // Check-out always requires QR scan
  const requireQR = isCheckin ? meeting.require_qr : true;

  const modalContent = `
    <div class="space-y-6">
      <div class="text-center">
        <div class="w-16 h-16 bg-${isCheckin ? 'green' : 'orange'}-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fi fi-rr-${isCheckin ? 'sign-in-alt' : 'sign-out-alt'} text-2xl text-${isCheckin ? 'green' : 'orange'}-600"></i>
        </div>
        <h3 class="text-xl font-bold text-gray-800">${isCheckin ? t('checkin') : t('checkout')}</h3>
        <p class="text-gray-600">${meeting.title}</p>
      </div>

      ${meeting.require_location && isCheckin ? `
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div class="flex items-center gap-3">
            <i class="fi fi-rr-marker text-yellow-600"></i>
            <div class="flex-1">
              <p class="font-medium text-yellow-800">${lang === 'th' ? 'ต้องยืนยันตำแหน่ง' : 'Location verification required'}</p>
              <p class="text-sm text-yellow-600" id="locationStatus">${lang === 'th' ? 'กำลังตรวจสอบตำแหน่ง...' : 'Checking location...'}</p>
            </div>
            <div id="locationIndicator">
              <i class="fi fi-rr-spinner animate-spin text-yellow-600"></i>
            </div>
          </div>
        </div>
      ` : ''}

      ${requireQR ? `
        <div class="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div class="flex items-center gap-3">
            <i class="fi fi-rr-qrcode text-purple-600"></i>
            <div class="flex-1">
              <p class="font-medium text-purple-800">${t('scanQR')}</p>
              <p class="text-sm text-purple-600">${lang === 'th' ? (isCheckin ? 'สแกน QR Code จากหน้าจอผู้จัดเพื่อเช็คอิน' : 'สแกน QR Code จากหน้าจอผู้จัดเพื่อเช็คเอาท์ออกจากห้องประชุม') : (isCheckin ? 'Scan QR Code from organizer screen to check-in' : 'Scan QR Code from organizer screen to check-out')}</p>
            </div>
          </div>
        </div>

        <div id="qrScannerContainer" class="bg-black rounded-xl overflow-hidden">
          <video id="qrVideo" class="w-full aspect-square"></video>
        </div>

        <div id="scanResult" class="hidden text-center">
          <i class="fi fi-rr-check-circle text-4xl text-green-500 mb-2"></i>
          <p class="text-green-600 font-medium">${lang === 'th' ? 'สแกนสำเร็จ' : 'Scan successful'}</p>
        </div>
      ` : `
        <button onclick="submitCheckinCheckout('${meetingId}', '${type}', null)" class="w-full btn-${isCheckin ? 'success' : 'warning'} py-3">
          ${isCheckin ? t('checkin') : t('checkout')}
        </button>
      `}

      <input type="hidden" id="scannedToken" value="">
    </div>
  `;

  openDataModal(isCheckin ? t('checkin') : t('checkout'), modalContent);

  // Start location tracking if required (only for check-in)
  if (meeting.require_location && isCheckin) {
    startLocationTracking(meeting);
  }

  // Start QR scanner - always for checkout, based on setting for checkin
  if (requireQR) {
    setTimeout(() => startQRScanner(meetingId, type), 500);
  }
}

/**
 * Start location tracking
 */
function startLocationTracking(meeting) {
  const lang = AppState.language;

  if (!navigator.geolocation) {
    updateLocationStatus(false, lang === 'th' ? 'เบราว์เซอร์ไม่รองรับ' : 'Browser not supported');
    return;
  }

  MeetingState.locationWatchId = navigator.geolocation.watchPosition(
    (position) => {
      MeetingState.currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      // Check if within radius
      const distance = calculateDistance(
        position.coords.latitude,
        position.coords.longitude,
        meeting.location_lat,
        meeting.location_lng
      );

      if (distance <= meeting.location_radius) {
        updateLocationStatus(true, lang === 'th' ? `อยู่ในพื้นที่ (${Math.round(distance)}m)` : `Within area (${Math.round(distance)}m)`);
      } else {
        updateLocationStatus(false, lang === 'th' ? `ห่างจากจุดหมาย ${Math.round(distance)}m` : `${Math.round(distance)}m from destination`);
      }
    },
    (error) => {
      updateLocationStatus(false, lang === 'th' ? 'ไม่สามารถดึงตำแหน่งได้' : 'Cannot get location');
    },
    { enableHighAccuracy: true, maximumAge: 0 }
  );
}

/**
 * Update location status UI
 */
function updateLocationStatus(valid, message) {
  const statusEl = document.getElementById('locationStatus');
  const indicatorEl = document.getElementById('locationIndicator');

  if (statusEl) statusEl.textContent = message;
  if (indicatorEl) {
    indicatorEl.innerHTML = valid
      ? '<i class="fi fi-rr-check-circle text-green-600"></i>'
      : '<i class="fi fi-rr-cross-circle text-red-600"></i>';
  }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Start QR Scanner
 */
async function startQRScanner(meetingId, type) {
  const video = document.getElementById('qrVideo');
  if (!video) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    video.srcObject = stream;
    video.play();

    // Use jsQR library to scan
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const scanInterval = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          try {
            const qrData = JSON.parse(code.data);
            if (qrData.meetingId === meetingId && qrData.type === type) {
              clearInterval(scanInterval);
              stream.getTracks().forEach(track => track.stop());

              document.getElementById('qrScannerContainer').classList.add('hidden');
              document.getElementById('scanResult').classList.remove('hidden');
              document.getElementById('scannedToken').value = qrData.token;

              // Submit check-in/out
              setTimeout(() => {
                submitCheckinCheckout(meetingId, type, qrData.token);
              }, 1000);
            }
          } catch (e) {
            // Invalid QR data, continue scanning
          }
        }
      }
    }, 200);

    // Store interval for cleanup
    MeetingState.scanInterval = scanInterval;
    MeetingState.videoStream = stream;
  } catch (error) {
    console.error('QR Scanner error:', error);
    showAlert('error', t('error'), AppState.language === 'th' ? 'ไม่สามารถเปิดกล้องได้' : 'Cannot open camera');
  }
}

/**
 * Submit Check-in/Check-out
 */
async function submitCheckinCheckout(meetingId, type, token) {
  const lang = AppState.language;
  const meeting = MeetingState.currentMeeting;

  // Cleanup
  if (MeetingState.locationWatchId) {
    navigator.geolocation.clearWatch(MeetingState.locationWatchId);
  }
  if (MeetingState.scanInterval) {
    clearInterval(MeetingState.scanInterval);
  }
  if (MeetingState.videoStream) {
    MeetingState.videoStream.getTracks().forEach(track => track.stop());
  }

  const checkinData = {
    meeting_id: meetingId,
    user_id: AppState.user.id,
    token: token,
    device_id: MeetingState.deviceFingerprint,
    latitude: MeetingState.currentLocation?.lat,
    longitude: MeetingState.currentLocation?.lng
  };

  showLoading();
  try {
    let result;
    if (type === 'checkin') {
      result = await api.post('/api/meetings/'+checkinData.meeting_id+'/checkin', checkinData);
    } else {
      result = await api.put('/api/meetings/'+checkinData.meeting_id+'/checkout', checkinData);
    }

    hideLoading();
    closeDataModal();

    if (result.status === 'success') {
      showAlert('success', t('success'), result.message);
      await loadMyMeetingsData();
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

/**
 * ดูรายละเอียดการประชุม
 */
async function viewMeetingDetails(meetingId) {
  const lang = AppState.language;

  showLoading();
  try {
    const result = await api.get('/api/meetings/'+meetingId+'/report');

    hideLoading();

    if (result.status !== 'success') {
      showAlert('error', t('error'), result.message);
      return;
    }

    const report = result.data;
    const meeting = report.meeting;
    const stats = report.stats;
    const attendees = report.attendees || [];

    const statusConfig = {
      scheduled: { bg: 'bg-blue-500', icon: 'fi-rr-calendar', label: t('scheduled') },
      in_progress: { bg: 'bg-green-500', icon: 'fi-rr-play', label: t('inProgress') },
      completed: { bg: 'bg-gray-500', icon: 'fi-rr-check', label: t('completed') },
      cancelled: { bg: 'bg-red-500', icon: 'fi-rr-ban', label: t('cancelled') }
    };

    const currentStatus = statusConfig[meeting.status] || statusConfig.scheduled;
    const attendanceRate = stats.total > 0 ? Math.round((stats.checked_in / stats.total) * 100) : 0;

    const modalContent = `
      <div class="space-y-6">
        <!-- Header with Status -->
        <div class="relative bg-gradient-to-r from-primary to-primary-light rounded-2xl p-6 text-white overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div class="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

          <div class="relative z-10">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-xl font-bold mb-1">${meeting.title}</h3>
                ${meeting.description ? `<p class="text-white/80 text-sm">${meeting.description}</p>` : ''}
              </div>
              <span class="px-3 py-1 ${currentStatus.bg} rounded-full text-xs font-medium flex items-center gap-1.5">
                <i class="fi ${currentStatus.icon}"></i>
                ${currentStatus.label}
              </span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div class="flex items-center gap-2">
                <i class="fi fi-rr-calendar text-secondary"></i>
                <span>${formatDate(meeting.meeting_date)}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fi fi-rr-clock text-secondary"></i>
                <span>${meeting.start_time} - ${meeting.end_time}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fi fi-rr-marker text-secondary"></i>
                <span>${meeting.location || '-'}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="fi fi-rr-users text-secondary"></i>
                <span>${stats.total} ${lang === 'th' ? 'คน' : 'people'}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Attendance Progress -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5">
          <div class="flex items-center justify-between mb-3">
            <h4 class="font-semibold text-gray-800">
              <i class="fi fi-rr-chart-pie-alt mr-2 text-primary"></i>
              ${lang === 'th' ? 'สถิติการเข้าร่วม' : 'Attendance Statistics'}
            </h4>
            <span class="text-2xl font-bold text-primary">${attendanceRate}%</span>
          </div>

          <div class="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
            <div class="h-full rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500" style="width: ${attendanceRate}%"></div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <i class="fi fi-rr-users text-white"></i>
              </div>
              <p class="text-2xl font-bold text-blue-700">${stats.total}</p>
              <p class="text-xs text-blue-600 font-medium">${lang === 'th' ? 'ทั้งหมด' : 'Total'}</p>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <i class="fi fi-rr-check text-white"></i>
              </div>
              <p class="text-2xl font-bold text-green-700">${stats.checked_in}</p>
              <p class="text-xs text-green-600 font-medium">${t('checkedIn')}</p>
            </div>
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border border-orange-200">
              <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <i class="fi fi-rr-sign-out-alt text-white"></i>
              </div>
              <p class="text-2xl font-bold text-orange-700">${stats.checked_out}</p>
              <p class="text-xs text-orange-600 font-medium">${t('checkedOut')}</p>
            </div>
            <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center border border-red-200">
              <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <i class="fi fi-rr-cross-circle text-white"></i>
              </div>
              <p class="text-2xl font-bold text-red-700">${stats.absent}</p>
              <p class="text-xs text-red-600 font-medium">${t('absent')}</p>
            </div>
          </div>
        </div>

        <!-- Attendees List -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-semibold text-gray-800">
              <i class="fi fi-rr-list mr-2 text-primary"></i>
              ${t('attendees')}
            </h4>
            <span class="text-sm text-gray-500">${attendees.length} ${lang === 'th' ? 'คน' : 'people'}</span>
          </div>

          ${attendees.length === 0 ? `
            <div class="text-center py-8 text-gray-400">
              <i class="fi fi-rr-users text-4xl mb-2"></i>
              <p>${lang === 'th' ? 'ไม่มีผู้เข้าร่วม' : 'No attendees'}</p>
            </div>
          ` : `
            <div class="max-h-72 overflow-y-auto space-y-2 custom-scrollbar">
              ${attendees.map((att, index) => {
                let statusClass, statusIcon, statusText;
                if (att.checkout_time) {
                  statusClass = 'bg-blue-50 border-blue-200';
                  statusIcon = 'fi-rr-check-double text-blue-500';
                  statusText = `<span class="text-blue-600">${t('checkedOut')}</span>`;
                } else if (att.checkin_time) {
                  statusClass = 'bg-green-50 border-green-200';
                  statusIcon = 'fi-rr-check text-green-500';
                  statusText = `<span class="text-green-600">${t('checkedIn')}</span>`;
                } else {
                  statusClass = 'bg-red-50 border-red-200';
                  statusIcon = 'fi-rr-hourglass-end text-red-500';
                  statusText = `<span class="text-red-600">${t('absent')}</span>`;
                }

                return `
                  <div class="flex items-center justify-between p-3 ${statusClass} rounded-xl border transition-all hover:shadow-sm">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center border shadow-sm">
                        <i class="fi ${statusIcon} text-lg"></i>
                      </div>
                      <div>
                        <p class="font-medium text-gray-800">${lang === 'th' ? att.user_name : (att.user_name_en || att.user_name)}</p>
                        <p class="text-xs text-gray-500">${att.position || '-'}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      ${statusText}
                      <div class="flex items-center gap-3 mt-1 text-xs">
                        ${att.checkin_time ? `<span class="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full"><i class="fi fi-rr-sign-in-alt"></i>${formatMeetingTime(att.checkin_time)}</span>` : ''}
                        ${att.checkout_time ? `<span class="inline-flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full"><i class="fi fi-rr-sign-out-alt"></i>${formatMeetingTime(att.checkout_time)}</span>` : ''}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    openDataModal(lang === 'th' ? 'รายละเอียดการประชุม' : 'Meeting Details', modalContent);

  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

// Cleanup on modal close
const originalCloseDataModal = typeof closeDataModal === 'function' ? closeDataModal : null;
if (originalCloseDataModal) {
  window.closeDataModal = function() {
    stopQRRefreshTimer();
    if (MeetingState.locationWatchId) {
      navigator.geolocation.clearWatch(MeetingState.locationWatchId);
    }
    if (MeetingState.scanInterval) {
      clearInterval(MeetingState.scanInterval);
    }
    if (MeetingState.videoStream) {
      MeetingState.videoStream.getTracks().forEach(track => track.stop());
    }
    originalCloseDataModal();
  };
}
