%%%-------------------------------------------------------------------
%%% @author alexa
%%% @copyright (C) 2014, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 20. márc. 2014 9:00
%%%-------------------------------------------------------------------
-module(test1).
-author("alexa").

%% API
-compile(export_all).

go() ->
  Pid2 = spawn(test1, loop, [self()]),
  Pid2 ! {self(), hello},
  RecData =
    fun() ->
      receive
        {Pid , RecData} when Pid == RecPid ->
          RecData
      end
    end,
  receive
    {Pid2, Msg} ->
      io:format("~p received: ~p : ~w~n",[self(),Pid2,Msg])
  end,
  receive
    {Pid2} ->
      io:format("~p received: ~p~n",[self(),Pid2])
  end,
  io:format("~p received: ~p : ~w~n",[self(),Pid2,Msg]),
  Pid2 ! stop.

loop(PPid) ->
  receive
    {PPid, Msg} ->
      PPid ! {self()},
      PPid ! {self()},
      PPid ! {self(), Msg},
      PPid ! {self()},
      loop(PPid);
    stop ->
          true
  end.