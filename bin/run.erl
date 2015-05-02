-module(run).
-author("alexa").
-compile(export_all).

init() ->
	compile(),
	load().

load() ->
    code:load_file('test'),
    code:load_file('calculator'),
    code:load_file('fork'),
    code:load_file('struct_handler'),
    code:load_file('mochijson'),
    code:load_file('node_handler'),
    code:load_file('simpleServer'),
    code:load_file('pidWatch'),
    code:load_file('main'),
    ok.

compile() -> 
    compile:file('../distributedSystem/calculator'),
    compile:file('../distributedSystem/fork'),
    compile:file('../distributedSystem/struct_handler'),
    compile:file('../distributedSystem/source/mochijson'),
    compile:file('../distributedSystem/node_handler'),
    compile:file('../distributedSystem/test'),
    compile:file('../connectionServer/simpleServer'),
    compile:file('../distributedSystem/pidWatch'),
    compile:file('../distributedSystem/main'),
    ok.