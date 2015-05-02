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

init() ->
	file:delete('calculator.beam'),
	file:delete('test.beam'),
	compile:file('calculator'),
	compile:file('fork'),
	compile:file('struct_handler'),
	compile:file('source/mochijson'),
	compile:file('node_handler'),
	compile:file('test'),
	compile:file('../connectionServer/simpleServer'),
	apply(test, run, [ok]).

initPort() -> 
	WatcherNode = apply(distributedTest, startPidWatch, []),
	io:format("WatcherNode " ++ ": ~p \n", [WatcherNode]),
	SimpleServer = apply(simpleServer, start, [8082, WatcherNode]),
	{WatcherNode, SimpleServer}.

callDistributedCaluclate(Data, WatcherNode) -> 
	DataSet = apply(struct_handler, getDataSet, [Data]),
	DataLength = length(DataSet),
	apply(node_handler, distributedFork, [DataLength, DataSet, WatcherNode]).

callDistributedCaluclatep2(Data, WatcherNode) -> 
	DataSet = apply(struct_handler, getDataSet, [Data]),
	DataLength = length(DataSet),
	try apply(node_handler, distributedFork, [DataLength, DataSet, WatcherNode]) of 
		SuccessPattern -> SuccessPattern
	catch 
		error:Msg -> 
			{error, Msg}
	end.