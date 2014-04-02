// JavaScript Document
$("document").ready(function(){

	$(".remove-questionnaire").click(function(){
		$(".popup-center").removeClass("hide");
		var idQuestion = $(this).parent().parent().attr("id");
		$(".btn-confirm").attr("href", "/suppr/question/"+idQuestion);

	});

	$(".popup-close").click(function(){
		$(this).parent().parent().addClass("hide");
	});

	$(".btn-annule").click(function(){
		$(this).parent().parent().addClass("hide");
	});

});