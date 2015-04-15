erl -sname interpMainComputer1
c(distributedTest).
distributedTest:startPidWatch().

pid(0,39,0) ! {get_pids, self()}.
pid(0,62,0) ! {stop, self()}.

erl -sname interpWorker1
c(distributedTest).
distributedTest:registerToServer(interpMainComputer1@lexymint).


distributedTest:start(interpMainComputer1@lexymint).