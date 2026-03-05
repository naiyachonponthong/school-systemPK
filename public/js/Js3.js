/**
 * Personnel Management System - JavaScript Part 3
 * Education, Scout Qualification, Work History
 * Converted for Node.js + Express backend
 */

// ==================== EDUCATION SECTION ====================
var educationPage = 1;
var educationYearFilter = '';

async function loadEducation() {
  var content = document.getElementById('pageContent');
  var lang = AppState.language;
  var currentYear = (AppState.config && AppState.config.current_academic_year) ? AppState.config.current_academic_year : '';
  educationYearFilter = currentYear;

  content.innerHTML = '<div class="fade-in">' +
    '<div class="section-header flex justify-between items-center mb-6">' +
    '<h2 class="text-2xl font-bold text-primary flex items-center">' +
    '<span class="bg-purple-100 text-purple-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">' +
    '<i class="fi fi-rr-graduation-cap"></i></span>' + t('education') + '</h2>' +
    '<button onclick="showEducationForm()" class="btn-primary">' +
    '<i class="fi fi-rr-plus mr-1"></i>' + t('add') + '</button></div>' +
    renderFilterBar('edu', 'filterEducation') +
    '<div id="educationContainer">' +
    '<div class="py-12 flex justify-center"><div class="loading-spinner"></div></div>' +
    '</div></div>';

  loadEducationData();
}

function filterEducation() {
  educationYearFilter = document.getElementById('eduFilterYear').value;
  loadEducationData();
}

async function loadEducationData() {
  try {
    var user = AppState.user || {};
    var search = document.getElementById('eduSearchInput') ? document.getElementById('eduSearchInput').value : '';
    var result = await api.get('/api/portfolio/education?userId='+user.id+'&page='+educationPage+'&search='+encodeURIComponent(search)).catch(function() {
      return { status: 'error', data: [] };
    });

    // กรองตามปีการศึกษา
    if (educationYearFilter && result.data) {
      var filtered = [];
      for (var i = 0; i < result.data.length; i++) {
        if (result.data[i].academic_year === educationYearFilter) {
          filtered.push(result.data[i]);
        }
      }
      result.data = filtered;
    }

    renderEducationTable(result);
  } catch (error) {
    console.error('Load education error:', error);
  }
}

function renderEducationTable(result) {
  var container = document.getElementById('educationContainer');
  var lang = AppState.language;
  var data = result.data || [];

  // กรณีไม่มีข้อมูล
  if (data.length === 0) {
    container.innerHTML = '<div class="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">' +
      '<div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 text-4xl">' +
      '<i class="fi fi-rr-graduation-cap"></i></div>' +
      '<h3 class="text-lg font-bold text-gray-700">' + t('noData') + '</h3>' +
      '<button onclick="showEducationForm()" class="btn-secondary mt-4">' +
      '<i class="fi fi-rr-plus mr-1"></i>' + (lang === 'th' ? 'เพิ่มข้อมูล' : 'Add Data') + '</button></div>';
    return;
  }

  var html = '';

  // ==================== 1. DESKTOP VIEW (TABLE) ====================
  // ใช้ class "hidden md:block" เพื่อแสดงเฉพาะจอขนาดกลางขึ้นไป (Tablet/PC)
  html += '<div class="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">';
  html += '<table class="w-full">';

  // Header Table
  html += '<thead class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">';
  html += '<tr>';
  html += '<th class="px-4 py-3 text-center font-semibold text-sm w-16">#</th>';
  html += '<th class="px-4 py-3 text-center font-semibold text-sm w-24">' + (lang === 'th' ? 'ปีการศึกษา' : 'Year') + '</th>';
  html += '<th class="px-4 py-3 text-left font-semibold text-sm">' + (lang === 'th' ? 'ระดับ/สถาบัน' : 'Level/Institution') + '</th>';
  html += '<th class="px-4 py-3 text-left font-semibold text-sm">' + (lang === 'th' ? 'วุฒิ/สาขา' : 'Degree/Major') + '</th>';
  html += '<th class="px-4 py-3 text-center font-semibold text-sm">' + (lang === 'th' ? 'จบปี' : 'Grad. Year') + '</th>';
  html += '<th class="px-4 py-3 text-center font-semibold text-sm w-32">' + (lang === 'th' ? 'จัดการ' : 'Actions') + '</th>';
  html += '</tr></thead>';

  // Body Table
  html += '<tbody class="divide-y divide-gray-100">';

  var rowNumber = 1;
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var eduList = [];
    try { if (item.education_list) eduList = JSON.parse(item.education_list); } catch(e) {}
    if (!Array.isArray(eduList) || eduList.length === 0) {
      eduList = [{ level: item.level || '-', graduation_year: item.graduation_year || '-', institution: item.institution || '-', major: item.major || '-' }];
    }

    // Loop รายการย่อยในตาราง
    for (var j = 0; j < eduList.length; j++) {
      html += '<tr class="hover:bg-purple-50 transition-colors group" data-edu-id="' + item.id + '">';
      // ลำดับ
      html += '<td class="px-4 py-4 text-center text-gray-500 text-sm">' + rowNumber + '</td>';
      // ปีการศึกษา
      html += '<td class="px-4 py-4 text-center"><span class="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs font-bold">' + (item.academic_year || '-') + '</span></td>';
      // ระดับ/สถาบัน
      html += '<td class="px-4 py-4">';
      html += '<div class="font-bold text-gray-800">' + eduList[j].level + '</div>';
      html += '<div class="text-xs text-gray-500 mt-0.5"><i class="fi fi-rr-building mr-1"></i>' + eduList[j].institution + '</div>';
      html += '</td>';
      // สาขา
      html += '<td class="px-4 py-4 text-sm text-gray-600">' + (eduList[j].major || '-') + '</td>';
      // ปีที่จบ
      html += '<td class="px-4 py-4 text-center text-sm font-medium text-gray-700">' + eduList[j].graduation_year + '</td>';
      // ปุ่มจัดการ (แสดงเฉพาะแถวแรกของกลุ่ม หรือแสดงทุกแถวก็ได้ตามดีไซน์ แต่ ID อ้างอิงตัวเดียวกัน)
      html += '<td class="px-4 py-4 text-center">';
      if (j === 0) {
         html += '<div class="flex items-center justify-center gap-2 opacity-100 group-hover:opacity-100 transition-opacity">';
         html += '<button class="edu-edit p-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors" title="' + t('edit') + '"><i class="fi fi-rr-edit"></i></button>';
         html += '<button class="edu-delete p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="' + t('delete') + '"><i class="fi fi-rr-trash"></i></button>';
         html += '</div>';
      }
      html += '</td>';
      html += '</tr>';
      rowNumber++;
    }
  }
  html += '</tbody></table></div>';

  // ==================== 2. MOBILE VIEW (CARDS) ====================
  // ใช้ class "md:hidden" เพื่อแสดงเฉพาะจอมือถือ
  html += '<div class="md:hidden space-y-4">';

  var cardIndex = 1;
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var eduList = [];
    try { if (item.education_list) eduList = JSON.parse(item.education_list); } catch(e) {}
    if (!Array.isArray(eduList) || eduList.length === 0) {
      eduList = [{ level: item.level || '-', graduation_year: item.graduation_year || '-', institution: item.institution || '-', major: item.major || '-' }];
    }

    // สร้าง Card Container สำหรับแต่ละปีการศึกษา
    html += '<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" data-edu-id="' + item.id + '">';

    // Card Header (ปีการศึกษา + ปุ่มจัดการ)
    html += '<div class="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">';
    html += '<div class="flex items-center gap-2">';
    html += '<span class="w-6 h-6 bg-purple-100 text-purple-600 rounded flex items-center justify-center text-xs font-bold">' + cardIndex + '</span>';
    html += '<span class="text-sm font-bold text-gray-700">' + (lang === 'th' ? 'ปีการศึกษา' : 'Year') + ' ' + (item.academic_year || '-') + '</span>';
    html += '</div>';
    html += '<div class="flex gap-1">';
    html += '<button class="edu-edit p-1.5 bg-white border border-gray-200 text-yellow-600 rounded hover:bg-yellow-50"><i class="fi fi-rr-edit"></i></button>';
    html += '<button class="edu-delete p-1.5 bg-white border border-gray-200 text-red-600 rounded hover:bg-red-50"><i class="fi fi-rr-trash"></i></button>';
    html += '</div>';
    html += '</div>'; // End Header

    // Card Body (รายการย่อย)
    html += '<div class="p-4 space-y-4">';
    for (var j = 0; j < eduList.length; j++) {
        // เส้นคั่นระหว่างรายการย่อย (ยกเว้นรายการแรก)
        if (j > 0) html += '<hr class="border-dashed border-gray-200">';

        html += '<div>';
        html += '<div class="flex justify-between items-start mb-1">';
        html += '<h4 class="font-bold text-gray-800 text-base">' + eduList[j].level + '</h4>';
        html += '<span class="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap">' + (lang === 'th' ? 'จบปี ' : 'Grad: ') + eduList[j].graduation_year + '</span>';
        html += '</div>';

        html += '<div class="text-sm text-gray-600 mb-1 flex items-start gap-2">';
        html += '<i class="fi fi-rr-building mt-0.5 text-purple-400"></i>';
        html += '<span>' + eduList[j].institution + '</span>';
        html += '</div>';

        if (eduList[j].major && eduList[j].major !== '-') {
            html += '<div class="text-sm text-gray-500 flex items-start gap-2">';
            html += '<i class="fi fi-rr-diploma mt-0.5 text-orange-400"></i>';
            html += '<span>' + eduList[j].major + '</span>';
            html += '</div>';
        }
        html += '</div>';
    }
    html += '</div>'; // End Body
    html += '</div>'; // End Card Wrapper

    cardIndex++;
  }
  html += '</div>'; // End Mobile View

  container.innerHTML = html;
  attachEduButtons();
}

function attachEduButtons() {
  var editBtns = document.querySelectorAll('.edu-edit');
  var delBtns = document.querySelectorAll('.edu-delete');

  for (var i = 0; i < editBtns.length; i++) {
    editBtns[i].onclick = function() {
      var id = this.closest('[data-edu-id]').getAttribute('data-edu-id');
      editEducation(id);
    };
  }

  for (var i = 0; i < delBtns.length; i++) {
    delBtns[i].onclick = function() {
      var id = this.closest('[data-edu-id]').getAttribute('data-edu-id');
      deleteEducationRecord(id);
    };
  }
}

async function showEducationForm(data) {
  var lang = AppState.language;
  var user = AppState.user || {};
  var currentYear = (AppState.config && AppState.config.current_academic_year) ? AppState.config.current_academic_year : '';
  var copiedFromYear = '';

  // ถ้าเป็นการเพิ่มใหม่
  if (!data || !data.id) {
    showLoading();
    try {
      // 1. ตรวจสอบว่ามีข้อมูลปีนี้แล้วหรือไม่
      var checkResult = await api.get('/api/portfolio/check-year-data?userId='+user.id+'&type=Education&year='+currentYear).catch(function() {
        return { exists: false };
      });

      if (checkResult.exists) {
        hideLoading();
        var confirm = await Swal.fire({
          icon: 'warning',
          title: lang === 'th' ? 'พบข้อมูลปีนี้แล้ว' : 'Data Already Exists',
          html: '<div class="text-center">' +
            '<div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">' +
            '<i class="fi fi-rr-graduation-cap text-4xl text-purple-600"></i></div>' +
            '<p class="text-gray-700 mb-2 text-lg">' +
            (lang === 'th' ? 'ท่านได้กรอกข้อมูลประวัติการศึกษาของ' : 'You have already entered education history for') +
            '</p>' +
            '<p class="text-purple-600 font-bold text-2xl mb-2">ปีการศึกษา ' + currentYear + '</p>' +
            '<p class="text-gray-600">' + (lang === 'th' ? 'ไปแล้ว' : 'already') + '</p>' +
            '</div>',
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
        var latestResult = await api.get('/api/portfolio/latest-year-data?userId='+user.id+'&type=Education').catch(function() {
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
              ? '📚 ดึงข้อมูลจากปีการศึกษา ' + copiedFromYear + ' มาแสดงแล้ว กรุณาตรวจสอบและแก้ไขข้อมูลที่เปลี่ยนแปลง'
              : '📚 Data copied from academic year ' + copiedFromYear + '. Please review and update.',
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

  var educationList = [];
  try {
    if (data.education_list) {
      educationList = JSON.parse(data.education_list);
    }
  } catch(e) {}

  if (!Array.isArray(educationList)) educationList = [];

  // บังคับใช้ปีปัจจุบันเสมอ เมื่อเป็นการเพิ่มใหม่หรือคัดลอกมา
var displayYear = currentYear;

// ถ้าเป็นการแก้ไขข้อมูลเดิม (มี id) ให้ใช้ปีของข้อมูลนั้น
if (data && data.id && !copiedFromYear) {
  displayYear = data.academic_year || currentYear;
}

  var eduHtml = '';
  for (var i = 0; i < educationList.length; i++) {
    eduHtml += buildEducationCard(i + 1, educationList[i], lang);
  }

  var copiedNotice = '';
  if (copiedFromYear) {
    copiedNotice = '<div class="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4 mb-6">' +
      '<div class="flex items-start gap-3">' +
      '<i class="fi fi-rr-copy-alt text-purple-600 text-2xl mt-0.5"></i>' +
      '<div class="flex-1">' +
      '<p class="font-bold text-purple-900 mb-1">' +
      (lang === 'th' ? '📚 ข้อมูลคัดลอกจากปีการศึกษา ' + copiedFromYear : '📚 Data copied from academic year ' + copiedFromYear) +
      '</p>' +
      '<p class="text-sm text-purple-700">' +
      (lang === 'th'
        ? 'หากมีการเพิ่มวุฒิการศึกษาใหม่ กรุณาเพิ่มรายการ หรือแก้ไขข้อมูลที่เปลี่ยนแปลง แล้วกดบันทึก'
        : 'If you have new qualifications, please add entries or update changed information, then save') +
      '</p>' +
      '</div></div></div>';
  }

  var html = '<form id="educationForm" onsubmit="saveEducationDataMulti(event)">';
  html += '<input type="hidden" id="eduId" value="' + (data.id || '') + '">';
  html += '<input type="hidden" id="eduAcademicYear" value="' + displayYear + '">';

  html += '<div class="bg-white rounded-xl shadow-sm border p-6 mb-6">';
  html += '<label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">';
  html += '<i class="fi fi-rr-calendar mr-2 text-blue-500"></i>';
  html += (lang === 'th' ? 'ปีการศึกษา' : 'Academic Year');
  html += '</label>';
  html += '<input type="text" class="form-input bg-gray-100 font-semibold text-primary" value="' + displayYear + '" readonly>';
  html += '</div>';

  html += copiedNotice;

  html += '<div class="mb-6" id="educationWrapper">' + eduHtml + '</div>';

  html += '<button type="button" onclick="addNewEduEntry()" class="mb-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg flex items-center transition-colors">';
  html += '<i class="fi fi-rr-plus mr-2"></i>' + (lang === 'th' ? 'เพิ่มรายการการศึกษา' : 'Add Education Entry') + '</button>';

  html += '<div class="flex gap-3">';
  html += '<button type="button" onclick="closeDataModal()" class="flex-1 btn-outline h-12">' + t('cancel') + '</button>';
  html += '<button type="submit" class="flex-1 btn-primary h-12">';
  html += '<i class="fi fi-rr-disk mr-2"></i>' + t('save');
  html += '</button></div>';
  html += '</form>';

  openDataModal((data.id ? t('edit') : t('add')) + ' ' + t('education'), html);
}

function buildEducationCard(idx, edu, lang) {
  edu = edu || {};
  var levels = [
    'ประถมศึกษา',
    'มัธยมศึกษาตอนต้น',
    'มัธยมศึกษาตอนปลาย',
    'ปวช.',
    'ปวส.',
    'ปริญญาตรี',
    'ปริญญาโท',
    'ปริญญาเอก'
  ];

  var opts = '<option value="">-- ' + (lang === 'th' ? 'เลือกระดับการศึกษา' : 'Select Level') + ' --</option>';
  for (var i = 0; i < levels.length; i++) {
    var sel = edu.level === levels[i] ? ' selected' : '';
    opts += '<option' + sel + '>' + levels[i] + '</option>';
  }

  var html = '<div class="education-entry border border-purple-200 rounded-xl bg-white p-5 mb-4 shadow-sm">';

  // Header
  html += '<div class="flex justify-between items-center mb-4 pb-3 border-b">';
  html += '<h4 class="font-bold text-gray-700 flex items-center">';
  html += '<i class="fi fi-rr-graduation-cap mr-2 text-purple-600"></i>';
  html += (lang === 'th' ? 'การศึกษา' : 'Education') + ' #<span class="edu-idx">' + idx + '</span>';
  html += '</h4>';
  html += '<button type="button" class="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm transition-colors" onclick="removeEduCard(this)">';
  html += '<i class="fi fi-rr-trash mr-1"></i>' + (lang === 'th' ? 'ลบ' : 'Delete');
  html += '</button></div>';

  // Form Fields
  html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';

  // ระดับการศึกษา
  html += '<div>';
  html += '<label class="block text-sm text-gray-600 mb-1 font-medium">';
  html += '<i class="fi fi-rr-diploma mr-1"></i>' + (lang === 'th' ? 'ระดับการศึกษา' : 'Level') + ' <span class="text-red-500">*</span>';
  html += '</label>';
  html += '<select class="form-select edu-level" required>' + opts + '</select>';
  html += '</div>';

  // ปีที่สำเร็จการศึกษา
  html += '<div>';
  html += '<label class="block text-sm text-gray-600 mb-1 font-medium">';
  html += '<i class="fi fi-rr-calendar mr-1"></i>' + (lang === 'th' ? 'ปีที่สำเร็จ (พ.ศ.)' : 'Graduation Year') + ' <span class="text-red-500">*</span>';
  html += '</label>';
  html += '<input type="text" class="form-input edu-year" maxlength="4" placeholder="' + (lang === 'th' ? 'เช่น 2567' : 'e.g. 2024') + '" required value="' + (edu.graduation_year || '') + '">';
  html += '</div>';

  // สถาบันการศึกษา
  html += '<div class="md:col-span-2">';
  html += '<label class="block text-sm text-gray-600 mb-1 font-medium">';
  html += '<i class="fi fi-rr-building mr-1"></i>' + (lang === 'th' ? 'สถาบันการศึกษา' : 'Institution') + ' <span class="text-red-500">*</span>';
  html += '</label>';
  html += '<input type="text" class="form-input edu-inst" placeholder="' + (lang === 'th' ? 'ชื่อสถาบันการศึกษา' : 'Institution Name') + '" required value="' + (edu.institution || '') + '">';
  html += '</div>';

  // สาขาวิชา
  html += '<div class="md:col-span-2">';
  html += '<label class="block text-sm text-gray-600 mb-1 font-medium">';
  html += '<i class="fi fi-rr-book mr-1"></i>' + (lang === 'th' ? 'สาขาวิชา/วุฒิที่ได้รับ' : 'Major/Degree');
  html += '</label>';
  html += '<input type="text" class="form-input edu-major" placeholder="' + (lang === 'th' ? 'ระบุสาขาวิชา' : 'Enter major') + '" value="' + (edu.major || '') + '">';
  html += '</div>';

  html += '</div></div>';

  return html;
}

function addNewEduEntry() {
  var wrapper = document.getElementById('educationWrapper');
  var cnt = wrapper.querySelectorAll('.education-entry').length;
  wrapper.insertAdjacentHTML('beforeend', buildEducationCard(cnt + 1, {}, AppState.language));
}

function removeEduCard(btn) {
  var wrapper = document.getElementById('educationWrapper');
  if (wrapper.querySelectorAll('.education-entry').length <= 1) {
    showAlert('warning', AppState.language === 'th' ? 'คำเตือน' : 'Warning',
      AppState.language === 'th' ? 'ต้องมีรายการอย่างน้อย 1 รายการ' : 'At least 1 entry required');
    return;
  }

  btn.closest('.education-entry').remove();

  // อัพเดทหมายเลข
  var entries = document.querySelectorAll('.education-entry');
  for (var i = 0; i < entries.length; i++) {
    entries[i].querySelector('.edu-idx').textContent = i + 1;
  }
}

async function saveEducationDataMulti(event) {
  event.preventDefault();
  showLoading();

  var user = AppState.user || {};
  var year = document.getElementById('eduAcademicYear') ? document.getElementById('eduAcademicYear').value : '';
  var eduList = [];
  var entries = document.querySelectorAll('.education-entry');

  if (entries.length === 0) {
    hideLoading();
    showAlert('error', t('error'), AppState.language === 'th' ? 'กรุณาเพิ่มอย่างน้อย 1 รายการ' : 'Add at least 1 entry');
    return;
  }

  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var level = entry.querySelector('.edu-level').value;
    var yr = entry.querySelector('.edu-year').value;
    var inst = entry.querySelector('.edu-inst').value;
    var maj = entry.querySelector('.edu-major').value || '-';

    if (!level || !yr || !inst) {
      hideLoading();
      showAlert('error', t('error'), AppState.language === 'th' ? 'กรุณากรอกข้อมูลให้ครบถ้วน' : 'Please fill all required fields');
      return;
    }

    eduList.push({
      level: level,
      graduation_year: yr,
      institution: inst,
      major: maj
    });
  }

  var eduData = {
    id: document.getElementById('eduId').value || null,
    user_id: user.id,
    academic_year: year,
    level: eduList[0].level,
    graduation_year: eduList[0].graduation_year,
    institution: eduList[0].institution,
    major: eduList[0].major,
    education_list: JSON.stringify(eduList)
  };

  try {
    var result;
    if (eduData.id) {
      result = await api.put('/api/portfolio/education/'+eduData.id, eduData).catch(function(err) {
        return {status: 'error', message: err.message};
      });
    } else {
      result = await api.post('/api/portfolio/education', eduData).catch(function(err) {
        return {status: 'error', message: err.message};
      });
    }

    hideLoading();

    if (result.status === 'success') {
      closeDataModal();
      showAlert('success', t('success'), result.message);
      loadEducationData();
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

async function editEducation(id) {
  showLoading();
  try {
    var result = await api.get('/api/portfolio/education/'+id).catch(function() {
      return { status: 'error' };
    });

    hideLoading();

    if (result.status === 'success') {
      showEducationForm(result.data);
    } else {
      showAlert('error', t('error'), AppState.language === 'th' ? 'ไม่สามารถโหลดข้อมูลได้' : 'Cannot load data');
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

async function deleteEducationRecord(id) {
  var confirm = await showConfirm(t('confirmDelete'), t('confirmDeleteMsg'));
  if (confirm.isConfirmed) {
    showLoading();
    try {
      var result = await api.delete('/api/portfolio/education/'+id).catch(function(err) {
        return { status: 'error', message: err.message };
      });

      hideLoading();

      if (result.status === 'success') {
        showAlert('success', t('success'), result.message);
        loadEducationData();
      }
    } catch (error) {
      hideLoading();
      showAlert('error', t('error'), error.message);
    }
  }
}

// ==================== SCOUT QUALIFICATION & WORK HISTORY SECTION ====================
var scoutYearFilter = '';

async function loadScoutQualification() {
  var content = document.getElementById('pageContent');
  var lang = AppState.language;
  var currentYear = (AppState.config && AppState.config.current_academic_year) ? AppState.config.current_academic_year : '';
  scoutYearFilter = currentYear;

  content.innerHTML = '<div class="fade-in">' +
    '<div class="section-header flex justify-between items-center mb-6">' +
    '<h2 class="text-2xl font-bold text-primary flex items-center">' +
    '<span class="bg-orange-100 text-orange-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">' +
    '<i class="fi fi-rr-camping"></i></span>' +
    (lang === 'th' ? 'คุณวุฒิทางลูกเสือ/ประวัติการทำงาน' : 'Scout Qualification/Work History') +
    '</h2>' +
    '<button onclick="showScoutForm()" class="btn-primary">' +
    '<i class="fi fi-rr-plus mr-1"></i>' + t('add') + '/' + t('edit') +
    '</button></div>' +
    renderFilterBar('scout', 'filterScout') +
    '<div id="scoutContainer">' +
    '<div class="py-12 flex justify-center"><div class="loading-spinner"></div></div>' +
    '</div></div>';

  loadScoutData();
}

function filterScout() {
  scoutYearFilter = document.getElementById('scoutFilterYear').value;
  loadScoutData();
}

async function loadScoutData() {
  try {
    var user = AppState.user || {};
    var result = await api.get('/api/portfolio/scout-qualification?userId='+user.id+'&page=1&search='+encodeURIComponent('')).catch(function() {
      return { status: 'error', data: [] };
    });

    // กรองตามปีการศึกษา
    if (scoutYearFilter && result.data) {
      var filtered = [];
      for (var i = 0; i < result.data.length; i++) {
        var item = result.data[i];
        var details = {};
        try {
          details = JSON.parse(item.details);
        } catch(e) {}

        if (details.academic_year === scoutYearFilter) {
          filtered.push(item);
        }
      }
      result.data = filtered;
    }

    renderScoutView(result);
  } catch (error) {
    console.error('Load scout error:', error);
  }
}

function renderScoutView(result) {
  var container = document.getElementById('scoutContainer');
  var lang = AppState.language;
  var data = result.data || [];

  if (data.length === 0) {
    container.innerHTML = '<div class="bg-white rounded-2xl p-12 text-center border shadow-sm">' +
      '<div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 text-4xl">' +
      '<i class="fi fi-rr-camping"></i></div>' +
      '<h3 class="text-lg font-bold text-gray-700">' + t('noData') + '</h3>' +
      '<p class="text-gray-500 text-sm mt-2 mb-4">' +
      (lang === 'th' ? 'ยังไม่มีข้อมูลคุณวุฒิทางลูกเสือและประวัติการทำงาน' : 'No scout qualification and work history data') +
      '</p>' +
      '<button onclick="showScoutForm()" class="btn-secondary">' +
      '<i class="fi fi-rr-plus mr-1"></i>' + (lang === 'th' ? 'เพิ่มข้อมูล' : 'Add Data') +
      '</button></div>';
    return;
  }

  var item = data[0];
  var details = {};
  try {
    details = JSON.parse(item.details);
  } catch(e) {}

  // สร้าง Scout Badges
  var scoutBadges = '';
  var types = ['cub', 'scout', 'senior', 'instructor'];
  var colors = ['blue', 'green', 'purple', 'red'];
  var names = [
    lang === 'th' ? 'ลูกเสือสำรอง' : 'Cub Scout',
    lang === 'th' ? 'ลูกเสือสามัญ' : 'Scout',
    lang === 'th' ? 'ลูกเสือรุ่นใหญ่' : 'Senior Scout',
    lang === 'th' ? 'วิทยากร' : 'Instructor'
  ];

  for (var ti = 0; ti < types.length; ti++) {
    if (details[types[ti]] && details[types[ti]].length > 0) {
      for (var i = 0; i < details[types[ti]].length; i++) {
        scoutBadges += '<span class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-' + colors[ti] + '-100 text-' + colors[ti] + '-700 mr-2 mb-2 inline-flex items-center">' +
          '<i class="fi fi-rr-badge mr-1"></i>' + names[ti] + ': ' + details[types[ti]][i] +
          '</span>';
      }
    }
  }

  if (!scoutBadges) {
    scoutBadges = '<div class="text-center py-8">' +
      '<i class="fi fi-rr-info text-3xl text-gray-300 mb-2"></i>' +
      '<p class="text-gray-400 italic text-sm">' + (lang === 'th' ? 'ไม่มีข้อมูลคุณวุฒิทางลูกเสือ' : 'No scout qualification') + '</p>' +
      '</div>';
  }

  // สร้าง Work Timeline
  var workTimeline = '';
  if (details.work_history && details.work_history.length > 0) {
    for (var j = 0; j < details.work_history.length; j++) {
      var w = details.work_history[j];
      var currentBadge = w.is_current ?
        '<span class="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full font-medium">' +
        '<i class="fi fi-rr-time-check mr-1"></i>' + (lang === 'th' ? 'ปัจจุบัน' : 'Current') +
        '</span>' : '';

      workTimeline += '<div class="mb-4 p-4 bg-white border border-cyan-100 rounded-xl hover:shadow-md transition-shadow">' +
        '<div class="flex justify-between items-start mb-2">' +
        '<h5 class="font-bold text-gray-800 flex items-center">' +
        '<i class="fi fi-rr-briefcase text-cyan-600 mr-2"></i>' + w.position +
        '</h5>' + currentBadge +
        '</div>' +
        '<div class="text-sm text-gray-500 flex items-center">' +
        '<i class="fi fi-rr-calendar mr-2 text-cyan-500"></i>' +
        formatDate(w.start_date) + ' - ' +
        (w.is_current ? (lang === 'th' ? 'ปัจจุบัน' : 'Present') : formatDate(w.end_date)) +
        '</div></div>';
    }
  } else {
    workTimeline = '<div class="text-center py-8">' +
      '<i class="fi fi-rr-info text-3xl text-gray-300 mb-2"></i>' +
      '<p class="text-gray-400 italic text-sm">' + (lang === 'th' ? 'ไม่มีประวัติการทำงาน' : 'No work history') + '</p>' +
      '</div>';
  }

  var html = '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">' +
    // Scout Qualification Card
    '<div class="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg transition-shadow">' +
    '<div class="flex items-center justify-between mb-6 pb-4 border-b">' +
    '<h3 class="font-bold text-gray-800 flex items-center text-lg">' +
    '<i class="fi fi-rr-camping text-orange-500 mr-2 text-xl"></i>' +
    (lang === 'th' ? 'คุณวุฒิทางลูกเสือ' : 'Scout Qualification') +
    '</h3>' +
    '<button onclick="editScout(\'' + item.id + '\')" class="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center">' +
    '<i class="fi fi-rr-edit mr-1"></i>' + t('edit') +
    '</button></div>' +
    '<div class="p-4 bg-orange-50/50 rounded-xl border border-orange-100">' +
    '<p class="text-xs text-orange-600 font-bold uppercase mb-3 flex items-center">' +
    '<i class="fi fi-rr-diploma mr-2"></i>' + (lang === 'th' ? 'ระดับการฝึกอบรม' : 'Training Level') +
    '</p>' +
    '<div class="flex flex-wrap">' + scoutBadges + '</div>' +
    '</div></div>' +

    // Work History Card
    '<div class="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg transition-shadow">' +
    '<div class="flex items-center justify-between mb-6 pb-4 border-b">' +
    '<h3 class="font-bold text-gray-800 flex items-center text-lg">' +
    '<i class="fi fi-rr-briefcase text-cyan-500 mr-2 text-xl"></i>' +
    (lang === 'th' ? 'ประวัติการทำงาน' : 'Work History') +
    '</h3>' +
    '<button onclick="editScout(\'' + item.id + '\')" class="text-cyan-500 hover:text-cyan-600 text-sm font-medium flex items-center">' +
    '<i class="fi fi-rr-edit mr-1"></i>' + t('edit') +
    '</button></div>' +
    '<div class="max-h-96 overflow-y-auto pr-2">' + workTimeline + '</div>' +
    '</div></div>';

  container.innerHTML = html;
}

async function showScoutForm(data) {
  var lang = AppState.language;
  var user = AppState.user || {};
  var currentYear = (AppState.config && AppState.config.current_academic_year) ? AppState.config.current_academic_year : '';
  var copiedFromYear = '';

  // ถ้าเป็นการเพิ่มใหม่
  if (!data || !data.id) {
    showLoading();
    try {
      // 1. ตรวจสอบว่ามีข้อมูลปีนี้แล้วหรือไม่
      var checkResult = await api.get('/api/portfolio/check-year-data?userId='+user.id+'&type=ScoutQualification&year='+currentYear).catch(function() {
        return { exists: false };
      });

      if (checkResult.exists) {
        hideLoading();
        var confirm = await Swal.fire({
          icon: 'warning',
          title: lang === 'th' ? 'พบข้อมูลปีนี้แล้ว' : 'Data Already Exists',
          html: '<div class="text-center">' +
            '<div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">' +
            '<i class="fi fi-rr-camping text-4xl text-orange-600"></i></div>' +
            '<p class="text-gray-700 mb-2 text-lg">' +
            (lang === 'th' ? 'ท่านได้กรอกข้อมูลคุณวุฒิทางลูกเสือ/ประวัติการทำงานของ' : 'You have already entered scout qualification/work history for') +
            '</p>' +
            '<p class="text-orange-600 font-bold text-2xl mb-2">ปีการศึกษา ' + currentYear + '</p>' +
            '<p class="text-gray-600">' + (lang === 'th' ? 'ไปแล้ว' : 'already') + '</p>' +
            '</div>',
          showCancelButton: true,
          confirmButtonColor: '#ea580c',
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
        var latestResult = await api.get('/api/portfolio/latest-year-data?userId='+user.id+'&type=ScoutQualification').catch(function() {
          return { status: 'error' };
        });

        hideLoading();

        if (latestResult.status === 'success') {
          data = latestResult.data;
          copiedFromYear = latestResult.year;

          // Parse details เพื่อเอาปีออก
          var tempDetails = {};
          try {
            tempDetails = JSON.parse(data.details);
          } catch(e) {}

          delete data.id;
          delete data.created_at;
          delete data.updated_at;

          showToast('info',
            lang === 'th'
              ? '⛺ ดึงข้อมูลจากปีการศึกษา ' + copiedFromYear + ' มาแสดงแล้ว กรุณาตรวจสอบและแก้ไขข้อมูลที่เปลี่ยนแปลง'
              : '⛺ Data copied from academic year ' + copiedFromYear + '. Please review and update.',
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

  var details = {
    academic_year: '',
    scout_status: 'none',
    cub: [],
    scout: [],
    senior: [],
    instructor: [],
    girl_guide_status: 'none',
    work_history: []
  };

  try {
    if (data.details) {
      details = JSON.parse(data.details);
    }
  } catch(e) {}

  // บังคับใช้ปีปัจจุบันเสมอ เมื่อเป็นการเพิ่มใหม่หรือคัดลอกมา
var displayYear = currentYear;

// ถ้าเป็นการแก้ไขข้อมูลเดิม (มี id) ให้ใช้ปีของข้อมูลนั้น
if (data && data.id && !copiedFromYear) {
  displayYear = details.academic_year || currentYear;
}
  var yearField = '<input type="text" id="scoutAcademicYear" class="form-input bg-gray-100 font-semibold text-primary" value="' + displayYear + '" readonly>';

  var copiedNotice = '';
  if (copiedFromYear) {
    copiedNotice = '<div class="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4 mb-6">' +
      '<div class="flex items-start gap-3">' +
      '<i class="fi fi-rr-copy-alt text-orange-600 text-2xl mt-0.5"></i>' +
      '<div class="flex-1">' +
      '<p class="font-bold text-orange-900 mb-1">' +
      (lang === 'th' ? '⛺ ข้อมูลคัดลอกจากปีการศึกษา ' + copiedFromYear : '⛺ Data copied from academic year ' + copiedFromYear) +
      '</p>' +
      '<p class="text-sm text-orange-700">' +
      (lang === 'th'
        ? 'กรุณาตรวจสอบคุณวุฒิและประวัติการทำงาน หากมีการเปลี่ยนแปลงกรุณาแก้ไข แล้วกดบันทึก'
        : 'Please review qualifications and work history. Update if there are changes, then save') +
      '</p>' +
      '</div></div></div>';
  }

  var scoutStatusNone = details.scout_status === 'none' ? ' checked' : '';
  var scoutStatusBasic = details.scout_status === 'basic' ? ' checked' : '';
  var showTypes = details.scout_status === 'basic' ? '' : ' style="display:none;"';

  var ggNone = details.girl_guide_status === 'none' ? ' checked' : '';
  var ggBasic = details.girl_guide_status === 'basic' ? ' checked' : '';
  var ggAdvanced = details.girl_guide_status === 'advanced' ? ' checked' : '';

  var scoutTypes = [
    { type: 'cub', label: lang === 'th' ? 'ลูกเสือสำรอง' : 'Cub Scout', icon: 'fi-rr-tent', values: ['BTC', 'ATC', 'CWB'] },
    { type: 'scout', label: lang === 'th' ? 'ลูกเสือสามัญ' : 'Scout', icon: 'fi-rr-campfire', values: ['BTC', 'ATC', 'SWB'] },
    { type: 'senior', label: lang === 'th' ? 'ลูกเสือสามัญรุ่นใหญ่' : 'Senior Scout', icon: 'fi-rr-mountains', values: ['BTC', 'ATC', 'SSWB'] },
    { type: 'instructor', label: lang === 'th' ? 'วิทยากร/ผู้กำกับลูกเสือ' : 'Instructor', icon: 'fi-rr-chalkboard-user', values: ['BTC', 'ALT', 'LTC', 'L.T'] }
  ];

  var scoutCheckboxes = '';
  for (var si = 0; si < scoutTypes.length; si++) {
    var st = scoutTypes[si];
    scoutCheckboxes += '<div class="bg-white border border-gray-200 rounded-xl p-4 mb-3 hover:border-orange-300 transition-colors">';
    scoutCheckboxes += '<div class="flex items-center mb-3 text-gray-700 font-medium">';
    scoutCheckboxes += '<i class="fi ' + st.icon + ' mr-2 text-orange-500"></i>' + st.label;
    scoutCheckboxes += '</div>';
    scoutCheckboxes += '<div class="flex flex-wrap gap-4">';
    for (var vi = 0; vi < st.values.length; vi++) {
      var val = st.values[vi];
      var checked = details[st.type] && details[st.type].indexOf(val) !== -1 ? ' checked' : '';
      scoutCheckboxes += '<label class="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors">';
      scoutCheckboxes += '<input type="checkbox" class="scout-check rounded mr-2 text-orange-600 focus:ring-orange-500" data-type="' + st.type + '" value="' + val + '"' + checked + '>';
      scoutCheckboxes += '<span class="text-sm font-medium">' + val + '</span>';
      scoutCheckboxes += '</label>';
    }
    scoutCheckboxes += '</div></div>';
  }

  var workHtml = '';
  if (details.work_history && details.work_history.length > 0) {
    for (var wi = 0; wi < details.work_history.length; wi++) {
      workHtml += generateScoutWorkEntry(wi + 1, details.work_history[wi], lang);
    }
  } else {
    workHtml = generateScoutWorkEntry(1, {}, lang);
  }

  var formHtml = '<form id="scoutForm" onsubmit="saveScoutData(event)" class="space-y-6">' +
    '<input type="hidden" id="scoutId" value="">' +
    '<div class="bg-white rounded-xl shadow-sm border p-5">' +
    '<label class="block text-sm font-bold text-gray-700 mb-2 flex items-center">' +
    '<i class="fi fi-rr-calendar mr-2 text-blue-500"></i>' +
    (lang === 'th' ? 'ปีการศึกษา' : 'Academic Year') + ' <span class="text-red-500 ml-1">*</span>' +
    '</label>' + yearField + '</div>' +
    copiedNotice +
    '<div class="bg-white rounded-xl shadow-sm border overflow-hidden">' +
    '<div class="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 flex items-center">' +
    '<i class="fi fi-rr-camping text-white mr-3 text-xl"></i>' +
    '<h3 class="font-bold text-white text-lg">' +
    (lang === 'th' ? '1. คุณวุฒิทางลูกเสือ' : '1. Scout Qualification') +
    '</h3></div>' +
    '<div class="p-5">' +
    '<div class="flex items-center gap-6 mb-4 pb-4 border-b">' +
    '<label class="flex items-center cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">' +
    '<input type="radio" name="scoutStatus" value="none" class="mr-2 text-orange-600 focus:ring-orange-500" onchange="toggleScoutTypes()"' + scoutStatusNone + '>' +
    '<span>' + (lang === 'th' ? 'ไม่ผ่านการอบรม' : 'No Training') + '</span>' +
    '</label>' +
    '<label class="flex items-center cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">' +
    '<input type="radio" name="scoutStatus" value="basic" class="mr-2 text-orange-600 focus:ring-orange-500" onchange="toggleScoutTypes()"' + scoutStatusBasic + '>' +
    '<span>' + (lang === 'th' ? 'ขั้นความรู้พื้นฐาน' : 'Basic Knowledge') + '</span>' +
    '</label></div>' +
    '<div id="scoutTypesContainer"' + showTypes + '>' + scoutCheckboxes + '</div>' +
    '</div></div>' +
    '<div class="bg-white rounded-xl shadow-sm border overflow-hidden">' +
    '<div class="bg-gradient-to-r from-green-600 to-green-700 px-5 py-4 flex items-center">' +
    '<i class="fi fi-rr-heart mr-3 text-white text-xl"></i>' +
    '<h3 class="font-bold text-white text-lg">' +
    (lang === 'th' ? '2. คุณวุฒิทางผู้บำเพ็ญประโยชน์' : '2. Girl Guide Qualification') +
    '</h3></div>' +
    '<div class="p-5">' +
    '<div class="space-y-2">' +
    '<label class="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">' +
    '<input type="radio" name="girlGuideStatus" value="none" class="mr-3 text-green-600 focus:ring-green-500"' + ggNone + '>' +
    '<span>' + (lang === 'th' ? 'ไม่ผ่านการอบรม' : 'No Training') + '</span>' +
    '</label>' +
    '<label class="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">' +
    '<input type="radio" name="girlGuideStatus" value="basic" class="mr-3 text-green-600 focus:ring-green-500"' + ggBasic + '>' +
    '<span>' + (lang === 'th' ? 'ขั้นความรู้พื้นฐาน' : 'Basic Knowledge') + '</span>' +
    '</label>' +
    '<label class="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">' +
    '<input type="radio" name="girlGuideStatus" value="advanced" class="mr-3 text-green-600 focus:ring-green-500"' + ggAdvanced + '>' +
    '<span>' + (lang === 'th' ? 'ขั้นความรู้ขั้นสูง' : 'Advanced Knowledge') + '</span>' +
    '</label>' +
    '</div></div></div>' +
    '<div class="bg-white rounded-xl shadow-sm border overflow-hidden">' +
    '<div class="bg-gradient-to-r from-cyan-500 to-cyan-600 px-5 py-4 flex items-center justify-between">' +
    '<div class="flex items-center">' +
    '<i class="fi fi-rr-briefcase mr-3 text-white text-xl"></i>' +
    '<h3 class="font-bold text-white text-lg">' +
    (lang === 'th' ? '3. ประวัติการทำงาน' : '3. Work History') +
    '</h3></div>' +
    '<button type="button" onclick="addScoutWorkEntry()" class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">' +
    '<i class="fi fi-rr-plus mr-2"></i>' + (lang === 'th' ? 'เพิ่มประวัติการทำงาน' : 'Add Work History') +
    '</button></div>' +
    '<div class="p-5">' +
    '<div id="scoutWorkHistoryList" class="space-y-4">' + workHtml + '</div>' +
    '</div></div>' +
    '<div class="flex gap-3 sticky bottom-0 bg-white/90 backdrop-blur py-4">' +
    '<button type="button" onclick="closeDataModal()" class="flex-1 btn-outline h-12">' +
    t('cancel') +
    '</button>' +
    '<button type="submit" class="flex-1 btn-primary h-12">' +
    '<i class="fi fi-rr-disk mr-2"></i>' + t('save') +
    '</button></div></form>';

  openDataModal((data.id ? t('edit') : t('add')), formHtml);
}

function toggleScoutTypes() {
  var scoutStatus = document.querySelector('input[name="scoutStatus"]:checked');
  var container = document.getElementById('scoutTypesContainer');

  if (scoutStatus && scoutStatus.value === 'basic') {
    container.style.display = 'block';
  } else {
    container.style.display = 'none';
  }
}

function generateScoutWorkEntry(index, data, lang) {
  data = data || {};
  var isCurrent = data.is_current ? ' checked' : '';
  var endDisabled = data.is_current ? ' disabled' : '';

  return '<div class="scout-work-entry bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">' +
    '<div class="flex justify-between items-center mb-4 pb-3 border-b">' +
    '<h4 class="font-semibold text-gray-700 flex items-center">' +
    '<span class="bg-cyan-100 text-cyan-700 w-7 h-7 rounded-lg flex items-center justify-center mr-2 text-sm font-bold">' +
    '<span class="work-index">' + index + '</span></span>' +
    (lang === 'th' ? 'ประวัติการทำงาน' : 'Work History') +
    '</h4>' +
    '<button type="button" onclick="removeScoutWorkEntry(this)" class="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center">' +
    '<i class="fi fi-rr-trash mr-1"></i>' + (lang === 'th' ? 'ลบ' : 'Delete') +
    '</button></div>' +

    '<div class="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">' +
    '<div class="md:col-span-5">' +
    '<label class="block text-sm text-gray-600 mb-1 font-medium flex items-center">' +
    '<i class="fi fi-rr-calendar-check mr-1 text-cyan-500"></i>' +
    (lang === 'th' ? 'วันที่เริ่มงาน' : 'Start Date') + ' <span class="text-red-500 ml-1">*</span>' +
    '</label>' +
    '<input type="date" class="form-input scout-work-start" value="' + (data.start_date || '') + '" required>' +
    '</div>' +

    '<div class="md:col-span-5">' +
    '<label class="block text-sm text-gray-600 mb-1 font-medium flex items-center">' +
    '<i class="fi fi-rr-calendar-exclamation mr-1 text-cyan-500"></i>' +
    (lang === 'th' ? 'วันที่สิ้นสุด' : 'End Date') +
    '</label>' +
    '<input type="date" class="form-input scout-work-end" value="' + (data.end_date || '') + '"' + endDisabled + '>' +
    '</div>' +

    '<div class="md:col-span-2 flex items-end pb-2">' +
    '<label class="flex items-center cursor-pointer hover:bg-gray-50 px-2 py-2 rounded transition-colors">' +
    '<input type="checkbox" class="scout-work-current mr-2 rounded text-cyan-600 focus:ring-cyan-500" onchange="toggleScoutWorkEndDate(this)"' + isCurrent + '>' +
    '<span class="text-sm font-medium">' + (lang === 'th' ? 'ปัจจุบัน' : 'Current') + '</span>' +
    '</label></div></div>' +

    '<div class="mb-4">' +
    '<label class="block text-sm text-gray-600 mb-1 font-medium flex items-center">' +
    '<i class="fi fi-rr-briefcase mr-1 text-cyan-500"></i>' +
    (lang === 'th' ? 'ตำแหน่ง/หน้าที่ที่ได้รับมอบหมาย' : 'Position/Duty') + ' <span class="text-red-500 ml-1">*</span>' +
    '</label>' +
    '<input type="text" class="form-input scout-work-position" placeholder="' +
    (lang === 'th' ? 'ระบุตำแหน่งหรือหน้าที่' : 'Enter position or duty') +
    '" value="' + (data.position || '') + '" required>' +
    '</div></div>';
}

function toggleScoutWorkEndDate(checkbox) {
  var input = checkbox.closest('.grid').querySelector('.scout-work-end');
  input.disabled = checkbox.checked;
  if (checkbox.checked) {
    input.value = '';
  }
}

function addScoutWorkEntry() {
  var list = document.getElementById('scoutWorkHistoryList');
  var currentCount = list.querySelectorAll('.scout-work-entry').length;
  list.insertAdjacentHTML('beforeend', generateScoutWorkEntry(currentCount + 1, {}, AppState.language));
}

function removeScoutWorkEntry(btn) {
  var list = document.getElementById('scoutWorkHistoryList');

  if (list.children.length > 1) {
    btn.closest('.scout-work-entry').remove();

    // อัพเดทหมายเลข
    var entries = list.querySelectorAll('.scout-work-entry');
    for (var i = 0; i < entries.length; i++) {
      var indexSpan = entries[i].querySelector('.work-index');
      if (indexSpan) {
        indexSpan.textContent = i + 1;
      }
    }
  } else {
    showAlert('warning',
      AppState.language === 'th' ? 'คำเตือน' : 'Warning',
      AppState.language === 'th' ? 'ต้องมีประวัติการทำงานอย่างน้อย 1 รายการ' : 'At least 1 work history required');
  }
}

async function saveScoutData(event) {
  event.preventDefault();
  showLoading();

  var user = AppState.user || {};
  var types = ['cub', 'scout', 'senior', 'instructor'];

  var scoutStatusEl = document.querySelector('input[name="scoutStatus"]:checked');
  var girlGuideStatusEl = document.querySelector('input[name="girlGuideStatus"]:checked');
  var academicYearEl = document.getElementById('scoutAcademicYear');

  var details = {
    academic_year: academicYearEl ? academicYearEl.value : '',
    scout_status: scoutStatusEl ? scoutStatusEl.value : 'none',
    cub: [],
    scout: [],
    senior: [],
    instructor: [],
    girl_guide_status: girlGuideStatusEl ? girlGuideStatusEl.value : 'none',
    work_history: []
  };

  // รวบรวมข้อมูลคุณวุฒิลูกเสือ
  for (var ti = 0; ti < types.length; ti++) {
    var checks = document.querySelectorAll('.scout-check[data-type="' + types[ti] + '"]:checked');
    for (var c = 0; c < checks.length; c++) {
      details[types[ti]].push(checks[c].value);
    }
  }

  // รวบรวมประวัติการทำงาน
  var entries = document.querySelectorAll('.scout-work-entry');
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var startDate = entry.querySelector('.scout-work-start').value;
    var position = entry.querySelector('.scout-work-position').value;

    if (!startDate || !position) {
      hideLoading();
      showAlert('error', t('error'),
        AppState.language === 'th' ? 'กรุณากรอกข้อมูลประวัติการทำงานให้ครบถ้วน' : 'Please fill all work history fields');
      return;
    }

    details.work_history.push({
      start_date: startDate,
      end_date: entry.querySelector('.scout-work-current').checked ? '' : entry.querySelector('.scout-work-end').value,
      is_current: entry.querySelector('.scout-work-current').checked,
      position: position
    });
  }

  var scoutData = {
    id: document.getElementById('scoutId').value || null,
    user_id: user.id,
    qualification_type: 'Scout Profile',
    level: 'N/A',
    details: JSON.stringify(details)
  };

  try {
    var result;
    if (scoutData.id) {
      result = await api.put('/api/portfolio/scout-qualification/'+scoutData.id, scoutData).catch(function(err) {
        return {status: 'error', message: err.message};
      });
    } else {
      result = await api.post('/api/portfolio/scout-qualification', scoutData).catch(function(err) {
        return {status: 'error', message: err.message};
      });
    }

    hideLoading();

    if (result.status === 'success') {
      closeDataModal();
      showAlert('success', t('success'), result.message);
      loadScoutData();
    } else {
      showAlert('error', t('error'), result.message);
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

async function editScout(id) {
  showLoading();
  try {
    var result = await api.get('/api/portfolio/scout-qualification/'+id).catch(function() {
      return { status: 'error' };
    });

    hideLoading();

    if (result.status === 'success') {
      showScoutForm(result.data);
    } else {
      showAlert('error', t('error'),
        AppState.language === 'th' ? 'ไม่สามารถโหลดข้อมูลได้' : 'Cannot load data');
    }
  } catch (error) {
    hideLoading();
    showAlert('error', t('error'), error.message);
  }
}

// Alias function for Work History menu
async function loadWorkHistory() {
  loadScoutQualification();
}
