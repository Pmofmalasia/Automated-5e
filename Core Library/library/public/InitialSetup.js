async function refreshSubraces() {
    let tempCurrentSelection = document.getElementById("raceChoice");
    let currentSelection = tempCurrentSelection.value;

    let request = await fetch("macro:SubraceSelectRefresh@lib:pm.a5e.Core", {method: "POST", body: currentSelection});
    let newSubraceOptions = await request.json();
    
    if(newSubraceOptions.isDisabled==1) {
        document.getElementById('subraceChoice').setAttribute('disabled','');
    }
    else {
        document.getElementById('subraceChoice').removeAttribute('disabled','');
    }

    document.getElementById('subraceChoice').innerHTML = newSubraceOptions.Options;
    
    if(newSubraceOptions.hasSizeChoice==1) {
        document.getElementById('sizeChoice').removeAttribute('disabled','');
    }
    else {
        document.getElementById('sizeChoice').setAttribute('disabled','');
        document.getElementById('sizeChoice').value = newSubraceOptions.Size;
    }

    document.getElementById('sizeChoice').innerHTML = newSubraceOptions.SizeOptions;
}

async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('characterCreationTable').innerHTML = userdata;
}

async function submitSetupData() {
    let submitData = Object.fromEntries(new FormData(characterCreation));
    let request = fetch("macro:InitialSetupProcessing@lib:pm.a5e.Core", {method: "POST", body: JSON.stringify(submitData)});
    let result = await request.json();
}
setTimeout(loadUserData, 1);