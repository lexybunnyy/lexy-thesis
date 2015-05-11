#!/usr/bin/env escript
%% -*- erlang -*-
%%! -smp enable -sname factorial -mnesia debug verbose

main(_) -> 
    compile:file(run),
    run:compile(),
    Result = apply(run, test, []),
    case Result of
        ok ->  ok;%%io:format("Telepites ok\n");
        Error -> throw(Error)%%io:format("Telepites sikertelen: ~p \n", [Error])
    end.