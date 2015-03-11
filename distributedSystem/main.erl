%%%-------------------------------------------------------------------
%%%-------------------------------------------------------------------
%%% @author alexa
%%% @copyright (C) 2014, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 18. márc. 2014 11:16
%% g++ -std=c++11 -o calculator.so -fpic -shared ./../Calculator/erlang.cpp ./../Calculator/logTest.cpp ./../Calculator/calculator.cpp 

%%% erl
%%% c(main).
%%% calculator:calculate([0,1], [[0],[1]]).
%%%-------------------------------------------------------------------
-module(main).
-author("alexa").
-export([init/0]).
-on_load(init/0).

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
	apply(test, run, [ok]).

callDistributedCaluclate(JsonSting) -> 
	Data = apply(struct_handler, getDataByJson, [JsonSting]),
	DataSet = apply(struct_handler, getDataSet, [Data]),
	DataLength = length(DataSet),
	apply(node_handler, nodeCall, [DataLength, fork, DataSet]).