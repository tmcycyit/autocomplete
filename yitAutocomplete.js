/**
 * Angucomplete
 * Autocomplete directive for AngularJS
 * By Daryl Rowland
 */

angular.module('YitAutocomplete', [])
    .directive('yitAutocomplete', ['$parse','$http','$sce','$timeout',function ($parse, $http, $sce, $timeout) {
        return {
            restrict: 'EA',
            scope: {
                "id": "@id",
                "placeholder": "@placeholder",
                "selectedObject": "=selectedobject",
                "url": "@url",
                "dataField": "@datafield",
                "titleField": "@titlefield",
                "initTitleField": "@initTitleField",
                "descriptionField": "@descriptionfield",
                "imageField": "@imagefield",
                "imageUri": "@imageuri",
                "inputClass": "@inputclass",
                "userPause": "@pause",
                "localData": "=localdata",
                "searchFields": "@searchfields",
                "minLengthUser": "@minlength",
                "matchClass": "@matchclass",
                "initUrl": "@initUrl",
                "addNew": "@addnew",
                "addButton": "@addbutton",
                "addButtonClass": "@addbuttonclass",
                "addNewUrl": "@addnewurl",
                "resetFunction": "=resetFunction",
                "reset": "@reset",
                "disable": "=disable",
                "noresult": "@noResultText",
                "functions": "&functions",
                "outArray": "=outArray",
                "grid_hash": "@gridHash"
//                    "showAddButton": "=showAddNew"
            },
            template: '<div class="angucomplete-holder"><input id="{{id}}_value" ng-readonly="readOnly" ng-model="searchStr" type="text" placeholder="{{placeholder}}" class="{{inputClass}}" onmouseup="this.select();" ng-focus="resetHideResults()" ng-blur="hideResults()" autocomplete="off" ng-disabled="disable"/><a href="#" class="{{ addButtonClass }}" ng-click="putAddress(searchStr)" ng-show="showAddButton && searchStr.length >= minLength && addNew">{{ addButton }}</a><div id="{{id}}_dropdown" class="angucomplete-dropdown" ng-if="showDropdown"><div class="angucomplete-searching" ng-show="searching">Searching...</div><div class="angucomplete-searching" ng-show="!noresult && !searching && (!results || results.length == 0)">No results found</div><div class="angucomplete-searching" ng-show="noresult && !searching && (!results || results.length == 0)">{{ noresult }}</div><div class="angucomplete-row" ng-repeat="result in results" ng-click="selectResult(result)" ng-mouseover="hoverRow()" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}"><div ng-if="imageField" class="angucomplete-image-holder"><img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="angucomplete-image"/><div ng-if="!result.image && result.image != \'\'" class="angucomplete-image-default"></div></div><div class="angucomplete-title" ng-if="matchClass" ng-bind-html="result.title"></div><div class="angucomplete-title" ng-if="!matchClass">{{ result.title }}</div><div ng-if="result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div></div></div></div>',

            compile: function compileFn(){
                var that = this;
                return function linkFn($scope, elem, attrs) {
                    $scope.lastSearchTerm = null;
                    $scope.currentIndex = null;
                    $scope.justChanged = false;
                    $scope.searchTimer = null;
                    $scope.hideTimer = null;
                    $scope.searching = false;
                    $scope.pause = 500;
                    $scope.minLength = 2;
                    $scope.searchStr = null;
                    $scope.showAddButton = false;       //for showing add button

                    if(angular.isFunction($scope.functions)) {
                        $scope.functions({scope: $scope});
                    }
                    if(angular.isDefined($scope.grid_hash) && $scope.grid_hash !== ''){
                        $timeout(function(){
                            var at = "return "+$scope.grid_hash+"_submitForm(event, this.form);";
                            angular.element("#"+$scope.id+"_value").attr("onkeypress",at);
                        },100);
                    }
                    ////////initialization of input//////////////
                    if(angular.isDefined($scope.initUrl)){
                        $http.get($scope.initUrl).success(function(d){
                            if(angular.isDefined(d) && d !== null && d !== "null"){
                                $scope.searchStr = d[$scope.initTitleField];
                                if(!angular.isDefined($scope.selectedObject)) {
                                    $scope.selectedObject = {originalObject: {}};
                                }
                                $scope.selectedObject.originalObject = d;
                            }
                        }).error(function(){
                            console.warn("error getting initialization from url: "+$scope.initUrl);
                        });
                    }
                    /*---------------reset the directive----------------*/
                    //We will call the link function again in event action
                    if(angular.isDefined($scope.reset) && $parse($scope.reset)($scope)){
                        $scope.resetFunction = function(){
                            that.compile()($scope,elem,attrs);
                        };
                    }
                    /*--------------------------------------------------*/
                    /////////set default add new action//////////
                    if(!angular.isDefined($scope.addNew)){
                        $scope.addNew = false;
                    }
                    else {
                        $scope.addNew = $parse($scope.addNew)($scope);
                    };
                    ////////////////////////////////////////////
                    if ($scope.minLengthUser && $scope.minLengthUser !== "") {
                        $scope.minLength = $scope.minLengthUser;
                    }

                    if ($scope.userPause) {
                        $scope.pause = $scope.userPause;
                    }

                    isNewSearchNeeded = function(newTerm, oldTerm) {
                        return newTerm.length >= $scope.minLength;
                    };
                    ///////////////putAddress function////////////////////
                    $scope.putAddress = function(str){
                        var url = $scope.addNewUrl + str;
                        $http.put(url).success(function(d){
                            if(!angular.isDefined($scope.selectedObject) || $scope.selectedObject === null  ) {
                                $scope.selectedObject = {
                                    originalObject: {}
                                };
                            }
                            $scope.selectedObject.originalObject.id = d;
                            $scope.showAddButton = false;
                        }).error(function(d){
                            console.warn("error for putting address");
                        });
                    };
                    /////////////////////////////////////////////////////
                    $scope.processResults = function(responseData, str) {
                        if (responseData && responseData.length > 0) {
                            $scope.results = [];

                            var titleFields = [];
                            if ($scope.titleField && $scope.titleField != "") {
                                titleFields = $scope.titleField.split(",");
                            }

                            for (var i = 0; i < responseData.length; i++) {
                                // Get title variables
                                var titleCode = [];

                                for (var t = 0; t < titleFields.length; t++) {
                                    titleCode.push(responseData[i][titleFields[t]]);
                                }

                                var description = "";
                                if ($scope.descriptionField) {
                                    description = responseData[i][$scope.descriptionField];
                                }

                                var imageUri = "";
                                if ($scope.imageUri) {
                                    imageUri = $scope.imageUri;
                                }

                                var image = "";
                                if ($scope.imageField) {
                                    image = imageUri + responseData[i][$scope.imageField];
                                }

                                var text = titleCode.join(' ');
                                if ($scope.matchClass) {
                                    var re = new RegExp(str, 'i');
                                    var strPart = text.match(re)[0];
                                    text = $sce.trustAsHtml(text.replace(re, '<span class="'+ $scope.matchClass +'">'+ strPart +'</span>'));
                                }

                                var resultRow = {
                                    title: text,
                                    description: description,
                                    image: image,
                                    originalObject: responseData[i]
                                }

                                $scope.results[$scope.results.length] = resultRow;
                            }


                        } else {
                            $scope.results = [];
                        }
                    }

                    $scope.searchTimerComplete = function(str) {
                        // Begin the search

                        if (str.length >= $scope.minLength) {
                            if ($scope.localData) {
                                var searchFields = $scope.searchFields.split(",");

                                var matches = [];

                                for (var i = 0; i < $scope.localData.length; i++) {
                                    var match = false;

                                    for (var s = 0; s < searchFields.length; s++) {
                                        match = match || (typeof $scope.localData[i][searchFields[s]] === 'string' && typeof str === 'string' && $scope.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                                    }

                                    if (match) {
                                        matches[matches.length] = $scope.localData[i];
                                    }
                                }

                                $scope.searching = false;
                                $scope.processResults(matches, str);

                            } else {
                                $http.get($scope.url + str, {}).
                                    success(function(responseData, status, headers, config) {
                                        $scope.searching = false;
                                        if(angular.isDefined(attrs.outArray)){
                                            $scope.outArray = responseData;
                                        }
                                        ///////////////////////////////
                                        if(angular.isDefined((($scope.dataField) ? responseData[$scope.dataField] : responseData )) && !$scope.searching && responseData[$scope.dataField] !== null){
                                            $scope.showAddButton = !((($scope.dataField) ? responseData[$scope.dataField] : responseData ).length);
                                        }
                                        else {
                                            if(!$scope.searching){
                                                $scope.showAddButton = true;
                                            }
                                        }
                                        var middleReg = /\s\d+[^\s]*\s/g;
                                        var endReg = /\s\d+[^\s]*$/g;
                                        var middleMatch = $scope.searchStr.match(middleReg);
                                        var endMatch = $scope.searchStr.match(endReg);
                                        if(angular.isDefined($scope.dataField) && $scope.dataField !== ""){
                                            var array = responseData[$scope.dataField];
                                        }
                                        else {
                                            var array = responseData;
                                        }
                                        show1 = show2 = true;
                                        if(endMatch === null) {
                                            show1 = show2 = false;
                                        }
                                        angular.forEach(array,function(v,k){
                                            if(endMatch !== null){
                                                if(v[$scope.titleField].indexOf(endMatch[0]) === (v[$scope.titleField].length-endMatch[0].length)){
                                                    show1 = false;
                                                }
                                            }
                                            if(middleMatch != null) {
                                                if(v[$scope.titleField].indexOf(middleMatch[0]) !== -1 ||
                                                    v[$scope.titleField].indexOf(middleMatch[1]) !== -1) {
                                                    show2 = false;
                                                }
                                            }
                                        });

                                        $scope.showAddButton = show1 && show2;
                                        ////////////////////////////////
                                        $scope.processResults((($scope.dataField) ? responseData[$scope.dataField] : responseData ), str);
                                    }).
                                    error(function(data, status, headers, config) {
                                        console.log("error");
                                    });
                            }
                        }
                    }

                    $scope.hideResults = function() {
                        $scope.hideTimer = $timeout(function() {
                            $scope.showDropdown = false;
                        }, $scope.pause);
                    };

                    $scope.resetHideResults = function() {
                        if($scope.hideTimer) {
                            $timeout.cancel($scope.hideTimer);
                        };
                    };

                    $scope.hoverRow = function(index) {
                        $scope.currentIndex = index;
                    }

                    $scope.keyPressed = function(event) {
                        if (!(event.which === 38 || event.which === 40 || event.which === 13)) {
                            if (!$scope.searchStr || $scope.searchStr === "") {
                                $scope.showDropdown = false;
                                $scope.lastSearchTerm = null;
                            } else if (isNewSearchNeeded($scope.searchStr, $scope.lastSearchTerm)) {
                                $scope.lastSearchTerm = $scope.searchStr;
                                $scope.showDropdown = true;
                                $scope.currentIndex = -1;
                                $scope.results = [];

                                if ($scope.searchTimer) {
                                    $timeout.cancel($scope.searchTimer);
                                }

                                $scope.searching = true;

                                $scope.searchTimer = $timeout(function() {
                                    $scope.searchTimerComplete($scope.searchStr);
                                }, $scope.pause);
                            }
                        } else {
                            event.preventDefault();
                        }
                    }

                    $scope.selectResult = function(result) {
                        if ($scope.matchClass) {
                            result.title = result.title.toString().replace(/(<([^>]+)>)/ig, '');
                        }
                        $scope.searchStr = $scope.lastSearchTerm = result.title;
                        $scope.selectedObject = result;
                        $scope.showDropdown = false;
                        $scope.results = [];
                        //$scope.$apply();
                    }

                    var inputField = elem.find('input');

                    inputField.on('keyup', $scope.keyPressed);

                    elem.on("keyup", function (event) {
                        if(event.which === 40) {
                            if ($scope.results && ($scope.currentIndex + 1) < $scope.results.length) {
                                $scope.currentIndex ++;
                                $scope.$apply();
                                event.preventDefault;
                                event.stopPropagation();
                            }

                            $scope.$apply();
                        } else if(event.which === 38) {
                            if ($scope.currentIndex >= 1) {
                                $scope.currentIndex --;
                                $scope.$apply();
                                event.preventDefault;
                                event.stopPropagation();
                            }

                        } else if (event.which === 13) {
                            if ($scope.results && $scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                                $scope.selectResult($scope.results[$scope.currentIndex]);
                                $scope.$apply();
//                                event.preventDefault;
//                                event.stopPropagation();
                            } else {
                                $scope.results = [];
                                $scope.$apply();
//                                event.preventDefault;
//                                event.stopPropagation();
                            }

                        } else if (event.which === 27) {
                            $scope.results = [];
                            $scope.showDropdown = false;
                            $scope.$apply();
                        } else if (event.which === 8) {
                            $scope.selectedObject = null;
                            $scope.$apply();
                        }
                    });
                };
            }
        };
    }]);

