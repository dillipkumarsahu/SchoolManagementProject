const {remote} = require('electron');
document.querySelector("#minimize").onclick = function(){
	remote.getCurrentWindow().minimize();
}