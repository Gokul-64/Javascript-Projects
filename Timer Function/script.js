let timers=[];
function addTimer(){
    if(confirm('Would you like to add a timer')){
        let name=prompt("Timer name: ", "New Timer");
        let a=prompt('Timer minutes: (Max 10 minutes)',"5") || 5;
        const timerId = Date.now();
        const totalSeconds = a * 60;
        const timerObj = {
            id: timerId,
            name: name,
            remaining: totalSeconds,
            total: totalSeconds,
            status: 'running',
            interval: null
        };


        const container=document.getElementById("container");
        const pc=document.createElement('div');
        pc.classList.add('parentContainer');
        pc.id = `timer-${timerId}`;

        const header=document.createElement('div');
        header.classList.add('header');
        header.textContent=name;
        pc.appendChild(header);

        const timer=document.createElement('div');
        timer.classList.add('timer');
        pc.appendChild(timer);

        const optionButtons=document.createElement('div');
        optionButtons.classList.add('optionButtons');
        

        const deleteButton=document.createElement('div');
        deleteButton.classList.add('deleteButton');
        deleteButton.textContent="Delete";
        deleteButton.onclick= () =>removeTimer(timerId);
        optionButtons.appendChild(deleteButton);

        const editButton=document.createElement('div');
        editButton.classList.add('editButton');
        editButton.textContent="Edit";
        editButton.onclick= () =>editTimer(timerId);
        optionButtons.appendChild(editButton);

        const pauseButton=document.createElement('div');
        pauseButton.classList.add('pauseButton');
        pauseButton.textContent="Pause";
        pauseButton.onclick= () =>togglePause(timerId,pauseButton);
        optionButtons.appendChild(pauseButton);

        pc.appendChild(optionButtons);
        container.appendChild(pc);
        timerObj.interval = setInterval(() => {
            if (timerObj.status === 'running') {
                if (timerObj.remaining <= 0) {
                    clearInterval(timerObj.interval);
                    timerDisplay.textContent = "Time's up!";
                    return;
                }
                timerObj.remaining--;
                const m = Math.floor(timerObj.remaining / 60);
                const s = timerObj.remaining % 60;
                timer.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }
        }, 1000);

        timers.push(timerObj);
    }
    else{
        console.log("Cancelled by user");
    }
}


function togglePause(id, btn) {
    const t = timers.find(x => x.id === id);
    if (t) {
        t.status = t.status === 'running' ? 'paused' : 'running';
        btn.textContent = t.status === 'running' ? 'Pause' : 'Play';
    }
}

function removeTimer(id) {
    const t = timers.find(x => x.id === id);
    if (t) {
        clearInterval(t.interval);
        timers = timers.filter(x => x.id !== id);
        document.getElementById(`timer-${id}`).remove();
    }
}

function editTimer(id) {
    const t = timers.find(x => x.id === id);
    if (t) {
        let newName = prompt("New name:", t.name);
        let newMins = prompt("New minutes:", t.remaining / 60);
        if (newName) {
            t.name = newName;
            document.querySelector(`#timer-${id} .header`).textContent = newName;
        }
        if (newMins) {
            t.remaining = parseInt(newMins) * 60;
        }
    }
}

function exportJson() {
    const data = timers.map(({id, name, remaining}) => ({name, remaining}));
    const blob = new Blob([JSON.stringify(data, null, 2)], {type : 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timers.json';
    a.click();
}