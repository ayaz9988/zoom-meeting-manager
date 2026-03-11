const API_BASE = 'http://localhost:5000/v1';

// Load meetings
async function loadMeetings() {
    const container = document.getElementById('meetingsList');
    container.innerHTML = '<p>Loading...</p>';
    
    try {
        const response = await fetch(`${API_BASE}/meetings`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        const meetings = data.meetings || [];
        
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
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
    }
}

// Create meeting
document.getElementById('meetingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    
    if (!date || !startTime) {
        alert('Please fill in both date and time');
        return;
    }
    
    const startDateTime = new Date(`${date}T${startTime}:00`);
    
    const meetingData = {
        topic: 'New Meeting',
        type: 2,
        start_time: startDateTime.toISOString(),
        duration: 30
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

// Delete meeting
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
