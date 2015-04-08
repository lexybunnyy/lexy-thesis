-module(test).
-author("alexa").
-compile(export_all).

run(ReturnOk) -> 
	case trueList(runCheck()) of 
		true -> ReturnOk;
		_ -> error
	end.

simulateDistributedCalculate() -> 
	JsonSting = getJSONString(),
	apply(main, callDistributedCaluclate, [JsonSting]).

simplifyPolinomialTest() -> 
	Result = [0.0,0.0,1.0,0.0,0.0,0.0,0.0],
	apply(struct_handler, simplifyPolinomial, [Result, []]).

%%Convertálás: 
convertTest1() -> 
	{In, Expected} = getMochiJsonStruct1(),
	Result = apply(struct_handler, convertToMochi, [In]),
	case Expected == Result of 
		true -> ok;
		_ -> {false, Result, Expected}
	end.

convertTest2() -> 
	{In, Expected} = getMochiJsonStruct2(),
	Result = apply(struct_handler, convertToMochi, [In]),
	case Expected == Result of 
		true -> ok;
		_ -> {false, Result, Expected}
	end.

getMochiJsonStruct2() -> 
	In = [ {"errorIn", {array,"Hello You have a biggy big error in your head"}} ],
	Expected = {struct,[
		{"errorIn", {array,["{array,\"Hello You have a biggy big error in your head\"}"]} }
	]},
	{In, Expected}.

getMochiJsonStruct1() -> 
	In = [
		{"1",[0.0,0.0,1.0,0.0,0.0,0.0,0.0]},
		{"2",[0.0,0.0,1.0,0.0,0.0,0.0,0.0]},
		{"3", {error, "Test Error"}},
		{"nodes notfound"}
	],
	Expected = {struct,[
		{"1", {array, [0.0,0.0,1.0,0.0,0.0,0.0,0.0]}},
		{"2", {array, [0.0,0.0,1.0,0.0,0.0,0.0,0.0]}},
		{"3",{array,["{error,\"Test Error\"}"]}},
		{"error",{array,["{\"nodes notfound\"}"]}}
	]},
	{In, Expected}.

%% Segítség az elosztás előtt/Után
simpulateFirstParseAndRun() -> 
	DataSetElement = getFirstElementOfDataSet(),
	Id = apply(struct_handler, getId, [DataSetElement]),
	Result = apply(calculator, calculateByData, [DataSetElement]),
	{Id, Result}.

%% Segítség az elosztáshoz
getFirstElementOfDataSet() ->
  JsonSting = getJSONString(),
  Data = apply(struct_handler, getDataByJson, [JsonSting]),
  DataSet = apply(struct_handler, getDataSet, [Data]),
  _DataLength = length(DataSet),
  getFirstElementOfDataSet(DataSet).

getFirstElementOfDataSet([Head]) -> Head;
getFirstElementOfDataSet([Head|_Tail]) -> Head.

getJSONString()  ->
	"{\"data_set\":[{\"id\":\"1\",\"name\":\"new_interpolation_1\",\"type\":\"0\",\"inverse\":false,\"tableData\":{\"points\":[{\"x\":0,\"y\":[0,0,2,0]},{\"x\":1,\"y\":[1,2,2,0]},{\"x\":2,\"y\":[4,4,2,0]},{\"x\":3,\"y\":[9,6,2,0]},{\"x\":4,\"y\":[16,8,2,0]},{\"x\":5,\"y\":[25,10,2,0]},{\"x\":6,\"y\":[36,12,2,0]}],\"num_of_points\":7,\"max_derivate\":3,\"num_of_cols\":8,\"num_of_rows\":5,\"polynomial\":null},\"plotSetting\":{\"xaxis_min\":\"-1\",\"xaxis_max\":\"9\",\"yaxis_min\":\"-1\",\"yaxis_max\":\"36\",\"derivNum_max\":\"\"}},{\"id\":\"2\",\"name\":\"new_interpolation_2\",\"type\":\"0\",\"inverse\":false,\"tableData\":{\"points\":[{\"x\":0,\"y\":[0]}],\"num_of_points\":1,\"max_derivate\":0,\"num_of_cols\":2,\"num_of_rows\":2,\"polynomial\":null},\"plotSetting\":{\"xaxis_min\":\"-2\",\"xaxis_max\":\"2\",\"yaxis_min\":\"-2\",\"yaxis_max\":\"2\",\"derivNum_max\":\"\"}},{\"id\":\"3\",\"name\":\"new_interpolation_3\",\"type\":\"0\",\"inverse\":false,\"tableData\":{\"points\":[{\"x\":0,\"y\":[0,0,2,0]},{\"x\":1,\"y\":[1,2,2,0]},{\"x\":2,\"y\":[4,4,2,0]},{\"x\":3,\"y\":[9,6,2,0]},{\"x\":4,\"y\":[16,8,2,0]},{\"x\":5,\"y\":[25,10,2,0]},{\"x\":6,\"y\":[36,12,2,0]},{\"x\":6.17,\"y\":[27.52]}],\"num_of_points\":8,\"max_derivate\":3,\"num_of_cols\":9,\"num_of_rows\":5,\"polynomial\":null},\"plotSetting\":{\"xaxis_min\":\"-1\",\"xaxis_max\":\"9\",\"yaxis_min\":\"-1\",\"yaxis_max\":\"36\",\"derivNum_max\":\"\"}},{\"id\":\"4\",\"name\":\"new_interpolation_4\",\"sender\":\"\"}]}".	

convertMochiElements() -> 
  DataSetElement = getFirstElementOfDataSet(),
  TableData = apply(struct_handler, getTableData, [DataSetElement]),
  7 == apply(struct_handler, getElementByKey, ["num_of_points", TableData]).

getParseJSONParams() -> 
	JsonSting = getJSONString(),
	Data = apply(struct_handler, getDataByJson, [JsonSting]),
	DataSet = apply(struct_handler, getDataSet, [Data]),
	DataLength = length(DataSet),
	DataSetElement = getFirstElementOfDataSet(DataSet),
	Points = apply(struct_handler, getPoints, [DataSetElement]),
  	Type = apply(struct_handler, getType, [DataSetElement]),
  	Inverse = apply(struct_handler, getInverse, [DataSetElement]),
  	X = apply(struct_handler, getElementByKey, [x, Points]),
  	Y = apply(struct_handler, getElementByKey, [y, Points]),
  	[
  		DataLength == 4,
  		X == [0,1,2,3,4,5,6],
  		Y == [[0,0,2,0],[1,2,2,0],[4,4,2,0],[9,6,2,0],[16,8,2,0],[25,10,2,0],[36,12,2,0]],
  		Type == "0",
  		Inverse == false
  	].

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

runCheck() ->
	Mochis = convertMochi(),
	Element = convertMochiElements(),
	JSONParse2 = getParseJSONParams(),
	%%Fork = simulateDistributedCalculate(),
	lists:umerge3(Mochis, [Element], JSONParse2).

calculate(Data) -> 
	Data*2.