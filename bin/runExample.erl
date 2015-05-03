%% ----------------------------- bin
cd /home/oem/git/project/bin/
./setup.sh
erl 
c(run).
run:compile().
run:load().
run:test().
run:deleteCompiledFiles().

erl -s toolbar -sname interpMainComputer
c(run).
run:load().
run:initServer().

erl -s toolbar -sname interpCaluclator1
c(run).
run:load().
run:test().
run:initNode(interpMainComputer@lexymint).

%%----------------------------- old
g++ -std=c++11 -o calculator.so -fpic -shared ./../Calculator/erlang.cpp ./../Calculator/logTest.cpp ./../Calculator/calculator.cpp

erl -sname interpMainComputer1 -s toolbar
c('../ServerConfig/httpServer').
c(calculator).
c(fork).
c(structHandler).
c(nodeHandler).
c(pidWatch).
c(test).
c(main).
c('./source/mochijson').
main:initPort().
nodeHandler:getNodelist(pid(0,
test:simulateFirstParseAndRun().
test:simulateDistributedCalculate(pid(0,

erl -sname interpWorker1
c(pidWatch).
pidWatch:registerToServer(interpMainComputer@lexymint).


erl -s toolbar
c(httpServer).
httpServer:start(8082).
http://192.168.1.103:8086/prepare_page.html
http://192.168.1.103:8086/API
http://localhost:8086/prepare_page.html
http://localhost:8086/API

nodeHandler:getNodelist(pid(0,143,0)).
test:simulateDistributedCalculate(pid(0,143,0)).

erl -sname interpMainComputer1
c(pidWatch).
pidWatch:startPidWatch().

pid(0,39,0) ! {get_pids, self()}.
pid(0,62,0) ! {stop, self()}.

pidWatch:start(interpMainComputer1@lexymint).

erl -sname interpMainComputer
c(pidWatch).
pidWatch:startPidWatch().

pid(0,39,0) ! {get_pids, self()}.
pid(0,62,0) ! {stop, self()}.

erl -sname interpWorker1
c(pidWatch).
pidWatch:registerToServer(interpMainComputer1@lexymint).


pidWatch:start(interpMainComputer1@lexymint).