-module(run).
-author("alexa").
-compile(export_all).


initNode(Server) -> 
    nodeWatcher:registerToServer(Server).

initServer() ->
    {WatcherNode, SimpleServer} = main:initPort(),
    Test = test(WatcherNode),
    case Test of 
        ok -> {WatcherNode, SimpleServer};
        _ -> {error, Test, WatcherNode, SimpleServer}
    end.

test(WatcherNode) -> 
    ResultCheck = test:runCheck(),
    Distributed = test:simulateDistributedCalculate(WatcherNode),
    case test:trueList(ResultCheck ++ Distributed) of 
        true -> ok;
        _ -> ResultCheck ++ Distributed
    end.

test() -> 
    io:format("test started\n"),
    io:format("\nrunCheck\n"),
    ResultCheck = test:runCheck(),
    io:format("\n--simulateDistributedCalculate start\n"),
    Distributed = test:simulateDistributedCalculate(),
    io:format("\n--simulateDistributedCalculate end\n"),
    Result = case test:trueList(ResultCheck ++ Distributed) of 
        true -> ok;
        _ -> ResultCheck ++ Distributed
    end,
    %%throw(Result),
    Result.

load() ->
    code:load_file('test'),
    code:load_file('calculator'),
    code:load_file('fork'),
    code:load_file('structHandler'),
    code:load_file('mochijson'),
    code:load_file('mochinum'),
    code:load_file('nodeHandler'),
    code:load_file('httpServer'),
    code:load_file('nodeWatcher'),
    code:load_file('main'),
    ok.

compile() -> 
    compile:file('../Utility/source/mochiweb/src/mochijson'),
    compile:file('../Utility/source/mochiweb/src/mochinum'),
    compile:file('../Utility/structHandler'),
    compile:file('../Calculator/calculator'),
    compile:file('../DistributedSystem/fork'),
    compile:file('../DistributedSystem/nodeHandler'),
    compile:file('../ServerConfig/httpServer'),
    compile:file('../ServerConfig/nodeWatcher'),
    compile:file('../ServerConfig/main'),
    compile:file('../ServerConfig/test'),
    ok.

deleteCompiledFiles() ->
    file:delete('test.beam'),
    file:delete('calculator.beam'),
    file:delete('fork.beam'),
    file:delete('structHandler.beam'),
    file:delete('mochijson.beam'),
    file:delete('nodeHandler.beam'),
    file:delete('httpServer.beam'),
    file:delete('nodeWatcher.beam'),
    file:delete('main.beam'),
    ok.