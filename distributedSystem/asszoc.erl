%%%-------------------------------------------------------------------
%%% @author alexa
%%% @copyright (C) 2014, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 18. márc. 2014 11:16
%%%-------------------------------------------------------------------
-module(asszoc).
-author("alexa").

%% API
%%-export([]).
-compile(export_all).

%%-----------------------------------------------------boss process
sender([One], _N) ->
  One ! {null,null,1};
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

receiver(ResultList, EndPid) ->
  receive
    Msg ->
      io:format("I received: ~p \n", [Msg]),
      receiver(ResultList, EndPid);
    {Pid, Number, Result} when Pid == EndPid->
      EndResult = lists:append(ResultList, [{Pid, Number, Result}]),
      %%EndResult = erlang:append_element(ResultList,{Pid, Number, Result}),
      io:format("The result: ~p \n", [EndResult]),
      EndResult;
    {Pid, Number, Result}  ->
      CurrResult = lists:append(ResultList, [{Pid, Number, Result}]),
      %%CurrResult = erlang:append_element(ResultList,{Pid, Number, Result}),
      io:format("Current Result: ~p \n",[CurrResult]),
      receiver(CurrResult, EndPid)
  after
    10000 -> ResultList
  end.

%%-----------------------------------------------------worker processes
worker_main(Ppid, Number, Timeout) ->
  receive
    {null, null , Data} ->
      Ppid ! {self(), channel,null,null},
      Ppid ! {self(), result, Number, Data},
      Ppid ! {self(),Number, theEnd};
    {null, SendPid, Data} ->
      Ppid ! {self(), channel,null,SendPid},
      Ppid ! {self(), result, Number, Data},
      SendPid ! {self(), result, Number, Data},
      Ppid ! {self(),Number, theEnd};
    {RecPid, null, Data} ->
      Ppid ! {self(), channel,RecPid,null},
      receive
        {RecPid , RecData} ->
          Ppid ! {self(), recived , RecPid, RecData},
          ResultData = calculate(Data, RecData),
          Ppid ! {self(), result, Number, ResultData}
      after
        Timeout -> ok
      end,
      Ppid ! {self(),Number, theEnd};
    {RecPid, SendPid, Data} ->
      Ppid ! {self(), channel,RecPid,SendPid},
      receive
          {Pid , RecData} when Pid == RecPid ->
            Ppid ! {self(), recived ,RecPid, RecData},
            ResultData = calculate(Data, RecData),
            Ppid ! {self(), result, Number, ResultData},
            SendPid ! {self(), result, Number, ResultData}
      after
        Timeout -> ok
      end,
      Ppid ! {self(),Number, theEnd};
    {Ppid,theEnd} ->
      Ppid ! {self(), Number, theEnd};

    _Msg ->
      Ppid ! _Msg,
      worker_main(Ppid, Number, Timeout)
  after
    Timeout -> Ppid ! {self(),Number, theEnd}
  end.


receiveData(RecPid) ->
  receive
    {Pid , RecData} when Pid == RecPid ->
      RecData
  end.

calculate(Data, RecData) ->
    Data + RecData.
