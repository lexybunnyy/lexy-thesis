-module(run).
-author("alexa").
-compile(export_all).

init() ->
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
    ResultCheck = test:runCheck(),
    Distributed = test:simulateDistributedCalculate(),
    case test:trueList(ResultCheck ++ Distributed) of 
        true -> ok;
        _ -> ResultCheck ++ Distributed
    end.

load() ->
    code:load_file('test'),
    code:load_file('calculator'),
    code:load_file('fork'),
    code:load_file('struct_handler'),
    code:load_file('mochijson'),
    code:load_file('node_handler'),
    code:load_file('simpleServer'),
    code:load_file('distributedTest'),
    code:load_file('main'),
    ok.

compile() -> 
    compile:file('../distributedSystem/source/mochijson'),
    compile:file('../distributedSystem/calculator'),
    compile:file('../distributedSystem/fork'),
    compile:file('../distributedSystem/struct_handler'),
    compile:file('../distributedSystem/node_handler'),
    compile:file('../distributedSystem/test'),
    compile:file('../connectionServer/simpleServer'),
    compile:file('../distributedSystem/distributedTest'),
    compile:file('../distributedSystem/main'),
    ok.