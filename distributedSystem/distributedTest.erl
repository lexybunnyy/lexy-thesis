%%http://www.erlang.org/doc/getting_started/conc_prog.html
%%Distributed Test Function

-module(distributedTest).
-author("alexa").
-compile(export_all).
-export([start/1,  ping/2, pong/0]).

start(Ping_Node) ->
    register(pong, spawn(distributedTest, pong, [])),
    spawn(Ping_Node, distributedTest, ping, [3, node()]).

start_pong() ->
    register(pong, spawn(distributedTest, pong, [])).

start_ping(Pong_Node) ->
    spawn(distributedTest, ping, [3, Pong_Node]).

ping(0, Pong_Node) ->
    {pong, Pong_Node} ! finished,
    io:format("ping finished~n", []);

ping(N, Pong_Node) ->
    {pong, Pong_Node} ! {ping, self()},
    receive
        pong ->
            io:format("Ping received pong~n", [])
    end,
    ping(N - 1, Pong_Node).

pong() ->
    receive
        finished ->
            io:format("Pong finished~n", []);
        {ping, Ping_PID} ->
            io:format("Pong received ping~n", []),
            Ping_PID ! pong,
            pong()
    end.