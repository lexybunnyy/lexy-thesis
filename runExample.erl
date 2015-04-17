g++ -std=c++11 -o calculator.so -fpic -shared ./../Calculator/erlang.cpp ./../Calculator/logTest.cpp ./../Calculator/calculator.cpp

erl -sname interpMainComputer -s toolbar
c('../connectionServer/simpleServer').
c(calculator).
c(fork).
c(struct_handler).
c(node_handler).
c(distributedTest).
c(test).
c(main).
main:initPort().
node_handler:getNodelist(pid(0,143,0)).
test:simulateDistributedCalculate(pid(0,143,0)).

erl -sname interpWorker1
c(distributedTest).
distributedTest:registerToServer(interpMainComputer@lexymint).


erl -s toolbar
c(simpleServer).
simpleServer:start(8082).
http://192.168.1.103:8086/prepare_page.html
http://192.168.1.103:8086/API
http://localhost:8086/prepare_page.html
http://localhost:8086/API

node_handler:getNodelist(pid(0,143,0)).
test:simulateDistributedCalculate(pid(0,143,0)).

erl -sname interpMainComputer1
c(distributedTest).
distributedTest:startPidWatch().

pid(0,39,0) ! {get_pids, self()}.
pid(0,62,0) ! {stop, self()}.




distributedTest:start(interpMainComputer1@lexymint).