#!/bin/bash 
g++ -std=c++11 -o calculator.so -fpic -shared ./../Calculator/erlang.cpp ./../Calculator/logTest.cpp ./../Calculator/calculator.cpp
./setup.erl
