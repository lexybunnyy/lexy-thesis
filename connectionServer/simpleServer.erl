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
    io:format("ResponseStruct: ~1000p \n", [ResponseStruct]),
    ResponseParams = getDecodeData(ResponseStruct),
    io:format("ResponseParams: ~1000p \n", [ResponseParams]),
    RespData = convertData(ResponseParams),
        io:format("response: ~p \n", [RespData]),
    Result = callMain(RespData),
        io:format("result: ~p \n", [Result]),
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
            io:format("gen_tcp:recv ~2000p halkldklsadklsakd \n", [string:len(B)]),
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
        error -> {error, "Invalid Response"};
        _ -> apply(main, callDistributedCaluclate, [RespJson])
    end.

convertToSend(Object) ->
    MochiStruct = 
        case Object of 
            {error, Str} -> {struct, [{"success", "false"}, {"msg", Str}]};
            _ -> apply(struct_handler, convertToMochi, [Object])
        end,
        io:format("Binary: ~p \n", [MochiStruct]),
    JSON = apply(mochijson, encode, [MochiStruct]),
    Binary = iolist_to_binary(JSON),
        io:format("Binary: ~p \n", [Binary]),
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
