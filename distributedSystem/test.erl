-module(test).
-author("alexa").
-compile(export_all).

run(ReturnOk) -> 
	case trueList(runCheck()) of 
		true -> ReturnOk;
		_ -> error
	end.

%% Segítség az elosztás előtt/Után
simpulateFirstParseAndRun() -> 
	DataSetElement = getFirstElementOfDataSet(),
	Id = apply(struct_handler, getId, [DataSetElement]),
	Result = apply(calculator, calculateByData, [DataSetElement]),
	[{Id, Result}].

runCheck() ->
	Mochis = convertMochi(),
	Element = convertMochiElements(),
	Convert = jsonConvert(),
	Fork = ok == fork(5),
	lists:append(Mochis, [Element, Convert, Fork]).

%% Segítség az elosztáshoz
getFirstElementOfDataSet() ->
  JsonSting = getJSONString(),
  Data = apply(struct_handler, getDataByJson, [JsonSting]),
  DataSet = apply(struct_handler, getDataSet, [Data]),
  DataLength = length(DataSet),
  apply(struct_handler, getArrayElement, [1, DataSet]).

getJSONString() -> 
  "{\"data_set\":[{\"id\":0,\"name\":\"UjInterpolacio1\",\"sender\":{\"type\":0,\"inverse\":0,\"tableData\":{\"points\":[{\"x\":0,\"y\":[0,0,2,0]},{\"x\":1,\"y\":[1,2,2,0]},{\"x\":2,\"y\":[4,4,2,0]},{\"x\":3,\"y\":[9,6,2,0]},{\"x\":4,\"y\":[16,8,2,0]},{\"x\":5,\"y\":[25,10,2,0]},{\"x\":6,\"y\":[36,12,2,0]}],\"num_of_points\":7,\"max_derivate\":3,\"num_of_cols\":8}}},{\"id\":1,\"name\":\"UjInterpolacio2\",\"sender\":{\"type\":1,\"inverse\":1,\"tableData\":{\"points\":[{\"x\":0,\"y\":[0]}],\"num_of_points\":1,\"max_derivate\":0,\"num_of_cols\":2,\"num_of_rows\":2}}}]}".

jsonConvert() -> 
  ConvertPoints = 
	  [ {x,[0,1,2,3,4,5,6]},
	    {y,[[0,0,2,0],
	        [1,2,2,0],
	        [4,4,2,0],
	      	[9,6,2,0],
	     	[16,8,2,0],
	     	[25,10,2,0],
	     	[36,12,2,0]]}],
  DataSetElement = getFirstElementOfDataSet(),
  apply(struct_handler, getPoints, [DataSetElement]) == ConvertPoints.

convertMochiElements() -> 
  DataSetElement = getFirstElementOfDataSet(),
  TableData = apply(struct_handler, getTableData, [DataSetElement]),
  7 == apply(struct_handler, getElementByKey, ["num_of_points", TableData]).

convertMochi() -> 
	InStruct1 = {struct,[{"x",0},{"y",{array,[0,0,2,0]}}]},
	InStruct2 = {struct,[{"x",1},{"y",{array,[1,2,2,0]}}]},
	InArray = {array,[InStruct1 ,InStruct2]},
	OutSruct1 = [{x,[0]},{y,[[0,0,2,0]]}],
	OutSruct2 = [{x,[1]},{y,[[1,2,2,0]]}],
	OutArray = [{x,[0,1]},{y,[[0,0,2,0],[1,2,2,0]]}],
	Test1 = apply(struct_handler, getNewPointStruct, [InStruct1]) == OutSruct1,
	Test2 = apply(struct_handler, getNewPointStruct, [InStruct2]) == OutSruct2,
	Test3 = apply(struct_handler, appendNewPointStruct, [OutSruct1, OutSruct2]) == OutArray,
	Test4 = apply(struct_handler, convertPoints, [InArray]) == OutArray,
	[Test1, Test2, Test3, Test4].

%% @doc Teszt futtatása a fork-nak
%% @spec (NumOfPids::integer()) -> List
fork(TestList) when is_list(TestList) ->
    NumOfPids = length(TestList),
    apply(node_handler, makeNodeStructure, [NumOfPids, fork, TestList]);
fork(NumOfPids) ->
    apply(node_handler, makeNodeStructure, [NumOfPids, fork]).

trueList()-> 
	trueList(convertMochi()).
trueList([true]) -> true;
trueList([false]) -> false;
trueList([false|_T]) -> false;
trueList([true|T]) -> trueList(T);
trueList(_Other) -> false.