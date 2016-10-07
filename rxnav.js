//Global Variables
var globalRxcui = "";
var globalNui = "";
var globalNdfrtName = "";
var autoList = [];
var switchView = "";
var lastEmbed = null;
var lastEventListener = null;
var searchBy = "";
var displayName = "";
var preferedName = "";
var namer = "";
var ndfrtVersion = "";
var interVersion = "";
var disClaim = "";
var rxnormVersion = '';
var ndc11ImageHash = new Object();
var ndc11ImageHash2 = new Object();
var cache = [];
var termVersion = '';
var selectedDose = 'doseGroup';
// var bnImageContent = "";
var inImageContent = "";
var minImageContent = "";
var onSwitch = 1;
var currentTab = "graphTabCtrl";
var globalPart = '';
var tabID = "";
var selectedGraphId = "action";// default ATC button
var selectedPropName = "Attributes";
var selectedNdfrtProp = "propButton";
var roleClassificationOrder = new Object();
// reformulation hashtables
var reformulationStrStrHash = {};
var reformulationStrHash = {};
var reformulationRxcuisHash = {};
var reformulationRxcuiStr = {};
var reformulationStrRxcui = {};
var searchHistoryData = new Array();
// filter options
var humanDrug = false;
var vetDrug = false;
var presDrug = false;
var hasLegend = true;
// Links to DailyMed, Medline Plus,& Drug Info Portal
var DRUG_LABEL_URL_PREFIX = "https://dailymed.nlm.nih.gov/dailymed/rxcui.cfm?rxcui=";
var MEDLINE_URL_PREFIX = "https://apps.nlm.nih.gov/medlineplus/services/mpconnect_service.cfm?mainSearchCriteria.v.cs=2.16.840.1.113883.6.88&mainSearchCriteria.v.c=%20";
var DRUGPORTAL_URL_PREFIX = "http://druginfo.nlm.nih.gov/drugportal/dpdirect.jsp?name=";

var currentSelectedTab = "graph";

// role Classification hash
roleClassificationOrder["CI_ChemClass"] = "Ingredient";
roleClassificationOrder["CI_MoA"] = "Mechanism of Action";
roleClassificationOrder["CI_PE"] = "Physiologic Effect";
roleClassificationOrder["CI_with"] = "Disease";
roleClassificationOrder["effect_may_be_inhibited_by"] = "Disease";
roleClassificationOrder["has_Chemical_Structure"] = "Ingredient";
roleClassificationOrder["has_Ingredient"] = "Ingredient";
roleClassificationOrder["has_MoA"] = "Mechanism of Action";
roleClassificationOrder["has_PE"] = "Physiologic Effect";
roleClassificationOrder["has_PK"] = "Pharmacokinetics";
roleClassificationOrder["has_TC"] = "Disease";
roleClassificationOrder["has_active_metabolites"] = "Ingredient";
roleClassificationOrder["induces"] = "Disease";
roleClassificationOrder["may_diagnose"] = "Disease";
roleClassificationOrder["may_prevent"] = "Disease";
roleClassificationOrder["may_treat"] = "Disease";
roleClassificationOrder["may_treat_or_prevent"] = "Disease";
roleClassificationOrder["metabolized_by"] = "Pharmacokinetics";
roleClassificationOrder["site_of_metabolism"] = "Pharmacokinetics";
roleClassificationOrder["isa"] = "Drug";
roleClassificationOrder["Product_Component"] = "Drug";
roleClassificationOrder["has_DoseForm"] = "Dose Form";

var kindColorMapping = new Object();
kindColorMapping["DISEASE_KIND"] = "#BDC6DE";
kindColorMapping["DOSE_FORM_KIND"] = "#FFC6A5";
kindColorMapping["DRUG_KIND"] = "#C6EFF7";
kindColorMapping["INGREDIENT_KIND"] = "#CEEFBD";
kindColorMapping["MECHANISM_OF_ACTION_KIND"] = "#FFE7C6";
kindColorMapping["PHYSIOLOGIC_EFFECT_KIND"] = "#DEBDDE";
kindColorMapping["PHARMACOKINETICS_KIND"] = "#FFFFC6";
kindColorMapping["DRUG_INTERACTION_KIND"] = "#FEA7B8";
kindColorMapping["ATC_CLASS"] = "#CEEFBD";// "#90EE90";
kindColorMapping["PHARMACOLOGICACTION_KIND"] = "#CEEFBD";// "#90EE90";

var kindClassTypeMapping = new Object();
kindClassTypeMapping["DISEASE_KIND"] = "Disease";
kindClassTypeMapping["DRUG_KIND"] = "";// to be determined live
kindClassTypeMapping["INGREDIENT_KIND"] = "Chem";
kindClassTypeMapping["MECHANISM_OF_ACTION_KIND"] = "MoA";
kindClassTypeMapping["PHYSIOLOGIC_EFFECT_KIND"] = "PE";
kindClassTypeMapping["PHARMACOKINETICS_KIND"] = "PK";
kindClassTypeMapping["atc"] = "ATC1-4";
kindClassTypeMapping["mesh"] = "MESHPA";

var cy = null;
var cyLegend = null;

// browser detection
// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera
		|| navigator.userAgent.indexOf(' OPR/') >= 0;
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';
// At least Safari 3+: "[object HTMLElementConstructor]"
var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf(
		'Constructor') > 0;
// Internet Explorer 6-11
var isIE = /* @cc_on!@ */false || !!document.documentMode;
// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;
// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;
// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

/** Additional JQuery Functions* */
/**
 * single/double click
 */
jQuery.fn.single_double_click = function(single_click_callback,
		double_click_callback, timeout) {
	return this.each(function() {
		var clicks = 0, self = this;
		jQuery(this).click(function(event) {
			clicks++;
			if (clicks == 1) {
				setTimeout(function() {
					if (clicks == 1) {
						single_click_callback.call(self, event);
					} else {
						double_click_callback.call(self, event);
					}
					clicks = 0;
				}, timeout || 300);
			}
		});
	});
}

/**
 * check element has scrollbar
 */
jQuery.fn.hasScrollBarIH = function() {
	return this.get(0).scrollHeight > this.innerHeight();
};

/**
 * MAIN
 */
$(document)
		.ready(
				function() {

					writeRxNavLog("RxNav started");
					$("#clearSearch").click(function(e) {
						$("#searchTerm").val('');
						$(this).hide();
					});

					setInterval(function() {
						ObserveSearchInputChange($('#searchTerm').val());
					}, 100);

					// load rxnav global data
					getRxnormVersion();
					getRxTermsVersion();
					getVersionDisclaimer();
					loadReformulationMapping();
					loadIdTypes();
					loadAutoList();
					addHightlightAutocomplete();
					getNdfrtVersion();
					getTypeInfo();

					// add decorative tooltips
					addToolTips();

					// back/forward
					window.onpopstate = function(event) {
						var queryData = event.state;
						search(queryData.searchBy, queryData.searchTerm, false);
					};

					// resize
					resizeView();
					// reset tabs
					resetTabs();

					$(window).resize(function() {
						if (this.resizeTO)
							clearTimeout(this.resizeTO);
						this.resizeTO = setTimeout(function() {
							$(this).trigger('resizeEnd');
						}, 200);
					});
					$(window).bind('resizeEnd', function() {
						resizeView();
					});

					// side panel
					$("#openSidePanel").on("click", function() {
						openSidePanel();
					});
					$(".closeSideNav").on("click", function() {
						closeSideNav();
					});
					// copy
					var clipboard = new Clipboard("#copyButton");

					// disable autocomplete for non-string
					$("#searchById").change(function() {
						if ($(this).val().trim() == "String") {
							$("#searchTerm").autocomplete("enable");
						} else {
							$("#searchTerm").autocomplete("disable");
						}
					});
					$("#expandall")
							.click(
									function() {
										if ($(this).html() == "Collapse All") {
											$(".mainLink").children('li')
													.hide();
											$(".mainLink>.plusMinus")
													.attr('src',
															'resources/img/rxnav/plus-list.png');
											$('#expandall').html("Expand All");
										} else {
											$(".mainLink").children('li')
													.show();
											$(".mainLink>.plusMinus")
													.attr('src',
															'resources/img/rxnav/minus-list.png');
											$('#expandall')
													.html("Collapse All");
											updateWithFilterSimple();
										}
										showExtraTitle();
									});
					// Action Button for Legend Svg
					$("#legendBtn").on('click', function() {
						if (hasLegend) {
							$('#legendSection').hide();
							$("#legendBtn").html('Show Legend');
							hasLegend = false;
							resizeView();
						} else {
							$('#legendSection').show();
							$("#legendBtn").html('Hide Legend');
							hasLegend = true;
							resizeView();
						}

					});
					// human/vet filter
					$("#hvpFilter input").each(function() {
						$(this).prop("checked", false);
					});

					$("#hvpFilter input").click(
							function() {
								var value = $(this).val();
								if ($(this).prop("checked")) {
									$(this).siblings('span').addClass(
											'itemSelected')
									if (value == "human") {
										humanDrug = true;
									} else if (value == "vet") {
										vetDrug = true;
									} else {
										presDrug = true;
									}
								} else {
									$(this).siblings('span').removeClass(
											'itemSelected')
									if (value == "human") {
										humanDrug = false;
									} else if (value == "vet") {
										vetDrug = false;
									} else {
										presDrug = false;
									}
								}
								updateWithFilter();
							});

					$("#about").click(function() {
						$("#aboutModal").modal();
					});
					$("#disclaimer").click(function() {
						$("#disclaimerModal").modal();
					});

					// drug links Event Handler
					$("#drugLabelId").click(function() {
						var url = DRUG_LABEL_URL_PREFIX + globalRxcui;
						window.open(url, "_blank");
					});

					$("#medlineplusId").click(function() {
						var url = MEDLINE_URL_PREFIX + globalRxcui + "%20";
						window.open(url, "_blank");
					});

					$("#drugInfoId").click(
							function() {
								var url = DRUGPORTAL_URL_PREFIX
										+ displayName.replace(" ", "%20");
								window.open(url, "_blank");
							});

					// add popover to image
					$('#history')
							.click(
									function() {
										$('#history')
												.popover(
														{
															html : true,
															trigger : 'manual',
															placement : 'bottom',
															title : 'Search History<a class="close" href="#");">&times;</a>',
															content : function() {
																return composeHistoryContent();
															}
														});

										$('#history').popover("toggle");
										$("div.modalItem")
												.click(
														function() {
															$('#history')
																	.popover(
																			"hide");
															globalRxcui = stripHistoryId($(
																	this).attr(
																	'id'));
															search(
																	"RXCUI",
																	globalRxcui,
																	true);

														});
									});

					$('#history').click(function(e) {
						e.stopPropagation();
					});

					$(document).click(
							function(e) {
								if (($('.popover').has(e.target).length == 0)
										|| $(e.target).is('.close')) {
									$('#history').popover('hide');
								}
							});

					// search action
					$("#submit").click(
							function(e) {
								e.preventDefault();
								var searchTerm = $("#searchTerm").val().trim();
								if (searchTerm.length > 0) {
									var searchBy = $(
											"#searchById option:selected")
											.text();
									search(searchBy, searchTerm, false);
								} else {
									alert("Query is empty");
								}
							});

					// RXNorm actions
					$("#ttClassic").click(function() {
						$("#simpleView").hide();
						$("#simpTableTitle").hide();
						$("#classicView").show();
						$("#classicTableTitle").show();
						$("#expandall").hide();
						writeRxNavLog("Classic View Clicked");
					});

					$("#ttSimple").click(function() {
						$("#classicView").hide();
						$("#classicTableTitle").hide();
						$("#simpleView").show();
						$("#expandall").show();
						writeRxNavLog("Simple View Clicked");
					});

					$("input[name='dosefilter']")
							.click(
									function() {

										var tmpId = $(this).attr('id');
										if (selectedDose == tmpId) {
											// do nothing
										} else {
											selectedDose = tmpId;
											if (selectedDose == 'doseGroup') {
												$("#scdfTable").hide();
												$("#dfTable").hide();
												$("#sbdfTable").hide();
												$("#scdgTable")
														.show()
														.siblings('.tableTitle')
														.children(
																'.tableTitleContent')
														.html(
																"<label class='hideTitle'>Clinical Dose Form Group");
												$("#scdgTable")
														.show()
														.siblings('.tableTitle')
														.children('.tableTty')
														.html("SCDG");

												$("#dfgTable")
														.show()
														.siblings('.tableTitle')
														.children(
																'.tableTitleContent')
														.html(
																"<label class='hideTitle'>Dose Form Group");

												$("#dfgTable").show().siblings(
														'.tableTitle')
														.children('.tableTty')
														.html("DFG");

												$("#sbdgTable")
														.show()
														.siblings('.tableTitle')
														.children(
																'.tableTitleContent')
														.html(
																"<label class='hideTitle'>Branded Dose Form Group");

												$("#sbdgTable")
														.show()
														.siblings('.tableTitle')
														.children('.tableTty')
														.html("SBDG");

												updateWithFilterClassicWithId("scdgTable");
												updateWithFilterClassicWithId("dfgTable");
												updateWithFilterClassicWithId("sbdgTable");
												$("#doseGroup")
														.siblings('span')
														.addClass(
																'itemSelected');
												$("#doseForm").siblings('span')
														.removeClass(
																'itemSelected');
											} else {
												$("#scdfTable")
														.show()
														.siblings('.tableTitle')
														.children(
																'.tableTitleContent')
														.html(
																"<label class='hideTitle'>Clinical Drug Form");
												$("#scdfTable")
														.show()
														.siblings('.tableTitle')
														.children('.tableTty')
														.html("SCDF");

												$("#dfTable")
														.show()
														.siblings('.tableTitle')
														.children(
																'.tableTitleContent')
														.html(
																"<label class='hideTitle'>Dose Form");

												$("#dfTable").show().siblings(
														'.tableTitle')
														.children('.tableTty')
														.html("DF");

												$("#sbdfTable")
														.show()
														.siblings('.tableTitle')
														.children(
																'.tableTitleContent')
														.html(
																"<label class='hideTitle'>Branded Drug Form");

												$("#sbdfTable")
														.show()
														.siblings('.tableTitle')
														.children('.tableTty')
														.html("SBDF");

												$("#scdgTable").hide();
												$("#dfgTable").hide();
												$("#sbdgTable").hide();

												updateWithFilterClassicWithId("scdfTable");
												updateWithFilterClassicWithId("dfTable");
												updateWithFilterClassicWithId("sbdfTable");
												$("#doseGroup")
														.siblings('span')
														.removeClass(
																'itemSelected');
												$("#doseForm").siblings('span')
														.addClass(
																'itemSelected');
											}

										}
									});

					// $('#classTabCtrl').on('shown.bs.tab', function(e) {
					// cy.resize();
					// cy.fit();
					// cyLegend.resize();
					// cyLegend.fit();
					// });

					// $('#classTabCtrl').on('click', function(e) {
					// setTimeout(function() {
					// cy.resize();
					// cy.fit();
					// cyLegend.resize();
					// cyLegend.fit();
					// }, 200);
					// });

					// default
					$('#classViewList').on('click', 'li', function() {
						selectedGraphId = $(this).attr("id");
						triggerGraphClick();
					});

					$('#tabList').on(
							'click',
							'li',
							function() {
								closeSideNav();// if opened
								if (!$(this).hasClass('disabled')) {
									$('#tabList').children().children('a')
											.removeClass("currentTabColor");
									$(this).children('a').addClass(
											"currentTabColor");
									currentTab = $(this).children('a').attr(
											"id");
									// add timeout for this tab only
									if (currentTab == "classTabCtrl") {
										setTimeout(function() {
											if (cy != null) {
												cy.resize();
												cy.fit();
											}
											if (cyLegend != null) {
												cyLegend.resize();
												cyLegend.fit();
											}
										}, 200);
									}
									//
									writeRxNavLog(currentTab + " Clicked");
								}
							});

					$('#mainList').on(
							'click',
							'li',
							function() {
								// unselect other
								$('#mainList').children().children('a')
										.removeClass("itemSelected");
								$(this).children('a').addClass("itemSelected");
							});
					$('#ndfrtViewList').on(
							'click',
							'li',
							function() {
								// unselect other
								$('#ndfrtViewList').children().children('a')
										.removeClass("itemSelected");
								$(this).children('a').addClass("itemSelected");
								var id = $(this).attr("id");
								selectedNdfrtProp = id;
								showSelectedNDFRTPropView();
							});

					$('#propViewList')
							.on(
									'click',
									'li',
									function() {
										selectedPropName = $(this)
												.children('a').html();
										// unselect other
										$('#propViewList').children().children(
												'a')
												.removeClass("itemSelected");
										$(this).children('a').addClass(
												"itemSelected");
										updateRxNormPropertiesTab();
									});

					// search before load if needed
					if (usearchTerm != null && usearchTerm.length > 0) {
						setTimeout(function() {
							search(usearchBy, usearchTerm, false);
						}, 1200);
					}

				});

/**
 * 
 */
function openSidePanel() {
	// show it
	$(".sidenav").css("width", "250px");
	$("#sideMenuClone").html("");
	switch (currentTab) {
	case "graphTabCtrl":
		$("#graph>div>.sideMenu").clone(true, true).appendTo("#sideMenuClone");
		$("#graph>div>.sideMenu").html("");
		break;
	case "propertiesTabCtrl":
		$("#properties>div>.sideMenu").clone(true, true).appendTo(
				"#sideMenuClone");
		$("#properties>div>.sideMenu").html("");
		break;
	case "ndcTabCtrl":
		$("#ndc>div>.sideMenu").clone(true, true).appendTo("#sideMenuClone");
		$("#ndc>div>.sideMenu").html("");
		break;
	case "termTabCtrl":
		$("#terms>div>.sideMenu").clone(true, true).appendTo("#sideMenuClone");
		$("#terms>div>.sideMenu").html("");
		break;
	case "ndfTabCtrl":
		$("#ndf>div>.sideMenu").clone(true, true).appendTo("#sideMenuClone");
		$("#ndf>div>.sideMenu").html("");
		break;
	case "pillTabCtrl":
		$("#pill>div>.sideMenu").clone(true, true).appendTo("#sideMenuClone");
		$("#pill>div>.sideMenu").html("");
		break;
	case "classTabCtrl":
		$("#class>div>.sideMenu").clone(true, true).appendTo("#sideMenuClone");
		$("#class>div>.sideMenu").html("");
		break;
	case "intrTabCtrl":
		$("#act>div>.sideMenu").clone(true, true).appendTo("#sideMenuClone");
		$("#act>div>.sideMenu").html("");
		break;
	default:
		alert("nothing to do");
	}
}

/**
 * 
 */
function closeSideNav() {
	if (exists($("#sideMenuClone>.sideMenu").children().attr("class"))) {
		switch (currentTab) {
		case "graphTabCtrl":
			$("#sideMenuClone>.sideMenu").children().clone(true, true)
					.appendTo("#graph>div>.sideMenu");
			break;
		case "propertiesTabCtrl":
			$("#sideMenuClone>.sideMenu").children().clone(true, true)
					.appendTo("#properties>div>.sideMenu");
			break;
		case "ndcTabCtrl":
			$("#sideMenuClone>.sideMenu").children().clone(true, true)
					.appendTo("#ndc>div>.sideMenu");
			break;
		case "termTabCtrl":
			$("#sideMenuClone>.sideMenu").children().clone(true, true)
					.appendTo("#terms>div>.sideMenu");
			break;
		case "ndfTabCtrl":
			$("#sideMenuClone>.sideMenu").children().clone(true, true)
					.appendTo("#ndf>div>.sideMenu");
			break;
		case "pillTabCtrl":
			$("#sideMenuClone>.sideMenu").children().clone(true, true)
					.appendTo("#pill>div>.sideMenu");
			break;
		case "classTabCtrl":
			$("#sideMenuClone>.sideMenu").children().clone(true, true)
					.appendTo("#class>div>.sideMenu");
			break;
		case "intrTabCtrl":
			$("#sideMenuClone>.sideMenu").children().clone(true, true)
					.appendTo("#act>div>.sideMenu");
			break;
		default:
			alert("nothing to do");
		}
	}
	$(".sidenav").css("width", "0px");
	$("#sideMenuClone").html("");
}

/**
 * 
 */
function writeRxNavLog(msg) {

	$.ajax({
		type : "GET",
		dataType : "json",
		url : "https://rxnav.nlm.nih.gov/REST/log?caller=RxNav&msg=" + msg,
		success : function(data) {
		}
	});
}

/**
 * Add tooltips
 */
function addToolTips() {
	// submit
	$('#submit').tooltip();
	$("#helpqa>a").tooltip();
	$('#humanFilterImg').tooltip();
	$('#vetFilterImg').tooltip();
	$('#presFilterImg').tooltip();
	// search tool tip
	$('#searchById').tooltip({
		title : "Choose Search Criteria",
		placement : "top"
	});

	// info button tool tip
	$('#infoBtn').tooltip({
		title : "Search Type Info Button",
		placement : "top"
	});
	// DropDown NUI tool tip
	$('#nuiDropDown').tooltip({
		title : "Select Concept",
		placement : "top"
	});

	// Tab tool tips
	$('#graphTabTip').tooltip({
		title : "View Different RxNorm Graph Selections",
		placement : "top"
	});
	// Prop tab
	$('#propertiesTabTip').tooltip({
		title : "Show RxNorm Properties Information",
		placement : "top"
	});

	// Ndc tab
	$('#ndcTabTip').tooltip({
		title : "Show NDCs Information",
		placement : "top"
	});
	// Term tab
	$('#termTabTip').tooltip({
		title : "Show RxTerms Information",
		placement : "top"
	});
	// ndfrt tab
	$('#ndfTabTip').tooltip({
		title : "Show NDF-RT Information",
		placement : "top"
	});
	// pill tab
	$('#pillTabTip').tooltip({
		title : "View Pill Images of Drug",
		placement : "top"
	});

	// class tab
	$('#classTabTip').tooltip({
		title : "Show Drug's Relation to Drug Class",
		placement : "top"
	});

	// interaction tab
	$('#intrTabTip').tooltip({
		title : "Show Interaction with Other Drugs",
		placement : "top"
	});

	// class View tool tips
	$('#action').tooltip({
		title : "ATC",
		placement : "top"
	});
	$('#mesh').tooltip({
		title : "MESH",
		placement : "top"
	});
	$('#drugButton').tooltip({
		title : "Drug",
		placement : "top"
	});
	$('#diseaseButton').tooltip({
		title : "Disease",
		placement : "top"
	});
	$('#doseButton').tooltip({
		title : "Dose Form",
		placement : "top"
	});

	$('#mechButton').tooltip({
		title : "Mechanism of Action",
		placement : "top"
	});
	$('#ingButton').tooltip({
		title : "Ingredients",
		placement : "top"
	});
	$('#pharmButton').tooltip({
		title : "Pharmacokinetics",
		trigger : 'hover',
		placement : "top"
	});
	$('#effButton').tooltip({
		title : "Physiologic Effect",
		placement : "top"
	});

	$('#drugLabelId').tooltip({
		title : "Go To DailyMed",
		placement : "top"
	});

	$('#medlineplusId').tooltip({
		title : "Go To Medline Plus",
		placement : "top"
	});

	$('#drugInfoId').tooltip({
		title : "Go To Drug Info",
		placement : "top"
	});
}

/**
 * Load Autocomplete List
 */
function loadAutoList() {
	$
			.ajax({
				type : "GET",
				dataType : "json",
				url : "https://rxnav.nlm.nih.gov/REST/displaynames.json?caller=RxNav",
				success : function(data) {
					var newData = data.displayTermsList.term;
					$("#searchTerm")
							.autocomplete(
									{
										minLength : 4,
										select : function(event, ui) {
											if (ui.item) {
												search("String", ui.item.value,
														false);
											}
										},
										source : function(request, response) {
											var term = $.ui.autocomplete
													.escapeRegex(request.term), startsWithMatcher = new RegExp(
													"^" + term, "i"), startsWith = $
													.grep(
															newData,
															function(value) {
																return startsWithMatcher
																		.test(value.label
																				|| value.value
																				|| value);
															}), containsMatcher = new RegExp(
													term, "i"), contains = $
													.grep(
															newData,
															function(value) {
																return $
																		.inArray(
																				value,
																				startsWith) < 0
																		&& containsMatcher
																				.test(value.label
																						|| value.value
																						|| value);
															});

											response(startsWith
													.concat(contains));
										}
									});
					// .keyup(function(e) {
					// if (e.which === 13) {
					// $("#searchTerm").autocomplete("close");
					// }
					// });
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
}

/**
 * Load IdTypes
 */
function loadIdTypes() {

	$.ajax({
		type : "GET",
		dataType : "json",
		url : "https://rxnav.nlm.nih.gov/REST/idtypes.json?caller=RxNav",
		async : false,
		success : function(data) {
			var idName = data.idTypeList.idName;
			for (var i = 0; i < idName.length; i++) {
				var val = idName[i];

				$('#searchById').append(
						"<option value='" + val + "'>" + val + "</option>");

			}
		},
		beforeSend : function(data) {
		},
		error : function(jq, status, errorMsg) {
			// alert("jq: " + JSON.stringify(jq) + "Status: " + status + "
			// Error: " + errorMsg);
		},
		complete : function(jq, status) {
		}
	});
}

/**
 * Get Drug Name for given RxCUI
 * 
 * @param inputRxcui
 * @returns {String}
 */
function getDrugName(inputRxcui) {
	var namer = "";
	$.ajax({
		type : "GET",
		dataType : "json",
		url : "https://rxnav.nlm.nih.gov/REST/rxcui/"
				+ encodeURIComponent(inputRxcui)
				+ "/properties.json?caller=RxNav",
		async : false,
		success : function(data) {
			if (exists(data.properties)) {
				namer = data.properties.name;
			}
		},
		beforeSend : function(data) {
		},
		error : function(jq, status, errorMsg) {
			// alert("jq: " + JSON.stringify(jq) + "Status: " + status + "
			// Error: " + errorMsg);
			// alert("Network issue, please reload the page");
		},
		complete : function(jq, status) {
		}

	});
	return namer;
}

/**
 * load drug interaction disclaimer/and version
 */
function getVersionDisclaimer() {
	$
			.ajax({
				type : "GET",
				dataType : "json",
				url : "https://rxnav.nlm.nih.gov/REST/interaction/version?caller=RxNav",
				success : function(data) {
					disClaim = data.nlmDisclaimer;

					interVersion = data.sourceVersionList.sourceVersion;

					$("#interVersion").html(
							"<a target='_blank' href='https://www.drugbank.ca'>"
									+ interVersion.split(":")[0]
									+ "</a>, version:"
									+ interVersion.split(":")[1])
				},
				beforeSend : function(data) {
				},
				error : function(jq, status, errorMsg) {
					// alert("jq: " + JSON.stringify(jq) + "Status: " + status +
					// "
					// Error: " + errorMsg);
					// alert("Network issue,
					// please reload the
					// page");
				},
				complete : function(jq, status) {
				}
			});

}
/**
 * get RxNorm Version
 */
function getRxnormVersion() {
	$
			.ajax({
				type : "GET",
				dataType : "json",
				url : "https://rxnav.nlm.nih.gov/REST/version?caller=RxNav",
				success : function(data) {
					rxnormVersion = data.version;
					$("#rxnormVersion")
							.html(
									"<a target='_blank' href='https://www.nlm.nih.gov/research/umls/rxnorm/'>RxNorm</a>, version:"
											+ rxnormVersion)
				},
				beforeSend : function(data) {
				},
				error : function(jq, status, errorMsg) {
					// alert("jq: " + JSON.stringify(jq) + "Status: " + status +
					// "
					// Error: " + errorMsg);
					// alert("Network issue,
					// please reload the
					// page");
				},
				complete : function(jq, status) {
				}

			});

}

/**
 * get RxTerms version
 */
function getRxTermsVersion() {
	$
			.ajax({
				type : "GET",
				dataType : "json",
				url : "https://rxnav.nlm.nih.gov/REST/RxTerms/version?caller=RxNav",
				success : function(data) {
					termVersion = data.rxtermsVersion;
					$("#termVersion")
							.html(
									"<a target='_blank' href='https://wwwcf.nlm.nih.gov/umlslicense/rxtermApp/rxTerm.cfm'>RxTerms</a>, version:"
											+ termVersion
													.replace("RxTerms", ""))

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
 * get NDF-RT Version
 */
function getNdfrtVersion() {
	$
			.ajax({
				type : "GET",
				dataType : "json",
				url : "https://rxnav.nlm.nih.gov/REST/Ndfrt/version?caller=RxNav",
				success : function(data) {
					ndfrtVersion = data.version.versionName;
					$("#ndfrtVersion")
							.html(
									"<a target='_blank' href='http://evs.nci.nih.gov/ftp1/NDF-RT/'>NDF-RT</a>, version:"
											+ ndfrtVersion)
				},
				beforeSend : function(data) {
				},
				error : function(jq, status, errorMsg) {
					// alert("jq: " + JSON.stringify(jq) + "Status: " + status
					// + " Error: " + errorMsg);
					// alert("Network issue, please reload the page");
				},
				complete : function(jq, status) {
				}
			});

}

/**
 * get type info
 */
function getTypeInfo() {
	$("#infoBtn").on('click', function() {
		$.ajax({
			type : "GET",
			dataType : "text",
			url : "resources/druginfo.txt",
			success : function(data) {
				var modalTitle = "Type Info";
				$("#TypeInfoModalLabel").html(modalTitle);
				$("#TypeInfoModalContent").html(data);
				$('#TypeInfoModal').modal({
					keyboard : true,
					show : true,
				});

				$(".clickableLink").click(function() {
					$('#TypeInfoModal').modal('hide');
					var id_value = $(this).attr("id").split("|");
					search(id_value[0], id_value[1], false);
				});
			},
			beforeSend : function(data) {
			},
			error : function(jq, status, errorMsg) {
				// alert("jq: " + JSON.stringify(jq) + "Status: " + status
				// + " Error: " + errorMsg);
				// alert("Network issue, please reload the page");
			},
			complete : function(jq, status) {
			}
		});

	});
}

/**
 * load reformulation mapping
 */
function loadReformulationMapping() {
	$
			.ajax({
				type : "GET",
				dataType : "json",
				url : "https://rxnav.nlm.nih.gov/REST/reformulationConcepts?caller=RxNav",
				success : function(data) {
					if (exists(data)
							&& isArray(data.reformulationConceptList.reformulationConcept)) {
						var reformulationConcepts = data.reformulationConceptList.reformulationConcept;
						for (var i = 0; i < reformulationConcepts.length; i++) {
							var rxcui1 = reformulationConcepts[i].rxcui;
							var name1 = reformulationConcepts[i].name;
							var rxcui2 = reformulationConcepts[i].reformulatedRxcui;
							var name2 = reformulationConcepts[i].reformulatedName;
							var name1Key = name1.toLowerCase();
							reformulationStrHash[name1Key] = name2;
							reformulationStrStrHash[name1Key] = name1;
							reformulationRxcuisHash[rxcui1] = rxcui2;
							reformulationRxcuiStr[rxcui1] = name1;
							reformulationStrRxcui[name1Key] = rxcui1;
						}
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
}

/**
 * custom sorting of some tables
 * 
 * @param id
 */
function registerTableSorter(id) {

	if (id == "ndcTableId") {
		$("table[id='" + id + "']").tablesorter({
			theme : 'blue',
			sortList : [ [ 0, 0 ], [ 1, 0 ] ],
			headerTemplate : '{content}{icon}',
		});
	} else if (id == "intrTableId") {
		$("table[id='" + id + "']").tablesorter({
			theme : 'blue',
			sortList : [ [ 0, 0 ] ],
			headerTemplate : '{content}{icon}',
		});
	} else if (id == "ndfRelaTableId") {
		$("table[id='" + id + "']").tablesorter({
			theme : 'blue',
			sortList : [ [ 0, 0 ], [ 2, 0 ], [ 3, 0 ] ],
			headerTemplate : '{content}{icon}',

		});
	} else {
		$("table[id='" + id + "']").tablesorter({
			theme : 'blue',
			sortList : [ [ 0, 0 ] ],
			headerTemplate : '{content}{icon}',
		});
	}
}

/**
 * 
 * @param className
 */
function registerTableSorterClass(className) {
	$("table[class='" + className + "']").tablesorter({
		theme : 'blue',
		sortList : [ [ 0, 0 ] ],
		headerTemplate : '{content}{icon}',
	});
}
/**
 * register click on row
 */
function registerClick() {
	$(".hasHVP td, .hasHVP p,li.hasHVP, tr.interactionRow")
			.single_double_click(
					function() {
						var parentTableId = $(this)
								.closest('.classicViewTable').attr('id');
						if (exists(parentTableId)// not click on df stuffs
								&& (parentTableId == 'dfgTable' || parentTableId == 'dfTable')) {
							return;
						}
						globalRxcui = $(this).attr('id').split("|")[1];// second
						search("RXCUI", globalRxcui, true);
					});
}

/**
 * 
 */
function registerClickInteraction() {
	$("tr.interactionRow").single_double_click(function() {
		globalRxcui = $(this).attr('id').split("|")[1];// second
		search("RXCUI", globalRxcui, true);
	});
}
/**
 * 
 */
function triggerGraphClick() {
	// unselect other
	$('#classViewList').children().children('a').removeClass("itemSelected");
	$("#" + selectedGraphId).children('a').addClass("itemSelected");

	switch (selectedGraphId) {
	case "mesh":
		updateMeshGraph();
		drawLegend("mesh");
		break;
	case "drugButton":
		updateNdfrtGraph("DRUG_KIND");
		drawLegend("DRUG_KIND");
		break;
	case "diseaseButton":
		updateNdfrtGraph("DISEASE_KIND");
		drawLegend("DISEASE_KIND");
		break;
	case "doseButton":
		updateNdfrtGraph("DOSE_FORM_KIND");
		drawLegend("DOSE_FORM_KIND");
		break;
	case "ingButton":
		updateNdfrtGraph("INGREDIENT_KIND");
		drawLegend("INGREDIENT_KIND");
		break;
	case "mechButton":
		updateNdfrtGraph("MECHANISM_OF_ACTION_KIND");
		drawLegend("MECHANISM_OF_ACTION_KIND");
		break;
	case "pharmButton":
		updateNdfrtGraph("PHARMACOKINETICS_KIND");
		drawLegend("PHARMACOKINETICS_KIND");
		break;
	case "effButton":
		updateNdfrtGraph("PHYSIOLOGIC_EFFECT_KIND");
		drawLegend("PHYSIOLOGIC_EFFECT_KIND");
		break;
	default:
		updateAtcGraph();
		drawLegend("atc");
	}
}
/**
 * 
 * @param searchBy
 * @param rawSearchTerm,
 *            not encoded yet
 */
function search(searchBy, rawSearchTerm, hasGlobalRxcui) {
	if (isFirefox || isChrome) {
		$("#copyButton").show();
	}
	var searchTerm = rawSearchTerm.trim();
	if (!hasGlobalRxcui) {
		// resolve to RXCUI (rxnorm id)
		globalRxcui = getRxcui(searchBy, searchTerm);
		if (globalRxcui == "") {
			return;
		}
	}

	// we must update all tabs
	// for url links/preferedName
	displayName = getDrugName(globalRxcui);

	// update search form
	$("#searchTerm").val(searchTerm);

	var currentSearchBy = $("#searchById option:selected").text().trim();

	if (currentSearchBy != "RXCUI") {
		if (searchBy.trim() == "RXCUI") {
			// convert to string
			$("#searchById option[value='String']").prop('selected', true);
			$("#searchTerm").autocomplete("enable");
			$("#searchTerm").val(displayName);
		} else {
			$("#searchById option[value='" + searchBy + "']").prop('selected',
					true);
			if (searchBy.trim().toLowerCase() == "string") {
				$("#searchTerm").autocomplete("enable");
			} else {
				$("#searchTerm").autocomplete("disable");
			}
		}
	}

	resetTabs();
	updateAllTabs();

	// if it opens
	$("#searchTerm").autocomplete("close");
	// change state of url
	var queryData = {
		searchBy : searchBy,
		searchTerm : searchTerm,
	};
	var stateId = createStateId();
	window.history.pushState(queryData, stateId, "search?searchBy=" + searchBy
			+ "&searchTerm=" + searchTerm);
}

/**
 * 
 */
function updateHistoryData() {
	// push current search into history
	var dupIndex = -1;
	$.each(searchHistoryData, function(i, obj) {
		if (obj.data.preferedName == preferedName
				&& obj.data.rxcui == globalRxcui) {
			dupIndex = i;
			return false;
		}
	});

	// need to remove position of that object
	if (dupIndex >= 0) {
		searchHistoryData.splice(dupIndex, 1);
	}

	searchHistoryData.push({
		data : {
			preferedName : preferedName,
			rxcui : globalRxcui,
		}
	});
}

/**
 * 
 * @param id
 */
function updateAllTabs(id) {
	displaySearchContent();
	updateOtherTabs();
}
/**
 * 
 */
function displaySearchContent() {

	$.ajax({
		type : "GET",
		dataType : "json",
		url : "https://rxnav.nlm.nih.gov/REST/rxcui/" + globalRxcui
				+ "/allrelatedextension?caller=RxNav",
		async : true,
		success : function(data) {
			if (exists(data.allRelatedGroup.conceptGroup)) {
				updateClassicView(data);
				updateSimpleView(data);
				registerClick();

				// update title
				updateMainTitle();
				updateHistoryData();
				// update copy content
				$("#copyButton").attr("data-clipboard-text",
						globalRxcui + "\t" + preferedName);
			}
			$('#myPleaseWait').modal('hide');
		},
		beforeSend : function(data) {
			$('#myPleaseWait').modal('show');
		},
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
 * @param data
 */
function updateClassicView(data) {
	var conceptGroup = data.allRelatedGroup.conceptGroup;

	var inTableContent = '';
	var pinTableContent = '';
	var bnTableContent = '';
	var scdTableContent = '';
	var scdcTableContent = '';
	var sbdTableContent = '';
	var dfgTableContent = '';
	var scdgTableContent = '';
	var sbdcTableContent = '';
	var sbdgTableContent = '';

	var dfTableContent = '';
	var scdfTableContent = '';
	var sbdfTableContent = '';

	var minTableContent = '';
	var tableHeader = "<div class='tableEntry table-responsive'><table class='table table-striped'><tbody>";
	var tableFooter = "</tbody></table></div>";

	for (var i = 0; i < conceptGroup.length; i++) {
		var val = conceptGroup[i];
		var tty = val.tty;

		if (val.conceptProperties != null) {
			var concepts = val.conceptProperties;

			var tableContent = "";

			for (var k = 0; k < concepts.length; k++) {
				// var rxstr = concepts[k].rxnavstr;
				// alert(rxstr);
				var imageContent = genImage(tty, concepts[k].pres,
						concepts[k].inferedhuman + concepts[k].humandrug,
						concepts[k].inferedvet + concepts[k].vetdrug);

				if (concepts[k].rxcui == globalRxcui) {
					tableContent += "<tr class='hasHVP'> <td class='rowSelected' data-toggle='tooltip' data-placement='top' title='"
							+ concepts[k].rxcui
							+ "' id='crxcui|"
							+ concepts[k].rxcui
							+ "'>"
							+ imageContent
							+ "&nbsp;"
							+ getRxnavstr(concepts[k])
							+ "</td> </tr>";

					preferedName = getRxnavstr(concepts[k]);

				} else {
					tableContent += "<tr class='hasHVP'> <td data-toggle='tooltip' data-placement='top' title='"
							+ concepts[k].rxcui
							+ "' id='crxcui|"
							+ concepts[k].rxcui
							+ "'>"
							+ imageContent
							+ "&nbsp;"
							+ getRxnavstr(concepts[k])
							+ "</td> </tr>";
				}

			}

			if (tty == 'BN') {
				bnTableContent = tableContent;
			}

			// need method to load data even if order of tty
			// is
			// different
			if (tty == 'IN' || tty == 'MIN') {
				inTableContent += tableContent;
			}

			// ///////////////////////////////////////////////////////////

			if (tty == 'PIN') {
				pinTableContent = tableContent;
			}

			if (tty == 'SCDC') {
				scdcTableContent = tableContent;
			}

			if (tty == 'SBDC') {
				sbdcTableContent = tableContent;
			}

			// need method to load data even if order of tty
			// is
			// different
			if (tty == 'SCD' || tty == 'GPCK') {
				scdTableContent += tableContent;
			}

			if (tty == 'SBD' || tty == 'BPCK') {
				sbdTableContent += tableContent;
			}
			// ///////////////////////////////////////////////////////////
			if (tty == 'DFG') {
				dfgTableContent = tableContent;
			}

			if (tty == 'SCDG') {
				scdgTableContent = tableContent;
			}

			if (tty == 'SBDG') {
				sbdgTableContent = tableContent;
			}

			if (tty == 'DF') {
				dfTableContent = tableContent;
			}

			if (tty == 'SCDF') {
				scdfTableContent = tableContent;
			}

			if (tty == 'SBDF') {
				sbdfTableContent = tableContent;
			}
		}
	}

	// load into table
	//
	$("#bnTable").html(tableHeader + bnTableContent + tableFooter);

	//
	$("#inTable").html(tableHeader + inTableContent + tableFooter);

	//
	$("#pinTable").html(tableHeader + pinTableContent + tableFooter);
	//
	$("#scdcTable").html(tableHeader + scdcTableContent + tableFooter);

	//
	$("#sbdTable").html(tableHeader + sbdTableContent + tableFooter);

	//
	$("#scdTable").html(tableHeader + scdTableContent + tableFooter);

	//
	$("#sbdcTable").html(tableHeader + sbdcTableContent + tableFooter);

	//
	$("#dfgTable").html(tableHeader + dfgTableContent + tableFooter);
	//
	$("#scdgTable").html(tableHeader + scdgTableContent + tableFooter);
	//
	$("#sbdgTable").html(tableHeader + sbdgTableContent + tableFooter);

	//
	$("#dfTable").html(tableHeader + dfTableContent + tableFooter);
	//
	$("#scdfTable").html(tableHeader + scdfTableContent + tableFooter);
	//
	$("#sbdfTable").html(tableHeader + sbdfTableContent + tableFooter);
	// sorting, this maybe expensive
	$('.table.table-striped > tbody')
			.each(
					function() {
						$(this)
								.children('tr')
								.sort(
										function(a, b) {
											var aid = $(a).children('td').attr(
													'id');
											if (exists(aid)
													&& aid.split("|")[1] == globalRxcui) {
												return -1;
											}
											var bid = $(b).children('td').attr(
													'id');
											if (exists(bid)
													&& bid.split("|")[1] == globalRxcui) {
												return 1;
											}

											return $(a).text().toLowerCase() > $(
													b).text().toLowerCase() ? 1
													: -1;
										}).appendTo($(this));
					});

	updateWithFilterClassic();
	$('[data-toggle="tooltip"]').tooltip();

}

/**
 * 
 * @param data
 */
function updateSimpleView(data) {

	var conceptGroup = data.allRelatedGroup.conceptGroup;

	var bnsimpleViewHash = new Object();
	var bnHash = new Object();
	var bnRxcuiHash = new Object();
	var bnRxcuiHashAll = new Object();
	var bnRxcuiHolderHash = new Object();

	var insimpleViewHash = new Object();
	var inRxcuiHash = new Object();
	var inRxcuiHashAll = new Object();
	var inRxcuiHolderHash = new Object();

	var inminHash = new Object();
	var inminRxcuihash = new Object();

	var imageHash = new Object();

	var tableHeader = "<div class='tableEntry table-responsive'><table class='table table-striped'><tbody>";
	var tableFooter = "</tbody></table></div>";

	var existNOBN = false;
	var existNOINMIN = false;
	for (var i = 0; i < conceptGroup.length; i++) {
		var val = conceptGroup[i];
		var tty = val.tty;

		if (val.conceptProperties != null) {
			var concepts = val.conceptProperties;

			if (tty == "SBD" || tty == "BPCK") {
				for (var k = 0; k < concepts.length; k++) {
					var bnImageContent = genImage(tty, concepts[k].pres,
							concepts[k].inferedhuman + concepts[k].humandrug,
							concepts[k].inferedvet + concepts[k].vetdrug);
					var sbdRow = bnImageContent + "&nbsp;"
							+ getRxnavstr(concepts[k]);

					bnRxcuiHolderHash[sbdRow] = concepts[k].rxcui;
					// if exists BN for grouping
					if (exists(concepts[k].minConceptGroup)) {
						var minBNConcepts = concepts[k].minConceptGroup.minConcept;

						for (var m = 0; m < minBNConcepts.length; m++) {

							var bnName = minBNConcepts[m].rxcui; // getRxnavstr(minBNConcepts[m]);

							if (bnName in bnsimpleViewHash) {
								bnsimpleViewHash[bnName] = sbdRow + "|"
										+ bnsimpleViewHash[bnName];

							} else {
								bnsimpleViewHash[bnName] = sbdRow;
								// bnRxcuiHash[bnName] =
								// minBNConcepts[m].rxcui;
							}
						}
					} else {// the case of no BN?
						existNOBN = true;
						var bnName = "No Brand Name";
						if (bnName in bnsimpleViewHash) {
							bnsimpleViewHash[bnName] = sbdRow + "|"
									+ bnsimpleViewHash[bnName];

						} else {
							bnsimpleViewHash[bnName] = sbdRow;
						}

					}

				}

			}

			if (tty == "SCD" || tty == "GPCK") {
				for (var k = 0; k < concepts.length; k++) {
					var scdRxcui = concepts[k].rxcui;
					var scdName = getRxnavstr(concepts[k]);

					inImageContent = genImage(tty, concepts[k].pres,
							concepts[k].inferedhuman + concepts[k].humandrug,
							concepts[k].inferedvet + concepts[k].vetdrug);

					var sbdRow = inImageContent + "&nbsp;"
							+ getRxnavstr(concepts[k]);

					inRxcuiHolderHash[sbdRow] = concepts[k].rxcui;
					if (exists(concepts[k].minConceptGroup)) {
						var minINConcepts = concepts[k].minConceptGroup.minConcept;

						for (var m = 0; m < minINConcepts.length; m++) {

							var inName = minINConcepts[m].rxcui;// getRxnavstr(minINConcepts[m]);

							if (inName != null) {
								if (inName in insimpleViewHash) {

									insimpleViewHash[inName] = sbdRow + "|"
											+ insimpleViewHash[inName];
								} else {
									insimpleViewHash[inName] = sbdRow;
									// inRxcuiHash[inName] =
									// minINConcepts[m].rxcui;
								}
							}
						}

					} else {// no ingre?
						existNOINMIN = true;
						var inName = "NO_INMIN";
						if (inName in insimpleViewHash) {

							insimpleViewHash[inName] = sbdRow + "|"
									+ insimpleViewHash[inName];
						} else {
							insimpleViewHash[inName] = sbdRow;
						}

					}

				}

			}

			if (tty == "MIN" || tty == 'IN') {
				for (var k = 0; k < concepts.length; k++) {
					// if (concepts[k].minConceptGroup == null) {
					minImageContent = genImage(tty, concepts[k].pres,
							concepts[k].inferedhuman + concepts[k].humandrug,
							concepts[k].inferedvet + concepts[k].vetdrug);

					var sbdRow = minImageContent

							+ "<p class='simpleRowClass' data-toggle='tooltip' data-placement='top' title='"
							+ concepts[k].rxcui + "' id='srxcui|"
							+ concepts[k].rxcui + "'>"
							+ getRxnavstr(concepts[k]) + "</p>";

					if (concepts[k].rxcui == globalRxcui) {
						sbdRow = minImageContent

								+ "<p class='simpleRowClass rowSelected' data-toggle='tooltip' data-placement='top' title='"
								+ concepts[k].rxcui + "' id='srxcui|"
								+ concepts[k].rxcui + "'>"
								+ getRxnavstr(concepts[k]) + "</p>";
						preferedName = getRxnavstr(concepts[k]);
					}

					var minName = concepts[k].rxcui;// getRxnavstr(minINConcepts[m]);

					inRxcuiHashAll[minName] = minName;// concepts[k].rxcui;

					inminHash[minName] = sbdRow;

				}

			}
			if (existNOINMIN) {
				minImageContent = genImage("", "", "", "");
				var sbdRow = minImageContent

						+ "<p class='simpleRowClass' data-toggle='tooltip' data-placement='top' title='"
						+ "N/A" + "'>" + "NO_INMIN" + "</p>";
				inminHash["NO_INMIN"] = sbdRow;
			}
			if (tty == 'BN') {
				for (var k = 0; k < concepts.length; k++) {
					minImageContent = genImage(tty, concepts[k].pres,
							concepts[k].inferedhuman + concepts[k].humandrug,
							concepts[k].inferedvet + concepts[k].vetdrug);

					var sbdRow = minImageContent

							+ "<p class='simpleRowClass' data-toggle='tooltip' data-placement='top' title='"
							+ concepts[k].rxcui + "' id='srxcui|"
							+ concepts[k].rxcui + "'>"
							+ getRxnavstr(concepts[k]) + "</p>";

					if (concepts[k].rxcui == globalRxcui) {
						sbdRow = minImageContent
								+ "<p class='simpleRowClass rowSelected' data-toggle='tooltip' data-placement='top' title='"
								+ concepts[k].rxcui + "' id='srxcui|"
								+ concepts[k].rxcui + "'>"
								+ getRxnavstr(concepts[k]) + "</p>";
						preferedName = getRxnavstr(concepts[k]);
					}
					var bnName = concepts[k].rxcui;// getRxnavstr(minINConcepts[m]);
					bnRxcuiHashAll[bnName] = bnName;// concepts[k].rxcui;
					bnHash[bnName] = sbdRow;

				}

			}
			if (existNOBN) {
				minImageContent = genImage("", "", "", "");
				var sbdRow = minImageContent
						+ "<p class='simpleRowClass' data-toggle='tooltip' data-placement='top' title='"
						+ "N/A" + "'>" + "No Brand Name" + "</p>";
				bnHash["No Brand Name"] = sbdRow;
			}

		}
	}

	$('#bnTableSimple').html("");
	$('#inTableSimple').html("");

	// brand name

	for (bnName in bnHash) {

		if (bnName in bnsimpleViewHash) {

			var bnTable = "<ul class='mainLink'><img class='plusMinus' src='resources/img/rxnav/plus-list.png' />"
					+ "<span class='hasHVP'>" + bnHash[bnName] + "</span>";
			var values = bnsimpleViewHash[bnName].split("|");
			for (var v = 0; v < values.length; v++) {
				bnTable += "<li class='hasHVP' data-toggle='tooltip' data-placement='top' title='"
						+ bnRxcuiHolderHash[values[v]]
						+ "' id='srxcui|"
						+ bnRxcuiHolderHash[values[v]]
						+ "'>"
						+ values[v]
						+ "</li>";
			}

			bnTable += "</ul>";

		} else {
			var bnTable = "<ul class='mainLink'>" + "<span class='hasHVP'>"
					+ bnHash[bnName] + "</span>";
			bnTable += "</ul>";
		}

		$('#bnTableSimple').append(bnTable);
	}

	for (inName in inminHash) {// insimpleViewHash) {
		if (inName in insimpleViewHash) {

			var inTable = "<ul class='mainLink' ><img class='plusMinus' src='resources/img/rxnav/plus-list.png' />"
					+ "<span class='hasHVP'>" + inminHash[inName] + "</span>";
			var values = insimpleViewHash[inName].split("|");

			for (var v = 0; v < values.length; v++) {
				inTable += "<li class='hasHVP' data-toggle='tooltip' data-placement='top' title='"
						+ inRxcuiHolderHash[values[v]]
						+ "' id='srxcui|"
						+ inRxcuiHolderHash[values[v]]
						+ "'>"
						+ values[v]
						+ "</li>";
			}
			inTable += "</ul>";

		} else {
			var inTable = "<ul class='mainLink' ><img class='greyDot' src='resources/img/rxnav/bullet_white.png' style='opacity:0;' />"
					+ "<span class='hasHVP grayOut'>"
					+ inminHash[inName]
					+ "</span>";

			inTable += "</ul>";
		}
		$('#inTableSimple').append(inTable);

	}

	// add rowSelected
	// TODO: do this consistent for other
	$("li[id='srxcui|" + globalRxcui + "']").addClass("rowSelected");

	// sort table
	$("#bnTableSimple ul").sort(function(a, b) {
		var aid = $(a).find('p').attr('id');
		if (exists(aid) && aid.split("|")[1] == globalRxcui) {
			return -1;
		}
		var bid = $(b).find('p').attr('id');
		if (exists(bid) && bid.split("|")[1] == globalRxcui) {
			return 1;
		}

		return $(a).text().toLowerCase() > $(b).text().toLowerCase() ? 1 : -1;
	}).appendTo($("#bnTableSimple"));

	$("#inTableSimple ul").sort(function(a, b) {
		var aid = $(a).find('p').attr('id');
		if (exists(aid) && aid.split("|")[1] == globalRxcui) {
			return -1;
		}
		var bid = $(b).find('p').attr('id');
		if (exists(bid) && bid.split("|")[1] == globalRxcui) {
			return 1;
		}
		return $(a).text().toLowerCase() > $(b).text().toLowerCase() ? 1 : -1;
	}).appendTo($("#inTableSimple"));

	$('ul.mainLink')
			.each(
					function() {
						$(this)
								.children('li')
								.sort(
										function(a, b) {
											var aid = $(a).attr('id');
											if (exists(aid)
													&& aid.split("|")[1] == globalRxcui) {
												return -1;
											}
											var bid = $(b).attr('id');
											if (exists(bid)
													&& bid.split("|")[1] == globalRxcui) {
												return 1;
											}

											return $(a).text().toLowerCase() > $(
													b).text().toLowerCase() ? 1
													: -1;
										}).appendTo($(this));
					});
	// /////////////

	$('.mainLink >li').hide();

	// action on click
	$(".plusMinus").click(function() {
		if ($(this).attr("src").indexOf("minus-list") > -1) {
			$(this).parent().children('li').hide();
			$(this).attr('src', 'resources/img/rxnav/plus-list.png');
		} else {
			$(this).parent().children('li').show();
			$(this).attr('src', 'resources/img/rxnav/minus-list.png');
			updateWithFilterSimple();
		}
		showExtraTitle();
	});
	$(".plusMinus, .greyDot").css("width", "20px").css("height", "20px").css(
			"vertical-align", "text-top");

	// trigger click expanall

	$("#expandall").html("Expand All").trigger("click");
	$('[data-toggle="tooltip"]').tooltip();

}

/**
 * 
 */
function showExtraTitle() {
	var scdCount = 0;
	$("#inTableSimple .plusMinus").each(function() {
		if ($(this).attr("src").indexOf("minus-list") > -1) {
			scdCount++;
		}
	});
	if (scdCount > 0) {
		$("#extraSCD").find(".tableTty").css("background", "#3a6496");
		$("#extraSCD").css("background", "#428bca");
	} else {
		$("#extraSCD").find(".tableTty").css("background", "#aaa");
		$("#extraSCD").css("background", "#ccc");
	}

	var sbdCount = 0;
	$("#bnTableSimple .plusMinus").each(function() {
		if ($(this).attr("src").indexOf("minus-list") > -1) {
			sbdCount++;
		}
	});
	if (sbdCount > 0) {
		$("#extraSBD").find(".tableTty").css("background", "#3a6496");
		$("#extraSBD").css("background", "#428bca");
	} else {
		$("#extraSBD").find(".tableTty").css("background", "#aaa");
		$("#extraSBD").css("background", "#ccc");
	}

	var totalCount = scdCount + sbdCount;
	if (totalCount == 0) {
		$("#expandall").html("Expand All")
	}
}
/**
 * Other than graph tab
 */
function updateOtherTabs() {

	// RxNorm Properties tab
	updateRxNormPropertiesTab();

	// Pill/NDC tabs: We have to update Pills Image before NDC
	// Because images are reused in NDC tabs
	updatePillImageTab();
	updateNDCTab();

	// RxTerms tab
	updateRxTermTab();

	// NDFRT tab and switch view
	updateNDFRTTab();
	showSelectedNDFRTPropView();

	// class view
	updateClassTab();

	// interaction tab
	updateInteractionTab();
}

/**
 * 
 */
function updateRxNormPropertiesTab() {
	updateRxNormPropTab(selectedPropName);
}

/**
 * 
 * @param prop
 */
function updateRxNormPropTab(prop) {

	$
			.ajax({
				type : "GET",
				dataType : "json",
				url : "https://rxnav.nlm.nih.gov/REST/rxcui/" + globalRxcui
						+ "/allProperties?caller=RxNav&prop="
						+ encodeURIComponent(prop),
				success : function(data) {

					if (exists(data) && exists(data.propConceptGroup)) {
						enableTabs("propertiesTabCtrl");

						var propConceptGroup = data.propConceptGroup;
						var propConcept = data.propConceptGroup.propConcept;
						var tableContent = "";
						tableContent += "<div class='table-responsive'><table id='propTableId' class='table table-striped centerTablesClass'><thead><tr><th>Property</th><th>Value</th></tr></thead><tbody>";

						for (var i = 0; i < propConcept.length; i++) {
							var val = propConcept[i];
							var propCategory = val.propCategory;
							var propName = val.propName;
							var propValue = val.propValue;

							if (propName.toUpperCase() == "SPL_SET_ID") {
								tableContent += "<tr ><td style='width:250px;'>"
										+ propName
										+ "</td><td><a class='idLink' target='_blank' href='https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid="
										+ propValue
										+ "'>"
										+ propValue
										+ "</a></td></tr>";
							} else {
								tableContent += "<tr ><td style='width:250px;'>"
										+ propName
										+ "</td><td>"
										+ propValue
										+ "</td></tr>";
							}

						}
						tableContent += "</tbody></table></div>";
						$("#prop").html(tableContent);

						registerTableSorter("propTableId");
					} else {
						$("#prop")
								.html(
										"<div class='noresult'>There is no information for the selected properties!</div>");
					}
				},
				beforeSend : function(data) {
					// $("#circularG").show();
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
 */
function updatePillImageTab() {
	$
			.ajax({
				type : "GET",
				dataType : "json",
				url : "https://rximage.nlm.nih.gov/api/rximage/1/rxbase?resolution=300&includeMpc=true&includeActiveIngredients=true&rxcui="
						+ globalRxcui,
				async : false,
				success : function(data) {

					if (isArray(data.nlmRxImages)
							&& data.nlmRxImages.length > 0) {
						// empty ndc11-image hash
						ndc11ImageHash = new Object();
						ndc11ImageHash2 = new Object();
						var nlmRxImages = data.nlmRxImages;

						enableTabs("pillTabCtrl");

						var numRows = nlmRxImages.length;

						var tableContent = "";
						tableContent += "<div class='table-responsive'><table id='pillTableId' class='table table-striped centerTablesClass'>"
								+ "<thead><tr > <th>Image</th><th>Attributes</th></tr></thead><tbody>";

						for (var i = 0; i < nlmRxImages.length; i++) {
							var val = nlmRxImages[i];
							var image = val.imageUrl;
							var acqDate = val.acqDate;
							var manufacturer = val.labeler;
							var setId = val.splSetId;
							var ndc11 = val.ndc11;
							var shape = val.mpc.shape;
							var size = val.mpc.size;
							var color = val.mpc.color;
							var imprint = val.mpc.imprint;
							var imprintType = val.mpc.imprintType;
							var part = val.part;
							globalPart = part;
							// store mapping between ndc11 to imageUrl

							if (part == 1) {
								ndc11ImageHash[ndc11.replace(/-/g, "")] = image;

							} else {

								ndc11ImageHash2[ndc11.replace(/-/g, "")] = image;
							}

							tableContent += "<tr> <td> <img src= '" + image
									+ "'></td> " + "<td>" + "Acq Date: "
									+ acqDate + '<br>' + "Manufacturer: "
									+ manufacturer + '<br>' + "SplSetId: "
									+ setId + '<br>' + "NDC: " + ndc11 + '<br>'
									+ "Shape: " + shape + '<br>' + "Size: "
									+ size + '<br>' + "Color: " + color
									+ '<br>' + "Imprint: " + imprint + '<br>'
									+ "ImprintType: " + imprintType + '<br>'
									+ "Part: " + part + "</td></tr>";
						}
						tableContent += "</tbody></table></div>";

						$("#pillWindo").html(tableContent);

						registerTableSorter('pillTableId');
					} else {
						disableTabs("pillTabCtrl");

						if (currentTab == 'pillTabCtrl') {
							$('[href=#graph]').tab('show');
							$('#pillTabCtrl').removeClass('currentTabColor');
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

function updateNDCTab() {
	$("#ndcMainContent").html();
	$
			.ajax({
				type : "GET",
				dataType : "json",
				url : "https://rxnav.nlm.nih.gov/REST/ndcproperties?caller=RxNav&id="
						+ globalRxcui,
				success : function(data) {

					if (exists(data) && exists(data.ndcPropertyList)
							&& isArray(data.ndcPropertyList.ndcProperty)) {

						enableTabs("ndcTabCtrl");

						var ndcPropertyList = data.ndcPropertyList.ndcProperty;

						var leftHash = new Object();
						var rightHash = new Object();

						for (var i = 0; i < ndcPropertyList.length; i++) {

							var ndcProperty = ndcPropertyList[i];

							var ndcItem = ndcProperty.ndcItem;
							var ndc9 = ndcProperty.ndc9;
							var ndc10 = ndcProperty.ndc10;
							var rxcui = ndcProperty.rxcui;
							var splSetIdItem = ndcProperty.splSetIdItem;

							var packaging = ndcProperty.packagingList.packaging
									.join(";"); // ?why join here
							var labelerInfo = "";
							// create right hash

							if (exists(ndcProperty.propertyConceptList)
									&& isArray(ndcProperty.propertyConceptList.propertyConcept)) {

								var propertyConcept = ndcProperty.propertyConceptList.propertyConcept;

								var rightTableValue = formRightTableValue(propertyConcept);
								var labelerInfo = getLabelerValue(propertyConcept);
								if (ndc9 in rightHash) {
									// skip
								} else {
									rightHash[ndc9] = rightTableValue;
								}
							} else {
								ndc9 = "UNKNOWN";
							}
							// create left hash
							var leftTableValue = formLeftTableValue(ndcItem,
									ndc9, ndc10, splSetIdItem, packaging,
									labelerInfo);

							if (ndc9 in leftHash) {
								leftHash[ndc9] = leftHash[ndc9]
										+ leftTableValue;
							} else {
								leftHash[ndc9] = leftTableValue;
							}
						}

						var leftTableContent = "";

						// create actual left/right tables

						var firstNdc9 = '';
						var leftContentTitle = "<div class='table-responsive'><table class='table table-striped centerTablesClass' id='ndcTableId'>"
								+ "<thead><tr><th>NDC9</th><th>NDC11</th><th>NDC10</th><th>SPL_SET_ID</th><th>LABELER</th><th>PACKAGING</th><th>NDC9 PROPERTIES</th><th>PILL IMAGES</th></tr></thead><tbody>"
						leftTableContent += leftContentTitle;
						for (ndc9 in leftHash) {
							if (firstNdc9 == '') {
								firstNdc9 = ndc9;
							}
							leftTableContent += leftHash[ndc9];
						}
						leftTableContent += "</tbody></table></div>";
						$("#ndcWindow").html(leftTableContent);
						registerTableSorter("ndcTableId");

						$(".showPropBtn")
								.click(
										function() {

											var selectedNdc9 = $(this).closest(
													'tr').children('td:eq(0)')
													.text().trim();
											var selectedProp = rightHash[selectedNdc9];

											showRightTable(selectedNdc9,
													selectedProp);

										});

						$(".showPillBtn")
								.click(
										function() {

											var selectedNdc11 = $(this)
													.closest('tr').children(
															'td:eq(1)').text()
													.trim();
											showPillImageForNdc11(selectedNdc11);
										});

					} else {
						disableTabs("ndcTabCtrl");
						if (currentTab == 'ndcTabCtrl') {
							$('[href=#graph]').tab('show');
							$('#ndcTabCtrl').removeClass('currentTabColor');
							$('#graphTabCtrl').addClass('currentTabColor');
							currentTab = "graphTabCtrl";
						}
					}

				},
				beforeSend : function(data) {
					// $("#circularG").show();
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
 */
function updateRxTermTab() {

	/* */

	$
			.ajax({
				type : "GET",
				dataType : "json",
				url : "https://rxnav.nlm.nih.gov/REST/RxTerms/rxcui/"
						+ globalRxcui + "/allinfo?caller=RxNav",
				success : function(data) {

					if (exists(data) && exists(data.rxtermsProperties)) {
						var rxtermsProperties = data.rxtermsProperties;
						enableTabs("termTabCtrl");

						var rxcui = data.rxtermsProperties.rxcui;

						// create header

						var tableContent = "";
						tableContent += "<div class='table-responsive'><table id='termTableId' class='table table-striped centerTablesClass'>"
								+ "<thead><tr ><th>Property</th><th>Value</th></tr></thead><tbody>";

						// create rows
						tableContent += "<tr > <td>Brand Name</td><td>"
								+ rxtermsProperties.brandName + "</td></tr>";

						tableContent += "<tr > <td >Display Name</td><td>"
								+ rxtermsProperties.displayName + "</td></tr>";
						tableContent += "<tr > <td >Synonym</td><td>"
								+ rxtermsProperties.synonym + "</td></tr>";
						tableContent += "<tr > <td >Full Name</td><td>"
								+ rxtermsProperties.fullName + "</td></tr>";
						tableContent += "<tr > <td >Full Generic Name</td><td >"
								+ rxtermsProperties.fullGenericName
								+ "</td></tr>";
						tableContent += "<tr > <td >Strength</td><td>"
								+ rxtermsProperties.strength + "</td></tr>";
						tableContent += "<tr > <td >Dose Forms</td><td>"
								+ rxtermsProperties.rxtermsDoseForm
								+ "</td></tr>";
						tableContent += "<tr > <td >Route</td><td>"
								+ rxtermsProperties.route + "</td></tr>";
						tableContent += "<tr > <td >Term Type</td><td>"
								+ rxtermsProperties.termType + "</td></tr>";
						tableContent += "<tr > <td >RxCUI</td><td>"
								+ rxtermsProperties.rxcui + "</td></tr>";

						if (rxtermsProperties.genericRxcui == 0) {
							tableContent += "<tr> <td >Generic RxCUI</td><td > </td></tr>";
						} else {

							tableContent += "<tr> <td >Generic RxCUI</td><td >"
									+ rxtermsProperties.genericRxcui
									+ "</td></tr>";
						}

						tableContent += "<tr > <td >RxNorm Dose Form</td><td >"
								+ rxtermsProperties.rxnormDoseForm
								+ "</td></tr>";
						tableContent += "<tr > <td >Suppress</td><td >"
								+ rxtermsProperties.suppress + "</td></tr>";
						tableContent += "</tbody></table></div>";

						$("#termContentWindow").html(tableContent);

						registerTableSorter('termTableId');

					} else {
						disableTabs("termTabCtrl");
						if (currentTab == 'termTabCtrl') {
							$('[href=#graph]').tab('show');
							$('#termTabCtrl').removeClass('currentTabColor');
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
 */
function updateNDFRTTab() {
	// first, update global nui
	getNui();
	// then, update property table
	updateNDFRTPropTable();
	// then, update relation table
	updateNdfrtRelationTable();
}

/**
 * 
 */
function showSelectedNDFRTPropView() {
	if (selectedNdfrtProp == "propButton") {
		$("#ndfrtRelaContent").hide();
		$("#ndfrtPropContent").show();
	} else {
		$("#ndfrtPropContent").hide();
		$("#ndfrtRelaContent").show();
	}
}

/**
 * 
 */
function updateNDFRTPropTable() {
	if (globalNui == "") {
		return;
	}
	$
			.ajax({
				type : "GET",
				dataType : "json",

				url : "https://rxnav.nlm.nih.gov/REST/Ndfrt/properties?caller=RxNav&nui="
						+ globalNui,
				success : function(data) {
					if (exists(data) && exists(data.groupProperties[0])
							&& isArray(data.groupProperties[0].property)) {
						var property = data.groupProperties[0].property;
						var tableContent = "<div class='table-responsive'><table id='ndfPropTableId' class='table table-striped centerTablesClass'>"
								+ "<thead><tr> <th>Property</th><th>Value</th></tr></thead><tbody>";

						for (var i = 0; i < property.length; i++) {
							var val = property[i];
							var propertyName = val.propertyName;
							var propertyValue = val.propertyValue;

							tableContent += "<tr > <td>" + propertyName
									+ "</td><td>" + propertyValue
									+ "</td></tr>";

						}

						tableContent += "</tbody></table></div>";
						$("#ndfrtPropContent").html(tableContent);
						registerTableSorter('ndfPropTableId');
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
 */
function updateNdfrtRelationTable() {
	$
			.ajax({
				type : "GET",
				dataType : "json",
				url : "https://rxnav.nlm.nih.gov/REST/Ndfrt/relationtable?caller=RxNav&nui="
						+ globalNui,
				success : function(data) {
					if (exists(data) && exists(data.relationTripleList)
							&& isArray(data.relationTripleList.relationTriple)) {
						var relTriplist = data.relationTripleList;

						var element = data.relationTripleList.relationTriple;
						var tableContent = "<div class='table-responsive'><table id='ndfRelaTableId'class='table table-striped centerTablesClass'>"
								+ "<thead><tr><th>Kind</th><th>Category</th><th>Property</th><th>Value</th></tr></thead><tbody>";

						for (var k = 0; k < element.length; k++) {
							var relSubject = element[k].relSubject;
							var relPredicate = element[k].relPredicate;
							var relObject = element[k].relObject;

							var kind = roleClassificationOrder[relPredicate
									.split(" ")[0]];

							tableContent += "<tr> <td>" + kind + "</td><td>"
									+ relSubject + "</td><td>" + relPredicate
									+ "</td><td>" + relObject + "</td></tr>";

						}
						tableContent += "</tbody></table></div>";

						$("#ndfrtRelaContent").html(tableContent);
						registerTableSorter("ndfRelaTableId");

					}
				},
				beforeSend : function(data) {
					// $("#circularG").show();

				},
				error : function(jq, status, errorMsg) {
					// alert("jq: " + JSON.stringify(jq) + "Status: " + status +
					// " Error: " + errorMsg);
				},
				complete : function(jq, status) {
				}
			});

}

function checkGraphTab() {
	var o = false;
	$.ajax({
		type : "GET",
		dataType : "json",
		async : false,
		url : "https://rxnav.nlm.nih.gov/REST/atcjsongraph?caller=RxNav&rxcui="
				+ globalRxcui,
		success : function(data) {
			if (exists(data) && exists(data.jsonGraph)) {
				o = true;
			}
		}
	});

	$.ajax({
		type : "GET",
		dataType : "json",
		url : "https://rxnav.nlm.nih.gov/REST/rxcui/" + globalRxcui
				+ "/property?caller=RxNav&propName=MESH",
		async : false,
		success : function(data) {
			if (exists(data) && exists(data.propConceptGroup)
					&& exists(data.propConceptGroup.propConcept[0])
					&& exists(data.propConceptGroup.propConcept[0].propValue)) {
				o = true;
			}
		}
	});

	$
			.ajax({
				type : "GET",
				dataType : "json",
				async : false,
				url : "https://rxnav.nlm.nih.gov/REST/Ndfrt/ndfrtjsongraph?caller=RxNav&nui="
						+ encodeURIComponent(globalNui) + "&kind=DRUG_KIND",
				success : function(data) {
					if (exists(data) && exists(data.jsonGraph)) {
						o = true;
					}
				}
			});
	return o;
}
/**
 * 
 */
function updateClassTab() {

	var tabOn = checkGraphTab();
	if (tabOn) {
		enableTabs("classTabCtrl");
		triggerGraphClick();
	} else {
		if (currentTab == 'classTabCtrl') {
			$('[href=#graph]').tab('show');
			$('#classTabCtrl').removeClass('currentTabColor');
			$('#graphTabCtrl').addClass('currentTabColor');
			currentTab = "graphTabCtrl";
		}
	}

	// if (!updateAtcGraph()) {
	// if (!updateMeshGraph()) {
	// if (!updateNdfrtGraph("DRUG_KIND")) {
	// disableTabs("classTabCtrl");
	// if (currentTab == 'classTabCtrl') {
	// $('[href=#graph]').tab('show');
	// $('#classTabCtrl').removeClass('currentTabColor');
	// $('#graphTabCtrl').addClass('currentTabColor');
	// currentTab = "graphTabCtrl";
	// }
	// } else {
	// enableTabs("classTabCtrl");
	// if (selectedGraphId != "drugButton")
	// triggerGraphClick();
	// }
	// } else {
	// enableTabs("classTabCtrl");
	// if (selectedGraphId != "mesh")
	// triggerGraphClick();
	// }
	// } else {
	// enableTabs("classTabCtrl");
	// if (selectedGraphId != "action")
	// triggerGraphClick();
	// }
}

/**
 * 
 */
function updateMainTitle() {
	$("#titleDecoration").html(preferedName).attr('data-original-title',
			preferedName).attr('data-placement', 'top');
	$("#rxcuiDecoration").html("[RxCUI = " + globalRxcui + "]");
	$("#titleDecoration").tooltip();
}
/**
 * 
 * @param searchTerm
 * @returns {String}
 */
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

					$(".modalItem")
							.on(
									'click',
									function() {
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
		$
				.ajax({
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
	$
			.ajax({
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
 * @param rxcui1
 * @param str1
 * @param rxcui2
 * @param str2
 */
function showReformulationModal(searchBy, rxcui1, str1, rxcui2, str2) {
	// create content for modal
	var tmpStr = searchBy == "RXCUI" ? "RXCUI = " + rxcui1 : "String ='" + str1
			+ "'";
	$("#ReformModalLabel").html(
			tmpStr + " has been reformulated, choose one of the following");
	$("#ReformModalContent").html(
			"<a class='modalItem'>"
					+ reformulationStrStrHash[str1.toLowerCase()] + "</a>"
					+ "<a class='modalItem'>" + str2 + "</a>");
	$('#ReformModal').modal({
		keyboard : true,
		show : true,
	});

	$(".modalItem").on(
			'click',
			function() {
				var newSearchItem = $(this).html();
				$('#ReformModal').modal('hide');
				globalRxcui = (newSearchItem.toLowerCase() == str1
						.toLowerCase()) ? rxcui1 : rxcui2;
				search("RXCUI", globalRxcui, true);
				// updateAllTabs();
			});

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
			$
					.ajax({
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

/**
 * 
 * @param tty
 * @param pres
 * @param human
 * @param vet
 * @returns {String}
 */
function genImage(tty, pres, human, vet) {
	var image1 = "B";
	var image2 = "B";
	var image3 = "B";

	var tran1 = 0;
	var tran2 = 0;
	var tran3 = 0;

	if (tty == "BPCK" || tty == "GPCK") {
		image1 = "P";
		tran1 = 1;
	} else if (tty == "MIN") {
		image1 = "M";
		tran1 = 1;
	} else {
		image1 = "B";
	}

	if (pres != "") {
		image3 = 'Rx';
		tran3 = 1;
	}

	if (human != "") {
		if (vet != "") {
			image2 = 'HV';
			tran2 = 1;
		} else {
			image2 = 'H';
			tran2 = 1;
		}
	} else {
		if (vet != "") {
			image2 = 'V';
			tran2 = 1;
		} else {
			image2 = 'B';
		}
	}

	return "<img src='resources/img/rxnav/" + image1 + ".gif'"
			+ "style='opacity:" + tran1 + ";'/>"
			+ "<img src='resources/img/rxnav/" + image2 + ".gif'"
			+ "style='opacity:" + tran2 + ";'/>"
			+ "<img src='resources/img/rxnav/" + image3 + ".gif'"
			+ "style='opacity:" + tran3 + ";'/>";
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

/**
 * 
 * @param ndcItem
 * @param ndc9
 * @param ndc10
 * @param splSetIdItem
 * @param packaging
 * @param labelerInfo
 * @returns {String}
 */
function formLeftTableValue(ndcItem, ndc9, ndc10, splSetIdItem, packaging,
		labelerInfo) {

	var ndc9PropCell = "";
	var pillCell = "";
	if (ndc9.toLowerCase() != "unknown") {
		ndc9PropCell = "<button type='button' class='btn showPropBtn'>Show</button>";
	}
	if (ndcItem in ndc11ImageHash) {

		pillCell = "<button type='button' class='btn showPillBtn'>Show</button>";
	}

	return "<tr><td class='ndcnine'>"
			+ ndc9
			+ "</td><td>"
			+ ndcItem
			+ "</td><td>"
			+ ndc10
			+ "</td><td><a class='idLink' target='_blank' href='https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid="
			+ splSetIdItem + "'>" + splSetIdItem + "</a></td><td>"
			+ labelerInfo + "</td><td>" + packaging + "</td><td>"
			+ ndc9PropCell + "</td><td>" + pillCell + "</td></tr>";

}
/**
 * 
 * @param propertyConcept
 * @returns {String}
 */
function formRightTableValue(propertyConcept) {

	var tablecontent = "";
	for (k = 0; k < propertyConcept.length; k++) {
		tablecontent += "<tr><td>" + propertyConcept[k].propName + "</td><td>"
				+ propertyConcept[k].propValue + "</td></tr>";
	}

	return tablecontent;
}

/**
 * 
 * @param propertyConcept
 * @returns
 */
function getLabelerValue(propertyConcept) {
	for (k = 0; k < propertyConcept.length; k++) {
		if (propertyConcept[k].propName.toLowerCase() == "labeler") {
			return propertyConcept[k].propValue;
		}
	}

	return "";
}

/**
 * 
 * @param selectedNdc9
 * @param selectedProp
 */
function showRightTable(selectedNdc9, selectedProp) {

	if (selectedNdc9 != "UNKNOWN") {
		var modalTitle = "<h4 id='HeaderTitle'>Properties for NDC9 = '"
				+ selectedNdc9 + "'</h4>";
		var rightContent = "<div class='table-responsive'><table id='ndcRightTableId' class='table table-striped'><thead><tr><th>Property</th><th>Value</th></tr></thead>";
		rightContent += "<tbody>" + selectedProp + "</tbody></table></div>";

		// create content for modal
		$("#PropModalLabel").html(modalTitle);
		$("#PropModalContent").html(rightContent);
		$('#PropModal').modal({
			keyboard : true,
			show : true,
		});
		// do search on selected item

		registerTableSorter('ndcRightTableId');
	} else {
		$("#PropModalLabel").html("Unknown");
		$("#PropModalContent").html("No Properties Available!");
		$('#PropModal').modal({
			keyboard : true,
			show : true,
		});
	}

}

/**
 * 
 * @param selectedNdc11
 */
function showPillImageForNdc11(selectedNdc11) {
	var imageUrl = ndc11ImageHash[selectedNdc11];
	var imageUrl2 = ndc11ImageHash2[selectedNdc11];
	var modalTitle = "<h4 id='HeaderTitle'>Pill Image for NDC11 = '"
			+ selectedNdc11 + "'</h4>";
	if (globalPart == 1) {
		var content = "<div><img src='" + imageUrl + "'/></div>";
	} else {
		var content = "<div><img src='" + imageUrl + "'/></div><br>"
				+ "<div><img src='" + imageUrl2 + "'/></div> ";
	}
	// create content for modal
	$("#PillModalLabel").html(modalTitle);
	$("#PillModalContent").html(content);
	$('#PillModal').modal({
		keyboard : true,
		show : true,
	});
}

/**
 * 
 */
function getNui() {
	$
			.ajax({
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
function updateMeshGraph() {
	// var o = false;
	$
			.ajax({
				type : "GET",
				dataType : "json",
				url : "https://rxnav.nlm.nih.gov/REST/rxcui/" + globalRxcui
						+ "/property?caller=RxNav&propName=MESH",
				async : false,
				success : function(data) {
					if (exists(data)
							&& exists(data.propConceptGroup)
							&& exists(data.propConceptGroup.propConcept[0])
							&& exists(data.propConceptGroup.propConcept[0].propValue)) {
						// o = true;
						var propValue = data.propConceptGroup.propConcept[0].propValue;
						// enableTabs("classTabCtrl");
						$
								.ajax({
									type : "GET",
									dataType : "json",
									url : "https://rxnav.nlm.nih.gov/REST/mesh/headingname?caller=RxNav&id="
											+ encodeURIComponent(propValue),
									success : function(data) {
										var meshName = data.name;

										$
												.ajax({
													type : "GET",
													dataType : "json",
													url : "https://rxnav.nlm.nih.gov/REST/mesh/pajsongraph?caller=RxNav&id="
															+ encodeURIComponent(propValue)
															+ "&name="
															+ encodeURIComponent(meshName),
													success : function(data) {
														drawGraph(data, 'mesh');
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
	$
			.ajax({
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

/**
 * 
 */
function updateInteractionTab() {
	$.ajax({
		type : "GET",
		dataType : "json",
		url : "https://rxnav.nlm.nih.gov/REST/interaction/interaction?caller=RxNav&rxcui="
				+ globalRxcui,
		success : function(data) {
			if (exists(data) && isArray(data.interactionTypeGroup)) {
				enableTabs("intrTabCtrl");
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
				$('tr[data-toggle="tooltip"]').tooltip({
					container : '#interMainContent'// this is
				// importat
				});

				registerTableSorterClass("table table-striped centerTablesClass");
				registerClickInteraction();

			} else {

				disableTabs("intrTabCtrl");

				if (currentTab == 'intrTabCtrl') {
					$('[href=#graph]').tab('show');
					$('#intrTabCtrl').removeClass('currentTabColor');
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
			// alert("Network issue,
			// please reload the
			// page");
		},
		complete : function(jq, status) {
		}
	});

}

/**
 * Update filter everytime
 */
function updateWithFilter() {
	updateWithFilterClassic();
	updateWithFilterSimple()
}
/**
 * 
 */
function updateWithFilterClassic() {
	var pIdList = {};
	var pId_count = {};
	pIdList['inTable'] = 1;
	pIdList['pinTable'] = 1;
	pIdList['bnTable'] = 1;
	pIdList['scdTable'] = 1;
	pIdList['sbdTable'] = 1;
	pIdList['scdcTable'] = 1;
	pIdList['sbdcTable'] = 1;

	// pIdList['scdgTable'] = 1;
	// pIdList['dfgTable'] = 1;
	// pIdList['sbdgTable'] = 1;
	pId_count['dfgTable'] = 0;

	// pIdList['scdfTable'] = 1;
	// pIdList['dfTable'] = 1;
	// pIdList['sbdfTable'] = 1;
	pId_count['dfTable'] = 0;

	$("tr.hasHVP").each(
			function() {

				var pid = $(this).parents('.classicViewTable').first().attr(
						"id");

				var images = $(this).find('img').map(function() {
					var tmp = $(this).attr('src').split("/");
					return tmp[tmp.length - 1];
				});

				var humanStatus = false;
				var vetStatus = false;
				var presStatus = (images[2] == "B.gif" ? false : true);

				if (images[1] == "H.gif") {
					humanStatus = true;
				} else if (images[1] == "V.gif") {
					vetStatus = true;
				} else if (images[1] == "HV.gif") {
					humanStatus = true;
					vetStatus = true;
				}

				if ((!humanDrug || humanStatus == humanDrug)
						&& (!vetDrug || vetStatus == vetDrug)
						&& (!presDrug || presStatus == presDrug)) {
					$(this).show();
					if (pid in pId_count) {
						pId_count[pid] += 1;
					} else {
						pId_count[pid] = 1;
					}
				} else {
					$(this).hide();
				}
			});

	for ( var pid in pIdList) {
		var count = 0;
		if (pid in pId_count) {
			count = pId_count[pid];
		}
		var tmpText = $("div[id='" + pid + "']").parent().find(".tableTitle")
				.children('.tableTitleContent').html();
		var countSpan = $("div[id='" + pid + "']").parent().find(".tableTitle")
				.children('.tableTitleContent').find("span").html();
		if (!exists(countSpan)) {
			// assign count
			$("div[id='" + pid + "']").parent().find(".tableTitle").children(
					'.tableTitleContent').html(
					tmpText + " <span class='countAttrClassic'>(" + count
							+ ")</span>");
		} else {
			// update count
			$("div[id='" + pid + "']").parent().find(".tableTitle").children(
					'.tableTitleContent').find("span").each(function() {
				$(this).html("(" + count + ")");
			});
		}
	}

	// information only on dose will be considered unimportant
	if (selectedDose == 'doseGroup') {
		updateWithFilterClassicWithId("scdgTable");
		updateWithFilterClassicWithId("dfgTable");
		updateWithFilterClassicWithId("sbdgTable");
	} else {
		updateWithFilterClassicWithId("scdfTable");
		updateWithFilterClassicWithId("dfTable");
		updateWithFilterClassicWithId("sbdfTable");
	}

	var length = Object.keys(pId_count).length;
	if (length <= 2) {
		alert("No significant information in the main graph, please check FILTER!");
	}
}

function updateWithFilterClassicWithId(pid) {
	var pId_count = {};
	pId_count[pid] = 0;

	$("#" + pid).find("tr.hasHVP").each(
			function() {
				var images = $(this).find('img').map(function() {
					var tmp = $(this).attr('src').split("/");
					return tmp[tmp.length - 1];
				});

				var humanStatus = false;
				var vetStatus = false;
				var presStatus = (images[2] == "B.gif" ? false : true);

				if (images[1] == "H.gif") {
					humanStatus = true;
				} else if (images[1] == "V.gif") {
					vetStatus = true;
				} else if (images[1] == "HV.gif") {
					humanStatus = true;
					vetStatus = true;
				}

				if ((!humanDrug || humanStatus == humanDrug)
						&& (!vetDrug || vetStatus == vetDrug)
						&& (!presDrug || presStatus == presDrug)) {
					$(this).show();
					pId_count[pid] += 1;
				} else {
					$(this).hide();
				}
			});

	var count = pId_count[pid];
	var tmpText = $("div[id='" + pid + "']").parent().find(".tableTitle")
			.children('.tableTitleContent').html();
	var countSpan = $("div[id='" + pid + "']").parent().find(".tableTitle")
			.children('.tableTitleContent').find("span").html();
	if (!exists(countSpan)) {
		// assign count
		$("div[id='" + pid + "']").parent().find(".tableTitle").children(
				'.tableTitleContent').html(
				tmpText + " <span class='countAttrClassic'>(" + count
						+ ")</span>");
	} else {
		// update count
		$("div[id='" + pid + "']").parent().find(".tableTitle").children(
				'.tableTitleContent').find("span").each(function() {
			$(this).html("(" + count + ")");
		});
	}
}
/**
 * 
 */
function updateWithFilterSimple() {

	var pIdList = {};
	$("span.hasHVP").each(
			function() {
				var pid = $(this).find('p').attr('id');
				pIdList[pid] = 1;
				var images = $(this).find('img').map(function() {
					var tmp = $(this).attr('src').split("/");
					return tmp[tmp.length - 1];
				});

				var humanStatus = false;
				var vetStatus = false;
				var presStatus = (images[2] == "B.gif" ? false : true);

				if (images[1] == "H.gif") {
					humanStatus = true;
				} else if (images[1] == "V.gif") {
					vetStatus = true;
				} else if (images[1] == "HV.gif") {
					humanStatus = true;
					vetStatus = true;
				}

				if ((!humanDrug || humanStatus == humanDrug)
						&& (!vetDrug || vetStatus == vetDrug)
						&& (!presDrug || presStatus == presDrug)) {
					$(this).parent("ul").show();
				} else {
					$(this).parent("ul").hide();
				}

			});

	var pId_count = {};

	$("li.hasHVP").each(
			function() {
				// count number of available li for this
				var pid = $(this).parent().find("p").attr("id");
				var images = $(this).find('img').map(function() {
					var tmp = $(this).attr('src').split("/");
					return tmp[tmp.length - 1];
				});

				var humanStatus = false;
				var vetStatus = false;
				var presStatus = (images[2] == "B.gif" ? false : true);

				if (images[1] == "H.gif") {
					humanStatus = true;
				} else if (images[1] == "V.gif") {
					vetStatus = true;
				} else if (images[1] == "HV.gif") {
					humanStatus = true;
					vetStatus = true;
				}

				if ((!humanDrug || humanStatus == humanDrug)
						&& (!vetDrug || vetStatus == vetDrug)
						&& (!presDrug || presStatus == presDrug)) {
					if (pid in pId_count) {
						pId_count[pid] += 1;
					} else {
						pId_count[pid] = 1;
					}
					if ($(this).parent().find(".plusMinus").attr("src")
							.indexOf("minus-list") > -1) {
						$(this).show();
					} else {
						$(this).hide();
					}
				} else {
					$(this).hide();
				}

			});

	for ( var pid in pIdList) {
		if (pid in pId_count) {
			var tmpText = $("p[id='" + pid + "']").html();
			var countSpan = $("p[id='" + pid + "']").find("span").html();

			if (!exists(countSpan)) {
				// assign count
				$("p[id='" + pid + "']").html(
						tmpText + " <span class='countAttrSimple'>("
								+ pId_count[pid] + ")</span>");
			} else {
				// update count
				$("p[id='" + pid + "']").find('span').each(function() {
					$(this).html("(" + pId_count[pid] + ")");
				});
			}
		} else {
			$("p[id='" + pid + "']").find('span').each(function() {
				$(this).html("");
			});
		}
	}
}

// DRAWS Cytoscape graphs
/**
 * 
 * @param kind
 */
function drawLegend(kind) {
	cyLegend = null;
	$('#classGraphLegend').html("");
	switch (kind) {
	case "mesh":
		showMeshLegend();
		break;
	case "DRUG_KIND":
		showDrugLegend();
		break;
	case "DISEASE_KIND":
		showDiseaseLegend();
		break;
	case "DOSE_FORM_KIND":
		showDFLegend();
		break;
	case "INGREDIENT_KIND":
		showIngredientLegend();
		break;
	case "MECHANISM_OF_ACTION_KIND":
		showMOALegend();
		break;
	case "PHARMACOKINETICS_KIND":
		showPHAMLegend();
		break;
	case "PHYSIOLOGIC_EFFECT_KIND":
		showPHILegend();
		break;
	default:
		showAtcLegend();
	}

	cyLegend.nodes().lock();
}

/**
 * 
 * @param data
 */
function drawGraph(data, kindName) {
	$("#classGraph").html("");
	if (data == null || !exists(data.jsonGraph.nodes)
			|| data.jsonGraph.nodes.length == 1) {
		cy = null;
		$("#classGraph")
				.html(
						"<div class='noresult'>There is no graph for selected class!</div>");
		return;
	}

	// draw graph
	var nodes = [];
	var dataNodes = data.jsonGraph.nodes;

	for (var i = 0; i < dataNodes.length; i++) {
		nodes.push({
			data : {
				id : dataNodes[i].id,
				label : dataNodes[i].label,
				kind : dataNodes[i].kind,
				color : kindColorMapping[dataNodes[i].kind],
				type : dataNodes[i].type,
				subType : dataNodes[i].subType
			},
			classes : getNodeStyle(dataNodes[i].type, dataNodes[i].subType)
		});

	}

	var edges = [];
	if (exists(data.jsonGraph.edges)) {
		var dataEdges = data.jsonGraph.edges;

		for (var i = 0; i < dataEdges.length; i++) {
			edges.push({
				data : {
					source : dataEdges[i].fromId,
					target : dataEdges[i].toId,
					label : (dataEdges[i].label == "isa") ? ""
							: dataEdges[i].label
				},
				classes : "edgeStyle"
			});
		}
	}

	cy = window.cy = cytoscape({
		container : $('#classGraph'),
		boxSelectionEnabled : false,
		autounselectify : true,
		layout : {
			name : 'dagre',

			// dagre algo options, uses default value on undefined
			nodeSep : undefined, // the separation between adjacent nodes in
			// the same rank
			edgeSep : undefined, // the separation between adjacent edges in
			// the same rank
			rankSep : undefined, // the separation between adjacent nodes in
			// the same rank
			rankDir : 'BT', // 'TB' for top to bottom flow, 'LR' for left to
			// right
			minLen : function(edge) {
				return 1;
			}, // number of ranks to keep between the source and target of the
			// edge
			edgeWeight : function(edge) {
				return 1;
			}, // higher weight edges are generally made shorter and straighter
			// than lower weight edges

			// general layout options
			fit : true, // whether to fit to viewport
			padding : 30, // fit padding
			animate : false, // whether to transition the node positions
			animationDuration : 500, // duration of animation in ms if
			// enabled
			animationEasing : undefined, // easing of animation if enabled
			boundingBox : undefined, // constrain layout bounds; { x1, y1,
			// x2, y2 } or { x1, y1, w, h }
			ready : function() {
			}, // on layoutready
			stop : function() {
			} // on layoutstop

		},
		style : [ {
			selector : 'node',
			style : {
				'content' : 'data(id)',
				'text-opacity' : 1,
				'text-halign' : 'center',
				'text-valign' : 'center',
				'label' : 'data(label)',
				'background-color' : 'data(color)',
				'width' : 'label',
				'height' : 'label',
				'padding-left' : '20px',
				'padding-right' : '20px',
				'padding-top' : '10px',
				'padding-bottom' : '10px'
			}
		}, {
			selector : 'edge',
			style : {
				'width' : 2,
				'label' : 'data(label)',
				'target-arrow-shape' : 'triangle',
			}
		}, {
			selector : '.vaclass',
			style : {
				'shape' : 'polygon',
				'shape-polygon-points' : '-0.8, -1, 1, -1, 0.8, 1, -1, 1',
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3'
			}
		}, {
			selector : '.drugnode',
			style : {
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3'
			}
		}, {
			selector : '.defaultnode',
			style : {}
		}, {
			selector : '.epcclass',
			style : {
				'shape' : 'polygon',
				'shape-polygon-points' : '-0.8, -1, 1, -1, 0.8, 1, -1, 1'
			}
		}, {
			selector : '.vaproduct',
			style : {
				'shape' : 'rectangle',
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3'
			}
		}, {
			selector : '.edgeStyle',
			style : {
				'edge-text-rotation' : 'autorotate'
			}
		}, ],
		elements : {
			nodes : nodes,
			edges : edges
		},
	});

	cy.panzoom({});

	cy
			.on('mouseover', 'node', function(event) {
				var type = event.cyTarget.data('type');
				if (type == "na") {
					$('html,body').css('cursor', 'default');
				} else {
					$('html,body').css('cursor', 'pointer');
				}
				mouseoverNodeColor = event.cyTarget.style('background-color');
				event.cyTarget.style('background-color', '#feb24c');

				var node = event.cyTarget;
				node.qtip({
					overwrite : true,
					content : node.data('id'),
					position : {
						my : 'top left', // Position my top left...
						at : 'top center', // at the bottom right of...
					},
					show : {
						event : event.type,
						ready : true
					},
					hide : {
						event : 'mouseout unfocus'
					}
				}, event);

			})
			.on('mouseout', 'node', function(e) {
				e.cyTarget.style('background-color', mouseoverNodeColor);
				$('html,body').css('cursor', 'default');
			})
			.on(
					'tap',
					'node',
					function(event) {
						var type = event.cyTarget.data('type');

						if (type == "na") {
							$('html,body').css('cursor', 'default');
						} else {
							$('html,body').css('cursor', 'pointer');
							var rxclassLink = "https://mor.nlm.nih.gov/RxClass/search?";
							var id = event.cyTarget.data('id');
							if (type == "class") {

								var subtype = event.cyTarget.data('subType');
								var classType = getClassType(kindName, subtype);

								if (classType.length > 0) {
									id = id + "|" + classType;
								}
								window
										.open(
												rxclassLink
														+ "query="
														+ id
														+ "&searchBy=class&drugSources=atc1-4|atc,epc|fdaspl,meshpa|mesh,disease|ndfrt,chem|fdaspl,moa|fdaspl,pe|fdaspl,pk|ndfrt,va|ndfrt",
												'_blank');
							} else {
								if (id == globalNui) {
									// if this is VA Product, we search by RxCui
									window.open(rxclassLink + "query="
											+ globalRxcui + "&searchBy=drug",
											'_blank');
								} else {
									var name = event.cyTarget.data('label');
									window.open(rxclassLink + "query=" + name
											+ "&searchBy=drug", '_blank');
								}

							}
						}
					});
}

/**
 * 
 * @param type
 * @param subType
 * @returns {String}
 */
function getNodeStyle(type, subType) {
	if (subType == "VA Class") {
		return "vaclass";
	} else if (subType == "EPC Class") {
		return "epcclass";
	} else if (subType == "VA Product") {
		return "vaproduct";
	} else {
		if (type == "drug") {
			return "drugnode";
		}
		return "defaultnode";
	}
}

function getClassType(kindName, subType) {
	if (subType == "VA Class") {
		return "vaclass";
	} else if (subType == "EPC Class") {
		return "epcclass";
	} else if (subType == "VA Product") {
		return "VA";
	} else {
		return kindClassTypeMapping[kindName];
	}
}
/**
 * 
 */
function showAtcLegend() {
	cyLegend = cytoscape({
		container : $('#classGraphLegend'),
		boxSelectionEnabled : false,
		autounselectify : true,
		style : [ {
			selector : 'node',
			css : {
				'content' : 'data(label)',
				'text-valign' : 'center',
				'text-halign' : 'center',
				'text-opacity' : 1,
				'width' : 'label',
				'height' : 'label',
				'padding-left' : '20px',
				'padding-right' : '20px',
				'padding-top' : '10px',
				'padding-bottom' : '10px'
			}
		}, {
			selector : '$node > node',
			css : {
				'padding-top' : '10px',
				'padding-left' : '10px',
				'padding-bottom' : '10px',
				'padding-right' : '10px',
				'text-valign' : 'top',
				'text-halign' : 'center',
				'background-color' : '#ccc'
			}
		}, {
			selector : 'edge',
			css : {
				'target-arrow-shape' : 'triangle',
				'content' : 'data(label)',
				'edge-text-rotation' : 'autorotate'
			}
		}, {
			selector : '.va',
			css : {
				'shape' : 'rectangle',
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3',
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.dr',
			css : {
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3',
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.in',
			css : {
				'border-style' : 'double',
				'border-color' : '#CEEFBD',
				'border-width' : '3',
				'background-color' : '#CEEFBD'
			}
		}, {
			selector : '.isa',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.assoc',
			css : {
				'target-arrow-shape' : 'triangle'
			// 'line-style' : 'dotted'
			}
		}, {
			selector : '.hasin',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.ci',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.hasmeta',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.haschem',
			css : {
				'target-arrow-shape' : 'triangle',
				'line-style' : 'dotted'
			}
		} ],
		elements : {
			nodes : [ {
				data : {
					id : 'l',
					label : ''
				}
			}, {
				data : {
					id : 'd1',
					label : 'Drug',
					parent : 'l'
				},
				position : {
					x : 0,
					y : 100
				},
				classes : 'dr'
			}, {
				data : {
					id : 'i1',
					label : 'ATC Class',
					parent : 'l'
				},
				position : {
					x : 150,
					y : 100
				},
				classes : 'in'
			}, {
				data : {
					id : 'i2',
					label : 'ATC Class',
					parent : 'l'
				},
				position : {
					x : 320,
					y : 100
				},
				classes : 'in'
			} ],
			edges : [ {
				data : {
					id : 'd1i1',
					source : 'd1',
					target : 'i1',
					label : 'isa'
				},
				classes : 'is'
			}, {
				data : {
					id : 'i1i2',
					source : 'i1',
					target : 'i2',
					label : 'isa'
				},
				classes : 'is'
			} ]
		},
		layout : {
			name : 'preset',
			padding : 5
		}
	});
}

/**
 * 
 */
function showMeshLegend() {
	cyLegend = cytoscape({
		container : $('#classGraphLegend'),
		boxSelectionEnabled : false,
		autounselectify : true,

		style : [ {
			selector : 'node',
			css : {
				'content' : 'data(label)',
				'text-valign' : 'center',
				'text-halign' : 'center',
				'text-opacity' : 1,
				'width' : 'label',
				'height' : 'label',
				'padding-left' : '20px',
				'padding-right' : '20px',
				'padding-top' : '10px',
				'padding-bottom' : '10px'
			}
		}, {
			selector : '$node > node',
			css : {
				'padding-top' : '10px',
				'padding-left' : '10px',
				'padding-bottom' : '10px',
				'padding-right' : '10px',
				'text-valign' : 'top',
				'text-halign' : 'center',
				'background-color' : '#ccc'
			}
		}, {
			selector : 'edge',
			css : {
				'target-arrow-shape' : 'triangle',
				'content' : 'data(label)',
				'edge-text-rotation' : 'autorotate'
			}
		}, {
			selector : '.va',
			css : {
				'shape' : 'rectangle',
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3',
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.dr',
			css : {
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3',
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.in',
			css : {
				'border-style' : 'double',
				'border-color' : '#CEEFBD',
				'border-width' : '3',
				'background-color' : '#CEEFBD'
			}
		}, {
			selector : '.isa',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.assoc',
			css : {
				'target-arrow-shape' : 'triangle'
			// 'line-style' : 'dotted'
			}
		}, {
			selector : '.hasin',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.ci',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.hasmeta',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.haschem',
			css : {
				'target-arrow-shape' : 'triangle',
				'line-style' : 'dotted'
			}
		} ],

		elements : {
			nodes : [ {
				data : {
					id : 'l',
					label : ''
				}
			}, {
				data : {
					id : 'd1',
					label : 'Drug',
					parent : 'l'
				},
				position : {
					x : 0,
					y : 100
				},
				classes : 'dr'
			}, {
				data : {
					id : 'i1',
					label : 'Pharmacologic Action',
					parent : 'l'
				},
				position : {
					x : 350,
					y : 100
				},
				classes : 'in'
			}, {
				data : {
					id : 'i2',
					label : 'Pharmacologic Action',
					parent : 'l'
				},
				position : {
					x : 600,
					y : 100
				},
				classes : 'in'
			} ],
			edges : [ {
				data : {
					id : 'd1i1',
					source : 'd1',
					target : 'i1',
					label : 'has_pharmacologic_action'
				},
				classes : 'isa'
			}, {
				data : {
					id : 'i1i2',
					source : 'i1',
					target : 'i2',
					label : 'isa'
				},
				classes : 'isa'
			} ]
		},

		layout : {
			name : 'preset',
			padding : 5
		}
	});
}
// legends
function showDrugLegend() {
	cyLegend = cytoscape({
		container : $('#classGraphLegend'),
		boxSelectionEnabled : false,
		autounselectify : true,

		style : [ {
			selector : 'node',
			css : {
				'content' : 'data(label)',
				'text-valign' : 'center',
				'text-halign' : 'center',
				'text-opacity' : 1,
				'width' : 'label',
				'height' : 'label',
				'padding-left' : '20px',
				'padding-right' : '20px',
				'padding-top' : '10px',
				'padding-bottom' : '10px'
			}
		}, {
			selector : '$node > node',
			css : {
				'padding-top' : '10px',
				'padding-left' : '10px',
				'padding-bottom' : '10px',
				'padding-right' : '10px',
				'text-valign' : 'top',
				'text-halign' : 'center',
				'background-color' : '#ccc'
			}
		}, {
			selector : 'edge',
			css : {
				'target-arrow-shape' : 'triangle',
				'content' : 'data(label)',
				'edge-text-rotation' : 'autorotate'
			}
		}, {
			selector : '.va',
			css : {
				'shape' : 'rectangle',
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3',
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.vaclass',
			style : {
				'shape' : 'polygon',
				'shape-polygon-points' : '-0.8, -1, 1, -1, 0.8, 1, -1, 1',
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3',
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.dr',
			css : {
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3',
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.in',
			css : {
				'border-style' : 'double',
				'border-color' : '#CEEFBD',
				'border-width' : '3',
				'background-color' : '#CEEFBD'
			}
		}, {
			selector : '.isa',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.assoc',
			css : {
				'target-arrow-shape' : 'triangle'
			// 'line-style' : 'dotted'
			}
		}, {
			selector : '.hasin',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.ci',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.hasmeta',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.haschem',
			css : {
				'target-arrow-shape' : 'triangle',
				'line-style' : 'dotted'
			}
		} ],

		elements : {
			nodes : [ {
				data : {
					id : 'l',
					label : ''
				}
			}, {
				data : {
					id : 'a1',
					label : 'drug class',
					parent : 'l'
				},
				position : {
					x : 0,
					y : 100
				},
				classes : 'vaclass'
			}, {
				data : {
					id : 'a2',
					label : 'Va Product',
					parent : 'l'
				},
				position : {
					x : 150,
					y : 100
				},
				classes : 'va'
			}, {
				data : {
					id : 'd1',
					label : 'Drug',
					parent : 'l'
				},
				position : {
					x : 300,
					y : 100
				},
				classes : 'dr'
			}, {
				data : {
					id : 'd2',
					label : 'Drug',
					parent : 'l'
				},
				position : {
					x : 500,
					y : 100
				},
				classes : 'dr'
			} ],
			edges : [ {
				data : {
					id : 'd1d21',
					source : 'd1',
					target : 'd2',
					label : 'isa'
				},
				classes : 'isa'
			}, {
				data : {
					id : 'd1d22',
					source : 'd1',
					target : 'd2',
					label : 'association'
				},
				classes : 'assoc'
			} ]
		},

		layout : {
			name : 'preset',
			padding : 5
		}
	});

}

/**
 * 
 */
function showIngredientLegend() {
	cyLegend = cytoscape({
		container : $('#classGraphLegend'),
		boxSelectionEnabled : false,
		autounselectify : true,

		style : [ {
			selector : 'node',
			css : {
				'content' : 'data(label)',
				'text-valign' : 'center',
				'text-halign' : 'center',
				'text-opacity' : 1,
				'width' : 'label',
				'height' : 'label',
				'padding-left' : '20px',
				'padding-right' : '20px',
				'padding-top' : '10px',
				'padding-bottom' : '10px'
			}
		}, {
			selector : '$node > node',
			css : {
				'padding-top' : '10px',
				'padding-left' : '10px',
				'padding-bottom' : '10px',
				'padding-right' : '10px',
				'text-valign' : 'top',
				'text-halign' : 'center',
				'background-color' : '#ccc'
			}
		}, {
			selector : 'edge',
			css : {
				'target-arrow-shape' : 'triangle',
				'content' : 'data(label)',
				'edge-text-rotation' : 'autorotate'
			}
		}, {
			selector : '.va',
			css : {
				'shape' : 'rectangle',
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3',
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.dr',
			css : {
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3',
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.in',
			css : {
				'border-style' : 'double',
				'border-color' : '#CEEFBD',
				'border-width' : '3',
				'background-color' : '#CEEFBD'
			}
		}, {
			selector : '.isa',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.assoc',
			css : {
				'target-arrow-shape' : 'triangle'
			// 'line-style' : 'dotted'
			}
		}, {
			selector : '.hasin',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.ci',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.hasmeta',
			css : {
				'target-arrow-shape' : 'triangle',
			}
		}, {
			selector : '.haschem',
			css : {
				'target-arrow-shape' : 'triangle',
				'line-style' : 'dotted'
			}
		} ],

		elements : {
			nodes : [ {
				data : {
					id : 'l',
					label : ''
				}
			}, {
				data : {
					id : 'a',
					label : 'Va Product',
					parent : 'l'
				},
				position : {
					x : 0,
					y : 100
				},
				classes : 'va'
			}, {
				data : {
					id : 'd1',
					label : 'Drug',
					parent : 'l'
				},
				position : {
					x : 150,
					y : 100
				},
				classes : 'dr'
			}, {
				data : {
					id : 'd2',
					label : 'Drug',
					parent : 'l'
				},
				position : {
					x : 330,
					y : 100
				},
				classes : 'dr'
			}, {
				data : {
					id : 'i1',
					label : 'Ingredient',
					parent : 'l'
				},
				position : {
					x : 650,
					y : 100
				},
				classes : 'in'
			}, {
				data : {
					id : 'i2',
					label : 'Ingredient',
					parent : 'l'
				},
				position : {
					x : 800,
					y : 100
				},
				classes : 'in'
			} ],
			edges : [ {
				data : {
					id : 'd1d21',
					source : 'd1',
					target : 'd2',
					label : 'isa'
				},
				classes : 'isa'
			}, {
				data : {
					id : 'd1d22',
					source : 'd1',
					target : 'd2',
					label : 'association'
				},
				classes : 'assoc'
			}, {
				data : {
					id : 'i1i2',
					source : 'i1',
					target : 'i2',
					label : 'isa'
				},
				classes : 'isa'
			}, {
				data : {
					id : 'd3i31',
					source : 'd2',
					target : 'i1',
					label : 'has_Ingredient'
				},
				classes : 'hasin'
			}, {
				data : {
					id : 'd3i32',
					source : 'd2',
					target : 'i1',
					label : 'CI_ChemClass'
				},
				classes : 'ci'
			}, {
				data : {
					id : 'd3i33',
					source : 'd2',
					target : 'i1',
					label : 'has_active_metabolites'
				},
				classes : 'hasmeta'
			}, {
				data : {
					id : 'd3i34',
					source : 'd2',
					target : 'i1',
					label : 'has_Chemical_Structures'
				},
				classes : 'haschem'
			},

			]
		},

		layout : {
			name : 'preset',
			padding : 5
		}
	});
}
/**
 * 
 */
function showDiseaseLegend() {
	cyLegend = cytoscape({
		container : $('#classGraphLegend'),

		boxSelectionEnabled : false,
		autounselectify : true,

		style : [ {
			selector : 'node',
			css : {
				'content' : 'data(label)',
				'text-valign' : 'center',
				'text-halign' : 'center',
				'text-opacity' : 1,
				'width' : 'label',
				'height' : 'label',
				'padding-left' : '20px',
				'padding-right' : '20px',
				'padding-top' : '10px',
				'padding-bottom' : '10px'
			}
		}, {
			selector : '$node > node',
			css : {
				'padding-top' : '10px',
				'padding-left' : '10px',
				'padding-bottom' : '10px',
				'padding-right' : '10px',
				'text-valign' : 'top',
				'text-halign' : 'center',
				'background-color' : '#ccc'
			}
		}, {
			selector : 'edge',
			css : {
				'target-arrow-shape' : 'triangle',
				'content' : 'data(label)',
				'edge-text-rotation' : 'autorotate'
			}
		}, {
			selector : '.va',
			css : {
				'shape' : 'rectangle',
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3',
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.vaclass',
			style : {
				'shape' : 'polygon',
				'shape-polygon-points' : '-0.8, -1, 1, -1, 0.8, 1, -1, 1',
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3',
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.dr',
			css : {
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.in',
			css : {
				'border-style' : 'double',
				'border-color' : '#CEEFBD',
				'border-width' : '3',
				'background-color' : '#CEEFBD'
			}
		}, {
			selector : '.di',
			css : {
				'background-color' : '#BDC6DE'
			}
		}, {
			selector : '.isa',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.assoc',
			css : {
				'target-arrow-shape' : 'triangle'
			// 'line-style' : 'dotted'
			}
		}, {
			selector : '.induces',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.ciwith',
			css : {
				'target-arrow-shape' : 'triangle',
			}
		}, {
			selector : '.maytreat',
			css : {
				'target-arrow-shape' : 'triangle',
			}
		}, {
			selector : '.mayprevent',
			css : {
				'target-arrow-shape' : 'triangle',
				'line-style' : 'dotted'
			}
		}, {
			selector : '.maydiagnose',
			css : {
				'target-arrow-shape' : 'triangle',
				'line-style' : 'dotted'
			}
		} ],

		elements : {
			nodes : [ {
				data : {
					id : 'l',
					label : ''
				}
			}, {
				data : {
					id : 'a',
					label : 'Va Product',
					parent : 'l'
				},
				position : {
					x : 0,
					y : 100
				},
				classes : 'va'
			}, {
				data : {
					id : 'd1',
					label : 'Drug',
					parent : 'l'
				},
				position : {
					x : 150,
					y : 100
				},
				classes : 'dr'
			}, {
				data : {
					id : 'd2',
					label : 'Drug',
					parent : 'l'
				},
				position : {
					x : 330,
					y : 100
				},
				classes : 'dr'
			}, {
				data : {
					id : 'i1',
					label : 'Disease',
					parent : 'l'
				},
				position : {
					x : 650,
					y : 100
				},
				classes : 'di'
			}, {
				data : {
					id : 'i2',
					label : 'Disease',
					parent : 'l'
				},
				position : {
					x : 800,
					y : 100
				},
				classes : 'di'
			} ],
			edges : [ {
				data : {
					id : 'd1d21',
					source : 'd1',
					target : 'd2',
					label : 'isa'
				},
				classes : 'isa'
			}, {
				data : {
					id : 'd1d22',
					source : 'd1',
					target : 'd2',
					label : 'association'
				},
				classes : 'assoc'
			}, {
				data : {
					id : 'i1i2',
					source : 'i1',
					target : 'i2',
					label : 'isa'
				},
				classes : 'isa'
			}, {
				data : {
					id : 'd3i31',
					source : 'd2',
					target : 'i1',
					label : 'induces'
				},
				classes : 'induces'
			}, {
				data : {
					id : 'd3i32',
					source : 'd2',
					target : 'i1',
					label : 'CI_with'
				},
				classes : 'ciwith'
			}, {
				data : {
					id : 'd3i33',
					source : 'd2',
					target : 'i1',
					label : 'may_treat'
				},
				classes : 'maytreat'
			}, {
				data : {
					id : 'd3i34',
					source : 'd2',
					target : 'i1',
					label : 'may_prevent'
				},
				classes : 'mayprevent'
			}, {
				data : {
					id : 'd3i35',
					source : 'd2',
					target : 'i1',
					label : 'may_diagnose'
				},
				classes : 'maydiagnose'
			} ]
		},

		layout : {
			name : 'preset',
			padding : 5
		}
	});

}
/**
 * 
 */
function showDFLegend() {
	cyLegend = cytoscape({
		container : $('#classGraphLegend'),
		boxSelectionEnabled : false,
		autounselectify : true,

		style : [ {
			selector : 'node',
			css : {
				'content' : 'data(label)',
				'text-valign' : 'center',
				'text-halign' : 'center',
				'text-opacity' : 1,
				'width' : 'label',
				'height' : 'label',
				'padding-left' : '20px',
				'padding-right' : '20px',
				'padding-top' : '10px',
				'padding-bottom' : '10px'
			}
		}, {
			selector : '$node > node',
			css : {
				'padding-top' : '10px',
				'padding-left' : '10px',
				'padding-bottom' : '10px',
				'padding-right' : '10px',
				'text-valign' : 'top',
				'text-halign' : 'center',
				'background-color' : '#ccc'
			}
		}, {
			selector : 'edge',
			css : {
				'target-arrow-shape' : 'triangle',
				'content' : 'data(label)',
				'edge-text-rotation' : 'autorotate'
			}
		}, {
			selector : '.va',
			css : {
				'shape' : 'rectangle',
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3',
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.dr',
			css : {
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3',
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.df',
			css : {
				'background-color' : '#FFC6A5'
			}
		}, {
			selector : '.isa',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.assoc',
			css : {
				'target-arrow-shape' : 'triangle'
			// 'line-style' : 'dotted',
			}
		}, {
			selector : '.hasdf',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		} ],

		elements : {
			nodes : [ {
				data : {
					id : 'l',
					label : ''
				}
			}, {
				data : {
					id : 'a',
					label : 'Va Product',
					parent : 'l'
				},
				position : {
					x : 0,
					y : 100
				},
				classes : 'va'
			}, {
				data : {
					id : 'd1',
					label : 'Drug',
					parent : 'l'
				},
				position : {
					x : 150,
					y : 100
				},
				classes : 'dr'
			}, {
				data : {
					id : 'd2',
					label : 'Drug',
					parent : 'l'
				},
				position : {
					x : 330,
					y : 100
				},
				classes : 'dr'
			}, {
				data : {
					id : 'i1',
					label : 'Dose Form',
					parent : 'l'
				},
				position : {
					x : 580,
					y : 100
				},
				classes : 'df'
			}, {
				data : {
					id : 'i2',
					label : 'Dose Form',
					parent : 'l'
				},
				position : {
					x : 750,
					y : 100
				},
				classes : 'df'
			} ],
			edges : [ {
				data : {
					id : 'd1d21',
					source : 'd1',
					target : 'd2',
					label : 'isa'
				},
				classes : 'isa'
			}, {
				data : {
					id : 'd1d22',
					source : 'd1',
					target : 'd2',
					label : 'association'
				},
				classes : 'assoc'
			}, {
				data : {
					id : 'i1i2',
					source : 'i1',
					target : 'i2',
					label : 'isa'
				},
				classes : 'isa'
			}, {
				data : {
					id : 'd3i31',
					source : 'd2',
					target : 'i1',
					label : 'has_DoseForm'
				},
				classes : 'hasdf'
			},

			]
		},

		layout : {
			name : 'preset',
			padding : 5
		}
	});
}

/**
 * 
 */
function showMOALegend() {
	cyLegend = cytoscape({
		container : $("#classGraphLegend"),

		boxSelectionEnabled : false,
		autounselectify : true,

		style : [ {
			selector : 'node',
			css : {
				'content' : 'data(label)',
				'text-valign' : 'center',
				'text-halign' : 'center',
				'text-opacity' : 1,
				'width' : 'label',
				'height' : 'label',
				'padding-left' : '20px',
				'padding-right' : '20px',
				'padding-top' : '10px',
				'padding-bottom' : '10px'
			}
		}, {
			selector : '$node > node',
			css : {
				'padding-top' : '10px',
				'padding-left' : '10px',
				'padding-bottom' : '10px',
				'padding-right' : '10px',
				'text-valign' : 'top',
				'text-halign' : 'center',
				'background-color' : '#ccc'
			}
		}, {
			selector : 'edge',
			css : {
				'target-arrow-shape' : 'triangle',
				'content' : 'data(label)',
				'edge-text-rotation' : 'autorotate'
			}
		}, {
			selector : '.va',
			css : {
				'shape' : 'rectangle',
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3',
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.dr',
			css : {
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.moa',
			css : {
				'background-color' : '#FFE7C6'
			}
		}, {
			selector : '.isa',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.assoc',
			css : {
				'target-arrow-shape' : 'triangle'
			// 'line-style' : 'dotted'
			}
		}, {
			selector : '.cimoa',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.hasmoa',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		} ],

		elements : {
			nodes : [ {
				data : {
					id : 'l',
					label : ''
				}
			}, {
				data : {
					id : 'a',
					label : 'Va Product',
					parent : 'l'
				},
				position : {
					x : 0,
					y : 100
				},
				classes : 'va'
			}, {
				data : {
					id : 'd1',
					label : 'Drug',
					parent : 'l'
				},
				position : {
					x : 150,
					y : 100
				},
				classes : 'dr'
			}, {
				data : {
					id : 'd2',
					label : 'Drug',
					parent : 'l'
				},
				position : {
					x : 330,
					y : 100
				},
				classes : 'dr'
			}, {
				data : {
					id : 'i1',
					label : 'MECHANISM OF ACTION',
					parent : 'l'
				},
				position : {
					x : 580,
					y : 100
				},
				classes : 'moa'
			}, {
				data : {
					id : 'i2',
					label : 'MECHANISM OF ACTION',
					parent : 'l'
				},
				position : {
					x : 850,
					y : 100
				},
				classes : 'moa'
			} ],
			edges : [ {
				data : {
					id : 'd1d21',
					source : 'd1',
					target : 'd2',
					label : 'isa'
				},
				classes : 'isa'
			}, {
				data : {
					id : 'd1d22',
					source : 'd1',
					target : 'd2',
					label : 'association'
				},
				classes : 'assoc'
			}, {
				data : {
					id : 'i1i2',
					source : 'i1',
					target : 'i2',
					label : 'isa'
				},
				classes : 'isa'
			}, {
				data : {
					id : 'd3i31',
					source : 'd2',
					target : 'i1',
					label : 'has_MoA'
				},
				classes : 'hasmoa'
			}, {
				data : {
					id : 'd3i32',
					source : 'd2',
					target : 'i1',
					label : 'CI_MoA'
				},
				classes : 'cimoa'
			},

			]
		},

		layout : {
			name : 'preset',
			padding : 5
		}
	});
}

/**
 * 
 */
function showPHAMLegend() {
	cyLegend = cytoscape({
		container : $("#classGraphLegend"),

		boxSelectionEnabled : false,
		autounselectify : true,

		style : [ {
			selector : 'node',
			css : {
				'content' : 'data(label)',
				'text-valign' : 'center',
				'text-halign' : 'center',
				'text-opacity' : 1,
				'width' : 'label',
				'height' : 'label',
				'padding-left' : '20px',
				'padding-right' : '20px',
				'padding-top' : '10px',
				'padding-bottom' : '10px'
			}
		}, {
			selector : '$node > node',
			css : {
				'padding-top' : '10px',
				'padding-left' : '10px',
				'padding-bottom' : '10px',
				'padding-right' : '10px',
				'text-valign' : 'top',
				'text-halign' : 'center',
				'background-color' : '#ccc'
			}
		}, {
			selector : 'edge',
			css : {
				'target-arrow-shape' : 'triangle',
				'content' : 'data(label)',
				'edge-text-rotation' : 'autorotate'
			}
		}, {
			selector : '.va',
			css : {
				'shape' : 'rectangle',
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3',
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.dr',
			css : {
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.pham',
			css : {
				'background-color' : '#FFFFC6'
			}
		}, {
			selector : '.isa',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.assoc',
			css : {
				'target-arrow-shape' : 'triangle'
			// 'line-style' : 'dotted'
			}
		}, {
			selector : '.site',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.haspk',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		} ],

		elements : {
			nodes : [ {
				data : {
					id : 'l',
					label : ''
				}
			}, {
				data : {
					id : 'a',
					label : 'Va Product',
					parent : 'l'
				},
				position : {
					x : 0,
					y : 100
				},
				classes : 'va'
			}, {
				data : {
					id : 'd1',
					label : 'Drug',
					parent : 'l'
				},
				position : {
					x : 150,
					y : 100
				},
				classes : 'dr'
			}, {
				data : {
					id : 'd2',
					label : 'Drug',
					parent : 'l'
				},
				position : {
					x : 330,
					y : 100
				},
				classes : 'dr'
			}, {
				data : {
					id : 'i1',
					label : 'PHARMACOKINETICS',
					parent : 'l'
				},
				position : {
					x : 650,
					y : 100
				},
				classes : 'pham'
			}, {
				data : {
					id : 'i2',
					label : 'PHARMACOKINETICS',
					parent : 'l'
				},
				position : {
					x : 900,
					y : 100
				},
				classes : 'pham'
			} ],
			edges : [ {
				data : {
					id : 'd1d21',
					source : 'd1',
					target : 'd2',
					label : 'isa'
				},
				classes : 'isa'
			}, {
				data : {
					id : 'd1d22',
					source : 'd1',
					target : 'd2',
					label : 'association'
				},
				classes : 'assoc'
			}, {
				data : {
					id : 'i1i2',
					source : 'i1',
					target : 'i2',
					label : 'isa'
				},
				classes : 'isa'
			}, {
				data : {
					id : 'd3i31',
					source : 'd2',
					target : 'i1',
					label : 'has_PK'
				},
				classes : 'haspk'
			}, {
				data : {
					id : 'd3i32',
					source : 'd2',
					target : 'i1',
					label : 'site_of_metabolism'
				},
				classes : 'site'
			},

			]
		},

		layout : {
			name : 'preset',
			padding : 5
		}
	});
}

/**
 * 
 */
function showPHILegend() {
	cyLegend = cytoscape({
		container : $("#classGraphLegend"),

		boxSelectionEnabled : false,
		autounselectify : true,

		style : [ {
			selector : 'node',
			css : {
				'content' : 'data(label)',
				'text-valign' : 'center',
				'text-halign' : 'center',
				'text-opacity' : 1,
				'width' : 'label',
				'height' : 'label',
				'padding-left' : '20px',
				'padding-right' : '20px',
				'padding-top' : '10px',
				'padding-bottom' : '10px'
			}
		}, {
			selector : '$node > node',
			css : {
				'padding-top' : '10px',
				'padding-left' : '10px',
				'padding-bottom' : '10px',
				'padding-right' : '10px',
				'text-valign' : 'top',
				'text-halign' : 'center',
				'background-color' : '#ccc'
			}
		}, {
			selector : 'edge',
			css : {
				'target-arrow-shape' : 'triangle',
				'content' : 'data(label)',
				'edge-text-rotation' : 'autorotate'
			}
		}, {
			selector : '.va',
			css : {
				'shape' : 'rectangle',
				'border-style' : 'double',
				'border-color' : '#C6EFF7',
				'border-width' : '3',
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.dr',
			css : {
				'background-color' : '#C6EFF7'
			}
		}, {
			selector : '.phi',
			css : {
				'background-color' : '#DEBDDE'
			}
		}, {
			selector : '.isa',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.assoc',
			css : {
				'target-arrow-shape' : 'triangle'
			// 'line-style' : 'dotted'
			}
		}, {
			selector : '.cipe',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		}, {
			selector : '.haspe',
			css : {
				'target-arrow-shape' : 'triangle'
			}
		} ],

		elements : {
			nodes : [ {
				data : {
					id : 'l',
					label : ''
				}
			}, {
				data : {
					id : 'a',
					label : 'Va Product',
					parent : 'l'
				},
				position : {
					x : 0,
					y : 100
				},
				classes : 'va'
			}, {
				data : {
					id : 'd1',
					label : 'Drug',
					parent : 'l'
				},
				position : {
					x : 150,
					y : 100
				},
				classes : 'dr'
			}, {
				data : {
					id : 'd2',
					label : 'Drug',
					parent : 'l'
				},
				position : {
					x : 330,
					y : 100
				},
				classes : 'dr'
			}, {
				data : {
					id : 'i1',
					label : 'PHYSIOLOGIC EFFECT',
					parent : 'l'
				},
				position : {
					x : 650,
					y : 100
				},
				classes : 'phi'
			}, {
				data : {
					id : 'i2',
					label : 'PHYSIOLOGIC EFFECT',
					parent : 'l'
				},
				position : {
					x : 900,
					y : 100
				},
				classes : 'phi'
			} ],
			edges : [ {
				data : {
					id : 'd1d21',
					source : 'd1',
					target : 'd2',
					label : 'isa'
				},
				classes : 'isa'
			}, {
				data : {
					id : 'd1d22',
					source : 'd1',
					target : 'd2',
					label : 'association'
				},
				classes : 'assoc'
			}, {
				data : {
					id : 'i1i2',
					source : 'i1',
					target : 'i2',
					label : 'isa'
				},
				classes : 'isa'
			}, {
				data : {
					id : 'd3i31',
					source : 'd2',
					target : 'i1',
					label : 'has_PE'
				},
				classes : 'haspe'
			}, {
				data : {
					id : 'd3i32',
					source : 'd2',
					target : 'i1',
					label : 'CI_PE'
				},
				classes : 'cipe'
			},

			]
		},

		layout : {
			name : 'preset',
			padding : 5
		}
	});
}
// SOME UTILITIES FUNCTIONS
/**
 * 
 */
function resizeView() {
	var h = $("#mainContent").height();
	if (window.innerWidth > 992) {
		if (window.innerHeight > 400) {
			$("#classicView >.row-eq-height").height(h / 4 - 11);
			$(".classicViewTable").height((h / 4) - 40);
			$("#logoCol,#logoWell").height(h / 4 - 11);

		} else {
			$("#classicView >.row-eq-height").height("auto");
		}
		$(".sideMenu").height(h);
		$(".simpleViewTable").height(h - 70).css('overflow-y', 'auto');
		$(".otherViewTable").height(h - 10).css('overflow-y', 'auto');
		// copy back
		closeSideNav();
	} else {
		$("#classicView >.row-eq-height").height("auto");
		$(".classicViewTable").height("auto");
		$(".sideMenu").height("auto");
		$(".simpleViewTable,.otherViewTable").height("auto");
	}
	if (hasLegend) {
		$("#classGraph").height(h * 17 / 20);
		$("#legendSection").height(h * 3 / 20);
		$("#classGraphLegend").height((h * 3 / 20) - 20);
	} else {
		$("#classGraph").height(h);
	}

	if (cy != null) {
		cy.resize();
		cy.fit();
	}
	if (cyLegend != null) {
		cyLegend.resize();
		cyLegend.fit();
	}
}

/**
 * highlight auto comple after loading
 */
function addHightlightAutocomplete() {
	$.ui.autocomplete.prototype._renderItem = function(ul, item) {
		var re = new RegExp(this.term);
		var t = item.label.replace(re, "<span class='hightlightSuggestion'>"
				+ this.term + "</span>");
		return $("<li></li>").data("item.autocomplete", item).append(
				"<a>" + t + "</a>").appendTo(ul);
	};
}
/**
 * 
 */
function noSearchFound(searchTerm) {
	alert("There is no result for '" + searchTerm + "' (as "
			+ $("#searchById option:selected").text() + ")");
}
/**
 * 
 * @param searchTerm
 */
function showRetiredMsg(searchTerm) {
	alert("The concept for '" + searchTerm + "' is now retired");
}
/**
 * 
 * @param val
 */
function ObserveSearchInputChange(val) {
	if (val.length > 0) {
		$("#clearSearch").show();
	} else {
		$("#clearSearch").hide();
	}
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

/**
 * 
 * @param id
 */
function disableButton(id) {
	$("#" + id).addClass("not-active")
}

/**
 * 
 */
function enableButton() {
	$("#" + id).removeClass("not-active")
}

/**
 * 
 * @param id
 */
function enableTabs(id) {
	$("#" + id).attr("data-toggle", "tab").parent().removeClass("disabled");
	$("#" + id).css("color", "#337AB7").css("background-color", "#fff").css(
			"font-weight", "bold");
	$("#" + id).children("label").css("cursor", "pointer");
}
/**
 * 
 * @param id
 */
function disableTabs(id) {
	$("#" + id).removeAttr("data-toggle").parent().addClass("disabled");
	$("#" + id).css("color", "#aaa").css("background-color", "#fff").css(
			"font-weight", "normal");
	$("#" + id).children("label").css("cursor", "not-allowed");
}

/**
 * Main Tabs reset
 */
function resetTabs() {
	enableTabs("graphTabCtrl");
	disableTabs("termTabCtrl");
	disableTabs("ndfTabCtrl");
	disableTabs("pillTabCtrl");
	disableTabs("classTabCtrl");
	disableTabs("propertiesTabCtrl");
	disableTabs("ndcTabCtrl");
	disableTabs("intrTabCtrl");
}

/**
 * Check if user is using IE
 * 
 * @returns {Boolean}
 */
function msieversion() {

	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");

	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If
		return true
	return false;
}

/**
 * 
 * @param historyId
 * @returns
 */
function stripHistoryId(historyId) {
	return historyId.split("|")[1];
}

/**
 * 
 * @returns {String}
 */
function composeHistoryContent() {
	var historyContent = "";
	var startIndex = Math.max(searchHistoryData.length - 10, 0);

	for (var i = searchHistoryData.length - 1; i >= startIndex; i--) {
		var sb = searchHistoryData[i].data.preferedName;
		var st = searchHistoryData[i].data.rxcui;
		historyContent += "<div class='modalItem' id='history|" + st + "'>"
				+ sb + "<span class='tinyRxcui'>&nbsp;" + st + "</span></div>";
	}

	return historyContent;

}

/**
 * 
 * @returns {String}
 */
function createStateId() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}