/**
 * EcoReport - Digital Platform Logic
 * Handles: Geolocation, Photo Preview, Local Storage, and Dashboard Updates
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ELEMENT SELECTORS ---
    const reportForm = document.getElementById('garbage-report-form');
    const fileInput = document.getElementById('file-input');
    const dropArea = document.getElementById('drop-area');
    const preview = document.getElementById('image-preview');
    const placeholder = document.getElementById('upload-placeholder');
    const removeBtn = document.getElementById('remove-img');
    const dashboardTable = document.getElementById('reports-table-body');

    // --- 2. PHOTO UPLOAD & PREVIEW LOGIC ---
    if (dropArea) {
        dropArea.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.classList.remove('hidden');
                    placeholder.classList.add('hidden');
                    removeBtn.classList.remove('hidden');
                }
                reader.readAsDataURL(file);
            }
        });

        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.value = "";
            preview.src = "";
            preview.classList.add('hidden');
            placeholder.classList.remove('hidden');
            removeBtn.classList.add('hidden');
        });
    }

    // --- 3. FORM SUBMISSION & DATA STORAGE ---
    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Capture Data
            const newReport = {
                id: "REP-" + Math.floor(Math.random() * 9000 + 1000),
                category: reportForm.category.value,
                description: reportForm.description.value,
                image: preview.src !== "#" ? preview.src : null,
                status: "Pending",
                date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY
                timestamp: new Date().getTime()
            };

            // Save to Browser Storage (Local Database)
            saveReport(newReport);

            // Visual Feedback
            const submitBtn = document.getElementById('submit-btn');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert("✅ Report successfully submitted to the community!");
                reportForm.reset();
                preview.classList.add('hidden');
                placeholder.classList.remove('hidden');
                removeBtn.classList.add('hidden');
                submitBtn.innerHTML = 'Submit Report to Community';
                submitBtn.disabled = false;
                
                // Optional: Redirect to dashboard to see the report
                // window.location.href = 'dashboard.html';
            }, 1500);
        });
    }

    // --- 4. DASHBOARD RENDERING ---
    if (dashboardTable) {
        renderDashboard();
    }
});

/**
 * Saves a report to the browser's LocalStorage
 */
function saveReport(report) {
    let reports = JSON.parse(localStorage.getItem('ecoReports')) || [];
    reports.unshift(report); // Add new report to the top of the list
    localStorage.setItem('ecoReports', JSON.stringify(reports));
}

/**
 * Pulls reports from LocalStorage and displays them in the Dashboard Table
 */
function renderDashboard() {
    const dashboardTable = document.getElementById('reports-table-body');
    const reports = JSON.parse(localStorage.getItem('ecoReports')) || [];

    if (reports.length === 0) {
        dashboardTable.innerHTML = `<tr><td colspan="5" class="p-10 text-center text-gray-400">No reports submitted yet.</td></tr>`;
        return;
    }

    dashboardTable.innerHTML = reports.map(report => `
        <tr class="hover:bg-gray-50 transition border-b border-gray-100">
            <td class="px-6 py-4 font-bold text-green-700">${report.id}</td>
            <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                    ${report.image ? `<img src="${report.image}" class="w-10 h-10 rounded-lg object-cover shadow-sm">` : `<div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400"><i class="fas fa-image"></i></div>`}
                    <span class="text-gray-700 font-medium">${report.category}</span>
                </div>
            </td>
            <td class="px-6 py-4 text-gray-500 text-sm">${report.date}</td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(report.status)}">
                    ${report.status}
                </span>
            </td>
            <td class="px-6 py-4 text-right">
                <button onclick="viewReportDetails('${report.id}')" class="text-gray-400 hover:text-green-600 transition">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Helper to style status badges
 */
function getStatusStyle(status) {
    switch (status) {
        case 'Pending': return 'bg-orange-100 text-orange-600';
        case 'In Progress': return 'bg-blue-100 text-blue-600';
        case 'Resolved': return 'bg-green-100 text-green-600';
        default: return 'bg-gray-100 text-gray-600';
    }
}
