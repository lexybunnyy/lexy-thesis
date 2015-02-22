/* erlang.cpp: 
use: 
g++ -o ./../distributedSystem/calculator.so -fpic -shared test.cpp erlang.cpp

$ g++ -std=c++11 -o calculator.so -fpic -shared ./../Calculator/erlang.cpp ./../Calculator/logTest.cpp ./../Calculator/calculator.cpp 
c(calculator).
calculator:calculate([0,1], [[0],[1]]).
http://www.erlang.org/doc/man/erl_nif.html 
*/
#include <iostream>
#include <stdio.h>
#include <vector>
#include "erl_nif.h"
#include "calculator.h"
#include "logTest.h"

using namespace std;

static int convertVector(ErlNifEnv* env, ERL_NIF_TERM arg, vector<double> &result);
static int convertMatrix(ErlNifEnv* env, ERL_NIF_TERM argY, vector<vector<double> > &matrix);
static ERL_NIF_TERM convertList(ErlNifEnv* env, vector<double> array);

/** Ennek a függvénynek a segítségével valósul meg a kettő közötti kommunikáció */
static ERL_NIF_TERM calculate_nif(ErlNifEnv* env, int argc, const ERL_NIF_TERM argv[]) {
    int ret;
    int succ;
    vector<double> poli;
    vector<double> X;
    vector<vector<double> > Y;
    succ = convertVector(env, argv[0], X);
    if (!succ) {
        return enif_make_badarg(env);
    }
    succ = convertMatrix(env, argv[1], Y);
    logResult(X, Y);
    poli = interpolateMain(X, Y, "newton");
    return convertList(env, poli);
}

/** Felsorolja milyen függvényeket importálaunk az Erlangba */
static ErlNifFunc nif_funcs[] = {
    {"calculate", 4, calculate_nif}
};

/** Erlang Listává konvertálás egy C++ Vector típusból*/
static ERL_NIF_TERM convertList(ErlNifEnv* env, vector<double> array) {
    int N = array.size();
    ERL_NIF_TERM conv[N];
    for (int j = 0; j < N; j++) {
       conv[j] = enif_make_double(env, array[j]);
    };

    return enif_make_list_from_array(env, conv, N);
}

/** Erlang Lista típisuának Vectorrá konvertálása*/
static int convertVector(ErlNifEnv* env, ERL_NIF_TERM arg, vector<double> &result) {
    ERL_NIF_TERM head;
    ERL_NIF_TERM tail = arg;
    double x;
    int xInt;
    vector<vector<double> > matrix;
    int size = 0;
    while(enif_get_list_cell(env, tail, &head, &tail)) {
        if (!enif_get_int(env, head, &xInt)) {
            if (!enif_get_double(env, head, &x)) {
               return 0;
            }
        } else {
            x = (double) xInt;
        }
        ++size;
        result.resize(size);
        result[size-1] = x;
    }
    return 1;
}

/** Lista Lista konvertálása Vector Vectorrá */
static int convertMatrix(ErlNifEnv* env, ERL_NIF_TERM argY, vector<vector<double> > &matrix) {
    ERL_NIF_TERM head;
    ERL_NIF_TERM tail = argY;
    vector<double> line;
    int check;
    int i = 0;
    while(enif_get_list_cell(env, tail, &head, &tail)) {
        check = convertVector(env, head, line);
        if (!check) {
            return 0;
        }
        matrix.push_back(line);
        ++i;
    }
    return 1;
}


ERL_NIF_INIT(calculator, nif_funcs, NULL, NULL, NULL, NULL)
