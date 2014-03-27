$("document").ready(function(){


	/* ===== GENERAL ===== */
	$(".popup-close").click(function(){
		$(this).parent().parent().hide();
	});

	$(".btn-annule").click(function(){
		$(this).parent().parent().hide();
	});



	/* ======= DELETE ====== */
	$("#pop-remove-confirm").hide();


	$(".remove-categorie").click(function(){
		$("#pop-remove-confirm").show();
		var idCategorie = $(this).parent().parent().attr("id");
		$(".btn-confirm").attr("href", "/suppr/categorie/"+idCategorie);

	});

	
	/* ======= ADD =========== */
	$("#pop-addCategorie").hide();

	$("#addCategorie").click(function(){
		$("#pop-addCategorie").show();
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
			$(".popup-center").hide();
			$("#pop-addCategorie").hide();
		}
	});

});