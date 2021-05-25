let saveButton = document.getElementById("save-button");

saveButton.onclick = async function saveTabataProgram(){
    let formData = new FormData(document.getElementsByName('program')[0]);
    
    let obj = {};
	for (let key of formData.keys()) {
		obj[key] = formData.get(key);
	}

    let res = await eel.save_tabata_program(JSON.stringify(obj))();
    msg = JSON.parse(res);

    if (msg.response === 'ok') {
        window.location.href = 'index.html';
    }

    for (i=0; i < msg.length; i++){
        let err = msg[i]["loc"] + " - " + msg[i]["msg"];
        M.toast({html: err});
    } 
}


document.querySelectorAll('.btn').forEach(btn => {
    btn.onclick = () => {
        let input = btn.parentNode.querySelector('input');
        if (btn.text == '+') {
            ++input.value;
        } else if (btn.text == '-'){
            --input.value;
        }
    }
});
