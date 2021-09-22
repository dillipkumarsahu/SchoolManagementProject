
$(document).ready(function(){
	var session_class = sessionStorage.getItem("class_name");
	var db_name = sessionStorage.getItem("db_name");
	var database = window.indexedDB.open(db_name);
	database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("admission","readwrite");
		var access = permission.objectStore("admission");
		var key_name = access.getAllKeys();
		key_name.onsuccess = function(){
			var keys_array = this.result;
			for (var i = 0; i < keys_array.length; i++) 
			{
				var check_data = access.get(keys_array[i]);
				check_data.onsuccess = function(){
					var data = this.result;
					if (session_class == data.class) 
					{
						var tr = document.createElement("TR");

						var pic_td = document.createElement("TD");
						var image = new Image();
						image.src = data.pic;
						image.width = "80";
						image.height = "80";
						pic_td.append(image);

						var sname_td = document.createElement("TD");
						sname_td.innerHTML = data.s_name;
						sname_td.style.verticalAlign = "middle";

						var fname_td = document.createElement("TD");
						fname_td.innerHTML = data.f_name;
						fname_td.style.verticalAlign = "middle";

						var mname_td = document.createElement("TD");
						mname_td.innerHTML = data.m_name;
						mname_td.style.verticalAlign = "middle";

						var dob_td = document.createElement("TD");
						dob_td.innerHTML = data.dob;
						dob_td.style.verticalAlign = "middle";

						var doa_td = document.createElement("TD");
						doa_td.innerHTML = data.doa;
						doa_td.style.verticalAlign = "middle";

						var mob_td = document.createElement("TD");
						mob_td.innerHTML = data.mobile_one+"<br>"+data.mobile_two;
						mob_td.style.verticalAlign = "middle";

						var address_td = document.createElement("TD");
						address_td.innerHTML = data.address;
						address_td.style.verticalAlign = "middle";

						tr.append(pic_td);
						tr.append(sname_td);
						tr.append(fname_td);
						tr.append(mname_td);
						tr.append(dob_td);
						tr.append(doa_td);
						tr.append(mob_td);
						tr.append(address_td);
						$(".student-table").append(tr);
					}
				}
			}
		}
	}
});