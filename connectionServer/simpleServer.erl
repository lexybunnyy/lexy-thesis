%%erl
%%c(simpleServer)
%%simpleServer:start(8082).
%%http://192.168.1.103:8086/prepare_page.html
%%http://192.168.1.103:8086/API
%%http://localhost:8086/prepare_page.html
%%http://localhost:8086/API

-module(simpleServer).
-export([start/1, sendExample/0]).


%% ------------------------------------------- Simple Server
%%http://stackoverflow.com/questions/2206933/how-to-write-a-simple-webserver-in-erlang
start(Port) ->
    spawn(fun () -> {ok, Sock} = gen_tcp:listen(Port, [{active, false}]), 
                    loop(Sock) end).

loop(Sock) ->
    {ok, Conn} = gen_tcp:accept(Sock),
    Handler = spawn(fun () -> handle(Conn) end),
    gen_tcp:controlling_process(Conn, Handler),
    loop(Sock).

handle(Conn) ->
    {ok, Result} = do_recv(Conn, []),
    gen_tcp:send(Conn, response(Result)),
    gen_tcp:close(Conn).

response(Str) ->
    ResponseStruct = erlang:decode_packet(http_bin, Str, []),
    ResponseParams = getDecodeData(ResponseStruct),
    RespData = convertData(ResponseParams),
        io:format("response: ~p \n", [RespData]),
    Result = callMain(RespData),
        io:format("result: ~p \n", [Result]),
    B = convetToSend(RespData),
    %%B = convetToSend(RespData),
    %%B = sendExample(),
    %%B = getTheSameResult(ResponseParams),
    iolist_to_binary(
      io_lib:fwrite(
         "HTTP/1.0 200 OK\nContent-Type: application/json\nContent-Length: ~p\n\n~s",
         [size(B), B])).



%% ------------------------------------------- TCP server
%%http://erlang.org/doc/man/gen_tcp.html
client() ->
    SomeHostInNet = "localhost", % to make it runnable on one machine
    {ok, Sock} = gen_tcp:connect(SomeHostInNet, 5678, 
                                 [binary, {packet, 0}]),
    ok = gen_tcp:send(Sock, "Some Data"),
    ok = gen_tcp:close(Sock).

server() ->
    {ok, LSock} = gen_tcp:listen(5678, [binary, {packet, 0}, 
                                        {active, false}]),
    {ok, Sock} = gen_tcp:accept(LSock),
    {ok, Bin} = do_recv(Sock, []),
    ok = gen_tcp:close(Sock),
    Bin.

do_recv(Sock, Bs) ->
    case gen_tcp:recv(Sock, 0) of
        {ok, B} ->
            {ok, list_to_binary(B)};
        {error, closed} ->
            {ok, list_to_binary(Bs)}
    end.



%% ------------------------------------------- Response Helpers 
getDecodeData({ok, {http_request,'GET', {abs_path, Result }, _Length} , _Rest}) -> binary_to_list(Result);
getDecodeData(_) -> error.

convertData(ResponseParams) ->
  case string:span(ResponseParams,"/?") > 1 of
    true -> 
        JSONStr = string:substr(http_uri:decode(ResponseParams), 3),
        apply(mochijson, decode, [JSONStr]);
    _ -> error
  end.

callMain(RespJson) -> 
    case RespJson of
        error -> "{\"success\": \"false\", \"error:\": \"Invalid Things\"}";
        _ -> apply(main, callDistributedCaluclate, [RespJson])
    end.

convetToSend(Object) -> 
    JSON = apply(mochijson, encode, [Object]),
    iolist_to_binary(JSON).


%% ------------------------------------------- Simple Examples
%% iolist_to_binary([123,"\"1\"",58,[91,"1",44,"2",44,"3",93],125]).
%% binary_to_list(<<"{\"1\":[1,2,3]}">>).
%% mochijson:encode({struct,[{1, {array, [1,2,3]}}]}).

sendExample() -> 
    ResultExample = {struct,[{1, {array, [1,2,3]}}]},
    convetToSend(ResultExample).

getTheSameResult(ResponseParams) -> 
    RespJson = 
        case string:span(ResponseParams,"/?") > 1 of
            true -> string:substr(http_uri:decode(ResponseParams), 3);
            _ -> "{}"
        end,
        io:format("response: ~p \n", [RespJson]),
    iolist_to_binary(RespJson).
