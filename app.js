/* --- WINDOW MANAGEMENT --- */
let highestZ = 10;
let dashboardBooted = false;
let pendingPayloadDemo = null;
function focusWindow(win) {
    highestZ++; 
    win.style.zIndex = highestZ;
    document.querySelectorAll('.window').forEach(w => w.classList.remove('active-win'));
    win.classList.add('active-win');
}

function toggleWindow(windowId, event) {
    if (event) {
        event.stopPropagation(); 
    }
    const win = document.getElementById(windowId);
    
    if (win.style.display === 'none' || win.style.display === '') {
        win.style.display = 'flex'; 
        focusWindow(win);
        
        if (windowId === 'map-window' && typeof map !== 'undefined') { 
            setTimeout(() => map.invalidateSize(), 100); 
        }
        
        if (windowId === 'node-window' && typeof resizeNodeCanvas === 'function') {
            setTimeout(resizeNodeCanvas, 100);
        }
        
    } else { 
        win.style.display = 'none'; 
        
        // If closing the editor for the first time, boot the main dashboard
        if (windowId === 'editor-window' && !dashboardBooted) {
            bootDashboard();
        }
    }
}

// Function to launch the main windows
function bootDashboard() {
    dashboardBooted = true;
    const initialWindows = ['terminal', 'soc-dashboard', 'map-window', 'analytics-window', 'projects-folder', 'node-window'];
    
    initialWindows.forEach(id => { 
        document.getElementById(id).style.display = 'flex'; 
    });
    
    focusWindow(document.getElementById('terminal')); 
    
    setTimeout(() => { 
        if (typeof map !== 'undefined') {
            map.invalidateSize(); 
        }
    }, 200); 
    if (pendingPayloadDemo) {
        setTimeout(() => { launchPayloadModal(pendingPayloadDemo); }, 2500);
    }
}
function launchPayloadModal(payloadType) {
    const payloadWin = document.getElementById('payload-window');
    payloadWin.style.display = 'flex';
    focusWindow(payloadWin); 
    triggerAnalyzer(payloadType); 
}
document.querySelectorAll('.window').forEach(win => { 
    win.addEventListener('mousedown', () => focusWindow(win)); 
});

document.querySelectorAll('.window-header').forEach(header => { 
    header.onmousedown = dragMouseDown; 
});

function dragMouseDown(e) {
    e = e || window.event; 
    e.preventDefault();
    
    const win = this.closest('.window'); 
    focusWindow(win); 
    
    let pos3 = e.clientX;
    let pos4 = e.clientY;
    
    document.onmouseup = () => { 
        document.onmouseup = null; 
        document.onmousemove = null; 
    };
    
    document.onmousemove = (e) => {
        e = e || window.event; 
        e.preventDefault();
        let pos1 = pos3 - e.clientX;
        let pos2 = pos4 - e.clientY;
        pos3 = e.clientX; 
        pos4 = e.clientY;
        win.style.top = (win.offsetTop - pos2) + "px"; 
        win.style.left = (win.offsetLeft - pos1) + "px";
    };
}

/* --- VIRTUAL FILE SYSTEM LOGIC --- */
const fileContents = {
    'FIM_v2.py': `<span class="cmt">#!/usr/bin/env python3</span>
<span class="cmt"># ==========================================</span>
<span class="cmt"># TARGET: File Integrity Monitor (FIM) v2.0</span>
<span class="cmt"># AUTHOR: Noah Peters | Omaha, NE</span>
<span class="cmt"># ==========================================</span>

<span class="kw">import</span> hashlib
<span class="kw">import</span> os
<span class="kw">import</span> time

<span class="kw">def</span> <span class="func">calculate_hash</span>(filepath):
    <span class="str">"""Calculates SHA-256 hash of a file."""</span>
    sha256_hash = hashlib.sha256()
    <span class="kw">try</span>:
        <span class="kw">with</span> open(filepath, <span class="str">"rb"</span>) <span class="kw">as</span> f:
            <span class="kw">for</span> byte_block <span class="kw">in</span> iter(<span class="kw">lambda</span>: f.read(4096), b""):
                sha256_hash.update(byte_block)
        <span class="kw">return</span> sha256_hash.hexdigest()
    <span class="kw">except</span> FileNotFoundError:
        <span class="kw">return</span> <span class="kw">None</span>

<span class="kw">def</span> <span class="func">monitor_directory</span>(path, baseline):
    <span class="str">"""Compares live hashes against a trusted baseline."""</span>
    <span class="kw">print</span>(<span class="str">f"[*] Monitoring {path} for unauthorized changes..."</span>)
    <span class="kw">for</span> root, _, files <span class="kw">in</span> os.walk(path):
        <span class="kw">for</span> file <span class="kw">in</span> files:
            full_path = os.path.join(root, file)
            current_hash = calculate_hash(full_path)
            
            <span class="kw">if</span> full_path <span class="kw">not in</span> baseline:
                <span class="kw">print</span>(<span class="str">f"[ALERT] New rogue file detected: {full_path}"</span>)
            <span class="kw">elif</span> current_hash != baseline[full_path]:
                <span class="kw">print</span>(<span class="str">f"[CRITICAL] File modified: {full_path}"</span>)`,
    'password_cracker.py': `<span class="cmt">#!/usr/bin/env python3</span>
<span class="cmt"># ==========================================</span>
<span class="cmt"># TARGET: Brute Force and Dictionary Password Cracker</span>
<span class="cmt"># AUTHOR: Noah Peters | Omaha, NE</span>
<span class="cmt"># ==========================================</span>

<span class="kw">import</span> threading
<span class="kw">from</span> hashlib <span class="kw">import</span> md5
<span class="kw">from</span> string <span class="kw">import</span> printable
<span class="kw">from</span> itertools <span class="kw">import</span> product
<span class="kw">from</span> getpass <span class="kw">import</span> getpass <span class="kw">as</span> gp
<span class="kw">from</span> datetime <span class="kw">import</span> datetime
<span class="kw">import</span> os

THREADNUM = 6
threads = []
stop_event = threading.Event() <span class="cmt"># Event to signal all threads to stop</span>

<span class="kw">def</span> <span class="func">clear</span>(): <span class="cmt"># Clears the terminal</span>
    os.system(<span class="str">"cls"</span> <span class="kw">if</span> os.name == <span class="str">"nt"</span> <span class="kw">else</span> <span class="str">"clear"</span>)

<span class="kw">def</span> <span class="func">TestPasswd</span>(): <span class="cmt"># Creates a hash to test the program</span>
    <span class="kw">while True</span>:
        pass1 = <span class="func">md5</span>(<span class="func">gp</span>(<span class="str">"Enter your password: "</span>).encode(<span class="str">"UTF-8"</span>)).hexdigest()
        pass2 = <span class="func">md5</span>(<span class="func">gp</span>(<span class="str">"Confirm your password: "</span>).encode(<span class="str">"UTF-8"</span>)).hexdigest()
        <span class="kw">if</span> pass1 == pass2:
            <span class="kw">with</span> open(<span class="str">"Hash.txt"</span>, <span class="str">"w"</span>) <span class="kw">as</span> shadow:
                shadow.write(f<span class="str">"{pass1}\\n"</span>)
                <span class="kw">break</span>
        <span class="kw">else</span>:
            <span class="func">print</span>(<span class="str">"Your password didn't match!"</span>)

<span class="kw">def</span> <span class="func">GetHash</span>(): <span class="cmt"># Gets a hash from the user</span>
    <span class="kw">while True</span>:
        hash = <span class="func">input</span>(<span class="str">"Give me the md5 hash to crack\\n"</span>)
        <span class="kw">if</span> <span class="func">len</span>(hash) == 32: <span class="cmt"># Checks for valid hash</span>
            <span class="kw">with</span> open(<span class="str">"Hash.txt"</span>, <span class="str">"w"</span>) <span class="kw">as</span> shadow:
                    shadow.write(f<span class="str">"{hash}\\n"</span>)
                    <span class="kw">break</span>
        <span class="kw">else</span>:
            <span class="func">print</span>(<span class="str">"Only md5 hashes are allowed"</span>)

<span class="kw">def</span> <span class="func">Brutepwd</span>(thread_id,r1,r2): <span class="cmt"># Brute forces the password hash to find a match</span>
    <span class="kw">with</span> open(<span class="str">"Hash.txt"</span>, <span class="str">"r"</span>) <span class="kw">as</span> shadow_file:
        <span class="kw">for</span> shadow <span class="kw">in</span> shadow_file:
            <span class="kw">for</span> x <span class="kw">in</span> <span class="func">range</span>(r1, r2):
                res = <span class="func">product</span>(printable[:-6], repeat=x)
                <span class="kw">for</span> i <span class="kw">in</span> res:
                    hashed = <span class="func">md5</span>(<span class="str">""</span>.<span class="func">join</span>(i).encode(<span class="str">"UTF-8"</span>)).hexdigest()
                    <span class="kw">if</span> progress == <span class="kw">True</span>: <span class="cmt"># Prints progress to terminal</span>
                        <span class="func">print</span>(f<span class="str">"{hashed}    =>    {''.join(i)}"</span>)
                    <span class="kw">if</span> stop_event.is_set():
                        <span class="kw">return</span>  <span class="cmt"># Exit the thread if the event is set</span>
                    <span class="kw">if</span> hashed == shadow.strip(): <span class="cmt"># Match found</span>
                        stop_event.set()  <span class="cmt"># Set the event to stop all other threads</span>
                        <span class="func">print</span>(f<span class="str">"Gotcha! The password is {''.join(i)}"</span>)
                        <span class="func">print</span>(f<span class="str">"Complete at:{datetime.now()}"</span>)
                        <span class="func">quit</span>()
            <span class="func">print</span>(f<span class="str">"Thread {thread_id} has gone through all options at:{datetime.now()}."</span>)

<span class="kw">def</span> <span class="func">Dictattack</span>(): <span class="cmt"># Uses a password list to find a match</span>
    <span class="kw">with</span> open(<span class="str">"Hash.txt"</span>, <span class="str">"r"</span>) <span class="kw">as</span> shadow_file:
        <span class="kw">with</span> open(<span class="str">"password_list.txt"</span>, <span class="str">"r"</span>) <span class="kw">as</span> password_file:
            <span class="kw">for</span> shadow <span class="kw">in</span> shadow_file:
                <span class="kw">for</span> password <span class="kw">in</span> password_file:
                    hashed = <span class="func">md5</span>(password.strip().encode(<span class="str">"UTF-8"</span>)).hexdigest()
                    <span class="kw">if</span> progress == <span class="kw">True</span>:
                        <span class="func">print</span>(f<span class="str">"{password}"</span>)
                    <span class="kw">if</span> shadow.strip() == hashed: <span class="cmt"># Match</span>
                        <span class="func">print</span>(f<span class="str">"Password Cracked! {hashed} => {password}"</span>)
                        <span class="func">print</span>(f<span class="str">"Complete at:{datetime.now()}"</span>)
                        <span class="kw">break</span>

<span class="kw">def</span> <span class="func">Pwdripper</span>(): <span class="cmt"># Creates threads for the brute force attack</span>
    <span class="kw">for</span> i <span class="kw">in</span> <span class="func">range</span>(THREADNUM):
        thread = threading.Thread(target=Brutepwd, args=(i+1,i+1,i+2,))
        threads.append(thread)
        thread.start()
    <span class="kw">for</span> thread <span class="kw">in</span> threads:
        thread.join()
    <span class="func">print</span>(<span class="str">"Hacked!"</span>)

<span class="kw">def</span> <span class="func">DisplayTerminal</span>(): <span class="cmt"># Ask user if they want to see the progress</span>
    <span class="kw">while True</span>: 
        <span class="func">print</span>(<span class="str">"-"</span>*50)
        <span class="func">print</span>(<span class="str">"Print attempts to the terminal?\\n[y/N]"</span>)
        <span class="func">print</span>(<span class="str">"-"</span>*50)
        displayinput = <span class="func">input</span>(<span class="str">""</span>).lower()
        <span class="kw">if</span> displayinput <span class="kw">in</span> [<span class="str">'y'</span>,<span class="str">'n'</span>,<span class="str">''</span>]: <span class="kw">break</span>
        <span class="kw">else</span>:
            <span class="func">clear</span>()
    <span class="kw">if</span> displayinput <span class="kw">in</span> [<span class="str">'n'</span>,<span class="str">''</span>]:
        progress = <span class="kw">False</span>
    <span class="kw">if</span> displayinput == <span class="str">"y"</span>:
        progress = <span class="kw">True</span>
    <span class="kw">return</span> progress

<span class="cmt"># --- Script Execution ---</span>
<span class="func">clear</span>()
progress = <span class="func">DisplayTerminal</span>()
<span class="cmt"># Menu calls omitted for brevity</span>
<span class="func">AttackType</span>()`,

    'fast_scanner.py': `<span class="cmt">#!/usr/bin/env python3</span>
<span class="cmt"># ==========================================</span>
<span class="cmt"># TARGET: High-Speed Multithreaded Port Scanner</span>
<span class="cmt"># AUTHOR: Noah Peters | Omaha, NE</span>
<span class="cmt"># ==========================================</span>

<span class="kw">import</span> socket
<span class="kw">import</span> sys
<span class="kw">import</span> threading
<span class="kw">from</span> queue <span class="kw">import</span> Queue
<span class="kw">from</span> datetime <span class="kw">import</span> datetime

target = <span class="str">""</span>
<span class="kw">if</span> <span class="func">len</span>(sys.argv) == 2:
    <span class="kw">try</span>:
        target = socket.gethostbyname(sys.argv[1])
    <span class="kw">except</span> socket.gaierror:
        <span class="func">print</span>(<span class="str">"Hostname could not be resolved."</span>)
        sys.exit()
<span class="kw">else</span>:
    target = <span class="func">input</span>(<span class="str">"Enter the ip address: "</span>)
    <span class="kw">try</span>:
        target = socket.gethostbyname(target)
    <span class="kw">except</span> socket.gaierror:
        <span class="func">print</span>(<span class="str">"Hostname could not be resolved."</span>)
        sys.exit()

<span class="cmt"># Print Header</span>
<span class="func">print</span>(<span class="str">"-"</span>*50)
<span class="func">print</span>(f<span class="str">"Scanning target: {target}"</span>)
<span class="func">print</span>(f<span class="str">"Time started: {datetime.now()}"</span>)
<span class="func">print</span>(<span class="str">"-"</span>*50)

queue = Queue()
open_ports = []

<span class="kw">def</span> <span class="func">portscan</span>(port):
    <span class="kw">try</span>:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.5) <span class="cmt"># Shorter timeout since we are using threads</span>
        result = s.connect_ex((target, port))
        <span class="kw">if</span> result == 0:
            <span class="func">print</span>(f<span class="str">"[+] Port {port} is OPEN"</span>)
            open_ports.append(port)
        s.close()
    <span class="kw">except</span>:
        <span class="kw">pass</span>

<span class="kw">def</span> <span class="func">worker</span>():
    <span class="kw">while not</span> queue.empty():
        port = queue.get()
        <span class="func">portscan</span>(port)
        queue.task_done()

<span class="cmt"># Load the queue with the top 1024 common ports</span>
<span class="kw">for</span> port <span class="kw">in</span> <span class="func">range</span>(1, 1025):
    queue.put(port)

thread_list = []
<span class="cmt"># Spawn 50 concurrent worker threads to eat through the queue</span>
<span class="kw">for</span> t <span class="kw">in</span> <span class="func">range</span>(50):
    thread = threading.Thread(target=worker)
    thread_list.append(thread)
    thread.start()

<span class="cmt"># Wait for all threads to finish</span>
<span class="kw">for</span> thread <span class="kw">in</span> thread_list:
    thread.join()

<span class="func">print</span>(f<span class="str">"Scan complete. Found {<span class="func">len</span>(open_ports)} open ports."</span>)`,

    'README.md': `<span class="kw"># Cyber Portfolio: Noah Peters</span>
<span class="str">**Aspiring Cybersecurity Professional**</span>
Location: Omaha, NE
Contact: noah@cyacad.com

<span class="func">## Certifications</span>
- CompTIA Security+
- CompTIA Network+
- CompTIA Linux+
- CompTIA CySA+ (Actively Pursuing - 75%)

<span class="func">## About This Environment</span>
Welcome to my interactive threat intelligence dashboard. 
This environment simulates a live Security Operations Center (SOC) 
terminal, capturing and analyzing real-time background radiation 
from the internet using a deployed Cowrie SSH honeypot.

The live map and data feeds are populated by actual automated 
botnet attacks hitting my server in real-time.`,

    'topology.txt': `<span class="cmt"># Network Topology Map (Placeholder)</span>\n<span class="str">Gateway: 10.0.0.1</span>\n<span class="str">Honeypot: 10.0.0.50 (DMZ)</span>`
};

const fileSystem = {
    'root': [
        { name: 'Python_Arsenal', type: 'folder', target: 'Python_Arsenal' },
        { name: 'Network_Maps', type: 'folder', target: 'Network_Maps' },
        { name: 'README.md', type: 'file' }
    ],
    'Python_Arsenal': [
        { name: '.. (Go Back)', type: 'folder', target: 'root', icon: '🔙' },
        { name: 'FIM_v2.py', type: 'file', icon: '🐍' },
        { name: 'password_cracker.py', type: 'file', icon: '🐍' },
        { name: 'fast_scanner.py', type: 'file', icon: '🐍' }
    ],
    'Network_Maps': [
        { name: '.. (Go Back)', type: 'folder', target: 'root', icon: '🔙' },
        { name: 'topology.txt', type: 'file' }
    ]
};

function renderDirectory(path) {
    const grid = document.getElementById('projects-grid');
    const title = document.getElementById('projects-title');
    
    grid.innerHTML = ''; 
    title.textContent = `PROJECTS | ~/${path}`; 

    const items = fileSystem[path];
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'file-item';
        
        if (item.type === 'folder') {
            const icon = item.icon || '📁';
            div.onclick = () => renderDirectory(item.target);
            div.innerHTML = `<span class="file-icon">${icon}</span><span class="file-name">${item.name}</span>`;
        } else {
            const icon = item.icon || '📄';
            div.onclick = () => openFile(item.name);
            div.innerHTML = `<span class="file-icon">${icon}</span><span class="file-name">${item.name}</span>`;
        }
        
        grid.appendChild(div);
    });
}

function openFile(filename) {
    const editorWin = document.getElementById('editor-window');
    document.getElementById('editor-title').textContent = `code_viewer | ${filename}`;
    document.getElementById('editor-code').innerHTML = fileContents[filename] || `<span class="cmt"># File empty or unreadable</span>`;
    
    editorWin.style.display = 'flex';
    focusWindow(editorWin);
}

/* --- GLOBAL THREAT MAP (LEAFLET) --- */
const map = L.map('threat-map', { zoomControl: false, attributionControl: false }).setView([20, 0], 2);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { 
    subdomains: 'abcd', 
    maxZoom: 19 
}).addTo(map);

const threatIcon = L.divIcon({ 
    className: 'custom-div-icon', 
    html: "<div style='background-color: #f7768e; width: 10px; height: 10px; border-radius: 50%; box-shadow: 0 0 12px #f7768e;'></div>", 
    iconSize: [10, 10], 
    iconAnchor: [5, 5] 
});

/* --- LIVE ANALYTICS (CHART.JS) --- */
const ctxChart = document.getElementById('threatChart').getContext('2d');
const threatChart = new Chart(ctxChart, {
    type: 'bar',
    data: { 
        labels: ['SSH Brute Force', 'Recon Scans', 'Payload Drops', 'Malware Scripts'], 
        datasets: [{ 
            label: 'Attacks Captured', 
            data: [0, 0, 0, 0], 
            backgroundColor: 'rgba(42, 195, 222, 0.5)', 
            borderColor: '#2ac3de', 
            borderWidth: 1, 
            borderRadius: 4 
        }] 
    },
    options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { legend: { display: false } }, 
        scales: { 
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#a9b1d6' } }, 
            x: { grid: { display: false }, ticks: { color: '#a9b1d6' } } 
        } 
    }
});

/* --- GLOBAL THREAT TICKER --- */
const ticker = document.getElementById('payload-ticker');
ticker.innerHTML = ''; 

function addTickerAlert(ip, intelData, isCritical = false) {
    const alertSpan = document.createElement('span');
    alertSpan.className = 'hash-span';
    
    const color = isCritical ? 'var(--alert-red)' : '#e0af68';
    alertSpan.style.color = color;
    alertSpan.innerHTML = `[INTEL: ${ip}] ${intelData} &nbsp;&nbsp;&nbsp;///&nbsp;&nbsp;&nbsp; `;
    
    ticker.appendChild(alertSpan);

    if (ticker.children.length > 10) {
        ticker.removeChild(ticker.firstElementChild);
    }
}

/* --- TERMINAL ENGINE --- */
const input = document.getElementById('cmd-input'); 
const history = document.getElementById('terminal-history');

input.addEventListener('keydown', function(e) { 
    if (e.key === 'Enter') { 
        const command = input.value; 
        input.value = ''; 
        processCommand(command); 
    } 
});

function printToTerm(text, className = 'cmd-out') {
    const line = document.createElement('span'); 
    line.className = className; 
    line.textContent = text + '\n';
    history.appendChild(line);
    const content = document.querySelector('#terminal .window-content'); 
    content.scrollTop = content.scrollHeight;
}

async function processCommand(cmd) {
    if (!cmd.trim()) return;
    printToTerm(`guest@sec-os:~# ${cmd}`, 'cmd-in');
    const args = cmd.trim().split(' ');
    
    switch(args[0].toLowerCase()) {
        case 'help':
            printToTerm('Available Commands:', 'cmd-highlight');
            printToTerm('  whoami     - Display user bio and location');
            printToTerm('  certs      - Display active credentials and certs');
            printToTerm('  skills     - Display technical arsenal');
            printToTerm('  projects   - List active defensive deployments');
            printToTerm('  clear      - Clear terminal history');
            break;
        case 'clear': 
            history.textContent = ''; 
            break;
        case 'whoami': 
            printToTerm('Noah Peters', 'cmd-highlight');
            printToTerm('Aspiring Cybersecurity Professional based in Omaha, NE.');
            printToTerm('Ready to defend the perimeter.');
            break;
        case 'certs':
            printToTerm('[✓] CompTIA Security+', 'cmd-success');
            printToTerm('[✓] CompTIA Network+', 'cmd-success');
            printToTerm('[✓] CompTIA Linux+', 'cmd-success');
            printToTerm('[⟳] CompTIA CySA+ (Actively Pursuing - 75%)', 'cmd-highlight');
            break;
        case 'skills':
            printToTerm('Languages: Python, Bash', 'cmd-out');
            printToTerm('Systems:   Linux (Ubuntu), tmux, CLI Environments', 'cmd-out');
            printToTerm('Defensive: Honeypot Deployment, Threat Intel Analysis', 'cmd-out');
            break;
        case 'projects':
            printToTerm('1. File Integrity Monitor (FIM) - Python defensive script', 'cmd-out');
            printToTerm('2. Python Port Scanner - Automated reconnaissance tool', 'cmd-out');
            printToTerm('3. Password Cracker - Python-based auditing script', 'cmd-out');
            printToTerm('4. Sec-OS - Real-time Threat Intelligence UI', 'cmd-highlight');
            break;
        default: 
            printToTerm(`bash: ${args[0]}: command not found. Type 'help'.`, 'cmd-error');
    }
}

/* --- REAL-TIME DATA PIPELINE --- */
const socket = io('https://api.cyacad.com'); 
const statusIndicator = document.getElementById('connection-status');
const liveFeed = document.getElementById('live-feed');
const threatLevel = document.getElementById('threat-level');
const terminalWin = document.getElementById('terminal');
let attackCount = 0;

socket.on('connect', () => {
    statusIndicator.textContent = "[ONLINE] SECURE LINK"; 
    statusIndicator.style.color = "#9ece6a";
    printToTerm("[SYSTEM] WebSocket link to VPS established. Awaiting telemetry...", "cmd-success");
});

socket.on('attack_history', (historyArray) => {
    if (historyArray && historyArray.length > 0) {
        liveFeed.innerHTML = ''; 
        threatChart.data.datasets[0].data = [0, 0, 0, 0];
        
        historyArray.forEach(data => {
            const attackType = data.type || 'Unknown Event';
            const li = document.createElement('li');
            li.innerHTML = `<span style="color:#565f89">[HISTORY]</span> ${data.timestamp || 'Archived'} - <b>${data.ip}</b><br><span style="color:#7aa2f7; font-size: 10px; margin-left: 65px;">└─ ${attackType}</span>`;
            liveFeed.prepend(li);

            const lat = data.lat || 0; 
            const lon = data.lon || 0;
            
            if (lat !== 0 || lon !== 0) { 
                const marker = L.marker([lat, lon], {icon: threatIcon}).addTo(map); 
                marker.bindPopup(`<b>${data.ip}</b><br>Historical Record`); 
            }

            let binIndex = 0; 
            if (attackType.includes('Recon')) {
                binIndex = 1; 
            } else if (attackType.includes('Payload')) {
                binIndex = 2; 
            } else if (attackType.includes('Script') || attackType.includes('Malware') || attackType.includes('Exec')) {
                binIndex = 3;
            }
            threatChart.data.datasets[0].data[binIndex]++;
        });
        
        threatChart.update();
        
        // Scan history for latest payload demo
        const recentPayload = [...historyArray].reverse().find(event => event.type && event.type.includes('Payload'));
        if (recentPayload) {
            if (dashboardBooted) {
                setTimeout(() => { launchPayloadModal(recentPayload.type); }, 2500);
            } else {
                pendingPayloadDemo = recentPayload.type;
            }
        }
    }
});

socket.on('new_attack', (data) => {
    attackCount++; 
    const attackType = data.type || 'Unknown Event';
    
    // The Firehose
    printToTerm(`[ALERT] Intrusion from ${data.ip} | ${attackType}`, "cmd-error");

    terminalWin.style.borderColor = 'var(--alert-red)'; 
    terminalWin.style.boxShadow = '0 0 20px rgba(247, 118, 142, 0.4)';
    setTimeout(() => { 
        terminalWin.style.borderColor = 'rgba(42, 195, 222, 0.5)'; 
        terminalWin.style.boxShadow = '0 8px 32px rgba(0,0,0,0.8), var(--glow)'; 
    }, 300);

    // UI Feed
    const li = document.createElement('li');
    li.innerHTML = `<span style="color:var(--alert-red)">[BLOCK]</span> ${data.timestamp || 'Live'} - <b>${data.ip}</b><br><span style="color:#e0af68; font-size: 10px; margin-left: 55px;">└─ ${attackType}</span>`;
    liveFeed.prepend(li); 
    if (liveFeed.children.length > 20) {
        liveFeed.removeChild(liveFeed.lastChild);
    }

    // Threat Level Math
    if (attackCount > 5) { 
        threatLevel.textContent = "ELEVATED"; 
        threatLevel.style.color = "#e0af68"; 
        threatLevel.style.textShadow = "0 0 10px rgba(224, 175, 104, 0.5)"; 
    }
    if (attackCount > 15) { 
        threatLevel.textContent = "CRITICAL"; 
        threatLevel.style.color = "var(--alert-red)"; 
        threatLevel.style.textShadow = "0 0 15px rgba(247, 118, 142, 0.8)"; 
    }
    
    clearTimeout(window.threatCooldown); 
    window.threatCooldown = setTimeout(() => { 
        attackCount = 0; 
        threatLevel.textContent = "NOMINAL"; 
        threatLevel.style.color = "#9ece6a"; 
        threatLevel.style.textShadow = "none"; 
    }, 10000); 

    // Live Map Plotting
    const lat = data.lat || 0; 
    const lon = data.lon || 0;
    if (lat !== 0 || lon !== 0) { 
        const marker = L.marker([lat, lon], {icon: threatIcon}).addTo(map); 
        marker.bindPopup(`<b>${data.ip}</b><br>${attackType}`).openPopup(); 
    }

    // The Ticker Intelligence Filter
    if (attackType.includes('Payload Drop')) {
        addTickerAlert(data.ip, `MALWARE URL DETECTED: ${attackType.split(': ')[1]}`, true);
        triggerAnalyzer(attackType);
    } else if (attackType.includes('SSH Breach')) {
        addTickerAlert(data.ip, `COMPROMISED CREDENTIALS: ${attackType.split(' ')[2]}`, true);
    } else if (attackType.includes('Script Exec')) {
        addTickerAlert(data.ip, `COMMAND INTERCEPT: ${attackType.split(': ')[1]}`);
    }

    // Live Chart Updates
    let binIndex = 0;
    if (attackType.includes('Recon')) {
        binIndex = 1;
    } else if (attackType.includes('Payload')) {
        binIndex = 2; 
    } else if (attackType.includes('Script') || attackType.includes('Malware') || attackType.includes('Exec')) {
        binIndex = 3;
    }
    
    threatChart.data.datasets[0].data[binIndex]++; 
    threatChart.update();
    
    // Node Swarm Injection
    if (typeof swarmNodes !== 'undefined') {
        swarmNodes.push(new SwarmNode(true));
    }
});

/* --- BACKGROUND ANIMATION & STARTUP CONFIG --- */
window.onload = () => { 
    openFile('README.md');
    renderDirectory('root');
    const editorWin = document.getElementById('editor-window');
    editorWin.style.top = '15vh';
    editorWin.style.left = 'calc(50% - 390px)'; 
};

const canvas = document.getElementById('bg-canvas'); 
const ctx = canvas.getContext('2d');
let width, height; 
let particles = [];

function resize() { 
    width = canvas.width = window.innerWidth; 
    height = canvas.height = window.innerHeight; 
}
window.addEventListener('resize', resize); 
resize();

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * width; 
        this.y = Math.random() * height; 
        this.size = Math.random() * 2 + 1; 
        this.speed = Math.random() * 2 + 1;
        
        const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]]; 
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        
        this.vx = dir[0] * this.speed; 
        this.vy = dir[1] * this.speed; 
        this.life = 0; 
        this.maxLife = Math.random() * 100 + 50; 
        this.history = [];
    }
    update() {
        this.history.push({x: this.x, y: this.y}); 
        if (this.history.length > 20) this.history.shift(); 
        
        this.x += this.vx; 
        this.y += this.vy; 
        this.life++;
        
        if (Math.random() < 0.05) { 
            if (this.vx !== 0) { 
                this.vy = (Math.random() > 0.5 ? 1 : -1) * this.speed; 
                this.vx = 0; 
            } else { 
                this.vx = (Math.random() > 0.5 ? 1 : -1) * this.speed; 
                this.vy = 0; 
            } 
        }
        
        if (this.life >= this.maxLife || this.x < 0 || this.x > width || this.y < 0 || this.y > height) { 
            this.reset(); 
        }
    }
    draw() {
        ctx.beginPath(); 
        for(let i=0; i<this.history.length; i++) { 
            const pos = this.history[i]; 
            if (i === 0) ctx.moveTo(pos.x, pos.y); 
            else ctx.lineTo(pos.x, pos.y); 
        }
        ctx.strokeStyle = `rgba(42, 195, 222, ${this.life / this.maxLife})`; 
        ctx.lineWidth = this.size; 
        ctx.stroke();
        
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); 
        ctx.fillStyle = '#2ac3de'; 
        ctx.fill();
    }
}

for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
}

function animate() { 
    ctx.fillStyle = 'rgba(5, 5, 9, 0.1)'; 
    ctx.fillRect(0, 0, width, height); 
    
    particles.forEach(p => { 
        p.update(); 
        p.draw(); 
    }); 
    
    requestAnimationFrame(animate); 
}
animate();

/* --- NODE TOPOLOGY SWARM ENGINE --- */
const nodeCanvas = document.getElementById('node-canvas');
const nodeCtx = nodeCanvas.getContext('2d');
let swarmNodes = [];

function resizeNodeCanvas() {
    if (nodeCanvas && nodeCanvas.parentElement) {
        // Added a fallback size just in case the window is hidden during boot
        nodeCanvas.width = nodeCanvas.parentElement.clientWidth || 550;
        nodeCanvas.height = nodeCanvas.parentElement.clientHeight || 350;
    }
}
window.addEventListener('resize', resizeNodeCanvas);

class SwarmNode {
    constructor(isMalicious = false) {
        this.x = Math.random() * (nodeCanvas.width || 550);
        this.y = Math.random() * (nodeCanvas.height || 350);
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = isMalicious ? 4 : 2;
        this.isMalicious = isMalicious;
        this.life = isMalicious ? 200 : Infinity;
    }
    update() {
        this.x += this.vx; 
        this.y += this.vy;
        if (this.x < 0 || this.x > nodeCanvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > nodeCanvas.height) this.vy *= -1;
        if (this.isMalicious) this.life--;
    }
    draw() {
        nodeCtx.beginPath();
        nodeCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // FIX: Hardcoded hex colors instead of CSS variables
        nodeCtx.fillStyle = this.isMalicious ? '#f7768e' : '#2ac3de';
        
        if (this.isMalicious) {
            nodeCtx.shadowBlur = 10;
            nodeCtx.shadowColor = '#f7768e';
        } else {
            nodeCtx.shadowBlur = 0;
        }
        nodeCtx.fill();
    }
}

setTimeout(() => {
    resizeNodeCanvas();
    for(let i=0; i<40; i++) {
        swarmNodes.push(new SwarmNode());
    }
    animateSwarm();
}, 500);

function animateSwarm() {
    if (!nodeCanvas || !nodeCtx) return;
    
    nodeCtx.clearRect(0, 0, nodeCanvas.width, nodeCanvas.height);
    
    swarmNodes = swarmNodes.filter(node => node.life > 0);
    const countDisplay = document.getElementById('swarm-count');
    if (countDisplay) countDisplay.textContent = swarmNodes.length;

    for (let i = 0; i < swarmNodes.length; i++) {
        for (let j = i + 1; j < swarmNodes.length; j++) {
            let dx = swarmNodes[i].x - swarmNodes[j].x;
            let dy = swarmNodes[i].y - swarmNodes[j].y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 80) {
                nodeCtx.beginPath();
                nodeCtx.moveTo(swarmNodes[i].x, swarmNodes[i].y);
                nodeCtx.lineTo(swarmNodes[j].x, swarmNodes[j].y);
                let opacity = 1 - (dist / 80);
                
                if (swarmNodes[i].isMalicious || swarmNodes[j].isMalicious) {
                    nodeCtx.strokeStyle = `rgba(247, 118, 142, ${opacity})`;
                    nodeCtx.lineWidth = 1.5;
                } else {
                    nodeCtx.strokeStyle = `rgba(42, 195, 222, ${opacity * 0.3})`;
                    nodeCtx.lineWidth = 0.5;
                }
                nodeCtx.stroke();
            }
        }
    }
    swarmNodes.forEach(node => { 
        node.update(); 
        node.draw(); 
    });
    requestAnimationFrame(animateSwarm);
}

/* --- PAYLOAD ANALYZER ENGINE --- */
const hexStream = document.getElementById('hex-stream');
const intelOut = document.getElementById('intel-out');
let isAnalyzing = false;

function generateHex() {
    if (isAnalyzing) return; 
    
    let hexLine = '';
    for(let i=0; i<8; i++) {
        hexLine += Math.floor(Math.random()*256).toString(16).padStart(2, '0').toUpperCase() + ' ';
    }
    
    const div = document.createElement('div');
    div.textContent = hexLine;
    
    if (hexStream) {
        hexStream.appendChild(div);
        if (hexStream.children.length > 18) {
            hexStream.removeChild(hexStream.firstElementChild);
        }
    }
}

setInterval(generateHex, 50); 

function triggerAnalyzer(payloadString) {
    if (isAnalyzing) return; 
    isAnalyzing = true;
    
    const targetHex = document.createElement('div');
    targetHex.textContent = "FF 00 00 E8 89 45 00 FF";
    targetHex.style.color = "var(--alert-red)";
    targetHex.style.backgroundColor = "rgba(247, 118, 142, 0.2)";
    targetHex.style.textShadow = "0 0 10px var(--alert-red)";
    hexStream.appendChild(targetHex);
    
    intelOut.innerHTML += `<span style="color:var(--accent)">[>] ANOMALY DETECTED. EXTRACTING...</span><br>`;
    
    let url = payloadString.split('Drop: ')[1] || payloadString;
    
    if (url === "None") {
        url = "[UNIDENTIFIED_DATA_STREAM]";
    }
    
    const typeTarget = document.createElement('span');
    typeTarget.style.color = "var(--alert-red)";
    typeTarget.style.wordBreak = "break-all";
    intelOut.appendChild(typeTarget);

    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < url.length) {
            typeTarget.textContent += url.charAt(charIndex);
            charIndex++;
            intelOut.scrollTop = intelOut.scrollHeight;
            setTimeout(typeWriter, 30); 
        } else {
            intelOut.innerHTML += `<br><br><span style="color:#9ece6a">[✓] SIGNATURE LOGGED. RESUMING SCAN.</span><br><br>`;
            intelOut.scrollTop = intelOut.scrollHeight;
            setTimeout(() => { isAnalyzing = false; }, 3000); 
        }
    }
    
    setTimeout(typeWriter, 800); 
}