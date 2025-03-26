function autocomplete(inp, arr, validation, options) {
	let currentFocus;
	if(options === undefined){
		options = {};
	}

	inp.addEventListener("input", function(e) {
		let val = this.value;

		closeAllLists();
		if (!val) { return false;}
		currentFocus = -1;

		let allSuggestions = document.createElement("DIV");
		allSuggestions.setAttribute("id", this.id + "autocomplete-list");
		allSuggestions.setAttribute("class", "autocomplete-items");

		this.parentNode.appendChild(allSuggestions);

		let almostCorrectArr = [];
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				let suggestion = document.createElement("DIV");
				suggestion.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
				suggestion.innerHTML += arr[i].substr(val.length);
				suggestion.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
				
				suggestion.addEventListener("click", function(e) {
					/*insert the value for the autocomplete text field:*/
					inp.value = this.getElementsByTagName("input")[0].value;

					closeAllLists();

					inp.dispatchEvent(new Event("change"));
				});
				allSuggestions.appendChild(suggestion);
			}
			else if(arr[i].toUpperCase().includes(val.toUpperCase())) {
				//tracks entries that match, but not at the start of the name
				almostCorrectArr.push(arr[i]);
			};
		}

		for(let entry of almostCorrectArr){
			let suggestion = document.createElement("DIV");
			let matchingIndex = entry.toUpperCase().indexOf(val.toUpperCase());
			suggestion.innerHTML = entry.substr(0, matchingIndex)
			suggestion.innerHTML += "<strong>" + entry.substr(matchingIndex, val.length) + "</strong>";
			suggestion.innerHTML += entry.substr(matchingIndex + val.length);
			suggestion.innerHTML += "<input type='hidden' value='" + entry + "'>";
			
			suggestion.addEventListener("click", function(e) {
				/*insert the value for the autocomplete text field:*/
				inp.value = this.getElementsByTagName("input")[0].value;

				closeAllLists();

				inp.dispatchEvent(new Event("change"));
			});
			allSuggestions.appendChild(suggestion);
		}
	});
	
	inp.addEventListener("keydown", function(e) {
		let currentItem = document.getElementById(this.id + "autocomplete-list");
		if (currentItem) currentItem = currentItem.getElementsByTagName("div");
		if (e.keyCode == 40) {
			//Arrow down
			currentFocus++;
			addActive(currentItem);
		} else if (e.keyCode == 38) {
			//Arrow up
			currentFocus--;
			addActive(currentItem);
		} else if (e.keyCode == 13) {
			//Enter key
			e.preventDefault();
			if (currentFocus > -1) {
				if (currentItem) currentItem[currentFocus].click();
			}
		}
	});

	function addActive(currentItem) {
		if (!currentItem) return false;

		removeActive(currentItem);
		if (currentFocus >= currentItem.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = (currentItem.length - 1);

		currentItem[currentFocus].classList.add("autocomplete-active");
	}

	function removeActive(currentItem) {
		for (let i = 0; i < currentItem.length; i++) {
			currentItem[i].classList.remove("autocomplete-active");
		}
	}

	function closeAllLists(elmnt) {
		let currentItem = document.getElementsByClassName("autocomplete-items");
		for (let i = 0; i < currentItem.length; i++) {
			if (elmnt != currentItem[i] && elmnt != inp) {
			currentItem[i].parentNode.removeChild(currentItem[i]);
			}
		}
	}

	document.addEventListener("click", function (e) {
		closeAllLists(e.target);
	});

	if(validation !== undefined){
		inp.addEventListener("change",function(){
			validateFeatureAutocomplete(inp.id,validation,options.validationPath);
		});
	}
}

function validateFeatureAutocomplete(inputID,featureList,validationPath){
	let currentInput = document.getElementById(inputID).value;
	if(currentInput == ""){
		document.getElementById("ValidationSpan"+inputID).innerHTML = "";
		return;
	}

	if(validationPath === undefined){
		validationPath = ["DisplayName"];
	}

	let featureOptions = [];
	for(let feature of featureList){
		let validationValue = feature;

		for(let key of validationPath){
			if(key === "@"){
				key = removeSpecialCharacters(currentInput);
			}
			validationValue = validationValue[key];
			
			if(validationValue === undefined){
				break;
			}
		}

		if(validationValue === currentInput){
			featureOptions.push(feature);
		}
	}

	if(featureOptions.length == 0){
		document.getElementById("ValidationSpan"+inputID).innerHTML = ": Feature not found!";
	}
	else if(featureOptions.length == 1){
		let matchingFeature = featureOptions[0];
		document.getElementById("ValidationSpan"+inputID).innerHTML = "<input type='hidden' id='"+inputID+"NameValidated' name='"+inputID+"NameValidated' value='"+matchingFeature["Name"]+"'><input type='hidden' id='"+inputID+"ClassValidated' name='"+inputID+"ClassValidated' value='"+matchingFeature["Class"]+"'><input type='hidden' id='"+inputID+"SubclassValidated' name='"+inputID+"SubclassValidated' value='"+matchingFeature["Subclass"]+"'>";
	}
	else{
		let featureOptionsSelect = "<option value='Any'>Any Class/Subclass</option>";

		let i = 0;
		for(let feature of featureOptions){
			featureOptionsSelect = featureOptionsSelect + "<option value="+i+">"+feature.Subclass+" "+feature["Class"]+"</option>";
		}

		document.getElementById("ValidationSpan"+inputID).innerHTML = ": <select id='"+inputID+"ClassChoice' name='"+inputID+"ClassChoice'>"+featureOptionsSelect+"</select><input type='hidden' id='"+inputID+"ClassOptions' name='"+inputID+"ClassOptions' value='"+btoa(featureOptions)+"'>";
	}
}