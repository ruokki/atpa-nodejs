// JavaScript Document
$("document").ready(function(){
	$(".remove-questionnaire").click(function(){
		$(".popup-center").removeClass("hide");
		var idSession = $(this).parent().parent().attr("id");
		$(".btn-confirm").attr("href", "/suppr/session/"+idSession);

	});

	$(".popup-close").click(function(){
		$(this).parent().parent().addClass("hide");
	});

	$(".btn-annule").click(function(){
		$(this).parent().parent().addClass("hide");
	});

});