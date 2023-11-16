function compareItemOrder(dragItem, dropItem) {
	if (dragItem.parentElement !== dropItem.parentElement){
		return null;
	}
	if (dragItem === dropItem){
		return 0;
	}

	if (dragItem.compareDocumentPosition(dropItem) & Node.DOCUMENT_POSITION_FOLLOWING){
		return -1;
	}
	return 1;
}

function addDragEventListeners(dragItem, dropItem) {
	let initialPosition = dragItem.rowIndex;
	dragItem.addEventListener("dragstart", () => {
		dropItem.element = dragItem;
		// Add the CSS style to clarify that the `dragItem` is being dragged.
		dragItem.classList.add(DRAGGING_CLASSNAME);
	});

	dragItem.addEventListener("dragover", () => {
	const order = compareItemOrder(dragItem, dropItem.element);

	// If the `dragItem` and `dropItem.element` are not siblings with each
	// other, do nothing.
	if (!order) return;

	// Move `dropItem.element` to just before `dragItem`.
	const baseElement = order === -1 ? dragItem : dragItem.nextSibling;
	dropItem.parent.insertBefore(dropItem.element, baseElement);
	});

	// https://developer.mozilla.org/en-US/docs/Web/API/Document/dragend_event
	dragItem.addEventListener("dragend", () => {
		// Remove the CSS style as the drag action ended.
		dragItem.classList.remove(DRAGGING_CLASSNAME);
	});
}

async function loadUserData() {
	let userdata = atob(await MapTool.getUserData());
	document.getElementById('InventoryTable').innerHTML = userdata;
}

setTimeout(loadUserData, 1);