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
	Params = getParamsByData(Data),
	apply(nodeHandler, distributedFork, Params).

callDistributedCaluclate(Data, WatcherNode) -> 
	Params = getParamsByData(Data, WatcherNode),
	apply(nodeHandler, distributedFork, Params).

callDistributedCaluclate2(Data, WatcherNode) -> 
	Params = getParamsByData(Data, WatcherNode),
	try apply(nodeHandler, distributedFork, Params) of 
		SuccessPattern -> SuccessPattern
	catch 
		error:Msg -> 
			{error, Msg}
	end.

getParamsByData(Data) -> 
	DataSet = apply(structHandler, getDataSet, [Data]),
	DataLength = length(DataSet),
	[DataLength, DataSet].
getParamsByData(Data, WatcherNode) -> 
	{MaxNodeNumber, _e} = 
		string:to_integer(structHandler:getElementByKeyList(["nodenumber"], Data)),
	DataSet = apply(structHandler, getDataSet, [Data]),
	DataLength = length(DataSet),
	[DataLength, DataSet, WatcherNode, MaxNodeNumber].