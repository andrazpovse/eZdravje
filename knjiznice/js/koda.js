

var baseUrl = 'https://rest.ehrscape.com/rest/v1';

var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";


/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}

var podatkiZaGeneritat = '{ "pacient" : [' +
'{ "firstName":"Zdrava" , "lastName":"Oseba", "visina":"170", "teza":"62", "srcniUtrip":"67", "spodnjiTlak":"84", "zgornjiTlak":"130" },' +
'{ "firstName":"Poškodovana" , "lastName":"Oseba(visok srčni utrip)", "visina":"180", "teza":"75", "srcniUtrip":"185", "spodnjiTlak":"92", "zgornjiTlak":"142" },' +
'{ "firstName":"Nezdrava" , "lastName":"Oseba (visok pritisk in ITM)", "visina":"175", "teza":"120", "srcniUtrip":"85", "spodnjiTlak":"110", "zgornjiTlak":"160" } ]}';

obj = JSON.parse(podatkiZaGeneritat);


var stPacienta = 0;
function generirajPodatke(){
    if (stPacienta == 3){
         $("#kreiraniEHRji").text("");
        stPacienta = 0;
    }
    narediPaciente(stPacienta);
    stPacienta++;
       
    
}

function narediPaciente(i) {
  //tukaj bomo dodali generične paciente (kot študenti)
    var ime, priimek, visina, teza, srcniUtrip, spodnjiTlak, zgornjiTlak;
   
  	sessionId = getSessionId();

        	 ime = obj.pacient[i].firstName;
        	 priimek = obj.pacient[i].lastName;
        	 visina = obj.pacient[i].visina;
        	 teza = obj.pacient[i].teza;
        	 srcniUtrip = obj.pacient[i].srcniUtrip;
        	 spodnjiTlak = obj.pacient[i].spodnjiTlak;
        	 zgornjiTlak = obj.pacient[i].zgornjiTlak;
        	
        	
        	//ustvarimo zapis z pacientovim imenom in priimkom
        		$.ajaxSetup({
        		    headers: {"Ehr-Session": sessionId}
        		});
        		$.ajax({
        		    url: baseUrl + "/ehr",
        		    type: 'POST',
        		    success: function (data) {
        		        var ehrId = data.ehrId;
        		        var partyData = {
        		            firstNames: ime,
        		            lastNames: priimek,
        		            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
        		        };
        		        $.ajax({
        		            url: baseUrl + "/demographics/party",
        		            type: 'POST',
        		            contentType: 'application/json',
        		            data: JSON.stringify(partyData),
        		             success: function (party) {
		                    if (party.action == 'CREATE') {
		                        zapisiSePodatke(ehrId);
		                    }
		                 },
        
        		        });
        		        
        		        
        		        //mu se vnesemo vrednosti
        		         function zapisiSePodatke(ehrId){
        		        $.ajaxSetup({
        		            headers: {"Ehr-Session": sessionId}
        		        });
        		        	var podatki = {
                			// Struktura predloge je na voljo na naslednjem spletnem naslovu:
                            // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
                		    "ctx/language": "en",
                		    "ctx/territory": "SI",
                		    
                		    "vital_signs/height_length/any_event/body_height_length": visina,
                		    "vital_signs/body_weight/any_event/body_weight": teza,
                		    "vital_signs/pulse/any_event/rate|magnitude": srcniUtrip,
                		    "vital_signs/pulse/any_event/rate|unit":"/min",
                		    "vital_signs/blood_pressure/any_event/systolic": zgornjiTlak,
                		    "vital_signs/blood_pressure/any_event/diastolic": spodnjiTlak,
                		};
                		var parametriZahteve = {
                		    ehrId: ehrId,
                		    templateId: 'Vital Signs',
                		    format: 'FLAT',
                		   // committer: merilec
                		};
                		$.ajax({
                		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
                		    type: 'POST',
                		    contentType: 'application/json',
                		    data: JSON.stringify(podatki),
                		    success: function (res) {
                		        document.getElementById("kreiraniEHRji").innerHTML += "<p class='bg-success'> <b>Generiran vpis:</b> "+ime+" "+priimek+",<b> EHR-Id:</b> "+ ehrId + "</p><br>"
                		    },
                		    
 
        		    });
        		         }
        		    }
        		});
        		
    }

















$(document).ready(function() 



 {
     
     
     $("#wikiDetails").hide();
     $("#friendlyTip").hide();
     
     
     $("#overall").hide();
     $("#details").hide();
     
     
   
     
     
     
//qtipi, ki nam kažejo kaj prikazuje kateri diagram

       $('#fillgauge2').qtip({   //prvi za spodnji krvni tlak----------------------------
        content: {
        text: 'Krvni tlak spodnji'
    },
        position: {
        my: 'top center',  // Position my top left...
        at: 'top center', // at the bottom right of...
        target: $('#fillgauge2') // my target
    },
    
         
     });
       $('#fillgauge3').qtip({  //krvni tlak zgornji ---------------------------------
        content: {
        text: 'Krvni tlak zgornji'
    },
        position: {
        my: 'top center',  // Position my top left...
        at: 'top center', // at the bottom right of...
        target: $('#fillgauge3') // my target
    }
         
     });
       $('#fillgauge4').qtip({   // srčni utrip --------------------------------------
        content: {
        text: 'Srčni utrip'
    },
        position: {
        my: 'top center',  // Position my top left...
        at: 'top center', // at the bottom right of...
        target: $('#fillgauge4') // my target
    }
         
     });
     $('#fillgauge5').qtip({  // višina -------------------------------------------
        content: {
        text: 'Višina'
    },
        position: {
        my: 'top center',  // Position my top left...
        at: 'top center', // at the bottom right of...
        target: $('#fillgauge5') // my target
    }
         
     });
     
      $('#fillgauge6').qtip({  // teža -------------------------------------------------------------
        content: {
        text: 'Teža'
    },
        position: {
        my: 'top center',  // Position my top left...
        at: 'top center', // at the bottom right of...
        target: $('#fillgauge6') // my target
    }
         
     });
 });

/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */



// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija





//tukaj je JS iz vaj




function kreirajEHRzaBolnika() {
	sessionId = getSessionId();

	var ime = $("#kreirajIme").val();
	var priimek = $("#kreirajPriimek").val();

	if (!ime || !priimek ||  ime.trim().length == 0 ||
      priimek.trim().length == 0 ) {
		$("#kreirajSporocilo").html("<span class='obvestilo label " +
      "label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		$.ajax({
		    url: baseUrl + "/ehr",
		    type: 'POST',
		    success: function (data) {
		        var ehrId = data.ehrId;
		        var partyData = {
		            firstNames: ime,
		            lastNames: priimek,
		            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
		        };
		        $.ajax({
		            url: baseUrl + "/demographics/party",
		            type: 'POST',
		            contentType: 'application/json',
		            data: JSON.stringify(partyData),
		            success: function (party) {
		                if (party.action == 'CREATE') {
		                    $("#kreirajSporocilo").html("<span class='obvestilo " +
                          "label label-success fade-in'>Uspešno kreiran EHR '" +
                          ehrId + "'.</span>");
		                    $("#preberiEHRid").val(ehrId);
		                }
		            },
		            error: function(err) {
		            	$("#kreirajSporocilo").html("<span class='obvestilo label " +
                    "label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
		            }
		        });
		    }
		});
	}
}


var stevec = 0;

function preveri(){   //preverimo ali smo pridobili vse podatke, preden gremo naprej in prikazemo graficni prikaz
   stevec++;

    if (stevec == 5){
    	document.getElementById('bubbles').innerHTML = '';
        zakasnitev();
        stevec = 0;
    }
  
}

/**
 * Za dodajanje vitalnih znakov pacienta je pripravljena kompozicija, ki
 * vključuje množico meritev vitalnih znakov (EHR ID, datum in ura,
 * telesna višina, telesna teža, sistolični in diastolični krvni tlak,
 * nasičenost krvi s kisikom in merilec).
 */
function dodajMeritveVitalnihZnakov() {
	sessionId = getSessionId();

	var ehrId = $("#dodajVitalnoEHR").val();
	//var datumInUra = $("#dodajVitalnoDatumInUra").val();
	var telesnaVisina = $("#dodajVitalnoTelesnaVisina").val();
	var telesnaTeza = $("#dodajVitalnoTelesnaTeza").val();
	var srcniUtrip = $("#dodajVitalnoSrcniUtrip").val();
	var sistolicniKrvniTlak = $("#dodajVitalnoKrvniTlakSistolicni").val();
	var diastolicniKrvniTlak = $("#dodajVitalnoKrvniTlakDiastolicni").val();
	//var nasicenostKrviSKisikom = $("#dodajVitalnoNasicenostKrviSKisikom").val();
	//var merilec = $("#dodajVitalnoMerilec").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		var podatki = {
			// Struktura predloge je na voljo na naslednjem spletnem naslovu:
      // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
		    "ctx/language": "en",
		    "ctx/territory": "SI",
		   // "ctx/time": datumInUra,
		    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
		    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
		    "vital_signs/pulse/any_event/rate|magnitude": srcniUtrip,
		    "vital_signs/pulse/any_event/rate|unit":"/min",
		    "vital_signs/blood_pressure/any_event/systolic": sistolicniKrvniTlak,
		    "vital_signs/blood_pressure/any_event/diastolic": diastolicniKrvniTlak,
		    //"vital_signs/indirect_oximetry:0/spo2|numerator": nasicenostKrviSKisikom
		};
		var parametriZahteve = {
		    ehrId: ehrId,
		    templateId: 'Vital Signs',
		    format: 'FLAT',
		   // committer: merilec
		};
		$.ajax({
		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(podatki),
		    success: function (res) {
		        $("#dodajMeritveVitalnihZnakovSporocilo").html(
              "<span class='obvestilo label label-success fade-in'>" +
              res.meta.href + ".</span>");
		    },
		    error: function(err) {
		    	$("#dodajMeritveVitalnihZnakovSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
		    }
		});
	}
}


/**
 Pridobivanje podatkov o pacientu in jih prikazati v animiranem grafu, hkrati pa na desni strani prikazati napotke za stranko
 */

function preberiMeritveVitalnihZnakov() {
	sessionId = getSessionId();
    
    
	var ehrId = $("#meritveVitalnihZnakovEHRid").val();
	
	// Spodaj poskrbimo da so vrednosti ponovno "", ko izberemo drugega pacienta
	//prav tako ponovno skrijemo vrednosti, tako da se pokazejo sele ob pritisku na gumb
    document.getElementById("wikiTextBloodPressure").innerHTML = "";
    document.getElementById("wikiTextDeath").innerHTML = "";
    document.getElementById("wikiTextItm").innerHTML = "";
    document.getElementById("wikiTextTveganja").innerHTML = "";
    document.getElementById("wikiTextZdravje").innerHTML = "";
    $("#wikiDetails").hide();

	if (!ehrId || ehrId.trim().length == 0 ) {
		$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
	    
	
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				

				//pridobimo srcni utrip
					$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "pulse",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
				        var hintUtrip = "<br>";
				        
				        if (res[res.length-1].pulse > 100)
				        	hintUtrip += "<p class='bg-danger'>Vaš srčni utrip je povišan. Optimalen srčni utrip znaša 50 - 100 /min</p>"
				    	else if (res[res.length-1].pulse < 50)
				            hintUtrip += "<p class='bg-danger'>Vaš srčni utrip je nizek. Optimalen srčni utrip znaša 50 - 100 /min/p>"
				          else
				        	hintUtrip += "<p class='bg-success'> Vaš srčni utrip je optimalen </p>"
				            
					      document.getElementById('utrip').innerHTML = "Vaš srčni utrip znaša " + res[res.length-1].pulse + " /min" + hintUtrip;
					      document.getElementById('utripNumber').innerHTML = res[res.length-1].pulse;
					     
					      
					      preveri()   //pri vsakem klicu gremo v funkcijo "preveri", katera caka da se izvedejo vsi tej klici, potem pa nadaljuje z graficnim prikazom
					      
					    },
					});

				
				
				//zacetek ajaxa za tezo
					$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "weight",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					   
					    
		                    document.getElementById('teza').innerHTML = "<p class='bg-info'>Vaša teža znaša " + res[res.length-1].weight + " kg </p>"
		                    document.getElementById('tezaNumber').innerHTML = res[res.length-1].weight;
		                    preveri()
					    },
					});
					
					//zacetek ajaxa za zgornji tlak
						$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "blood_pressure",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					     var hintTlak = "<br>";
					     
					    	if (res[res.length-1].systolic > 140)
					    		hintTlak += " <p class='bg-danger'>Vaš zgornji krvni tlak je povišan. Optimalen sistolični tlak znaša 100 - 140 mm Hg</p>"
					    	else if (res[res.length-1].systolic < 100)
					    		hintTlak += " <p class='bg-danger'>Vaš zgornji krvni tlak je nizek. Optimalen sistolični tlak znaša 100 - 140 mm Hg</p>"
					    	else
					    		hintTlak += "<p class='bg-success'>Vaš zgornji krvni tlak je optimalen </p>"
					    	
					    	
		                    document.getElementById('zgornjiTlak').innerHTML = "Vaš zgornji krvni pritisk znaša " + res[res.length-1].systolic + " mm Hg" + hintTlak
		                    document.getElementById("zgornjiTlakNumber").innerHTML = res[res.length-1].systolic;
		                    preveri()
		                    
					    },
					});
					
					//zacetek ajaxa za spodnji tlak
						$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "blood_pressure",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	var hintSpodnji = "<br>"
					    	
					    	if (res[res.length-1].diastolic > 90)
					    		hintSpodnji += " <p class='bg-danger'>Vaš spodnji krvni tlak je povišan. Optimalen diastolični tlak znaša 60 - 90 mm Hg</p>"
					    	else if (res[res.length-1].systolic < 60)
					    		hintSpodnji += " <p class='bg-danger'>Vaš spodnji krvni tlak je nizek. Optimalen diastolični tlak znaša 60 - 90 mm Hg</p>"
					    	else
					    		hintSpodnji += "<p class='bg-success'>Vaš spodnji krvni tlak je optimalen </p>"
		                    document.getElementById('spodnjiTlak').innerHTML = "Vaš spodnji krvni pritisk znaša  " + res[res.length-1].diastolic + " mm Hg" + hintSpodnji
		                    document.getElementById("spodnjiTlakNumber").innerHTML = res[res.length-1].diastolic;
		                    preveri()
					    },
					});
					
					//zacetek ajaxa za višino
						$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "height",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    
		                    document.getElementById('visina').innerHTML = "<p class='bg-info'>Vaša višina znaša " + res[res.length-1].height + " cm</p>"
		                    document.getElementById("visinaNumber").innerHTML = res[res.length-1].height;
		                    preveri()
					    },
					});
					
				$("#overall, #details, #friendlyTip").show();
		
			
	
				
	    	},
	    
		});
	}
	
}


$(document).ready(function() {

  /**
   * Napolni testne vrednosti (ime, priimek in datum rojstva) pri kreiranju
   * EHR zapisa za novega bolnika, ko uporabnik izbere vrednost iz
   * padajočega menuja (npr. Pujsa Pepa).
   */
  $('#preberiPredlogoBolnika').change(function() {
    $("#kreirajSporocilo").html("");
    var podatki = $(this).val().split(",");
    $("#kreirajIme").val(podatki[0]);
    $("#kreirajPriimek").val(podatki[1]);
    $("#kreirajDatumRojstva").val(podatki[2]);
  });

  /**
   * Napolni testni EHR ID pri prebiranju EHR zapisa obstoječega bolnika,
   * ko uporabnik izbere vrednost iz padajočega menuja
   * (npr. Dejan Lavbič, Pujsa Pepa, Ata Smrk)
   */
	$('#preberiObstojeciEHR').change(function() {
		$("#preberiSporocilo").html("");
		$("#preberiEHRid").val($(this).val());
	});

  /**
   * Napolni testne vrednosti (EHR ID, datum in ura, telesna višina,
   * telesna teža, telesna temperatura, sistolični in diastolični krvni tlak,
   * nasičenost krvi s kisikom in merilec) pri vnosu meritve vitalnih znakov
   * bolnika, ko uporabnik izbere vrednosti iz padajočega menuja (npr. Ata Smrk)
   */
	$('#preberiObstojeciVitalniZnak').change(function() {
		$("#dodajMeritveVitalnihZnakovSporocilo").html("");
		var podatki = $(this).val().split("|");
		$("#dodajVitalnoEHR").val(podatki[0]);
		$("#dodajVitalnoDatumInUra").val(podatki[1]);
		$("#dodajVitalnoTelesnaVisina").val(podatki[2]);
		$("#dodajVitalnoTelesnaTeza").val(podatki[3]);
		$("#dodajVitalnoTelesnaTemperatura").val(podatki[4]);
		$("#dodajVitalnoKrvniTlakSistolicni").val(podatki[5]);
		$("#dodajVitalnoKrvniTlakDiastolicni").val(podatki[6]);
		$("#dodajVitalnoNasicenostKrviSKisikom").val(podatki[7]);
		$("#dodajVitalnoMerilec").val(podatki[8]);
	});

  /**
   * Napolni testni EHR ID pri pregledu meritev vitalnih znakov obstoječega
   * bolnika, ko uporabnik izbere vrednost iz padajočega menuja
   * (npr. Ata Smrk, Pujsa Pepa)
   */
	$('#preberiEhrIdZaVitalneZnake').change(function() {
		$("#preberiMeritveVitalnihZnakovSporocilo").html("");
		//$("#rezultatMeritveVitalnihZnakov").html("");
		$("#meritveVitalnihZnakovEHRid").val($(this).val());
	});

});


//na podlagi pacienta generiramo wiki link - previsok krvni tlak, teža, srčni utrip, ...








//-----------------WIKI JSONP API
function getWiki(url, divToPost, baseText){
//var url = "https://sl.wikipedia.org/wiki/Visok_krvni_tlak";  //to bomo spremenili tako da bo dobil spremenljivko v kateri je URL glede na kriterije
var title = url.split("/");
title = title[title.length - 1];

//Get Leading paragraphs (section 0)
$.getJSON("https://sl.wikipedia.org/w/api.php?action=parse&page=" + title + "&prop=text&section=0&format=json&callback=?", function (data) {
    for (text in data.parse.text) {
        var text = data.parse.text[text].split("<p>");
        var pText = "";

        for (p in text) {
            //Remove html comment
            text[p] = text[p].split("<!--");
            if (text[p].length > 1) {
                text[p][0] = text[p][0].split(/\r\n|\r|\n/);
                text[p][0] = text[p][0][0];
                text[p][0] += "</p> ";
            }
            text[p] = text[p][0];

            //Construct a string from paragraphs
            if (text[p].indexOf("</p>") == text[p].length - 5) {
                var htmlStrip = text[p].replace(/<(?:.|\n)*?>/gm, '') //Remove HTML
                var splitNewline = htmlStrip.split(/\r\n|\r|\n/); //Split on newlines
                for (newline in splitNewline) {
                    if (splitNewline[newline].substring(0, 11) != "Cite error:") {
                        pText += splitNewline[newline];
                        pText += "\n";
                    }
                }
            }
        }
        pText = pText.substring(0, pText.length - 2); //Remove extra newline
        pText = pText.replace(/\[\d+\]/g, ""); //Remove reference tags (e.x. [1], [4], etc)
        document.getElementById(''+divToPost+'').innerHTML = baseText + pText + "<br><br>"
    }
});
}


























































//----------------------------------------------------------ZAČETEK: tukaj so deli povezani z grafičnim prikazom --------------------------------------------------------------------------
/*
 * @license Open source under BSD 2-clause (http://choosealicense.com/licenses/bsd-2-clause/)
 * Copyright (c) 2015, Curtis Bratton
 * All rights reserved.
 *
 * Liquid Fill Gauge v1.1
 */
function liquidFillGaugeDefaultSettings(){
    return {
        minValue: 0, // The gauge minimum value.
        maxValue: 100, // The gauge maximum value.
        circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
        circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
        circleColor: "#178BCA", // The color of the outer circle.
        waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
        waveCount: 1, // The number of full waves per width of the wave circle.
        waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
        waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
        waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
        waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
        waveAnimate: true, // Controls if the wave scrolls or is static.
        waveColor: "#178BCA", // The color of the fill wave.
        waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
        textVertPosition: .5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
        textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
        valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
        displayPercent: false, // If true, a % symbol is displayed after the value.
        textColor: "#045681", // The color of the value text when the wave does not overlap it.
        waveTextColor: "#A4DBf8" // The color of the value text when the wave overlaps it.
    };
}

function loadLiquidFillGauge(elementId, value, config) {
    if(config == null) config = liquidFillGaugeDefaultSettings();

    var gauge = d3.select("#" + elementId);
    var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height")))/2;
    var locationX = parseInt(gauge.style("width"))/2 - radius;
    var locationY = parseInt(gauge.style("height"))/2 - radius;
    var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;

    var waveHeightScale;
    if(config.waveHeightScaling){
        waveHeightScale = d3.scale.linear()
            .range([0,config.waveHeight,0])
            .domain([0,50,100]);
    } else {
        waveHeightScale = d3.scale.linear()
            .range([config.waveHeight,config.waveHeight])
            .domain([0,100]);
    }

    var textPixels = (config.textSize*radius/2);
    var textFinalValue = parseFloat(value).toFixed(2);
    var textStartValue = config.valueCountUp?config.minValue:textFinalValue;
    var percentText = config.displayPercent?"%":"";
    var circleThickness = config.circleThickness * radius;
    var circleFillGap = config.circleFillGap * radius;
    var fillCircleMargin = circleThickness + circleFillGap;
    var fillCircleRadius = radius - fillCircleMargin;
    var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);

    var waveLength = fillCircleRadius*2/config.waveCount;
    var waveClipCount = 1+config.waveCount;
    var waveClipWidth = waveLength*waveClipCount;

    // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
    var textRounder = function(value){ return Math.round(value); };
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(1); };
    }
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(2); };
    }

    // Data for building the clip wave area.
    var data = [];
    for(var i = 0; i <= 40*waveClipCount; i++){
        data.push({x: i/(40*waveClipCount), y: (i/(40))});
    }

    // Scales for drawing the outer circle.
    var gaugeCircleX = d3.scale.linear().range([0,2*Math.PI]).domain([0,1]);
    var gaugeCircleY = d3.scale.linear().range([0,radius]).domain([0,radius]);

    // Scales for controlling the size of the clipping path.
    var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
    var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);

    // Scales for controlling the position of the clipping path.
    var waveRiseScale = d3.scale.linear()
        // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
        // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
        // circle at 100%.
        .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
        .domain([0,1]);
    var waveAnimateScale = d3.scale.linear()
        .range([0, waveClipWidth-fillCircleRadius*2]) // Push the clip area one full wave then snap back.
        .domain([0,1]);

    // Scale for controlling the position of the text within the gauge.
    var textRiseScaleY = d3.scale.linear()
        .range([fillCircleMargin+fillCircleRadius*2,(fillCircleMargin+textPixels*0.7)])
        .domain([0,1]);

    // Center the gauge within the parent SVG.
    var gaugeGroup = gauge.append("g")
        .attr('transform','translate('+locationX+','+locationY+')');

    // Draw the outer circle.
    var gaugeCircleArc = d3.svg.arc()
        .startAngle(gaugeCircleX(0))
        .endAngle(gaugeCircleX(1))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius-circleThickness));
    gaugeGroup.append("path")
        .attr("d", gaugeCircleArc)
        .style("fill", config.circleColor)
        .attr('transform','translate('+radius+','+radius+')');

    // Text where the wave does not overlap.
    var text1 = gaugeGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.textColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // The clipping wave area.
    var clipArea = d3.svg.area()
        .x(function(d) { return waveScaleX(d.x); } )
        .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
        .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
    var waveGroup = gaugeGroup.append("defs")
        .append("clipPath")
        .attr("id", "clipWave" + elementId);
    var wave = waveGroup.append("path")
        .datum(data)
        .attr("d", clipArea)
        .attr("T", 0);

    // The inner circle with the clipping wave attached.
    var fillCircleGroup = gaugeGroup.append("g")
        .attr("clip-path", "url(#clipWave" + elementId + ")");
    fillCircleGroup.append("circle")
        .attr("cx", radius)
        .attr("cy", radius)
        .attr("r", fillCircleRadius)
        .style("fill", config.waveColor);

    // Text where the wave does overlap.
    var text2 = fillCircleGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.waveTextColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // Make the value count up.
    if(config.valueCountUp){
        var textTween = function(){
            var i = d3.interpolate(this.textContent, textFinalValue);
            return function(t) { this.textContent = textRounder(i(t)) + percentText; }
        };
        text1.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
        text2.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
    }

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    var waveGroupXPosition = fillCircleMargin+fillCircleRadius*2-waveClipWidth;
    if(config.waveRise){
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(0)+')')
            .transition()
            .duration(config.waveRiseTime)
            .attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')')
            .each("start", function(){ wave.attr('transform','translate(1,0)'); }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
    } else {
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')');
    }

    if(config.waveAnimate) animateWave();

    function animateWave() {
        wave.attr('transform','translate('+waveAnimateScale(wave.attr('T'))+',0)');
        wave.transition()
            .duration(config.waveAnimateTime * (1-wave.attr('T')))
            .ease('linear')
            .attr('transform','translate('+waveAnimateScale(1)+',0)')
            .attr('T', 1)
            .each('end', function(){
                wave.attr('T', 0);
                animateWave(config.waveAnimateTime);
            });
    }

    function GaugeUpdater(){
        this.update = function(value){
            var newFinalValue = parseFloat(value).toFixed(2);
            var textRounderUpdater = function(value){ return Math.round(value); };
            if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                textRounderUpdater = function(value){ return parseFloat(value).toFixed(1); };
            }
            if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                textRounderUpdater = function(value){ return parseFloat(value).toFixed(2); };
            }

            var textTween = function(){
                var i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
                return function(t) { this.textContent = textRounderUpdater(i(t)) + percentText; }
            };

            text1.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
            text2.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);

            var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;
            var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);
            var waveRiseScale = d3.scale.linear()
                // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
                // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
                // circle at 100%.
                .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
                .domain([0,1]);
            var newHeight = waveRiseScale(fillPercent);
            var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
            var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);
            var newClipArea;
            if(config.waveHeightScaling){
                newClipArea = d3.svg.area()
                    .x(function(d) { return waveScaleX(d.x); } )
                    .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
                    .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
            } else {
                newClipArea = clipArea;
            }

            var newWavePosition = config.waveAnimate?waveAnimateScale(1):0;
            wave.transition()
                .duration(0)
                .transition()
                .duration(config.waveAnimate?(config.waveAnimateTime * (1-wave.attr('T'))):(config.waveRiseTime))
                .ease('linear')
                .attr('d', newClipArea)
                .attr('transform','translate('+newWavePosition+',0)')
                .attr('T','1')
                .each("end", function(){
                    if(config.waveAnimate){
                        wave.attr('transform','translate('+waveAnimateScale(0)+',0)');
                        animateWave(config.waveAnimateTime);
                    }
                });
            waveGroup.transition()
                .duration(config.waveRiseTime)
                .attr('transform','translate('+waveGroupXPosition+','+newHeight+')')
        }
    }

    return new GaugeUpdater();
}

//----------------------------------------------------------KONEC: tukaj so deli povezani z grafičnim prikazom --------------------------------------------------------------------------