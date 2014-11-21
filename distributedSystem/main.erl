%%%-------------------------------------------------------------------
%%% @author alexa
%%% @copyright (C) 2014, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 18. márc. 2014 11:16
%%% Example: exapmle_terminal.erl
%%%
%%%
%%%
%%%-------------------------------------------------------------------
-module(main).
-author("alexa").

%% API
%%-export([]).
-compile(export_all).

run1(NumOfPids) ->
    %%compile:file(asszoc.erl),
    make_calculator(NumOfPids, asszoc).

%% @doc Teszt futtatása a fork-nak
%% @spec (NumOfPids::integer()) -> List
run2(NumOfPids) ->
    compile:file('fork'),
    make_calculator(NumOfPids, fork).

%% @doc meghívja a létrehozót és a fogadót
%% @spec (NumOfPids::integer(), Func::List) -> List
make_calculator(NumOfPids, CalcModule) ->
  {PidList, EndPid } = make_pids(CalcModule, NumOfPids, NumOfPids-1, []),
  io:format("The process started: ~p (End: ~p)\n",[PidList, EndPid]),
  apply(CalcModule, sender, [senderstart,PidList, NumOfPids]),
  Result = apply(CalcModule, receiver, [recivestart, PidList, EndPid]),
  io:format("The result: ~p \n", [Result]).
%%del_pids(PidList).

%% @doc Létrehozza a processzeket
%% egy adott
make_pids(CalcModule, N, 0, PidList) ->
  NewPid = spawn(CalcModule, worker_main, [self(), N, 8000]),
  {PidList ++ [NewPid], NewPid};
make_pids(Func, N, X, PidList) ->
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
