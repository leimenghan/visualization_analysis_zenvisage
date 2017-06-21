var app = angular.module('zenvisage', []);
var globalDatasetInfo;

app.controller('classCreationController', ['$scope', '$rootScope','$http', function ($scope, $rootScope, $http) {

  $scope.AxisInfo = [];

  $rootScope.$on("callLoadAxisInfo", function(){
    $scope.loadAxisInfo();
  });

  $scope.loadAxisInfo = function loadAxisInfo() {
    $scope.AxisInfo = [];
    for (var key in globalDatasetInfo["yAxisColumns"]) {
      $scope.AxisInfo.push(key);
    }
  };

  $scope.createClasses = function() {
    var query = {};
    var classList = [];
    for (i = 1; i < 5; i++) {
      key = $("#class-row-" + i + "\ > div").find(":selected").text();
      val = $("#class-row-" + i + "\ > div > input")[0].value
      if (val && key)
      {
        var keyval = {};
        var min = globalDatasetInfo["yAxisColumns"][key]["min"]
        var max = globalDatasetInfo["yAxisColumns"][key]["max"]
        var replacedMin = val.replace("min", min);
        var replacedMinMax = replacedMin.replace("max", max);
        keyval["name"] = key
        keyval["values"] = JSON.parse("[" + replacedMinMax + "]");
        classList.push(keyval);
      }
    }
    query["dataset"] = getSelectedDataset();
    query["classes"] = classList;

    $http.post('/zv/createClasses', query
    ).then(
        function (response) {
          console.log("success: ", response);
          globalDatasetInfo["classes"] = JSON.parse(response.data)
          $('#class-creation-close-button')[0].click();
        },
        function (response) {
          console.log("failed: ", response);
        }
    );
  }
}]);

app.controller('classInfoController', ['$scope', '$rootScope','$http', function ($scope, $rootScope, $http) {

  $scope.classes = ["test1", "test2"];
  $rootScope.$on("callGetClassInfo", function(){
    $scope.getClassInfo();
  });

  //var testQ = "{\"dataset\":\"real_estate\",\"classes\":[{\"name\":\"soldpricepersqft\",\"values\":[[0,90],[90,25144.643]]},{\"name\":\"listingpricepersqft\",\"values\":[[0,100],[100,1457.0552]]}]}"
  $scope.getClassInfo = function getClassInfo() {
    var query = {};
    query["dataset"] = getSelectedDataset();
    $http.post('/zv/getClassInfo', query
    ).then(
        function (response) {
          console.log("success: ", response);
          globalDatasetInfo["classes"] = response.data
          $scope.classes = response.data["classes"]
        },
        function (response) {
          console.log("failed: ", response);
        }
    );
  }

  $scope.populateClassInfo = function() {
    $scope.AxisInfo = [];
    for (var key in globalDatasetInfo["yAxisColumns"]) {
      $scope.AxisInfo.push(key);
    }
  };

}]);


app.controller('zqlTableController', ['$scope' ,'$http', 'plotResults', '$compile', function ($scope, $http, plotResults, $compile) {
  $scope.input = {};
  $scope.queries = {};
  $scope.queries['zqlRows'] = [];

  $scope.removeRow = function ( index ) {
    $("#table-row-" + index).remove();
  };

  $scope.addRow = function () {
    var table = $("#zql-table > tbody")[0];
    var rowCount = table.rows.length;
    var rowNumber = (rowCount+1).toString();
    //$("#zql-table").append
    $el = $("<tr id=\"table-row-" + rowNumber + "\"" + "class=\"tabler\"><td><a ng-click=\"removeRow(" + rowNumber + ")\"><span class=\"glyphicon glyphicon glyphicon-minus-sign\"></span></a></td><td><input class=\"form-control zql-table name\" type=\"text\" size=\"1\" value=\" \"></td><td><input class=\"form-control zql-table x-val\" type=\"text\" size=\"11\" value=\" \"></td><td><input class=\"form-control zql-table y-val\" type=\"text\" size=\"11\" value=\" \"></td><td><input class=\"form-control zql-table z-val\" type=\"text\" size=\"10\" value=\" \"></td><td><input class=\"form-control zql-table constraints\" type=\"text\" size=\"6\" value=\" \"></td><td></td></tr>").appendTo("#zql-table");
    //<td><input class=\"form-control zql-table process\" type=\"text\" size=\"36\" value=\" \"></td>
    $compile($el)($scope);
    //tree.addLeaf(count);
    //tree.addParent(1);
  };

  $scope.$on('insertRowhelper', function(event){
    var table = $("#zql-table > tbody")[0];
    var rowCount = table.rows.length;
    var rowNumber = (rowCount+1).toString();
    //$("#zql-table").append
    $el = $("<tr id=\"table-row-" + rowNumber + "\"" + "class=\"tabler\"><td><a ng-click=\"removeRow(" + rowNumber + ")\"><span class=\"glyphicon glyphicon glyphicon-minus-sign\"></span></a></td><td><input class=\"form-control zql-table name\" type=\"text\" size=\"1\" value=\" \"></td><td><input class=\"form-control zql-table x-val\" type=\"text\" size=\"11\" value=\" \"></td><td><input class=\"form-control zql-table y-val\" type=\"text\" size=\"11\" value=\" \"></td><td><input class=\"form-control zql-table z-val\" type=\"text\" size=\"10\" value=\" \"></td><td><input class=\"form-control zql-table constraints\" type=\"text\" size=\"6\" value=\" \"></td><td></td></tr>").appendTo("#zql-table");
    //<td><input class=\"form-control zql-table process\" type=\"text\" size=\"36\" value=\" \"></td>
    $compile($el)($scope);
    //tree.addLeaf(count);
    //tree.addParent(1);
  });

  $scope.addProcessRow = function () {
    var table = $("#zql-table > tbody")[0];
    var rowCount = table.rows.length;
    var rowNumber = (rowCount+1).toString();
    //$("#zql-table").append
    $el = $("<tr id=\"table-row-" + rowNumber + "\"" + "class=\"tabler processRow\"><td><a ng-click=\"removeRow(" + rowNumber + ")\"><span class=\"glyphicon glyphicon glyphicon-minus-sign\"></span></a></td><td colspan=\"5\"><input class=\"form-control zql-table process\" type=\"text\" size=\"20\" value=\" \"></td><td></td></tr>").appendTo("#zql-table");
    //<td><input class=\"form-control zql-table process\" type=\"text\" size=\"36\" value=\" \"></td>
    $compile($el)($scope);
    //tree.addParent(count);
  };

  $scope.$on('insertProcessRowhelper', function (event) {
    var table = $("#zql-table > tbody")[0];
    var rowCount = table.rows.length;
    var rowNumber = (rowCount+1).toString();
    //$("#zql-table").append
    $el = $("<tr id=\"table-row-" + rowNumber + "\"" + "class=\"tabler processRow\"><td><a ng-click=\"removeRow(" + rowNumber + ")\"><span class=\"glyphicon glyphicon glyphicon-minus-sign\"></span></a></td><td colspan=\"5\"><input class=\"form-control zql-table process\" type=\"text\" size=\"20\" value=\" \"></td><td></td></tr>").appendTo("#zql-table");
    //<td><input class=\"form-control zql-table process\" type=\"text\" size=\"36\" value=\" \"></td>
    $compile($el)($scope);
    //tree.addParent(count);
  });

  $scope.$on('removeAndInsertRowshelper', function( event, args ) {
    var table = $("#zql-table > tbody")[0];
    var rowCount = table.rows.length;

    for (i = rowCount; i > 0; i--) {
      // $("#table-row-" + i).remove();
      table.deleteRow(i-1)
    }

    for (i = 1; i <= args.n; i++) {
      var rowNumber = (i).toString();

        $el = $("<tr id=\"table-row-" + rowNumber + "\"" + "class=\"tabler\"><td><a ng-click=\"removeRow(" + rowNumber + ")\"><span class=\"glyphicon glyphicon glyphicon-minus-sign\"></span></a></td><td><input class=\"form-control zql-table name\" type=\"text\" size=\"1\" value=\" \"></td><td><input class=\"form-control zql-table x-val\" type=\"text\" size=\"11\" value=\" \"></td><td><input class=\"form-control zql-table y-val\" type=\"text\" size=\"11\" value=\" \"></td><td><input class=\"form-control zql-table z-val\" type=\"text\" size=\"10\" value=\" \"></td><td><input class=\"form-control zql-table constraints\" type=\"text\" size=\"6\" value=\" \"></td><td></td></tr>").appendTo("#zql-table");

      $compile($el)($scope);
  }});


  $scope.submitZQL = function () {

    $("#graph-div").empty();
    createZQLGraph( submitNodeZQL );

    clearUserQueryResultsTable();
    $scope.queries['zqlRows'] = [];
    var processRow = [];
    $( ".tabler" ).each(function( index ) {
      if ( $(this).hasClass("processRow") )
      {
        var processe = $(this).find(".process").val()
        processRow.push(processe);
      }
      else
      {
        var name = $(this).find(".name").val()
        var x = $(this).find(".x-val").val()
        var y = $(this).find(".y-val").val()
        var z = $(this).find(".z-val").val()
        var constraints = $(this).find(".constraints").val()
        // var viz = $(this).find(".viz").val()
        // var processe = $(this).find(".process").val()
        // "processe": processe
        var input = { "name": name, "x": x, "y": y, "z": z, "constraints": constraints, "viz": ""};
        if (checkInput(input)) {
          if (input.name.sketch) {
            // if this row needs to grab data from the sketch
            var points = [];
            this.dataX = [];
            this.dataY = [];
            this.xAxis = getSelectedXAxis();
            this.yAxis = getSelectedYAxis();
            for(var i = 0; i < sketchpadData.length; i++){
              var xp = sketchpadData[i]["xval"];
              var yp = sketchpadData[i]["yval"];
              points.push(new Point( xp, yp ));
              this.dataX.push( xp );
              this.dataY.push( yp );
            }
            input["sketchPoints"] = new SketchPoints(this.xAxis, this.yAxis, points);
            input["x"] = {"attributes": ["'"+ getSelectedXAxis() + "'"], "variable" : "x"+(index+1)};
            input["y"] = {"attributes": ["'"+ getSelectedYAxis() + "'"], "variable" : "y"+(index+1)};
            input["z"] = {"attribute": "'"+ getSelectedCategory() + "'", "values": ["*"], "variable" : "z"+(index+1), expression: undefined};
            "z"+index + "<-'"+ getSelectedCategory() +"'.*";
          }
          $scope.queries['zqlRows'].push(input);
        }
      }
    });

    $.each( processRow, function( index, value ) {
      $scope.queries['zqlRows'][index]["processe"] = value;
    });

    $scope.queries['db'] = getSelectedDataset();
    console.log($scope.queries);

    $http.get('/zv/executeZQLComplete', {params: {'query': JSON.stringify( $scope.queries )}}
    ).then(
        function (response) {
            console.log("success: ", response);
            plotResults.displayUserQueryResults(response.data.outputCharts, $scope.flipY,false);
        },
        function (response) {
            console.log("failed: ", escape(response));
        }
    );
  };

  function submitNodeZQL( d )
  {
    $scope.queries['zqlRows'] = [];
    var input = { "name": "*f1", "x": d.xval, "y": d.yval, "z": d.zval, "constraints": d.constraint, "viz": ""};
    if (checkInput(input)) {
      if (input.name.sketch) {
        // if this row needs to grab data from the sketch
        var points = [];s
        this.dataX = [];
        this.dataY = [];
        this.xAxis = getSelectedXAxis();
        this.yAxis = getSelectedYAxis();
        for(var i = 0; i < sketchpadData.length; i++){
          var xp = sketchpadData[i]["xval"];
          var yp = sketchpadData[i]["yval"];
          points.push(new Point( xp, yp ));
          this.dataX.push( xp );
          this.dataY.push( yp );
        }
        input["sketchPoints"] = new SketchPoints(this.xAxis, this.yAxis, points);
        input["x"] = {"attributes": ["'"+ getSelectedXAxis() + "'"], "variable" : "x"+(index+1)};
        input["y"] = {"attributes": ["'"+ getSelectedYAxis() + "'"], "variable" : "y"+(index+1)};
        input["z"] = {"attribute": "'"+ getSelectedCategory() + "'", "values": ["*"], "variable" : "z"+(index+1), expression: undefined};
        "z"+index + "<-'"+ getSelectedCategory() +"'.*";
      }
      $scope.queries['zqlRows'].push(input);
    }
    $scope.queries['db'] = getSelectedDataset();
    $http.get('/zv/executeZQLComplete', {params: {'query': JSON.stringify( $scope.queries )}}
    ).then(
        function (response) {
            console.log("success: ", response);
            plotResults.displayUserQueryResults(response.data.outputCharts,$scope.flipY, false);
        },
        function (response) {
            console.log("failed: ", escape(response));
        }
    );
  }

}]);

// check for emput x, y and z and then check for syntax correctness
function checkInput(input) {
    var essentialColumns = input.name && input.x && input.y;
    if (essentialColumns === undefined) {
        console.error("X or Y or Z Column cannot be empty.");
        return false;
    }
    input.name = parseName(input.name);
    input.x = parseX(input.x);
    input.y = parseY(input.y);

    var constraints = null, viz = null, processe = null, z = null;
    if (input.z !== undefined) {
        input.z = parseZ(input.z);
    }
    if (input.constraints !== undefined) {
        if (0 === input.constraints.length)
        {
          input.constraints = undefined;
        }
        //input.constraints = input.constraints //parseConstraints(input.constraints);
    }
    if (input.viz !== undefined) {
        input.viz = parseViz(input.viz);
    }
    return (name && x && y && z && constraints && viz) !== undefined;
}

function checkProcessInput(input)
{
    if (input.processe !== undefined) {
      input.processe = parseProcess(input.processe);
    }
    return processe !== undefined;
}

app.factory('datasetInfo', function() {
  var categoryData;
  var xAxisData;
  var yAxisData;
  var datasetService = {};

  datasetService.store = function( response ) {
    categoryData = response.zAxisColumns;
    xAxisData = response.xAxisColumns;
    yAxisData = response.yAxisColumns;
  };
  datasetService.getCategoryData = function()
  {
    return categoryData;
  }
  datasetService.getXAxisData = function()
  {
    return xAxisData;
  }
  datasetService.getYAxisData = function()
  {
    return yAxisData;
  }
  return datasetService;
});

app.factory('plotResults', function() {

    var plottingService = {};
    plottingService.displayUserQueryResults = function displayUserQueryResults( userQueryResults, flipY , includeSketch = true )
    {
      displayUserQueryResultsHelper( userQueryResults, flipY, includeSketch );
    }

    plottingService.displayRepresentativeResults = function displayRepresentativeResults( representativePatternResults,flipY )
    {
      displayRepresentativeResultsHelper( representativePatternResults,flipY )
    }

    plottingService.displayOutlierResults = function displayOutlierResults( outlierResults )
    {
      displayOutlierResultsHelper( outlierResults )
    }

    return plottingService;
});

app.controller('options-controller', [
  '$scope', '$rootScope', '$http', 'plotResults','ChartSettings', '$compile',
  function($scope, $rootScope, $http,plotResults, ChartSettings, $compile){
    $scope.similarity = 'Euclidean';
    $scope.representative = 'kmeans';
    $scope.aggregation = 'avg';
    $scope.numResults = 50;
    $scope.clusterSize = 3;
    $scope.considerRange = true;
    $scope.showOriginalSketch = true;
    $scope.equation =  '';
    $scope.zqltable = false;
    $scope.chartSettings = ChartSettings;
    $scope.chartSettings.chartOptions = ["Line", "Bar", "Scatter"];
    $scope.chartSettings.selectedChartOption = $scope.chartSettings.chartOptions[0];

    $scope.$watchGroup(['similarity', 'numResults'], function( newValue, oldValue ) {
      if (newValue !== oldValue)
      {
        $scope.callGetUserQueryResults();
      }
    });

    $scope.$watch('clusterSize', function( newValue, oldValue ) {
      if (newValue !== oldValue)
      {
        $scope.callgetRepresentativeTrends();
      }
    });

    $scope.$watch('showScatterplot', function( newValue, oldValue ) {
      if (newValue !== oldValue)
      {
        $scope.callGetUserQueryResultsWithCallBack();
      }
    });

    $scope.$watchGroup( ['considerRange' ], function( newValue, oldValue ) {
      if (newValue !== oldValue)
      {
        $scope.callGetUserQueryResultsWithCallBack();
      }
    });

    $scope.$watchGroup( ['showOriginalSketch' ], function( newValue, oldValue ) {
      if (newValue !== oldValue)
      {
        $scope.callGetUserQueryResultsWithCallBack();
      }
    });

    $scope.$watch('representative', function( newValue, oldValue ) {
      if (newValue !== oldValue)
      {
        $scope.callgetRepresentativeTrends();
      }
    });

    $scope.$watch('aggregation', function( newValue, oldValue ) {
      if (newValue !== oldValue)
      {
        $scope.callGetUserQueryResultsWithCallBack();
      }
    });

    $scope.removeAndInsertRows = function( n ){
      $scope.$broadcast('removeAndInsertRowshelper', {n} );
    }

    $scope.insertRow = function(){
      $scope.$broadcast('insertRowhelper');
    }

    $scope.insertProcessRow = function(){
      $scope.$broadcast('insertProcessRowhelper');
    }

    $scope.$watch('flipY', function( newValue, oldValue ) {
      if (newValue !== oldValue)
      {
        //console.log("flipped?",$scope.flipY);
        //$scope.callGetUserQueryResultsWithCallBack();
        $scope.callgetRepresentativeTrends();
      }
    });


    // TOP K
    $scope.getTopK = function()
    {
      clearUserQueryResultsTable();
      var q = constructUserQuery(); //goes to query.js
      var data = q;

      console.log("calling getTopK");
      $http.post('/zv/findbestclass', data).
      success(function(response) {
        console.log("getTopK: success");
        if (response.length == 0){console.log("empty response")}
        plotResults.displayUserQueryResults(response.outputCharts,$scope.flipY,true);
      }).
      error(function(response) {
        console.log("getUserQueryResults: fail");
      });

    }
    
    
    // TOP K
    $scope.submitSDL = function()
    {
      clearUserQueryResultsTable();
      var q = constructSdlQuery(); //goes to query.js
      var data = q;
      console.log("calling execute SDL");
      console.log(data);
      $http.post('/zv/executeSDL', data).
      success(function(response) {
        console.log("execute SDL: success");
        if (response.length == 0){console.log("empty response")}
        console.log(response);
        plotResults.displayUserQueryResults(response.outputCharts,$scope.flipY,true);
      }).
      error(function(response) {
        console.log("getUserQueryResults: fail");
      });

    }

    $scope.clearQuery = function() {
      $scope.removeAndInsertRows( 1 );
      $($( ".tabler" )[0]).find(".name").val("")
      $($( ".tabler" )[0]).find(".x-val").val("")
      $($( ".tabler" )[0]).find(".y-val").val("")
      $($( ".tabler" )[0]).find(".z-val").val("")
      $($( ".tabler" )[0]).find(".constraints").val("")
      $($( ".tabler" )[0]).find(".process").val("")
    }

    $scope.populateWeatherQuery1 = function() {

      $scope.removeAndInsertRows( 1 );

      // $scope.insertRow()
      $($( ".tabler" )[0]).find(".name").val("f1")
      $($( ".tabler" )[0]).find(".x-val").val("x1<-{'month'}")
      $($( ".tabler" )[0]).find(".y-val").val("y1<-{'temperature'}")
      $($( ".tabler" )[0]).find(".z-val").val(" z1<-'location'.*")
      $($( ".tabler" )[0]).find(".constraints").val("location='Melbourne'")
      // $($( ".tabler" )[0]).find(".process").val("")
      $scope.insertRow()
      $($( ".tabler" )[1]).find(".name").val("f2")
      $($( ".tabler" )[1]).find(".x-val").val("x1<-{'month'}")
      $($( ".tabler" )[1]).find(".y-val").val("y1")
      $($( ".tabler" )[1]).find(".z-val").val(" z2<-'location'.*")
      $($( ".tabler" )[1]).find(".constraints").val("")

      $scope.insertProcessRow()
      $($( ".tabler" )[2]).find(".process").val("v2<-argmin_{z2}[k=5]DEuclidean(f1,f2)")

      $scope.insertRow()
      $($( ".tabler" )[3]).find(".name").val("*f3")
      $($( ".tabler" )[3]).find(".x-val").val("x1")
      $($( ".tabler" )[3]).find(".y-val").val("y1")
      $($( ".tabler" )[3]).find(".z-val").val("v2")
      $($( ".tabler" )[3]).find(".constraints").val("")


      // $($( ".tabler" )[2]).find(".process").val("")

    }

    $scope.populateWeatherQuery2 = function() {
      $scope.removeAndInsertRows( 2 );
      $($( ".tabler" )[0]).find(".name").val("f1")
      $($( ".tabler" )[0]).find(".x-val").val("x1<-{'month'}")
      $($( ".tabler" )[0]).find(".y-val").val("y1<-{'temperature'}")
      $($( ".tabler" )[0]).find(".z-val").val(" z1<-'location'.*")
      $($( ".tabler" )[0]).find(".constraints").val("location='Melbourne'")
      // $($( ".tabler" )[0]).find(".process").val("")

      $($( ".tabler" )[1]).find(".name").val("f2")
      $($( ".tabler" )[1]).find(".x-val").val("x1<-{'month'}")
      $($( ".tabler" )[1]).find(".y-val").val("y1")
      $($( ".tabler" )[1]).find(".z-val").val(" z2<-'location'.*")
      $($( ".tabler" )[1]).find(".constraints").val("")

      $scope.insertProcessRow()
      $($( ".tabler" )[2]).find(".process").val("v2<-argmax_{z2}[k=5]DEuclidean(f1,f2)")

      $scope.insertRow()
      $($( ".tabler" )[3]).find(".name").val("*f3")
      $($( ".tabler" )[3]).find(".x-val").val("x1")
      $($( ".tabler" )[3]).find(".y-val").val("y1")
      $($( ".tabler" )[3]).find(".z-val").val("v2")
      $($( ".tabler" )[3]).find(".constraints").val("")
      // $($( ".tabler" )[3]).find(".process").val("")
    }

    $scope.populateWeatherQuery3 = function() {
      $scope.removeAndInsertRows( 1 );
      $($( ".tabler" )[0]).find(".name").val("f1")
      $($( ".tabler" )[0]).find(".x-val").val("x1<-{'year'}")
      $($( ".tabler" )[0]).find(".y-val").val("y1<-{'temperature'}")
      $($( ".tabler" )[0]).find(".z-val").val(" z1<-'location'.*")
      $($( ".tabler" )[0]).find(".constraints").val("")

      $scope.insertProcessRow()
      $($( ".tabler" )[1]).find(".process").val("v1<-argmax_{z1}[k=5]T(f1)")

      $scope.insertRow()
      $($( ".tabler" )[2]).find(".name").val("*f2")
      $($( ".tabler" )[2]).find(".x-val").val("x1")
      $($( ".tabler" )[2]).find(".y-val").val("y1")
      $($( ".tabler" )[2]).find(".z-val").val("v1")
      $($( ".tabler" )[2]).find(".constraints").val("")
      $($( ".tabler" )[2]).find(".process").val("")
    }

    // $scope.populateQuery1 = function() {
    //   $scope.removeAndInsertRows( 1 );
    //   $($( ".tabler" )[0]).find(".name").val("*f1")
    //   $($( ".tabler" )[0]).find(".x-val").val("x1<-{'year'}")
    //   $($( ".tabler" )[0]).find(".y-val").val("y1<-{'soldprice'}")
    //   $($( ".tabler" )[0]).find(".z-val").val("z1<-'state'.*")
    //   $($( ".tabler" )[0]).find(".constraints").val("state='CA'")
    //   // $($( ".tabler" )[0]).find(".process").val("")
    // }

    // $scope.populateQuery2 = function() {

    //   $scope.removeAndInsertRows( 3 );
    //   $($( ".tabler" )[0]).find(".name").val("f1")
    //   $($( ".tabler" )[0]).find(".x-val").val("x1<-{'year'}")
    //   $($( ".tabler" )[0]).find(".y-val").val("y1<-{'soldprice'}")
    //   $($( ".tabler" )[0]).find(".z-val").val(" z1<-'state'.*")
    //   $($( ".tabler" )[0]).find(".constraints").val("state='CA'")
    //   $($( ".tabler" )[0]).find(".process").val("")

    //   $($( ".tabler" )[1]).find(".name").val("f2")
    //   $($( ".tabler" )[1]).find(".x-val").val("x1")
    //   $($( ".tabler" )[1]).find(".y-val").val("y1")
    //   $($( ".tabler" )[1]).find(".z-val").val("z2<-'state'.*")
    //   $($( ".tabler" )[1]).find(".constraints").val("")
    //   $($( ".tabler" )[1]).find(".process").val("v2<-argmin_{z2}[k=7]DEuclidean(f1,f2)")

    //   $($( ".tabler" )[2]).find(".name").val("*f3")
    //   $($( ".tabler" )[2]).find(".x-val").val("x1")
    //   $($( ".tabler" )[2]).find(".y-val").val("y1")
    //   $($( ".tabler" )[2]).find(".z-val").val("v2")
    //   $($( ".tabler" )[2]).find(".constraints").val("")
    //   $($( ".tabler" )[2]).find(".process").val("")
    // }

    $scope.populateQuery3 = function() {

      $scope.removeAndInsertRows( 2 );
      $($( ".tabler" )[0]).find(".name").val("f1")
      $($( ".tabler" )[0]).find(".x-val").val("x1<-{'year','month'}")
      $($( ".tabler" )[0]).find(".y-val").val("y1<-{'soldprice','listingprice'}")
      $($( ".tabler" )[0]).find(".z-val").val("z1<-'state'.'CA'")
      $($( ".tabler" )[0]).find(".constraints").val("")
      $($( ".tabler" )[0]).find(".process").val("")

      $($( ".tabler" )[1]).find(".name").val("f2")
      $($( ".tabler" )[1]).find(".x-val").val("x1")
      $($( ".tabler" )[1]).find(".y-val").val("y1")
      $($( ".tabler" )[1]).find(".z-val").val("z2<-'state'.'NY'")
      $($( ".tabler" )[1]).find(".constraints").val("")

      $scope.insertProcessRow()
      $($( ".tabler" )[2]).find(".process").val("x2,y2<-argmin_{x1,y1}[k=1]DEuclidean(f1,f2)")

      $scope.insertRow()
      $($( ".tabler" )[3]).find(".name").val("*f3")
      $($( ".tabler" )[3]).find(".x-val").val("x2")
      $($( ".tabler" )[3]).find(".y-val").val("y2")
      $($( ".tabler" )[3]).find(".z-val").val("'state'.{'CA','NY'}")
      $($( ".tabler" )[3]).find(".constraints").val("")
      $($( ".tabler" )[3]).find(".process").val("")
    }

    $scope.populateQuery4 = function() {
      $scope.removeAndInsertRows( 2 );
      $($( ".tabler" )[0]).find(".name").val("f1")
      $($( ".tabler" )[0]).find(".x-val").val("x1<-{'year'}")
      $($( ".tabler" )[0]).find(".y-val").val("y1<-{'soldprice'}")
      $($( ".tabler" )[0]).find(".z-val").val("z1<-'state'.*")
      $($( ".tabler" )[0]).find(".constraints").val("state='NY'")
      $($( ".tabler" )[0]).find(".process").val("")

      $($( ".tabler" )[1]).find(".name").val("f2")
      $($( ".tabler" )[1]).find(".x-val").val("x1")
      $($( ".tabler" )[1]).find(".y-val").val("y1")
      $($( ".tabler" )[1]).find(".z-val").val("z2<-'city'.*")
      $($( ".tabler" )[1]).find(".constraints").val("")

      $scope.insertProcessRow()
      $($( ".tabler" )[2]).find(".process").val("v2<-argmax_{z2}[k=3]DEuclidean(f1,f2)")

      $scope.insertRow()
      $($( ".tabler" )[3]).find(".name").val("*f3")
      $($( ".tabler" )[3]).find(".x-val").val("x1")
      $($( ".tabler" )[3]).find(".y-val").val("y1")
      $($( ".tabler" )[3]).find(".z-val").val("v2")
      $($( ".tabler" )[3]).find(".constraints").val("")
      $($( ".tabler" )[3]).find(".process").val("")
    }

    $scope.populateQuery5 = function() {
      //Pairwise example
      $scope.removeAndInsertRows( 2 );
      $($( ".tabler" )[0]).find(".name").val("f1")
      $($( ".tabler" )[0]).find(".x-val").val("x1<-{'year'}")
      $($( ".tabler" )[0]).find(".y-val").val("y1<-{'soldprice'}")
      $($( ".tabler" )[0]).find(".z-val").val("z1<-'state'.*")
      $($( ".tabler" )[0]).find(".constraints").val("")
      $($( ".tabler" )[0]).find(".process").val("")

      $($( ".tabler" )[1]).find(".name").val("f2")
      $($( ".tabler" )[1]).find(".x-val").val("x1")
      $($( ".tabler" )[1]).find(".y-val").val("y2<-{'listingprice'}")
      $($( ".tabler" )[1]).find(".z-val").val("z1")
      $($( ".tabler" )[1]).find(".constraints").val("")

      $scope.insertProcessRow()
      $($( ".tabler" )[2]).find(".process").val("v1<-argmin_{z1}[k=7]DEuclidean(f1,f2)")

      $scope.insertRow()
      $($( ".tabler" )[3]).find(".name").val("*f3")
      $($( ".tabler" )[3]).find(".x-val").val("x1")
      $($( ".tabler" )[3]).find(".y-val").val("y3<-{'soldprice','listingprice'}")
      $($( ".tabler" )[3]).find(".z-val").val("v1")
      $($( ".tabler" )[3]).find(".constraints").val("")
      $($( ".tabler" )[3]).find(".process").val("")
    }
    $scope.drawFunction = function() {
      var xval = [];
      var plotData = [];

      for(var i = 0; i < sketchpadData.length; i++){
        var xp = sketchpadData[i]["xval"];
        //var yp = sketchpadData[i]["yval"];
        xval.push( xp )
      }

      var scope = {
        x: xval,
      };

      var eq = $scope.equation.replace("^", ".^");
      var y = math.eval( eq, scope )
      if( eq.includes("x") )
      {
        for (i = 0; i < xval.length; i++) {
          plotData.push( { "xval": xval[i], "yval":y[i] } )
        }
      }
      else
      {
        for (i = 0; i < xval.length; i++) {
          plotData.push( { "xval": xval[i], "yval": y } )
        }
      }

      angular.element('#class-creation').triggerHandler('click');

      var zType = angular.element($("#sidebar")).scope().selectedCategory;
      var xType = angular.element($("#sidebar")).scope().selectedXAxis;
      var yType = angular.element($("#sidebar")).scope().selectedYAxis;

      plotSketchpadNew( plotData )
      //angular.element($("#sidebar")).scope().getUserQueryResults();
    }

    $scope.callGetUserQueryResults = function() {
      $rootScope.$emit("callGetUserQueryResults", {});
    }

    $scope.callgetRepresentativeTrends = function() {
      $rootScope.$emit("callgetRepresentativeTrends", {});
    }

    $scope.callGetUserQueryResultsWithCallBack = function() {
      $rootScope.$emit("callGetUserQueryResultsWithCallBack", {});
    }

}]);



// populates and controls the dataset attributes on the left-bar
// does not dynamically adjust to change in dataset yet
app.controller('datasetController', [
  '$scope', '$rootScope', '$http', 'datasetInfo', 'plotResults', 'ScatterService', 'ChartSettings',
  function($scope, $rootScope, $http, datasetInfo, plotResults, scatterService, ChartSettings){

    $scope.flipY = false;

    $scope.chartSettings = ChartSettings;
    function initializeSketchpadOnDataAttributeChange( xdata, ydata, zdata )
    {
      clearRepresentativeTable();
      clearOutlierTable();
      clearUserQueryResultsTable();

      switch( $scope.chartSettings.selectedChartOption ) {
          case 'Bar':
              break;
          case 'Scatter':
              scatterService.initializeScatterPlot(xdata["min"],xdata["max"],ydata["min"],ydata["max"]);
              break;
          default: // Line
              initializeSketchpadNew(
                xdata["min"],xdata["max"],ydata["min"],ydata["max"],
                xdata["name"],ydata["name"],zdata["name"] , $scope.flipY
               );
              break;
      }
    }

    $scope.callLoadAxisInfo = function() {
      $rootScope.$emit("callLoadAxisInfo", {});
    }

    $scope.callGetClassInfo = function() {
      $rootScope.$emit("callGetClassInfo", {});
    }

    $scope.getUserQueryResultsWithCallBack = function getUserQueryResultsWithCallBack()
    {

      clearUserQueryResultsTable();
      var q = constructUserQuery(); //goes to query.js
      var data = q;
      console.log("calling getUserQueryResults");
      $http.post('/zv/postSimilarity', data).
      success(function(response) {
        console.log("getUserQueryResults: success");
        if (response.length == 0){console.log("empty response")}
        plotResults.displayUserQueryResults(response.outputCharts,$scope.flipY,true);
        $scope.getRepresentativeTrendsWithoutCallback();
      }).
      error(function(response) {
        console.log("getUserQueryResults: fail");
      });
    }

    // for all other normal queries
    $scope.getUserQueryResults = function getUserQueryResults()
    {
      clearUserQueryResultsTable();
      var q = constructUserQuery(); //goes to query.js
      var data = q;

      console.log("calling getUserQueryResults");
      $http.post('/zv/postSimilarity', data).
      success(function(response) {
        console.log("getUserQueryResults: success");
        if (response.length == 0){console.log("empty response")}
        plotResults.displayUserQueryResults(response.outputCharts,$scope.flipY,true);
      }).
      error(function(response) {
        console.log("getUserQueryResults: fail");
      });

    }

    $scope.getRepresentativeTrendsWithoutCallback = function getRepresentativeTrendsWithoutCallback()
    {
      getRepresentativeTrends( getOutlierTrends );
    }

    // for representative trends
    function getRepresentativeTrends( outlierCallback )
    {
      clearRepresentativeTable();

      var q = constructRepresentativeTrendQuery(); //goes to query.js
      var data = q;

      console.log("calling getRepresentativeTrends");
      $http.post('/zv/postRepresentative', data).
      success(function(response) {
        console.log("getRepresentativeTrends: success");
        if (response.length == 0){console.log("empty response")}
        plotResults.displayRepresentativeResults( response.outputCharts , $scope.flipY );
        outlierCallback();
      }).
      error(function(response) {
        console.log("getRepresentativeTrends: fail");
      });
    }

    function getOutlierTrends()
    {
      clearOutlierTable();

      var q = constructOutlierTrendQuery(); //goes to query.js
      var data = q;

      console.log("calling getOutlierTrends");
      $http.post('/zv/postOutlier', data).
      success(function(response) {
        console.log("getOutlierTrends: success");
        if (response.length == 0){console.log("empty response")}
        plotResults.displayOutlierResults( response.outputCharts );
      }).
      error(function(response) {
        console.log("getOutlierTrends: fail");
      });
    }

    var q = constructDatasetChangeQuery(getSelectedDataset());
    //var q = constructDatasetChangeQuery("seed2");

    var params = {
      "query": q,
    };
    var config = {
      params: params,
    };

   $scope.onDatasetChange = function() {

      clearRepresentativeTable();
      clearOutlierTable();
      clearUserQueryResultsTable();

      var q = constructDatasetChangeQuery(getSelectedDataset());

      var params = {
        "query": q,
      };
      var config = {
        params: params,
      };

      $http.get('/zv/getformdata', config).
        success(function(response) {
          globalDatasetInfo = response;
          datasetInfo.store(response); //saves form data to datasetInfo
          $scope.categories = [];
          $scope.xAxisItems = [];
          $scope.yAxisItems = [];
          $scope.selectedCategory;
          $scope.selectedXAxis;
          $scope.selectedYAxis;
          angular.forEach(response.zAxisColumns, function(value, key) {
           $scope.categories.push(key);
          });
          $scope.selectedCategory = $scope.categories[0];
          angular.forEach(response.xAxisColumns, function(value, key) {
           $scope.xAxisItems.push(key);
          });
          $scope.selectedXAxis = $scope.xAxisItems[0];
          angular.forEach(response.yAxisColumns, function(value, key) {
           $scope.yAxisItems.push(key);
          });
          $scope.selectedYAxis = $scope.yAxisItems[0];
          //send in first item info

          // $.when(initializeSketchpadOnDataAttributeChange(
          //       response.xAxisColumns[$scope.xAxisItems[0]],
          //       response.yAxisColumns[$scope.yAxisItems[0]],
          //       response.zAxisColumns[$scope.categories[0]]
          //     )).done(function(){
          //       getRepresentativeTrends( getOutlierTrends );
          //     });
          initializeSketchpadOnDataAttributeChange(
                response.xAxisColumns[$scope.xAxisItems[0]],
                response.yAxisColumns[$scope.yAxisItems[0]],
                response.zAxisColumns[$scope.categories[0]]
              );
          $scope.getUserQueryResultsWithCallBack();
        }).

        error(function(response) {
          alert('Request failed: /getformdata');
        });
    }

    // when the data selection is changed, the graphs needs to be re-initialized
    // and the rest of the graphs have to be fetched
    $scope.onDataAttributeChange = function() {
      var categoryData = datasetInfo.getCategoryData()[getSelectedCategory()]
      var xData = datasetInfo.getXAxisData()[getSelectedXAxis()]
      var yData = datasetInfo.getYAxisData()[getSelectedYAxis()]
      // $.when(initializeSketchpadOnDataAttributeChange(xData, yData, categoryData))
      // .done(function(){
      //   getRepresentativeTrends( getOutlierTrends );
      // });
      initializeSketchpadOnDataAttributeChange(xData, yData, categoryData);
      $scope.getUserQueryResultsWithCallBack();
    };

    $scope.onflipYChange = function() {
      var categoryData = datasetInfo.getCategoryData()[getSelectedCategory()]
      var xData = datasetInfo.getXAxisData()[getSelectedXAxis()]
      var yData = datasetInfo.getYAxisData()[getSelectedYAxis()]
      // $.when(initializeSketchpadOnDataAttributeChange(xData, yData, categoryData))
      // .done(function(){
      //   getRepresentativeTrends( getOutlierTrends );
      // });
      initializeSketchpadOnDataAttributeChange(xData, yData, categoryData);
      $scope.getUserQueryResultsWithCallBack();
    //  $scope.callGetUserQueryResultsWithCallBack();
    //  $scope.callgetRepresentativeTrends();
      console.log("flipY",$scope.flipY)
    };

    $rootScope.$on("callGetUserQueryResultsWithCallBack", function(){
      $scope.getUserQueryResultsWithCallBack();
    });

    $rootScope.$on("callGetUserQueryResults", function(){
      $scope.getUserQueryResults();
    });

    $rootScope.$on("callgetRepresentativeTrends", function(){
      $scope.getRepresentativeTrendsWithoutCallback();
    });
}]);

app.service('ChartSettings', function () {
    return {};
})

  // $('#tree-option').click(function() {
  //   $(this).toggleClass("active");
  //   $("#tree-div").toggle("active");
  // });
