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
senderArray(senderstart, [], _N) ->
  error;
senderArray(senderstart,[One], _N) ->
  One ! {forkdata,1,1};
senderArray(senderstart, PidList, N) ->
  senderArray(PidList ,N, N-1);
senderArray([H] ,N, X) ->
  H ! {forkdata, N-X , N-X};
senderArray([H|T] ,N, X) ->
  H ! {forkdata, N-X, N-X},
  senderArray(T, N, X-1).

senderArray(senderstart, PidList, N, DataList) ->
  senderArray(PidList ,N, N-1, DataList);
senderArray([PidHead] ,N, X, [DataHead]) ->
  PidHead ! {forkdata, N-X , DataHead};
senderArray([PidHead|PidTail] ,N, X, [DataHead|DataTail]) ->
  PidHead ! {forkdata, N-X, DataHead},
  senderArray(PidTail, N, X-1, DataTail).


receiver(recivestart,PidList, _EndPid) ->
  receiver(PidList, []).
receiver([HeadPidList], ResultList) ->
  receive
    {HeadPidList, forkresult, _Number, Result} ->
      ResultList ++ [Result]
  after
    1000000 ->
      [ResultList, afterEnded]
  end;
receiver([HeadPidList|TailPidList], ResultList) ->
  receive
    {HeadPidList, forkresult, _Number, Result} ->
      receiver(TailPidList, ResultList++[Result])
  after
    1000000 ->
      [ResultList, afterEnded]
  end.

%%-----------------------------------------------------worker processes
worker_main(Ppid, Number, Timeout) -> 
  worker_main(Ppid, Number, Timeout, fork, calculate).
worker_main(Ppid, Number, Timeout, Module, Function) ->
  Ppid ! {self(), workerstart, Number},
  receive
    {forkdata, Number, Data} ->
      Result = apply(Module, Function, [Data]),
      Ppid ! {self(), forkresult, Number, Result};
    {forkdata, OtherNumber, Data} ->
      Ppid ! {self(), error, Number, OtherNumber, Data};
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
  Id = apply(struct_handler, getId, [Data]),
  try apply(calculator, calculateByData, [Data]) of 
    Result -> {Id, Result}
  catch 
    _:_ -> {error, "failed"}
  end.
