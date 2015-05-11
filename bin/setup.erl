#!/usr/bin/env escript
%% -*- erlang -*-
%%! -smp enable -sname factorial -mnesia debug verbose

main(_) -> 
    compile:file(run),
    run:compile(),
    Result = apply(run, test, []),
    case Result of
        ok ->  ok;%%io:format("Telepites ok\n");
        _ -> handleError(Result)
    end.

handleError(Error) ->
	io:format("Telepites sikertelen!"),
	try 
		io_lib:format("~p", [Error])
	of 
		FormatError -> throw(FormatError)
	catch
		_:_ -> throw(error)
	end.