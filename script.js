// script.js - Complete frontend logic for SmartVote Kenya (Multi-Position)

// ==================== CONSTANTS & DATA ====================
const ADMIN_EMAIL = "devkischool@gmail.com";
const ADMIN_PASSWORD = "12345";

// Candidates data for all positions
const CANDIDATES = {
    president: [
        { id: "p1", name: "John Mwangi", party: "UDA", image: "JM" },
        { id: "p2", name: "Alice Akinyi", party: "ODM", image: "AA" },
        { id: "p3", name: "Peter Kipchoge", party: "Jubilee", image: "PK" }
    ],
    governor: [
        { id: "g1", name: "James Kariuki", party: "UDA", image: "JK" },
        { id: "g2", name: "Mary Wambui", party: "ODM", image: "MW" },
        { id: "g3", name: "Joseph Mwangi", party: "Jubilee", image: "JM" }
    ],
    senator: [
        { id: "s1", name: "Elizabeth Mueni", party: "UDA", image: "EM" },
        { id: "s2", name: "David Odhiambo", party: "ODM", image: "DO" },
        { id: "s3", name: "Sarah Chebet", party: "Jubilee", image: "SC" }
    ],
    mp: [
        { id: "m1", name: "Robert Mutua", party: "UDA", image: "RM" },
        { id: "m2", name: "Jane Atieno", party: "ODM", image: "JA" },
        { id: "m3", name: "Simon Kiprono", party: "Jubilee", image: "SK" }
    ],
    mca: [
        { id: "c1", name: "Peter Mwangi", party: "UDA", image: "PM" },
        { id: "c2", name: "Agnes Wanjiku", party: "ODM", image: "AW" },
        { id: "c3", name: "John Njoroge", party: "Jubilee", image: "JN" }
    ],
    womenRep: [
        { id: "w1", name: "Grace Akinyi", party: "UDA", image: "GA" },
        { id: "w2", name: "Ruth Achieng", party: "ODM", image: "RA" },
        { id: "w3", name: "Martha Karua", party: "Jubilee", image: "MK" }
    ]
};

// Kenya location data for cascading dropdowns
const LOCATIONS = {
    "Nakuru": {
        "Nakuru Town": {
            "Central": {
                "Town": ["Kambi", "Mwariki"]
            }
        }
    },
    "Nairobi": {
        "Westlands": {
            "Kilimani": {
                "Highridge": ["Spring Valley", "Kyuna"]
            }
        }
    },
    "Mombasa": {
        "Mvita": {
            "Old Town": {
                "Makadara": ["Forodhani", "Kizingo"]
            }
        }
    }
};

// ==================== HELPER FUNCTIONS ====================
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getVotes() {
    return JSON.parse(localStorage.getItem("votes")) || [];
}

function saveVotes(votes) {
    localStorage.setItem("votes", JSON.stringify(votes));
}

function getLoggedInUser() {
    return localStorage.getItem("loggedInUser");
}

function setLoggedInUser(email) {
    if (email) {
        localStorage.setItem("loggedInUser", email);
    } else {
        localStorage.removeItem("loggedInUser");
    }
}

function isAdminLoggedIn() {
    return localStorage.getItem("adminLoggedIn") === "true";
}

function setAdminLoggedIn(status) {
    localStorage.setItem("adminLoggedIn", status);
}

// Redirect if not logged in (for protected pages)
function requireAuth() {
    if (!getLoggedInUser()) {
        window.location.href = "login.html";
    }
}

// ==================== INITIALIZATION ====================
if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
}
if (!localStorage.getItem("votes")) {
    localStorage.setItem("votes", JSON.stringify([]));
}

// ==================== PAGE-SPECIFIC LOGIC ====================
document.addEventListener("DOMContentLoaded", function() {
    const path = window.location.pathname.split("/").pop() || "index.html";

    // Common: Logout button
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            setLoggedInUser(null);
            window.location.href = "index.html";
        });
    }

    // Admin logout
    const adminLogoutBtn = document.getElementById("adminLogout");
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            setAdminLoggedIn(false);
            window.location.href = "index.html";
        });
    }

    // Page routers
    if (path === "register.html") {
        setupRegisterPage();
    } else if (path === "login.html") {
        setupLoginPage();
    } else if (path === "dashboard.html") {
        requireAuth();
        setupDashboardPage();
    } else if (path === "vote.html") {
        requireAuth();
        setupVotePage();
    } else if (path === "results.html") {
        setupResultsPage();
        setInterval(updateResultsUI, 2000);
    } else if (path === "admin.html") {
        setupAdminPage();
    }
});

// ==================== REGISTER PAGE ====================
function setupRegisterPage() {
    const form = document.getElementById("registerForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const idNumber = document.getElementById("idNumber").value.trim();
        const password = document.getElementById("password").value;
        const confirm = document.getElementById("confirmPassword").value;

        if (!fullName || !email || !idNumber || !password || !confirm) {
            alert("All fields are required");
            return;
        }
        if (password !== confirm) {
            alert("Passwords do not match");
            return;
        }

        const users = getUsers();
        if (users.some(u => u.email === email)) {
            alert("Email already registered. Please login.");
            return;
        }

        const newUser = {
            fullName,
            email,
            idNumber,
            password,
            hasVoted: false
        };
        users.push(newUser);
        saveUsers(users);

        alert("Registration successful! Please login.");
        window.location.href = "login.html";
    });
}

// ==================== LOGIN PAGE ====================
function setupLoginPage() {
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            setLoggedInUser(email);
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid email or password");
        }
    });
}

// ==================== DASHBOARD PAGE (Cascading dropdowns) ====================
function setupDashboardPage() {
    const countySelect = document.getElementById("county");
    const subcountySelect = document.getElementById("subcounty");
    const wardSelect = document.getElementById("ward");
    const locationSelect = document.getElementById("location");
    const sublocationSelect = document.getElementById("sublocation");
    const proceedBtn = document.getElementById("proceedToVote");

    const counties = Object.keys(LOCATIONS);
    counties.forEach(county => {
        const option = document.createElement("option");
        option.value = county;
        option.textContent = county;
        countySelect.appendChild(option);
    });

    countySelect.addEventListener("change", function() {
        resetDropdowns([subcountySelect, wardSelect, locationSelect, sublocationSelect]);
        if (this.value) {
            const subcounties = Object.keys(LOCATIONS[this.value] || {});
            populateSelect(subcountySelect, subcounties);
            subcountySelect.disabled = false;
        } else {
            subcountySelect.disabled = true;
        }
        proceedBtn.disabled = true;
    });

    subcountySelect.addEventListener("change", function() {
        resetDropdowns([wardSelect, locationSelect, sublocationSelect]);
        if (this.value && countySelect.value) {
            const wards = Object.keys(LOCATIONS[countySelect.value][this.value] || {});
            populateSelect(wardSelect, wards);
            wardSelect.disabled = false;
        } else {
            wardSelect.disabled = true;
        }
        proceedBtn.disabled = true;
    });

    wardSelect.addEventListener("change", function() {
        resetDropdowns([locationSelect, sublocationSelect]);
        if (this.value && countySelect.value && subcountySelect.value) {
            const locations = Object.keys(LOCATIONS[countySelect.value][subcountySelect.value][this.value] || {});
            populateSelect(locationSelect, locations);
            locationSelect.disabled = false;
        } else {
            locationSelect.disabled = true;
        }
        proceedBtn.disabled = true;
    });

    locationSelect.addEventListener("change", function() {
        resetDropdowns([sublocationSelect]);
        if (this.value && countySelect.value && subcountySelect.value && wardSelect.value) {
            const sublocations = LOCATIONS[countySelect.value][subcountySelect.value][wardSelect.value][this.value] || [];
            populateSelect(sublocationSelect, sublocations);
            sublocationSelect.disabled = false;
        } else {
            sublocationSelect.disabled = true;
        }
        proceedBtn.disabled = true;
    });

    sublocationSelect.addEventListener("change", function() {
        proceedBtn.disabled = !this.value;
    });

    document.getElementById("locationForm").addEventListener("submit", (e) => {
        e.preventDefault();
        if (sublocationSelect.value) {
            localStorage.setItem("userLocation", JSON.stringify({
                county: countySelect.value,
                subcounty: subcountySelect.value,
                ward: wardSelect.value,
                location: locationSelect.value,
                sublocation: sublocationSelect.value
            }));
            window.location.href = "vote.html";
        }
    });
}

function resetDropdowns(selects) {
    selects.forEach(sel => {
        sel.innerHTML = '<option value="">-- Select --</option>';
        sel.disabled = true;
    });
}

function populateSelect(select, items) {
    select.innerHTML = '<option value="">-- Select --</option>';
    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        select.appendChild(option);
    });
}

// ==================== VOTE PAGE (Multi-Position Ballot with styled tick boxes) ====================
function setupVotePage() {
    const container = document.getElementById("positionsContainer");
    const messageDiv = document.getElementById("voteMessage");
    const submitBtn = document.getElementById("submitVote");
    const currentUserEmail = getLoggedInUser();
    const users = getUsers();
    const currentUser = users.find(u => u.email === currentUserEmail);

    // If user already voted, disable everything
    if (currentUser && currentUser.hasVoted) {
        messageDiv.textContent = "You have already cast your vote. Thank you!";
        submitBtn.disabled = true;
    } else {
        // Initially disable submit button until all positions selected
        submitBtn.disabled = true;
    }

    // Build the ballot form dynamically
    for (const [position, candidates] of Object.entries(CANDIDATES)) {
        const fieldset = document.createElement("fieldset");
        const legend = document.createElement("legend");
        // Format position name for display
        let displayName = position.charAt(0).toUpperCase() + position.slice(1);
        if (position === "mp") displayName = "Member of Parliament";
        else if (position === "womenRep") displayName = "Women Representative";
        else if (position === "mca") displayName = "MCA";
        legend.textContent = displayName;
        fieldset.appendChild(legend);

        candidates.forEach(candidate => {
            const div = document.createElement("div");
            div.className = "candidate-option";
            
            // Create radio input
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = position;
            radio.value = candidate.id;
            radio.id = candidate.id;
            if (currentUser?.hasVoted) radio.disabled = true;
            
            // Create label
            const label = document.createElement("label");
            label.htmlFor = candidate.id;
            label.innerHTML = `
                <span class="candidate-thumb">${candidate.image}</span>
                <span class="candidate-info">
                    <span class="candidate-name">${candidate.name}</span>
                    <span class="candidate-party">${candidate.party}</span>
                </span>
                <span class="radio-custom"></span>
            `;
            
            div.appendChild(radio);
            div.appendChild(label);
            fieldset.appendChild(div);
        });
        container.appendChild(fieldset);
    }

    // Add event listeners to radio buttons to enable submit when all positions selected
    if (!currentUser?.hasVoted) {
        const allRadios = document.querySelectorAll('input[type="radio"]');
        allRadios.forEach(radio => {
            radio.addEventListener('change', checkAllPositionsSelected);
        });
    }

    function checkAllPositionsSelected() {
        for (const position of Object.keys(CANDIDATES)) {
            const selected = document.querySelector(`input[name="${position}"]:checked`);
            if (!selected) {
                submitBtn.disabled = true;
                return;
            }
        }
        submitBtn.disabled = false;
    }

    // Handle form submission
    document.getElementById("ballotForm").addEventListener("submit", (e) => {
        e.preventDefault();
        if (currentUser.hasVoted) {
            alert("You have already voted.");
            return;
        }

        // Collect votes for each position
        const votes = [];
        for (const position of Object.keys(CANDIDATES)) {
            const selected = document.querySelector(`input[name="${position}"]:checked`);
            if (!selected) {
                alert(`Please select a candidate for ${position}`);
                return;
            }
            votes.push({
                userId: currentUserEmail,
                candidateId: selected.value,
                position: position,
                timestamp: new Date().toISOString()
            });
        }

        // Save all votes
        const allVotes = getVotes();
        allVotes.push(...votes);
        saveVotes(allVotes);

        // Mark user as voted
        currentUser.hasVoted = true;
        const userIndex = users.findIndex(u => u.email === currentUserEmail);
        users[userIndex] = currentUser;
        saveUsers(users);

        // Disable all inputs and button
        document.querySelectorAll("input[type=radio], #submitVote").forEach(el => el.disabled = true);
        messageDiv.textContent = "Your vote has been recorded. Thank you!";
    });
}

// ==================== RESULTS PAGE (Live updates) ====================
let resultsChart = null;
let currentPosition = "president";

function setupResultsPage() {
    const positionSelect = document.getElementById("positionSelect");
    if (positionSelect) {
        positionSelect.addEventListener("change", (e) => {
            currentPosition = e.target.value;
            updateResultsUI(); // chart will update for selected position
        });
    }
    updateResultsUI();
}

function updateResultsUI() {
    const users = getUsers();
    const votes = getVotes();

    const totalUsers = users.length;
    const usersWhoVoted = users.filter(u => u.hasVoted).length;
    const remaining = totalUsers - usersWhoVoted;

    document.getElementById("totalUsers").textContent = totalUsers;
    document.getElementById("totalVotes").textContent = usersWhoVoted; // ballots cast
    document.getElementById("remainingVoters").textContent = remaining;

    // Compute votes per candidate for all positions
    const voteCounts = {};
    for (const pos in CANDIDATES) {
        CANDIDATES[pos].forEach(c => voteCounts[c.id] = 0);
    }
    votes.forEach(v => {
        if (voteCounts.hasOwnProperty(v.candidateId)) {
            voteCounts[v.candidateId]++;
        }
    });

    // Update progress bars for all positions
    const progressContainer = document.getElementById("progressBars");
    progressContainer.innerHTML = "";
    for (const [position, candidates] of Object.entries(CANDIDATES)) {
        const positionDiv = document.createElement("div");
        positionDiv.className = "position-progress";
        let displayName = position.charAt(0).toUpperCase() + position.slice(1);
        if (position === "mp") displayName = "Member of Parliament";
        else if (position === "womenRep") displayName = "Women Representative";
        else if (position === "mca") displayName = "MCA";
        positionDiv.innerHTML = `<h3>${displayName}</h3>`;
        candidates.forEach(candidate => {
            const count = voteCounts[candidate.id] || 0;
            const percentage = usersWhoVoted ? ((count / usersWhoVoted) * 100).toFixed(1) : 0;
            const div = document.createElement("div");
            div.className = "progress-item";
            div.innerHTML = `
                <div class="progress-label">
                    <span>${candidate.name} (${candidate.party})</span>
                    <span>${count} votes (${percentage}%)</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${percentage}%;">${percentage}%</div>
                </div>
            `;
            positionDiv.appendChild(div);
        });
        progressContainer.appendChild(positionDiv);
    }

    // Update chart for selected position
    const ctx = document.getElementById("votesChart").getContext("2d");
    const selectedCandidates = CANDIDATES[currentPosition] || [];
    const data = selectedCandidates.map(c => voteCounts[c.id] || 0);
    const labels = selectedCandidates.map(c => c.name);

    if (resultsChart) {
        resultsChart.data.labels = labels;
        resultsChart.data.datasets[0].data = data;
        resultsChart.data.datasets[0].label = `Votes for ${currentPosition}`;
        resultsChart.update();
    } else {
        resultsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: `Votes for ${currentPosition}`,
                    data: data,
                    backgroundColor: ['#000000', '#8B0000', '#006400'],
                    borderColor: '#FFFFFF',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, color: 'white' },
                        grid: { color: 'rgba(255,255,255,0.2)' }
                    },
                    x: {
                        ticks: { color: 'white' }
                    }
                },
                plugins: {
                    legend: { labels: { color: 'white' } }
                }
            }
        });
    }
}

// ==================== ADMIN PAGE ====================
function setupAdminPage() {
    const loginSection = document.getElementById("adminLoginSection");
    const adminPanel = document.getElementById("adminPanel");
    const adminLogoutBtn = document.getElementById("adminLogout");

    if (isAdminLoggedIn()) {
        loginSection.style.display = "none";
        adminPanel.style.display = "block";
        adminLogoutBtn.style.display = "inline-block";
        loadAdminData();
    } else {
        loginSection.style.display = "block";
        adminPanel.style.display = "none";
        adminLogoutBtn.style.display = "none";
    }

    document.getElementById("adminLoginForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const password = document.getElementById("adminPassword").value;
        if (password === ADMIN_PASSWORD) {
            setAdminLoggedIn(true);
            loginSection.style.display = "none";
            adminPanel.style.display = "block";
            adminLogoutBtn.style.display = "inline-block";
            loadAdminData();
        } else {
            alert("Invalid admin password");
        }
    });

    document.getElementById("resetVotesBtn").addEventListener("click", () => {
        if (confirm("Reset all votes? This cannot be undone.")) {
            saveVotes([]);
            const users = getUsers().map(u => ({ ...u, hasVoted: false }));
            saveUsers(users);
            loadAdminData();
            alert("Votes reset successfully.");
        }
    });

    document.getElementById("deleteUsersBtn").addEventListener("click", () => {
        if (confirm("Delete ALL registered users? This cannot be undone.")) {
            localStorage.setItem("users", JSON.stringify([]));
            saveVotes([]);
            loadAdminData();
            alert("All users deleted.");
        }
    });
}

function loadAdminData() {
    const users = getUsers();
    const votes = getVotes();
    document.getElementById("adminTotalUsers").textContent = users.length;
    document.getElementById("adminTotalVotes").textContent = users.filter(u => u.hasVoted).length;

    // Compute votes per candidate
    const voteCounts = {};
    for (const pos in CANDIDATES) {
        CANDIDATES[pos].forEach(c => voteCounts[c.id] = 0);
    }
    votes.forEach(v => {
        if (voteCounts.hasOwnProperty(v.candidateId)) voteCounts[v.candidateId]++;
    });

    const container = document.getElementById("adminVotesContainer");
    container.innerHTML = "";
    for (const [position, candidates] of Object.entries(CANDIDATES)) {
        const posDiv = document.createElement("div");
        posDiv.className = "admin-position";
        let displayName = position.charAt(0).toUpperCase() + position.slice(1);
        if (position === "mp") displayName = "Member of Parliament";
        else if (position === "womenRep") displayName = "Women Representative";
        else if (position === "mca") displayName = "MCA";
        posDiv.innerHTML = `<h4>${displayName}</h4>`;
        const list = document.createElement("ul");
        candidates.forEach(c => {
            const li = document.createElement("li");
            li.textContent = `${c.name} (${c.party}): ${voteCounts[c.id] || 0} votes`;
            list.appendChild(li);
        });
        posDiv.appendChild(list);
        container.appendChild(posDiv);
    }
}