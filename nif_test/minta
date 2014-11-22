oem@lexy-mint:[nif_test](master) $ 
$ history|grep gcc
  828  gcc -fPIC -shared -o niftest.so niftest.c -I $ERL_ROOT/usr/include/
  829  gcc $ERL_ROOT/usr/include/ -fPIC -shared -o niftest.so niftest.c -I
  830  gcc -I $ERL_ROOT/usr/include/ -fPIC -shared -o niftest.so niftest.c
  844  gcc -fPIC -shared -o niftest.so niftest.c -I $ERL_ROOT/usr/include/
  852  gcc erl_nif.c 
  862  gcc -fPIC -shared -o niftest.so niftest.c -I $ERL_ROOT/usr/include/
  879  history|grep gcc
  880  gcc -fPIC -shared -o niftest.so niftest.c -I $ERL_ROOT/usr/include/
  882  gcc -fPIC -shared -o niftest.so niftest.c -I $ERL_ROOT/usr/include/
  883  gcc -o complex6_nif.so -fpic -shared complex.c complex6_nif.c
  887  gcc -o complex6_nif.so -fpic -shared complex.c complex6_nif.c
  889  history|grep gcc


oem@lexy-mint:[nif_test](master) $ 
$ gcc -fPIC -shared -o niftest.so niftest.c -I $ERL_ROOT/usr/include/
oem@lexy-mint:[nif_test](master) $ 
$ erl
Erlang R16B03 (erts-5.10.4) [source] [64-bit] [smp:2:2] [async-threads:10] [kernel-poll:false]

Eshell V5.10.4  (abort with ^G)
1>  c(niftest).
{ok,niftest}
2> niftest:init().
ok
3> niftest:hello().
"Hello world!"
4> 




oem@lexy-mint:[nif_test](master) $ 
$ gcc -o complex6_nif.so -fpic -shared complex.c complex6_nif.c
oem@lexy-mint:[nif_test](master) $ 
$ erl
Erlang R16B03 (erts-5.10.4) [source] [64-bit] [smp:2:2] [async-threads:10] [kernel-poll:false]

Eshell V5.10.4  (abort with ^G)
1> c(complex6).
{ok,complex6}
2> complex6:foo(3).
4
3> complex6:foo(5).
6
4>  complex6:foo("not an integer").
** exception error: bad argument
     in function  complex6:foo/1
        called as complex6:foo("not an integer")
5>         

