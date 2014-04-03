$("document").ready(function(){


	/* ===== GENERAL ===== */
	$(".popup-close").click(function(){
		$(this).parent().parent().addClass("hide");
	});

	$(".btn-annule").click(function(){
		$(this).parent().parent().addClass("hide");
	});



	/* ======= DELETE ====== */
	
	$(".remove-categorie").click(function(){
		$("#pop-remove-confirm").removeClass("hide");
		var idCategorie = $(this).parent().parent().attr("id");
		$(".btn-confirm").attr("href", "/suppr/categorie/"+idCategorie);

	});

	
	/* ======= ADD =========== */
	$("#addCategorie").click(function(){
		$("#pop-addCategorie").removeClass("hide");
	});	

	$("#btn-addCategorie").click(function(){
		var msg = "";
		var lblcategorie = $("#lblcategorie").val();
		if(lblcategorie == ""){
			msg = "Veuillez saisir un label";
			$("#msgaddConfirm").text(msg);
			return false;
		}
		else{
			$(".popup-center").addClass("hide");
			$("#pop-addCategorie").addClass("hide");
		}
	});

});