-module(calculator).
-export([exportTest1/1, exportTest2/1, calculate/2, init/0]).
-on_load(init/0).

init() ->
    ok = erlang:load_nif("./calculator", 0).

%% Test Connection
exportTest1(_X) ->
    exit(nif_library_not_loaded).
exportTest2(_Y) ->
    exit(nif_library_not_loaded).
calculate(_X, _Y) ->
    exit(nif_library_not_loaded).
