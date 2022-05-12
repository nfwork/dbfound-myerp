'use strict';
angular.module('myerpApp').directive("headBar", function() {
	return {
		restrict : 'E',
		replace: true,
		template : function(tElement, attrs) {
			if(typeof attrs.leftText === "undefined"){
				attrs.leftText = '〈'
			}
			if(typeof attrs.leftHref === "undefined"){
				attrs.leftHref = ''
			}
			if(typeof attrs.leftClick === "undefined"){
				attrs.leftClick = 'back()'
			}
			if(typeof attrs.rightText === "undefined"){
				attrs.rightText = '☰'
			}
			if(typeof attrs.rightHref === "undefined"){
				attrs.rightHref = '#/menu'
			}
			if(typeof attrs.rightClick === "undefined"){
				attrs.rightClick = ''
			}
			var _html = "<div class='panel-heading' style='text-align: center;'>" +
					        "<a href='"+attrs.leftHref+"' ng-click='"+attrs.leftClick+"'><span style='float: left; width: 20px; color: #fff;'><b>"+attrs.leftText+"</b></span></a>" +
					        "<b>"+attrs.barTitle+"</b>" +
					        "<a href='"+attrs.rightHref+"' ng-click='"+attrs.rightClick+"'><span style='float: right; width: 20px; color: #fff;'><b>"+attrs.rightText+"</b></span></a>" +
					    "</div>";
			return _html;
		}
	};
	
});