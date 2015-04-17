%%erl
%%c(simpleServer)
%%simpleServer:start(8082).
%%http://192.168.1.103:8086/prepare_page.html
%%http://192.168.1.103:8086/API
%%http://localhost:8086/prepare_page.html
%%http://localhost:8086/API

-module(simpleServer).
-export([start/2, sendExample/0, getTheSameResult/1]).


%% ------------------------------------------- Simple Server
%%http://stackoverflow.com/questions/2206933/how-to-write-a-simple-webserver-in-erlang
start(Port, WatcherNode) ->
    spawn(fun () -> {ok, Sock} = gen_tcp:listen(Port, [{active, false}]), 
                    loop(Sock, WatcherNode) end).

loop(Sock, WatcherNode) ->
    {ok, Conn} = gen_tcp:accept(Sock),
    Handler = spawn(fun () -> handle(Conn, WatcherNode) end),
    gen_tcp:controlling_process(Conn, Handler),
    loop(Sock, WatcherNode).

handle(Conn, WatcherNode) ->
    {ok, Result} = do_recv(Conn, []),
    gen_tcp:send(Conn, response(Result, WatcherNode)),
    gen_tcp:close(Conn).

response(Str, WatcherNode) ->
    ResponseStruct = erlang:decode_packet(http_bin, Str, []),
    ResponseParams = getDecodeData(ResponseStruct),
    RespData = convertData(ResponseParams),
    Result = callMain(RespData, WatcherNode),
    B = convertToSend(Result),
    iolist_to_binary(
      io_lib:fwrite(
         "HTTP/1.0 200 OK\nContent-Type: application/json\nContent-Length: ~p\n\n~s",
         [size(B), B])).



%% ------------------------------------------- TCP server
%%http://erlang.org/doc/man/gen_tcp.html

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

callMain(RespJson, WatcherNode) -> 
    case RespJson of
        error -> {error, "Invalid Response"};
        _ -> apply(main, callDistributedCaluclate, [RespJson, WatcherNode])
    end.

convertToSend(Object) ->
    MochiStruct = 
        case Object of 
            {error, Str} -> {struct, [{"success", "false"}, {"msg", Str}]};
            _ -> apply(struct_handler, convertToMochi, [Object])
        end,
    JSON = apply(mochijson, encode, [MochiStruct]),
    Binary = iolist_to_binary(JSON),
    Binary.


%% ------------------------------------------- Simple Examples
%% iolist_to_binary([123,"\"1\"",58,[91,"1",44,"2",44,"3",93],125]).
%% binary_to_list(<<"{\"1\":[1,2,3]}">>).
%% mochijson:encode({struct,[{1, {array, [1,2,3]}}]}).

sendExample() -> 
    ResultExample = {struct,[{1, {array, [1,2,3]}}]},
    convertToSend(ResultExample).

getTheSameResult(ResponseParams) -> 
    RespJson = 
        case string:span(ResponseParams,"/?") > 1 of
            true -> string:substr(http_uri:decode(ResponseParams), 3);
            _ -> "{}"
        end,
        io:format("response: ~p \n", [RespJson]),
    iolist_to_binary(RespJson).
