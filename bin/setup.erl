#!/usr/bin/env escript
%% -*- erlang -*-
%%! -smp enable -sname factorial -mnesia debug verbose

main(_) -> 
    compile:file(run),
    run:compile(),
    Result = apply(test, run, [ok]),
    case Result of
        ok ->  io:format("Telepites ok\n");
        Error -> io:format("Telepites sikertelen: ~p \n", [Error])
    end.