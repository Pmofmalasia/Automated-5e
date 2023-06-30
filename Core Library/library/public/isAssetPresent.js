let request = new XMLHttpRequest();
request.open('GET', arg[0], false);
request.send(null);

if (request.status === 200) {
	console.log("Yay");
	return 1;
}
else{
	console.log("HI");
	return 0;
}