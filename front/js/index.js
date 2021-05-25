/**
 * Add training programs to page
 * 
 * @param {array} programs 
 */
async function addProgramsToPage(programs){
    let container = document.getElementById('programs');

    for (let i = 0; i < programs.length; i++) {
        let html = '<div class="col s12 m4"><div class="card blue-grey darken-1">';
        html += `<div class="card-content white-text link-card" id="${programs[i]['id']}">`;
        html += `<span class="card-title">${programs[i]['title']}</span>`;
        html += `<a class="run" href="run.html?id=${programs[i]['id']}"><i class="large material-icons">play_circle_outline</i></a>`
        html += `<div class="fixed-action-btn edit-card">`;
        html += `<a class="btn-floating blue-grey darken-1"><i class="large material-icons">more_vert</i></a>`;
        html += `<ul>`;
        html += `<li><a class="btn-floating red delete-button" data-id="${programs[i]['id']}"><i class="material-icons">delete</i></a></li>`;
        html += `<li><a href="edit.html?id=${programs[i]['id']}"class="btn-floating blue"><i class="material-icons">edit</i></a></li>`;
        html += `</ul></div>`;
        html += `<p>Prepare: ${programs[i]['prepare']}<br>Work: ${programs[i]['work']}<br>`;
        html += `Rest: ${programs[i]['rest']}<br>Cycles: ${programs[i]['cycles']}<br>`;
        html += `Sets: ${programs[i]['sets']}<br>Rest between sets: ${programs[i]['restbetweensets']}</p></div>`;
        html += '</div>';
        
        container.insertAdjacentHTML('afterbegin', html);
        addProgrmsEvents();
    }
}

async function deleteProgram() {
    let el = document.querySelector('#modal-delete');
    let instance = M.Modal.init(el);
    instance.open();
    el.querySelectorAll('.btn').forEach(btn => {
        btn.onclick = async () => {
            if (btn.text === 'Delete'){
                let id = JSON.stringify(this.dataset.id);
                await eel.delete_tabata_program(id)();
                this.closest('.col').remove();
            }
            instance.close();
        }
    });
    
}

async function addProgrmsEvents() {
    let elems = document.querySelectorAll('.fixed-action-btn');
    let instances = M.FloatingActionButton.init(elems, {
        direction: 'top',
        hoverEnabled: false
    });

    document.querySelectorAll('.delete-button').forEach(function(btn) {
        btn.addEventListener('click', deleteProgram);
    });
}

async function getAllPrograms(){
    let res = await eel.get_all_tabata_programs()();
    let programs = JSON.parse(res);
    addProgramsToPage(programs);
    document.querySelector('.overlay').classList.add('show');
}

getAllPrograms();