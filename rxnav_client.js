function getRxcuiFromString(searchTerm) {
	var output = "";
	// search by exact string
	$.ajax({
		type : "GET",
		dataType : "json",
		async : false,
		url : "https://rxnav.nlm.nih.gov/REST/rxcui?caller=RxNav&name="
				+ encodeURIComponent(searchTerm),
		success : function(data) {
			if (exists(data) && exists(data.idGroup)
					&& exists(data.idGroup.rxnormId)) {
				var rxcuis = data.idGroup.rxnormId;
				if (rxcuis.length == 1) {
					output = rxcuis[0];
				} else {
					output = rxcuis.join("|");
					var tmpStr = "";
					for (var i = 0; i < rxcuis.length; i++) {

						tmpStr += "<a class='modalItem'>" + rxcuis[i] + " ("
								+ getDrugName(rxcuis[i]) + ")</a>";
					}
					// create content for modal
					$("#MultipleRxCuiModalLabel").html(
							"There are " + rxcuis.length + " rxcuis for name='"
									+ searchTerm
									+ "', choose one of the following");
					$("#MultipleRxCuiModalContent").html(tmpStr);
					$('#MultipleRxCuiModal').modal({
						keyboard : true,
						show : true,
					});
					$(".modalItem").on('click',function() {
						globalRxcui = $(this).html().trim()
								.split("(")[0].trim();
						$('#MultipleRxCuiModal').modal('hide');
						search("RXCUI", globalRxcui, true);
					});
				}
			}
		}
	});
	// check if string exist
	if (output == '') {
		$.ajax({
			type : "GET",
			dataType : "json",
			async : false,
			url : "https://rxnav.nlm.nih.gov/REST/spellingsuggestions?caller=RxNav&name="
					+ encodeURIComponent(searchTerm),
			success : function(data) {
				if (exists(data)
						&& exists(data.suggestionGroup)
						&& exists(data.suggestionGroup.suggestionList)
						&& isArray(data.suggestionGroup.suggestionList.suggestion)) {

					var suggestionTerm = data.suggestionGroup.suggestionList.suggestion;
					var sLength = suggestionTerm.length;
					var modalContent = '';
					var modalTitle = " Spelling Suggestion for '"
							+ searchTerm + "'";
					for (var i = 0; i < sLength; i++) {
						modalContent += "<a class='modalItem'>"
								+ suggestionTerm[i] + "</a>";

					}
					// create content for modal
					$("#SpellModalLabel").html(modalTitle);
					$("#SpellModalContent").html(modalContent);
					$('#SpellModal').modal({
						keyboard : true,
						show : true,
					});
					// do search on selected item

					$(".modalItem").on('click', function() {
						var newSearchItem = $(this).html();
						$('#SpellModal').modal('hide');
						search("String", newSearchItem, false);
					});
				} else {
					noSearchFound(searchTerm);
				}
			}
		});
	}
	if (output.indexOf("|") > -1) {
		return "";
	}
	return output;

}
/**
 * 
 * @param idtype
 * @param id
 * @returns {String}
 */
function getRxcuiFromId(idtype, id) {
	var output = "";
	$.ajax({
		type : "GET",
		dataType : "json",
		async : false,
		url : "https://rxnav.nlm.nih.gov/REST/rxcui?caller=RxNav&idtype="
				+ encodeURIComponent(idtype)
				+ "&id="
				+ encodeURIComponent(id),
		success : function(data) {
			if (exists(data) && exists(data.idGroup)
					&& exists(data.idGroup.rxnormId)) {
				var rxnormIds = data.idGroup.rxnormId;
				output = rxnormIds[0];
				if (rxnormIds.length > 1) {
					var modalContent = '';
					// var searchBy = $("#searchBy select
					// option:selected")
					// .text();
					var modalTitle = "Search for "
							+ idtype
							+ "='"
							+ id
							+ "', found multiple concepts. <br> Please select from below";
					for (var i = 0; i < rxnormIds.length; i++) {
						var multipleCon = getDrugName(rxnormIds[i]);
						modalContent += "<a class='modalItem'>"
								+ rxnormIds[i] + " (" + multipleCon
								+ ")</a><br>";

					}
					// create content for modal
					$("#ConceptModalLabel").html(modalTitle);
					$("#ConceptModalContent").html(modalContent);
					$('#ConceptModal').modal({
						keyboard : true,
						show : true,
					});
					// do search on selected item

					$(".modalItem")
							.on(
									'click',
									function() {
										globalRxcui = $(this).html()
												.split("(")[0].trim();
										$('#ConceptModal')
												.modal('hide');
										search("RXCUI", globalRxcui,
												true);
									});

				}
			} else {
				noSearchFound(id);
			}

		}
	});
	return output;
}

/**
 * 
 * @param searchBy
 * @param searchTerm
 * @returns {String}
 */
function getRxcui(searchBy, searchTerm) {
	if (searchBy == "RXCUI") {
		if (searchTerm in reformulationRxcuisHash) {
			var str1 = reformulationRxcuiStr[searchTerm];
			var str2 = reformulationStrHash[str1.toLowerCase()];
			var rxcui2 = reformulationRxcuisHash[searchTerm];
			showReformulationModal(searchBy, searchTerm, str1, rxcui2, str2);
			return "";
		} else {
			// check status of rxcui
			var output = "";
			$.ajax({
				type : "GET",
				dataType : "json",
				async : false,
				url : "https://rxnav.nlm.nih.gov/REST/rxcui/"
						+ encodeURIComponent(searchTerm)
						+ "/status?caller=RxNav",
				success : function(data) {
					if (exists(data) && exists(data.rxcuiStatus)
							&& exists(data.rxcuiStatus.status)) {
						var status = data.rxcuiStatus.status;
						if (status == "Active") {
							output = searchTerm;

						} else if (status == "Remapped") {
							var minConcept = data.rxcuiStatus.minConceptGroup.minConcept;

							if (minConcept.length > 1) {
								// to do mkae modal with remapped items

								var modalContent = '';
								var modalTitle = "Selected RxCUI = "
										+ searchTerm
										+ " is obsolete and has been remapped to multiple concepts. Please Choose One Below";
								for (var i = 0; i < minConcept.length; i++) {
									modalContent += "<a class='modalItem'>"
											+ minConcept[i].rxcui
											+ " ("
											+ minConcept[i].name
											+ ")</a><br/>";

								}
								// create content for modal
								$("#RemapModalLabel").html(modalTitle);
								$("#RemapModalContent").html(
										modalContent);
								$('#RemapModal').modal({
									keyboard : true,
									show : true,
								});
								// do search on selected item
								$(".modalItem")
										.on(
												'click',
												function() {
													globalRxcui = $(
															this)
															.html()
															.split("(")[0];
													$('#RemapModal')
															.modal(
																	'hide');
													search(
															"RXCUI",
															globalRxcui,
															true);
												});

							} else {

								if (confirm("Selected RXCUI = "
										+ searchTerm
										+ " is obsolete and has been remapped to new Concept RXCUI = "
										+ minConcept[0].rxcui) == true) {

									output = minConcept[0].rxcui;
								}
							}

						} else if (status == "Retired") {
							showRetiredMsg(searchTerm);
						} else {
							noSearchFound(searchTerm);
						}

					}

				}
			});
			return output;
		}

	} else if (searchBy == "String") {
		if (searchTerm.toLowerCase() in reformulationStrRxcui) {
			var rxcui1 = reformulationStrRxcui[searchTerm.toLowerCase()];
			var rxcui2 = reformulationRxcuisHash[rxcui1];
			var str2 = reformulationStrHash[searchTerm.toLowerCase()];
			showReformulationModal(searchBy, rxcui1, searchTerm, rxcui2, str2);
			return "";
		} else {
			return getRxcuiFromString(searchTerm);
		}
	} else { // convert to rxcui from other ids
		return getRxcuiFromId(searchBy, searchTerm);
	}
}
function getNui() {
	$.ajax({
		type : "GET",
		dataType : "json",
		async : false,
		url : "https://rxnav.nlm.nih.gov/REST/Ndfrt/id?caller=RxNav&idType=RXCUI&idString="
				+ globalRxcui,
		success : function(data) {
			if (exists(data) && isArray(data.groupConcepts)
					&& exists(data.groupConcepts[0])) {
				$("#nuiDropDown select").html("");
				var concept = data.groupConcepts[0].concept;
				enableTabs("ndfTabCtrl");
				var selectContent = "";

				var drugKindNuis = new Array();
				var nuiNameMappings = new Object();
				for (var i = 0; i < concept.length; i++) {
					var conceptKind = concept[i].conceptKind;
					if (conceptKind == "DRUG_KIND") {
						nuiNameMappings[concept[i].conceptNui] = concept[i].conceptName;
						drugKindNuis.splice(drugKindNuis.length, 0,
								concept[i].conceptNui);
					}
				}
				globalNui = drugKindNuis[0];
				globalNdfrtName = nuiNameMappings[globalNui];
				for (var i = 0; i < drugKindNuis.length; i++) {
					selectContent += "<option value='"
							+ drugKindNuis[i] + "'>"
							+ nuiNameMappings[drugKindNuis[i]] + " | "
							+ drugKindNuis[i] + "</option>";

				}

				$("#nuiDropDown select").html(selectContent);
				if (drugKindNuis.length > 1) {
					$("#nuiDropDown").show();
					$("#nuiDropDown").css("padding-top", "5px");
					$("#nuiDropDown").css("margin-bottom", "10px");
					$("#nuiDropDown").css("height", "auto");
					// add action on click dropdown
					$("#nuiDropDown select").change(function() {
						globalNui = $(this).val().trim();
						globalNdfrtName = nuiNameMappings[globalNui];

						updateNDFRTPropTable();
						updateNdfrtRelationTable();
					});

				} else {
					$("#nuiDropDown").hide();
					$("#nuiDropDown").css("padding-top", "0px");
					$("#nuiDropDown").css("height", "0");
					$("#nuiDropDown").css("margin-bottom", "0");
				}

			} else {
				globalNui = "";
				disableTabs("ndfTabCtrl");

				if (currentTab == 'ndfTabCtrl') {

					$('[href=#graph]').tab('show');
					$('#ndfTabCtrl').removeClass('currentTabColor');
					$('#graphTabCtrl').addClass('currentTabColor');
					currentTab = "graphTabCtrl";
				}

			}
		},
		beforeSend : function(data) {
		},
		error : function(jq, status, errorMsg) {
			// alert("jq: " + JSON.stringify(jq) + "Status: " + status +
			// " Error: " + errorMsg);
			// alert("Network issue, please reload the page");
		},
		complete : function(jq, status) {
		}
	});
}

/**
 * 
 * @returns {Boolean}
 */
function updateAtcGraph() {
	// var o = false;
	$.ajax({
		type : "GET",
		dataType : "json",
		async : false,
		url : "https://rxnav.nlm.nih.gov/REST/atcjsongraph?caller=RxNav&rxcui="
				+ globalRxcui,
		success : function(data) {
			if (exists(data) && exists(data.jsonGraph)) {
				drawGraph(data, 'atc');
				// o = true;
			} else {
				drawGraph(null, 'atc');
			}
		},
		beforeSend : function(data) {
		},
		error : function(jq, status, errorMsg) {
			// alert("jq: " + JSON.stringify(jq) + "Status: " + status
			// + " Error: " + errorMsg);
		},
		complete : function(jq, status) {
		}
	});
	// return o;
}

/**
 * Update Mesh graph
 */
function updateMeshGraph() { // creates the mesh tree for ancestors
	console.log("updateMeshGraph called from rxnavAPI: creates the mesh tree for ancestors");
	// var o = false;
	$.ajax({
		type : "GET",
		dataType : "json",
		url : "https://rxnav.nlm.nih.gov/REST/rxcui/" + 7052
				+ "/property?caller=RxNav&propName=MESH",
		//gets the new code for mesh: for morphine sends rxcui:7052 and gets <propValue>D009020</propValue>
		async : false,
		success : function(data) {
			if (exists(data)
					&& exists(data.propConceptGroup)
					&& exists(data.propConceptGroup.propConcept[0])
					&& exists(data.propConceptGroup.propConcept[0].propValue)) {
				// o = true;
				var propValue = data.propConceptGroup.propConcept[0].propValue;
				// enableTabs("classTabCtrl");
				$.ajax({
					type : "GET",
					dataType : "json",
					url : "https://rxnav.nlm.nih.gov/REST/mesh/headingname?caller=RxNav&id="
							+ encodeURIComponent(propValue),
					// gets the name using the mesh ui d...
					success : function(data) {
						var meshName = data.name;

						$.ajax({
							type : "GET",
							dataType : "json",
							url : "https://rxnav.nlm.nih.gov/REST/mesh/pajsongraph?caller=RxNav&id="
									+ encodeURIComponent(propValue)
									+ "&name="
									+ encodeURIComponent(meshName),
							//returns a tree to the MESH root 
									/*<nodes>
									<id>D020228</id>
									<label>Pharmacologic Actions</label>
									<kind>PHARMACOLOGICACTION_KIND</kind>
									<type>class</type>
									<subType/>
									</nodes>
									<edges>
									<fromId>D009020</fromId>
									<toId>D009294</toId>
									<label/>
									</edges>*/
							success : function(data) {
								console.log(data);
								//drawGraph(data, 'mesh');
							},
							beforeSend : function(data) {
							},
							error : function(jq,
									status, errorMsg) {
								// alert("jq: " +
								// JSON.stringify(jq) +
								// "Status: " + status +
								// " Error: " +
								// errorMsg);
								// alert("Network issue,
								// please reload the
								// page");
							},
							complete : function(jq,
									status) {
							}

						});

					}
				});
			} else {
				drawGraph(null, 'mesh');
			}
		},
		beforeSend : function(data) {
		},
		error : function(jq, status, errorMsg) {
			// alert("jq: " + JSON.stringify(jq) + "Status: " + status +
			// " Error: " + errorMsg);
			// alert("Network issue,
			// please reload the
			// page");
		},
		complete : function(jq, status) {
		}

	});
	// return o;
}
/**
 * 
 * @param kind
 * @returns {Boolean}
 */
function updateNdfrtGraph(kind) {
	// var o = false;
	$.ajax({
		type : "GET",
		dataType : "json",
		async : false,
		url : "https://rxnav.nlm.nih.gov/REST/Ndfrt/ndfrtjsongraph?caller=RxNav&nui="
				+ encodeURIComponent(globalNui)
				+ "&kind="
				+ encodeURIComponent(kind),
		success : function(data) {
			if (exists(data) && exists(data.jsonGraph)) {
				drawGraph(data, kind);
				// o = true;
			} else {
				drawGraph(null, kind);
			}
		},
		beforeSend : function(data) {
		},
		error : function(jq, status, errorMsg) {
			// alert("jq: " + JSON.stringify(jq) + "Status: " + status +
			// "
			// Error: " + errorMsg);
		},
		complete : function(jq, status) {
		}
	});
	// return o;
}

function updateAtcGraph() {
	// var o = false;
	$.ajax({
		type : "GET",
		dataType : "json",
		async : false,
		url : "https://rxnav.nlm.nih.gov/REST/atcjsongraph?caller=RxNav&rxcui="
				+ globalRxcui,
		success : function(data) {
			if (exists(data) && exists(data.jsonGraph)) {
				drawGraph(data, 'atc');
				// o = true;
			} else {
				drawGraph(null, 'atc');
			}
		},
		beforeSend : function(data) {
		},
		error : function(jq, status, errorMsg) {
			// alert("jq: " + JSON.stringify(jq) + "Status: " + status
			// + " Error: " + errorMsg);
		},
		complete : function(jq, status) {
		}
	});
	// return o;
}

/**
 * 
 */
function updateInteractionTab() {
    var searchTerm="7052";
    $.ajax({
      type : "GET",
      dataType : "json",
      url : "https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?caller=RxNav&rxcui="
          + encodeURIComponent(searchTerm),
      success : function(data) {
        if (data) {
          console.log("Drug to Drug Interaction: ");
          console.log(data);
          //enableTabs("intrTabCtrl");
          $("#interDropDown select").html("");
          var interactionTypeGroup = data.interactionTypeGroup;
          var interactionType = interactionTypeGroup[0].interactionType;
          var tableContent = "";
          var selectContent = "";

          // now update interaction tables
          var shownRxcui = "";
          for (var it = 0; it < interactionType.length; it++) {

            var interactionPair = interactionType[it].interactionPair;
            var ingredientDrugName = interactionPair[0].interactionConcept[0].minConceptItem.name;
            var ingredientDrugRxcui = interactionPair[0].interactionConcept[0].minConceptItem.rxcui;
            selectContent += "<option value='"
                + ingredientDrugRxcui + "'>"
                + interactionPair.length
                + ' interacting drugs for '
                + ingredientDrugName + "</option>";
            if (it == 0) {
              shownRxcui = ingredientDrugRxcui;
            }
            tableContent += "<div class='table-responsive interTableClass' id='tableLinkfor"
                + ingredientDrugRxcui
                + "'><table class='table table-striped centerTablesClass'>"
                + "<thead><tr>"
                + "<th>NAME</th><th>DESCRIPTION</th></tr></thead><tbody>";
            for (var i = 0; i < interactionPair.length; i++) {

              var apair = interactionPair[i];
              var des = apair.description;
              var minConcept = apair.interactionConcept[1].minConceptItem;
              var rxcui = minConcept.rxcui;
              var name = minConcept.name;

              tableContent += "<tr class='interactionRow' data-toggle='tooltip' data-placement='top' title='"
                  + rxcui
                  + "' id='irxcui|"
                  + rxcui
                  + "'><td>"
                  + name
                  + "</td><td>"
                  + des
                  + "</td></tr>";
            }
            tableContent += "</tbody></table></div>";

          }

          $("#interDropDown select").html(selectContent);
          $("#interMainContent").html(tableContent);

          $(".interTableClass").hide();
          $("#tableLinkfor" + shownRxcui).show();

          // if (interactionType.length > 1) {
          $("#interDropDown").show();
          $("#interDropDown").css("padding-top", "5px");
          $("#interDropDown").css("height", "auto");
          $("#interDropDown").css("margin-bottom", "10px");
          // add action on click dropdown

          $("#interDropDown select").change(function() {
            shownRxcui = $(this).val().trim();
            $(".interTableClass").hide();
            $("#tableLinkfor" + shownRxcui).show();
          });

          // } else {
          // $("#interDropDown").hide();
          // $("#interDropDown").css("padding-top", "0px");
          // $("#interDropDown").css("height", "0");
          // $("#interDropDown").css("margin-bottom", "0");
          // }

          $(".interactionRow").hover(
              function() {
                $(this).css("cursor", "pointer").css(
                    "background-color", "#94EECA");
              });
          /*$('tr[data-toggle="tooltip"]').tooltip({
            container : '#interMainContent'// this is
          // importat
          });*/

          /*registerTableSorterClass("table table-striped centerTablesClass");
          registerClickInteraction();*/

        } else {

          /*disableTabs("intrTabCtrl");

          if (currentTab == 'intrTabCtrl') {
            $('[href=#graph]').tab('show');
            $('#intrTabCtrl').removeClass('currentTabColor');
            $('#graphTabCtrl').addClass('currentTabColor');
            currentTab = "graphTabCtrl";
          }*/

        }
      },
      beforeSend : function(data) {
      },
      error : function(jq, status, errorMsg) {
        // alert("jq: " + JSON.stringify(jq) + "Status: " + status +
        // " Error: " + errorMsg);
        // alert("Network issue,
        // please reload the
        // page");
      },
      complete : function(jq, status) {
      }
    });

}
/**
 * 
 * @param concept
 * @returns
 */
function getRxnavstr(concept) {

	var rxnavstr = concept.rxnavstr;
	if (rxnavstr == "") {
		rxnavstr = concept.name;
	}
	return rxnavstr;
}
function displaySearchContent() {
	console.log("displaySearchContent called from rxnavAPI");
	$.ajax({
		type : "GET",
		dataType : "json",
		url : "https://rxnav.nlm.nih.gov/REST/rxcui/" + 7052//globalRxcui
				+ "/allrelatedextension?caller=RxNav",
		async : true,
		success : function(data) {
			var conceptGroup=data.allRelatedGroup.conceptGroup;
			if (exists(conceptGroup)) {
				for (var i = 0; i < conceptGroup.length; i++) {
					var val = conceptGroup[i];
					var tty = val.tty;
					console.log("All related extension TTY: "+tty);
					if (val.conceptProperties != null) {
						var concepts = val.conceptProperties;
						console.log("Concepts: "+concepts);
						for (var k = 0; k < concepts.length; k++) {
							console.log(getRxnavstr(concepts[k])+" TTY: "+tty, "pres: "+concepts[k].pres,
							"inferedhuman: "+concepts[k].inferedhuman + "humandrug: "+concepts[k].humandrug,
							"inferedvet: "+concepts[k].inferedvet + "vetdrug: "+concepts[k].vetdrug);
						}
					}
				}
				/*updateClassicView(data);
				updateSimpleView(data);
				registerClick();

				// update title
				updateMainTitle();
				updateHistoryData();
				// update copy content
				$("#copyButton").attr("data-clipboard-text",
						globalRxcui + "\t" + preferedName);*/
			}
			//$('#myPleaseWait').modal('hide');
		},
		/*beforeSend : function(data) {
			$('#myPleaseWait').modal('show');
		},*/
		error : function(jq, status, errorMsg) {
			// alert("hey");
			// alert("jq: " + JSON.stringify(jq) + "Status: " + status +
			// " Error: " + errorMsg);
			// alert("Network issue, please reload the page");
		},
		complete : function(jq, status) {
		}
	});

}

/**
 * 
 * @param object
 * @returns {Boolean}
 */
function exists(object) {
	return ((typeof (object) != "undefined") && (object != null));
}

/**
 * 
 * @param object
 * @returns {Boolean}
 */
function isArray(object) {
	return ((typeof (object) != "undefined") && (object != null)
			&& (typeof (object.length) != "undefined") && (object.length > 0));
}