$(document).ready(iniciar);
numVerso = 1;
numVisor = 0;
numVisoresAbiertos = 0;
maxVisoresAbiertos = 3;
var analisisIntervenciones;
var numAnalisisIntervenciones = 1;
var numJornadas;
var versionesMostradas = [];
var indiceSiguienteVersion = 0;
var cacheDiferencia;
var pgwSlideshow;

//var versiones; Está generada directamente por el XML.

function iniciar(){
	cargarVersiones();
	crearBotonesAnalisis();
	numJornadas = contarJornadas();
	$('#btnBuscar').click(irABuscar);
	$('#btnAnalisis').click(irAAnalisis);
	$('#iconoBuscar').click(buscar);
	$('#iconoBorrar').click(borrarResultadosBusqueda);
	$('#iconoResultadosCerrar').click(cerrarResultados);
	$('#iconoAnalisisCerrar').click(cerrarAnalisis);
	$('#iconoImagenesCerrar').click(cerrarImagenes);
	$('#btnAnadir').click(anadirVisor);

	$('.nota.imagen').click(mostrarImagenes);
	$('.btnAnalisisVersion').click(pulsarBtnAnalisisVersion);
	numerarVersos();
	quitarPersonajesVacios();
	reescribirDiferencias();

	
	$("#textoBuscar").keypress(function(e){
		 if(e.keyCode == 13) 
			 buscar();
	});
	
	//Cargamos la primera versión
	anadirVisor();
	
	//Hacemos el análisis de intervenciones
	analisisIntervenciones = analizarIntervenciones();
	crearBotonesVersion();

	$('.carrusel-prev').click(pulsarCarruselPrev);
	$('.carrusel-next').click(pulsarCarruselNext);
}

function reescribirDiferencias(){
	//Reescribimos la tooltip
	$("div.version .diferencia.tooltip").each(function (){
				
		var diffs = $(this).attr('title').split('##');
		
		var titulo = "";

		//Creamos un mapa de versiones
		var mapaVersiones = new Map();
		for(let i=0; i < diffs.length - 1; i++){	//Ignoramos los últimos ##
			var trozos = diffs[i].split('#');
			mapaVersiones.set(trozos[0].trim(), diffs[i]);
		}
		
		for (let [ clave, valor ] of mapaVersiones.entries()) {
			var nombre = valor.split('#')[1];
			var texto = valor.split('#')[2];
			
			//Regla1: Si la diferencia es de Suelta o Desglosada, se muestra siempre.
			if (clave.trim() == 's' || clave.trim() == 'd'){
				if (texto.trim() == '')
					texto = '&empty;';
				titulo += "<p><strong>" + nombre + "</strong>" + texto + "</p>";
			}
			else{
				//Regla4: Si es de nrg, no se muestra
				mostrar = true;
				if (clave == 'nrg')
					mostrar = false;
				
				//Regla3: Si la diferencia no es de Suelta ni de Desglosada (ni de nrg), y es igual que la de Suelta o Desglosada, no se muestra
				if (mapaVersiones.has('s')){
					if (texto == mapaVersiones.get('s').split('#')[2])
						mostrar = false;
				}
				if (mapaVersiones.has('d')){
					if (texto == mapaVersiones.get('d').split('#')[2])
						mostrar = false;
				}
				//Si no son s ni d y son iguales a f
				if (clave != 'f')
					if (mapaVersiones.has('f'))
						if (texto == mapaVersiones.get('f').split('#')[2])
							mostrar = false;
						
				//Si s o d están vacías, mostrar (vacío). Usar "conjunto vacío"
				if (mostrar)
					titulo += "<p><strong>" + nombre + "</strong>" + texto + "</p>";
			}
		}
		

		if (titulo == ''){
			$(this).remove();
		}
		else
			$(this).attr('title', titulo);		
	});
}

function pulsarCarruselPrev(evt){
	var actual = $('img.actual').first();
	if ($(actual).prev()[0] == undefined){
		$(actual).siblings().filter("img").last().addClass('actual');
	}
	else{
		$(actual).prev().addClass('actual');
	}
	$(actual).removeClass('actual');
	
	//Vamos con la descripcion
	actual = $('span.actual').first();
	if ($(actual).prev()[0] == undefined){
		$(actual).siblings().filter("span").last().addClass('actual');
	}
	else{
			$(actual).siblings("span.carrusel_desc").last().addClass('actual');
	}
	$(actual).removeClass('actual');
	var descripcion = $("span.carrusel_desc.actual").first();
	$("#carrusel_desc").html(descripcion.html());
}

function pulsarCarruselNext(evt){
	var actual = $('img.actual').first();
	if ($(actual).next()[0] == undefined){
		$(actual).siblings().first().addClass('actual');
	}
	else{
		$(actual).next().addClass('actual');
	}
	$(actual).removeClass('actual');
	
	//Vamos con la descripcion
	actual = $('span.actual').first();
	if ($(actual).next()[0].tagName == "SPAN"){
		//Ponemos el siguiente
		$(actual).next().addClass('actual');
	}
	else{
		$(actual).siblings("span.carrusel_desc").first().addClass('actual');
	}
	$(actual).removeClass('actual');
	var descripcion = $("span.carrusel_desc.actual").first();
	$("#carrusel_desc").html(descripcion.html());
}

function cargarVersiones(){
	//Lee las versiones del HTML
	var json = $("#datosVersiones").html();
	versiones = JSON.parse( json ).versiones;
	versiones.splice(versiones.length - 1, 1);
}

function crearBotonesAnalisis(){                     
	var p = document.createElement("p");	

	$(p).attr("id", "pBotonesAnalisis");
	$('#divAnalisis').append(p);
	var primero = true;
	for (var i = 0; i < versiones.length; i++){
		var a = document.createElement("a");
		$(a).attr("id", "btnAnalisis_" + versiones[i].id);
		$(a).addClass("menu-red");
		if (primero){
			$(a).addClass("buttonDown");
			primero = false;
		}
		else
			$(a).addClass("buttonUp");
		$(a).addClass("btnAnalisisVersion");
		$(a).append(document.createTextNode(versiones[i].nombre));
		$(p).append(a);
	}
}

function anadirVisor(){
	if (numVisoresAbiertos >= maxVisoresAbiertos)
		return;
	section = document.createElement("section");
	section.className = "visor";
	section.id = "sec-visor-" + numVisor;
	$('#btnAnadir').before(section);
	section.appendChild(crearSelect(numVisor));
	cargarSiguienteVersion(numVisor);
	//Recalcular anchura de visores section.visor
	numVisor++;
	numVisoresAbiertos++;
	calcularAnchoVisores();
	ajustarHTML(numVisoresAbiertos -1);
	if (numVisoresAbiertos == maxVisoresAbiertos)
		$('#btnAnadir').hide();
}

function ajustarHTML(antes){
	$("p.medio_" + antes).removeClass("medio_" + antes).addClass("medio_" + numVisoresAbiertos);
	$("p.final_" + antes).removeClass("final_" + antes).addClass("final_" + numVisoresAbiertos);
	$("p.numVerso_" + antes).removeClass("numVerso_" + antes).addClass("numVerso_" + numVisoresAbiertos);
	$("p.verso_" + antes).removeClass("verso_" + antes).addClass("verso_" + numVisoresAbiertos);
	$(".stage_" + antes).removeClass("stage_" + antes).addClass("stage_" + numVisoresAbiertos);
	$(".prosa_" + antes).removeClass("prosa_" + antes).addClass("prosa_" + numVisoresAbiertos);
	$(".speaker_" + antes).removeClass("speaker_" + antes).addClass("speaker_" + numVisoresAbiertos);
}

function calcularAnchoVisores(){
	anchoVisor = 95 / numVisoresAbiertos;
	$('section.visor').width(anchoVisor+"%");
}

function crearSelect(nVisor){
	div = document.createElement("div");
	
	select = document.createElement("select");
	select.id = "select-" + nVisor;
	option1 = document.createElement("option");
	option1.appendChild(document.createTextNode("Seleccione Version:"));
	select.appendChild(option1);
	div.appendChild(select);
	
	//Añadimos una opción por cada versión
	for(i=0; i< versiones.length; i++){
		option = document.createElement("option");
		option.value = versiones[i].id;
		option.appendChild(document.createTextNode(versiones[i].nombre));
		select.appendChild(option);
	}
	
	selectJornada = document.createElement("select");
	selectJornada.id = "selectJornada-" + nVisor;
	div.appendChild(selectJornada);
	
	//Añadimos una opción por cada versión
	for(i=0; i< numJornadas; i++){
		var option = document.createElement("option");
		option.value = i+1;
		option.appendChild(document.createTextNode("Jornada " + (i+1)));
		selectJornada.appendChild(option);
	}
	
	//Creamos un span para los botones de la versión nrg 
	spanBotonesNRG = document.createElement("span");
	spanBotonesNRG.className="botonesNRG";
	div.appendChild(spanBotonesNRG);
	
	btnCerrar = document.createElement("button");
	btnCerrar.id = "btnCerrar-" + nVisor;
	btnCerrar.className="fa fa-close btnCerrar";
	$(btnCerrar).click({id: nVisor}, cerrarVisor);
	div.appendChild(btnCerrar);
	
	$(select).change(cambiarVersionEnVisor);
	$(selectJornada).change(cambiarJornadaEnVisor);
	
	
	return div;
}

function cargarSiguienteVersion(nVisor){
	cargarVersion(nVisor, versiones[indiceSiguienteVersion].id);
	indiceSiguienteVersion++;
	if (indiceSiguienteVersion >= versiones.length)
		indiceSiguienteVersion = 0;
}

function cargarVersion(nVisor, idVersion){
	clon = $('#version-'+idVersion).clone()
	$(clon).attr("id","div-visor-"+nVisor);
	$(clon).removeClass("version");
	$(clon).addClass("visor");
	$("#sec-visor-"+nVisor+" .visor").remove(); //Quitamos los nodos de clase visor que estén dento del sec-visor
	$("#sec-visor-"+nVisor+" .navNRG").remove();	//Quitamos los botones.
	
	//Añadimos la versión a la clase para poder identificarla después
	//$(clon).addClass(idVersion);
	//console.log("Añadiendo clase " + idVersion);//Quitar notas
	try{	//Por si tooltipster no está inicializado
		$('.notaActiva').tooltipster('destroy');
	}catch{}
	$(".notaActiva").removeClass("notaActiva");
	
	//Si la versión es nrg, poner botones
	if (idVersion == 'nrg'){	//Mostramos los botones
		$("#sec-visor-"+nVisor+" .botonesNRG").append($('<div class="botonesNRG"><a class="btnDiferencias menu-red buttonUp" title="Diferencias textuales"><i class="fa fa-file-text"></i></a><a class="btnNotas menu-red buttonUp" id="notas" title="Notas explicativas"><i class="fa fa-comment"></i></a><a id="critica" class="btnCritica menu-red buttonUp" title="Notas textuales"><i class="fa fa-commenting-o"></i></a><a class="btnVocabulario menu-red buttonUp" title="Vocabulario"><i class="fa fa-question-circle"></i></a><a class="btnImg menu-red buttonUp" title="Imágenes"><i class="fa fa-camera-retro"></i></a><a id="video" class="btnVideos menu-red buttonUp" title="Vídeos"><i class="fa fa-video-camera"></i></a></div>'));
		//Activa botón de toggle
		$('.btnDiferencias').click(pulsarDiferencias);
		$('.btnNotas').click(pulsarNotas);
		$('.btnVocabulario').click(pulsarVocabulario);
		$('.btnImg').click(pulsarImagen);
		$('.btnVideos').click(pulsarVideos);
		$('.btnCritica').click(pulsarCritica);		
	}
	else{
		//Quitamos los botones
		$("#sec-visor-"+nVisor+" .botonesNRG").empty();
	}
	
	$("#sec-visor-"+nVisor).append(clon);
	clon.show();
	
	//Poner en el select la versión mostrada
	$('#select-'+nVisor).val(idVersion);
	
	//Activamos el evento de Speakers
	//$("#sec-visor-"+nVisor+' .speaker').click(pulsarSpeaker);
	if ($("div.visor").length > 1){
		$('div.visor .speaker').click(pulsarSpeaker).addClass('activo')
	}
	else{
		$('div.visor .speaker').click().removeClass('activo');
	}
	
	
	//Activamos los eventos de imágenes
	$("#sec-visor-"+nVisor+ ' .nota.imagen').click(mostrarImagenes);
	//Activamos los eventos de vídeos
	$("#sec-visor-"+nVisor+ ' .nota.video').click(mostrarVideo);
}

function cerrarVisor(event){
	if (numVisoresAbiertos <= 1)
		return;
	id = "#sec-visor-" + event.data.id;
	$(id).remove();
	numVisoresAbiertos--;
	calcularAnchoVisores();
	if (numVisoresAbiertos < maxVisoresAbiertos)
		$('#btnAnadir').show();
	ajustarHTML(numVisoresAbiertos+1);
	if ($("div.visor").length == 1){
		//$('.speaker').click().removeClass('activo')	
		document.querySelectorAll('.speaker').forEach(nodo => nodo.classList.remove('activo'));
	}
}

function cambiarVersionEnVisor(event){
	id = $(event.target).attr("id");
	nVisor = id.substring(7,id.length);
	idVersion = $(event.target).val();
	cargarVersion(nVisor, idVersion);
}

function cambiarJornadaEnVisor(event){
	var id = $(event.target).attr("id");
	var numVisor = id.substring(id.indexOf("-")+1, id.length);
	var divVisor = $("#div-visor-" + numVisor);

	var numJornada = $(event.target).val();
	numJornada--;	//restamos 1 porque empieza en cero

	var divJornada = $("#div-visor-" + numVisor + " div.jornada")[numJornada];
	
	$(divVisor).scrollTop(0);
	$(divVisor).scrollTop($(divJornada).position().top - 20);
	

	
}


function pulsarAnalisisVersion(event){
	boton = event.target;
	if ($(boton).hasClass("buttonUp")){
		$(boton).addClass("buttonDown");
		$(boton).removeClass("buttonUp");
		$(".diferencia").addClass("diferenciaActiva");
	}
	else{
		$(boton).addClass("buttonUp");
		$(boton).removeClass("buttonDown");
		$(".diferencia").removeClass("diferenciaActiva");
	}
}

function pulsarDiferencias(event){

	if (event.target.tagName == 'I')
		boton = event.target.parentNode;
	else
		boton = event.target;
	if ($(boton).hasClass("buttonUp")){
		$(boton).addClass("buttonDown");
		$(boton).removeClass("buttonUp");

		$(".visor .diferencia").addClass("diferenciaActiva").parent().show().prev().show().prev().show();
		$(".visor .diferencia.tooltip").show().tooltipster({
			theme: 'tooltipster-shadow',
			contentAsHTML: true
		});
	}
	else{
		$(boton).addClass("buttonUp");
		$(boton).removeClass("buttonDown");
		$(".visor .diferencia").removeClass("diferenciaActiva");
		$(".visor .diferencia.tooltip").hide();
		$('.visor .diferencia.tooltip').tooltipster('destroy');
	}
}

function pulsarNotas(event){
	if (event.target.tagName == 'I')
		boton = event.target.parentNode;
	else
		boton = event.target;
	
	if ($(boton).hasClass("buttonUp")){
		$(boton).addClass("buttonDown");
		$(boton).removeClass("buttonUp");
		$(".nota.comentario").addClass("notaActiva");
		$('.nota.comentario').tooltipster({
			theme: 'tooltipster-shadow',
			contentAsHTML: true
		});
	}
	else{
		$(boton).addClass("buttonUp");
		$(boton).removeClass("buttonDown");
		$(".nota.comentario").removeClass("notaActiva");
		$('.nota.comentario').tooltipster('destroy');
	}
}

function pulsarVideos(event){
	if (event.target.tagName == 'I')
		boton = event.target.parentNode;
	else
		boton = event.target;
	
	if ($(boton).hasClass("buttonUp")){
		$(boton).addClass("buttonDown");
		$(boton).removeClass("buttonUp");
		$(".nota.video").addClass("notaActiva");
		$('.nota.video').tooltipster({
			theme: 'tooltipster-shadow',
			contentAsHTML: true
		});
	}
	else{
		$(boton).addClass("buttonUp");
		$(boton).removeClass("buttonDown");
		$(".nota.video").removeClass("notaActiva");
		$('.nota.video').tooltipster('destroy');
	}
}

function pulsarVocabulario(event){
	if (event.target.tagName == 'I')
		boton = event.target.parentNode;
	else
		boton = event.target;
	
	if ($(boton).hasClass("buttonUp")){
		$(boton).addClass("buttonDown");
		$(boton).removeClass("buttonUp");
		$(".nota.vocabulario").addClass("notaActiva");
		$('.nota.vocabulario').tooltipster({
			theme: 'tooltipster-shadow',
			contentAsHTML: true
		});
	}
	else{
		$(boton).addClass("buttonUp");
		$(boton).removeClass("buttonDown");
		$(".nota.vocabulario").removeClass("notaActiva");
		$('.nota.vocabulario').tooltipster('destroy');
	}
}

function pulsarCritica(event){
	if (event.target.tagName == 'I')
		boton = event.target.parentNode;
	else
		boton = event.target;
	
	if ($(boton).hasClass("buttonUp")){
		$(boton).addClass("buttonDown");
		$(boton).removeClass("buttonUp");
		$(".nota.critica").addClass("notaActiva");
		$('.nota.critica').tooltipster({
			theme: 'tooltipster-shadow',
			contentAsHTML: true
		});
	}
	else{
		$(boton).addClass("buttonUp");
		$(boton).removeClass("buttonDown");
		$(".nota.critica").removeClass("notaActiva");
		$('.nota.critica').tooltipster('destroy');
	}
}


function pulsarImagen(event){
	if (event.target.tagName == 'I')
		boton = event.target.parentNode;
	else
		boton = event.target;
	
	if ($(boton).hasClass("buttonUp")){
		$(boton).addClass("buttonDown");
		$(boton).removeClass("buttonUp");
		$(".nota.imagen").addClass("notaActiva");
	}
	else{
		console.log("->buttonUp");
		$(boton).addClass("buttonUp");
		$(boton).removeClass("buttonDown");
		$(".nota.imagen").removeClass("notaActiva");
	}
}

function pulsarBtnAnalisisVersion(event){
	boton = event.target;
	if ($(boton).hasClass("buttonUp")){
		$(boton).addClass("buttonDown");
		$(boton).removeClass("buttonUp");
		numAnalisisIntervenciones++;
	}
	else{
		$(boton).addClass("buttonUp");
		$(boton).removeClass("buttonDown");
		numAnalisisIntervenciones--;
	}
	crearGrafico();
}

function crearBotonesVersion(){
	var p = document.createElement('p');
	for (var i = 0; i < numJornadas; i++){
		var rb = document.createElement('input');
		rb.setAttribute("type", "radio");
		rb.setAttribute("name", "jornada");
		rb.setAttribute('id', 'btnJornada_' + (i+1));

		$(rb).addClass('btnAnalisisJornada');
		p.appendChild(rb);
		p.appendChild(document.createTextNode("Jornada " + (i+1)));
	}
	var rb = document.createElement('input');
	rb.setAttribute("type", "radio");
	rb.setAttribute("name", "jornada");
	rb.setAttribute("checked", "true");
	rb.setAttribute('id', 'btnJornada_0');
	$(rb).addClass('btnAnalisisJornada');
	p.appendChild(rb);
	p.appendChild(document.createTextNode("Todas"));
	
		
	document.getElementById('divAnalisis').appendChild(p);
	
	$(".btnAnalisisJornada").click(crearGrafico);
}

function quitarPersonajesVacios(){
	$("li.cast").each(function(index){
		//Ocultamos los personajes cuyos spans no tienen texto.
		if ($(this).text().trim() == "")
			$(this).hide(); 
	});
}

function numerarVersos(){
    //También hay que eliminar los versos sin texto (vacíos).
	$(".version").each(function(index) {
		var nombreVersion = $(this).attr("id");
		var version = nombreVersion.substring(nombreVersion.indexOf("-")+1, nombreVersion.length);
		var estadoPartido = null;
		$(this).children().children().filter(".verso").each(function(index) {
			//TODO: tenemos que comprobar que si tooltip de la versión tiene texto
				//Si es así no ocultamos
			var ocultar = true;
			
			//Si tiene un span.diferencia.tooltip.version se muestra. Pero éste aparece dentro de span.diferencia
			//if ($(this).children().select("span.diferencia span.diferencia.tooltip."+version).size() > 0)
			//	ocultar = false;
			
			//Ocultamos los versos que no tienen contenido
			if ($(this).text().trim().length < 3){
				$(this).hide(); //Ocultamos los versos vacíos y no los contamos
				$(this).prev().hide(); //Y ocultamos al previo (número de verso) para mantener la estructura.
				//Si el prev.prev no es un speaker, lo ocultamos
				//if (!$(this).prev().prev().hasClass("speaker"))
				//	$(this).prev().prev().hide(); //Y ocultamos su salto de línea
				$(this).next().hide();//oculta el resto de br
			}
			else{
				$(this).prev().html(numVerso);
				/* Descomentar para ver el tipo de verso.
				if ($(this).hasClass('inicial'))
					$(this).prev().html(numVerso+" I");
				if ($(this).hasClass('medio'))
					$(this).prev().html(numVerso+" m");
				if ($(this).hasClass('final'))
					$(this).prev().html(numVerso+" F");
				*/
				
				//Si no es inicial ni medio, se muestra si es múltiplo de 5
				if (!$(this).hasClass('inicial') && !$(this).hasClass('medio'))
					if ((numVerso)%5==0)
						$(this).prev().addClass("visible");
				//Si es medio o final, no se cuenta
				if (!$(this).hasClass('inicial') && !$(this).hasClass('medio'))
					numVerso++;
				//Cambio de clase para versos finales sin verso medio
				if ($(this).hasClass('inicial'))
					estadoPartido = 'inicial';
				else if ($(this).hasClass('final') && estadoPartido == 'inicial'){
					estadoPartido = null;
					$(this).removeClass("final_1").addClass("medio_1");				
				}
				else
					estadoPartido = null;				
			}
			//$(this).prev().addClass("visible");	//Descomentar para ver todos los números de verso
		});
		numVerso = 1;
	});
}

function Relacion(interv1, interv2, interv3){
	this.intervencion1 = interv1;
	this.intervencion2 = interv2;
	this.intervencion3 = interv3;
}

function pulsarSpeaker(evt){
	var target = evt.target;
	var section = $(target).parent().parent().parent();
	var idVersion = $(section).find('select').first().val();

	//var version = version.substring(7,version.length-1);
	var posicion1 = $(target).position().top;
	
	var selector = $(section).find('div.visor p.speaker'); //el visor pulsado
	//Buscamos dentro de los hijos de la sección pulsada
	var numInterv;
	var falsos = 0;
	$(selector).each(function(i, element){
		if (element.innerHTML == "")	
			falsos++;
		if (element === target){
			numInterv = i - falsos;
			return false;
		}
	});
	
	$('.resaltado').removeClass('resaltado')
	$(target).addClass('resaltado')
	//Para cada visor abierto, calcular y hacer el scroll
	$('section.visor').each(function(i, element){
		//Quitamos marcas anteriores
		//$(element).find('.speaker').css("background-color", "");
		
		var idVersionLocal = $(element).find('select').first().val();
		if (idVersion != idVersionLocal){
			var numIntervLocal = buscarIntervencion(idVersion, numInterv, idVersionLocal);
			if (numIntervLocal == undefined) return false;	
			var pSpeaker = $(element).find('.speaker').get(numIntervLocal);
			//$(pSpeaker).css("background-color", "yellow");
			$(pSpeaker).addClass('resaltado')
			var divVisor = $(pSpeaker).parent().parent();
			$(divVisor).scrollTop(0);
			var scroll = $(pSpeaker).position().top - posicion1;
			$(divVisor).scrollTop(scroll);
		}
	});
	
}



this.buscarIntervencion = function(versionOriginal, indiceIntervencion, versionBuscada){
	
	for (i = 0; i < mapa.relaciones.length; i++){
		var intervencionOrigen = eval("mapa.relaciones[i].intervencion_" + versionOriginal);
		if (intervencionOrigen == indiceIntervencion){
			return eval("mapa.relaciones[i].intervencion_" + versionBuscada);
		}
	}
	return undefined;
}

function irABuscar(){
	$('#divFondo').show();
	$('#divBusqueda').show();
	$('#textoBuscar').focus();
}

function mostrarImagenes(evt){
	$('#divFondo').show();
	$('#divImagenes').show();
	
	//Quitar la clase actual a todos
	$(".actual").removeClass("actual");
	//Cargar las imágenes
	var spanImagenes = $(this).find('.imagenes');
	
	//Quitamos las imágenes del carrusel
	//$('.ps-list ul').empty();
	$('#carrusel-imagenes').empty();
	
	($(spanImagenes).children().each(function( index ) {
		var img = $(this).clone();
		$(img).removeClass();
		$(img).addClass('carrusel');
		if (index == 0)
			$(img).addClass('actual');
		$('#carrusel-imagenes').append(img);
	}));
	
	//Buscar la descripción de la primera imagen y ponerla
	var descripcion = $(this).find("span.carrusel_desc").first();
	$(descripcion).addClass("actual");
	$("#carrusel_desc").html(descripcion.html());
}

function mostrarVideo(evt){
	window.open(evt.target.parentElement.getAttribute('data-video'))
}

function irAAnalisis(){
	//analizarIntervenciones();
	
	$("div.chart-area").html("");
	
	crearGrafico();
	
	$('#divFondo').show();
	$('#divAnalisis').show();
}

function contarJornadas(){
	return $('div.version:first div.jornada').length;
}

function analizarIntervenciones(){
  	var analisisIntervenciones = [];
	
	//La estructura es div.version div.jornada p.speaker
	$('div.version div.jornada p.speaker').each(function( index, element ) {
		//var nombre = $( this ).text().trim().replace('.','');
		//var nombre = $( this ).clone().children().remove().end().text().trim().replace('.','');
		var nombre = $( this ).clone().text().trim().replace('.','');
		nombre = unificar(nombre);
		if (nombre == '') return;
		
		//Buscamos la versión
		var version = $( this ).parent().parent().attr("id");
                
		//Si existe el personaje en el array de resultados
		var personajeEncontrado = false;
		var i;
		
		for (i in analisisIntervenciones){
			var analisis = analisisIntervenciones[i];
			if (analisis.Personaje == nombre){
				personajeEncontrado = true;
				break;
			}
		}
		//if (!personajeEncontrado)
		//	console.log(nombre);
		
		//Buscamos la jornada
		var idJornada = $( this ).parent().attr("id");
		var jornada = idJornada.substring(idJornada.length - 1, idJornada.length);
	
		for (i in analisisIntervenciones){
			var analisis = analisisIntervenciones[i];
			if (analisis.Personaje == nombre){
				version = version.substring(8, version.length);
				eval('analisis.jornada[' + jornada + '].' + version + '++;');
				eval('analisis.jornada[0].' + version + '++;');
				personajeEncontrado = true;
				break;
			}
		}
		if (!personajeEncontrado){
			analisisIntervenciones.push(new AnalisisPersonaje(nombre));
		}
	
	});
	return analisisIntervenciones;
}

function unificar(nombre){
	//Devuelve el nombre estándar del personaje
	switch(nombre.toLowerCase()){
		case "rey":
		case "king":
		case "le roi":
		case "re":
			return "REY";
		case "sancho":
		case "don sanche":
		case "don sancho":
		case "sancio":
			return "SANCHO";
		case "busto":
			return "BUSTO";
		case "don arias":
		case "arias":
			return "DON ARIAS";
		case "matilde":
		case "natilde":
		case "mathilde":
			return "MATILDE";
		case "estrella":
		case "[estrella]":
		case "estelle":
		case "stella":
			return "ESTRELLA";
		case "don pedro":
		case "pedro":
		case "governor":
		case "le gouverneur":
		case "alcaide":
		case "l'alcaïde":
		case "don pietro":
		case "governatore":
			return "DON PEDRO";
		case "clarindo":
			return "CLARINDO";
		case "manuel":
		case "don manuel":
		case "manuele":
		case "don manuele":
			return "DON MANUEL";
		case "gonzalo":
		case "don gonzalo":
			return "DON GONZALO";
		case "farfán":
		case "farfan":
		case "don farfan":
		case "farfante":
			return "FARFÁN";
		case "íñigo":
		case "iñigo":
		case "don inigo":
		case "ignigo":
		case "don ignigo":
			return "ÍÑIGO";
		case "theodora":
		case "teodora":
			return "TEODORA";
		case "fernand perez":
		case "fernán":
		case "fernando":
			return "FERNÁN";
		case "músicos":
		case "musicos":
		case "musicians":
		case "les musiciens":
		case "musici":
			return "MÚSICOS";
		case "criados":
		case "criado":
		case "servant":
		case "servants":
		case "le serviteur":
		case "servi":
		case "les valets":
		case "un servo":
		case "servo":	
			return "CRIADOS";
		default:
			return nombre;
	}
}

function AnalisisPersonaje(nombrePersonaje){
	this.Personaje = nombrePersonaje;
	this.jornada = [];
	for(var i=0; i <= numJornadas; i++){
		var sentencia = "this.jornada[i] = {";
		for(var j = 0; j < versiones.length; j++)
			sentencia = sentencia + versiones[j].id + ": 0,";
		sentencia = sentencia.substring(0, sentencia.length - 1) + "};";
		eval(sentencia);
	}
}


function type(d) {
  d.numIntervenciones = +d.numIntervenciones;
  return d;
}

function crearGrafico(){

	var data = [];
		
	for (var i = 0; i < analisisIntervenciones.length; i++){	//Recorremos todos los personajes
		var intervencion = {};	
		intervencion.Personaje = analisisIntervenciones[i].Personaje;
		
		var datos;
		if ($("#btnJornada_0").prop("checked"))
			datos = analisisIntervenciones[i].jornada[0];
		if ($("#btnJornada_1").prop("checked"))
			datos = analisisIntervenciones[i].jornada[1];
		if ($("#btnJornada_2").prop("checked"))
			datos = analisisIntervenciones[i].jornada[2];
		if ($("#btnJornada_3").prop("checked"))
			datos = analisisIntervenciones[i].jornada[3];
		
		
		$("#pBotonesAnalisis .buttonDown").each(function(index){
			var idVersion = $(this).attr("id").split("_")[1];
			eval("intervencion." + idVersion + " = datos." + idVersion);
		});
		data.push(intervencion); //Cada push metemos un grupo de datos.
	}
	
	//Borramos el gráfico existente
	$("#divAnalisis svg").remove();
	
	var margin = {top: 20, right: 20, bottom: 100, left: 40},
	width = 960 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;

	var x0 = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear()
		.range([height, 0]);

	var color = d3.scale.ordinal()
		.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var xAxis = d3.svg.axis()
		.scale(x0)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));
	
	//var svg = d3.select("body").append("svg")
	var svg = d3.select("#divAnalisis").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	
	//d3.csv("data.csv", function(error, data) {
	// if (error) throw error;

	var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "Personaje"; });

	data.forEach(function(d) {
		d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
	});

	x0.domain(data.map(function(d) { return d.Personaje; }));
	x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
	y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")  
		.style("text-anchor", "end")
		.attr("dx", "-.8em")
		.attr("dy", ".15em")
		.attr("transform", "rotate(-65)" );

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Nº Intervenciones");

	var barra = svg.selectAll(".bar")
		.data(data)
		.enter().append("g")
		.attr("class", "bar")
		.attr("transform", function(d) { return "translate(" + x0(d.Personaje) + ",0)"; });
	  
	barra.selectAll("rect")
		.data(function(d) { return d.ages; })
		.enter().append("rect")
		.attr("class", "bar")
		.attr("width", x1.rangeBand())
		.attr("x", function(d) { return x1(d.name); })
		.attr("y", function(d) { return y(d.value); })
		.attr("height", function(d) { return height - y(d.value); })
		.style("fill", function(d) { return color(d.name);})
		.style("hover", 'brown')
		.on('mouseover', function(d){
			d3.select(this).style("fill", "brown");
			//d3.select(this.nextSibling)[0][0].style.visibility = "visible";
			var id = "numIntervenciones-" + d.Personaje + "-" + d.name;
/*
			if (numAnalisisIntervenciones > 2)
				document.getElementById(id).style.fontSize = "0.8em";
			else
				document.getElementById(id).style.fontSize = "1em";
*/			
			document.getElementById(id).style.fontWeight = "bold";
			//document.getElementById(id).style.visibility = "visible";
			//alert(d3.select(this.nextSibling));
			//verTooltip(d3.event.clientX, y(d.value), d.value);
			
		})
			//.on('mouseover', function(d){verTooltip(d3.event.cX, d3.event.clientY);})
		.on('mouseout', function(d){
			d3.select(this).style("fill", function(d) { return color(d.name);});
			var id = "numIntervenciones-" + d.Personaje + "-" + d.name;
			document.getElementById(id).style.fontWeight = "normal";
			
			//document.getElementById(id).style.visibility = "hidden";
			//d3.select(this.nextSibling)[0][0].style.visibility = "hidden";
			//ocultarTooltip();
			});

		//PageX más bajo y a la derecha, pero proporcional
		//ScreenX no sale.
		//Probar d3.event.pageX,  screenX, clientX
		//Pooner el tooltip en el body en lugar de en el divAnalisis
	  
	barra.selectAll("text")
		.data(function(d) {
			for(var i = 0; i < d.ages.length; i++)
				d.ages[i].Personaje = d.Personaje;
			return d.ages; 
		})
		.enter().append("text")
		.attr("class", function(d) { 
			if (numAnalisisIntervenciones < 3)
				return "numIntervenciones";
			if (numAnalisisIntervenciones < 5)
				return "numIntervenciones_1";
			return 'numIntervenciones_2';
		})
		.attr("fill", 'black')
		.attr("width", "20")
		.attr("id", function(d) { 
			return "numIntervenciones-" + d.Personaje + "-" + d.name; 
		})
		.attr("x", function(d) { return x1(d.name) + x1.rangeBand() / 2; })
		.attr("y", function(d) { 
			//if (y(d.value) > 450)
				return y(d.value)-2;
			//else
			//	return y(d.value) + 20; 
			
		})
		.text(function(d) { return d.value;});
	 
	var legend = svg.selectAll(".legend")
		.data(ageNames.slice().reverse())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
		.attr("x", width - 18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", color);

	legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		//.text(function(d) { return d; });	//Devuelve el índice para la leyenda
		.text(function(d) { return verNombreVersion(d); });
}

function verTooltip(x, y, valor){
	//alert(x + ", " + y);
	var corrX = -100;
	var corrY = +100;
	var tooltip = document.getElementById("tooltipNumIntervenciones");
	if (!tooltip){
		tooltip = document.createElement("div");
		tooltip.setAttribute("id", "tooltipNumIntervenciones");
		tooltip.className="prueba";
	}
	tooltip.style.top = y + corrY;
	tooltip.style.left = x + corrX;
	tooltip.style.visibility = "visible";
	tooltip.innerHTML = valor;
	document.getElementById("divAnalisis").appendChild(tooltip);
}

function ocultarTooltip(){
	document.getElementById("tooltipNumIntervenciones").style.visibility = "hidden";
}

function buscar(){
	var texto = $('#textoBuscar').val();
	if (texto == '')
		return;
		
	//console.log("Buscando el texto " + texto);
	$('#tituloResultadosBusqueda').show();
	$('#tablaBusquedaWrapper').show();
	$('#tablaBusqueda').empty();
	var hayResultados = false;
	$('.version .verso').each(function(index) {
		//if (normalize($(this).html().toLowerCase()).indexOf(normalize(texto.toLowerCase())) != -1){
		var indice = normalize($(this).children().end().text().toLowerCase()).indexOf(normalize(texto.toLowerCase()));
		if ( indice != -1){
			hayResultados = true;
			//verso = $(this).clone().children().remove().end().text();
			verso = $(this).clone().children().end().text();
			numVerso = $(this).prev().html();
			speaker = $(this).prevAll('.speaker').first().text();
			version = $(this).parent().parent().attr("id");
			version = version.substring(8, version.length);
			var tr = $('<tr></tr>');
			var td1 = $('<td></td>');
			td1.html(speaker);
			tr.append(td1);
			var td2 = $('<td></td>');
			
			//Reemplazamos las coincidencias en el verso con el span
			//verso = verso.replace(texto, '<span class="palabraBuscada">'+texto+'</span>');
			var palCoincidente = verso.substring(indice, indice+texto.length);
			verso = verso.substring(0, indice) + '<span class="palabraBuscada">'+palCoincidente+'</span>' + verso.substring(indice+texto.length, verso.length);
			td2.html(verso);
			tr.append(td2);
			var td3 = $('<td></td>');
			td3.html(verNombreVersion(version) + " v:" + numVerso);
			tr.append(td3);
			tr.click({version: version, numVerso: numVerso, textoBuscado: palCoincidente},irAVersoBuscado);
			$('#tablaBusqueda').append(tr);
		}
	});
	if (!hayResultados){
		var tr = $('<tr></tr>');
		var td1 = $('<td></td>');
		tr.append(td1);
		td1.html("No se han encontrado resultados.");
		$('#tablaBusqueda').append(tr);
	}
	else{
		//Quitamos las marcas de los resultados anteriores.
		$('p.verso span.palabraBuscada').removeClass('palabraBuscada');
	}
}

function verNombreVersion(id){
	for(var i = 0; i < versiones.length; i++)
		if (versiones[i].id == id)
			return versiones[i].nombre;
	return "no_encontrado";
}

function borrarResultadosBusqueda(){
	$("#textoBuscar").val('');
	$('#tituloResultadosBusqueda').hide();
	$('#tablaBusqueda').empty();
}

function cerrarResultados(){
	$('#divFondo').hide();
	$('#divBusqueda').hide();
}

function cerrarAnalisis(){
	$('#divFondo').hide();
	$('#divAnalisis').hide();
}

function cerrarImagenes(){
	$('#divFondo').hide();
	$('#divImagenes').hide();
	//pgwSlideshow.destroy(true);
}

function irAVersoBuscado(event){
	var version = event.data.version;
	var numVerso = event.data.numVerso;
	var textoBuscado = event.data.textoBuscado;
	var idVisor = null;
	cerrarResultados();
	//alert(version+" "+numVerso);
	
	//Buscmos el visor con la versión indicada
	//var select = null;
	$('select').each(function(index) {
		if ($(this).val() == version){
			select = $(this);
			idVisor = select.attr("id").replace("select-", "div-visor-");
			//alert("Visor encontrado: " + idVisor);
		}
	});
	if (idVisor == null){	//No la hemos encontrado
		var numVisor = 0;
		if (numVisoresAbiertos < maxVisoresAbiertos){
			anadirVisor();
			numVisor = numVisoresAbiertos-1;
			idVisor = "div-visor-"+numVisor;
			//alert("Visor nuevo: " + idVisor);
		}
		cargarVersion(numVisor, version);
	}
	var visor = $('#'+idVisor);
	var pNumVerso = $('#'+idVisor +' .numVerso:contains("'+numVerso+'")');
	var verso = $(pNumVerso).first().next();
	var textoVerso = $(verso).children().end().text();
			var indice = normalize($(verso).children().end().text().toLowerCase()).indexOf(normalize(textoBuscado.toLowerCase()));
			textoVerso = textoVerso.substring(0, indice) + '<span class="palabraBuscada">'+textoBuscado+'</span>' + textoVerso.substring(indice+textoBuscado.length, textoVerso.length);
			$(verso).html(textoVerso);
			
	$(visor).scrollTop(0);	//Quitamos el scroll del visor
	$(visor).scrollTop($(pNumVerso).position().top - 20); //Funciona si el visor no tiene scroll
	
	//Marcar la palabra buscada
}

//Ref: http://www.etnassoft.com/2011/03/03/eliminar-tildes-con-javascript/
//Quita acentos, tildes y demás
var normalize = (function() {
	var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
	to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
	mapping = {};
	
	for(var i = 0, j = from.length; i < j; i++ )
		mapping[ from.charAt( i ) ] = to.charAt( i );
	
	return function( str ) {
		var ret = [];
		for( var i = 0, j = str.length; i < j; i++ ) {
			var c = str.charAt( i );
			if( mapping.hasOwnProperty( str.charAt( i ) ) )
				ret.push( mapping[ c ] );
			else
				ret.push( c );
		}      
		return ret.join( '' );
	}
	
})();

