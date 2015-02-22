-module(calculator).
-export([calculate/4, init/0]).
-on_load(init/0).

init() ->
    ok = erlang:load_nif("./calculator", 0).

calculate(_X, _Y, _Type, _Inverz) ->
    exit(nif_library_not_loaded).
