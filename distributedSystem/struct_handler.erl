%%%-------------------------------------------------------------------
%%% @author cselyuszka alexandra
%%% @copyright (C) 2014, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 25. nov. 2014 18:39
%%%-------------------------------------------------------------------
%% c(structHandler).
-module(struct_handler).
-author("alexa").

%% API
-compile(export_all).

testJsonConvert() -> 
  JsonSting = "{\"data_set\":[{\"name\":\"Uj Interpolacio 1\",\"sender\":{\"tableData\":{\"points\":[{\"x\":0,\"y\":[0,0,2,0]},{\"x\":1,\"y\":[1,2,2,0]},{\"x\":2,\"y\":[4,4,2,0]},{\"x\":3,\"y\":[9,6,2,0]},{\"x\":4,\"y\":[16,8,2,0]},{\"x\":5,\"y\":[25,10,2,0]},{\"x\":6,\"y\":[36,12,2,0]}],\"num_of_points\":7,\"max_derivate\":3,\"num_of_cols\":8,\"num_of_rows\":5},\"plotSetting\":{\"xaxis_min\":\"-1\",\"xaxis_max\":\"9\",\"yaxis_min\":\"-1\",\"yaxis_max\":\"36\",\"derivNum_max\":\"\"}}}]}",
  ConvertPoints = 
	  [ {x,[0,1,2,3,4,5,6]},
	    {y,[[0,0,2,0],
	        [1,2,2,0],
	        [4,4,2,0],
	      	[9,6,2,0],
	     	[16,8,2,0],
	     	[25,10,2,0],
	     	[36,12,2,0]]}],
  Data = getDataByJson(JsonSting),
  DataSet = getDataSet(Data),
  DataSetElement = getArrayElement(1, DataSet),
  getPoints(DataSetElement) == ConvertPoints.

testConvertManual() -> 
  JsonSting = "{\"data_set\":[{\"name\":\"Uj Interpolacio 1\",\"sender\":{\"tableData\":{\"points\":[{\"x\":0,\"y\":[0,0,2,0]},{\"x\":1,\"y\":[1,2,2,0]},{\"x\":2,\"y\":[4,4,2,0]},{\"x\":3,\"y\":[9,6,2,0]},{\"x\":4,\"y\":[16,8,2,0]},{\"x\":5,\"y\":[25,10,2,0]},{\"x\":6,\"y\":[36,12,2,0]}],\"num_of_points\":7,\"max_derivate\":3,\"num_of_cols\":8,\"num_of_rows\":5},\"plotSetting\":{\"xaxis_min\":\"-1\",\"xaxis_max\":\"9\",\"yaxis_min\":\"-1\",\"yaxis_max\":\"36\",\"derivNum_max\":\"\"}}}]}",
  Data = getDataByJson(JsonSting),
  DataSet = getDataSet(Data),
  DataSetElement = getArrayElement(1, DataSet),
  TableData = getTableData(DataSetElement),
  getElementByKey("num_of_points", TableData).

testConvert() -> 
	InStruct1 = {struct,[{"x",0},{"y",{array,[0,0,2,0]}}]},
	InStruct2 = {struct,[{"x",1},{"y",{array,[1,2,2,0]}}]},
	InArray = {array,[InStruct1 ,InStruct2]},
	OutSruct1 = [{x,[0]},{y,[[0,0,2,0]]}],
	OutSruct2 = [{x,[1]},{y,[[1,2,2,0]]}],
	OutArray = [{x,[0,1]},{y,[[0,0,2,0],[1,2,2,0]]}],
	Test1 = getNewPointStruct(InStruct1) == OutSruct1,
	Test2 = getNewPointStruct(InStruct2) == OutSruct2,
	Test3 = appendNewPointStruct(OutSruct1, OutSruct2) == OutArray,
	Test4 = convertPoints(InArray) == OutArray,
	Test5 = testJsonConvert(),
	[Test1, Test2, Test3, Test4, Test5].

start() -> 
	compile:file('source/mochijson'),
	testConvert().

%% @doc konvertálók, melyekkel ,egyszerűen megkapjuk a kívánt adatot. 
getDataByJson(JsonSting) -> apply(mochijson, decode, [JsonSting]).
getDataSet(Data) -> getElementByKeyList(["data_set", array], Data).

getTableData(DataSetElement) -> 
	getElementByKeyList(["sender", "tableData"], DataSetElement).

getTableData(DataSetElement, Key) -> 
	KeyList = lists:append(["sender", "tableData"], [Key]),
	getElementByKeyList(KeyList, DataSetElement).

getPoints(DataSetElement) -> 
	Points = getTableData(DataSetElement, "points"),
	convertPoints(Points).

getArrayElement(N,{array, Array}) -> lists:nth(N, Array);
getArrayElement(N, Array) -> lists:nth(N, Array).

%% @doc Segédfüggvények

getElementByKey(array, {array, Array}) -> Array;
getElementByKey(Name, {struct, Struct}) -> getElementByKey(Name, Struct);
getElementByKey(Name,[{Name, Value}]) -> Value;
getElementByKey(_Name,[_Wrong]) -> false;
getElementByKey(Name,[{Name, Value}| _Tail]) -> Value;
getElementByKey(Name,[_Wrong| Tail]) -> getElementByKey(Name, Tail);
getElementByKey(_Wrong, _Wrong2) -> false.

getElementByKeyList([HeadName], Object) ->
  case getElementByKey(HeadName, Object) of
    false -> false;
    NewObject -> NewObject
  end;
getElementByKeyList([HeadName|Tail], Object) ->
  case getElementByKey(HeadName, Object) of
    false -> false;
    NewObject -> getElementByKeyList(Tail, NewObject)
  end.

%% TestStruct = {struct,[{"x",0},{"y",{array,[0,0,2,0]}}]}.
%% TestNewStuct = [{x,[0]},{y,[[0,0,2,0]]}].
%% structHandler:getNewPointStruct(TestStruct).
%% structHandler:getNewPointStruct(TestStruct, TestNewStuct).
getNewPointStruct(OldStruct) ->
  X = getElementByKey("x", OldStruct),
  Y = getElementByKeyList(["y", array], OldStruct),
  ArrayX = lists:append([], [X]),
  ArrayY = lists:append([], [Y]),
  [{x, ArrayX}, {y, ArrayY}].

appendNewPointStruct(
	[{x, Point1X}, {y, Point1Y}], 
	[{x, Point2X}, {y, Point2Y}]) ->
		NewArrayX = lists:append(Point1X, Point2X),
	  	NewArrayY = lists:append(Point1Y, Point2Y),
	  	[{x, NewArrayX}, {y, NewArrayY}].

%% TestStruct = {struct,[{"x",0},{"y",{array,[0,0,2,0]}}]}.
%% TestNewStruct = [{x,[[0,0,2,0]]},{y,[0]}].
%% structHandler:convertPoints([TestStruct], TestNewStruct).
convertPoints({array, Array}) ->
  EmptyStruct =  [{x, []}, {y, []}],
  convertPoints(Array, EmptyStruct);
convertPoints(_Wrong) -> false.

convertPoints([], InStruct) -> InStruct;
convertPoints([Head], InStruct) ->
  ConvertedPoint = getNewPointStruct(Head),
  appendNewPointStruct(InStruct, ConvertedPoint);

convertPoints([Head|Tail], InStruct) ->
  ConvertedPoint = getNewPointStruct(Head),
  CurResult = appendNewPointStruct(InStruct, ConvertedPoint),
  convertPoints(Tail, CurResult);

convertPoints(_Wrong,_Wrong) -> false.
