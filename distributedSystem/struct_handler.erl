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

%% @doc konvertálók, melyekkel ,egyszerűen megkapjuk a kívánt adatot. 
getDataByJson(JsonSting) -> apply(mochijson, decode, [JsonSting]).
getDataSet(Data) -> getElementByKeyList(["data_set", array], Data).
getDataSetStruct(Data) -> getElementByKeyList(["data_set", struct], Data).

convertStringList(Array) ->
  convertStringList(Array, []).
convertStringList([], Array) -> 
  Array;
convertStringList([H], Array) -> 
  Array ++ [convetString(H)];
convertStringList([H|T], Array) ->
  convertStringList(T, Array ++ [convetString(H)]);
convertStringList(_other, _array) -> error.

convertAnElement({Key, Array}) when is_list(Array)-> 
  {Key, {array, convertStringList(Array)}};
convertAnElement({Key, Array}) -> 
  {Key, {array, [convetString(Array)]}};
convertAnElement(Obj) -> 
  {"error", {array, [convetString(Obj)]}}.

convetString(Term) -> lists:flatten(io_lib:format("~p", [Term])).

structArrayParser([], Array) ->
  Array;
structArrayParser([H], Array) -> 
  Array ++ [convertAnElement(H)];
structArrayParser([H|T], Array) ->
  structArrayParser(T, Array ++ [convertAnElement(H)]);
structArrayParser(Object, _Array) -> 
  [convertAnElement(Object)].


convertResultList(List) -> 
  convertStringList(simplifyPolinomial(List, [])).

simplifyPolinomial([H], Array) ->
  case isFullNullList(H) of
    true -> Array;
    _ -> Array ++ [H]
  end;
simplifyPolinomial([H|T], Array) ->
  io:format("simplifyPolinomial: ~p ~p ~p \n", [H, T, Array]),
  case isFullNullList(T) of
    true -> Array ++ [H];
    _ -> simplifyPolinomial(T, Array ++ [H])
  end.
isFullNullList(List) when is_list(List) -> 
  {_List, Res} = lists:mapfoldl(
    fun(X, Res) -> {X, Res and isPoliNullElement(X)} end, true, List),
  Res;
isFullNullList(List) -> false.
isPoliNullElement(X) ->
  case is_float(X) of
    true -> X == 0.0;
    _ -> false
  end.

convertToMochi(Object) -> 
  StructList = structArrayParser(Object, []),
  {struct, StructList}.

getTableData(DataSetElement) -> 
	getElementByKeyList(["sender", "tableData"], DataSetElement).

getInverse(DataSetElement) -> 
  getElementByKeyList(["sender", "inverse"], DataSetElement).

getType(DataSetElement) -> 
  getElementByKeyList(["sender", "type"], DataSetElement).

getId(DataSetElement) ->
  getElementByKeyList(["id"], DataSetElement).

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
getElementByKey(struct, {struct, Array}) -> Array;
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
