%%%-------------------------------------------------------------------
%%%-------------------------------------------------------------------
%%% @author alexa
%%% @copyright (C) 2014, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 18. márc. 2014 11:16
%% g++ -std=c++11 -o calculator.so -fpic -shared ./../Calculator/erlang.cpp ./../Calculator/logTest.cpp ./../Calculator/calculator.cpp 
%%% escript: http://www.erlang.org/doc/man/escript.html
%%% erl
%%% c(main).
%%% calculator:calculate([0,1], [[0],[1]]).
%%%-------------------------------------------------------------------
-module(main).
-author("alexa").

%% API
%%-export([]).
-compile(export_all).

initPort() -> 
	WatcherNode = apply(nodeWatcher, startPidWatch, []),
	io:format("WatcherNode " ++ ": ~p \n", [WatcherNode]),
	SimpleServer = apply(httpServer, start, [8082, WatcherNode]),
	{WatcherNode, SimpleServer}.

callDistributedCaluclate(Data) -> 
	DataSet = apply(structHandler, getDataSet, [Data]),
	DataLength = length(DataSet),
	apply(nodeHandler, distributedFork, [DataLength, DataSet]).

callDistributedCaluclate(Data, WatcherNode) -> 
	DataSet = apply(structHandler, getDataSet, [Data]),
	DataLength = length(DataSet),
	apply(nodeHandler, distributedFork, [DataLength, DataSet, WatcherNode]).

callDistributedCaluclate2(Data, WatcherNode) -> 
	DataSet = apply(structHandler, getDataSet, [Data]),
	DataLength = length(DataSet),
	try apply(nodeHandler, distributedFork, [DataLength, DataSet, WatcherNode]) of 
		SuccessPattern -> SuccessPattern
	catch 
		error:Msg -> 
			{error, Msg}
	end.