%%http://www.erlang.org/doc/getting_started/conc_prog.html
%%Distributed Test Function

-module(nodeWatcher).
-author("alexa").
-compile(export_all).

start(Ping_Node) ->
    register(pong, spawn(nodeWatcher, pong, [])),
    spawn(Ping_Node, nodeWatcher, ping, [3, node()]).

startPidWatch() ->
    PidWatch = spawn(nodeWatcher, pidWatch, [self(), []]),
    register(pid_watcher, PidWatch),
    PidWatch.

registerToServer(Pong_Node) ->
    spawn(nodeWatcher, registerToServerNode, [Pong_Node]).

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
        	Ping_PID ! {pidlist, self(), NodeList},
            pidWatch(Parent_Pid, NodeList)
    end.

registerToServerNode(Pong_Node) -> 
	{pid_watcher, Pong_Node} ! {worker_write, self(), node()},
    receive
        ok ->
            io:format("Worker Writed", []);
        _Other -> 
            io:format("Error ~p ", [_Other])
    end.