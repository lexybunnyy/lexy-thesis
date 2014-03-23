%%%-------------------------------------------------------------------
%%% @author alexa
%%% @copyright (C) 2014, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 18. márc. 2014 11:16
%%%-------------------------------------------------------------------
-module(fork).
-author("alexa").

%% API
%%-export([]).
-compile(export_all).

%%-----------------------------------------------------boss process
sender([One], _N) ->
  One ! {null,null,0};
sender(PidList, N) ->
  sender(list_to_tuple(PidList) ,N, 1).
sender(PidTuple ,N, X) ->
  if
    X == 1 ->
      io:format("Send to process ~p : ~p\n",[ element(X,PidTuple), {null, element(X+1,PidTuple), X} ]),
      element(X,PidTuple) ! {null, element(X+1,PidTuple), X},
      sender(PidTuple ,N, X+1);
    X < N ->
      io:format("Send to process ~p : ~p\n",[element(X,PidTuple), {element(X-1,PidTuple), element(X+1,PidTuple), X}]),
      element(X,PidTuple) ! {element(X-1,PidTuple), element(X+1,PidTuple), X},
      sender(PidTuple ,N, X+1);
    X == N ->
      io:format("Send to process ~p : ~p \n",[element(X,PidTuple), {element(X-1,PidTuple), null, X} ]),
      element(X,PidTuple) ! {element(X-1,PidTuple), null, X}
  end.

receiver(ResultList) ->
  receive
  %%{Pid, Number, Result} when Pid == EndPid->
  %%	io:format("The Result: ~p ", [{Pid, Number, Result}]),
  %%	erlang:append_element(resultList,{Pid, Number, Result}),
  %%	io:format("The End Result: ~p ", [resultList]);
  %%{Pid, Number, Result}  ->
  %%	io:format("The Result: ~p ", [{Pid, Number, Result}]),
  %%	receiver(erlang:append_element(resultList,{Pid, Number, Result}), EndPid);
    Msg ->
      io:format("I received: ~p \n", [Msg]),
      receiver(ResultList) %%test1
  after
    10000 -> ok
  end.

%%-----------------------------------------------------worker processes
worker_main(Ppid, X, Timeout) ->
  receive
    {null, SendPid, Data} ->
      Ppid ! {self(), X, Data};
    {RecPid, null, Data} ->
      Ppid ! {self(), X, Data};
    {RecPid, SendPid, Data} ->
      %%recData = receiveData(recPid),
      %%resultData = calculate(recData, Data),
      %%Ppid ! {self(),X, Data};
      %%sendPid ! {self(), resultData}
      Ppid ! {self(), X, Data};
    {Ppid,theEnd} ->
      Ppid ! {self(), X, theEnd};
    _Msg ->
      Ppid ! _Msg,
      worker_main(Ppid, X, Timeout)
  after
    Timeout -> Ppid ! {self(),X, theEnd}
  end.

receiveData(recPid) ->
  receive
    {Pid , recData} when Pid == recPid ->
      recData;
    _Msg ->
      receiveData(recPid)
  end.