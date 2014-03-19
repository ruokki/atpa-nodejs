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