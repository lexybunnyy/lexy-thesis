%%http://www.erlang.org/doc/getting_started/conc_prog.html
%%Distributed Test Function

-module(distributedTest).
-author("alexa").
-compile(export_all).

start(Ping_Node) ->
    register(pong, spawn(distributedTest, pong, [])),
    spawn(Ping_Node, distributedTest, ping, [3, node()]).

startPidWatch() ->
    register(pid_watcher, spawn(distributedTest, pidWatch, [self(), []])).

registerToServer(Pong_Node) ->
    spawn(distributedTest, registerToServerNode, [Pong_Node]).

pidWatch(Parent_Pid, NodeList) ->
	io:format("Watcher Started ~p ~p ", [Parent_Pid, self()]),
    receive
        {stop, Parent_Pid} ->
            io:format("Pong finished~n", []);
        {worker_write, Ping_PID, Ping_NODE} ->
            io:format("Worker Writed ~p ~p", [Ping_PID, Ping_NODE]),
            Ping_PID ! ok,
            pidWatch(Parent_Pid, NodeList ++ [Ping_NODE]);
        {get_pids, Ping_PID} -> 
			io:format("Get Pids ~p", [NodeList]),
        	Ping_PID ! NodeList
    end.

registerToServerNode(Pong_Node) -> 
	{pid_watcher, Pong_Node} ! {worker_write, self(), node()},
    receive
        ok ->
            io:format("Worker Writed", [])
    end.