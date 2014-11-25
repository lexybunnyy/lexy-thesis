%%%-------------------------------------------------------------------
%%% @author cselyuszka alexandra
%%% @copyright (C) 2014, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 25. nov. 2014 18:39
%%%-------------------------------------------------------------------
-module(structHandler).
-author("alexa").

%% API
-compile(export_all).

%% @doc Teszt futtatása a structnak-nak
%% @spec (NumOfPids::integer()) -> List
testMochiJSON() ->
  compile:file('source/mochijson'),
  JsonSting = "{\"data_set\":[{\"name\":\"Uj Interpolacio 1\",\"sender\":{\"tableData\":{\"points\":[{\"x\":0,\"y\":[0,0,2,0]},{\"x\":1,\"y\":[1,2,2,0]},{\"x\":2,\"y\":[4,4,2,0]},{\"x\":3,\"y\":[9,6,2,0]},{\"x\":4,\"y\":[16,8,2,0]},{\"x\":5,\"y\":[25,10,2,0]},{\"x\":6,\"y\":[36,12,2,0]}],\"num_of_points\":7,\"max_derivate\":3,\"num_of_cols\":8,\"num_of_rows\":5},\"plotSetting\":{\"xaxis_min\":\"-1\",\"xaxis_max\":\"9\",\"yaxis_min\":\"-1\",\"yaxis_max\":\"36\",\"derivNum_max\":\"\"}}}]}",
  Data = apply(mochijson, decode, [JsonSting]),
  Array = getInterpolationArray(Data),
  FirstElement = getFirstElementSender(Array),
  Points = getElementsByName(["tableData", "points"], FirstElement),
  convertPoints(Points).

getInterpolationArray({struct, [{"data_set", {array, Array}}]}) -> Array.

getFirstElementName([Head]) -> getName(Head).
getFirstElementSender([Head]) -> getSender(Head).

getName({struct, ObjectHead})->getName(ObjectHead);
getName([{"name", Name},_Sender])-> Name.

getSender({struct, ObjectHead})->getSender(ObjectHead);
getSender([{"name", _Name},{"sender", {struct, SenderList}}])-> SenderList.

getElementByName(array, {array, Array}) -> Array;
getElementByName(struct, {struct, Struct}) -> Struct;
getElementByName(Name, {struct, Array}) -> getElementByName(Name, Array);
getElementByName(Name,[{Name, Value}]) -> Value;
getElementByName(_Name,[_Wrong]) -> false;
getElementByName(Name,[{Name, Value}| _Tail]) -> Value;
getElementByName(Name,[_Wrong| Tail]) -> getElementByName(Name, Tail);
getElementByName(_Wrong, _Wrong2) -> false.

getElementsByName([HeadName], Object) ->
  case getElementByName(HeadName, Object) of
    false -> false;
    NewObject -> NewObject
  end;
getElementsByName([HeadName|Tail], Object) ->
  case getElementByName(HeadName, Object) of
    false -> false;
    NewObject -> getElementsByName(Tail, NewObject)
  end.


%% TestStruct = {struct,[{"x",0},{"y",{array,[0,0,2,0]}}]}.
%% structHandler:getNewPointStruct(TestStruct).
getNewPointStruct(OldStruct) ->
  X = getElementByName("x", OldStruct),
  Y = getElementsByName(["y", array], OldStruct),
  ArrayX = lists:append([], [X]),
  ArrayY = lists:append([], [Y]),
  [{x, ArrayX}, {y, ArrayY}].
getNewPointStruct(OldStruct, [{x, []}, {y, []}]) ->
  getNewPointStruct(OldStruct);
getNewPointStruct(OldStruct, [{x, ArrayX}, {y, ArrayY}]) ->
  X = getElementByName("x", OldStruct),
  Y = getElementsByName(["y", array], OldStruct),
  ArrayY = lists:append(ArrayY, [Y]),
  ArrayX = lists:append(ArrayX, [X]),
  [{x, ArrayX}, {y, ArrayY}].

%% TestStruct = {struct,[{"x",0},{"y",{array,[0,0,2,0]}}]}.
%% TestNewStruct = [{x,[[0,0,2,0]]},{y,[0]}].
%% convertPoints([TestStruct], TestNewStruct)
convertPoints({array, Array}) ->
  EmptyStruct =  [{x, []}, {y, []}],
  convertPoints(Array, EmptyStruct);
convertPoints(_Wrong) -> false.
convertPoints([Head], NewStuct) ->
  getNewPointStruct(Head, NewStuct);
convertPoints([Head|Tail], NewStuct) ->
  NewStuct = getNewPointStruct(Head, NewStuct),
  convertPoints(Tail, NewStuct);
convertPoints(_Wrong,_Wrong) -> false.
