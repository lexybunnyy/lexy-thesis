sender1(PidTuple ,_N, 1) ->
	io:format("Send to process ~p ~p\n",[element(1,PidTuple), {null, element(2,PidTuple), msg}]);
sender1(PidTuple ,_N, _N) ->
	io:format("Send to process ~p ~p\n",[element(1,PidTuple), {element(_N-1,PidTuple) ,null, msg}]);
sender1(PidTuple ,_N, X) ->
	io:format("The process: ~p \n",[element(X,PidTuple)]),
	sender1(PidTuple,_N, X-1).
