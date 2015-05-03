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
distributedFork(NumOfPids, DataList) -> 
  NodeList = [node()],
  distributedForkHelper(NumOfPids, DataList, NodeList).
distributedFork(NumOfPids, DataList, WatcherNode) -> 
  NodeList = getNodelist(WatcherNode) ++ [node()],
  distributedForkHelper(NumOfPids, DataList, NodeList).
distributedForkHelper(NumOfPids, DataList, NodeList) ->
  {PidList, EndPid} = makeForkPids(NumOfPids, NodeList),
  apply(fork, senderArray, [senderstart, PidList, NumOfPids, DataList]),
  apply(fork, receiver, [recivestart, PidList, EndPid]).

getNodelist(WatcherNode) -> 
  WatcherNode ! {get_pids, self()},
  receive
    {pidlist, WatcherNode, Result} -> 
        io:format("Node List: ~p \n",[Result]),
        Result;
    _other -> 
        io:format("I received : ~p \n",[_other]),
        getNodelist(WatcherNode)
  end.

nodeCall(NumOfPids, LogicModule, DataList) -> 
  {PidList, EndPid} = make_pids(LogicModule, NumOfPids),
  apply(LogicModule, senderArray, [senderstart, PidList, NumOfPids, DataList]),
  apply(LogicModule, receiver, [recivestart, PidList, EndPid]).

%% @doc Létrehozza a Számításhoz szükséges Új Node-okat.
makeForkPids(N, NodeList) -> 
  makeForkPids(N, N-1, NodeList, NodeList, []).

makeForkPids(N, 0, [HNode|_TailNodeList], _NodeList, PidList) ->
  NewPid = spawn(HNode, fork, worker_main, [self(), N, 8000]),
  {PidList ++ [NewPid], NewPid};

makeForkPids(N, X, [HNode], NodeList, PidList) ->
  NewPid = spawn(HNode, fork, worker_main, [self(), N-X, 8000]),
  makeForkPids(N, X-1, NodeList, NodeList, PidList ++ [NewPid]);
makeForkPids(N, X, [HNode|TailNodeList], NodeList, PidList) ->
  NewPid = spawn(HNode, fork, worker_main, [self(), N-X, 8000]),
  makeForkPids(N, X-1, TailNodeList, NodeList, PidList ++ [NewPid]).

%% @doc Eredeti létrehozója a Pideknek
make_pids(LogicModule, N) -> make_pids(LogicModule, N, N-1, []).
make_pids(LogicModule, N, 0, PidList) ->
  NewPid = spawn(LogicModule, worker_main, [self(), N, 8000]),
  {PidList ++ [NewPid], NewPid};
make_pids(Func, N, X, PidList) ->
  NewPid = spawn(Func, worker_main, [self(), N-X, 8000]),
  make_pids(Func, N, X-1, PidList ++ [NewPid]).


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
