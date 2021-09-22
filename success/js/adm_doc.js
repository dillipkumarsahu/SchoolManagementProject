
		

//print coding
$(document).ready(function(){
	$(".print").click(function(){
		$(this).addClass("d-none");
		$(".remove-w").removeClass("w-60");
		$(".remove-w").addClass("w-95");
		$("#back_arrow").addClass("d-none");
		print();
		sessionStorage.removeItem("adm_doc");
		window.location = location.href;
	});
	$("#back_arrow").click(function(){
		window.location = "welcome.html";
	});
});


//data display coding
$(document).ready(function(){
	$(".student-name,.student-father,.student-mother,.student-address,.gender,.admit-in,#school-name,#tag-line,#school-address").css({textTransform:"uppercase"});
	//show school data coding
	var db_name = sessionStorage.getItem("db_name");
	var a_no = sessionStorage.getItem("a_no");
	var database = window.indexedDB.open(db_name);
	database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("about_school","readwrite");
		var access = permission.objectStore("about_school");
		var json_data = access.get(db_name);
		json_data.onsuccess = function(){
			var user = this.result;
			$("#school-name").html(user.school_name);
			$("#tag-line").html(user.tag_line);
			$("#school-no").html("+91 "+user.mobile+" , +91 "+user.phone);
			$("#school-address").html("VENU : "+user.address);
		}

		var s_permission = idb.transaction("admission","readwrite");
		var s_access = s_permission.objectStore("admission");
		var s_json_data = s_access.get(Number(a_no));
		s_json_data.onsuccess = function(){
			var data = this.result;
			$(".student-name").html(data.s_name);
			$(".student-father").html(data.f_name);
			$(".student-mother").html(data.m_name);
			$(".student-address").html(data.address);
			$(".dob").html(data.dob);
			$(".doa").html(data.doa);
			$(".gender").html(data.gender);
			$(".admit-in").html(data.admit_in);
			$(".mobile-1").html(data.mobile_one);
			$(".mobile-2").html(data.mobile_two);
			$("#student-pic").attr("src",data.pic);
		}
	}
	//show school logo
	var url = localStorage.getItem("upload_logo");
	$(".upload-school-logo").attr("src",url);
});



