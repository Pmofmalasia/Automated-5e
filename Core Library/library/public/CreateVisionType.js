async function loadUserData() {
    let userdata = atob(await MapTool.getUserData());
    document.getElementById('CreateVisionTypeTable').innerHTML = userdata;
}

setTimeout(loadUserData, 1);