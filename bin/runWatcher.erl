erl -sname interpMainComputer1
c(pidWatch).
pidWatch:startPidWatch().

pid(0,39,0) ! {get_pids, self()}.
pid(0,62,0) ! {stop, self()}.

erl -sname interpWorker1
c(pidWatch).
pidWatch:registerToServer(interpMainComputer1@lexymint).


pidWatch:start(interpMainComputer1@lexymint).