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
sender(senderstart, [], _N) ->
  error;
sender(senderstart,[One], _N) ->
  One ! {forkdata,1,1};
sender(senderstart, PidList, N) ->
  sender(PidList ,N, N-1);
sender([H] ,N, X) ->
  H ! {forkdata, N-X , N-X};
sender([H|T] ,N, X) ->
  H ! {forkdata, N-X, N-X},
  sender(T, N, X-1).

receiver(recivestart,PidList, _EndPid) ->
  receiver(PidList, []).
receiver([HeadPidList], ResultList) ->
  receive
    {HeadPidList, forkresult, Number, Result} ->
      ResultList++[{Number,Result}]
  after
    10000 ->
      [ResultList, afterEnded]
  end;
receiver([HeadPidList|TailPidList], ResultList) ->
  receive
    {HeadPidList, forkresult, Number, Result} ->
      receiver(TailPidList, ResultList++[{Number,Result}])
  after
    10000 ->
      [ResultList, afterEnded]
  end.

%%-----------------------------------------------------worker processes
worker_main(Ppid, Number, Timeout) ->
  Ppid ! {self(), workerstart, Number},
  receive
    {forkdata, Number, Data} ->
      Result = calculate(Data),
      Ppid ! {self(), forkresult,Number, Result};
    {forkdata, OtherNumber, Data} ->
      Ppid ! {self(), error, Number ,OtherNumber, Data};
    {theEnd, Number} ->
      Ppid ! {self(), theEnd, Number};
    _Msg ->
      Ppid ! {self(), _Msg},
      worker_main(Ppid, Number, Timeout)
  after
    Timeout -> Ppid ! {self(), theEnd, Number}
  end.


receiveData(RecPid) ->
  receive
    {Pid , RecData} when Pid == RecPid ->
      RecData
  end.

calculate(Data) ->
  Data + 1.
