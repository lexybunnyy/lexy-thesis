-module(test).
-author("alexa").
-compile(export_all).

%% ------------------ Tests In progress -----------------------------

%% @doc Teszt futtatása a fork-nak
%% @spec (NumOfPids::integer()) -> List
fork(TestList) when is_list(TestList) ->
    NumOfPids = length(TestList),
    apply(nodeHandler, makeNodeStructure, [NumOfPids, fork, TestList, test]);
fork(NumOfPids) ->
    apply(nodeHandler, makeNodeStructure, [NumOfPids, fork]).

%% cannot call on_load main
simulateDistributedCalculate() -> 
	JsonSting = getJSONString(),
	Data = apply(structHandler, getDataByJson, [JsonSting]),
	Result = apply(main, callDistributedCaluclate, [Data]),
	simulateDistributedCalculateHelper(Result).
simulateDistributedCalculate(WatcherNode) -> 
	JsonSting = getJSONString(),
	Data = apply(structHandler, getDataByJson, [JsonSting]),
	Result = apply(main, callDistributedCaluclate, [Data, WatcherNode]),
	simulateDistributedCalculateHelper(Result).
simulateDistributedCalculateHelper(Result) -> 
	case Result of 
		[R1, R2, _R3] -> 
			[
				getResultTestHelper(R1, {"1",[0.0,0.0,1.0]}),
				getResultTestHelper(R2, {"2",[0.0]})
			];
		Wrong -> 
			io:format("simulateDistributedCalculate error ~p \n", [Wrong]),
			[{error, Wrong}]
	end.

%% ------------------ Run ---------------------------------
run(ReturnOk) -> 
	TrueList = runCheck(),
	case trueList(TrueList) of 
		true -> ReturnOk;
		_ -> TrueList
	end.

runCheck() ->
	Element = convertMochiElements(),
	NewPoint = convertStruct(),
	JSONParse2 = getParseJSONParams(),
	Polin = simplifyPolinomialTest(),
	Result = getResultTest(),
	CallCalculate = simulateFirstParseAndRun(),
	[Element, Polin, CallCalculate] ++ JSONParse2 ++ Result ++ NewPoint.

%% ------------------ In Active Run Tests ---------------------------------

simplifyPolinomialTest() -> 
	In = [0.0,0.0,1.0,0.0,0.0,0.0,0.0],
	Result = apply(structHandler, simplifyPolinomial, [In, []]),
	Expected = [0.0,0.0,1.0],
	case Result == Expected of 
		true -> true;
		_ -> {failed, {in, In}, {result, Result}, {expected, Expected}}
	end.

getResultTest() -> 
	In1 = [
		{"1",[0.0,0.0,1.0,0.0,0.0,0.0,0.0]},
		{"2",[0.0,0.0,1.0,0.0,0.0,0.0,0.0]},
		{"3", {error, "Test Error"}},
		{"nodes notfound"}
	],
	Expected1 = {struct,[
		{"1", {array, ["0.0","0.0","1.0","0.0","0.0","0.0","0.0"]}},
		{"2", {array, ["0.0","0.0","1.0","0.0","0.0","0.0","0.0"]}},
		{"3",{array,["{error,\"Test Error\"}"]}},
		{"error",{array,["{\"nodes notfound\"}"]}}
	]},
	In2 = [ {"errorIn", {array,"Hello You have a biggy big error in your head"}} ],
	Expected2 = {struct,[
		{"errorIn", {array,["{array,\"Hello You have a biggy big error in your head\"}"]} }
	]},
	[
		getResultTestHelper([In1], Expected1, structHandler, convertToMochi),
		getResultTestHelper([In2], Expected2, structHandler, convertToMochi)
	].

convertMochiElements() -> 
  DataSetElement = getFirstElementOfDataSet(),
  TableData = apply(structHandler, getTableData, [DataSetElement]),
  7 == apply(structHandler, getElementByKey, ["num_of_points", TableData]).

getParseJSONParams() -> 
	JsonSting = getJSONString(),
	Data = apply(structHandler, getDataByJson, [JsonSting]),
	DataSet = apply(structHandler, getDataSet, [Data]),
	DataLength = length(DataSet),
	DataSetElement = getFirstElementOfDataSet(DataSet),
	Points = apply(structHandler, getPoints, [DataSetElement]),
  	Type = apply(structHandler, getType, [DataSetElement]),
  	Inverse = apply(structHandler, getInverse, [DataSetElement]),
  	X = apply(structHandler, getElementByKey, [x, Points]),
  	Y = apply(structHandler, getElementByKey, [y, Points]),
  	[
  		getResultTestHelper(DataLength, 3),
  		getResultTestHelper(X, [0,1,2,3,4,5,6]),
  		getResultTestHelper(Y, [[0,0,2,0],[1,2,2,0],[4,4,2,0],[9,6,2,0],[16,8,2,0],[25,10,2,0],[36,12,2,0]]),
  		getResultTestHelper(Type, 1),
  		getResultTestHelper(Inverse, 0)
  	].

convertStruct() -> 
	InStruct1 = {struct,[{"x",0},{"y",{array,[0,0,2,0]}}]},
	InStruct2 = {struct,[{"x",1},{"y",{array,[1,2,2,0]}}]},
	InArray = {array,[InStruct1 ,InStruct2]},
	OutSruct1 = [{x,[0]},{y,[[0,0,2,0]]}],
	OutSruct2 = [{x,[1]},{y,[[1,2,2,0]]}],
	OutArray = [{x,[0,1]},{y,[[0,0,2,0],[1,2,2,0]]}],
	[
		getResultTestHelper(InStruct1, OutSruct1, structHandler, getNewPointStruct),
		getResultTestHelper(InStruct2, OutSruct2, structHandler, getNewPointStruct),
		getResultTestHelper([OutSruct1, OutSruct2], OutArray, structHandler, appendNewPointStruct),
		getResultTestHelper(InArray, OutArray, structHandler, convertPoints)
	].

simulateFirstParseAndRun() -> 
	DataSetElement = getFirstElementOfDataSet(),
	Expected = [0.0,0.0,1.0],
	getResultTestHelper([DataSetElement], Expected, calculator, calculateByData).

%% --------------------------------------------------------- helpers 
%% Vissza adja a minta adatok első elemét
getFirstElementOfDataSet() ->
  JsonSting = getJSONString(),
  Data = apply(structHandler, getDataByJson, [JsonSting]),
  DataSet = apply(structHandler, getDataSet, [Data]),
  _DataLength = length(DataSet),
  getFirstElementOfDataSet(DataSet).
getFirstElementOfDataSet([Head]) -> Head;
getFirstElementOfDataSet([Head|_Tail]) -> Head.

%% Egy minta adathalmaz ami jöhet a felületről
getJSONString()  ->
	"{\"data_set\":[{\"id\":\"1\",\"name\":\"new_interpolation_1\",\"type\":\"1\",\"inverse\":false,\"tableData\":{\"points\":[{\"x\":0,\"y\":[0,0,2,0]},{\"x\":1,\"y\":[1,2,2,0]},{\"x\":2,\"y\":[4,4,2,0]},{\"x\":3,\"y\":[9,6,2,0]},{\"x\":4,\"y\":[16,8,2,0]},{\"x\":5,\"y\":[25,10,2,0]},{\"x\":6,\"y\":[36,12,2,0]}],\"num_of_points\":7,\"max_derivate\":3,\"num_of_cols\":8,\"num_of_rows\":5,\"polynomial\":null},\"plotSetting\":{\"xaxis_min\":\"-1\",\"xaxis_max\":\"9\",\"yaxis_min\":\"-1\",\"yaxis_max\":\"36\",\"derivNum_max\":\"\"}},{\"id\":\"2\",\"name\":\"new_interpolation_2\",\"type\":\"0\",\"inverse\":false,\"tableData\":{\"points\":[{\"x\":0,\"y\":[0]}],\"num_of_points\":1,\"max_derivate\":0,\"num_of_cols\":2,\"num_of_rows\":2,\"polynomial\":null},\"plotSetting\":{\"xaxis_min\":\"-2\",\"xaxis_max\":\"2\",\"yaxis_min\":\"-2\",\"yaxis_max\":\"2\",\"derivNum_max\":\"\"}},{\"id\":\"3\",\"name\":\"new_interpolation_3\",\"type\":\"0\",\"inverse\":false,\"tableData\":{\"points\":[{\"x\":0,\"y\":[0,0,2,0]},{\"x\":1,\"y\":[1,2,2,0]},{\"x\":2,\"y\":[4,4,2,0]},{\"x\":3,\"y\":[9,6,2,0]},{\"x\":4,\"y\":[16,8,2,0]},{\"x\":5,\"y\":[25,10,2,0]},{\"x\":6,\"y\":[36,12,2,0]},{\"x\":6.17,\"y\":[27.52]}],\"num_of_points\":8,\"max_derivate\":3,\"num_of_cols\":9,\"num_of_rows\":5,\"polynomial\":null},\"plotSetting\":{\"xaxis_min\":\"-1\",\"xaxis_max\":\"9\",\"yaxis_min\":\"-1\",\"yaxis_max\":\"36\",\"derivNum_max\":\"\"}}]}".	
getJSONStringBig() -> 
	"{\"data_set\":[{\"id\":\"1\",\"name\":\"new_interpolation_1\",\"type\":\"1\",\"inverse\":false,\"tableData\":{\"points\":[{\"x\":0,\"y\":[0,0,2,0]},{\"x\":1,\"y\":[1,2,2,0]},{\"x\":2,\"y\":[4,4,2,0]},{\"x\":3,\"y\":[9,6,2,0]},{\"x\":4,\"y\":[16,8,2,0]},{\"x\":5,\"y\":[25,10,2,0]},{\"x\":6,\"y\":[36,12,2,0]}],\"num_of_points\":7,\"max_derivate\":3,\"num_of_cols\":8,\"num_of_rows\":5,\"polynomial\":null},\"plotSetting\":{\"xaxis_min\":\"-1\",\"xaxis_max\":\"9\",\"yaxis_min\":\"-1\",\"yaxis_max\":\"36\",\"derivNum_max\":\"\"}},{\"id\":\"2\",\"name\":\"new_interpolation_2\",\"type\":\"0\",\"inverse\":false,\"tableData\":{\"points\":[{\"x\":0,\"y\":[0]}],\"num_of_points\":1,\"max_derivate\":0,\"num_of_cols\":2,\"num_of_rows\":2,\"polynomial\":null},\"plotSetting\":{\"xaxis_min\":\"-2\",\"xaxis_max\":\"2\",\"yaxis_min\":\"-2\",\"yaxis_max\":\"2\",\"derivNum_max\":\"\"}},{\"id\":\"3\",\"name\":\"new_interpolation_3\",\"type\":\"0\",\"inverse\":false,\"tableData\":{\"points\":[{\"x\":0,\"y\":[0,0,2,0]},{\"x\":1,\"y\":[1,2,2,0]},{\"x\":2,\"y\":[4,4,2,0]},{\"x\":3,\"y\":[9,6,2,0]},{\"x\":4,\"y\":[16,8,2,0]},{\"x\":5,\"y\":[25,10,2,0]},{\"x\":6,\"y\":[36,12,2,0]},{\"x\":6.17,\"y\":[27.52]}],\"num_of_points\":8,\"max_derivate\":3,\"num_of_cols\":9,\"num_of_rows\":5,\"polynomial\":null},\"plotSetting\":{\"xaxis_min\":\"-1\",\"xaxis_max\":\"9\",\"yaxis_min\":\"-1\",\"yaxis_max\":\"36\",\"derivNum_max\":\"\"}},{\"id\":\"4\",\"name\":\"new_interpolation_4\",\"sender\":\"\"}]}".	

getResultTestHelper(Result, Expected) -> 
	case Result == Expected of 
		true -> true;
		_ -> {failed, {result, Result}, {expected, Expected}}
	end.
getResultTestHelper(In, Expected, Module, Function) ->
	Result = 
		case is_list(In) of 
			true -> apply(Module, Function, In);
			_ -> apply(Module, Function, [In])
		end,
	getResultTestHelper(Result, Expected).

trueList()-> true.
trueList([true]) -> true;
trueList([false]) -> false;
trueList([false|_T]) -> false;
trueList([true|T]) -> trueList(T);
trueList(_Other) -> false.

log(Name, Param) ->
	io:format(Name ++ ": ~p \n", [Param]).

calculate(Data) -> 
	Data*2.