/**
 * Personnel Management System - JavaScript Part 5
 * Portfolio: PositionDuty, TeachingSummary, ProjectActivity, StudentActivity,
 *            MediaProduction, MediaUsage, FieldTrip, Competition
 * Converted for Node.js + Express backend
 */

// ==================== REUSABLE PORTFOLIO SECTION FACTORY ====================

function createPortfolioSection(cfg) {
  var _page = 1;
  var _yearFilter = '';

  // ==================== LOAD PAGE ====================
  function load() {
    var content = document.getElementById('pageContent');
    var lang = AppState.language;
    var currentYear = (AppState.config && AppState.config.current_academic_year) ? AppState.config.current_academic_year : '';
    _yearFilter = currentYear;

    content.innerHTML = '<div class="fade-in">' +
      '<div class="section-header flex justify-between items-center mb-6">' +
      '<h2 class="text-2xl font-bold text-primary flex items-center">' +
      '<span class="' + cfg.badgeBg + ' ' + cfg.badgeText + ' w-10 h-10 rounded-lg flex items-center justify-center mr-3">' +
      '<i class="fi ' + cfg.icon + '"></i></span>' + t(cfg.translationKey) + '</h2>' +
      '<button onclick="show' + cfg.name + 'Form()" class="btn-primary">' +
      '<i class="fi fi-rr-plus mr-1"></i>' + t('add') + '</button></div>' +
      renderFilterBar(cfg.prefix, 'filter' + cfg.name) +
      '<div id="' + cfg.prefix + 'Container">' +
      '<div class="py-12 flex justify-center"><div class="loading-spinner"></div></div>' +
      '</div></div>';

    loadData();
  }

  // ==================== FILTER ====================
  function filter() {
    _yearFilter = document.getElementById(cfg.prefix + 'FilterYear').value;
    loadData();
  }

  // ==================== LOAD DATA ====================
  async function loadData() {
    try {
      var user = AppState.user || {};
      var search = document.getElementById(cfg.prefix + 'SearchInput') ? document.getElementById(cfg.prefix + 'SearchInput').value : '';
      var result = await api.get('/api/portfolio/' + cfg.section + '?userId=' + user.id + '&page=' + _page + '&search=' + encodeURIComponent(search)).catch(function() {
        return { status: 'error', data: [] };
      });

      // กรองตามปีการศึกษา
      if (_yearFilter && result.data) {
        var filtered = [];
        for (var i = 0; i < result.data.length; i++) {
          if (result.data[i].academic_year === _yearFilter) {
            filtered.push(result.data[i]);
          }
        }
        result.data = filtered;
      }

      renderTable(result);
    } catch (error) {
      console.error('Load ' + cfg.section + ' error:', error);
    }
  }

  // ==================== RENDER TABLE ====================
  function renderTable(result) {
    var container = document.getElementById(cfg.prefix + 'Container');
    var lang = AppState.language;
    var data = result.data || [];

    // กรณีไม่มีข้อมูล
    if (data.length === 0) {
      container.innerHTML = '<div class="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">' +
        '<div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 text-4xl">' +
        '<i class="fi ' + cfg.icon + '"></i></div>' +
        '<h3 class="text-lg font-bold text-gray-700">' + t('noData') + '</h3>' +
        '<button onclick="show' + cfg.name + 'Form()" class="btn-secondary mt-4">' +
        '<i class="fi fi-rr-plus mr-1"></i>' + (lang === 'th' ? 'เพิ่มข้อมูล' : 'Add Data') + '</button></div>';
      return;
    }

    var html = '';

    // ==================== 1. DESKTOP VIEW (TABLE) ====================
    html += '<div class="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">';
    html += '<table class="w-full">';

    // Header Table
    html += '<thead class="' + cfg.headerGradient + ' text-white">';
    html += '<tr>';
    html += '<th class="px-4 py-3 text-center font-semibold text-sm w-16">#</th>';
    html += '<th class="px-4 py-3 text-center font-semibold text-sm w-24">' + (lang === 'th' ? 'ปีการศึกษา' : 'Year') + '</th>';
    for (var h = 0; h < cfg.columns.length; h++) {
      html += '<th class="px-4 py-3 text-left font-semibold text-sm">' + (lang === 'th' ? cfg.columns[h].th : cfg.columns[h].en) + '</th>';
    }
    html += '<th class="px-4 py-3 text-center font-semibold text-sm w-32">' + (lang === 'th' ? 'จัดการ' : 'Actions') + '</th>';
    html += '</tr></thead>';

    // Body Table
    html += '<tbody class="divide-y divide-gray-100">';
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      html += '<tr class="hover:bg-gray-50 transition-colors group" data-' + cfg.prefix + '-id="' + item.id + '">';
      html += '<td class="px-4 py-4 text-center text-gray-500 text-sm">' + (i + 1) + '</td>';
      html += '<td class="px-4 py-4 text-center"><span class="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs font-bold">' + (item.academic_year || '-') + '</span></td>';

      for (var c = 0; c < cfg.columns.length; c++) {
        var val = item[cfg.columns[c].field] || '-';
        // ตัดข้อความยาวในตาราง
        if (val.length > 50) val = val.substring(0, 47) + '...';
        html += '<td class="px-4 py-4">';
        if (c === 0) {
          html += '<div class="font-bold text-gray-800">' + val + '</div>';
        } else {
          html += '<div class="text-sm text-gray-600">' + val + '</div>';
        }
        html += '</td>';
      }

      html += '<td class="px-4 py-4 text-center">';
      html += '<div class="flex items-center justify-center gap-2 opacity-100 group-hover:opacity-100 transition-opacity">';
      html += '<button class="' + cfg.prefix + '-edit p-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors" title="' + t('edit') + '"><i class="fi fi-rr-edit"></i></button>';
      html += '<button class="' + cfg.prefix + '-delete p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="' + t('delete') + '"><i class="fi fi-rr-trash"></i></button>';
      html += '</div></td></tr>';
    }
    html += '</tbody></table></div>';

    // ==================== 2. MOBILE VIEW (CARDS) ====================
    html += '<div class="md:hidden space-y-4">';
    for (var m = 0; m < data.length; m++) {
      var mItem = data[m];
      html += '<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" data-' + cfg.prefix + '-id="' + mItem.id + '">';

      // Card Header
      html += '<div class="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">';
      html += '<div class="flex items-center gap-2">';
      html += '<span class="w-6 h-6 ' + cfg.badgeBg + ' ' + cfg.badgeText + ' rounded flex items-center justify-center text-xs font-bold">' + (m + 1) + '</span>';
      html += '<span class="text-sm font-bold text-gray-700">' + (lang === 'th' ? 'ปีการศึกษา' : 'Year') + ' ' + (mItem.academic_year || '-') + '</span>';
      html += '</div>';
      html += '<div class="flex gap-1">';
      html += '<button class="' + cfg.prefix + '-edit p-1.5 bg-white border border-gray-200 text-yellow-600 rounded hover:bg-yellow-50"><i class="fi fi-rr-edit"></i></button>';
      html += '<button class="' + cfg.prefix + '-delete p-1.5 bg-white border border-gray-200 text-red-600 rounded hover:bg-red-50"><i class="fi fi-rr-trash"></i></button>';
      html += '</div></div>';

      // Card Body
      html += '<div class="p-4 space-y-2">';
      for (var mc = 0; mc < cfg.columns.length; mc++) {
        var mVal = mItem[cfg.columns[mc].field] || '-';
        if (mc === 0) {
          html += '<h4 class="font-bold text-gray-800 text-base">' + mVal + '</h4>';
        } else {
          html += '<div class="text-sm text-gray-600 flex items-start gap-2">';
          html += '<span class="text-xs text-gray-400 min-w-0">' + (lang === 'th' ? cfg.columns[mc].th : cfg.columns[mc].en) + ':</span> ';
          html += '<span class="font-medium">' + mVal + '</span></div>';
        }
      }
      html += '</div></div>';
    }
    html += '</div>';

    container.innerHTML = html;
    attachButtons();
  }

  // ==================== ATTACH BUTTONS ====================
  function attachButtons() {
    var editBtns = document.querySelectorAll('.' + cfg.prefix + '-edit');
    var delBtns = document.querySelectorAll('.' + cfg.prefix + '-delete');

    for (var i = 0; i < editBtns.length; i++) {
      editBtns[i].onclick = function() {
        var id = this.closest('[data-' + cfg.prefix + '-id]').getAttribute('data-' + cfg.prefix + '-id');
        editRecord(id);
      };
    }

    for (var i = 0; i < delBtns.length; i++) {
      delBtns[i].onclick = function() {
        var id = this.closest('[data-' + cfg.prefix + '-id]').getAttribute('data-' + cfg.prefix + '-id');
        deleteRecord(id);
      };
    }
  }

  // ==================== SHOW FORM ====================
  async function showForm(data) {
    var lang = AppState.language;
    var user = AppState.user || {};
    var currentYear = (AppState.config && AppState.config.current_academic_year) ? AppState.config.current_academic_year : '';
    var copiedFromYear = '';

    // ถ้าเป็นการเพิ่มใหม่
    if (!data || !data.id) {
      showLoading();
      try {
        // 1. ตรวจสอบว่ามีข้อมูลปีนี้แล้วหรือไม่
        var checkResult = await api.get('/api/portfolio/check-year-data?userId=' + user.id + '&type=' + cfg.typeName + '&year=' + currentYear).catch(function() {
          return { exists: false };
        });

        if (checkResult.exists) {
          hideLoading();
          var confirm = await Swal.fire({
            icon: 'warning',
            title: lang === 'th' ? 'พบข้อมูลปีนี้แล้ว' : 'Data Already Exists',
            html: '<div class="text-center">' +
              '<div class="w-20 h-20 ' + cfg.badgeBg + ' rounded-full flex items-center justify-center mx-auto mb-4">' +
              '<i class="fi ' + cfg.icon + ' text-4xl ' + cfg.badgeText + '"></i></div>' +
              '<p class="text-gray-700 mb-2 text-lg">' +
              (lang === 'th' ? 'ท่านได้กรอกข้อมูล' + t(cfg.translationKey) + 'ของ' : 'You have already entered ' + t(cfg.translationKey) + ' for') +
              '</p>' +
              '<p class="' + cfg.badgeText + ' font-bold text-2xl mb-2">' + (lang === 'th' ? 'ปีการศึกษา ' : 'Academic Year ') + currentYear + '</p>' +
              '<p class="text-gray-600">' + (lang === 'th' ? 'ไปแล้ว' : 'already') + '</p></div>',
            showCancelButton: true,
            confirmButtonColor: '#8b5cf6',
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
          var latestResult = await api.get('/api/portfolio/latest-year-data?userId=' + user.id + '&type=' + cfg.typeName).catch(function() {
            return { status: 'error' };
          });

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

    // กำหนดปีการศึกษา
    var displayYear = currentYear;
    if (data && data.id && !copiedFromYear) {
      displayYear = data.academic_year || currentYear;
    }

    // สร้างข้อความแจ้งเตือนคัดลอก
    var copiedNotice = '';
    if (copiedFromYear) {
      copiedNotice = '<div class="' + cfg.badgeBg + ' border-l-4 border-' + cfg.accentColor + '-500 rounded-lg p-4 mb-6">' +
        '<div class="flex items-start gap-3">' +
        '<i class="fi fi-rr-copy-alt ' + cfg.badgeText + ' text-2xl mt-0.5"></i>' +
        '<div class="flex-1">' +
        '<p class="font-bold text-gray-900 mb-1">' +
        (lang === 'th' ? '📋 ข้อมูลคัดลอกจากปีการศึกษา ' + copiedFromYear : '📋 Data copied from academic year ' + copiedFromYear) +
        '</p>' +
        '<p class="text-sm text-gray-700">' +
        (lang === 'th'
          ? 'กรุณาตรวจสอบและแก้ไขข้อมูลที่เปลี่ยนแปลง แล้วกดบันทึก'
          : 'Please review and update changed information, then save') +
        '</p></div></div></div>';
    }

    // สร้างฟอร์ม
    var html = '<form id="' + cfg.prefix + 'Form" onsubmit="save' + cfg.name + '(event)">';
    html += '<input type="hidden" id="' + cfg.prefix + 'Id" value="' + (data.id || '') + '">';
    html += '<input type="hidden" id="' + cfg.prefix + 'AcademicYear" value="' + displayYear + '">';

    // ปีการศึกษา (readonly)
    html += '<div class="bg-white rounded-xl shadow-sm border p-6 mb-6">';
    html += '<label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">';
    html += '<i class="fi fi-rr-calendar mr-2 text-blue-500"></i>';
    html += (lang === 'th' ? 'ปีการศึกษา' : 'Academic Year');
    html += '</label>';
    html += '<input type="text" class="form-input bg-gray-100 font-semibold text-primary" value="' + displayYear + '" readonly>';
    html += '</div>';

    html += copiedNotice;

    // ฟิลด์ข้อมูล
    html += '<div class="bg-white rounded-xl shadow-sm border p-6 mb-6">';
    html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';

    for (var f = 0; f < cfg.fields.length; f++) {
      var field = cfg.fields[f];
      var fieldVal = data[field.key] || '';

      html += '<div' + (field.fullWidth ? ' class="md:col-span-2"' : '') + '>';
      html += '<label class="block text-sm text-gray-600 mb-1 font-medium">';
      if (field.icon) html += '<i class="fi ' + field.icon + ' mr-1"></i>';
      html += (lang === 'th' ? field.th : field.en);
      if (field.required) html += ' <span class="text-red-500">*</span>';
      html += '</label>';

      if (field.type === 'textarea') {
        html += '<textarea id="' + cfg.prefix + '_' + field.key + '" ' + (field.required ? 'required' : '') + ' rows="3" class="form-input" placeholder="' + (lang === 'th' ? field.th : field.en) + '">' + fieldVal + '</textarea>';
      } else if (field.type === 'select' && field.options) {
        html += '<select id="' + cfg.prefix + '_' + field.key + '" ' + (field.required ? 'required' : '') + ' class="form-select">';
        html += '<option value="">-- ' + (lang === 'th' ? 'เลือก' + field.th : 'Select ' + field.en) + ' --</option>';
        for (var o = 0; o < field.options.length; o++) {
          var opt = field.options[o];
          html += '<option value="' + opt.value + '"' + (fieldVal === opt.value ? ' selected' : '') + '>' + (lang === 'th' ? opt.th : opt.en) + '</option>';
        }
        html += '</select>';
      } else {
        html += '<input type="' + (field.type || 'text') + '" id="' + cfg.prefix + '_' + field.key + '" ' + (field.required ? 'required' : '') + ' value="' + fieldVal + '" class="form-input" placeholder="' + (lang === 'th' ? field.th : field.en) + '">';
      }
      html += '</div>';
    }

    html += '</div></div>';

    // ปุ่ม
    html += '<div class="flex gap-3">';
    html += '<button type="button" onclick="closeDataModal()" class="flex-1 btn-outline h-12">' + t('cancel') + '</button>';
    html += '<button type="submit" class="flex-1 btn-primary h-12">';
    html += '<i class="fi fi-rr-disk mr-2"></i>' + t('save');
    html += '</button></div>';
    html += '</form>';

    openDataModal((data.id ? t('edit') : t('add')) + ' ' + t(cfg.translationKey), html);
  }

  // ==================== SAVE ====================
  async function save(event) {
    event.preventDefault();
    showLoading();
    var user = AppState.user || {};
    var id = document.getElementById(cfg.prefix + 'Id').value || null;

    var saveData = {
      user_id: user.id,
      academic_year: document.getElementById(cfg.prefix + 'AcademicYear').value
    };

    for (var f = 0; f < cfg.fields.length; f++) {
      var field = cfg.fields[f];
      var el = document.getElementById(cfg.prefix + '_' + field.key);
      if (el) saveData[field.key] = el.value;
    }

    try {
      var result;
      if (id) {
        result = await api.put('/api/portfolio/' + cfg.section + '/' + id, saveData).catch(function(err) {
          return { status: 'error', message: err.message };
        });
      } else {
        result = await api.post('/api/portfolio/' + cfg.section, saveData).catch(function(err) {
          return { status: 'error', message: err.message };
        });
      }

      hideLoading();

      if (result.status === 'success') {
        closeDataModal();
        showAlert('success', t('success'), result.message);
        loadData();
      } else {
        showAlert('error', t('error'), result.message);
      }
    } catch (error) {
      hideLoading();
      showAlert('error', t('error'), error.message);
    }
  }

  // ==================== EDIT ====================
  async function editRecord(id) {
    showLoading();
    try {
      var result = await api.get('/api/portfolio/' + cfg.section + '/' + id).catch(function() {
        return { status: 'error' };
      });

      hideLoading();

      if (result.status === 'success') {
        showForm(result.data);
      } else {
        showAlert('error', t('error'), AppState.language === 'th' ? 'ไม่สามารถโหลดข้อมูลได้' : 'Cannot load data');
      }
    } catch (error) {
      hideLoading();
      showAlert('error', t('error'), error.message);
    }
  }

  // ==================== DELETE ====================
  async function deleteRecord(id) {
    var confirm = await showConfirm(t('confirmDelete'), t('confirmDeleteMsg'));
    if (confirm.isConfirmed) {
      showLoading();
      try {
        var result = await api.delete('/api/portfolio/' + cfg.section + '/' + id).catch(function(err) {
          return { status: 'error', message: err.message };
        });

        hideLoading();

        if (result.status === 'success') {
          showAlert('success', t('success'), result.message);
          loadData();
        } else {
          showAlert('error', t('error'), result.message);
        }
      } catch (error) {
        hideLoading();
        showAlert('error', t('error'), error.message);
      }
    }
  }

  return {
    load: load,
    filter: filter,
    loadData: loadData,
    showForm: showForm,
    save: save,
    editRecord: editRecord,
    deleteRecord: deleteRecord
  };
}


// ==================== 1. POSITION DUTY (ตำแหน่ง/หน้าที่หลัก/หน้าที่พิเศษ) ====================
var _positionDuty = createPortfolioSection({
  name: 'PositionDuty',
  prefix: 'posDuty',
  section: 'position-duty',
  typeName: 'PositionDuty',
  translationKey: 'positionDuty',
  icon: 'fi-rr-briefcase',
  badgeBg: 'bg-indigo-100',
  badgeText: 'text-indigo-600',
  accentColor: 'indigo',
  headerGradient: 'bg-gradient-to-r from-indigo-600 to-blue-600',
  columns: [
    { field: 'position_name', th: 'ตำแหน่ง/หน้าที่', en: 'Position/Duty' },
    { field: 'duty_type', th: 'ประเภท', en: 'Type' },
    { field: 'details', th: 'รายละเอียด', en: 'Details' }
  ],
  fields: [
    { key: 'position_name', th: 'ตำแหน่ง/หน้าที่', en: 'Position/Duty', required: true, icon: 'fi-rr-briefcase' },
    { key: 'duty_type', th: 'ประเภท', en: 'Type', required: true, icon: 'fi-rr-list', type: 'select', options: [
      { value: 'main', th: 'หน้าที่หลัก', en: 'Main Duty' },
      { value: 'special', th: 'หน้าที่พิเศษ', en: 'Special Duty' },
      { value: 'position', th: 'ตำแหน่ง', en: 'Position' }
    ]},
    { key: 'details', th: 'รายละเอียด', en: 'Details', type: 'textarea', fullWidth: true, icon: 'fi-rr-document' },
    { key: 'start_date', th: 'วันที่เริ่ม', en: 'Start Date', type: 'date', icon: 'fi-rr-calendar' },
    { key: 'end_date', th: 'วันที่สิ้นสุด', en: 'End Date', type: 'date', icon: 'fi-rr-calendar' },
    { key: 'notes', th: 'หมายเหตุ', en: 'Notes', type: 'textarea', fullWidth: true, icon: 'fi-rr-comment-alt' }
  ]
});

function loadPositionDuty() { _positionDuty.load(); }
function filterPositionDuty() { _positionDuty.filter(); }
function showPositionDutyForm(data) { _positionDuty.showForm(data); }
function savePositionDuty(e) { _positionDuty.save(e); }
function editPositionDuty(id) { _positionDuty.editRecord(id); }
function deletePositionDuty(id) { _positionDuty.deleteRecord(id); }


// ==================== 2. TEACHING SUMMARY (ตารางสรุปการปฏิบัติการสอน) ====================
var _teachingSummary = createPortfolioSection({
  name: 'TeachingSummary',
  prefix: 'teachSum',
  section: 'teaching-summary',
  typeName: 'TeachingSummary',
  translationKey: 'teachingSummary',
  icon: 'fi-rr-chalkboard-user',
  badgeBg: 'bg-emerald-100',
  badgeText: 'text-emerald-600',
  accentColor: 'emerald',
  headerGradient: 'bg-gradient-to-r from-emerald-600 to-teal-600',
  columns: [
    { field: 'subject', th: 'วิชาที่สอน', en: 'Subject' },
    { field: 'grade_level', th: 'ระดับชั้น', en: 'Grade Level' },
    { field: 'hours_per_week', th: 'ชม./สัปดาห์', en: 'Hours/Week' }
  ],
  fields: [
    { key: 'subject', th: 'วิชาที่สอน', en: 'Subject', required: true, icon: 'fi-rr-book' },
    { key: 'grade_level', th: 'ระดับชั้น', en: 'Grade Level', required: true, icon: 'fi-rr-users-alt' },
    { key: 'hours_per_week', th: 'จำนวนชั่วโมงต่อสัปดาห์', en: 'Hours per Week', type: 'number', icon: 'fi-rr-clock' },
    { key: 'semester', th: 'ภาคเรียน', en: 'Semester', icon: 'fi-rr-calendar', type: 'select', options: [
      { value: '1', th: 'ภาคเรียนที่ 1', en: 'Semester 1' },
      { value: '2', th: 'ภาคเรียนที่ 2', en: 'Semester 2' }
    ]},
    { key: 'students_count', th: 'จำนวนนักเรียน', en: 'Number of Students', type: 'number', icon: 'fi-rr-users' },
    { key: 'notes', th: 'หมายเหตุ', en: 'Notes', type: 'textarea', fullWidth: true, icon: 'fi-rr-comment-alt' }
  ]
});

function loadTeachingSummary() { _teachingSummary.load(); }
function filterTeachingSummary() { _teachingSummary.filter(); }
function showTeachingSummaryForm(data) { _teachingSummary.showForm(data); }
function saveTeachingSummary(e) { _teachingSummary.save(e); }
function editTeachingSummary(id) { _teachingSummary.editRecord(id); }
function deleteTeachingSummary(id) { _teachingSummary.deleteRecord(id); }


// ==================== 3. PROJECT ACTIVITY (ผลการปฏิบัติงานโครงการ/กิจกรรม) ====================
var _projectActivity = createPortfolioSection({
  name: 'ProjectActivity',
  prefix: 'projAct',
  section: 'project-activity',
  typeName: 'ProjectActivity',
  translationKey: 'projectActivity',
  icon: 'fi-rr-clipboard-list-check',
  badgeBg: 'bg-orange-100',
  badgeText: 'text-orange-600',
  accentColor: 'orange',
  headerGradient: 'bg-gradient-to-r from-orange-600 to-amber-600',
  columns: [
    { field: 'project_name', th: 'ชื่อโครงการ/กิจกรรม', en: 'Project/Activity' },
    { field: 'role', th: 'บทบาท/หน้าที่', en: 'Role' },
    { field: 'result', th: 'ผลการดำเนินงาน', en: 'Result' }
  ],
  fields: [
    { key: 'project_name', th: 'ชื่อโครงการ/กิจกรรม', en: 'Project/Activity Name', required: true, icon: 'fi-rr-folder' },
    { key: 'role', th: 'บทบาท/หน้าที่', en: 'Role', required: true, icon: 'fi-rr-user' },
    { key: 'budget', th: 'งบประมาณ (บาท)', en: 'Budget (THB)', icon: 'fi-rr-money-bill-wave' },
    { key: 'participants', th: 'จำนวนผู้เข้าร่วม', en: 'Participants', type: 'number', icon: 'fi-rr-users' },
    { key: 'start_date', th: 'วันที่เริ่ม', en: 'Start Date', type: 'date', icon: 'fi-rr-calendar' },
    { key: 'end_date', th: 'วันที่สิ้นสุด', en: 'End Date', type: 'date', icon: 'fi-rr-calendar' },
    { key: 'result', th: 'ผลการดำเนินงาน', en: 'Result', type: 'textarea', fullWidth: true, icon: 'fi-rr-chart-histogram' },
    { key: 'notes', th: 'หมายเหตุ', en: 'Notes', type: 'textarea', fullWidth: true, icon: 'fi-rr-comment-alt' }
  ]
});

function loadProjectActivity() { _projectActivity.load(); }
function filterProjectActivity() { _projectActivity.filter(); }
function showProjectActivityForm(data) { _projectActivity.showForm(data); }
function saveProjectActivity(e) { _projectActivity.save(e); }
function editProjectActivity(id) { _projectActivity.editRecord(id); }
function deleteProjectActivity(id) { _projectActivity.deleteRecord(id); }


// ==================== 4. STUDENT ACTIVITY (กิจกรรมพัฒนาผู้เรียน) ====================
var _studentActivity = createPortfolioSection({
  name: 'StudentActivity',
  prefix: 'stuAct',
  section: 'student-activity',
  typeName: 'StudentActivity',
  translationKey: 'studentActivity',
  icon: 'fi-rr-users-alt',
  badgeBg: 'bg-cyan-100',
  badgeText: 'text-cyan-600',
  accentColor: 'cyan',
  headerGradient: 'bg-gradient-to-r from-cyan-600 to-blue-600',
  columns: [
    { field: 'activity_name', th: 'ชื่อกิจกรรม', en: 'Activity Name' },
    { field: 'activity_type', th: 'ประเภท', en: 'Type' },
    { field: 'students_count', th: 'จำนวนนักเรียน', en: 'Students' }
  ],
  fields: [
    { key: 'activity_name', th: 'ชื่อกิจกรรม', en: 'Activity Name', required: true, icon: 'fi-rr-star' },
    { key: 'activity_type', th: 'ประเภทกิจกรรม', en: 'Activity Type', required: true, icon: 'fi-rr-list', type: 'select', options: [
      { value: 'guidance', th: 'แนะแนว', en: 'Guidance' },
      { value: 'scout', th: 'ลูกเสือ/เนตรนารี', en: 'Scout/Girl Guide' },
      { value: 'club', th: 'ชุมนุม', en: 'Club' },
      { value: 'social', th: 'กิจกรรมเพื่อสังคม', en: 'Social Activity' },
      { value: 'other', th: 'อื่นๆ', en: 'Other' }
    ]},
    { key: 'grade_level', th: 'ระดับชั้น', en: 'Grade Level', icon: 'fi-rr-users-alt' },
    { key: 'students_count', th: 'จำนวนนักเรียน', en: 'Number of Students', type: 'number', icon: 'fi-rr-users' },
    { key: 'semester', th: 'ภาคเรียน', en: 'Semester', icon: 'fi-rr-calendar', type: 'select', options: [
      { value: '1', th: 'ภาคเรียนที่ 1', en: 'Semester 1' },
      { value: '2', th: 'ภาคเรียนที่ 2', en: 'Semester 2' }
    ]},
    { key: 'details', th: 'รายละเอียด', en: 'Details', type: 'textarea', fullWidth: true, icon: 'fi-rr-document' },
    { key: 'notes', th: 'หมายเหตุ', en: 'Notes', type: 'textarea', fullWidth: true, icon: 'fi-rr-comment-alt' }
  ]
});

function loadStudentActivity() { _studentActivity.load(); }
function filterStudentActivity() { _studentActivity.filter(); }
function showStudentActivityForm(data) { _studentActivity.showForm(data); }
function saveStudentActivity(e) { _studentActivity.save(e); }
function editStudentActivity(id) { _studentActivity.editRecord(id); }
function deleteStudentActivity(id) { _studentActivity.deleteRecord(id); }


// ==================== 5. MEDIA PRODUCTION (ตารางสรุปการผลิตสื่อ/นวัตกรรม) ====================
var _mediaProduction = createPortfolioSection({
  name: 'MediaProduction',
  prefix: 'mediaProd',
  section: 'media-production',
  typeName: 'MediaProduction',
  translationKey: 'mediaProduction',
  icon: 'fi-rr-video-camera-alt',
  badgeBg: 'bg-pink-100',
  badgeText: 'text-pink-600',
  accentColor: 'pink',
  headerGradient: 'bg-gradient-to-r from-pink-600 to-rose-600',
  columns: [
    { field: 'media_name', th: 'ชื่อสื่อ/นวัตกรรม', en: 'Media/Innovation' },
    { field: 'media_type', th: 'ประเภท', en: 'Type' },
    { field: 'subject', th: 'กลุ่มสาระ', en: 'Subject Area' }
  ],
  fields: [
    { key: 'media_name', th: 'ชื่อสื่อ/นวัตกรรม', en: 'Media/Innovation Name', required: true, icon: 'fi-rr-video-camera-alt' },
    { key: 'media_type', th: 'ประเภทสื่อ', en: 'Media Type', required: true, icon: 'fi-rr-list', type: 'select', options: [
      { value: 'digital', th: 'สื่อดิจิทัล', en: 'Digital Media' },
      { value: 'printed', th: 'สื่อสิ่งพิมพ์', en: 'Printed Media' },
      { value: 'innovation', th: 'นวัตกรรม', en: 'Innovation' },
      { value: 'other', th: 'อื่นๆ', en: 'Other' }
    ]},
    { key: 'subject', th: 'กลุ่มสาระ/วิชา', en: 'Subject Area', icon: 'fi-rr-book' },
    { key: 'grade_level', th: 'ระดับชั้นที่ใช้', en: 'Grade Level Used', icon: 'fi-rr-users-alt' },
    { key: 'objective', th: 'วัตถุประสงค์', en: 'Objective', type: 'textarea', fullWidth: true, icon: 'fi-rr-target' },
    { key: 'result', th: 'ผลที่ได้รับ', en: 'Result', type: 'textarea', fullWidth: true, icon: 'fi-rr-chart-histogram' },
    { key: 'notes', th: 'หมายเหตุ', en: 'Notes', type: 'textarea', fullWidth: true, icon: 'fi-rr-comment-alt' }
  ]
});

function loadMediaProduction() { _mediaProduction.load(); }
function filterMediaProduction() { _mediaProduction.filter(); }
function showMediaProductionForm(data) { _mediaProduction.showForm(data); }
function saveMediaProduction(e) { _mediaProduction.save(e); }
function editMediaProduction(id) { _mediaProduction.editRecord(id); }
function deleteMediaProduction(id) { _mediaProduction.deleteRecord(id); }


// ==================== 6. MEDIA USAGE (ตารางสรุปการใช้สื่อประเภทต่างๆ) ====================
var _mediaUsage = createPortfolioSection({
  name: 'MediaUsage',
  prefix: 'mediaUse',
  section: 'media-usage',
  typeName: 'MediaUsage',
  translationKey: 'mediaUsage',
  icon: 'fi-rr-play-alt',
  badgeBg: 'bg-violet-100',
  badgeText: 'text-violet-600',
  accentColor: 'violet',
  headerGradient: 'bg-gradient-to-r from-violet-600 to-purple-600',
  columns: [
    { field: 'media_name', th: 'ชื่อสื่อที่ใช้', en: 'Media Used' },
    { field: 'usage_type', th: 'ประเภทสื่อ', en: 'Media Type' },
    { field: 'subject', th: 'กลุ่มสาระ', en: 'Subject Area' }
  ],
  fields: [
    { key: 'media_name', th: 'ชื่อสื่อที่ใช้', en: 'Media Name', required: true, icon: 'fi-rr-play-alt' },
    { key: 'usage_type', th: 'ประเภทสื่อ', en: 'Media Type', required: true, icon: 'fi-rr-list', type: 'select', options: [
      { value: 'textbook', th: 'หนังสือเรียน', en: 'Textbook' },
      { value: 'worksheet', th: 'ใบงาน/ใบความรู้', en: 'Worksheet' },
      { value: 'digital', th: 'สื่อดิจิทัล', en: 'Digital Media' },
      { value: 'equipment', th: 'อุปกรณ์การสอน', en: 'Teaching Equipment' },
      { value: 'other', th: 'อื่นๆ', en: 'Other' }
    ]},
    { key: 'subject', th: 'กลุ่มสาระ/วิชา', en: 'Subject Area', icon: 'fi-rr-book' },
    { key: 'grade_level', th: 'ระดับชั้น', en: 'Grade Level', icon: 'fi-rr-users-alt' },
    { key: 'frequency', th: 'ความถี่ในการใช้', en: 'Usage Frequency', icon: 'fi-rr-time-forward' },
    { key: 'result', th: 'ผลจากการใช้สื่อ', en: 'Result', type: 'textarea', fullWidth: true, icon: 'fi-rr-chart-histogram' },
    { key: 'notes', th: 'หมายเหตุ', en: 'Notes', type: 'textarea', fullWidth: true, icon: 'fi-rr-comment-alt' }
  ]
});

function loadMediaUsage() { _mediaUsage.load(); }
function filterMediaUsage() { _mediaUsage.filter(); }
function showMediaUsageForm(data) { _mediaUsage.showForm(data); }
function saveMediaUsage(e) { _mediaUsage.save(e); }
function editMediaUsage(id) { _mediaUsage.editRecord(id); }
function deleteMediaUsage(id) { _mediaUsage.deleteRecord(id); }


// ==================== 7. FIELD TRIP (การนำนักเรียนไปศึกษาค้นคว้า/ทัศนศึกษา) ====================
var _fieldTrip = createPortfolioSection({
  name: 'FieldTrip',
  prefix: 'fieldTrip',
  section: 'field-trip',
  typeName: 'FieldTrip',
  translationKey: 'fieldTrip',
  icon: 'fi-rr-bus-alt',
  badgeBg: 'bg-lime-100',
  badgeText: 'text-lime-600',
  accentColor: 'lime',
  headerGradient: 'bg-gradient-to-r from-lime-600 to-green-600',
  columns: [
    { field: 'destination', th: 'สถานที่', en: 'Destination' },
    { field: 'trip_date', th: 'วันที่', en: 'Date' },
    { field: 'students_count', th: 'จำนวนนักเรียน', en: 'Students' }
  ],
  fields: [
    { key: 'destination', th: 'สถานที่ศึกษา/ทัศนศึกษา', en: 'Destination', required: true, icon: 'fi-rr-marker' },
    { key: 'subject', th: 'กลุ่มสาระ/วิชา', en: 'Subject Area', icon: 'fi-rr-book' },
    { key: 'grade_level', th: 'ระดับชั้น', en: 'Grade Level', icon: 'fi-rr-users-alt' },
    { key: 'students_count', th: 'จำนวนนักเรียน', en: 'Number of Students', type: 'number', icon: 'fi-rr-users' },
    { key: 'trip_date', th: 'วันที่ไป', en: 'Trip Date', type: 'date', icon: 'fi-rr-calendar' },
    { key: 'objective', th: 'วัตถุประสงค์', en: 'Objective', type: 'textarea', fullWidth: true, icon: 'fi-rr-target' },
    { key: 'result', th: 'ผลที่ได้รับ', en: 'Result', type: 'textarea', fullWidth: true, icon: 'fi-rr-chart-histogram' },
    { key: 'notes', th: 'หมายเหตุ', en: 'Notes', type: 'textarea', fullWidth: true, icon: 'fi-rr-comment-alt' }
  ]
});

function loadFieldTrip() { _fieldTrip.load(); }
function filterFieldTrip() { _fieldTrip.filter(); }
function showFieldTripForm(data) { _fieldTrip.showForm(data); }
function saveFieldTrip(e) { _fieldTrip.save(e); }
function editFieldTrip(id) { _fieldTrip.editRecord(id); }
function deleteFieldTrip(id) { _fieldTrip.deleteRecord(id); }


// ==================== 8. COMPETITION (ตารางสรุปการฝึกซ้อมส่งนักเรียนแข่งขัน) ====================
var _competition = createPortfolioSection({
  name: 'Competition',
  prefix: 'compete',
  section: 'competition',
  typeName: 'Competition',
  translationKey: 'competition',
  icon: 'fi-rr-trophy',
  badgeBg: 'bg-yellow-100',
  badgeText: 'text-yellow-600',
  accentColor: 'yellow',
  headerGradient: 'bg-gradient-to-r from-yellow-600 to-orange-600',
  columns: [
    { field: 'competition_name', th: 'ชื่อรายการแข่งขัน', en: 'Competition' },
    { field: 'level', th: 'ระดับ', en: 'Level' },
    { field: 'result', th: 'ผลการแข่งขัน', en: 'Result' }
  ],
  fields: [
    { key: 'competition_name', th: 'ชื่อรายการแข่งขัน', en: 'Competition Name', required: true, icon: 'fi-rr-trophy' },
    { key: 'level', th: 'ระดับการแข่งขัน', en: 'Competition Level', required: true, icon: 'fi-rr-signal-alt', type: 'select', options: [
      { value: 'school', th: 'ระดับโรงเรียน', en: 'School Level' },
      { value: 'district', th: 'ระดับเขต', en: 'District Level' },
      { value: 'provincial', th: 'ระดับจังหวัด', en: 'Provincial Level' },
      { value: 'regional', th: 'ระดับภาค', en: 'Regional Level' },
      { value: 'national', th: 'ระดับชาติ', en: 'National Level' },
      { value: 'international', th: 'ระดับนานาชาติ', en: 'International Level' }
    ]},
    { key: 'subject', th: 'กลุ่มสาระ/ประเภท', en: 'Subject/Category', icon: 'fi-rr-book' },
    { key: 'students_info', th: 'รายชื่อนักเรียน', en: 'Student Names', type: 'textarea', fullWidth: true, icon: 'fi-rr-users' },
    { key: 'competition_date', th: 'วันที่แข่งขัน', en: 'Competition Date', type: 'date', icon: 'fi-rr-calendar' },
    { key: 'venue', th: 'สถานที่จัดแข่งขัน', en: 'Venue', icon: 'fi-rr-marker' },
    { key: 'result', th: 'ผลการแข่งขัน', en: 'Result', required: true, icon: 'fi-rr-medal' },
    { key: 'notes', th: 'หมายเหตุ', en: 'Notes', type: 'textarea', fullWidth: true, icon: 'fi-rr-comment-alt' }
  ]
});

function loadCompetition() { _competition.load(); }
function filterCompetition() { _competition.filter(); }
function showCompetitionForm(data) { _competition.showForm(data); }
function saveCompetition(e) { _competition.save(e); }
function editCompetition(id) { _competition.editRecord(id); }
function deleteCompetition(id) { _competition.deleteRecord(id); }
