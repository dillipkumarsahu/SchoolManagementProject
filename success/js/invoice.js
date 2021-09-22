
		

//invoice print & back coding
$(document).ready(function(){
	$(".print").click(function(){
		$(this).addClass("d-none");
		$("#back_arrow").addClass("d-none");
		print();
		window.location = location.href;
	});
	$("#back_arrow").click(function(){
		window.location = "welcome.html";
	});
});


//data display coding
$(document).ready(function(){
	var total = 0;
	$(".student-name,.student-father,#school-name,#tag-line,#school-address").css({textTransform:"uppercase"});
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
			var d_signature = user.director_signature;
				var image = new Image();
				image.src = d_signature;
				image.width = "188";
				image.height = "50";
				$(".director-signature").html(image);
			var p_signature = user.principal_signature;
				var image = new Image();
				image.src = p_signature;
				image.width = "188";
				image.height = "50";
				$(".principal-signature").html(image);
		}

		var s_permission = idb.transaction("admission","readwrite");
		var s_access = s_permission.objectStore("admission");
		var s_json_data = s_access.get(Number(a_no));
		s_json_data.onsuccess = function(){
			var data = this.result;
			$(".student-name").html(data.s_name);
			$(".student-father").html(data.f_name);
			$(".class-name").html(data.class);
			var invoice_data = data.invoice;
			for (var i = 0; i < invoice_data.length; i++) 
			{
				$(".invoice-no").html(invoice_data[i].invoice_no);
				$(".invoice-date").html(invoice_data[i].invoice_date);
			}
			var i_no = invoice_data.length-1;
			for (var i = 0; i < invoice_data[i_no].course_name.length; i++) {
				document.querySelector(".i-course-name").innerHTML += invoice_data[i_no].course_name[i]+"<br>";
				document.querySelector(".i-course-fee").innerHTML += invoice_data[i_no].course_fee[i]+"<br>";
				var fee = Number(invoice_data[i_no].course_fee[i]);
				total = total+fee;
			}
			$(".total-fee").html(total);
		}
	}
	//show school logo
	var url = localStorage.getItem("upload_logo");
	$(".upload-school-logo").attr("src",url);
});



