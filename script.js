// Data Store
let entries = JSON.parse(localStorage.getItem('freelanceEntries')) || [];
let editId = null;

// DOM Elements
const form = document.getElementById('entry-form');
const entryIdInput = document.getElementById('entry-id');
const clientInput = document.getElementById('client-name');
const projectInput = document.getElementById('project-name');
const budgetInput = document.getElementById('budget');
const statusInput = document.getElementById('status');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const tbody = document.getElementById('entries-body');
const emptyMsg = document.getElementById('empty-msg');

// Save to LocalStorage
function saveData() {
    localStorage.setItem('freelanceEntries', JSON.stringify(entries));
    renderTable();
}

// Render Table (Read)
function renderTable() {
    tbody.innerHTML = '';
    if (entries.length === 0) {
        emptyMsg.style.display = 'block';
        return;
    }
    emptyMsg.style.display = 'none';
    
    entries.forEach((entry, index) => {
        const row = document.createElement('tr');
        const statusClass = entry.status.replace(' ', '\\ ');
        row.innerHTML = `
            <td>${entry.client}</td>
            <td>${entry.project}</td>
            <td>$${entry.budget}</td>
            <td><span class="status-badge status-${statusClass}">${entry.status}</span></td>
            <td>
                <button class="action-btn edit-btn" onclick="editEntry('${entry.id}')">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteEntry('${entry.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Create / Update (Submit)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = entryIdInput.value || Date.now().toString();
    const entryData = {
        id: id,
        client: clientInput.value.trim(),
        project: projectInput.value.trim(),
        budget: parseFloat(budgetInput.value),
        status: statusInput.value
    };

    if (editId) {
        // Update
        const index = entries.findIndex(e => e.id === editId);
        if (index > -1) entries[index] = entryData;
        editId = null;
    } else {
        // Create
        entries.push(entryData);
    }
    saveData();
    resetForm();
});

// Edit (Populate form)
window.editEntry = function(id) {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    
    entryIdInput.value = entry.id;
    clientInput.value = entry.client;
    projectInput.value = entry.project;
    budgetInput.value = entry.budget;
    statusInput.value = entry.status;
    
    editId = id;
    formTitle.textContent = 'Edit Entry';
    submitBtn.textContent = 'Update Entry';
    cancelBtn.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Delete
window.deleteEntry = function(id) {
    if (confirm('Delete this entry?')) {
        entries = entries.filter(e => e.id !== id);
        saveData();
        if (editId === id) resetForm();
    }
};

// Reset Form
function resetForm() {
    form.reset();
    entryIdInput.value = '';
    editId = null;
    formTitle.textContent = 'Add New Client / Project';
    submitBtn.textContent = 'Add Entry';
    cancelBtn.style.display = 'none';
}

cancelBtn.addEventListener('click', resetForm);

// Initial Render
renderTable();