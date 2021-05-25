async function getProgram(){

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')

    let res = await eel.get_tabata_program(JSON.stringify(id))();

    data = JSON.parse(res);
    for ( let key in data ) {
        let param = document.getElementsByName(key)[0];
        param.value = data[key];
    }
}

getProgram();
