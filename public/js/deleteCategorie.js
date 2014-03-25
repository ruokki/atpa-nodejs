$("document").ready(function(){

	$(".popup-center").hide();

	$(".remove-categorie").click(function(){
		$(".popup-center").show();
		var idCategorie = $(this).parent().parent().attr("id");
		$(".btn-confirm").attr("href", "/suppr/categorie/"+idCategorie);

	});

	$(".popup-close").click(function(){
		$(this).parent().parent().hide();
	});

	$(".btn-annule").click(function(){
		$(this).parent().parent().hide();
	});

});