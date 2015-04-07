%%%-------------------------------------------------------------------
%%%-------------------------------------------------------------------
%%% @author alexa
%%% @copyright (C) 2014, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 18. márc. 2014 11:16
%%% Example: exapmle_terminal.erl
%%%
%%%-------------------------------------------------------------------
-module(node_handler).
-author("alexa").

%% API
%%-export([]).
-compile(export_all).

%% @doc Létrehozza a Számításhoz szükséges Node Struktúrát.
%% LogicModule-ban szereplő senderstart, recivestart, worker_main 
%% függvények létrejönnek, és számolnak
%% @spec (NumOfPids::integer(), LogicModule::atom(), DataList::List) -> List
nodeCall(NumOfPids, LogicModule, DataList) ->
  {PidList, EndPid} = make_pids(LogicModule, NumOfPids),
  apply(LogicModule, senderArray, [senderstart, PidList, NumOfPids, DataList]),
  apply(LogicModule, receiver, [recivestart, PidList, EndPid]).

%% @doc Létrehozza a Számításhoz szükséges Új Node-okat.
make_pids(LogicModule, N) -> make_pids(LogicModule, N, N-1, []).
make_pids(LogicModule, N, 0, PidList) ->
  NewPid = spawn(LogicModule, worker_main, [self(), N, 8000]),
  {PidList ++ [NewPid], NewPid};
make_pids(Func, N, X, PidList) ->
  NewPid = spawn(Func, worker_main, [self(), N-X, 8000]),
  make_pids(Func,N,X-1, PidList ++ [NewPid]).


%% ------------------------------------- minta függvények, tesztekhez
makeNodeStructure(NumOfPids, LogicModule) ->
	{PidList, EndPid} = make_pids(LogicModule, NumOfPids),
	io:format("The process started: ~p (End: ~p)\n",[PidList, EndPid]),

	apply(LogicModule, senderArray, [senderstart, PidList, NumOfPids]),
	Result = apply(LogicModule, receiver, [recivestart, PidList, EndPid]),

	io:format("The result: ~p \n", [Result]).
	%%del_pids(PidList).
makeNodeStructure(NumOfPids, LogicModule, DataList) ->
	{PidList, EndPid} = make_pids(LogicModule, NumOfPids),
	io:format("The process started: ~p (End: ~p)\n",[PidList, EndPid]),

	apply(LogicModule, senderArray, [senderstart, PidList, NumOfPids, DataList]),
	Result = apply(LogicModule, receiver, [recivestart, PidList, EndPid]),

	io:format("The result: ~p \n", [Result]).

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
