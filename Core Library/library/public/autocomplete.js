function autocomplete(input, list) {
    //Add an event listener to compare the input value with list
    input.addEventListener('input', function () {
        //Close the existing list if it is open
        closeList();

        //If the input is empty, exit the function
        if (!this.value)
            return;

        //Create a suggestions <div> and add it to the element containing the input field
        let suggestions = document.createElement('div');
        suggestions.setAttribute('id', 'suggestions');
        this.parentNode.appendChild(suggestions);

        //Iterate through all entries in the list and find matches
        for (let i=0; i<list.length; i++) {
            if (list[i].toUpperCase().includes(this.value.toUpperCase())) {
                //If a match is found, create a suggestion <div> and add it to the suggestions <div>
                let suggestion = document.createElement('div');
                suggestion.innerHTML = list[i];
                
                suggestion.addEventListener('click', function () {
                    input.value = this.innerHTML;
                    closeList();
                });
                suggestion.style.cursor = 'pointer';

                suggestions.appendChild(suggestion);
            }
        }

    });

    function closeList() {
        let suggestions = document.getElementById('suggestions');
        if (suggestions)
            suggestions.parentNode.removeChild(suggestions);
    }
}