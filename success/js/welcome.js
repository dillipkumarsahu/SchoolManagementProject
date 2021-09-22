

//on off or log out switch
$(document).ready(function(){
	$("#on-off").click(function(){
		$(this).attr("src","../images/off.png");
		$(".p-wait").removeClass("d-none");
		$(".p-wait").addClass("animated slideInLeft");
		setTimeout(function(){
			window.location = "../";
			sessionStorage.removeItem('login');
		},2000);
	});
});
//add item
$(document).ready(function(){
	$(".add-field-btn").click(function(){
		var add_element = '<div class="input-group mb-1 mx-auto" style="width: 97%;"><input type="text" name="course-name" class="course-name form-control" placeholder="Ex- Hostel fee"><input type="number" name="course-fee" class="course-fee form-control" placeholder="Ex:- 500"><div class="input-group-append"><span class="input-group-text bg-warning">Monthly</span></div></div>';
		$(".add-field-area").append(add_element);
	});
	$(".reload").click(function(){
		window.location = location.href;
	});
});

//set fee
$(document).ready(function(){
	$(".set-fee-btn").click(function(){
		var class_name = $(".class-name").val();
		var i;
		var course_name = [];
		$(".course-name").each(function(i){
			course_name[i] = $(this).val(); 
		});
		var course_fee = [];
		$(".course-fee").each(function(i){
			course_fee[i] = $(this).val(); 
		});

		var fee_object = {
			class_name : class_name,
			course_name : course_name,
			course_fee : course_fee
		};

		//store data in database

		var db_name = sessionStorage.getItem("db_name");
		var database =  window.indexedDB.open(db_name);
		database.onsuccess = function(){
			if ($(".class-name").val() != "") 
			{
				var idb = this.result;
				var permission = idb.transaction("fee","readwrite");
				var access = permission.objectStore("fee");
				var fee_object_store = access.put(fee_object);
				fee_object_store.onsuccess = function(){
					alert("Fee successfully set");
					setTimeout(function(){window.location = location.href;},0);
				}
				fee_object_store.onerror = function(){
					alert("error");
				}
			}
			else{
				$(".class-name").val("Enter class name");
				$(".class-name").addClass("animated infinite pulse faster");
				$(".class-name").css({
					"border":"2px solid red",
					"color":"red",
				});
				setTimeout(function(){
					$(".class-name").val("");
					$(".class-name").removeClass("animated infinite pulse faster");
					$(".class-name").css({
						"border":"",
						"color":"",
					});
				},2000);
			}
		}
	});
});

//show fee
$(document).ready(function(){
	$("#fee-menu").click(function(){
		$("#show-fee").html("");
		var db_name = sessionStorage.getItem("db_name");
		var database = window.indexedDB.open(db_name);
		database.onsuccess = function(){
			var idb = this.result;
			var permission = idb.transaction("fee","readwrite");
			var access = permission.objectStore("fee");
			var get_all_keys = access.getAllKeys();
			get_all_keys.onsuccess = function(){
				var keys = this.result;
				var i,j,k;
				for (var i = 0; i < keys.length; i++) {
					var key_data = access.get(keys[i]);
					key_data.onsuccess = function(){
						var fee = this.result;
						var ul = document.createElement("UL");
						ul.className = "nav nav-tabs mt-4";
						var li = document.createElement("LI");
						li.className = "nav-item";
						var a = document.createElement("A");
						a.className = "nav-link active";
						a.href = "#";
						a.innerHTML = "Class - "+fee.class_name;
						li.append(a);
						ul.append(li);
						$("#show-fee").append(ul);
						var table = document.createElement("TABLE");
						table.className = "table border-left border-right border-bottom text-center";
						var tr_for_th = document.createElement("TR");
						var tr_for_td = document.createElement("TR");
						for (j = 0; j < fee.course_name.length; j++) {
							var th = document.createElement("TH");
							th.className = "border-0";
							th.innerHTML = fee.course_name[j];
							tr_for_th.append(th);
						}
						var th_edit = document.createElement("TH");
						th_edit.className = "border-0";
						th_edit.innerHTML = "Edit";
						tr_for_th.append(th_edit);

						var th_delete = document.createElement("TH");
						th_delete.className = "border-0";
						th_delete.innerHTML = "Delete";
						tr_for_th.append(th_delete);

						for (k = 0; k < fee.course_fee.length; k++) {
							var td = document.createElement("TD");
							td.className = "border-0";
							td.innerHTML = fee.course_fee[k];
							tr_for_td.append(td);
						}
						//edit fee coding
						var td_edit = document.createElement("TH");
						td_edit.className = "border-0";
						td_edit.innerHTML = "<i class='fa fa-edit'></i>";
						tr_for_td.append(td_edit);
						td_edit.onclick = function(){
							$(".add-field-area").html(" ");
							var ul = this.parentElement.parentElement.previousSibling;
							var a = ul.getElementsByTagName("A");
							var class_name = a[0].innerHTML.split(" ");
							$(".class-name").val(class_name[2]);
							var tr = table.getElementsByTagName("TR");
							var th = tr[0].getElementsByTagName("TH");
							var td = tr[1].getElementsByTagName("TD");
							var course_name = document.getElementsByClassName("course-name");
							var course_fee = document.getElementsByClassName("course-fee");
							for (var i = 0; i < th.length-2; i++) 
							{
								$(".add-field-btn").click();
								course_name[i].value = th[i].innerHTML;
								course_fee[i].value = td[i].innerHTML;
								$("#fee-list").modal('hide');
							}
							$(".set-fee").addClass("animated shake");
						}

						//delete fee coding
						var td_delete = document.createElement("TH");
						td_delete.className = "border-0";
						td_delete.innerHTML = "<i class='fa fa-trash'></i>";
						tr_for_td.append(td_delete);
						td_delete.onclick = function(){
							var ul = this.parentElement.parentElement.previousSibling;
							var a = ul.getElementsByTagName("A");
							var key_name_with_num = a[0].innerHTML;
							var key_name = key_name_with_num.split(" ");
							var db_name = sessionStorage.getItem("db_name");
							var database = window.indexedDB.open(db_name);
							database.onsuccess = function(){
								var idb = this.result;
								var permission = idb.transaction("fee","readwrite");
								var access = permission.objectStore("fee");
								var delete_notice = access.delete(key_name[2]);
								delete_notice.onsuccess = function(){
									alert("Delete successfully");
									td_delete.parentElement.parentElement.previousSibling.remove();
									td_delete.parentElement.parentElement.remove();
								}
							}
						}

						table.append(tr_for_th);
						table.append(tr_for_td);
						$("#show-fee").append(table);
					}
				}
			}
		}
	});
});


//retrive class name 
$(document).ready(function(){
	var db_name = sessionStorage.getItem("db_name");
	var database = window.indexedDB.open(db_name);
	database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("fee","readwrite");
		var access = permission.objectStore("fee");
		var key_name = access.getAllKeys();
		key_name.onsuccess = function(){
			var keys = this.result;
			var i;
			for (i = 0; i < keys.length; i++) 
			{
				var option = document.createElement("OPTION");
				option.innerHTML = keys[i];
				$(".class,.find-class").append(option);	
			}
		}
	}
});

//upload and preview images
$(document).ready(function(){
	$(".upload-pic").click(function(){
		var input = document.createElement("INPUT");
		input.type = "file";
		input.accept = "image/*";
		input.click();
		input.onchange = function(){
			var file = this.files[0];
			var url = URL.createObjectURL(file);
			$(".upload-pic").attr("src",url);
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(){
				sessionStorage.setItem("upload_pic",this.result);
			}
		}
	});
});

//admission data store
$(document).ready(function(){
	$(".admit-btn").click(function(){
			var a_no,i,max=0;
			var db_name = sessionStorage.getItem("db_name");
			var database = window.indexedDB.open(db_name);
			database.onsuccess = function(){
				var idb = this.result;
				var permission = idb.transaction("admission","readwrite");
				var access = permission.objectStore("admission");
				var key_name = access.getAllKeys();
				key_name.onsuccess = function(){
					var keys_array = this.result; 
					if (keys_array.length == 0) 
					{
						a_no = 1;
					}
					else{
						for (i = 0; i < keys_array.length; i++) 
						{
							var number = Number(keys_array[i]);
							if (number>max) 
							{
								max = number;
							}
						}
						a_no = max + 1;
					}
					var date = new Date($(".adm-date").val());
					var dob_day = date.getDate();
					var dob_month = date.getMonth()+1;
					var dob_year = date.getFullYear();
					var dob = dob_day+"/"+dob_month+"/"+dob_year
					var c_date = new Date();
					var doa_day = c_date.getDate();
					var doa_month = c_date.getMonth()+1;
					var doa_year = c_date.getFullYear();
					var doa = doa_day+"/"+doa_month+"/"+doa_year

					if (sessionStorage.getItem("upload_pic") != null) 
					{
						var admission = {
							adm_no : a_no,
							s_name : $(".s-name").val(),
							f_name : $(".f-name").val(),
							m_name : $(".m-name").val(),
							dob : dob,
							gender : $(".gender").val(),
							mobile_one : $(".mobile-one").val(),
							mobile_two : $(".mobile-two").val(),
							class : $(".class").val(),
							admit_in : $(".admit-in").val(),
							address : $(".address").val(),
							doa : doa,
							pic : sessionStorage.getItem("upload_pic"),
							invoice : []
						};
						sessionStorage.removeItem("upload_pic");
						var db_name = sessionStorage.getItem("db_name");
						var database = window.indexedDB.open(db_name);
						database.onsuccess = function(){
							var idb = this.result;
							var permission = idb.transaction("admission","readwrite");
							var access = permission.objectStore("admission");
							var check_admission = access.add(admission);
							check_admission.onsuccess = function(){
								$(".admit-notice").removeClass("d-none");
								$(".admit-notice").addClass("alert-success animated zoomIn faster");
								$(".admit-notice").append("<b>Admission successfully</b>");
								setTimeout(function(){$(".admit-notice").addClass("d-none");$(".admit-notice").html("");
									window.location = location.href;},2000);
								var json_data = JSON.stringify(admission);
								sessionStorage.setItem("adm_doc",json_data);
							}
						}
						$("#admission-form").trigger('reset');
					}
					else{
						$(".admit-notice").removeClass("d-none");
						$(".admit-notice").addClass("alert-danger animated infinite pulse faster");
						$(".admit-notice").append("Please upload the student pic");
						setTimeout(function(){$(".admit-notice").addClass("d-none");$(".admit-notice").html("");},2000);
					}
				}
			}
		return false;
	});
});

//school logo upload coding
$(document).ready(function(){
	$(".school-logo").on("mouseover",function(){
		$(this).addClass("animated pulse");
	});
	$(".school-logo").on("mouseout",function(){
		$(this).removeClass("animated pulse");
	});
	//school name and tagline display coding
	var db_name = sessionStorage.getItem("db_name");
	var database = window.indexedDB.open(db_name);
	database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("about_school","readwrite");
		var access = permission.objectStore("about_school");
		var json_data = access.get(db_name);
		json_data.onsuccess = function(){
			var user = this.result;
			$(".display-school-name").html(user.school_name);
			$(".display-school-name,.display-school-tagline").css({textTransform:"uppercase"});
			//tag line text animation coding
			setInterval(function(){
				$(".display-school-tagline").html("");
				tagline_text_animation();
			},10000);
			function tagline_text_animation(){
			var string = user.tag_line;
	        var i = 0;
	        if(i<string.length)
	            {
	                setInterval(function(){
	                    document.querySelector(".display-school-tagline").innerHTML += string.charAt(i);
	                    i++;
	                },200);
	            }
	        }
	        tagline_text_animation();
	         //end it
		}
	}

	//upload school logo coding
	if (localStorage.getItem("upload_logo") != null) 
	{
		var url = localStorage.getItem("upload_logo");
		$(".school-logo").css({
			"background-image":"url("+url+")",
			"background-size":"100% 100%"
		});
		$(".upload-school-logo").attr("src",url);
		$(".school-logo").html("");
	}
	$("#upload-logo-field").on("change",function(){
		var file = this.files[0];
		var url = URL.createObjectURL(file);
		$(".school-logo").css({
			"background-image":"url("+url+")",
			"background-size":"100% 100%"
		});
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(){
			localStorage.setItem("upload_logo",this.result);
		}
		$(".school-logo").html("");
	});
});

//admission number coding
function adm_no(){
	var max_no = 0;
	var db_name = sessionStorage.getItem("db_name");
	var database = window.indexedDB.open(db_name);
	database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("admission","readwrite");
		var access = permission.objectStore("admission");
		var check_data = access.getAllKeys();
		check_data.onsuccess = function(){
			var keys_array = this.result;
			for (var i = 0; i < keys_array.length; i++) {
				if(keys_array[i]>max_no)
				{
					max_no = keys_array[i];
				}
			}
			var a_no = max_no+1;
			sessionStorage.setItem("a_no",max_no);
			$(".ac-no").html("A/c - "+a_no);
		}
	}
}
adm_no();


//go to admission document print page
$(document).ready(function(){
	var adm_data = sessionStorage.getItem("adm_doc");
	if (adm_data != null) 
	{
		$(".print-notice").removeClass("d-none");
		$(".print-notice").addClass("alert-info text-center py-0 pr-2");
		$(".print-notice").append("<a href='admission_doc.html'>Now you can print your</a><i class='close fa fa-close ml-3 my-1' data-dismiss='alert'></i><br><a href='admission_doc.html'>admission document</a>");
	}
	else{
		$(".print-notice").addClass("d-none");
	}
});



//find admission slip
$(document).ready(function(){
	$(".find-btn").click(function(){
	var ac_no = $(".ac-no").html();
	var only_ac_no = ac_no.split(" ");
	var a_no = $(".find-admission-no").val();
		if (a_no != "")
		{
			if (a_no < Number(only_ac_no[2])) 
			{
				sessionStorage.setItem("a_no",a_no);
				window.location = "admission_doc.html";
			}
			else{
				alert("Admission number not found");
			}
		}
		else{
			$(".find-admission-no").addClass("animated infinite pulse faster");
			$(".find-admission-no").css({
				"border":"2px solid red",
			});
			setTimeout(function(){
				$(".find-admission-no").removeClass("animated infinite pulse faster");
				$(".find-admission-no").css({
					"border":"",
				});
			},2000);
		}		
	});
});


//show signature and logo
$(document).ready(function(){
	var db_name = sessionStorage.getItem("db_name");
	var database = window.indexedDB.open(db_name);
	database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("about_school","readwrite");
		var access = permission.objectStore("about_school");
		var check_data = access.get(db_name);
		check_data.onsuccess = function(){
			var data = this.result;
			//show director signature
			if (data.director_signature == "") 
			{
				$(".d-sign-input").removeClass("d-none");
			}
			else{
				$(".d-sign-con").removeClass("d-none");
				var signature = data.director_signature;
				var image = new Image();
				image.src = signature;
				image.width = "188";
				image.height = "50";
				$(".d-sign").html(image);
			}
			//show principal signature
			if (data.principal_signature == "") 
			{
				$(".p-sign-input").removeClass("d-none");

			}
			else{
				$(".p-sign-con").removeClass("d-none");
				var signature = data.principal_signature;
				var image = new Image();
				image.src = signature;
				image.width = "188";
				image.height = "50";
				$(".p-sign").html(image);
			}
		}
	}
});

//upload logo to data base
$(document).ready(function(){
	var school_logo = localStorage.getItem("upload_logo");
	var db_name = sessionStorage.getItem("db_name");
	var database = window.indexedDB.open(db_name);
	database.onsuccess = function(){
		var idb = this.result;
		var permission = idb.transaction("about_school","readwrite");
		var access = permission.objectStore("about_school");
		var check_data = access.get(db_name);
		check_data.onsuccess = function(){
			var data = this.result;
			data.school_logo = school_logo;
			var update = access.put(data);
		}
	}
}); 
//upload director signature
$(document).ready(function(){
	$("#director").on("change",function(){
		var file = this.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(){
			var signature = this.result;
			var db_name = sessionStorage.getItem("db_name");
			var database = window.indexedDB.open(db_name);
			database.onsuccess = function(){
				var idb = this.result;
				var permission = idb.transaction("about_school","readwrite");
				var access = permission.objectStore("about_school");
				var check_data = access.get(db_name);
				check_data.onsuccess = function(){
					var data = this.result;
					data.director_signature = signature;
					var update = access.put(data);
					update.onsuccess = function(){
						window.location = location.href;
					}
					update.onerror = function(){
						alert("Update failed");
					}
				}
			}
		}
	});
});

//upload principal signature
$(document).ready(function(){
	$("#principal").on("change",function(){
		var file = this.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(){
			var signature = this.result;
			var db_name = sessionStorage.getItem("db_name");
			var database = window.indexedDB.open(db_name);
			database.onsuccess = function(){
				var idb = this.result;
				var permission = idb.transaction("about_school","readwrite");
				var access = permission.objectStore("about_school");
				var check_data = access.get(db_name);
				check_data.onsuccess = function(){
					var data = this.result;
					data.principal_signature = signature;
					var update = access.put(data);
					update.onsuccess = function(){
						window.location = location.href;
					}
					update.onerror = function(){
						alert("Update failed");
					}
				}
			}
		}
	});
});

//delete signature coding 
$(document).ready(function(){
	//For director signature
	$(".d-sign-delete").click(function(){
		var check = confirm("Do you want delete Director signature ?");
		if (check == true) 
		{
			var db_name = sessionStorage.getItem("db_name");
			var database = window.indexedDB.open(db_name);
			database.onsuccess = function(){
				var idb = this.result;
				var permission = idb.transaction("about_school","readwrite");
				var access = permission.objectStore("about_school");
				var check_data = access.get(db_name);
				check_data.onsuccess = function(){
					var data = this.result;
					data.director_signature = "";
					var update = access.put(data);
					update.onsuccess = function(){
						window.location = location.href;
					}
					update.onerror = function(){
						alert("Update failed");
					}
				}
			}
		}
	});

	//For principal signature
	$(".p-sign-delete").click(function(){
		var check = confirm("Do you want delete the Principal signature ?");
		if (check == true) 
		{
			var db_name = sessionStorage.getItem("db_name");
			var database = window.indexedDB.open(db_name);
			database.onsuccess = function(){
				var idb = this.result;
				var permission = idb.transaction("about_school","readwrite");
				var access = permission.objectStore("about_school");
				var check_data = access.get(db_name);
				check_data.onsuccess = function(){
					var data = this.result;
					data.principal_signature = "";
					var update = access.put(data);
					update.onsuccess = function(){
						window.location = location.href;
					}
					update.onerror = function(){
						alert("Update failed");
					}
				}
			}
		}
	});
});

//invoice coding 
$(document).ready(function(){
	$(".invoice-btn").click(function(){
		var a_no = Number($(".admission-no").val());
		var invoice_date = $(".invoice-date").val();
		var db_name = sessionStorage.getItem("db_name");
		var database = window.indexedDB.open(db_name);
		database.onsuccess = function(){
			var idb = this.result;
			var permission = idb.transaction("admission","readwrite");
			var access = permission.objectStore("admission");
			var check_data = access.get(a_no);
			check_data.onsuccess = function(){
				var data = this.result;
				if(data)
				{
					var class_name = data.class;
					var fee_permission = idb.transaction("fee","readwrite");
					var fee_access = fee_permission.objectStore("fee");
					var check_fee_data = fee_access.get(class_name);
					check_fee_data.onsuccess = function(){
						var fee_data = this.result;
						if (fee_data) 
						{
							var invoice_no;
							if (data.invoice.length == 0) 
							{
								invoice_no = 1;
							}
							else{
								invoice_no = data.invoice.length+1;
							}
							var invoice_data = {
								invoice_no : invoice_no,
								invoice_date : invoice_date,
								course_name : fee_data.course_name,
								course_fee : fee_data.course_fee	
							}
							var update_permission = idb.transaction("admission","readwrite");
							var update_access = update_permission.objectStore("admission");
							var update_check_data = update_access.get(a_no);
							update_check_data.onsuccess = function(){
								var update_object = this.result;
								update_object.invoice.push(invoice_data);
								var update = update_access.put(update_object);
								update.onsuccess = function(){
									window.location = "invoice.html";
								}
								update.onerror = function(){
									alert("invoice failed");
								}
							}	
						}
						else{
							alert("Please set your fee");
						}
					}
				}
				else{
					alert("not found");
				}
			}
		}
	});
});

//find admission no for invoice
$(document).ready(function(){
	$(".invoice-btn").click(function(){
		var a_no = $(".admission-no").val();
		sessionStorage.setItem("a_no",a_no);
	});
});

//find student coding
$(document).ready(function(){
	$("#find-student").on("change",function(){
		sessionStorage.setItem("class_name",this.value);
		window.location = "student.html";
	});
});