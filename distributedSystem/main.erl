%%%-------------------------------------------------------------------
%%% @author alexa
%%% @copyright (C) 2014, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 18. márc. 2014 11:16
%%%-------------------------------------------------------------------
-module(main).
-author("alexa").

%% API
%%-export([]).
-compile(export_all).

run1(NumOfPids) ->
    %%compile:file(asszoc.erl),
    make_calculator(NumOfPids,asszoc).
run2(NumOfPids) ->
    compile:file(fork.erl),
    make_calculator(NumOfPids,fork).

make_calculator(NumOfPids, Func) ->
  {PidList, EndPid }= make_pids(Func,NumOfPids,NumOfPids-1, []),
  io:format("The process started: ~p (End: ~p)\n",[PidList, EndPid]),
  apply(Func, sender, [PidList, NumOfPids]),
  Result = apply(Func, receiver, [[], EndPid]),
  io:format("The result: ~p \n", [Result]).
%%del_pids(PidList).

make_pids(Func,N,0,PidList) ->
  NewPid = spawn(Func, worker_main, [self(), N, 8000]),
  {PidList ++ [NewPid], NewPid};
make_pids(Func,N,X,PidList) ->
  NewPid = spawn(Func, worker_main, [self(), N-X, 8000]),
  make_pids(Func,N,X-1, PidList ++ [NewPid]).

del_pids([]) -> err;
del_pids([H]) ->
  H ! {self(),theEnd},
  receive
    {H,N,theEnd} ->  io:format("~p : The process ended (~p) \n",[self(),{H,N}])
  end,
  ok;
del_pids([H|T]) ->
  H ! {self(),theEnd},
  receive
    {H,N,theEnd} ->  io:format("~p : The process ended (~p)\n",[self(),{H,N}])
  end,
  del_pids(T).
