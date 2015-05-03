-module(calculator).
-export([calculate/4, init/0, calculateByData/1]).
-on_load(init/0).

init() ->
    ok = erlang:load_nif("./calculator", 0).

calculate(_X, _Y, _Type, _Inverz) ->
    exit(nif_library_not_loaded).

calculateByData(DataSetElement) ->
  Points = apply(structHandler, getPoints, [DataSetElement]),
  Type = apply(structHandler, getType, [DataSetElement]),
  Inverse = apply(structHandler, getInverse, [DataSetElement]),
  X = apply(structHandler, getElementByKey, [x, Points]),
  Y = apply(structHandler, getElementByKey, [y, Points]),
  Result = calculate(X, Y, Type, Inverse),
  apply(structHandler, simplifyPolinomial, [Result, []]).
