/* ========================================
	Page Login
=========================================== */

$("document").ready(function(){
	$("#form-enseignant").hide();
	$("#form-etudiant").hide();

	$("#btn-login-etudiant").click(function(){
		$("#form-enseignant").hide();
		$("#form-etudiant").show("fast");
	});

	$("#btn-login-enseignant").click(function(){
		$("#form-etudiant").hide();
		$("#form-enseignant").show("fast");
	});
});


/* ========================================
	Panel question
=========================================== */

$("document").ready(function(){
	$("#btn-stat").hide();
	function timerzero(){
		timer = $("#timer span").text();
		if(timer == "0"){
			$("#timer").hide();
			$("#timer-msg").html("Terminé !");
			$("#btn-stat").show("slow");
			return false;
		}
		setTimeout(timerzero,1000);
	}
	 
	timerzero();
});