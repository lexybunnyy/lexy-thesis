%%%-------------------------------------------------------------------
%%% @author alexa
%%% @copyright (C) 2014, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 16. okt. 2014 16:38
%%%-------------------------------------------------------------------
-module(example_terminal).
-author("alexa").

oem@lexy-mint:[distributedSystem](master △ ) $
$ erl
Erlang R16B03 (erts-5.10.4) [source] [64-bit] [smp:2:2] [async-threads:10] [kernel-poll:false]

Eshell V5.10.4  (abort with ^G)
1> c(main).
{ok,main}
2> main:run2(2).
The process started: [<0.46.0>,<0.47.0>] (End: <0.47.0>)
The result: [{1,2},{2,4}]
ok
3>