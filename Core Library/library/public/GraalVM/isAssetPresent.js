function isAssetPresent(asset){
	let request = new XMLHttpRequest();
	request.open('GET', asset, false);
	request.send(null);

	if (request.status === 200) {
		return 1;
	}
	else{
		return 0;
	}
}

function assetsPresent(assetList){
	let foundAssets = [];
	for(let asset of assetList){
		let request = new XMLHttpRequest();
		request.open('GET', asset, false);
		request.send(null);

		if (request.status === 200) {
			foundAssets.push(asset);
		}	
	}
	return foundAssets;
}

MTScript.registerMacro("a5e.isAssetPresent",isAssetPresent);
MTScript.registerMacro("a5e.assetsPresent",assetsPresent);