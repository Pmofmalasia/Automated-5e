function sortInventory(criteria) {
    let table = document.getElementById("InventoryTable");
    let rows = Array.from(table.querySelectorAll("tr.inventory-list, tr.stored-item"));
    let isAscending = document.getElementById("currentSort").value === criteria + "_asc";

    // Disable drag-and-drop while sorted
    rows.forEach(row => row.setAttribute("draggable", "false"));

    function compareItems(a, b) {
        let aData = getItemData(idFromRowID(a.id));
        let bData = getItemData(idFromRowID(b.id));

        if (criteria === "name") {
            return aData.DisplayName.localeCompare(bData.DisplayName);
        } else if (criteria === "weight") {
            return (bData.Weight * bData.Number) - (aData.Weight * aData.Number);
        } else if (criteria === "number") {
            return bData.Number - aData.Number;
        }
    }

    function sortRows(rows, depth = 1) {
        let sortedRows = [];
        let containerMap = {};

        rows.forEach(row => {
            let rowData = getItemData(idFromRowID(row.id));
            let containerID = rowData.StoredIn;

            if (containerID) {
                if (!containerMap[containerID]) containerMap[containerID] = [];
                containerMap[containerID].push(row);
            } else {
                sortedRows.push(row);
            }
        });

        sortedRows.sort(compareItems);
        if (isAscending) sortedRows.reverse();

        sortedRows.forEach(row => {
            let rowData = getItemData(idFromRowID(row.id));
            let containerID = rowData.ItemID;

            if (containerMap[containerID]) {
                let nestedRows = sortRows(containerMap[containerID], depth + 1);
                sortedRows.splice(sortedRows.indexOf(row) + 1, 0, ...nestedRows);
            }
        });

        return sortedRows;
    }

    let sortedRows = sortRows(rows);

    // Clear and re-add sorted rows
    rows.forEach(row => row.remove());
    sortedRows.forEach(row => table.appendChild(row));

    // Update sort direction
    document.getElementById("currentSort").value = isAscending ? criteria + "_desc" : criteria + "_asc";
}

// Add event listeners to headers for sorting
document.getElementById("NameHeader").addEventListener("click", function () {
    sortInventory("name");
});
document.getElementById("WeightMainHeader").addEventListener("click", function () {
    sortInventory("weight");
});
document.getElementById("rowInventoryHeader").querySelector("th:nth-child(3)").addEventListener("click", function () {
    sortInventory("number");
});