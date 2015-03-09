-module(calculator).
-export([calculate/4, init/0, calculateByData/1]).
-on_load(init/0).

init() ->
    ok = erlang:load_nif("./calculator", 0).

calculate(_X, _Y, _Type, _Inverz) ->
    exit(nif_library_not_loaded).

calculateByData(DataSetElement) ->
  Points = apply(struct_handler, getPoints, [DataSetElement]),
  Type = apply(struct_handler, getType, [DataSetElement]),
  Inverse = apply(struct_handler, getInverse, [DataSetElement]),
  X = apply(struct_handler, getElementByKey, [x, Points]),
  Y = apply(struct_handler, getElementByKey, [y, Points]),
  calculate(X, Y, Type, Inverse).
