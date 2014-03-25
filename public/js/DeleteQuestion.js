// JavaScript Document
$("document").ready(function(){

		$(".popup-center").hide();



		$(".remove-questionnaire").click(function(){
			$(".popup-center").show();
		});

		$(".popup-close").click(function(){
			$(this).parent().parent().hide();
		});

		$(".btn-annule").click(function(){
			$(this).parent().parent().hide();
		});

	});