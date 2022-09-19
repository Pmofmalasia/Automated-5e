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
        document.getElementById('sizeChoice').innerHTML = newSubraceOptions.SizeOptions;
        document.getElementById('sizeChoice').style.display = "inline";
    }
    else {
        document.getElementById('sizeChoice').innerHTML = "";
        document.getElementById('sizeChoice').style.display = "hidden";
        document.getElementById('sizeChoice').value = newSubraceOptions.Size;
    }

}

async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('characterCreationTable').innerHTML = userdata;
}
setTimeout(loadUserData, 1);