erl -s toolbar
c(simpleServer).
simpleServer:start(8082).
http://192.168.1.103:8086/prepare_page.html
http://192.168.1.103:8086/API
http://localhost:8086/prepare_page.html
http://localhost:8086/API

g++ -std=c++11 -o calculator.so -fpic -shared ./../Calculator/erlang.cpp ./../Calculator/logTest.cpp ./../Calculator/calculator.cpp

erl -s toolbar
c(main).
c(fork).
c('../connectionServer/simpleServer'). 
c(struct_handler).
main:initPort().
