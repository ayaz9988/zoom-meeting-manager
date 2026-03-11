const API_BASE = 'http://localhost:5000/v1';
let currentPage = 1;
let totalPages = 1;
let nextPageToken = null;

async function loadMeetings(pageToken = null) {
    // Handle case where pageToken might be an Event object from onclick
    if (pageToken && typeof pageToken === 'object' && pageToken.target) {
        pageToken = null;
    }
    
    const container = document.getElementById('meetingsList');
    container.innerHTML = '<p>Loading...</p>';
    
    try {
        let url = `${API_BASE}/meetings`;
        if (pageToken) {
            url += `?page_token=${pageToken}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        const meetings = data.meetings || [];
        
        currentPage = data.current_page;
        totalPages = data.total_pages;
        nextPageToken = data.next_page_token;
        
        if (meetings.length === 0) {
            container.innerHTML = '<p class="text-muted">No meetings found</p>';
            return;
        }
        
        let html = '<ul class="list-group">';
        meetings.forEach(meeting => {
            const date = new Date(meeting.start_time).toLocaleDateString();
            const time = new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            html += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${meeting.topic || 'Untitled'}</strong>
                        <br><small class="text-muted">${date} at ${time}</small>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="deleteMeeting(${meeting.id})">Delete</button>
                </li>
            `;
        });
        html += '</ul>';
        
        // Add pagination controls
        html += '<div class="mt-3 d-flex justify-content-between">';
        const token = nextPageToken || '';
        html += `<button class="btn btn-secondary" onclick="loadMeetings(null)" ${currentPage <= 1 ? 'disabled' : ''}>Refresh</button>`;
        html += `<span class="align-self-center">Page ${currentPage === undefined ? 1: currentPage} of ${totalPages === undefined ? 1 : totalPages}</span>`;
        html += `<button class="btn btn-primary" onclick="loadMeetings('${token}')" ${!nextPageToken ? 'disabled' : ''}>Next</button>`;
        html += '</div>';
        
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
    }
}

document.getElementById('meetingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const topic = document.getElementById('topic').value;
    const duration = document.getElementById('duration').value;
    
    if (!date || !startTime) {
        alert('Please fill in both date and time');
        return;
    }
    
    const startDateTime = new Date(`${date}T${startTime}:00`);
    
    const meetingData = {
        topic: topic || 'Quick Meeting',
        type: 2,
        start_time: startDateTime.toISOString(),
        duration: duration ? parseInt(duration) : 30
    };
    
    try {
        const response = await fetch(`${API_BASE}/meetings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(meetingData)
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        document.getElementById('meetingForm').reset();
        alert('Meeting created successfully!');
        loadMeetings();
    } catch (error) {
        alert(`Failed to create meeting: ${error.message}`);
    }
});

async function deleteMeeting(meetingId) {
    if (!confirm('Are you sure you want to delete this meeting?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/meetings/${meetingId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        alert('Meeting deleted successfully!');
        loadMeetings();
    } catch (error) {
        alert(`Failed to delete meeting: ${error.message}`);
    }
}

// Load meetings on page load
document.addEventListener('DOMContentLoaded', loadMeetings);
