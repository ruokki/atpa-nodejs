// JavaScript Document
$("document").ready(function(){

	$(".popup-center").hide();

	$(".remove-questionnaire").click(function(){
		$(".popup-center").show();
		var idSession = $(this).parent().parent().attr("id");
		$(".btn-confirm").attr("href", "/suppr/session/"+idSession);

	});

	$(".popup-close").click(function(){
		$(this).parent().parent().hide();
	});

	$(".btn-annule").click(function(){
		$(this).parent().parent().hide();
	});

});