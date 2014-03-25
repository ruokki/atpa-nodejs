// JavaScript Document
$("document").ready(function(){

	$(".popup-center").hide();

	$(".remove-questionnaire").click(function(){
		$(".popup-center").show();
		var idQuestion = $(".remove-questionnaire").parent().parent().attr("id");
		$(".btn-confirm").attr("href", "/suppr/question/"+idQuestion);

	});

	$(".popup-close").click(function(){
		$(this).parent().parent().hide();
	});

	$(".btn-annule").click(function(){
		$(this).parent().parent().hide();
	});

});